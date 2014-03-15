//View that will drive the Students list page.

define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify','../app/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var InviteView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			}

			function InviteView() {

				function checkForActiveCookie() {
					if (jQuery.cookie('user') && jQuery.cookie('user') !== 'home') {
						return true;
					} else {
						//Paranoid Cookie Clearing
						jQuery.removeCookie('user', {
							path : '/univ'
						});
						jQuery.removeCookie('subuser', {
							path : '/univ'
						});
						router.go('/home', '/admin');
						return false;
					}
				}
				
				function clearForm(){
					jQuery('.form-item > input').val("");
				}


				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						//HTML Event - Actions
						jQuery('#invite-modal-close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#invite-send').on('click', function() {
							if ($("#invite-form").valid()) {
								if (jQuery('#invite-message').val() === null || jQuery('#invite-message').val() === "")
								{
									jQuery('#invite-message').val("Hi, I am addming you as an admin to this domain. Register and use!!");
								}
								service.sendInvite(jQuery('#invite-email').val(), jQuery('#invite-message').val(), jQuery('#invite-domain').val(), {
									success : function(response) {
										if (response !== 'error') {
											notify.showNotification('OK', response.message);
										} else {
											notify.showNotification('ERROR', response.message);
										}
									}
								});
								setTimeout(function() {
									router.returnToPrevious();
									admin.reloadData();
								}, 6000);
							}

							//Need to update to handler
						});

						jQuery('#profile-password').change(function() {
							jQuery('#password-reenter-item').show();
						});

						jQuery("#invite-form").validate({
							rules : {
								invitedomain : {
									required : true,
								},
								inviteemail : {
									required : true,
									email : true
								}
							}
						});

					} // Cookie Guider
				};

			}

			return InviteView;
		}());

	return new InviteView();
});
