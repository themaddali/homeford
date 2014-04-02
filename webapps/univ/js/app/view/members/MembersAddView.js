//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

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
					jQuery('.form-item input').val("");
					validator.resetForm();
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
							if ($(".edit-form").valid()) {
								var _domainid = service.returnDomainIDList();
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
										}, 5000);
									}
								});
							}
						});

						validator = jQuery(".edit-form").validate({
							rules : {
								memberfirstname : {
									required : false,
								},
								memberlastname : {
									required : false,
								},
								memberemail : {
									required : false,
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
