//View that will drive the Students list page.

define(['modernizr', 'spin', 'plugins', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify'], function(modernizr, spin, plugins, cookie, service, banner, router, notify) {"use strict";

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
						jQuery('.metainfo').text(daystogo(ACTIVEQUIZ.dueby) + ' days to go');
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

						//var list = service.returnDomainIDList();
						// service.MemberToDoList(list[0], ACTIVEQUIZ.memberid, {
						// success : function(StudentData) {
						// $("#progressvalue").html(ACTIVEQUIZ.progress + '%');
						// jQuery('#progressslider').slider({
						// animate : true,
						// range : "min",
						// value : ACTIVEQUIZ.progress,
						// min : 0,
						// max : 100,
						// step : 1,
						// slide : function(event, ui) {
						// $("#progressvalue").html(ui.value + '%');
						// }
						// });
						// if (Modernizr.touch && Modernizr.inputtypes.date) {
						// document.getElementById('task-time').type = 'date';
						// } else {
						// jQuery("#task-time").datepicker({
						// minDate : -7
						// });
						// var date = new Date();
						// var today = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
						// jQuery("#task-time").val(today);
						// }
						//
						// }
						// });
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
				
				//http://codepen.io/jasonday/pen/amlqz
				function fluidDialog() {
					var $visible = $(".ui-dialog:visible");
					// each open dialog
					$visible.each(function() {
						var $this = $(this);
						var dialog = $this.find(".ui-dialog-content");
						// if fluid option == true
						if (dialog.options.maxWidth && dialog.options.width) {
							// fix maxWidth bug
							$this.css("max-width", dialog.options.maxWidth);
							//reposition dialog
							dialog.option("position", dialog.options.position);
						}

						if (dialog.options.fluid) {
							// namespace window resize
							$(window).on("resize.responsive", function() {
								var wWidth = $(window).width();
								// check window width against dialog width
								if (wWidth < dialog.options.maxWidth + 50) {
									// keep dialog from filling entire screen
									$this.css("width", "90%");

								}
								//reposition dialog
								dialog.option("position", dialog.options.position);
							});
						}

					});
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

						jQuery('#helper-youtube').click(function() {
							$("#dialog-modal").dialog({
								autoOpen : true,
								width : 'auto', // overcomes width:'auto' and maxWidth bug
								height : 300,
								maxWidth : 600,
								modal : true,
								fluid : true, //new option
								resizable : false,
								open : function(event, ui) {
									fluidDialog();
									// needed when autoOpen is set to true in this codepen
								}
							});
						});

						jQuery('#updatetodo').click(function() {
							var _newprogress = jQuery('#progressvalue').text().split('%')[0];
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

						// run function on all dialog opens
						$(document).on("dialogopen", ".ui-dialog", function(event, ui) {
							fluidDialog();
						});

						// remove window resize namespace
						$(document).on("dialogclose", ".ui-dialog", function(event, ui) {
							$(window).off("resize.responsive");
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
