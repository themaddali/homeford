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
					jQuery('input[type=text]').val('');
					jQuery('#question-category').prop('checked', true);
					jQuery('#category-0').fadeOut();
					jQuery('#category-1').fadeIn();
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
				};

				this.pause = function() {

				};

				this.resume = function() {
					validator.resetForm();
					jQuery('.edit-notify').hide();
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

							} else {
								jQuery(this).removeClass('incorrect').removeClass('error').addClass('correct').val('true');
							}
						});

						jQuery("input[name=category][type=radio]").change(function() {
							if (jQuery('input[name=category]:checked').val() === '0') {
								jQuery('#category-0').fadeIn();
								jQuery('#category-1').fadeOut();
							} else {
								jQuery('#category-0').fadeOut();
								jQuery('#category-1').fadeIn();
							}
						});

						jQuery('.inlinebutton-add').click(function() {
							jQuery(this).parent().parent().parent().append(optiontemplate);
							jQuery(this).next().hide();
							jQuery(this).hide();
						});

						$.validator.prototype.checkForm = function() {
							//overriden in a specific page
							this.prepareForm();
							for (var i = 0, elements = (this.currentElements = this.elements()); elements[i]; i++) {
								if (this.findByName(elements[i].name).length != undefined && this.findByName(elements[i].name).length > 1) {
									for (var cnt = 0; cnt < this.findByName(elements[i].name).length; cnt++) {
										this.check(this.findByName(elements[i].name)[cnt]);
									}
								} else {
									this.check(elements[i]);
								}
							}
							return this.valid();
						};

						jQuery('#question-add').on('click', function() {
							if ($(".edit-form").valid()) {
								var _quizname = jQuery('#quiz-name').val();
								var _qid = jQuery('#quiz-name').attr('quizid');
								if (!_qid) {
									_qid = 4;
								}
								var _qcategory = jQuery('input[name=category]:checked').val();
								var optionprefix;
								if (_qcategory === '0') {
									optionprefix = 'multi';
								} else if (_qcategory === '1') {
									optionprefix = 'tf';
								}
								var _qname = jQuery('#question-name').val();
								var answersarray = [];
								for (var i = 0; i < jQuery('.form-datainput input[type=text]:visible').length; i++) {
									var _answers = {};
									_answers.text = jQuery('#' + optionprefix + '-option-' + i).val();
									_answers.isCorrect = jQuery('#' + optionprefix + '-option-' + i).next().val();
									if (_answers.isCorrect == 'true') {
										_answers.isCorrect = true;
									}
									if (_answers.isCorrect == 'false') {
										_answers.isCorrect = false;
									}
									if (_answers.text && _answers.text !== null && _answers.text !== null) {
										answersarray.push(_answers);
									}
									if (i === jQuery('.form-datainput input[type=text]:visible').length - 1) {
										service.setQuestion(_qid, _qcategory, _qname, answersarray, {
											success : function(data) {
												if (data.status !== 'error') {
													notify.showNotification('OK', data.message);
													setTimeout(function() {
														jQuery('.option-input').val('');
														jQuery('#question-name').focus();
													}, 2000);
												} else {
													notify.showNotification('ERROR', data.message);
													setTimeout(function() {
														jQuery('#question-name').focus();
													}, 2000);
												}
											}
										});
									}
								}
							} else {
								//In Most cases, we reach here because of the hidden fields. :(
								var _quizname = jQuery('#quiz-name').val();
								var _qid = jQuery('#quiz-name').attr('quizid');
								if (!_qid) {
									_qid = 4;
								}
								var _qcategory = jQuery('input[name=category]:checked').val();
								var optionprefix;
								if (_qcategory === '0') {
									optionprefix = 'multi';
								} else if (_qcategory === '1') {
									optionprefix = 'tf';
								}
								var errorsSelector = '#category-' + _qcategory + " input.error";
								var visibleErrors = $(errorsSelector).length;
								if (jQuery('#quiz-name').hasClass('error')) {
									visibleErrors = visibleErrors + 1;
								}
								if (jQuery('#question-name').hasClass('error')) {
									visibleErrors = visibleErrors + 1;
								}
								if (jQuery('#category-' + _qcategory).find('.correct').length === 0) {
									visibleErrors = visibleErrors + 1;
									jQuery('#category-' + _qcategory).find('.incorrect').addClass('error');
								}
								if (visibleErrors === 0) {
									var _qname = jQuery('#question-name').val();
									var answersarray = [];
									for (var i = 0; i < jQuery('.form-datainput input[type=text]:visible').length; i++) {
										var _answers = {};
										_answers.text = jQuery('#' + optionprefix + '-option-' + i).val();
										_answers.isCorrect = jQuery('#' + optionprefix + '-option-' + i).next().val();
										if (_answers.isCorrect == 'true') {
											_answers.isCorrect = true;
										}
										if (_answers.isCorrect == 'false') {
											_answers.isCorrect = false;
										}
										if (_answers.text && _answers.text !== null && _answers.text !== null) {
											answersarray.push(_answers);
										}
										if (i === jQuery('.form-datainput input[type=text]:visible').length - 1) {
											service.setQuestion(_qid, _qcategory, _qname, answersarray, {
												success : function(data) {
													if (data.status !== 'error') {
														notify.showNotification('OK', data.message);
														setTimeout(function() {
															jQuery('.option-input').val('');
															jQuery('#question-name').focus();
														}, 2000);
													} else {
														notify.showNotification('ERROR', data.message);
														setTimeout(function() {
															jQuery('#question-name').focus();
														}, 2000);
													}
												}
											});
										}
									}
								}
							}
						});

						validator = jQuery(".edit-form").validate({
							ignore : ".ignore, :hidden",
							rules : {
								quizname : {
									required : true,
								},
								questionname : {
									required : true,
								},
								category : {
									required : true,
								},
								options : {
									required : true
								}
							},
						});

					} // Cookie Guider
				};

			}

			return QuestionAssignView;
		}());

	return new QuestionAssignView();
});
