require({
	baseUrl : './js/lib',
	paths : {
		text : 'text',
		jquery : 'jquery',
		jqueryui : 'jquery-ui',
		modernizr : 'modernizr-2.5.3.min',
		backstrech : 'backstrech',
		cookie : 'jquery.cookie',
		service : "../app/service/service",
		validate : "jquery.validate.min",
		timeago : "timeago",
		raphael : "raphael",
		tablesorter : "jquery.tablesorter.min",
		elychart : "elycharts",
		popup : "popup.min",
		ellipsis : 'ellipsis',
		transport : 'iframe-transport',
		fileupload : 'fileupload',
		canvastoblob : 'canvastoblob',
		getusermedia : 'getUserMedia',
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
	waitSeconds : 15 
}, ['../app/StartApp', '../app/PageRoutes', 'jquery', 'jqueryui', 'modernizr'], function(application, routes, jQuery, jQueryUI) {"use strict";

	$.ajaxSetup({
		cache : false
	});

	$(document).ready(function() {

		application.init();
		routes.load();
		application.start();
	});
});

