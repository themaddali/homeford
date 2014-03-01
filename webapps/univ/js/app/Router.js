// This is still a WIP file

define(['HashManager', 'Events', '../lib/jquery.cookie'], function(hashmanager, events, cookie) {"use strict";

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
				 * A map route enter() has asked to load an element.
				 */
				function load(page, view) {
					var route = evalContext.route;
					log(1, "load");
					evalContext.matched = true;
					if (!route.args.container) {
						Log.error('Missing container for ' + route.name);
					}
					pager.loadElement(route.args.container, pagerId(route), page, view);
					if (route.args.menu) {
						banner.finishMenu(route.args.menu);
					}
					banner.setHelp(evalContext.location);
					lastMappedRoute = route;
					dispatcher.fire('locationChange', evalContext.location);
					if (evaluateSubRoutes()) {
						evalContext.index += 1;
						resumeIfPaused();
					}
					performance.endNavigation(evalContext.location);
				}

				/**
				 * A map route enter() has asked to load an element.
				 */
				function loadIfManageable(page, view) {
					load(page, view);
				}

				/**
				 * A map route enter() has asked to load an element.
				 */
				function loadIfViewable(page, view) {
					load(page, view);
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
						// we didn't get instructions inline
						// assume they will come later
						evalContext.paused = true;
						log(1, "pausing");
					}
				}

				/**
				 * We matched the route, call the appropriate handler,
				 * passing available responses.
				 */
				function evaluateRoute() {
					var matchContext = $.extend({}, evalContext);
					var route = matchContext.route;

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

						performance.beginNavigation(matchContext.location);

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

						banner.setHelp(matchContext.location);
						pauseIfNoProgress(matchContext);
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
								evalContext.index += 1;
							}

							loopCatcher -= 1;
							if (loopCatcher <= 0) {
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
									log(3, "matched " + desiredRoot + " vs. " + route.pattern);
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
							log(2, "add sub level " + subRoot + " for " + subRoute.pattern);
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
						log(1, "add " + type + " \"" + name + "\" for " + pattern);

						if (args.menu) {
							banner.addMenu(args.menu);
						}
					}
				};

			}

			return Level;
		}());

	var Router = ( function() {

			function Router() {
				var dispatcher = new EventDispatcher();
				var location = null;
				var previousLocation = null;
				var rootLevel;
				// The Level for '/'

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

				// Register a map route
				this.map = function(name, pattern, args) {
					initialize();
					rootLevel.add('map', name, pattern, args);
				};

				// Register a filter route
				this.filter = function(name, pattern, args) {
					initialize();
					rootLevel.add('filter', name, pattern, args);
				};

				this.go = function(newLocation, from) {
					initialize();
					// Don't reset if already there
					if (location !== newLocation) {
						if (RETURN_TO_PREVIOUS !== newLocation) {
							// save previous location for returnToPrevious()
							previousLocation = location;
						}
						log(0, "go " + newLocation + " from " + from);
						abortEvaluation = true;
						hashManager.setHash(newLocation);
					}
				};

				this.returnToPrevious = returnToPrevious;

				this.location = function() {
					return location;
				};

				// used by Application to kickstart
				this.start = function() {
					initialize();
					log(1, "start");
					hashManager.init();
					hashManager.on('hashchange', hashChanged);
					hashChanged();
				};

			}

			return new Router();
		}());

	return Router;
});
