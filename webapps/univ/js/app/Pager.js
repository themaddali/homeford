define(['jquery'], function() {"use strict";

	var Pager = ( function() {

			function Pager() {

				var elements = {};
				var activeElements = {};
				var spinners = {};
				var watchers = {};

				function pauseWatchers(containerId) {
					if (watchers[containerId]) {
						$.each(watchers[containerId], function(index, handlers) {
							if (handlers.pause) {
								handlers.pause($(containerId));
							}
						});
					}
				}

				function resumeWatchers(containerId) {
					if (watchers[containerId]) {
						$.each(watchers[containerId], function(index, handlers) {
							if (handlers.resume) {
								handlers.resume($(containerId));
							}
						});
					}
				}

				function deactivate(containerId) {
					var activeElement = activeElements[containerId];

					pauseWatchers(containerId);

					if (activeElement) {
						if (activeElement.view && activeElement.view.pause) {
							activeElement.view.pause();
						}
						delete activeElements[containerId];
					}

					$(containerId).children().detach();
				}


				this.unloadElement = function(containerId, newId) {
					deactivate(containerId);
				};

				// this.makeViewReload = function(id, url) {
					// var id = '/[' + id + ']';
					// var thiselement = elements[id];
					// thiselement.initialized = false;
					// thiselement.seturl = url;
				// }

				this.loadElement = function(containerId, id, page, view) {
					var element, activeElement, context, viewName;

					element = elements[id];
					if (!element) {
						if (view) {
							// IE doesn't have the ability to get the name like this
							if (view.constructor) {
								viewName = view.constructor.name;
							} else {
								viewName = 'un-nameable view';
							}
						} else {
							viewName = 'no view';
						}
						context = id + " at " + containerId + " with " + viewName;
						element = {
							context : context,
							page : $(page),
							view : view
						};
						elements[id] = element;
					}

					activeElement = activeElements[containerId];

					// only if we're changing
					if (activeElement !== element) {

						deactivate(containerId);
						$(containerId).append(element.page);
						if (element.view) {
							if (element.initialized == false) {
								var reloadPath = element.seturl;
								window.location.href = reloadPath;
								window.location.reload();

							} else if ((!element.initialized)) {
								if (element.view.init) {
									element.view.init();
								}
								element.initialized = true;
							} else if (element.view.resume) {
								element.view.resume();
							}
						}
						resumeWatchers(containerId);
						activeElements[containerId] = element;
					}
				};

				/**
				 * Registers handlers that will be called when the container
				 * contents are changed.
				 * handlers: {pause: function, resume: function}
				 * The pause function is called after the view has been paused.
				 * The resume function is called before the view is resumed.
				 */
				this.watch = function(containerId, handlers) {
					if (!watchers[containerId]) {
						watchers[containerId] = [];
					}
					watchers[containerId].push(handlers);
				};
			}

			return new Pager();
		}());

	return Pager;
});
