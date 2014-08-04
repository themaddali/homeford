define(['modernizr', 'cookie', '../../service/DataService', '../../service/BannerService', '../../Router', '../../Notify', 'paypal', 'stripe'], function(modernizr, cookie, service, banner, router, notify, paypal, stripe) {"use strict";

	var ToDoGroundView = ( function() {

			var ACTIVEQUIZ = {};
			var STRIPEDIALOG = '<div id="item-dialog-form" title="Pay By Card"><form id="new-item-form" class="edit-form"><fieldset><ol class="service-ol"><li class="form-item"><label>Card Number</label><div class="form-content"><input placeholder="Ex: 4344123466664231" id="card-num" name="cardnum" data-stripe="number" type="number" /></div></li><li class="form-item"><label>CVV</label><div class="form-content"><input placeholder="Ex: 000" id="card-cvv" name="cardcvv" data-stripe="cvc" type="number" /></div></li><li class="form-item"><label>Exipry Month</label><div class="form-content"><input placeholder="Ex: 10" id="card-exp" name="cardexp" type="number" /><li class="form-item"><label>Exipry Year</label><div class="form-content"><input placeholder="Ex: 2016" id="card-exp-year" name="cardexpyear" type="number" /></div></li></ol></fieldset></form></div>';
			var CHECKDIALOG = '<div id="item-dialog-form2" title="Pay By Card"><form id="new-item-form2" class="edit-form"><fieldset><ol class="service-ol"><li class="form-item"><label>Bank Name</label><div class="form-content"><input placeholder="Ex: JP Morgan Chase" id="check-bank" name="checkbank" type="text"/></div></li><li class="form-item"><label>Check Number</label><div class="form-content"><input placeholder="Ex: 629" id="check-num" name="checknum" type="text" /></div></li><li class="form-item"><label>Dated</label><div class="form-content"><input placeholder="Ex: 9/9/2014" id="check-date" name="checkdate" type="text" /><li class="form-item"><label>Handed To</label><div class="form-content"><input placeholder="Ex:To Admin / via Mail etc" id="check-handed" name="checkhanded" type="text" /></div></li></ol></fieldset></form></div>';
			var newitemvalidator, newitemvalidator2;

			/**
			 * Constructor
			 */
			function ToDoGroundView() {

				function showBG() {
					//jQuery.backstretch(PARMS.workBg);
				}

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
						//Defaults
						$('input[type="button"]').removeAttr('disabled');
						$('input[type="button"]').css('background-color', '#0784E3');
						$('#task-desc').val('');
						//Action
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
						if (ACTIVEQUIZ.progress === 100 || ACTIVEQUIZ.progress === '100') {
							$('input[type="button"]').attr('disabled', 'disabled');
							$('input[type="button"]').css('background-color', 'grey');
							$('#task-desc').val(ACTIVEQUIZ.comments);
						}
						$("#task-desc-data").html(ACTIVEQUIZ.desc.replace(/\r?\n/g, '<br/>'));
						$("#pay-palpal-form-cost").val(ACTIVEQUIZ.desc.split('$')[1].split(" ")[0]);
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
						//jQuery('.helper-email').parent().parent().fadeIn();
						if (ACTIVEQUIZ.url && ACTIVEQUIZ.url.length > 4) {
							$("#pay-palpal-form-email").val(ACTIVEQUIZ.url);
							//jQuery('.helper-url').attr('href', ACTIVEQUIZ.url);
							//jQuery('.helper-url').parent().parent().fadeIn();
						}
						//if (ACTIVEQUIZ.youtube && ACTIVEQUIZ.youtube.length > 4) {
						//var fulllink = "http://www.youtube.com/watch?v=" + ACTIVEQUIZ.youtube + "?modestbranding=1&autoplay=1&cc_load_policy=1&controls=0&rel=0";
						//jQuery('.helper-youtube').attr('href', fulllink);
						//jQuery('.helper-youtube').parent().parent().fadeIn();
						//}
					}
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						jQuery('#loggedin-user').text(jQuery.cookie('user'));
						banner.setBrand();
						return true;
					} else {
						router.go('/home', '/bill');
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

				function chargeCard() {
					if ($("#new-item-form").valid()) {
						jQuery('#pay-card-num').val(jQuery('#card-num').val());
						jQuery('#pay-card-cvv').val(jQuery('#card-cvv').val());
						jQuery('#pay-card-exp').val(jQuery('#card-exp').val());
						jQuery('#pay-card-exp-year').val(jQuery('#card-exp-year').val());
						jQuery('#card-num').val('');
						jQuery('#card-cvv').val('');
						jQuery('#card-exp').val('');
						jQuery('#card-exp-year').val('');
						jQuery('#pay-card-fire').click();
						$("#item-dialog-form").dialog("close");
					}
				}

				function updateCheck() {
					if ($("#new-item-form2").valid()) {
						var _commentstext = [];
						var comments = {};
						comments.text = 'Paid via Check.  Bank Name: ' + jQuery('#check-bank').val() + ', Check Number: ' + jQuery('#check-num').val() + ', Dated: ' + jQuery('#check-date').val() + ', Handed to: ' + jQuery('#check-handed').val();
						_commentstext.push(comments);
						service.updateToDo(ACTIVEQUIZ.id, 100, '', _commentstext, {
							success : function(data) {
								if (data.status == 'success') {
									notify.showNotification('OK', ' Bill Paid: ' + ACTIVEQUIZ.name);
									router.go('/class');
								}
							}
						});
						jQuery('#pay-card-num').val(jQuery('#card-num').val());
						jQuery('#pay-card-cvv').val(jQuery('#card-cvv').val());
						jQuery('#pay-card-exp').val(jQuery('#card-exp').val());
						jQuery('#pay-card-exp-year').val(jQuery('#card-exp-year').val());
						jQuery('#card-num').val('');
						jQuery('#card-cvv').val('');
						jQuery('#card-exp').val('');
						jQuery('#card-exp-year').val('');
						jQuery('#pay-card-fire').click();
						$("#item-dialog-form").dialog("close");
					}
				}

				function initDialog() {
					jQuery('body').append(STRIPEDIALOG);
					$("#item-dialog-form").dialog({
						autoOpen : false,
						height : 500,
						width : 600,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						modal : true,
						buttons : {
							"Pay Now" : chargeCard,
							Cancel : function() {
								$("#item-dialog-form").dialog("close");
							}
						},
						close : function() {
							$(this).dialog("close");
						}
					});

					jQuery('body').append(CHECKDIALOG);
					$("#item-dialog-form2").dialog({
						autoOpen : false,
						height : 500,
						width : 600,
						show : {
							effect : "blind",
							duration : 300
						},
						hide : {
							effect : "explode",
							duration : 300
						},
						modal : true,
						buttons : {
							"Update" : updateCheck,
							Cancel : function() {
								$("#item-dialog-form2").dialog("close");
							}
						},
						close : function() {
							$(this).dialog("close");
						}
					});
				}


				this.activeTask = function(selectedinput) {
					ACTIVEQUIZ = selectedinput;
				};

				this.pause = function() {
					populateData();
				};

				this.resume = function() {
					jQuery('.edit-notify').hide();
					newitemvalidator.resetForm();
					newitemvalidator2.resetForm();
					banner.HideAlert();
					banner.HideUser();
					banner.setBrand();
					populateData();
					initDialog();
					document.title = 'Zingoare | Bill Ground';
					if (notify.getNewNotificationsCount() > 0) {
						jQuery('#alert-value').text(notify.getNewNotificationsCount());
					} else {
						jQuery('#alert-value').text('');
					}
				};

				this.init = function() {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Bill Ground';
					if (checkForActiveCookie() === true) {
						if (!$.ui) {
							location.reload();
						}
						populateData();
						initDialog();
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
										notify.showNotification('OK', ' Updated Task: ' + ACTIVEQUIZ.name + ' to ' + _newprogress + ' %');
										router.go('/class');
									}
								}
							});
						});

						jQuery('#pay-palpal').click(function() {
							jQuery('#pay-palpal-fire').click();
						});

						jQuery('#pay-card').click(function() {
							jQuery("#item-dialog-form").dialog("open");
						});

						jQuery('#pay-check').click(function() {
							jQuery("#item-dialog-form2").dialog("open");
						});
						stripe.setPublishableKey('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

						var stripeResponseHandler = function(status, response) {
							var $form = $('#payment-form');

							if (response.error) {
								// Show the errors on the form
								$form.find('.payment-errors').text(response.error.message);
								$form.find('button').prop('disabled', false);
							} else {
								// token contains id, last4, and card type
								var token = response.id;
								// Insert the token into the form so it gets submitted to the server
								$form.append($('<input type="hidden" name="stripeToken" />').val(token));
								// and re-submit
								$form.get(0).submit();
							}
						};

						$('#payment-form').submit(function(e) {
							var $form = $(this);

							// Disable the submit button to prevent repeated clicks
							$form.find('button').prop('disabled', true);

							Stripe.card.createToken($form, stripeResponseHandler);

							// Prevent the form from submitting with the default action
							return false;
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

						jQuery('.brandnames').change(function() {
							banner.updateBrand(jQuery('.brandnames').val());
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

						newitemvalidator = jQuery("#new-item-form").validate({
							rules : {
								cardnum : {
									required : true,
									creditcard : true
								},
								cardcvv : {
									required : true,
									max : 9999,

								},
								cardexp : {
									required : true,
									max : 12,
									min : 1
								},
								cardexpyear : {
									required : true,
									min : 2014,
									max : 2050
								},
							},
						});

						newitemvalidator2 = jQuery("#new-item-form2").validate({
							rules : {
								checkbank : {
									required : true,
								},
								checknum : {
									required : true,

								},
								checkdate : {
									required : true,
								},
								checkhanded : {
									required : true,
								},
							},
						});

					} // Cookie Guider

				};

			}

			return ToDoGroundView;
		}());

	return new ToDoGroundView();
});
