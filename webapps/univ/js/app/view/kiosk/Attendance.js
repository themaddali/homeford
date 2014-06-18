define(['jquery', 'cookie', '../../service/DataService', '../../Router', 'ellipsis', '../../view/todo/ToDoAssignView', '../../view/quizpool/QuizAssignView', '../../view/billing/InvoiceGenerateView'], function(jquery, cookie, service, router, ellipsis, todoassign, quizassign, invoicegenerate) {"use strict";

	var Attendance = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template;
			var TARGETVIEW;
			var TARGETROUTINE;

			function Attendance() {

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

				function populateData() {
					// service.returnDomainIDList({
					// success : function(data) {
					// getMembers(data);
					// }
					// });
					//var activedomains = admin.getActiveDomainsIDs();
					var activedomains = [];
					jQuery('.metadata').text(Date.now());
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
					getMembers(activedomains);
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
					
					jQuery('.kioskcard').click(function(){
						if (!jQuery(this).hasClass('cardactive')) {
							jQuery('.kioskcard').removeClass('cardactive');
							jQuery('.kioskcard').addClass('cardinactive');
							jQuery(this).removeClass('cardinactive').addClass('cardactive');
							//helperMediaQuiries();
							//startCounter();
						}
					});
				}

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					$(".card-search").autocomplete("destroy");
					populateData();
					document.title = 'Zingoare | Attendance Kiosk';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Kiosk';

					if (checkForActiveCookie() === true) {
						template = jQuery('#member-template').remove().attr('id', '');
						//Preactivate Dependency
						//todoassign.init();
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						
					} // Cookie Guider
				};

			}

			return Attendance;
		}());

	return new Attendance();
});
