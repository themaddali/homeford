define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var QuestionEditView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var ACTIVEQUIZ;
			var questiontemplate;
			var optiontftemplate;
			var optionmultitemplate;

			function QuestionEditView() {

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
					jQuery('.modal-ol').empty();
					if (ACTIVEQUIZ) {
						service.QuestionsListOnly(ACTIVEQUIZ, {
							success : function(data) {
								if (data.length === 0) {
									jQuery('.noinfo').fadeIn(1000);
								}
								for (var i = 0; i < data.length; i++) {
									jQuery('.noinfo').hide();
									var rowtemplate = questiontemplate.clone();
									jQuery('.question-number', rowtemplate).text('Question # ' + (i + 1));
									jQuery('#question-name', rowtemplate).val(data[i].text);
									if (data[i].answers.length === 2) {
										var optiontemplate = optiontftemplate.clone();
										for (var k = 0; k < 2; k++) {
											if (data[i].answers[k].isCorrect === true) {
												$("select option[value='" + data[i].answers[k].text + "']", optiontemplate).attr("selected", "selected");
											}
										}
										jQuery(rowtemplate).find('ol').append(optiontemplate);
									} else {
										var optiontemplate = optionmultitemplate.clone();
										if (!data[i].answers[1].text) {
											data[i].answers[1].text = "No Question";
										}
										if (!data[i].answers[2].text) {
											data[i].answers[2].text = "No Question";
										}
										if (!data[i].answers[3].text) {
											data[i].answers[3].text = "No Question";
										}
										for (var k = 0; k < 4; k++) {
											jQuery('#multi-option-' + k, optiontemplate).val(data[i].answers[k].text);
											if (data[i].answers[k].isCorrect === true) {
												jQuery('#multi-option-' + k, optiontemplate).next().removeClass('incorrect').addClass('correct');
											}
										}
										jQuery(rowtemplate).find('ol').append(optiontemplate);
									}
									jQuery('.modal-ol').append(rowtemplate);
									if (i == data.length - 1) {
										activateEvents();
									}
								}
							}
						});
					} else {
						router.go('/quizlist');
					}
				}

				function activateEvents() {
					jQuery('.inlinebutton-multi').click(function() {
						if (jQuery(this).hasClass('correct')) {
							jQuery(this).removeClass('correct').addClass('incorrect').val('false');

						} else {
							jQuery(this).removeClass('incorrect').removeClass('error').addClass('correct').val('true');
						}
					});
				}


				this.activeQuiz = function(selected) {
					ACTIVEQUIZ = selected;
				}

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Questions Edit';

				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Questions Edit';

					if (checkForActiveCookie() === true) {
						//Rarely due to network latency if not loaded, just reload
						if (!$.ui) {
							location.reload();
						}
						questiontemplate = jQuery('#question-template').attr('id', '');
						optiontftemplate = jQuery('#option-tf-template').attr('id', '');
						optionmultitemplate = jQuery('#option-multi-template').attr('id', '');
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
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
						}

						jQuery('#question-add').on('click', function() {
							if ($(".edit-form").valid()) {
								var _quizname = jQuery('#quiz-name').val();
								var _qid = jQuery('#quiz-name').attr('quizid');
								var _qcategory = jQuery('input[name=category]:checked').val();
								var optionprefix;
								var count;
								if (_qcategory === '0') {
									optionprefix = 'multi';
									count = jQuery('.form-datainput input[type=text]:visible').length;
								} else if (_qcategory === '1') {
									optionprefix = 'tf';
									//count = jQuery('.form-datainput select').length;
									count = 1;
								}
								if ((count != 1 && jQuery('#category-' + _qcategory).find('.correct').length > 0) || (count == 1)) {
									var _qname = jQuery('#question-name').val();
									var answersarray = [];
									for (var i = 0; i < count; i++) {
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
										if (i === count - 1) {
											service.setQuestion(_qid, _qcategory, _qname, answersarray, {
												success : function(data) {
													if (data.status !== 'error') {
														notify.showNotification('OK', data.message);
														setTimeout(function() {
															jQuery('.inlinebutton-multi').removeClass('error');
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
									jQuery('#category-' + _qcategory).find('.incorrect').addClass('error');
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

			return QuestionEditView;
		}());

	return new QuestionEditView();
});
