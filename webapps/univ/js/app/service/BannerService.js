define(['jquery'], function() {"use strict";
	// "use strict";

	var BannerService = ( function() {

			var ACTIVEDOMAIN;
			var DOMAINLIST;

			/**
			 * @constructor
			 * @type {}
			 */
			function BannerService() {

				
				this.user = function(){
					var useroption = '<div class="userflyout"><div class="">' + 'Admin' + '</span></div>';
					$('#project-nav').append(useroption);
				}
				
				this.newNotify = function(status, message, link, details) {
					
				}

				this.pause = function() {
					// No implementation needed for this here.
				};

				this.resume = function() {
					// No implementation needed for this here.
				};

				this.init = function() {
					
				};
			}

			return new BannerService();
		}());

	return BannerService;
});
