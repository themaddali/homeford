define(['modernizr', 'cookie', 'jquerywidget', 'transport', 'fileupload', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/studentlist/StudentListView'], function(modernizr, cookie, jquerywidget, transport, fileupload, service, validate, router, notify, admin, studentlist) {"use strict";

	var ProfileEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};
			//var Croppic = new croppic;

			function ProfileEditView() {

				function populateData() {
					service.getUserProfile({
						success : function(UserProfile) {
							//OverView Panel Load
							jQuery('#profile-first-name').val(UserProfile.firstName);
							jQuery('#profile-last-name').val(UserProfile.lastName);
							jQuery('#profile-id').val(UserProfile.id);
							jQuery('#profile-email').val(UserProfile.email);
							jQuery('#profile-phone').val(UserProfile.phoneNumber);
							if (UserProfile.kioskPassword === null) {
								UserProfile.kioskPassword = 'Not Set - Update Now!';
							}
							jQuery('#profile-kiosk-pin').val(UserProfile.kioskPassword);

							if (!UserProfile.image || UserProfile.image == null || UserProfile.image == 'null') {
								jQuery('#profile-image').attr('src', 'img/noimg.png');
							} else {
								jQuery('#profile-image').attr('src', '/zingoare/api/profileupload/picture/' + UserProfile.image.id);
							}
							var imageUploadURL = '/zingoare/api/profileupload/' + UserProfile.id;
							jQuery('#profile-picture').attr('data-url', imageUploadURL);
							if (UserProfile.domains.length === 1) {
								jQuery('#profile-domainDesc1').text(UserProfile.domains[0].domainDesc1);
								jQuery('#profile-domainDesc2').text(UserProfile.domains[0].domainDesc2);
								jQuery('#profile-domainThanksMessage').text(UserProfile.domains[0].domainThanksMessage);
							} else {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									if (UserProfile.domains[i].domainName === jQuery.cookie('subuser')) {
										jQuery('#profile-domainDesc1').text(UserProfile.domains[0].domainDesc1);
										jQuery('#profile-domainDesc2').text(UserProfile.domains[0].domainDesc2);
										jQuery('#profile-domainThanksMessage').text(UserProfile.domains[0].domainThanksMessage);
									}
								}
							}
							setTimeout(function() {
								if (jQuery('#profile-domainDesc1').val() == 'null' || jQuery('#profile-domainDesc1').val() == null || jQuery('#profile-domainDesc1').val().length < 2) {
									jQuery('#profile-domainDesc1').val('In continuous effort to provide best and quality care to your kid, we here, have decided to empower ourselves with Zingoare platform. I personally invite you to take a moment (less than a minute) to register yourself and add your kid thru the link provided below.');
								}
								if (jQuery('#profile-domainDesc2').val() == 'null' || jQuery('#profile-domainDesc2').val() == null || jQuery('#profile-domainDesc2').val().length < 2) {
									jQuery('#profile-domainDesc2').val('We are happy that you chose us to be a part of your kids exciting journey for a great future. A big thank you!! ');
								}
								if (jQuery('#profile-domainThanksMessage').val() == 'null' || jQuery('#profile-domainThanksMessage').val() == null || jQuery('#profile-domainThanksMessage').val().length < 2) {
									jQuery('#profile-domainThanksMessage').val('Myself and the whole team');
								}
								if (jQuery('#profile-first-name').val() == null || jQuery('#profile-first-name').val() == 'null' || jQuery('#profile-first-name').val().length < 1) {
									jQuery('.modal_close').hide();
								} else {
									jQuery('.modal_close').show();
								}
							}, 500);
							ActivateClicks();
						}
					});
				}

				function ActivateClicks() {
					var formData_input = $('#profile-picture').serializeArray();

					$('#profile-picture').fileupload({
						add : function(e, data) {
							var uploadErrors = [];
							var acceptFileTypes = /^image\/(gif|jpe?g|png)$/i;
							if (data.originalFiles[0]['type'].length && !acceptFileTypes.test(data.originalFiles[0]['type'])) {
								uploadErrors.push('Only .jpg, .gif and .png types are allowed');
							}
							if (data.originalFiles[0]['size'].length && data.originalFiles[0]['size'] > 5000000) {
								uploadErrors.push('Filesize is too big');
							}
							if (uploadErrors.length > 0) {
								alert(uploadErrors.join("\n"));
							} else {
								data.submit();
							}
						},
						dataType : 'json',
						formData : formData_input,
						submit : function(e, data) {
							jQuery('#profile-image').attr('src', 'img/loader.gif').addClass('loading');
						},
						done : function(e, data) {
							$.each(data.result.files, function(index, file) {
								jQuery('#profile-image').removeClass('loading').attr('src', '/zingoare/api/profileupload/picture/' + file.id);
								service.cleanUserProfile();
							});
						}
					});

					// var croppicContaineroutputOptions = {
					// uploadUrl : jQuery('#profile-picture').attr('data-url'),
					// outputUrlId : 'cropOutput',
					// modal : false,
					// formdatainput : formData_input,
					// loaderHtml : '<div class="loader bubblingG"><span id="bubblingG_1"></span><span id="bubblingG_2"></span><span id="bubblingG_3"></span></div> '
					// }
					// var cropContaineroutput = new Croppic('profile-picture-div', croppicContaineroutputOptions);
				}

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


				$.validator.addMethod("passwordvalid", function(value, element, param) {
					var ValidPwd = (/^[^<>;,"'&\\\/|+:= ]+$/.test(value));
					return (value.length == 0 || ValidPwd);
				}, 'Invalid password choice');

				this.pause = function() {

				};

				this.resume = function() {
					//jQuery('#password-reenter-item').hide();
					jQuery('.edit-notify').hide();
					populateData();
					document.title = 'Zingoare | Profile Edit';
					if (jQuery('#profile-first-name').val() == null || jQuery('#profile-first-name').val() == 'null' || jQuery('#profile-first-name').val().length < 1) {
						jQuery('.modal_close').hide();
					} else {
						jQuery('.modal_close').show();
					}
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Profile Edit';
					// if (!$("#profile-edit-form").valid()) {
						// jQuery('.modal_close').hide();
					// }

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#profile-picture-div').css('height', jQuery('#profile-picture-div').width() / 2);

						jQuery('#profile-edit').on('click', function() {
							if ($("#profile-edit-form").valid()) {
								var domainobj = {};
								domainobj.id = jQuery.cookie('_did');
								domainobj.domainDesc1 = jQuery('#profile-domainDesc1').val();
								domainobj.domainDesc2 = jQuery('#profile-domainDesc2').val();
								domainobj.domainThanksMessage = jQuery('#profile-domainThanksMessage').val();
								if (jQuery('#profile-password').val().length > 0) {
									service.setUserProfileWithPassword(jQuery('#profile-id').val(), jQuery('#profile-first-name').val(), jQuery('#profile-last-name').val(), jQuery('#profile-email').val(), jQuery('#profile-password').val(), jQuery('#profile-phone').val(), jQuery('#profile-kiosk-pin').val(), domainobj, {
										success : function(response) {
											if (response.status !== 'error') {
												jQuery.removeCookie('user', {
													path : '/'
												});
												jQuery.removeCookie('subuser', {
													path : '/'
												});
												jQuery.removeCookie('_did', {
													path : '/'
												});
												notify.showNotification('OK', response.message, 'entry', 10000);
												setTimeout(function() {
													notify.showNotification('WARN', 'You will now be logged out, login back with new credentials');
												}, 1500);
												setTimeout(function() {
													router.go('/entry');
												}, 4500);
											} else {
												notify.showNotification('ERROR', response.message);
											}
										}
									});
								} else {
									service.setUserProfile(jQuery('#profile-id').val(), jQuery('#profile-first-name').val(), jQuery('#profile-last-name').val(), jQuery('#profile-email').val(), jQuery('#profile-phone').val(), jQuery('#profile-kiosk-pin').val(), domainobj, {
										success : function(response) {
											if (response.status !== 'error') {
												notify.showNotification('OK', response.message);
												studentlist.reload();
												setTimeout(function() {
													router.returnToPrevious();
													//admin.reloadData();
												}, 2000);
											} else {
												notify.showNotification('ERROR', response.message);
											}
										}
									});
								}

							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
								jQuery('.modal_close').hide();
							}
						});

						// jQuery('#profile-password').keyup(function() {
						// jQuery('#password-reenter-item').fadeIn();
						// if (jQuery('#profile-password').val() == "") {
						// jQuery('#password-reenter-item').fadeOut();
						// }
						// });

						jQuery('#profile-image').click(function() {
							$('input[type=file]').click();
						});

						jQuery("#profile-edit-form").validate({
							rules : {
								profileid : {
									required : true,
								},
								profilepassword : {
									required : false,
									minlength : 4,
									passwordvalid : '#profile-password'
								},
								profilefirstname : {
									required : true,
								},
								profilelastname : {
									required : true,
								},
								profilepasswordrepeat : {
									equalTo : "#profile-password"
								},
								profileemail : {
									required : true,
									email : true
								},
								profilekioskpin : {
									required : true,
									digits : true,
									maxlength : 4,
									minlength : 4,
								},
							}
						});

					} // Cookie Guider
				};

			}

			return ProfileEditView;
		}());

	return new ProfileEditView();
});
