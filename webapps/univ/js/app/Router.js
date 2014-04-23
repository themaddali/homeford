define(['../app/Events', '../app/URLDecoder', '../app/Pager', '../app/UrlFragment', 'cookie'], function(EventDispatcher, URLDecoder, pager, urlFragment, cookie) {"use strict";

	var abortEvaluation = false;

	/**
	 * A Level tracks a path level in the hash location.
	 * For instance, "/a/b" has two levels.
	 */
	var Level = ( function() {

			function Level() {

				var dispatcher;
				var root;
				var routes = [{}];
				var sequence = 0;
				var lastMappedRoute = null;
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

				function reset(location) {
					var i, route;

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

				function pagerId(route) {
					return (root + '[' + ( route ? route.name : '?') + ']');
				}

				function evaluateSubRoutes() {
					// if (evalContext.route.level) {
						// if (evalContext.newRoutes) {
							// reset(evalContext.location);
							// evaluate();
							// return false;
						// } else {
							// evalContext.route.level.evaluate();
						// }
					// }
					return true;
				}

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
					if (evalContext.paused) {
						evalContext.paused = false;
						evaluate();
					}
				}

				function noAction() {
					evalContext.matched = true;
					// unload any sub-routes
					if (evalContext.route.level) {
						evalContext.route.level.unloadCurrent();
					}
				}

				function proceed() {
					if (evaluateSubRoutes()) {
						evalContext.index += 1;
						resumeIfPaused();
					}
				}

				function redirectTo(location) {
					evalContext.matched = true;
					evalContext.index += 1;
					if (evalContext.location !== location) {
						URLDecoder.setHash(location);
					} else {
						if (evaluateSubRoutes()) {
							resumeIfPaused();
						}
					}
				}

				function replaceWith(location) {
					evalContext.matched = true;
					evalContext.index += 1;
					if (evalContext.location !== location) {
						URLDecoder.replaceHash(location);
					} else {
						if (evaluateSubRoutes()) {
							resumeIfPaused();
						}
					}
				}

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

				function loadIfManageable(page, view) {
					load(page, view);
				}

				function isCurrent(matchContext) {
					return (matchContext.sequence === evalContext.sequence);
				}

				function pauseIfNoProgress(matchContext) {
					if (evalContext.index === matchContext.index) {
						evalContext.paused = true;
					}
				}

				function evaluateRoute() {
					var matchContext = $.extend({}, evalContext);
					var route = matchContext.route;

					if ('watch' === route.type) {
						route.args.change(matchContext.location);
						if (evaluateSubRoutes()) {
							evalContext.index += 1;
						}
					} else if (evalContext.matched) {
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
								loadIfManageable : function(page, view) {
									if (isCurrent(matchContext)) {
										loadIfManageable(page, view);
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

				function evaluate() {
					var match;
					var loopCatcher = 1000;

					if (!evalContext.paused && !abortEvaluation) {

						while (evalContext.index < routes.length && !evalContext.paused && !abortEvaluation) {
							evalContext.route = routes[evalContext.index];
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
					if (!result || result.length === 0) {
						result = '/';
					}
					return result;
				}

				this.add = function(type, name, pattern, args) {
					routes.push({
						type : type,
						name : name,
						pattern : pattern,
						args : args
					});
				};
			}

			return Level;
		}());

	var Router = ( function() {

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
						URLDecoder.setHash(tempLocation);
					} else {
						URLDecoder.setHash('/');
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
					var hash = URLDecoder.getHash();
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
						URLDecoder.setHash(newLocation);
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
					URLDecoder.init();
					URLDecoder.on('hashchange', hashChanged);
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