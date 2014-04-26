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
					var activedomains = admin.getActiveDomainsIDs();
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

				function activateTableClicks() {
					var rowObject = {
						name : "none",
						desc : "none",
						id : 'none',
						cost : 'none',
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
						rowObject.cost = jQuery(this).find('.service-cost').text();
						rowObject.freq = jQuery(this).find('.service-freq').text();
						rowObject.tax = jQuery(this).find('.service-tax').text();
						servicesedit.setInfo(rowObject);
						router.go('/servicesedit');
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

			return ServicesListView;
		}());

	return new ServicesListView();
});
