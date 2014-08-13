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
			var ActiveMembers = {};
			var SERVICESALL = [];
			var ITEMS = new Object();
			var PARENTS = new Object();
			var DIALOG = '<div id="item-dialog-form" title="Add New Item"><form id="new-item-form" class="edit-form"><fieldset><ol class="service-ol"><li class="form-item"><label>Item Name</label><div class="form-content"><input placeholder="Ex: Late Fee" id="new-item-name" name="newitemname" type="text" /></div></li><li class="form-item"><label>Item Description</label><div class="form-content"><textarea class="edittextarea" placeholder="Ex: Late pick up fee" id="new-item-desc" name="newitemdesc"></textarea></div></li><li class="form-item"><label>Item Cost</label><div class="form-content"><input placeholder="Ex: 10" id="new-item-cost" name="newitemcost" type="text" /></div></li><li class="form-item"><label>Category</label><div class="form-content"><select class="edit-select" id="new-item-type" type="text"><option>One Time Fee</option><option>Recuring Fee</option><option>Coupon</option><option>Discount</option></select></div></li></ol></fieldset></form></div>';
			var WARNDIALOG = '<div id="note-dialog" title="More Info Needed"> <p style="color: black "><span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>Please update domain information like address and payment details.</p></div>';
			var CHECKBOXSPAN = '<span class="checkbox-span"></span>';
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
					if (Modernizr.touch && Modernizr.inputtypes.date) {
						document.getElementById('invoice-duedate').type = 'date';
					} else {
						var date = new Date();
						var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
						var duedate = date.getFullYear() + '-' + (date.getMonth() + 2) + '-01';
						if ((date.getMonth() + 2) > 12) {
							var duedate = date.getFullYear() + 1 + '-01-01';
						}
						jQuery("#invoice-duedate").datepicker({
							minDate : 0,
							dateFormat : 'yy-mm-dd',
						});
						jQuery('#invoice-duedate').val(duedate);
					}
					getMembers(domainIDs);
					//getAddresses(domainIDs);
					//getServices(domainIDs);
				}

				function getMembers(activedomains) {
					jQuery('#kid-name').empty().append('<option>None Selected</option>');
					ITEMS = new Object();
					PARENTS = new Object();
					for (var i = 0; i < activedomains.length; i++) {
						service.getDomainMembers(activedomains[i], {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									if (data[j].itemServiceDetails.length > 0) {
										ITEMS[data[j].id] = data[j].itemServiceDetails;
										PARENTS[data[j].id] = data[j].parents;
										jQuery('#kid-name').append('<option value="' + data[j].id + '">' + data[j].firstName + ' ' + data[j].lastName + '</option>');
									}
								}
								getPaymentOptions(activedomains);
							}
						});
					}
				}

				function getPaymentOptions(activedomains) {
					for (var i = 0; i < activedomains.length; i++) {
						service.getDomainProfile(activedomains[i], {
							success : function(data) {
								if (data.billingInfo) {
									if (data.billingInfo.paypalemail.length > 1 && data.billingInfo.checkpayable.length <= 1) {
										jQuery('#payment-paypal').find('.checkbox-name').text('PAYPAL');
										jQuery('#payment-paypal-1').val('1');
										jQuery('#payment-paypal-1').parent().append(CHECKBOXSPAN);
										jQuery('#payment-paypal').find('.checkbox-span').text(data.billingInfo.paypalemail);
										jQuery('#payment-check').hide();
									} else if (data.billingInfo.paypalemail.length <= 1 && data.billingInfo.checkpayable.length > 1) {
										jQuery('#payment-paypal').find('.checkbox-name').text('CHECK');
										jQuery('#payment-paypal-1').val('2');
										jQuery('#payment-paypal-1').parent().append(CHECKBOXSPAN);
										jQuery('#payment-paypal').find('.checkbox-span').text(data.billingInfo.checkpayable);
										jQuery('#payment-check').hide();
									} else if (data.billingInfo.paypalemail.length > 1 && data.billingInfo.checkpayable.length > 1) {
										jQuery('#payment-paypal').find('.checkbox-name').text('PAYPAL');
										jQuery('#payment-paypal-1').parent().append(CHECKBOXSPAN);
										jQuery('#payment-paypal').find('.checkbox-span').text(data.billingInfo.paypalemail);
										jQuery('#payment-check').find('.checkbox-name').append('CHECK');
										jQuery('#payment-check-1').parent().append(CHECKBOXSPAN);
										jQuery('#payment-paypal-1').val('3');
										jQuery('#payment-check').find('.checkbox-span').text(data.billingInfo.checkpayable);
									} else {
										jQuery('#payment-check').hide();
										jQuery('#payment-paypal').hide();
										jQuery("#note-dialog").dialog("open");
									}
								} else {
									jQuery('#payment-check').hide();
									jQuery('#payment-paypal').hide();
									jQuery("#note-dialog").dialog("open");
								}
							}
						});
					}
				}

				function getServices(activedomains) {
					SERVICESALL = [];
					jQuery('.servicetemplate').remove();
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.ListAllServices(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									if (j === 0) {
										var thisservice = leadtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description);
										jQuery('.services-list', thisservice).parent().append(CHECKBOXSPAN);
										jQuery('.checkbox-span', thisservice).text('Cost: $ ' + data[j].unit_price);
									} else {
										var thisservice = followtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description);
										jQuery('.services-list', thisservice).parent().append(CHECKBOXSPAN);
										jQuery('.checkbox-span', thisservice).text('Cost: $ ' + data[j].unit_price);
									}
									if (data[j].status === 'Active' || data[j].status === 'ACTIVE') {
										jQuery('#services-grid').append(thisservice);
									}
								}
							}
						});
					}
				}

				function clearForm() {
					jQuery('input[type="text"]').val("");
					jQuery('input[type="date"]').val("");
					jQuery('#payment-paypal-1').attr('checked', 'checked');
					jQuery('#kid-name').val('None Selected');
					//jQuery('#payment-paypal-1').parent().find('.checkbox-span').remove();
					jQuery('#payment-check-1').attr('checked', 'checked');
					//jQuery('#payment-check-1').parent().find('.checkbox-span').remove();
					jQuery('#services-grid').empty();
					jQuery('.edit-notify').hide();
					jQuery('.modal_close').show();

				}

				function addNewItem() {
					if ($("#new-item-form").valid()) {
						var thisservice = followtemplate.clone();
						jQuery('.services-list', thisservice).parent().append(jQuery('#new-item-name').val());
						jQuery('.services-list', thisservice).attr('sname', jQuery('#new-item-name').val()).attr('cost', jQuery('#new-item-cost').val()).attr('tax', '0').attr('desc', jQuery('#new-item-desc').val()).attr('checked', 'checked');
						jQuery('.services-list', thisservice).parent().append(CHECKBOXSPAN);
						jQuery('.checkbox-span', thisservice).text('Cost: $ ' + jQuery('#new-item-cost').val());
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
					if ((jQuery('#member-list').val() === 'None' || jQuery('#member-list').val().charAt(0) === 0) && ((jQuery('#member-list').val().indexOf('User: ') !== -1))) {
						jQuery('#member-list').css('color', 'red');
						return false;
					} else {
						jQuery('#member-list').css('color', 'black');
						return true;
					}
				}, 'Select to whom to assign.');

				$.validator.addMethod("validSelect", function(value, element, param) {
					if (jQuery('#kid-name').val() === 'None Selected') {
						return false;
					} else {
						return true;
					}
				}, 'Select a kid.');

				jQuery.validator.addMethod("money", function(value, element) {
					value = value.replace('-', '');
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
							// Cancel : function() {
							// $("#item-dialog-form").dialog("close");
							// },
							"Add" : addNewItem
						},
						close : function() {
							$(this).dialog("close");
						}
					});

					jQuery('body').append(WARNDIALOG);
					$("#note-dialog").dialog({
						autoOpen : false,
						modal : true,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						buttons : {
							"Update" : function() {
								router.go('/domainedit');
								//$(this).dialog("close");
							},
							// "Cancel" : function() {
							// $(this).dialog("close");
							// router.returnToPrevious();
							// }
						},
						close : function() {
							router.returnToPrevious();
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
								money : true,
								minlength : 1
							}
						},
					});

					jQuery('#new-item-type').change(function() {
						jQuery('#new-item-cost').val(jQuery('#new-item-cost').val().replace('-', ''));
						if (jQuery('#new-item-type').val() === 'Discount' || jQuery('#new-item-type').val() === 'Coupon') {
							jQuery('#new-item-cost').val('-' + jQuery('#new-item-cost').val());
						} else {
							jQuery('#new-item-cost').val(jQuery('#new-item-cost').val().replace('-', ''));
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
					validator.resetForm();
					newitemvalidator.resetForm();
					if (Modernizr.touch && Modernizr.inputtypes.date) {
						document.getElementById('invoice-duedate').type = 'date';
					} else {
						jQuery("#invoice-duedate").datepicker({
							minDate : 0,
							dateFormat : 'yy-mm-dd',
						});
					}
					initDialog();
					if (ActiveMembers.text) {
						jQuery('.edit-notify').hide();
					} else {
						clearForm();
						jQuery('.checkbox-span').remove();
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

						//JQ UI Bug of -Index.
						jQuery('#invoice-duedate').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});

						jQuery('.formlink').click(function() {
							//newitemvalidator.resetForm();
							jQuery("#item-dialog-form").dialog("open");
						});

						jQuery('#kid-name').change(function() {
							ActiveMembers.text = getSelectedText('kid-name');
							var studentid = $(this).val();
							jQuery('.servicetemplate').remove();
							for (var i = 0; i < ITEMS[studentid].length; i++) {
								if (i === 0) {
									var thisservice = leadtemplate.clone();
									jQuery('.services-list', thisservice).parent().append(ITEMS[studentid][i].itemService.name);
									//jQuery('.services-list', thisservice).attr('sname', ITEMS[studentid][i].itemService.name).attr('cost', ITEMS[studentid][i].itemService.unit_price).attr('tax', ITEMS[studentid][i].itemService.tax).attr('desc', ITEMS[studentid][i].itemService.description).attr('checked', 'checked').attr('disabled', 'disabled');
									jQuery('.services-list', thisservice).attr('sname', ITEMS[studentid][i].itemService.name).attr('cost', ITEMS[studentid][i].itemService.unit_price).attr('tax', ITEMS[studentid][i].itemService.tax).attr('desc', ITEMS[studentid][i].itemService.description).attr('checked', 'checked');
									jQuery('.services-list', thisservice).parent().append(CHECKBOXSPAN);
									jQuery('.checkbox-span', thisservice).text('Cost: $ ' + ITEMS[studentid][i].itemService.unit_price);
								} else {
									var thisservice = followtemplate.clone();
									jQuery('.services-list', thisservice).parent().append(ITEMS[studentid][i].itemService.name);
									jQuery('.services-list', thisservice).attr('sname', ITEMS[studentid][i].itemService.name).attr('cost', ITEMS[studentid][i].itemService.unit_price).attr('tax', ITEMS[studentid][i].itemService.tax).attr('desc', ITEMS[studentid][i].itemService.description).attr('checked', 'checked');
									jQuery('.services-list', thisservice).parent().append(CHECKBOXSPAN);
									jQuery('.checkbox-span', thisservice).text('Cost: $ ' + ITEMS[studentid][i].itemService.unit_price);
								}
								if (ITEMS[studentid][i].itemService.status === 'Active' || ITEMS[studentid][i].itemService.status === 'ACTIVE') {
									jQuery('#services-grid').append(thisservice);
								}
							}
						});

						jQuery('#invoice-preview').click(function() {
							var databoject = {
								'toname' : 'None Assigned',
								'toemail' : 'Not Avaiable',
								'tomessage' : 'Happy To Help!!!!',
								'sname' : 'None Assigned',
								'cost' : '$-',
								'tax' : '-%',
								'payoptions' : 0
							};
							databoject.toname = getSelectedText('kid-name');
							databoject.toemail = jQuery('#member-email').val();
							databoject.tomessage = jQuery('#member-message').val();
							if (databoject.tomessage == "") {
								databoject.tomessage = 'Happy to help!!!';
							}
							var _services = [];
							$('#services-grid input[type=checkbox]').each(function() {
								if (this.checked) {
									var _servicesentries = {};
									_servicesentries.name = jQuery(this).attr('sname');
									_servicesentries.cost = jQuery(this).attr('cost');
									_servicesentries.tax = jQuery(this).attr('tax');
									_servicesentries.desc = jQuery(this).attr('desc');
									_services.push(_servicesentries);
								}
							});
							databoject.payoptions = $('#payment-grid input[type=checkbox]:checked:visible').length;
							if (databoject.payoptions === 2) {
								databoject.payoptions = 3;
							}
							if (databoject.payoptions === 1) {
								if ($('#payment-grid input[type=checkbox]:checked:visible').next().text().indexOf('PAYPAL') == -1) {
									databoject.payoptions = 2;
								}
							}

							databoject.services = _services;
							databoject.duedate = jQuery('#invoice-duedate').val();
							databoject.parent = '';
							if (jQuery('#kid-name').val() != 'None Selected') {
								for (var k = 0; k < PARENTS[jQuery('#kid-name').val()].length; k++) {
									if (PARENTS[jQuery('#kid-name').val()][k].userType == 'FATHER' || PARENTS[jQuery('#kid-name').val()][k].userType == 'MOTHER') {
										databoject.parent = databoject.parent + PARENTS[jQuery('#kid-name').val()][k].email + ':';
									}
								}
							}
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
								var _services = [];
								var _grandtotal = 0;
								$('#services-grid input[type=checkbox]').each(function() {
									if (this.checked) {
										var _servicesentries = {};
										_servicesentries.item = jQuery(this).attr('sname');
										_servicesentries.quantity = 1;
										var _cost = jQuery(this).attr('cost');
										var _tax = jQuery(this).attr('tax');
										_servicesentries.amount = parseInt(_cost) + parseInt((_cost * _tax) / 100);
										_grandtotal = _grandtotal + _servicesentries.amount;
										_servicesentries.itemDesc = jQuery(this).attr('desc');
										_servicesentries.transtype = 'FEE';
										_services.push(_servicesentries);
									}
								});
								var duedate = jQuery('#invoice-duedate').val();
								var _pids = [];
								if (jQuery('#kid-name').val() != 'None Selected') {
									for (var k = 0; k < PARENTS[jQuery('#kid-name').val()].length; k++) {
										if (PARENTS[jQuery('#kid-name').val()][k].userType == 'FATHER' || PARENTS[jQuery('#kid-name').val()][k].userType == 'MOTHER') {
											databoject.parent = databoject.parent + PARENTS[jQuery('#kid-name').val()][k].email + ':';
										}
									}
								}
								//console.log('For ' + _services.length + ' services, you owe $' + _grandtotal);
								var _ids = jQuery('#kid-name').val();
								service.generateInvoice(service.domainNametoID(jQuery.cookie('subuser')), _ids, duedate, _grandtotal, _services, {
									success : function(response) {
										if (response.status !== 'error') {
											clearForm();
											ActiveMembers = {};
											//notify.showNotification('OK', response.message);
											notify.showNotification('OK', 'Invoice generated and assigned');
											var currentDate = new Date();
											var day = currentDate.getDate();
											var month = currentDate.getMonth() + 1;
											if (month < 10) {
												month = '0' + month;
											}
											if (day < 10) {
												day = '0' + day;
											}
											var year = currentDate.getFullYear();
											var now = year + "-" + month + "-" + day;
											//var _invoicedesc= JSON.stringify(_services).toString();
											var _invoicedesc = 'For ' + _services.length + ' services, you owe $' + _grandtotal;
											var _paypalurl = 'payments@zingoare.com';
											var _paycheck = 'Zingoare, Inc.';
											if (jQuery('#payment-paypal-1').val() === '1' || jQuery('#payment-paypal-1').val() === '3') {
												_paypalurl = jQuery('#payment-paypal').find('.checkbox-span').text();
												_paycheck = jQuery('#payment-check').find('.checkbox-span').text();
											} else {
												_paycheck = jQuery('#payment-paypal').find('.checkbox-span').val();
											}
											service.AssignInvoice(service.domainNametoID(jQuery.cookie('subuser')), _pids, 'Invoice ' + day + month + year, _invoicedesc, 'High', now, duedate, '', _paypalurl, _paycheck, {
												success : function(data) {
													if (data.status !== 'error') {
														//clearform();
														//notify.showNotification('OK', data.message);
													} else {
														//notify.showNotification('ERROR', data.message);
													}
													setTimeout(function() {
														//router.returnToPrevious();
														//admin.reloadData();
													}, 2000);
												}
											});

										} else {
											notify.showNotification('ERROR', response.message);
										}
									}
								});
								setTimeout(function() {
									//router.returnToPrevious();
								}, 2000);
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery("#invoice-form").validate({
							rules : {
								kidname : {
									validSelect : true
								},
								services : {
									required : false
								},
								invitemessage : {
									maxlength : 20
								},
								invoiceduedate : {
									required : true
								}
							},
							messages : {
								services : "You must check at least 1 service"
							}
						});

					} // Cookie Guider
				};

			}

			return InvoiceGenerateView;
		}());

	return new InvoiceGenerateView();
});
