//View that will drive the Students list page.

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

				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

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
								var _tname = jQuery('#task-name').val();
								var _tdesc = jQuery('#task-desc').val();
								var _tfrom = jQuery('#task-startdate').val();
								var _tdue = jQuery('#task-deadline').val();
								if (_tfrom === '' || _tfrom === ' ') {
									var _tfrom = jQuery('#task-startdate').text();
									var _tdue = jQuery('#task-deadline').text();
								}
								var _tbenefit = jQuery('#task-benefit').val();
								var _tassignto = jQuery('#member-list').text();
								var _thelpurl = jQuery('#task-helper-url').val();
								var _thelpyoutube = jQuery('#task-helper-youtube').val();
								var _priority = jQuery('input[name=todopriority]:checked', '.edit-form').val();
								var _ids = ActiveMembers.list;
								var _domainids;
								service.returnDomainIDList({
									success : function(data) {
										_domainids = data;
									}
								});
								service.AssignToDo(_domainids[0], _ids, _tname, _tdesc, _priority, _tfrom, _tdue, _tbenefit, _thelpurl, _thelpyoutube, {
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
