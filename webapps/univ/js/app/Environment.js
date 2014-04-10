define(['jquery', 'modernizr'], function() {"use strict";
	var Environment = ( function() {

			function Environment() {

				function addIeClasses(floatVersion, compatibilityViewBrowser) {
					if ((floatVersion === 8.0 || (isNaN(compatibilityViewBrowser) === false && compatibilityViewBrowser === 8.0))) {

						$('html').addClass('ie8');

					} else if ((floatVersion === 9.0 || (isNaN(compatibilityViewBrowser) === false && compatibilityViewBrowser === 9.0))) {

						$('html').addClass('ie9');
					}
				}

				/**
				 * Return false if the current browser is known to not be supported.
				 */
				this.supportedBrowser = function() {
					return true;
				};

			}

			return new Environment();
		}());

	return Environment;
});
