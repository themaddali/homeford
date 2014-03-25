//View that will drive the Students list page.

define(['cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify', '../app/AdminView'], function(cookie, service, validate, router, notify, admin) {"use strict";

	var ToDoAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function ToDoAssignView() {

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

				function populateData() {
					jQuery('#invite-domain').empty();
					service.getUserProfile({
						success : function(UserProfile) {
							var activeDomains = [];
							for (var i = 0; i < UserProfile.domains.length; i++) {
								if (UserProfile.domains[i].roleName === 'ROLE_TIER2' || UserProfile.domains[i].roleName === 'ROLE_TIER1')
									activeDomains.push(UserProfile.domains[i].domainName);
								jQuery('#invite-domain').append('<option>' + UserProfile.domains[i].domainName + '</option>');
								if (UserProfile.domains.length === 1) {
									jQuery('#invite-domain').val(UserProfile.domains[i].domainName);
								}
								if (i == UserProfile.domains.length - 1) {
									jQuery.validator.addMethod("domainValidation", function(value, element) {
										if (activeDomains.indexOf(value) === -1) {
											return false;
										} else
											return true;
									}, "Oops! You canot send invite to this domain!");
								}
							}
						}
					});
				}
				
				function clearForm() {
					
				}

				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					populateData();
					validator.resetForm();
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});
						
						jQuery('#member-list').keyup(function(){
							router.go('/memberspick');
						});

						jQuery('#invite-send').on('click', function() {
							var roles = [{
								"roleName" : "ROLE_TIER2"
							}];
							if ($("#invite-form").valid()) {
								if (jQuery('#invite-message').val() === null || jQuery('#invite-message').val() === "") {
									jQuery('#invite-message').val("Hi, I am adding you as an admin to this domain. Register and use!!");
								}
								if ($('#member-role').is(":checked")) {
									roles = [{
										"roleName" : "ROLE_TIER2"
									}, {
										"roleName" : "ROLE_TIER3"
									}];
								}
								service.sendInvite(jQuery('#invite-email').val(), jQuery('#invite-message').val(), jQuery('#invite-domain').val(), roles, {
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
									//admin.reloadData();
								}, 5000);
							}

							//Need to update to handler
						});

						jQuery('#profile-password').change(function() {
							jQuery('#password-reenter-item').show();
						});

						jQuery.validator.addMethod("notRepeated", function(value, element) {
							if (pendingList) {
								if (pendingList.indexOf(value) === -1) {
									return true;
								} else
									return false;
							} else
								return true;

						}, "This email already has a request pending.");

						validator = jQuery("#invite-form").validate({
							rules : {
								invitedomain : {
									required : true,
									domainValidation : true
								},
								inviteemail : {
									required : true,
									email : true,
									notRepeated : true
								},
								roles : {
									required : true
								}
							}
						});

					} // Cookie Guider
				};

			}

			return ToDoAssignView;
		}());

	return new ToDoAssignView();
});
