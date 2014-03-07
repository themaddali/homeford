//View that will drive the main landing page.

define(['spin', 'cookie', 'plugins', 'flatvid', 'typeahead', 'bloodhound', '../app/Router'], function(spin, cookie, plugin, flatvid, typeahead, bloodhound, router) {"use strict";

	var HomeView = ( function() {

			var PARAM = {
				"Bg" : ["img\/1.jpg", "img\/2.jpg", "img\/3.jpg", "img\/4.jpg", "img\/5.jpg", "img\/6.jpg", "img\/7.jpg"]
			};

			var EDIT = '<i id="entity-edit" style="padding-left:10px;font-size:10px; display:none; vertical-align:super;" class="icon-gear  icon-1x ">Change</i>';
			/**
			 * Constructor
			 */
			function HomeView() {
				//Variable Zone.
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
				};
				var n = document.getElementById("preloader");
				var r = (new Spinner(t)).spin(n);
				var i = PARAM.Bg;

				function startCoverShow() {
					jQuery.backstretch(i, {
						duration : 3e3,
						fade : 750
					}, function() {
						r.stop()
						jQuery("#preloader").hide();
					});
				}

				// setTimeout(function() {
				// jQuery('#slogan-input').css('background-color', 'white');
				// jQuery('#slogan-input').css('vertical-align', 'middle');
				// jQuery('.tt-dropdown-menu').css('top', 'inherit');
				// jQuery('#slogan-input').focus();
				// }, 500);

				function activateSuggestionSearch() {

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
					//activateSuggestionSearch();
					jQuery('#slogan-input').typeahead(null, {
						name : 'countries',
						displayKey : 'name',
						source : countries.ttAdapter()
					});
				}

				function checkForActiveCookie() {
					if (jQuery.cookie('user')) {
						router.go('/studentlist', '/home');
						return true;
					} else {
						return false;
					}
				}

				function checkForActiveEntityCookie() {
					if (jQuery.cookie('entity')) {
						return true;
					} else {
						return false;
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					//Forcing to reload all view.
					location.reload();
				};

				this.init = function(args) {

					//Check for Cookie before doing any thing.
					//Light weight DOM.
					if (checkForActiveCookie() === false) {
						//Rich Experience First.. Load BG
						startCoverShow();
						//Get the suggestions to search connected.
						if (checkForActiveEntityCookie()) {
							jQuery('#slogan-input').hide();
							jQuery('#knownentity').text(jQuery.cookie('entity'));
							jQuery('#knownentity').append(EDIT);

						} else {
							activateSuggestionSearch();
							//Hack - Must be fixed in CSS
							//Alignment mismatch :(
							jQuery('#slogan-input').css('background-color', 'white');
							jQuery('#slogan-input').css('vertical-align', 'middle');
							jQuery('.tt-dropdown-menu').css('top', 'inherit');
							jQuery('#slogan-input').focus();

						}

						//HTML Event - Actions
						jQuery('#login-modal-link').click(function() {
							router.go('/entry', '/home');
						});

						jQuery('#slogan-input').keypress(function() {
							var keycode = (event.keyCode ? event.keyCode : event.which);
							if (keycode == '13') {
								var queryString = jQuery('#slogan-input').val();
								//prehomeview.setEntity(queryString);
								router.go('/'+queryString, '/home');
							}
							
						});

						jQuery('#entity-edit').click(function() {
							jQuery.removeCookie('entity', {
								path : '/'
							});
							jQuery('#knownentity').hide();
							jQuery('#slogan-input').fadeIn();
						});

						jQuery('#knownentity').on({
							mouseenter : function() {
								jQuery('#entity-edit').fadeIn(500);
							},
							mouseleave : function() {
								jQuery('#entity-edit').fadeOut(500);
							}
						});

					} // Cookie Guider
				};
			}

			return HomeView;
		}());

	return new HomeView();
});
