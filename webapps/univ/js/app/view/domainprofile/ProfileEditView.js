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
					service.getDomainProfile(jQuery.cookie('_did'), {
						success : function(Profile) {
							//OverView Panel Load
							if (Profile.addresses[0]) {
								jQuery('#profile-street').val(Profile.addresses[0].street1);
								jQuery('#profile-street1').val(Profile.addresses[0].street2);
								jQuery('#profile-city').val(Profile.addresses[0].city);
								jQuery('#profile-state').val(Profile.addresses[0].state);
								jQuery('#profile-country').val(Profile.addresses[0].country);
								jQuery('#profile-zip').val(Profile.addresses[0].zip);

								jQuery('#profile-street-2').val(Profile.addresses[1].street1);
								jQuery('#profile-street1-2').val(Profile.addresses[1].street2);
								jQuery('#profile-city-2').val(Profile.addresses[1].city);
								jQuery('#profile-state-2').val(Profile.addresses[1].state);
								jQuery('#profile-country-2').val(Profile.addresses[1].country);
								jQuery('#profile-zip-2').val(Profile.addresses[1].zip);
							}
							
							jQuery('#profile-domainDesc1').text(Profile.domainDesc1);
							jQuery('#profile-domainDesc2').text(Profile.domainDesc2);
							jQuery('#profile-domainThanksMessage').text(Profile.domainThanksMessage);

							setTimeout(function() {
								if (jQuery('#profile-domainDesc1').val() == 'null' || jQuery('#profile-domainDesc1').val() == null || jQuery('#profile-domainDesc1').val().length < 2) {
									jQuery('#profile-domainDesc1').val('In continuous effort to provide best and quality care to your kid, we here, have decided to empower ourselves with Zingoare platform. I personally invite you to take a moment (less than a minute) to register yourself and add your kid thru the link provided below.');
								}
								if (jQuery('#profile-domainDesc2').val() == 'null' || jQuery('#profile-domainDesc2').val() == null || jQuery('#profile-domainDesc2').val().length < 2) {
									jQuery('#profile-domainDesc2').val('We are happy that you choose us to be a part of your kids exciting journey for a great future. A big thank you!! ');
								}
								if (jQuery('#profile-domainThanksMessage').val() == 'null' || jQuery('#profile-domainThanksMessage').val() == null || jQuery('#profile-domainThanksMessage').val().length < 2) {
									jQuery('#profile-domainThanksMessage').val('Myself and the whole team');
								}
								if (jQuery('#profile-street').val() == null || jQuery('#profile-street').val() == 'null' || jQuery('#profile-street').val().length < 1) {
									jQuery('.modal_close').hide();
								} else {
									jQuery('.modal_close').show();
								}
							}, 500);

							if (!Profile.image || Profile.image == null || Profile.image == 'null') {
								jQuery('#profile-image').attr('src', 'img/logo-print.jpg');
							} else {
								jQuery('#profile-image').attr('src', '/zingoare/api/domainupload/picture/' + Profile.image.id);
							}
							var imageUploadURL = '/zingoare/api/domainupload/' + Profile.id;
							jQuery('#profile-picture').attr('data-url', imageUploadURL);
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
								jQuery('#profile-image').removeClass('loading').attr('src', '/zingoare/api/domainupload/picture/' + file.id);
								service.cleanUserProfile();
							});
						}
					});
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


				this.pause = function() {

				};

				this.resume = function() {
					//jQuery('#password-reenter-item').hide();
					jQuery('.edit-notify').hide();
					jQuery('input').val('');
					populateData();
					document.title = 'Zingoare | Domain Profile Edit';
					if (jQuery('#profile-street').val() == null || jQuery('#profile-street').val() == 'null' || jQuery('#profile-street').val().length < 1) {
						jQuery('.modal_close').hide();
					} else {
						jQuery('.modal_close').show();
					}
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Domain Profile Edit';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#profile-picture-div').css('height', jQuery('#profile-picture-div').width() / 2);

						jQuery('#profile-edit').on('click', function() {
							if ($("#profile-edit-form").valid()) {
								var domainid = jQuery.cookie('_did');
								var domainDesc1 = jQuery('#profile-domainDesc1').val();
								var domainDesc2 = jQuery('#profile-domainDesc2').val();
								var domainThanksMessage = jQuery('#profile-domainThanksMessage').val();
								var domainarray = [];
								var domainobj = {};
								domainobj.addressName = "BILLING";
								domainobj.street1 = jQuery('#profile-street').val();
								domainobj.street2 = jQuery('#profile-street1').val();
								domainobj.city = jQuery('#profile-city').val();
								domainobj.state = jQuery('#profile-state').val();
								domainobj.country = jQuery('#profile-country').val();
								domainobj.zip = jQuery('#profile-zip').val();
								domainarray.push(domainobj);
								var domainobj = {};
								domainobj.addressName = "BILLING2";
								domainobj.street1 = jQuery('#profile-street-2').val();
								domainobj.street2 = jQuery('#profile-street1-2').val();
								domainobj.city = jQuery('#profile-city-2').val();
								domainobj.state = jQuery('#profile-state-2').val();
								domainobj.country = jQuery('#profile-country-2').val();
								domainobj.zip = jQuery('#profile-zip-2').val();
								domainarray.push(domainobj);
								service.setDomainProfile(domainid, domainDesc1, domainDesc2, domainThanksMessage, domainarray, {
									success : function(response) {
										if (response.status !== 'error') {
											notify.showNotification('OK', response.message);
											setTimeout(function() {
												router.returnToPrevious();
											}, 2000);
										} else {
											notify.showNotification('ERROR', response.message);
										}
									}
								});

							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
								jQuery('.modal_close').hide();
							}
						});

						jQuery('#profile-image').click(function() {
							$('input[type=file]').click();
						});
						
						jQuery('#address-copy').change(function(){
							if (this.checked) {
								jQuery('#profile-street-2').val(jQuery('#profile-street').val());
								jQuery('#profile-street1-2').val(jQuery('#profile-street1').val());
								jQuery('#profile-city-2').val(jQuery('#profile-city').val());
								jQuery('#profile-state-2').val(jQuery('#profile-state').val());
								jQuery('#profile-country-2').val(jQuery('#profile-country').val());
								jQuery('#profile-zip-2').val(jQuery('#profile-zip').val());
							}
							else {
								jQuery('#profile-street-2').val('') 
								jQuery('#profile-street1-2').val('')
								jQuery('#profile-city-2').val('')
								jQuery('#profile-state-2').val('')
								jQuery('#profile-country-2').val('')
								jQuery('#profile-zip-2').val('')
							}
						});

						jQuery("#profile-edit-form").validate({
							rules : {
								profilestreet : {
									required : true,
								},
								profilestreet2 : {
									required : true,
								},
								profilecity : {
									required : true,
								},
								profilestate : {
									required : true,
								},
								profilecountry : {
									required : true,
								},
								profilezip : {
									required : true,
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
