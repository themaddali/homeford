//View that will drive the Students list page.

define(['cookie', '../app/service/DataService', 'validate', 'tablesorter', '../app/Router', '../app/Notify', '../app/AdminView','../app/AdminsEditView'], function(cookie, service, validate, tablesorter, router, notify, admin, adminsedit) {"use strict";

	var AdminsListView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			}
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
					jQuery('#AdminsListView-table').tablesorter();
					var activedomains = admin.getActiveDomains();
					if (!activedomains || activedomains.length == 0) {
						router.go('/admin', '/adminslist');
					} else {
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
										jQuery('#AdminsListView-table').trigger("update");
										//var sorting = [[2, 1], [0, 0]];
										//jQuery("#AdminsListView-table").trigger("sorton", [sorting]);
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
					});

					jQuery('.admin-action').click(function(e) {
						if (jQuery(this).parent().hasClass('rowactive')) {
							rowObject.email = jQuery(this).parent().find('.admin-email').text();
							rowObject.invitedby = jQuery(this).parent().find('.admin-invitedby').text();
							rowObject.status = jQuery(this).parent().find('.admin-status').text();
							rowObject.domain = jQuery(this).parent().find('.admin-domain').text();
							rowObject.roles = jQuery(this).parent().find('.admin-roles').text();
							adminsedit.setInviteInfo(rowObject);
							router.go('/adminslistedit');
						}
					});
				}

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

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
