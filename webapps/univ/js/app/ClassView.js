//View that will drive the Students list page.

define(['../../js/lib/modernizr-2.5.3.min', '../../js/lib/spin.min', '../../js/lib/plugins-min', '../../js/lib/jquery.cookie', '../../js/lib/jquery.carousel.min', '../app/service/DataService'], function(modernizr, spin, plugins, cookie, carousel, service) {"use strict";

	var ClassView = ( function() {

			var work_script_params = {
				"workBg" : "..\/..\/img\/classbg.png",
				"carouselurl" : "..\/..\/js\/lib\/jquery.carousel.min.js",
				"swipejsurl" : "..\/..\/js\/lib\/swipe.min.js"
			};
			var LOCKPANEL = '<i class="icon-lock  icon-1x "></i>'
			var UNLOCKPANEL = '<i class="icon-unlock  icon-1x "></i>'

			/**
			 * Constructor
			 */
			function ClassView() {
				$(document).ready(function(e) {

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
					}, n = document.getElementById("preloader"), r = (new Spinner(t)).spin(n);
					e.backstretch(work_script_params.workBg);
					var i = e(window).height(), s = e("#contact-modal").height(), o = i / 2 - s / 2;
					e("a[rel*=theModal]").leanModal({
						top : o,
						overlay : .7,
						closeButton : ".modal_close"
					});

					if (!jQuery.cookie('user')) {
						var currentlocation = window.location.href;
						window.location.assign('/univ');
					} else {
						if (jQuery.cookie('subuser')) {
							jQuery('#loggedin-user').text(jQuery.cookie('user') + '>' + jQuery.cookie('subuser'));
						}
					}

					jQuery('#loggedin-user').on('click', function(e) {
						e.preventDefault();
						var currentlocation = window.location.href;
						window.location.assign('/univ/module/admin');
					});

					setTimeout(function() {
						service.getStudentObject(jQuery.cookie('subuser'), {
							success : function(StudentData) {
								console.log(StudentData);
								//Create the student panels on the fly (DB should send this info per user/univ)
								var template = jQuery('#classboard-template').remove().attr('id', '');
								var COUNT = StudentData[0].activeassignments.length;
								for (var i = 0; i < COUNT; i++) {
									var newboard = template.clone();
									jQuery('.class-name', newboard).text(StudentData[0].activeassignments[i].name);
									if (StudentData[0].activeassignments[i].assignmentmodel === 'task') {
										jQuery('.class-binder', newboard).attr('src', '../../img/taskbook.jpg');
									}
									jQuery('.class-progress', newboard).text(StudentData[0].activeassignments[i].progress + '% Done');
									jQuery('.class-select', newboard).attr('name', StudentData[0].activeassignments[i].name);
									jQuery('#carousel').append(newboard);
									if (i === COUNT - 1) {
										jQuery('#carousel').append('<div class="empty"></div>');
										populateStudentOptions();
									}
								}
							}
						});
						
					}, 0);

					function loadPage() {
						Modernizr.load({
							test : Modernizr.touch,
							yep : {
								loadSwipejs : work_script_params.swipejsurl
							},
							nope : {
								loadCarousel : work_script_params.carouselurl
							},
							callback : {
								loadSwipejs : function(t, n, i) {
									jQuery(function() {
										e("#wrapper-touch").removeClass("hidden");
										e("#wrapper").remove();
										var t = new Swipe(document.getElementById("wrapper-touch"), {
											speed : 500,
											callback : function(e, t, n) {
											}
										});
										e("a#prev").click(function() {
											t.prev()
										});
										e("a#next").click(function() {
											t.next()
										});
										e(window).resize(function() {
											e(window).width() > 480 ? e("#slider-container").css({
												top : e(window).height() / 2 - 225 + "px"
											}) : e("#slider-container").css({
												top : "80px"
											})
										}).resize();
										e("#wrapper-touch").waitForImages(function() {
											r.stop();
											e("#wrapper-touch").animate({
												opacity : 1
											}, 600)
										})
									})
								},
								loadCarousel : function(t, n, i) {
									jQuery(function() {
										function t(e) {
											e.find("a").stop().fadeTo(500, 0);
											e.addClass("selected");
											e.find("a").stop().addClass("selected");
											e.unbind("click")
										}


										e("#wrapper").removeClass("hidden");
										e("#wrapper-touch").remove();
										e("#wrapper").waitForImages(function() {
											r.stop();
											e("#wrapper").animate({
												opacity : 1
											}, 600)
										});
										e(function() {
											e("#carousel").carouFredSel({
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
															e("#carousel").trigger("prev", 1)
														});
														n.next().click(function(t) {
															t.preventDefault();
															e("#carousel").trigger("next", 1)
														})
													},
													onAfter : function(e, n) {
														t(n.eq(1))
													}
												},
												onCreate : function(n) {
													t(n.eq(1));
													e("#carousel div.selected").next().click(function(t) {
														t.preventDefault();
														e("#carousel").trigger("next", 1)
													})
												}
											})
										})
									})
								}
							}
						})
						activateEvents();
					}
					
					function populateStudentOptions() {
						service.getUnivObject({
							success : function(UnivData) {
								console.log(UnivData);
								//Create the student panels on the fly (DB should send this info per user/univ)
								var droptemplate = jQuery('#student-option-template').remove().attr('id', '');
								var COUNT = UnivData[0].students.length;
								for (var i = 0; i < COUNT; i++) {
									var newoption = droptemplate.clone();
									jQuery('.student-option', newoption).text(UnivData[0].students[i].name);
									jQuery('#student-options').append(newoption);
									if (i === COUNT - 1) {
										jQuery('#student-options').append('<li class="back"><a href="../../module/studentlist">Back to Student List</a></li>');
										jQuery('#student-option-active').text(jQuery.cookie('subuser'));
										loadPage();
									}

								}
							}
						});
					}

					function activateEvents() {
						$('.class-select').on('click', function() {
							if ($(this).hasClass('selected')) {
								var selectedQuiz = $(this).attr('name');
								jQuery.cookie('quiz', selectedQuiz, {
									path : '/',
									expires : 100
								});
								window.location.assign('/univ/module/quiz');
							}
						});

						$('.student-option').click(function() {
							var selectedStudent = $(this).text();
							userChange(jQuery.cookie('subuser'), selectedStudent);
						});
					};

					function userChange(currentuser, newuser) {
						// Accept the current user and next
						// Push it to DB
						// Adjust the cookies.
						jQuery.cookie('subuser', newuser, {
							path : '/',
							expires : 100
						});
						jQuery('#student-option-active').text(jQuery.cookie('subuser'));
						location.reload();
					}

				});

				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					//To Drive from Outside Calls
				};

			}

			return ClassView;
		}());

	return new ClassView();
});
