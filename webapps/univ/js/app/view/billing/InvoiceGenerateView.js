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
			var leadtemplate, followtemplate;
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
					var domainIDs = [];
					domainIDs.push(service.domainNametoID(jQuery.cookie('subuser')));
					getServices(domainIDs);
				}

				function getServices(activedomains) {
					SERVICESALL = [];
					jQuery('.servicetemplate').remove();
					//jQuery('.edit-select').empty();
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
								// for (var j = 0; j < data.length; j++) {
								// SERVICESALL.push(data[j]);
								// jQuery('#service-template select').append('<option cost="' + SERVICESALL[j].unit_price + '" tax="' + SERVICESALL[j].tax + '" desc="' + SERVICESALL[j].description + '">' + SERVICESALL[j].name + '</option>');
								// if (data[j].status === 'Active' || data[j].status === 'ACTIVE') {
								// jQuery('#default-service-select').append('<option cost="' + data[j].unit_price + '" tax="' + data[j].tax + '" desc="' + data[j].description + '">' + data[j].name + '</option>');
								// }
								// }
								for (var j = 0; j < data.length; j++) {
									if (j === 0) {
										var thisservice = leadtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description);
										// jQuery(thisservice)
										jQuery('.service-ol').append(thisservice);
									} else {
										var thisservice = followtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description);
										jQuery('.service-ol').append(thisservice);
									}
									// if (data[j].status === 'Active' || data[j].status === 'ACTIVE') {
									// jQuery('#default-service-select').append('<option cost="' + data[j].unit_price + '" tax="' + data[j].tax + '" desc="' + data[j].description + '">' + data[j].name + '</option>');
									// }
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
						leadtemplate = jQuery('#service-lead').remove().attr('id', '');
						followtemplate = jQuery('#service-follow').remove().attr('id', '');
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						$(".formlink").click(function() {
							var thisservice = template.clone();
							jQuery(thisservice).show();
							jQuery(thisservice).find('select').attr('id', 'service-select-' + jQuery('select').length);
							jQuery(thisservice).addClass('extraservice');
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
							for (var i = 0; i < $('input:checked').length; i++) {
								var _servicesentries = {};
								_servicesentries.name = $('input:checked')[i].attributes[4].nodeValue;
								_servicesentries.cost = $('input:checked')[i].attributes[5].nodeValue;
								_servicesentries.tax = $('input:checked')[i].attributes[6].nodeValue;
								_servicesentries.desc = $('input:checked')[i].attributes[7].nodeValue;
								_services.push(_servicesentries);
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
