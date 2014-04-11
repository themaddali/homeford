//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', 'toggles', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, toggles, router, notify, admin) {"use strict";

	var MembersEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var regualarvalidator;
			var emailvalidator;

			function MembersEditView() {

				function populateData() {
					//$(".modal-contents").tabs();
					$('.toggle').toggles({
						text : {
							on : 'Email',
							off : 'Regular'
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

				function clearForm() {
					jQuery('.form-item input').val("");
					emailvalidator.resetForm();
					regualarvalidator.resetForm();
				};

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					clearForm();
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

						jQuery('#member-add').on('click', function() {
							if (jQuery('#member-add').val() == 'Add') {
								if ($("#regularadd").valid()) {
									emailvalidator.resetForm();
									regualarvalidator.resetForm();
									var _domainid;
									service.returnDomainIDList({
										success : function(data){
											_domainid = data;
										}
									});
									var _userid = service.thisuserID();
									service.addMemberRegular(_domainid[0], _userid, $('#member-first-name').val(), $('#member-last-name').val(), {
										success : function(data) {
											if (data.status !== 'error') {
												notify.showNotification('OK', data.message);
											} else {
												notify.showNotification('ERROR', data.message);
											}
											setTimeout(function() {
												router.returnToPrevious();
											}, 3000);
										}
									});
								}
							} else {
								if ($("#emailadd").valid()) {
									emailvalidator.resetForm();
									regualarvalidator.resetForm();
									var domainname = service.returnDomainList();
									var roles = [{
										"roleName" : "ROLE_TIER3"
									}];
									service.sendInvite(jQuery('#member-email').val(), 'You are added to ' + domainname[0], domainname[0], roles, {
										success : function(response) {
											if (response !== 'error' && response.status !== 'error') {
												notify.showNotification('OK', response.message);
											} else {
												notify.showNotification('ERROR', response.message);
											}
										}
									});
								}
							}
						});

						//Adjusting Focus:
						
						$('.toggle').on('toggle', function(e, active) {
							setTimeout(function() {
								if (active) {
									jQuery('#member-add').val('Add (Send Email)');
									jQuery('#emailadd').show();
									jQuery('#regularadd').hide();
								} else {
									jQuery('#member-add').val('Add');
									jQuery('#emailadd').hide();
									jQuery('#regularadd').show();
								}
							}, 200);
							//to support touch emulation
						});

						regualarvalidator = jQuery("#regularadd").validate({
							rules : {
								memberfirstname : {
									required : true,
								},
								memberlastname : {
									required : true,
								}
							}
						});

						emailvalidator = jQuery("#emailadd").validate({
							rules : {
								memberemail : {
									required : true,
									email : true
								}
							}
						});

					} // Cookie Guider
				};

			}

			return MembersEditView;
		}());

	return new MembersEditView();
});
