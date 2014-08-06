define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/invite/AdminsEditView'], function(cookie, service, validate, tablesorter, router, notify, admin, adminsedit) {"use strict";

	var AdminsListView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};
			var ACCEPTEDICON = '<i class="icon-check icon-1x" style="padding-right:10px"></i>';
			var PENDINGICON = '<i class="icon-spinner icon-1x" style="padding-right:10px"></i>';
			var COMMENTICON = '<i class="icon-comment icon-1x" style="padding-right:10px; color: #0784E3; cursor: pointer"></i>';
			var EXTRAICON = '<i class="icon-circle-arrow-up icon-1x" style="padding-right:3px;padding-left:10px; font-size:11px; color: red; cursor: pointer"><span class="time-diff billyes" style="padding-left:2px"></span></i>';
			var EXTRAICONOK = '<i class="icon-circle-arrow-down icon-1x" style="padding-right:3px;padding-left:10px; font-size:11px; color: green; cursor: pointer"><span class="time-diff billno" style="padding-left:2px"></span></i>';
			var DIALOGBODY = '<div id="note-dialog" title="Note"><p><span id="note-message" style="font-size:12px; color: black"></span></p><p id="note-auto-warning" style="font-size:11px; color: red" ><strong>Attn: </strong>This student is off the assigned scheduled</p></div>';
			var ACTIVEDOMAINS = [];
			var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			var BILLABLEEXTRA = 0;
			var template;

			function AdminsListView() {

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
					jQuery('.cardsloading').show();
					jQuery('.view-table  tbody').empty();
					jQuery('.view-table').tablesorter();
					var date = new Date();
					var y = date.getFullYear();
					var m = date.getMonth() + 1;
					if (m < 10) {
						m = '0' + m;
					}
					var d = date.getDate();
					if (d < 10) {
						d = '0' + d;
					}
					var today = y + '-' + m + '-' + d;
					if (Modernizr.touch && Modernizr.inputtypes.date) {
						document.getElementById('header-label').type = 'date';
						document.getElementById('header-label-to').type = 'date';
						jQuery("#header-label").val(today);
						jQuery("#header-label-to").val(today);
					} else {
						// var date = new Date();
						// var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
						jQuery("#header-label").datepicker({
							dateFormat : 'yy-mm-dd',
							minDate : -90,
							maxDate : 0,
						});
						jQuery("#header-label").val(today);
						jQuery("#header-label-to").datepicker({
							dateFormat : 'yy-mm-dd',
							minDate : -90,
							maxDate : 0,
						});
						jQuery("#header-label-to").val(today);
					}
					ACTIVEDOMAINS = [];
					ACTIVEDOMAINS.push(service.domainNametoID(jQuery.cookie('subuser')));
					if (!ACTIVEDOMAINS || ACTIVEDOMAINS.length == 0) {
						router.go('/admin', '/adminslist');
					} else {
						jQuery('.noinfo').show();
						jQuery('.view-table').hide();
						loadTable(ACTIVEDOMAINS);
					}

				}

				function loadTable(activedomains) {
					if (activedomains[0]) {
						service.checkInStats(activedomains[0], {
							success : function(stats) {
								var rowtemplate = jQuery('#admin-template').attr('id', '');
								jQuery('.cardsloading').hide();
								//Backing the template
								jQuery('.div-template').append(rowtemplate.attr('id', 'admin-template'));
								var COUNT = stats.length;
								BILLABLEEXTRA = 0;
								var dailysummary = new Object();
								updateSummary(stats);
								dailysummary[toDate(stats[0].checkinTime)] = [COUNT, 0];
								for (var i = 0; i < COUNT; i++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
									jQuery('.s-id', row).text(i + 1);
									jQuery('.s-name', row).text(stats[i].kid.firstName);
									jQuery('.checkin-time', row).text(msToTime(stats[i].checkinTime));
									jQuery('.checkin-date', row).text(toDate(stats[i].checkinTime));
									jQuery('.checkin-by', row).text(stats[i].parent.firstName);
									jQuery('.checkout-time', row).text(msToTime(stats[i].checkoutTime));
									if (stats[i].checkout_parent) {
										jQuery('.checkout-by', row).text(stats[i].checkout_parent.firstName);
									} else {
										jQuery('.checkout-by', row).text('-');
									}
									if (!stats[i].notes || stats[i].notes.length == 0) {
										stats[i].notes = 'No Message';
									}
									if (!stats[i].checkedout_notes || stats[i].checkedout_notes.length == 0) {
										stats[i].checkedout_notes = 'No Message';
									}
									if (stats[i].notes !== 'No Message' || stats[i].checkedout_notes !== 'No Message') {
										jQuery('.notes', row).attr('note', '<p><strong>CheckIn Note: </strong>' + stats[i].notes + '<p /><p><strong>CheckOut Note: </strong>' + stats[i].checkedout_notes + '</p>').html(COMMENTICON);
									} else {
										jQuery('.notes', row).attr('note', 'No Note!!').text('--');
									}
									if (stats[i].checkInTimeDiff && stats[i].checkInTimeDiff != 0) {
										if (stats[i].checkInTimeDiff < 0) {
											jQuery('.checkin-time', row).append(EXTRAICON);
											jQuery('.time-diff', row).text(minToTime(stats[i].checkInTimeDiff));
											BILLABLEEXTRA = BILLABLEEXTRA + stats[i].checkInTimeDiff;
											jQuery('#attendance-total').text(minToTime(BILLABLEEXTRA));
											dailysummary[toDate(stats[i].checkinTime)][1] = dailysummary[toDate(stats[i].checkinTime)][1] + stats[i].checkInTimeDiff;
										} else {
											jQuery('.checkin-time', row).append(EXTRAICONOK);
											jQuery('.time-diff', row).text(minToTime(stats[i].checkInTimeDiff));
										}
									}
									if (stats[i].checkOutTimeDiff && stats[i].checkOutTimeDiff != 0) {

										if (stats[i].checkOutTimeDiff < 0) {
											jQuery('.checkout-time', row).append(EXTRAICON);
											jQuery('.checkout-time', row).find('.time-diff').text(minToTime(stats[i].checkOutTimeDiff));
											BILLABLEEXTRA = BILLABLEEXTRA + stats[i].checkOutTimeDiff;
											jQuery('#attendance-total').text(minToTime(BILLABLEEXTRA));
											dailysummary[toDate(stats[i].checkinTime)][1] = dailysummary[toDate(stats[i].checkinTime)][1] + stats[i].checkOutTimeDiff;
										} else {
											jQuery('.checkout-time', row).append(EXTRAICONOK);
											jQuery('.checkout-time', row).find('.time-diff').text(minToTime(stats[i].checkOutTimeDiff));
										}
									}
									jQuery('.view-table  tbody').append(row);
									if (i === COUNT - 1 && activedomains.length > 0) {
										jQuery('.view-table').trigger("update");
										activateTableClicks();
										jQuery('#attendance-total').text(minToTime(BILLABLEEXTRA));
										createSummaryBlock(dailysummary);
									}
								}
							}
						});
					}
				}

				function reLoadTable(activedomains) {
					jQuery('.cardsloading').show();
					jQuery('.view-table  tbody').empty();
					jQuery('.big-table-summary').empty();
					var dailysummary = new Object();
					if (activedomains[0]) {
						service.checkInStatsbyDate(activedomains[0], jQuery('#header-label').val(), jQuery('#header-label-to').val(), {
							success : function(stats) {
								var rowtemplate = jQuery('#admin-template').attr('id', '');
								//Backing the template
								jQuery('.div-template').append(rowtemplate.attr('id', 'admin-template'));
								jQuery('.cardsloading').hide();
								var COUNT = stats.length;
								BILLABLEEXTRA = 0;
								updateSummary(stats);
								for (var i = 0; i < COUNT; i++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
									if (!dailysummary[toDate(stats[i].checkinTime)]) {
										dailysummary[toDate(stats[i].checkinTime)] = [1, 0];
									} else {
										dailysummary[toDate(stats[i].checkinTime)][0] = dailysummary[toDate(stats[i].checkinTime)][0] + 1;
									}
									jQuery('.s-id', row).text(i + 1);
									jQuery('.s-name', row).text(stats[i].kid.firstName);
									jQuery('.checkin-time', row).text(msToTime(stats[i].checkinTime));
									jQuery('.checkin-date', row).text(toDate(stats[i].checkinTime));
									jQuery('.checkin-by', row).text(stats[i].parent.firstName);
									jQuery('.checkout-time', row).text(msToTime(stats[i].checkoutTime));
									if (stats[i].checkout_parent) {
										jQuery('.checkout-by', row).text(stats[i].checkout_parent.firstName);
									} else {
										jQuery('.checkout-by', row).text('-');
									}
									if (!stats[i].notes || stats[i].notes.length == 0) {
										stats[i].notes = 'No Message';
									}
									if (!stats[i].checkedout_notes || stats[i].checkedout_notes.length == 0) {
										stats[i].checkedout_notes = 'No Message';
									}
									if (stats[i].notes !== 'No Message' || stats[i].checkedout_notes !== 'No Message') {
										jQuery('.notes', row).attr('note', '<p><strong>CheckIn Note: </strong>' + stats[i].notes + '<p /><p><strong>CheckOut Note: </strong>' + stats[i].checkedout_notes + '</p>').html(COMMENTICON);
									} else {
										jQuery('.notes', row).attr('note', 'No Note!!').text('--');
									}
									if (stats[i].checkInTimeDiff && stats[i].checkInTimeDiff != 0) {
										if (stats[i].checkInTimeDiff < 0) {
											jQuery('.checkin-time', row).append(EXTRAICON);
											jQuery('.time-diff', row).text(minToTime(stats[i].checkInTimeDiff));
											BILLABLEEXTRA = BILLABLEEXTRA + stats[i].checkInTimeDiff;
											dailysummary[toDate(stats[i].checkinTime)][1] = dailysummary[toDate(stats[i].checkinTime)][1] + stats[i].checkInTimeDiff;
											jQuery('#attendance-total').text(minToTime(BILLABLEEXTRA));
										} else {
											jQuery('.checkin-time', row).append(EXTRAICONOK);
											jQuery('.time-diff', row).text(minToTime(stats[i].checkInTimeDiff));
										}
									}
									if (stats[i].checkOutTimeDiff && stats[i].checkOutTimeDiff != 0) {
										if (stats[i].checkOutTimeDiff < 0) {
											jQuery('.checkout-time', row).append(EXTRAICON);
											jQuery('.checkout-time', row).find('.time-diff').text(minToTime(stats[i].checkOutTimeDiff));
											BILLABLEEXTRA = BILLABLEEXTRA + stats[i].checkOutTimeDiff;
											jQuery('#attendance-total').text(minToTime(BILLABLEEXTRA));
											dailysummary[toDate(stats[i].checkinTime)][1] = dailysummary[toDate(stats[i].checkinTime)][1] + stats[i].checkOutTimeDiff;
										} else {
											jQuery('.checkout-time', row).append(EXTRAICONOK);
											jQuery('.checkout-time', row).find('.time-diff').text(minToTime(stats[i].checkOutTimeDiff));
										}
									}

									// if (dateunique.indexOf(toDate(stats[i].checkinTime)) === -1) {
									// var thisitem = template.clone();
									// dateunique.push(toDate(stats[i].checkinTime));
									// jQuery('.day-header p', thisitem).text(toDate(stats[i].checkinTime));
									// jQuery('.right', thisitem).text(minToTime(BILLABLEEXTRA));
									// jQuery('.left', thisitem).text(_daycount);
									// jQuery('.big-table-summary').append(thisitem);
									// _extratime = 0;
									// _daycount = 0;
									// }
									jQuery('.view-table  tbody').append(row);
									if (i === COUNT - 1 && activedomains.length > 0) {
										//activedomains.splice(0, 1);
										jQuery('.view-table').trigger("update");
										jQuery('#attendance-total').text(minToTime(BILLABLEEXTRA));
										createSummaryBlock(dailysummary);
										activateTableClicks();
									}
								}
							}
						});
					}
				}

				function createSummaryBlock(dailysummary) {
					for (var i in dailysummary) {
						var thisitem = template.clone();
						jQuery('.day-header p', thisitem).text(i);
						jQuery('.left', thisitem).text(dailysummary[i][0] + ' entries');
						jQuery('.right', thisitem).text(minToTime(dailysummary[i][1]) + ' extra');
						jQuery('.big-table-summary').append(thisitem);
					}
				}

				function updateSummary(data) {
					var studentids = [];
					var _checkin = 0;
					var _checkout = 0;
					for (var j = 0; j < data.length; j++) {
						if (data[j].type === 'CHECKIN') {
							_checkin = _checkin + 1;
							$('#attendance-in').text(_checkin);
						} else {
							_checkout = _checkout + 1;
							$('#attendance-out').text(_checkout);
						}
					}
				}

				function activateTableClicks() {
					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery('.admin-action').css('color', 'white');
						jQuery(this).addClass('rowactive');
						jQuery('.rowactive').find('.admin-action').css('color', '#007DBA');
						var note = jQuery(this).find('.notes').attr('note');
						if ((jQuery(this).find('.checkin-time').find('.time-diff')).parent().hasClass('icon-circle-arrow-up')) {
							var _indiff = (jQuery(this).find('.checkin-time').find('.time-diff').text().split(" ")[0]);
							_indiff = parseInt(_indiff.split(":")[0] * 60) + parseInt(_indiff.split(":")[1]);
						} else {
							var _indiff = 0;
						}
						if ((jQuery(this).find('.checkout-time').find('.time-diff')).parent().hasClass('icon-circle-arrow-up')) {
							var _outdiff = (jQuery(this).find('.checkout-time').find('.time-diff').text().split(" ")[0]);
							_outdiff = parseInt(_outdiff.split(":")[0] * 60) + parseInt(_outdiff.split(":")[1]);
						} else {
							var _outdiff = 0;
						}
						var timetotal = parseInt(_indiff + _outdiff);
						var warnnote = "This student is off the assigned scheduled duration by " + minToTime(timetotal) + ". For this additional service create <a href='#/invoicenew' style='font-size:11px; color: #007DBA; cursor: pointer'>new invoice</a>";
						if ((_indiff + _outdiff) === 0) {
							warnnote = '';
						}
						jQuery('#note-message').html(note);
						jQuery('#note-auto-warning').html(warnnote);
						jQuery("#note-dialog").dialog("open");
					});
					jQuery('.view-table thead > tr > th').click(function() {
						if (jQuery(this).find('i').hasClass('icon-sort-by-attributes')) {
							jQuery('.tablesortcontrol').removeClass('active');
							jQuery(this).find('i').addClass('active');
							jQuery('.tablesortcontrol').addClass('icon-sort-by-attributes-alt ').removeClass('icon-sort-by-attributes ');
						} else {
							jQuery('.tablesortcontrol').removeClass('active');
							jQuery(this).find('i').addClass('active');
							jQuery('.tablesortcontrol').addClass('icon-sort-by-attributes ').removeClass('icon-sort-by-attributes-alt ');
						}
					});

				}

				function msToTime(s) {
					if (!s || s === null) {
						return '-';
					} else {
						var datepart = s.split(" ")[0].split('-');
						var locals = datepart[1] + '/' + datepart[2] + '/' + datepart[0] + ' ' + s.split(" ")[1] + ' UTC';
						var localnow = new Date(locals);
						var h = localnow.toString().split(":")[0].slice(-2);
						var m = localnow.toString().split(":")[1];
						// if (m < 10) {
						// m = '0' + m;
						// }
						if (h < 13) {
							if (h < 10) {
								return ('0' + h + ':' + m + ' am');
							} else {
								return (h + ':' + m + ' am');
							}
						} else {
							var h = h - 12;
							if (h < 10) {
								h = '0' + h;
							}
							return (h + ':' + m + ' pm');
						}
					}
				}

				function minToTime(s) {
					if (s===0) {
						return '';
					}
					if (s < 0) {
						s = s * -1;
						var _m = s % 60;
						var _h = Math.floor(s / 60);
						return _h + ':' + _m + ' mins';
					} else {
						var _m = s % 60;
						var _h = Math.floor(s / 60);
						return _h + ':' + _m + ' mins';
					}
				}

				function toDate(s) {
					var datepart = s.split(" ")[0].split('-');
					var locals = datepart[1] + '/' + datepart[2] + '/' + datepart[0] + ' ' + s.split(" ")[1] + ' UTC';
					var localnow = new Date(locals);
					//For IE dumb pattern :(
					if (localnow.toString().slice(-1) === ")") {
						//console.log('Not IE -' + localnow.toString());
						localnow = localnow.toString().split(" ");
						return localnow[1] + ' ' + localnow[2];
					} else {
						//console.log('IE Sucker -' + localnow.toString());
						localnow = localnow.toString().split(" ");
						return localnow[1] + ' ' + localnow[2];
					}
				}

				function clearForm() {

				}

				function initDialog() {
					jQuery('body').append(DIALOGBODY);
					$("#note-dialog").dialog({
						autoOpen : false,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						modal : true,
					});
				}

				function positionModal() {
					// var freewidth = $('.modal-body').width() - 815;
					// if ($('.modal-body').width() > 480) {
					// jQuery('.modal-container.print.showheader').css('margin-left', freewidth / 2);
					// }
				}

				function updateFiltercounter() {
					var count = jQuery('input[type="checkbox"]:unchecked').length;
					jQuery('.filter-selection-count').text(count);
					// if (count === 0) {
					// jQuery('.filter-selection-count').text('');
					// }
				}


				this.pause = function() {

				};

				this.resume = function() {
					//$('#note-dialog').dialog('destroy');
					initDialog();
					populateData();
					positionModal();
					jQuery('.filter-selection-count').text('0');
					jQuery('input[type="checkbox"]').prop('checked', true);
					jQuery('#admin-template').show();
					document.title = 'Zingoare | Attendance Summary';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Summary';
					initDialog();
					if (checkForActiveCookie() === true) {
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
						positionModal();
						template = jQuery('#day-template').remove().attr('id', '');
						// When the browser changes size
						$(window).resize(positionModal);
						populateData();

						jQuery('.filter-selection-icon').click(function() {
							jQuery('.modal-contents').toggle(0);
							jQuery('.filter-selection').toggle(0);
							jQuery('.icon-wrench').toggle();
							jQuery('.icon-check').toggle();
							jQuery('.modal_close').toggle();
						});

						jQuery('input[type="checkbox"]').change(function() {
							updateFiltercounter();
							var mode = $(this).val();
							if (mode === 'out') {
								if (! $(this).is(":checked")) {
									$('td.checkout-by:not(:contains("-"))').parents('tr').hide(0);
								} else {
									$('td.checkout-by:not(:contains("-"))').parents('tr').show(0);
								}
							}
							if (mode === 'in') {
								if (! $(this).is(":checked")) {
									$('td.checkout-by:contains("-")').parents('tr').hide(0);
								} else {
									$('td.checkout-by:contains("-")').parents('tr').show(0);
								}
							}
							if (mode === 'noteno') {
								if (! $(this).is(":checked")) {
									$('td.notes:contains("--")').parents('tr').hide(0);
								} else {
									$('td.notes:contains("--")').parents('tr').show(0);
								}
							}
							if (mode === 'noteyes') {
								if (! $(this).is(":checked")) {
									$('td.notes:not(:contains("--"))').parents('tr').hide(0);
								} else {
									$('td.notes:not(:contains("--"))').parents('tr').show(0);
								}
							}
							if (mode === 'extrayes') {
								if (! $(this).is(":checked")) {
									$('.billyes:visible').parent().parent().parent().hide();
								} else {
									$('.billyes').parent().parent().parent().show();
								}
							}
							if (mode === 'extrano') {
								if (! $(this).is(":checked")) {
									$('td.notes:not(:contains("--"))').parents('tr').hide(0);
								} else {
									$('td.notes:not(:contains("--"))').parents('tr').show(0);
								}
							}

						});

						//jQuery UI Bug - Hot Fix
						jQuery('#header-label').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});
						jQuery('#header-label-to').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});

						jQuery('#header-label').change(function() {
							var fromdate = $('#header-label').datepicker('getDate');
							$('#header-label-to').datepicker('option', 'minDate', fromdate);
							var todate = $('#header-label-to').datepicker('getDate');
							if (fromdate > todate) {
								$('#header-label-to').val(fromdate);
							}
							reLoadTable(ACTIVEDOMAINS);
						});

						jQuery('#header-label-to').change(function() {
							reLoadTable(ACTIVEDOMAINS);
						});

						//HTML Event - Actions
						jQuery('#closethis').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#printbutton').on('click', function() {
							//jQuery('.modal-container.print.showheader').css('margin-left', 0);
						});

					} // Cookie Guider
				};

			}

			return AdminsListView;
		}());

	return new AdminsListView();
});
