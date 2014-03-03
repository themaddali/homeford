/*! Backstretch - v2.0.3 - 2012-11-30
 * http://srobbin.com/jquery-plugins/backstretch/
 * Copyright (c) 2012 Scott Robbin; Licensed MIT */
(function(e, t, n) {"use strict";
	e.fn.backstretch = function(r, s) {
		return (r === n || r.length === 0) && e.error("No images were supplied for Backstretch"), e(t).scrollTop() === 0 && t.scrollTo(0, 0), this.each(function() {
			var t = e(this), n = t.data("backstretch");
			n && ( s = e.extend(n.options, s), n.destroy(!0)), n = new i(this, r, s), t.data("backstretch", n)
		})
	}, e.backstretch = function(t, n) {
		return e("body").backstretch(t, n).data("backstretch")
	}, e.expr[":"].backstretch = function(t) {
		return e(t).data("backstretch") !== n
	}, e.fn.backstretch.defaults = {
		centeredX : !0,
		centeredY : !0,
		duration : 5e3,
		fade : 0
	};
	var r = {
		wrap : {
			left : 0,
			top : 0,
			overflow : "hidden",
			margin : 0,
			padding : 0,
			height : "100%",
			width : "100%",
			zIndex : -999999
		},
		img : {
			position : "absolute",
			display : "none",
			margin : 0,
			padding : 0,
			border : "none",
			width : "auto",
			height : "auto",
			maxWidth : "none",
			zIndex : -999999
		}
	}, i = function(n, i, o) {
		this.options = e.extend({}, e.fn.backstretch.defaults, o || {}), this.images = e.isArray(i) ? i : [i], e.each(this.images, function() {
			e("<img />")[0].src = this
		}), this.isBody = n === document.body, this.$container = e(n), this.$wrap = e('<div class="backstretch"></div>').css(r.wrap).appendTo(this.$container), this.$root = this.isBody ? s ? e(t) : e(document) : this.$container;
		if (!this.isBody) {
			var u = this.$container.css("position"), a = this.$container.css("zIndex");
			this.$container.css({
				position : u === "static" ? "relative" : u,
				zIndex : a === "auto" ? 0 : a,
				background : "none"
			}), this.$wrap.css({
				zIndex : -999998
			})
		}
		this.$wrap.css({
			position : this.isBody && s ? "fixed" : "absolute"
		}), this.index = 0, this.show(this.index), e(t).on("resize.backstretch", e.proxy(this.resize, this)).on("orientationchange.backstretch", e.proxy(function() {
			this.isBody && t.pageYOffset === 0 && (t.scrollTo(0, 1), this.resize())
		}, this))
	};
	i.prototype = {
		resize : function() {
			try {
				var e = {
					left : 0,
					top : 0
				}, n = this.isBody ? this.$root.width() : this.$root.innerWidth(), r = n, i = this.isBody ? t.innerHeight ? t.innerHeight : this.$root.height() : this.$root.innerHeight(), s = r / this.$img.data("ratio"), o;
				s >= i ? ( o = (s - i) / 2, this.options.centeredY && (e.top = "-" + o + "px")) : ( s = i, r = s * this.$img.data("ratio"), o = (r - n) / 2, this.options.centeredX && (e.left = "-" + o + "px")), this.$wrap.css({
					width : n,
					height : i
				}).find("img:not(.deleteable)").css({
					width : r,
					height : s
				}).css(e)
			} catch(u) {
			}
			return this
		},
		show : function(t) {
			if (Math.abs(t) > this.images.length - 1)
				return;
			this.index = t;
			var n = this, i = n.$wrap.find("img").addClass("deleteable"), s = e.Event("backstretch.show", {
				relatedTarget : n.$container[0]
			});
			return clearInterval(n.interval), n.$img = e("<img />").css(r.img).bind("load", function(t) {
				var r = this.width || e(t.target).width(), o = this.height || e(t.target).height();
				e(this).data("ratio", r / o), e(this).fadeIn(n.options.speed || n.options.fade, function() {
					i.remove(), n.paused || n.cycle(), n.$container.trigger(s, n)
				}), n.resize()
			}).appendTo(n.$wrap), n.$img.attr("src", n.images[t]), n
		},
		next : function() {
			return this.show(this.index < this.images.length - 1 ? this.index + 1 : 0)
		},
		prev : function() {
			return this.show(this.index === 0 ? this.images.length - 1 : this.index - 1)
		},
		pause : function() {
			return this.paused = !0, this
		},
		resume : function() {
			return this.paused = !1, this.next(), this
		},
		cycle : function() {
			return this.images.length > 1 && (clearInterval(this.interval), this.interval = setInterval(e.proxy(function() {
				this.paused || this.next()
			}, this), this.options.duration)), this
		},
		destroy : function(n) {
			e(t).off("resize.backstretch orientationchange.backstretch"), clearInterval(this.interval), n || this.$wrap.remove(), this.$container.removeData("backstretch")
		}
	};
	var s = function() {
		var e = navigator.userAgent, n = navigator.platform, r = e.match(/AppleWebKit\/([0-9]+)/), i = !!r && r[1], s = e.match(/Fennec\/([0-9]+)/), o = !!s && s[1], u = e.match(/Opera Mobi\/([0-9]+)/), a = !!u && u[1], f = e.match(/MSIE ([0-9]+)/), l = !!f && f[1];
		return !((n.indexOf("iPhone") > -1 || n.indexOf("iPad") > -1 || n.indexOf("iPod") > -1) && i && i < 534 || t.operamini && {}.toString.call(t.operamini) === "[object OperaMini]" || u && a < 7458 || e.indexOf("Android") > -1 && i && i < 533 || o && o < 6 || "palmGetResource" in t && i && i < 534 || e.indexOf("MeeGo") > -1 && e.indexOf("NokiaBrowser/8.5.0") > -1 || l && l <= 6)
	}()
})(jQuery, window);
(function(e) {
	e.fn.extend({
		leanModal : function(t) {
			function i(t) {
				e("#lean_overlay").fadeOut(200);
				e(t).css({
					display : "none"
				})
			}

			var n = {
				top : 100,
				overlay : .5,
				closeButton : null
			}, r = e("<div id='lean_overlay'></div>");
			e("body").append(r);
			t = e.extend(n, t);
			return this.each(function() {
				var n = t;
				e(this).click(function(t) {
					var r = e(this).attr("href");
					e("#lean_overlay").click(function() {
						i(r)
					});
					e(n.closeButton).click(function() {
						i(r)
					});
					var s = e(r).outerHeight(), u = e(r).outerWidth();
					e("#lean_overlay").css({
						display : "block",
						opacity : 0
					});
					e("#lean_overlay").fadeTo(200, n.overlay);
					e(r).css({
						display : "block",
						position : "fixed",
						opacity : 0,
						"z-index" : 11e3,
						left : "50%",
						"margin-left" : -(u / 2) + "px",
						top : n.top + "px"
					});
					e(r).fadeTo(200, 1);
					t.preventDefault()
				})
			})
		}
	})
})(jQuery);
(function(e) {
	function t(t) {
		if ( typeof t.data != "string")
			return;
		var n = t.handler, r = t.data.toLowerCase().split(" ");
		t.handler = function(t) {
			if (!(this === t.target || !/textarea|select/i.test(t.target.nodeName) && t.target.type !== "text"))
				return;
			var i = t.type !== "keypress" && e.hotkeys.specialKeys[t.which], s = String.fromCharCode(t.which).toLowerCase(), o, u = "", a = {};
			t.altKey && i !== "alt" && (u += "alt+");
			t.ctrlKey && i !== "ctrl" && (u += "ctrl+");
			t.metaKey && !t.ctrlKey && i !== "meta" && (u += "meta+");
			t.shiftKey && i !== "shift" && (u += "shift+");
			if (i)
				a[u + i] = !0;
			else {
				a[u + s] = !0;
				a[u + e.hotkeys.shiftNums[s]] = !0;
				u === "shift+" && (a[e.hotkeys.shiftNums[s]] = !0)
			}
			for (var f = 0, l = r.length; f < l; f++)
				if (a[r[f]])
					return n.apply(this, arguments)
		}
	}
	e.hotkeys = {
		version : "0.8",
		specialKeys : {
			8 : "backspace",
			9 : "tab",
			13 : "return",
			16 : "shift",
			17 : "ctrl",
			18 : "alt",
			19 : "pause",
			20 : "capslock",
			27 : "esc",
			32 : "space",
			33 : "pageup",
			34 : "pagedown",
			35 : "end",
			36 : "home",
			37 : "left",
			38 : "up",
			39 : "right",
			40 : "down",
			45 : "insert",
			46 : "del",
			96 : "0",
			97 : "1",
			98 : "2",
			99 : "3",
			100 : "4",
			101 : "5",
			102 : "6",
			103 : "7",
			104 : "8",
			105 : "9",
			106 : "*",
			107 : "+",
			109 : "-",
			110 : ".",
			111 : "/",
			112 : "f1",
			113 : "f2",
			114 : "f3",
			115 : "f4",
			116 : "f5",
			117 : "f6",
			118 : "f7",
			119 : "f8",
			120 : "f9",
			121 : "f10",
			122 : "f11",
			123 : "f12",
			144 : "numlock",
			145 : "scroll",
			191 : "/",
			224 : "meta"
		},
		shiftNums : {
			"`" : "~",
			1 : "!",
			2 : "@",
			3 : "#",
			4 : "$",
			5 : "%",
			6 : "^",
			7 : "&",
			8 : "*",
			9 : "(",
			0 : ")",
			"-" : "_",
			"=" : "+",
			";" : ": ",
			"'" : '"',
			"," : "<",
			"." : ">",
			"/" : "?",
			"\\" : "|"
		}
	};
	e.each(["keydown", "keyup", "keypress"], function() {
		e.event.special[this] = {
			add : t
		}
	})
})(jQuery);
(function(e) {
	function r(t) {
		var n = t || window.event, r = [].slice.call(arguments, 1), i = 0, s = !0, o = 0, u = 0;
		t = e.event.fix(n);
		t.type = "mousewheel";
		n.wheelDelta && ( i = n.wheelDelta / 120);
		n.detail && ( i = -n.detail / 3);
		u = i;
		if (n.axis !== undefined && n.axis === n.HORIZONTAL_AXIS) {
			u = 0;
			o = -1 * i
		}
		n.wheelDeltaY !== undefined && ( u = n.wheelDeltaY / 120);
		n.wheelDeltaX !== undefined && ( o = -1 * n.wheelDeltaX / 120);
		r.unshift(t, i, o, u);
		return (e.event.dispatch || e.event.handle).apply(this, r)
	}

	var t = ["DOMMouseScroll", "mousewheel"];
	if (e.event.fixHooks)
		for (var n = t.length; n; )
			e.event.fixHooks[t[--n]] = e.event.mouseHooks;
	e.event.special.mousewheel = {
		setup : function() {
			if (this.addEventListener)
				for (var e = t.length; e; )
					this.addEventListener(t[--e], r, !1);
			else
				this.onmousewheel = r
		},
		teardown : function() {
			if (this.removeEventListener)
				for (var e = t.length; e; )
					this.removeEventListener(t[--e], r, !1);
			else
				this.onmousewheel = null
		}
	};
	e.fn.extend({
		mousewheel : function(e) {
			return e ? this.bind("mousewheel", e) : this.trigger("mousewheel")
		},
		unmousewheel : function(e) {
			return this.unbind("mousewheel", e)
		}
	})
})(jQuery);
(function(e) {
	function n(t) {
		e.fn.cycle.debug && r(t)
	}

	function r() {
		window.console && console.log && console.log("[cycle] " + Array.prototype.join.call(arguments, " "))
	}

	function i(t, n, i) {
		function a(t, n, i) {
			if (!t && n === !0) {
				var s = e(i).data("cycle.opts");
				if (!s) {
					r("options not found, can not resume");
					return !1
				}
				if (i.cycleTimeout) {
					clearTimeout(i.cycleTimeout);
					i.cycleTimeout = 0
				}
				c(s.elements, s, 1, !s.backwards)
			}
		}
		t.cycleStop == undefined && (t.cycleStop = 0);
		if (n === undefined || n === null)
			n = {};
		if (n.constructor == String) {
			switch(n) {
				case"destroy":
				case"stop":
					var s = e(t).data("cycle.opts");
					if (!s)
						return !1;
					t.cycleStop++;
					t.cycleTimeout && clearTimeout(t.cycleTimeout);
					t.cycleTimeout = 0;
					e(t).removeData("cycle.opts");
					n == "destroy" && o(s);
					return !1;
				case"toggle":
					t.cyclePause = t.cyclePause === 1 ? 0 : 1;
					a(t.cyclePause, i, t);
					return !1;
				case"pause":
					t.cyclePause = 1;
					return !1;
				case"resume":
					t.cyclePause = 0;
					a(!1, i, t);
					return !1;
				case"prev":
				case"next":
					var s = e(t).data("cycle.opts");
					if (!s) {
						r('options not found, "prev/next" ignored');
						return !1
					}e.fn.cycle[n](s);
					return !1;
				default:
					n = {
						fx : n
					}
			}
			return n
		}
		if (n.constructor == Number) {
			var u = n;
			n = e(t).data("cycle.opts");
			if (!n) {
				r("options not found, can not advance slide");
				return !1
			}
			if (u < 0 || u >= n.elements.length) {
				r("invalid slide index: " + u);
				return !1
			}
			n.nextSlide = u;
			if (t.cycleTimeout) {
				clearTimeout(t.cycleTimeout);
				t.cycleTimeout = 0
			}
			typeof i == "string" && (n.oneTimeFx = i);
			c(n.elements, n, 1, u >= n.currSlide);
			return !1
		}
		return n
	}

	function s(t, n) {
		if (!e.support.opacity && n.cleartype && t.style.filter)
			try {
				t.style.removeAttribute("filter")
			} catch(r) {
			}
	}

	function o(t) {
		t.next && e(t.next).unbind(t.prevNextEvent);
		t.prev && e(t.prev).unbind(t.prevNextEvent);
		(t.pager || t.pagerAnchorBuilder) && e.each(t.pagerAnchors || [], function() {
			this.unbind().remove()
		});
		t.pagerAnchors = null;
		t.destroy && t.destroy(t)
	}

	function u(t, n, i, o, u) {
		var h = e.extend({}, e.fn.cycle.defaults, o || {}, e.metadata ? t.metadata() : e.meta ? t.data() : {});
		h.autostop && (h.countdown = h.autostopCount || i.length);
		var p = t[0];
		t.data("cycle.opts", h);
		h.$cont = t;
		h.stopCount = p.cycleStop;
		h.elements = i;
		h.before = h.before ? [h.before] : [];
		h.after = h.after ? [h.after] : [];
		!e.support.opacity && h.cleartype && h.after.push(function() {
			s(this, h)
		});
		h.continuous && h.after.push(function() {
			c(i, h, 0, !h.backwards)
		});
		a(h);
		!e.support.opacity && h.cleartype && !h.cleartypeNoBg && m(n);
		t.css("position") == "static" && t.css("position", "relative");
		h.width && t.width(h.width);
		h.height && h.height != "auto" && t.height(h.height);
		h.startingSlide ? h.startingSlide = parseInt(h.startingSlide) : h.backwards && (h.startingSlide = i.length - 1);
		if (h.random) {
			h.randomMap = [];
			for (var g = 0; g < i.length; g++)
				h.randomMap.push(g);
			h.randomMap.sort(function(e, t) {
				return Math.random() - .5
			});
			h.randomIndex = 1;
			h.startingSlide = h.randomMap[1]
		} else
			h.startingSlide >= i.length && (h.startingSlide = 0);
		h.currSlide = h.startingSlide || 0;
		var y = h.startingSlide;
		n.css({
			position : "absolute",
			top : 0,
			left : 0
		}).hide().each(function(t) {
			var n;
			h.backwards ? n = y ? t <= y ? i.length + (t - y) : y - t : i.length - t : n = y ? t >= y ? i.length - (t - y) : y - t : i.length - t;
			e(this).css("z-index", n)
		});
		e(i[y]).css("opacity", 1).show();
		s(i[y], h);
		h.fit && h.width && n.width(h.width);
		h.fit && h.height && h.height != "auto" && n.height(h.height);
		var b = h.containerResize && !t.innerHeight();
		if (b) {
			var w = 0, E = 0;
			for (var S = 0; S < i.length; S++) {
				var x = e(i[S]), T = x[0], N = x.outerWidth(), C = x.outerHeight();
				N || ( N = T.offsetWidth || T.width || x.attr("width"));
				C || ( C = T.offsetHeight || T.height || x.attr("height"));
				w = N > w ? N : w;
				E = C > E ? C : E
			}
			w > 0 && E > 0 && t.css({
				width : w + "px",
				height : E + "px"
			})
		}
		h.pause && t.hover(function() {
			this.cyclePause++
		}, function() {
			this.cyclePause--
		});
		if (f(h) === !1)
			return !1;
		var k = !1;
		o.requeueAttempts = o.requeueAttempts || 0;
		n.each(function() {
			var t = e(this);
			this.cycleH = h.fit && h.height ? h.height : t.height() || this.offsetHeight || this.height || t.attr("height") || 0;
			this.cycleW = h.fit && h.width ? h.width : t.width() || this.offsetWidth || this.width || t.attr("width") || 0;
			if (t.is("img")) {
				var n = e.browser.msie && this.cycleW == 28 && this.cycleH == 30 && !this.complete, i = e.browser.mozilla && this.cycleW == 34 && this.cycleH == 19 && !this.complete, s = e.browser.opera && (this.cycleW == 42 && this.cycleH == 19 || this.cycleW == 37 && this.cycleH == 17) && !this.complete, a = this.cycleH == 0 && this.cycleW == 0 && !this.complete;
				if (n || i || s || a) {
					if (u.s && h.requeueOnImageNotLoaded && ++o.requeueAttempts < 100) {
						r(o.requeueAttempts, " - img slide not loaded, requeuing slideshow: ", this.src, this.cycleW, this.cycleH);
						setTimeout(function() {
							e(u.s, u.c).cycle(o)
						}, h.requeueTimeout);
						k = !0;
						return !1
					}
					r("could not determine size of image: " + this.src, this.cycleW, this.cycleH)
				}
			}
			return !0
		});
		if (k)
			return !1;
		h.cssBefore = h.cssBefore || {};
		h.cssAfter = h.cssAfter || {};
		h.cssFirst = h.cssFirst || {};
		h.animIn = h.animIn || {};
		h.animOut = h.animOut || {};
		n.not(":eq(" + y + ")").css(h.cssBefore);
		e(n[y]).css(h.cssFirst);
		if (h.timeout) {
			h.timeout = parseInt(h.timeout);
			h.speed.constructor == String && (h.speed = e.fx.speeds[h.speed] || parseInt(h.speed));
			h.sync || (h.speed = h.speed / 2);
			var L = h.fx == "none" ? 0 : h.fx == "shuffle" ? 500 : 250;
			while (h.timeout - h.speed < L)
			h.timeout += h.speed
		}
		h.easing && (h.easeIn = h.easeOut = h.easing);
		h.speedIn || (h.speedIn = h.speed);
		h.speedOut || (h.speedOut = h.speed);
		h.slideCount = i.length;
		h.currSlide = h.lastSlide = y;
		if (h.random) {
			++h.randomIndex == i.length && (h.randomIndex = 0);
			h.nextSlide = h.randomMap[h.randomIndex]
		} else
			h.backwards ? h.nextSlide = h.startingSlide == 0 ? i.length - 1 : h.startingSlide - 1 : h.nextSlide = h.startingSlide >= i.length - 1 ? 0 : h.startingSlide + 1;
		if (!h.multiFx) {
			var A = e.fn.cycle.transitions[h.fx];
			if (e.isFunction(A))
				A(t, n, h);
			else if (h.fx != "custom" && !h.multiFx) {
				r("unknown transition: " + h.fx, "; slideshow terminating");
				return !1
			}
		}
		var O = n[y];
		h.before.length && h.before[0].apply(O, [O, O, h, !0]);
		h.after.length && h.after[0].apply(O, [O, O, h, !0]);
		h.next && e(h.next).bind(h.prevNextEvent, function() {
			return d(h, 1)
		});
		h.prev && e(h.prev).bind(h.prevNextEvent, function() {
			return d(h, 0)
		});
		(h.pager || h.pagerAnchorBuilder) && v(i, h);
		l(h, i);
		return h
	}

	function a(t) {
		t.original = {
			before : [],
			after : []
		};
		t.original.cssBefore = e.extend({}, t.cssBefore);
		t.original.cssAfter = e.extend({}, t.cssAfter);
		t.original.animIn = e.extend({}, t.animIn);
		t.original.animOut = e.extend({}, t.animOut);
		e.each(t.before, function() {
			t.original.before.push(this)
		});
		e.each(t.after, function() {
			t.original.after.push(this)
		})
	}

	function f(t) {
		var i, s, o = e.fn.cycle.transitions;
		if (t.fx.indexOf(",") > 0) {
			t.multiFx = !0;
			t.fxs = t.fx.replace(/\s*/g, "").split(",");
			for ( i = 0; i < t.fxs.length; i++) {
				var u = t.fxs[i];
				s = o[u];
				if (!s || !o.hasOwnProperty(u) || !e.isFunction(s)) {
					r("discarding unknown transition: ", u);
					t.fxs.splice(i, 1);
					i--
				}
			}
			if (!t.fxs.length) {
				r("No valid transitions named; slideshow terminating.");
				return !1
			}
		} else if (t.fx == "all") {
			t.multiFx = !0;
			t.fxs = [];
			for (p in o) {
				s = o[p];
				o.hasOwnProperty(p) && e.isFunction(s) && t.fxs.push(p)
			}
		}
		if (t.multiFx && t.randomizeEffects) {
			var a = Math.floor(Math.random() * 20) + 30;
			for ( i = 0; i < a; i++) {
				var f = Math.floor(Math.random() * t.fxs.length);
				t.fxs.push(t.fxs.splice(f,1)[0])
			}
			n("randomized fx sequence: ", t.fxs)
		}
		return !0
	}

	function l(t, n) {
		t.addSlide = function(r, i) {
			var s = e(r), o = s[0];
			t.autostopCount || t.countdown++;
			n[i?"unshift":"push"](o);
			t.els && t.els[i?"unshift":"push"](o);
			t.slideCount = n.length;
			s.css("position", "absolute");
			s[i?"prependTo":"appendTo"](t.$cont);
			if (i) {
				t.currSlide++;
				t.nextSlide++
			}
			!e.support.opacity && t.cleartype && !t.cleartypeNoBg && m(s);
			t.fit && t.width && s.width(t.width);
			t.fit && t.height && t.height != "auto" && s.height(t.height);
			o.cycleH = t.fit && t.height ? t.height : s.height();
			o.cycleW = t.fit && t.width ? t.width : s.width();
			s.css(t.cssBefore);
			(t.pager || t.pagerAnchorBuilder) && e.fn.cycle.createPagerAnchor(n.length - 1, o, e(t.pager), n, t);
			e.isFunction(t.onAddSlide) ? t.onAddSlide(s) : s.hide()
		}
	}

	function c(t, r, i, s) {
		if (i && r.busy && r.manualTrump) {
			n("manualTrump in go(), stopping active transition");
			e(t).stop(!0, !0);
			r.busy = 0
		}
		if (r.busy) {
			n("transition active, ignoring new tx request");
			return
		}
		var o = r.$cont[0], u = t[r.currSlide], a = t[r.nextSlide];
		if (o.cycleStop != r.stopCount || o.cycleTimeout === 0 && !i)
			return;
		if (!i && !o.cyclePause && !r.bounce && (r.autostop && --r.countdown <= 0 || r.nowrap && !r.random && r.nextSlide < r.currSlide)) {
			r.end && r.end(r);
			return
		}
		var f = !1;
		if ((i || !o.cyclePause) && r.nextSlide != r.currSlide) {
			f = !0;
			var l = r.fx;
			u.cycleH = u.cycleH || e(u).height();
			u.cycleW = u.cycleW || e(u).width();
			a.cycleH = a.cycleH || e(a).height();
			a.cycleW = a.cycleW || e(a).width();
			if (r.multiFx) {
				if (r.lastFx == undefined || ++r.lastFx >= r.fxs.length)
					r.lastFx = 0;
				l = r.fxs[r.lastFx];
				r.currFx = l
			}
			if (r.oneTimeFx) {
				l = r.oneTimeFx;
				r.oneTimeFx = null
			}
			e.fn.cycle.resetState(r, l);
			r.before.length && e.each(r.before, function(e, t) {
				if (o.cycleStop != r.stopCount)
					return;
				t.apply(a, [u, a, r, s])
			});
			var p = function() {
				r.busy = 0;
				e.each(r.after, function(e, t) {
					if (o.cycleStop != r.stopCount)
						return;
					t.apply(a, [u, a, r, s])
				})
			};
			n("tx firing(" + l + "); currSlide: " + r.currSlide + "; nextSlide: " + r.nextSlide);
			r.busy = 1;
			r.fxFn ? r.fxFn(u, a, r, p, s, i && r.fastOnEvent) : e.isFunction(e.fn.cycle[r.fx]) ? e.fn.cycle[r.fx](u, a, r, p, s, i && r.fastOnEvent) : e.fn.cycle.custom(u, a, r, p, s, i && r.fastOnEvent)
		}
		if (f || r.nextSlide == r.currSlide) {
			r.lastSlide = r.currSlide;
			if (r.random) {
				r.currSlide = r.nextSlide;
				++r.randomIndex == t.length && (r.randomIndex = 0);
				r.nextSlide = r.randomMap[r.randomIndex];
				r.nextSlide == r.currSlide && (r.nextSlide = r.currSlide == r.slideCount - 1 ? 0 : r.currSlide + 1)
			} else if (r.backwards) {
				var d = r.nextSlide - 1 < 0;
				if (d && r.bounce) {
					r.backwards = !r.backwards;
					r.nextSlide = 1;
					r.currSlide = 0
				} else {
					r.nextSlide = d ? t.length - 1 : r.nextSlide - 1;
					r.currSlide = d ? 0 : r.nextSlide + 1
				}
			} else {
				var d = r.nextSlide + 1 == t.length;
				if (d && r.bounce) {
					r.backwards = !r.backwards;
					r.nextSlide = t.length - 2;
					r.currSlide = t.length - 1
				} else {
					r.nextSlide = d ? 0 : r.nextSlide + 1;
					r.currSlide = d ? t.length - 1 : r.nextSlide - 1
				}
			}
		}
		f && r.pager && r.updateActivePagerLink(r.pager, r.currSlide, r.activePagerClass);
		var v = 0;
		r.timeout && !r.continuous ? v = h(t[r.currSlide], t[r.nextSlide], r, s) : r.continuous && o.cyclePause && ( v = 10);
		v > 0 && (o.cycleTimeout = setTimeout(function() {
			c(t, r, 0, !r.backwards)
		}, v))
	}

	function h(e, t, r, i) {
		if (r.timeoutFn) {
			var s = r.timeoutFn.call(e, e, t, r, i);
			while (r.fx != "none" && s - r.speed < 250)
			s += r.speed;
			n("calculated timeout: " + s + "; speed: " + r.speed);
			if (s !== !1)
				return s
		}
		return r.timeout
	}

	function d(t, n) {
		var r = n ? 1 : -1, i = t.elements, s = t.$cont[0], o = s.cycleTimeout;
		if (o) {
			clearTimeout(o);
			s.cycleTimeout = 0
		}
		if (t.random && r < 0) {
			t.randomIndex--;
			--t.randomIndex == -2 ? t.randomIndex = i.length - 2 : t.randomIndex == -1 && (t.randomIndex = i.length - 1);
			t.nextSlide = t.randomMap[t.randomIndex]
		} else if (t.random)
			t.nextSlide = t.randomMap[t.randomIndex];
		else {
			t.nextSlide = t.currSlide + r;
			if (t.nextSlide < 0) {
				if (t.nowrap)
					return !1;
				t.nextSlide = i.length - 1
			} else if (t.nextSlide >= i.length) {
				if (t.nowrap)
					return !1;
				t.nextSlide = 0
			}
		}
		var u = t.onPrevNextEvent || t.prevNextClick;
		e.isFunction(u) && u(r > 0, t.nextSlide, i[t.nextSlide]);
		c(i, t, 1, n);
		return !1
	}

	function v(t, n) {
		var r = e(n.pager);
		e.each(t, function(i, s) {
			e.fn.cycle.createPagerAnchor(i, s, r, t, n)
		});
		n.updateActivePagerLink(n.pager, n.startingSlide, n.activePagerClass)
	}

	function m(t) {
		function r(e) {
			e = parseInt(e).toString(16);
			return e.length < 2 ? "0" + e : e
		}

		function i(t) {
			for (; t && t.nodeName.toLowerCase() != "html"; t = t.parentNode) {
				var n = e.css(t, "background-color");
				if (n && n.indexOf("rgb") >= 0) {
					var i = n.match(/\d+/g);
					return "#" + r(i[0]) + r(i[1]) + r(i[2])
				}
				if (n && n != "transparent")
					return n
			}
			return "#ffffff"
		}

		n("applying clearType background-color hack");
		t.each(function() {
			e(this).css("background-color", i(this))
		})
	}

	var t = "2.99";
	e.support == undefined && (e.support = {
		opacity : !e.browser.msie
	});
	e.expr[":"].paused = function(e) {
		return e.cyclePause
	};
	e.fn.cycle = function(t, s) {
		var o = {
			s : this.selector,
			c : this.context
		};
		if (this.length === 0 && t != "stop") {
			if (!e.isReady && o.s) {
				r("DOM not ready, queuing slideshow");
				e(function() {
					e(o.s, o.c).cycle(t, s)
				});
				return this
			}
			r("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)"));
			return this
		}
		return this.each(function() {
			var a = i(this, t, s);
			if (a === !1)
				return;
			a.updateActivePagerLink = a.updateActivePagerLink || e.fn.cycle.updateActivePagerLink;
			this.cycleTimeout && clearTimeout(this.cycleTimeout);
			this.cycleTimeout = this.cyclePause = 0;
			var f = e(this), l = a.slideExpr ? e(a.slideExpr, this) : f.children(), p = l.get();
			if (p.length < 2) {
				r("terminating; too few slides: " + p.length);
				return
			}
			var d = u(f, l, p, a, o);
			if (d === !1)
				return;
			var v = d.continuous ? 10 : h(p[d.currSlide], p[d.nextSlide], d, !d.backwards);
			if (v) {
				v += d.delay || 0;
				v < 10 && ( v = 10);
				n("first timeout: " + v);
				this.cycleTimeout = setTimeout(function() {
					c(p, d, 0, !a.backwards)
				}, v)
			}
		})
	};
	e.fn.cycle.resetState = function(t, n) {
		n = n || t.fx;
		t.before = [];
		t.after = [];
		t.cssBefore = e.extend({}, t.original.cssBefore);
		t.cssAfter = e.extend({}, t.original.cssAfter);
		t.animIn = e.extend({}, t.original.animIn);
		t.animOut = e.extend({}, t.original.animOut);
		t.fxFn = null;
		e.each(t.original.before, function() {
			t.before.push(this)
		});
		e.each(t.original.after, function() {
			t.after.push(this)
		});
		var r = e.fn.cycle.transitions[n];
		e.isFunction(r) && r(t.$cont, e(t.elements), t)
	};
	e.fn.cycle.updateActivePagerLink = function(t, n, r) {
		e(t).each(function() {
			e(this).children().removeClass(r).eq(n).addClass(r)
		})
	};
	e.fn.cycle.next = function(e) {
		d(e, 1)
	};
	e.fn.cycle.prev = function(e) {
		d(e, 0)
	};
	e.fn.cycle.createPagerAnchor = function(t, r, i, s, o) {
		var u;
		if (e.isFunction(o.pagerAnchorBuilder)) {
			u = o.pagerAnchorBuilder(t, r);
			n("pagerAnchorBuilder(" + t + ", el) returned: " + u)
		} else
			u = '<a href="#">' + (t + 1) + "</a>";
		if (!u)
			return;
		var a = e(u);
		if (a.parents("body").length === 0) {
			var f = [];
			if (i.length > 1) {
				i.each(function() {
					var t = a.clone(!0);
					e(this).append(t);
					f.push(t[0])
				});
				a = e(f)
			} else
				a.appendTo(i)
		}
		o.pagerAnchors = o.pagerAnchors || [];
		o.pagerAnchors.push(a);
		a.bind(o.pagerEvent, function(n) {
			n.preventDefault();
			o.nextSlide = t;
			var r = o.$cont[0], i = r.cycleTimeout;
			if (i) {
				clearTimeout(i);
				r.cycleTimeout = 0
			}
			var u = o.onPagerEvent || o.pagerClick;
			e.isFunction(u) && u(o.nextSlide, s[o.nextSlide]);
			c(s, o, 1, o.currSlide < t)
		});
		!/^click/.test(o.pagerEvent) && !o.allowPagerClickBubble && a.bind("click.cycle", function() {
			return !1
		});
		o.pauseOnPagerHover && a.hover(function() {
			o.$cont[0].cyclePause++
		}, function() {
			o.$cont[0].cyclePause--
		})
	};
	e.fn.cycle.hopsFromLast = function(e, t) {
		var n, r = e.lastSlide, i = e.currSlide;
		t ? n = i > r ? i - r : e.slideCount - r : n = i < r ? r - i : r + e.slideCount - i;
		return n
	};
	e.fn.cycle.commonReset = function(t, n, r, i, s, o) {
		e(r.elements).not(t).hide();
		typeof r.cssBefore.opacity == "undefined" && (r.cssBefore.opacity = 1);
		r.cssBefore.display = "block";
		r.slideResize && i !== !1 && n.cycleW > 0 && (r.cssBefore.width = n.cycleW);
		r.slideResize && s !== !1 && n.cycleH > 0 && (r.cssBefore.height = n.cycleH);
		r.cssAfter = r.cssAfter || {};
		r.cssAfter.display = "none";
		e(t).css("zIndex", r.slideCount + (o === !0 ? 1 : 0));
		e(n).css("zIndex", r.slideCount + (o === !0 ? 0 : 1))
	};
	e.fn.cycle.custom = function(t, n, r, i, s, o) {
		var u = e(t), a = e(n), f = r.speedIn, l = r.speedOut, c = r.easeIn, h = r.easeOut;
		a.css(r.cssBefore);
		if (o) {
			typeof o == "number" ? f = l = o : f = l = 1;
			c = h = null
		}
		var p = function() {
			a.animate(r.animIn, f, c, function() {
				i()
			})
		};
		u.animate(r.animOut, l, h, function() {
			u.css(r.cssAfter);
			r.sync || p()
		});
		r.sync && p()
	};
	e.fn.cycle.transitions = {
		fade : function(t, n, r) {
			n.not(":eq(" + r.currSlide + ")").css("opacity", 0);
			r.before.push(function(t, n, r) {
				e.fn.cycle.commonReset(t, n, r);
				r.cssBefore.opacity = 0
			});
			r.animIn = {
				opacity : 1
			};
			r.animOut = {
				opacity : 0
			};
			r.cssBefore = {
				top : 0,
				left : 0
			}
		}
	};
	e.fn.cycle.ver = function() {
		return t
	};
	e.fn.cycle.defaults = {
		activePagerClass : "activeSlide",
		after : null,
		allowPagerClickBubble : !1,
		animIn : null,
		animOut : null,
		autostop : 0,
		autostopCount : 0,
		backwards : !1,
		before : null,
		cleartype : !e.support.opacity,
		cleartypeNoBg : !1,
		containerResize : 1,
		continuous : 0,
		cssAfter : null,
		cssBefore : null,
		delay : 0,
		easeIn : null,
		easeOut : null,
		easing : null,
		end : null,
		fastOnEvent : 0,
		fit : 0,
		fx : "fade",
		fxFn : null,
		height : "auto",
		manualTrump : !0,
		next : null,
		nowrap : 0,
		onPagerEvent : null,
		onPrevNextEvent : null,
		pager : null,
		pagerAnchorBuilder : null,
		pagerEvent : "click.cycle",
		pause : 0,
		pauseOnPagerHover : 0,
		prev : null,
		prevNextEvent : "click.cycle",
		random : 0,
		randomizeEffects : 1,
		requeueOnImageNotLoaded : !0,
		requeueTimeout : 250,
		rev : 0,
		shuffle : null,
		slideExpr : null,
		slideResize : 1,
		speed : 1e3,
		speedIn : null,
		speedOut : null,
		startingSlide : 0,
		sync : 1,
		timeout : 4e3,
		timeoutFn : null,
		updateActivePagerLink : null
	}
})(jQuery);
(function(e) {
	e.fn.cycle.transitions.none = function(t, n, r) {
		r.fxFn = function(t, n, r, i) {
			e(n).show();
			e(t).hide();
			i()
		}
	};
	e.fn.cycle.transitions.fadeout = function(t, n, r) {
		n.not(":eq(" + r.currSlide + ")").css({
			display : "block",
			opacity : 1
		});
		r.before.push(function(t, n, r, i, s, o) {
			e(t).css("zIndex", r.slideCount + (!o == 1 ? 1 : 0));
			e(n).css("zIndex", r.slideCount + (!o == 1 ? 0 : 1))
		});
		r.animIn.opacity = 1;
		r.animOut.opacity = 0;
		r.cssBefore.opacity = 1;
		r.cssBefore.display = "block";
		r.cssAfter.zIndex = 0
	};
	e.fn.cycle.transitions.scrollUp = function(t, n, r) {
		t.css("overflow", "hidden");
		r.before.push(e.fn.cycle.commonReset);
		var i = t.height();
		r.cssBefore.top = i;
		r.cssBefore.left = 0;
		r.cssFirst.top = 0;
		r.animIn.top = 0;
		r.animOut.top = -i
	};
	e.fn.cycle.transitions.scrollDown = function(t, n, r) {
		t.css("overflow", "hidden");
		r.before.push(e.fn.cycle.commonReset);
		var i = t.height();
		r.cssFirst.top = 0;
		r.cssBefore.top = -i;
		r.cssBefore.left = 0;
		r.animIn.top = 0;
		r.animOut.top = i
	};
	e.fn.cycle.transitions.scrollLeft = function(t, n, r) {
		t.css("overflow", "hidden");
		r.before.push(e.fn.cycle.commonReset);
		var i = t.width();
		r.cssFirst.left = 0;
		r.cssBefore.left = i;
		r.cssBefore.top = 0;
		r.animIn.left = 0;
		r.animOut.left = 0 - i
	};
	e.fn.cycle.transitions.scrollRight = function(t, n, r) {
		t.css("overflow", "hidden");
		r.before.push(e.fn.cycle.commonReset);
		var i = t.width();
		r.cssFirst.left = 0;
		r.cssBefore.left = -i;
		r.cssBefore.top = 0;
		r.animIn.left = 0;
		r.animOut.left = i
	};
	e.fn.cycle.transitions.scrollHorz = function(t, n, r) {
		t.css("overflow", "hidden").width();
		r.before.push(function(t, n, r, i) {
			r.rev && ( i = !i);
			e.fn.cycle.commonReset(t, n, r);
			r.cssBefore.left = i ? n.cycleW - 1 : 1 - n.cycleW;
			r.animOut.left = i ? -t.cycleW : t.cycleW
		});
		r.cssFirst.left = 0;
		r.cssBefore.top = 0;
		r.animIn.left = 0;
		r.animOut.top = 0
	};
	e.fn.cycle.transitions.scrollVert = function(t, n, r) {
		t.css("overflow", "hidden");
		r.before.push(function(t, n, r, i) {
			r.rev && ( i = !i);
			e.fn.cycle.commonReset(t, n, r);
			r.cssBefore.top = i ? 1 - n.cycleH : n.cycleH - 1;
			r.animOut.top = i ? t.cycleH : -t.cycleH
		});
		r.cssFirst.top = 0;
		r.cssBefore.left = 0;
		r.animIn.top = 0;
		r.animOut.left = 0
	};
	e.fn.cycle.transitions.slideX = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e(r.elements).not(t).hide();
			e.fn.cycle.commonReset(t, n, r, !1, !0);
			r.animIn.width = n.cycleW
		});
		r.cssBefore.left = 0;
		r.cssBefore.top = 0;
		r.cssBefore.width = 0;
		r.animIn.width = "show";
		r.animOut.width = 0
	};
	e.fn.cycle.transitions.slideY = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e(r.elements).not(t).hide();
			e.fn.cycle.commonReset(t, n, r, !0, !1);
			r.animIn.height = n.cycleH
		});
		r.cssBefore.left = 0;
		r.cssBefore.top = 0;
		r.cssBefore.height = 0;
		r.animIn.height = "show";
		r.animOut.height = 0
	};
	e.fn.cycle.transitions.shuffle = function(t, n, r) {
		var i, s = t.css("overflow", "visible").width();
		n.css({
			left : 0,
			top : 0
		});
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !0, !0)
		});
		if (!r.speedAdjusted) {
			r.speed = r.speed / 2;
			r.speedAdjusted = !0
		}
		r.random = 0;
		r.shuffle = r.shuffle || {
			left : -s,
			top : 15
		};
		r.els = [];
		for ( i = 0; i < n.length; i++)
			r.els.push(n[i]);
		for ( i = 0; i < r.currSlide; i++)
			r.els.push(r.els.shift());
		r.fxFn = function(t, n, r, i, s) {
			r.rev && ( s = !s);
			var o = s ? e(t) : e(n);
			e(n).css(r.cssBefore);
			var u = r.slideCount;
			o.animate(r.shuffle, r.speedIn, r.easeIn, function() {
				var n = e.fn.cycle.hopsFromLast(r, s);
				for (var a = 0; a < n; a++)
					s ? r.els.push(r.els.shift()) : r.els.unshift(r.els.pop());
				if (s)
					for (var f = 0, l = r.els.length; f < l; f++)
						e(r.els[f]).css("z-index", l - f + u);
				else {
					var c = e(t).css("z-index");
					o.css("z-index", parseInt(c) + 1 + u)
				}
				o.animate({
					left : 0,
					top : 0
				}, r.speedOut, r.easeOut, function() {
					e( s ? this : t).hide();
					i && i()
				})
			})
		};
		e.extend(r.cssBefore, {
			display : "block",
			opacity : 1,
			top : 0,
			left : 0
		})
	};
	e.fn.cycle.transitions.turnUp = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !1);
			r.cssBefore.top = n.cycleH;
			r.animIn.height = n.cycleH;
			r.animOut.width = n.cycleW
		});
		r.cssFirst.top = 0;
		r.cssBefore.left = 0;
		r.cssBefore.height = 0;
		r.animIn.top = 0;
		r.animOut.height = 0
	};
	e.fn.cycle.transitions.turnDown = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !1);
			r.animIn.height = n.cycleH;
			r.animOut.top = t.cycleH
		});
		r.cssFirst.top = 0;
		r.cssBefore.left = 0;
		r.cssBefore.top = 0;
		r.cssBefore.height = 0;
		r.animOut.height = 0
	};
	e.fn.cycle.transitions.turnLeft = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !1, !0);
			r.cssBefore.left = n.cycleW;
			r.animIn.width = n.cycleW
		});
		r.cssBefore.top = 0;
		r.cssBefore.width = 0;
		r.animIn.left = 0;
		r.animOut.width = 0
	};
	e.fn.cycle.transitions.turnRight = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !1, !0);
			r.animIn.width = n.cycleW;
			r.animOut.left = t.cycleW
		});
		e.extend(r.cssBefore, {
			top : 0,
			left : 0,
			width : 0
		});
		r.animIn.left = 0;
		r.animOut.width = 0
	};
	e.fn.cycle.transitions.zoom = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !1, !1, !0);
			r.cssBefore.top = n.cycleH / 2;
			r.cssBefore.left = n.cycleW / 2;
			e.extend(r.animIn, {
				top : 0,
				left : 0,
				width : n.cycleW,
				height : n.cycleH
			});
			e.extend(r.animOut, {
				width : 0,
				height : 0,
				top : t.cycleH / 2,
				left : t.cycleW / 2
			})
		});
		r.cssFirst.top = 0;
		r.cssFirst.left = 0;
		r.cssBefore.width = 0;
		r.cssBefore.height = 0
	};
	e.fn.cycle.transitions.fadeZoom = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !1, !1);
			r.cssBefore.left = n.cycleW / 2;
			r.cssBefore.top = n.cycleH / 2;
			e.extend(r.animIn, {
				top : 0,
				left : 0,
				width : n.cycleW,
				height : n.cycleH
			})
		});
		r.cssBefore.width = 0;
		r.cssBefore.height = 0;
		r.animOut.opacity = 0
	};
	e.fn.cycle.transitions.blindX = function(t, n, r) {
		var i = t.css("overflow", "hidden").width();
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r);
			r.animIn.width = n.cycleW;
			r.animOut.left = t.cycleW
		});
		r.cssBefore.left = i;
		r.cssBefore.top = 0;
		r.animIn.left = 0;
		r.animOut.left = i
	};
	e.fn.cycle.transitions.blindY = function(t, n, r) {
		var i = t.css("overflow", "hidden").height();
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r);
			r.animIn.height = n.cycleH;
			r.animOut.top = t.cycleH
		});
		r.cssBefore.top = i;
		r.cssBefore.left = 0;
		r.animIn.top = 0;
		r.animOut.top = i
	};
	e.fn.cycle.transitions.blindZ = function(t, n, r) {
		var i = t.css("overflow", "hidden").height(), s = t.width();
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r);
			r.animIn.height = n.cycleH;
			r.animOut.top = t.cycleH
		});
		r.cssBefore.top = i;
		r.cssBefore.left = s;
		r.animIn.top = 0;
		r.animIn.left = 0;
		r.animOut.top = i;
		r.animOut.left = s
	};
	e.fn.cycle.transitions.growX = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !1, !0);
			r.cssBefore.left = this.cycleW / 2;
			r.animIn.left = 0;
			r.animIn.width = this.cycleW;
			r.animOut.left = 0
		});
		r.cssBefore.top = 0;
		r.cssBefore.width = 0
	};
	e.fn.cycle.transitions.growY = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !1);
			r.cssBefore.top = this.cycleH / 2;
			r.animIn.top = 0;
			r.animIn.height = this.cycleH;
			r.animOut.top = 0
		});
		r.cssBefore.height = 0;
		r.cssBefore.left = 0
	};
	e.fn.cycle.transitions.curtainX = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !1, !0, !0);
			r.cssBefore.left = n.cycleW / 2;
			r.animIn.left = 0;
			r.animIn.width = this.cycleW;
			r.animOut.left = t.cycleW / 2;
			r.animOut.width = 0
		});
		r.cssBefore.top = 0;
		r.cssBefore.width = 0
	};
	e.fn.cycle.transitions.curtainY = function(t, n, r) {
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !1, !0);
			r.cssBefore.top = n.cycleH / 2;
			r.animIn.top = 0;
			r.animIn.height = n.cycleH;
			r.animOut.top = t.cycleH / 2;
			r.animOut.height = 0
		});
		r.cssBefore.height = 0;
		r.cssBefore.left = 0
	};
	e.fn.cycle.transitions.cover = function(t, n, r) {
		var i = r.direction || "left", s = t.css("overflow", "hidden").width(), o = t.height();
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r);
			i == "right" ? r.cssBefore.left = -s : i == "up" ? r.cssBefore.top = o : i == "down" ? r.cssBefore.top = -o : r.cssBefore.left = s
		});
		r.animIn.left = 0;
		r.animIn.top = 0;
		r.cssBefore.top = 0;
		r.cssBefore.left = 0
	};
	e.fn.cycle.transitions.uncover = function(t, n, r) {
		var i = r.direction || "left", s = t.css("overflow", "hidden").width(), o = t.height();
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !0, !0);
			i == "right" ? r.animOut.left = s : i == "up" ? r.animOut.top = -o : i == "down" ? r.animOut.top = o : r.animOut.left = -s
		});
		r.animIn.left = 0;
		r.animIn.top = 0;
		r.cssBefore.top = 0;
		r.cssBefore.left = 0
	};
	e.fn.cycle.transitions.toss = function(t, n, r) {
		var i = t.css("overflow", "visible").width(), s = t.height();
		r.before.push(function(t, n, r) {
			e.fn.cycle.commonReset(t, n, r, !0, !0, !0);
			!r.animOut.left && !r.animOut.top ? e.extend(r.animOut, {
				left : i * 2,
				top : -s / 2,
				opacity : 0
			}) : r.animOut.opacity = 0
		});
		r.cssBefore.left = 0;
		r.cssBefore.top = 0;
		r.animIn.left = 0
	};
	e.fn.cycle.transitions.wipe = function(t, n, r) {
		var i = t.css("overflow", "hidden").width(), s = t.height();
		r.cssBefore = r.cssBefore || {};
		var o;
		if (r.clip)
			if (/l2r/.test(r.clip))
				o = "rect(0px 0px " + s + "px 0px)";
			else if (/r2l/.test(r.clip))
				o = "rect(0px " + i + "px " + s + "px " + i + "px)";
			else if (/t2b/.test(r.clip))
				o = "rect(0px " + i + "px 0px 0px)";
			else if (/b2t/.test(r.clip))
				o = "rect(" + s + "px " + i + "px " + s + "px 0px)";
			else if (/zoom/.test(r.clip)) {
				var u = parseInt(s / 2), a = parseInt(i / 2);
				o = "rect(" + u + "px " + a + "px " + u + "px " + a + "px)"
			}
		r.cssBefore.clip = r.cssBefore.clip || o || "rect(0px 0px 0px 0px)";
		var f = r.cssBefore.clip.match(/(\d+)/g), l = parseInt(f[0]), c = parseInt(f[1]), h = parseInt(f[2]), p = parseInt(f[3]);
		r.before.push(function(t, n, r) {
			if (t == n)
				return;
			var o = e(t), u = e(n);
			e.fn.cycle.commonReset(t, n, r, !0, !0, !1);
			r.cssAfter.display = "block";
			var a = 1, f = parseInt(r.speedIn / 13) - 1;
			(function d() {
				var e = l ? l - parseInt(a * (l / f)) : 0, t = p ? p - parseInt(a * (p / f)) : 0, n = h < s ? h + parseInt(a * ((s - h) / f || 1)) : s, r = c < i ? c + parseInt(a * ((i - c) / f || 1)) : i;
				u.css({
					clip : "rect(" + e + "px " + r + "px " + n + "px " + t + "px)"
				});
				a++ <= f ? setTimeout(d, 13) : o.css("display", "none")
			})()
		});
		e.extend(r.cssBefore, {
			display : "block",
			opacity : 1,
			top : 0,
			left : 0
		});
		r.animIn = {
			left : 0
		};
		r.animOut = {
			left : 0
		}
	}
})(jQuery);
(function(e, t, n) {
	e.fn.jScrollPane = function(r) {
		function i(r, i) {
			function K(t) {
				var i, o, a, w, E, x, T = !1, C = !1;
				s = t;
				if (u === n) {
					E = r.scrollTop();
					x = r.scrollLeft();
					r.css({
						overflow : "hidden",
						padding : 0
					});
					f = r.innerWidth() + R;
					l = r.innerHeight();
					r.width(f);
					u = e('<div class="jspPane" />').css("padding", q).append(r.children());
					h = e('<div class="jspContainer" />').css({
						width : f + "px",
						height : l + "px"
					}).append(u).appendTo(r)
				} else {
					r.css("width", "");
					T = s.stickToBottom && yt();
					C = s.stickToRight && bt();
					w = r.innerWidth() + R != f || r.outerHeight() != l;
					if (w) {
						f = r.innerWidth() + R;
						l = r.innerHeight();
						h.css({
							width : f + "px",
							height : l + "px"
						})
					}
					if (!w && U == p && u.outerHeight() == d) {
						r.width(f);
						return
					}
					U = p;
					u.css("width", "");
					r.width(f);
					h.find(">.jspVerticalBar,>.jspHorizontalBar").remove().end()
				}
				u.css("overflow", "auto");
				t.contentWidth ? p = t.contentWidth : p = u[0].scrollWidth;
				d = u[0].scrollHeight;
				u.css("overflow", "");
				v = p / f;
				m = d / l;
				g = m > 1;
				y = v > 1;
				if (!y && !g) {
					r.removeClass("jspScrollable");
					u.css({
						top : 0,
						width : h.width() - R
					});
					Et();
					Tt();
					Ct();
					st()
				} else {
					r.addClass("jspScrollable");
					i = s.maintainPosition && (S || N);
					if (i) {
						o = mt();
						a = gt()
					}
					Q();
					Y();
					et();
					if (i) {
						dt( C ? p - f : o, !1);
						pt( T ? d - l : a, !1)
					}
					xt();
					wt();
					At();
					s.enableKeyboardNavigation && Nt();
					s.clickOnTrack && it();
					kt();
					s.hijackInternalLinks && Lt()
				}
				s.autoReinitialise && !I ? I = setInterval(function() {
					K(s)
				}, s.autoReinitialiseDelay) : !s.autoReinitialise && I && clearInterval(I);
				E && r.scrollTop(0) && pt(E, !1);
				x && r.scrollLeft(0) && dt(x, !1);
				r.trigger("jsp-initialised", [y || g])
			}

			function Q() {
				if (g) {
					h.append(e('<div class="jspVerticalBar" />').append(e('<div class="jspCap jspCapTop" />'), e('<div class="jspTrack" />').append(e('<div class="jspDrag" />').append(e('<div class="jspDragTop" />'), e('<div class="jspDragBottom" />'))), e('<div class="jspCap jspCapBottom" />')));
					C = h.find(">.jspVerticalBar");
					k = C.find(">.jspTrack");
					w = k.find(">.jspDrag");
					if (s.showArrows) {
						M = e('<a class="jspArrow jspArrowUp" />').bind("mousedown.jsp", nt(0, -1)).bind("click.jsp", St);
						_ = e('<a class="jspArrow jspArrowDown" />').bind("mousedown.jsp", nt(0, 1)).bind("click.jsp", St);
						if (s.arrowScrollOnHover) {
							M.bind("mouseover.jsp", nt(0, -1, M));
							_.bind("mouseover.jsp", nt(0, 1, _))
						}
						tt(k, s.verticalArrowPositions, M, _)
					}
					A = l;
					h.find(">.jspVerticalBar>.jspCap:visible,>.jspVerticalBar>.jspArrow").each(function() {
						A -= e(this).outerHeight()
					});
					w.hover(function() {
						w.addClass("jspHover")
					}, function() {
						w.removeClass("jspHover")
					}).bind("mousedown.jsp", function(t) {
						e("html").bind("dragstart.jsp selectstart.jsp", St);
						w.addClass("jspActive");
						var n = t.pageY - w.position().top;
						e("html").bind("mousemove.jsp", function(e) {
							ut(e.pageY - n, !1)
						}).bind("mouseup.jsp mouseleave.jsp", ot);
						return !1
					});
					G()
				}
			}

			function G() {
				k.height(A + "px");
				S = 0;
				L = s.verticalGutter + k.outerWidth();
				u.width(f - L - R);
				try {
					C.position().left === 0 && u.css("margin-left", L + "px")
				} catch(e) {
				}
			}

			function Y() {
				if (y) {
					h.append(e('<div class="jspHorizontalBar" />').append(e('<div class="jspCap jspCapLeft" />'), e('<div class="jspTrack" />').append(e('<div class="jspDrag" />').append(e('<div class="jspDragLeft" />'), e('<div class="jspDragRight" />'))), e('<div class="jspCap jspCapRight" />')));
					D = h.find(">.jspHorizontalBar");
					P = D.find(">.jspTrack");
					x = P.find(">.jspDrag");
					if (s.showArrows) {
						j = e('<a class="jspArrow jspArrowLeft" />').bind("mousedown.jsp", nt(-1, 0)).bind("click.jsp", St);
						F = e('<a class="jspArrow jspArrowRight" />').bind("mousedown.jsp", nt(1, 0)).bind("click.jsp", St);
						if (s.arrowScrollOnHover) {
							j.bind("mouseover.jsp", nt(-1, 0, j));
							F.bind("mouseover.jsp", nt(1, 0, F))
						}
						tt(P, s.horizontalArrowPositions, j, F)
					}
					x.hover(function() {
						x.addClass("jspHover")
					}, function() {
						x.removeClass("jspHover")
					}).bind("mousedown.jsp", function(t) {
						e("html").bind("dragstart.jsp selectstart.jsp", St);
						x.addClass("jspActive");
						var n = t.pageX - x.position().left;
						e("html").bind("mousemove.jsp", function(e) {
							ft(e.pageX - n, !1)
						}).bind("mouseup.jsp mouseleave.jsp", ot);
						return !1
					});
					H = h.innerWidth();
					Z()
				}
			}

			function Z() {
				h.find(">.jspHorizontalBar>.jspCap:visible,>.jspHorizontalBar>.jspArrow").each(function() {
					H -= e(this).outerWidth()
				});
				P.width(H + "px");
				N = 0
			}

			function et() {
				if (y && g) {
					var t = P.outerHeight(), n = k.outerWidth();
					A -= t;
					e(D).find(">.jspCap:visible,>.jspArrow").each(function() {
						H += e(this).outerWidth()
					});
					H -= n;
					l -= n;
					f -= t;
					P.parent().append(e('<div class="jspCorner" />').css("width", t + "px"));
					G();
					Z()
				}
				y && u.width(h.outerWidth() - R + "px");
				d = u.outerHeight();
				m = d / l;
				if (y) {
					B = Math.ceil(1 / v * H);
					B > s.horizontalDragMaxWidth ? B = s.horizontalDragMaxWidth : B < s.horizontalDragMinWidth && ( B = s.horizontalDragMinWidth);
					x.width(B + "px");
					T = H - B;
					lt(N)
				}
				if (g) {
					O = Math.ceil(1 / m * A);
					O > s.verticalDragMaxHeight ? O = s.verticalDragMaxHeight : O < s.verticalDragMinHeight && ( O = s.verticalDragMinHeight);
					w.height(O + "px");
					E = A - O;
					at(S)
				}
			}

			function tt(e, t, n, r) {
				var i = "before", s = "after", o;
				t == "os" && ( t = /Mac/.test(navigator.platform) ? "after" : "split");
				if (t == i)
					s = t;
				else if (t == s) {
					i = t;
					o = n;
					n = r;
					r = o
				}
				e[i](n)[s](r)
			}

			function nt(e, t, n) {
				return function() {
					rt(e, t, this, n);
					this.blur();
					return !1
				}
			}

			function rt(t, n, r, i) {
				r = e(r).addClass("jspActive");
				var u, a, f = !0, l = function() {
					t !== 0 && o.scrollByX(t * s.arrowButtonSpeed);
					n !== 0 && o.scrollByY(n * s.arrowButtonSpeed);
					a = setTimeout(l, f ? s.initialDelay : s.arrowRepeatFreq);
					f = !1
				};
				l();
				u = i ? "mouseout.jsp" : "mouseup.jsp";
				i = i || e("html");
				i.bind(u, function() {
					r.removeClass("jspActive");
					a && clearTimeout(a);
					a = null;
					i.unbind(u)
				})
			}

			function it() {
				st();
				g && k.bind("mousedown.jsp", function(t) {
					if (t.originalTarget === n || t.originalTarget == t.currentTarget) {
						var r = e(this), i = r.offset(), u = t.pageY - i.top - S, a, f = !0, h = function() {
							var e = r.offset(), n = t.pageY - e.top - O / 2, i = l * s.scrollPagePercent, c = E * i / (d - l);
							if (u < 0)
								S - c > n ? o.scrollByY(-i) : ut(n);
							else {
								if (!(u > 0)) {
									p();
									return
								}
								S + c < n ? o.scrollByY(i) : ut(n)
							}
							a = setTimeout(h, f ? s.initialDelay : s.trackClickRepeatFreq);
							f = !1
						}, p = function() {
							a && clearTimeout(a);
							a = null;
							e(document).unbind("mouseup.jsp", p)
						};
						h();
						e(document).bind("mouseup.jsp", p);
						return !1
					}
				});
				y && P.bind("mousedown.jsp", function(t) {
					if (t.originalTarget === n || t.originalTarget == t.currentTarget) {
						var r = e(this), i = r.offset(), u = t.pageX - i.left - N, a, l = !0, h = function() {
							var e = r.offset(), n = t.pageX - e.left - B / 2, i = f * s.scrollPagePercent, c = T * i / (p - f);
							if (u < 0)
								N - c > n ? o.scrollByX(-i) : ft(n);
							else {
								if (!(u > 0)) {
									d();
									return
								}
								N + c < n ? o.scrollByX(i) : ft(n)
							}
							a = setTimeout(h, l ? s.initialDelay : s.trackClickRepeatFreq);
							l = !1
						}, d = function() {
							a && clearTimeout(a);
							a = null;
							e(document).unbind("mouseup.jsp", d)
						};
						h();
						e(document).bind("mouseup.jsp", d);
						return !1
					}
				})
			}

			function st() {
				P && P.unbind("mousedown.jsp");
				k && k.unbind("mousedown.jsp")
			}

			function ot() {
				e("html").unbind("dragstart.jsp selectstart.jsp mousemove.jsp mouseup.jsp mouseleave.jsp");
				w && w.removeClass("jspActive");
				x && x.removeClass("jspActive")
			}

			function ut(e, t) {
				if (!g)
					return;
				e < 0 ? e = 0 : e > E && ( e = E);
				t === n && ( t = s.animateScroll);
				if (t)
					o.animate(w, "top", e, at);
				else {
					w.css("top", e);
					at(e)
				}
			}

			function at(e) {
				e === n && ( e = w.position().top);
				h.scrollTop(0);
				S = e;
				var t = S === 0, i = S == E, s = e / E, o = -s * (d - l);
				if (z != t || X != i) {
					z = t;
					X = i;
					r.trigger("jsp-arrow-change", [z, X, W, V])
				}
				ct(t, i);
				u.css("top", o);
				r.trigger("jsp-scroll-y", [-o, t, i]).trigger("scroll")
			}

			function ft(e, t) {
				if (!y)
					return;
				e < 0 ? e = 0 : e > T && ( e = T);
				t === n && ( t = s.animateScroll);
				if (t)
					o.animate(x, "left", e, lt);
				else {
					x.css("left", e);
					lt(e)
				}
			}

			function lt(e) {
				e === n && ( e = x.position().left);
				h.scrollTop(0);
				N = e;
				var t = N === 0, i = N == T, s = e / T, o = -s * (p - f);
				if (W != t || V != i) {
					W = t;
					V = i;
					r.trigger("jsp-arrow-change", [z, X, W, V])
				}
				ht(t, i);
				u.css("left", o);
				r.trigger("jsp-scroll-x", [-o, t, i]).trigger("scroll")
			}

			function ct(e, t) {
				if (s.showArrows) {
					M[e?"addClass":"removeClass"]("jspDisabled");
					_[t?"addClass":"removeClass"]("jspDisabled")
				}
			}

			function ht(e, t) {
				if (s.showArrows) {
					j[e?"addClass":"removeClass"]("jspDisabled");
					F[t?"addClass":"removeClass"]("jspDisabled")
				}
			}

			function pt(e, t) {
				var n = e / (d - l);
				ut(n * E, t)
			}

			function dt(e, t) {
				var n = e / (p - f);
				ft(n * T, t)
			}

			function vt(t, n, r) {
				var i, o, u, a = 0, c = 0, p, d, v, m, g, y;
				try {
					i = e(t)
				} catch(w) {
					return
				}
				o = i.outerHeight();
				u = i.outerWidth();
				h.scrollTop(0);
				h.scrollLeft(0);
				while (!i.is(".jspPane")) {
					a += i.position().top;
					c += i.position().left;
					i = i.offsetParent();
					if (/^body|html$/i.test(i[0].nodeName))
						return
				}
				p = gt();
				v = p + l;
				a < p || n ? g = a - s.verticalGutter : a + o > v && ( g = a - l + o + s.verticalGutter);
				g && pt(g, r);
				d = mt();
				m = d + f;
				c < d || n ? y = c - s.horizontalGutter : c + u > m && ( y = c - f + u + s.horizontalGutter);
				y && dt(y, r)
			}

			function mt() {
				return -u.position().left
			}

			function gt() {
				return -u.position().top
			}

			function yt() {
				var e = d - l;
				return e > 20 && e - gt() < 10
			}

			function bt() {
				var e = p - f;
				return e > 20 && e - mt() < 10
			}

			function wt() {
				h.unbind(J).bind(J, function(e, t, n, r) {
					var i = N, u = S;
					o.scrollBy(n * s.mouseWheelSpeed, -r * s.mouseWheelSpeed, !1);
					return i == N && u == S
				})
			}

			function Et() {
				h.unbind(J)
			}

			function St() {
				return !1
			}

			function xt() {
				u.find(":input,a").unbind("focus.jsp").bind("focus.jsp", function(e) {
					vt(e.target, !1)
				})
			}

			function Tt() {
				u.find(":input,a").unbind("focus.jsp")
			}

			function Nt() {
				function a() {
					var e = N, r = S;
					switch(t) {
						case 40:
							o.scrollByY(s.keyboardSpeed, !1);
							break;
						case 38:
							o.scrollByY(-s.keyboardSpeed, !1);
							break;
						case 34:
						case 32:
							o.scrollByY(l * s.scrollPagePercent, !1);
							break;
						case 33:
							o.scrollByY(-l * s.scrollPagePercent, !1);
							break;
						case 39:
							o.scrollByX(s.keyboardSpeed, !1);
							break;
						case 37:
							o.scrollByX(-s.keyboardSpeed, !1)
					}
					n = e != N || r != S;
					return n
				}

				var t, n, i = [];
				y && i.push(D[0]);
				g && i.push(C[0]);
				u.focus(function() {
					r.focus()
				});
				r.attr("tabindex", 0).unbind("keydown.jsp keypress.jsp").bind("keydown.jsp", function(r) {
					if (r.target !== this && (!i.length || !e(r.target).closest(i).length))
						return;
					var s = N, o = S;
					switch(r.keyCode) {
						case 40:
						case 38:
						case 34:
						case 32:
						case 33:
						case 39:
						case 37:
							t = r.keyCode;
							a();
							break;
						case 35:
							pt(d - l);
							t = null;
							break;
						case 36:
							pt(0);
							t = null
					}
					n = r.keyCode == t && s != N || o != S;
					return !n
				}).bind("keypress.jsp", function(e) {
					e.keyCode == t && a();
					return !n
				});
				if (s.hideFocus) {
					r.css("outline", "none");
					"hideFocus" in h[0] && r.attr("hideFocus", !0)
				} else {
					r.css("outline", "");
					"hideFocus" in h[0] && r.attr("hideFocus", !1)
				}
			}

			function Ct() {
				r.attr("tabindex", "-1").removeAttr("tabindex").unbind("keydown.jsp keypress.jsp")
			}

			function kt() {
				if (location.hash && location.hash.length > 1) {
					var t, n, r = escape(location.hash.substr(1));
					try {
						t = e("#" + r + ', a[name="' + r + '"]')
					} catch(i) {
						return
					}
					if (t.length && u.find(r))
						if (h.scrollTop() === 0)
							n = setInterval(function() {
								if (h.scrollTop() > 0) {
									vt(t, !0);
									e(document).scrollTop(h.position().top);
									clearInterval(n)
								}
							}, 50);
						else {
							vt(t, !0);
							e(document).scrollTop(h.position().top)
						}
				}
			}

			function Lt() {
				if (e(document.body).data("jspHijack"))
					return;
				e(document.body).data("jspHijack", !0);
				e(document.body).delegate("a[href*=#]", "click", function(n) {
					var r = this.href.substr(0, this.href.indexOf("#")), i = location.href, s, o, u, f, l, c;
					location.href.indexOf("#") !== -1 && ( i = location.href.substr(0, location.href.indexOf("#")));
					if (r !== i)
						return;
					s = escape(this.href.substr(this.href.indexOf("#") + 1));
					o;
					try {
						o = e("#" + s + ', a[name="' + s + '"]')
					} catch(h) {
						return
					}
					if (!o.length)
						return;
					u = o.closest(".jspScrollable");
					f = u.data("jsp");
					f.scrollToElement(o, !0);
					if (u[0].scrollIntoView) {
						l = e(t).scrollTop();
						c = o.offset().top;
						(c < l || c > l + e(t).height()) && u[0].scrollIntoView()
					}
					n.preventDefault()
				})
			}

			function At() {
				var e, t, n, r, i, s = !1;
				h.unbind("touchstart.jsp touchmove.jsp touchend.jsp click.jsp-touchclick").bind("touchstart.jsp", function(o) {
					var u = o.originalEvent.touches[0];
					e = mt();
					t = gt();
					n = u.pageX;
					r = u.pageY;
					i = !1;
					s = !0
				}).bind("touchmove.jsp", function(u) {
					if (!s)
						return;
					var a = u.originalEvent.touches[0], f = N, l = S;
					o.scrollTo(e + n - a.pageX, t + r - a.pageY);
					i = i || Math.abs(n - a.pageX) > 5 || Math.abs(r - a.pageY) > 5;
					return f == N && l == S
				}).bind("touchend.jsp", function(e) {
					s = !1
				}).bind("click.jsp-touchclick", function(e) {
					if (i) {
						i = !1;
						return !1
					}
				})
			}

			function Ot() {
				var e = gt(), t = mt();
				r.removeClass("jspScrollable").unbind(".jsp");
				r.replaceWith($.append(u.children()));
				$.scrollTop(e);
				$.scrollLeft(t);
				I && clearInterval(I)
			}

			var s, o = this, u, f, l, h, p, d, v, m, g, y, w, E, S, x, T, N, C, k, L, A, O, M, _, D, P, H, B, j, F, I, q, R, U, z = !0, W = !0, X = !1, V = !1, $ = r.clone(!1, !1).empty(), J = e.fn.mwheelIntent ? "mwheelIntent.jsp" : "mousewheel.jsp";
			q = r.css("paddingTop") + " " + r.css("paddingRight") + " " + r.css("paddingBottom") + " " + r.css("paddingLeft");
			R = (parseInt(r.css("paddingLeft"), 10) || 0) + (parseInt(r.css("paddingRight"), 10) || 0);
			e.extend(o, {
				reinitialise : function(t) {
					t = e.extend({}, s, t);
					K(t)
				},
				scrollToElement : function(e, t, n) {
					vt(e, t, n)
				},
				scrollTo : function(e, t, n) {
					dt(e, n);
					pt(t, n)
				},
				scrollToX : function(e, t) {
					dt(e, t)
				},
				scrollToY : function(e, t) {
					pt(e, t)
				},
				scrollToPercentX : function(e, t) {
					dt(e * (p - f), t)
				},
				scrollToPercentY : function(e, t) {
					pt(e * (d - l), t)
				},
				scrollBy : function(e, t, n) {
					o.scrollByX(e, n);
					o.scrollByY(t, n)
				},
				scrollByX : function(e, t) {
					var n = mt() + Math[e<0?"floor":"ceil"](e), r = n / (p - f);
					ft(r * T, t)
				},
				scrollByY : function(e, t) {
					var n = gt() + Math[e<0?"floor":"ceil"](e), r = n / (d - l);
					ut(r * E, t)
				},
				positionDragX : function(e, t) {
					ft(e, t)
				},
				positionDragY : function(e, t) {
					ut(e, t)
				},
				animate : function(e, t, n, r) {
					var i = {};
					i[t] = n;
					e.animate(i, {
						duration : s.animateDuration,
						easing : s.animateEase,
						queue : !1,
						step : r
					})
				},
				getContentPositionX : function() {
					return mt()
				},
				getContentPositionY : function() {
					return gt()
				},
				getContentWidth : function() {
					return p
				},
				getContentHeight : function() {
					return d
				},
				getPercentScrolledX : function() {
					return mt() / (p - f)
				},
				getPercentScrolledY : function() {
					return gt() / (d - l)
				},
				getIsScrollableH : function() {
					return y
				},
				getIsScrollableV : function() {
					return g
				},
				getContentPane : function() {
					return u
				},
				scrollToBottom : function(e) {
					ut(E, e)
				},
				hijackInternalLinks : e.noop,
				destroy : function() {
					Ot()
				}
			});
			K(i)
		}

		r = e.extend({}, e.fn.jScrollPane.defaults, r);
		e.each(["mouseWheelSpeed", "arrowButtonSpeed", "trackClickSpeed", "keyboardSpeed"], function() {
			r[this] = r[this] || r.speed
		});
		return this.each(function() {
			var t = e(this), n = t.data("jsp");
			if (n)
				n.reinitialise(r);
			else {
				e("script", t).filter('[type="text/javascript"],:not([type])').remove();
				n = new i(t, r);
				t.data("jsp", n)
			}
		})
	};
	e.fn.jScrollPane.defaults = {
		showArrows : !1,
		maintainPosition : !0,
		stickToBottom : !1,
		stickToRight : !1,
		clickOnTrack : !0,
		autoReinitialise : !1,
		autoReinitialiseDelay : 500,
		verticalDragMinHeight : 0,
		verticalDragMaxHeight : 99999,
		horizontalDragMinWidth : 0,
		horizontalDragMaxWidth : 99999,
		contentWidth : n,
		animateScroll : !1,
		animateDuration : 300,
		animateEase : "linear",
		hijackInternalLinks : !1,
		verticalGutter : 4,
		horizontalGutter : 4,
		mouseWheelSpeed : 0,
		arrowButtonSpeed : 0,
		arrowRepeatFreq : 50,
		arrowScrollOnHover : !1,
		trackClickSpeed : 0,
		trackClickRepeatFreq : 70,
		verticalArrowPositions : "split",
		horizontalArrowPositions : "split",
		enableKeyboardNavigation : !0,
		hideFocus : !1,
		keyboardSpeed : 0,
		initialDelay : 300,
		speed : 30,
		scrollPagePercent : .8
	}
})(jQuery, this);
(function(e) {
	var t = "waitForImages";
	e.waitForImages = {
		hasImageProperties : ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage"]
	}, e.expr[":"].uncached = function(t) {
		if (!e(t).is('img[src!=""]'))
			return !1;
		var n = document.createElement("img");
		return n.src = t.src, !n.complete
	}, e.fn.waitForImages = function(n, r, i) {
		e.isPlainObject(arguments[0]) && ( r = n.each, i = n.waitForAll, n = n.finished), n = n || e.noop, r = r || e.noop, i = !!i;
		if (!e.isFunction(n) || !e.isFunction(r))
			throw new TypeError("An invalid callback was supplied.");
		return this.each(function() {
			var s = e(this), o = [];
			if (i) {
				var u = e.waitForImages.hasImageProperties || [], a = /url\((['"]?)(.*?)\1\)/g;
				s.find("*").each(function() {
					var t = e(this);
					t.is("img:uncached") && o.push({
						src : t.attr("src"),
						element : t[0]
					}), e.each(u, function(e, n) {
						var r = t.css(n);
						if (!r)
							return !0;
						var i;
						while ( i = a.exec(r))
						o.push({
							src : i[2],
							element : t[0]
						})
					})
				})
			} else
				s.find("img:uncached").each(function() {
					o.push({
						src : this.src,
						element : this
					})
				});
			var f = o.length, l = 0;
			f == 0 && n.call(s[0]), e.each(o, function(i, o) {
				var u = new Image;
				e(u).bind("load." + t + " error." + t, function(e) {
					l++, r.call(o.element, l, f, e.type == "load");
					if (l == f)
						return n.call(s[0]), !1
				}), u.src = o.src
			})
		})
	}
})(jQuery); 