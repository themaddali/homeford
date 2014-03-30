define(['jqueryui','raphael', 'spin', 'plugins', 'cookie', 'elychart', '../../service/DataService','../../service/BannerService', '../../Router', '../../view/invite/InviteView'], function(jqueryui,raphael, spin, plugins, cookie, elychart, service,banner, router, invite) {"use strict";

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
								// jQuery('.T1').hide();
								// populateUserData();
								// populateInviteData();
								// populateDomainData();
								//Should clean memebr list out
								//Testing All Now
								jQuery('.T1').show();
								populateDomainData();
								populateUserData();
							} else {
								jQuery('.T1').show();
								populateDomainData();
								populateUserData();
							}
						}
					});
				}

				function populateDomainData() {
					var _membersmale = 0;
					var _membersfemale = 0;
					var _membersdata =[0,0];
					jQuery('#members-accordion').empty();
					service.getUnivObject({
						success : function(UnivData) {
							//OverView Panel Load
							jQuery('.univ-name').text(UnivData[0].univname);
							jQuery('.univ-id').text(UnivData[0].id);
							jQuery('.univ-about').text(UnivData[0].about);
							jQuery('.univ-admin').text(UnivData[0].adminname);
							jQuery('.univ-created').text(UnivData[0].created);
							jQuery('.univ-email').text(UnivData[0].email);
							jQuery('.univ-phone').text(UnivData[0].phone);
							jQuery('.univ-address').text(UnivData[0].address);
							jQuery('.univ-faculty').text(UnivData[0].faculty.length);
							jQuery('.univ-students').text(UnivData[0].students.length);

							//Student Manage Panel Load
							//var memberheadertemplate = jQuery('#member-header-template').attr('id', '');
							//var membercontenttemplate = jQuery('#member-content-template').attr('id', '');
							//Backing the template
							//jQuery('.templates-div').append(memberheadertemplate.attr('id', 'member-header-template'));
							//jQuery('.templates-div').append(membercontenttemplate.attr('id', 'member-content-template'));
							var COUNT = UnivData[0].students.length;
							for (var i = 0; i < COUNT; i++) {
								updatePanelValues('#members-total-value', COUNT);
								//var headerelement = memberheadertemplate.clone();
								//var contentelement = membercontenttemplate.clone();
								if (UnivData[0].students[i].gender === 'female') {
									_membersfemale = _membersfemale + 1;
									_membersdata[0] = _membersfemale;
									updatePanelValues('#members-female-value', _membersfemale);
									//headerelement.html(FEMALEICON + UnivData[0].students[i].name);
								} else {
									_membersmale = _membersmale + 1;
									_membersdata[1] = _membersmale;
									updatePanelValues('#members-male-value', _membersmale);
									//headerelement.html(MALEICON + UnivData[0].students[i].name);
								}
								//jQuery('.memberid', contentelement).html(UnivData[0].students[i].id);
								//jQuery('.membersecurity', contentelement).html(UnivData[0].students[i].security);
								//jQuery('.membercourses', contentelement).html(UnivData[0].students[i].courses.length);
								//jQuery('#members-accordion').append(headerelement);
								//jQuery('#members-accordion').append(contentelement);
								// jQuery('.students-list-min').on('click', function() {
									// var userClicked = jQuery(this).find('strong').html();
									// subusereditview.activeUser(userClicked);
									// router.go('/admin/subuseredit', '/admin');
								// });
								if (i === COUNT - 1) {
									updatePanelGraphs('#members-donut', _membersdata);
									// jQuery("#members-accordion").accordion({
										// collapsible : true,
										// active : false
									// });
								}
							}
						}
					});
				}

				function populateUserData() {
					var _adminof = 0;
					var _ownerof = 0;
					var _profiledata = [0,0];
					ACTIVEDOMAINS = [];
					service.getUserProfile({
						success : function(UserProfile) {
							updatePanelValues('#user-id-value', 'K-' + UserProfile.id);
							if (UserProfile.domains.length === 1) {
								ACTIVEDOMAINS.push(UserProfile.domains[0].domainName);
								populateInviteData(ACTIVEDOMAINS);
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
										populateInviteData(ACTIVEDOMAINS);
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
					var _invitedata = [0,0];
					//Catch Error
					if (activedomains) {
						for (var z = 0; z < activedomains.length; z++) {
							service.getInviteStatus(activedomains[z], {
								success : function(InviteList) {
									var ADMINCOUNT = InviteList.length;
									_invitetotal = _invitetotal + ADMINCOUNT;
									for (var i = 0; i < ADMINCOUNT; i++) {
										updatePanelValues('#invite-total-value', _invitetotal);
										if (InviteList[i].status == 'ACCEPTED') {
											_inviteaccept = _inviteaccept + 1;
											_invitedata[0] =_inviteaccept;
											updatePanelValues('#invite-accept-value', _inviteaccept);
										} else {
											_invitepending = _invitepending + 1;
											updatePanelValues('#invite-pending-value', _invitepending);
											_invitedata[1] =_invitepending;
											PENDINGLIST.push(InviteList[i].email);
										}

										if (i === ADMINCOUNT - 1) {
											invite.pendingList(PENDINGLIST);
											updatePanelGraphs('#invite-donut', _invitedata);
										}
									}
								}
							});
						}
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


				this.getActiveDomains = function() {
					return ACTIVEDOMAINS;
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
						jQuery("#to-do-accordion").accordion({
							collapsible : true,
							active : false
						});
						// Get Privilage
						setCanvas();
						getInfoByPrivilage();

						jQuery('.adminboard').on('click', function() {

						});
						jQuery('#admin-done').on('click', function() {
							router.returnToPrevious();
						});
						
						jQuery('.goback').click(function(){
							router.returnToPrevious();
						});
						jQuery('.mainlogo').click(function(){
							router.go('/studentlist');
						});

					} // Cookie Guider
				};

			}

			return AdminView;
		}());

	return new AdminView();
});
