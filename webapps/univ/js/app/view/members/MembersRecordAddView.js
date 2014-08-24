define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/studentlist/StudentListView'], function(modernizr, cookie, service, validate, router, notify, admin, studentlist) {"use strict";

	var MembersRecordAddView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ID, NAME;

			function MembersRecordAddView() {

				function populateData() {
					if (!NAME || !ID || NAME.length < 1) {
						router.go('/membersgrid');
					}
					jQuery('#member-name').val(NAME);
					if (Modernizr.touch && Modernizr.inputtypes.date) {
						document.getElementById('member-dob').type = 'date';
					} else {
						var date = new Date();
						var today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
						jQuery("#member-dob").datepicker({
							maxDate : 0,
							changeMonth : true,
							changeYear : true,
							dateFormat : 'yy-mm-dd',
						});
						jQuery("#member-dob").val(today);
					}
					service.getMemberRecord(ID, {
						success : function(data) {
							if (data.status !== 'error') {
								notify.showNotification('OK', data.message);
							} else {
								notify.showNotification('ERROR', data.message);
							}
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
					jQuery('input[type="text"]').val('');
					jQuery('input[type="email"]').val('');
					jQuery('.edit-notify').hide();
				};

				this.setuser = function(id, name) {
					ID = id;
					NAME = name;
				};

				this.pause = function() {

				};

				this.resume = function() {
					clearForm();
					populateData();
					document.title = 'Zingoare | Student Record';
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Student Record';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#member-dob').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});

						jQuery('#form-reset').click(function() {
							clearForm();
						});

					} // Cookie Guider
				};

			}

			return MembersRecordAddView;
		}());

	return new MembersRecordAddView();
});
