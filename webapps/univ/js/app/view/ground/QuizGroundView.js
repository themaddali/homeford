define(['modernizr', 'cookie', 'ellipsis', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify', 'popup', '../../view/certificate/CertificateView'], function(modernizr, cookie, ellipsis, service, banner, router, notify, popup, certificate) {"use strict";

	var QuizGroundVIew = ( function() {

			var CORRECT = '<i  class="icon-ok-sign  icon-1x "></i>';
			var INCORRECT = '<i class="icon-remove-sign  icon-1x "></i>';
			var UNANSWERED = '<i class="icon-question-sign  icon-1x "></i>';
			var ACTIVEQUIZ = {};
			var _TOTALQ = 0;
			var _TOTALPENDING = 0;
			var _TOTALFAIL = 0;
			var _TOTALPASS = 0;
			var _TOTALPERCENTAGE = 0;
			var quizboardtemplate;

			function QuizGroundVIew() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				function populateData() {
					if (!ACTIVEQUIZ.name || ACTIVEQUIZ.name === null || ACTIVEQUIZ.name === "") {
						router.go('/class');
					} else {
						_TOTALQ = 0;
						_TOTALFAIL = 0;
						_TOTALPASS = 0;
						jQuery('#certificate-link').hide();
						jQuery('.subtitleinfo').text(ACTIVEQUIZ.name);
						jQuery('.subtitleinfo-2').text(ACTIVEQUIZ.membername);
						if (isNaN(daystogo(ACTIVEQUIZ.dueby))) {
							jQuery('.metainfo').text('Due immediately!');
						} else {
							jQuery('.metainfo').text(daystogo(ACTIVEQUIZ.dueby) + ' day(s) to go');
						}
						jQuery('#action-canvas').empty();
						service.QuestionsList(ACTIVEQUIZ.id, {
							success : function(data) {
								jQuery('.helper').removeAttr("href");
								jQuery('.helperboard').hide();
								for (var i = 0; i < data.length; i++) {
									if (data[i].id > 0) {
										_TOTALQ = data.length - 1;
										_TOTALPENDING = data.length - 1;
										scoreCardUpdate('total');
										var quizboard = quizboardtemplate.clone();
										jQuery('.question-number-content', quizboard).text('Question # ' + (i + 1));
										jQuery('.question-number', quizboard).append(UNANSWERED);
										jQuery('.question', quizboard).text(data[i].text);
										jQuery('.question', quizboard).attr('questionid', data[i].id);
										if (jQuery('.question', quizboard).text().length > 90) {
											var newqstn = jQuery('.question', quizboard).text().substring(0, 87);
											jQuery('.question', quizboard).text(newqstn + ' ...');
										}
										for (var j = 0; j < data[i].answers.length; j++) {
											if (data[i].answers.length === 2) {
												jQuery('.row-2', quizboard).hide();
												if (data[i].answers[0].text === 'True') {
													jQuery('.option-0', quizboard).val('True').attr('isCorrect', 'true').attr('answerid', data[i].answers[0].id);
													jQuery('.option-1', quizboard).val('False').attr('isCorrect', 'false').attr('answerid', data[i].answers[1].id);
												} else {
													jQuery('.option-0', quizboard).val('True').attr('isCorrect', 'false').attr('answerid', data[i].answers[1].id);
													jQuery('.option-1', quizboard).val('False').attr('isCorrect', 'true').attr('answerid', data[i].answers[0].id);
												}
											} else {
												jQuery('.row-2', quizboard).show();
												jQuery('.option-' + j, quizboard).val(data[i].answers[j].text).attr('isCorrect', data[i].answers[j].isCorrect).attr('answerid', data[i].answers[j].id);
											}
										}
										jQuery('#action-canvas').append(quizboard);
										if (i == data.length - 2) {
											helperMediaQuiries();
											activateCardEvents();
										}
									} else {
										//These are the selected answers from DB
										if (data[i].questionresults.length > 0) {
											for (var k = 0; k < data[i].questionresults.length; k++) {
												if ("true" === jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options > div').find('.option-choice[answerid="' + data[i].questionresults[k].answerId + '"]').attr('iscorrect')) {
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().addClass('answered answered-correct');
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.icon-1x').removeClass('icon-question-sign').addClass('icon-ok-sign');
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options input').attr('disabled', 'disabled');
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.responseinfo').text('You selected : ' + jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options > div').find('.option-choice[answerid="' + data[i].questionresults[k].answerId + '"]').val() + '. Correct Answer : ' + jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options > div').find('input[iscorrect="true"]').val());
													//'You selected: ' + jQuery(this).val() + '. Correct Answer: ' + jQuery(this).parent().parent().find('input[iscorrect="true"]').val());
													scoreCardUpdate('pass');
												} else {
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().addClass('answered answered-incorrect');
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.icon-1x').removeClass('icon-question-sign').addClass('icon-remove-sign');
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options input').attr('disabled', 'disabled');
													jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.responseinfo').text('You selected : ' + jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options > div').find('.option-choice[answerid="' + data[i].questionresults[k].answerId + '"]').val() + '. Correct Answer : ' + jQuery('.quizactionboard .question[questionid="' + data[i].questionresults[k].questionId + '"]').parent().find('.options > div').find('input[iscorrect="true"]').val());
													scoreCardUpdate('fail');
												}
											}
										}
									}
								}
							}
						});

						//jQuery('.helper-email').parent().parent().fadeIn();
						if (ACTIVEQUIZ.url && ACTIVEQUIZ.url.length > 4) {
							jQuery('.helper-url').attr('href', ACTIVEQUIZ.url);
							jQuery('.helper-url').parent().parent().fadeIn();
						}
						if (ACTIVEQUIZ.youtube && ACTIVEQUIZ.youtube.length > 4) {
							var fulllink = "http://www.youtube.com/watch?v=" + ACTIVEQUIZ.youtube + "?modestbranding=1&autoplay=1&cc_load_policy=1&controls=0&rel=0";
							jQuery('.helper-youtube').attr('href', fulllink);
							jQuery('.helper-youtube').parent().parent().fadeIn();
						}
					}
				}

				function scoreCardUpdate(resulttype) {
					if (resulttype == 'total') {
						jQuery('.question-span').text(_TOTALQ);
						jQuery('.percentage-span').text('0%');
						jQuery('.ok-span').text('0');
						jQuery('.error-span').text('0');
					}
					if (resulttype == 'pass') {
						_TOTALPASS = _TOTALPASS + 1;
						jQuery('.ok-span').text(_TOTALPASS);
						_TOTALPENDING = _TOTALPENDING - 1;
						jQuery('.question-span').text(_TOTALPENDING);
						_TOTALPERCENTAGE = Math.ceil(_TOTALPASS / (_TOTALQ - _TOTALPENDING) * 100) + '%';
						jQuery('.percentage-span').text(_TOTALPERCENTAGE);
					}
					if (resulttype == 'fail') {
						_TOTALFAIL = _TOTALFAIL + 1;
						jQuery('.error-span').text(_TOTALFAIL);
						_TOTALPENDING = _TOTALPENDING - 1;
						jQuery('.question-span').text(_TOTALPENDING);
						_TOTALPERCENTAGE = Math.ceil(_TOTALPASS / (_TOTALQ - _TOTALPENDING) * 100) + '%';
						jQuery('.percentage-span').text(_TOTALPERCENTAGE);
					}
					if (_TOTALPENDING === 0) {
						if ($('#action-canvas').width() > 500) {
							jQuery('#certificate-link').show();
						}
					}
				}

				function showCertificate() {
					if (_TOTALPENDING === 0) {
						var databoject = {
							'toname' : 'Your Name Here',
							'quizname' : 'This',
							'percentage' : '100%',
						};
						databoject.toname = ACTIVEQUIZ.membername;
						databoject.quizname = ACTIVEQUIZ.name;
						databoject.percentage = _TOTALPERCENTAGE
						certificate.setData(databoject);
						router.go('/certificate');
					} else {
						alert('Certificate is available only after you complete the Quiz!');
					}
				}

				function activateCardEvents() {
					jQuery('.question').click(function() {
						if (!jQuery(this).parent().hasClass('cardactive')) {
							jQuery('.quizactionboard').removeClass('cardactive');
							jQuery('.quizactionboard').addClass('cardinactive');
							var cardlocation = jQuery(this).offset();
							$('.main-content').animate({
								scrollTop : cardlocation.top
							}, 1000);
							jQuery(this).parent().removeClass('cardinactive').addClass('cardactive');
							helperMediaQuiries();
							//startCounter();
						}
					});

					jQuery('.close-activecard').click(function(e) {
						jQuery('.quizactionboard').removeClass('cardinactive');
						jQuery('.quizactionboard').removeClass('cardactive');
					});

					jQuery('.option-choice').click(function() {
						jQuery(this).parent().parent().find('input').attr('disabled', 'disabled');
						if (jQuery(this).attr('isCorrect') === 'true') {
							//jQuery(this).css('background-color', 'green');
							jQuery(this).parent().parent().parent().addClass('answered answered-correct');
							jQuery(this).parent().parent().parent().find('.icon-1x').removeClass('icon-question-sign').addClass('icon-ok-sign');
							jQuery(this).parent().parent().find('.responseinfo').text('You selected: ' + jQuery(this).val() + '. Correct Answer: ' + jQuery(this).parent().parent().find('input[iscorrect="true"]').val());
							scoreCardUpdate('pass');

						} else {
							//jQuery(this).css('background-color', 'red');
							jQuery(this).parent().parent().parent().addClass('answered answered-incorrect');
							jQuery(this).parent().parent().parent().find('.icon-1x').removeClass('icon-question-sign').addClass('icon-remove-sign');
							jQuery(this).parent().parent().find('.responseinfo').text('You selected: ' + jQuery(this).val() + '. Correct Answer: ' + jQuery(this).parent().parent().find('input[iscorrect="true"]').val());
							scoreCardUpdate('fail');
						}
						service.QuizProgressSave(ACTIVEQUIZ.id, jQuery(this).parent().parent().parent().find('.question').attr('questionid'), jQuery(this).attr('answerid'), {
							success : function(data) {
								var _commentstext = [];
								var comments = {};
								comments.text = jQuery('.cards-header-right').text();
								_commentstext.push(comments);
								service.updateToDo(ACTIVEQUIZ.id, Math.ceil(((_TOTALQ - _TOTALPENDING) / _TOTALQ) * 100), 'Time Now', _commentstext, {
									success : function(data) {
										if (data.status == 'success') {
											//Progress saving as and when needed!
											notify.showNotification('OK',  ' Answered Question in Quiz: '+ ACTIVEQUIZ.name);
											jQuery('#alert-value').text(notify.getNewNotificationsCount());
										}
									}
								});
							}
						});
						setTimeout(function() {
							jQuery('.quizactionboard').removeClass('cardinactive');
							jQuery('.quizactionboard').removeClass('cardactive');
						}, 2000);
					})
				}

				function startCounter() {
					var time = 0;
					var interval = setInterval(function() {
						var minutes = time / 60;
						minutes = Math.floor(minutes);
						if (minutes < 10)
							minutes = "0" + minutes;
						var seconds = time % 60;
						if (seconds < 10)
							seconds = "0" + seconds;
						var text = minutes + ':' + seconds;
						jQuery('.timeelapsed').text(text);
						time++;
					}, 1000);
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						jQuery('#loggedin-user').text(jQuery.cookie('user'));
						banner.setBrand();
						return true;
					} else {
						router.go('/home');
						return false;
					}
				}

				function daystogo(duedate) {
					var oneDay = 24 * 60 * 60 * 1000;
					var firstDate = new Date();
					var secondDate = new Date(duedate);
					var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
					return diffDays;
				}

				function helperMediaQuiries() {
					if ($('.quizactionboard').length > 4) {
						var width = $('#action-canvas').width() - 40;
						var rowholds = Math.floor(width / 252);
						var fillerspace = width - (rowholds * 252);
						var newmargin = fillerspace / rowholds;
						if (newmargin < 10) {
							newmargin = 10;
						}
						$('.quizactionboard').css('margin-left', newmargin / 2);
						$('.quizactionboard').css('margin-right', newmargin / 2);
					}
				}


				this.activeTask = function(selectedinput) {
					ACTIVEQUIZ = selectedinput;
				}

				this.pause = function() {
					populateData();
				};

				this.resume = function() {
					jQuery('.edit-notify').hide();
					banner.HideAlert();
					banner.HideUser();
					banner.setBrand();
					populateData();
					document.title = 'Zingoare | Quiz Ground';
					if (notify.getNewNotificationsCount() > 0) {
						jQuery('#alert-value').text(notify.getNewNotificationsCount());
					} else {
						jQuery('#alert-value').text('');
					}
				};

				this.init = function() {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Quiz Ground';
					if (checkForActiveCookie() === true) {
						if (!$.ui) {
							location.reload();
						}
						quizboardtemplate = jQuery('#quizboard-template').remove().attr('id', '');
						populateData();
						if (notify.getNewNotificationsCount() > 0) {
							jQuery('#alert-value').text(notify.getNewNotificationsCount());
						}

						$(window).resize(helperMediaQuiries);

						//JQ UI Bug of -Index.
						jQuery('#task-time').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});

						jQuery('.cards-header-right').click(function() {
							showCertificate();
						});

						jQuery('#updatetodo').click(function() {
							var _newprogress = jQuery('#progressvalue').text().split('%')[0];
							_newprogress = parseInt(_newprogress);
							var _timestamp = jQuery('#task-time').val();
							if (_timestamp === '' || _timestamp === ' ') {
								var _timestamp = jQuery('#task-time').text();
							}
							var _commentstext = [];
							var comments = {};
							comments.text = jQuery('#task-desc').val();
							_commentstext.push(comments);
							service.updateToDo(ACTIVEQUIZ.id, _newprogress, _timestamp, _commentstext, {
								success : function(data) {
									if (data.status == 'success') {
										notify.showNotification('OK', 'Task #' + ACTIVEQUIZ.id + ' Updated');
										jQuery('#alert-value').text(notify.getNewNotificationsCount());
										router.go('/class');
									}
								}
							});
						});

						jQuery('#todo-assign-form').mousemove(function() {
							jQuery('#init-helper').hide();
							jQuery('#init-helper').css('display', '');
						});

						$('.helper-youtube').magnificPopup({
							type : 'iframe',
							mainClass : 'mfp-img-mobile',
						});

						$('.helper-url').magnificPopup({
							type : 'iframe',
							mainClass : 'mfp-img-mobile',
						});

						$('.helper-facebook').magnificPopup({
							type : 'iframe',
							mainClass : 'mfp-img-mobile',
						});

						jQuery('#user-name').on('click', function(e) {
							banner.ShowUser();
							jQuery('#signout').on('click', function(e) {
								banner.logout();
							});
							jQuery('#banner-dashboard').on('click', function(e) {
								banner.HideUser();
								router.go('/admin');
							});
							jQuery('.userflyout').mouseleave(function() {
								setTimeout(function() {
									banner.HideUser();
								}, 500);
							});
						});
						jQuery('#alert').on('click', function(e) {
							banner.ShowAlert();
							jQuery('.alertflyout').mouseleave(function() {
								setTimeout(function() {
									banner.HideAlert();
								}, 500);
							});
							jQuery('.flyout-label').text(notify.getNotifications().length + ' Notifications');
						});

						jQuery('.mainlogo').click(function() {
							router.go('/studentlist');
						});
						jQuery('.subtitleinfo-2').click(function() {
							router.go('/class');
						});
						jQuery('.brandnames').change(function() {
							banner.updateBrand(jQuery('.brandnames').val());
						});
						jQuery('.subtitleinfo-3').click(function() {
							router.go('/studentlist');
						});

						jQuery('.goback').click(function() {
							router.returnToPrevious();
						});

					} // Cookie Guider

				};

			}

			return QuizGroundVIew;
		}());

	return new QuizGroundVIew();
});
