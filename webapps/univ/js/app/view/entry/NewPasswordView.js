define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(cookie, service, validate, router, notify) {"use strict";

	var ResetPasswordView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var info;

			function ResetPasswordView() {

				function checkForActiveCookie() {
					return true;
				}

				function clearForm() {
					jQuery('#new-user-password').val('').focus();
					jQuery('#new-user-password-repeat').val('');
					jQuery('#new-user-name').val('');
				}


				$.validator.addMethod("passwordvalid", function(value, element, param) {
					var ValidPwd = (/^[^<>;,"'&\\\/|+:= ]+$/.test(value));
					return (value.length == 0 || ValidPwd);
				}, 'Invalid Password Choice');

				this.resetinfo = function(email) {
					clearForm();
					info = email;
					jQuery('#new-user-name').val(email);
				};

				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					validator.resetForm();
					document.title = 'Zingoare | New Password';
				};

				this.init = function() {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | New Password';

					if (checkForActiveCookie() === true) {
						clearForm();
						jQuery('#new-user-name').val(info);

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						validator = jQuery("#invite-form").validate({
							rules : {
								Rusername : {
									required : true,
									email : true
								},
								Rpassword : {
									required : true,
									passwordvalid : '#new-user-password'
								},
								Rpasswordrepeat : {
									required : true,
									equalTo : "#new-user-password"
								}
							}
						});

						jQuery('#update-password').click(function() {
							if ($("#invite-form").valid()) {
								var email = jQuery('#new-user-name').val();
								var password = jQuery('#new-user-password').val();
								alert(email + ' action');
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

					} // Cookie Guider
				};

			}

			return ResetPasswordView;
		}());

	return new ResetPasswordView();
});
