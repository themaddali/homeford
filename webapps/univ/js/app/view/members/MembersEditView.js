//View that will drive the Students list page.

define(['modernizr', 'cookie', 'jquerywidget', 'transport', 'fileupload', 'crop', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, jquerywidget, transport, fileupload, crop, service, validate, router, notify, admin) {"use strict";

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
						jQuery('#member-email').val(ACTIVEMEMBER.email);
						jQuery('#member-domains').val(ACTIVEMEMBER.domain);
						jQuery('#member-roles').val(ACTIVEMEMBER.roles);
						jQuery('#member-profile-image').attr('src', ACTIVEMEMBER.image);
						// jQuery('#member-profile-image').Jcrop({
							// allowSelect : false,
							// allowMove : true,
							// allowResize : true,
							// setSelect : [0, 0, 300, 150],
							// aspectRatio : 2,
						// });
						jQuery('#new-member-profile-image').attr('data-url', '/homeford/api/profileupload/' + ACTIVEMEMBER.id);
						ActivateClicks();
					} else {
						router.go('/memberslist')
					}
				}

				function showCoords(c) {
					// variables can be accessed here as
					// c.x, c.y, c.x2, c.y2, c.w, c.h
				};

				function ActivateClicks() {
					var formData_input = $('#new-member-profile-image').serializeArray();
					$('#new-member-profile-image').fileupload({
						dataType : 'json',
						formData : formData_input,
						done : function(e, data) {
							$.each(data.result.files, function(index, file) {
								jQuery('#member-profile-image').attr('src', 'http://localhost:8080/homeford/api/profileupload/picture/' + file.id);
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


				this.setMemberInfo = function(MemberInfo) {
					ACTIVEMEMBER = MemberInfo;
				}

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#member-edit').on('click', function() {
							if ($(".edit-form").valid()) {
								service.setUserProfile(jQuery('#member-id').val(), jQuery('#member-first-name').val(), jQuery('#member-last-name').val(), jQuery('#member-email').val(), "", {
									success : function(response) {
										if (response !== 'error') {
											notify.showNotification('OK', response.message);
										} else {
											notify.showNotification('ERROR', response.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
										}, 2000);
									}
								});
							}
						});

						jQuery('#member-profile-image').click(function() {
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
