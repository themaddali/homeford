define(['modernizr', 'plugins', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify', 'popup'], function( modernizr, plugins, cookie, service, banner, router, notify, popup) {"use strict";

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
						jQuery('#init-helper').css('display', 'inline');
						jQuery('.subtitleinfo').text(ACTIVEQUIZ.name);
						jQuery('.metainfo').text(daystogo(ACTIVEQUIZ.dueby) + ' days to go');
						$("#progressvalue").html(ACTIVEQUIZ.progress + '%');
						$("#task-desc-data").text(ACTIVEQUIZ.desc);
						$("#task-priority").text(ACTIVEQUIZ.priority);
						jQuery('#progressslider').slider({
							animate : true,
							range : "min",
							value : ACTIVEQUIZ.progress,
							min : 0,
							max : 100,
							step : 1,
							slide : function(event, ui) {
								$("#progressvalue").html(ui.value + '%');
								jQuery('.ui-slider-range').removeClass("beginning middle").addClass(ui.value < 31 ? "beginning" : ui.value < 71 ? "middle" : "");
							}
						});
						jQuery('.ui-slider-handle').focus();
						jQuery('.ui-slider-range').removeClass("beginning middle").addClass(ACTIVEQUIZ.progress < 31 ? "beginning" : ACTIVEQUIZ.progress < 71 ? "middle" : "");
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

				function daystogo(duedate) {
					var oneDay = 24 * 60 * 60 * 1000;
					// hours*minutes*seconds*milliseconds
					var firstDate = new Date();
					var secondDate = new Date(duedate);
					var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime()) / (oneDay)));
					return diffDays;
				}

				function helperMediaQuiries() {
					var width = $(window).width();
					var height = $(window).height();
					if (width < 700 && width > 481) {
						jQuery('.help-icon').removeClass('icon-3x').removeClass('icon-1x').addClass('icon-2x');
						jQuery('.helpers').removeClass('medium').removeClass('small').addClass('medium');
						jQuery('.main-content').removeClass('medium').removeClass('small').addClass('medium');
					} else if (width <= 481) {
						jQuery('.help-icon').removeClass('icon-2x').removeClass('icon-3x').addClass('icon-2x');
						jQuery('.helpers').removeClass('medium').removeClass('small').addClass('small');
						jQuery('.main-content').removeClass('medium').removeClass('small').addClass('small');
					} else {
						jQuery('.help-icon').removeClass('icon-2x').removeClass('icon-1x').addClass('icon-3x');
						jQuery('.helpers').removeClass('medium').removeClass('small');
						jQuery('.main-content').removeClass('medium');
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
						helperMediaQuiries();

						//JQ UI Bug of -Index.
						jQuery('#task-time').focus(function() {
							setTimeout(function() {
								jQuery('#ui-datepicker-div').css('background-color', 'white');
								jQuery('#ui-datepicker-div').css('z-index', '200');
							}, 100);
						});

						$(document).ready(helperMediaQuiries);
						// When the page first loads
						$(window).resize(helperMediaQuiries);
						// When the browser changes size

						jQuery('#updatetodo').click(function() {
							var _newprogress = jQuery('#progressvalue').text().split('%')[0];
							_newprogress = parseInt(_newprogress);
							var _timestamp = jQuery('#task-time').val();
							var _commentstext = [];
							var comments = {};
							comments.text = jQuery('#task-desc').val();
							_commentstext.push(comments);
							service.updateToDo(ACTIVEQUIZ.id, _newprogress, _timestamp, _commentstext, {
								success : function(data) {
									if (data.status == 'success') {
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
						jQuery('.goback').click(function() {
							router.returnToPrevious();
						});

					} // Cookie Guider

				};

			}

			return QuizView;
		}());

	return new QuizView();
});
