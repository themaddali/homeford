define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/studentlist/StudentListView'], function(modernizr, cookie, service, validate, router, notify, admin, studentlist) {"use strict";

	var MembersAddAdvView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var validator;
			var SERVICESALL = [];
			var leadtemplate;
			var followtemplate;
			var serviceIDs = [];

			function MembersAddAdvView() {

				function populateData() {
					var domainIDs = [];
					domainIDs.push(service.domainNametoID(jQuery.cookie('subuser')));
					getServices(domainIDs);
				}

				function getServices(activedomains) {
					SERVICESALL = [];
					jQuery('.servicetemplate').remove();
					//jQuery('.edit-select').empty();
					jQuery('#member-list').css('color', 'black');
					for (var i = 0; i < activedomains.length; i++) {
						var thisdomaininstance = activedomains[i];
						service.ListAllServices(thisdomaininstance, {
							success : function(data) {
								for (var j = 0; j < data.length; j++) {
									if (j === 0) {
										var thisservice = leadtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description).attr('serviceid', data[j].id);
										// jQuery(thisservice)
										jQuery('#services-grid').append(thisservice);
									} else {
										var thisservice = followtemplate.clone();
										jQuery('.services-list', thisservice).parent().append(data[j].name);
										jQuery('.services-list', thisservice).attr('sname', data[j].name).attr('cost', data[j].unit_price).attr('tax', data[j].tax).attr('desc', data[j].description).attr('serviceid', data[j].id);
										jQuery('#services-grid').append(thisservice);
									}
								}
							}
						});
					}
				}

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

				function generateServiceArray() {
					serviceIDs = [];
					$('input[type=checkbox]').each(function() {
						if (this.checked) {
							serviceIDs.push(jQuery(this).attr('serviceid'));
						}
					});
				}

				function clearForm() {
					jQuery('input[type="text"]').val('');
					jQuery('input[type="checkbox"]').removeAttr('checked');
					jQuery('input[type="email"]').val('');
					//Fall Back
					jQuery('#member-first-name').val('');
					jQuery('#member-last-name').val('');
					jQuery('#mother-name').val('');
					jQuery('#father-name').val('');
					jQuery('#father-email').val('');
					jQuery('#mother-email').val('');
					jQuery('#g1-name').val('');
					jQuery('#g1-email').val('');
					jQuery('#g2-name').val('');
					jQuery('#g2-email').val('');
					jQuery('#g3-name').val('');
					jQuery('#g3-email').val('');
					jQuery('.g2').hide();
					jQuery('.g3').hide();
					jQuery('.formlink').show();
					jQuery('#member-first-name').removeAttr('readonly');
					jQuery('#member-last-name').removeAttr('readonly');
					jQuery('#member-email').removeAttr('readonly');
					jQuery('#member-email').val('');
					validator.resetForm();
					jQuery('.edit-notify').hide();
					jQuery('#member-first-name').focus();
				};

				function getFirstName(val) {
					var fname = val.split(" ")[0];
					return fname;
				}

				function getLastName(val) {
					var lname = val.split(" ");
					var newlname = '';
					for (var i = 1; i < lname.length; i++) {
						if (i == 1) {
							newlname = lname[i];
						} else {
							newlname = newlname + " " + lname[i];
						}
					}
					return newlname;
				}

				// jQuery.validator.addMethod("mandatoryset", function(value, element, options) {
				// var selector = options[1];
				// var validOrNot = $(selector, element.form).filter(function() {
				// return $(this).val();
				// }).length >= options[0];
				//
				// if (!$(element).data('being_validated')) {
				// var fields = $(selector, element.form);
				// fields.data('being_validated', true);
				// fields.valid();
				// fields.data('being_validated', false);
				// }
				// return validOrNot;
				// // }, jQuery.format("Please fill at least {0} of these fields."));
				// }, 'Please provide info of atleast one parent');

				jQuery.validator.addMethod("mandatoryset", function(value, element) {
					var momname = jQuery('#mother-name').val();
					var dadname = jQuery('#father-name').val();
					var dademail = jQuery('#father-email').val();
					var momemail = jQuery('#mother-email').val();
					if ((momname.length > 0 && momemail.length > 0) || (dadname.length > 0 && dademail.length > 0)) {
						return true;
					} else {
						return false;
					}
				}, "Atleast one parent info is mandatory");

				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					clearForm();
					document.title = 'Zingoare | Member / Student Add';
				};

				this.init = function(args) {
					//Check for Cookie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Member / Student Add';
					jQuery('.g2').hide();
					jQuery('.g3').hide();
					jQuery('.formlink').show();

					if (checkForActiveCookie() === true) {
						leadtemplate = jQuery('#service-lead').remove().attr('id', '');
						followtemplate = jQuery('#service-follow').remove().attr('id', '');
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});
						
						jQuery('#father-name').blur(function(){
							validator.resetForm();
						});
						
						jQuery('#father-email').blur(function(){
							validator.resetForm();
						});
						
						jQuery('#mother-name').blur(function(){
							validator.resetForm();
						});
						
						jQuery('#mother-email').blur(function(){
							validator.resetForm();
						});

						jQuery('.formlink').on('click', function() {
							if (!$('.formlink').prev().find('li:visible').last().hasClass('g2')) {
								jQuery('.g2').show();
								jQuery('#g2-name').focus();

							} else if (!$('.formlink').prev().find('li:visible').last().hasClass('g3')) {
								jQuery('.g3').show();
								jQuery('.formlink').hide();
								jQuery('#g3-name').focus();
							}
						});

						jQuery('#member-add').on('click', function() {
							if ($('#regularadd').valid()) {
								generateServiceArray();
								var kidobject = [];
								if (jQuery('#member-first-name').val().length > 0) {
									var person = {};
									person.firstName = jQuery('#member-first-name').val();
									person.lastName = jQuery('#member-last-name').val();
									person.userType = 'KID';
									kidobject.push(person);
								}
								if (jQuery('#father-name').val().length > 0) {
									var person = {};
									person.firstName = getFirstName(jQuery('#father-name').val());
									person.lastName = getLastName(jQuery('#father-name').val());
									person.email = jQuery('#father-email').val();
									person.userType = 'FATHER';
									kidobject.push(person);
								}
								if (jQuery('#mother-name').val().length > 0) {
									var person = {};
									person.firstName = getFirstName(jQuery('#mother-name').val());
									person.lastName = getLastName(jQuery('#mother-name').val());
									person.email = jQuery('#mother-email').val();
									person.userType = 'MOTHER';
									kidobject.push(person);
								}
								if (jQuery('#g1-name').val().length > 0) {
									var person = {};
									person.firstName = getFirstName(jQuery('#g1-name').val());
									person.lastName = getLastName(jQuery('#g1-name').val());
									person.email = jQuery('#g1-email').val();
									person.userType = 'GAURDIAN1';
									kidobject.push(person);
								}
								if (jQuery('#g2-name').length > 0 && jQuery('#g2-name').val().length > 0) {
									var person = {};
									person.firstName = getFirstName(jQuery('#g2-name').val());
									person.lastName = getLastName(jQuery('#g2-name').val());
									person.email = jQuery('#g2-email').val();
									person.userType = 'GAURDIAN2';
									kidobject.push(person);
								}
								if (jQuery('#g3-name').length > 0 && jQuery('#g3-name').val().length > 0) {
									var person = {};
									person.firstName = getFirstName(jQuery('#g3-name').val());
									person.lastName = getLastName(jQuery('#g3-name').val());
									person.email = jQuery('#g3-email').val();
									person.userType = 'GAURDIAN3';
									kidobject.push(person);
								}

								service.registerKids(service.domainNametoID(jQuery.cookie('subuser')), kidobject, {
									success : function(data) {
										if (data.status !== 'error') {
											//notify.showNotification('OK', data.message);
											for (var j = 0; j < data.length; j++) {
												if ((kidobject[0].firstName === data[j].firstName) && (kidobject[0].lastName === data[j].lastName)) {
													var kidid = [];
													kidid.push(data[j].id);
													service.AssignService(service.domainNametoID(jQuery.cookie('subuser')), kidid, serviceIDs, {
														success : function(data) {
															if (data.status !== 'error') {
																notify.showNotification('OK', kidobject[0].firstName + ' and group added!');
																setTimeout(function() {
																	studentlist.reload();
																	router.returnToPrevious();
																}, 2000);
															} else {
																notify.showNotification('ERROR', data.message);
															}
														}
													});
												}
											}

										} else {
											notify.showNotification('ERROR', data.message);
										}

									}
								});
							} else {
								notify.showNotification('ERROR', 'One or more fields in the form are not entered properly');
							}

						});

						jQuery('#form-reset').click(function() {
							clearForm();
						});

						validator = jQuery("#regularadd").validate({
							rules : {
								memberfirstname : {
									required : true,
								},
								memberlastname : {
									required : true,
								},
								fathername : {
									required : false,
									mandatoryset : true,
								},
								mothername : {
									required : false,
									mandatoryset : true,
								},
								fatheremail : {
									required : false,
									email : true,
									mandatoryset : true,
								},
								motheremail : {
									required : false,
									email : true,
									mandatoryset : true,
								},
								g1email : {
									email : true
								},
								g2email : {
									email : true
								},
								g3email : {
									email : true
								},
								services : {
									required : true
								}
							},
							messages : {
								services : "You must check at least 1 service"
							}
						});

					} // Cookie Guider
				};

			}

			return MembersAddAdvView;
		}());

	return new MembersAddAdvView();
});
