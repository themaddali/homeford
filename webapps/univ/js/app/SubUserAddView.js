//View that will drive the Students list page.

define(['../../js/lib/modernizr-2.5.3.min', '../../js/lib/jquery.cookie', '../app/service/DataService', '../../js/lib/jquery.validate.min'], function(modernizr, cookie, service, formvalidate) {"use strict";

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
								jQuery('.univ-name').text(UnivData[0].univname);
								jQuery('.univ-id').text(UnivData[0].id);
								jQuery('.univ-about').text(UnivData[0].about);
								jQuery('.univ-admin').text(UnivData[0].adminname);
								jQuery('.univ-created').text(UnivData[0].created);
								jQuery('.univ-email').text(UnivData[0].email);
								jQuery('.univ-phone').text(UnivData[0].phone);
								jQuery('.univ-address').text(UnivData[0].address);
								jQuery('.univ-faculty').text(UnivData[0].faculty.length);
								jQuery('.univ-students').text(UnivData[0].students.length);

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

					jQuery('#student-add-modal-close').on('click', function() {
						window.location.assign('/univ/module/admin');
					});

					jQuery('#student-add-submit').on('click', function() {
						if ($("#add-form").valid())
						{
							window.location.assign('/univ/module/admin');
						}
					});
					
					$("#add-form").validate({
						rules : {
							studentname : {
								required : true,
								minlength : 3
							},
							studentid : {
								required : true,
							},
							studentdob : {
								required : true,
								date: true
							},
							studentemail : {
								email : true
							},
							studentphone : {
								digits : true
							},
							studentescalation : {
								required : true
							},
							studentescalationemail : {
								required : true,
								email : true
							},
							studentescalationphone : {
								required : true,
								digits : true
							},
							studentescalationbackupphone : {
								required : true,
								digits : true
							},
							studentescalationbackupemail : {
								required : true,
								email : true
							},
						}
					});

				});

				// mouse is over a form element
				function onOverContent(event) {
					var messageContainer = $('.form-guide', event.target);
					messageContainer.toggleClass('hp-empty', $.grep(messageContainer.children(), function(e) {
						return ('none' !== $(e).css('display') && 'hidden' !== $(e).css('visibility'));
					}).length === 0);
				}


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
