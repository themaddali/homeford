//View that will drive the main landing page.

define(['../app/Router', 'cookie','plugins', '../app/service/DataService'], function(router, cookie, plugins, service) {"use strict";

	var PreHomeView = ( function() {

			/**
			 * Constructor
			 */
			var PARMS = {
				"Bg" : "img\/classbg.png",
			};
			
			function PreHomeView() {
				
				function showBG() {
					jQuery.backstretch(PARMS.Bg);
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
					var entity = router.location().substring(1);
					service.validateEntity(entity,{
						success : function(response) {
							console.log('Sub Domain' + response);
							if (response === true) {
								jQuery.cookie('entity', entity, {
									expires : 100,
									path : '/'
								});
								router.go('/home', '/pre');
							}
							else
							{
								jQuery('#entity-response').text(entity);
								setTimeout(function(){
									$('#register-link').fadeIn(1500);
								},1000);
								//jQuery('#entity-response').append('<p style="font-seze:12px;" id="pre-load-message"></p>');
							}
						}
					});
				}


				this.pause = function() {

				};

				this.resume = function() {
					//Forcing to reload all view.
					location.reload();
				};

				this.init = function(args) {
					//Lets create some background for UX
					showBG();
					//Validate the ID.
					validateEntity();
					
					jQuery('#register-link').on('click',function() {
						router.go('/register','/entry');
					});
					
				};
			}

			return PreHomeView;
		}());

	return new PreHomeView();
});
