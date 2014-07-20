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
						service.getInviteStatus(activedomains[0], {
							success : function(InviteList) {
								var rowtemplate = jQuery('#admin-template').attr('id', '');
								//Backing the template
								jQuery('.div-template').append(rowtemplate.attr('id', 'admin-template'));
								var ADMINCOUNT = InviteList.length;
								for (var i = 0; i < ADMINCOUNT; i++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
									jQuery('.admin-email', row).text(InviteList[i].email);
									jQuery('.admin-invitedby', row).text(InviteList[i].sentBy);
									jQuery('.admin-domain', row).text(InviteList[i].domainName);
									jQuery('.admin-roles', row).text('');
									for (var j = 0; j < InviteList[i].roles.length; j++) {
										jQuery('.admin-roles', row).text(jQuery('.admin-roles', row).text() + ROLEMAP[InviteList[i].roles[j].roleName] + ' ');
									}
									if (InviteList[i].status == 'ACCEPTED') {
										//jQuery('.admin-icon', row).empty().append(ACCEPTEDICON);
										jQuery('.admin-status', row).text((InviteList[i].status).toLowerCase());
									} else {
										//jQuery('.admin-icon', row).empty().append(PENDINGICON);
										jQuery('.admin-status', row).text((InviteList[i].status).toLowerCase());
									}

									jQuery('.view-table  tbody').append(row);
									if (i === ADMINCOUNT - 1 && activedomains.length > 0) {
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
					var rowObject = {
						email : 'none',
						invitedby : 'none',
						status : 'none',
						domain : 'none',
						roles : 'none'
					};

					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery('.admin-action').css('color', 'white');
						jQuery(this).addClass('rowactive');
						jQuery('.rowactive').find('.admin-action').css('color', '#007DBA');
						rowObject.email = jQuery(this).find('.admin-email').text();
						rowObject.invitedby = jQuery(this).find('.admin-invitedby').text();
						rowObject.status = jQuery(this).find('.admin-status').text();
						rowObject.domain = jQuery(this).find('.admin-domain').text();
						rowObject.roles = jQuery(this).find('.admin-roles').text();
						adminsedit.setInviteInfo(rowObject);
						router.go('/adminslistedit');
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

					// jQuery('.view-table tbody tr').click(function() {
					// jQuery('.view-table tbody tr').removeClass('rowactive');
					// jQuery('.admin-action').css('color', 'white');
					// jQuery(this).addClass('rowactive');
					// jQuery('.rowactive').find('.admin-action').css('color', '#007DBA');
					// });
					//
					// jQuery('.admin-action').click(function(e) {
					// if (jQuery(this).parent().hasClass('rowactive')) {
					// rowObject.email = jQuery(this).parent().find('.admin-email').text();
					// rowObject.invitedby = jQuery(this).parent().find('.admin-invitedby').text();
					// rowObject.status = jQuery(this).parent().find('.admin-status').text();
					// rowObject.domain = jQuery(this).parent().find('.admin-domain').text();
					// rowObject.roles = jQuery(this).parent().find('.admin-roles').text();
					// adminsedit.setInviteInfo(rowObject);
					// router.go('/adminslistedit');
					// }
					// });
				}

				function clearForm() {

				}

				function updateFiltercounter() {
					var count = jQuery('input[type="checkbox"]:unchecked').length;
					jQuery('.filter-selection-count').text(count);
					if (count === 0) {
						jQuery('.filter-selection-count').text('');
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Admin List';
					jQuery('.filter-selection-count').text('');
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Admin List';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('.filter-selection-icon').click(function() {
							jQuery('.modal-contents').toggle(900);
							jQuery('.filter-selection').toggle(900);
							jQuery('.icon-wrench').toggle();
							jQuery('.icon-check').toggle();
							jQuery('.modal_close').toggle();
						});

						jQuery('input[type="checkbox"]').change(function() {
							updateFiltercounter();
							if (! $(this).is(":checked")) {
								//alert('Add Filter' + $(this).val());
								$('td:contains(' + $(this).val() + ')').parents('tr').hide(0);
							} else {
								$('td:contains(' + $(this).val() + ')').parents('tr').show(0);
							}
						});

					} // Cookie Guider
				};

			}

			return AdminsListView;
		}());

	return new AdminsListView();
});
