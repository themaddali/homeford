define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify'], function(cookie, service, validate, router, notify) {"use strict";

	var CertificateView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var activeDomains = [];
			var DATAOBJECT = null;
			var template;

			function CertificateView() {

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
									jQuery('#domain').text(UserProfile.domains[i].domainName);
								}
							}
						});
						jQuery('#toname').text(DATAOBJECT.toname);
						jQuery('#quizname').text(DATAOBJECT.quizname);
						jQuery('#percentage').text(DATAOBJECT.percentage);
						var currentDate = new Date();
						var day = currentDate.getDate();
						var month = currentDate.getMonth() + 1;
						var year = currentDate.getFullYear();
						jQuery('#todaydate').text(day + "/" + month + "/" + year);
						jQuery('#signedby').text();
					} else {
						router.go('/quizground');
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
					document.title = 'Zingoare | Certificate';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Certificate';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions

						jQuery('.modal_close').on('click', function() {
							router.go('/quizground');
						});
					} // Cookie Guider
				};

			}

			return CertificateView;
		}());

	return new CertificateView();
});
