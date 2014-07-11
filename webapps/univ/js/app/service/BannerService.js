define(['jquery', 'cookie', '../service/DataService', '../Router'], function(jQuery, cookie, service, router) {"use strict";
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
					jQuery('.userflyout').remove();
					jQuery('.alertflyout').remove();
					var useroption = '<div class="userflyout"><div class="flyout-label">' + 'Logged In' + '</div><a id="banner-dashboard" href="#/admin" class="flyout-link">' + 'Administration' + '</a><a class="flyout-link" id="signout">' + 'SignOut' + '</a></div>';
					jQuery('#project-nav').append(useroption);
					jQuery('.flyout-label').text(jQuery.cookie('user'));
				};
				this.HideUser = function() {
					jQuery('.userflyout').remove();
				};

				this.setBrand = function() {
					if (jQuery.cookie('user') === 'tour@zingoare.com') {
						jQuery('.brandname').text('Demo Tour').addClass('show');
						jQuery('.brandnames').removeClass('show');
						jQuery('.brandnamesicon').hide();
					} else {
						service.getUserProfile({
							success : function(UserProfile) {
								if (UserProfile.domains.length === 1) {
									jQuery('.brandnames').removeClass('show');
									jQuery('.brandname').text(UserProfile.domains[0].domainName).addClass('show');
									jQuery('.brandnamesicon').hide();
								} else {
									jQuery('.brandnames').empty();
									for (var i = 0; i < UserProfile.domains.length; i++) {
										jQuery('.brandname').removeClass('show');
										if (UserProfile.domains[i].roleName !== "ROLE_TIER3"){
											jQuery('.brandnames').append('<option>' + UserProfile.domains[i].domainName + '</option').addClass('show');
										}
									}
									jQuery('.brandnames').val(jQuery.cookie('subuser'));
								}
							}
						});
					}
				};

				this.updateBrand = function(newchoice) {
					if (newchoice === "Demo Tour") {
						newchoice = 'TOUR';
					}
					jQuery.cookie('subuser', newchoice, {
						expires : 100,
						path : '/'
					});
					jQuery.cookie('_did', service.domainNametoID(newchoice), {
						expires : 100,
						path : '/'
					});
					location.reload(false);
				};

				this.ShowAlert = function() {
					jQuery('#alert').removeClass('active');
					jQuery('.alertflyout').remove();
					jQuery('.userflyout').remove();
					var alertoption = '<div class="alertflyout"><div class="flyout-label">' + 'No New Alerts' + '</div><a id="banner-alert" href="#/notifications" class="flyout-link">' + 'View All' + '</a></div>';
					jQuery('#project-nav').append(alertoption);
				};

				this.HideAlert = function() {
					jQuery('.alertflyout').remove();
				};

				this.logout = function() {
					service.Logout({
						success : function() {
							jQuery.removeCookie('user', {
								path : '/'
							});
							jQuery.removeCookie('subuser', {
								path : '/'
							});
							jQuery.removeCookie('_did', {
								path : '/'
							});
							router.go('/home');
							window.setTimeout('location.reload()', 500);
							// refresh after 1/2 sec
						},
					});
				};

				this.newNotify = function(status, message, link, details) {

				};

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
