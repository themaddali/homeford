define(['cookie', '../../Router', 'validate', '../../service/DataService', '../../Notify', '../../view/entry/NewPasswordView'], function(cookie, router, validate, service, notify, newpassword) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};

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
					var OWNERLEVEL = 0;
					var ADMINLEVEL = 0;
					service.Login(username, password, {
						success : function(LoginData) {
							if (LoginData !== 'error') {
								if (username.length > 18) {
									username = username.split('@')[0];
								}
								service.getUserProfile({
									success : function(UserProfile) {
										for (var i = 0; i < UserProfile.domains.length; i++) {
											jQuery.cookie('subuser', UserProfile.domains[0].domainName, {
												expires : 100,
												path : '/'
											});
											jQuery.cookie('_did', UserProfile.domains[0].id, {
												expires : 100,
												path : '/'
											});
											if (ROLEMAP[UserProfile.domains[i].roleName] === 'Admin') {
												ADMINLEVEL = ADMINLEVEL + 1;
											} else if (ROLEMAP[UserProfile.domains[i].roleName] === 'Owner') {
												OWNERLEVEL = OWNERLEVEL + 1;
											}
										}
										if (UserProfile.passwordReset === true || UserProfile.passwordReset === 'true') {
											newpassword.resetinfo(username);
											router.go('/newpassword');
										} else {
											if (OWNERLEVEL !== UserProfile.domains.length) {
												//User is not owner. Filter stuff.a and take to studentlist
												notify.showNotification('OK', 'Login Success', 'studentlist', '0');
												jQuery.cookie('user', username, {
													expires : 100,
													path : '/'
												});
											} else {
												//User is owner. take to admin dashboard
												notify.showNotification('OK', 'Login Success', 'admin', '0');
												jQuery.cookie('user', username, {
													expires : 100,
													path : '/'
												});
											}
										}
									}
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

				function positionModal() {
					var freewidth = $('.modal-body').width() - 550;
					var freeheight = $('.modal-body').height() - 400;
					if ($('.modal-body').width() > 480) {
						jQuery('.modal-container.login').css('margin-left', freewidth / 2).css('margin-top', freeheight / 3);
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					checkForActiveCookie();
					jQuery('.edit-notify').hide();
					validator.resetForm();
					positionModal();
					document.title = 'Zingoare | Signin/Signup';
					jQuery('#user-name').focus();
				};

				this.init = function() {
					document.title = 'Zingoare | Signin/Signup';
					positionModal();

					// When the browser changes size
					$(window).resize(positionModal);

					if (!jQuery.cookie('entity')) {
						jQuery('#user-domain').removeAttr('disabled');
						jQuery('#user-domain').removeClass('onlyone');
						activateSuggestionSearch();
						jQuery('#user-name').focus();
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
						} else {
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
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
