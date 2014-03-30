//View that will drive the Students list page.

define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/members/MembersEditView'], function(cookie, service, validate, tablesorter, router, notify, admin, membersedit) {"use strict";

	var MembersListView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var MALEICON = '<i class="icon-male  icon-1x "></i>';
			var FEMALEICON = '<i class="icon-female  icon-1x "></i>';

			function MembersListView() {

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
					jQuery('.view-table  tbody').empty();
					jQuery('.view-table').tablesorter();
					var activedomains = admin.getActiveDomains();
					if (!activedomains || activedomains.length == 0) {
						router.go('/admin', '/memberslist');
					} else {
						loadTable(activedomains);
					}

				}

				function loadTable(activedomains) {
					service.getUnivObject({
						success : function(UnivData) {
							var rowtemplate = jQuery('#members-template').attr('id', '');
							//Backing the template
							jQuery('.div-template').append(rowtemplate.attr('id', 'members-template'));
							var COUNT = UnivData[0].students.length;
							for (var i = 0; i < COUNT; i++) {
								var row = rowtemplate.clone();
								if (UnivData[0].students[i].gender === 'female') {
									//jQuery('.members-icon', row).empty().append(FEMALEICON);
								} else {
									//jQuery('.members-icon', row).empty().append(MALEICON);
								}
								jQuery('.members-name', row).text(UnivData[0].students[i].name);
								jQuery('.members-id', row).text(UnivData[0].students[i].id);
								jQuery('.members-security', row).text(UnivData[0].students[i].security);
								jQuery('.members-courses', row).text(UnivData[0].students[i].courses.length);
								jQuery('.view-table  tbody').append(row);
								jQuery('.view-table').trigger("update");
								activateTableClicks();
							}
						}
					});
				}

				function activateTableClicks() {
					var rowObject = {
						firstname : "none",
						lastname : "none",
						security : 'none',
						invitedby : 'none',
						status : 'none',
						domain : 'none',
						courses : 'none',
						id : 'none'
					};

					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery('.members-action').css('color', 'white');
						jQuery(this).addClass('rowactive');
						jQuery('.rowactive').find('.members-action').css('color', '#007DBA');
					});
					
					jQuery('.members-action').click(function(e) {
						if (jQuery(this).parent().hasClass('rowactive')) {
							rowObject.firstname = jQuery(this).parent().find('.members-name').text().split(" ")[0];
							rowObject.lastname = jQuery(this).parent().find('.members-name').text().split(" ")[1];
							rowObject.security = jQuery(this).parent().find('.members-security').text();
							rowObject.id = jQuery(this).parent().find('.members-id').text();
							rowObject.domain = jQuery(this).parent().find('.members-domain').text();
							rowObject.courses = jQuery(this).parent().find('.members-courses').text();
							membersedit.setMemberInfo(rowObject);
							router.go('/memberslistedit');
						}
					});
				}

				function clearForm() {

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
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return MembersListView;
		}());

	return new MembersListView();
});
