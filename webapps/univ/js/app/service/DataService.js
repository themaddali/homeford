define(['jquery'], function() {"use strict";
	// "use strict";

	var DataService = ( function() {

			//Global Variables

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

				this.registerNewUser = function(username,password,domain,handlers) {
					$.ajax({
						url : '/homeford/api/signup',
						type : 'POST',
						async : 'async',
						contentType: "application/json", 
						data: JSON.stringify({'password':password,'email':username,"domain":{"domainName":domain}}),
						success : function(data) {
							handlers.success(data);
						}
					});
				}
				this.Login = function(username,password,handlers) {
					$.ajax({
						url : '/homeford/j_spring_security_check',
						type : 'POST',
						async : 'async',
						data: 'j_username='+username+'&j_password='+password,
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
					//DB call to confirm if this entity or univ exists.
					if (entity.toUpperCase() === 'KUBO' || entity.toUpperCase() === 'PIANO') {
						handlers.success(true);
					} else {
						handlers.success(false);
					}
				}

				this.entityList = function(handlers) {
					var thisURL = "data/univslist.json";
					$.getJSON(thisURL, function(json) {
						if (json) {
							handlers.success(json);
						} else {
							handlers.success('Error');
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
