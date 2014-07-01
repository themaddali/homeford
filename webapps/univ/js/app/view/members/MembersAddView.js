define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/studentlist/StudentListView'], function(modernizr, cookie, service, validate, router, notify, admin, studentlist) {"use strict";

	var MembersEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function MembersEditView() {

				function populateData() {

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
					jQuery(input[type='text']).val();
					validator.resetForm();
					jQuery('#member-first-name').focus();
				};

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					clearForm();
					document.title = 'Zingoare | Members Add';
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Members Add';

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#member-add').on('click', function() {
							if (!jQuery('.edit-form').valid()) {
								//console.log(validator.numberOfInvalids());
							} else {
								//console.log(validator.numberOfInvalids());
							}
							if (jQuery('#member-email').val().length == 0) {
								if (validator.numberOfInvalids() === 1) {
									validator.resetForm();
									// var _domainid;
									// service.returnDomainIDList({
										// success : function(data) {
											// _domainid = data;
										// }
									// });
									var _userid = service.thisuserID();
									service.addMemberRegular(service.domainNametoID(jQuery.cookie('subuser')), _userid, $('#member-first-name').val(), $('#member-last-name').val(), {
										success : function(data) {
											if (data.status !== 'error') {
												notify.showNotification('OK', data.message);
											} else {
												notify.showNotification('ERROR', data.message);
											}
											setTimeout(function() {
												studentlist.reload();
												router.returnToPrevious();
											}, 2000);
										}
									});
								}
							} else {
								if (validator.numberOfInvalids() == 2) {
									validator.resetForm();
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
											setTimeout(function() {
												router.returnToPrevious();
											}, 2000);
										}
									});
								} else {
									notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
								}
							}
						});

						//Add and wait for more inputs:
						jQuery('#member-addmore').on('click', function() {
							if (!jQuery('.edit-form').valid()) {
								//console.log(validator.numberOfInvalids());
							} else {
								//console.log(validator.numberOfInvalids());
							}
							if (jQuery('#member-email').val().length == 0) {
								if (validator.numberOfInvalids() === 1) {
									validator.resetForm();
									// var _domainid;
									// service.returnDomainIDList({
										// success : function(data) {
											// _domainid = data;
										// }
									// });
									var _userid = service.thisuserID();
									service.addMemberRegular(service.domainNametoID(jQuery.cookie('subuser')), _userid, $('#member-first-name').val(), $('#member-last-name').val(), {
										success : function(data) {
											if (data.status !== 'error') {
												notify.showNotification('OK', data.message);
											} else {
												notify.showNotification('ERROR', data.message);
											}
											setTimeout(function() {
												studentlist.reload();
												clearForm();
											}, 2000);
										}
									});
								}
							} else {
								if (validator.numberOfInvalids() == 2) {
									validator.resetForm();
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
											setTimeout(function() {
												clearForm();
											}, 2000);
										}
									});
								}
							}
						});

						//Adjusting Focus:
						jQuery('#member-first-name').keyup(function() {
							if (jQuery('#member-first-name').val().length > 0 && jQuery('#member-last-name').val().length > 0) {
								jQuery('#member-email').attr('readonly', 'readonly');
							} else {
								jQuery('#member-email').removeAttr('readonly');
							}
						});
						jQuery('#member-last-name').keyup(function() {
							if (jQuery('#member-first-name').val().length > 0 && jQuery('#member-last-name').val().length > 0) {
								jQuery('#member-email').attr('readonly', 'readonly');
								jQuery('#member-email').val('');
							} else {
								jQuery('#member-email').removeAttr('readonly');
							}
						});
						jQuery('#member-email').keyup(function() {
							if (jQuery('#member-email').val().length > 0) {
								jQuery('#member-first-name').val('');
								jQuery('#member-last-name').val('');
								jQuery('#member-first-name').attr('readonly', 'readonly');
								jQuery('#member-last-name').attr('readonly', 'readonly');
							} else {
								jQuery('#member-first-name').removeAttr('readonly');
								jQuery('#member-last-name').removeAttr('readonly');
							}
						});

						jQuery('#form-reset').click(function() {
							jQuery('#member-first-name').val('');
							jQuery('#member-last-name').val('');
							jQuery('#member-first-name').removeAttr('readonly');
							jQuery('#member-last-name').removeAttr('readonly');
							jQuery('#member-email').removeAttr('readonly');
							jQuery('#member-email').val('');
							validator.resetForm();
						});

						jQuery('#member-addmore').click(function() {

						});

						validator = jQuery(".edit-form").validate({
							rules : {
								memberfirstname : {
									required : true,
								},
								memberlastname : {
									required : true,
								},
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
