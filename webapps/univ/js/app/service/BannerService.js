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

				this.ShowUser = function() {
					var useroption = '<div class="userflyout"><div class="">' + 'Admin' + '</span></div>';
					jQuery('#project-nav').append(useroption);
				}
				this.HideUser = function() {
					jQuery('.userflyout').remove();
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
