//View that will drive the main landing page.

define(['../app/Router', 'cookie'], function(router, cookie) {"use strict";

	var PreHomeView = ( function() {

			var home_script_params = {
				"bgArray" : ["img\/1.jpg", "img\/2.jpg", "img\/3.jpg", "img\/4.jpg", "img\/5.jpg"]
			};

			/**
			 * Constructor
			 */
			function PreHomeView() {
				//Variable Zone.
				// var t = {
					// lines : 17,
					// length : 6,
					// width : 4,
					// radius : 12,
					// rotate : 0,
					// color : "#ccc",
					// speed : 2.2,
					// trail : 60,
					// className : "spinner",
					// zIndex : -2e9,
					// top : "auto",
					// left : "auto"
				// };
				// var n = document.getElementById("preloader");
				// var r = (new Spinner(t)).spin(n);
				// var i = home_script_params.bgArray;

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
						var currentlocation = window.location.href;
						router.go('/studentlist', '/home');
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
						//startCoverShow();
						//Get the suggestions to search connected.
						//activateSuggestionSearch();

						var entity = router.location();
						jQuery.cookie('entity', entity, {
							expires : 100,
							path : '/'
						});
						router.go('/home', '/prehome');

						//Hack - Must be fixed in CSS
						//Alignment mismatch :(
						// jQuery('#slogan-input').css('background-color', 'white');
						// jQuery('#slogan-input').css('vertical-align', 'middle');
						// jQuery('.tt-dropdown-menu').css('top', 'inherit');
						// jQuery('#slogan-input').focus();

						//HTML Event - Actions
						jQuery('#login-modal-link').click(function() {
							router.go('/entry', '/home');
						});
					} // Cookie Guider
				};
			}

			return PreHomeView;
		}());

	return new PreHomeView();
});
