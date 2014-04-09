define(['modernizr', 'plugins', 'cookie', 'ellipsis', '../../service/DataService', '../../service/BannerService', '../../view/class/ClassView', '../../Router', '../../Notify', 'raphael'], function(modernizr, plugins, cookie, ellipsis, service, banner, classview, router, notify, raphael) {"use strict";

	var StudentListView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
			};
			var LOCKPANEL = '<i class="icon-lock  icon-1x "></i>';
			var UNLOCKPANEL = '<i class="icon-unlock  icon-1x "></i>';
			var MEMBEROBJECT = [];
			var MEMBERIDS = [];
			var template, loadingtemplate, partiontemplate;

			/**
			 * Constructor
			 */
			function StudentListView() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				// function populateStudentList() {
				// //Get User Profile
				// jQuery('#card-canvas').empty();
				// MEMBEROBJECT = [];
				// service.getUserProfile({
				// success : function(data) {
				// var activedomains = service.returnDomainIDList();
				// for (var i = 0; i < activedomains.length; i++) {
				// service.getMembersOnly(activedomains[i], {
				// success : function(data) {
				// if (data.length === 0) {
				// jQuery('#noinfo').fadeIn(1000);
				// } else {
				// jQuery('#noinfo').hide();
				// }
				// for (var j = 0; j < data.length; j++) {
				// var _memberobject = {};
				// var roles = JSON.stringify(data[j].roles);
				// if (roles.indexOf('ROLE_TIER3') !== -1) {
				// //Add Filler Image
				// if (!data[j].profile_url || data[j].profile_url === "") {
				// data[j].image = "img/noimg.png"
				// }
				// _memberobject.image = data[j].image;
				// _memberobject.firstName = data[j].firstName;
				// _memberobject.lastName = data[j].lastName;
				// _memberobject.email = data[j].email;
				// _memberobject.id = data[j].id;
				// MEMBEROBJECT.push(_memberobject);
				// }
				// if (j === data.length - 1) {
				// jQuery("#preloader").hide();
				// ActivatePanelEvents();
				// if (MEMBEROBJECT.length === 0) {
				// }
				// displayCards(MEMBEROBJECT);
				// }
				// }
				// }
				// });
				// }
				// }
				// });
				// }

				function populateStudentList() {
					//Get User Profile
					jQuery('#card-canvas').empty();
					MEMBEROBJECT = [];
					service.getUserProfile({
						success : function(data) {

							if (data.members.length == 0) {
								getindirectReports(data, MEMBEROBJECT);
							} else {
								var _fillerobject = {};
								_fillerobject.id = 'FILLER';
								_fillerobject.firstName = 'Direct Reports';
								MEMBEROBJECT.push(_fillerobject);
							}
							for (var i = 0; i < data.members.length; i++) {
								var _memberobject = {};
								//Add Filler Image
								if (!data.members[i].profile_url || data.members[i].profile_url === "") {
									data.members[i].image = "img/noimg.png"
								}
								_memberobject.image = data.members[i].image;
								_memberobject.firstName = data.members[i].firstName;
								_memberobject.lastName = data.members[i].lastName;
								_memberobject.email = data.members[i].email;
								_memberobject.id = data.members[i].id;
								if (MEMBERIDS.indexOf(data.members[i].id) == -1) {
									MEMBERIDS.push(_memberobject.id);
									MEMBEROBJECT.push(_memberobject);
								}
								if (i === data.members.length - 1) {
									jQuery("#preloader").hide();
									ActivatePanelEvents();
									if (MEMBEROBJECT.length === 0) {
									}
									getindirectReports(data, MEMBEROBJECT);
								}
							}
						}
					});
				}

				function getindirectReports(data, MEMBEROBJECT) {
					var activedomains = service.returnDomainIDList();
					for (var i = 0; i < activedomains.length; i++) {
						service.getMembersOnly(activedomains[i], {
							success : function(data) {
								if (data.length == 0) {
									jQuery('.metainfo').text(jQuery('.studentboard').length + ' members');
									if (jQuery('.studentboard').length === 0) {
										jQuery('#noinfo').fadeIn(1000);
									} else {
										jQuery('#noinfo').hide();
									}
								} else {
									var _fillerobject = {};
									_fillerobject.id = 'FILLER';
									_fillerobject.firstName = 'In Direct Reports';
									MEMBEROBJECT.push(_fillerobject);
								}
								for (var j = 0; j < data.length; j++) {
									var _memberobject = {};
									if (!data[j].profile_url || data[j].profile_url === "") {
										data[j].image = "img/noimg.png"
									}
									_memberobject.image = data[j].image;
									_memberobject.firstName = data[j].firstName;
									_memberobject.lastName = data[j].lastName;
									_memberobject.email = data[j].email;
									_memberobject.id = data[j].id;
									if (MEMBERIDS.indexOf(data[j].id) == -1) {
										MEMBERIDS.push(_memberobject.id);
										MEMBEROBJECT.push(_memberobject);
									}
									if (j == data.length - 1) {
										displayCards(MEMBEROBJECT);
									}
								}
							}
						});
					}
				}

				function displayCards(MEMBEROBJECT) {
					jQuery('#card-canvas').empty();
					for (var i = 0; i < MEMBEROBJECT.length; i++) {
						if (MEMBEROBJECT[i].id !== 'FILLER') {
							jQuery('.metainfo').text(jQuery('.studentboard').length + ' members');
							var newboard = template.clone();
							var loadingboard = loadingtemplate.clone();
							loadingboard.addClass('loading');
							if ((MEMBEROBJECT[i].firstName === 'null' || MEMBEROBJECT[i].firstName == null || MEMBEROBJECT[i].firstName === "" ) && (MEMBEROBJECT[i].lastName === 'null' || MEMBEROBJECT[i].lastName == null || MEMBEROBJECT[i].lastName === "")) {
								jQuery('.student-name', newboard).text(MEMBEROBJECT[i].email);
								jQuery('.student-select', newboard).attr('name', MEMBEROBJECT[i].email);
							} else {
								jQuery('.student-name', newboard).text(MEMBEROBJECT[i].firstName + ' ' + MEMBEROBJECT[i].lastName);
								jQuery('.student-select', newboard).attr('name', MEMBEROBJECT[i].firstName + ' ' + MEMBEROBJECT[i].lastName);
							}
							jQuery('.student-headshot', newboard).attr('src', MEMBEROBJECT[i].image);
							jQuery(newboard).attr('name', MEMBEROBJECT[i].id);
							jQuery('.loading').remove();
							jQuery('#card-canvas').append(newboard);
							jQuery('#card-canvas').append(loadingboard);
							if (i == MEMBEROBJECT.length - 1) {
								jQuery('.loading').remove();
								var MEMBEROBJECT_instance = MEMBEROBJECT;
								jQuery('.student-name').ellipsis({
									onlyFullWords : true
								});
								helperMediaQuiries();
								populateTasks(MEMBEROBJECT_instance);
							}
						} else {
							var partitionboard = partiontemplate.clone();
							jQuery('.tag', partitionboard).text(MEMBEROBJECT[i].firstName);
							jQuery('#card-canvas').append(partitionboard);

						}
					}
				}

				function populateTasks(members) {
					var list = service.returnDomainIDList();
					var activememberid;
					activememberid = members[0].id;
					if (activememberid !== 'FILLER') {
						service.MemberToDoList(list[0], members[0].id, {
							success : function(tasks) {
								if (tasks.length > 0) {
									for (var k = 0; k < tasks.length; k++) {
										if (k < 2) {
											jQuery('.studentboard[name="' + members[0].id + '"] .student-info').append("<li>" + tasks[k].title + "</li>");
										}
										if (k == 2 && tasks.length === 3) {
											jQuery('.studentboard[name="' + members[0].id + '"] .student-info').append("<li>" + tasks[k].title);
										}
										if (k == 2 && tasks.length > 3) {
											jQuery('.studentboard[name="' + members[0].id + '"] .student-info').append("<li>" + tasks[k].title + " ..... and " + (tasks.length - 3) + " more</li>");
										}
										if (k === tasks.length - 1) {
											members.splice(0, 1);
											ActivatePanelEvents();
											jQuery('.metainfo').text(jQuery('.studentboard').length + ' members');
											if (jQuery('.studentboard').length === 0) {
												jQuery('#noinfo').fadeIn(1000);
											} else {
												jQuery('#noinfo').hide();
											}
											if (members[0]) {
												populateTasks(members);
											}
										}
									}
								} else {
									members.splice(0, 1);
									ActivatePanelEvents();
									if (members[0]) {
										populateTasks(members);
									}
								}
							}
						});
					} else {
						members.splice(0, 1);
						ActivatePanelEvents();
						if (members[0]) {
							populateTasks(members);
						}
					}
				}

				function ActivatePanelEvents() {
					jQuery('.studentboard').on('click', function() {
						// successful selection of user for context, and create cookie
						var selectedUserName = $(this).find('.student-name').text();
						var selectedUserId = $(this).attr('name');
						classview.activeStudent(selectedUserName, selectedUserId);
						router.go('/class', '/studentlist');

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

				function helperMediaQuiries() {
					if ($('.studentboard').length > 4) {
						var width = $('#card-canvas').width() - 30;
						var rowholds = Math.floor(width / 304);
						var fillerspace = width - (rowholds * 304);
						//var eachfiller = 300+fillerspace/rowholds;
						var newmargin = fillerspace / rowholds;
						if (newmargin < 10) {
							newmargin = 10;
						}
						$('.studentboard').css('margin-left', newmargin / 2);
						$('.studentboard').css('margin-right', newmargin / 2);
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					showBG();
					jQuery('.edit-notify').hide();
					banner.HideAlert();
					if (!service.knowClenUserProfile() && service.knowClenUserProfile() == null) {
						router.reload();
					}
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					if (checkForActiveCookie() === true) {
						//Rich Experience First.... Load BG
						template = jQuery('#student-template').remove().attr('id', '');
						loadingtemplate = jQuery('#loading-template').remove().attr('id', '');
						partiontemplate = jQuery('.canvas-partition');
						showBG();
						populateStudentList();

						$(window).resize(helperMediaQuiries);
						// When the browser changes size

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
