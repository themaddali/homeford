define(['modernizr', 'cookie', 'jquerywidget', 'transport', 'fileupload', 'crop', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, jquerywidget, transport, fileupload, crop, service, validate, router, notify, admin) {"use strict";

	var ServicesEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ACTIVESERVICE;
			var validator;

			function ServicesEditView() {

				function populateData() {
					if (ACTIVESERVICE) {
						jQuery('#service-name').val(ACTIVESERVICE.name);
						jQuery('#service-desc').val(ACTIVESERVICE.desc);
						jQuery('#service-id').val(ACTIVESERVICE.id);
						jQuery('#service-cost').val(ACTIVESERVICE.cost);
						jQuery('#service-tax').val(ACTIVESERVICE.tax);
						jQuery('#service-status').val(ACTIVESERVICE.status);
						jQuery('#service-frequency').val(ACTIVESERVICE.freq);
						ActivateClicks();
					} else {
						router.go('/serviceslist')
					}
				}

				function ActivateClicks() {
					//No Action
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


				this.setInfo = function(ServiceInfo) {
					ACTIVESERVICE = ServiceInfo;
				}

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#service-edit').on('click', function() {
							if ($(".edit-form").valid()) {
								service.UpdateServices(jQuery('#service-id').val(), jQuery('#service-name').val(), jQuery('#service-desc').val(), jQuery('#service-cost').val(),jQuery('#service-tax').val(),jQuery('#service-frequency').val().split(' ')[0], jQuery('#service-status').val(), {
									success : function(response) {
										if (response.status !== 'error') {
											notify.showNotification('OK', response.message);
										} else {
											notify.showNotification('ERROR', response.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
										}, 2000);
									}
								});
							}
						});

						jQuery('#service-cost').blur(function() {
							if (jQuery('#service-cost').val().charAt(0) !== '$') {
								jQuery('#service-cost').val('$' + jQuery('#service-cost').val());
							}
						});
						jQuery('#service-tax').blur(function() {
							if (jQuery('#service-tax').val().charAt(0) === '$') {
								jQuery('#service-tax').val().replace('$', '');
							}
							if (jQuery('#service-tax').val().charAt(jQuery('#service-tax').val().length - 1) !== '%') {
								jQuery('#service-tax').val(jQuery('#service-tax').val() + '%');
							}
						});

						jQuery.validator.addMethod("money", function(value, element) {
							value = value.replace('$', '');
							value = value.replace('%', '');
							var isValidMoney = /^\d{0,4}(\.\d{0,2})?$/.test(value);
							return this.optional(element) || isValidMoney;
						}, "Enter valid dollar amount");

						validator = jQuery(".edit-form").validate({
							rules : {
								servicename : {
									required : true,
								},
								servicedesc : {
									required : true,
								},
								servicecost : {
									required : true,
									money : true
								},
								servicetax : {
									required : true,
									money : true
								},
								servicefrequency : {
									required : true,
								},
							}
						});

					} // Cookie Guider
				};

			}

			return ServicesEditView;
		}());

	return new ServicesEditView();
});
