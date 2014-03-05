//View that will drive the main landing page.

define(['spin', 'cookie', '../app/Router', 'validate', 'typeahead', 'bloodhound'], function(spin, cookie, router, validate, typeahead, bloodhound) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */
			
			var ERROR = '<i style="padding-right:10px" class="icon-exclamation icon-1x "></i>';
			
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
					if (!jQuery.cookie('entity'))
					{
						jQuery('#user-domain').removeAttr('readonly');
						jQuery('#user-domain').removeClass('onlyone');
						activateSuggestionSearch();
					}
					else
					{
						jQuery('#user-domain').addClass('onlyone');
						jQuery('#user-domain').val('Active Domain: '+jQuery.cookie('entity').toUpperCase());
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
							}
							else
							{
								jQuery('#login-notification').fadeIn(1000);
								jQuery('#login-notification').html(ERROR+' Invalid Login: '+ inputpass);
							}
						}

					});

					jQuery('#user-name').on('keyup',function() {
						jQuery('#login-notification').fadeOut(1000);
					});
					
					jQuery('#user-password').on('keyup',function() {
						jQuery('#login-notification').fadeOut(1000);
					});

					jQuery('#login-close').on('click',function() {
						router.go('/home','/entry');
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
