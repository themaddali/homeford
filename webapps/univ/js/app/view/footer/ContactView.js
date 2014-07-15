define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(modernizr, cookie, service, validate, router, notify) {"use strict";

	var ContactView = ( function() {

			/**
			 * Constructor
			 *
			 */
			var DIALOGBODY = '<div id="note-dialog" title="Welcome!"> <p><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Please select the kind of experience you want to tour?</p></div>';

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
				
				function initDialog() {
					jQuery('body').append(DIALOGBODY);
					$("#note-dialog").dialog({
						autoOpen : false,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						modal : false,
						buttons : {
							"Administrator " : function() {
								$(this).dialog("close");
							},
							"Parent" : function() {
								$(this).dialog("close");
							}
						}
					});
				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					initDialog();
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					// if (checkForActiveCookie() === true) {
					// populateData();
					// }// Cookie Guider
					
					initDialog();
					
					jQuery('#trial-modal-link').click(function(){
						jQuery("#note-dialog").dialog("open");
					});

					jQuery('#contact-send').click(function() {
						if ($("#contact-form").valid()) {
							var roles = [{
								"roleName" : "ROLE_TIER2"
							}];
							jQuery('#contact-send').val('Sending...').attr('disabled', 'disabled');
							service.Login('tour@zingoare.com', 'tourzingoare', {
								success : function(LoginData) {
									if (LoginData !== 'error') {
										service.sendInvite('support@zingoare.com', 'Email To: ' + jQuery('#contact-email').val() + ' , Message: ' + jQuery('#contact-message').val(), 'read CONTACT FORM', roles, {
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
						// service.Login('tour@zingoare.com', 'tourzingoare', {
							// success : function(LoginData) {
								// if (LoginData !== 'error') {
									// notify.showNotification('OK', 'Login Success', 'studentlist', '0');
									// jQuery.cookie('user', 'tour@zingoare.com', {
										// expires : 100,
										// path : '/'
									// });
									// jQuery.cookie('subuser', 'TOUR', {
										// expires : 100,
										// path : '/'
									// });
								// } else {
									// notify.showNotification('ERROR', 'Username/Password Combination Invalid');
								// }
							// }
						// });
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
