//View that will drive the Students list page.

define(['modernizr', 'spin', 'plugins', 'cookie', '../../service/DataService', '../../Router'], function(modernizr, spin, plugins, cookie, service, router) {"use strict";

	var QuizView = ( function() {

			var ACTIVEQUIZ;

			/**
			 * Constructor
			 */
			function QuizView() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

				// setTimeout(function() {
				// setNotification('Whats going on?', 'Venkat');
				// }, 10000);
				// //10seconds
				//
				// setInterval(function() {
				// setNotification('Are you done with this bro?', 'Venkat');
				// }, 500000);

				function setNotification(message, sender) {
					$('#chat-module').addClass('notify');
					$('#chatnav').addClass('active');
					$('#chat-input').val(sender + ' says : ' + message);
					$('#chat-input').attr('readonly', 'readonly');
					$('#chat-send').val('dismiss');
				}

				function quizChange(currentquiz, progress, newquiz) {
					// Accept the current info and progress
					// Push it to DB
					// Adjust the cookies.
					jQuery.cookie('quiz', newquiz, {
						path : '/',
						expires : 100
					});
					QUIZ = newquiz;
					jQuery('#quiz-option-active').text(jQuery.cookie('quiz'));
					generateQuiz();
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						jQuery('#loggedin-user').text(jQuery.cookie('user'));
						return true;
					} else {
						router.go('/home', '/quiz');
						return false;
					}
				}


				this.activeTask = function(selectedinput) {
					ACTIVEQUIZ = selectedinput;
				}

				this.pause = function() {

				};

				this.resume = function() {
					showBG();
					jQuery('.subtitleinfo').text(ACTIVEQUIZ);
				};

				this.init = function() {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					if (checkForActiveCookie() === true) {
						jQuery('.subtitleinfo').text(ACTIVEQUIZ);
						jQuery('#progressslider').slider({
							animate : true,
							range : "min",
							value : 0,
							min : 0,
							max : 100,
							step : 1,
							slide : function(event, ui) {
								$("#progressvalue").html(ui.value+'%');
							}
						});

						//Rich Experience First.... Load BG
						//showBG();
						//Get the active student info and create the panels.
						//populateAvailableQuizs();
					} // Cookie Guider

				};

			}

			return QuizView;
		}());

	return new QuizView();
});
