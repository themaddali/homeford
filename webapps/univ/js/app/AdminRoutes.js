define(['../app/Router', 'cookie', '../app/UrlFragment'], function(router, cookie, urlFragment) {"use strict";

	var AdminRoutes = ( function() {

			var CONTAINER = '.page';

			function AdminRoutes() {

				var registered = false;

				this.register = function() {

					if (registered)
						return;
					registered = true;

					router.map('admin show', '/admin/show' + urlFragment.pagePatternTerminal, {

						enter : function(location, result) {
							result.noAction();
						}
					});

					router.map('admin overview', '/admin/overview' + urlFragment.pagePatternTerminal, {
						container : CONTAINER,
						enter : function(location, result) {
							require(['text!Pages/admin/overview/index.html', '../app/OverViewView'], function(page, view) {
								result.load(page, view);
							});
						}
					});
					router.map('admin subuseradd', '/admin/subuseradd' + urlFragment.pagePatternTerminal, {
						container : CONTAINER,
						enter : function(location, result) {
							require(['text!Pages/admin/subuseradd/index.html', '../app/SubUserAddView'], function(page, view) {
								result.load(page, view);
							});
						}
					});
					router.map('admin subuseredit', '/admin/subuseredit' + urlFragment.pagePatternTerminal, {
						container : CONTAINER,
						enter : function(location, result) {
							require(['text!Pages/admin/subuseredit/index.html', '../app/SubUserEditView'], function(page, view) {
								result.load(page, view);
							});
						}
					});

					router.filter('admin default redirect', '/admin' + urlFragment.viewPatternTerminal, {
						check : function(location, result) {
							result.replaceWith(urlFragment.replaceView(location, 'show'));
						}
					});

					router.map('admin no route', '/admin/.+', {
						container : CONTAINER,
						enter : function(location, result) {
							require(['text!Pages/no-page.html'], function(page) {
								result.load(page);
							});
						}
					});
				}
			}

			return new AdminRoutes();
		}());

	return AdminRoutes;
});
