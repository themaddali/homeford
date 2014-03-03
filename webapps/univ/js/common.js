//The build will inline common dependencies into this file.

// requirejs.config({
// baseUrl : './js/lib',
// paths : {
// "jquery" : 'jquery',
// "modernizr" : 'modernizr-2.5.3.min',
// "spin" : 'spin.min',
// "migrate" : 'jquery-migrate.min',
// "typeahead" : 'typeahead.bundle',
// "bloodhound" : 'bloodhound',
// "cookie" : 'jquery.cookie',
// "hashchange" : 'jquery.hashchange',
// "router" : 'jquery.router',
// "plugins": "plugins-min",
// "flatvid" :  "jquery.fitvids",
// "service" : "../app/service/service",
// "swipe" : 'swipe.min',
// "carousel" : "jquery.carousel.min",
// "app" : "/app"
// },
// shim : {
// 'bootstrap' : ['jquery']
// }
// });

require({
	baseUrl : './js/lib',
	paths : {
		jquery : 'jquery',
		modernizr : 'modernizr-2.5.3.min',
		spin : 'spin.min',
		migrate : 'jquery-migrate.min',
		typeahead : 'typeahead.bundle',
		bloodhound : 'bloodhound',
		cookie : 'jquery.cookie',
		hashchange : 'jquery.hashchange',
		plugins : "plugins-min",
		flatvid : "jquery.fitvids",
		service : "../app/service/service",
		swipe : 'swipe.min',
		carousel : "jquery.carousel.min",
		validate : "jquery.validate.min",
		Pages : '../../module',
		},
	priority : ['modernizr', 'jquery'],
	waitSeconds : 20 // make VPN more resilient
}, ['../app/StartApp', '../app/PageRoutes', 'jquery', 'modernizr'], function(application, routes) {"use strict";

	$.ajaxSetup({
		// Disable caching of AJAX responses for development
		cache : false
	});

	$(document).ready(function() {

		application.init("HomeFord University | Welcome");
		routes.load();
		application.start();
	});
});

