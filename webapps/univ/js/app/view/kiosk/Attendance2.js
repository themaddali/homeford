define(['jquery', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', 'ellipsis', '../../view/kiosk/Attendance3'], function(jquery, cookie, service, banner, router, ellipsis, attendance3) {"use strict";

	var Attendance2 = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template, templateself;
			var TARGETVIEW;
			var ACTIVESTUDENT = {};
			var ACTIVEPARENT = {};
			var KIOSKMODE = false;
			var kidheader = '<div class="canvas-partition"><i style="color:#737373;padding-left: 10px;" class="icon-user  icon-1x "></i><span class="tag">Student</span></div>';
			var parentheader = '<div class="canvas-partition"><i style="color:#737373;padding-left: 10px;" class="icon-group  icon-1x "></i><span class="tag">Identify Yourself:</span></div>';

			function Attendance2() {

				function checkForActiveCookie() {
					if (jQuery.cookie('user') && jQuery.cookie('user') !== 'home') {
						banner.setBrand();
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

				function populateData() {
					var activedomains = [];
					jQuery('.metadata').text(Date.now());
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
					getMembers(activedomains);
					setInterval(function() {
						GetClock();
					}, 1000);

				}

				//Thanks to http://www.ricocheting.com/code/javascript/html-generator/date-time-clock
				function GetClock() {
					var tday = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");
					var tmonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");

					var d = new Date();
					var nday = d.getDay();
					var nmonth = d.getMonth();
					var ndate = d.getDate();
					var nyear = d.getYear();
					var nhour = d.getHours();
					var nmin = d.getMinutes();
					var nsec = d.getSeconds();
					var ap;

					if (nyear < 1000)
						nyear = nyear + 1900;

					if (nhour == 0) {
						ap = " AM";
						nhour = 12;
					} else if (nhour <= 11) {
						ap = " AM";
					} else if (nhour == 12) {
						ap = " PM";
					} else if (nhour >= 13) {
						ap = " PM";
						nhour -= 12;
					}

					if (nmin <= 9) {
						nmin = "0" + nmin;
					}
					if (nsec <= 9) {
						nsec = "0" + nsec;
					}

					jQuery('#currenttime').text("" + tday[nday] + ", " + tmonth[nmonth] + " " + ndate + ", " + nyear + " " + nhour + ":" + nmin + ":" + nsec + ap + "");
				}

				function getMembers(activedomains) {
					jQuery('#invite-domain').empty();
					jQuery('.contentfull').empty();
					//Draw student
					var selfitem = templateself.clone();
					jQuery('.contentfull').append(kidheader);
					jQuery('.student-name', selfitem).text(ACTIVESTUDENT.name);
					jQuery('.kiosk-headshot', selfitem).attr('src', ACTIVESTUDENT.img);
					jQuery(selfitem).attr('memberid', ACTIVESTUDENT.id);
					jQuery('.contentfull').append(selfitem);
					var memberscount = 0;
					for (var i = 0; i < activedomains.length; i++) {
						service.getDomainMembers(activedomains[i], {
							success : function(data) {
								var thisitem = template.clone();
								jQuery('.cardsloading').fadeOut(200);
								jQuery('.contentfull').append(parentheader);
								for (var j = 0; j < data.length; j++) {
									if (data[j].id == ACTIVESTUDENT.id) {
										jQuery('.metainfo').text(data[j].parents.length + ' identified guardians');
										for (var k = 0; k < data[j].parents.length; k++) {
											var thisitemknown = template.clone();
											if ((data[j].parents[k].firstName === 'null' || data[j].parents[k].firstName == null || data[j].parents[k].firstName === "" ) && (data[j].parents[k].lastName === 'null' || data[j].parents[k].lastName == null || data[j].parents[k].lastName === "")) {
												jQuery('.student-name', thisitemknown).text(data[j].parents[k].email);
											} else {
												jQuery('.student-name', thisitemknown).text(data[j].parents[k].firstName + ' ' + data[j].parents[k].lastName).attr('fn', data[j].parents[k].firstName).attr('ln', data[j].parents[k].lastName).attr('memberid', data[j].parents[k].id).attr('email', data[j].parents[k].email);
											}
											if (data[j].parents[k].image && data[j].parents[k].image.name != null) {
												jQuery('.kiosk-headshot', thisitemknown).attr('src', '/zingoare/api/profileupload/picture/' + data[j].parents[k].image.id);
											} else {
												jQuery('.kiosk-headshot', thisitemknown).attr('src', 'img/noimg.png');
											}
											jQuery(thisitemknown).attr('memberid', data[j].parents[k].id);
											jQuery('.contentfull').append(thisitemknown);
										}
									}
									if (j === data.length - 1) {
										var thisitem = template.clone();
										jQuery('.student-name', thisitem).text('New Person');
										var _image = "img/addguardian.png";
										jQuery('.kiosk-headshot', thisitem).attr('src', _image);
										jQuery('.contentfull').append(thisitem);
										jQuery('.student-name').ellipsis({
											onlyFullWords : true
										});
										activateEvents();
									}
								}
							}
						});
					}
				}

				function resetView() {
					jQuery('.contentfull').empty();
					jQuery('#nopage-warning').fadeOut(500);
					jQuery('.main-content-header').fadeIn(400);
					jQuery('.main-content').fadeIn(400);
					jQuery('#project-nav').fadeIn(400);
					jQuery('.identify-code').val('');
					jQuery('#new-kiosk-code').val('');
					jQuery('#new-kiosk-code-repeat').val('');
					jQuery('.newcode').hide();
				}

				function activateEvents() {
					jQuery('.faceboard').on('click', function() {
						if ($(this).find('.student-name').text() === 'New Person') {
							router.go('/attendancekioskadd', '/attendancekioskidentify');
						} else if ($(this).find('.student-name').text() !== ACTIVESTUDENT.name) {
							//Bring up validation screen.
							jQuery('#nopage-warning').fadeIn(500);
							jQuery('.main-content-header').fadeOut(400);
							jQuery('.main-content').fadeOut(400);
							jQuery('#project-nav').fadeOut(400);
							jQuery('.identify-code').val('');
							ACTIVEPARENT.name = $(this).find('.student-name').text();
							ACTIVEPARENT.id = $(this).attr('memberid');
							ACTIVEPARENT.img = $(this).find('.kiosk-headshot').attr('src');
							jQuery('.no-page-message').text(ACTIVEPARENT.name + ', Please keyin your 4 digit kiosk identification code!');
						}
					});

					jQuery('.faceboard').hover(function() {
						if ($(this).find('.student-name').text() !== ACTIVESTUDENT.name) {
							$(this).removeClass('fade');
						}
					});
					jQuery('.faceboard').mouseout(function() {
						if ($(this).find('.student-name').text() !== ACTIVESTUDENT.name) {
							$(this).addClass('fade');
						}
					});
				}

				function Identify(indentificationcode) {
					jQuery('.identify-code').removeClass('error');
					if (indentificationcode.length === 4 && indentificationcode.indexOf(' ') === -1 && jQuery.isNumeric(indentificationcode)) {
						//Valid case
						jQuery('#nopage-warning').fadeOut(500);
						jQuery('.main-content-header').fadeIn(400);
						jQuery('.main-content').fadeIn(400);
						jQuery('#project-nav').fadeIn(400);
						console.log('Add Validation logic here');
						attendance3.activeStudent(ACTIVEPARENT.name, ACTIVEPARENT.id, ACTIVEPARENT.img, ACTIVESTUDENT);
						router.go('/attendancekioskaction', '/attendancekioskidentify');
					} else {
						//Invalid Case
						jQuery('.identify-code').addClass('error');
					}
				}


				this.activeStudent = function(studentname, studentid, studentimg) {
					ACTIVESTUDENT.name = studentname;
					ACTIVESTUDENT.id = studentid;
					ACTIVESTUDENT.img = studentimg;
				};

				this.pause = function() {

				};

				this.resume = function() {
					$(".card-search").autocomplete("destroy");
					resetView();
					GetClock();
					populateData();
					banner.setBrand();
					if (!ACTIVESTUDENT || ACTIVESTUDENT.name === null || !ACTIVESTUDENT.name) {
						router.go('/attendancekiosk');
					} else {
						jQuery('.no-page-message').text('Please keyin your 4 digit kiosk identification code for ' + ACTIVESTUDENT.name + '!');
					}
					//Set Focus
					setTimeout(function() {
						jQuery('.identify-code').focus();
					}, 300);
					var timeout;
					document.onmousemove = function() {
						clearTimeout(timeout);
						timeout = setTimeout(function() {
							router.go('/attendancekiosk');
						}, 60000);
					};
					document.title = 'Zingoare | Attendance Kiosk';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Kiosk';

					if (checkForActiveCookie() === true) {
						template = jQuery('#member-template').remove().attr('id', '');
						templateself = jQuery('#member-template-self').remove().attr('id', '');
						GetClock();
						var timeout;
						document.onmousemove = function() {
							clearTimeout(timeout);
							timeout = setTimeout(function() {
								router.go('/attendancekiosk');
							}, 60000);
						};
						if (!ACTIVESTUDENT || ACTIVESTUDENT.name === null || !ACTIVESTUDENT.name) {
							router.go('/attendancekiosk');
						} else {
							jQuery('.no-page-message').text('Please keyin your 4 digit identification code for ' + ACTIVESTUDENT.name + '!');
							populateData();
						}

						//HTML Event - Actions
						jQuery('.subtitleinfo').click(function() {
							router.go('/attendancekiosk');
						});
						//Setfocus
						setTimeout(function() {
							jQuery('.identify-code').focus();
						}, 500);
						jQuery('.identify-code').bind('keypress', function(e) {
							if (e.keyCode === 13) {
								Identify(jQuery('.identify-code').val());
							}
						});
						jQuery('.identify-code-button').click(function() {
							Identify(jQuery('.identify-code').val());
						});

					} // Cookie Guider
				};

			}

			return Attendance2;
		}());

	return new Attendance2();
});
