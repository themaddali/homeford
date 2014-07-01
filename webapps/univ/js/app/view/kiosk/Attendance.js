define(['jquery', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', 'ellipsis', '../../view/kiosk/Attendance2'], function(jquery, cookie, service, banner, router, ellipsis, attendance2) {"use strict";

	var Attendance = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template;
			var TARGETVIEW;
			var KIOSKMODE = false;

			function Attendance() {

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
					jQuery('.contentfull').empty();
					membernames = [];
					for (var i = 0; i < activedomains.length; i++) {
						service.getDomainMembers(activedomains[i], {
							success : function(data) {
								var thisitem = template.clone();
								jQuery('.cardsloading').fadeOut(200);
								for (var j = 0; j < data.length; j++) {
									jQuery('.metainfo').text(data.length + ' members');
									var thisitem = template.clone();
									if ((data[j].firstName === 'null' || data[j].firstName == null || data[j].firstName === "" ) && (data[j].lastName === 'null' || data[j].lastName == null || data[j].lastName === "")) {
										jQuery('.student-name', thisitem).text(data[j].email);
										jQuery('.student-select', thisitem).attr('name', data[j].email);
									} else {
										jQuery('.student-name', thisitem).text(data[j].firstName + ' ' + data[j].lastName);
										jQuery('.student-select', thisitem).attr('name', data[j].email);
									}
									membernames.push(jQuery('.kioskcard-name', thisitem).text());
									if (!data[j].image || data[j].image === null) {
										var _image = "img/noimg.png";
										jQuery('.kiosk-headshot', thisitem).attr('src', _image);
									} else {
										_image = '/zingoare/api/profileupload/picture/' + data[j].image.id;
										jQuery('.kiosk-headshot', thisitem).attr('src', _image);
									}
									jQuery(thisitem).attr('name', data[j].id);
									//jQuery(thisitem).attr('memberid', data[j].id);
									jQuery('.contentfull').append(thisitem);
									if (j === data.length - 1) {
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

				function activateEvents() {

					jQuery('.kioskboard').on('click', function() {
						// successful selection of user for context, and create cookie
						var selectedUserName = $(this).find('.student-name').text();
						var selectedUserId = $(this).attr('name');
						var selectedUserimg = $(this).find('.kiosk-headshot').attr('src');
						attendance2.activeStudent(selectedUserName, selectedUserId, selectedUserimg);
						router.go('/attendancekioskidentify', '/attendancekiosk');
					});

					jQuery('.kioskok').click(function() {
						if ($(this).val() === 'Check-In') {
							if (validateSubmit() == true) {
								$(".kioskcard.cardactive  i").fadeOut(800);
								setTimeout(function() {
									$(".kioskcard.cardactive  i").removeClass('icon-thumbs-down').addClass('icon-thumbs-up').css('color', '#007DBA');
									$(".kioskcard.cardactive  i").fadeIn(700);
									$(this).attr('disabled', 'true');
									$('.kioskcard.cardactive').find('.kiosk-flag-text').text('Checked In');
									jQuery('.kioskcard.cardactive input[type="text"]').attr("disabled", "disabled");
									jQuery('.kioskcard.cardactive textarea').attr("disabled", "disabled");
									jQuery('.kioskcard.cardactive select').attr("disabled", "disabled");
									jQuery('.kioskcard.cardactive > .kioskaction').find('.kioskok').val('Checked In').css('background-color', '#007DBA');

									setTimeout(function() {
										jQuery('.kioskcard.cardactive').find('.card-form-container').hide();
										jQuery('.kioskcard.cardactive').find('.kioskaction').hide();
										jQuery('.kioskcard').removeClass('cardinactive');
										jQuery('.kioskcard').removeClass('cardactive');
									}, 2000);
								}, 700);
							}

						} else {

						}
					});

					jQuery('.ui-menu-item').click(function(event) {
						var searchword = jQuery('.card-search').val().toUpperCase();
						var cardlist = jQuery('.contentfull .kioskcard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.toUpperCase().indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
						}
					});
					jQuery('.card-search').keyup(function(event) {
						var searchword = jQuery('.card-search').val().toUpperCase();
						var cardlist = jQuery('.contentfull .kioskcard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.toUpperCase().indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
						}
					});

					jQuery('.kioskflag').click(function() {
						if (!jQuery(this).parent().hasClass('cardactive')) {
							jQuery('.kioskcard').removeClass('cardactive');
							jQuery('.kioskcard').addClass('cardinactive');
							jQuery(this).parent().find('.card-form-container').show();
							jQuery(this).parent().find('.kioskaction').show();
							jQuery(this).parent().removeClass('cardinactive').addClass('cardactive');
							if (jQuery(this).find('i').hasClass('icon-thumbs-up')) {
								jQuery('.kioskcard.cardactive input[type="text"]').attr("disabled", "disabled");
								jQuery('.kioskcard.cardactive textarea').attr("disabled", "disabled");
								jQuery('.kioskcard.cardactive select').attr("disabled", "disabled");
								jQuery('.kioskcard.cardactive > .kioskaction').find('.kioskok').val('Check Out').css('background-color', '#e36607');
								setInfo('checkout');

							} else {
								jQuery('.kioskcard.cardactive input[type="text"]').removeAttr("disabled");
								jQuery('.kioskcard.cardactive textarea').removeAttr("disabled");
								jQuery('.kioskcard.cardactive select').removeAttr("disabled");
								jQuery('.kioskcard.cardactive.kioskok').val("Check In").css('background-color', 'green');
								setInfo('checkin');
							}
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
					if (jQuery('.kioskcard.cardactive').find('.attendance-dropoff-name').val().length == 0) {
						jQuery('.kioskcard.cardactive').find('.attendance-dropoff-name').addClass('error');
					}
					if (jQuery('.kioskcard.cardactive').find('.attendance-dropoff-name').val().length > 0) {
						jQuery('.kioskcard.cardactive').find('.attendance-dropoff-name').removeClass('error');
					}
					if (jQuery('.kioskcard.cardactive').find('.attendance-dropoff-rel').val() == 'Please Select') {
						jQuery('.kioskcard.cardactive').find('.attendance-dropoff-rel').addClass('error');
					}
					if (jQuery('.kioskcard.cardactive').find('.attendance-dropoff-rel').val() != 'Please Select') {
						jQuery('.kioskcard.cardactive').find('.attendance-dropoff-rel').removeClass('error');
					}
					// if (jQuery('.kioskcard.cardactive').find('.attendance-dropoff-notes').val().length == 0) {
					// jQuery('.kioskcard.cardactive').find('.attendance-dropoff-notes').addClass('error');
					// }
					// if (jQuery('.kioskcard.cardactive').find('.attendance-dropoff-notes').val().length > 0) {
					// jQuery('.kioskcard.cardactive').find('.attendance-dropoff-notes').removeClass('error');
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


				this.pause = function() {

				};

				this.resume = function() {
					$(".card-search").autocomplete("destroy");
					GetClock();
					jQuery('#nopage-warning').fadeOut(500);
					jQuery('.main-content-header').fadeIn(400);
					jQuery('.main-content').fadeIn(400);
					jQuery('#project-nav').fadeIn(400);
					populateData();
					banner.setBrand();
					document.title = 'Zingoare | Attendance Kiosk';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Kiosk';
					if (KIOSKMODE == false && $('#nopage-warning').is(':visible') == false) {
						router.go('/admin');
					}

					if (checkForActiveCookie() === true) {
						template = jQuery('#member-template').remove().attr('id', '');
						//Preactivate Dependency
						//todoassign.init();
						GetClock();
						//populateData();

						//HTML Event - Actions
						jQuery('.launchkiosk').click(function() {
							KIOSKMODE = true;
							jQuery('#nopage-warning').fadeOut(500);
							jQuery('.main-content-header').fadeIn(400);
							jQuery('.main-content').fadeIn(400);
							jQuery('#project-nav').fadeIn(400);
							populateData();
						});

					} // Cookie Guider
				};

			}

			return Attendance;
		}());

	return new Attendance();
});
