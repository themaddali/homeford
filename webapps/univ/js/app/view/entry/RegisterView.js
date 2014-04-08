//View that will drive the main landing page.

define(['jqueryui', 'cookie', '../../Router', 'validate', '../../service/DataService', '../../Notify'], function(jqueryui, cookie, router, validate, service, notify) {"use strict";

	var EntryView = ( function() {

			/**
			 * Constructor
			 */

			var ENTITY;
			var DOMAINSLIST;
			var ERROR = '<i style="padding:0px 10px" class="icon-exclamation icon-1x "></i>';
			var OK = '<i style="padding:0px 10px" class="icon-magic icon-1x "></i>';
			var INFO = '<i style="padding:0px 10px" class="icon-info icon-1x "></i>';

			function EntryView() {

				function activateSuggestionSearch() {
					if (ENTITY) {
						jQuery('#new-user-domain').val(ENTITY);
					}
					if (checkForActiveCookie() === false) {
						service.entityList({
							success : function(result) {
								DOMAINSLIST = result;
								if (result !== 'error') {
									$("#new-user-domain").autocomplete({
										source : function(request, response) {
											var results = $.ui.autocomplete.filter(result, request.term);
											response(results.slice(0, 5));
										},
										select : function(event, ui) {
											var origEvent = event;
											while (origEvent.originalEvent !== undefined)
											origEvent = origEvent.originalEvent;
											if (origEvent.type == 'keydown')
												$("#new-user-domain").keyup();
										},
									});
								}
							}
						});
					}
				}

				function RegisterUser(username, password, domain) {
					service.registerNewUser(username, password, domain, {
						success : function(RegisterData) {
							if (RegisterData.status === 'success') {
								notify.showNotification('OK', 'Congratulations!!!', null, '2000');
								Login(username, password);
							} else {
								notify.showNotification('ERROR', RegisterData.message);
							}
						}
					});
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						router.go('/studentlist', '/register');
						return true;
					} else {
						return false;
					}
				}

				function Login(username, password) {
					service.Login(username, password, {
						success : function(LoginData) {
							if (LoginData !== 'error') {
								notify.showNotification('OK', 'Congratulations!!!', 'studentlist', '1000');
								if (username.length > 18) {
									username = username.split('@')[0];
								}
								jQuery.cookie('user', username, {
									expires : 100,
									path : '/'
								});
							} else {
								notify.showNotification('ERROR', 'Some thing didnt go right!');
							}
						}
					});
				}

				function parseQueryURL() {
					var requesturl = router.location().substring(1);
					if (requesturl.indexOf('email=') !== -1 && requesturl.indexOf('domain=') !== -1) {
						var query = requesturl.split('email=')[1];
						query = query.split("?");
						jQuery('#new-user-name').val(query[0]);
						jQuery('#new-user-domain').val(query[1].split("domain=")[1].toUpperCase());
						jQuery('#new-user-name').attr('readonly', true);
						jQuery('#new-user-doamin').attr('readonly', true);
						jQuery('#new-user-password').focus();
					} else {
						jQuery('#new-user-name').val('');
						jQuery('#new-user-domain').val('');
						jQuery('#new-user-name').attr('readonly', false);
						jQuery('#new-user-doamin').attr('readonly', false);
						jQuery('#new-user-name').focus();
					}
				}


				$.validator.addMethod("passwordvalid", function(value, element, param) {
					var ValidPwd = (/^[^<>;,"'&\\\/|+:= ]+$/.test(value));
					return (value.length == 0 || ValidPwd);
				}, 'Invalid Password Choice');

				this.entity = function(entity) {
					ENTITY = entity;
				}

				this.pause = function() {

				};

				this.resume = function() {
					checkForActiveCookie();
					jQuery('.info').hide();
					parseQueryURL();
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

					parseQueryURL();

					jQuery('#register').on('click', function(e) {
						if ($("#register-form").valid()) {
							var inputuname = jQuery('#new-user-name').val();
							var inputpass = jQuery('#new-user-password').val();
							var inputdomain = jQuery('#new-user-domain').val().toUpperCase();
							RegisterUser(inputuname, inputpass, inputdomain);
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

					jQuery('#new-user-domain').keyup(function() {
						//Sanity
						jQuery('#new-user-domain').css("text-transform", "uppercase");
						var domainrequest = jQuery('#new-user-domain').val().toUpperCase();
						if (domainrequest === "") {
							jQuery('#new-user-domain').css("text-transform", "none");
							jQuery('#RInfo').fadeOut();
						} else {
							jQuery('#RInfo').fadeIn();
							if (DOMAINSLIST && DOMAINSLIST.indexOf(domainrequest) !== -1) {
								jQuery('.info').text('Existing Domain, Adds as Admin');
							} else {
								jQuery('.info').text('New Domain, Adds as Owner');
							}
						}
					});

					jQuery('#login-close').on('click', function() {
						router.returnToPrevious();
					});

					jQuery("#register-form").validate({
						rules : {
							Rfirstname : {
								required : false,
							},
							Rusername : {
								required : true,
								email : true
							},
							Rpassword : {
								required : true,
								passwordvalid : '#new-user-password'
							},
							Rpasswordrepeat : {
								required : true,
								equalTo : "#new-user-password"
							},
							Rdomain : {
								required : true,
							},
							RDOB : {
								required : false,
								date : true
							},
						},
						messages : {
							Rusername : "Valid Email Needed",
						},
					});

				};

			}

			return EntryView;
		}());

	return new EntryView();
});
