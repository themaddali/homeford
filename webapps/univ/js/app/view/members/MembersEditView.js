define(['modernizr', 'cookie', 'jquerywidget', 'transport', 'fileupload', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, jquerywidget, transport, fileupload, service, validate, router, notify, admin) {"use strict";

	var MembersEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ACTIVEMEMBER;
			var formData_input;

			function MembersEditView() {

				function populateData() {
					if (ACTIVEMEMBER) {
						jQuery('#member-first-name').val(ACTIVEMEMBER.firstname);
						jQuery('#member-last-name').val(ACTIVEMEMBER.lastname);
						jQuery('#member-id').val(ACTIVEMEMBER.id);
						jQuery('#member-rel').val(ACTIVEMEMBER.relation);
						jQuery('#member-email').val(ACTIVEMEMBER.email);
						jQuery('#member-domains').val(ACTIVEMEMBER.domain);
						jQuery('#member-roles').val(ACTIVEMEMBER.roles);
						jQuery('#member-profile-image').attr('src', ACTIVEMEMBER.image);
						jQuery('#member-pin').val(ACTIVEMEMBER.kioskpin);
						// jQuery('#member-profile-image').Jcrop({
						// allowSelect : false,
						// allowMove : true,
						// allowResize : true,
						// setSelect : [0, 0, 300, 150],
						// aspectRatio : 2,
						// });
						jQuery('#new-member-profile-image').attr('data-url', '/zingoare/api/profileupload/' + ACTIVEMEMBER.id);
						ActivateClicks();
					} else {
						router.go('/membersgrid');
					}
				}

				function showCoords(c) {
					// variables can be accessed here as
					// c.x, c.y, c.x2, c.y2, c.w, c.h
				};

				function ActivateClicks() {
					$('#new-member-profile-image').fileupload({
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
							jQuery('#member-profile-image').attr('src', 'img/loader.gif').addClass('loading');
						},
						done : function(e, data) {
							$.each(data.result.files, function(index, file) {
								jQuery('#member-profile-image').removeClass('loading').attr('src', '/zingoare/api/profileupload/picture/' + file.id);
								service.cleanUserProfile();
								$('#new-member-profile-image').fileupload('destroy');
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


				this.setMemberInfo = function(MemberInfo) {
					ACTIVEMEMBER = MemberInfo;
				};

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					jQuery('.edit-notify').hide();
					document.title = 'Zingoare | Members Edit';
					//$('#new-member-profile-image').fileupload('destroy');
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Members Edit';

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#member-edit').on('click', function() {
							if ($(".edit-form").valid()) {
								service.setUserProfileOnly(jQuery('#member-id').val(), jQuery('#member-first-name').val(), jQuery('#member-last-name').val(), jQuery('#member-email').val(), "", jQuery('#member-pin').val(), {
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
							}
						});

						jQuery('#member-profile-image').click(function() {
							formData_input = $('#new-member-profile-image').serializeArray();
							$('input[type=file]').click();
						});

						jQuery(".edit-form").validate({
							rules : {
								memberfirstname : {
									required : true,
								},
								memberlastname : {
									required : true,
								},
								memberemail : {
									email : true
								},
								memberpin : {
									required : true,
									digits : true,
									maxlength : 4,
									minlength : 4
								}
							}
						});

					} // Cookie Guider
				};

			}

			return MembersEditView;
		}());

	return new MembersEditView();
});
