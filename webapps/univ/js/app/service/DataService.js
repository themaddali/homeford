define(['jquery'], function() {"use strict";
	// "use strict";

	var DataService = ( function() {

			var ACTIVEDOMAIN;
			var DOMAINLIST;

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
						error : function(){
							handlers.error();
						}
						// error : function() {
							// var sampleresponse = jsonFlickrFeed({
								// "title" : "Recent Uploads tagged book",
								// "link" : "http://www.flickr.com/photos/tags/book/",
								// "description" : "",
								// "modified" : "2014-03-23T15:10:42Z",
								// "generator" : "http://www.flickr.com/",
								// "items" : [{
									// "title" : "a guide to life",
									// "link" : "http://www.flickr.com/photos/8999293@N03/13354974265/",
									// "media" : {
										// "m" : "http://farm8.staticflickr.com/7061/13354974265_df9300e760_m.jpg"
									// },
									// "date_taken" : "2014-03-23T07:50:09-08:00",
									// "description" : " <p><a href=\"http://www.flickr.com/people/8999293@N03/\">barbara carroll<\/a> posted a photo:<\/p> <p><a href=\"http://www.flickr.com/photos/8999293@N03/13354974265/\" title=\"a guide to life\"><img src=\"http://farm8.staticflickr.com/7061/13354974265_df9300e760_m.jpg\" width=\"240\" height=\"160\" alt=\"a guide to life\" /><\/a><\/p> <p>I find it hard to resist books like this. This was published in 1884. The first paragraph is: The Home Instructor is intended to be a friendly adviser, rather than a stern dictator. The results of many years of experience and observation are gathered in these pages, with the hope they may prove both pleasant and helpful. Great stress is laid on the value of home training, from the deepening conviction that as the home is, so the life will be.<\/p>",
									// "published" : "2014-03-23T15:10:42Z",
									// "author" : "nobody@flickr.com (barbara carroll)",
									// "author_id" : "8999293@N03",
									// "tags" : "cookies book tea vintagebook oatmealcranberrycookies"
								// }, {
									// "title" : "Puglia",
									// "link" : "http://www.flickr.com/photos/leonardino23/13352742554/",
									// "media" : {
										// "m" : "http://farm8.staticflickr.com/7355/13352742554_ea024ae252_m.jpg"
									// },
									// "date_taken" : "2014-03-15T15:10:55-08:00",
									// "description" : " <p><a href=\"http://www.flickr.com/people/leonardino23/\">Leonardino23<\/a> posted a photo:<\/p> <p><a href=\"http://www.flickr.com/photos/leonardino23/13352742554/\" title=\"Puglia\"><img src=\"http://farm8.staticflickr.com/7355/13352742554_ea024ae252_m.jpg\" width=\"240\" height=\"135\" alt=\"Puglia\" /><\/a><\/p> ",
									// "published" : "2014-03-23T13:12:22Z",
									// "author" : "nobody@flickr.com (Leonardino23)",
									// "author_id" : "95417157@N08",
									// "tags" : "book nikon italia libro puglia emiliaromagna holday d7100 nikond7100"
								// }, {
									// "title" : "Lecture au soleil (Mars 2014)",
									// "link" : "http://www.flickr.com/photos/75891446@N07/13352022955/",
									// "media" : {
										// "m" : "http://farm4.staticflickr.com/3800/13352022955_8a9d9e09df_m.jpg"
									// },
									// "date_taken" : "2014-03-13T14:10:06-08:00",
									// "description" : " <p><a href=\"http://www.flickr.com/people/75891446@N07/\">Ostrevents<\/a> posted a photo:<\/p> <p><a href=\"http://www.flickr.com/photos/75891446@N07/13352022955/\" title=\"Lecture au soleil (Mars 2014)\"><img src=\"http://farm4.staticflickr.com/3800/13352022955_8a9d9e09df_m.jpg\" width=\"240\" height=\"135\" alt=\"Lecture au soleil (Mars 2014)\" /><\/a><\/p> <p>Pose lecture au soleil de Notre Dame à Paris.<\/p>",
									// "published" : "2014-03-23T13:04:59Z",
									// "author" : "nobody@flickr.com (Ostrevents)",
									// "author_id" : "75891446@N07",
									// "tags" : "sun man paris france tree seine square book soleil europa europe reader young notredame read lecture arbre livre youngman homme lecteur jeune jeunehomme chn ostrevents nddame"
								// }]
							// })
							// handlers.success(sampleresponse);
						// }
					});
				}

				this.getUserProfile = function(handlers) {
					$.ajax({
						url : '/homeford/api/userprofile',
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
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
						async : false,
						contentType : "application/json",
						success : function(data) {
							handlers.success(data.sort(sortJsonByStatus));
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
