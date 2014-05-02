define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView','../../view/billing/InvoicePreviewView'], function(cookie, service, validate, router, notify, admin, invoicepreview) {"use strict";

	var InvoiceGenerateView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			}
			var activeDomains = [];
			var pendingList;
			var validator;
			var membernames = [];
			var MEMEBERS;
			var servicenames = [];

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
					service.returnDomainIDList({
						success : function(data) {
							getMembers(data);
							getServices(data);
						}
					});
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
								MEMEBERS.push(data);
								for (var j = 0; j < data.length; j++) {
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
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.ListAllServices(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									//servicenames.push(data[j].name);
									if (data[j].status === 'Active' || data[j].status === 'ACTIVE') {
										jQuery('#service-select').append('<option>' + data[j].name + '</option>');
									}
									//jQuery('.service-id', row).text(data[j].id);
									//jQuery('.service-desc', row).text(data[j].description);
									//jQuery('.service-cost', row).text('$' + data[j].unit_price);
									//jQuery('.service-tax', row).text(data[j].tax + '%');
									//juery('.service-freq', row).text(data[j].days + ' days');
									//jQuery('.service-status', row).text(data[j].status);
									// if (j === data.length - 1) {
									// $("#member-name").autocomplete({
									// source : function(request, response) {
									// var results = $.ui.autocomplete.filter(membernames, request.term);
									// response(results.slice(0, 5));
									// }
									// });
									// //activateEvents();
									// }
								}
							}
						});
					}
				}

				// function populateData() {
				// jQuery('#invite-domain').empty();
				// service.getUserProfile({
				// success : function(UserProfile) {
				// var activeDomains = [];
				// for (var i = 0; i < UserProfile.domains.length; i++) {
				// if (UserProfile.domains[i].roleName === 'ROLE_TIER2' || UserProfile.domains[i].roleName === 'ROLE_TIER1') {
				// if (activeDomains.indexOf(UserProfile.domains[i].domainName) === -1) {
				// activeDomains.push(UserProfile.domains[i].domainName);
				// jQuery('#invite-domain').append('<option>' + UserProfile.domains[i].domainName + '</option>');
				// }
				// }
				//
				// if (UserProfile.domains.length === 1) {
				// jQuery('#invite-domain').val(UserProfile.domains[i].domainName);
				// }
				// if (i == UserProfile.domains.length - 1) {
				// jQuery.validator.addMethod("domainValidation", function(value, element) {
				// if (activeDomains.indexOf(value) === -1) {
				// return false;
				// } else
				// return true;
				// }, "Oops! You canot send invite to this domain!");
				// }
				// }
				// }
				// });
				// }

				function clearForm() {
					jQuery('.form-item > input').val("");
					jQuery('#member-role').prop('checked', false);
					jQuery('.edit-notify').hide();
					jQuery('.modal_close').show();
				}


				this.pendingList = function(pendinglist) {
					pendingList = pendinglist;
				}

				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					$("#member-name").autocomplete("destroy");
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

						$.validator.addMethod("validMember", function(value, element, param) {
							if (membernames.indexOf(jQuery('#member-name').val()) === -1) {
								return false;
							} else {
								return true;
							}
						}, 'Member Not Found!');
						
						jQuery('#invoice-preview').click(function(){
							var databoject = {
								'toname' : 'None Assigned' ,
								'toemail' : 'Not Avaiable' ,
								'tomessage' : 'Happuy To Help!!!!' ,
								'sname' : 'None Assigned' ,
								'domain' : 'None Assigned' ,
							};
							databoject.toname = jQuery('#member-name').val();
							databoject.toemail = jQuery('#member-email').val();
							databoject.tomessage = jQuery('#member-message').val();
							databoject.sname = jQuery('#service-select').val();
							invoicepreview.setData(databoject);
							router.go('/invoicepreview');
						});

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

						jQuery('#profile-password').change(function() {
							jQuery('#password-reenter-item').show();
						});

						jQuery.validator.addMethod("notRepeated", function(value, element) {
							if (pendingList) {
								if (pendingList.indexOf(value) === -1) {
									return true;
								} else
									return false;
							} else
								return true;

						}, "This email already has a request pending.");

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
