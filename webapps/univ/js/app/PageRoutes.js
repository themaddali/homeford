define(['Router', 
'../lib/jquery.cookie',],
function (router, cookie ) { "use strict";

    var PageRoutes = ( function() {

        function PageRoutes() {

            var loaded = false;

            this.load = function () {

                if (loaded) return;
                loaded = true;

                router.filter('default redirector', '^$|^/$', {
                    check: function (location, result) {
                        result.redirectTo('/home');
                    }
                });

                router.map('home', '^/home(/.*|$)', {
                    enter: function (location, result) {
                        require(['../index.html','HomeView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                
                router.map('no route', '^.*', {
                    enter: function (location, result) {
                        require(['../about.html'],
                        function (page) {
                            result.load(page);
                        });
                    }
                });
                
                
                
            }
        }

        return new PageRoutes();
    }());

    return PageRoutes;
});
