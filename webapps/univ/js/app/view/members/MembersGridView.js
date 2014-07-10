define(['cookie', '../../service/DataService', 'validate', 'tablesorter', '../../Router', '../../Notify', '../../view/admin/AdminView', '../../view/members/MembersEditView'], function(cookie, service, validate, tablesorter, router, notify, admin, membersedit) {"use strict";

	var MembersGridView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var MALEICON = '<i class="icon-male  icon-1x "></i>';
			var FEMALEICON = '<i class="icon-female  icon-1x "></i>';
			var KEYICON = '<i class="icon-key  icon-1x "></i>';
			var membernames = [];
			var template;
			var gridbreaktemplate;

			function MembersGridView() {

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

				//http://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
				function toTitleCase(str) {
					return str.replace(/\w\S*/g, function(txt) {
						return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
					});
				}

				function populateData() {
					var activedomains = [];
					activedomains.push(service.domainNametoID(jQuery.cookie('subuser')));
					getDomainMembers(activedomains);
				}

				function getDomainMembers(activedomains) {
					jQuery('#invite-domain').empty();
					jQuery('.edit-card-canvas').empty();
					membernames = [];
					var memberscount = 0;
					for (var i = 0; i < activedomains.length; i++) {
						service.getDomainMembers(activedomains[i], {
							success : function(data) {
								var thisitem = template.clone();
								for (var j = 0; j < data.length; j++) {
									var thisitem = template.clone();
									var thispartition = gridbreaktemplate.clone();
									jQuery('.tag', thispartition).text('Family-' + (j + 1));
									jQuery('.edit-card-canvas').append(thispartition);
									if ((data[j].firstName === 'null' || data[j].firstName == null || data[j].firstName === "" ) && (data[j].lastName === 'null' || data[j].lastName == null || data[j].lastName === "")) {
										jQuery('.membercard-name', thisitem).text((data[j].email));
									} else {
										jQuery('.membercard-name', thisitem).text(data[j].firstName + ' ' + data[j].lastName).attr('fn', data[j].firstName).attr('ln', data[j].lastName).attr('memberid', data[j].id).attr('email', data[j].email).attr('kioskpin', data[j].kioskPassword);
									}
									var kidsalutation = data[j].firstName;
									membernames.push(jQuery('.membercard-name', thisitem).text());
									if (data[j].image && data[j].image.name != null) {
										jQuery('.members-image', thisitem).attr('src', '/zingoare/api/profileupload/picture/' + data[j].image.id);
									} else {
										jQuery('.members-image', thisitem).attr('src', 'img/noimg.png');
									}
									jQuery('.membercard-category', thisitem).text('Student');
									jQuery('.membercard-rel', thisitem).text('');
									var grpname = 'grp' + j;
									jQuery(thisitem).addClass(grpname).attr('group', grpname);
									jQuery('.edit-card-canvas').append(thisitem);
									for (var k = 0; k < data[j].parents.length; k++) {
										var thisitemparent = template.clone();
										if ((data[j].parents[k].firstName === 'null' || data[j].parents[k].firstName == null || data[j].parents[k].firstName === "" ) && (data[j].parents[k].lastName === 'null' || data[j].parents[k].lastName == null || data[j].parents[k].lastName === "")) {
											jQuery('.membercard-name', thisitemparent).text((data[j].parents[k].email).split('@')[0]).attr('memberid', data[j].parents[k].id).attr('email', data[j].parents[k].email).attr('kioskpin', data[j].parents[k].kioskPassword);
										} else {
											jQuery('.membercard-name', thisitemparent).text(data[j].parents[k].firstName + ' ' + data[j].parents[k].lastName).attr('fn', data[j].parents[k].firstName).attr('ln', data[j].parents[k].lastName).attr('memberid', data[j].parents[k].id).attr('email', data[j].parents[k].email).attr('kioskpin', data[j].parents[k].kioskPassword);
										}
										membernames.push(jQuery('.membercard-name', thisitemparent).text());
										if (data[j].parents[k].image && data[j].parents[k].image.name != null) {
											jQuery('.members-image', thisitemparent).attr('src', '/zingoare/api/profileupload/picture/' + data[j].parents[k].image.id);
										} else {
											jQuery('.members-image', thisitemparent).attr('src', 'img/noimg.png');
										}
										//jQuery('.membercard-category', thisitemparent).text(kidsalutation + "'s "+toTitleCase(data[j].parents[k].userType));
										jQuery('.membercard-category', thisitemparent).html(toTitleCase(data[j].parents[k].userType) + ' ' + KEYICON + ' ' + data[j].parents[k].kioskPassword);
										jQuery('.membercard-rel', thisitemparent).text('');
										var grpname = 'grp' + j;
										jQuery(thisitemparent).addClass(grpname).attr('group', grpname);
										jQuery('.edit-card-canvas').append(thisitemparent);
									}
									if (j === data.length - 1) {
										$(".card-search").autocomplete({
											source : function(request, response) {
												var results = $.ui.autocomplete.filter(membernames, request.term);
												response(results.slice(0, 5));
											}
										});
										// jQuery('.membercard-name').ellipsis({
										// onlyFullWords : true
										// });
										activateEvents();
									}
								}
							}
						});
					}
				}

				function activateEvents() {
					var rowObject = {
						firstname : "none",
						lastname : "none",
						security : 'none',
						relation : 'Related',
						invitedby : 'none',
						status : 'none',
						domain : 'none',
						courses : 'none',
						email : '',
						id : 'none',
						kioskpin : 'No Pin Available - Go to profile and set one.',
						image : 'img/noimg.png',
					};

					jQuery('.membercard').hover(function() {
						jQuery('.membercard').removeClass('active');
						var group = $(this).attr('group');
						var groupclass = '.' + group;
						$(groupclass).addClass('active');
					});

					jQuery('.membercard').click(function() {
						if ($(this).hasClass('active')) {
							//$(this).removeClass('active');
							rowObject.firstname = jQuery(this).find('.membercard-name').attr('fn');
							rowObject.lastname = jQuery(this).find('.membercard-name').attr('ln');
							rowObject.relation = jQuery(this).find('.membercard-category').text().split(' ')[0];
							rowObject.kioskpin = jQuery(this).find('.membercard-name').attr('kioskpin');
							rowObject.id = jQuery(this).find('.membercard-name').attr('memberid');
							if (jQuery(this).find('.membercard-name').attr('email') !== 'null') {
								rowObject.email = jQuery(this).find('.membercard-name').attr('email');
							}
							if (jQuery(this).find('.members-image').attr('src') !== "img/noimg.png") {
								rowObject.image = jQuery(this).find('.members-image').attr('src');
							}
							membersedit.setMemberInfo(rowObject);
							router.go('/memberslistedit');
						} else {
							jQuery('.membercard').removeClass('active');
							var group = $(this).attr('group');
							var groupclass = '.' + group;
							$(groupclass).addClass('active');
						}
					});

					jQuery('.card-search').change(function(event) {
						var searchword = jQuery('.card-search').val().toUpperCase();
						if (searchword.length > 0) {
							jQuery('.canvas-partition').hide();
						} else {
							jQuery('.canvas-partition').show();
						}
						var cardlist = jQuery('.edit-card-canvas .membercard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.toUpperCase().indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
						}
					});
					jQuery('.ui-menu-item').click(function(event) {
						var searchword = jQuery('.card-search').val().toUpperCase();
						if (searchword.length > 0) {
							jQuery('.canvas-partition').hide();
						} else {
							jQuery('.canvas-partition').show();
						}
						var cardlist = jQuery('.edit-card-canvas .membercard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.toUpperCase().indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
						}
					});
					jQuery('.card-search').keyup(function(event) {
						var searchword = jQuery('.card-search').val().toUpperCase();
						if (searchword.length > 0) {
							jQuery('.canvas-partition').hide();
						} else {
							jQuery('.canvas-partition').show();
						}
						var cardlist = jQuery('.edit-card-canvas .membercard-name');
						for (var i = 0; i < cardlist.length; i++) {
							var thiscard = cardlist[i];
							thiscard.parentElement.style.display = '';
							if (thiscard.textContent.toUpperCase().indexOf(searchword) != -1) {
								//thiscard.parentElement.stlye.display = '';
							} else {
								thiscard.parentElement.style.display = 'none';
							}
						}
					});
				}

				function clearForm() {

				}


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Members Grid';
				};

				this.init = function(args) {
					//Check for Cooke before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Members Grid';

					if (checkForActiveCookie() === true) {
						template = jQuery('#member-template').remove().attr('id', '');
						gridbreaktemplate = jQuery('#canvas-partition').remove().attr('id', '');
						populateData();

						//HTML Event - Actions
						jQuery('.modal_close').on('click', function() {
							router.returnToPrevious();
						});

					} // Cookie Guider
				};

			}

			return MembersGridView;
		}());

	return new MembersGridView();
});
