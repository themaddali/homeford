define(['../../Router', 'cookie', '../../service/DataService', '../../view/entry/RegisterView'], function(router, cookie, service, register) {"use strict";

	var PreHomeView = ( function() {

			/**
			 * Constructor
			 */
			var PARMS = {
				"Bg" : "img\/classbg.png",
			};
			var ENTITY;

			function PreHomeView() {

				function showBG() {
					//jQuery.backstretch(PARMS.Bg);
				}

				function setActiveCookie() {
					if (jQuery.cookie('entity')) {
						var currentlocation = window.location.href;
						router.go('/studentlist', '/home');
						return true;
					} else {
						return false;
					}
				}

				function validateEntity() {
					if (ENTITY === null || !ENTITY) {
						var entity = router.location().substring(1);
					} else {
						var entity = ENTITY;
						ENTITY = null;
					}
					if (jQuery.cookie('user') && jQuery.cookie('user') !== 'home') {
						router.go('/pagenotfound');
					} else {
						service.validateEntity(entity, {
							success : function(response) {
								if (response === true) {
									jQuery.cookie('entity', entity, {
										expires : 100,
										path : '/'
									});
									router.go('/entry', '/pre');
								} else {
									jQuery('#entity-response').text(entity);
									setTimeout(function() {
										$('#register-link').fadeIn(1500);
									}, 1000);
								}
							}
						});
					}
				}


				this.pause = function() {

				};

				this.resume = function() {
					//Forcing to reload all view.
					location.reload();
					document.title = 'Zingoare | New Domain';
				};

				this.setEntity = function(entity) {
					ENTITY = entity;
				}

				this.init = function(args) {
					//Lets create some background for UX
					document.title = 'Zingoare | New Domain';
					showBG();
					//Validate the ID.
					validateEntity();

					jQuery('#register-link').on('click', function() {
						register.entity(jQuery('#entity-response').text());
						router.go('/register', '/entry');
					});

				};
			}

			return PreHomeView;
		}());

	return new PreHomeView();
});
