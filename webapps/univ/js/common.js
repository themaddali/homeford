require({
	baseUrl : './js/lib',
	paths : {
		text : 'text',
		jquery : 'jquery',
		jqueryui : 'jquery-ui.min',
		modernizr : 'modernizr-2.5.3.min',
		backstrech : 'backstrech',
		typeahead : 'typeahead.bundle',
		bloodhound : 'bloodhound',
		cookie : 'jquery.cookie',
		hashchange : 'jquery.hashchange',
		plugins : "plugins-min",
		flatvid : "jquery.fitvids",
		service : "../app/service/service",
		validate : "jquery.validate.min",
		raphael : "raphael",
		tablesorter : "jquery.tablesorter.min",
		elychart : "elycharts",
		popup : "popup.min",
		touchpunch : 'touchpunch',
		ellipsis : 'ellipsis',
		transport : 'iframe-transport',
		fileupload : 'fileupload',
		crop : 'jquery.Jcrop.min',
		Pages : '../../module',
	},
	map : {
		'*' : {
			jquerywidget : 'jqueryui'
		}
	},
	shim : {
		'jqueryui' : {
			deps : ['jquery']
		}
	},
	priority : ['modernizr', 'jquery'],
	waitSeconds : 20 // make VPN more resilient
}, ['../app/StartApp', '../app/PageRoutes', 'jquery', 'jqueryui', 'modernizr', 'touchpunch'], function(application, routes) {"use strict";

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

