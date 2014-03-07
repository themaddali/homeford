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
