define(['modernizr', 'cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Pager'], function(modernizr, cookie, service, validate, router, pager) {"use strict";

	var SubUserAddView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function SubUserAddView() {

				function populateData() {
					service.getUnivObject({
						success : function(UnivData) {
							//OverView Panel Load
							jQuery('.univ-name').text(UnivData[0].univname);
							jQuery('.univ-id').text(UnivData[0].id);
							jQuery('.univ-about').text(UnivData[0].about);
							jQuery('.univ-admin').text(UnivData[0].adminname);
							jQuery('.univ-created').text(UnivData[0].created);
							jQuery('.univ-email').text(UnivData[0].email);
							jQuery('.univ-phone').text(UnivData[0].phone);
							jQuery('.univ-address').text(UnivData[0].address);
							jQuery('.univ-faculty').text(UnivData[0].faculty.length);
							jQuery('.univ-students').text(UnivData[0].students.length);

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

				// mouse is over a form element
				function onOverContent(event) {
					var messageContainer = $('.form-guide', event.target);
					messageContainer.toggleClass('hp-empty', $.grep(messageContainer.children(), function(e) {
						return ('none' !== $(e).css('display') && 'hidden' !== $(e).css('visibility'));
					}).length === 0);
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

						jQuery('#student-add-modal-close').on('click', function() {
							var golocation = (window.location.href).split('#')[0] + 'admin';
							pager.makeViewReload('admin', golocation);
							router.go('/admin', '#/admin/subuseradd');
						});

						jQuery('#student-add-submit').on('click', function() {
							if ($("#add-form").valid()) {
								jQuery('#student-add-submit').val('Saving....');
								setTimeout(function() {
									jQuery('#student-add-submit').val('Edit');
									var golocation = (window.location.href).split('#')[0] + 'admin';
									pager.makeViewReload('admin', golocation);
									router.go('/admin', '#/admin/subuseradd');
								}, 3000);
							}
						});

						$("#add-form").validate({
							rules : {
								studentname : {
									required : true,
									minlength : 3
								},
								studentid : {
									required : true,
								},
								studentdob : {
									required : true,
									date : true
								},
								studentemail : {
									email : true
								},
								studentphone : {
									digits : true
								},
								studentescalation : {
									required : true
								},
								studentescalationemail : {
									required : true,
									email : true
								},
								studentescalationphone : {
									required : true,
									digits : true
								},
								studentescalationbackupphone : {
									required : true,
									digits : true
								},
								studentescalationbackupemail : {
									required : true,
									email : true
								},
							}
						});

					} // Cookie Guider
				};

			}

			return SubUserAddView;
		}());

	return new SubUserAddView();
});
