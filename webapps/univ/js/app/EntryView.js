//View that will drive the main landing page.

define(['jqueryui', 'spin', 'cookie', '../app/Router', 'validate', '../app/service/DataService'], function(jqueryui, spin, cookie, router, validate, service) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			var ERROR = '<i style="padding-right:10px" class="icon-exclamation icon-1x "></i>';

			function EntryView() {

				function activateSuggestionSearch() {
					service.entityList({
						success : function(result) {
							console.log('Entity List' + result);
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

				function Authenticate(username, password, domain) {
					service.Login(username, password, {
						success : function(LoginData) {
							if (LoginData !== 'error') {
								jQuery.cookie('user', username, {
									expires : 100,
									path : '/'
								});
								router.go('/studentlist', '/entry');
							} else {
								jQuery('#login-notification').fadeIn(1000);
								jQuery('#login-notification').html("User/Password Combination Invalid!");
							}
						}
					});

				}


				this.pause = function() {

				};

				this.resume = function() {

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
								required : true,
							},
						}
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
