define(['jqueryui', 'spin', 'plugins', 'cookie', 'carousel', 'swipe', '../../js/lib/Chart.min', '../../js/lib/raphael', '../../js/lib/morris.min', '../app/service/DataService', '../app/Router', '../app/SubUserEditView', '../app/InviteView'], function(jqueryui, spin, plugins, cookie, carousel, swipe, chart, raphael, morris, service, router, subusereditview, invite) {"use strict";

	var AdminView = ( function() {

			/**
			 * Constructor
			 *
			 */
			var PARMS = {
				"Bg" : "img\/classbg.png",
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
			var PENDINGLIST = [];
			var DOMAINSTRENGTHDATA = {
				y : 0,
				a : 0,
				b : 0
			};

			function AdminView() {

				function showBG() {
					jQuery.backstretch(PARMS.Bg);
				}

				function populateGraphs() {

					Morris.Line({
						element : 'accounts-chart',
						data : [{
							y : '2013-09',
							a : 13000,
							b : 11000
						}, {
							y : '2013-10',
							a : 15000,
							b : 14000
						}, {
							y : '2013-11',
							a : 9000,
							b : 8700
						}, {
							y : '2013-12',
							a : 9500,
							b : 9000
						}, {
							y : '2014-01',
							a : 14000,
							b : 11500
						}, {
							y : '2014-02',
							a : 17000,
							b : 13000
						}],
						xkey : 'y',
						xLabels : 'month',
						preUnits : '$',
						lineColors : ['#009ACD', '#e34a33'],
						lineWidth : 4,
						pointSize : 5,
						ykeys : ['a', 'b'],
						labels : ['Cash Inflow', 'Expenses']
					});

					Morris.Donut({
						element : 'student-donut-1',
						data : [{
							label : "October",
							value : 12
						}, {
							label : "Novemeber",
							value : 15
						}, {
							label : "December",
							value : 16
						}, {
							label : "January",
							value : 20
						}, {
							label : "Feburary",
							value : 19
						}, {
							label : "March",
							value : 25
						}]
					});
					Morris.Donut({
						element : 'student-donut-2',
						data : [{
							label : "October",
							value : 12
						}, {
							label : "Novemeber",
							value : 15
						}, {
							label : "January",
							value : 19
						}]
					});
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
								jQuery('.T1').hide();
								populateUserData();
								populateInviteData();
								populateDomainData();
								//Should clean memebr list out
							} else {
								jQuery('.T1').show();
								populateDomainData();
								populateUserData();
								populateInviteData();
								populateGraphs();
							}
						}
					});
				}

				function populateDomainData() {
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
							var studentmintemplate = jQuery('#students-list-min-template').remove().attr('id', '');
							var COUNT = UnivData[0].students.length;
							for (var i = 0; i < COUNT; i++) {
								var newelement = studentmintemplate.clone();
								if (UnivData[0].students[i].gender === 'female') {
									jQuery('.students-list-min', newelement).html(FEMALEICON + '<strong>' + UnivData[0].students[i].name + '</strong>' + UnivData[0].students[i].id);
								} else {
									jQuery('.students-list-min', newelement).html(MALEICON + '<strong>' + UnivData[0].students[i].name + '</strong>' + UnivData[0].students[i].id);
								}
								jQuery('#students-list-min').append(newelement);
								jQuery("#students-list-min").sortable();
								jQuery('.students-list-min').on('click', function() {
									var userClicked = jQuery(this).find('strong').html();
									subusereditview.activeUser(userClicked);
									router.go('/admin/subuseredit', '/admin');
								});
							}
						}
					});
				}

				function populateUserData() {
					service.getUserProfile({
						success : function(UserProfile) {
							//OverView Panel Load
							jQuery('.user-first-name').text(UserProfile.firstName);
							jQuery('.user-last-name').text(UserProfile.lastName);
							jQuery('.user-id').text(UserProfile.id);
							jQuery('.user-password').text('*******');
							jQuery('.user-email').text(UserProfile.email);
							jQuery('.user-phone').text(UserProfile.phoneNumber);
							var template = jQuery('#profile-domainview-template').attr('id', '');
							if (UserProfile.domains.length === 1) {
								jQuery('#user-domain').html(UserProfile.domains[0].domainName + '<span style="font-style: italic; padding-left:5px; font-size: 10px">' + ROLEMAP[UserProfile.domains[0].roleName] + '</span>');
							} else {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									if (i === 0) {
										jQuery('#user-domain').html(UserProfile.domains[0].domainName + '<span style="font-style: italic; padding-left:5px; font-size: 10px">' + ROLEMAP[UserProfile.domains[0].roleName] + '</span>');
									} else {
										var activetemplate = template.clone();
										jQuery('.user-domain', activetemplate).html(UserProfile.domains[i].domainName + '<span style="font-style: italic; padding-left:5px; font-size: 10px">' + ROLEMAP[UserProfile.domains[i].roleName] + '</span>');
										jQuery('#profileview-form').append(activetemplate);
									}
								}
							}
						}
					});
				}

				function populateInviteData() {
					service.getInviteStatus({
						success : function(InviteList) {
							jQuery('#admin-list-min').empty();
							var adminmintemplate = jQuery('#admin-list-min-template').remove().attr('id', '');
							//Forbackup
							var backupAdmintemplate = adminmintemplate.clone();
							backupAdmintemplate.attr('id', 'admin-list-min-template');
							jQuery('#manage-admin').append(backupAdmintemplate);
							adminmintemplate.show();
							var ADMINCOUNT = InviteList.length;
							for (var i = 0; i < ADMINCOUNT; i++) {
								var newadminelement = adminmintemplate.clone();
								if (InviteList[i].status == 'ACCEPTED') {
									jQuery('.admin-list-min', newadminelement).html(ACCEPTEDICON + '<strong>' + InviteList[i].email + '</strong>');
									DOMAINSTRENGTHDATA.a = DOMAINSTRENGTHDATA.a+1; 
								} else {
									jQuery('.admin-list-min', newadminelement).html(PENDINGICON + '<strong>' + InviteList[i].email + '</strong>' + InviteList[i].status).addClass('pending');
									DOMAINSTRENGTHDATA.b = DOMAINSTRENGTHDATA.b+1; 
									PENDINGLIST.push(InviteList[i].email);
								}
								jQuery('#admin-list-min').append(newadminelement);
								$("#admin-list-min").sortable();
								if (i === ADMINCOUNT - 1) {
									DOMAINSTRENGTHDATA.y ="2014-02";
									var domainsData =[];
									domainsData.push(DOMAINSTRENGTHDATA);
									invite.pendingList(PENDINGLIST);
									populateDomainStrengthGraphs(domainsData);
								}
							}
						}
					});
				}

				function populateDomainStrengthGraphs(domainsData) {
					Morris.Line({
						element : 'domain-strength-chart',
						data : domainsData,
						xkey : 'y',
						xLabels : 'month',
						lineColors : ['#009ACD', '#e34a33'],
						lineWidth : 4,
						pointSize : 5,
						ykeys : ['a', 'b'],
						labels : ['Accepted', 'Pending']
					});
				}

				function displayAlert() {
					//This should never show up.
					alert('Error in Loading! Please Refresh the page!');
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
						// Get Privilage
						getInfoByPrivilage();

						//HTML Event - Actions
						jQuery('#signout-button').on('click', function(e) {
							service.Logout({
								success : function() {
									jQuery.removeCookie('user', {
										path : '/'
									});
									jQuery.removeCookie('subuser', {
										path : '/'
									});
									router.go('/home', 'admin');
									window.setTimeout('location.reload()', 500);
									// refresh after 1/2 sec
								},
							});

						});

						jQuery('#student-manage').on('click', function() {
							router.go('/admin/subuseradd', 'admin');
						});
						jQuery('.adminboard').on('click', function() {

						});
						jQuery('#admin-done').on('click', function() {
							router.go('/home', '/admin');
						});

					} // Cookie Guider
				};

			}

			return AdminView;
		}());

	return new AdminView();
});
