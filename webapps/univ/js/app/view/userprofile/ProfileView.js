define(['modernizr', 'cookie', '../../service/DataService', 'validate', '../../Router', '../../Notify', '../../view/admin/AdminView'], function(modernizr, cookie, service, validate, router, notify, admin) {"use strict";

	var ProfileView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var ROLEMAP = {
				'ROLE_TIER1' : 'Owner',
				'ROLE_TIER2' : 'Admin',
				'ROLE_TIER3' : 'Member'
			};

			function ProfileView() {

				function populateData() {
					var DOMAINS = [];
					service.getUserProfile({
						success : function(UserProfile) {
							//OverView Panel Load
							jQuery('#profile-first-name').text(UserProfile.firstName);
							jQuery('#profile-last-name').text(UserProfile.lastName);
							//jQuery('#profile-id').text(UserProfile.id);
							jQuery('#profile-email').text(UserProfile.email);
							jQuery('#profile-phone').text(UserProfile.phoneNumber);
							jQuery('#profile-pending-invites').text(UserProfile.pendingInvitees.length);
							if (!UserProfile.image || UserProfile.image == null) {
								jQuery('#profile-image').attr('src','img/noimg.png');
							}
							else{
								jQuery('#profile-image').attr('src','/zingoare/api/profileupload/picture/' + UserProfile.image.id);
							}
							var template = jQuery('#profile-domain-template').attr('id', '');
							//backupagain
							jQuery('#div-template').append(template.attr('id', 'profile-domain-template'));
							if (UserProfile.domains.length === 1) {
								var activetemplate = template.clone();
								jQuery('.domainlabel', activetemplate).text('Domain');
								jQuery('.profile-domain-list', activetemplate).text(UserProfile.domains[0].domainName + ' : ' + ROLEMAP[UserProfile.domains[0].roleName]);
								jQuery('.profile-domain-list', activetemplate).attr('name', UserProfile.domains[0].domainName);
								jQuery('#profile-form').append(activetemplate);
								DOMAINS.push(UserProfile.domains[0].domainName);
							} else {
								for (var i = 0; i < UserProfile.domains.length; i++) {
									if (DOMAINS.indexOf(UserProfile.domains[i].domainName) === -1) {
										DOMAINS.push(UserProfile.domains[i].domainName);
										var activetemplate = template.clone();
										jQuery('.domainlabel', activetemplate).text('Domain #' + DOMAINS.length);
										jQuery('.profile-domain-list', activetemplate).text(UserProfile.domains[i].domainName + ' : ' + ROLEMAP[UserProfile.domains[i].roleName]);
										jQuery('.profile-domain-list', activetemplate).attr('name', UserProfile.domains[i].domainName);
										jQuery('#profile-form').append(activetemplate);
									} else {
										var value = jQuery(".profile-domain-list[name='" + UserProfile.domains[i].domainName + "']").text();
										value = value + ' , ' + ROLEMAP[UserProfile.domains[i].roleName];
										jQuery(".profile-domain-list[name='" + UserProfile.domains[i].domainName + "']").text(value);
									}
								}
							}
						}
					});
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


				this.pause = function() {

				};

				this.resume = function() {
					populateData();
					document.title = 'Zingoare | Profile Info';
				};

				this.init = function(args) {
					//Check for Cookoverview-manageie before doing any thing.
					//Light weight DOM.
					document.title = 'Zingoare | Profile Info';

					if (checkForActiveCookie() === true) {

						populateData();

						//HTML Event - Actions
						jQuery('#profile-edit-modal-close').on('click', function() {
							router.returnToPrevious();
						});
						jQuery('#profile-edit-button').on('click', function() {
							router.go('/profileedit');
						});

					} // Cookie Guider
				};

			}

			return ProfileView;
		}());

	return new ProfileView();
});
