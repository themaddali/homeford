//View that will drive the Students list page.

define(['cookie', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify', '../app/AdminView'], function(cookie, service, validate, router, notify, admin) {"use strict";

	var ToDoAssignView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;

			function ToDoAssignView() {

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
					jQuery('#invite-domain').empty();
					var template = jQuery('#member-template').remove().attr('id', '');
					for (var i=1; i<=50; i++) {
						jQuery('.metadata').text(i+' of '+i +' selected');
						var thisitem = template.clone();
						jQuery('.membercard-name', thisitem).text('Mr. John testing long - ' + i);						
						jQuery('.membercard-id', thisitem).text('ID # '+i);	
						jQuery('.edit-card-canvas').append(thisitem);					
					}
				}
				
				function clearForm() {
					
				}

				this.pause = function() {

				};

				this.resume = function() {
					
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.

					if (checkForActiveCookie() === true) {
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return ToDoAssignView;
		}());

	return new ToDoAssignView();
});
