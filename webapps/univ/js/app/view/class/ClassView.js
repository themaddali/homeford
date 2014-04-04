define(['modernizr', 'jqueryui', 'spin', 'knob', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify', '../../view/quiz/QuizView'], function(modernizr, jqueryui, spin, knob, cookie, service, banner, router, notify, quizview) {"use strict";

	var ClassView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
			};
			var ACTIVESTUDENTNAME;
			var ACTIVESTUDENTID;

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
					if (!ACTIVESTUDENTNAME || ACTIVESTUDENTNAME === "" || ACTIVESTUDENTNAME === null) {
						router.go('/studentlist');
					} else {
						jQuery('.subtitleinfo').text(ACTIVESTUDENTNAME);
						var list = service.returnDomainIDList();
						service.MemberToDoList(list[0], ACTIVESTUDENTID, {
							success : function(StudentData) {
								var PanelTemplate = jQuery('#class-template').remove().attr('id', '');
								//BackingUp
								jQuery('.div-template').append(PanelTemplate.attr('id', 'class-template'));
								var COUNT = StudentData.length;
								if (COUNT === 0) {
									jQuery('#noinfo').fadeIn(1000);
								} else {
									jQuery('#noinfo').hide();
								}
								for (var i = 0; i < COUNT; i++) {
									jQuery('.metainfo').text(COUNT + ' Tasks');
									var newboard = PanelTemplate.clone();
									jQuery('.class-name', newboard).text(StudentData[i].title);
									jQuery('.class-progress', newboard).progressbar();
									var value = parseInt(StudentData[i].percentage);
									jQuery('.class-progress', newboard).progressbar("value", value).removeClass("beginning middle end").addClass(value < 31 ? "beginning" : value < 71 ? "middle" : "end");
									jQuery('.class-progress-label', newboard).text(StudentData[i].percentage + '% Done');
									jQuery('.class-select', newboard).attr('name', StudentData[i].title);
									if (StudentData[i].todoEndDate) {
										jQuery('.due-date', newboard).text(StudentData[i].todoEndDate.split(' ')[0]);
									}
									if (StudentData[i].todoStartDate) {
										jQuery('.start-date', newboard).text(StudentData[i].todoStartDate.split(' ')[0]);
									}
									//jQuery('.class-anouncement', newboard).text(StudentData[i].desc);
									newboard.attr('name', StudentData[i].id);
									jQuery('.footer', newboard).text('last worked on: ' + StudentData[i].lastUpdated);
									jQuery('#class-canvas').append(newboard);
									if (i === COUNT - 1) {
										helperMediaQuiries();
										ActivatePanelEvents()
									}
								}
							}
						});
					}
				}

				function ActivatePanelEvents() {
					jQuery('.classboard').on('click', function() {
						var selectedQuiz = {};
						selectedQuiz.name = $(this).find('.class-name').text();
						selectedQuiz.progress = $(this).find('.class-progress-label').text().split("%")[0];
						selectedQuiz.id = $(this).attr('name');
						selectedQuiz.dueby = $(this).find('.due-date').text();
						selectedQuiz.memberid = ACTIVESTUDENTID;
						quizview.activeTask(selectedQuiz);
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

				function helperMediaQuiries() {
					if ($('.classboard').length > 4) {
						var width = $('#class-canvas').width() - 30;
						var rowholds = Math.floor(width / 304);
						var fillerspace = width - (rowholds * 304);
						//var eachfiller = 300+fillerspace/rowholds;
						var newmargin = fillerspace / rowholds;
						if (newmargin < 10) {
							newmargin = 10;
						}
						$('.classboard').css('margin-left', newmargin / 2);
						$('.classboard').css('margin-right', newmargin / 2);
					}
				}


				this.activeStudent = function(activename, activeid) {
					ACTIVESTUDENTNAME = activename;
					ACTIVESTUDENTID = activeid;
				}

				this.pause = function() {

				};

				this.resume = function() {
					jQuery('.edit-notify').hide();
					banner.HideAlert();
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
						jQuery('#user-name').on('click', function(e) {
							banner.ShowUser();
							jQuery('#signout').on('click', function(e) {
								banner.logout();
							});
							jQuery('#banner-dashboard').on('click', function(e) {
								banner.HideUser();
								router.go('/admin');
							});
							jQuery('.userflyout').mouseleave(function() {
								setTimeout(function() {
									banner.HideUser();
								}, 500);
							});
						});

						$(window).resize(helperMediaQuiries);
						// When the browser changes size

						jQuery('#alert').on('click', function(e) {
							banner.ShowAlert();
							jQuery('.alertflyout').mouseleave(function() {
								setTimeout(function() {
									banner.HideAlert();
								}, 500);
							});
							jQuery('.flyout-label').text(notify.getNotifications().length + ' Notifications');
						});
						jQuery('.goback').click(function() {
							router.go('/studentlist');
						});
						jQuery('.mainlogo').click(function() {
							router.go('/studentlist');
						});
					} // Cookie Guider
				};

			}

			return ClassView;
		}());

	return new ClassView();
});
