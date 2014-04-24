require({
	baseUrl : './js/lib',
	paths : {
		text : 'text',
		jquery : 'jquery',
		jqueryui : 'jquery-ui',
		modernizr : 'modernizr-2.5.3.min',
		backstrech : 'backstrech',
		bgv : 'bgv',
		cookie : 'jquery.cookie',
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
		croppic : 'croppic',
		canvastoblob : 'canvastoblob',
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

