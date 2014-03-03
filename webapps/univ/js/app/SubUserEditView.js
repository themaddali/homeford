define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Pager'], function(modernizr, cookie, service, validate, router, pager) {"use strict";
	var SubUserEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var SelectedUser;

			function SubUserEditView() {

				function populateData(studentname) {
					console.log('User Clicked : ' + SelectedUser);
					service.getStudentObject(SelectedUser,{
						success : function(StudentData) {
							//OverView Panel Load
							jQuery('#student-name').val(StudentData[0].name);
							jQuery('#student-id').val(StudentData[0].id);
							jQuery('#student-dob').val(StudentData[0].dob);
							if(StudentData[0].gender === 'male')
							{
								jQuery('input:radio[name=sex]')[0].checked = true;
							}
							else
							{
								jQuery('input:radio[name=sex]')[1].checked = true;
							}
							jQuery('#student-email').val(StudentData[0].email);
							jQuery('#student-phone').val(StudentData[0].phone);
							jQuery('#student-primary-contact').val(StudentData[0].realschoolname);
							jQuery('#student-primary-email').val(StudentData[0].immediatecontactemail);
							jQuery('#student-primary-phone').val(StudentData[0].immediatecontactphone);
							jQuery('#student-address').val(StudentData[0].location);
							jQuery('#student-notes').val(StudentData[0].notes);
							jQuery('#student-school').val(StudentData[0].realschoolname);
							//jQuery('#student-image').val(StudentData[0].image);
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
						router.go('/home', '/admin/overview');
						return false;
					}
				}


				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions

						jQuery('#student-edit-modal-close').on('click', function() {
							var golocation = (window.location.href).split('#')[0] + 'admin';
							pager.makeViewReload('admin', golocation);
							router.go('/admin', '#/admin/subuseredit');
						});

					} // Cookie Guider
				};

				this.activeUser = function(studentname) {
					SelectedUser = studentname;
				}
			}

			return SubUserEditView;
		}());

	return new SubUserEditView();
});
