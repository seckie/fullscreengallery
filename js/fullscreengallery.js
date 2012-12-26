/**
 * Vertical Fullscreen Gallery
 *
 * @author     Naoki Sekiguchi
 * @copyright  2012 Naoki Sekiguchi
 * @url        http://ranagram.com/
 * @url        http://likealunatic.jp/
 * @since      2012-12-06 12:56:25
 * @require    jQuery.js, Underscore.js, Backbone.js, Modernizr.js, jquery.preloadimg.js plugin
 */

;(function($, _, window, document, undefined) {

if (typeof window.fsg != 'object') { window.fsg = {}; }

/**
 * gallery core
 */
window.fsg.Gallery = Backbone.View.extend({//{{{
	el: '.slide',
	initialize: function (options) {
		var events = {};
		this.opt = {
			prevNav: '.prev',
			nextNav: '.next',
			defaultIndex: 0,
			changeComplete: function (index) { }
		};
		_.extend(this.opt, options);
		_.bindAll(this);
		this.index = this.opt.defaultIndex;
		this.$prevNav = $(this.opt.prevNav);
		this.$nextNav = $(this.opt.nextNav);
		this.$wrapper = this.$el.parent();

		this.$prevNav.on('click', this.changePrev);
		this.$nextNav.on('click', this.changeNext);
		$(window).on('resize', this.resetSize);
		this.render();
	},
	render: function () {
		this.resetSize();
		this.updateNav(this.index);
	},
	resetSize: function (e) {
		var winH = $(window).height();
		this.$el.height(winH);
		this.$wrapper.height(winH * this.$el.length).css({
			top: -1 * winH * this.index
		});
	},
	changePrev: function (e) {
		if (this.preventChange) { return; }
		if (this.index > 0) {
			this.index --;
			this.change(this.index);
			this.updateNav(this.index);
		} else {
			return false;
		}
		e.preventDefault();
	},
	changeNext: function (e) {
		if (this.preventChange) { return; }
		if (this.index < this.$el.length - 1) {
			this.index ++;
			this.change(this.index);
			this.updateNav(this.index);
		} else {
			return false;
		}
		e.preventDefault();
	},
	change: function (index) {
		var winH = $(window).height();
		this.$wrapper.stop(true, true).animate({
			'top': -1 * winH * index
		}, 750, _.bind(function () {
			this.opt.changeComplete.call(this, this.index);
		}, this));
	},
	updateNav: function (index) {
		if (index <= 0) {
			this.$prevNav.hide();
			this.$nextNav.show();
		} else if (index >= this.$el.length - 1) {
			this.$prevNav.show();
			this.$nextNav.hide();
		} else {
			this.$prevNav.show();
			this.$nextNav.show();
		}
	},
	breakChange: function () {
		this.preventChange = true;
	},
	restartChange: function () {
		this.preventChange = false;
	}
});//}}}

/**
 * background-size fallback
 * @require jquery.preloadimg.js, modernizr.js
 */
window.fsg.backgroundSizeFallback = Backbone.View.extend({//{{{
	el: '.page',
	initialize: function (options) {
		this.opt = { test: false };
		_.extend(this.opt, options);
		if (!Modernizr.backgroundsize || this.opt.test) {
			this.render();
		}
		$(window).on('resize', _.bind(function () {
			this.resetImageSize(this.$el.find('img'));
		}, this));
	},
	render: function () {
		var $bd = $('body');
		this.$el.each(_.bind(function (i, el) {
			var url = this.getBackgroundImageURL(el);
			var $img = this.createImage(el, url);
			$bd.preloadImg({
				srcs: [url],
				complete: _.bind(function (imgHolder) {
					this.resetImageSize($img);
					this.appendImage(el, $img);
				}, this)
			});
		}, this));
	},
	getBackgroundImageURL: function (el) {
		var url = $(el).css('background-image');
		return url.replace(/url\(['"]?([^'"\)]*)['"]?\)/, '$1');
	},
	createImage: function (el, url) {
		var $img = $('<img/>', {
			src: url,
			alt: ''
		}).css({
			position: 'absolute',
			top: 0,
			left: '50%'
		});
		return $img;
	},
	getImageSize: function ($orgimg) {
		var w, h;
		var $img = $orgimg.clone();
		$img.css({
			visibility: 'hidden',
			position: 'absolute',
			left: -9999
		}).appendTo(document.body);
		w = $img.width();
		h = $img.height();
		$img.remove();
		return {
			width: w,
			height: h
		};
	},
	resetImageSize: function ($img) {
		var winW = $(window).width();
		var winH = $(window).height();
		var size = this.getImageSize($img);
		var ratio = size.width / size.height;
		var w, h;
		if (winH * ratio < winW) { // landscape
			w = winW;
			h = Math.floor(winW / ratio);
		} else { // portrait
			w = Math.floor(winH * ratio);
			h = winH;
		}
		$img.css({
			width: w,
			height: h,
			left: '50%',
			visibility: '',
			marginLeft: -1 * (w / 2)
		});
	},
	appendImage: function (el, $img) {
		$(el).append($img).css('background-image', 'none');
	}
});//}}}

/**
 * background-image adjustment with window size
 * @require modernizr.js
 */
window.fsg.backgroundSizeAdjust = Backbone.View.extend({//{{{
	el: window,
	initialize: function (options) {
		this.opt = {
			layerEl: '', 
			width: 0,
			height: 0,
			test: false
		};
		_.extend(this.opt, options);
		if (!Modernizr.backgroundsize) {
			return false;
		}
		this.$layer = $(this.opt.layerEl);
		this.delegateEvents({
			'resize': 'render'
		});
		this.render();
	},
	render: function () {
		var winW = this.$el.width();
		var winH = this.$el.height();
		var ratio = this.opt.width / this.opt.height;
		if (winH * ratio < winW) { // landscape
			this.$layer.css({
				'background-size': '100% auto',
				'-webkit-background-size': '100% auto',
				'-moz-background-size': '100% auto',
				'-ms-background-size': '100% auto',
				'-o-background-size': '100% auto'
			});
		} else { // portrait
			this.$layer.css({
				'background-size': 'auto 100%',
				'-webkit-background-size': 'auto 100%',
				'-moz-background-size': 'auto 100%',
				'-ms-background-size': 'auto 100%',
				'-o-background-size': 'auto 100%'
			});
		}
	}
});//}}}

})(jQuery, _, this, this.document);
