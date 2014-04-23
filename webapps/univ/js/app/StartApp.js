define(['../app/LocationView', '../app/UrlFragment', '../app/Router', 'cookie', 'jquery'], function(locationView, urlFragment, router) {"use strict";

	var Application = ( function() {

			var DEFAULT_OPTIONS = {
				title : 'Welcome',
				subTitle : null,
			}

			function Application() {

				this.init = function() {
					var params = urlFragment.getParameters(window.location.href);
					locationView.init();
				};

				this.start = function() {
					router.start();
				};

			}

			return new Application();
		}());

	return Application;
});
