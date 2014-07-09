define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/quizpool/QuestionAddView'], function(modernizr, cookie, service, validate, router, notify, admin, questionassign) {"use strict";

	var QuizAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var allQUIZ;
			var QUIZLIST = [];
			var QUIZLIST_sorted = [];
			var ActiveMembers = 'All Members';

			function QuizAssignView() {

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
					if (ActiveMembers.text && ActiveMembers.text !== null) {
						jQuery('#member-list').css('color', 'black');
						jQuery('#member-list').val(ActiveMembers.text);
					} else {
						jQuery('#member-list').val('None');
						QUIZLIST = [];
						QUIZLIST_sorted = [];
						jQuery('#quiz-name').empty().append('<option>None Selected</option>');
						jQuery('#quiz-name').val('');
						jQuery('#quiz-desc').val('');
						if (Modernizr.touch && Modernizr.inputtypes.date) {
							document.getElementById('task-deadline').type = 'date';
							document.getElementById('task-startdate').type = 'date';
						} else {
							var date = new Date();
							var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
							//var next = (date.getMonth() + 2) + '/' + date.getDate() + '/' + date.getFullYear();
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
						jQuery('#member-list').css('color', 'black');
						//var activedomains = admin.getActiveDomainsIDs();
					var activedomains = [];
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
						if (activedomains.length === 0) {
							router.go('/admin');
						}
						for (var i = 0; i < activedomains.length; i++) {
							var thisdomaininstance = activedomains[i];
							service.DomainQuizList(thisdomaininstance, {
								success : function(data) {
									allQUIZ = data;
									for (var k = 0; k < data.length; k++) {
										QUIZLIST.push(data[k].name);
										QUIZLIST_sorted.push(data[k].name);
										if (QUIZLIST.length === 0) {
											notify.showNotification('WARN', "There are no quiz's availble in Quiz pool. First add few Quiz'z and Questions.",'quizadd');
										}
										if (k === data.length - 1) {
											QUIZLIST_sorted.sort();
											$.each(QUIZLIST_sorted, function(index, quiz) {
												jQuery('#quiz-name').append('<option>' + quiz + '</option>');
											});
										}
									}
									//Commenting out the autoFill to go with select
									// if (data !== 'error') {
									// $("#quiz-name").autocomplete({
									// source : function(request, response) {
									// var results = $.ui.autocomplete.filter(QUIZLIST, request.term);
									// response(results.slice(0, 5));
									// },
									// select : function(event, ui) {
									// var origEvent = event;
									// while (origEvent.originalEvent !== undefined)
									// origEvent = origEvent.originalEvent;
									// if (origEvent.type == 'keydown')
									// $("#quiz-name").keyup();
									// },
									// });
									// }
								}
							});
						}
					}
				}


				$.validator.addMethod("validAssignment", function(value, element, param) {
					if (jQuery('#member-list').val() == 'None' || jQuery('#member-list').val().indexOf("0 of") !== -1) {
						jQuery('#member-list').css('color', 'red');
						return false;
					} else {
						jQuery('#member-list').css('color', 'black');
						return true;
					}
				}, 'Select to whom to assign.');

				$.validator.addMethod("validQuiz", function(value, element, param) {
					// if (QUIZLIST.indexOf(jQuery('#quiz-name').val()) === -1) {
					// return false;
					// } else {
					// return true;
					// }
					if (jQuery('#quiz-name').val() === 'None Selected') {
						return false;
					} else {
						return true;
					}
				}, 'Select a valid Quiz');

				this.pause = function() {

				};

				this.selectedMembers = function(selection) {
					ActiveMembers = selection;
					jQuery('#member-list').css('color', 'black');
				};

				this.resume = function() {
					validator.resetForm();
					populateData();
					jQuery('.edit-notify').hide();
					//$("#quiz-name").autocomplete("destroy");
					document.title = 'Zingoare | Quiz Assign';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Quiz Assign';

					if (checkForActiveCookie() === true) {
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.go('/admin');
						});

						jQuery("#quiz-name").change(function() {
							var _name = jQuery("#quiz-name").val();
							var _index = QUIZLIST.indexOf(_name);
							if (allQUIZ[_index]) {
								jQuery("#quiz-desc").val(allQUIZ[_index].description);
								jQuery("#quiz-name").attr('quizid', allQUIZ[_index].id);
							} else {
								jQuery("#quiz-desc").val('');
								jQuery("#quiz-name").attr('quizid', '');
							}
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

						jQuery('#quiz-assign').on('click', function() {
							if ($(".edit-form").valid()) {
								var _qname = jQuery('#quiz-name').val();
								var _qid = jQuery('#quiz-name').attr('quizid');
								var _qdesc = jQuery('#quiz-desc').val();
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
								var _domainids;
								// service.returnDomainIDList({
									// success : function(data) {
										// _domainids = data;
									// }
								// });
								service.AssignQuiz(service.domainNametoID(jQuery.cookie('subuser')), _qid, _ids, _qname, _qdesc, _priority, _tfrom, _tdue, _tbenefit, _thelpurl, _thelpyoutube, {
									success : function(data) {
										if (data.status !== 'error') {
											notify.showNotification('OK', data.message);
											var ActiveMembers = 'All Members';
											ActiveMembers.text = null;
											setTimeout(function() {
												router.go('/admin');
											}, 2000);
										} else {
											notify.showNotification('ERROR', data.message);
										}
									}
								});
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery(".edit-form").validate({
							rules : {
								quizname : {
									required : true,
									validQuiz : true,
									maxlength: 30,
								},
								quizdesc : {
									required : false,
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

			return QuizAssignView;
		}());

	return new QuizAssignView();
});
