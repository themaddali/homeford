define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/quizpool/QuestionAddView'], function(cookie, service, validate, tablesorter, router, notify, admin, questionassign) {"use strict";

	var QuizListView = ( function() {

			/**
			 * Constructor
			 *
			 */

			function QuizListView() {

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
						service.DomainQuizList(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									jQuery('.noinfo').hide();
									jQuery('.view-table').show();
									var row = rowtemplate.clone();
									jQuery('.quiz-name', row).text(data[j].name);
									jQuery('.quiz-id', row).text(data[j].id);
									jQuery('.quiz-desc', row).text(data[j].description);
									jQuery('.quiz-strength', row).text(data[j].questionCount);
									jQuery('.view-table  tbody').append(row);
									if (j === data.length - 1) {
										jQuery('.view-table').trigger("update");
										activateTableClicks();
									}
								}
							}
						});
					}
				}

				function activateTableClicks() {
					var rowObject = {
						name : null,
						id : null,
						count : null,
					};

					jQuery('.view-table tbody tr').click(function() {
						jQuery('.view-table tbody tr').removeClass('rowactive');
						jQuery('.members-action').css('color', 'white');
						jQuery(this).addClass('rowactive');
						jQuery('.rowactive').find('.members-action').css('color', '#007DBA');
						rowObject.name = jQuery(this).find('.quiz-name').text();
						rowObject.id = jQuery(this).find('.quiz-id').text();
						rowObject.count = jQuery(this).find('.quiz-strength').text();
						questionassign.activeQuiz(rowObject);
						router.go('/questionadd');
					});
				}

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Quiz List';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Quiz List';

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return QuizListView;
		}());

	return new QuizListView();
});
