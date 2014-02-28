//View that will drive the Students list page.

define(['../../js/lib/modernizr-2.5.3.min', '../../js/lib/spin.min', '../../js/lib/plugins-min', '../../js/lib/jquery.cookie', '../../js/lib/jquery.carousel.min', '../../js/lib/Chart.min', '../../js/lib/raphael', '../../js/lib/morris.min', '../app/service/DataService'], function(modernizr, spin, plugins, cookie, carousel, chart, raphael, morris, service) {"use strict";

	var AdminView = ( function() {

			/**
			 * Constructor
			 *
			 */

			var MALEICON = '<i class="icon-male  icon-1x "></i>'
			var FEMALEICON = '<i class="icon-female  icon-1x "></i>'

			function AdminView() {

				jQuery(document).ready(function(e) {
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
						zIndex : 2e9,
						top : "auto",
						left : "auto"
					}, n = document.getElementById("preloader"), r = (new Spinner(t)).spin(n), i = e(window).height(), s = e("#contact-modal").height(), o = i / 2 - s / 2;
					e("a[rel*=theModal]").leanModal({
						top : o,
						overlay : .7,
						closeButton : ".modal_close"
					});
					e(window).resize(function() {
						e("#contact-modal").css({
							top : e(window).height() / 2 - s / 2 + "px"
						});
						e("#wrapper-about").css({
							marginTop : e(window).height() / 2 - 350 + "px"
						})
					}).resize();
					var u = e(".panel").width(), a = 560, f = 40;
					e(".panel").each(function(t) {
						t === 0 ? e(this).css({
							"margin-left" : f + "px"
						}) : t === 4 ? e(this).css({
							"margin-left" : "1800px"
						}) : t === 5 ? e(this).css({
							"margin-left" : "2240px"
						}) : e(this).css({
							"margin-left" : f + t * (40 + u) + "px"
						});
						t === 5 && e(this).css({
							"margin-right" : f + "px"
						})
					});
					e(".scroll-pane").jScrollPane();
					e("#wrapper-about").waitForImages(function() {
						r.stop();
						e("#wrapper-about").animate({
							opacity : 1
						}, 600)
					});
					var l = 0, c = function() {
						if (l === 0) {
							l++;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-bios").addClass("selected");
							e(".contain").animate({
								left : "-440px"
							}, 400)
						} else if (l === 1) {
							l++;
							e(".contain").animate({
								left : "-880px"
							}, 400)
						} else if (l === 2) {
							l++;
							e(".contain").animate({
								left : "-1320px"
							}, 400)
						} else if (l === 3) {
							l++;
							e(".contain").animate({
								left : "-1760px"
							}, 400)
						} else if (l === 4) {
							l++;
							e(".contain").animate({
								left : "-2200px"
							}, 400)
						} else if (l === 5) {
							l++;
							e(".contain").animate({
								left : "-2640px"
							}, 400)
						} else if (l === 6) {
							l++;
							e(".contain").animate({
								left : "-3080px"
							}, 400)
						} else if (l === 7) {
							l++;
							e(".contain").animate({
								left : "-3520px"
							}, 400)
						} else if (l === 8) {
							l++;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-connect").addClass("selected");
							e(".contain").animate({
								left : "-3960px"
							}, 400)
						} else if (l === 9) {
							l++;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-press").addClass("selected");
							e(".contain").animate({
								left : "-4400px"
							}, 400)
						}
					}, h = function() {
						if (l === 1) {
							l--;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-mgh").addClass("selected");
							e(".contain").animate({
								left : "0px"
							}, 400)
						} else if (l === 2) {
							l--;
							e(".contain").animate({
								left : "-440px"
							}, 400)
						} else if (l === 3) {
							l--;
							e(".contain").animate({
								left : "-880px"
							}, 400)
						} else if (l === 4) {
							l--;
							e(".contain").animate({
								left : "-1320px"
							}, 400)
						} else if (l === 5) {
							l--;
							e(".contain").animate({
								left : "-1760px"
							}, 400)
						} else if (l === 6) {
							l--;
							e(".contain").animate({
								left : "-2200px"
							}, 400)
						} else if (l === 7) {
							l--;
							e(".contain").animate({
								left : "-2640px"
							}, 400)
						} else if (l === 8) {
							l--;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-bios").addClass("selected");
							e(".contain").animate({
								left : "-3080px"
							}, 400)
						} else if (l === 9) {
							l--;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-connect").addClass("selected");
							e(".contain").animate({
								left : "-3520px"
							}, 400)
						} else if (l === 10) {
							l--;
							e("#subnav ul").children().removeClass("selected");
							e("#nav-connect").addClass("selected");
							e(".contain").animate({
								left : "-3960px"
							}, 400)
						}
					};
					e("#next").bind("click", function() {
						c()
					});
					e("#prev").bind("click", function() {
						h()
					});

					setTimeout(function() {
						service.getUnivObject({
							success : function(UnivData) {
								//OverView Panel Load
								jQuery('.univ-name').text(UnivData[0].univname);
								jQuery('.univ-id').text(UnivData[0].id);
								jQuery('.univ-about').text(UnivData[0].about);
								jQuery('.univ-admin').text(UnivData[0].adminname);
								jQuery('.univ-created').text(UnivData[0].created);
								jQuery('.univ-email').text(UnivData[0].email);
								jQuery('.univ-phone').text(UnivData[0].phone);
								jQuery('.univ-address').text(UnivData[0].address);
								jQuery('.univ-faculty').text(UnivData[0].faculty.length);
								jQuery('.univ-students').text(UnivData[0].students.length);

								//Student Manage Panel Load
								var studentmintemplate = jQuery('#students-list-min-template').remove().attr('id', '');
								var COUNT = UnivData[0].students.length;
								for (var i = 0; i < COUNT; i++) {
									var newelement = studentmintemplate.clone();
									if (UnivData[0].students[i].gender === 'female') {
										jQuery('.students-list-min', newelement).html(FEMALEICON + '<strong>' + UnivData[0].students[i].name + '</strong>' + UnivData[0].students[i].id);
									} else {
										jQuery('.students-list-min', newelement).html(MALEICON + '<strong>' + UnivData[0].students[i].name + '</strong>' + UnivData[0].students[i].id);
									}
									jQuery('#students-list-min').append(newelement);
									jQuery('.students-list-min').on('click', function() {
										//usereditview.loadData('Doug Stamper');
										window.location.assign('subuseredit');
									});

								}
							}
						});
					}, 0);

					e("#nav-dashboard").bind("click", function() {
						e("#subnav ul").children().removeClass("selected");
						e("#nav-dashboard").addClass("selected");
						l = 0;
						e(".contain").animate({
							left : "0px"
						}, 400)
					});
					e("#nav-profile").bind("click", function() {
						e("#subnav ul").children().removeClass("selected");
						e("#nav-profile").addClass("selected");
						l = 1;
						e(".contain").animate({
							left : "-440px"
						}, 400)
					});

					e(document).bind("keyup", "right", function() {
						c()
					});
					e(document).bind("keyup", "left", function() {
						h()
					})

					jQuery('#admin-done').on('click', function(e) {
						e.preventDefault();
						var currentlocation = window.location.href;
						window.location.assign('/univ');
					});

					//Class Progress Tracking.
					var studentdata = [{
						value : 30,
						color : "#F7464A"
					}, {
						value : 50,
						color : "#E2EAE9"
					}, {
						value : 100,
						color : "#D4CCC5"
					}];

					//Class Progress Tracking.
					var studentdata1 = [{
						value : 100,
						color : "#F7464A"
					}, {
						value : 100,
						color : "#E2EAE9"
					}, {
						value : 100,
						color : "#D4CCC5"
					}];

					var studentoptions = {
						segmentShowStroke : true,
						segmentStrokeColor : "#fff",
						segmentStrokeWidth : 2,
						percentageInnerCutout : 50,
						animation : false,
						animationSteps : 100,
						animationEasing : "easeOutBounce",
						animateRotate : true,
						animateScale : false,
						onAnimationComplete : null
					};

					var rankingdata = {
						labels : ["Maths", "Numbers", "Colors"],
						datasets : [{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : [65, 59, 90]
						}, {
							fillColor : "rgba(151,187,205,0.5)",
							strokeColor : "rgba(151,187,205,1)",
							data : [28, 48, 40]
						}]
					};

					Morris.Line({
						element : 'accounts-chart',
						data : [{
							y : '2013-09',
							a : 13000,
							b : 11000
						}, {
							y : '2013-10',
							a : 15000,
							b : 14000
						}, {
							y : '2013-11',
							a : 9000,
							b : 8700
						}, {
							y : '2013-12',
							a : 9500,
							b : 9000
						}, {
							y : '2014-01',
							a : 14000,
							b : 11500
						}, {
							y : '2014-02',
							a : 17000,
							b : 13000
						}],
						xkey : 'y',
						xLabels : 'month',
						preUnits : '$',
						lineColors : ['#009ACD', '#e34a33'],
						lineWidth : 4,
						pointSize : 5,
						ykeys : ['a', 'b'],
						labels : ['Cash Inflow', 'Expenses']
					});

					Morris.Donut({
						element : 'student-donut-1',
						data : [{
							label : "October",
							value : 12
						}, {
							label : "Novemeber",
							value : 15
						}, {
							label : "December",
							value : 16
						}, {
							label : "January",
							value : 20
						}, {
							label : "Feburary",
							value : 19
						}, {
							label : "March",
							value : 25
						}]
					});
					Morris.Donut({
						element : 'student-donut-2',
						data : [{
							label : "October",
							value : 12
						}, {
							label : "Novemeber",
							value : 15
						},
						{
							label : "January",
							value : 19
						}]
					});

					var rankingdata1 = {
						labels : ["Maths", "Numbers", "Colors"],
						datasets : [{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : [80, 90, 90]
						}, {
							fillColor : "rgba(151,187,205,0.5)",
							strokeColor : "rgba(151,187,205,1)",
							data : [75, 98, 90]
						}]
					};
					var accountsData = {
						labels : ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
						datasets : [{
							fillColor : "rgba(220,220,220,0.5)",
							strokeColor : "rgba(220,220,220,1)",
							data : [1250, 1400, 1400, 1550, 2000, 1800],
						}, {
							fillColor : "rgba(151,187,205,0.5)",
							strokeColor : "rgba(151,187,205,1)",
							data : [1100, 1200, 1100, 1850, 1700, 1400]
						}]
					};
					var curentdata = [{
						value : 30,
						color : "#D97041"
					}, {
						value : 90,
						color : "#C7604C"
					}, {
						value : 64,
						color : "#21323D"
					}];
					var studentctx = document.getElementById("progress-chart").getContext("2d");
					var studentctx1 = document.getElementById("progress-chart-1").getContext("2d");
					var rankingctx = document.getElementById("ranking-chart").getContext("2d");
					//var accountsctx = document.getElementById("accounts-chart").getContext("2d");
					var rankingctx1 = document.getElementById("ranking-chart-1").getContext("2d");
					//var polarctx = document.getElementById("polar-chart").getContext("2d");
					new Chart(studentctx).Doughnut(studentdata, studentoptions);
					new Chart(studentctx1).Doughnut(studentdata1);
					new Chart(rankingctx).Bar(rankingdata);
					new Chart(rankingctx1).Bar(rankingdata1);
					//new Chart(polarctx).PolarArea(curentdata);
					//new Chart(accountsctx).Bar(accountsData,accountsOptions);
					//Mobile set
					new Chart(document.getElementById("polar-chart-phone").getContext("2d")).PolarArea(curentdata);
					new Chart(document.getElementById("ranking-chart-phone").getContext("2d")).Bar(rankingdata1);
					new Chart(document.getElementById("progress-chart-phone").getContext("2d")).Doughnut(studentdata1);

					if (!jQuery.cookie('user') || jQuery.cookie('user') === 'home') {
						var currentlocation = window.location.href;
						jQuery.removeCookie('user', {
							path : '/univ'
						});
						window.location.assign('/univ');
					}

					jQuery('#signout-button').on('click', function(e) {
						e.preventDefault();
						jQuery.removeCookie('user', {
							path : '/'
						});
						jQuery.removeCookie('subuser', {
							path : '/'
						});
						window.setTimeout('location.reload()', 1000);
						// refresh after 1 sec
					});

					jQuery('#student-manage').on('click', function() {
						window.location.assign('subuseradd');
					});
					jQuery('#overview-manage').on('click', function() {
						window.location.assign('overview ');
					});

				});

				this.pause = function() {

				};

				this.resume = function() {

				};

				this.init = function(args) {
					//To Drive from Outside Calls
				};

			}

			return AdminView;
		}());

	return new AdminView();
});
