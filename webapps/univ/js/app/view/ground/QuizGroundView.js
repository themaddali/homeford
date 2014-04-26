define(['modernizr', 'cookie', 'ellipsis', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify', 'popup'], function(modernizr, cookie, ellipsis, service, banner, router, notify, popup) {"use strict";

	var QuizGroundVIew = ( function() {

			var CORRECT = '<i  class="icon-ok-sign  icon-1x "></i>';
			var INCORRECT = '<i class="icon-remove-sign  icon-1x "></i>';
			var UNANSWERED = '<i class="icon-question-sign  icon-1x "></i>';
			var ACTIVEQUIZ = {};
			var quizboardtemplate;

			function QuizGroundVIew() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				function populateData() {
					// if (!ACTIVEQUIZ.name || ACTIVEQUIZ.name === null || ACTIVEQUIZ.name === "") {
					// //router.go('/class');
					// } else {
					jQuery('#action-canvas').empty();
					service.QuestionsList(20, {
						success : function(data) {
							jQuery('.helper').removeAttr("href");
							jQuery('.helperboard').hide();
							for (var i = 0; i < data.length; i++) {
								jQuery('.metainfo').text(data.length + ' Questions');
								var quizboard = quizboardtemplate.clone();
								jQuery('.question-number-content', quizboard).text('Question # ' + (i + 1));
								jQuery('.question-number', quizboard).append(UNANSWERED);
								jQuery('.question', quizboard).text(data[i].text);
								if (jQuery('.question', quizboard).text().length > 90) {
									var newqstn = jQuery('.question', quizboard).text().substring(0, 87);
									jQuery('.question', quizboard).text(newqstn + ' ...');
								}
								for (var j = 0; j < data[i].answers.length; j++) {
									if (data[i].answers.length === 1) {
										jQuery('.row-2', quizboard).hide();
										if (data[i].answers[j].text === 'True') {
											jQuery('.option-1', quizboard).val('False').attr('isCorrect', 'false');
										} else {
											jQuery('.option-1', quizboard).val('True').attr('isCorrect', 'true');
										}
									} else if (data[i].answers.length == 2) {
										jQuery('.row-2', quizboard).hide();
									} else {
										jQuery('.row-2', quizboard).show();
									}
									jQuery('.option-' + j, quizboard).val(data[i].answers[j].text).attr('isCorrect', data[i].answers[j].isCorrect);
								}
								jQuery('#action-canvas').append(quizboard);
								if (i == data.length - 1) {
									helperMediaQuiries();
									activateCardEvents();
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
						jQuery(this).parent().parent().find('input').attr('disabled','disabled');
						if (jQuery(this).attr('isCorrect') === 'true') {
							//jQuery(this).css('background-color', 'green');
							jQuery(this).parent().parent().parent().addClass('answered answered-correct');
							jQuery(this).parent().parent().parent().find('.icon-1x').removeClass('icon-question-sign').addClass('icon-ok-sign');
							jQuery(this).parent().parent().find('.responseinfo').text('You selected: '+ jQuery(this).val() + '. Correct Answer: '+jQuery(this).attr('isCorrect'));

						} else {
							//jQuery(this).css('background-color', 'red');
							jQuery(this).parent().parent().parent().addClass('answered answered-incorrect');
							jQuery(this).parent().parent().parent().find('.icon-1x').removeClass('icon-question-sign').addClass('icon-remove-sign');
							jQuery(this).parent().parent().find('.responseinfo').text('You selected: '+ jQuery(this).val() + '. Correct Answer: '+jQuery(this).attr('isCorrect'));
						}
						setTimeout(function() {
							jQuery('.quizactionboard').removeClass('cardinactive');
							jQuery('.quizactionboard').removeClass('cardactive');
						}, 2000);
					})
				}

				function processOptionSelect() {

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
						var width = $('#action-canvas').width() - 30;
						var rowholds = Math.floor(width / 204);
						var fillerspace = width - (rowholds * 204);
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
					populateData();
				};

				this.init = function() {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					if (checkForActiveCookie() === true) {
						if (!$.ui) {
							location.reload();
						}
						quizboardtemplate = jQuery('#quizboard-template').remove().attr('id', '');
						populateData();

						$(window).resize(helperMediaQuiries);

						//JQ UI Bug of -Index.
						jQuery('#task-time').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
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
