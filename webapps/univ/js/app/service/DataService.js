define(['jquery'], function() {"use strict";
	// "use strict";

	var DataService = ( function() {

			var ACTIVEDOMAIN;

			/**
			 * @constructor
			 * @type {Complianceiew}
			 */
			function DataService() {

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

				this.sendInvite = function(email, message,domain,handlers) {
					$.ajax({
						url : '/homeford/api/invitee',
						type : 'POST',
						async : 'async',
						contentType : "application/json",
						data : JSON.stringify({
							'email' : email,
							'text' : message,
							'domainName': domain,
							'roles' : [{"roleName":"ROLE_TIER2"}] //Default Admin
						}),
						success : function(data) {
							handlers.success(data);
						}
					});
				}
				
				this.getInviteStatus = function(handlers) {
					$.ajax({
						url : '/homeford/api/invitee',
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
							'id' : id,
							'firstName' : firstname,
							'lastname' : lastname,
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
					$.ajax({
						url : '/homeford/api/getpublicdomains',
						type : 'GET',
						async : 'async',
						contentType : "application/json",
						success : function(data) {
							handlers.success(data);
						}
					});
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
