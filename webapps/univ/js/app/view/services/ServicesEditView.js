define(['modernizr', 'cookie', 'jquerywidget', 'transport', 'fileupload', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', 'timepicker'], function(modernizr, cookie, jquerywidget, transport, fileupload, service, validate, router, notify, admin, timepicker) {"use strict";

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
						// if (Modernizr.touch && Modernizr.inputtypes.date) {
						// document.getElementById('service-starttime').type = 'time';
						// document.getElementById('service-endtime').type = 'time';
						// } else {
						// jQuery("#service-starttime").timepicker({
						// timeSeparator : ':',
						// showPeriod : false,
						// });
						// jQuery("#service-endtime").timepicker({
						// timeSeparator : ':',
						// showPeriod : false,
						// });
						// }
						jQuery("#service-starttime").timepicker({
							timeSeparator : ':',
							showPeriod : true,
							timeFormat : 'h:i A'
						});
						jQuery("#service-endtime").timepicker({
							timeSeparator : ':',
							showPeriod : true,
							timeFormat : 'h:i A'
						});
						jQuery('#service-name').val(ACTIVESERVICE.name);
						jQuery('#service-desc').val(ACTIVESERVICE.desc);
						jQuery('#service-id').val(ACTIVESERVICE.id);
						jQuery('#service-cost').val(ACTIVESERVICE.cost);
						jQuery('#service-starttime').val(ACTIVESERVICE.stime);
						jQuery('#service-endtime').val(ACTIVESERVICE.etime);
						jQuery('#service-tax').val(ACTIVESERVICE.tax);
						jQuery('#service-status').val(ACTIVESERVICE.status);
						jQuery('#service-frequency').val(ACTIVESERVICE.freq);
						ActivateClicks();
					} else {
						router.go('/serviceslist');
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
				};

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					jQuery('.edit-notify').hide();
					document.title = 'Zingoare | Services Edit';
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Services Edit';

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#service-edit').on('click', function() {
							if ($(".edit-form").valid()) {
								// var _sstarttime = jQuery('#service-starttime').val() + ':00';
								// var _sendtime = jQuery('#service-endtime').val() + ':00';
								if (jQuery('#service-starttime').val().split(" ")[1] == 'PM') {
									var _sstarttime = (parseInt(jQuery('#service-starttime').val().split(":")[0]) + 12) + ':' + jQuery('#service-starttime').val().split(":")[1].replace(' PM', '') + ':00';
								}
								if (jQuery('#service-endtime').val().split(" ")[1] == 'PM') {
									var _sendtime = (parseInt(jQuery('#service-endtime').val().split(":")[0]) + 12) + ':' + jQuery('#service-endtime').val().split(":")[1].replace(' PM', '') + ':00';
								}
								if (jQuery('#service-starttime').val().split(" ")[1] == 'AM') {
									var _sstarttime = (jQuery('#service-starttime').val().split(":")[0]) + ':' + jQuery('#service-starttime').val().split(":")[1].replace(' AM', '') + ':00';
								}
								if (jQuery('#service-endtime').val().split(" ")[1] == 'AM') {
									var _sendtime = (jQuery('#service-endtime').val().split(":")[0]) + ':' + jQuery('#service-endtime').val().split(":")[1].replace(' AM', '') + ':00';
								}
								service.UpdateServices(parseInt(ACTIVESERVICE.id), jQuery('#service-name').val(), jQuery('#service-desc').val(), _sstarttime, _sendtime, jQuery('#service-cost').val(), jQuery('#service-tax').val(), jQuery('#service-frequency').val().split(' ')[0], jQuery('#service-status').val(), {
									success : function(response) {
										if (response.status !== 'error') {
											notify.showNotification('OK', response.message);
											setTimeout(function() {
												router.returnToPrevious();
											}, 2000);
										} else {
											notify.showNotification('ERROR', response.message);
										}

									}
								});
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						//JQ UI Bug of -Index.
						jQuery('#service-starttime').focus(function() {
							setTimeout(function() {
								jQuery('#ui-timepicker-div').css('background-color', 'white');
								jQuery('#ui-timepicker-div').css('z-index', '200');
							}, 100);
						});
						jQuery('#service-endtime').focus(function() {
							setTimeout(function() {
								jQuery('#ui-timepicker-div').css('background-color', 'white');
								jQuery('#ui-timepicker-div').css('z-index', '200');
							}, 100);
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
