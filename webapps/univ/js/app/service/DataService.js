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
					$.getJSON("/../univ/data/loginresponse.json", function(json) {
						if (json)
						{
							handlers.success(json);
						}
						else
						{
							handlers.success('Error');
						}
					});
				}
				
				this.getStudentObject = function(handlers) {
					$.getJSON("/../univ/data/studentinfo.json", function(json) {
						if (json)
						{
							handlers.success(json);
						}
						else
						{
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
