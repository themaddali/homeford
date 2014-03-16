//View that will drive the main landing page.

define(['jqueryui', 'spin', 'cookie', '../app/Router', 'validate', '../app/service/DataService', '../app/Notify'], function(jqueryui, spin, cookie, router, validate, service, notify) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			var ENTITY;

			function EntryView() {

				function activateSuggestionSearch() {
					if (ENTITY)
					{
						jQuery('#new-user-domain').val(ENTITY);
					}
					if (checkForActiveCookie() === false) {
						service.entityList({
							success : function(result) {
								if (result !== 'error') {
									$("#new-user-domain").autocomplete({
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

				function RegisterUser(username, password, domain) {
					service.registerNewUser(username, password, domain, {
						success : function(RegisterData) {
							if (RegisterData.status === 'success') {
								notify.showNotification('OK', 'Congratulations!!!', null, '2000');
								Login(username, password);
							} else {
								notify.showNotification('ERROR', RegisterData.message);
							}
						}
					});
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						router.go('/studentlist', '/register');
						return true;
					} else {
						return false;
					}
				}

				function Login(username, password) {
					service.Login(username, password, {
						success : function(LoginData) {
							if (LoginData !== 'error') {
								notify.showNotification('OK', 'Congratulations!!!', 'studentlist', '1000');
								jQuery.cookie('user', username, {
									expires : 100,
									path : '/'
								});
							} else {
								notify.showNotification('ERROR', 'Some thing didnt go right!');
							}
						}
					});
				}
				
				this.entity = function(entity) {
					ENTITY = entity;
				}


				this.pause = function() {

				};

				this.resume = function() {
					checkForActiveCookie();
				};

				this.init = function() {
					if (!jQuery.cookie('entity')) {
						jQuery('#user-domain').removeAttr('readonly');
						jQuery('#user-domain').removeClass('onlyone');
						activateSuggestionSearch();
					} else {
						jQuery('#user-domain').addClass('onlyone');
						jQuery('#user-domain').val('Active Domain: ' + jQuery.cookie('entity').toUpperCase());
					}

					jQuery('#register-button').on('click', function(e) {
						if ($("#register-form").valid()) {
							var inputuname = jQuery('#new-user-name').val();
							var inputpass = jQuery('#new-user-password').val();
							var inputdomain = jQuery('#new-user-domain').val();
							RegisterUser(inputuname, inputpass, inputdomain);
							e.preventDefault();
						}
					});

					jQuery(function() {
						$("#user-dob").datepicker();
					});

					jQuery('#user-name').on('keyup', function() {
						jQuery('#login-notification').fadeOut(1000);
					});

					jQuery('#user-password').on('keyup', function() {
						jQuery('#login-notification').fadeOut(1000);
					});

					jQuery('#login-close').on('click', function() {
						router.go('/home', '/entry');
					});

					jQuery("#register-form").validate({
						rules : {
							Rfirstname : {
								required : false,
							},
							Rusername : {
								required : true,
								email : true
							},
							Rpassword : {
								required : true,
							},
							Rpasswordrepeat : {
								required : true,
								equalTo : "#new-user-password"
							},
							Rdomain : {
								required : true,
							},
							RDOB : {
								required : false,
								date : true
							},
						}
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
