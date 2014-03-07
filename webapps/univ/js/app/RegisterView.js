//View that will drive the main landing page.

define(['jqueryui', 'spin', 'cookie', '../app/Router', 'validate', '../app/service/DataService'], function(jqueryui, spin, cookie, router, validate, service) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			function EntryView() {

				function activateSuggestionSearch() {
					service.entityList({
						success : function(result) {
							console.log('Entity List' + result);
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

				function Authenticate(username, password) {
					jQuery.cookie('user', username, {
						expires : 100,
						path : '/'
					});
					router.go('/studentlist', '/entry');
				}


				this.pause = function() {

				};

				this.resume = function() {

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
								required : true,
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
								required : true,
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
