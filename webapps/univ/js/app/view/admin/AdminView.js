define(['jqueryui', 'raphael', 'plugins', 'cookie', 'elychart', '../../service/DataService', '../../service/BannerService', '../../Router', '../../view/invite/InviteView', '../../view/members/MembersPickView'], function(jqueryui, raphael, plugins, cookie, elychart, service, banner, router, invite, memberspick) {"use strict";

	var AdminView = ( function() {

			/**
			 * Constructor
			 *
			 */
			var PARMS = {
				"Bg" : "img\/4.jpg",
			};
			var MALEICON = '<i class="icon-male  icon-1x "></i>';
			var FEMALEICON = '<i class="icon-female  icon-1x "></i>';
			var EMAILICON = '<i class="icon-envelope-alt  icon-1x "></i>';
			var ACCEPTEDICON = '<i class="icon-check icon-1x "></i>';
			var PENDINGICON = '<i class="icon-spinner icon-1x "></i>';
			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};
			var ACTIVEDOMAINS = [];
			var ACTIVEDOMAINIDS = [];
			var PENDINGLIST = [];
			var DOMAINSTRENGTHDATA = {
				y : 0,
				a : 0,
				b : 0
			};
			var donutdata = [{
				value : 30,
				color : "#F7464A"
			}, {
				value : 50,
				color : "#e36607"
			}, {
				value : 100,
				color : "#e30784"
			}, {
				value : 40,
				color : "#07e366"
			}, {
				value : 120,
				color : "#0784e3"
			}];

			function AdminView() {

				function showBG() {
					//jQuery.backstretch(PARMS.Bg);
				}

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

				function getInfoByPrivilage() {
					helperMediaQuiries();
					var OWNERLEVEL = 0;
					var ADMINLEVEL = 0;
					service.getUserProfile({
						success : function(UserProfile) {
							for (var i = 0; i < UserProfile.domains.length; i++) {
								if (ROLEMAP[UserProfile.domains[i].roleName] !== 'Owner') {
									ADMINLEVEL = ADMINLEVEL + 1;
								} else {
									OWNERLEVEL = OWNERLEVEL + 1;
								}
							}
							if (OWNERLEVEL !== UserProfile.domains.length) {
								//User is not owner. Filter stuff.
								//jQuery('.T1').hide();
								jQuery('.T1').show();
								populateUserData();
								populateInviteData();
								//Should clean memebr list out
								//Testing All Now
								// jQuery('.T1').show();
								// populateDomainData();
								// populateUserData();
							} else {
								jQuery('.T1').show();
								populateUserData();
								populateInviteData();
							}
						}
					});
				}

				function populateUserData() {
					var _adminof = 0;
					var _ownerof = 0;
					var _profiledata = [0, 0];
					ACTIVEDOMAINS = [];
					ACTIVEDOMAINIDS = [];
					service.getUserProfile({
						success : function(UserProfile) {
							updatePanelValues('#user-id-value', 'K-' + UserProfile.id);
							if (UserProfile.domains.length === 1) {
								ACTIVEDOMAINS.push(UserProfile.domains[0].domainName);
								ACTIVEDOMAINIDS.push(UserProfile.domains[0].id);
								populateInviteData(ACTIVEDOMAINIDS);
								populateMembersData(ACTIVEDOMAINIDS);
								populateToDoData(ACTIVEDOMAINIDS);
								if (ROLEMAP[UserProfile.domains[0].roleName] === 'Admin') {
									updatePanelValues('#user-admin-value', 1);
									_profiledata[1] = 1;
									updatePanelGraphs('#profile-donut', _profiledata);
								} else {
									updatePanelValues('#user-owner-value', 1);
									_profiledata[0] = 1;
									updatePanelGraphs('#profile-donut', _profiledata);
								}
							} else {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									ACTIVEDOMAINS.push(UserProfile.domains[i].domainName);
									ACTIVEDOMAINIDS.push(UserProfile.domains[i].id);
									if (ROLEMAP[UserProfile.domains[i].roleName] === 'Admin') {
										_adminof = _adminof + 1;
										updatePanelValues('#user-admin-value', _adminof);
										_profiledata[1] = _adminof;
									} else {
										_ownerof = _ownerof + 1;
										updatePanelValues('#user-owner-value', _ownerof);
										_profiledata[0] = _ownerof;
									}
									if (i === UserProfile.domains.length - 1) {
										//Remove duplicates
										ACTIVEDOMAINS = ACTIVEDOMAINS.filter(function(elem, pos) {
											return ACTIVEDOMAINS.indexOf(elem) == pos;
										})
										updatePanelGraphs('#profile-donut', _profiledata);
										populateInviteData(ACTIVEDOMAINIDS);
										populateMembersData(ACTIVEDOMAINIDS);
										populateToDoData(ACTIVEDOMAINIDS);
									}
								}
							}
						}
					});
				}

				function populateInviteData(activedomains) {
					var _inviteaccept = 0;
					var _invitepending = 0;
					var _invitetotal = 0;
					var _invitedata = [0, 0];
					//Catch Error
					if (activedomains) {
						for (var z = 0; z < activedomains.length; z++) {
							service.getInviteStatus(activedomains[z], {
								success : function(InviteList) {
									var INVITECOUNT = InviteList.length;
									_invitetotal = _invitetotal + INVITECOUNT;
									for (var i = 0; i < INVITECOUNT; i++) {
										updatePanelValues('#invite-total-value', _invitetotal);
										if (InviteList[i].status == 'ACCEPTED') {
											_inviteaccept = _inviteaccept + 1;
											_invitedata[0] = _inviteaccept;
											updatePanelValues('#invite-accept-value', _inviteaccept);
										} else {
											_invitepending = _invitepending + 1;
											updatePanelValues('#invite-pending-value', _invitepending);
											_invitedata[1] = _invitepending;
											PENDINGLIST.push(InviteList[i].email);
										}
										if (i === INVITECOUNT - 1) {
											invite.pendingList(PENDINGLIST);
											updatePanelGraphs('#invite-donut', _invitedata);
										}
									}
								}
							});
						}
					}
				}

				function populateMembersData(activedomains) {
					var _memberst2 = 0;
					var _memberst3 = 0;
					var _memberstotal = 0;
					var _membersdata = [0, 0];
					for (var i = 0; i < activedomains.length; i++) {
						service.getMembers(activedomains[i], {
							success : function(data) {
								_memberstotal = _memberstotal + data.length - 1;
								for (var j = 0; j < data.length; j++) {
									updatePanelValues('#members-total-value', _memberstotal);
									var roles = JSON.stringify(data[j].roles);
									if (roles.indexOf('ROLE_TIER3') !== -1) {
										_memberst3 = _memberst3 + 1;
										updatePanelValues('#members-t3-value', _memberst3);
										_membersdata[1] = _memberst3;
									} else if (roles.indexOf('ROLE_TIER2') !== -1) {
										_memberst2 = _memberst2 + 1;
										updatePanelValues('#members-t2-value', _memberst2);
										_membersdata[0] = _memberst2;
									}
									if (j === data.length - 1) {
										updatePanelGraphs('#members-donut', _membersdata);
									}
								}
							}
						});
					}
				}

				function populateToDoData(activedomains) {
					var _todototal = 0;
					var _tododone = 0;
					var _tododata = [0, 0];
					for (var i = 0; i < activedomains.length; i++) {
						service.DomainToDoList(activedomains[i], {
							success : function(data) {
								_todototal = _todototal + data.length;
								_tododata[0] = _todototal;
								updatePanelValues('#todo-grouptotal-value', _todototal);
								var _todogross = 0;
								var _todopercentage = 0;
								for (var j = 0; j < data.length; j++) {
									_todogross = _todogross + data[j].todos.length;
									_tododata[1] = _todogross;
									updatePanelValues('#todo-total-value', _todogross);
									for (var k = 0; k < data[j].todos.length; k++) {
										_todopercentage = (_todopercentage + data[j].todos[k].percentage) / _todogross;
										updatePanelValues('#todo-progress-value', _todopercentage + ' %');
									}
									if (j === data.length - 1) {
										updatePanelGraphs('#todo-donut', _tododata);
									}
								}
							}
						});
					}
				}

				function updatePanelValues(name, value) {
					$(name).text(value);
				}

				function updatePanelGraphs(name, data) {
					$(name).chart({
						template : "pie_basic_2",
						values : {
							serie1 : data
						},
						labels : [],
						tooltips : {
							serie1 : data
						},
						defaultSeries : {
							r : -0.5,
							values : [{
								plotProps : {
									fill : "#0784E3"
								}
							}, {
								plotProps : {
									fill : "green"
								}
							}]
						}
					});
				}

				function setCanvas() {
					jQuery.elycharts.templates['pie_basic_2'] = {
						type : "pie",
						style : {
							"background-color" : "white"
						},
						defaultSeries : {
							plotProps : {
								stroke : "white",
								"stroke-width" : 2, //upto 3
								opacity : 1
							},
							highlight : {
								newProps : {
									opacity : 0.6
								}
							},
							tooltip : {
								active : true,
								frameProps : {
									opacity : 1,
									roundedCorners : 10,
									fill : "white",
								}
							},
							label : {
								active : true,
								props : {
									fill : "#0784E3"
								}
							},
							startAnimation : {
								active : true,
								type : "avg"
							}
						}
					};
				}

				function displayAlert() {
					//This should never show up.
					alert('Error in Loading! Please Refresh the page!');
				}

				function helperMediaQuiries() {
					if ($('.adminboard').length > 2) {
						var width = $('#card-canvas').width() - 30;
						var rowholds = Math.floor(width / 404);
						var fillerspace = width - (rowholds * 404);
						//var eachfiller = 300+fillerspace/rowholds;
						var newmargin = fillerspace / rowholds;
						if (newmargin < 10) {
							newmargin = 10;
						}
						$('.adminboard').css('margin-left', newmargin / 2);
						$('.adminboard').css('margin-right', newmargin / 2);
					}
				}


				this.getActiveDomains = function() {
					return ACTIVEDOMAINS;
				}

				this.getActiveDomainsIDs = function() {
					return ACTIVEDOMAINIDS;
				}

				this.reloadData = function() {
					populateData();
				}

				this.pause = function() {

				};

				this.resume = function() {
					showBG();
					getInfoByPrivilage();

				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						//Rich Experience First.... Load BG
						showBG();
						jQuery('.T1').hide();
						jQuery(".scroll-pane").jScrollPane();
						var progressbar = $("#to-do-progressbar");
						var progressLabel = $(".to-do-progress-label");
						// jQuery("#to-do-accordion").accordion({
						// collapsible : true,
						// active : false
						// });
						// Get Privilage
						setCanvas();
						getInfoByPrivilage();

						$(window).resize(helperMediaQuiries);
						// When the browser changes size

						jQuery('.adminboard').on('click', function() {

						});
						jQuery('#admin-done').on('click', function() {
							router.returnToPrevious();
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

			return AdminView;
		}());

	return new AdminView();
});
