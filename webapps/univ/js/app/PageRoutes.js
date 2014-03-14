define(['../app/Router', 
'cookie', '../app/UrlFragment'],
function (router, cookie, urlFragment ) { "use strict";

    var PageRoutes = ( function() {

        function PageRoutes() {

            var loaded = false;
            var CONTAINER = '.page';

            this.load = function () {

                if (loaded) return;
                loaded = true;

                router.filter('default redirector', '^$|^/$', {
                    check: function (location, result) {
                        result.redirectTo('/home');
                    }
                });

                router.map('home', '^/home(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/home/index.html','../app/HomeView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('entry', '^/entry(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/entry/index.html','../app/EntryView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('register', '^/register(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/register/index.html','../app/RegisterView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('studentlist', '^/studentlist(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/studentlist/index.html','../app/StudentListView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('class', '^/class(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/class/index.html','../app/ClassView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('quiz', '^/quiz(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/quiz/index.html','../app/QuizView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('profileedit', '^/profileedit(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/profileedit/index.html','../app/ProfileEditView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('admin', '^/admin(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/admin/index.html','../app/AdminView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                // router.map('admin', '^/admin'+urlFragment.pagePatternTerminal, {
                	// container: CONTAINER,
                    // enter: function (location, result) {
                        // require(['text!Pages/admin/index.html',
                        // '../app/AdminView',
                        // '../app/AdminRoutes'],
                        // function (page, view, routes) {
                        	 // routes.register();
                             // result.load(page, view, routes);
                        // });
                    // }
                // });
                
                router.map('prehome', '^/prehome(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/home/pre-index.html','../app/PreHomeView'],
                        function (page, view) {
                            result.load(page,view);
                        });
                    }
                });
                router.map('no route', '^.*', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/home/pre-index.html','../app/PreHomeView'],
                        function (page, view) {
                            result.load(page,view);
                        });
                    }
                });
                
                 // router.map('no route', '^.*', {
                	// container: CONTAINER,
                    // enter: function (location, result) {
                        // require(['text!Pages/no-page.html'],
                        // function (page) {
                            // result.load(page);
                        // });
                    // }
                // });
                
                
                
            }
        }

        return new PageRoutes();
    }());

    return PageRoutes;
});
