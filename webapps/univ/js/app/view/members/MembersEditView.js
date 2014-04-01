//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var MembersEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ACTIVEMEMBER;

			function MembersEditView() {

				function populateData() {
					if (ACTIVEMEMBER){
						jQuery('#member-first-name').val(ACTIVEMEMBER.firstname);
						jQuery('#member-last-name').val(ACTIVEMEMBER.lastname);
						jQuery('#member-id').val(ACTIVEMEMBER.id);
						jQuery('#member-email').val(ACTIVEMEMBER.email);
						//jQuery('#member-security').val(ACTIVEMEMBER.security);
						jQuery('#member-domains').val(ACTIVEMEMBER.domain);
						jQuery('#member-roles').val(ACTIVEMEMBER.roles);
					}
					else{
						router.go('/memberslist')
					}
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
				
				this.setMemberInfo = function(MemberInfo){
					ACTIVEMEMBER = MemberInfo;
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

						jQuery('#member-edit').on('click', function() {
							if ($(".edit-form").valid()) {
								alert('action needed');
								setTimeout ( function(){
									router.returnToPrevious();
								},1000);
							}
						});

						jQuery("#profile-edit-form").validate({
							rules : {
								profileid : {
									required : true,
								},
								profilepassword : {
									required : false,
								},
								profilepasswordrepeat : {
									equalTo : "#profile-password"
								},
								profileemail : {
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
