define([], function() {"use strict";

	var nopageView = ( function() {


			function nopageView() {

				this.pause = function() {

				};

				this.resume = function() {
					document.title = 'Zingoare | Not Found';
				};

				this.setEntity = function(entity) {
				}

				this.init = function(args) {
					document.title = 'Zingoare | Not Found';
				};
			}

			return nopageView;
		}());

	return new nopageView();
});
