define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var ToDoAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var ActiveMembers = {};

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
						var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
						jQuery("#task-deadline").datepicker({
							minDate : 0,
							dateFormat : 'yy-mm-dd',
						});
						jQuery("#task-startdate").datepicker({
							minDate : 0,
							dateFormat : 'yy-mm-dd',
						});
						jQuery("#task-startdate").val(today);
						//jQuery("#task-deadline").val(next);
					}
					if (ActiveMembers.text) {
						jQuery('#member-list').val(ActiveMembers.text);
						if ($('.error:visible').length > 0) {
							validator.resetForm();
						}
					} else {
						jQuery('#member-list').val('None');
					}
					jQuery('#member-list').css('color', 'black');
				}


				$.validator.addMethod("validAssignment", function(value, element, param) {
					if ((jQuery('#member-list').val() == 'None' || jQuery('#member-list').val().charAt(0) === 0) && ((jQuery('#member-list').val().indexOf('User: ') === -1))) {
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
				};

				function clearform() {
					jQuery('input[type="text"]').val('');
					jQuery('input[type="date"]').val('');
					jQuery('textarea').val('');
					ActiveMembers = {};
					jQuery('#member-list').val('None');
					jQuery('#member-list').css('color', 'black');
				}


				this.pause = function() {

				};

				this.resume = function() {
					validator.resetForm();
					jQuery('.edit-notify').hide();
					populateData();
					document.title = 'Zingoare | ToDo Assign';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | ToDo Assign';

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
							if (jQuery('#member-list').val().indexOf('User: ') === -1) {
								router.go('/memberspick');
							}
						});

						jQuery.validator.addMethod("youtubeValid", function(value, element) {
							if (((value.indexOf('/') === -1) && (value.indexOf('.com') === -1) && (value.indexOf('htt') === -1) && (value.indexOf('www.') === -1)) || value.length === 0) {
								return true;
							} else
								return false;
						}, "Just provide youtubeID");

						jQuery.validator.addMethod("VideoExists", function(value, element) {
							var isSuccess = false;
							if (value.length > 0 && value.length < 13) {
								$.ajax({
									url : 'https://gdata.youtube.com/feeds/api/videos/' + value,
									type : 'GET',
									async : false,
									contentType : "application/json",
									success : function(msg) {
										isSuccess = msg ? true : false;
									}
								});
								return isSuccess;
							} else {
								return true;
							}
						}, "No Video on this ID");

						jQuery('#task-assign').on('click', function() {
							if ($(".edit-form").valid()) {
								var _tname = jQuery('#task-name').val();
								var _tdesc = jQuery('#task-desc').val();
								var _tfrom = jQuery('#task-startdate').val();
								var _tdue = jQuery('#task-deadline').val();
								if (_tfrom === '' || _tfrom === ' ') {
									var _tfrom = jQuery('#task-startdate').text();
									var _tdue = jQuery('#task-deadline').text();
								}
								var _tbenefit = jQuery('#task-benefit').val();
								var _tassignto = jQuery('#member-list').text();
								var _thelpurl = jQuery('#task-helper-url').val();
								var _thelpyoutube = jQuery('#task-helper-youtube').val();
								var _priority = jQuery('input[name=todopriority]:checked', '.edit-form').val();
								var _ids = ActiveMembers.list;
								//var _domainids;
								// service.returnDomainIDList({
								// success : function(data) {
								// _domainids = data;
								// }
								// });
								service.AssignToDo(service.domainNametoID(jQuery.cookie('subuser')), _ids, _tname, _tdesc, _priority, _tfrom, _tdue, _tbenefit, _thelpurl, _thelpyoutube, {
									success : function(data) {
										if (data.status !== 'error') {
											clearform();
											notify.showNotification('OK', data.message);
										} else {
											notify.showNotification('ERROR', data.message);
										}
										setTimeout(function() {
											//router.returnToPrevious();
											//admin.reloadData();
										}, 2000);
									}
								});
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery(".edit-form").validate({
							rules : {
								taskname : {
									required : true,
									maxlength : 30,
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
								taskhelperurl : {
									url : true,
								},
								taskhelperyoutube : {
									required : false,
									youtubeValid : true,
									VideoExists : true
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
