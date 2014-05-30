define(['modernizr', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify', 'popup'], function(modernizr, cookie, service, banner, router, notify, popup) {"use strict";

	var ToDoGroundView = ( function() {

			var ACTIVEQUIZ = {};

			/**
			 * Constructor
			 */
			function ToDoGroundView() {

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
						jQuery('.helper').removeAttr("href");
						jQuery('.helperboard').hide();
						jQuery('#init-helper').css('display', 'inline');
						jQuery('.subtitleinfo').text(ACTIVEQUIZ.name);
						jQuery('.subtitleinfo-2').text(ACTIVEQUIZ.membername);
						if (isNaN(daystogo(ACTIVEQUIZ.dueby))) {
							jQuery('.metainfo').text('Due immediately!');
						} else {
							jQuery('.metainfo').text(daystogo(ACTIVEQUIZ.dueby) + ' day(s) to go');
						}
						$("#progressvalue").html(ACTIVEQUIZ.progress + '%');
						$("#task-desc-data").html(ACTIVEQUIZ.desc.replace(/\r?\n/g, '<br/>'));
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
								jQuery('.ui-slider-range').removeClass("beginning middle end").addClass(ui.value < 31 ? "beginning" : ui.value < 71 ? "middle" : "end");
							}
						});
						jQuery('.ui-slider-handle').focus();
						jQuery('.ui-slider-range').removeClass("beginning middle end").addClass(ACTIVEQUIZ.progress < 31 ? "beginning" : ACTIVEQUIZ.progress < 71 ? "middle" : "end");
						jQuery('.helper-email').parent().parent().fadeIn();
						if (ACTIVEQUIZ.url && ACTIVEQUIZ.url.length > 4) {
							jQuery('.helper-url').attr('href', ACTIVEQUIZ.url);
							jQuery('.helper-url').parent().parent().fadeIn();
						}
						if (ACTIVEQUIZ.youtube && ACTIVEQUIZ.youtube.length > 4) {
							var fulllink = "http://www.youtube.com/watch?v=" + ACTIVEQUIZ.youtube + "?modestbranding=1&autoplay=1&cc_load_policy=1&controls=0&rel=0";
							jQuery('.helper-youtube').attr('href', fulllink);
							jQuery('.helper-youtube').parent().parent().fadeIn();
						}
						// if (Modernizr.touch && Modernizr.inputtypes.date) {
						// document.getElementById('task-time').type = 'date';
						// } else {
						// jQuery("#task-time").datepicker({
						// dateFormat : 'yy-mm-dd',
						// minDate : -7
						// });
						// var date = new Date();
						// var today = date.getFullYear()+'-'+(date.getMonth() + 1)+'-'+date.getDate();
						// jQuery("#task-time").val(today);
						// }
					}
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						jQuery('#loggedin-user').text(jQuery.cookie('user'));
						banner.setBrand();
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
					banner.HideUser();
					populateData();
					document.title = 'Zingoare | ToDo Ground';
					if (notify.getNewNotificationsCount() > 0) {
						jQuery('#alert-value').text(notify.getNewNotificationsCount());
					} else {
						jQuery('#alert-value').text('');
					}
				};

				this.init = function() {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | ToDo Ground';
					if (checkForActiveCookie() === true) {
						if (!$.ui) {
							location.reload();
						}
						populateData();
						helperMediaQuiries();
						if (notify.getNewNotificationsCount() > 0) {
							jQuery('#alert-value').text(notify.getNewNotificationsCount());
						}
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

			return ToDoGroundView;
		}());

	return new ToDoGroundView();
});
