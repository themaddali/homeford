//View that will drive the Students list page.

define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify'], function(modernizr, cookie, service, validate, router, notify) {"use strict";

	var ProfileEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function ProfileEditView() {

				function populateData() {
					service.getUserProfile({
						success : function(UserProfile) {
							//OverView Panel Load
							jQuery('#profile-first-name').val(UserProfile.firstName);
							jQuery('#profile-last-name').val(UserProfile.lastName);
							jQuery('#profile-id').val(UserProfile.id);
							jQuery('#profile-email').val(UserProfile.email);
							jQuery('#profile-phone').val(UserProfile.phoneNumber);
							jQuery('#profile-domains').val(UserProfile.domains[0].domainName);
							//jQuery('#profile-image').text('None Available');
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
					jQuery('#password-reenter-item').hide();
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							//router.go('/admin', '#/profileedit');
							router.returnToPrevious();
						});

						jQuery('#profile-edit').on('click', function() {
							if ($("#profile-edit-form").valid()) {
								notify.showNotification('OK', 'Information Updated!!!');
							}
						});
						
						jQuery('#profile-password').change(function() {
							jQuery('#password-reenter-item').show();
						});

						jQuery("#profile-edit-form").validate({
							rules : {
								profileid : {
									required : true,
								},
								profilepassword : {
									required : true,
								},
								profilepasswordrepeat : {
									equalTo : "#profile-password"
								},
								profileemail : {
									required : true,
									email : true
								}
							}
						});

					} // Cookie Guider
				};

			}

			return ProfileEditView;
		}());

	return new ProfileEditView();
});
