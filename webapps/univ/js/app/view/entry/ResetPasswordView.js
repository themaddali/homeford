define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(cookie, service, validate, router, notify) {"use strict";

	var ResetPasswordView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function ResetPasswordView() {

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						router.go('/studentlist', '/entry');
						return true;
					} else {
						return false;
					}
				}

				function clearForm() {
					jQuery('#reset-email').val('').focus();
				}


				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					checkForActiveCookie();
					validator.resetForm();
					document.title = 'Zingoare | Password Reset';
				};

				this.init = function() {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Password Reset';

					if (checkForActiveCookie() === false) {
						//populateData();
						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#reset-email').bind('keypress', function(e) {
							if (e.keyCode === 13) {
								e.preventDefault();
								if ($("#reset-form").valid()) {
									var email = jQuery('#reset-email').val();
									service.passwordReset(email, {
										success : function(response) {
											if (response !== 'error' && response.status !== 'error') {
												notify.showNotification('OK', 'Email Sent - ' + response.message, 'home', 5000);
												clearForm();
												validator.resetForm();
											} else {
												notify.showNotification('ERROR', response.message);
											}
										}
									});
								} else {
									notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
								}
							}
						});

						jQuery('#reset-send').click(function() {
							if ($("#reset-form").valid()) {
								var email = jQuery('#reset-email').val();
								service.passwordReset(email, {
									success : function(response) {
										if (response !== 'error' && response.status !== 'error') {
											notify.showNotification('OK', 'Email Sent - ' + response.message, 'home', 5000);
											clearForm();
											validator.resetForm();
										} else {
											notify.showNotification('ERROR', response.message);
										}
									}
								});
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery("#reset-form").validate({
							rules : {
								resetemail : {
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
