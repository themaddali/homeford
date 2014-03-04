//View that will drive the main landing page.

define(['spin', 'cookie', '../app/Router', 'validate'], function(spin, cookie, router, validate) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */
			
			var ERROR = '<i style="padding-right:10px" class="icon-exclamation icon-1x "></i>';
			
			function EntryView() {

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
					jQuery('#user-domain').val(router.location());
					
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
