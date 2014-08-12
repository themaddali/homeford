define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(cookie, service, validate, router, notify) {"use strict";

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
			var DATAOBJECT = null;
			var template;

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
					var grandtotal = 0;
					jQuery('#inv-domain-address').empty();
					if (DATAOBJECT !== null) {
						document.title = DATAOBJECT.toname + ' | Invoice';
						service.getUserProfile({
							success : function(UserProfile) {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									jQuery('#inv-domain').text(UserProfile.domains[i].domainName);
									if (UserProfile.lastName === null && UserProfile.firstName === null) {
										UserProfile.lastName = "Billing Team";
										UserProfile.firstName = '';
									}
									jQuery('#inv-addr1').text('');
									jQuery('#inv-addr2').text('');
									jQuery('#inv-addr3').text('');
									jQuery('#inv-contact').text(UserProfile.email);
									jQuery('#inv-contact-phone').text(UserProfile.phoneNumber);
									jQuery('.inv-domain-info').text('Issued by ' + UserProfile.firstName + ' ' + UserProfile.lastName + ' for ' + UserProfile.domains[i].domainName);
								}
							}
						});
						service.getDomainProfile(jQuery.cookie('_did'), {
							success : function(Profile) {
								jQuery('#inv-addr1').text(Profile.addresses[0].street1 + ' ' + Profile.addresses[0].street2);
								jQuery('#inv-addr2').text(Profile.addresses[0].city + ' ' + Profile.addresses[0].state + ' ' + Profile.addresses[0].zip);
								jQuery('#inv-addr3').text((Profile.addresses[0].country).toUpperCase());
								if (!Profile.image || Profile.image == null) {
									jQuery('#profile-image').attr('src', 'img/logo-print.jpg');
								} else {
									jQuery('#inv-logo-img').attr('src', '/zingoare/api/domainupload/picture/' + Profile.image.id);
								}
								if (DATAOBJECT.payoptions === 1) {
									jQuery('#payment-1').text('PAYPAL: ' + Profile.billingInfo.paypalemail);
								}
								if (DATAOBJECT.payoptions === 2) {
									jQuery('#payment-1').text('CHECK: ' + Profile.billingInfo.checkpayable);
								}
								if (DATAOBJECT.payoptions === 3) {
									jQuery('#payment-1').text('PAYPAL: ' + Profile.billingInfo.paypalemail);
									jQuery('#payment-2').text('CHECK: ' + Profile.billingInfo.checkpayable);
								}
								if (DATAOBJECT.payoptions === 0) {
									jQuery('#payment-1').text('');
									jQuery('#payment-2').text('');
								}
								setTimeout(function() {
									jQuery('#inv-addr1').text(Profile.addresses[0].street1 + ' ' + Profile.addresses[0].street2);
									jQuery('#inv-addr2').text(Profile.addresses[0].city + ' ' + Profile.addresses[0].state + ' ' + Profile.addresses[0].zip);
									jQuery('#inv-addr3').text((Profile.addresses[0].country).toUpperCase());
								}, 200);
							}
						});
						jQuery('#inv-tbody').empty();
						for (var j = 0; j < DATAOBJECT.services.length; j++) {
							var thisrow = template.clone();
							jQuery('.snumber', thisrow).text(j + 1);
							jQuery('.sname', thisrow).text(DATAOBJECT.services[j].name);
							jQuery('.scost', thisrow).text('$' + DATAOBJECT.services[j].cost);
							jQuery('.stax', thisrow).text(DATAOBJECT.services[j].tax + '%');
							jQuery('.sdesc', thisrow).text(DATAOBJECT.services[j].desc);
							var total = parseInt(DATAOBJECT.services[j].cost) + parseInt((DATAOBJECT.services[j].cost) * (DATAOBJECT.services[j].tax) / 100);
							grandtotal = grandtotal + total;
							jQuery('.sprice', thisrow).text('$' + total);
							jQuery('#inv-tbody').append(thisrow);
							jQuery('.grand-total').text('$' + grandtotal);
						}
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
						jQuery('#inv-inssuedate').text(year + "-" + month + "-" + day);
						jQuery('#inv-dueby').text(DATAOBJECT.duedate);
						jQuery('.thanks').text(DATAOBJECT.tomessage);
						jQuery('#inv-to1').html(DATAOBJECT.toname);
						document.title = DATAOBJECT.toname + ' | Invoice';
						jQuery('#inv-to2').html(DATAOBJECT.parent.split(':')[0]);
						if (DATAOBJECT.parent.split(':')[1].length > 3) {
							jQuery('#inv-to3').html(DATAOBJECT.parent.split(':')[1]);
						} else {
							jQuery('#inv-to3').html('');
						}
					} else {
						router.go('/invoicenew');
					}
				}


				this.setData = function(databject) {
					DATAOBJECT = databject;
				};

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					//validator.resetForm();
					document.title = 'Zingoare | Invoice Preview';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Invoice Preview';

					if (checkForActiveCookie() === true) {
						template = jQuery('#inv-tbody-row').remove().attr('id', '');
						populateData();

						//HTML Event - Actions

						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});
					} // Cookie Guider
				};

			}

			return InvoiceGenerateView;
		}());

	return new InvoiceGenerateView();
});
