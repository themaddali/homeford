define(['../app/Events', '../app/HashManager', '../app/Pager', '../app/UrlFragment', 'cookie'], function(EventDispatcher, hashManager, pager, urlFragment, cookie) {"use strict";

	var abortEvaluation = false;

	/**
	 * A Level tracks a path level in the hash location.
	 * For instance, "/a/b" has two levels.
	 */
	var Level = ( function() {

			function Level() {

				var dispatcher;
				// reference to Router dispatcher
				var root;
				// the route path for this level (e.g. '/a')
				var routes = [{}];
				// be defensive, start with an empty route so index is never 0
				var sequence = 0;
				// each time we reset, we bump the sequence, avoids async issues
				var lastMappedRoute = null;

				// evaluation state
				var evalContext = {
					sequence : 0, // sequence we started evaluating at
					location : null, // location we are evaluating
					index : 1, // index into routes that we are currently evaluating
					paused : false, // have we paused waiting for async completion?
					matched : false, // have we matched a map?, only look for watchers
					pauseIndex : 0, // the index we paused at
					newRoutes : false // did we add new routes while evaluating a route?
				};

				this.init = function(rootArg, dispatcherArg) {
					root = rootArg;
					dispatcher = dispatcherArg;
				};

				/**
				 * Reset the evaluation state to start afresh.
				 * The key is to advance the sequence and reset the index.
				 */
				function reset(location) {
					var i, route;

					// reset sub-levels
					for ( i = 0; i <= routes.length; i += 1) {
						route = routes[i];
						if (route && route.level) {
							route.level.reset(location);
						}
					}

					sequence += 1;
					evalContext = {
						sequence : sequence,
						location : location,
						index : 1,
						route : null,
						paused : false,
						matched : false,
						pauseIndex : 0,
						newRoutes : false
					};

				}

				/**
				 * Create a unique ID for the Pager to key off of.
				 */
				function pagerId(route) {
					return (root + '[' + ( route ? route.name : '?') + ']');
				}

				/**
				 * Evaluates any sub routes under the current route.
				 * Returns false if we reset the evaluation. Callers should
				 * check this to avoid continuing to process the evalContext they
				 * started with.
				 */
				function evaluateSubRoutes() {
					// if we have sub-routes, evaluate them
					if (evalContext.route.level) {
						if (evalContext.newRoutes) {
							reset(evalContext.location);
							evaluate();
							return false;
						} else {
							evalContext.route.level.evaluate();
						}
					}
					return true;
				}

				/**
				 * Unloads any sub routes and then unloads the last mapped route.
				 */
				function unloadCurrent(newRoute) {
					if (lastMappedRoute) {
						if (lastMappedRoute.level) {
							lastMappedRoute.level.unloadCurrent();
						}
						pager.unloadElement(lastMappedRoute.args.container, ( newRoute ? pagerId(newRoute) : null));
						lastMappedRoute = null;
					}
				}

				function resumeIfPaused() {
					// if we we're paused, continue evaluating
					if (evalContext.paused) {
						evalContext.paused = false;
						evaluate();
					}
				}

				/**
				 * A map route enter() has indicated that it didn't need to take any action.
				 */
				function noAction() {
					evalContext.matched = true;
					// unload any sub-routes
					if (evalContext.route.level) {
						evalContext.route.level.unloadCurrent();
					}
					if (evaluateSubRoutes()) {
						evalContext.index += 1;
						resumeIfPaused();
					}
				}

				/**
				 * A filter route check() has asked to proceed.
				 */
				function proceed() {
					if (evaluateSubRoutes()) {
						evalContext.index += 1;
						resumeIfPaused();
					}
				}

				/**
				 * A filter route check() or map route enter() has asked that we redirect elsewhere.
				 */
				function redirectTo(location) {
					evalContext.matched = true;
					evalContext.index += 1;
					// Don't reset if already there
					if (evalContext.location !== location) {
						hashManager.setHash(location);
					} else {
						if (evaluateSubRoutes()) {
							resumeIfPaused();
						}
					}
				}

				/**
				 * A filter route check() or map route enter() has asked that we replace
				 * the location with a better one.
				 * Used for /type -> /type/show -> /type/show/overview.
				 */
				function replaceWith(location) {
					evalContext.matched = true;
					evalContext.index += 1;
					// Don't reset if already there
					if (evalContext.location !== location) {
						hashManager.replaceHash(location);
					} else {
						if (evaluateSubRoutes()) {
							resumeIfPaused();
						}
					}
				}

				/**
				 * A map route enter() has asked to load an element.
				 */
				function load(page, view) {
					var route = evalContext.route;
					evalContext.matched = true;
					pager.loadElement(route.args.container, pagerId(route), page, view);
					lastMappedRoute = route;
					dispatcher.fire('locationChange', evalContext.location);
					if (evaluateSubRoutes()) {
						evalContext.index += 1;
						resumeIfPaused();
					}
				}

				/**
				 * A map route enter() has asked to load an element.
				 */
				function loadIfManageable(page, view, authCategory, description) {
					load(page, view);
				}

				/**
				 * A map route enter() has asked to load an element.
				 */
				function loadIfViewable(page, view, authCategory, description) {
					if (session.canViewCategory(authCategory)) {
						load(page, view);
					} else {
						notAuthorizedView.setDescription(description);
						notAuthorizedView.setLocation(evalContext.location);
						load(unauthPage, notAuthorizedView);
					}
				}

				/**
				 * Has the evalContext changed since this matchContext?
				 * We use this to decide to abandon older sequence evaluations.
				 */
				function isCurrent(matchContext) {
					return (matchContext.sequence === evalContext.sequence);
				}

				/**
				 * If a route made a decision inline, it will updated the current
				 * evaluation index. If the evaluation index hasn't changed, we
				 * assume the route is waiting for some asynchronous completion
				 * and we pause evaluation.
				 */
				function pauseIfNoProgress(matchContext) {
					if (evalContext.index === matchContext.index) {
						evalContext.paused = true;
					}
				}

				/**
				 * We matched the route, call the appropriate handler,
				 * passing available responses.
				 */
				function evaluateRoute() {
					var matchContext = $.extend({}, evalContext);
					var route = matchContext.route;

					if ('watch' === route.type) {
						route.args.change(matchContext.location);
						if (evaluateSubRoutes()) {
							evalContext.index += 1;
						}
					} else if (evalContext.matched) {
						// this isn't a watcher and we've already matched, keep going
						evalContext.index += 1;
					} else {

						if ('filter' === route.type) {

							route.args.check(matchContext.location, {
								proceed : function() {
									if (isCurrent(matchContext)) {
										proceed();
									}
								},
								redirectTo : function(location) {
									if (isCurrent(matchContext)) {
										redirectTo(location);
									}
								},
								replaceWith : function(location) {
									if (isCurrent(matchContext)) {
										replaceWith(location);
									}
								}
							});
							pauseIfNoProgress(matchContext);
						} else if ('map' === route.type) {

							if (lastMappedRoute !== route) {
								unloadCurrent(route);
							}

							route.args.enter(matchContext.location, {
								load : function(page, view) {
									if (isCurrent(matchContext)) {
										load(page, view);
									}
								},
								loadIfViewable : function(page, view, authCategory, description) {
									if (isCurrent(matchContext)) {
										loadIfViewable(page, view, authCategory, description);
									}
								},
								loadIfManageable : function(page, view, authCategory, description) {
									if (isCurrent(matchContext)) {
										loadIfManageable(page, view, authCategory, description);
									}
								},
								redirectTo : function(location) {
									if (isCurrent(matchContext)) {
										redirectTo(location);
									}
								},
								replaceWith : function(location) {
									if (isCurrent(matchContext)) {
										replaceWith(location);
									}
								},
								noAction : function() {
									if (isCurrent(matchContext)) {
										noAction();
									}
								}
							});

							pauseIfNoProgress(matchContext);
						}
					}
				}

				/**
				 * Check our routes to see which one matches the current location.
				 */
				function evaluate() {
					var match;
					var loopCatcher = 1000;
					// be extra defensive against infinite loop bugs

					if (!evalContext.paused && !abortEvaluation) {

						while (evalContext.index < routes.length && !evalContext.paused && !abortEvaluation) {
							evalContext.route = routes[evalContext.index];

							// strip any query string
							match = evalContext.location.split('?')[0].match(evalContext.route.pattern);
							if (match && match.length > 0) {

								evaluateRoute();

							} else {
								//log(4, "no match", evalContext);
								evalContext.index += 1;
							}

							loopCatcher -= 1;
							if (loopCatcher <= 0) {
								//log(0, "defective routing");
								break;
							}

						}// while routes

					} // !paused
				}


				this.reset = function(location) {
					reset(location);
				};

				this.evaluate = evaluate;

				this.unloadCurrent = unloadCurrent;

				/**
				 * Extract the leading non-regexp part of the pattern.
				 * For example "/a/b/.*" will return "/a/b/".
				 */
				function patternPrefix(pattern) {
					var result;
					// trim off leading '^'
					if (pattern[0] === '^') {
						pattern = pattern.slice(1);
					}
					result = pattern.match(/[\/|\w|\-]*/)[0];
					if ('/' === result.charAt(result.length - 1)) {
						// remove trailing '/'
						result = result.slice(0, result.length - 1);
					}
					return result;
				}

				/**
				 * Determine the parent we should use for the type+pattern.
				 * Typically, this it whatever precedes the last '/'.
				 * We handle filters differently because their parent is
				 * the path itself.
				 */
				function parentPrefix(type, pattern) {
					var result;
					// trim off leading '^'
					if (pattern[0] === '^') {
						pattern = pattern.slice(1);
					}
					// prune off terminals
					result = pattern.match(/[\/|\w|\-]*/)[0];
					if (result && 'filter' !== type) {
						// prune off trailing '/...'
						result = result.match(/(.*)\/[\w|\-]*$/)[1];
					}

					// patterns like '^.*' should be parented at '/'
					if (!result || result.length === 0) {
						result = '/';
					}

					return result;
				}

				/**
				 * Figure out if we have a route that this new one should hang off of.
				 * If a parent was explicitly provided, use that.
				 * Otherwise, parse the pattern and compare to current routes.
				 */
				function findSubRoute(type, pattern, parent) {
					var i, match, desiredRoot, route = null;

					if (pattern[0] === '/' && (!parent || parent !== root)) {
						desiredRoot = ( parent ? parent : parentPrefix(type, pattern));
						match = false;
						// see if this pattern is a subset of any existing routes
						for ( i = 0; i < routes.length; i += 1) {
							route = routes[i];
							if (route.args && route.args.root && route.args.root === desiredRoot) {
								break;
							}
							if (route.pattern && root !== patternPrefix(route.pattern)) {
								if (route.pattern.slice(0, 2) === '^/') {
									match = desiredRoot.match(route.pattern);
								} else if (route.pattern.slice(0, 1) === '/') {
									match = desiredRoot.match('^' + route.pattern);
								}
								if (match) {
									break;
								}
							}
							route = null;
						}
					}
					return route;
				}

				/**
				 * Add routing information.
				 * @param type: 'map', 'filter', 'watch'
				 * @param name: something human readable for debugging
				 * @param pattern: url location pattern
				 * @param args: {parent: <location>, <functions>}
				 */
				this.add = function(type, name, pattern, args) {
					var subRoute, subRoot;

					subRoute = findSubRoute(type, pattern, args.parent);

					if (subRoute) {
						// sub-route
						if (!subRoute.level) {
							subRoute.level = new Level();
							subRoot = (subRoute.args.root ? subRoute.args.root : patternPrefix(subRoute.pattern));
							subRoute.level.init(subRoot, dispatcher);
						}
						subRoute.level.add(type, name, pattern, args);
						evalContext.newRoutes = true;
					} else {
						// not a sub-route
						routes.push({
							type : type,
							name : name,
							pattern : pattern,
							args : args
						});
					}
				};

			}

			return Level;
		}());

	var Router = ( function() {

			//  var KIOSK_PARAM = 'kiosk';
			var RETURN_TO_PREVIOUS = '/_return_to_previous';

			function Router() {
				var dispatcher = new EventDispatcher();
				var location = null;
				var previousLocation = null;
				var rootLevel;

				function returnToPrevious(from) {
					var tempLocation;
					initialize();
					if (previousLocation) {
						tempLocation = previousLocation;
						previousLocation = null;
						hashManager.setHash(tempLocation);
					} else {
						hashManager.setHash('/');
					}
				}

				function processChange(hash) {
					if (RETURN_TO_PREVIOUS === hash) {
						returnToPrevious('hash change');
					} else {
						location = hash;
						abortEvaluation = false;
						rootLevel.reset(location);
						rootLevel.evaluate();
					}
				}

				function hashChanged() {
					var hash = hashManager.getHash();
					if (hash !== location) {
						processChange(hash);
					}
				}

				function initialize() {
					if (!rootLevel) {
						rootLevel = new Level();
						rootLevel.init('/', dispatcher);
					}
				}


				this.map = function(name, pattern, args) {
					initialize();
					rootLevel.add('map', name, pattern, args);
				};

				this.filter = function(name, pattern, args) {
					initialize();
					rootLevel.add('filter', name, pattern, args);
				};

				this.go = function(newLocation, from) {
					initialize();
					if (location !== newLocation) {
						if (RETURN_TO_PREVIOUS !== newLocation) {
							// save previous location for returnToPrevious()
							previousLocation = location;
						}
						abortEvaluation = true;
						hashManager.setHash(newLocation);
						if (newLocation === '/home') {
							window.location.reload();
						}
					}
				};

				this.returnToPrevious = returnToPrevious;

				this.reload = function(url, option) {
					var reloadPath = url ? url : window.location.pathname;
					window.location.replace(reloadPath);
				};

				this.location = function() {
					return location;
				};

				this.start = function() {
					initialize();
					hashManager.init();
					hashManager.on('hashchange', hashChanged);
					hashChanged();
				};

				this.on = function(eventName, callback) {
					dispatcher.on(eventName, callback);
				};

				this.off = function(eventName, callback) {
					dispatcher.off(eventName, callback);
				};
				
			}

			return new Router();
		}());

	return Router;
});
