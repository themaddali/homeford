//View that will drive the Students list page.

define(['modernizr', 'spin', 'plugins', 'cookie', '../../service/DataService', '../../service/BannerService',  '../../Router', '../../Notify'], function(modernizr, spin, plugins, cookie, service, banner, router, notify) {"use strict";

	var QuizView = ( function() {

			var ACTIVEQUIZ = {};

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

				function populateData() {
					if (!ACTIVEQUIZ.name || ACTIVEQUIZ.name === null || ACTIVEQUIZ.name === "") {
						router.go('/class');
					} else {
						jQuery('.subtitleinfo').text(ACTIVEQUIZ.name);
						$("#progressvalue").html(ACTIVEQUIZ.progress + '%');
						jQuery('#progressslider').slider({
							animate : true,
							range : "min",
							value : ACTIVEQUIZ.progress,
							min : 0,
							max : 100,
							step : 1,
							slide : function(event, ui) {
								$("#progressvalue").html(ui.value + '%');
							}
						});
						if (Modernizr.touch && Modernizr.inputtypes.date) {
							document.getElementById('task-time').type = 'date';
						} else {
							jQuery("#task-time").datepicker({
								minDate : -7
							});
							var date = new Date();
							var today = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
							jQuery("#task-time").val(today);
						}
					}
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
					populateData();
				};

				this.resume = function() {
					jQuery('.edit-notify').hide();
					banner.HideAlert();
					populateData();
				};

				this.init = function() {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					if (checkForActiveCookie() === true) {
						populateData();

						//JQ UI Bug of -Index.
						jQuery('#task-time').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
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
						
						jQuery('.mainlogo').click(function(){
							router.go('/studentlist');
						});
						jQuery('.goback').click(function(){
							router.returnToPrevious();
						});

					} // Cookie Guider

				};

			}

			return QuizView;
		}());

	return new QuizView();
});
