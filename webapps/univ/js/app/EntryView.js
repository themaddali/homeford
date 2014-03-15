//View that will drive the main landing page.

define(['jqueryui', 'spin', 'cookie', '../app/Router', 'validate', '../app/service/DataService', '../app/Notify'], function(jqueryui, spin, cookie, router, validate, service, notify) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			function EntryView() {

				function activateSuggestionSearch() {
					if (checkForActiveCookie() === false) {
						service.entityList({
							success : function(result) {
								console.log('Entity List' + result);
								if (result !== 'error') {
									var justList =[];
									for (var i = 0; i < result.length; i++) {
										justList.push(result[i].domainName);
										if (i === result.length-1){
											addSuggestions(justList);
										}
									}
								}
							}
						});
					}
				}
				
				function addSuggestions(justList) {
					$("#user-domain").autocomplete({
						source : function(request, response) {
							var results = $.ui.autocomplete.filter(justList, request.term);
							response(results.slice(0, 5));
						}
					});
				}

				function Authenticate(username, password, domain) {
					service.Login(username, password, {
						success : function(LoginData) {
							if (LoginData !== 'error') {
								notify.showNotification('OK', 'Login Success', 'studentlist', '2000');
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
					checkForActiveCookie()
				};

				this.init = function() {
					if (!jQuery.cookie('entity')) {
						jQuery('#user-domain').removeAttr('disabled');
						jQuery('#user-domain').removeClass('onlyone');
						activateSuggestionSearch();
					} else {
						jQuery('#user-domain').addClass('onlyone');
						jQuery('#user-domain').val('Active Domain: ' + jQuery.cookie('entity').toUpperCase());
					}

					jQuery('#login-button').on('click', function(e) {
						if ($("#login-form").valid()) {
							e.preventDefault();
							jQuery('#login-error').hide();
							var inputuname = jQuery('#user-name').val();
							var inputpass = jQuery('#user-password').val();
							if (inputuname !== 'error@e.com') {
								// successful validation and create cookie
								Authenticate(inputuname, inputpass);
							} else {
								jQuery('#login-notification').fadeIn(1000);
								jQuery('#login-notification').html(ERROR + ' Invalid Login: ' + inputpass);
							}
						}

					});

					jQuery('#user-name').on('keyup', function() {
						jQuery('#login-notification').fadeOut(1000);
					});

					jQuery('#user-password').on('keyup', function() {
						jQuery('#login-notification').fadeOut(1000);
					});
					jQuery('#register-now').on('click', function() {
						router.go('/register', '/entry');
					});

					jQuery('#login-close').on('click', function() {
						router.go('/home', '/entry');
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
						}
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
