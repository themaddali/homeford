//View that will drive the Students list page.

define(['cookie', 'jqueryui', '../app/service/DataService', 'validate', '../app/Router', '../app/Notify', '../app/AdminView', '../app/ToDoAssignView'], function(cookie, jqueryui, service, validate, router, notify, admin, todoassign) {"use strict";

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
					var membernames = [];
					var template = jQuery('#member-template').remove().attr('id', '');
					for (var i = 1; i <= 50; i++) {
						jQuery('.metadata').text(i + ' of ' + i + ' selected');
						var thisitem = template.clone();
						jQuery('.membercard-name', thisitem).text('Mr. John testing long - ' + i);
						membernames.push(jQuery('.membercard-name', thisitem).text());
						jQuery('.membercard-id', thisitem).text('ID # ' + i);
						jQuery('.edit-card-canvas').append(thisitem);
					}
					$(".card-search").autocomplete({
						source : function(request, response) {
							var results = $.ui.autocomplete.filter(membernames, request.term);
							response(results.slice(0, 5));
						}
					});
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

						jQuery('#checkbox-control').click(function() {
							var numberOfChecked = $('input:checkbox:checked').length;
							var totalCheckboxes = $('input:checkbox').length;
							if (numberOfChecked === totalCheckboxes && numberOfChecked !== 0) {
								jQuery('#checkbox-control').text('Select All');
								$(".membercard-checkbox").prop('checked', false);
								jQuery('.membercard').removeClass('active');
								jQuery('.metadata').text('0 of ' + totalCheckboxes + ' selected');
							} else {
								jQuery('#checkbox-control').text('Un-Select All');
								$(".membercard-checkbox").prop('checked', true);
								jQuery('.membercard').addClass('active');
								jQuery('.metadata').text(totalCheckboxes + ' of ' + totalCheckboxes + ' selected');
							}
						});

						jQuery('.membercard-checkbox').change(function() {
							if (!$(this).is(':checked')) {
								jQuery(this).parent().removeClass('active');
							} else {
								jQuery(this).parent().addClass('active');
							}
							var numberOfChecked = $('input:checkbox:checked').length;
							var totalCheckboxes = $('input:checkbox').length;
							if (numberOfChecked !== totalCheckboxes){
								jQuery('#checkbox-control').text('Select All');
							}
							else{
								jQuery('#checkbox-control').text('Un-Select All');
							}
							jQuery('.metadata').text(numberOfChecked + ' of ' + totalCheckboxes + ' selected');
						});

						jQuery('.card-search').keyup(function(event) {
								var searchword = jQuery('.card-search').val();
								var cardlist = jQuery('.edit-card-canvas .membercard-name');
								for (var i=0; i< cardlist.length; i++){
									var thiscard = cardlist[i];
									thiscard.parentElement.style.display ='';
									if (thiscard.textContent.indexOf(searchword) != -1){
										//thiscard.parentElement.stlye.display = '';
									}
									else
									{
										thiscard.parentElement.style.display = 'none';
									}
								}
						});
						jQuery('.card-search').click(function(event) {
								var searchword = jQuery('.card-search').val();
								var cardlist = jQuery('.edit-card-canvas .membercard-name');
								for (var i=0; i< cardlist.length; i++){
									var thiscard = cardlist[i];
									thiscard.parentElement.style.display ='';
									if (thiscard.textContent.indexOf(searchword) != -1){
										//thiscard.parentElement.stlye.display = '';
									}
									else
									{
										thiscard.parentElement.style.display = 'none';
									}
								}
						});
						
						jQuery('#members-pick').click(function(){
							todoassign.selectedMembers(jQuery('.metadata').text());
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return ToDoAssignView;
		}());

	return new ToDoAssignView();
});
