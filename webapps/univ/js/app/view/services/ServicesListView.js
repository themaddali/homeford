define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/services/ServicesEditView'], function(cookie, service, validate, tablesorter, router, notify, admin, servicesedit) {"use strict";

	var ServicesListView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function ServicesListView() {

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
						router.go('/admin', '/memberslist');
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
						service.ListAllServices(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
									jQuery('.service-name', row).text(data[j].name);
									jQuery('.service-id', row).text(data[j].id);
									jQuery('.service-desc', row).text(data[j].description);
									jQuery('.service-cost', row).text('$' + data[j].unit_price);
									jQuery('.service-tax', row).text(data[j].tax + '%');
									jQuery('.service-freq', row).text(data[j].days + ' days');
									if (data[j].startTime === null) {
										data[j].startTime = '-:00';
									}
									if (data[j].endTime === null) {
										data[j].endTime = '-:00';
									}
									jQuery('.service-stime', row).text(toAMPM(data[j].startTime));
									jQuery('.service-etime', row).text(toAMPM(data[j].endTime));
									jQuery('.service-status', row).text(data[j].status);
									jQuery('.view-table  tbody').append(row);
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
					if (parseInt(s.split(":")[0]) < 12) {
						return s + ' AM';
					} else {
						var newhour = (parseInt(s.split(":")[0]) - 12);
						if (newhour === 0) {
							newhour = 12;
						}
						if (newhour < 10) {
							newhour = '0' + newhour;
						}
						var news = newhour + ':' + s.split(":")[1] + ' PM';
						return news;
					}
				}

				function activateTableClicks() {
					var rowObject = {
						name : "none",
						desc : "none",
						id : 'none',
						cost : 'none',
						stime : 'none',
						etime : 'none',
						tax : 'none',
						status : 'none',
					};

					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery(this).addClass('rowactive');
						rowObject.name = jQuery(this).find('.service-name').text();
						rowObject.desc = jQuery(this).find('.service-desc').text();
						rowObject.status = jQuery(this).find('.service-status').text();
						rowObject.id = jQuery(this).find('.service-id').text();
						rowObject.cost = jQuery(this).find('.service-cost').text().replace('$','');
						rowObject.freq = jQuery(this).find('.service-freq').text();
						rowObject.stime = jQuery(this).find('.service-stime').text();
						rowObject.etime = jQuery(this).find('.service-etime').text();
						rowObject.tax = jQuery(this).find('.service-tax').text().replace('%','');
						servicesedit.setInfo(rowObject);
						router.go('/servicesedit');
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
					document.title = 'Zingoare | Services List';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Services List';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return ServicesListView;
		}());

	return new ServicesListView();
});
