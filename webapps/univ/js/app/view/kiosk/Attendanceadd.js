define(['jquery', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', 'ellipsis'], function(jquery, cookie, service, banner, router, ellipsis) {"use strict";

	var Attendanceadd = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template;
			var TARGETVIEW;
			var KIOSKMODE = false;

			function Attendanceadd() {

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

				function snapshot(localMediaStream) {
					if (localMediaStream) {
						jQuery('#video-container').fadeOut(100);
						jQuery('#capture-img').fadeIn(100);
						jQuery('#capture-image-button').fadeOut(100);
						jQuery('#capture-image-button-refresh').fadeIn(100);
						var video = document.querySelector('video');
						var canvas = document.querySelector('canvas');
						var ctx = canvas.getContext('2d');
						var localMediaStream = null;
						ctx.drawImage(video, 0, 0);
						// "image/webp" works in Chrome.
						// Other browsers will fall back to image/png.
						document.getElementById('capture-img').src = canvas.toDataURL('image/webp');
					}
				}

				function setCamera() {
					//Special Thanks: http://blog.teamtreehouse.com/accessing-the-device-camera-with-getusermedia
					// Normalize the various vendor prefixed versions of getUserMedia.
					navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
					// Check that the browser supports getUserMedia.
					// If it doesn't show an alert, otherwise continue.
					if (navigator.getUserMedia) {
						// Request the camera.
						navigator.getUserMedia(
						// Constraints
						{
							video : true
						},

						// Success Callback
						function(localMediaStream) {
							// Get a reference to the video element on the page.
							var vid = document.getElementById('camera-stream');
							// Create an object URL for the video stream and use this
							// to set the video source.
							vid.src = window.URL.createObjectURL(localMediaStream);
							jQuery('#capture-image-button').click(function() {
								snapshot(localMediaStream);
							});
						},

						// Error Callback
						function(err) {
							// Log the error to the console.
							console.log('Sorry, You are not authorised to represent this kid. Please see admin.');
							jQuery('#video-container').hide();
							jQuery('#camera-controls').hide();
							jQuery('#capture-img').show();
							activateFileUpload();
						});

					} else {
						jQuery('#video-container').hide();
						jQuery('#camera-controls').hide();
						jQuery('#capture-img').show();
						activateFileUpload();
					}
				}

				function activateFileUpload() {
					jQuery('#capture-img').click(function() {
						$('input[type=file]').click();
					});
				}


				this.pause = function() {

				};

				this.resume = function() {
					document.title = 'Zingoare | Attendance';
				};

				this.init = function() {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Kiosk';

					if (checkForActiveCookie() === true) {
						//template = jQuery('#member-template').remove().attr('id', '');
						//Preactivate Dependency
						setCamera();

						//HTML Event - Actions
						jQuery('#capture-image-button-refresh').click(function() {
							jQuery('#video-container').fadeIn(100);
							jQuery('#capture-img').fadeOut(100);
							jQuery('#capture-image-button').fadeIn(100);
							jQuery('#capture-image-button-refresh').fadeOut(100);
						});

						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return Attendanceadd;
		}());

	return new Attendanceadd();
});
