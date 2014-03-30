define(['../app/Router', 'cookie', '../app/service/DataService', 'jqueryui'], function(router, cookie, service, jqueryui) {"use strict";

	var Notify = ( function() {

			/**
			 * Constructor
			 */
			var STATUS;
			var MESSAGE;
			var PAGE;
			var ERROR = '<i style="padding:0px 10px" class="icon-exclamation icon-1x "></i>';
			var OK = '<i style="padding:0px 10px" class="icon-check icon-1x "></i>';
			var INFO = '<i style="padding:0px 10px" class="icon-bell-alt icon-1x "></i>';

			function Notify() {

				function showNotification(status, message, toroute, duration) {
					jQuery('div.edit-notify').remove();
					if (!duration) {
						duration = 3000;
						///defaulting to 3 seconds
					}
					if (jQuery.find('.modal-body')) {
						var CLASS = "edit-notify " + status;
						var notification = '<div class="' + CLASS + '">' + OK + '<span class="notify-message">' + message + '</span></div>';
						if (status === 'ERROR') {
							var notification = '<div class="' + CLASS + '">' + ERROR + '<span class="notify-message">' + message + '</span></div>';
						}
						jQuery('.modal-container').append(notification);
						jQuery('.modal_close').fadeOut();
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

				function showMessage(status, message, toroute, duration) {
					jQuery('div.edit-notify').remove();
					jQuery('.page').append('<audio id="notifyAudio"><source src="media/notify.ogg" type="audio/ogg"><source src="media/notify.mp3" type="audio/mpeg"><source src="media/notify.wav" type="audio/wav"></audio>');
					if (!duration) {
						duration = 5000;
						///defaulting to 5 seconds
					}
					if (jQuery.find('#project-nav')) {
						var CLASS = "edit-notify " + status;
						var notification = '<div style="padding: 11px; text-align: center" class="' + CLASS + '">' + OK + '<span style="cursor: pointer" class="notify-message">' + message + '</span></div>';
						if (status === 'ERROR') {
							var notification = '<div style="padding: 11px; text-align: center" class="' + CLASS + '">' + ERROR + '<span style="cursor: pointer" class="notify-message">' + message + '</span></div>';
						}
						else if (status === 'INFO') {
							var notification = '<div style="padding: 11px; text-align: center" class="' + CLASS + '">' + INFO + '<span style="cursor: pointer" class="notify-message">' + message + '</span></div>';
						}
						jQuery('#project-nav').append(notification);
						jQuery('.edit-notify').slideDown(1000);
						$('#notifyAudio')[0].play();
						setTimeout (function(){
								//jQuery('.edit-notify').effect('slide', { direction: 'right', mode: 'hide' }, 1000);
								jQuery('#alert').addClass('active');
								jQuery('.edit-notify').slideUp(1000);
							}, 5000);
						//5 Seconds is enough to catch attention
					}
				}


				this.pause = function() {

				};

				this.resume = function() {

				};

				this.showNotification = function(status, message, toroute, duration) {
					showNotification(status, message, toroute, duration);
				}

				this.showMessage = function(status, message, toroute, duration) {
					showMessage(status, message, toroute, duration);
				}

				this.init = function(args) {
					//Get the context from DOM
					//getElement();
				};
			}

			return Notify;
		}());

	return new Notify();
});
