//View that will drive the Students list page.

define(['modernizr', 'spin', 'plugins', 'cookie', 'carousel', 'swipe', '../app/service/DataService', '../app/Router'], function(modernizr, spin, plugins, cookie, carousal, swipe, service, router) {"use strict";

	var ClassView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
			};
			
			/**
			 * Constructor
			 */
			function ClassView() {

				function showBG() {
					jQuery.backstretch(PARMS.workBg);
				}

				//For Panels
				function populateClass() {
					service.getStudentObject(jQuery.cookie('subuser'), {
						success : function(StudentData) {
							console.log('StudentData');
							console.log(StudentData);
							//Create the student panels on the fly (DB should send this info per user/univ)
							var PanelTemplate = jQuery('#classboard-template').remove().attr('id', '');
							var COUNT = StudentData[0].activeassignments.length;
							for (var i = 0; i < COUNT; i++) {
								if (i === 0) {
									//Clear the list
									jQuery('#carousel').empty();
									jQuery('#carousel').append('<div class="empty"></div>');
								}
								var newboard = PanelTemplate.clone();
								jQuery('.class-name', newboard).text(StudentData[0].activeassignments[i].name);
								if (StudentData[0].activeassignments[i].assignmentmodel === 'task') {
									jQuery('.class-binder', newboard).attr('src', '../../univ/img/taskbook.jpg');
								}
								jQuery('.class-progress', newboard).text(StudentData[0].activeassignments[i].progress + '% Done');
								jQuery('.class-select', newboard).attr('name', StudentData[0].activeassignments[i].name);
								jQuery('#carousel').append(newboard);
								if (i === COUNT - 1) {
									jQuery('#carousel').append('<div class="empty"></div>');
									//Uncomment this if you want to load info sequentially from init
									//populateAvailableStudents();
									ActivatePanelEvents()
									createPanels();
								}
							}
						}
					});
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
									ActivateSelectEvents()
									//createPanels();
								}
							}
						}
					});
				}

				function createPanels() {
					var t = {
						lines : 17,
						length : 6,
						width : 4,
						radius : 12,
						rotate : 0,
						color : "#ccc",
						speed : 2.2,
						trail : 60,
						className : "spinner",
						zIndex : 2e9,
						top : "auto",
						left : "auto"
					};

					var n = document.getElementById("preloader");
					var r = (new Spinner(t)).spin(n);
					if (Modernizr.touch) {
						buildSwipe();
					} else {
						buildCarousal(n, r);
					}
					ActivatePanelEvents();
				}

				function buildCarousal(n, r) {
					function t(e) {
						e.find("a").stop().fadeTo(500, 0);
						e.addClass("selected");
						e.find("a").stop().addClass("selected");
						e.unbind("click")
					}


					jQuery("#wrapper").removeClass("hidden");
					jQuery("#wrapper-touch").remove();
					jQuery("#wrapper").waitForImages(function() {
						r.stop();
						jQuery("#wrapper").animate({
							opacity : 1
						}, 600)
					});

					jQuery("#carousel").carouFredSel({
						circular : !1,
						width : "100%",
						height : 490,
						items : 3,
						auto : !1,
						prev : {
							button : "#prev",
							key : "left"
						},
						next : {
							button : "#next",
							key : "right"
						},
						scroll : {
							items : 1,
							duration : 1e3,
							easing : "quadratic",
							onBefore : function(t, n) {
								t.find("a").stop().fadeTo(500, 1);
								t.removeClass("selected");
								t.find("a").removeClass("selected");
								t.prev().unbind("click");
								t.next().unbind("click");
								n.prev().click(function(t) {
									t.preventDefault();
									jQuery("#carousel").trigger("prev", 1)
								});
								n.next().click(function(t) {
									t.preventDefault();
									jQuery("#carousel").trigger("next", 1)
								})
							},
							onAfter : function(e, n) {
								t(n.eq(1))
							}
						},
						onCreate : function(n) {
							t(n.eq(1));
							jQuery("#carousel div.selected").next().click(function(t) {
								t.preventDefault();
								jQuery("#carousel").trigger("next", 1)
							})
						}
					})
				}

				function buildSwipe() {
					alert('swipe time');
				}

				function ActivatePanelEvents() {
					jQuery('.class-select').on('click', function() {
						if ($(this).hasClass('selected')) {
							var selectedQuiz = $(this).attr('name');
							jQuery.cookie('quiz', selectedQuiz, {
								path : '/',
								expires : 100
							});
							router.go('/quiz', '/class');
						}
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


				this.pause = function() {

				};

				this.resume = function() {
					showBG();
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						//Rich Experience First.... Load BG
						showBG();
						jQuery('#student-option-active').text(jQuery.cookie('subuser'));
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
