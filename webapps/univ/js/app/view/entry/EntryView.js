define(['cookie', '../../Router', 'validate', '../../service/DataService', '../../Notify'], function(cookie, router, validate, service, notify) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			function EntryView() {

				function activateSuggestionSearch() {
					if (checkForActiveCookie() === false) {
						service.entityList({
							success : function(result) {
								//console.log('Entity List' + result);
								if (result !== 'error') {
									$("#user-domain").autocomplete({
										source : function(request, response) {
											var results = $.ui.autocomplete.filter(result, request.term);
											response(results.slice(0, 5));
										}
									});
								}
							}
						});
					}
				}

				function Authenticate(username, password, domain) {
					service.Login(username, password, {
						success : function(LoginData) {
							if (LoginData !== 'error') {
								if (username.length > 18) {
									username = username.split('@')[0];
								}
								notify.showNotification('OK', 'Login Success', 'studentlist', '0');
								jQuery.cookie('user', username, {
									expires : 100,
									path : '/'
								});
							} else {
								notify.showNotification('ERROR', 'Username/Password Combination Invalid');
							}
						}
					});
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						router.go('/studentlist', '/entry');
						return true;
					} else {
						return false;
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					checkForActiveCookie();
					document.title = 'Zingoare | Signin/Signup';
				};

				this.init = function() {
					document.title = 'Zingoare | Signin/Signup';
					if (!jQuery.cookie('entity')) {
						jQuery('#user-domain').removeAttr('disabled');
						jQuery('#user-domain').removeClass('onlyone');
						activateSuggestionSearch();
					} else {
						jQuery('#user-domain').addClass('onlyone');
						jQuery('#user-domain').val('Active Domain: ' + jQuery.cookie('entity').toUpperCase());
					}

					jQuery('#reg-login').on('click', function(e) {
						if ($("#login-form").valid()) {
							e.preventDefault();
							jQuery('#login-error').hide();
							var inputuname = jQuery('#user-name').val();
							var inputpass = jQuery('#user-password').val();
							Authenticate(inputuname, inputpass);
						}else{
							notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
						}

					});

					//Rarely due to network latency if not loaded, just reload
					if (!$.ui) {
						location.reload();
					}

					jQuery('#user-name').on('keyup', function() {
						jQuery('#login-notification').fadeOut(1000);
					});

					jQuery('#user-password').on('keyup', function() {
						jQuery('#login-notification').fadeOut(1000);
					});

					jQuery('#user-password').bind('keypress', function(e) {
						if (e.keyCode === 13) {
							if ($("#login-form").valid()) {
								e.preventDefault();
								jQuery('#login-error').hide();
								var inputuname = jQuery('#user-name').val();
								var inputpass = jQuery('#user-password').val();
								Authenticate(inputuname, inputpass);
							}
						}
					});

					// jQuery('.form-item input').addClear();
					// jQuery('.form-item input').blur(function(){
					// $(this).parent().find('.input-clear').hide();
					// });
					// jQuery('.form-item input').focus(function(){
					// if ($(this).find('.error')){
					// $(this).parent().find('.input-clear').hide();
					// }
					// });

					jQuery('#register-now').on('click', function() {
						router.go('/register', '/entry');
					});

					jQuery('#login-close').on('click', function() {
						router.returnToPrevious();
					});

					jQuery("#login-form").validate({
						rules : {
							username : {
								required : true,
								email : true
							},
							userpassword : {
								required : true,
							},
							userdomain : {
								required : false,
							},
						},
						messages : {
							username : "Valid Email Needed",
						},
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
