//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var ProfileEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			}

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
							//var template = jQuery('#profile-domain-template').attr('id', '');
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
								service.setUserProfile(jQuery('#profile-id').val(), jQuery('#profile-first-name').val(), jQuery('#profile-last-name').val(), jQuery('#profile-email').val(), jQuery('#profile-phone').val(), {
									success : function(response) {
										if (response !== 'error') {
											notify.showNotification('OK', response.message);
										} else {
											notify.showNotification('ERROR', response.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
											//admin.reloadData();
										}, 5000);
									}
								});
							}
							//Need to update to handler
						});

						jQuery('#profile-password').keyup(function() {
							jQuery('#password-reenter-item').fadeIn();
							if (jQuery('#profile-password').val() == "") {
								jQuery('#password-reenter-item').fadeOut();
							}
						});

						jQuery("#profile-edit-form").validate({
							rules : {
								profileid : {
									required : true,
								},
								profilepassword : {
									required : false,
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
