define(['modernizr', 'cookie', 'ellipsis', '../../service/DataService', '../../service/BannerService', '../../view/class/ClassView', '../../Router', '../../Notify', 'raphael'], function(modernizr, cookie, ellipsis, service, banner, classview, router, notify, raphael) {"use strict";

	var StudentListView = ( function() {

			var PARMS = {
				"workBg" : "img\/classbg.png",
			};
			var LOCKPANEL = '<i class="icon-lock  icon-1x "></i>';
			var UNLOCKPANEL = '<i class="icon-unlock  icon-1x "></i>';
			var YOU = '<div class="you"><i class="icon-star  icon-1x "></i></div>';
			var MEMBEROBJECT = [];
			var MEMBERIDS = [];
			var RELOAD = false;
			var template, loadingtemplate, partiontemplate;
			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};

			/**
			 * Constructor
			 */
			function StudentListView() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				function populateStudentList() {
					//Get User Profile
					jQuery('#card-canvas').empty();
					jQuery('.cardsloading').fadeIn(200);
					MEMBEROBJECT = [];
					MEMBERIDS = [];
					var OWNERLEVEL = 0;
					service.getUserProfile({
						success : function(data) {
							for (var i = 0; i < data.domains.length; i++) {
								if (data.domains[i].domainName === jQuery.cookie('subuser')) {
									if (ROLEMAP[data.domains[i].roleName] === 'Owner') {
										OWNERLEVEL = data.domains.length;
									} else {
										OWNERLEVEL = data.domains.length + 1;
									}
								}
							}
							if (OWNERLEVEL !== data.domains.length) {
								//User is NOT owner of this domain. Filter stuff.
								var _memberobjectself = {};
								if (!data.image || data.image === null) {
									_memberobjectself.image = "img/noimg.png";
								} else {
									_memberobjectself.image = '/zingoare/api/profileupload/picture/' + data.image.id;
								}
								_memberobjectself.firstName = data.firstName;
								_memberobjectself.lastName = data.lastName;
								_memberobjectself.email = data.email;
								_memberobjectself.id = data.id;
								_memberobjectself.taskcount = data.tasks.length;
								_memberobjectself.taskprogress = 0;
								for (var p = 0; p < data.tasks.length; p++) {
									_memberobjectself.taskprogress = _memberobjectself.taskprogress + data.tasks[p].percentage;
									if (p === data.tasks.length - 1) {
										_memberobjectself.taskprogress = Math.ceil(_memberobjectself.taskprogress / data.tasks.length);
									}
								}
								MEMBEROBJECT.push(_memberobjectself);
								for (var j = 0; j < data.members.length; j++) {
									var _memberobject = {};
									if (!data.members[j].image || data.members[j].image === null) {
										_memberobject.image = "img/noimg.png";
									} else {
										_memberobject.image = '/zingoare/api/profileupload/picture/' + data.members[j].image.id;
									}
									_memberobject.firstName = data.members[j].firstName;
									_memberobject.lastName = data.members[j].lastName;
									_memberobject.email = data.members[j].email;
									_memberobject.id = data.members[j].id;
									_memberobject.taskcount = data.members[j].tasks.length;
									_memberobject.taskprogress = 0;
									for (var p = 0; p < data.members[j].tasks.length; p++) {
										_memberobject.taskprogress = _memberobject.taskprogress + data.members[j].tasks[p].percentage;
										if (p === data.members[j].tasks.length - 1) {
											_memberobject.taskprogress = Math.ceil(_memberobject.taskprogress / data.members[j].tasks.length);
										}
									}
									MEMBEROBJECT.push(_memberobject);
									if (j == data.members.length - 1) {
										displayCards(MEMBEROBJECT);
									}
									// if (MEMBERIDS.indexOf(data.members[j].id) == -1) {
									// MEMBERIDS.push(_memberobject.id);
									// MEMBEROBJECT.push(_memberobject);
									// }
								}
							} else {
								//User is OWNER of this domain
								getindirectReports(data, MEMBEROBJECT);
							}
						}
					});
				}

				function getindirectReports(data, MEMBEROBJECT) {
					//var activedomains = admin.getActiveDomainsIDs();
					var activedomains = [];
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
					data = activedomains;
					//Its only one domain throught. Having a for loop for futurustinc use
					//Its only 1 iterarion and shouldnt cost any performace load.
					if (data.length === 0) {
						displayCards(MEMBEROBJECT);
						if (jQuery('.studentboard').length === 0) {
							jQuery('#noinfo').fadeIn(1000);
							jQuery('.cardsloading').fadeOut(200);
						} else {
							jQuery('#noinfo').hide();
						}
					}

					for (var i = 0; i < activedomains.length; i++) {
						var _domain = activedomains[i];
						service.getMembersOnly(activedomains[i], {
							success : function(data) {
								if (data.length == 0) {
									displayCards(MEMBEROBJECT);
									jQuery('.metainfo').text(jQuery('.studentboard').length + ' member(s)');
									if (jQuery('.studentboard').length === 1) {
										var selectedUserName = $('.student-name').text();
										var selectedUserId = $('.student-name').parent().attr('name');
										classview.activeStudent(selectedUserName, selectedUserId);
										router.go('/class', '/studentlist');
									}
									if (jQuery('.studentboard').length === 0) {
										jQuery('#noinfo').fadeIn(1000);
										jQuery('.cardsloading').fadeOut(200);
									} else {
										jQuery('#noinfo').hide();
									}
								}

								for (var j = 0; j < data.length; j++) {
									var _memberobject = {};
									if (!data[j].image || data[j].image === null) {
										_memberobject.image = "img/noimg.png";
									} else {
										_memberobject.image = '/zingoare/api/profileupload/picture/' + data[j].image.id;
									}
									_memberobject.firstName = data[j].firstName;
									_memberobject.lastName = data[j].lastName;
									_memberobject.email = data[j].email;
									_memberobject.id = data[j].id;
									_memberobject.taskcount = data[j].tasks.length;
									_memberobject.taskprogress = 0;
									for (var p = 0; p < data[j].tasks.length; p++) {
										_memberobject.taskprogress = _memberobject.taskprogress + data[j].tasks[p].percentage;
										if (p === data[j].tasks.length - 1) {
											_memberobject.taskprogress = Math.ceil(_memberobject.taskprogress / data[j].tasks.length);
										}
									}
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
					//console.log(service.domainNametoID(jQuery.cookie('subuser')));
					jQuery('#card-canvas').empty();
					for (var i = 0; i < MEMBEROBJECT.length; i++) {
						if (MEMBEROBJECT[i].id !== 'FILLER') {
							var newboard = template.clone();
							jQuery('.cardsloading').fadeOut(200);
							if ((MEMBEROBJECT[i].firstName === 'null' || MEMBEROBJECT[i].firstName == null || MEMBEROBJECT[i].firstName === "" ) && (MEMBEROBJECT[i].lastName === 'null' || MEMBEROBJECT[i].lastName == null || MEMBEROBJECT[i].lastName === "")) {
								jQuery('.student-name', newboard).text(MEMBEROBJECT[i].email);
								jQuery('.student-select', newboard).attr('name', MEMBEROBJECT[i].email);
							} else {
								jQuery('.student-name', newboard).text(MEMBEROBJECT[i].firstName + ' ' + MEMBEROBJECT[i].lastName);
								jQuery('.student-select', newboard).attr('name', MEMBEROBJECT[i].firstName + ' ' + MEMBEROBJECT[i].lastName);
							}
							jQuery('.student-headshot', newboard).attr('src', MEMBEROBJECT[i].image);
							jQuery('.student-id', newboard).text(MEMBEROBJECT[i].taskcount + ' task(s) todo');
							jQuery('.taskcount', newboard).text(MEMBEROBJECT[i].taskcount);
							jQuery('.member-from', newboard).text(MEMBEROBJECT[i].taskprogress + ' % completed');
							if (MEMBEROBJECT[i].email) {
								if (MEMBEROBJECT[i].email.indexOf(jQuery.cookie('user')) !== -1) {
									jQuery('.student-info', newboard).append(YOU);
								}
							}
							//jQuery('.member-from', newboard).text('Member From: Dec 16 2014');
							jQuery(newboard).attr('name', MEMBEROBJECT[i].id);
							jQuery('#noinfo').hide();
							jQuery('#card-canvas').append(newboard);
							jQuery('.metainfo').text(jQuery('.studentboard').length + ' member(s)');
							if (i == MEMBEROBJECT.length - 1 || i == MEMBEROBJECT.length - 2) {
								var MEMBEROBJECT_instance = MEMBEROBJECT;
								jQuery('.student-name').ellipsis({
									onlyFullWords : true
								});
								helperMediaQuiries();
								ActivatePanelEvents();
								//populateTasks(MEMBEROBJECT_instance);
							}
						} else {
							if (i < MEMBEROBJECT.length - 1) {
								var partitionboard = partiontemplate.clone();
								jQuery('.tag', partitionboard).html(MEMBEROBJECT[i].firstName);
								jQuery('#card-canvas').append(partitionboard);
							}
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
						banner.setBrand();
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


				this.reload = function() {
					RELOAD = true;
				};

				this.pause = function() {

				};

				this.resume = function() {
					showBG();
					banner.setBrand();
					document.title = 'Zingoare | Members Management';
					jQuery('.edit-notify').hide();
					banner.HideAlert();
					banner.HideUser();
					if ((!service.knowClenUserProfile() && service.knowClenUserProfile() == null) || RELOAD == true) {
						RELOAD = false;
						//router.reload();
						populateStudentList();
					}
					if (notify.getNewNotificationsCount() > 0) {
						jQuery('#alert-value').text(notify.getNewNotificationsCount());
					} else {
						jQuery('#alert-value').text('');
					}
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Members Management';
					if (checkForActiveCookie() === true) {
						//Rich Experience First.... Load BG
						template = jQuery('#student-template').remove().attr('id', '');
						partiontemplate = jQuery('.canvas-partition');
						showBG();
						populateStudentList();
						if (notify.getNewNotificationsCount() > 0) {
							jQuery('#alert-value').text(notify.getNewNotificationsCount());
						}
						// When the browser changes size
						$(window).resize(helperMediaQuiries);

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

						jQuery('.brandnames').change(function() {
							banner.updateBrand(jQuery('.brandnames').val());
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
