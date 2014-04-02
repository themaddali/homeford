//View that will drive the Students list page.

define(['cookie', 'jqueryui', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/todo/ToDoAssignView'], function(cookie, jqueryui, service, validate, router, notify, admin, todoassign) {"use strict";

	var ToDoAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var membernames = [];
			var template;

			function ToDoAssignView() {

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
					jQuery('#invite-domain').empty();
					jQuery('.edit-card-canvas').empty();
					jQuery('#checkbox-control').text('Un-Select All');
					membernames = [];
					var memberscount = 0;
					//backuptemplate
					//jQuery('.div-template').append(template.attr('id', 'member-template'));
					var activedomains = service.returnDomainList();
					for (var i = 0; i < activedomains.length; i++) {
						service.getMembersOnly(activedomains[i], {
							success : function(data) {
								var thisitem = template.clone();
								for (var j = 0; j < data.length; j++) {
									var roles = JSON.stringify(data[j].roles);
									if (roles.indexOf('ROLE_TIER3') !== -1) {
										memberscount = memberscount + 1;
										jQuery('.metadata').text(memberscount + ' of ' + memberscount + ' selected');
										var thisitem = template.clone();
										if ((data[j].firstName === 'null' || data[j].firstName == null || data[j].firstName === "" ) && (data[j].lastName === 'null' || data[j].lastName == null || data[j].lastName === "")) {
											jQuery('.membercard-name', thisitem).text(data[j].email);
										} else {
											jQuery('.membercard-name', thisitem).text(data[j].firstName + ' ' + data[j].lastName);
										}
										jQuery('.membercard-checkbox', thisitem).attr('checked','checked');
										membernames.push(jQuery('.membercard-name', thisitem).text());
										jQuery('.membercard-id', thisitem).text('Id# ' + data[j].id);
										jQuery('.edit-card-canvas').append(thisitem);
									}
									if (j === data.length - 1) {
										$(".card-search").autocomplete({
											source : function(request, response) {
												var results = $.ui.autocomplete.filter(membernames, request.term);
												response(results.slice(0, 5));
											}
										});
										activateEvents();
									}
								}
							}
						});
					}
				}

				function activateEvents() {
					jQuery('#checkbox-control').click(function() {
						var numberOfChecked = $('input:checkbox:checked').length;
						var totalCheckboxes = $('input:checkbox').length;
						if (numberOfChecked === totalCheckboxes && numberOfChecked !== 0) {
							jQuery('#checkbox-control').text('Select All');
							$(".membercard-checkbox").prop('checked', false);
							jQuery('.membercard').removeClass('active');
							jQuery('.metadata').text('0 of ' + totalCheckboxes + ' selected');
						} else {
							jQuery('#checkbox-control').text('Un-Select All');
							$(".membercard-checkbox").prop('checked', true);
							jQuery('.membercard').addClass('active');
							jQuery('.metadata').text(totalCheckboxes + ' of ' + totalCheckboxes + ' selected');
						}
					});

					jQuery('.membercard-checkbox').change(function() {
						if (!$(this).is(':checked')) {
							jQuery(this).parent().removeClass('active');
						} else {
							jQuery(this).parent().addClass('active');
						}
						var numberOfChecked = $('input:checkbox:checked').length;
						var totalCheckboxes = $('input:checkbox').length;
						if (numberOfChecked !== totalCheckboxes) {
							jQuery('#checkbox-control').text('Select All');
						} else {
							jQuery('#checkbox-control').text('Un-Select All');
						}
						jQuery('.metadata').text(numberOfChecked + ' of ' + totalCheckboxes + ' selected');
					});

					jQuery('.card-search').change(function(event) {
						var searchword = jQuery('.card-search').val();
						var cardlist = jQuery('.edit-card-canvas .membercard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
						}
					});
					jQuery('.card-search').click(function(event) {
						var searchword = jQuery('.card-search').val();
						var cardlist = jQuery('.edit-card-canvas .membercard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
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
						template = jQuery('#member-template').remove().attr('id', '');
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('#members-pick').click(function() {
							var selectedlist = $('input:checkbox:checked').parent().find('.membercard-id').text().replace(/\n/g, '').split('Id# ');
							selectedlist.shift();
							var selectedMembers = {};
							selectedMembers.text = jQuery('.metadata').text();
							selectedMembers.list = selectedlist;
							todoassign.selectedMembers(selectedMembers);
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return ToDoAssignView;
		}());

	return new ToDoAssignView();
});
