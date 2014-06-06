define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(modernizr, cookie, service, validate, router, notify) {"use strict";

	var ContactView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function ContactView() {

				function checkForActiveCookie() {
					if (jQuery.cookie('user') && jQuery.cookie('user') !== 'home') {
						return true;
					} else {
						//Paranoid Cookie Clearing
						jQuery.removeCookie('user', {
							path : '/univ'
						});
						jQuery.removeCookie('subuser', {
							path : '/univ'
						});
						router.go('/home', '/admin');
						return false;
					}
				}

				function populateData() {

				}

				function clearForm() {
					jQuery('#contact-email').val('');
					jQuery('#contact-message').val('');
					jQuery('#contact-send').val('Submit Query').attr('disabled', 'none').css('background-color', '#0784E3');
				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					// if (checkForActiveCookie() === true) {
					// populateData();
					// }// Cookie Guider

					jQuery('#contact-send').click(function() {
						if ($("#contact-form").valid()) {
							var roles = [{
								"roleName" : "ROLE_TIER2"
							}];
							jQuery('#contact-send').val('Sending...').attr('disabled', 'disabled');
							service.Login('tour@zingoare.com', 'tourzingoare', {
								success : function(LoginData) {
									if (LoginData !== 'error') {
										service.sendInvite('zingoare@gmail.com', 'Email To: ' + jQuery('#contact-email').val() + ' , Message: ' + jQuery('#contact-message').val(), 'read CONTACT FORM', roles, {
											success : function(response) {
												if (response !== 'error') {
													notify.showNotification('OK', response.message);
													setTimeout(function() {
														jQuery('#contact-send').val('SENT success!').css('background-color', 'green');
													}, 2000);
													setTimeout(function() {
														clearForm();
														service.Logout({
															success : function() {
																jQuery.removeCookie('user', {
																	path : '/'
																});
																jQuery.removeCookie('subuser', {
																	path : '/'
																});
															},
														});
													}, 4000);
												} else {
													notify.showNotification('ERROR', response.message);
												}
											}
										});

									} else {
										notify.showNotification('ERROR', 'Username/Password Combination Invalid');
									}
								}
							});

						}

					});

					jQuery('#trial-modal-link').click(function() {
						service.Login('tour@zingoare.com', 'tourzingoare', {
							success : function(LoginData) {
								if (LoginData !== 'error') {
									notify.showNotification('OK', 'Login Success', 'studentlist', '0');
									jQuery.cookie('user', 'tour@zingoare.com', {
										expires : 100,
										path : '/'
									});
								} else {
									notify.showNotification('ERROR', 'Username/Password Combination Invalid');
								}
							}
						});
					});

					if (Modernizr.touch) {
						var panelwidth = $('.infocard').width();
						var panelheight = .56 * panelwidth;
						jQuery('.about-video').attr("width", panelwidth);
						jQuery('.about-video').attr("width", panelheight);
					} else {
						var panelwidth = $('.infocard').width();
						jQuery('.about-video').attr("width", "640");
						jQuery('.about-video').attr("width", "360");
					}

					jQuery("#contact-form").validate({
						rules : {
							Cusername : {
								required : true,
								email : true
							},
							CMessage : {
								required : true,
							}
						},
						Cusername : {
							username : "Valid Email Needed",
						},
					});
				};

			}

			return ContactView;
		}());

	return new ContactView();
});
