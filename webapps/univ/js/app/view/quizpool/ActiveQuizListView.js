define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/members/MembersEditView'], function(cookie, service, validate, tablesorter, router, notify, admin, membersedit) {"use strict";

	var ActiveQuizListView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function ActiveQuizListView() {

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
					var activedomains = admin.getActiveDomainsIDs();
					if (!activedomains || activedomains.length == 0) {
						router.go('/admin', '/memberslist');
					} else {
						loadTable(activedomains);
					}

				}

				function loadTable(activedomains) {
					jQuery('.noinfo').show();
					jQuery('.view-table').hide();
					var rowtemplate = jQuery('#quiz-template').attr('id', '');
					//Backing the template
					jQuery('.div-template').append(rowtemplate.attr('id', 'quiz-template'));
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.DomainToDoList(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									if ((data[j].groupName).indexOf('@QUIZ') !== -1) {
										jQuery('.noinfo').hide();
										jQuery('.view-table').show();
										var row = rowtemplate.clone();
										jQuery('.task-name', row).text(data[j].groupName.split('@QUIZ')[1]);
										jQuery('.task-id', row).text(data[j].id);
										jQuery('.task-count', row).text(data[j].todos.length + ' members');
										if (data[j].todos[0].todoStartDate) {
											jQuery('.task-date', row).text(data[j].todos[0].todoStartDate.split(" ")[0]);
										} else {
											jQuery('.task-date', row).text('-');
										}
										jQuery('.view-table  tbody').append(row);
										if (j === data.length - 1) {
											jQuery('.view-table').trigger("update");
											activateTableClicks();
										}
									}
								}
							}
						});
					}
				}

				function activateTableClicks() {
					// No function on table yet!!
				}

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Active Quiz List';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Active Quiz List';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return ActiveQuizListView;
		}());

	return new ActiveQuizListView();
});
