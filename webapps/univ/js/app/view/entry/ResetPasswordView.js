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
				}

				function clearForm() {
					jQuery('#invite-email').val('').focus();
				}


				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
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

						jQuery('#reset-send').click(function() {
							if ($("#invite-form").valid()) {
								var email = jQuery('#invite-email').val();
								alert(email + ' action');
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery("#invite-form").validate({
							rules : {
								inviteemail : {
									required : true,
									email : true
								},
							}
						});

					} // Cookie Guider
				};

			}

			return ResetPasswordView;
		}());

	return new ResetPasswordView();
});
