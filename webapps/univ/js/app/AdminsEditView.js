//View that will drive the Students list page.

define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify', '../app/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var AdminsEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ACTIVEINVITE;

			function AdminsEditView() {

				function populateData() {
					if (ACTIVEINVITE){
						jQuery('#invite-email').val(ACTIVEINVITE.email);
						jQuery('#invite-status').val(ACTIVEINVITE.status);
						jQuery('#invite-domain').val(ACTIVEINVITE.domain);
						jQuery('#invite-roles').val(ACTIVEINVITE.roles);
						jQuery('#invite-sender').val(ACTIVEINVITE.invitedby);
					}
					else{
						router.go('/adminslist')
					}
				}

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
				
				this.setInviteInfo = function(Info){
					ACTIVEINVITE = Info;
				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#invite-edit').on('click', function() {
							if ($(".edit-form").valid()) {
								alert('action needed');
								setTimeout ( function(){
									router.returnToPrevious();
								},1000);
							}
						});

					} // Cookie Guider
				};

			}

			return AdminsEditView;
		}());

	return new AdminsEditView();
});
