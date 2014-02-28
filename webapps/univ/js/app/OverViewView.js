//View that will drive the Students list page.

define(['../../js/lib/modernizr-2.5.3.min', '../../js/lib/jquery.cookie', '../app/service/DataService', '../../js/lib/jquery.validate.min'], function(modernizr, cookie, service, validate) {"use strict";

	var SubUserView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function SubUserView() {

				jQuery(document).ready(function(e) {

					setTimeout(function() {
						service.getUnivObject({
							success : function(UnivData) {
								//OverView Panel Load
								jQuery('#univ-name').val(UnivData[0].univname);
								jQuery('#univ-id').val(UnivData[0].id);
								jQuery('#univ-about').val(UnivData[0].about);
								jQuery('#univ-admin').val(UnivData[0].adminname);
								jQuery('#univ-created').val(UnivData[0].created);
								jQuery('#univ-email').val(UnivData[0].email);
								jQuery('#univ-phone').val(UnivData[0].phone);
								jQuery('#univ-address').val(UnivData[0].address);
								jQuery('#univ-faculty').val(UnivData[0].faculty.length);
								jQuery('#univ-students').val(UnivData[0].students.length);

								//Student Manage Panel Load
								var studentmintemplate = jQuery('#students-list-min-template').remove().attr('id', '');
								var COUNT = UnivData[0].students.length;

							}
						});
					}, 500);

					if (!jQuery.cookie('user') || jQuery.cookie('user') === 'home') {
						var currentlocation = window.location.href;
						jQuery.removeCookie('user', {
							path : '/univ'
						});
						window.location.assign('/univ');
					}

					jQuery('#overview-edit-modal-close').on('click', function() {
						window.location.assign('/univ/module/admin');
					});

					jQuery('#overview-edit').on('click', function() {
						if ($("#overview-edit-form").valid()) {
							window.location.assign('/univ/module/admin');
						}
					});

					$("#overview-edit-form").validate({
						rules : {
							univname : {
								required : true,
								minlength : 3
							},
							univid : {
								required : true,
							},
							univadmin : {
								required : true,
							},
							univcreated : {
								required : true,
								date : true
							},
							univemail : {
								required : true,
								email : true
							},
							univphone : {
								required : true,
								digits : true
							},
						}
					});

				});

				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					//To Drive from Outside Calls
				};

			}

			return SubUserView;
		}());

	return new SubUserView();
});
