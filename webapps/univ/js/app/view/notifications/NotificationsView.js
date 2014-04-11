//View that will drive the Students list page.

define(['cookie', '../../service/DataService', '../../service/BannerService', '../../Notify', '../../Router'], function(cookie, service, banner, notify, router) {"use strict";

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
					var template = jQuery('#notify-template').attr('id', '');
					//Backing the template
					jQuery('.div-template').append(template.attr('id', 'notify-template'));
					jQuery('.metainfo').text(NOTIFICATION.length + ' Notifications');
					if (NOTIFICATION.length === 0) {
						jQuery('#noinfo').fadeIn(1000);
					}
					for (var i = 0; i < NOTIFICATION.length; i++) {
						var thistemplate = template.clone();
						jQuery('.title', thistemplate).text(NOTIFICATION[i].title);
						jQuery('.timestamp', thistemplate).text(NOTIFICATION[i].time);
						if (NOTIFICATION[i].domain.length > 1) {
							jQuery('.inviteddomain', thistemplate).text(NOTIFICATION[i].domain);
						} else {
							jQuery('.inviteddomain', thistemplate).parent().css('display', 'none');
						}
						if (NOTIFICATION[i].by.length > 1) {
							jQuery('.invitedby', thistemplate).text(NOTIFICATION[i].by);
						} else {
							jQuery('.invitedby', thistemplate).parent().css('display', 'none');
						}
						if (NOTIFICATION[i].msg.length > 1) {
							jQuery('.invitedmsg', thistemplate).text(NOTIFICATION[i].msg);
						} else {
							jQuery('.invitedmsg', thistemplate).parent().css('display', 'none');
						}
						if (NOTIFICATION[i].keyword.length > 1) {
							jQuery('.action', thistemplate).text(NOTIFICATION[i].keyword);
							thistemplate.attr('name', i);
						} else {
							jQuery('.action', thistemplate).css('display', 'none');
							jQuery('.foot', thistemplate).css('display', 'none');
						}
						if (NOTIFICATION[i].inviteid.length > 1) {
							jQuery('.inviteid', thistemplate).text(NOTIFICATION[i].inviteid);
						} else {
							jQuery('.inviteid', thistemplate).css('display', 'none');
						}
						jQuery('#card-canvas').append(thistemplate);
						if (i === NOTIFICATION.length - 1) {
							jQuery('.action').click(function() {
								var id = $(this).parent().parent().find('.inviteid').text();
								var indexof = $(this).parent().parent().attr('name');
								service.acceptInvite(id, {
									success : function(data) {
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

						jQuery('.subtitleinfo').click(function() {
							router.returnToPrevious();
						});
						jQuery('.mainlogo').click(function() {
							router.go('/studentlist');
						});

					} // Cookie Guider
				};

			}

			return InviteView;
		}());

	return new InviteView();
});
