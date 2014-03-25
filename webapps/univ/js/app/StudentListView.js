//View that will drive the Students list page.

define(['modernizr', 'spin', 'plugins', 'cookie', '../app/service/DataService', '../app/Router', '../app/Notify'], function(modernizr, spin, plugins, cookie, service, router, notify) {"use strict";

	var StudentListView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
				"carouselurl" : "js\/lib\/jquery.carousel.min.js",
				"swipejsurl" : "js\/lib\/swipe.min.js"
			};
			var LOCKPANEL = '<i class="icon-lock  icon-1x "></i>'
			var UNLOCKPANEL = '<i class="icon-unlock  icon-1x "></i>'

			/**
			 * Constructor
			 */
			function StudentListView() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				function populateStudentList() {
					service.getUnivObject({
						success : function(UnivData) {
							console.log('UnivData');
							console.log(UnivData);

							//Create the student panels on the fly (DB should send this info per user/univ)
							var template = jQuery('#student-template').remove().attr('id', '');
							var COUNT = UnivData[0].students.length;
							for (var i = 0; i < COUNT; i++) {
								var newboard = template.clone();
								jQuery('.student-name', newboard).text(UnivData[0].students[i].name);
								jQuery('.student-headshot', newboard).attr('src', UnivData[0].students[i].image);
								jQuery('.student-select', newboard).attr('name', UnivData[0].students[i].name);
								if (UnivData[0].students[i].security === true) {
									jQuery('.student-name', newboard).prepend(LOCKPANEL);
									jQuery('.student-select', newboard).attr('security', UnivData[0].students[i].security);
								}
								if (UnivData[0].students[i].security !== true) {
									jQuery('.student-name', newboard).prepend(UNLOCKPANEL);
								}
								for (var j = 0; j < UnivData[0].students[i].courses.length; j++) {
									if (j < 2) {
										jQuery('.student-info', newboard).append("<li>" + UnivData[0].students[i].courses[j].name + "</li>");
									}
									if (j == 2 && UnivData[0].students[i].courses.length > 3) {
										jQuery('.student-info', newboard).append("<li>" + UnivData[0].students[i].courses[j].name + " ..... and " + (UnivData[0].students[i].courses.length - 2) + " more</li>");
									}
								}

								jQuery('#card-canvas').append(newboard);
								if (i === COUNT - 1) {
									//jQuery('#carousel').append('<div class="empty"></div>');
									//createPanels();
									if (COUNT > 14) {
										jQuery('#searchbar').addClass('active');
									} else {
										jQuery('#searchbar').removeClass('active');
									}
									//jQuery('#card-canvas').append(createnewboard);
									jQuery("#preloader").hide();
									ActivatePanelEvents();
								}
								if (COUNT === 0) {
									//No Need of selection. ONly Student so take in to class zone.
									jQuery.cookie('sub-user', UnivData[0].students[i].name, {
										expires : 100
									});
									router.go('/class', 'studentlist');
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
					Modernizr.load({
						test : Modernizr.touch,
						yep : {
							loadSwipejs : PARMS.swipejsurl
						},
						nope : {
							loadCarousel : PARMS.carouselurl
						},
						callback : {
							loadSwipejs : function(t, n, i) {
								jQuery(function() {
									jQuery("#wrapper-touch").removeClass("hidden");
									jQuery("#wrapper").remove();
									var t = new Swipe(document.getElementById("wrapper-touch"), {
										speed : 500,
										callback : function(e, t, n) {
										}
									});
									jQuery("a#prev").click(function() {
										t.prev()
									});
									jQuery("a#next").click(function() {
										t.next()
									});
									jQuery(window).resize(function() {
										jQuery(window).width() > 480 ? e("#slider-container").css({
											top : jQuery(window).height() / 2 - 225 + "px"
										}) : jQuery("#slider-container").css({
											top : "80px"
										})
									}).resize();
									jQuery("#wrapper-touch").waitForImages(function() {
										r.stop();
										jQuery("#wrapper-touch").animate({
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


									jQuery("#wrapper").removeClass("hidden");
									jQuery("#wrapper-touch").remove();
									jQuery("#wrapper").waitForImages(function() {
										r.stop();
										jQuery("#wrapper").animate({
											opacity : 1
										}, 600)
									});
									jQuery(function() {
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
									})
								})
							}
						}
					})
					//Activate the events for lazy DOM elemets.
					ActivatePanelEvents();
				}

				function ActivatePanelEvents() {
					jQuery('.studentboard').on('click', function() {
						// successful selection of user for context, and create cookie
						var selectedUser = $(this).find('.student-name').text();
						var selectedUserSecurity = $(this).attr('security');
						if (selectedUserSecurity !== "true") {
							jQuery.cookie('subuser', selectedUser, {
								path : '/',
								expires : 100
							});
							router.go('/class', '/studentlist');
						} else {
							jQuery.cookie('subuser', selectedUser, {
								path : '/',
								expires : 100
							});
							router.go('/class', '/studentlist');
						}
					});
				};

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						jQuery('#user-name-value').text(jQuery.cookie('user').split('@')[0]);
						return true;
					} else {
						router.go('/home', '/studentlist');
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
						populateStudentList();
						
						setTimeout (function(){
							notify.showMessage('INFO','I am testing this big long ajdfhkasdjflksd jfgjn jn jn jfn ','admin');
						}, 5000);

						//HTML Event - Actions
						jQuery('.user-info').on('click', function(e) {
							router.go('/admin', '/studentlist');
						});

					} // Cookie Guider
				};

			}

			return StudentListView;
		}());

	return new StudentListView();
}); 