define(['modernizr', 'jqueryui', 'spin', 'plugins', 'cookie', '../../service/DataService', '../../Router', '../../Notify','../../view/quiz/QuizView'], function(modernizr, jqueryui, spin, plugins, cookie, service, router, notify, quizview) {"use strict";

	var ClassView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
			};
			var ACTIVESTUDENT;

			/**
			 * Constructor
			 */
			function ClassView() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				//For Panels
				function populateClass() {
					jQuery('#class-canvas').empty();
					if (!ACTIVESTUDENT || ACTIVESTUDENT == "") {
						router.go('/studentlist');
					} else {
						jQuery('.subtitleinfo').text(ACTIVESTUDENT);
						service.getStudentObject(ACTIVESTUDENT, {
							success : function(StudentData) {
								//Create the student panels on the fly (DB should send this info per user/univ)
								var PanelTemplate = jQuery('#class-template').remove().attr('id', '');
								//BackingUp
								jQuery('.div-template').append(PanelTemplate.attr('id', 'class-template'));
								var COUNT = StudentData[0].activeassignments.length;
								for (var i = 0; i < COUNT; i++) {
									jQuery('.metainfo').text(COUNT + ' Tasks');
									var newboard = PanelTemplate.clone();
									jQuery('.class-name', newboard).text(StudentData[0].activeassignments[i].name);
									if (StudentData[0].activeassignments[i].assignmentmodel === 'task') {
										//jQuery('.class-binder', newboard).attr('src', 'img/taskbook.jpg');
									}
									jQuery('.class-progress', newboard).progressbar();
									var value = parseInt(StudentData[0].activeassignments[i].progress);
									jQuery('.class-progress', newboard).progressbar("value", value).removeClass("beginning middle end").addClass(value < 31 ? "beginning" : value < 71 ? "middle" : "end");
									jQuery('.class-progress-label', newboard).text(StudentData[0].activeassignments[i].progress + '% Done');
									jQuery('.class-select', newboard).attr('name', StudentData[0].activeassignments[i].name);
									jQuery('#class-canvas').append(newboard);
									if (i === COUNT - 1) {
										ActivatePanelEvents()
									}
								}
							}
						});
					}
				}

				//For Drop Down List
				//Not being used.
				function populateAvailableStudents() {
					service.getUnivObject({
						success : function(UnivData) {
							console.log('UnivData');
							console.log(UnivData);
							//Create the student panels on the fly (DB should send this info per user/univ)
							var COUNT = UnivData[0].students.length;
							for (var i = 0; i < COUNT; i++) {
								if (i === 0) {
									//Clear the list
									jQuery('#student-options').empty();
								}
								var newoption = DropTemplate.clone();
								jQuery('.student-option', newoption).text(UnivData[0].students[i].name);
								jQuery('#student-options').append(newoption);
								if (i === COUNT - 1) {
									jQuery('#student-options').append('<li class="back"><a href="#/studentlist">Back to Student List</a></li>');
									jQuery('#student-option-active').text(jQuery.cookie('subuser'));
									ActivatePanelEvents();
									//createPanels();
								}
							}
						}
					});
				}

				function ActivatePanelEvents() {
					jQuery('.classboard').on('click', function() {
						var selectedQuiz = $(this).find('.class-name').text();
						quizview.activeTask(selectedQuiz);
						// jQuery.cookie('quiz', selectedQuiz, {
						// path : '/',
						// expires : 100
						// });
						router.go('/quiz', '/class');
					});

				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						jQuery('#loggedin-user').text(jQuery.cookie('user'));
						return true;
					} else {
						router.go('/home', '/class');
						return false;
					}
				}

				function displayAlert() {
					//This should never show up.
					alert('Error in Loading! Please Refresh the page!');
				}


				this.activeStudent = function(activedata) {
					ACTIVESTUDENT = activedata;
				}

				this.pause = function() {

				};

				this.resume = function() {
					showBG();
					populateClass();
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						//Rich Experience First.... Load BG
						showBG();
						populateClass();

						//HTML Event - Actions
						jQuery('#loggedin-user').on('click', function() {
							router.go('/admin', '/class');
						});

						jQuery('.student-option').on('click', function() {
							alert('Work in Progress');
						});

					} // Cookie Guider
				};

			}

			return ClassView;
		}());

	return new ClassView();
});
