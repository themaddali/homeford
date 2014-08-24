define(['jquery', 'cookie', '../service/DataService', '../Router'], function(jQuery, cookie, service, router) {"use strict";
	// "use strict";

	var BannerService = ( function() {

			var ACTIVEDOMAIN;
			var DOMAINLIST;
			var DIALOGBODY = '<div id="note-dialog" title="Notification!"> <p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span><span id="note-message"></span></p></div>';

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
									if (UserProfile.domains[0].roleStatus == 'ACTIVE') {
										jQuery('.brandnames').removeClass('show');
										jQuery('.brandname').text(UserProfile.domains[0].domainName).addClass('show');
										jQuery('.brandnamesicon').hide();
									} else {
										initDialog();
										jQuery('.brandnamesicon').hide();
										jQuery('#note-message').text('You are no longer active in this domain. Please contact admin');
										jQuery("#note-dialog").dialog("open");
									}
								} else {
									jQuery('.brandnames').empty();
									for (var i = 0; i < UserProfile.domains.length; i++) {
										jQuery('.brandname').removeClass('show');
										if (UserProfile.domains[i].roleName !== "ROLE_TIER3" && UserProfile.domains[i].roleStatus == 'ACTIVE') {
											jQuery('.brandnames').append('<option>' + UserProfile.domains[i].domainName + '</option').addClass('show');
										}
									}
									jQuery('.brandnames').val(jQuery.cookie('subuser'));
								}
								if (jQuery('.brandnames option').length === 1) {
									jQuery('.brandname').text(jQuery('.brandnames').val()).addClass('show');
									jQuery('.brandnames').removeClass('show');
									jQuery('.brandnamesicon').hide();
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

				function initDialog() {
					jQuery('body').append(DIALOGBODY);
					$("#note-dialog").dialog({
						autoOpen : false,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						modal : true,
						buttons : {
							"OK " : function() {
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
								$(this).dialog("close");
							},
						},
						close : function (){
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
						}
					});
				}


				this.newNotify = function(status, message, link, details) {

				};

				this.pause = function() {
					// No implementation needed for this here.
				};

				this.resume = function() {
					initDialog();
				};

				this.init = function() {
					initDialog();
				};
			}

			return new BannerService();
		}());

	return BannerService;
});
