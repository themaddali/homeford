define(['jquery', '../Notify'], function(jquery, notify) {"use strict";
	// "use strict";

	var DataService = ( function() {

			var ACTIVEDOMAINLIST = [];
			var ACTIVEDOMAINIDLIST = [];
			var DOMAINLIST;
			var USERPROFILE = null;
			var USERID;

			/**
			 * @constructor
			 * @type {}
			 */
			function DataService() {

				//http://www.wrichards.com/blog/2011/11/jquery-sorting-json-results/
				function sortJsonByStatus(a, b) {
					return a.status.toLowerCase() > b.status.toLowerCase() ? 1 : -1;
				};

				/**
				 * @public
				 */

				this.getUnivObject = function(handlers) {
					$.getJSON("data/loginresponse.json", function(json) {
						if (json) {
							handlers.success(json);
						} else {
							handlers.success('Error');
						}
					});
				}
				function jsonFlickrFeed(o) {
					var imagelist = [];
					for (var i = 0; i < 3; i++) {
						var imageurl = o.items[i].media.m;
						imageurl = imageurl.replace('_m.jpg', '_b.jpg');
						imagelist.push(imageurl);
					}
					return imagelist;
				}


				this.getFlickList = function(keyword, handlers) {

					var flickrurl = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + keyword + "&lang=en-us&format=json";
					$.ajax({
						url : flickrurl,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							for (var i = 0; i < 10; i++) {
								imagelist.push(data.items[i].media.m);
							}
							handlers.success(imagelist);
						},
						error : function() {
							handlers.error();
						}
					});
				}

				this.getUserProfile = function(handlers) {
					if (USERPROFILE && USERPROFILE !== null) {
						handlers.success(USERPROFILE);
					} else {
						DOMAINLIST = [];
						$.ajax({
							url : '/homeford/api/userprofile',
							type : 'GET',
							async : 'async',
							contentType : "application/json",
							success : function(data) {
								listenPendingInvites(data.pendingInvitees);
								USERPROFILE = data;
								USERID = data.id;
								for (var i = 0; i < data.domains.length; i++) {
									if (ACTIVEDOMAINLIST.indexOf(data.domains[i].domainName) === -1) {
										ACTIVEDOMAINLIST.push(data.domains[i].domainName);
									}
									if (ACTIVEDOMAINIDLIST.indexOf(data.domains[i].domainName) === -1) {
										ACTIVEDOMAINIDLIST.push(data.domains[i].id);
									}
								}
								handlers.success(data);
							}
						});
					}
				}
				//ListenPending Invites
				function listenPendingInvites(invitesarray) {
					if (invitesarray.length > 0) {
						setTimeout(function() {
							notify.showMessage('INFO', 'Pending Invitation', invitesarray, 'Accept', 'notifications');
						}, 3000);
						//Check after 3 seconds. Cooling time
					}
				}
				
				this.addMemberRegular = function(domainid, userid, fname, lname, handlers) {
					$.ajax({
						url : '/homeford/api/addmember/' + domainid +'/'+ userid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : fname,
							'lastName' : lname,
						}),
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				//Get T1, T2 and T3 privilage
				this.getMembers = function(domain, handlers) {
					$.ajax({
						url : '/homeford/api/getdomainsusers?domainname=' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}
				//Get T3 privilage
				this.getMembersOnly = function(domain, handlers) {
					$.ajax({
						url : '/homeford/api/getdomainsusers?domainname=' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(getmembersonly(data));
						}
					});
				}
				function getmembersonly(data) {
					var membersdata = [];
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < data[i].roles.length; j++) {
							if (data[i].roles[j].roleName === 'ROLE_TIER3') {
								membersdata.push(data[i]);
							}
						}
						if (i === data.length - 1) {
							return membersdata;
						}
					}
				}


				this.sendInvite = function(email, message, domain, roles, handlers) {
					$.ajax({
						url : '/homeford/api/invitee',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'email' : email,
							'text' : message,
							'domainName' : domain,
							'roles' : roles
						}),
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.getInviteStatus = function(domain, handlers) {
					$.ajax({
						url : '/homeford/api/inviteeusers?domainname=' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data.sort(sortJsonByStatus));
						}
					});
				}

				this.acceptInvite = function(id, handlers) {
					$.ajax({
						url : '/homeford/api/acceptinvitee?id=' + id,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.setUserProfile = function(id, firstname, lastname, email, phone, handlers) {
					$.ajax({
						url : '/homeford/api/userprofile/' + id,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : firstname,
							'lastName' : lastname,
							'phoneNumber' : phone,
							'email' : email
						}),
						success : function(data) {
							USERPROFILE = null;
							handlers.success(data);
						}
					});
				}

				this.registerNewUser = function(username, password, domain, handlers) {
					$.ajax({
						url : '/homeford/api/signup',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'password' : password,
							'email' : username,
							"domain" : {
								"domainName" : domain,
								"isPublic" : true,
								"autoJoin" : true
							}
						}),
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.AssignToDo = function(domainid, ids, title, desc, priority, startdate, enddate,benefit, url, youtube, handlers) {
					$.ajax({
						url : '/homeford/api/todo/domain/' + domainid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'title' : title,
							'desc' : desc,
							'priority' : priority,
							'percentage' : 0,
							'todoStartDate' : startdate,
							'todoEndDate' : enddate,
							'userIds' : ids,
							'benefit' : benefit,
							'helper_url' : url,
							'helper_youtube': youtube
						}),
						success : function(data) {
							handlers.success(data);
						}
					});
				};
				
				this.DomainToDoList = function(domainid,handlers) {
					$.ajax({
						url : '/homeford/api/todo/domain/' + domainid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				this.Login = function(username, password, handlers) {
					$.ajax({
						url : '/homeford/j_spring_security_check',
						type : 'POST',
						async : 'async',
						data : 'j_username=' + username + '&j_password=' + password,
						success : function(data) {
							handlers.success(data);
						},
						error : function(data) {
							handlers.success('error');
						}
					});
				}
				this.Logout = function(handlers) {
					$.ajax({
						url : '/homeford/j_spring_security_logout',
						type : 'POST',
						async : 'async',
						success : function(data) {
							handlers.success(data);
						},
						error : function(data) {
							handlers.success('error');
						}
					});
				}

				this.getStudentObject = function(studentid, handlers) {
					var thisURL;
					if (studentid !== 'Doug Stamper') {
						thisURL = "data/studentinfo-four.json;"
					} else {
						thisURL = "data/studentinfo-one.json;"
					}
					$.getJSON(thisURL, function(json) {
						if (json) {
							handlers.success(json);
						} else {
							handlers.success('Error');
						}
					});
				}

				this.validateEntity = function(entity, handlers) {
					$.ajax({
						url : '/homeford/api/getdomain?domainname=' + entity,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.entityList = function(handlers) {
					if (DOMAINLIST) {
						handlers.success(DOMAINLIST);
					} else {
						$.ajax({
							url : '/homeford/api/getpublicdomains',
							type : 'GET',
							async : 'async',
							contentType : "application/json",
							success : function(data) {
								var justList = [];
								for (var i = 0; i < data.length; i++) {
									justList.push(data[i].domainName);
									if (i === data.length - 1) {
										DOMAINLIST = justList;
										handlers.success(justList);
									}
								}

							}
						});
					}
				}
				//Getter and Setters
				this.returnDomainList = function() {
					return ACTIVEDOMAINLIST;
				}
				this.returnDomainIDList = function() {
					return ACTIVEDOMAINIDLIST;
				}
				this.returnEntitiesList = function() {
					return DOMAINLIST;
				}
				
				this.thisuserID = function() {
					return USERID;
				}
				
				this.cleanUserProfile = function() {
					USERPROFILE = null;
				}

				this.pause = function() {
					// No implementation needed for this here.
				};

				this.resume = function() {
					// No implementation needed for this here.
				};

				this.init = function() {
					//getUnivData();
					this.resume();
				};
			}

			return new DataService();
		}());

	return DataService;
});
