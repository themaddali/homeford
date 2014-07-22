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
			var newitemvalidator;
			var ActiveMembers = 'All Members';
			var SERVICESALL = [];
			var DIALOG = '<div id="item-dialog-form" title="Add new item"><form id="new-item-form" class="edit-form"><fieldset><ol class="service-ol"><li class="form-item"><label>Item Name</label><div class="form-content"><input placeholder="Late Fee" id="new-item-name" name="newitemname" type="text" /></div></li><li class="form-item"><label>Item Description</label><div class="form-content"><textarea class="edittextarea" placeholder="Ex: Late pick up fee" id="new-item-desc" name="newitemdesc"></textarea></div></li><li class="form-item"><label>Item Cost</label><div class="form-content"><input placeholder="10" id="new-item-cost" name="newitemcost" type="number" /></div></li><li class="form-item"><label>Category</label><div class="form-content"><select class="edit-select" id="new-item-type" type="text"><option>One Time Fee</option><option>Recuring Fee</option><option>Add On Fee</option><option>Discount</option></select></div></li></ol></fieldset></form></div>';
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
										jQuery('#services-grid').append(thisservice);
									} else {
										var thisservice = followtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description);
										jQuery('#services-grid').append(thisservice);
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
					jQuery('input[type="text"]').val("");
					jQuery('#member-role').prop('checked', false);
					jQuery('.edit-notify').hide();
					jQuery('.modal_close').show();
				}

				function addNewItem() {
					if ($("#new-item-form").valid()) {
						var thisservice = followtemplate.clone();
						jQuery('.services-list', thisservice).parent().append(jQuery('#new-item-name').val());
						jQuery('.services-list', thisservice).attr('sname', jQuery('#new-item-name').val()).attr('cost', jQuery('#new-item-cost').val()).attr('tax', '0').attr('desc', jQuery('#new-item-desc').val()).attr('checked', 'checked');
						jQuery('#services-grid').append(thisservice);
						jQuery('#new-item-name').val('');
						jQuery('#new-item-cost').val('');
						jQuery('#new-item-desc').val('');
						$("#item-dialog-form").dialog("close");
					}
				}

				function getSelectedText(elementId) {
					var elt = document.getElementById(elementId);
					if (elt.selectedIndex == -1)
						return null;
					return elt.options[elt.selectedIndex].text;
				}


				$.validator.addMethod("validAssignment", function(value, element, param) {
					if (jQuery('#member-list').val() == 'None' || jQuery('#member-list').val().indexOf("0 of") !== -1) {
						jQuery('#member-list').css('color', 'red');
						return false;
					} else {
						jQuery('#member-list').css('color', 'black');
						return true;
					}
				}, 'Select to whom to assign.');

				jQuery.validator.addMethod("money", function(value, element) {
					//value = value.replace('$', '');
					//value = value.replace('%', '');
					var isValidMoney = /^\d{0,4}(\.\d{0,2})?$/.test(value);
					return this.optional(element) || isValidMoney;
				}, "Enter valid dollar amount ");

				function initDialog() {
					jQuery('body').append(DIALOG);
					$("#item-dialog-form").dialog({
						autoOpen : false,
						height : 500,
						width : 600,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						modal : true,
						buttons : {
							"Add" : addNewItem,
							Cancel : function() {
								$("#item-dialog-form").dialog("close");
							}
						},
						close : function() {
							$(this).dialog("close");
						}
					});
				}


				this.selectedMembers = function(selection) {
					ActiveMembers = selection;
					jQuery('#member-list').css('color', 'black');
				};

				this.pause = function() {

				};

				this.resume = function() {

					//$("#member-name").autocomplete("destroy");
					validator.resetForm();
					newitemvalidator.resetForm();
					initDialog();
					if (ActiveMembers.text) {
						jQuery('.edit-notify').hide();
						jQuery('#member-list').val(ActiveMembers.text);
						jQuery('#member-list').css('color', 'black');
					} else {
						clearForm();
						populateData();
					}

					document.title = 'Zingoare | Invoice Generate';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Invoice Generate';

					if (checkForActiveCookie() === true) {
						leadtemplate = jQuery('#service-lead').remove().attr('id', '');
						followtemplate = jQuery('#service-follow').remove().attr('id', '');
						initDialog();
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('.formlink').click(function() {
							jQuery("#item-dialog-form").dialog("open");
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
							if ($("#invoice-form").valid()) {
								router.go('/invoicepreview');
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						jQuery('#member-list').click(function() {
							router.go('/memberspick');
						});

						jQuery('#invoice-send').on('click', function() {
							if ($("#invoice-form").valid()) {
								ActiveMembers = {};
								router.returnToPrevious();
								// service.sendInvite(jQuery('#invite-email').val(), jQuery('#invite-message').val(), jQuery('#invite-domain').val(), roles, {
								// success : function(response) {
								// if (response.status !== 'error') {
								// notify.showNotification('OK', response.message);
								// } else {
								// notify.showNotification('ERROR', response.message);
								// }
								// }
								// });
								// setTimeout(function() {
								// router.returnToPrevious();
								// }, 2000);
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery("#invoice-form").validate({
							rules : {
								assignedto : {
									validAssignment : true
								},
								services : {
									required : false
								},
								invitemessage : {
									maxlength : 20
								}
							},
							messages : {
								services : "You must check at least 1 service"
							}
						});

						newitemvalidator = jQuery("#new-item-form").validate({
							rules : {
								newitemname : {
									required : true
								},
								newitemdesc : {
									required : true
								},
								newitemcost : {
									required : true,
									money : true
								}
							},
						});

					} // Cookie Guider
				};

			}

			return InvoiceGenerateView;
		}());

	return new InvoiceGenerateView();
});
