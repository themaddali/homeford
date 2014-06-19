define(['jquery', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', 'ellipsis', '../../view/todo/ToDoAssignView', '../../view/quizpool/QuizAssignView', '../../view/billing/InvoiceGenerateView'], function(jquery, cookie, service, banner, router, ellipsis, todoassign, quizassign, invoicegenerate) {"use strict";

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
					jQuery('#invite-domain').empty();
					jQuery('.contentfull').empty();
					jQuery('#checkbox-control').text('Un-Select All');
					membernames = [];
					var memberscount = 0;
					for (var i = 0; i < activedomains.length; i++) {
						service.getMembersOnly(activedomains[i], {
							success : function(data) {
								var thisitem = template.clone();
								for (var j = 0; j < data.length; j++) {
									var roles = JSON.stringify(data[j].roles);
									if (roles.indexOf('ROLE_TIER3') !== -1) {
										memberscount = memberscount + 1;
										jQuery('.metadata').text(new Date());
										var thisitem = template.clone();
										if ((data[j].firstName === 'null' || data[j].firstName == null || data[j].firstName === "" ) && (data[j].lastName === 'null' || data[j].lastName == null || data[j].lastName === "")) {
											jQuery('.kioskcard-name', thisitem).text(data[j].email);
										} else {
											jQuery('.kioskcard-name', thisitem).text(data[j].firstName + ' ' + data[j].lastName);
										}
										jQuery('.kioskcard-checkbox', thisitem).attr('checked', 'checked');
										membernames.push(jQuery('.kioskcard-name', thisitem).text());
										jQuery('.kioskcard-id', thisitem).text('Id# ' + data[j].id);
										jQuery('.contentfull').append(thisitem);
									}
									if (j === data.length - 1) {
										$(".card-search").autocomplete({
											source : function(request, response) {
												var results = $.ui.autocomplete.filter(membernames, request.term);
												response(results.slice(0, 5));
											}
										});
										jQuery('.kioskcard-name').ellipsis({
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

					jQuery('.card-search').change(function(event) {
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

					jQuery('.kioskcancel').click(function() {
						jQuery('.kioskcard').removeClass('cardinactive');
						jQuery('.kioskcard').removeClass('cardactive');
					});

					jQuery('.kioskok').click(function() {
						$(".kioskcard.cardactive  i").fadeOut(800);
						setTimeout(function() {
							$(".kioskcard.cardactive  i").removeClass('icon-thumbs-down').addClass('icon-thumbs-up').css('color', '#007DBA');
							$(".kioskcard.cardactive  i").fadeIn(700);
							$(this).attr('disabled', 'disabled');
							$('.kioskcard.cardactive').find('.kiosk-flag-text').text('Checked In');
							jQuery('.kioskcard.cardactive input[type="text"]').attr("disabled", "disabled");
							jQuery('.kioskcard.cardactive textarea').attr("disabled", "disabled");
							jQuery('.kioskcard.cardactive > .kioskaction').find('.kioskok').val('Checked In').css('background-color', '#007DBA');
							setTimeout(function() {
								jQuery('.kioskcard').removeClass('cardinactive');
								jQuery('.kioskcard').removeClass('cardactive');
							}, 2000);
						}, 700);
					});

					jQuery('.ui-menu-item').click(function(event) {
						var searchword = jQuery('.card-search').val().toUpperCase();
						;
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
						;
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
							jQuery(this).parent().removeClass('cardinactive').addClass('cardactive');
							if (jQuery(this).find('i').hasClass('icon-thumbs-up')) {
								jQuery('.kioskcard.cardactive input[type="text"]').attr("disabled", "disabled");
								jQuery('.kioskcard.cardactive textarea').attr("disabled", "disabled");
								jQuery('.kioskcard.cardactive > .kioskaction').find('.kioskok').val('Check Out').css('background-color', '#e36607');

							} else {
								jQuery('.kioskcard.cardactive input[type="text"]').removeAttr("disabled");
								jQuery('.kioskcard.cardactive textarea').removeAttr("disabled");
								jQuery('.kioskcard.cardactive.kioskok').val("Check In").css('background-color', 'green');
							}
						}
					});
				}

				function validateSubmit() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					$(".card-search").autocomplete("destroy");
					GetClock();
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
							populateData();
						});

					} // Cookie Guider
				};

			}

			return Attendance;
		}());

	return new Attendance();
});
