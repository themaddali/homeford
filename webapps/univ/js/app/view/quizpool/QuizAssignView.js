//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var QuizAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function QuizAssignView() {

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
					jQuery('#quiz-name').val('');
					jQuery('#quiz-desc').val('');
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
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});


						jQuery('#quiz-assign').on('click', function() {
							if ($(".edit-form").valid()) {
								var _qname = jQuery('#quiz-name').val();
								var _qdesc = jQuery('#quiz-desc').val();
								var _domainids;
								service.returnDomainIDList({
									success : function(data) {
										_domainids = data;
									}
								});
								service.AssignQuiz(_domainids[0], _qname, _qdesc, {
									success : function(data) {
										if (data.status !== 'error') {
											notify.showNotification('OK', data.message);
										} else {
											notify.showNotification('ERROR', data.message);
										}
										setTimeout(function() {
											router.returnToPrevious();
										}, 2000);
									}
								});
							}
							//Need to update to handler
						});

						validator = jQuery(".edit-form").validate({
							rules : {
								quizname : {
									required : true,
								},
								quizdesc : {
									required : true,
								},
							}
						});

					} // Cookie Guider
				};

			}

			return QuizAssignView;
		}());

	return new QuizAssignView();
});