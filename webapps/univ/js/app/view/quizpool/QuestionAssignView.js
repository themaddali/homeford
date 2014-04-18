//View that will drive the Students list page.

define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var QuestionAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var ACTIVEQUIZ;
			var optiontemplate;

			function QuestionAssignView() {

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
					if (ACTIVEQUIZ) {
						jQuery('#quiz-name').val(ACTIVEQUIZ.name);
						jQuery('#quiz-name').attr('quizid', ACTIVEQUIZ.id);
					} else {
						jQuery('#quiz-name').val('');
						jQuery('#quiz-name').attr('quizid', '');
					}
				}


				this.activeQuiz = function(activequiz) {
					ACTIVEQUIZ = activequiz;
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
						optiontemplate = jQuery('#option-template').attr('id', '');
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

						jQuery('.inlinebutton-or').click(function() {
							if (jQuery(this).hasClass('correct')) {
								jQuery('.inlinebutton-or.incorrect').removeClass('incorrect').addClass('correct');
								jQuery(this).removeClass('correct').addClass('incorrect');
								jQuery(this).removeClass('correct').val('false');
							} else {
								jQuery('.inlinebutton-or.correct').removeClass('correct').addClass('incorrect');
								jQuery(this).removeClass('incorrect').addClass('correct');
								jQuery(this).removeClass('incorrect').val('true');
							}
						});
						jQuery('.inlinebutton-multi').click(function() {
							if (jQuery(this).hasClass('correct')) {
								jQuery(this).removeClass('correct').addClass('incorrect').val('false');
								;
							} else {
								jQuery(this).removeClass('incorrect').addClass('correct').val('true');
							}
						});

						jQuery("input[name=category][type=radio]").change(function() {
							if (jQuery('input[name=category]:checked').val() === '0') {
								jQuery('#category-2').fadeIn();
								jQuery('#category-1').fadeOut();
							} else {
								jQuery('#category-2').fadeOut();
								jQuery('#category-1').fadeIn();
							}
						});

						jQuery('.inlinebutton-add').click(function() {
							jQuery(this).parent().parent().parent().append(optiontemplate);
							jQuery(this).next().hide();
							jQuery(this).hide();
						})

						jQuery('#question-add').on('click', function() {
							if ($(".edit-form").valid()) {
								var _quizname = jQuery('#quiz-name').val();
								var _qid = jQuery('#quiz-name').attr('quizid');
								if (!_qid) {
									_qid = 4;
								}
								var _qcategory = jQuery('input[name=category]:checked').val();
								var _qname = jQuery('#question-name').val();
								var answersarray = [];
								for (var i = 0; i < jQuery('.form-datainput input[type=text]').length; i++) {
									var _answers = {};
									_answers.text = jQuery('#tf-option-' + i).val();
									_answers.isCorrect = jQuery('#tf-option-' + i).next().val();
									if (_answers.isCorrect == 'true') {
										_answers.isCorrect = true;
									}
									if (_answers.isCorrect == 'false') {
										_answers.isCorrect = false;
									}
									if (_answers.text && _answers.text !== null && _answers.text !== null) {
										answersarray.push(_answers);
									}
									if (i === jQuery('.form-datainput input[type=text]').length - 1) {
										service.setQuestion(_qid, _qcategory, _qname, answersarray, {
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
								}
							}
						});

						validator = jQuery(".edit-form").validate({
							rules : {
								quizname : {
									required : true,
								},
								questionnumber : {
									required : true,
								},
								questionname : {
									required : true,
								},
								category : {
									required : true,
								}
							}
						});

					} // Cookie Guider
				};

			}

			return QuestionAssignView;
		}());

	return new QuestionAssignView();
});
