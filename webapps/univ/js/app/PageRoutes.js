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
                        require(['text!Pages/home/index.html','../app/view/entry/HomeView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('entry', '^/entry(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/entry/index.html','../app/view/entry/EntryView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('register', '^/register(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/register/index.html','../app/view/entry/RegisterView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('studentlist', '^/studentlist(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/studentlist/index.html','../app/view/studentlist/StudentListView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('class', '^/class(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/class/index.html','../app/view/class/ClassView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('quiz', '^/quiz(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/quiz/index.html','../app/view/quiz/QuizView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('profileview', '^/profileview(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/profileedit/view.html','../app/view/userprofile/ProfileView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('profileedit', '^/profileedit(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/profileedit/index.html','../app/view/userprofile/ProfileEditView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('admin', '^/admin(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/admin/index.html','../app/view/admin/AdminView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('invite', '^/invite(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/invite/new.html','../app/view/invite/InviteView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('adminslist', '^/adminslist(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/invite/view.html','../app/view/invite/AdminsListView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('adminslistedit', '^/adminslistedit(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/invite/edit.html','../app/view/invite/AdminsEditView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('memberslist', '^/memberslist(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/members/view.html','../app/view/members/MembersListView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('memberslistedit', '^/memberslistedit(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/members/edit.html','../app/view/members/MembersEditView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('memberslistadd', '^/memberslistadd(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/members/add.html','../app/view/members/MembersAddView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('todoassign', '^/todoassign(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/todo/assign.html','../app/view/todo/ToDoAssignView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('todolist', '^/todolist(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/todo/list.html','../app/view/todo/ToDoListView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('quizassign', '^/quizassign(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/quizpool/assign.html','../app/view/quizpool/QuizAssignView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('memberspick', '^/memberspick(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/selector/memberspick.html','../app/view/members/MembersPickView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                router.map('notifications', '^/notifications(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/notifications/index.html','../app/view/notifications/NotificationsView'],
                        function (page, view) {
                             result.load(page, view);
                        });
                    }
                });
                
                router.map('prehome', '^/prehome(/.*|$)', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/home/pre-index.html','../app/view/entry/PreHomeView'],
                        function (page, view) {
                            result.load(page,view);
                        });
                    }
                });
                router.map('no route', '^.*', {
                	container: CONTAINER,
                    enter: function (location, result) {
                        require(['text!Pages/home/pre-index.html','../app/view/entry/PreHomeView'],
                        function (page, view) {
                            result.load(page,view);
                        });
                    }
                });
            }
        }

        return new PageRoutes();
    }());

    return PageRoutes;
});
