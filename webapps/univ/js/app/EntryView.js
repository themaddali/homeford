//View that will drive the main landing page.

define(['spin', 'cookie', '../app/Router'], function(spin, cookie, router) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */
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
					jQuery('#login-button').on('click', function(e) {
						e.preventDefault();
						jQuery('#login-error').hide();
						var inputuname = jQuery('#user-name').val();
						var inputpass = jQuery('#user-password').val();

						if (inputuname !== 'error' && inputpass !== null) {
							// successful validation and create cookie
							Authenticate(inputuname,inputpass);
						}
					});

					jQuery('#login-modal-close').click(function() {
						router.go('/entry', '/home');
					})
				};

			}

			return EntryView;
		}());

	return new EntryView();
});
