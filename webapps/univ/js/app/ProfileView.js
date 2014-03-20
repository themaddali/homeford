//View that will drive the Students list page.

define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify', '../app/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var ProfileView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			}

			function ProfileView() {

				function populateData() {
					service.getUserProfile({
						success : function(UserProfile) {
							//OverView Panel Load
							jQuery('.user-first-name').text(UserProfile.firstName);
							jQuery('.user-last-name').text(UserProfile.lastName);
							jQuery('.user-id').text(UserProfile.id);
							jQuery('.user-email').text(UserProfile.email);
							jQuery('.user-phone').text(UserProfile.phoneNumber);
							// var template = jQuery('#profile-domain-template').attr('id', '');
							// if (UserProfile.domains.length === 1) {
								// jQuery('#profile-domains').val(UserProfile.domains[0].domainName + ' : ' + ROLEMAP[UserProfile.domains[0].roleName]);
							// } else {
								// for (var i = 0; i < UserProfile.domains.length; i++) {
									// if (i === 0) {
										// jQuery('#profile-domains').val(UserProfile.domains[0].domainName + ' : ' + ROLEMAP[UserProfile.domains[0].roleName]);
									// } else {
										// var activetemplate = template.clone();
										// activetemplate.show();
										// jQuery('#profile-domain-list', activetemplate).val(UserProfile.domains[i].domainName + ' : ' + ROLEMAP[UserProfile.domains[i].roleName]);
										// jQuery('#profile-form').append(activetemplate);
									// }
// 
								// }
							// }
						}
					});
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


				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return ProfileView;
		}());

	return new ProfileView();
});
