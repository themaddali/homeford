//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

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
						document.getElementById('task-startdate').type = 'date';
					} else {
						var date = new Date();
						var today = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
						var next = (date.getMonth() + 2) + '/' + date.getDate() + '/' + date.getFullYear();
						jQuery("#task-deadline").datepicker({
							minDate : 0,
						});
						jQuery("#task-startdate").datepicker({
							minDate : 0,
						});
						jQuery("#task-startdate").val(today);
						//jQuery("#task-deadline").val(next);
					}
					if (ActiveMembers.text) {
						jQuery('#member-list').val(ActiveMembers.text);
						validator.resetForm();
					} else {
						jQuery('#member-list').val('None');
					}
					jQuery('#member-list').css('color', 'black');
				}

				// function validAssignment() {
				// if (jQuery('#member-list').text() == 'None' || jQuery('#member-list').text().indexOf("0 of") !== -1) {
				// jQuery('#member-list').css('color', 'red');
				// return false;
				// } else {
				// jQuery('#member-list').css('color', 'black');
				// return true;
				// }
				// }

				$.validator.addMethod("validAssignment", function(value, element, param) {
					if (jQuery('#member-list').val() == 'None' || jQuery('#member-list').val().indexOf("0 of") !== -1) {
						jQuery('#member-list').css('color', 'red');
						return false;
					} else {
						jQuery('#member-list').css('color', 'black');
						return true;
					}
				}, 'Select to whom to assign.');

				this.selectedMembers = function(selection) {
					ActiveMembers = selection;
					jQuery('#member-list').css('color', 'black');
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
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
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
						jQuery('#task-startdate').focus(function() {
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
								var _tfrom = jQuery('#task-startdate').val();
								var _tdue = jQuery('#task-deadline').val();
								var _tbenefit = jQuery('#task-benefit').val();
								var _tassignto = jQuery('#member-list').text();
								var _thelpurl = jQuery('#task-helper-url').val();
								var _thelpyoutube = jQuery('#task-helper-youtube').val();
								var _priority = jQuery('input[name=todopriority]:checked', '.edit-form').val();
								var _ids = ActiveMembers.list;
								var _domainids;
								service.returnDomainIDList({
									success : function(data) {
										_domainids = data;
									}
								});
								service.AssignToDo(_domainids[0], _ids, _tname, _tdesc, _priority, _tfrom, _tdue, _tbenefit, _thelpurl, _thelpyoutube, {
									success : function(data) {
										if (data.status !== 'error') {
											notify.showNotification('OK', data.message);
										} else {
											notify.showNotification('ERROR', data.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
											//admin.reloadData();
										}, 3000);
									}
								});
							}
							//Need to update to handler
						});

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
								assignedto : {
									required : true,
									validAssignment : true,
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
