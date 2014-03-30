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
					jQuery('#card-canvas').empty();
					jQuery('#noinfo').hide();
					NOTIFICATION = notify.getNotifications();
					var template = jQuery('#notify-template').attr('id','');
					//Backing the template
					jQuery('.div-template').append(template.attr('id', 'notify-template'));
					jQuery('.metainfo').text(NOTIFICATION.length +' Notifications');
					if (NOTIFICATION.length === 0){
						jQuery('#noinfo').fadeIn(1000);
					}
					for (var i=0; i<NOTIFICATION.length; i++) {
						var thistemplate = template.clone();
						jQuery('.title', thistemplate).text(NOTIFICATION[i].title);
						jQuery('.timestamp', thistemplate).text(NOTIFICATION[i].time);
						jQuery('.inviteddomain', thistemplate).text(NOTIFICATION[i].domain);
						jQuery('.invitedby', thistemplate).text(NOTIFICATION[i].by);
						jQuery('.invitedmsg', thistemplate).text(NOTIFICATION[i].msg);
						jQuery('.action', thistemplate).text(NOTIFICATION[i].keyword);
						jQuery('.inviteid', thistemplate).text(NOTIFICATION[i].inviteid);
						thistemplate.attr('name',i);
						jQuery('#card-canvas').append(thistemplate);
						if (i=== NOTIFICATION.length-1) {
							jQuery('.action').click(function(){
							var id = $(this).parent().parent().find('.inviteid').text();
							var indexof =  $(this).parent().parent().attr('name');
							service.acceptInvite(id, {
								success: function(data) {
									notify.removeNotifications(indexof);
									populateData();
								}
							});
						});
						}
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
						
						jQuery('.goback').click(function(){
							router.returnToPrevious();
						});
						jQuery('.mainlogo').click(function(){
							router.go('/studentlist');
						});
						
					} // Cookie Guider
				};

			}

			return InviteView;
		}());

	return new InviteView();
});
