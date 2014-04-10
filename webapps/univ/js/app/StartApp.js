define(['../app/LocationView', '../app/Environment', '../app/UrlFragment', '../app/Router', 'cookie', 'jquery'], function(locationView, environment, urlFragment, router) {"use strict";

	var Application = ( function() {

			var DEFAULT_OPTIONS = {
				title : 'Welcome',
				subTitle : null,
			}

			function Application() {

				this.init = function(optionsArg) {
					if ( typeof optionsArg === 'string') {
						optionsArg = {
							title : optionsArg
						};
					}

					var params = urlFragment.getParameters(window.location.href);
					locationView.init();
				};

				this.start = function() {
					if (environment.supportedBrowser()) {
						router.start();
					} else {
						//Have to insert else case logics here or message to dispay for Browser not suported/
					}
				};

			}

			return new Application();
		}());

	return Application;
});
