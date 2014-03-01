//View that will drive the main landing page.

define(['spin', 'cookie', 'plugins', 'flatvid', 'typeahead', 'bloodhound'], function() {"use strict";

	var HomeView = ( function() {
		
		var home_script_params = {
		"bgArray" : ["img\/1.jpg",
		"img\/2.jpg",
		"img\/3.jpg",
		"img\/4.jpg",
		"img\/5.jpg"]
		};

			/**
			 * Constructor
			 */
			function HomeView() {
				$(document).ready(function() {

					(function(e) {
						var t = {
							lines : 17,
							length : 6,
							width : 4,
							radius : 12,
							rotate : 0,
							color : "#ccc",
							speed : 2.2,
							trail : 60,
							className : "spinner",
							zIndex : -2e9,
							top : "auto",
							left : "auto"
						}, n = document.getElementById("preloader"), r = (new Spinner(t)).spin(n), i = home_script_params.bgArray;
						e.backstretch(i, {
							duration : 3e3,
							fade : 750
						}, function() {
							r.stop()
						});
						e("#preloader").hide();
						var s = e(window).height(), o = e("#login-modal").height(), u = s / 2 - o / 2;
						e("a[rel*=theModal]").leanModal({
							top : u,
							overlay : .7,
							closeButton : ".modal_close"
						});
						e(window).resize(function() {
							e("#login-modal").css({
								top : e(window).height() / 2 - o / 2
							})
						}).resize()
					})(jQuery);

					var countries = new Bloodhound({
						datumTokenizer : function(d) {
							return Bloodhound.tokenizers.whitespace(d.name);
						},
						queryTokenizer : Bloodhound.tokenizers.whitespace,
						limit : 5,
						prefetch : {
							url : '../univ/data/univslist.json',
							filter : function(list) {
								return jQuery.map(list, function(country) {
									return {
										name : country
									};
								});
							}
						}
					});

					countries.initialize();
					jQuery('#login-error').hide();

					jQuery('#slogan-input').typeahead(null, {
						name : 'countries',
						displayKey : 'name',
						source : countries.ttAdapter()
					});

					setTimeout(function() {
						jQuery('#slogan-input').css('background-color', 'white');
						jQuery('#slogan-input').css('vertical-align', 'middle');
						jQuery('.tt-dropdown-menu').css('top', 'inherit');
						jQuery('#slogan-input').focus();
					}, 500);

					if (jQuery.cookie('user')) {
						jQuery('#login-modal-link').text(jQuery.cookie('user'));
						jQuery('#login-modal-link').addClass('loggedin-user');
						jQuery('#login-modal-link').attr('href', '');
						var currentlocation = window.location.href;
						window.location.assign(currentlocation + 'module/studentlist')
					}

					jQuery('.loggedin-user').on('click', function(e) {
						e.preventDefault();
						var currentlocation = window.location.href;
						window.location.assign(currentlocation + 'module/admin')
					});

					jQuery('.login-input-button').on('click', function(e) {
						e.preventDefault();
						jQuery('#login-error').hide();
						var inputuname = jQuery('#input-username').val();
						var inputpass = jQuery('#input-password').val();

						if (inputuname !== 'error' && inputpass !== null) {
							// successful validation and create cookie
							jQuery.cookie('user', inputuname, {
								expires : 100,
								path: '/' 
							});
							var currentusr = jQuery.cookie('user');
							var currentlocation = window.location.href;
							window.location.assign(currentlocation + 'module/studentlist');
						} else {
							jQuery('#input-username').val('');
							jQuery('#input-password').val('');
							jQuery('#login-error').fadeIn(250);
							jQuery('#input-username').focus();
						}
					});

					jQuery('#slogan-input').keypress(function(e) {
						if (e.which === 13) {
							if (jQuery('#slogan-input').val() === 'Maths' || jQuery('#slogan-input').val() === 'Colors' || jQuery('#slogan-input').val() === 'Numbers') {
								jQuery(this).blur();
								jQuery('#slogan-input').focus().click();
								jQuery.cookie('user', 'home');
								jQuery.cookie('subuser', 'You', {
										path : '/',
										expires : 100
									});
								window.location.assign('/univ/module/class');
							}
						}
					});

					jQuery('#logoutbtn').on('click', function(e) {
						e.preventDefault();
						if (jQuery.removeCookie('username')) {
							jQuery('#logoutcontainer').html('<strong>Successfully logged out! Refreshing the page now...</strong>');
							window.setTimeout('location.reload()', 2000);
							// refresh after 2 sec
						}
					});

				});

				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					//To Drive from Outside Calls
				};

			}

			return HomeView;
		}());

	return new HomeView();
});
