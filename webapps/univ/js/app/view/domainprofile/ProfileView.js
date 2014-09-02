define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var ProfileView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};

			function ProfileView() {

				function populateData() {
					var DOMAINS = [];
					service.getDomainProfile(jQuery.cookie('_did'), {
						success : function(Profile) {
							if (Profile.addresses[0]) {
								for (var i = 0; i < Profile.addresses.length; i++) {
									if (Profile.addresses[i].addressName === 'PRIMARY') {
										jQuery('#profile-street').text(Profile.addresses[i].street1);
										jQuery('#profile-street1').text(Profile.addresses[i].street2);
										jQuery('#profile-city').text(Profile.addresses[i].city);
										jQuery('#profile-state').text(Profile.addresses[i].state);
										jQuery('#profile-country').text(Profile.addresses[i].country);
										jQuery('#profile-zip').text(Profile.addresses[i].zip);
									}
									if (Profile.addresses[i].addressName === 'SECONDARY') {
										jQuery('#profile-street-2').text(Profile.addresses[i].street1);
										jQuery('#profile-street1-2').text(Profile.addresses[i].street2);
										jQuery('#profile-city-2').text(Profile.addresses[i].city);
										jQuery('#profile-state-2').text(Profile.addresses[i].state);
										jQuery('#profile-country-2').text(Profile.addresses[i].country);
										jQuery('#profile-zip-2').text(Profile.addresses[i].zip);
									}
								}
							}

							if (!Profile.image || Profile.image == null) {
								jQuery('#profile-image').attr('src', 'img/logo-print.jpg');
							} else {
								jQuery('#profile-image').attr('src', '/zingoare/api/domainupload/picture/' + Profile.image.id);
							}

							if (Profile.billingInfo) {
								jQuery('#profile-paypal').text(Profile.billingInfo.paypalemail);
								jQuery('#profile-check').text(Profile.billingInfo.checkpayable);
							}

							jQuery('#profile-domainDesc1').text(Profile.domainDesc1);
							jQuery('#profile-domainDesc2').text(Profile.domainDesc2);
							jQuery('#profile-domainThanksMessage').text(Profile.domainThanksMessage);

							setTimeout(function() {
								if (jQuery('#profile-domainDesc1').text() == 'null' || jQuery('#profile-domainDesc1').text() == null || jQuery('#profile-domainDesc1').text().length < 2) {
									jQuery('#profile-domainDesc1').text('In continuous effort to provide best and quality care to your kid, we here, have decided to empower ourselves with Zingoare platform. I personally invite you to take a moment (less than a minute) to register yourself and add your kid thru the link provided below.');
								}
								if (jQuery('#profile-domainDesc2').text() == 'null' || jQuery('#profile-domainDesc2').text() == null || jQuery('#profile-domainDesc2').text().length < 2) {
									jQuery('#profile-domainDesc2').text('We are happy that you choose us to be a part of your kids exciting journey for a great future. A big thank you!! ');
								}
								if (jQuery('#profile-domainThanksMessage').text() == 'null' || jQuery('#profile-domainThanksMessage').text() == null || jQuery('#profile-domainThanksMessage').text().length < 2) {
									jQuery('#profile-domainThanksMessage').text('Myself and the whole team');
								}
								if (jQuery('#profile-street').text() == null || jQuery('#profile-street').text() == 'null' || jQuery('#profile-street').text().length < 1) {
									jQuery('#profile-street').text('Not On File. Please Update!');
								}
							}, 500);

						}
					});
				}

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


				this.pause = function() {

				};

				this.resume = function() {
					jQuery('span').text('');
					populateData();
					document.title = 'Zingoare | Profile Info';
					if (jQuery('#profile-street').val() == null || jQuery('#profile-street').val() == 'null' || jQuery('#profile-street').val().length < 1) {
						jQuery('#profile-street').text('Not On File. Please Update!');
					}
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Profile Info';

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							router.returnToPrevious();
						});
						jQuery('#profile-edit-button').on('click', function() {
							router.go('/domainedit');
						});
					} // Cookie Guider
				};

			}

			return ProfileView;
		}());

	return new ProfileView();
});
