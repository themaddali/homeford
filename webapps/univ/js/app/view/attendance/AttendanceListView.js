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
			var DIALOGBODY = '<div id="note-dialog" title="Note"><p id="note-message"></p></div>';

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
					//var activedomains = admin.getActiveDomainsIDs();
					var activedomains = [];
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
					if (!activedomains || activedomains.length == 0) {
						router.go('/admin', '/adminslist');
					} else {
						jQuery('.noinfo').show();
						jQuery('.view-table').hide();
						loadTable(activedomains);
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
									jQuery('.view-table  tbody').append(row);
									if (i === COUNT - 1 && activedomains.length > 0) {
										activedomains.splice(0, 1);
										jQuery('.view-table').trigger("update");
										loadTable(activedomains);
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
						jQuery('#note-message').html(note);
						jQuery("#note-dialog").dialog("open");
					});
				}

				function msToTime(s) {
					if (!s || s === null) {
						return '-';
					} else {
						var dateformat = new Date(s);
						var h = dateformat.getHours();
						var m = dateformat.getMinutes();
						var s = dateformat.getSeconds();
						if (h < 13) {
							return (h + ':' + m + ' am');
						} else {
							return ((h - 12) + ':' + m + ' pm');
						}
						//return (((h * 60) + m) + ":" + s);
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
						}
					});
				}


				this.pause = function() {

				};

				this.resume = function() {
					//$('#note-dialog').dialog('destroy');
					initDialog();
					populateData();
					document.title = 'Zingoare | Attendance Summary';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Attendance Summary';
					initDialog();
					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return AdminsListView;
		}());

	return new AdminsListView();
});
