//View that will drive the Students list page.

define(['jquery', 'modernizr', 'cookie', 'jqueryui', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify', '../app/AdminView'], function(jQuery, modernizr, cookie, jqueryui, service, validate, router, notify, admin) {"use strict";

	var ToDoAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var ActiveMembers = 'All Members';

			function ToDoAssignView() {

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
					if (Modernizr.touch && Modernizr.inputtypes.date) {
						document.getElementById('task-deadline').type = 'date';
					} else {
						jQuery("#task-deadline").datepicker({
							minDate : 0
						});
					}
					jQuery('#member-list').text(ActiveMembers);
				}


				this.selectedMembers = function(info) {
					ActiveMembers = info;
				}

				this.pause = function() {

				};

				this.resume = function() {
					populateData();

				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						//JQ UI Bug of -Index.
						jQuery('#task-deadline').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});

						jQuery('#member-list').click(function() {
							router.go('/memberspick');
						});

						jQuery('#task-assign').on('click', function() {
							if ($(".edit-form").valid()) {
								var _tname = jQuery('#task-name').val();
								var _tdesc = jQuery('#task-desc').val();
								var _tdue = jQuery('#task-deadline').val();
								var _tbenefit = jQuery('#task-benefit').val();
								var _tassignto = jQuery('#member-list').text();
								var _priority = jQuery('input[name=todopriority]:checked', '.edit-form').val();
								console.log('Create Now');
							}

							//Need to update to handler
						});

						jQuery('#profile-password').change(function() {
							jQuery('#password-reenter-item').show();
						});

						jQuery.validator.addMethod("notRepeated", function(value, element) {
							if (pendingList) {
								if (pendingList.indexOf(value) === -1) {
									return true;
								} else
									return false;
							} else
								return true;

						}, "This email already has a request pending.");

						validator = jQuery(".edit-form").validate({
							rules : {
								taskname : {
									required : true,
								},
								taskdesc : {
									required : true,
								},
								taskdeadline : {
									required : true,
								},
								todopriority : {
									required : true,
								},
							}
						});

					} // Cookie Guider
				};

			}

			return ToDoAssignView;
		}());

	return new ToDoAssignView();
});
