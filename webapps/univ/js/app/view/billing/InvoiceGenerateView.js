define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/billing/InvoicePreviewView'], function(cookie, service, validate, router, notify, admin, invoicepreview) {"use strict";

	var InvoiceGenerateView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};
			var activeDomains = [];
			var pendingList;
			var validator;
			var ActiveMembers = 'All Members';
			var SERVICESALL = [];

			function InvoiceGenerateView() {

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
					// //getMembers(data);
					//
					// }
					// });
					var domainIDs = [];
					domainIDs.push(service.domainNametoID(jQuery.cookie('subuser')));
					getServices(domainIDs);
				}

				function getMembers(activedomains) {
					jQuery('#invite-domain').empty();
					jQuery('#checkbox-control').text('Un-Select All');
					membernames = [];
					MEMEBERS = [];
					var memberscount = 0;
					for (var i = 0; i < activedomains.length; i++) {
						service.getMembersOnly(activedomains[i], {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									MEMEBERS.push(data);
									var roles = JSON.stringify(data[j].roles);
									if (roles.indexOf('ROLE_TIER3') !== -1) {
										if ((data[j].firstName === 'null' || data[j].firstName == null || data[j].firstName === "" ) && (data[j].lastName === 'null' || data[j].lastName == null || data[j].lastName === "")) {
											data[j].firstName = data[j].email;
											data[j].lastName = '';
										}
										membernames.push(data[j].firstName + ' ' + data[j].lastName);
									}
									if (j === data.length - 1) {
										$("#member-name").autocomplete({
											source : function(request, response) {
												var results = $.ui.autocomplete.filter(membernames, request.term);
												response(results.slice(0, 5));
											}
										});
										//activateEvents();
									}
								}
							}
						});
					}
				}

				function getServices(activedomains) {
					SERVICESALL = [];
					jQuery('#service-template select').empty();
					jQuery('.edit-select').empty();
					if (ActiveMembers.text) {
						jQuery('#member-list').val(ActiveMembers.text);
					} else {
						jQuery('#member-list').val('None');
					}
					jQuery('#member-list').css('color', 'black');
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.ListAllServices(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									SERVICESALL.push(data[j]);
									jQuery('#service-template select').append('<option cost="' + SERVICESALL[j].unit_price + '" tax="' + SERVICESALL[j].tax + '" desc="' + SERVICESALL[j].description + '">' + SERVICESALL[j].name + '</option>');
									if (data[j].status === 'Active' || data[j].status === 'ACTIVE') {
										jQuery('#default-service-select').append('<option cost="' + data[j].unit_price + '" tax="' + data[j].tax + '" desc="' + data[j].description + '">' + data[j].name + '</option>');
									}
								}
							}
						});
					}
				}

				function clearForm() {
					jQuery('.form-item > input').val("");
					jQuery('#member-role').prop('checked', false);
					jQuery('.edit-notify').hide();
					jQuery('.modal_close').show();
				}

				function getSelectedText(elementId) {
					var elt = document.getElementById(elementId);
					if (elt.selectedIndex == -1)
						return null;
					return elt.options[elt.selectedIndex].text;
				}


				this.selectedMembers = function(selection) {
					ActiveMembers = selection;
					jQuery('#member-list').css('color', 'black');
				};

				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					//$("#member-name").autocomplete("destroy");
					populateData();
					document.title = 'Zingoare | Invoice Generate';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Invoice Generate';

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						var template = jQuery('#service-template').attr('id', '');

						$(".formlink").click(function() {
							var thisservice = template.clone();
							jQuery(thisservice).show();
							jQuery(thisservice).find('select').attr('id', 'service-select-' + jQuery('select').length);
							jQuery(thisservice).addClass('extraservice');
							// for (var j = 0; j < SERVICESALL.length; j++) {
							// if (SERVICESALL[j].status === 'Active' || SERVICESALL[j].status === 'ACTIVE') {
							// jQuery('.edit-select', thisservice).append('<option cost="' + SERVICESALL[j].unit_price + '" tax="' + SERVICESALL[j].tax + '" desc="' + SERVICESALL[j].description + '">' + SERVICESALL[j].name + '</option>');
							// }
							// }
							jQuery('.service-ol').append(thisservice);
						});

						jQuery('#invoice-preview').click(function() {
							var databoject = {
								'toname' : 'None Assigned',
								'toemail' : 'Not Avaiable',
								'tomessage' : 'Happy To Help!!!!',
								'sname' : 'None Assigned',
								'cost' : '$-',
								'tax' : '-%' ,
							};

							databoject.toname = ActiveMembers.list;
							databoject.toemail = jQuery('#member-email').val();
							databoject.tomessage = jQuery('#member-message').val();
							if (databoject.tomessage == "") {
								databoject.tomessage = 'Happy to help!!!';
							}
							var _services = [];
							for (var i = 0; i < jQuery('select').length; i++) {
								if (($('#service-select-' + i).find(":selected").attr('cost'))) {
									var _servicesentries = {};
									_servicesentries.name = $('#service-select-' + i).find(":selected").text();
									_servicesentries.cost = $('#service-select-' + i).find(":selected").attr('cost');
									_servicesentries.desc = $('#service-select-' + i).find(":selected").attr('desc');
									_servicesentries.tax = $('#service-select-' + i).find(":selected").attr('tax');
									_services.push(_servicesentries);
								}
							}
							databoject.services = _services;
							invoicepreview.setData(databoject);
							router.go('/invoicepreview');
						});

						jQuery('#member-list').click(function() {
							router.go('/memberspick');
						});

						$.validator.addMethod("validAssignment", function(value, element, param) {
							if (jQuery('#member-list').val() == 'None' || jQuery('#member-list').val().indexOf("0 of") !== -1) {
								jQuery('#member-list').css('color', 'red');
								return false;
							} else {
								jQuery('#member-list').css('color', 'black');
								return true;
							}
						}, 'Select to whom to assign.');

						jQuery('#invite-send').on('click', function() {
							var roles = [{
								"roleName" : "ROLE_TIER2"
							}];
							if ($("#invite-form").valid()) {
								if (jQuery('#invite-message').val() === null || jQuery('#invite-message').val() === "") {
									jQuery('#invite-message').val("Hi, I am adding you as an admin to this domain. Register and use!!");
								}
								if ($('#member-role').is(":checked")) {
									roles = [{
										"roleName" : "ROLE_TIER2"
									}, {
										"roleName" : "ROLE_TIER3"
									}];
								}
								service.sendInvite(jQuery('#invite-email').val(), jQuery('#invite-message').val(), jQuery('#invite-domain').val(), roles, {
									success : function(response) {
										if (response !== 'error') {
											notify.showNotification('OK', response.message);
										} else {
											notify.showNotification('ERROR', response.message);
										}
									}
								});
								setTimeout(function() {
									router.returnToPrevious();
									//admin.reloadData();
								}, 2000);
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}

							//Need to update to handler
						});

						validator = jQuery("#invite-form").validate({
							rules : {
								invitedomain : {
									required : true,
									domainValidation : true
								},
								inviteemail : {
									required : true,
									email : true,
									notRepeated : true
								},
								roles : {
									required : true
								}
							}
						});

					} // Cookie Guider
				};

			}

			return InvoiceGenerateView;
		}());

	return new InvoiceGenerateView();
});
