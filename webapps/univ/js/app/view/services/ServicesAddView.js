define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var ServicesAddView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var ActiveMembers = 'All Members';

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
				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
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
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#add-service').on('click', function() {
							if ($(".edit-form").valid()) {
								var _sname = jQuery('#service-name').val();
								var _sdesc = jQuery('#service-desc').val();
								var _scost = jQuery('#service-cost').val();
								var _stax = jQuery('#service-tax').val();
								var _sfreq = jQuery('#service-frequency').val();
								var _domainids;
								service.returnDomainIDList({
									success : function(data) {
										_domainids = data;
									}
								});
								service.AddServices(_domainids[0], _sname, _sdesc, _scost, _stax, _sfreq,jQuery('#service-status').val(), {
									success : function(data) {
										if (data.status !== 'error') {
											notify.showNotification('OK', data.message);
										} else {
											notify.showNotification('ERROR', data.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
											//admin.reloadData();
										}, 2000);
									}
								});
							}
							else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});
						
						jQuery('#service-cost').blur(function(){
							if (jQuery('#service-cost').val().charAt(0) !== '$'){
								jQuery('#service-cost').val('$'+jQuery('#service-cost').val());
							}
						});
						jQuery('#service-tax').blur(function(){
							if (jQuery('#service-tax').val().charAt(0) === '$'){
								jQuery('#service-tax').val().replace('$','');
							}
							if (jQuery('#service-tax').val().charAt(jQuery('#service-tax').val().length-1) !== '%'){
								jQuery('#service-tax').val(jQuery('#service-tax').val()+'%');
							}
						});

						jQuery.validator.addMethod("money", function(value, element) {
							value = value.replace('$','');
							value = value.replace('%','');
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
									money: true
								},
								servicefrequency : {
									required : true,
								},
							}
						});

					} // Cookie Guider
				};

			}

			return ServicesAddView;
		}());

	return new ServicesAddView();
});
