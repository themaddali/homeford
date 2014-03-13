//View that will drive the Students list page.

define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Pager'], function(modernizr, cookie, service, validate, router, pager) {"use strict";

	var OverViewView = ( function() {

			/**
			 * Constructor
			 *
			 */
			

			function OverViewView() {

				function populateData() {
					service.getUnivObject({
						success : function(UnivData) {
							//OverView Panel Load
							jQuery('#univ-name').val(UnivData[0].univname);
							jQuery('#univ-id').val(UnivData[0].id);
							jQuery('#univ-about').val(UnivData[0].about);
							jQuery('#univ-admin').val(UnivData[0].adminname);
							jQuery('#univ-created').val(UnivData[0].created);
							jQuery('#univ-email').val(UnivData[0].email);
							jQuery('#univ-phone').val(UnivData[0].phone);
							jQuery('#univ-address').val(UnivData[0].address);
							jQuery('#univ-faculty').val(UnivData[0].faculty.length);
							jQuery('#univ-students').val(UnivData[0].students.length);

							//Student Manage Panel Load
							var studentmintemplate = jQuery('#students-list-min-template').remove().attr('id', '');
							var COUNT = UnivData[0].students.length;

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
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('#overview-edit-modal-close').on('click', function() {
							//Fix this in a more dynamic way later.
							var golocation = (window.location.href).split('#')[0] + 'admin';
							//pager.makeViewReload('admin', golocation);
							router.go('/admin/show', '#/admin/overview');
						});

						jQuery('#overview-edit').on('click', function() {
							if ($("#overview-edit-form").valid()) {
								jQuery('#overview-edit').val('Saving....');
								setTimeout(function() {
									jQuery('#overview-edit').val('Edit');
									var golocation = (window.location.href).split('#')[0] + 'admin';
									pager.makeViewReload('admin', golocation);
									router.go('/admin/show', '#/admin/overview');
								}, 3000);
							}
						});

						jQuery("#overview-edit-form").validate({
							rules : {
								univname : {
									required : true,
									minlength : 3
								},
								univid : {
									required : true,
								},
								univadmin : {
									required : true,
								},
								univcreated : {
									required : true,
									date : true
								},
								univemail : {
									required : true,
									email : true
								},
								univphone : {
									required : true,
									digits : true
								},
							}
						});

					} // Cookie Guider
				};

			}

			return OverViewView;
		}());

	return new OverViewView();
});
