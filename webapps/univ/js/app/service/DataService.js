define(['jquery', '../Notify', 'cookie', '../Router'], function(jquery, notify, cookie, router) {"use strict";
	// "use strict";

	var DataService = ( function() {

			var ACTIVEDOMAINLIST = [];
			var ACTIVEDOMAINIDLIST = [];
			var DOMAINLIST;
			var USERPROFILE = null;
			var TODOLIST = null;
			var SERVICESLIST = null;
			var USERID;
			var DOMAINMAP = {};

			/**
			 * @constructor
			 * @type {}
			 */
			function DataService() {

				//http://www.wrichards.com/blog/2011/11/jquery-sorting-json-results/
				function sortJsonByStatus(a, b) {
					return a.status.toLowerCase() > b.status.toLowerCase() ? 1 : -1;
				};

				$.ajaxSetup({
					statusCode : {
						401 : function() {
							if (jQuery.cookie('user')) {
								jQuery.removeCookie('user', {
									path : '/'
								});
								jQuery.removeCookie('subuser', {
									path : '/'
								});
								router.go('/home');
								window.setTimeout('location.reload()', 500);
							}
						}
					}

				});

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
					handlers.error();
					// var flickrurl = "http://api.flickr.com/services/feeds/photos_public.gne?tags=" + keyword + "&lang=en-us&format=json";
					// $.ajax({
					// url : flickrurl,
					// type : 'GET',
					// async : 'async',
					// contentType : "application/json",
					// success : function(data) {
					// for (var i = 0; i < 10; i++) {
					// imagelist.push(data.items[i].media.m);
					// }
					// handlers.success(imagelist);
					// },
					// error : function() {
					// handlers.error();
					// }
					// });
				}

				this.getUserProfile = function(handlers) {
					if (!Array.prototype.indexOf) {
						Array.prototype.indexOf = function(elt /*, from*/) {
							var len = this.length >>> 0;

							var from = Number(arguments[1]) || 0;
							from = (from < 0) ? Math.ceil(from) : Math.floor(from);
							if (from < 0)
								from += len;

							for (; from < len; from++) {
								if ( from in this && this[from] === elt)
									return from;
							}
							return -1;
						};
					}
					if (USERPROFILE && USERPROFILE !== null) {
						handlers.success(USERPROFILE);
					} else {
						DOMAINLIST = [];
						ACTIVEDOMAINLIST = [];
						ACTIVEDOMAINIDLIST = [];
						DOMAINMAP = {};
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
									if (ACTIVEDOMAINLIST && ACTIVEDOMAINLIST.indexOf(data.domains[i].domainName) === -1) {
										if (data.domains[i].roleName == 'ROLE_TIER2' || data.domains[i].roleName == 'ROLE_TIER1') {
											ACTIVEDOMAINLIST.push(data.domains[i].domainName);
											ACTIVEDOMAINIDLIST.push(data.domains[i].id);
											DOMAINMAP[data.domains[i].id] = data.domains[i].domainName;
										}
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
						url : '/homeford/api/addmember/' + domainid + '/' + userid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : fname,
							'lastName' : lname,
						}),
						success : function(data) {
							USERPROFILE = null;
							handlers.success(data);
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Adding Member"
							}
							handlers.success(errormsg);
						}
					});
				}
				//Get T1, T2 and T3 privilage
				this.getMembers = function(domain, handlers) {
					$.ajax({
						url : '/homeford/api/getdomainsusers/' + domain,
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
						url : '/homeford/api/getdomainsusers/' + domain,
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
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Sending Invite"
							}
							handlers.success(errormsg);
						}
					});
				}

				this.getInviteStatus = function(domain, handlers) {
					$.ajax({
						url : '/homeford/api/inviteeusers/' + domain,
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
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Accepting Invite"
							}
							handlers.success(errormsg);
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
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Updating Profile"
							}
							handlers.success(errormsg);
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
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Creating Profile"
							}
							handlers.success(errormsg);
						}
					});
				}

				this.AssignToDo = function(domainid, ids, title, desc, priority, startdate, enddate, benefit, url, youtube, handlers) {
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
							'helperUrl' : url,
							'helperYoutube' : youtube
						}),
						success : function(data) {
							USERPROFILE = null;
							TODOLIST = null;
							handlers.success(data);
						}
					});
				};

				this.AssignQuiz = function(domainid, quizid, ids, title, desc, priority, startdate, enddate, benefit, url, youtube, handlers) {
					$.ajax({
						url : '/homeford/api/todo/domain/' + domainid + '/' + quizid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'title' : '@QUIZ' + title,
							'desc' : desc,
							'priority' : priority,
							'percentage' : 0,
							'todoStartDate' : startdate,
							'todoEndDate' : enddate,
							'userIds' : ids,
							'benefit' : benefit,
							'helperUrl' : url,
							'helperYoutube' : youtube
						}),
						success : function(data) {
							USERPROFILE = null;
							TODOLIST = null;
							handlers.success(data);
						}
					});
				};

				this.AddServices = function(domainid, title, desc, cost, tax, freq, status, handlers) {
					var _cost = cost.replace('$', '');
					var _tax = tax.replace('%', '');
					$.ajax({
						url : '/homeford/api/domain/' + domainid + '/itemservice',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'name' : title,
							'description' : desc,
							'status' : status,
							'unit_price' : _cost,
							'minutes' : '0',
							'days' : freq,
							'tax' : _tax,
							'quantity' : '1',
						}),
						success : function(data) {
							SERVICESLIST = null;
							handlers.success(data);
						}
					});
				};
				this.ListAllServices = function(domainid, handlers) {
					if (SERVICESLIST && SERVICESLIST !== null) {
						handlers.success(SERVICESLIST);
					} else {
						$.ajax({
							url : '/homeford/api/domain/' + domainid + '/itemservice',
							type : 'GET',
							async : 'async',
							contentType : "application/json",
							success : function(data) {
								SERVICESLIST = data;
								handlers.success(data);
							}
						});
					}
				};
				this.UpdateServices = function(serviceid, title, desc, cost, tax, freq, status, handlers) {
					var _cost = cost.replace('$', '');
					var _tax = tax.replace('%', '');
					$.ajax({
						url : '/homeford/api/itemservice/' + serviceid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'name' : title,
							'description' : desc,
							'status' : status,
							'unit_price' : _cost,
							'minutes' : '0',
							'days' : freq,
							'tax' : _tax,
							'quantity' : '1',
						}),
						success : function(data) {
							SERVICESLIST = null;
							handlers.success(data);
						}
					});
				};

				this.AddQuiz = function(domainid, title, desc, handlers) {
					$.ajax({
						url : '/homeford/api/domain/' + domainid + '/quiz',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'name' : title,
							'description' : desc,
						}),
						success : function(data) {
							//USERPROFILE = null;
							handlers.success(data);
						}
					});
				};

				this.setQuestion = function(quizid, category, question, answers, handlers) {
					var categoryint = parseInt(category);
					$.ajax({
						url : '/homeford/api/quiz/' + quizid + '/question',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'category' : categoryint,
							'text' : question,
							'answers' : answers
						}),
						success : function(data) {
							//USERPROFILE = null;
							handlers.success(data);
						}
					});
				};

				this.DomainToDoList = function(domainid, handlers) {
					if (TODOLIST && TODOLIST !== null) {
						handlers.success(TODOLIST);
					} else {
						$.ajax({
							url : '/homeford/api/todogroup/domain/' + domainid,
							type : 'GET',
							async : 'async',
							contentType : "application/json",
							success : function(data) {
								handlers.success(data);
							}
						});
					}
				};

				this.DomainQuizList = function(domainid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/homeford/api/domain/' + domainid + '/quiz',
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.QuestionsList = function(todoid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/homeford/api/quiz/todo/question/' + todoid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.QuestionsListOnly = function(quizid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/homeford/api/quiz/' + quizid + '/question',
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}

				this.QuizProgressSave = function(todoid, questionid, answerid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/homeford/api/quiz/question/' + todoid + '/' + questionid + '/' + answerid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							TODOLIST = null;
							handlers.success(data);
						}
					});
				}

				this.MemberToDoList = function(domainid, memberid, handlers) {
					$.ajax({
						url : '/homeford/api/todo/domain/' + domainid + '/' + memberid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						},
						error : function(e) {
							handlers.success(e);
						}
					});
				}

				this.updateToDo = function(todoid, progress, date, comments, handlers) {
					$.ajax({
						url : '/homeford/api/todo/' + todoid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'percentage' : progress,
							'comments' : comments
						}),
						success : function(data) {
							TODOLIST = null;
							handlers.success(data);
						}
					});
				}

				this.updateProfilePhoto = function(userid, handlers) {
					$.ajax({
						url : '/homeford/api/profileupload/' + userid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				}

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
				function _passiveUserProfile() {

				}

				//Getter and Setters
				this.returnDomainList = function() {
					return ACTIVEDOMAINLIST;
				}
				//To vall a function from a diff view
				this.ViewCall = function(viewname, functionname, value) {
					viewname.functionname(value);
				}

				this.returnDomainIDList = function(handlers) {
					//To facilite passive loading
					if (ACTIVEDOMAINIDLIST.length == 0) {
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
										if (data.domains[i].roleName == 'ROLE_TIER2' || data.domains[i].roleName == 'ROLE_TIER1') {
											ACTIVEDOMAINLIST.push(data.domains[i].domainName);
											ACTIVEDOMAINIDLIST.push(data.domains[i].id);
										}
									}
									handlers.success(ACTIVEDOMAINIDLIST);
								}
							}
						});
					} else {
						handlers.success(ACTIVEDOMAINIDLIST);
					}

				}

				this.domainIDtoName = function(id) {
					return DOMAINMAP[id];
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

				this.knowClenUserProfile = function() {
					return USERPROFILE;
				}

				this.pause = function() {
					// No implementation needed for this here.
				};

				this.resume = function() {
					// No implementation needed for this here.
				};

				this.init = function() {
					//Support IE8 indesOf Issue:
					//http://stackoverflow.com/questions/3629183/why-doesnt-indexof-work-on-an-array-ie8
					if (!Array.prototype.indexOf) {
						Array.prototype.indexOf = function(elt /*, from*/) {
							var len = this.length >>> 0;

							var from = Number(arguments[1]) || 0;
							from = (from < 0) ? Math.ceil(from) : Math.floor(from);
							if (from < 0)
								from += len;

							for (; from < len; from++) {
								if ( from in this && this[from] === elt)
									return from;
							}
							return -1;
						};
					}
					//this.resume();
				};
			}

			return new DataService();
		}());

	return DataService;
});
