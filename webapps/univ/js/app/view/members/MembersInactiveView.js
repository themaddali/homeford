define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/studentlist/StudentListView'], function(cookie, service, validate, tablesorter, router, notify, admin, studentlist) {"use strict";

	var MembersInactiveView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function MembersInactiveView() {

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
						router.go('/admin', '/membersinactive');
					} else {
						loadTable(activedomains);
					}

				}

				function loadTable(activedomains) {
					jQuery('.noinfo').show();
					jQuery('.view-table').hide();
					var rowtemplate = jQuery('#services-template').attr('id', '');
					//Backing the template
					jQuery('.div-template').append(rowtemplate.attr('id', 'services-template'));
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.getDomainMembers(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
									for (var z = 0; z < data[j].domains.length; z++) {
										if (data[j].domains[z].id === parseInt(jQuery.cookie('_did')) && data[j].domains[z].roleStatus == 'INACTIVE') {
											jQuery('.member-id', row).text(data[j].id);
											jQuery('.member-f-name', row).text(data[j].firstName + ' '+data[j].lastName);
											jQuery('.member-p-count', row).text(data[j].parents.length);
											jQuery('.activate', row).attr('memberid',data[j].id);
											jQuery('.view-table  tbody').append(row);
										}
									}
									
									if (j === data.length - 1) {
										jQuery('.view-table').trigger("update");
										activateTableClicks();
									}
								}
							}
						});
					}
				}

				function toAMPM(s) {
					s = s.slice(0, -3);
					if (parseInt(s.split(":")[0]) < 13) {
						return s + ' AM';
					} else {
						var newhour = (parseInt(s.split(":")[0]) - 12);
						if (newhour < 10) {
							newhour = '0' + newhour;
						}
						var news = newhour + ':' + s.split(":")[1] + ' PM';
						return news;
					}
				}

				function activateTableClicks() {
					
					jQuery('.activate').click(function(){
						var memberid = jQuery(this).attr('memberid');
						jQuery(this).fadeOut(2000);
						service.enableUser(jQuery.cookie('_did'), memberid, {
							success : function(response) {
								if (response.status !== 'error') {
									notify.showNotification('OK', response.message);
									studentlist.reload();
								} else {
									notify.showNotification('ERROR', response.message);
								}
							}
						});
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

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Inactive List';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Inactive List';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return MembersInactiveView;
		}());

	return new MembersInactiveView();
});
