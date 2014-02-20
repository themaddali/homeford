(function(e) {
	var t = {
		lines : 17,
		length : 6,
		width : 4,
		radius : 12,
		rotate : 0,
		color : "#ccc",
		speed : 2.2,
		trail : 60,
		className : "spinner",
		zIndex : -2e9,
		top : "auto",
		left : "auto"
	}, n = document.getElementById("preloader"), r = (new Spinner(t)).spin(n), i = home_script_params.bgArray;
	e.backstretch(i, {
		duration : 3e3,
		fade : 750
	}, function() {
		r.stop()
	});
	e("#preloader").hide();
	var s = e(window).height(), o = e("#login-modal").height(), u = s / 2 - o / 2;
	e("a[rel*=theModal]").leanModal({
		top : u,
		overlay : .7,
		closeButton : ".modal_close"
	});
	e(window).resize(function() {
		e("#login-modal").css({
			top : e(window).height() / 2 - o / 2
		})
	}).resize()
})(jQuery);

var countries = new Bloodhound({
	datumTokenizer : function(d) {
		return Bloodhound.tokenizers.whitespace(d.name);
	},
	queryTokenizer : Bloodhound.tokenizers.whitespace,
	limit : 5,
	prefetch : {
		url : '../green/data/countries.json',
		filter : function(list) {
			return jQuery.map(list, function(country) {
				return {
					name : country
				};
			});
		}
	}
});

countries.initialize();
jQuery('#login-error').hide();

jQuery('#slogan-input').typeahead(null, {
	name : 'countries',
	displayKey : 'name',
	source : countries.ttAdapter()
});

setTimeout(function() {
	jQuery('#slogan-input').css('background-color', 'white');
	jQuery('#slogan-input').css('vertical-align', 'middle');
	jQuery('.tt-dropdown-menu').css('top', 'inherit');
	jQuery('#slogan-input').focus();
}, 500);

if (jQuery.cookie('user')) {
	jQuery('#login-modal-link').text(jQuery.cookie('user'));
	jQuery('#login-modal-link').addClass('loggedin-user');
	jQuery('#login-modal-link').attr('href','');
	var currentlocation = window.location.href;
	window.location.assign(currentlocation+'view/studentlist')
}

jQuery('.loggedin-user').on('click', function(e) {
	e.preventDefault();
	var currentlocation = window.location.href;
	window.location.assign(currentlocation+'view/admin')
});


//Should work on routes and router. To support browser back function
// jQuery(function() {
// 	
		// var result = jQuery('#result');
//         
        // // Print a hash
        // jQuery.print = function(dict) {
            // return JSON.stringify(dict);
        // }
// 
        // // Setup routes
        // result
            // .route('about/', function(request) {
                // return 'about: ' + jQuery.print(request.params);
            // }).route('login/', function(request) {
                // return 'login: ' + jQuery.print(request.params);
            // }).route('contact/', function(request) {
                // return 'contact: ' + jQuery.print(request.params);
            // })
            // // .route('book/:id/', function(request, id) {
                // // return 'book ' + id + ': ' + jQuery.print(request.params);
            // // }).route('book/:id/note/:noteId#[0-9]+#/', function(request, id, noteId) {
                // // return 'book ' + id + ', note ' + noteId + ': ' + jQuery.print(request.params);
            // // })
            // ;
// 
        // // Bind hashchange event
        // jQuery(window).bind('hashchange', function(e, triggered) {
            // var hash = location.hash.replace(/^#/, '');
            // if (hash) {
                // var match = jQuery.routeMatches(hash);
                // if (match) {
                    // var template = jQuery(match.route.template);
                    // if (template.length) {
                        // var text = match.route.callback.apply(match.route.callback, match.args);
                        // template.text(text);
                    // }
                // }
            // }
        // });
 
      // })

jQuery('.login-input-button').on('click', function(e) {
	e.preventDefault();
	jQuery('#login-error').hide();
	var inputuname = jQuery('#input-username').val();
	var inputpass = jQuery('#input-password').val();

	if (inputuname !== 'error' && inputpass !== null) {
		// successful validation and create cookie
		jQuery.cookie('user', inputuname, {
			expires : 100
		});
		var currentusr = jQuery.cookie('user');
		var currentlocation = window.location.href;
	    window.location.assign(currentlocation+'view/studentlist');
	}
	else
	{
		jQuery('#input-username').val('');
		jQuery('#input-password').val('');
		jQuery('#login-error').fadeIn(250);
		jQuery('#input-username').focus();
	}
});

jQuery('#slogan-input').keypress(function(e) {
        if(e.which === 13) {
            if (jQuery('#slogan-input').val() === 'Maths' || jQuery('#slogan-input').val() === 'Colors' || jQuery('#slogan-input').val() === 'Numbers') {
                jQuery(this).blur();
                jQuery('#slogan-input').focus().click();
                jQuery.cookie('user', 'readonly');
                window.location.assign('view/studentlist');
            }
        }
    });


jQuery('#logoutbtn').on('click', function(e) {
	e.preventDefault();
	if (jQuery.removeCookie('username')) {
		jQuery('#logoutcontainer').html('<strong>Successfully logged out! Refreshing the page now...</strong>');
		window.setTimeout('location.reload()', 2000);
		// refresh after 2 sec
	}
});

