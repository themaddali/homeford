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
			var EXTRAICON = '<i class="icon-circle-arrow-up icon-1x" style="padding-right:3px;padding-left:10px; font-size:11px; color: red; cursor: pointer"><span class="time-diff" style="padding-left:2px"></span></i>';
			var DIALOGBODY = '<div id="note-dialog" title="Note"><p><span id="note-message" style="font-size:12px;"></span></p><p id="note-auto-warning" style="font-size:11px; color: red" >This student is off the assigned scheduled duration by 4 minutes</p></div>';
			var ACTIVEDOMAINS = [];
			var Months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
								//Backing the template
								jQuery('.div-template').append(rowtemplate.attr('id', 'admin-template'));
								var COUNT = stats.length;
								for (var i = 0; i < COUNT; i++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
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
										jQuery('.notes', row).attr('note', 'CheckIn:' + stats[i].notes + '<br />CheckOut Note:' + stats[i].checkedout_notes).html(COMMENTICON);
									} else {
										jQuery('.notes', row).attr('note', 'No Note!!').text('--');
									}
									if (stats[i].checkInTimeDiff && stats[i].checkInTimeDiff != 0) {
										jQuery('.checkin-time', row).append(EXTRAICON);
										if (stats[i].checkInTimeDiff < 0) {
											stats[i].checkInTimeDiff = -1 * stats[i].checkInTimeDiff;
										}
										jQuery('.time-diff', row).text(stats[i].checkInTimeDiff);
									}
									if (stats[i].checkOutTimeDiff && stats[i].checkOutTimeDiff != 0) {
										jQuery('.checkout-time', row).append(EXTRAICON);
										if (stats[i].checkOutTimeDiff < 0) {
											stats[i].checkOutTimeDiff = -1 * stats[i].checkOutTimeDiff;
										}
										jQuery('.checkout-time', row).find('.time-diff').text(stats[i].checkOutTimeDiff);
									}
									jQuery('.view-table  tbody').append(row);
									if (i === COUNT - 1 && activedomains.length > 0) {
										jQuery('.view-table').trigger("update");
										activateTableClicks();
									}
								}
							}
						});
					}
				}

				function reLoadTable(activedomains) {
					jQuery('.view-table  tbody').empty();
					if (activedomains[0]) {
						service.checkInStatsbyDate(activedomains[0], jQuery('#header-label').val(), jQuery('#header-label-to').val(), {
							success : function(stats) {
								var rowtemplate = jQuery('#admin-template').attr('id', '');
								//Backing the template
								jQuery('.div-template').append(rowtemplate.attr('id', 'admin-template'));
								var COUNT = stats.length;
								for (var i = 0; i < COUNT; i++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
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
										jQuery('.notes', row).attr('note', 'CheckIn:' + stats[i].notes + '<br />CheckOut Note:' + stats[i].checkedout_notes).html(COMMENTICON);
									} else {
										jQuery('.notes', row).attr('note', 'No Note!!').text('--');
									}
									if (stats[i].checkInTimeDiff && stats[i].checkInTimeDiff != 0) {
										jQuery('.checkin-time', row).append(EXTRAICON);
										if (stats[i].checkInTimeDiff < 0) {
											stats[i].checkInTimeDiff = -1 * stats[i].checkInTimeDiff;
										}
										jQuery('.time-diff', row).text(stats[i].checkInTimeDiff);
									}
									if (stats[i].checkOutTimeDiff && stats[i].checkOutTimeDiff != 0) {
										jQuery('.checkout-time', row).append(EXTRAICON);
										if (stats[i].checkOutTimeDiff < 0) {
											stats[i].checkOutTimeDiff = -1 * stats[i].checkOutTimeDiff;
										}
										jQuery('.checkout-time', row).find('.time-diff').text(stats[i].checkOutTimeDiff);
									}
									jQuery('.view-table  tbody').append(row);
									if (i === COUNT - 1 && activedomains.length > 0) {
										//activedomains.splice(0, 1);
										jQuery('.view-table').trigger("update");
										//loadTable(activedomains);
										activateTableClicks();
									}
								}
							}
						});
					}
				}

				function activateTableClicks() {
					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery('.admin-action').css('color', 'white');
						jQuery(this).addClass('rowactive');
						jQuery('.rowactive').find('.admin-action').css('color', '#007DBA');
						var note = jQuery(this).find('.notes').attr('note');
						var _indiff = parseInt(jQuery(this).find('.checkin-time').find('.time-diff').text());
						var _outdiff = parseInt(jQuery(this).find('.checkout-time').find('.time-diff').text());
						if (!_indiff) {
							_indiff = 0;
						}
						if (!_outdiff) {
							_outdiff = 0;
						}
						var warnnote = "This student is off the assigned scheduled duration by " + (_indiff + _outdiff) + " minutes";
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
							return (h + ':' + m + ' am');
						} else {
							return ((h - 12) + ':' + m + ' pm');
						}
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


				this.pause = function() {

				};

				this.resume = function() {
					//$('#note-dialog').dialog('destroy');
					initDialog();
					populateData();
					positionModal();
					//jQuery('.modal-container').removeClass('print');
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
						// When the browser changes size
						$(window).resize(positionModal);
						populateData();

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
							// var date = new Date();
							// var todaydate = date.getDate();
							// var todaymonth = date.getMonth() + 1;
							// if (todaydate < 10) {
							// todaydate = '0' + todaydate;
							// }
							// if (todaymonth < 10) {
							// todaymonth = '0' + todaymonth;
							// }
							// if (jQuery('#header-label').val().split("-")[2] !== todaydate) {
							// alert('Only Todays reports are availabe in zingoare. Upgrade to Zingoare + or Zingoare ++ to access historic reports and a lot more.');
							// var today = date.getFullYear() + '-' + (todaymonth) + '-' + todaydate;
							// jQuery('#header-label').val(today);
							// }
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
