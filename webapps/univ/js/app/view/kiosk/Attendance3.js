define(['jquery', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify'], function(jquery, cookie, service, banner, router, notify) {"use strict";

	var Attendance3 = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template;
			var TARGETVIEW;
			var ACTIVEINFO = {};
			var KIOSKMODE = false;

			function Attendance3() {

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
					if (ACTIVEINFO.sname && ACTIVEINFO.sname !== null) {
						jQuery('#s-name').val(ACTIVEINFO.sname);
						//jQuery('#s-img').attr('src', ACTIVEINFO.simg);
						jQuery('#g-name').val(ACTIVEINFO.gname);
						jQuery('#g-rel').val(toTitleCase(ACTIVEINFO.relation));
						jQuery('#checkin-notes').val('');
						jQuery('.edittextarea').focus();
						if (ACTIVEINFO.state === 'Checked In') {
							jQuery('#attendanceaction').val('Check Out').css('background-color', '#0784E3');
						} else {
							jQuery('#attendanceaction').val('Check In').css('background-color', 'green');
						}
						setInterval(function() {
							GetClock();
						}, 1000);
					} else {
						router.go('/attendancekiosk');
					}
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

				//http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
				function toTitleCase(str) {
					return str.replace(/\w\S*/g, function(txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
				}


				this.activeStudent = function(gname, gid, gimg, grel, Studentobj) {
					ACTIVEINFO.gname = gname;
					ACTIVEINFO.gid = gid;
					ACTIVEINFO.gimg = gimg;
					ACTIVEINFO.sname = Studentobj.name;
					ACTIVEINFO.sid = Studentobj.id;
					ACTIVEINFO.simg = Studentobj.img;
					ACTIVEINFO.relation = grel;
					ACTIVEINFO.state = Studentobj.state;
					ACTIVEINFO.stateid = Studentobj.stateid;
				};

				this.pause = function() {

				};

				this.resume = function() {

					if (ACTIVEINFO.state === null) {
						router.go('/attendancekiosk');
					} else {
						GetClock();
						populateData();
						banner.setBrand();
						jQuery('#action-canvas').show();
					}
					document.title = 'Zingoare | Attendance Kiosk';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Kiosk';

					if (checkForActiveCookie() === true) {
						template = jQuery('#member-template').remove().attr('id', '');
						GetClock();
						populateData();

						//HTML Event - Actions
						jQuery('.subtitleinfo').click(function() {
							router.go('/attendancekiosk');
						});
						jQuery('.subtitleinfo-2').click(function() {
							router.go('/attendancekioskidentify');
						});

						jQuery('#attendanceaction').click(function() {
							if (jQuery('#attendanceaction').val() === 'Check In') {
								service.checkIn(service.domainNametoID(jQuery.cookie('subuser')), ACTIVEINFO.gid, ACTIVEINFO.sid, jQuery('#checkin-notes').val(), {
									success : function(data) {
										if (data.status !== 'error') {
											jQuery('#attendanceaction').val('Checked In');
											ACTIVEINFO.state = null;
											notify.showNotification('OK', ' Checked In:  ' + ACTIVEINFO.gname);
											setTimeout(function() {
												jQuery('#action-canvas').slideUp(1000);
											}, 500);
											setTimeout(function() {
												router.go('/attendancekiosk');
											}, 3000);
										} else {
											alert(data.message);
										}
									}
								});
							} else {
								service.checkOut(service.domainNametoID(jQuery.cookie('subuser')), ACTIVEINFO.gid, ACTIVEINFO.sid, ACTIVEINFO.stateid, jQuery('#checkin-notes').val(), {
									success : function(data) {
										if (data.status !== 'error') {
											jQuery('#attendanceaction').val('Checked Out');
											notify.showNotification('OK', ' Checked Out:  ' + ACTIVEINFO.gname);
											ACTIVEINFO.state = null;
											setTimeout(function() {
												jQuery('#action-canvas').slideUp(1000);
											}, 500);
											setTimeout(function() {
												router.go('/attendancekiosk');
											}, 3000);
										} else {
											alert(data.message);
										}
									}
								});
							}
						});

						jQuery('#attendancecancel').click(function() {
							router.go('/attendancekiosk');
						});

					} // Cookie Guider
				};

			}

			return Attendance3;
		}());

	return new Attendance3();
});
