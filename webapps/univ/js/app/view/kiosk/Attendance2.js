define(['jquery', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', 'ellipsis'], function(jquery, cookie, service, banner, router, ellipsis) {"use strict";

	var Attendance2 = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template;
			var TARGETVIEW;
			var ACTIVESTUDENT = {};
			var KIOSKMODE = false;

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
					jQuery('#checkbox-control').text('Un-Select All');
					membernames = [];
					jQuery('.metainfo').text('2 identified guardians');
					var memberscount = 0;
					for (var i = 0; i < activedomains.length; i++) {
						console.log('Fix This part');
						service.getMembersOnly(activedomains[i], {
							success : function(data) {
								var thisitem = template.clone();
								jQuery('.cardsloading').fadeOut(200);
								for (var j = 0; j < 2; j++) {
									var thisitem = template.clone();
									jQuery('.student-name', thisitem).text('Parent ' + j);
									jQuery('.student-select', thisitem).attr('name', 'Parent ' + j);
									jQuery('.contentfull').append(thisitem);
									if (j === 1) {
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
					jQuery('#nopage-warning').fadeIn(500);
					jQuery('.main-content-header').fadeOut(400);
					jQuery('.main-content').fadeOut(400);
					jQuery('#project-nav').fadeOut(400);
				}

				function activateEvents() {
					jQuery('.faceboard').on('click', function() {
						if ($(this).find('.student-name').text() === 'New Person') {
							router.go('/attendancekioskadd', '/attendancekioskidentify');
						} else {
							var selectedUserName = $(this).find('.student-name').text();
							//var selectedUserId = $(this).attr('name');
							//attendance2.activeStudent(selectedUserName, selectedUserId);
							router.go('/attendancekioskaction', '/attendancekioskidentify');
						}
					});
				}

				function setInfo(action) {
					if (action === 'checkin') {
						jQuery('.kiosk-info-title').html('Checked In From');
						jQuery('.kiosk-info-value').html('7 hours');
						jQuery('.kiosk-info-footer').html('+1 more hours');
					} else {
						jQuery('.kiosk-info-title').html('Checkout Time');
						jQuery('.kiosk-info-value').html('5:00pm');
						jQuery('.kiosk-info-footer').html('7:34 hours');
					}
				}

				function validateSubmit() {
					//Validate Name
					if (jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-name').val().length == 0) {
						jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-name').addClass('error');
					}
					if (jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-name').val().length > 0) {
						jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-name').removeClass('error');
					}
					if (jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-rel').val() == 'Please Select') {
						jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-rel').addClass('error');
					}
					if (jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-rel').val() != 'Please Select') {
						jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-rel').removeClass('error');
					}
					// if (jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-notes').val().length == 0) {
					// jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-notes').addClass('error');
					// }
					// if (jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-notes').val().length > 0) {
					// jQuery('.kioskcard.cardactive').find('.Attendance2-dropoff-notes').removeClass('error');
					// }
					if (jQuery('.kioskcard.cardactive').find('.error').length > 0) {
						return false;
						console.log('errors');
					}
					if (jQuery('.kioskcard.cardactive').find('.error').length == 0) {
						return true;
						console.log('All Good');
					}
				}

				function Identify(indentificationcode) {
					jQuery('.identify-code').removeClass('error');
					if (indentificationcode.length === 4 && indentificationcode.indexOf(' ') === -1 && jQuery.isNumeric(indentificationcode)) {
						//Valid case
						jQuery('#nopage-warning').fadeOut(500);
						jQuery('.main-content-header').fadeIn(400);
						jQuery('.main-content').fadeIn(400);
						jQuery('#project-nav').fadeIn(400);
						populateData();
					} else {
						//Invalid Case
						jQuery('.identify-code').addClass('error');
					}
				}


				this.activeStudent = function(studentname, studentid) {
					ACTIVESTUDENT.name = studentname;
					ACTIVESTUDENT.id = studentid;
				};

				this.pause = function() {

				};

				this.resume = function() {
					$(".card-search").autocomplete("destroy");
					GetClock();
					populateData();
					banner.setBrand();
					resetView();
					if (!ACTIVESTUDENT || ACTIVESTUDENT.name === null || !ACTIVESTUDENT.name) {
						router.go('/attendancekiosk');
					} else {
						jQuery('.no-page-message').text('Please keyin your 4 digit identification code for ' + ACTIVESTUDENT.name + '!');
					}
					//Set Focus
					setTimeout(function() {
						jQuery('.identify-code').focus();
					}, 500);
					document.title = 'Zingoare | Attendance Kiosk';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Kiosk';

					if (checkForActiveCookie() === true) {
						template = jQuery('#member-template').remove().attr('id', '');
						GetClock();
						if (!ACTIVESTUDENT || ACTIVESTUDENT.name === null || !ACTIVESTUDENT.name) {
							router.go('/attendancekiosk');
						} else {
							jQuery('.no-page-message').text('Please keyin your 4 digit identification code for ' + ACTIVESTUDENT.name + '!');
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
