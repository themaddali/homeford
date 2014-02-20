define(['../js/bloodhound'
//Any dependencies
], function(Bloodhound) {
	// "use strict";

	var Service = ( function() {

			//Global Variables
			

			/**
			 * @constructor
			 * @type {Complianceiew}
			 */
			function Service() {

				/**
				 * @public
				 */

				this.getUnivObject = function(handlers) {
					$.getJSON("/../green/data/loginresponse.json", function(json) {
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
					$.getJSON("/../green/data/studentinfo.json", function(json) {
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
					getUnivData();
					this.resume();
				};
			}

			return new Service();
		}());

	return Service;
});
