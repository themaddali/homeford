define(['jquery', '../Notify', 'cookie', '../Router'], function(jquery, notify, cookie, router) {"use strict";
	// "use strict";

	var DataService = ( function() {

			var ACTIVEDOMAINLIST = [];
			var ACTIVEDOMAINIDLIST = [];
			var ACTIVEOWNDOMAINSIDLIST = [];
			var DOMAINLIST;
			var USERPROFILE = null;
			var TODOLIST = null;
			var SERVICESLIST = null;
			var USERID;
			var DOMAINMAP = {};
			var DOMAINIDNAME = [];
			var FLICKRMAP = {
				'California' : 'Golden Gate',
				'Washnigton' : 'Sky Needle',
				'Alabama' : 'Space and Rocket Center',
				'Alaska' : 'Klondike Gold Rush',
				'Arizona' : 'Grand Canyon',
				'Arkansas' : 'Hot Springs',
				'Colorado' : 'Rocky Mountain',
				'Florida' : 'Disney World',
				'Georgia' : 'Stone Mountain Park',
				'Illinois' : 'Chicago Navy Pier',
				'Minnesota' : 'Mall of America',
				'Montana' : 'Yellow Stone',
				'Nevada' : 'Las Vegas Strip',
				'New York' : 'Times Square',
				'North Carolina' : 'Blue Ridge Parkway',
				'Oregon' : 'Crater Lake',
				'Texas' : 'Dallas Sky Line',
			};

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
					// // Location based images - Disabled for now.
					// $.getJSON('https://freegeoip.net/json/', function(location) {
					// keyword = FLICKRMAP[location.region_name];
					// if (!keyword) {
					// keyword = location.country_name;
					// }
					// var imagelist = [];
					// var flickrurl = "https://api.flickr.com/services/feeds/photos_public.gne?tags=" + keyword + "&lang=en-us&format=json&jsoncallback=?";
					// $.getJSON(flickrurl, function(data) {
					// $.each(data.items, function(i, item) {
					//
					// //$("<img/>").attr("src", item.media.m).appendTo("#FlickrImages ul").wrap("<li><a href='" + item.link + "' target='_blank' title='Flickr'></a></li>");
					// for (var i = 0; i < 3; i++) {
					// var imageurl = data.items[i].media.m;
					// imageurl = imageurl.replace('_m.jpg', '_b.jpg');
					// imagelist.push(imageurl);
					// }
					// handlers.success(imagelist);
					// });
					// });
					// });

				};

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
						DOMAINIDNAME = [];
						ACTIVEDOMAINLIST = [];
						ACTIVEDOMAINIDLIST = [];
						ACTIVEOWNDOMAINSIDLIST = [];
						DOMAINMAP = {};
						$.ajax({
							url : '/zingoare/api/userprofile',
							type : 'GET',
							async : 'async',
							contentType : "application/json",
							success : function(data) {
								listenPendingInvites(data.pendingInvitees);
								if (!jQuery.cookie('_did')) {
									jQuery.cookie('_did', data.domains[0].id, {
										expires : 100,
										path : '/'
									});
								}
								USERPROFILE = data;
								USERID = data.id;
								for (var i = 0; i < data.domains.length; i++) {
									if (ACTIVEDOMAINLIST && ACTIVEDOMAINLIST.indexOf(data.domains[i].domainName) === -1) {
										//if (data.domains[i].roleName == 'ROLE_TIER2' || data.domains[i].roleName == 'ROLE_TIER1') {
										var domaininfo = {};
										domaininfo.id = data.domains[i].id;
										domaininfo.name = data.domains[i].domainName;
										DOMAINIDNAME.push(domaininfo);
										if (data.domains[i].roleName == 'ROLE_TIER1') {
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
				};
				//ListenPending Invites
				function listenPendingInvites(invitesarray) {
					if (invitesarray.length > 0) {
						setTimeout(function() {
							notify.showMessage('INFO', 'Pending Invitation', invitesarray, 'Accept', 'notifications');
						}, 3000);
						//Check after 3 seconds. Cooling time
					}
				}


				this.getDomainProfile = function(domainid, handlers) {
					$.ajax({
						url : '/zingoare/api/getdomaindetails/' + domainid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				this.setDomainProfile = function(domainid, domainDesc1, domainDesc2, domainThanksMessage, domainobj, paymentobj, handlers) {
					$.ajax({
						url : '/zingoare/api/updatedomainprofile/' + domainid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'domainDesc1' : domainDesc1,
							'domainDesc2' : domainDesc2,
							'domainThanksMessage' : domainThanksMessage,
							'addresses' : domainobj,
							'billingInfo' : paymentobj,
							'id' : parseInt(domainid)
						}),
						success : function(data) {
							handlers.success(data);
						}
					});

				};

				this.knowServices = function(memberid, handlers) {

				};

				this.addMemberRegular = function(domainid, userid, fname, lname, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/addmember/' + domainid + '/' + userid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : fname,
							'lastName' : lname,
						}),
						success : function(data) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							USERPROFILE = null;
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Adding Member"
							};
							handlers.success(errormsg);
						}
					});
				};

				this.registerKids = function(domainid, memberobj, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/registerkids/' + domainid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify(memberobj),
						success : function(data) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							USERPROFILE = null;
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Adding Member"
							};
							handlers.success(errormsg);
						}
					});
				};

				//Active and inactive kids
				this.disableUser = function(domainid, memberid, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/disableUser/' + domainid+'/'+memberid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Updating Memner Status"
							};
							handlers.success(errormsg);
						}
					});
				};
				
				this.enableUser = function(domainid, memberid, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/enableUser/' + domainid+'/'+memberid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Updating Memner Status"
							};
							handlers.success(errormsg);
						}
					});
				};

				this.checkIn = function(domainid, parentid, kidid, notes, handlers) {
					//$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/addkiosk/' + domainid + '/' + parentid + '/' + kidid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'notes' : notes,
							'type' : 'CHECKIN',
						}),
						success : function(data) {
							//handlers.success(getmembersonly(data));
							$('input[type="button"]').removeAttr('disabled');
							//$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.checkOut = function(domainid, parentid, kidid, actionid, notes, handlers) {
					//$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/addkiosk/' + domainid + '/' + parentid + '/' + kidid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'notes' : notes,
							'type' : 'CHECKOUT',
							'id' : actionid
						}),
						success : function(data) {
							//handlers.success(getmembersonly(data));
							$('input[type="button"]').removeAttr('disabled');
							//$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.checkInStats = function(domainid, handlers) {
					$.ajax({
						url : '/zingoare/api/getkiosk/' + domainid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				//For a range - Reporting
				this.checkInStatsbyDate = function(domainid, fromdate, todate, handlers) {
					$.ajax({
						url : '/zingoare/api/getkioskbydate/' + domainid + '?fromDate=' + fromdate + '&toDate=' + todate,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				//Get T1, T2 and T3 privilage
				this.getMembers = function(domain, handlers) {
					$.ajax({
						url : '/zingoare/api/getdomainsusers/' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				//Get members will relations
				this.getDomainMembers = function(domain, handlers) {
					$.ajax({
						url : '/zingoare/api/getdomainmembers/' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				//Get T3 privilage
				this.getMembersOnly = function(domain, handlers) {
					$.ajax({
						url : '/zingoare/api/getdomainsusers/' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							//handlers.success(getmembersonly(data));
							handlers.success(data);
						}
					});
				};
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
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/invitee',
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
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Sending Invite"
							};
							handlers.success(errormsg);
						}
					});
				};

				this.getInviteStatus = function(domain, handlers) {
					$.ajax({
						url : '/zingoare/api/inviteeusers/' + domain,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data.sort(sortJsonByStatus));
						}
					});
				};

				this.acceptInvite = function(id, handlers) {
					$.ajax({
						url : '/zingoare/api/acceptinvitee?id=' + id,
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
							};
							handlers.success(errormsg);
						}
					});
				};

				this.setUserProfile = function(id, firstname, lastname, email, phone, kioskpin, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/userprofile/' + id,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : firstname,
							'lastName' : lastname,
							'phoneNumber' : phone,
							'email' : email,
							'kioskPassword' : kioskpin,
						}),
						success : function(data) {
							USERPROFILE = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Updating Profile"
							};
							handlers.success(errormsg);
						}
					});
				};

				this.setUserProfileWithPassword = function(id, firstname, lastname, email, password, phone, kioskpin, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/userprofile/' + id,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : firstname,
							'lastName' : lastname,
							'phoneNumber' : phone,
							'email' : email,
							'password' : password,
							'kioskPassword' : kioskpin,
						}),
						success : function(data) {
							USERPROFILE = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Updating Profile"
							};
							handlers.success(errormsg);
						}
					});
				};

				this.setUserProfileOnly = function(id, firstname, lastname, email, phone, kioskpin, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/userprofile/' + id,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'firstName' : firstname,
							'lastName' : lastname,
							'phoneNumber' : phone,
							'email' : email,
							'kioskPassword' : kioskpin,
						}),
						success : function(data) {
							USERPROFILE = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Updating Profile"
							};
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(errormsg);
						}
					});
				};

				this.generateInvoice = function(_domainid, _userid, duedate, total, items, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/invoice/user/' + _domainid + '/' + _userid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'dueDate' : duedate,
							'grandTotal' : total,
							'invoiceItems' : items,
						}),
						success : function(data) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Generating Invoice"
							};
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(errormsg);
						}
					});
				};

				this.getAllInvoices = function(_domainid, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/invoice/domain/' + _domainid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Getting Invoices"
							};
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(errormsg);
						}
					});
				};

				this.registerNewUser = function(username, password, domain, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/signup',
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
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						},
						error : function(e) {
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							var errormsg = {
								"status" : "error",
								"message" : e.statusText + " - Error Creating Profile"
							};
							handlers.success(errormsg);
						}
					});
				};

				this.AssignToDo = function(domainid, ids, title, desc, priority, startdate, enddate, benefit, url, youtube, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/todo/domain/' + domainid,
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
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.AssignInvoice = function(domainid, ids, title, desc, priority, startdate, enddate, benefit, url, youtube, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/todo/domain/' + domainid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'title' : '@BILL' + title,
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
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.AssignQuiz = function(domainid, quizid, ids, title, desc, priority, startdate, enddate, benefit, url, youtube, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/todo/domain/' + domainid + '/' + quizid,
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
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.AddServices = function(domainid, title, desc, cost, tax, freq, sstart, send, status, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					var _cost = cost.replace('$', '');
					var _tax = tax.replace('%', '');
					$.ajax({
						url : '/zingoare/api/domain/' + domainid + '/itemservice',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'name' : title,
							'description' : desc,
							'status' : status,
							'unit_price' : _cost,
							'minutes' : '0',
							// 'days' : freq,
							'days' : 0,
							'tax' : _tax,
							'quantity' : '1',
							"startTime" : sstart,
							"endTime" : send,
						}),
						success : function(data) {
							SERVICESLIST = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};
				this.ListAllServices = function(domainid, handlers) {
					if (SERVICESLIST && SERVICESLIST !== null) {
						handlers.success(SERVICESLIST);
					} else {
						$.ajax({
							url : '/zingoare/api/domain/' + domainid + '/itemservice',
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
				this.UpdateServices = function(serviceid, title, desc, sstart, send, cost, tax, freq, status, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					var _cost = cost.replace('$', '');
					var _tax = tax.replace('%', '');
					$.ajax({
						url : '/zingoare/api/itemservice/' + serviceid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'name' : title,
							'description' : desc,
							'status' : status,
							'unit_price' : _cost,
							'minutes' : '0',
							'days' : 0,
							'tax' : _tax,
							'quantity' : '1',
							"startTime" : sstart,
							"endTime" : send,
						}),
						success : function(data) {
							SERVICESLIST = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};
				this.AssignService = function(domainid, kidsids, serviceids, deleteItemServicesIds, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/domain/' + domainid + '/additemservices',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'kidsIds' : kidsids,
							'itemServicesIds' : serviceids,
							'deleteItemServicesIds' : deleteItemServicesIds,
						}),
						success : function(data) {
							SERVICESLIST = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.AddQuiz = function(domainid, title, desc, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/domain/' + domainid + '/quiz',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'name' : title,
							'description' : desc,
						}),
						success : function(data) {
							//USERPROFILE = null;
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.setQuestion = function(quizid, category, question, answers, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					var categoryint = parseInt(category);
					$.ajax({
						url : '/zingoare/api/quiz/' + quizid + '/question',
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
							$('input[type="button"]').removeAttr('disabled');
							$('input[type="button"]').removeClass('processing');
							handlers.success(data);
						}
					});
				};

				this.DomainToDoList = function(domainid, handlers) {
					if (TODOLIST && TODOLIST !== null) {
						handlers.success(TODOLIST);
					} else {
						$.ajax({
							url : '/zingoare/api/todogroup/domain/' + domainid,
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
						url : '/zingoare/api/domain/' + domainid + '/quiz',
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				this.QuestionsList = function(todoid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/zingoare/api/quiz/todo/question/' + todoid,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				this.QuestionsListOnly = function(quizid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/zingoare/api/quiz/' + quizid + '/question',
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				this.QuizProgressSave = function(todoid, questionid, answerid, handlers) {
					var QUIZOBJ = [];
					$.ajax({
						url : '/zingoare/api/quiz/question/' + todoid + '/' + questionid + '/' + answerid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							TODOLIST = null;
							USERPROFILE = null;
							handlers.success(data);
						}
					});
				};

				this.MemberToDoList = function(domainid, memberid, handlers) {
					$.ajax({
						url : '/zingoare/api/todo/domain/' + domainid + '/' + memberid,
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
				};

				this.updateToDo = function(todoid, progress, date, comments, handlers) {
					$.ajax({
						url : '/zingoare/api/todo/' + todoid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'percentage' : progress,
							'comments' : comments
						}),
						success : function(data) {
							TODOLIST = null;
							USERPROFILE = null;
							handlers.success(data);
						}
					});
				};

				this.updateProfilePhoto = function(userid, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/api/profileupload/' + userid,
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							$('input[type="button"]').removeClass('processing');
							$('input[type="button"]').removeAttr('disabled');
							handlers.success(data);
							USERPROFILE = null;
						}
					});
				};

				this.Login = function(username, password, handlers) {
					$('input[type="button"]').addClass('processing');
					$('input[type="button"]').attr('disabled', 'disabled');
					$.ajax({
						url : '/zingoare/j_spring_security_check',
						type : 'POST',
						async : 'async',
						data : 'j_username=' + username + '&j_password=' + password,
						success : function(data) {
							$('input[type="button"]').removeClass('processing');
							$('input[type="button"]').removeAttr('disabled');
							handlers.success(data);
						},
						error : function(data) {
							$('input[type="button"]').removeClass('processing');
							$('input[type="button"]').removeAttr('disabled');
							handlers.success('error');
						}
					});
				};
				this.Logout = function(handlers) {
					$.ajax({
						url : '/zingoare/j_spring_security_logout',
						type : 'POST',
						async : 'async',
						success : function(data) {
							handlers.success(data);
						},
						error : function(data) {
							handlers.success('error');
						}
					});
				};

				this.validateEntity = function(entity, handlers) {
					$.ajax({
						url : '/zingoare/api/getdomain?domainname=' + entity,
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
				};

				this.entityList = function(handlers) {
					if (DOMAINLIST) {
						handlers.success(DOMAINLIST);
					} else {
						$.ajax({
							url : '/zingoare/api/getpublicdomains',
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
				};

				//Getter and Setters
				this.returnDomainList = function() {
					return ACTIVEDOMAINLIST;
				};
				//To vall a function from a diff view
				this.ViewCall = function(viewname, functionname, value) {
					viewname.functionname(value);
				};

				this.returnDomainIDList = function(handlers) {
					//To facilite passive loading
					if (ACTIVEDOMAINIDLIST.length == 0) {
						$.ajax({
							url : '/zingoare/api/userprofile',
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
											// if (data.domains[i].roleName == 'ROLE_TIER1') {
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
				};

				this.returnOwnerDomainIDList = function(handlers) {
					//To facilite passive loading
					if (ACTIVEOWNDOMAINSIDLIST.length == 0) {
						$.ajax({
							url : '/zingoare/api/userprofile',
							type : 'GET',
							async : 'async',
							contentType : "application/json",
							success : function(data) {
								USERPROFILE = data;
								USERID = data.id;
								for (var i = 0; i < data.domains.length; i++) {
									if (data.domains[i].roleName == 'ROLE_TIER1') {
										ACTIVEOWNDOMAINSIDLIST.push(data.domains[i].id);
									}
									if (i === data.domains.length - 1) {
										handlers.success(ACTIVEOWNDOMAINSIDLIST);
									}
								}
							}
						});
					} else {
						handlers.success(ACTIVEOWNDOMAINSIDLIST);
					}
				};

				this.domainIDtoName = function(id) {
					return DOMAINMAP[id];
				};
				this.domainNametoID = function(name) {
					for (var i = 0; i < DOMAINIDNAME.length; i++) {
						if (name === DOMAINIDNAME[i].name) {
							return DOMAINIDNAME[i].id;
						}
					}
					if (DOMAINIDNAME.length === 0) {
						return jQuery.cookie('_did');
					}
				};

				this.returnEntitiesList = function() {
					return DOMAINLIST;
				};

				this.thisuserID = function() {
					return USERID;
				};

				this.cleanUserProfile = function() {
					USERPROFILE = null;
				};

				this.knowClenUserProfile = function() {
					return USERPROFILE;
				};

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
