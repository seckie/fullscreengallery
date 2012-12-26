/**
 * Scripts for Some Website
 *
 * @author     RaNa gRam
 * @copyright  2012 RaNa gRam
 * @url        http://ranagram.com/
 * @since      2012-12-06 12:56:25
 */

;(function(window, document, undefined) {
// userAgent detection
var ua = navigator.userAgent.toLowerCase();
var browser = {};
browser.msie = /msie/.test(ua);
browser.safari = /safari/.test(ua);
browser.chrome = /chrome/.test(ua);
browser.firefox = /firefox/.test(ua);
browser.opera = /opera/.test(ua);

// global object
if (typeof window._2ga != 'object') { window._2ga = {}; }

// config
var CONFIG = {
	scrollUnit: 15,
	scrollLimit: 100,
	navCurrentClassName: 'current'
};
if (browser.msid) {
	CONFIG.scrollUnit = 20;
}

// load
Modernizr.load({
	load: [
		'js/jquery-1.8.3.min.js',
		'js/jquery.easing.1.3.js',
		'js/jquery.animate-enhanced.js',
		'js/jquery.preloadimg.js',
		'js/underscore-min.js',
		'js/backbone-min.js',
		'js/swfobject.js',
		'js/swfsound.js',
		'js/module.js'
	],
	complete: function () {
		$(function () {
			if (/\/(index.html)?#?$/.test(location.href)) {
				// index page
				indexPageInitialize();
			} else {
				window._2ga.onload = false;
				setCurrentCategory();
				initialize();
				$(window).on('resize', function () {
					var fragment = location.hash.replace(/#([^\/]*)?\/?([a-zA-Z0-9\-_]+)$/, '$1');
					initPageHeight(fragment);
				});
				window._2ga.onload = true;
			}
		});
	}
});

function setCurrentCategory() {
	var hashid = location.hash.replace(/#([^\/]*\/)?([a-zA-Z0-9\-_]+)$/, '$1$2');
	var categoryid;
	hashid = hashid != '' ? hashid : 'exterior/p1'; // default id
	categoryid = hashid.replace(/([^\/]*)?\/?([a-zA-Z0-9\-_]+)$/, '$1');
	window._2ga.currentHash = window._2ga.currentHash || categoryid + '/p1';
	window._2ga.currentCategory = window._2ga.currentCategory || categoryid;

	// highlight current navigation
	$('.gnav a[href*="' + categoryid + '"]').addClass(CONFIG.navCurrentClassName);
}

function initPageHeight(fragment) {
	if (!fragment) { fragment = 'exterior'; }
	var totalH = 0;
	var winH = $(window).height();
 	var $category = $('#' + fragment);
	var $page = $category.find('.page');
	for (var i=0,l=$page.length; i<l ; i++) {
		totalH += winH;
	}
	$('.category-wrapper').height(totalH);
	$page.height(winH);
}

function initialize() {
	// screen size helper
	var screenSizeHelper = new window._2ga.screenSizeHelper({
		width: 1600,
		height: 900
	});

	var customAnimations = {
		exterior3: {
			'1': function (index) {
				var dfd = $.Deferred();
				$('#soundcontent')[0].flash_soundExtra1()
				$(this.$layer[1]).animate({
					'opacity': 0
				}, 500, _.bind(function () {
					dfd.resolve();
				}, this));
				return dfd.promise();
			}
		},
		exterior4: {
			'0': function (index) {
				var dfd = $.Deferred();
				var $layer = this.$layer;
				var $layer1 = $(this.$layer[0]);
				var ev = 'webkitTransitionEnd oTransitionEnd transitionend';
				var ratio = screenSizeHelper.portlaitOrLandsape === 'landscape' ? $(window).width() / 1600 : $(window).height() / 900;
console.log('ratio:', ratio);
console.log(screenSizeHelper.portlaitOrLandsape);
				$layer1.addClass('on');
				$layer1.find('.img').css({
					width: Math.floor(752 * ratio),
					height: Math.floor(513 * ratio),
					marginLeft: -1 * Math.floor(752 / 2 * ratio),
					marginTop: -1 * Math.floor(233 * ratio)
				});
				$layer1.find('.img>img').off(ev).on(ev, function (e) {
					$($layer[0]).animate({
						'opacity': 0
					}, 500, _.bind(function () {
						$($layer[1]).animate({
							'opacity': 0
						}, 500, _.bind(function () {
						}, this));
					}, this));
				});
				return dfd.promise();
			}
		},
		interior5: {
			'0': function () {
				var dfd = $.Deferred();
				$(this.$layer[0]).animate({
					'opacity': 1
				}, 750, _.bind(function () {
					$('#soundcontent')[0].flash_soundExtra2()
					dfd.resolve();
				}, this));
				return dfd.promise();
			}
		},
		interior7: {
			'0': function () {
				var dfd = $.Deferred();
				$(this.$layer[0]).animate({
					'opacity': 1
				}, 750, _.bind(function () {
					setTimeout(function () {
						dfd.resolve();
					}, 750);
				}, this));
				return dfd.promise();
			}
		},
		interior8: {
			'0': function () {
				var dfd = $.Deferred();
				$(this.$layer[0]).animate({
					'opacity': 1
				}, 750, _.bind(function () {
					setTimeout(function () {
						dfd.resolve();
					}, 750);
				}, this));
				return dfd.promise();
			},
			'2': function () {
				var dfd = $.Deferred();
				$(this.$layer[0]).fadeOut(500); // hide txt1
				$(this.$layer[2]).animate({
					'opacity': 1
				}, 750, _.bind(function () {
					setTimeout(function () {
						dfd.resolve();
					}, 750);
				}, this));
				return dfd.promise();
			}
		},
		engine1: {
			'0': function () {
				var dfd = $.Deferred();
				$(this.$layer[0]).animate({
					'opacity': 1
				}, 750, _.bind(function () {
					setTimeout(function () {
						dfd.resolve();
					}, 750);
				}, this));
				return dfd.promise();
			}
		},
		engine2: {
			'0': function () {
				var dfd = $.Deferred();
				$(this.$layer[0]).animate({
					'opacity': 1
				}, 750, _.bind(function () {
					setTimeout(function () {
						dfd.resolve();
					}, 750);
				}, this));
				return dfd.promise();
			}
		}
	};

	// initialize each page
	$('.page').each(function (i, page) {
		// layout
		$(page).height($(window).height());

		// setup special pages
		var trigger = $(page).find('.bg2, .txt1, .txt2, .txt3');
		if (trigger[0]) {
			page.specialPage = new window._2ga.SpecialPage2({
				el: page,
				layerSelector: '.bg, .txt1, .txt2, .txt3, .thene1',
				threshold: 50,
				animateDuration: 1000,
				allAnimateComplete: function () {
					scrollContents.action.lockPageFunctions();
				},
				customAnimations: customAnimations[page.id] 
			});
		}
	});

	var scrollContents = {
		common: function () {
			if (this.action) {
				this.action.destroy();
				this.action = null;
			}
		},
		exterior: function () {
			this.common();
			this.action = new window._2ga.ScrollEmulator({
				unit: CONFIG.scrollUnit,
				limit: CONFIG.scrollLimit,
				pageEl: '#exterior .page',
				pageFunctions: {
					'2': function () {
						this.$page[2].specialPage.prepare();
					},
					'3': function () {
						this.$page[3].specialPage.prepare();
					},
					'4': function () {
						this.$page[4].specialPage.prepare();
					},
					'5': function () {
						this.$page[5].specialPage.prepare();
					}
				},
				resetPage: function (page) {
					page.specialPage.resetLayer();
				}
			});
		},
		interior: function () {
			this.common();
			this.action = new window._2ga.ScrollEmulator({
				unit: CONFIG.scrollUnit,
				pageEl: '#interior .page',
				pageFunctions: {
					'4': function () {
						this.$page[4].specialPage.prepare();
					},
					'6': function () {
						this.$page[6].specialPage.prepare();
					},
					'7': function () {
						this.$page[7].specialPage.prepare();
					}
				},
				resetPage: function (page) {
					page.specialPage.resetLayer();
					page.specialPage.$el.find('.txt1, .txt2').css('opacity', 0);
				}
			});
		},
		engine: function () {
			this.common();
			this.action = new window._2ga.ScrollEmulator({
				unit: CONFIG.scrollUnit,
				pageEl: '#engine .page',
				pageFunctions: {
					'0': function () {
						this.$page[0].specialPage.prepare();
					},
					'1': function () {
						this.$page[1].specialPage.prepare();
					}
				},
				resetPage: function (page) {
					page.specialPage.$el.find('.txt1').css('opacity', 0);
				}
			});
		},
		gallery: function () {
			this.common();
			this.action = new window._2ga.ScrollEmulator({
				unit: CONFIG.scrollUnit,
				pageEl: '#gallery .page'
			});
		},
		tvcm: function () {
			this.common();
			this.action = new window._2ga.ScrollEmulator({
				unit: CONFIG.scrollUnit,
				pageEl: '#tvcm .page'
			});
		},
		link: function () {
			this.common();
			this.action = new window._2ga.ScrollEmulator({
				unit: CONFIG.scrollUnit,
				pageEl: '#link .page'
			});
		}
	};

	// Backbone Router
	var workspace = new window._2ga.Workspace({
		beforeHashchange: function (fragment, query) {
			var dfd = $.Deferred();
			if (fragment === 'engine') {
				$('#engine1')[0].specialPage.prepare();
			}
			// reset layer
			$('.page').each(function (i, page) {
				if (page.specialPage) {
					page.animated = false;
					if (scrollContents.action && typeof scrollContents.action.opt.resetPage === 'function') {
						scrollContents.action.opt.resetPage(page);
					}
				}
			});

			// change style
			if (window._2ga.onload === false) {
				dfd.resolve();
			} else {
				$('#' + window._2ga.currentCategory).fadeOut(function () {
					dfd.resolve();
				});
			}
			return dfd.promise();
		},
		hashchange: function (fragment, query) {
			var $category = $('#' + fragment);
			var $page = $('#' + fragment + query);
			var $gnavLink = $('.gnav a'); 
			// style change
			$category.css({
				'opacity': 0,
				'display': 'block'
			});
			initPageHeight(fragment);
			// scroll to current content
			if ($page[0]) {
				window.scrollTo(0, $page.offset().top);
			}
			// save category & hash
			if (query) {
				window._2ga.currentHash = fragment + '/p' + query;
			}
			window._2ga.currentCategory = fragment;
			// animation
			$category.animate({
				'opacity': 1
			}, 1000, function () {
				// reset scroll action module
				scrollContents[fragment](); 
			});
			// update global nav state
			$gnavLink.removeClass(CONFIG.navCurrentClassName);
			$gnavLink.filter('[href*="' + fragment + '"]').addClass(CONFIG.navCurrentClassName);
		}
	});
	Backbone.history.start();
	workspace.navigate(window._2ga.currentHash, { trigger: true });

	// rewrite hash link for Router
	$('.gnav a, .page a[href^="#"]').each(function (i, a) {
		var $a = $(a);
		var href = $a.attr('href');
		var currentPage;
		href = href.replace(/#([a-zA-Z0-9_\-]+)$/, '$1');
		$a.on('click', function (e) {
			// hash change
			workspace.navigate(href + '/p1', { trigger: true });
			e.preventDefault();
		});
	});

	// hightlight current navigation
	var $soundNavLink = $('.navsound a');
	$soundNavLink.on('click', function (e) {
		$soundNavLink.removeClass(CONFIG.navCurrentClassName);
		$(this).addClass(CONFIG.navCurrentClassName);
		e.preventDefault();
	});

	// background-size fallback
	var backgroundSizeFallback = new window._2ga.backgroundSizeFallback({
		el: '.bg1, .bg2, .bg3, .bg4, .bg5, .bg6, .bg7, .bg8, .bg9, .bg0'
	});

	// fade rollover
	var fadeRollover = new window._2ga.FadeRollover({
		el: '.gnav a, .navsound a, .navlang a, .mod-modenav a, .mod-typenav a, .btn-backtotop a',
		className: 'on',
		extraClassName: CONFIG.navCurrentClassName
	});

	// background-size adjustment
	if (Modernizr.backgroundsize) {
		var backgroundsizeAdjust = new window._2ga.backgroundSizeAdjust({
			layerEl: '.bg, .bg0',
			width: 1600,
			height: 900
		});
	}

	// sound
	$.loadSound({
		url: 'sound.swf',
		id: 'soundcontent',
		width: 1,
		height: 1,
		ver: '9.0.45',
		buttonEl: 'a',
		triggerOnEl: '.navsound .nav1',
		triggerOffEl: '.navsound .nav2',
		currentClassName: 'current',
		fallback: function () {
			$('.navsound').hide();
		},
		custom: function () {
			
		}
	});

	// scroll attention
	setTimeout(function () {
		var easing = 'easeOutCubic';
		$('.mod-scrollattention').css({
			bottom: 220
		}).fadeIn(500).animate({
			bottom: 160 
		}, 800, easing).animate({
			bottom: 180
		}, 500, easing).animate({
			bottom: 160
		}, 500, easing).animate({
			bottom: 180
		}, 500, easing).fadeOut(500);
	}, 1000);

}

function indexPageInitialize()  {
	// background-size adjustment
	if (Modernizr.backgroundsize) {
		var backgroundsizeAdjust = new window._2ga.backgroundSizeAdjust({
			layerEl: '.bg',
			width: 1600,
			height: 900
		});
	}

	// background-size fallback
	var backgroundSizeFallback = new window._2ga.backgroundSizeFallback({
		el: '.area-bd>.bg'
	});

	// fade rollover
	var fadeRollover = new window._2ga.FadeRollover({
		el: '.mod-indexnav a.auto, .navsound a, .navlang a, .mod-modenav a',
		className: 'on',
		extraClassName: CONFIG.navCurrentClassName
	});
}

})(this, this.document);

// "console" object for Legacy Browsers
if (!console) { var console = { log: function() { var s = ''; for (var i=0, l=arguments.length; i<l; i++) { s += arguments[i]; } /*alert(s);*/ } }; }
