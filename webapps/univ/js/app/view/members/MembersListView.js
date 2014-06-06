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
					//var activedomains = admin.getActiveDomainsIDs();
					var activedomains = [];
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
					if (!activedomains || activedomains.length == 0) {
						router.go('/admin', '/memberslist');
					} else {
						loadTable(activedomains);
					}

				}

				function loadTable(activedomains) {
					jQuery('.noinfo').show();
					jQuery('.view-table').hide();
					var rowtemplate = jQuery('#members-template').attr('id', '');
					//Backing the template
					jQuery('.div-template').append(rowtemplate.attr('id', 'members-template'));
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.getMembers(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									var row = rowtemplate.clone();
									if (!data[j].firstName || data[j].firstName === 'null' || data[j].firstName === null) {
										data[j].firstName = "  "
									}
									if (data[j].lastName == 'null' || data[j].lastName == null || !data[j].lastName) {
										data[j].lastName = "  "
									}
									if (data[j].image && data[j].image.name != null) {
										jQuery('.members-image', row).attr('src', '/zingoare/api/profileupload/picture/' + data[j].image.id);
									} else {
										jQuery('.members-image', row).attr('src', 'img/noimg.png');
									}
									jQuery('.members-name', row).text(data[j].firstName + ' ' + data[j].lastName).attr('fn',data[j].firstName).attr('ln',data[j].lastName);
									jQuery('.members-id', row).text(data[j].id);
									jQuery('.members-email', row).text(data[j].email);
									//jQuery('.members-domain', row).text(service.domainIDtoName(thisdomaininstance));
									var roles = JSON.stringify(data[j].roles);
									if (roles.indexOf('ROLE_TIER1') !== -1) {
										jQuery('.members-roles', row).text('Owner');
									} else if ((roles.indexOf('ROLE_TIER2') !== -1) && (roles.indexOf('ROLE_TIER3') == -1)) {
										jQuery('.members-roles', row).text('Admin');
									} else if ((roles.indexOf('ROLE_TIER2') !== -1) && (roles.indexOf('ROLE_TIER3') !== -1)) {
										jQuery('.members-roles', row).text('Admin and Member');
									} else if ((roles.indexOf('ROLE_TIER3') !== -1) && (roles.indexOf('ROLE_TIER2') == -1)) {
										jQuery('.members-roles', row).text('Member');
									}
									if (jQuery('.members-roles', row).text() !== 'Owner') {
										jQuery('.view-table  tbody').append(row);
									}
									if (j === data.length - 1) {
										jQuery('.view-table').trigger("update");
										if (jQuery('.view-table tbody tr').length > 0) {
											jQuery('.view-table').show();
											jQuery('.noinfo').hide();
										}
										activateTableClicks();
									}
								}
							}
						});
					}
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
						email : '',
						id : 'none',
						image : 'img/noimg.png',
					};

					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery('.members-action').css('color', 'white');
						jQuery(this).addClass('rowactive');
						jQuery('.rowactive').find('.members-action').css('color', '#007DBA');
						rowObject.firstname = jQuery(this).find('.members-name').attr('fn');
						rowObject.lastname = jQuery(this).find('.members-name').attr('ln');
						rowObject.security = jQuery(this).find('.members-security').text();
						rowObject.id = jQuery(this).find('.members-id').text();
						if (jQuery(this).find('.members-email').text() !== 'null') {
							rowObject.email = jQuery(this).find('.members-email').text();
						}
						rowObject.roles = jQuery(this).find('.members-roles').text();
						rowObject.domain = jQuery(this).find('.members-domain').text();
						rowObject.courses = jQuery(this).find('.members-courses').text();
						if (jQuery(this).find('.members-image').attr('src') !== "img/noimg.png") {
							rowObject.image = jQuery(this).find('.members-image').attr('src');
						}
						rowObject.courses = jQuery(this).find('.members-courses').text();
						membersedit.setMemberInfo(rowObject);
						router.go('/memberslistedit');
					});

					// jQuery('.members-action').click(function(e) {
					// if (jQuery(this).parent().hasClass('rowactive')) {
					// rowObject.firstname = jQuery(this).parent().find('.members-name').text().split(" ")[0];
					// rowObject.lastname = jQuery(this).parent().find('.members-name').text().split(" ")[1];
					// rowObject.security = jQuery(this).parent().find('.members-security').text();
					// rowObject.id = jQuery(this).parent().find('.members-id').text();
					// rowObject.email = jQuery(this).parent().find('.members-email').text();
					// rowObject.roles = jQuery(this).parent().find('.members-roles').text();
					// rowObject.domain = jQuery(this).parent().find('.members-domain').text();
					// rowObject.courses = jQuery(this).parent().find('.members-courses').text();
					// membersedit.setMemberInfo(rowObject);
					// router.go('/memberslistedit');
					// }
					// });

					// TWO Step Approact, Click to activate, Gear to edit

					// jQuery('.view-table tbody tr').click(function() {
					// jQuery('.view-table tbody tr').removeClass('rowactive');
					// jQuery('.members-action').css('color', 'white');
					// jQuery(this).addClass('rowactive');
					// jQuery('.rowactive').find('.members-action').css('color', '#007DBA');
					// });
					//
					// jQuery('.members-action').click(function(e) {
					// if (jQuery(this).parent().hasClass('rowactive')) {
					// rowObject.firstname = jQuery(this).parent().find('.members-name').text().split(" ")[0];
					// rowObject.lastname = jQuery(this).parent().find('.members-name').text().split(" ")[1];
					// rowObject.security = jQuery(this).parent().find('.members-security').text();
					// rowObject.id = jQuery(this).parent().find('.members-id').text();
					// rowObject.email = jQuery(this).parent().find('.members-email').text();
					// rowObject.roles = jQuery(this).parent().find('.members-roles').text();
					// rowObject.domain = jQuery(this).parent().find('.members-domain').text();
					// rowObject.courses = jQuery(this).parent().find('.members-courses').text();
					// membersedit.setMemberInfo(rowObject);
					// router.go('/memberslistedit');
					// }
					// });
				}

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Members List';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Members List';

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
