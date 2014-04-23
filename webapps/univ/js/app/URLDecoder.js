define(['../app/Events'], function(events) {"use strict";
	var URLDecoder = ( function() {

			function URLDecoder() {

				var dispatcher = new events();

				var initialized = false;

				this.getHash = function() {
					return (location.href.split("#")[1] || "");
				};

				this.setHash = function(hash) {
					window.location.hash = '#' + hash;
				};

				this.setHashAndReload = function(hash) {
					window.location.hash = '#' + hash;
					window.location.reload();
				};

				this.replaceHash = function(hash) {
					var prefix = window.location.href.split('#')[0];
					setTimeout(function() {
						window.location.replace(prefix + '#' + hash);
					}, 2);
				};

				this.on = function(eventName, callback) {
					dispatcher.on(eventName, callback);
				};

				this.off = function(eventName, callback) {
					dispatcher.off(eventName, callback);
				};

				this.init = function() {
					if (!initialized) {
						initialized = true;
						$(window).bind('hashchange', function() {
							dispatcher.fire('hashchange');
						});
					}
				};
			}

			return new URLDecoder();
		}());
	return URLDecoder;
}); 