//View that will drive the main landing page.

define(['jqueryui', 'spin', 'cookie', '../app/Router', 'validate', 'typeahead', 'bloodhound'], function(jqueryui, spin, cookie, router, validate, typeahead, bloodhound) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			function EntryView() {

				function activateSuggestionSearch() {

					var entities = new Bloodhound({
						datumTokenizer : function(d) {
							return Bloodhound.tokenizers.whitespace(d.name);
						},
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						limit : 5,
						prefetch : {
							url : 'data/univslist.json',
							filter : function(list) {
								return jQuery.map(list, function(country) {
									return {
										name : country
									};
								});
							}
						}
					});
					entities.initialize();
					//activateSuggestionSearch();
					jQuery('#user-domain').typeahead(null, {
						name : 'entities',
						displayKey : 'name',
						source : entities.ttAdapter()
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
							},
						}
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
