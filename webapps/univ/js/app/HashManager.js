define(['../app/Events'], function(events) {"use strict";
    var HashManager = ( function() {
        /**
         * @class Singleton class to encapsulate access to the
         * window.location.hash property and hashchange event.
         *
         * ABSOLUTELY NOTHING should use this object other than Router.
         *
         * @type {HashManager}
         */
        function HashManager() {
            
            /**
             * Event dispatcher.
             * @type {EventDispatcher}
             */
            var dispatcher = new events();
            
            /**
             * Only initialize once.
             */
            var initialized = false;
            
            /**
             * Return the current hash.
             */
            this.getHash = function() {
                // http://stackoverflow.com/questions/1703552/encoding-of-window-location-hash
                //return window.location.hash.substr(1);
                return (location.href.split("#")[1] || "");
            };
            
            /**
             * Set the hash.
             */
            this.setHash = function(hash) {
                window.location.hash = '#' + hash;
            };
            
            /**
             * Sets the hash and then reloads the page such that all DOM and state is reset. 
             * Useful for when the user session is stale.
             */
            this.setHashAndReload = function(hash) {
                window.location.hash = '#' + hash;
                window.location.reload();
            };
            
            /**
             * Replaces the hash.
             */
            this.replaceHash = function(hash) {
                var prefix = window.location.href.split('#')[0];
                // Firefox needs this to be asynchronous. Not sure why.
                // If we don't do this delay, Firefox reverts to the prior hash.
                setTimeout(function () {
                    window.location.replace(prefix + '#' + hash);
                }, 2);
            };
            
            /**
             * Register for event delivery.
             *
             * @param {string} eventName The name of the event.  The only
             *     currently supported value is 'hashchange'.
             * @param {function():void} callback The method to be called when
             *     the event occurs.
             */
            this.on = function(eventName, callback) {
                dispatcher.on(eventName, callback);
            };
            
            /**
             * Unregister for event delivery.
             *
             * @param {string} eventName The name of the event.  The only
             *     currently supported value is 'hashchange'.
             * @param {function():void} callback The method to be called when
             *     the event occurs.
             */
            this.off = function(eventName, callback) {
                dispatcher.off(eventName, callback);
            };
            
            /**
             * Initialize.
             */
            this.init = function() {
                if (! initialized) {
                    initialized = true;
                    $(window).bind('hashchange', function() {
                        dispatcher.fire('hashchange');
                    });
                }
            };
        }
        return new HashManager();
    }());
    return HashManager;
});
