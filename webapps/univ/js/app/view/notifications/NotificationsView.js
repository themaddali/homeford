//View that will drive the Students list page.

define(['cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify',], function(cookie, service, validate, router, notify) {"use strict";

	var InviteView = ( function() {

			/**
			 * Constructor
			 */

			var NOTIFICATION;
			var pendingList;
			var validator;

			function InviteView() {

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
					NOTIFICATION = notify.getNotifications();
					for (var i=0; i<NOTIFICATION.length; i++) {
						var template = jQuery('#notify-template').attr('id','');
						//Backing the template
						jQuery('.div-template').append(template.attr('id', 'notify-template'));
						var thistemplate = template.clone();
						jQuery('.title', thistemplate).text(NOTIFICATION.title);
						jQuery('.timestamp', thistemplate).text(NOTIFICATION.timestamp);
						jQuery('.body', thistemplate).text(NOTIFICATION.fullmessage);
						jQuery('.action', thistemplate).text(NOTIFICATION.keyword);
						jQuery('#card-canvas').append(thistemplate);
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						populateData();
						//HTML Event - Actions

						jQuery('#notification-done').click(function() {
							router.returnToPrevious();
						});
					} // Cookie Guider
				};

			}

			return InviteView;
		}());

	return new InviteView();
});
