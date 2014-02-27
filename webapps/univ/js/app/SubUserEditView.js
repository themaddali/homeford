//View that will drive the Students list page.

define(['../../js/lib/modernizr-2.5.3.min', '../../js/lib/jquery.cookie', '../app/service/DataService'], function(modernizr, cookie, service) {"use strict";

	var SubUserView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function SubUserView() {

				jQuery(document).ready(function(e) {
					$('.edit-form .form-item').on('mouseover', onOverContent);
					$('.edit-form .form-item').on('focus', onOverContent);

					if (!jQuery.cookie('user') || jQuery.cookie('user') === 'home') {
						var currentlocation = window.location.href;
						jQuery.removeCookie('user', {
							path : '/univ'
						});
						window.location.assign('/univ');
					}

					jQuery('#student-edit-modal-close').on('click', function() {
						window.location.assign('/univ/module/admin');
					});

				});

				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					//To Drive from Outside Calls
				};

				this.loadData = function(studentname) {
					service.getStudentObject(studentname,{
							success : function(StudentData) {
								//OverView Panel Load
								console.log('Edit Student -'+ StudentData);
								jQuery('#student-name').text('T'+StudentData[0].name);
								jQuery('#student-name').val('V'+StudentData[0].name);
								// jQuery('.univ-id').text(UnivData[0].id);
								// jQuery('.univ-about').text(UnivData[0].about);
								// jQuery('.univ-admin').text(UnivData[0].adminname);
								// jQuery('.univ-created').text(UnivData[0].created);
								// jQuery('.univ-email').text(UnivData[0].email);
								// jQuery('.univ-phone').text(UnivData[0].phone);
								// jQuery('.univ-address').text(UnivData[0].address);
								// jQuery('.univ-faculty').text(UnivData[0].faculty.length);
								// jQuery('.univ-students').text(UnivData[0].students.length);

								//Student Manage Panel Load
								// var studentmintemplate = jQuery('#students-list-min-template').remove().attr('id', '');
								// var COUNT = UnivData[0].students.length;

							}
						});
				}
			}

			return SubUserView;
		}());

	return new SubUserView();
});
