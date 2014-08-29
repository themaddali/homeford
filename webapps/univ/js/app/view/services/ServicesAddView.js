define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', 'timepicker'], function(modernizr, cookie, service, validate, router, notify, admin, timepicker) {"use strict";

	var ServicesAddView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var ActiveMembers = 'All Members';
			var REFRESH = 0;

			function ServicesAddView() {

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
					jQuery('.form-content input').val();
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
				}

				function clearForm() {
					jQuery('input[type="text"]').val('');
					jQuery('input[type="date"]').val('');
					jQuery('textarea').val('');
				}

				this.refreshForBug  = function(){
					REFRESH = 1;
				};

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					jQuery('.edit-notify').hide();
					document.title = 'Zingoare | Services Add';

				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Services Add';

					if (checkForActiveCookie() === true) {
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
						if (REFRESH === 1) {
							console.log('There is a jQuery UI library bug... so refresing...');
							location.reload();
						}
						
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.go('/admin');
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

						jQuery('#add-service').on('click', function() {
							if ($(".edit-form").valid()) {
								var _sname = jQuery('#service-name').val();
								var _sdesc = jQuery('#service-desc').val();
								var _scost = jQuery('#service-cost').val();
								var _stax = jQuery('#service-tax').val();
								//var _sfreq = jQuery('#service-frequency').val();
								var _sfreq = 0;
								if (jQuery('#service-starttime').val().split(" ")[1] == 'PM' && jQuery('#service-starttime').val().split(":")[0] !== '12') {
									var _sstarttime = (parseInt(jQuery('#service-starttime').val().split(":")[0]) + 12) + ':' + jQuery('#service-starttime').val().split(":")[1].replace(' PM', '') + ':00';
								}
								if (jQuery('#service-endtime').val().split(" ")[1] == 'PM' && jQuery('#service-endtime').val().split(":")[0] !== '12') {
									var _sendtime = (parseInt(jQuery('#service-endtime').val().split(":")[0]) + 12) + ':' + jQuery('#service-endtime').val().split(":")[1].replace(' PM', '') + ':00';
								}
								if (jQuery('#service-starttime').val().split(" ")[1] == 'AM') {
									var _sstarttime = (jQuery('#service-starttime').val().split(":")[0]) + ':' + jQuery('#service-starttime').val().split(":")[1].replace(' AM', '') + ':00';
								}
								if (jQuery('#service-endtime').val().split(" ")[1] == 'AM') {
									var _sendtime = (jQuery('#service-endtime').val().split(":")[0]) + ':' + jQuery('#service-endtime').val().split(":")[1].replace(' AM', '') + ':00';
								}

								service.AddServices(service.domainNametoID(jQuery.cookie('subuser')), _sname, _sdesc, _scost, _stax, _sfreq, _sstarttime, _sendtime, jQuery('#service-status').val(), {
									success : function(data) {
										if (data.status !== 'error') {
											clearForm();
											notify.showNotification('OK', data.message);
											setTimeout(function() {
												//router.returnToPrevious();
												//admin.reloadData();
											}, 2000);
										} else {
											notify.showNotification('ERROR', data.message);
										}

									}
								});
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						// jQuery('#service-cost').blur(function() {
						// if (jQuery('#service-cost').val().charAt(0) !== '$') {
						// jQuery('#service-cost').val('$' + jQuery('#service-cost').val());
						// }
						// });
						// jQuery('#service-tax').blur(function() {
						// if (jQuery('#service-tax').val().charAt(0) === '$') {
						// jQuery('#service-tax').val().replace('$', '');
						// }
						// if (jQuery('#service-tax').val().charAt(jQuery('#service-tax').val().length - 1) !== '%') {
						// jQuery('#service-tax').val(jQuery('#service-tax').val() + '%');
						// }
						// });

						jQuery.validator.addMethod("money", function(value, element) {
							//value = value.replace('$', '');
							//value = value.replace('%', '');
							var isValidMoney = /^\d{0,4}(\.\d{0,2})?$/.test(value);
							return this.optional(element) || isValidMoney;
						}, "Enter valid dollar amount ");

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
								servicestarttime : {
									required : true,
								},
								serviceendtime : {
									required : true,
								}
							}
						});

					} // Cookie Guider
				};

			}

			return ServicesAddView;
		}());

	return new ServicesAddView();
});
