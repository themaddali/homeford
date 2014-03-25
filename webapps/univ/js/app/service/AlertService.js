define(['jquery'], function() {"use strict";
	// "use strict";

	var AlertService = ( function() {

			var ACTIVEDOMAIN;
			var DOMAINLIST;

			/**
			 * @constructor
			 * @type {}
			 */
			function AlertService() {

				
				
				this.newNotify = function(status, message, link, details) {
					
				}

				this.pause = function() {
					// No implementation needed for this here.
				};

				this.resume = function() {
					// No implementation needed for this here.
				};

				this.init = function() {
					//getUnivData();
					this.resume();
				};
			}

			return new AlertService();
		}());

	return AlertService;
});
