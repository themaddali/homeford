define(['../app/Router', 'jquery'], function (router) { "use strict";

    var LocationView = (function () {

        // user clicked a link, see if we should update the hash
        function linkClicked(anchor, event) {
            var urlParts = anchor.href.split('#', 2),
                baseUrl = urlParts[0],
                hash = urlParts[1];
            // anything with a # in it we handle ourselves
            // unless it is a target for another window or has the same base before the hash
            if (urlParts.length > 1 &&
                !anchor.target &&
                ((baseUrl == "") ||
                 (window.location.href.split('#',2)[0] == baseUrl)))
            {
                if (hash != "") { // ignore links with href="#"
                    router.go(hash, "link clicked");
                }
                return false;
            }
        }

        function init() {
                $(document).on('click', 'a', function(event) {
                linkClicked(this, event);
            });
        }

        return {
            init: init
        };
    }());

    return LocationView;
});
