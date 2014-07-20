define(['../app/Router', 'cookie', 'timeago', '../app/service/DataService', 'jqueryui'], function(router, cookie, timeago, service, jqueryui) {"use strict";

	var Notify = ( function() {

			/**
			 * Constructor
			 */
			var STATUS;
			var MESSAGE;
			var PAGE;
			var ERROR = '<i style="padding:0px 10px" class="icon-exclamation icon-1x "></i>';
			var OK = '<i style="padding:0px 10px" class="icon-check icon-1x "></i>';
			var WARN = '<i style="padding:0px 10px" class="icon-exclamation icon-1x "></i>';
			var INFO = '<i style="padding:0px 10px" class="icon-bell-alt icon-1x "></i>';
			var NOTIFICATION_new = 0;
			var NOTIFICATIONS = [];

			function Notify() {

				function showNotification(status, message, toroute, duration) {
					var _notification = {};
					_notification.title = message;
					_notification.status = status;
					_notification.timestamp = new Date().toISOString();
					_notification.keyword = '';
					NOTIFICATION_new = NOTIFICATION_new + 1;
					NOTIFICATIONS.push(_notification);
					jQuery('div.edit-notify').remove();
					if (!duration) {
						duration = 1000;
						///defaulting to 1 seconds
					}
					if (jQuery.find('.modal-body')) {
						var CLASS = "edit-notify " + status;
						var notification = '<div class="' + CLASS + '">' + OK + '<span class="notify-message">' + message + '</span></div>';
						jQuery('.modal_close').fadeOut();
						if (status === 'ERROR') {
							var notification = '<div class="' + CLASS + '">' + ERROR + '<span class="notify-message">' + message + '</span></div>';
							duration = 1000000;
							//1000 seconds
							jQuery('.modal_close').fadeIn();
						} else if (status === 'WARN') {
							var notification = '<div class="' + CLASS + '">' + WARN + '<span class="notify-message">' + message + '</span></div>';
							duration = 20000;
							//20 seconds
							jQuery('.modal_close').fadeIn();
						}
						jQuery('.modal-container').append(notification);
						jQuery('.edit-notify').slideDown(1000);
						setTimeout(function() {
							jQuery('.edit-notify').slideUp(1000);
							jQuery('.modal_close').fadeIn();
							if (toroute) {
								router.go('/' + toroute, "/home");
							}
						}, duration);
						//5 Seconds is enough to catch attention
					}
				}

				function showMessage(status, message, fullmessage, keyword, toroute, duration) {
					jQuery('div.edit-notify').remove();
					jQuery('.page').append('<audio id="notifyAudio"><source src="media/notify.ogg" type="audio/ogg"><source src="media/notify.mp3" type="audio/mpeg"><source src="media/notify.wav" type="audio/wav"></audio>');
					if (!duration) {
						duration = 5000;
						///defaulting to 5 seconds
					}
					if (jQuery.find('#project-nav')) {
						var CLASS = "edit-notify " + status;
						var notification = '<div style="padding: 11px; text-align: center" class="' + CLASS + '"><a href="#/notifications">' + OK + '<span style="cursor: pointer" class="notify-message">' + message + '</span></a></div>';
						if (status === 'ERROR') {
							var notification = '<div style="padding: 11px; text-align: center" class="' + CLASS + '"><a href="#/notifications">' + ERROR + '<span style="cursor: pointer" class="notify-message">' + message + '</span></a></div>';
						} else if (status === 'INFO') {
							var notification = '<div style="padding: 11px; text-align: center" class="' + CLASS + '"><a href="#/notifications">' + INFO + '<span style="cursor: pointer" class="notify-message">' + message + '</span></a></div>';
						}
						if (NOTIFICATIONS.length === 0) {
							for (var i = 0; i < fullmessage.length; i++) {
								var _notification = {};
								_notification.title = message;
								_notification.domain = fullmessage[i].domainName;
								var sentinfo = fullmessage[i].sentBy.split('email=')[1];
								sentinfo = sentinfo.split(',')[0];
								_notification.by = sentinfo;
								_notification.msg = fullmessage[i].text;
								_notification.status = status;
								_notification.timestamp = new Date().toISOString();
								;
								_notification.keyword = keyword;
								_notification.inviteid = fullmessage[i].id;
								NOTIFICATIONS.push(_notification);
								NOTIFICATION_new = NOTIFICATION_new +1;
								jQuery('#alert-value').text(NOTIFICATION_new);
								$('#notifyAudio')[0].play();
							}
						}
						for (var s = 0; s < NOTIFICATIONS.length; s++) {
							if (NOTIFICATIONS[s].keyword !== keyword) {
								if (NOTIFICATIONS[s].inviteid && NOTIFICATIONS[s].inviteid !== fullmessage[i].id && !fullmessage[0]) {
									if (!fullmessage[0]) {
										var _notification = {};
										_notification.title = message;
										_notification.description = fullmessage;
										_notification.status = status;
										_notification.timestamp = new Date().toISOString();
										;
										_notification.keyword = keyword;
										NOTIFICATION_new = NOTIFICATION_new +1;
										NOTIFICATIONS.push(_notification);
										jQuery('#alert-value').text(NOTIFICATION_new);
										$('#notifyAudio')[0].play();
									} else {
										for (var i = 0; i < fullmessage.length; i++) {
											var _notification = {};
											_notification.title = message;
											_notification.domain = fullmessage[i].domainName;
											var sentinfo = fullmessage[i].sentBy.split('email=')[1];
											sentinfo = sentinfo.split(',')[0];
											_notification.by = sentinfo;
											_notification.msg = fullmessage[i].text;
											_notification.status = status;
											_notification.timestamp = new Date().toISOString();
											;
											_notification.keyword = keyword;
											_notification.inviteid = fullmessage[i].id;
											NOTIFICATION_new = NOTIFICATION_new +1;
											NOTIFICATIONS.push(_notification);
											jQuery('#alert-value').text(NOTIFICATION_new);
											$('#notifyAudio')[0].play();
										}
									}
								}
							}
						}

						//jQuery('#project-nav').append(notification);
						//jQuery('.edit-notify').slideDown(1000);
						// $('#notifyAudio')[0].play();
						// setTimeout(function() {
						// //jQuery('.edit-notify').effect('slide', { direction: 'right', mode: 'hide' }, 1000);
						// //jQuery('#alert').addClass('active');
						// jQuery('.edit-notify').slideUp(1000);
						// }, 5000);
						//5 Seconds is enough to catch attention
					}
				}


				this.getNotifications = function() {
					return NOTIFICATIONS;
				};

				this.getNewNotificationsCount = function() {
					return NOTIFICATION_new;
				};

				this.resetNewNotification = function() {
					NOTIFICATION_new = 0;
				};

				this.removeNotifications = function(indexnum) {
					NOTIFICATIONS.splice(indexnum, 1);
				};

				this.pause = function() {

				};

				this.resume = function() {

				};

				this.showNotification = function(status, message, toroute, duration) {
					showNotification(status, message, toroute, duration);
				};

				this.showMessage = function(status, message, fullmessage, keyword, toroute, duration) {
					showMessage(status, message, fullmessage, keyword, toroute, duration);
				};

				this.init = function(args) {
					//Get the context from DOM
					//getElement();
				};
			}

			return Notify;
		}());

	return new Notify();
});
