define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/quizpool/QuestionAddView'], function(modernizr, cookie, service, validate, router, notify, admin, questionassign) {"use strict";

	var QuizAddView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function QuizAddView() {

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
					jQuery('.edit-notify').hide();
					document.title = 'Zingoare | Quiz Add';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Quiz Add';

					if (checkForActiveCookie() === true) {
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.go('/admin');
						});

						jQuery('#quiz-assign').on('click', function() {
							if ($(".edit-form").valid()) {
								var _qname = jQuery('#quiz-name').val();
								var _qdesc = jQuery('#quiz-desc').val();
								// var _domainids;
								// service.returnDomainIDList({
									// success : function(data) {
										// _domainids = data;
									// }
								// });
								service.AddQuiz(service.domainNametoID(jQuery.cookie('subuser')), _qname, _qdesc, {
									success : function(data) {
										if (data.status !== 'error') {
											notify.showNotification('OK', data.message);
											setTimeout(function() {
												var active = {};
												active.name = _qname;
												active.id = data.id;
												active.count = null;
												questionassign.activeQuiz(active);
												router.go('/questionadd');
											}, 2000);
										} else {
											notify.showNotification('ERROR', data.message);
										}
									}
								});
							}
							else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}
						});

						validator = jQuery(".edit-form").validate({
							rules : {
								quizname : {
									required : true,
								}
							}
						});

					} // Cookie Guider
				};

			}

			return QuizAddView;
		}());

	return new QuizAddView();
});
