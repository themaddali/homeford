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
			}
			var activeDomains = [];
			var DATAOBJECT = null;

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
					if (DATAOBJECT !== null) {
						service.getUserProfile({
							success : function(UserProfile) {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									jQuery('#inv-domain').text(UserProfile.domains[i].domainName);
									jQuery('.inv-domain-info').text('Issued by ' + UserProfile.firstName+ ' ' + UserProfile.lastName + ' for '+UserProfile.domains[i].domainName);
								}
							}
						});
						jQuery('#inv-to-name').text(DATAOBJECT.toname);
						jQuery('#inv-to-contact').text(DATAOBJECT.toemail);

						var currentDate = new Date();
						var day = currentDate.getDate();
						var month = currentDate.getMonth() + 1;
						var year = currentDate.getFullYear();
						jQuery('#inv-date').text(day + "/" + month + "/" + year);
					} else {
						router.go('/invoicenew');
					}
				}


				this.setData = function(databject) {
					DATAOBJECT = databject;
				}

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
