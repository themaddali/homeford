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
						service.getUserProfile({
							success : function(UserProfile) {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									jQuery('#inv-domain').text(UserProfile.domains[i].domainName);
									if (UserProfile.lastName === null && UserProfile.firstName === null) {
										UserProfile.lastName = "Billing Team";
										UserProfile.firstName = '';
									}
									jQuery('#inv-addr1').text('City, State');
									jQuery('#inv-addr2').text('US, 12354');
									jQuery('#inv-contact').text(UserProfile.email);
									jQuery('.inv-domain-info').text('Issued by ' + UserProfile.firstName + ' ' + UserProfile.lastName + ' for ' + UserProfile.domains[i].domainName);
								}
							}
						});
						//jQuery('#inv-to-addr1').text('Attn: ' + DATAOBJECT.toname);
						// for (var k = 0; k < DATAOBJECT.toname.length; k++) {
						// jQuery('#inv-to-name').append('<option>' + DATAOBJECT.toname[k] + '</option>');
						// }
						//jQuery('#inv-to-addr1').val(DATAOBJECT.toemail);
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
