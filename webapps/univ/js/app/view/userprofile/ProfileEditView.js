define(['modernizr', 'cookie', 'jquerywidget', 'transport', 'fileupload', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, jquerywidget, transport, fileupload, service, validate, router, notify, admin) {"use strict";

	var ProfileEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			}
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
							if (!UserProfile.image || UserProfile.image == null || UserProfile.image == 'null') {
								jQuery('#profile-image').attr('src', 'img/noimg.png')
							} else {
								jQuery('#profile-image').attr('src', '/homeford/api/profileupload/picture/' + UserProfile.image.id);
							}
							var imageUploadURL = '/homeford/api/profileupload/' + UserProfile.id;
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
								jQuery('#profile-image').removeClass('loading').attr('src', '/homeford/api/profileupload/picture/' + file.id);
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


				this.pause = function() {

				};

				this.resume = function() {
					jQuery('#password-reenter-item').hide();
					document.title = 'Zingoare | Profile Edit';
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Profile Edit';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#profile-picture-div').css('height', jQuery('#profile-picture-div').width() / 2);

						jQuery('#profile-edit').on('click', function() {
							if ($("#profile-edit-form").valid()) {
								service.setUserProfile(jQuery('#profile-id').val(), jQuery('#profile-first-name').val(), jQuery('#profile-last-name').val(), jQuery('#profile-email').val(), jQuery('#profile-phone').val(), {
									success : function(response) {
										if (response !== 'error') {
											notify.showNotification('OK', response.message);
										} else {
											notify.showNotification('ERROR', response.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
											//admin.reloadData();
										}, 2000);
									}
								});
							}
						});

						jQuery('#profile-password').keyup(function() {
							jQuery('#password-reenter-item').fadeIn();
							if (jQuery('#profile-password').val() == "") {
								jQuery('#password-reenter-item').fadeOut();
							}
						});

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
								},
								profilepasswordrepeat : {
									equalTo : "#profile-password"
								},
								profileemail : {
									required : true,
									email : true
								}
							}
						});

					} // Cookie Guider
				};

			}

			return ProfileEditView;
		}());

	return new ProfileEditView();
});
