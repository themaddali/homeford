define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(cookie, service, validate, router, notify) {"use strict";

	var ResetPasswordView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function ResetPasswordView() {

				function checkForActiveCookie() {
					return true;
					// if (jQuery.cookie('user') && jQuery.cookie('user') !== 'home') {
					//
					// } else {
					// //Paranoid Cookie Clearing
					// jQuery.removeCookie('user', {
					// path : '/univ'
					// });
					// jQuery.removeCookie('subuser', {
					// path : '/univ'
					// });
					// router.go('/home', '/admin');
					// return false;
					// }
				}

				function clearForm() {
					jQuery('.form-item > input').val("");
					jQuery('#member-role').prop('checked', false);
					jQuery('.edit-notify').hide();
					jQuery('.modal_close').show();
					jQuery('#invite-message').val('');
					jQuery('#invite-email').val('');
				}


				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					//populateData();
					validator.resetForm();
					document.title = 'Zingoare | Password Reset';
				};

				this.init = function() {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Password Reset';

					if (checkForActiveCookie() === true) {

						//populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#invite-send').on('click', function() {
							var roles = [{
								"roleName" : "ROLE_TIER2"
							}];
							//Defaulting to T2 and T3.
							roles = [{
								"roleName" : "ROLE_TIER2"
							}, {
								"roleName" : "ROLE_TIER3"
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
								service.sendInvite(jQuery('#invite-email').val(), jQuery('#invite-message').val(), jQuery.cookie('subuser'), roles, {
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
								}, 2000);
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

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

			return ResetPasswordView;
		}());

	return new ResetPasswordView();
});
