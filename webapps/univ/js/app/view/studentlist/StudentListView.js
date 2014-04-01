define(['modernizr', 'spin', 'plugins', 'cookie', '../../service/DataService', '../../service/BannerService', '../../view/class/ClassView', '../../Router', '../../Notify', 'raphael'], function(modernizr, spin, plugins, cookie, service, banner, classview, router, notify, raphael) {"use strict";

	var StudentListView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
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
					//Get User Profile
					service.getUserProfile({
						success : function(data) {
							jQuery('#card-canvas').empty();
							var membercount = 0;
							var activedomains = service.returnDomainList();
							var template = jQuery('#student-template').remove().attr('id', '');
							//BackingUp
							jQuery('.div-template').append(template.attr('id', 'student-template'));
							for (var i = 0; i < activedomains.length; i++) {
								service.getMembersOnly(activedomains[i], {
									success : function(data) {
										var newboard = template.clone();
										for (var j = 0; j < data.length; j++) {
											var roles = JSON.stringify(data[j].roles);
											if (roles.indexOf('ROLE_TIER3') !== -1) {
												membercount = membercount+1
												jQuery('.metainfo').text(membercount + ' Members');
												var newboard = template.clone();
												if (!data[j].profile_url || data[j].profile_url === "") {
													data[j].image = "img/noimg.png"
												}
												if ((data[j].firstName === 'null' || data[j].firstName == null || data[j].firstName === "" ) && (data[j].lastName === 'null' || data[j].lastName == null || data[j].lastName === "")) {
													jQuery('.student-name', newboard).text(data[j].email);
												}
												else{
													jQuery('.student-name', newboard).text(data[j].firstName + ' ' + data[j].lastName);
												}
												jQuery('.student-headshot', newboard).attr('src', data[j].image);
												jQuery('.student-select', newboard).attr('name', data[j].name);
												if (data[j].email === true) {
													jQuery('.student-name', newboard).prepend(LOCKPANEL);
													//jQuery('.student-select', newboard).attr('security', data[i].email);
												}
												jQuery('#card-canvas').append(newboard);
											}
											if (j === data.length - 1) {
												jQuery("#preloader").hide();
												ActivatePanelEvents();
											}
										}
									}
								});
							}
						}
					});

					// service.getUnivObject({
					// success : function(UnivData) {
					// var template = jQuery('#student-template').remove().attr('id', '');
					// //BackingUp
					// jQuery('.div-template').append(template.attr('id', 'student-template'));
					// var COUNT = UnivData[0].students.length;
					// for (var i = 0; i < COUNT; i++) {
					// jQuery('.metainfo').text(COUNT + ' Members');
					// var newboard = template.clone();
					// if (!UnivData[0].students[i].image || UnivData[0].students[i].image === "") {
					// UnivData[0].students[i].image = "img/noimg.png"
					// }
					// jQuery('.student-name', newboard).text(UnivData[0].students[i].name);
					// jQuery('.student-headshot', newboard).attr('src', UnivData[0].students[i].image);
					// jQuery('.student-select', newboard).attr('name', UnivData[0].students[i].name);
					// if (UnivData[0].students[i].security === true) {
					// jQuery('.student-name', newboard).prepend(LOCKPANEL);
					// jQuery('.student-select', newboard).attr('security', UnivData[0].students[i].security);
					// }
					// if (UnivData[0].students[i].security !== true) {
					// jQuery('.student-name', newboard).prepend(UNLOCKPANEL);
					// }
					// for (var j = 0; j < UnivData[0].students[i].courses.length; j++) {
					// if (j < 2) {
					// jQuery('.student-info', newboard).append("<li>" + UnivData[0].students[i].courses[j].name + "</li>");
					// }
					// if (j == 2 && UnivData[0].students[i].courses.length > 3) {
					// jQuery('.student-info', newboard).append("<li>" + UnivData[0].students[i].courses[j].name + " ..... and " + (UnivData[0].students[i].courses.length - 2) + " more</li>");
					// }
					// }
					// jQuery('#card-canvas').append(newboard);
					// if (i === COUNT - 1) {
					// //jQuery('#carousel').append('<div class="empty"></div>');
					// //createPanels();
					// if (COUNT > 14) {
					// jQuery('#searchbar').addClass('active');
					// } else {
					// jQuery('#searchbar').removeClass('active');
					// }
					// //jQuery('#card-canvas').append(createnewboard);
					// jQuery("#preloader").hide();
					// ActivatePanelEvents();
					// }
					// if (COUNT === 0) {
					// //No Need of selection. ONly Student so take in to class zone.
					// jQuery.cookie('sub-user', UnivData[0].students[i].name, {
					// expires : 100
					// });
					// router.go('/class', 'studentlist');
					// }
					//
					// }
					// }
					// });
				}

				function ActivatePanelEvents() {
					jQuery('.studentboard').on('click', function() {
						// successful selection of user for context, and create cookie
						var selectedUser = $(this).find('.student-name').text();
						classview.activeStudent(selectedUser);
						router.go('/class', '/studentlist');
						// var selectedUserSecurity = $(this).attr('security');
						// if (selectedUserSecurity !== "true") {
						// jQuery.cookie('subuser', selectedUser, {
						// path : '/',
						// expires : 100
						// });
						// router.go('/class', '/studentlist');
						// } else {
						// jQuery.cookie('subuser', selectedUser, {
						// path : '/',
						// expires : 100
						// });
						// router.go('/class', '/studentlist');
						// }
					});
				};

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
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
					jQuery('.edit-notify').hide();
					banner.HideAlert();
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					if (checkForActiveCookie() === true) {
						//Rich Experience First.... Load BG
						showBG();
						populateStudentList();

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
							router.returnToPrevious();
						});
						jQuery('.mainlogo').click(function() {
							router.go('/studentlist');
						});

					} // Cookie Guider
				};

			}

			return StudentListView;
		}());

	return new StudentListView();
});
