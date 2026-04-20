(function($) {
    "use strict";

    // ====================================================== 
    // =                 1) Global Variable                 =
    // ======================================================
    // 
    // 
    // 

    // *** 1.1) Permenant vars
    // -----------------------------------------------------
    var $window = $(window),
        $html = $("html"),
        $body = $("body"),
        $nav_wrapper = $("#nav-wrapper"),
        $lightgallery = $(".js-lightgallery"),
        transitionEnd = "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
        animationEnd = "webkitAnimationEnd oAnimationEnd animationend",
        is_ie_upto_10 = false,
        is_ie_11 = false,
        is_edge = false,
        mq_break_pt = 768,
        mq_break_pt_nav = 856,

        animations__enabled = true,
        animations__on_mouse_move__enabled = true,
        animations__on_scroll__enabled = true,
        animations__on_page_load = true;

    if (!animations__enabled) {
        animations__on_mouse_move__enabled = false;
        animations__on_scroll__enabled = false;
        animations__on_page_load = false;
    }

    if (!animations__enabled) {
        $html.addClass('animation--disabled');
    }

    if (!animations__on_mouse_move__enabled) {
        $html.addClass('animation--on-mouse-move--disabled');
    }

    if (!animations__on_scroll__enabled) {
        $html.addClass('animation--on-scroll--disabled');
    }

    if (!animations__on_page_load) {
        $html.addClass('animation--on-page-load--disabled');
    }

    if ($html.hasClass('animation--on-mouse-move--disabled') && animations__on_mouse_move__enabled) {
        $html.removeClass('animation--on-mouse-move--enabled');
        animations__on_mouse_move__enabled = false;
    }

    if ($html.hasClass('animation--on-scroll--disabled') && animations__on_scroll__enabled) {
        $html.removeClass('animation--on-scroll--enabled');
        animations__on_scroll__enabled = false;
    }

    if ($html.hasClass('animation--on-page-load--disabled') && animations__on_page_load) {
        $html.removeClass('animation--on-page-load--enabled');
        animations__on_page_load = false;
    }


    if ($html.hasClass('animation--disabled') && animations__enabled) {
        $html.removeClass('animation--enabled');
        animations__enabled = false;
        animations__on_mouse_move__enabled = false;
        animations__on_scroll__enabled = false;
        animations__on_page_load = false;
    }

    if (!animations__on_page_load) {
        $('.loading-screen').css('display', 'none');
    }

    // Enabling animations heppens ONLY here but you can diasbe them here or by 
    // adding classes to the html tag
    // 
    // in order to avoid strange sightings at the begining it recommended to
    // disable loading animation by adding .animation--on-page-load--enabled
    // class to the html tag



    // *** 1.2) Temporary vars
    // have to be retaken on barba page reload
    // -----------------------------------------------------
    var
        $page_contents_wrapper = $("#page-contents-wrapper"),
        $page_contents = $("#page-contents"),
        $page_cover = $(".page-cover");

    // 
    // 
    // 
    // ============    End of Global Variable    ===========




    // =====================================================
    // =               2) Basic Functions                  =
    // =====================================================
    // 
    // 
    // 

    // On desktops "is_desktop" var is true
    // and HTML gets the class of "desktop"
    // the same happenes for teablet and mobile

    var mobile_animation__restricted =  true, // modify this one only; not the below one!!
        __mar = false;

    if (is_mobile && mobile_animation__restricted) {
        __mar = true;
    }

    // *** 2.1) defining the delay fuction
    // --------------------------
    //
    // Usage:
    // var firstCallBack = function() {
    //     // do stuff
    // };
    // var delay_one = delay();
    // delay_one(firstCallBack, 200);
    // -----------------------------------------------------
    var delay = function() {
        var timer = 0;

        return function(callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    };


    // // *** 2.1.*) Wildcard class remover 
    // // ----------------------
    // // 
    // // usage:
    // // .removeClassRegex(/^starts-with-this/)
    // // -----------------------------------------------------
    // $.fn.removeClassRegex = function(regex) {
    //     return $(this).removeClass((function(index, classes) {

    //         return classes.split(/\s+/).filter((function(c) {
    //             return regex.test(c);
    //         })).join(' ');
    //     }));
    // };
    // // --------------------



    // *** 2.2) Detecting ie, Chrome, and iOS
    // -----------------------------------------------------
    var msEdge_detector = function() {
        if (!(/*@cc_on!@*/false || !!document.documentMode) && !!window.StyleMedia) {
            is_edge = true;
            $html.addClass('is-edge');
        }

        return is_edge;
    };
    // --------------------


    var ie_11_detector = function() {
        if (!!navigator.userAgent.match(/Trident.*rv\:11\./)) {
            is_ie_11 = true;
        }

        return is_ie_11;
    };
    // --------------------


    var ua = navigator.userAgent,
        isChrome = false;
    //Javascript Browser Detection - Chrome
    if (/Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
        isChrome = true;
        $html.addClass('chrome');
    } else {
        $html.addClass('not-chrome');
    }
    // --------------------


    function iOS() {

      var iDevices = [
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ];

      if (!!navigator.platform) {
        while (iDevices.length) {
          if (navigator.platform === iDevices.pop()){ return true; }
        }
      }

      return false;
    }

    if (iOS()) {
      $(".gradient").removeClass('gradient');
      // beacuse gradient styles for ios devices doesn't work
    }
    // --------------------



    // var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);

    // if (isChrome) {
    //     $html.addClass('chrome');
    // } else {
    //     $html.addClass('not-chrome');
    // }

    // ِ2.3) Detecting ie 10, 9, 8 , ...
    // -----------------------------------------------------
    var ie_10_below_detector = function() {
        var ua = window.navigator.userAgent;

        if (ua.indexOf("MSIE ") > 0) {
            is_ie_upto_10 = true;
        }

        return is_ie_upto_10;
    };
    // --------------------




    // *** 2.4) Adding ie version classes classes
    // respectedally based on previous function
    // -----------------------------------------------------
    var ie_classes = function() {
        if (is_ie_11) {
            $html.addClass("ie-11");
        } else if (is_ie_upto_10) {
            $html.addClass("ie-upto-10");
        }
    };
    //---------------------



    // *** 2.5) Detect css3 properties nad apply classes
    // 1. mix-blend-mode
    // *** 2. background-blend-mode
    // 3. isolation
    // -----------------------------------------------------
    var css3_properties_detector = function() {
        if ('CSS' in window && 'supports' in window.CSS) {

            var supportsMixBlendMode = window.CSS.supports('mix-blend-mode', 'multiply'),
                supportsBackgroundBlendMode = window.CSS.supports('background-blend-mode', 'multiply'),
                supportsIsolation = window.CSS.supports('isolation', 'isolate');

            if (supportsMixBlendMode) {
                $html.addClass("mixblendmode");
            } else {
                $html.addClass("no-mixblendmode");
            }

            if (supportsBackgroundBlendMode) {
                $html.addClass("backgroundblendmode");
            } else {
                $html.addClass("no-backgroundblendmode");
            }

            if (supportsIsolation) {
                $html.addClass("isolation");
            } else {
                $html.addClass("no-isolation");
            }
        }
    };
    //---------------------




    // *** 2.6)
    // * Randomize array element order in-place.
    // * Using Durstenfeld shuffle algorithm.
    // -----------------------------------------
    var shuffleArray = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    };
    //--------------------------------




    // *** 2.7) randomizg numbers
    // -----------------------
    var randomize = function() {
        return 0.5 - Math.random();
    };
    // -------------------




    // *** 2.8) Center transform - Setting the
    // transform-origin on the centher 
    // of screen for beeter eye-peasing visuals
    // -----------------------------------------------------
    // var center_transition_origin = function(params) {
    //     var default_opts = {
    //         item: $page_contents,
    //         level_item: false,
    //         delay: 0,
    //     };

    //     params = $.extend({}, default_opts, params);

    //     var $item = params.item, // it hase to be selected before $("@what-ever-el")
    //         $level_item = params.level_item,
    //         viewport_center = ($window.scrollTop() + $window.height() / 2);
    //     if (params.level_item) {
    //         viewport_center = ($level_item.offset().top - $item.offset().top + $window.height() / 2);
    //     }

    //     $item.css({
    //         "-webkit-transform-origin": "50%" + ' ' + viewport_center + "px",
    //         "-ms-transform-origin": "50%" + ' ' + viewport_center + "px",
    //         "transform-origin": "50%" + ' ' + viewport_center + "px",
    //     });
    // };
    // ---------------------




    // *** 2.9) Element vs Viewport
    // -----------------------------------------------------
    $.fn.isInViewport = function() {
        var $this = $(this),
            $w = $(window),
            elementTop = $this.offset().top,
            elementBottom = elementTop + $this.outerHeight(),

            viewportTop = $w.scrollTop(),
            viewportBottom = viewportTop + $w.height();

        return elementBottom > viewportTop && elementTop < viewportBottom;
    };

    $.fn.isAfterViewport = function() {
        var $this = $(this),
            $w = $(window),
            elementTop = $this.offset().top,
            viewportBottom = $w.scrollTop() + $w.height();

        return elementTop < viewportBottom;
    };
    // -------------------




    // *** 2.10) Image cover finction
    // Acts like background-size: cover; for images
    // ------------------------------------------------------
    var img_cover = function(params) {
        var default_opts = {
            item: ".fit-rows img"
        };

        params = $.extend({}, default_opts, params);

        var $item = $(params.item);

        function inner_func() {
            $item.each((function() {
                var $this = $(this),
                    ratio = $this.width() / $this.height(),
                    parent_ratio = $this.parent().width() / $this.parent().height();

                if (ratio <= parent_ratio) {
                    $this.css({
                        height: 'auto',
                        width: '100%'
                    });
                } else {
                    $this.css({
                        height: '100%',
                        width: 'auto'
                    });
                }
            }));
        }

        $item.css({
            'position': 'relative',
            'left': '50%',
            'top': '50%',
            'transform': 'translateX(-50%) translateY(-50%)'
        });

        inner_func();

        var firstCallBack = function() {
                inner_func();
            },
            delay_one = delay();

        $window.resize((function(event) {
            // var t;
            // clearTimeout(t);
            // t = setTimeout((function() {
            //     inner_func();
            // }), 200);
            delay_one(firstCallBack, 200);
        }));
    };
    // ---------------------




    // *** 2.11) Toggle class function: 
    // Toggles calss of the parent on a child button click
    // -----------------------------------------------------
    var toggleClass_onClick = function(params) {
        var default_opts = {
            condition: true,
            toggle_button: ".bibi",
            class: "class"
        };

        params = $.extend({}, default_opts, params);

        if (params.condition) {
            $(params.toggle_button).on('mousedown', (function() {
                $(this).parent().toggleClass(params.class);
            }));
        }
    };
    //---------------------




    // *** 2.12) Animated list item removing
    // -----------------------------------------------------
    var remove_list_item = function(params) {
        var default_opts = {
            element: ".cart-item",
            trigger: ".cart-item__remove"
        };

        params = $.extend({}, default_opts, params);

        var firstCallBack = function() {
                cart_counter();
            },
            delay_one = delay();

        $(params.trigger).on('mousedown', (function(event) {
            event.preventDefault();

            var $t = $(this),
                $this = $t.parent(),
                thisOW = $this.outerWidth() + 15;

            // slide clicked list item right and
            // then slide up the its following siblings
            TweenMax.to($this, 0.3, {
                backgroundColor: "red",
                x: thisOW,
                onCompleteParams: [$this],
                onComplete: slideRightAndUp
            });

            // fade out x button
            TweenMax.to($t, 0.3, {
                autoAlpha: 0
            });

            delay_one(firstCallBack, 700);

        }));

        function slideRightAndUp(t) {

            // jQuery nextAll() gets all the following siblings 
            // of each element in the set of matched elements
            var $nextAll = t.nextAll(),
                listH = t.outerHeight(),
                listMargin = parseInt($(t).css("margin-bottom"), 10);

            TweenMax.to($nextAll, 0.3, {
                y: -(listH + listMargin),
                onCompleteParams: [t, $nextAll],
                onComplete: fadeOut
            });
        }

        function fadeOut(t, nA) {
            // fade out clicked list item
            TweenMax.to(t, 0, {
                autoAlpha: 0,
                transformOrigin: "0 50%",
                onCompleteParams: [t, nA],
                onComplete: function(t2, nA2) {
                    // remove clicked list item
                    t2.remove();
                    // clear transforms on clicked list item
                    TweenMax.set(nA2, {
                        clearProps: "all"
                    });
                }
            });
        }
    };
    // --------------------




    // *** 2.13) Cart items counter
    // The number of its items on the badge 
    // -----------------------------------------------------
    var cart_counter = function(params) {
        var default_opts = {
            cart_container: ".cart-item",
            cart_counter: ".cart-counter"
        };

        params = $.extend({}, default_opts, params);

        var cart_items_no = $(params.cart_container).length;

        $(params.cart_counter).html(cart_items_no);
    };
    // -------------------




    // *** 2.14) Tabs
    // -----------------------------------------------------
    var navtabs_activetor = function() {
        $('.nav-tabs a').on('mousedown', (function(e) {
            e.preventDefault();
            $(this).tab('show');
        }));
    };
    // -------------------




    // *** 2.15) Tabs - width;
    // setting the width of the nav taps
    // on horizontal style
    // -----------------------------------------------------
    var tabs_horizontal = function() {
        var $tab_horizontal_tabs = $(".nav-tabs-full-width").children("li"),
            tab_horizontal_tabs_num = $tab_horizontal_tabs.length;

        $tab_horizontal_tabs.width(100 / tab_horizontal_tabs_num + "%");
    };
    // -------------------




    // *** 2.16) pricing-table plans; Two-optioned
    // Special func for paricing plans blocks
    // when there are 2 payment options
    // -----------------------------------------------------
    var two_optioned_pricing_table_plans = function() {
        var tow_optioned_plans = $(".two-optioned-plans"),
            toggle_buttons = tow_optioned_plans.find(".nav-tabs li");

        toggle_buttons.on('mousedown', (function(event) {
            event.preventDefault();
            /* Act on the event */
            if ($(this).hasClass('second-option-plan') & $(this).hasClass('active')) {
                tow_optioned_plans.addClass("second-option");
            } else {
                tow_optioned_plans.removeClass("second-option");
            }
        }));
    };
    //----------------------------------




    // *** 2.17) Sliding content on click
    // -----------------------------------------------------
    var sliding_section = function(params) {
        var default_opts = {
            element: ".cart--mini",
            trigger: ".cart--mini-toggle",
            close: "",
        };

        params = $.extend({}, default_opts, params);

        var $trigger = $(params.trigger);

        if ($trigger.length) {
            var $el = $(params.element),
                $close_btn = $(params.close),
                tl_el_open = new TimelineMax({ onComplete: el_opened, paused: true }),
                tl_el_close = new TimelineMax({ onComplete: el_closed, paused: true }),

                el_is_open = false,
                time_el_open = 0.8,
                time_el_close = 0.4,
                page_cover_opacity = 0.8,
                el_is_animating = false;

            tl_el_open
                .fromTo($el, time_el_open, { x: "104%", }, { x: "0%", ease: Power4.easeOut })
                .to($body, 0, { height: "100%", overflow: "hidden" }, 0)
                .to($page_cover, (time_el_open / 3), { autoAlpha: page_cover_opacity, ease: Power2.easeOut }, 0);

            tl_el_close
                .fromTo($el, time_el_close, { x: "0%", }, { x: "104%", ease: Power2.easeOut })
                .to($body, 0, { height: "", overflow: "" }, 0)
                .to($page_cover, (time_el_open / 3), { autoAlpha: 0, ease: Power2.easeOut }, 0);

            TweenMax.set($el, { x: "104%" });

            var firstCallBack = function() {
                    $(".hero__parallax").css({
                        position: '',
                        top: ''
                    });
                },
                delay_one = delay();

            function el_opened() {
                el_is_animating = false;
                el_is_open = true;
            }

            function el_closed() {
                el_is_animating = false;
                el_is_open = false;

                delay_one(firstCallBack, 300);
            }

            var close_el = function() {
                if (el_is_open) {
                    $close_btn.removeClass("clicked");
                    $html.removeClass("the-menu-opened");
                    tl_el_close.restart();
                    el_is_animating = true;
                }
            };

            var toggle_slide = function() {
                if (!el_is_animating) {
                    if (el_is_open) {
                        tl_el_close.restart();
                    } else {
                        tl_el_open.restart();
                        $(".hero__parallax").css({
                            'position': 'absolute',
                            'top': $(window).scrollTop()
                        });
                    }

                    $close_btn.toggleClass("clicked");

                    $html.toggleClass("the-menu-opened");

                    el_is_animating = true;
                }
            };

            $trigger.on("mousedown", toggle_slide);

            $page_cover.on("mousedown", close_el);

            $close_btn.on("mousedown", close_el);

            // $trigger.on("mouseover", (function(event) {
            //     center_transition_origin({
            //         item: $page_contents,
            //     });
            // }));
        }
    };
    // --------------------




    // *** 2.18) Fade in content on click
    // -----------------------------------------------------
    var content_fadeIn_over = function(params) {
        var default_opts = {
            trigger: "#search-toggle",
            content: ".search-screen--overlay",
            trigger_class_open: "clicked",
            content_class_open: "revealed",
            html_class_when_covered: "covered"
        };

        params = $.extend({}, default_opts, params);

        var $search_toggle = $(params.trigger);

        if ($search_toggle.length) {
            // Variables
            var $search_overlay = $(params.content),
                search_overlay_is_animating = false;

            $search_toggle.on('mousedown', (function(event) {
                event.preventDefault();
                if (!search_overlay_is_animating) {
                    search_overlay_is_animating = true;
                    $search_toggle.toggleClass(params.trigger_class_open);
                    $search_overlay.toggleClass(params.content_class_open);
                    $html.toggleClass(params.html_class_when_covered);
                    $search_overlay.one(transitionEnd, (function() {
                        search_overlay_is_animating = false;
                    }));

                    // ie9 fallback
                    if (!Modernizr.csstransitions) {
                        search_overlay_is_animating = false;
                    }
                }
            }));
        }
    };
    // --------------------




    // *** 2.19) Fake search function
    // demonstrate instant search 
    // ------------------------------------------------------
    var fake_search_function = function() {
        var search_overlay_submit = $("#search-screen--overlay__submit");

        if (search_overlay_submit.length) {
            // Variables
            var search_form = $("#search-form"),
                search_overlay_input = $("#search-screen--overlay__input"),
                search_suggestions = $(".search__suggestions"),
                search_results = $(".seach__results"),
                result_phrase = search_results.find(".result-phrase"),
                // set init variable for inital search
                search_animation_time = 1000,
                search_typing_delay_time = 1000,
                init = true,
                search_typing,
                search_submited;

            // Defining fake search function
            var fake_search = function() {

                // start loading animation
                search_overlay_submit.addClass("seach__loading");

                // if it's the first time search initializes
                if (init) {

                    // hide search suggustions
                    search_suggestions.fadeOut("slow");

                    // from now on it's not the fist time
                    init = false;
                } else {

                    // OK, well if it's not the first time now hide the prior search results
                    search_results.fadeOut("slow");
                }

                // second delayed function in order to see loading animations
                setTimeout((function() {

                    // set the search phrse in all <span class"result-phrase></span> to demonstrate a fake search
                    result_phrase.each((function() {

                        // blaah blah blaaaaaaaah ...
                        if (search_overlay_input.val().length !== 0) {
                            $(this).html(search_overlay_input.val());
                        }
                    }));

                    // now show the new search results
                    search_results.fadeIn("slow");

                    // and stop loading animation
                    search_overlay_submit.removeClass("seach__loading");
                    // typing or submitting has finished I suppose !!!

                    search_typing = false;
                    search_submited = false;
                }), search_animation_time);
            };

            //user is "finished typing," do something
            var doneTyping = function() {
                fake_search();
            };

            // init fake search on submitting
            search_form.on("submit", (function(event) {
                event.preventDefault();

                // ok I've submitted the search
                search_submited = true;
                fake_search();
            }));

            // init fake search on typing
            //setup before functions
            var typingTimer; //timer identifier
            var doneTypingInterval = 1000; //time in ms, 5 second for example

            //on keyup, start the countdown
            search_form.on('keyup', (function() {

                // ok I'm typing now
                search_typing = true;
                if (!search_submited) {
                    clearTimeout(typingTimer);
                    typingTimer = setTimeout(doneTyping, doneTypingInterval);
                }
            }));

            //on keydown, clear the countdown 
            search_form.on('keydown', (function() {
                clearTimeout(typingTimer);
            }));
        }
    };
    // --------------------




    // *** 2.20) Ultimate text rotator function
    // ------------------------------------
    var lettering_rotator = function(params) {
        var default_opts = {
            parent: ".wrap",
            el: ".quote",
            y_in: 0,
            x_in: 0,
            rotateX_in: 0,
            rotateY_in: 0,
            scale_in: 1,
            opacity_in: 0,
            blur_in: '0 0 30px', // The blur product__amount to animate from

            y_out: 0,
            x_out: 0,
            rotateX_out: 0,
            rotateY_out: 0,
            scale_out: 1,
            opacity_out: 0,

            dur_in: 1,
            dur_out: 3,
            ease_in: Power4.easeOut,
            ease_out: Power4.easeOut,
            stagger: 0.1,
            pause: 5, // quote static time
            overlap: 1,

            perspective: 70,
            transform_origin: "50% 50% -8",

            lettering_type: "words", // letters -or- words -or- lines 
            random: true, // if you want random stagger
            percent: 100, // the percent of the letters that you want to be animated
            bounce: true, // sholud out animation start from the end?
        };

        params = $.extend({}, default_opts, params);

        var $parent = $(params.parent);

        if ($parent.length) {
            var quotes = $parent.find(params.el),

                blur_in = params.blur_in,

                dur_in = params.dur_in,
                dur_out = params.dur_out,
                stagger = params.stagger,
                overlap = params.overlap, // next animation start overlap

                perspective = params.perspective,
                transform_origin = params.perspective,

                lettering_type = params.lettering_type,
                stagger_out = stagger,
                ol = overlap + Math.abs(dur_out - dur_in), // Don't touch this !!
                master = new TimelineMax({}), // Don't touch this !!
                timelines = []; // Don't touch this !!

            if (params.bounce) {
                stagger_out = -stagger;
            }

            TweenMax.set(quotes, { autoAlpha: 1 });

            for (var k = 0; k < quotes.length; k++) {
                var tl = new TimelineMax(),
                    color = quotes.eq(k).css("color"),
                    myLettering = new Lettering(quotes[k], { type: "letters, words, lines" }),
                    list_early = myLettering.letters;

                if (lettering_type === "words") {
                    list_early = myLettering.words;
                } else if (lettering_type === "lines") {
                    list_early = myLettering.lines;
                }

                var slice = Math.round(((100 - params.percent) / 100) * list_early.length);

                if (params.random) {
                    list_early.sort(randomize);
                }

                var list = list_early.slice(slice);

                TweenMax.set(list, { "backface-visibility": 'hidden' });

                if (blur_in !== "0 0 0px") {
                    TweenMax.set(list, { color: 'transparent' });
                }

                tl.staggerFromTo(list, dur_in, {
                        y: params.y_in,
                        x: params.x_in,
                        rotationX: params.rotateX_in,
                        rotationY: params.rotateY_in,
                        scale: params.scale_in,
                        opacity: params.opacity_in,
                        transformPerspective: perspective,
                        transformOrigin: transform_origin,
                        textShadow: color + blur_in
                    }, {
                        y: 0,
                        x: 0,
                        rotationX: 0,
                        rotationY: 0,
                        scale: 1,
                        opacity: 1,
                        transformPerspective: perspective,
                        transformOrigin: transform_origin,
                        textShadow: color + '0 0 0px',
                        ease: params.ease_in,
                    },
                    stagger);

                tl.add("textIsIn"); //mark the place where text has fully animated in

                tl.staggerTo(list, dur_out, {
                        y: params.y_out,
                        x: params.x_out,
                        rotationX: params.rotateX_out,
                        rotationY: params.rotateY_out,
                        scale: params.scale_out,
                        opacity: params.opacity_out,
                        transformPerspective: perspective,
                        transformOrigin: transform_origin,
                        textShadow: color + blur_in,
                        ease: params.ease_out,
                    },
                    stagger_out, "+=" + params.pause);

                master.add(tl, "-=" + ol);

                if (k == quotes.length - 1) {
                    var children = master.getChildren(false, false),
                        repeatDelay,
                        timelineLoopTime = (master.duration() - ol) - children[0].duration();

                    for (var i = 0; i < children.length; i++) {
                        if (i === 0) {
                            repeatDelay = timelineLoopTime;
                        } else {
                            repeatDelay = (timelineLoopTime + children[i].startTime() + children[0].duration()) - children[i].endTime();
                        }
                        children[i].repeatDelay(repeatDelay);
                        children[i].repeat(-1);
                    }
                }
            }
        }
    };
    // -------------------




    // *** 2.21)
    // Animated Words Function
    // ---------------------------
    var animated_words = function() {
        var $cd_headline = $('.cd-headline');
        if ($cd_headline.length && !is_edge ) {
            //set animation timing
            var animationDelay = 2500,
                //loading bar effect
                barAnimationDelay = 3800,
                barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
                //letters effect
                lettersDelay = 70,
                //type effect
                typeLettersDelay = 150,
                selectionDuration = 500,
                typeAnimationDelay = selectionDuration + 800,
                //clip effect 
                revealDuration = 600,
                revealAnimationDelay = 1500;

            initHeadline();

            function initHeadline() {
                //insert <i> element for each letter of a changing word
                singleLetters($('.cd-headline.letters').find('b'));
                //initialise headline animation
                animateHeadline($cd_headline);
            }

            function singleLetters($words) {
                $words.each((function() {
                    var word = $(this),
                        letters = word.text().split(''),
                        selected = word.hasClass('is-visible');

                    for (var i in letters) {
                        if (word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
                        letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>' : '<i>' + letters[i] + '</i>';
                    }

                    var newLetters = letters.join('');
                    word.html(newLetters).css('opacity', 1);
                }));
            }

            function animateHeadline($headlines) {
                var duration = animationDelay;

                $headlines.each((function() {
                    var headline = $(this);

                    if (headline.hasClass('loading-bar')) {
                        duration = barAnimationDelay;
                        setTimeout((function() {
                            headline.find('.cd-words-wrapper').addClass('is-loading');
                        }), barWaiting);
                    } else if (headline.hasClass('clip')) {
                        var spanWrapper = headline.find('.cd-words-wrapper'),
                            newWidth = spanWrapper.width() + 10;
                        spanWrapper.css('width', newWidth);
                    } else if (!headline.hasClass('type')) {
                        //assign to .cd-words-wrapper the width of its longest word
                        var words = headline.find('.cd-words-wrapper b'),
                            width = 0;
                        words.each((function() {
                            var wordWidth = $(this).width();
                            if (wordWidth > width) width = wordWidth;
                        }));
                        headline.find('.cd-words-wrapper').css('width', width + 60);
                    }

                    //trigger animation
                    setTimeout((function() {
                        hideWord(headline.find('.is-visible').eq(0));
                    }), duration);
                }));
            }

            function hideWord($word) {
                var nextWord = takeNext($word);

                if ($word.parents('.cd-headline').hasClass('type')) {
                    var parentSpan = $word.parent('.cd-words-wrapper');
                    parentSpan.addClass('selected').removeClass('waiting');
                    setTimeout((function() {
                        parentSpan.removeClass('selected');
                        $word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
                    }), selectionDuration);
                    setTimeout((function() {
                        showWord(nextWord, typeLettersDelay);
                    }), typeAnimationDelay);
                } else if ($word.parents('.cd-headline').hasClass('letters')) {
                    var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
                    hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
                    showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);
                } else if ($word.parents('.cd-headline').hasClass('clip')) {
                    $word.parents('.cd-words-wrapper').animate({
                        width: '2px'
                    }, revealDuration, (function() {
                        switchWord($word, nextWord);
                        showWord(nextWord);
                    }));
                } else if ($word.parents('.cd-headline').hasClass('loading-bar')) {
                    $word.parents('.cd-words-wrapper').removeClass('is-loading');
                    switchWord($word, nextWord);
                    setTimeout((function() {
                        hideWord(nextWord);
                    }), barAnimationDelay);
                    setTimeout((function() {
                        $word.parents('.cd-words-wrapper').addClass('is-loading');
                    }), barWaiting);
                } else {
                    switchWord($word, nextWord);
                    setTimeout((function() {
                        hideWord(nextWord);
                    }), animationDelay);
                }
            }

            function showWord($word, $duration) {
                if ($word.parents('.cd-headline').hasClass('type')) {
                    showLetter($word.find('i').eq(0), $word, false, $duration);
                    $word.addClass('is-visible').removeClass('is-hidden');
                } else if ($word.parents('.cd-headline').hasClass('clip')) {
                    $word.parents('.cd-words-wrapper').animate({
                        'width': $word.width() + 10
                    }, revealDuration, (function() {
                        setTimeout((function() {
                            hideWord($word);
                        }), revealAnimationDelay);
                    }));
                }
            }

            function hideLetter($letter, $word, $bool, $duration) {
                $letter.removeClass('in').addClass('out');
                if (!$letter.is(':last-child')) {
                    setTimeout((function() {
                        hideLetter($letter.next(), $word, $bool, $duration);
                    }), $duration);
                } else if ($bool) {
                    setTimeout((function() {
                        hideWord(takeNext($word));
                    }), animationDelay);
                }
                if ($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
                    var nextWord = takeNext($word);
                    switchWord($word, nextWord);
                }
            }

            function showLetter($letter, $word, $bool, $duration) {
                $letter.addClass('in').removeClass('out');

                if (!$letter.is(':last-child')) {
                    setTimeout((function() {
                        showLetter($letter.next(), $word, $bool, $duration);
                    }), $duration);
                } else {
                    if ($word.parents('.cd-headline').hasClass('type')) {
                        setTimeout((function() {
                            $word.parents('.cd-words-wrapper').addClass('waiting');
                        }), 200);
                    }
                    if (!$bool) {
                        setTimeout((function() {
                            hideWord($word);
                        }), animationDelay);
                    }
                }
            }

            function takeNext($word) {
                return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
            }

            function takePrev($word) {
                return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
            }

            function switchWord($oldWord, $newWord) {
                $oldWord.removeClass('is-visible').addClass('is-hidden');
                $newWord.removeClass('is-hidden').addClass('is-visible');
            }

            // $(window).resize((function() {
            $window.resize((function() {
                var headline = $cd_headline;
                if (!headline.hasClass('type')) {
                    //assign to .cd-words-wrapper the width of its longest word
                    var words = headline.find('.cd-words-wrapper b'),
                        width = 0;
                    words.each((function() {
                        var wordWidth = $(this).width();
                        if (wordWidth > width) width = wordWidth;
                    }));
                    headline.find('.cd-words-wrapper').css('width', width);
                }
            }));
        }
    };
    //---------------------------------




    // *** 2.22)
    // Shine.js --------------------------->> depends on external plugin
    // ------------------------------------
    if ($("#js-hero__text--shine").length) {
        var shinejs = function() {
            // use new shinejs.Shine(...) if Shine is already defined somewhere else
            // var shine = new shinejs.Shine(document.getElementById('headline'));
            var shine = new Shine(document.getElementById('js-hero__text--shine'));

            function handleMouseMove(event) {
                shine.config.opacity = 0.7;
                // shine.config.blur = 30;
                shine.light.position.x = 1 * event.clientX;
                shine.light.position.y = 1 * event.clientY;
                shine.draw();
            }

            window.addEventListener('mousemove', handleMouseMove, true);


            // use new shinejs.Shine(...) if Shine is already defined somewhere else
            // var shine = new shinejs.Shine(document.getElementById("headline"));
            // function update() {
            //   window.requestAnimationFrame(update);
            //   var time = new Date().getTime();
            //   var speed = 0.00025;  // 1 = 1000 rotations/s
            //   var phase = time * speed * 2.0 * Math.PI;
            //   var radiusX = window.innerWidth * 0.5;
            //   var radiusY = window.innerHeight * 0.5;
            //   shine.light.position.x = radiusX + radiusX * Math.cos(phase);
            //   shine.light.position.y = radiusY + radiusY * Math.sin(phase * 0.7);
            //   shine.draw();
            // }

            // update();



            // use new shinejs.Shine(...) if Shine is already defined somewhere else
            // var shine = new shinejs.Shine(document.getElementById('headline'));
            // var shine2 = new Shine(document.getElementById('js-shine'));

            // function handleMouseMove2(event) {
            //     shine2.config.opacity = 0.4;
            //     // shine2.config.blur = 10;
            //     shine2.light.position.x = 1 * event.clientX;
            //     shine2.light.position.y = 1 * event.clientY;
            //     shine2.draw();
            // }

            // window.addEventListener('mousemove', handleMouseMove2, false);
        };
    }
    //--------------------------------




    // *** 2.23)
    // granim effect ---------------------->> depends on external plugin
    // ------------------------------------
    if ($("#granim-canvas").length) {
        var granim_canvas = function() {
            var granimInstance = new Granim({
                element: '#granim-canvas',
                name: 'basic-gradient',
                direction: 'left-right',
                opacity: [1, 1],
                isPausedWhenNotInView: true,
                states: {
                    "default-state": {
                        gradients: [
                            ['#f6d365', '#fda085'],
                            ['#e0c3fc', '#8ec5fc'],
                            ['#84fab0', '#8fd3f4']



                            // ['#69b7eb', '#f4d6db'],
                            // ['#f598a8', '#f6edb2'],
                            // ['#aea4e3', '#d3ffe8']



                            // ['#a6c0fe', '#f68084'],
                            // ['#e0c3fc', '#8ec5fc'],
                            // ['#d57eeb', '#fccb90']
                        ]
                    }
                }
            });
        };
    }


    if ($("#granim-canvas-02").length) {
        var granim_canvas_02 = function() {
            var granimInstance = new Granim({
                element: '#granim-canvas-02',
                name: 'basic-gradient',
                direction: 'left-right',
                opacity: [1, 1],
                isPausedWhenNotInView: true,
                states: {
                    "default-state": {
                        gradients: [
                            // ['#f6d365', '#fda085'],
                            // ['#e0c3fc', '#8ec5fc'],
                            // ['#84fab0', '#8fd3f4']



                            // ['#69b7eb', '#f4d6db'],
                            // ['#f598a8', '#f6edb2'],
                            // ['#aea4e3', '#d3ffe8']

                            // background-image: linear-gradient(-225deg, #A445B2 0%, #D41872 52%, #FF0066 100%);

                            ['#7028e4', '#e5b2ca'],
                            ['#ff0844', '#ffb199'],
                            ['#FF0066', '#A445B2']
                        ]
                    }
                }
            });
        };
    }
    //---------------------------------




    // *** 2.24)
    // Blub Cloudy effect ----------------->> depends on THREE.js
    // ------------------------------------
    if ($(".blub-cloudy").length) {
        var blub_cloudy = function() {
            var ww = window.innerWidth,
                wh = window.innerHeight,
                // ww = window.innerWidth * 1.1,
                // wh = window.innerHeight * 1.2,
                imgData;

            var renderer = new THREE.WebGLRenderer({
                canvas: document.querySelector(".blub-cloudy")
            });
            renderer.setClearColor(0x001ab0);
            renderer.setSize(ww, wh);

            var blub_scene = new THREE.Scene();

            var camera = new THREE.PerspectiveCamera(50, ww / wh, 1, 100000);
            camera.position.set(0, 0, 500);

            var controls = new THREE.OrbitControls(camera, renderer.domElement);

            var geom = new THREE.SphereBufferGeometry(100, 100, 100);
            var mat = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            var length = geom.attributes.position.count;
            var perlins = new Float32Array(length);
            geom.addAttribute('perlin', new THREE.BufferAttribute(perlins, 0.8));
            var wrapMatShader = new THREE.ShaderMaterial({
                uniforms: {
                    uTime: { type: "z", value: 1 },
                },
                vertexShader: document.getElementById("wrapVertexShader").textContent,
                fragmentShader: document.getElementById("wrapFragmentShader").textContent
            });
            var sphere = new THREE.Mesh(geom, wrapMatShader);
            blub_scene.add(sphere);

            //RENDER
            // ------
            function render(a) {
                requestAnimationFrame(render);

                var perlins = new Float32Array(length);
                for (var i = 0; i < length; i++) {
                    var x = geom.attributes.position.array[i * 3];
                    var y = geom.attributes.position.array[i * 3 + 1];
                    var z = geom.attributes.position.array[i * 3 + 2];
                    var random = noise.simplex3((x + a * 0.05) * 0.02, (y + a * 0.02) * 0.02, (z + a * 0.02) * 0.02);
                    perlins[i] = random;
                }
                geom.addAttribute('perlin', new THREE.BufferAttribute(perlins, 1));

                wrapMatShader.uniforms.uTime.value = a;

                renderer.render(blub_scene, camera);
            }

            requestAnimationFrame(render);
        };
    }
    //---------------------------------




    // *** 2.25)
    // planetygon Effect Function --------->> depends on THREE.js
    // ------------------------------------
    if ($("#planetygon").length) {
        var planetygon = function() {
            var ww, wh, renderer, scene, camera, planet, strokes;

            var onWindowResize = function() {
                ww = window.innerWidth * 1;
                wh = window.innerHeight * 1;

                camera.aspect = ww / wh;
                camera.updateProjectionMatrix();

                renderer.setSize(ww, wh);
            };

            var createPlanet = function() {
                planet = new THREE.Object3D();
                scene.add(planet);

                var geometry = new THREE.Geometry();
                for (var x = 0; x < 3500; x++) {
                    var lat = 2 * Math.PI * Math.random();
                    var long = Math.acos(2 * Math.random() - 1);
                    var u = Math.cos(long);
                    var pos = {
                        x: (Math.random() * 40 + 220) * Math.sqrt(1 - (u * u)) * Math.cos(lat),
                        y: (Math.random() * 40 + 220) * Math.sqrt(1 - (u * u)) * Math.sin(lat),
                        z: (Math.random() * 40 + 220) * u
                    };
                    var dest = {
                        x: 80 * Math.sqrt(1 - (u * u)) * Math.cos(lat),
                        y: 80 * Math.sqrt(1 - (u * u)) * Math.sin(lat),
                        z: 80 * u
                    };
                    var vector = new THREE.Vector3(pos.x, pos.y, pos.z);
                    TweenMax.to(vector, Math.random() * 5 + 0.5, {
                        x: pos.x * 0.5,
                        y: pos.y * 0.5,
                        z: pos.z * 0.5,
                        repeat: -1,
                        delay: -9,
                        yoyo: true,
                        ease: Power1.easeIn
                    });
                    vector.product__amount = 0;
                    geometry.vertices.push(vector);
                }

                var segments = new THREE.Geometry();
                var color, perlin;
                for (var i = geometry.vertices.length - 1; i >= 0; i--) {
                    var vector = geometry.vertices[i];
                    for (var j = geometry.vertices.length - 1; j >= 0; j--) {
                        if (vector.distanceTo(geometry.vertices[j]) < 20 && vector.product__amount < 6) {
                            segments.vertices.push(vector);
                            segments.vertices.push(geometry.vertices[j]);
                            geometry.vertices[i].product__amount++;
                            geometry.vertices[j].product__amount++;
                            perlin = Math.abs(noise.simplex3(vector.x * 0.005, vector.y * 0.005, vector.z * 0.005));
                            color = new THREE.Color("hsl(" + (perlin * 0 + 159) + ", 79%, 85%)")
                            segments.colors.push(color);
                            segments.colors.push(color);
                        }
                    }
                }

                var material = new THREE.LineBasicMaterial({
                    vertexColors: THREE.VertexColors
                });
                strokes = new THREE.LineSegments(segments, material);
                planet.add(strokes);
            };

            var render = function(a) {
                requestAnimationFrame(render);

                strokes.geometry.verticesNeedUpdate = true;
                planet.rotation.x += 0.001;
                planet.rotation.y += 0.002;

                renderer.render(scene, camera);
            };

            var init = function() {

                // ww = window.innerWidth * 1.1;
                // wh = window.innerHeight * 1.2;


                ww = window.innerWidth * 1;
                wh = window.innerHeight * 1;

                renderer = new THREE.WebGLRenderer({
                    canvas: document.getElementById("planetygon"),
                    antialias: true
                });
                renderer.setSize(ww, wh);
                renderer.setClearColor(0x333333);
                renderer.setPixelRatio(window.devicePixelRatio ? window.devicePixelRatio : 1);

                scene = new THREE.Scene();
                scene.fog = new THREE.Fog(0x333333, 400, 450);

                camera = new THREE.PerspectiveCamera(50, ww / wh, 20, 10000);
                camera.position.set(0, 0, 600);
                scene.add(camera);

                createPlanet();

                requestAnimationFrame(render);
                window.addEventListener("resize", onWindowResize);
            };

            init();
        };
    }
    //--------------------------------



    // *** 2.26)
    // Looping Background Images
    // ------------------------------------
    $('.infinite-loop').each(function() {
        var $this = $(this);
        $this.imagesLoaded(function() {

            var loopH = $this.height();

            $this.append($this.find('.to-b-clnd').clone());

            // alert(clndH);
            var tl = new TimelineMax({repeat: -1});
            tl.to( $this, 10, { y:-loopH, ease: Power0.easeNone });
        });
    });
        
    $('.infinite-loop--reverse').each(function() {
        var $this = $(this);
        $this.imagesLoaded(function() {

            var loopH = $this.height();

            $this.prepend($this.find('.to-b-clnd').clone());

         
            
            // TweenMax.set('.inf-loop-rev-wrapper', { rotation: -180, });

            // alert(clndH);
            var tl = new TimelineMax({repeat: -1});
            tl.to( $this, 10, { y: loopH, ease: Power0.easeNone });
        });
    });


    if (is_desktop) {
        // *** 2.27) Glitch effect function ------->> depends on THREE.js
        // ------------------------------------
        var glitch = function(params) {
            var $glitch = $(".glitch-image");
            if ($glitch.length) {
                $glitch.each((function(index, val) {
                    var $this = $(this),
                        canvas = $this.children('canvas').get(0),
                        ctx = canvas.getContext('2d'),
                        img = new Image(),
                        currentFrame = 0,
                        totalFrame = 10,
                        offset = 0.01,
                        width,
                        height,
                        imgData,
                        data,
                        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

                    window.requestAnimationFrame = requestAnimationFrame;

                    // Image loading
                    img.crossOrigin = "Anonymous";
                    img.src = $this.data('img-url');
                    img.onload = function() {
                        init();
                        glitchAnimation();
                    };


                    /**
                     * init - Initialize the canvas
                     */
                    var init = function() {
                        canvas.width = width = img.width * 0.5;
                        offset = width * offset;
                        canvas.height = height = ~~(img.height * (width - offset * 2) / img.width);
                        // document.querySelector('.glitch-image').style.width = width + 'px';
                        // document.querySelector('.glitch-image').style.height = height + 'px';
                    }.bind(this);


                    /**
                     * glitchAnimation - Noise effects animation
                     */
                    var glitchAnimation = function() {

                        // The first run and the last run will reset the image
                        if (!(currentFrame % totalFrame) || currentFrame > totalFrame) {

                            clearCanvas();

                            // Draws the original image
                            ctx.drawImage(img, // Parameters to me often confused Ah = 0 =
                                0, // The starting x-coordinate of the cropped image
                                0, // The starting y coordinate of the cropped image
                                img.width, // The width of the cropped image
                                img.height, // The height of the cropped image
                                offset, // The starting x coordinate drawn on the Canvas
                                0, // The starting y coordinate drawn on the Canvas
                                width - offset * 2, // The width of the picture drawn on Canvas
                                height); // The height of the picture drawn on Canvas

                            // Obtaining the image data
                            imgData = ctx.getImageData(0, 0, width, height);

                            // Cool the image
                            imgData = pixelProcessor(imgData, 10000, pixelCooler);

                            // Return the processed image data to the canvas
                            ctx.putImageData(imgData, 0, 0);

                            currentFrame = 0;
                        }

                        // Perform noise calculus on a random number of frames
                        if (currentFrame === randInt(0, totalFrame)) {

                            // The image of the red pixels do shift
                            imgData = pixelProcessor(imgData, 1, pixelFlick);

                            // Return the processed image data to the canvas
                            ctx.putImageData(imgData, 0, 0);

                            // Block noise
                            drawGlitch(width, height, randInt(3, 10), glitchBlock);

                            // Strip noise
                            drawGlitch(width, height, randInt(3, 30), glitchLine);
                        }

                        currentFrame++;

                        window.requestAnimationFrame(glitchAnimation);

                    };


                    /**
                     * glitchBlock - Block noise operation
                     * @param  {number} i   -   The i-th operation
                     * @param  {number} x   -   The x-coordinate of the random number on the image
                     * @param  {number} y   -   The y-coordinate of the random number on the image
                     */
                    var glitchBlock = function(i, x, y) {
                        if (i > 3) {
                            var spliceHeight = 1 + randInt(0, 10);

                            ctx.drawImage(canvas,
                                x,
                                y,
                                x,
                                spliceHeight,
                                randInt(0, x),
                                y,
                                randInt(x, width),
                                spliceHeight);
                        }
                    };


                    /**
                     * glitchLine - Strip noise operation
                     * @param  {number} i   -   The i-th operation
                     * @param  {number} x   -   The x-coordinate of the random number on the image
                     * @param  {number} y   -   The y-coordinate of the random number on the image
                     */
                    var glitchLine = function(i, x, y) {
                        var spliceHeight = 1 + randInt(1, 50);

                        ctx.drawImage(canvas,
                            offset,
                            y,
                            width - offset * 2,
                            spliceHeight,
                            1 + randInt(0, offset * 2), //-offset / 3 + randInt(0, offset / 1.5),
                            y + randInt(0, 10),
                            width - offset,
                            spliceHeight);
                    };


                    /**
                     * pixelProcessor - Customize the pixel data
                     * @param  {Object}     imageData   -   Pixel model
                     * @param  {number}     stepp        -   The operation is performed once per several pixels
                     * @param  {Function}   callback    -   Custom operation function
                     * @return {Object}                 -   The pixel model after the return operation
                     */
                    var pixelProcessor = function(imageData, stepp, callback) {
                        var data = imageData.data || [],
                            stepp = stepp * 4 || 4;

                        if (data.length) {
                            var rgb = [];

                            for (var i = 0; i < data.length; i += stepp) {
                                callback && callback(i, data);
                            }

                            return imageData;
                        } else {
                            return imageData;
                        }
                    };


                    /**
                     * drawGlitch - Draw noise effects
                     * @param  {number}   width        Image width
                     * @param  {number}   height       Image height
                     * @param  {number}   product__amount       Number of noise
                     * @param  {Function} callback     Customize the drawing function
                     */
                    var drawGlitch = function(width, height, product__amount, callback) {
                        for (var i = 0; i < (product__amount || 10); i++) {
                            var x = Math.random() * width + 1,
                                y = Math.random() * height + 1;

                            callback(i, x, y);
                        }
                    };


                    /**
                     * clearCanvas - Reset the canvas
                     */
                    var clearCanvas = function() {
                        ctx.clearRect(0, 0, width, height);
                    };
                }));


                /**
                 * randInt - Random number integer
                 */
                var randInt = function(a, b) {
                    return ~~(Math.random() * (b - a) + a);
                };


                /**
                 * pixelFlick - Pixel displacement
                 * @param  {number}   i   -   i-th pixel
                 * @param  {number[]} d   -   Pixel array
                 */
                var pixelFlick = function(i, d) {
                    d[i] = d[i + 16];
                };


                /**
                 * pixelCooler - Cool color
                 * @param  {number}   i   -   i-th pixel
                 * @param  {number[]} d   -   Pixel array
                 */
                var pixelCooler = function(i, d) {
                    d[i] = 1;
                    d[i + 1] += randInt(2, 5);
                    d[i + 2] *= randInt(1, 3) + 8;
                };
            }
        };
        //--------------------------------




        if (animations__on_mouse_move__enabled) {

            // *** 2.28) Directian aware background function
            // Flowing background on hover effect
            // ------------------------------------------------------
            var flow_bg_dir_aware = function(params) {
                var $container = $(params.container);

                if ($container.length) {
                    if (params.oppsite_direction) {
                        $container.each((function(index, el) {
                            $(this).find(params.element).hover((function(event) {
                                var $this = $(this),
                                    direction = $this.entry({ e: event });

                                if (direction == 'up' || direction == 'left') {
                                    $this.addClass('opposite');
                                } else {
                                    $this.removeClass('opposite');
                                }
                            }), (function(event) {
                                var $this = $(this),
                                    direction = $this.entry({ e: event });

                                if (direction == 'down' || direction == 'right') {
                                    $this.addClass('opposite');
                                } else {
                                    $this.removeClass('opposite');
                                }
                            }));
                        }));
                    } else {
                        $container.each((function(index, el) {
                            $(this).find(params.element).hover((function(event) {
                                var $this = $(this),
                                    direction = $this.entry({ e: event });

                                if (direction == 'up' || direction == 'left') {
                                    $this.removeClass('opposite');
                                } else {
                                    $this.addClass('opposite');
                                }
                            }), (function(event) {
                                var $this = $(this),
                                    direction = $this.entry({ e: event });

                                if (direction == 'down' || direction == 'right') {
                                    $this.removeClass('opposite');
                                } else {
                                    $this.addClass('opposite');
                                }
                            }));
                        }));
                    }
                }
            };
            // ---------------------




            // *** 2.29) 3D hover tilt effect
            // Tilting on mouse move
            // -----------------------------------------------------
            var threeD_hover = function(params) {
                var default_opts = {
                    parent: ".td-hover",
                    element: ".td-hover__item",
                    convex: true, // if not set it is false or concave
                    maxRotateDegreeX: 40,
                    maxRotateDegreeY: 40,
                    xSensitivity: 5, // Min: 1  |  Max: 10
                    ySensitivity: 10, // Min: 1  |  Max: 10
                    perspective: 1000,
                    transform_origin: 0,
                    mouseSensitiveArea: false, // if not set it's the parent element
                    easing: Power4.easeOut,
                    movementTime: 1,
                    easingBack: Elastic.easeOut.config(1, 0.3), // when the mouse leaves the area
                    movementTimeBack: 1.5 //// when the mouse leaves the area
                };
                params = $.extend({}, default_opts, params);

                var $parent = $(params.parent);

                if ($parent.length) {
                    // Get the elements inside to be animated ...
                    var el = $parent.find(params.element),
                        $card_effect = $parent.find(".illusion__effect"),
                        playGround,
                        // defining the factor to be whether concave or covex style ...
                        factor = 1;

                    if (params.convex) {
                        factor = -1;
                    }

                    // Set the nessecory styles
                    TweenMax.set(el, { transformPerspective: params.perspective, transformOrigin: "50% 50% " + params.transform_origin + "px", rotationY: 0.01, rotationX: 0.01, "transform-style": "preserve-3d", "backface-visibility": " hidden" });

                    // Thee core function fo each of the elements inside ...
                    el.each((function(index, el) {
                        var $this = $(this);


                        playGround = $this.parents(params.parent);
                        if (params.mouseSensitiveArea) {
                            playGround = params.mouseSensitiveArea;
                        }

                        function core_func(e) {
                            // Defining the degrees ..
                            var ax = params.xSensitivity * (($this.offset().left + ($this.outerWidth() / 2)) - e.pageX) / 200,
                                ay = params.ySensitivity * (($this.offset().top + ($this.outerHeight() / 2)) - e.pageY) / 200;

                            // Setting the max deg product__amount ...
                            if (ax > params.maxRotateDegreeX) {
                                ax = params.maxRotateDegreeX;
                            } else if (ax < -params.maxRotateDegreeX) {
                                ax = -params.maxRotateDegreeX;
                            }

                            if (ay > params.maxRotateDegreeY) {
                                ay = params.maxRotateDegreeY;
                            } else if (ay < -params.maxRotateDegreeY) {
                                ay = -params.maxRotateDegreeY;
                            }

                            var dx = (-factor) * ax,
                                dy = factor * ay,
                                theta = Math.atan2(ay / 2, ax / 2), //angle between cursor and center of poster in RAD
                                angle = theta * 180 / Math.PI - 90; //convert rad in degrees
                            if (angle < 0) {
                                angle = angle + 360;
                            }
                            // Animating ...
                            TweenMax.to($this, params.movementTime, { rotationY: dx, rotationX: dy, ease: params.easing });

                            //gradient angle and opacity
                            $card_effect.css('background', 'linear-gradient(' + angle + 'deg, rgba(255,255,255,' + 0.5 + ') 0%,rgba(255,255,255,0) 80%)');
                        }
                        // mosuse move on canvas ..
                        playGround.on("mousemove", core_func);
                        playGround.on("mouseleave", (function() {
                            TweenMax.to($this, params.movementTimeBack, { rotationY: 0.5, rotationX: 0.5, ease: params.easingBack });
                        }));

                    }));
                }
            };
            // -------------------




            // *** 2.30) Move hover effect
            // moving on mouse move
            //  Move around element on hover effect
            // -----------------------------------------------------
            var move_hover = function(params) {
                var $parent = $(params.parent);

                if ($parent.length) {
                    // Get the elements inside to be animated ...
                    var el = $parent.find(params.element),
                        // defining the factor to be whether concave or covex style ...
                        factor = -1;

                    if (params.invert) {
                        factor = 1;
                    }

                    // Set the nessecory styles
                    // TweenMax.set(el, { x: 0.01, y: 0.01, z: 0.01, "will-change": "transform", transformPerspective: 1000 });

                    TweenMax.set(el, { x: 0.01, y: 0.01, z: 0.01, transformPerspective: 1000 });

                    // Thee core function fo each of the elements inside ...
                    el.each((function(index, el) {
                        var $this = $(this);

                        function core_func(e) {
                            // Defining the degrees ..
                            var ax = params.xSensitivity * (($this.offset().left + ($this.outerWidth() / 2)) - e.pageX) / 100,
                                ay = params.ySensitivity * (($this.offset().top + ($this.outerHeight() / 2)) - e.pageY) / 100;

                            // Setting the max deg product__amount ...
                            if (ax > params.maxMoveX) {
                                ax = params.maxMoveX;
                            } else if (ax < -params.maxMoveX) {
                                ax = -params.maxMoveX;
                            }

                            if (ay > params.maxMoveY) {
                                ay = params.maxMoveY;
                            } else if (ay < -params.maxMoveY) {
                                ay = -params.maxMoveY;
                            }

                            var dx = factor * ax,
                                dy = factor * ay;
                            // Animating ...
                            TweenMax.to($this, params.movementTime, { x: dx, y: dy, ease: params.easing });
                        }
                        if (!params.mouseSensitiveArea) {
                            params.mouseSensitiveArea = $parent;
                        }
                        // mosuse move on canvas ..
                        params.mouseSensitiveArea.on("mousemove", core_func);
                    }));
                }
            };
            // -------------------
        }


        //
        //
        //
        // ===========     End of Basic Functions     ==========






        // ==================================================================
        // =         3) Special buttons and links components adding         =
        // ==================================================================
        // 
        // 
        // 

        // *** 3.1) Button - Shuffle style
        // -----------------------------------------------------
        var btn_shuffle = function() {
            var $btn_shuffle = $(".btn--shuffle");
            if ($btn_shuffle.length) {
                // Shuffle Letters
                // ------------------------------
                /**
                 * @name        Shuffle Letters
                 * @author      Martin Angelov
                 * @version     1.0
                 * @url         http://tutorialzine.com/2011/09/shuffle-letters-effect-jquery/
                 * @license     MIT License
                 */

                (function($) {

                    $.fn.shuffleLetters = function(prop) {

                        var options = $.extend({
                            "step": 10, // How many times should the letters be changed
                            "fps": 40, // Frames Per Second
                            "text": "", // Use this text instead of the contents
                            "callback": function() {} // Run once the animation is complete
                        }, prop);

                        return this.each((function() {

                            var el = $(this),
                                str = "";

                            // Preventing parallel animations using a flag;

                            if (el.data('animated')) {
                                return true;
                            }

                            el.data('animated', true);

                            if (options.text) {
                                str = options.text.split('');
                            } else {
                                str = el.text().split('');
                            }

                            // The types array holds the type for each character;
                            // Letters holds the positions of non-space characters;

                            var types = [],
                                letters = [];

                            // Looping through all the chars of the string

                            for (var i = 0; i < str.length; i++) {

                                var ch = str[i];

                                if (ch == " ") {
                                    types[i] = "space";
                                    continue;
                                } else if (/[a-z]/.test(ch)) {
                                    types[i] = "lowerLetter";
                                } else if (/[A-Z]/.test(ch)) {
                                    types[i] = "upperLetter";
                                } else {
                                    types[i] = "symbol";
                                }

                                letters.push(i);
                            }

                            el.html("");

                            // Self executing named function expression:
                            (function shuffle(start) {

                                // This code is run options.fps times per second
                                // and updates the contents of the page element
                                var i,
                                    len = letters.length,
                                    strCopy = str.slice(0); // Fresh copy of the string

                                if (start > len) {

                                    // The animation is complete. Updating the
                                    // flag and triggering the callback;
                                    el.data('animated', false);
                                    options.callback(el);
                                    return;
                                }

                                // All the work gets done here
                                for (i = Math.max(start, 0); i < len; i++) {

                                    // The start argument and options.step limit
                                    // the characters we will be working on at once
                                    if (i < start + options.step) {

                                        // Generate a random character at thsi position
                                        strCopy[letters[i]] = randomChar(types[letters[i]]);
                                    } else {
                                        strCopy[letters[i]] = "";
                                    }
                                }

                                el.text(strCopy.join(""));

                                setTimeout((function() {

                                    shuffle(start + 1);

                                }), 1000 / options.fps);

                            })(-options.step);


                        }));
                    };

                    function randomChar(type) {
                        var pool = "";

                        if (type == "lowerLetter") {
                            pool = "abcdefghijklmnopqrstuvwxyz0123456789";
                        } else if (type == "upperLetter") {
                            pool = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                        } else if (type == "symbol") {
                            pool = ",.?/\\(^)![]{}*&^%$#'\"";
                        }

                        var arr = pool.split('');
                        return arr[Math.floor(Math.random() * arr.length)];
                    }
                })(jQuery);

                $btn_shuffle.each((function() {
                    var $this = $(this),
                        width = $this.outerWidth(),
                        height = $this.outerHeight();

                    $this.css({
                        width: width,
                        height: height
                    });

                    $this.on('mouseover', (function() {
                        $this.shuffleLetters({
                            // "step": 10, // How many times should the letters be changed
                            // "fps": 40, // Frames Per Second
                            // "text": "", // Use this text instead of the contents
                            // "callback": function() {} // Run once the animation is complete
                        });
                    }));
                }));
            }
        };
        //---------------------




        // ---------------------
        // *** 3.2) Button components in the nav
        // Nav sometimes won't load while using
        // Barba.js so the special btns in it
        // need to be handeled in a different functions
        // -----------------------------------------------------
        var btn_components_nav = function() {
            var $btn__cube_nav = $nav_wrapper.find('.btn--cube');
            if ($btn__cube_nav.length) {
                $btn__cube_nav.each(function() {
                    var $t = $(this);
                    $t.children('span').clone().appendTo($t);
                });
            }

            var $btn__slide_nav = $nav_wrapper.find('.btn--slide');
            if ($btn__slide_nav.length) {
                $btn__slide_nav.each(function() {
                    var $t = $(this),
                        t1 = $t.children('span').clone(),
                        t2 = t1.clone();
                    $t.append(t1, t2);
                });
            }

            var $btn__ajax_text_nav = $nav_wrapper.find('.btn--ajax__text');
            if ($btn__ajax_text_nav.length) {
                $btn__ajax_text_nav.each(function() {
                    var $t = $(this);
                    $t.children('span:first-child').clone().prependTo($t);
                });
            }

            var $btn__letters_nav = $nav_wrapper.find('.btn--letters');
            if ($btn__letters_nav.length) {
                $btn__letters_nav.each(function() {
                    var $t = $(this),
                        t1 = $t.children('.letters').clone();
                    $t.prepend(t1);

                    var btnLtxt1 = $t.find(".letters:nth-child(1)"),
                        btnLtxt2 = $t.find(".letters:nth-child(2)"),
                        btnLtxt3 = $t.find(".letters:nth-child(3)"),
                        btnLtxtSplit1 = new Lettering(btnLtxt1, { type: "letters" }),
                        btnLtxtSplit2 = new Lettering(btnLtxt2, { type: "letters" });
                    if (btnLtxt3.length) {
                        var btnLtxtSplit3 = new Lettering(btnLtxt3, { type: "letters" });
                    }
                });
            }
        };
        //---------------------




        // *** 3.3) Button components in the page contents
        // special btns content adding in page contents
        // -----------------------------------------------------
        var btn_components_pageContents = function() {
            var $btn__cube_pc = $page_contents_wrapper.find('.btn--cube');
            if ($btn__cube_pc.length) {
                $btn__cube_pc.each(function() {
                    var $t = $(this);
                    $t.children('span').clone().appendTo($t);
                });
            }

            var $btn__slide_pc = $page_contents_wrapper.find('.btn--slide');
            if ($btn__slide_pc.length) {
                $btn__slide_pc.each(function() {
                    var $t = $(this),
                        t1 = $t.children('span').clone(),
                        t2 = t1.clone();
                    $t.append(t1, t2);
                });
            }

            var $btn__ajax_text_pc = $page_contents_wrapper.find('.btn--ajax__text');
            if ($btn__ajax_text_pc.length) {
                $btn__ajax_text_pc.each(function() {
                    var $t = $(this);
                    $t.children('span:first-child').clone().prependTo($t);
                });
            }

            var $btn__letters_pc = $page_contents_wrapper.find('.btn--letters');
            if ($btn__letters_pc.length) {
                $btn__letters_pc.each(function() {
                    var $t = $(this),
                        t1 = $t.children('.letters').clone();
                    $t.prepend(t1);

                    var btnLtxt1 = $t.find(".letters:nth-child(1)"),
                        btnLtxt2 = $t.find(".letters:nth-child(2)"),
                        btnLtxt3 = $t.find(".letters:nth-child(3)"),
                        btnLtxtSplit1 = new Lettering(btnLtxt1, { type: "letters" }),
                        btnLtxtSplit2 = new Lettering(btnLtxt2, { type: "letters" });
                    if (btnLtxt3.length) {
                        var btnLtxtSplit3 = new Lettering(btnLtxt3, { type: "letters" });
                    }
                });
            }

            var $btn__letters_pc__rm = $page_contents_wrapper.find('.btn--letters-read-more');
            if ($btn__letters_pc__rm.length) {
                $btn__letters_pc__rm.each(function() {
                    var lt = $(this).find(".letters"),
                        btnLtxtSplit = new Lettering(lt, { type: "letters" });
                });
            }

            var $process_label_li = $(".process__labels").find("li");
            if ($process_label_li) {
                $process_label_li.each(function() {
                    // j++;
                    var self = $(this),
                        t1 = self.children('span').clone();
                    self.append(t1);
                });
            }

            var $timeline_badge = $(".timeline__badge");
            if ($timeline_badge) {
                $timeline_badge.each(function() {
                    // j++;
                    var self = $(this),
                        t1 = self.children('span').clone();
                    self.append(t1);
                });
            }
        };
        //---------------------




        // *** 3.4)  Hover bg element in page content
        // .hover--bg-flow__el will never be used in the nav so 
        // this function automatically is only for page contents
        // -----------------------------------------------------
        var hover_bg_pageContent = function() {
            $(".hover--bg-flow")
                .find(".hover--bg-flow__el")
                .prepend("<span class='hover-bg'></span>");
        };


        // *** 3.5) Hover bg element in the nav
        // -----------------------------------------------------
        var hover_bg_nav = function() {
            $(".hover--bg-flow").find(".nav-link").prepend("<span class='hover-bg'></span>");
            $(".hover--simple").find(".nav-link").prepend("<span class='hover-bg'></span>");
        };
        // --------------------
    }




    // ---------------------
    // *** 3.6) Box move
    // move an elemnt (usually a box) around among a set
    // of elements beside each other as hover state
    // -----------------------------------------------------
    var box_move = function(params) {
        var default_opts = {
            parent: ".hover--move",
            children: '.hover--move__el',
            active_class: ".cc",
            magic_el_id_class: 'magic-box',
            transition_time: 0.3,
            // easing: Power3.easeOut,
            easing: Back.easeOut.config(1),
            vertical: false,
            // special_condition: is_desktop
            special_condition: true // means there is no special condition .. 
        };
        params = $.extend({}, default_opts, params);
        // Get parent, children(buttons) and active button
        var $parent = $(params.parent);

        if ($parent.length) {
            if (params.special_condition) {
                $parent.each((function() {
                    var $this_parent = $(this),
                        $chldren = $this_parent.find(params.children),
                        $active = $this_parent.find(params.active_class);

                    if ($this_parent.length && $chldren.length) {
                        // create the magic element, the one that moves and set its variable
                        $this_parent.append("<span id='" + params.magic_el_id_class + "' class='" + params.magic_el_id_class + "'></span>");
                        var $magicEl = $this_parent.find("." + params.magic_el_id_class + "");

                        // get the position and with data of each element and put in data array to use it later
                        $chldren.each((function() {
                            var $el = $(this);
                            $el
                                .data("posLeft", $el.position().left)
                                .data("posTop", $el.position().top)
                                .data("newWidth", $el.outerWidth());
                        }));

                        if (params.vertical) {
                            // set the positin of the magic element relative to the active button
                            TweenMax.set($magicEl, { height: $active.outerHeight(), width: "100%" });

                            // now create data array of the magic element at reference point 
                            $magicEl
                                .data("origTop", $magicEl.position().top);

                            // do the magic !!
                            $chldren.on('mouseenter', (function() {
                                var $el = $(this);
                                TweenMax.to($magicEl, params.transition_time, { y: $el.data("posTop"), ease: params.easing });
                            }));
                            $this_parent.on('mouseleave', (function() {
                                TweenMax.to($magicEl, params.transition_time, { y: $magicEl.data("origTop"), ease: params.easing });
                            }));
                        } else {
                            // set the positin of the magic element relative to the active button
                            TweenMax.set($magicEl, { width: $active.outerWidth(), x: $active.position().left });
                            // now create data array of the magic element at reference point 
                            $magicEl
                                .data("origLeft", $magicEl.position().left)
                                .data("origWidth", $magicEl.outerWidth());

                            // do the magic !!
                            $chldren.on('mouseenter', (function() {
                                var $el = $(this);
                                TweenMax.to($magicEl, params.transition_time, { x: $el.data("posLeft"), width: $el.data("newWidth"), ease: params.easing });
                            }));
                            $this_parent.on('mouseleave', (function() {
                                TweenMax.to($magicEl, params.transition_time, { x: $magicEl.data("origLeft"), width: $magicEl.data("origWidth"), ease: params.easing });
                            }));
                        }

                        // update data array of the reference point on click
                        $chldren.on('mousedown', (function() {
                            var $el = $(this);
                            $magicEl
                                .data("origLeft", $el.position().left)
                                .data("origTop", $el.position().top)
                                .data("origWidth", $el.outerWidth());
                        }));
                    }
                }));
            }
        }
    };



    //
    //
    //
    // =========  End of Special buttons and links components adding  =========





    // ==========================================================
    // =         4) Navigation menu related functions           =
    // ==========================================================
    // 
    // 
    // 

    // *** 4.1) Side nav variables
    // -----------------------------------------------------
    var $nav = $nav_wrapper.find("#nav"),
        $nav_toggle = $nav_wrapper.find(".nav__toggle"),
        $nav_burg = $nav_toggle.find(".nav__hamburger"),
        $nav_ul = $nav.children("ul"),
        $nav_item = $nav_ul.children("li").children(".nav-link"),
        $nav_item_num = $nav_item.length - 1,
        $nav_item_active = $nav_ul.find(".active"),

        nav_is_animating = false,

        // $nav_sliding = $nav,
        $nav_sliding = $("#nav-wrapper:not(.nav-static)").find('#nav'),
        $nav_item_active_before = $nav_sliding.find(".active").prevAll().children(".nav-link").find("span:last-child, .icon"),
        $nav_item_active_after = $nav_sliding.find(".active").nextAll().children(".nav-link").find("span:last-child, .icon");

    if ($nav_wrapper.hasClass("nav--has-sliced-bg-img")) {
        $nav_item_active_before = null;
        $nav_item_active_after = null;

        $nav.find("li").append('<span class="nav--has-sliced-bg-img__slice"></span>');
    }

    var $nav_item_active_before_img = $nav_sliding.find(".active").prevAll().children(".nav--has-sliced-bg-img__slice"),
        $nav_item_active_after_img = $nav_sliding.find(".active").nextAll().children(".nav--has-sliced-bg-img__slice"),

        $nav_will_change_transform = $("#nav, #nav > ul > li > a > span:first-child, #page-contents"),
        fo = false,
        nav_is_open = false,
        time_nav_open = 0.6,
        time_nav_close = 0.4,
        ease_nav = Power2.easeInOut,
        ease_page_cover = Power2.easeOut,
        page_contents_scale = 0.94,
        page_cover_opacity = 0.8,
        time_navLinks_open = 0.7,
        time_navLinks_close = time_nav_close,
        time_navImgs_open = 0.7,
        time_navImgs_close = time_nav_close,
        time_navLinks_stagger = 0.1,
        ease_navLinks = Power2.easeOut;
    // --------------------



    // ----------  Essential nav functions  ---------- //
    // 

    // *** 4.2) defining Nav sliding timeline
    // -----------------------------------------------------
    var tl_nav_open = new TimelineMax({ onComplete: nav_opened, paused: true }),
        tl_nav_close = new TimelineMax({ onComplete: nav_closed, paused: true }),
        tl_links_stagger_open = new TimelineMax({ paused: true }),
        tl_links_stagger_close = new TimelineMax({});
    // --------------------



    // ّ4.3) Fix issue(1): fixed hero image
    // When there is a fixed positioned hero background
    // and the page content scales down --> the background
    // breaks the order; this func fixes the issue
    // UPDATE:  we no longer scale down the page when
    // the menu opens!! for the sake of performance!
    // -----------------------------------------------------
    // var fhn1 = function() {
    //     $(".hero__parallax").css({
    //         position: '',
    //         top: ''
    //     });
    // };
    // var fhn2 = delay();
    // --------------------




    // *** 4.4) Sliced image background
    // Prepare sliced menu background image
    // -----------------------------------------------------
    var menu_bg_img = function() {
        if ($nav_wrapper.hasClass("nav--has-sliced-bg-img")) {

            var func = function() {
                $nav.find(".nav--has-sliced-bg-img__slice").each((function() {
                    var top = $(this).parent().offset().top - $window.scrollTop();
                    $(this).css('top', -top);
                }));
            };

            func();

            $window.resize(func);
        }
    };
    // --------------------




    // *** 4.5) Nav callback functions
    // -----------------------------------------------------
    function nav_opened() {
        nav_is_animating = false;
        nav_is_open = true;
    }

    function nav_closed() {
        nav_is_animating = false;
        nav_is_open = false;
    }
    // --------------------




    // *** 4.6) َAdding transitions to the timelines
    // -----------------------------------------------------
    tl_nav_open
        .fromTo($nav_sliding, time_nav_open, { xPercent: -101, }, { xPercent: 0, ease: ease_nav });
    // .to($page_contents, (time_nav_open), { z: -50, ease: Power4.easeOut, }, 0)
    // .to($body, 0, { height: "100%", overflow: "hidden" }, 0);
    // .to($page_cover, (time_nav_open / 3), { autoAlpha: page_cover_opacity, ease: ease_page_cover }, 0);

    tl_nav_close
        .fromTo($nav_sliding, time_nav_close, { xPercent: 0, }, { xPercent: -101, ease: ease_nav });
    // .to($page_contents, time_nav_close, { z: 0, ease: Power2.easeOut }, 0)
    // .to($body, 0, { height: "", overflow: "" }, 0);
    // .to($page_cover, (time_nav_open / 3), { autoAlpha: 0, ease: ease_page_cover }, 0);

    tl_links_stagger_open
        .staggerTo($nav_item_active_after, time_navLinks_open, { x: 0, opacity: 1, ease: ease_navLinks }, time_navLinks_stagger, 0)
        .staggerTo($nav_item_active_before, time_navLinks_open, { x: 0, opacity: 1, ease: ease_navLinks }, -time_navLinks_stagger, 0)

        .staggerTo($nav_item_active_after_img, time_navImgs_open * 1.2, { x: 0, ease: ease_navLinks }, time_navLinks_stagger, 0)
        .staggerTo($nav_item_active_before_img, time_navImgs_open * 1.2, { x: 0, ease: ease_navLinks }, -time_navLinks_stagger, 0);

    tl_links_stagger_close
        .staggerTo($nav_item_active_before, time_navLinks_close, { x: -70, opacity: 0, }, 0, 0)
        .staggerTo($nav_item_active_after, time_navLinks_close, { x: -70, opacity: 0, }, 0, 0)

        .staggerTo($nav_item_active_before_img, time_navImgs_close, { x: -70, }, 0, 0)
        .staggerTo($nav_item_active_after_img, time_navImgs_close, { x: -70, }, 0, 0);

    // hiding the nav at start
    TweenMax.set($nav_sliding, { x: "-101%" });
    // --------------------




    // *** 4.7) َAdding transitions to the timelines
    // -----------------------------------------------------
    // 
    // Toggle nav function
    var toggle_nav = function() {
        if (!nav_is_animating) {
            tl_links_stagger_close.paused(false);

            tl_links_stagger_open.paused(false);

            if (nav_is_open) {
                tl_nav_close.restart();
                tl_links_stagger_close.restart();
            } else {
                tl_nav_open.restart();
                tl_links_stagger_open.restart();
            }

            $nav_toggle.toggleClass("clicked");

            $html.toggleClass("the-menu-opened");

            $nav_wrapper.toggleClass("visible");

            nav_is_animating = true;
        }
    };

    // Close nav function independently
    var close_nav = function() {
        if (nav_is_open) {
            $nav_toggle.removeClass("clicked");

            $html.removeClass("the-menu-opened");

            $nav_wrapper.removeClass("visible");

            tl_nav_close.restart();
        }
    };

    // Main toggle nav function
    var nav_show_hide = function() {
        // $nav_toggle.on("mouseover", toggle_nav);

        $nav_toggle.on("click", (function(event) {
            toggle_nav();
            // center_transition_origin({
            //     item: $page_contents,
            // });
        }));

        // close menu on click on anything outside of the menu
        // $page_cover.on("click", close_nav);

        $page_cover.on("click", close_nav);
    };




    // *** 4.8) َScroll Spy function
    var scroll_spy = function() {
        if($nav_wrapper.data("scroll-spy-active")) {
            function scroll_spy_cb(callback) {
                $('body').scrollspy({ target: '.nav-wrapper' });
                return true;
            }
            scroll_spy_cb();
            $nav_wrapper.on('activate.bs.scrollspy', (function() {

                TweenLite.set($nav_item.find("span:last-child, .icon"), { clearProps: "all" });
                //clear tweens from timeline
                tl_links_stagger_close.clear();
                tl_links_stagger_open.clear();

                // var t;
                // clearTimeout(t);
                // t = setTimeout(function() {
                $nav_item_active = $nav_ul.find(".active");

                $nav_item_active_before = $nav_item_active.prevAll().children(".nav-link").find("span:last-child, .icon");
                $nav_item_active_after = $nav_item_active.nextAll().children(".nav-link").find("span:last-child, .icon");

                $nav_item_active_before_img = $nav_sliding.find(".active").prevAll().children(".nav--has-sliced-bg-img__slice");
                $nav_item_active_after_img = $nav_sliding.find(".active").nextAll().children(".nav--has-sliced-bg-img__slice");

                tl_links_stagger_close
                    .staggerTo($nav_item_active_before, time_navLinks_close, { x: -70, opacity: 0, }, 0, 0)
                    .staggerTo($nav_item_active_after, time_navLinks_close, { x: -70, opacity: 0, }, 0, 0)


                    .staggerTo($nav_item_active_before_img, time_navImgs_close, { left: "-50%", }, 0, 0)
                    .staggerTo($nav_item_active_after_img, time_navImgs_close, { left: "-50%", }, 0, 0);

                tl_links_stagger_open
                    .staggerTo($nav_item_active_after, time_navLinks_open, { x: 0, opacity: 1, ease: Power2.easeOut }, time_navLinks_stagger, 0)
                    .staggerTo($nav_item_active_before, time_navLinks_open, { x: 0, opacity: 1, ease: Power2.easeOut }, -time_navLinks_stagger, 0)


                    .staggerTo($nav_item_active_after_img, time_navImgs_open, { x: 0, left: "-40%", ease: Power2.easeOut }, time_navLinks_stagger, 0)
                    .staggerTo($nav_item_active_before_img, time_navImgs_open, { x: 0, left: "-40%", ease: Power2.easeOut }, -time_navLinks_stagger, 0);

                tl_links_stagger_close.paused(true);
                tl_links_stagger_open.paused(true);
                // }, 300);
            }));
        }
    };
    // --------------------




    // *** 4.9) َIn-Page scrolling
    // -----------------------------------------------------
    var inpage_scroll = function() {
        var page_scaled = 1,
            calibration = 0,
            page_scale = 1, // this shoud be the scale product__amount of page contents when nav opens 
            // page_scale = 0.94, // this shoud be the scale product__amount of page contents when nav opens 
            time = 1,

            // should be run only on sliding nav
            is_navside = $nav_wrapper.hasClass('nav-side-wrapper');

        if (__mar) {
            time = 0;
        }

        // change behaviour of controller to animate scroll instead of jump
        $(".nav a[href^='#'], .in-page-scroll").on('mousedown', (function(e) {
            var id = $(this).attr("href"),
                $id = $(id);
            if ($id.length > 0) {
                e.preventDefault();

                // trigger scroll
                // scrollMagicController.scrollTo(id);
                if ($(window).width() > mq_break_pt) {
                    if (is_navside) {
                        // center_transition_origin({
                        //     item: $page_contents,
                        //     level_item: $(id),
                        // });

                        // $('html, body').animate({
                        //     scrollTop: ($id.offset().top - $page_contents.offset().top) / page_scale
                        // }, $id.offset().top * 2, "easeOutCubic");

                        $('html, body').animate({
                            scrollTop: ($id.offset().top - $page_contents.offset().top) / page_scale
                        }, $id.offset().top / 2, "easeOutCubic");

                    } else {
                        $('html, body').animate({
                            scrollTop: $id.offset().top
                        }, $id.offset().top / 2, "easeOutCubic");
                    }
                } else {

                    // center_transition_origin({
                    //     item: $page_contents,
                    //     level_item: $(id),
                    // });

                    $('html, body').animate({
                        scrollTop: ($id.offset().top - $page_contents.offset().top) / page_scale
                    }, 0, "easeOutCubic");
                }

                // if supported by the browser we can even update the URL.
                if (window.history && window.history.pushState) {
                    history.pushState("", document.title, id);
                }
            }
        }));
    };
    // --------------------




    // *** 4.10) Go-Top functon
    // Go to top of the page on button click
    // ------------------------------------------------------
    var got_top = function() {
        var $go_top_btn = $("#go-top"),
            goTopTime = Math.round(($page_contents_wrapper.height() / 2000)) * 1000;

        if (__mar) {
            goTopTime = 0;
        }

        if ($go_top_btn.length) {
            $("#go-top").on('mousedown', function(event) {
                event.preventDefault();

                $('html, body').animate({
                    scrollTop: 0
                }, goTopTime, "easeOutCubic");
            });
        }
    };
    // --------------------




    // *** 4.11) Elasto-Fading effect of navbar on scroll
    // ----------------------------------------------------
    var nav_header_fade_scroll = function(params) {

        var default_opts = {
            nav_wrapper: $nav_wrapper,
            fade_class_parent: "nav--fade",
            fade_class_child: "has-nav-bg--transparent",
            elastic_class_parent: "nav--elastic",
            elastic_class_child: "has-nav-bg--expanded",
            scroll_point_trigger: 30,
        };

        params = $.extend({}, default_opts, params);

        var $wrapper = params.nav_wrapper,
            $loader_nav_comp = $(".loader--nav-comp"),
            fade = $wrapper.hasClass(params.fade_class_parent),
            elastic = $wrapper.hasClass(params.elastic_class_parent),
            trgr_pnt = params.scroll_point_trigger;

        if ($wrapper.data("trigger-full-height")) {
            trgr_pnt = $("#hero").height();
        }

        if (fade && elastic) {
            // tl.to($bg, params.time, { opacity: 0, scaleY: 2.35 }, 0)
            //     .to($header, params.time, { y: 20 }, 0)
            //     .to($navbar, params.time, { y: 20 }, 0);

            if ($window.scrollTop() < trgr_pnt) {
                // tl.play();
                $wrapper.addClass(params.fade_class_child);
                $wrapper.addClass(params.elastic_class_child);

                $loader_nav_comp.addClass(params.fade_class_child);
                $loader_nav_comp.addClass(params.elastic_class_child);
            }

            $window.scroll((function() {
                var scroll = $window.scrollTop();
                if (scroll < trgr_pnt) {
                    // tl.play();
                    $wrapper.addClass(params.fade_class_child);
                    $wrapper.addClass(params.elastic_class_child);

                    $loader_nav_comp.addClass(params.fade_class_child);
                    $loader_nav_comp.addClass(params.elastic_class_child);

                } else {
                    // tl.reverse();
                    $wrapper.removeClass(params.fade_class_child);
                    $wrapper.removeClass(params.elastic_class_child);

                    $loader_nav_comp.removeClass(params.fade_class_child);
                    $loader_nav_comp.removeClass(params.elastic_class_child);
                }
            }));

        } else if (fade) {

            tl.to($bg, params.time, { opacity: 0 });
            if ($window.scrollTop() < trgr_pnt) {
                // tl.play();
                $wrapper.addClass(params.fade_class_child);
                $wrapper.addClass(params.elastic_class_child);

                $loader_nav_comp.addClass(params.fade_class_child);
                $loader_nav_comp.addClass(params.elastic_class_child);
            }

            $window.scroll((function() {
                var scroll = $window.scrollTop();
                if (scroll < trgr_pnt) {
                    // tl.play();
                    $wrapper.addClass(params.fade_class_child);
                    $wrapper.addClass(params.elastic_class_child);

                    $loader_nav_comp.addClass(params.fade_class_child);
                    $loader_nav_comp.addClass(params.elastic_class_child);

                } else {
                    // tl.reverse();
                    $wrapper.removeClass(params.fade_class_child);
                    $wrapper.removeClass(params.elastic_class_child);

                    $loader_nav_comp.removeClass(params.fade_class_child);
                    $loader_nav_comp.removeClass(params.elastic_class_child);
                }
            }));
        } else if (elastic) {

            // tl.to($bg, params.time, { scaleY: 2.35 }, 0)
            //     .to($header, params.time, { y: 20 }, 0)
            //     .to($navbar, params.time, { y: 20 }, 0);
            if ($window.scrollTop() < trgr_pnt) {
                // tl.play();
                $wrapper.addClass(params.elastic_class_child);

                $loader_nav_comp.addClass(params.elastic_class_child);
            }

            $window.scroll((function() {
                var scroll = $window.scrollTop();
                if (scroll < trgr_pnt) {
                    // tl.play();
                    $wrapper.addClass(params.elastic_class_child);

                    $loader_nav_comp.addClass(params.elastic_class_child);
                } else {
                    // tl.reverse();
                    $wrapper.removeClass(params.elastic_class_child);

                    $loader_nav_comp.removeClass(params.elastic_class_child);
                }
            }));
        }
    };
    // --------------------




    // *** 4.12) Static nav layout
    // ----------------------------------------------------
    var nav_static = function() {
        if ($nav_wrapper.hasClass("nav-static") && $nav_wrapper.hasClass("nav-side-wrapper")) {
            $("#stage").addClass("nav-static--down-there");
        }
    };
    // --------------------

    //
    // ----------  End of Essential nav functions  ---------- //




    // ----------  Functions related to nav_side dropdowns  ---------- //
    //

    // *** 4.13) Navside dropdown: show on click with - sliding effect
    // ----------------------------------------------------
    var side_menu_dropdown = function() {
        if (!$nav_wrapper.hasClass("nav-side--expanded-dropdown")) {
            var go_forward_link = $nav.find('.has--dropdown__branch').children('a'),
                go_forward_link_inside = $nav.find('.has--dropdown__branch').not(".nav-side--expanded-dropdown .has--dropdown > .has--dropdown__branch").children('a');

            function go_forward(event) {
                //prevent default clicking on direct children of .has--dropdown__branch 
                event.preventDefault();
                var $this = $(this);
                $this.next('ul').removeClass('is-hidden').end().parent('.has--dropdown__branch').parent('ul').addClass('move-out');
                $this.next('div').children('ul').removeClass('is-hidden').end().parent('.has--dropdown__branch').parent('ul').addClass('move-out');
            }

            go_forward_link.on('click', go_forward);
            // btn--cube status
            // $nav.find(".dropdown__secondary").children('.see-all').find(".nav-link").removeClass('btn--cube');
            //submenu items - go back link
            $nav.find('.go-back').on('click', (function() {
                var $this = $(this);
                $this.parent('ul').addClass('is-hidden').parent('.has--dropdown__branch').parent('ul').removeClass('move-out');
                $this.parent('ul').addClass('is-hidden').parent().parent('.has--dropdown__branch').parent('ul').removeClass('move-out');
            }));
        }
    };
    // --------------------



    if (!is_mobile) {
        // *** 4.14) Navside dropdown placement: relative state
        // ----------------------------------------------------
        var dropdown_relative_branch = function(params) {
            if ($nav.hasClass("dropdown--relative")) {
                // setting the position of first dropdown menu on large devices
                enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {
                    match: function() {
                        function func() {
                            // Find the first dropdown branch of the navigation
                            params.item.each((function() {
                                // Variables
                                var box_margin = params.margin,
                                    $this = $(this),
                                    widow_height = $window.height(),
                                    dropdown_width = $this.outerWidth(),
                                    dropdown_height = $this.outerHeight(),
                                    dropdown_offset = $this.offset(),
                                    // Parent offset is needed to determine initial and
                                    // static top position of first dropdown branch
                                    menu_parent = $this.parent(".has--dropdown__branch"),
                                    // this is how we can get the top position of the parent
                                    // item relative to the window 
                                    parent_fixed_top_pos = menu_parent.offset().top - $window.scrollTop(),
                                    bottom_edge = parent_fixed_top_pos + dropdown_height,
                                    offside = bottom_edge - widow_height;

                                if (dropdown_height > widow_height) {
                                    $this.css('top', -parent_fixed_top_pos);
                                } else {
                                    if (offside > 0) {
                                        $this.css('top', -(offside + box_margin));
                                    } else {
                                        $this.css('top', 0);
                                    }
                                }

                            }));
                        }

                        func();
                        $window.resize(func);
                    },
                    // setting the position of first dropdown menu on small devices
                    unmatch: function() {
                        the_item.each((function() {
                            $(this).css('top', 0);
                        }));
                    }
                });
            }
        };
        // --------------------




        // *** 4.15) Navside dropdown: show on hover
        // ----------------------------------------------------
        var side_menu_dropdown_hovering = function() {
            if ($nav_wrapper.hasClass("nav-side--expanded-dropdown")) {
                var go_forward_link = $nav.find('.has--dropdown__branch').children('a'),
                    go_forward_link_inside = $nav.find('.has--dropdown__branch').not(".nav-side--expanded-dropdown .has--dropdown > .has--dropdown__branch").children('a');

                function go_forward(event) {
                    //prevent default clicking on direct children of .has--dropdown__branch 
                    event.preventDefault();
                    var $this = $(this);
                    $this.next('ul').removeClass('is-hidden').end().parent('.has--dropdown__branch').parent('ul').addClass('move-out');
                    $this.next('div').children('ul').removeClass('is-hidden').end().parent('.has--dropdown__branch').parent('ul').addClass('move-out');
                }

                enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {

                    setup: function() {
                        go_forward_link.on("click", go_forward);
                    },

                    match: function() {
                        go_forward_link.off("click");
                        go_forward_link_inside.on("click", go_forward);
                        // Resetting dropdown status on screen resize between small and large
                        $nav.find(".has--dropdown").removeClass("move-out").find("ul").not(".has--dropdown").addClass("is-hidden").removeClass("move-out");
                    },

                    unmatch: function() {
                        go_forward_link.on("click", go_forward);
                        // Resetting dropdown status on screen resize between small and large
                        $nav.find(".has--dropdown").removeClass("move-out").find("ul").not(".has--dropdown").addClass("is-hidden").removeClass("move-out");
                    }
                });

                //submenu items - go back link
                $nav.find('.go-back').on('click', (function() {
                    var $this = $(this);
                    $this.parent('ul').addClass('is-hidden').parent('.has--dropdown__branch').parent('ul').removeClass('move-out');
                    $this.parent('ul').addClass('is-hidden').parent().parent('.has--dropdown__branch').parent('ul').removeClass('move-out');
                }));
            }
        };
        // --------------------
    }



    if (is_desktop) {
        // *** 4.16) Fixing some IE bug
        // ----------------------------------------------------
        var fix_an_ie_bug = function(item) {

            if (is_ie_upto_10 && !$nav.hasClass("dropdown--relative") && $nav.hasClass("nav-side") || is_ie_11 && !$nav.hasClass("dropdown--relative") && $nav.hasClass("nav-side")) {

                enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {

                    match: function() {
                        // alert('Freaking IE - Large Screen');
                        function func() {
                            item.each((function() {
                                var $this = $(this),
                                    item_parent = $this.parent(".has--dropdown__branch"),
                                    item_parent_top = item_parent.offset().top - $window.scrollTop();

                                item_parent.css('position', 'relative');
                                $this.css({
                                    top: -(item_parent_top),
                                    height: '100vh'
                                });
                            }));
                        }

                        func();
                        $window.resize(func);
                    },

                    unmatch: function() {
                        // alert('Freaking IE - Small Screen');
                        item.each((function() {
                            var $this = $(this),
                                item_parent = $this.parent(".has--dropdown__branch");

                            item_parent.css('position', 'static');
                            $this.css({
                                top: 0,
                                height: 'auto'
                            });
                        }));
                    }

                });
            }
        };

        var fix_ie11_bug = function() {
            if (is_ie_11 && !$nav.hasClass("dropdown--relative") && $nav.hasClass("nav-side")) {
                var dp_gallery = $nav.find(".dropdown__gallery"),
                    dp_gallery_parent = dp_gallery.parent(".dropdown__branch-wrapper");
                enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {

                    match: function() {
                        dp_gallery_parent.css('display', 'block');
                        dp_gallery.css({
                            position: 'relative',
                            top: '50%',
                            left: 0,
                            marginTop: -dp_gallery.outerHeight() / 2,
                        });
                    },

                    unmatch: function() {
                        dp_gallery.css({
                            position: 'absolute',
                            top: 0,
                            marginTop: 0,
                        });
                    }
                });
            }
        };
        // --------------------
    }

    //
    // ----------  End of Functions related to nav_side dropdowns  ---------- //




    // ----------  Functions related to nav_bar  ---------- //
    // 
    if (!is_mobile) {
        // *** 4.17) dropdown placement; arrange placements & offsets
        // so it doesn't go outside of the boundries
        // ** This function will be used for elements in both
        // navbar and nav-header
        // ----------------------------------------------------
        var navbar_dropdown_placement = function(params) {
            var default_opts = {
                grand_parent: ".nav-bar",
                element: ".dropdown__simple-wrapper",
                el_min_width: 200,
                el_edge_offset: 10
            };

            params = $.extend({}, default_opts, params);

            var $grand_parent = $(params.grand_parent),
                dropdown_min_width = params.el_min_width,
                dropdown_right_offset = params.el_edge_offset;

            if ($grand_parent.length) {

                var $simple_dropdown_wrapper = $grand_parent.find(params.element);

                $simple_dropdown_wrapper.each((function() {
                    var $this = $(this),
                        $parent_li = $this.parent(".has--dropdown__branch"),
                        parent_li_width = $parent_li.outerWidth(true),
                        dropdown_width = $this.outerWidth(true),
                        allowed_shrink = dropdown_width - dropdown_min_width,
                        allowed_movement = dropdown_min_width - parent_li_width,
                        // Finding the number of dropdown levels
                        dropdown_level = 1;
                    if ($this.find(".has--dropdown__branch .has--dropdown__branch .has--dropdown__branch .has--dropdown__branch").length) {
                        dropdown_level = 5;

                    } else if ($this.find(".has--dropdown__branch .has--dropdown__branch .has--dropdown__branch").length) {
                        dropdown_level = 4;

                    } else if ($this.find(".has--dropdown__branch .has--dropdown__branch").length) {
                        dropdown_level = 3;

                    } else if ($this.find(".has--dropdown__branch").length) {
                        dropdown_level = 2;
                    }
                    var cumulative_allowed_shrink = dropdown_level * allowed_shrink;

                    function inner_func() {

                        var parent_left = Math.round($parent_li.offset().left),
                            right_edge = Math.round(parent_left + dropdown_level * dropdown_width),
                            offside = right_edge - $window.width() + dropdown_right_offset;
                        if (offside > 0 && offside <= cumulative_allowed_shrink) {
                            // 01 step: just shrink the items
                            $this.width(dropdown_width - (offside / dropdown_level));
                        } else if (offside > 0 && offside <= (cumulative_allowed_shrink + allowed_movement)) {
                            // 02 step: shrink and move to left
                            var new_width = dropdown_width - (parent_left + parent_li_width + (dropdown_level - 1) * dropdown_width - $window.width()) / (dropdown_level - 1) - dropdown_right_offset;
                            $this.css({
                                "left": "auto",
                                "right": 0
                            });
                            if (new_width > 0) {
                                $this.width(new_width);
                            }
                        } else if (offside > 0 &&
                            offside > (cumulative_allowed_shrink + allowed_movement) &&
                            (parent_left > (dropdown_min_width * (dropdown_level - 1) + dropdown_right_offset)) &&
                            (($window.width() - parent_left) > (dropdown_min_width + dropdown_right_offset))) {
                            // 03 step: shrink and arange item in opposite direction
                            var new_width_1 = $window.width() - parent_left - dropdown_right_offset,
                                new_width_2 = (parent_left - dropdown_right_offset) / (dropdown_level - 1),
                                array = [new_width_1, new_width_2, dropdown_width];
                            $this.addClass("dropdown--to-left").width(Math.min.apply(Math, array));
                        } else if (offside > 0 &&
                            offside > (cumulative_allowed_shrink + allowed_movement) &&
                            (parent_left + parent_li_width > (dropdown_width * (dropdown_level) + dropdown_right_offset))) {
                            // 04 step: shrink and arange item in opposite direction and move
                            $this.addClass("dropdown--to-left").css({
                                "left": "auto",
                                "right": 0
                            });
                        } else if (offside > 0 &&
                            offside > (cumulative_allowed_shrink + allowed_movement) &&
                            (parent_left + parent_li_width > (dropdown_min_width * (dropdown_level) + dropdown_right_offset))) {
                            // 04 step: shrink and arange item in opposite direction and move
                            $this.addClass("dropdown--to-left").css({
                                "width": (parent_left + parent_li_width - dropdown_right_offset) / (dropdown_level),
                                "left": "auto",
                                "right": 0
                            });
                        } else if (offside <= 0) {
                        } else {
                            // 06 step: opposte drirection arrngment and least width
                            $this.addClass("dropdown--to-left").css({
                                "width": dropdown_min_width,
                                "left": "auto",
                                "right": 0
                            });
                        }
                    }

                    inner_func();
                    var dd_timer;
                    $window.resize((function() {
                        $this.removeClass("dropdown--to-left").css({
                            "left": 0,
                            "right": "auto"
                        });
                        clearTimeout(dd_timer);
                        dd_timer = setTimeout(function() {
                            inner_func();
                        }, 500);
                    }));
                }));
            }
        };
        // --------------------




        // *** 4.18) Navbar switch
        // Switching from sliding menu to fixed bar menu
        // * has to be exicuted on window.load
        // ----------------------------------------------------
        var navbar_switch = function() {
            if ($nav.hasClass('nav-bar')) {
                enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {
                    match: function() {
                        TweenMax.set($nav_sliding, { x: "0%" });
                        // TweenMax.set($page_contents, { z: 0 });
                        TweenMax.set($body, { height: "", overflow: "" });
                        TweenMax.set($page_cover, { autoAlpha: 0 });
                        tl_links_stagger_open.restart();
                        $html.removeClass("the-menu-opened");
                        $nav_wrapper.removeClass("visible");

                        // TweenMax.set($nav_item_active_after, { x: 0, opacity: 1 });
                        // TweenMax.set($nav_item_active_before, { x: 0, opacity: 1 });
                    },

                    unmatch: function() {
                        TweenMax.set($nav_sliding, { x: "-101%" });

                        close_nav();
                    }
                });
            }
        };
        // --------------------




        // *** 4.19) Navbar fitting
        // is used when there are some contents in the
        // .nav-header and arranges navbar right pdding
        // -------------------------------------------------------
        var navbar_fit = function(params) {
            var default_opts = {
                nav_header: ".nav-header",
                nav_header_children: "> ul > li > a, > button",
                nav_bar: ".nav-bar",
                padding: "padding-right",
                padding_excess: 30,
            };
            params = $.extend({}, default_opts, params);

            var width = 0;

            enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {
                setup: function() {
                    $(params.nav_header).find(params.nav_header_children).slice(1).each((function() { width += ($(this).width() + 40); }));
                },

                match: function() {
                    $(params.nav_bar).css(params.padding, Math.round(width + params.padding_excess));
                },

                unmatch: function() {
                    $(params.nav_bar).css(params.padding, '');
                }
            });
        };
        // --------------------




        // *** 4.20) Dropdown items - masonry style
        // ------------------------------
        var nav_bar_masonry_grid = function(params) {
            var default_opts = {
                nav_bar: ".nav-bar",
                parent: ".dropdown__secondary__submenu",
                child: "> li:not('.go-back'):not('.see-all')",
                masonry_class: ".nav-masonry-item"
            };

            params = $.extend({}, default_opts, params);

            var $wrapper = $(params.nav_bar),
                $drop_down = $(params.parent),
                $li = $(params.child);

            if ($wrapper.length) {
                $drop_down.css('box-sizing', 'content-box');
                $drop_down.find(params.child).addClass(params.masonry_class.substring(1));

                enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {
                    match: function() {
                        $drop_down.isotope({
                            itemSelector: params.masonry_class,
                            containerStyle: null,
                            masonry: {
                                columnWidth: 1,
                            }
                        });
                    },

                    unmatch: function() {
                        $drop_down.isotope("destroy");
                    }
                });
            }
        };
        // --------------------




        // *** 4.21) Dropdown simple - The parent element
        // of simple dropdown  must have relative position
        // ----------------------------------------------------
        var nav_bar_simple_dropdown = function() {
            var $sdw = $(".nav-bar .dropdown__simple-wrapper, .nav-header .dropdown__simple-wrapper, .nav-bar .dropdown__block-wrapper, .nav-header .dropdown__block-wrapper");

            enquire.register("screen and (min-width: " + mq_break_pt_nav + "px)", {
                match: function() {
                    $sdw.parent(".has--dropdown__branch").css('position', 'relative');
                },

                unmatch: function() {
                    $sdw.parent(".has--dropdown__branch").css('position', 'static');
                }
            });
        };
        // --------------------
    }

    //
    //
    //
    // =========  End of Navigation menu related functions  =========






    // ==========================================================
    // =            5) Portfolio related functions              =
    // ==========================================================
    // 
    // 
    // 

    // *** 5.1) Load more Function for portfolio
    // * is used inside portfolio
    // ----------------------------------------------------------
    var load_more = function(params) {
        // the first page to be loaded after firs hit on -load-more- button.
        var page = 2,
            imgCover = false;
        if (params.container.hasClass('fit-rows')) {
            imgCover = true;
        }

        function lazyload() {
            // the url to the pages which are to be loaded
            var url = "./" + params.pagesNamePrefix + "-" + page + ".html";
            // hiding the -load-more- button
            params.svgLoader.addClass('loading');
            params.buttonId.addClass('loading');
            // showing the loading animation while waiting for the items to be loaded
            // params.loadingId.show();

            $.ajax({
                url: url,
                // if the url was reached
                success: function(response) {
                    // if the response was false or NONE then ..
                    if (!response || response.trim() == "NONE") {
                        // display a message

                        // params.buttonId.prop("disabled", true);

                        var v;
                        clearTimeout(v);
                        v = setTimeout((function() {

                            // hide the -load-more- button
                            params.svgLoader.removeClass('loading');
                            params.buttonId.removeClass('loading').addClass('btn--ajax__message--no-more');
                            params.buttonId.find(".btn--ajax__text").text("No more entries to load :(");
                        }), 1400);
                    } else {

                        // run [ appendContests ] function which loads the items and appends them 

                        var t;
                        clearTimeout(t);
                        t = setTimeout((function() {
                            params.buttonId.addClass('btn--ajax__message');
                            appendContests(response);
                        }), 1400);

                    }
                },
                // if the url was NOT reached -error-
                error: function(response) {
                    var v;
                    clearTimeout(v);
                    v = setTimeout((function() {

                        // hide the -load-more- button
                        params.svgLoader.removeClass('loading');
                        params.buttonId.removeClass('loading').addClass('btn--ajax__message--error');
                        params.buttonId.find(".btn--ajax__text").text("Oops! something went wrong. Please refresh the page.");
                    }), 1400);
                }
            });
        }

        // appending function
        function appendContests(response) {
            var containerCurrentHeight = params.container.height();
            params.container.parent().css({
                'height': containerCurrentHeight,
                'overflow': 'hidden'
            });
            // get the elemnts ans and append them to the container
            $(response).appendTo(params.container);
            // choose next page
            page += 1;
            // if the -load-more- function is for elemnts which -isotope- function has been used for them, then ... 
            if (params.isotope) {
                var filterVl = params.isotope_filters.find(".selected").attr("data-filter");
                // since the old items have position: absolute, set the padding top as heigh as the height;
                // so that the new loaded elements stack beneath the old items
                params.container.css('padding-top', containerCurrentHeight);
                // if isotope__fade_in_out method was used ..
                if (params.is_isotope__fade_in_out) {
                    // wait for images to load compeletely ..
                    params.container.imagesLoaded((function() {

                        if (imgCover) {
                            img_cover(params.container);
                        }

                        if (params.lgPopUp) {
                            params.container.find(".js-lightgallery__el").off("click");
                            light_gallery_portfolio = $lightgallery.lightGallery(lightGallery_data);
                        }

                        // set the padding-top to 0; the default state
                        params.container.css('padding-top', 0);
                        // destroy the current isotope function; needs to be done to get the new laded elements
                        params.container.isotope("destroy");
                        // run isotope function
                        params.container.isotope({
                            itemSelector: params.ItemSelector,
                            layoutMode: params.layoutMode,
                            percentPosition: true,
                            masonry: {
                                columnWidth: '.grid-sizer'
                            }
                        });
                        params.svgLoader.removeClass('loading');
                        params.buttonId.removeClass('loading');

                        var t;
                        clearTimeout(t);
                        t = setTimeout((function() {

                            var containerAutotHeight = params.container.height();
                            if (containerAutotHeight === containerCurrentHeight) {
                                params.container.isotope__fade_in_out({ filter: filterVl });
                                params.container.parent().css({
                                    'height': '',
                                    'overflow': ''
                                });
                                params.container.find(".loaded--hidden").find('.hover-item__media').append('<div class="isotope--fade-in-out--flash"></div>');
                                $(params.ItemSelector).removeClass('loaded--hidden');
                            } else {
                                params.container.parent().css('height', containerAutotHeight).one(transitionEnd, (function() {
                                    // run isotope__fade_in_out
                                    params.container.isotope__fade_in_out({ filter: filterVl });
                                    $(this).css({
                                        'height': '',
                                        'overflow': ''
                                    });
                                    params.container.find(".loaded--hidden").find('.hover-item__media').append('<div class="isotope--fade-in-out--flash"></div>');
                                    $(params.ItemSelector).removeClass('loaded--hidden');
                                }));
                            }
                        }), 1400);

                        var s;
                        clearTimeout(s);
                        s = setTimeout((function() {
                            params.buttonId.removeClass('btn--ajax__message');
                        }), 3000);

                        var p;
                        clearTimeout(p);
                        p = setTimeout((function() {
                            params.buttonId.prop("disabled", false);
                            params.container.trigger('height-changed');
                        }), 3600);
                    }));

                    // eles; if the bare isotope function was run ..
                } else {
                    // wait for images to load compeletely ..
                    params.container.imagesLoaded((function() {
                        if (imgCover) {
                            img_cover(params.container.find(".loaded--hidden"));
                        }

                        if (params.lgPopUp) {
                            params.container.find(".js-lightgallery__el").off("click");
                            light_gallery_portfolio = $lightgallery.lightGallery(lightGallery_data);
                        }
                        // set the padding-top to 0; the default state
                        params.container.css('padding-top', 0);
                        // destroy the current isotope function; needs to be done to get the new laded elements
                        params.container.isotope("destroy");
                        // run isotope function
                        params.container.isotope({
                            itemSelector: params.ItemSelector,
                            layoutMode: params.layoutMode,
                            filter: filterVl,
                            stagger: params.stagger,
                            transitionDuration: params.transitionDuration,
                            hiddenStyle: params.hiddenStyle,
                            visibleStyle: params.visibleStyle,
                            percentPosition: true,
                            masonry: {
                                columnWidth: '.grid-sizer'
                            }
                        });

                        // show -load-more- button
                        params.svgLoader.removeClass('loading');
                        params.buttonId.removeClass('loading');

                        var t;
                        clearTimeout(t);
                        t = setTimeout((function() {

                            var containerAutotHeight = params.container.height();
                            if (containerAutotHeight === containerCurrentHeight) {
                                params.container.parent().css({
                                    'height': '',
                                    'overflow': ''
                                });
                                params.container.find(".loaded--hidden").find('.hover-item__media').append('<div class="isotope--fade-in-out--flash"></div>');
                                $(params.ItemSelector).removeClass('loaded--hidden');
                            } else {
                                params.container.parent().css('height', containerAutotHeight).one(transitionEnd, (function() {
                                    $(this).css({
                                        'height': '',
                                        'overflow': ''
                                    });
                                    params.container.find(".loaded--hidden").find('.hover-item__media').append('<div class="isotope--fade-in-out--flash"></div>');
                                    $(params.ItemSelector).removeClass('loaded--hidden');
                                }));
                            }
                        }), 1400);

                        var s;
                        clearTimeout(s);
                        s = setTimeout((function() {
                            params.buttonId.removeClass('btn--ajax__message');
                        }), 3000);

                        var p;
                        clearTimeout(p);
                        p = setTimeout((function() {
                            params.buttonId.prop("disabled", false);
                            params.container.trigger('height-changed');
                        }), 3600);
                    }));

                }
                // if there is not isotope funtion for the elemnts.
            } else {

                params.container.imagesLoaded((function() {
                    if (imgCover) {
                        img_cover(params.container);
                    }

                    if (params.lgPopUp) {
                        params.container.find(".js-lightgallery__el").off("click");
                        light_gallery_portfolio = $lightgallery.lightGallery(lightGallery_data);
                    }
                    // show -load-more- button
                    params.svgLoader.removeClass('loading');
                    params.buttonId.removeClass('loading');


                    var t;
                    clearTimeout(t);
                    t = setTimeout((function() {

                        var containerAutotHeight = params.container.height();
                        if (containerAutotHeight === containerCurrentHeight) {

                            params.container.parent().css({
                                'height': '',
                                'overflow': ''
                            });
                            $(params.ItemSelector).removeClass('loaded--hidden');
                        } else {
                            params.container.parent().css('height', containerAutotHeight).one(transitionEnd, (function() {

                                $(this).css({
                                    'height': '',
                                    'overflow': ''
                                });
                                $(params.ItemSelector).removeClass('loaded--hidden');
                            }));
                        }
                    }), 1400);

                    var s;
                    clearTimeout(s);
                    s = setTimeout((function() {
                        params.buttonId.removeClass('btn--ajax__message');
                    }), 3000);

                    var p;
                    clearTimeout(p);
                    p = setTimeout((function() {
                        params.buttonId.prop("disabled", false);
                    }), 3600);
                }));
            }

            // btn_letters_more();
        }
        // on click load the items and do the rest
        params.buttonId.on('mousedown', (function(event) {
            event.preventDefault();
            $(this).prop("disabled", true);
            lazyload();
        }));
    };
    // ---------------------




    // *** 5.2) isotope__fade_in_out Function
    // For isotope with covering the elements
    // * is used inside portfolio
    // ----------------------------------------------------------
    $.fn.isotope__fade_in_out = function(params) {
        this.each((function() {
            var $items = $(this).children();
            var $visible = $items.filter(params.filter);
            var $hidden = $items.not(params.filter);
            // reveal visible
            $visible.removeClass('isotope--fade-in-out--hidden').addClass('isotope--fade-in-out--visible');
            // hide hidden
            $hidden.removeClass('isotope--fade-in-out--visible').addClass('isotope--fade-in-out--hidden');
        }));
    };
    // -----------------------




    // *** 5.3) Final portfolio function
    // initiate all related functions
    // ----------------------------------------------------------
    function portfolio() {
        //  Portfolio - isotope - loade more ...
        // ======================================
        // 
        // 
        // 
        // Variables
        // ----------------
        var $isotopeContainer = $("#js-portfolio"),
            $isotopeFilters = $("#js-portfolio__filters"),
            $isotopeFilter = $isotopeFilters.find('button'),
            $itemSelector = "#js-portfolio .portfolio-item",
            isoptpeStagger = 0,
            transDur = "0.4s",
            // Initial product__category visible ..
            filterValue = '*', // 0 for all or a string like '.branding' for a specific product__category
            isotopeHiddenStyle = {
                opacity: 0,
                transform: 'scale(.8)',
            },
            isotopeVisibleStyle = {
                opacity: 1,
                transform: 'scale(1)',
            },
            filterValue_isotop,
            isotope_mode,
            is_isotope__fade_in_out;

        if ($isotopeContainer.hasClass("fit-rows")) {
            isotope_mode = "fitRows";
        } else {
            isotope_mode = "masonry";
        }

        if ($isotopeContainer.hasClass("isotope--fade-in-out")) {
            is_isotope__fade_in_out = true;
            filterValue_isotop = null;
        } else {
            is_isotope__fade_in_out = false;
            // if hideAndReveal variable is true filterValue must not be set on inital isotope run .
            // insted isotope__fade_in_out function must run. so we need to define a new varibale for initial
            // isotope function and set it to null if hideAndReveal variable is true
            filterValue_isotop = filterValue;
        }

        var ajax_pages_prefix_name = $isotopeContainer.data("appn"); // ajax pages prefix name

        $isotopeFilters.find("button[data-filter=" + "'" + filterValue + "'" + "]").addClass('selected');

        if (filterValue === 0) {

            $isotopeFilters.find('button[data-filter="*"]').addClass('selected');
        }

        if ($("#js-portfolio__filters .selected").length) {

            box_move({
                parent: ".hover--move.nav-tabs--line, .hover--move.nav-tabs--box",
                children: '.btn--portfolio',
                active_class: '.selected',
                magic_el_id_class: 'magic-box',
                transition_time: 0.3,
                // easing: Power3.easeOut,
                easing: Back.easeOut.config(1)
            });

            box_move({
                parent: ".hover--move.nav-tabs--line-vertical, .hover--move.nav-tabs--box-vertical",
                children: '.btn--portfolio',
                active_class: '.selected',
                magic_el_id_class: 'magic-box',
                transition_time: 0.3,
                // easing: Power3.easeOut,
                easing: Back.easeOut.config(1),
                vertical: true,
            });
        }

        // init isotope after all images have loaded
        var grid = $isotopeContainer.isotope({
            // set itemSelector so .grid-sizer is not used in layout
            itemSelector: $itemSelector,
            layoutMode: isotope_mode,
            filter: filterValue_isotop,
            stagger: isoptpeStagger,
            transitionDuration: transDur,
            hiddenStyle: isotopeHiddenStyle,
            visibleStyle: isotopeVisibleStyle,
            percentPosition: true,
            masonry: {
                columnWidth: '.grid-sizer'
            }
        });
        if (is_isotope__fade_in_out) {
            $isotopeContainer.isotope__fade_in_out({ filter: filterValue });
        }

        $isotopeContainer.find('.hover-item__media').append('<div class="isotope--fade-in-out--flash"></div>');

        // when filter are clicked
        $isotopeFilters.on("click", "button", (function() {
            // add flash effect
            $isotopeContainer.find('.isotope--fade-in-out--flash').removeClass("flashed");
            var tm;
            clearTimeout(tm);
            tm = setTimeout((function() {
                $isotopeContainer.find('.isotope--fade-in-out--flash').addClass("flashed");
            }), 0.001);

            // remove flash effect
            $isotopeContainer.find('.isotope--fade-in-out--flash').one(animationEnd, (function() {
                $(this).removeClass("flashed");
            }));

            var $this = $(this);
            // setting the selected button
            $isotopeFilter.removeClass("selected");
            $this.addClass("selected");
            // setting the filter
            filterValue = $this.attr("data-filter");

            if (is_isotope__fade_in_out) {
                $isotopeContainer.isotope__fade_in_out({ filter: filterValue });
            } else {
                $isotopeContainer.isotope({ filter: filterValue });
            }
        }));

        if ($("#more-portfolio").length) {
            load_more({
                isotope: true,
                chocolatPopUp: false,
                lgPopUp: true,
                buttonId: $("#more-portfolio"),
                svgLoader: $("#load-more-svg-icon"),
                loadingId: $("#loading-div"),
                container: $isotopeContainer,
                isotope_filters: $isotopeFilters,
                pagesNamePrefix: ajax_pages_prefix_name,
                ItemSelector: $itemSelector,
                layoutMode: isotope_mode,
                stagger: isoptpeStagger,
                transitionDuration: transDur,
                is_isotope__fade_in_out: is_isotope__fade_in_out,
                filterVl: filterValue,
                hiddenStyle: isotopeHiddenStyle,
                visibleStyle: isotopeVisibleStyle
            });
        }
    }
    // -----------------------




    // *** 5.4) isotope-bottom
    // start the layout from bottom
    // ----------------------------------------------------------
    if ($(".portfolio.origin-bottom").length) {
        var grid_bottom = $(".portfolio.origin-bottom").imagesLoaded((function() {
            // init Masonry after all images have loaded
            grid_bottom.isotope({
                // set itemSelector so .grid-sizer is not used in layout
                itemSelector: ".portfolio-item",
                originTop: false,
                // columnWidth: 300,
                // use element for option
                // columnWidth: ".grid-sizer",
                percentPosition: true,
                // containerStyle: null
            });
        }));
    }
    // -----------------------


    if ($(".isotope--layout-simple").length) {
        var grid_simple = $(".isotope--layout-simple").imagesLoaded((function() {
            // init Masonry after all images have loaded
            grid_simple.isotope({
                // set itemSelector so .grid-sizer is not used in layout
                itemSelector: ".isotope--layout-simple__el",
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-sizer'
                }
            });
        }));
    }

    // *** 5.5) lighboxes options data
    // ---------------------------------------------------------
    var lightGallery_data = {
            selector: '.js-lightgallery__el',
            autoplay: false,
            pager: true,
            thumbnail: false,
            exThumbImage: 'data-exthumbimage',
            thumbWidth: 70,
            thumbMargin: 10,
            //     width: '80%',
            // height: '80%',
            // mode: 'lg-fade',
            // addClass: 'fixed-size',
            // thumbContHeight: 130
        },

        lightGallery_video_data = {
            selector: '.js-lightgallery-video__el',
            zoom: false,
            actualSize: false,
            fullScreen: false,
            pager: false,
            videoMaxWidth: '1200px',
            youtubePlayerParams: { color: 'white', showinfo: 0, },
            vimeoPlayerParams: { color: 'ffffff' }
        };

    //
    //
    //
    // =========  End of Portfolio related functions  =========






    // ===========================================================
    // =            6) ScollMagic related functions              =
    // ===========================================================
    // 
    // 
    // 

    // ScrollMagic works great for Desktop animations but doesn’t translate to iOS.
    // You’ll want to disable your scroll animations on iPad and iPhone because of the way
    // Mobile Safari delays animations until after the user has finished scrolling.

    // If you need to run a function after your animations have completed, take advantage
    // of TimeLineMax’s onComplete callback.

    // If you don’t want your animations to reverse themselves when the user scrolls
    // back up, use scene.reverse(false).

    // If you need to set options for all your scenes, take advantage of the globalSceneOptions
    // like this ScrollMagic({globalSceneOptions: {triggerHook: .75} }).

    // When repositioning an element remember that the position of the element will also change
    // your trigger point. Use scene.offset() to normalize the trigger points or use a placeholder
    // element as the trigger point.

    // Don’t forget you can always enable visible trigger markers by including the
    // jquery.scrollmagic.debug.js and calling scene.addIndicators().





    if (animations__on_scroll__enabled) {
        // *** 6.1) Init ScrollMagic Controller
        // ---------------------------------------------------------
        var scrollMagicController = new ScrollMagic.Controller();

        var spec_anim_condition = is_desktop;

        if (animations__on_page_load) {
            spec_anim_condition = true;
        }

        if (spec_anim_condition) {

        }


        if (isChrome && is_desktop) {
            // *** 6.2) Parallax hero background
            // ---------------------------------------------------------
            var parallax_hero = function(params) {

                var default_opts = {
                    background_item: ".hero__parallax--simple",
                    // blur_item: ".hero__parallax--dub",
                    // cover_item: ".hero__parallax--cover",
                    y_start: -1,
                    y_end: -350,
                    z_start: 0.01,
                    z_end: 250,
                    opacity_start: 1,
                    opacity_end: 1,
                    blur_start: "0px",
                    blur_end: "0px",
                    anim_durtion: "100%",
                    easing: Power0.easeNone,
                };

                params = $.extend({}, default_opts, params);

                // Animation will be ignored and replaced by scene value in this example
                // TweenMax.set(params.background_item, { "will-change": "transform", transformPerspective: 1000, z: 0.01 });
                var timeline = new TimelineMax();
                TweenMax.set(params.background_item, { transformPerspective: 1000, z: 0.01 });
                var heroParallaxTween = TweenMax.fromTo($(params.background_item), 1, {
                    z: params.z_start,
                    y: params.y_start,
                    "filter": "blur(" + params.blur_start + ")",
                    "-webkit-filter": "blur(" + params.blur_start + ")",
                    autoAlpha: params.opacity_start
                }, {
                    ease: params.easing,
                    z: params.z_end,
                    y: params.y_end,
                    "filter": "blur(" + params.blur_end + ")",
                    "-webkit-filter": "blur(" + params.blur_end + ")",
                    autoAlpha: params.opacity_end
                });

                // TweenMax.set(params.blur_item, { transformPerspective: 1000, z: 0.01 });
                // var heroParallaxTween__blur = TweenMax.fromTo($(params.blur_item), 1, {
                //     z: params.z_start,
                //     y: params.y_start,
                // }, {
                //     ease: params.easing,
                //     z: params.z_end,
                //     y: params.y_end,
                // });

                // var heroParallaxTween__cover = TweenMax.fromTo($(params.cover_item), 1, {
                //     autoAlpha: params.opacity_start
                // }, {
                //     autoAlpha: params.opacity_end
                // });

                timeline.add([
                    heroParallaxTween,
                    // heroParallaxTween__blur
                ])
                // .add(heroParallaxTween__cover)
                ;

                // Create the Scene and trigger when visible
                var scene = new ScrollMagic.Scene({
                        triggerElement: this,
                        duration: params.anim_durtion
                    })
                    .setTween(timeline)
                    // .addIndicators()
                    .addTo(scrollMagicController);


                // Create the Scene and trigger when visible
                // var scene_2 = new ScrollMagic.Scene({
                //         triggerElement: this,
                //         duration: "50%"
                //     })
                //     .setTween(TweenMax.to(".hero__content-wrapper", 1, {opacity: 0}))
                //     // .addIndicators()
                //     .addTo(scrollMagicController);
            };
            // -----------------------



            // *** 6.3) Parallax sections background
            // ---------------------------------------------------------
            var parallax_bg = function(params) {

                var default_opts = {
                    item_class: ".parallax",
                    background_item_class: ".parallax__el",
                    parallax_product__amount_percent: 100,
                };

                params = $.extend({}, default_opts, params);

                var $parallax = $(params.item_class);
                $parallax.each((function() {

                    var $this = $(this),
                        this_Height = $this.outerHeight(),
                        timer,
                        parallax_bg = $this.find(params.background_item_class),
                        parallax_bg_height_diff = (Math.round(100 * (parallax_bg.outerHeight() / this_Height)) - 100) / 2,
                        top_course = -50 - parallax_bg_height_diff * (params.parallax_product__amount_percent / 100) + "%",
                        bottom_course = -50 + parallax_bg_height_diff * (params.parallax_product__amount_percent / 100) + "%",
                        duration = ((this_Height / $window.height()) + 1) * 100 + "%",

                        parallaxTween = TweenMax.fromTo(parallax_bg, 1, {
                            y: top_course,
                        }, {
                            y: bottom_course,
                            ease: Power0.easeNone,
                        }),

                        scene = new ScrollMagic.Scene({
                            triggerElement: this,
                            triggerHook: "onEnter",
                            duration: duration
                        })
                        .setTween(parallaxTween)
                        // .addIndicators()
                        .addTo(scrollMagicController);

                    $window.on("resize", (function() {
                        clearTimeout(timer);
                        timer = setTimeout((function() {
                            scene.duration((($this.outerHeight() / $window.height()) + 1) * 100 + "%");
                        }), 400);
                    }));
                }));
            };
            // -----------------------
        }

        if (!__mar) {


            // *** 6.4) Fixing function
            // Fix an element while scrolling through
            // the course of another one.
            // ---------------------------------------------------------
            var fixed_position = function(params) {
                var el = params.element,
                    course = params.course_element,
                    duration = $(course).outerHeight() + params.course_adjustment_bottom,
                    rev = params.reverse,
                    off = $(el).data("offset");

                if (!off) {
                    off = params.ourse_adjustment_top;
                }
                TweenMax.set(el, { y: 0, position: "relative", "z-index": 5, }); // prepares box for fixed scrolling effect wherever it is on the page
                TweenMax.set($(el).parent(), { position: "relative", "z-index": 5, });
                var moveBox = TweenMax.to(el, 1, { y: duration, ease: Linear.easeNone }); // where the Y coordinate will match the duration in the ScrollMagic scene below to create the effect of it being fixed.
                var scene = new ScrollMagic.Scene({
                        triggerElement: course,
                        duration: duration, // matches length of Y axis tween.
                        triggerHook: params.hook,
                        offset: off,
                    })
                    .setTween(moveBox)
                    // .addIndicators()
                    .addTo(scrollMagicController);
                if (!rev) { scene.reverse(false); }

                var heigh_calc_callback = function() {

                        scene.destroy(true);
                        var el = params.element,
                            course = params.course_element,
                            duration = $(course).outerHeight() + params.course_adjustment_bottom;

                        TweenMax.set(el, { y: 0 }); // prepares box for fixed scrolling effect wherever it is on the page
                        TweenMax.set($(el).parent(), { position: "relative", "z-index": 5, });
                        var moveBox = TweenMax.to(el, 1, { y: duration, ease: Linear.easeNone }); // where the Y coordinate will match the duration in the ScrollMagic scene below to create the effect of it being fixed.
                        scene = new ScrollMagic.Scene({
                                triggerElement: course,
                                duration: duration, // matches length of Y axis tween.
                                triggerHook: params.hook,
                                offset: off,
                            })
                            .setTween(moveBox)
                            // .addIndicators()
                            .addTo(scrollMagicController);
                    },

                    delayed_func = delay();

                $(params.element_with_event).on(params.the_event, (function() {
                    delayed_func(heigh_calc_callback, 100);
                }));
                $window.on('resize', (function(event) {
                    delayed_func(heigh_calc_callback, 1200);
                    // alert("6666666666666666666666666 = " + duration);
                }));
            };



            // *** 6.5) Fixing portfolio filters
            // could be done only when isotope__fade_in_out is selected
            var portfoilio_filters_fixed = function() {
                if ($("#js-portfolio").hasClass("isotope--fade-in-out") && $("#js-portfolio__filters").hasClass('tabs--vertical')) {
                    fixed_position({
                        reverse: true,
                        hook: 'onLeave', //'onEnter' or 'onCenter'or 'onLeave',
                        element: ".js-portfolio__header--fixed", // The element that fixes
                        course_element: ".portfolio__container", // The element that the fixed element is fixed along it
                        course_adjustment_bottom: 0, // The product__amount to be added or removed from the course element height
                        element_with_event: "#js-portfolio", // The element that the function must be refereshed on its event
                        the_event: "height-changed", // The event that make us to referesh the function
                        ourse_adjustment_top: -20 - 60, // 60 is the height of the page navbar and 115 is the outerHeight ..
                        // .. of the element plus the space between it and the start of the cousrse elemnt - Ajust this carefully
                    });
                } else if ($("#js-portfolio").hasClass("isotope--fade-in-out")) {
                    fixed_position({
                        reverse: true,
                        hook: 'onLeave', //'onEnter' or 'onCenter'or 'onLeave',
                        element: ".js-portfolio__header--fixed", // The element that fixes
                        course_element: ".portfolio__container", // The element that the fixed element is fixed along it
                        course_adjustment_bottom: 0, // The product__amount to be added or removed from the course element height
                        element_with_event: "#js-portfolio", // The element that the function must be refereshed on its event
                        the_event: "height-changed", // The event that make us to referesh the function
                        ourse_adjustment_top: -150 - 60, // 60 is the height of the page navbar and 115 is the outerHeight ..
                        // .. of the element plus the space between it and the start of the cousrse elemnt - Ajust this carefully
                    });
                }
            };
            // -----------------------




            // *** 6.6) Linear bar draw animation
            // ---------------------------------------------------------
            var linear_bar_draw_animation = function(params) {
                var default_opts = {
                    parent: ".horizontal-bars",
                    element: ".bar",
                    onScroll: true,
                    offset: 0,
                    deferred: false,
                    deferred_function_name: "playAnim",
                    // in [ orientation ] option,
                    // [ h ] stands for horizontal and
                    // [ v ] stands for vertical
                    orientation: "h",

                    initial_delay: 0.5,
                    transform_origin: "0% 100% 0",

                    scale_x: 0,
                    time_scale_x: 1.5,
                    time_stagger_scale_x: 0.15,
                    easing_scale_x: Power4.easeOut,

                    scale_y: 0.4,
                    time_scale_y: 1.5,
                    time_stagger_scale_y: 0.25,
                    easing_scale_y: Power4.easeOut,
                    // The overlap time between
                    // two scale animations of the
                    // whole group
                    time_overlap: "-=0.5",
                    trigger_hook: "onCenter", //"onEnter", "onLeave";
                };

                params = $.extend({}, default_opts, params);

                var tl = new TimelineMax({ paused: true }),
                    deferred = params.deferred;

                if (params.onScroll && deferred) {
                    deferred = false;
                }


                $(params.parent).each((function() {
                    var $this = $(this),
                        $bar = $this.find(params.element),
                        init_delay = params.initial_delay,
                        offset = params.offset,
                        c_triggerHook = params.trigger_hook;

                    if (typeof $this.data(params.parent.substring(1) + "-delay") !== 'undefined') {
                        init_delay = $this.data(params.parent.substring(1) + "-delay"); // if this set has inline delay spesified in HTML
                    }


                    if (typeof $this.data(params.parent.substring(1) + "-offset") !== 'undefined') {
                        offset = $this.data(params.parent.substring(1) + "-offset"); // if this set has inline offset spesified in HTML
                    }

                            
                    if (typeof $this.data("trigger-hook") !== 'undefined') {
                        c_triggerHook = $this.data("trigger-hook"); // if this is set then it has the inline offset spesified in HTML
                    }

                    // TweenMax.set($bar, { scaleX: params.scale_x, scaleY: params.scale_y, transformOrigin: params.transform_origin, "will-change": "transform" });
                    TweenMax.set($bar, { scaleX: params.scale_x, scaleY: params.scale_y, transformOrigin: params.transform_origin });

                    if (params.orientation === "h") {
                        tl.staggerTo($bar, params.time_scale_x, {
                                delay: init_delay,
                                scaleX: 1,
                                ease: params.easing_scale_x,
                            }, params.time_stagger_scale_x)
                            .staggerTo($bar, params.time_scale_y, {
                                scaleY: 1,
                                easing: params.easing_scale_y,
                            }, params.time_stagger_scale_y, params.time_overlap);
                    } else {
                        tl.staggerTo($bar, params.time_scale_y, {
                                delay: init_delay,
                                scaleY: 1,
                                ease: params.easing_scale_y,
                            }, params.time_stagger_scale_y)
                            .staggerTo($bar, params.time_scale_x, {
                                scaleX: 1,
                                easing: params.easing_scale_x,
                            }, params.time_stagger_scale_x, params.time_overlap);
                    }

                    if (params.onScroll) {

                        var scene = new ScrollMagic.Scene({
                                triggerElement: this,
                                triggerHook: c_triggerHook,
                                // offset: "100%",
                                offset: offset
                            })
                            .setTween(tl.play())
                            // .addIndicators()
                            .addTo(scrollMagicController)
                            .reverse(false);
                    } else if (!deferred) {
                        tl.play();
                    }

                    return tl;
                }));

                function run_anim() {

                    if (deferred) {

                        var x;
                        clearTimeout(x);

                        x = setTimeout((function() {
                            tl.play();
                        }), 100);
                    }
                }

                linear_bar_draw_animation[params.deferred_function_name] = run_anim;
            };
            // -----------------------


            if (!is_mobile) {
                // *** 6.7) Number-counter animation
                // --------------------------------------------------------
                var number_counter = function() {
                    var $counte_r = $(".js-odometer");
                    var $counte_r__simple = $(".js-odometer--simple");
                    if ($counte_r.length) {
                        $counte_r.each((function() {
                            var $this = $(this),
                                $letters_inside = $this.find(".js-odometer__letters-inside"),
                                c_offset = 0;

                            if (typeof $this.data("counter-offset") !== 'undefined') {
                                c_offset = $this.data("counter-offset"); // if this is set then it has the inline offset spesified in HTML
                            }

                            if ($letters_inside.length) {
                                var
                                    $odometer_beside_letter = $letters_inside.find(".js-odometer__el"),
                                    $fact_number = $this.find(".js-odometer__el"),
                                    tlLetterOdometer = new TimelineMax(),
                                    odLettering = new Lettering(".js-odometer__letters", { type: "letters" }),
                                    eles = odLettering.letters; //an array of all the divs that wrap each character

                                tlLetterOdometer.staggerFrom(eles, 0.5, { y: "-100%", delay: 2.7, ease: Power2.easeOut, }, -0.055)
                                    .to($odometer_beside_letter, 0.5, { y: "97%", }, "=-0.7");

                                $odometer_beside_letter.css("opacity", "1");

                                var numberCounterScene = new ScrollMagic.Scene({
                                        triggerElement: this,
                                        triggerHook: "onEnter",
                                        offset: c_offset
                                    })
                                    .on("start", (function(event) {
                                        if ($this.isInViewport()) {

                                            $fact_number.each((function() {
                                                var $el = $(this),
                                                    ls = 1.3;
                                                if ($el.data('letter-spacing')) {
                                                    ls = $el.data('letter-spacing');
                                                }
                                                const cancel = bounty.default({
                                                    el: this,
                                                    value: $el.data('number-end'),
                                                    lineHeight: 1.25,
                                                    letterSpacing: ls,
                                                    // animationDelay: 100,
                                                    // letterAnimationDelay: 100
                                                });
                                            }));
                                        }
                                    }))
                                    .setTween(tlLetterOdometer)
                                    .addTo(scrollMagicController)
                                    // .addIndicators()
                                    .reverse(false);
                            } else {
                                var
                                    el = $this.find(".js-odometer__el"),
                                    scene = new ScrollMagic.Scene({
                                        triggerElement: this,
                                        triggerHook: "onEnter",
                                        duration: 2,
                                        offset: c_offset
                                    })
                                    .on("start", (function() {
                                        if ($this.isInViewport()) {
                                            el.each((function() {
                                                var $el = $(this),
                                                    ls = 1.3;
                                                if ($el.data('letter-spacing')) {
                                                    ls = $el.data('letter-spacing');
                                                }
                                                const cancel = bounty.default({
                                                    el: this,
                                                    value: $(this).data('number-end'),
                                                    lineHeight: 1.25,
                                                    letterSpacing: ls,
                                                });

                                                function doBoth() {
                                                    cancel();
                                                }
                                                setTimeout(doBoth, 5000);

                                            }));
                                        }
                                    }))
                                    .addTo(scrollMagicController)
                                    // .addIndicators()
                                    .reverse(false);
                            }
                        }));
                    }

                    if ($counte_r__simple.length) {
                        $counte_r__simple.each(function() {
                            var $this = $(this),
                                elem = $this.find(".js-odometer__el"),
                                $letters_inside = $this.find(".js-odometer__letters-inside"),
                                c_offset = 0;

                            if (typeof $this.data("counter-offset") !== 'undefined') {
                                c_offset = $this.data("counter-offset"); // if this is set then it has the inline offset spesified in HTML
                            }

                            if ($letters_inside.length) {
                                var
                                    $odometer_beside_letter = $letters_inside.find(".js-odometer__el"),
                                    elem = $this.find(".js-odometer__el"),
                                    tlLetterOdometer = new TimelineMax(),
                                    odLettering = new Lettering(".js-odometer__letters", { type: "letters" }),
                                    eles = odLettering.letters; //an array of all the divs that wrap each character

                                tlLetterOdometer.staggerFrom(eles, 0.8, { y: "104%", delay: 0, ease: Power4.easeOut, delay: 1.8 }, 0.035)
                                    .to($odometer_beside_letter, 0.5, { y: "-85%", }, "=-1");

                                $odometer_beside_letter.css("opacity", "1");

                                
                                elem.each((function() {
                                    var od = new Odometer({
                                        el: this,

                                        // Any option (other than auto and selector) can be passed in here
                                        // format: '',
                                        // theme: 'digital'
                                    });
                                }));

                                var scene = new ScrollMagic.Scene({
                                        triggerElement: this,
                                        triggerHook: "onEnter",
                                        // duration: 2,
                                        offset: c_offset
                                    })
                                    .on("start", (function() {
                                        // if ($this.isInViewport()) {
                                            elem.each((function() {
                                                $(this).html($(this).data('number-end'));
                                                // alert($(this).data('number-end'));
                                            }));
                                        // }
                                    }))
                                    .setTween(tlLetterOdometer)
                                    .addTo(scrollMagicController)
                                    // .addIndicators()
                                    .reverse(false);
                            } else {

                            // if ($this.isInViewport()) {
                                elem.each((function() {
                                    var od = new Odometer({
                                        el: this,

                                        // Any option (other than auto and selector) can be passed in here
                                        // format: '',
                                        // theme: 'digital'
                                    });
                                }));
                            // }
                                var scene = new ScrollMagic.Scene({
                                        triggerElement: this,
                                        triggerHook: "onEnter",
                                        // duration: 2,
                                        offset: c_offset
                                    })
                                    .on("start", (function() {
                                        // if ($this.isInViewport()) {
                                            elem.each((function() {
                                                $(this).html($(this).data('number-end'));
                                                // alert($(this).data('number-end'));
                                            }));
                                        // }
                                    }))
                                    .addTo(scrollMagicController)
                                    // .addIndicators()
                                    .reverse(false);
                            }
                        });
                    }
                };
            }
        }
    }



    if (animations__on_scroll__enabled || animations__on_page_load) {


        if (!__mar) {
            // *** 6.8) Blur text animation
            // Reveal texts from a bluury state - Animation
            // ---------------------------------------------------------
            var blur_text_animation = function(params) {

                var default_opts = {
                    parent: ".blurred-letters",
                    element: ".blurred-letters__el",
                    l_type: "letters",
                    time: 1,
                    offset: 0,
                    onScroll: true,
                    // if it is deferred it means that the timeline and initial styles of elements
                    // will be set and they wait to be animated by blur_text_animation.playAnim() func;
                    deferred: false,
                    deferred_function_name: "playAnim",
                    random: true,
                    percent: 100, // the percent of the letters that you want to be animated
                    initial_delay: 0,
                    stagger_delay: 0.2,
                    easing: Sine.easeOut,
                };

                params = $.extend({}, default_opts, params);

                var tl = [],
                    i = -1,
                    per = params.percent, // the percent of the letters that you want to be animated
                    ease = params.easing,
                    deferred = params.deferred;

                if (params.onScroll && deferred) {
                    deferred = false;
                }

                $(params.parent).each((function() {
                    var $this = $(this),
                        $element = $this.find(params.element), //find the elements
                        color = $element.css("color"), // get their color,
                        lettering_type = params.l_type,
                        split = new Lettering($element, { l_type: lettering_type }),
                        ls_b,
                        t = params.time,
                        stag_delay = params.stagger_delay,
                        init_delay = params.initial_delay,
                        offset = params.offset;
                    
                    if ($(params.parent).length) {
                        if (lettering_type === "letters") {
                            ls_b = split.letters;
                        } else if (lettering_type === "words") {
                            ls_b = split.words;
                        } else if (lettering_type === "lines") {
                            ls_b = split.lines;
                        }
                    }
                    
                    var length = ls_b.length, // how many letters are there
                        slice = Math.round(((100 - per) / 100) * length); // get ready to randomize them

                    if (typeof $this.data(params.parent.substring(1) + "-time") !== 'undefined') {
                        t = $this.data(params.parent.substring(1) + "-time");
                    }

                    if (typeof $this.data(params.parent.substring(1) + "-stagger") !== 'undefined') {
                        stag_delay = $this.data(params.parent.substring(1) + "-stagger");
                    }

                    if (typeof $this.data(params.parent.substring(1) + "-delay") !== 'undefined') {
                        init_delay = $this.data(params.parent.substring(1) + "-delay"); // if this set has inline delay spesified in HTML
                    }

                    if (typeof $this.data(params.parent.substring(1) + "-offset") !== 'undefined') {
                        offset = $this.data(params.parent.substring(1) + "-offset"); // if this set has inline offset spesified in HTML
                    }

                    if (params.random) {
                        ls_b.sort((function() {
                            return 0.5 - Math.random(); // randomize them
                        }));
                    }

                    var ls = ls_b.slice(slice),
                        is_done = function() {
                            TweenMax.set(ls, { color: color, textShadow: color + '0 0 0', }); // everything goes back to normall after the job is done!
                            split.revert();
                        };

                    i++;
                    tl[i] = new TimelineMax({ onComplete: is_done, paused: true }); // define multiple timelines for each set of elements

                    TweenMax.set(ls, { color: 'transparent', textShadow: color + '0 0 30px', opacity: 0 }); // set the necessary styles before the action

                    tl[i].staggerTo(ls, t, { opacity: 1, textShadow: color + '0 0 0px', delay: init_delay, ease: ease, }, stag_delay); // set up the timeline

                    if (params.onScroll) {

                        var scene = new ScrollMagic.Scene({
                                triggerElement: this,
                                // triggerHook: "onEnter",
                                offset: offset,
                            })
                            .setTween(tl[i].play())
                            // .addIndicators()
                            .reverse(false)
                            .addTo(scrollMagicController);

                    } else if (deferred) {

                        return tl[i];

                    } else {

                        tl[i].play();

                    }
                }));


                // when onScroll is false we need to run the function twice
                // 01: to prepere the elements and animation: blur_text_animation();
                // 02: to run the animations: blur_text_animation.playAnim()

                function run_anim() {

                    if (deferred) {

                        var x;
                        clearTimeout(x);

                        x = setTimeout((function() {
                            for (var j = 0; j < i + 1; ++j) {
                                tl[j].play();
                            }
                        }), 100);
                    }
                }


                blur_text_animation[params.deferred_function_name] = run_anim;
            };
            // -----------------------
        }





        // *** 6.9) Fade move animation
        // Reveal element with fade and move - Animation
        // ---------------------------------------------------------
        var fade_move = function(params) {
            // You can wrap "..__el"s in a div with a "..__el-set"
            // class, that way you will have an set delay to and the
            // sets will run the anomation seperately
            // ---------
            // Also if you aply "__lines" to an element that have texts
            // inside it then each line will act like an element
            var default_opts = {
                parent: ".errr",
                element: ".errr__el",
                onScroll: true,
                deferred: false,
                deferred_function_name: "playAnim", // This should be unique foe each function run
                el_set_function_name: "fade_move__el_set_func",
                offset: 0,
                trigger_hook: "onCenter", //"onEnter", "onLeave",
                x: 0,
                y: 25,
                z: 0,
                opacity: 0,
                rotateX: -25,
                rotateY: 0,
                scale: 1,
                blur_start: "0px",
                blur_end: "0px",
                time: 0.8,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: "1000",
                transformOrigin: "50% 0% -50", // x y z
                easing: Power1.easeOut,
            };

            params = $.extend({}, default_opts, params);

            var t = params.time,
                tl = [],
                i = -1,
                k = -1,
                z = -1,
                set_delay = params.each_set_delay,
                stag_delay = params.stagger_delay,
                ease = params.easing,
                deferred = params.deferred;

            params["el_set_function_name" + k] = function() { return undefined; };

            if (params.onScroll && deferred) {
                deferred = false;
            }
            $(params.parent).each((function() {
                var $this = $(this),
                    $el__set = $this.find(params.parent + "__el-set"),
                    $el__lines = $this.find(params.parent + "__lines"),
                    $el__words = $this.find(params.parent + "__words"),
                    $el__letters = $this.find(params.parent + "__letters"),
                    ely = params.element,
                    init_delay = params.initial_delay,
                    offset = params.offset,
                    u = 0,
                    c_triggerHook = params.trigger_hook;
                // alert(params.parent + " length" + $this.length + " ___ " + params.parent + " index" + $this.index());
                if (typeof $this.data(params.parent.substring(1) + "-delay") !== 'undefined') {
                    init_delay = $this.data(params.parent.substring(1) + "-delay"); // if this set has inline delay spesified in HTML
                }

                if (typeof $this.data(params.parent.substring(1) + "-offset") !== 'undefined') {
                    offset = $this.data(params.parent.substring(1) + "-offset"); // if this set has inline delay spesified in HTML
                }

                if (typeof $this.data("trigger-hook") !== 'undefined') {
                    c_triggerHook = $this.data("trigger-hook"); // if this is set then it has the inline offset spesified in HTML
                }

                var scene = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: c_triggerHook,
                    offset: offset,
                });

                i++;
                tl[i] = new TimelineMax({ paused: true });

                if ($el__lines.length) {
                    var splitting = new Lettering($el__lines, { type: "lines", linesClass: params.parent.substring(1) + "__line" });
                    ely = ely + ", " + params.parent + "__line ";

                }

                if ($el__words.length) {
                    var splitting = new Lettering($el__words, { type: "words", wordsClass: params.parent.substring(1) + "__word" });
                    ely = ely + ", " + params.parent + "__word ";

                }

                if ($el__letters.length) {
                    var splitting = new Lettering($el__letters, { type: "letters", lettersClass: params.parent.substring(1) + "__letter" });
                    ely = ely + ", " + params.parent + "__letter ";
                }

                var $element = $this.find(ely);
                $element.parent().css({
                    "transform-style": "preserve-3d",
                });

                $element.css({
                    "transform-style": "preserve-3d",
                    "transform-origin": params.transform_origin
                });

                TweenMax.set($element, {
                    x: params.x,
                    y: params.y,
                    z: params.z,
                    rotationY: params.rotateY,
                    rotationX: params.rotateX,
                    opacity: params.opacity,
                    scale: params.scale,
                    "filter": "blur(" + params.blur_start + ")",
                    "-webkit-filter": "blur(" + params.blur_start + ")",
                    transformPerspective: params.perspective
                });

                if (!$el__set.length) {
                    tl[i].staggerTo($element, t, {
                        x: 0,
                        y: 0,
                        z: 0,
                        rotationY: 0,
                        rotationX: 0,
                        opacity: 1,
                        scale: 1,
                        "filter": "blur(" + params.blur_end + ")",
                        "-webkit-filter": "blur(" + params.blur_end + ")",
                        delay: init_delay,
                        ease: ease,
                        transformOrigin: params.transform_origin
                    }, stag_delay);

                    if (params.onScroll) {
                        scene
                            .setTween(tl[i].play())
                            // .addIndicators()
                            .reverse(false)
                            .addTo(scrollMagicController);
                    } else if (!deferred) {

                        tl[i].play();

                    }

                    return tl[i];

                } else {
                    k++; //first time this runt it becomes 0, thats why data-que for __el-set groups on the their parents have to start from 0, anf the have to be specified
                    params["el_set_function_name" + k] = function() {
                        $el__set.each((function() {

                            tl[z+1000] = new TimelineMax();
                            // alert(init_delay);
                            var $deez_nuts = $(this),
                                $element = $deez_nuts.find(ely);
                            
                            tl[z+1000].staggerTo($element, t, {
                                x: 0,
                                y: 0,
                                z: 0,
                                rotationY: 0,
                                rotationX: 0,
                                opacity: 1,
                                scale: 1,
                                "filter": "blur(" + params.blur_end + ")",
                                "-webkit-filter": "blur(" + params.blur_end + ")",
                                delay: init_delay,
                                ease: ease,
                                transformOrigin: params.transform_origin
                            }, stag_delay, u);

                            u += set_delay;

                            // tl[z+1000].play();
                            // alert(JSON.stringify(tl[i].play()));
                            z++;
                        }));
                    };

                    if (params.onScroll) {
                        scene
                            .on("start", (function() {
                                params["el_set_function_name" + $this.data("que")]();
                            }))
                            // .setTween(tl)
                            // .addIndicators()
                            .reverse(false)
                            .addTo(scrollMagicController);
                    } else if (!deferred) {

                        params["el_set_function_name" + k]();

                    }

                    return params["el_set_function_name" + k];
                }
            }));



            // when onScroll is false we need to run the function twice
            // 01: to prepere the elements and animation: blur_text_animation();
            // 02: to run the animations: blur_text_animation.playAnim();

            function run_anim() {

                if (deferred) {

                    var x;
                    clearTimeout(x);

                    x = setTimeout((function() {
                        for (var j = 0; j < i + 1; ++j) {
                            tl[j].play();
                        }

                        for (var m = 0; m < k + 1; ++m) {
                            params["el_set_function_name" + m]();
                        }

                    }), 100);
                }
            }


            fade_move[params.deferred_function_name] = run_anim;
        };
        // -----------------------




        // *** 6.10) Cover animation
        // Reveal element from a cover - Animation
        // ---------------------------------------------------------
        var cover_animation = function(params) {
            var default_opts = {
                class_Name: ".xcdf",
                onScroll: true,
                deferred: false,
                deferred_function_name: "playAnim",
                el_set_function_name: "el_set",
                el__Time: 1,
                el_Content__Time: 1,
                cover__Time: 1,
                el__Stagger_Time: 0.3,
                el_Content__Stagger_Time: 0.3,
                cover__Stagger_Time: 0.3,
                each_Group_Delay: 0.2,
                cover_Addtional_Delay: 0.2,
                initial_Delay: 0,
                cover__Anim_Dir__To_Default: false,
                cover__Anim_Dir__To_Default_Bounce: false,
                el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: true,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: true,
                scale_Ini: "1",
                anim_Dir: "x",
                el__Pos_Ini: "-100%",
                el__opacity_ini: "1",
                el__Easing: Power4.easeOut,
                el_Content__Pos_Ini: "20%",
                el__content__opacity_ini: "1",
                el_Content__Easing: Power4.easeOut,

                cover__Easing: Power4.easeOut,
                element_class_remove: "default", // the element which the below class will be aded and then removed. default = [parent] otherwise it shoud be a child of the parent
                onComplete_class_remove: false, // add a class to the parent alement and remove it after animation is done
                c_offset: 0, // start this scene after scrolling for 0px
                trigger_hook: "onCenter", //"onEnter", "onLeave",
                to_add_class_to: false, // if this is undefined or false and below variable is defined
                //  then the class will be applied to the parent element itself; here ".class_Name"
                class_to_be_added: false
            };

            params = $.extend({}, default_opts, params);

            var tl = [],
                i = -1,
                k = -1,
                m = 0,
                $anim_scroll = $(params.class_Name),
                $el__global = $anim_scroll.find(params.class_Name + "__el"),
                $el__lines = $anim_scroll.find(params.class_Name + "__lines");
            if ($el__lines.length) {
                var splitting = new Lettering($el__lines, { type: "lines", linesClass: "anim-scroll__line " + params.class_Name.substring(1) + "__line" });
                $el__global = $anim_scroll.find(params.class_Name + "__el, " + params.class_Name + "__line");
            }

            params["el_set_function_name" + k] = function() { return undefined; };

            var $el_content__global = $el__global.wrapInner("<div class='anim-scroll__el-content " + params.class_Name.substring(1) + "__el-content" + "'></div>"),
                el__time = params.el__Time,
                el_content__time = params.el_Content__Time,
                cover__time = params.cover__Time,
                el__stagger_time = params.el__Stagger_Time,
                el_content__stagger_time = params.el_Content__Stagger_Time,
                cover__stagger_time = params.cover__Stagger_Time,
                // cover__stagger_time = 0.2,
                each_group_delay = params.each_Group_Delay, // for grpopped animations | Better be twice el_content__stagger_time
                initial_delay = params.initial_Delay,

                deferred = params.deferred;

            if (params.onScroll && deferred) {
                deferred = false;
            }

            var cover__anim_dir__to_default = params.cover__Anim_Dir__To_Default, // top for verticall, left for horizontal
                cover__anim_dir__to_default_bounce = params.cover__Anim_Dir__To_Default_Bounce,
                el__anim_dir__from_default = params.el__Anim_Dir__From_Default, // top for verticall, left for horizontal
                cover__draw_from_0 = params.cover__Draw_From_0,
                no_cover = params.no_Cover,
                double_reveal = params.double_Reveal,
                double_cover = params.double_Cover,
                triple_cover = params.triple_Cover,
                // set the directionn of the animation
                anim_dir = params.anim_Dir,

                el__pos_ini = params.el__Pos_Ini,
                el__opacity_ini = params.el__opacity_ini,
                el__pos_ini__opp = el__pos_ini.substring(1),
                el__easing = params.el__Easing,

                el_content__scale_ini = params.scale_Ini,

                el_content__pos_ini = params.el_Content__Pos_Ini,
                el_content__pos_ini__opp = "-" + el_content__pos_ini,
                el_content__easing = params.el_Content__Easing,

                cover__pos_ini = "-100%",
                cover__pos_ini__opp = "100%",
                cover__easing = params.cover__Easing,

                cover__pos_middle = "-100%",
                cover__pos_middle__opp = "100%",
                anim_delay_2 = initial_delay,

                cover__pos_last = "-0%",

                dir = "y",
                dir_upprcase = "Y",
                dir_property_1 = "top",
                dir_property_2 = "bottom",


                el__content__opacity_ini = params.el__content__opacity_ini,
                scale = "scale",
                ease = "ease",
                delay = "delay",
                opacity = "opacity",

                special_eff_t = 0,

                position_obj = {},


                // have to use objects to determine animation peoperties
                // as variables
                el__anim_obj = {},
                el__anim_obj_set = {},
                el_content__anim_obj = {},

                cover__anim_obj_from_1 = {},
                cover__anim_obj_to_1 = {},

                cover__anim_obj_from_2 = {},
                cover__anim_obj_to_2 = {},


                el_content__anim_obj_set = {},
                cover__anim_obj_set = {};

            if (!no_cover) {
                $el_content__global.append("<div class='anim-scroll__el-cover " + params.class_Name.substring(1) + "__el-cover" + "'></div>");
            }

            if (!no_cover && !double_reveal && !triple_cover && double_cover) {
                $el_content__global.append("<div class='anim-scroll__el-cover " + params.class_Name.substring(1) + "__el-cover-2" + "'></div>");
            }

            if (!no_cover && !double_reveal && triple_cover && !double_cover) {
                $el_content__global.append("<div class='anim-scroll__el-cover " + params.class_Name.substring(1) + "__el-cover-2" + "'></div>");
                $el_content__global.append("<div class='anim-scroll__el-cover " + params.class_Name.substring(1) + "__el-cover-3" + "'></div>");
            }

            var $el__cover_global = $anim_scroll.find(
                params.class_Name + "__el-cover, " +
                params.class_Name + "__el-cover-2, " +
                params.class_Name + "__el-cover-3");
            $el__global.css({
                "position": "relative",
                "display": "inline-block",
                "overflow": "hidden",
                // "margin": "0",
                "vertical-align": "bottom",
                "padding-bottom": "0.12em"
            });

            $(".anim-scroll__el-content").css({
                "vertical-align": "initial",
            });

            // $anim_scroll.find(".anim-scroll__el, .anim-scroll__line").addClass(params.class_Name.substring(1) + "__el");
            // $anim_scroll.find(".anim-scroll__el-set").addClass(params.class_Name.substring(1) + "__el-set");
            // $anim_scroll.find(".anim-scroll__el-content").addClass(params.class_Name.substring(1) + "__el-content");
            // $anim_scroll.find(".anim-scroll__el-cover").addClass(params.class_Name.substring(1) + "__el-cover");

            if (cover__draw_from_0) {
                cover__pos_ini = "-200%";
                cover__pos_ini__opp = "200%";
                anim_delay_2 = cover__time + initial_delay;
                el__content__opacity_ini = 0;
            }


            if (anim_dir === "x") {
                dir = "x";
                dir_upprcase = "X";
                dir_property_1 = "left";
                dir_property_2 = "right";
            }

            var dirh = dir,
                dirh_upprcase = dir_upprcase,
                dirh_property_1 = dir_property_1,
                dirh_property_2 = dir_property_2;

            if (double_reveal) {
                dirh = "x";
                dirh_upprcase = "X";
                dirh_property_1 = "left";
                dirh_property_2 = "right";
                special_eff_t = el_content__time * 0.5;
            }

            if (cover__anim_dir__to_default) {

                position_obj[dirh_property_1] = "auto";
                position_obj[dirh_property_2] = cover__pos_middle__opp;
                TweenMax.set($el__cover_global, position_obj);
                cover__pos_ini = cover__pos_ini__opp;
                cover__pos_middle = cover__pos_middle__opp;

            } else {

                position_obj[dirh_property_1] = cover__pos_middle__opp;
                TweenMax.set($el__cover_global, position_obj);

            }

            if (cover__anim_dir__to_default_bounce) {
                cover__pos_last = cover__pos_ini;
            }

            if (el__anim_dir__from_default) {
                el_content__pos_ini = el_content__pos_ini__opp;
            }

            if (no_cover) {
                // TweenMax.set($el__cover_global + " // " {position_obj});
                el__time = params.el__Time;
                cover__time = 0;

                el__pos_ini = params.el__Pos_Ini;
                el__pos_ini__opp = el__pos_ini.substring(1);
                // el_content__pos_ini = "100%";
                // el_content__pos_ini__opp = "-100%";

                // cover__pos_ini = "-0%";
                // cover__pos_ini__opp = "0%";

                // cover__pos_middle = "-0%";
                // cover__pos_middle__opp = "0%";


                if (cover__anim_dir__to_default) {

                    el__pos_ini = el__pos_ini__opp;
                    el_content__pos_ini = el_content__pos_ini__opp;

                }
            }

            el__anim_obj[dir] = el__pos_ini;
            el__anim_obj[opacity] = el__opacity_ini;
            el__anim_obj[ease] = el__easing;
            el__anim_obj[delay] = anim_delay_2;

            el_content__anim_obj[dir] = el_content__pos_ini;
            el_content__anim_obj[scale] = el_content__scale_ini;
            el_content__anim_obj[opacity] = el__content__opacity_ini;
            el_content__anim_obj[ease] = el_content__easing;
            el_content__anim_obj[delay] = anim_delay_2;



            cover__anim_obj_from_2[dirh] = cover__pos_ini;
            cover__anim_obj_from_2[ease] = cover__easing;
            cover__anim_obj_from_2[delay] = initial_delay + special_eff_t;

            cover__anim_obj_to_2[dirh] = cover__pos_middle;
            cover__anim_obj_to_2[ease] = cover__easing;
            cover__anim_obj_to_2[delay] = initial_delay + special_eff_t;



            cover__anim_obj_from_1[dirh] = cover__pos_middle;
            cover__anim_obj_from_1[ease] = cover__easing;
            cover__anim_obj_from_1[delay] = anim_delay_2 + special_eff_t;

            cover__anim_obj_to_1[dirh] = cover__pos_last;
            cover__anim_obj_to_1[ease] = cover__easing;
            cover__anim_obj_to_1[delay] = anim_delay_2 + special_eff_t;



            // if (!double_reveal && !triple_cover && double_cover) {

            var cover_2__anim_obj_from_1 = {},
                cover_2__anim_obj_to_1 = {},

                cover_2__anim_obj_from_2 = {},
                cover_2__anim_obj_to_2 = {},
                cover_2_delay = params.cover_Addtional_Delay;

            cover_2__anim_obj_from_2[dir] = cover__pos_ini;
            cover_2__anim_obj_from_2[ease] = cover__easing;
            cover_2__anim_obj_from_2[delay] = initial_delay + cover_2_delay;

            cover_2__anim_obj_to_2[dir] = cover__pos_middle;
            cover_2__anim_obj_to_2[ease] = cover__easing;
            cover_2__anim_obj_to_2[delay] = initial_delay + cover_2_delay;



            cover_2__anim_obj_from_1[dir] = cover__pos_middle;
            cover_2__anim_obj_from_1[ease] = cover__easing;
            cover_2__anim_obj_from_1[delay] = anim_delay_2 + cover_2_delay;

            cover_2__anim_obj_to_1[dir] = "-0%";
            cover_2__anim_obj_to_1[ease] = cover__easing;
            cover_2__anim_obj_to_1[delay] = anim_delay_2 + cover_2_delay;
            // }


            // if (!double_reveal && triple_cover && !double_cover) {

            var cover_3__anim_obj_from_1 = {},
                cover_3__anim_obj_to_1 = {},

                cover_3__anim_obj_from_2 = {},
                cover_3__anim_obj_to_2 = {},
                cover_3_delay = 2 * params.cover_Addtional_Delay;

            cover_3__anim_obj_from_2[dir] = cover__pos_ini;
            cover_3__anim_obj_from_2[ease] = cover__easing;
            cover_3__anim_obj_from_2[delay] = initial_delay + cover_3_delay;

            cover_3__anim_obj_to_2[dir] = cover__pos_middle;
            cover_3__anim_obj_to_2[ease] = cover__easing;
            cover_3__anim_obj_to_2[delay] = initial_delay + cover_3_delay;



            cover_3__anim_obj_from_1[dir] = cover__pos_middle;
            cover_3__anim_obj_from_1[ease] = cover__easing;
            cover_3__anim_obj_from_1[delay] = anim_delay_2 + cover_3_delay;

            cover_3__anim_obj_to_1[dir] = "-0%";
            cover_3__anim_obj_to_1[ease] = cover__easing;
            cover_3__anim_obj_to_1[delay] = anim_delay_2 + cover_3_delay;
            // }




            el__anim_obj_set[dir] = 0;
            el__anim_obj_set[opacity] = 1;
            el__anim_obj_set[ease] = el__easing;
            el__anim_obj_set[delay] = anim_delay_2;

            el_content__anim_obj_set[dir] = 0;
            el_content__anim_obj_set[scale] = 1;
            el_content__anim_obj_set[ease] = el_content__easing;
            el_content__anim_obj_set[delay] = anim_delay_2;


            cover__anim_obj_set[dir] = 0;
            cover__anim_obj_set[ease] = cover__easing;
            cover__anim_obj_set[delay] = initial_delay;

            $anim_scroll.each((function() {

                // defining the local variables
                var $this = $(this),
                    $el = $this.find(params.class_Name + "__el"),
                    $el__set = $this.find(params.class_Name + "__el-set"), // can be used only once in a page for any of the animation types
                    $el__content = $this.find(params.class_Name + "__el-content"),
                    $el__cover = $this.find(params.class_Name + "__el-cover"),
                    $el__cover_2 = $this.find(params.class_Name + "__el-cover-2"),
                    $el__cover_3 = $this.find(params.class_Name + "__el-cover-3"),
                    elements_no = $el__content.length,
                    user_init_delay = params.initial_Delay, // we need to define it here for each set of elements
                    d_offset = params.c_offset, // start this scene after scrolling for offset product__amount in px
                    c_triggerHook = params.trigger_hook,
                    t = 0,
                    $elem_cls_rmv = $this,
                    classToBeAdded = params.class_to_be_added;
                // el_content__time_total = ((elements_no - 1) * el_content__stagger_time) + (el_content__time),
                // cover__stagger_time = (Math.round((el_content__time_total - cover__time) / (elements_no - 1) * 100) / 100),

                if (typeof $this.data(params.class_Name.substring(1) + "-delay") !== 'undefined') {
                    user_init_delay = $this.data(params.class_Name.substring(1) + "-delay"); // if this is set then it has the inline delay spesified in HTML
                }

                if (typeof $this.data(params.class_Name.substring(1) + "-offset") !== 'undefined') {
                    d_offset = $this.data(params.class_Name.substring(1) + "-offset"); // if this is set then it has the inline delay spesified in HTML
                }

                if (typeof $this.data("trigger-hook") !== 'undefined') {
                    c_triggerHook = $this.data("trigger-hook"); // if this is set then it has the inline offset spesified in HTML
                }
                // alert(d_offset);
                var scene = new ScrollMagic.Scene({
                    triggerElement: this,
                    triggerHook: c_triggerHook,
                    offset: d_offset,
                });


                if (typeof $this.data("added-class") !== 'undefined') {
                    classToBeAdded = $this.data("added-class");
                }
                if (params.to_add_class_to) {
                    scene.setClassToggle(this.querySelectorAll(params.to_add_class_to), classToBeAdded);
                } else if (!params.to_add_class_to && classToBeAdded) {
                    scene.setClassToggle(this, classToBeAdded);
                }

                i++;
                tl[i] = new TimelineMax({ paused: true, onComplete: myFunction });
                var tl_set = new TimelineMax({ paused: true, onComplete: myFunction });

                $el.each((function() {
                    var dis = $(this);
                    // pr = dis.data("pr"),
                    // pb = dis.data("pb");

                    // if (pr == null) {
                    //     pr = dis.parent().data("pr");
                    // }

                    // if (pb == null) {
                    //     pb = dis.parent().data("pb");
                    // }

                    dis.css({
                        paddingBottom: dis.data("pb"),
                        paddingRight: dis.data("pr"),
                        paddingLeft: dis.data("pl"),
                        paddingTop: dis.data("pt")
                    });
                }));

                if (params.element_class_remove !== "default") {
                    $elem_cls_rmv = $this.find(params.element_class_remove);
                }

                if (params.onComplete_class_remove) {
                    $elem_cls_rmv.addClass(params.onComplete_class_remove);
                    // alert("addClass = " + params.onComplete_class_remove);
                }

                function myFunction() {
                    if (params.onComplete_class_remove) {
                        // alert("removeClass = " + params.onComplete_class_remove);
                        $elem_cls_rmv.removeClass(params.onComplete_class_remove);
                    }
                }

                if (!$el__set.length) {

                    // Redefine all delays in case it has changed!!
                    initial_delay = user_init_delay;
                    anim_delay_2 = initial_delay;
                    if (cover__draw_from_0) {
                        anim_delay_2 = cover__time + initial_delay;
                    }
                    el__anim_obj[delay] = anim_delay_2;
                    el_content__anim_obj[delay] = anim_delay_2;
                    cover__anim_obj_from_2[delay] = initial_delay + special_eff_t;
                    cover__anim_obj_to_2[delay] = initial_delay + special_eff_t;
                    cover__anim_obj_from_1[delay] = anim_delay_2 + special_eff_t;
                    cover__anim_obj_to_1[delay] = anim_delay_2 + special_eff_t;
                    cover_2__anim_obj_from_2[delay] = initial_delay + cover_2_delay;
                    cover_2__anim_obj_to_2[delay] = initial_delay + cover_2_delay;
                    cover_2__anim_obj_from_1[delay] = anim_delay_2 + cover_2_delay;
                    cover_2__anim_obj_to_1[delay] = anim_delay_2 + cover_2_delay;
                    cover_3__anim_obj_from_2[delay] = initial_delay + cover_3_delay;
                    cover_3__anim_obj_to_2[delay] = initial_delay + cover_3_delay;
                    cover_3__anim_obj_from_1[delay] = anim_delay_2 + cover_3_delay;
                    cover_3__anim_obj_to_1[delay] = anim_delay_2 + cover_3_delay;
                    el__anim_obj_set[delay] = anim_delay_2;
                    el_content__anim_obj_set[delay] = anim_delay_2;
                    cover__anim_obj_set[delay] = initial_delay;

                    tl[i].staggerFrom($el, el__time, el__anim_obj, el__stagger_time)
                        .staggerFrom($el__content, el_content__time, el_content__anim_obj, el_content__stagger_time, 0)
                        .staggerFrom($el__content, 0, { opacity: el__content__opacity_ini, delay: anim_delay_2 }, el_content__stagger_time, 0)
                        .staggerFromTo($el__cover, cover__time, cover__anim_obj_from_1, cover__anim_obj_to_1, cover__stagger_time, 0)
                        .staggerFromTo($el__cover, cover__time, cover__anim_obj_from_2, cover__anim_obj_to_2, cover__stagger_time, 0)

                        .staggerFromTo($el__cover_2, cover__time, cover_2__anim_obj_from_1, cover_2__anim_obj_to_1, cover__stagger_time, 0)
                        .staggerFromTo($el__cover_2, cover__time, cover_2__anim_obj_from_2, cover_2__anim_obj_to_2, cover__stagger_time, 0)

                        .staggerFromTo($el__cover_3, cover__time, cover_3__anim_obj_from_1, cover_3__anim_obj_to_1, cover__stagger_time, 0)
                        .staggerFromTo($el__cover_3, cover__time, cover_3__anim_obj_from_2, cover_3__anim_obj_to_2, cover__stagger_time, 0);

                    if (params.onScroll) {
                        scene.setTween(tl[i].play())
                            // .on("start", function() {
                            // })
                            // .addIndicators()
                            .addTo(scrollMagicController)
                            .reverse(false);
                    }
                    if (!deferred) {
                        tl[i].play();
                    }

                    return tl[i];

                } else {

                    // $el.css({
                    //     // "transform": "translate" + dir_upprcase + "(" + el__pos_ini + ")",
                        
                    //     // "transform": "translate" + dir_upprcase + "(" + "100px" + ") scale(" + "1" + ")",
                    //     "opacity": "1",
                    // });
                    // $el__content.css({
                    //     "transform": "translate" + dir_upprcase + "(" + el__pos_ini + ") scale(" + el_content__scale_ini + ")",
                    //     "opacity": '"' + el__content__opacity + '"',
                    // });


                    $el.css({
                        "transform": "translate" + dir_upprcase + "(" + el__pos_ini + ")",
                        "opacity": el__opacity_ini,
                    });
                    $el__content.css({
                        "transform": "translate" + dir_upprcase + "(" + el_content__pos_ini + ") scale(" + el_content__scale_ini + ")",
                        "opacity": el__content__opacity_ini,
                    });
                    $el__cover.css("transform", "translate" + dir_upprcase + "(" + cover__pos_ini + ")");
                    $el__cover_2.css("transform", "translate" + dir_upprcase + "(" + cover__pos_ini + ")");
                    $el__cover_3.css("transform", "translate" + dir_upprcase + "(" + cover__pos_ini + ")");
                    k++;
                    params["el_set_function_name" + k] = function() {
                        

                        // Redefine all delays in case it has changed!!
                        initial_delay = user_init_delay;
                        anim_delay_2 = initial_delay;
                        if (cover__draw_from_0) {
                            anim_delay_2 = cover__time + initial_delay;
                        }
                        el__anim_obj[delay] = anim_delay_2;
                        el_content__anim_obj[delay] = anim_delay_2;
                        cover__anim_obj_from_2[delay] = initial_delay + special_eff_t;
                        cover__anim_obj_to_2[delay] = initial_delay + special_eff_t;
                        cover__anim_obj_from_1[delay] = anim_delay_2 + special_eff_t;
                        cover__anim_obj_to_1[delay] = anim_delay_2 + special_eff_t;
                        cover_2__anim_obj_from_2[delay] = initial_delay + cover_2_delay;
                        cover_2__anim_obj_to_2[delay] = initial_delay + cover_2_delay;
                        cover_2__anim_obj_from_1[delay] = anim_delay_2 + cover_2_delay;
                        cover_2__anim_obj_to_1[delay] = anim_delay_2 + cover_2_delay;
                        cover_3__anim_obj_from_2[delay] = initial_delay + cover_3_delay;
                        cover_3__anim_obj_to_2[delay] = initial_delay + cover_3_delay;
                        cover_3__anim_obj_from_1[delay] = anim_delay_2 + cover_3_delay;
                        cover_3__anim_obj_to_1[delay] = anim_delay_2 + cover_3_delay;
                        el__anim_obj_set[delay] = anim_delay_2;
                        el_content__anim_obj_set[delay] = anim_delay_2;
                        cover__anim_obj_set[delay] = initial_delay;

                        // alert(k);

                        $el__set.each((function(index) {
                            // defining the local variables -- in this case
                            var $this = $(this),
                                $el = $this.find(params.class_Name + "__el"),
                                $el__content = $this.find(params.class_Name + "__el-content"),
                                $el__cover = $this.find(params.class_Name + "__el-cover"),
                                $el__cover_2 = $this.find(params.class_Name + "__el-cover-2"),
                                $el__cover_3 = $this.find(params.class_Name + "__el-cover-3"),
                                elements_no = $el__content.length,
                                el_content__time_total = ((elements_no - 1) * el_content__stagger_time) + (el_content__time),
                                cover__stagger_time = (Math.round((el_content__time_total - cover__time) / (elements_no - 1) * 100) / 100);

                            tl_set.staggerTo($el, el__time, el__anim_obj_set, el__stagger_time, t)
                                .staggerTo($el__content, el_content__time, el_content__anim_obj_set, el_content__stagger_time, t)
                                .staggerTo($el__content, 0, { opacity: 1, delay: anim_delay_2 }, el_content__stagger_time, t)
                                .staggerTo($el__cover, cover__time, cover__anim_obj_to_1, cover__stagger_time, t)
                                .staggerTo($el__cover, cover__time, cover__anim_obj_to_2, cover__stagger_time, t)
                                .staggerTo($el__cover_2, cover__time, cover_2__anim_obj_to_1, cover__stagger_time, t)
                                .staggerTo($el__cover_2, cover__time, cover_2__anim_obj_to_2, cover__stagger_time, t)
                                .staggerTo($el__cover_3, cover__time, cover_3__anim_obj_to_1, cover__stagger_time, t)
                                .staggerTo($el__cover_3, cover__time, cover_3__anim_obj_to_2, cover__stagger_time, t);
                            t += each_group_delay;

                            tl_set.play();
                        }));
                    };



                    if (params.onScroll) {
                        scene.on("start", (function() {
                                // alert(m);
                                params["el_set_function_name" + m]();
                                m++;
                            })).on("leave", (function(event) {
                                // $el__cover_global.remove();
                            }))
                            // .addIndicators()
                            .addTo(scrollMagicController)
                            .reverse(false);
                    } else if (!deferred) {

                        params["el_set_function_name" + k]();

                    }

                    return params["el_set_function_name" + k];
                }
            }));


            // when onScroll is false we need to run the function twice
            // 01: to prepere the elements and animation: blur_text_animation();
            // 02: to run the animations: blur_text_animation.playAnim
            // WON'T WORK ID "..__el-set" IS AT USE.

            function run_anim() {

                if (deferred) {

                    var x;
                    clearTimeout(x);

                    x = setTimeout((function() {
                        for (var j = 0; j < i + 1; ++j) {
                            tl[j].play();
                        }
                        for (var l = 0; l < k + 1; ++l) {
                            params["el_set_function_name" + l]();
                        }

                    }), 100);
                }
            }


            cover_animation[params.deferred_function_name] = run_anim;
        };
        // -----------------------



        // *** 6.11) SVG icons draw animation
        // ---------------------------------------------------------
        var svg_draw_animation = function(params) {

            var default_opts = {
                class_Name: ".svg-draw",
                onScroll: true,
                deferred: false,
                deferred_function_name: "playAnim", // This should be unique foe each function run
                offset: 0,
                draw_time: 2,
                draw_stagger_time: 0.2,
                fill_time: 0.8,
                fill_overlap_time: "-=0.5",
                initial_delay: 0,
                each_group_delay: 0,
                easing: Power2.easeIn,
            };

            params = $.extend({}, default_opts, params);
            // SVG draw animation 
            var $parent = $(params.class_Name),
                Easing = params.easing,
                each_Group_Delay = params.each_group_delay,
                fill_Time = params.fill_time,
                fill_Overlap_Time = params.fill_overlap_time,

                innerFunc = function() {},
                t = 0;

            $parent.each((function() {
                var $this = $(this),
                    tl = new TimelineMax(),
                    $el = $this.find(params.class_Name + "__el"),
                    $el_path = $el.find("path, polyline, line, polygon, rect, circle, ellipse"),
                    color = $el_path.css("fill"),
                    draw_Time = params.draw_time,
                    draw_Stagger_Time = params.draw_stagger_time,
                    initial_Delay = params.initial_delay,
                    offset = params.offset;

                if (!$this.hasClass(params.class_Name.substring(1) + "--filled")) {
                    color = "transparent";
                }

                if ($this.hasClass(params.class_Name.substring(1) + "--fast")) {
                    draw_Time = params.draw_time / 2.5;
                    draw_Stagger_Time = params.draw_stagger_time / 8;
                }

                if (typeof $this.data(params.class_Name.substring(1) + "-delay") !== 'undefined') {
                    initial_Delay = $this.data(params.class_Name.substring(1) + "-delay"); // if this set has inline delay spesified in HTML
                }

                if (typeof $this.data(params.class_Name.substring(1) + "-offset") !== 'undefined') {
                    offset = $this.data(params.class_Name.substring(1) + "-offset"); // if this set has inline delay spesified in HTML
                }

                TweenMax.set($el_path, { drawSVG: 0, "fill-opacity": "0" });

                innerFunc = function() {
                    $el.each((function() {
                        var $self = $(this),
                            $el_paths = $self.find("path, polyline, line, polygon, rect, circle, ellipse");

                        // stagger between each path of an icon
                        tl.staggerTo($el_paths, draw_Time, {
                                drawSVG: "100%",
                                ease: Easing,
                                delay: initial_Delay
                            }, draw_Stagger_Time, t)
                            .to($el_paths, fill_Time, { "fill-opacity": "1" }, fill_Overlap_Time);

                        t += each_Group_Delay;
                    }));
                };

                if (params.onScroll) {

                    var scene = new ScrollMagic.Scene({
                            triggerElement: this,
                            // triggerHook: "onEnter",
                            offset: offset,
                        })
                        .on("start", (function() {
                            // (function() {
                            $el.each((function() {
                                var $self = $(this),
                                    $el_paths = $self.find("path, polyline, line, polygon, rect, circle, ellipse");

                                // stagger between each path of an icon
                                tl.staggerTo($el_paths, draw_Time, {
                                        drawSVG: "100%",
                                        ease: Easing,
                                        delay: initial_Delay
                                    }, draw_Stagger_Time, t)
                                    .to($el_paths, fill_Time, { "fill-opacity": "1" }, fill_Overlap_Time);

                                t += each_Group_Delay;

                                // alert('params.onScroll  = ' + $el_paths + "   /   params.class_Name  = " + $self);
                            }));
                            // }());
                        }))
                        // .addIndicators()
                        .addTo(scrollMagicController)
                        .reverse(false);
                } else if (!params.deferred) {
                    innerFunc();
                }

                return innerFunc;

            }));

            function run_anim() {

                if (params.deferred) {

                    var x;
                    clearTimeout(x);

                    x = setTimeout((function() {
                        innerFunc();
                    }), 100);
                }
            }


            svg_draw_animation[params.deferred_function_name] = run_anim;
        };
        // -----------------------
     }
    //
    //
    //
    // =========  End of ScrollMagic related functions  =========






    // ===========================================================
    // =                  7) Slider functions                    =
    // ===========================================================
    //
    //
    // 

    // *** 7.1) Quotes slider - using owlCarousel plugin
    // -----------------------------------------------------------
    var owl_quotes = function() {
        // $(".owl-carousel").slick(testimonial_slider_data);
        $(".slider-quotes").owlCarousel({
            items: 1,
            // loop: true,
            margin: 10,
            nav: true,

            dots: true,
            smartSpeed: 500,
            fluidSpeed: 500,
            navSpeed: 500,
            autoHeight: true,
            // rewind: true,
            // autoplay: true,
            navText: [
                '<button type="button" class="arrow--prev">Previous<span></span><span></span><span></span></button>',
                '<button type="button" class="arrow--next">Next<span></span><span></span><span></span></button>',
            ],
            onInitialized: owl_custom_dots,
            // responsive: {
            //     0: {
            //         items: 1
            //     },
            //     600: {
            //         items: 3
            //     },
            //     1000: {
            //         items: 5
            //     }
            // }
        });
    };
    // -----------------------




    // *** 7.2) Process slider function
    // -----------------------------------------------------------
    var init_process_slider = function() {
        var $owlCarouselProcess = $("#process");
        $owlCarouselProcess.owlCarousel({
            items: 1,
            smartSpeed: 500,
            // nav: false,
            margin: 10,
            startPosition: 1,
            mouseDrag: true,
            // autoplayTimeout: 4000,
            // autoplayHoverPause: true,



            dots: true,
            // smartSpeed: 500,
            fluidSpeed: 500,
            navSpeed: 500,
            autoHeight: true,
            // rewind: true,
            // autoplay: true,
            // navText: [
            //     '<button type="button" class="arrow--prev">Previous<span></span><span></span><span></span></button>',
            //     '<button type="button" class="arrow--next">Next<span></span><span></span><span></span></button>',
            // ],
            onInitialized: owl_custom_dots,
            onTranslate: slide_change,
            onResized: slide_resize,
            // responsive: {
            //     0: {
            //         items: 1
            //     },
            //     600: {
            //         items: 3
            //     },
            //     1000: {
            //         items: 5
            //     }
            // }


        });
        var $owlCarouselDots = $owlCarouselProcess.find(".owl-dots"),
            $processLabels = $(".process__labels"),
            $processLabel = $processLabels.find("li"),
            $owlCarouselDot = $owlCarouselDots.find(".owl-dot"),
            $owlCarouselDotActive = $owlCarouselDots.find(".owl-dot.active"),
            $process_line = $(".process__line div"),
            btnLtxt1,
            btnLtxt2,

            i = 0,
            j = -1;

        $owlCarouselDots.wrap('<div class="container"></div>').wrap('<div></div>');
        // -- element.css('width') gives it back in pixels like "456px" and this: replace(/[^-\d\.]/g, '')
        // removes everything but the numbers
        // -- 30 here is the left and right padding of the .contaier element
        var width = $processLabels.width();
        $processLabel.each((function() {

            var $el = $(this);
            $el.data("posLeft", $el.css('left').replace(/[^-\d\.]/g, '') / width * 100 + "%");
            $owlCarouselDot.eq(i).css({ left: $el.data("posLeft") }).data("posLeft", $el.data("posLeft"));

            if (i === ($processLabel.length - 1)) {
                $el.data("posLeft", 100 - $el.css('right').replace(/[^-\d\.]/g, '') / width * 100 + "%");
                $owlCarouselDot.eq(i).css({ left: $el.data("posLeft") }).data("posLeft", $el.data("posLeft"));
            }

            i++;
        }));
        // var looper = 1; $owlCarouselDot.each(function() {
        //     $(this).attr('data-que', looper);
        //     looper += 1;
        // });
        // // positioning the dots
        // var perci = 100 / (looper - 2),
        //     widthLooper = 0; $owlCarouselDot.each(function() {
        //     $(this).css({
        //         left: widthLooper * perci + "%"
        //     });
        //     widthLooper += 1;
        // });
        // // positioning the labels
        // var labelLooper = 0; $processLabel.each(function() {
        //     var $this = $(this),
        //         $width = $this.find("span").width();
        //     $this.css({
        //         left: labelLooper * perci + "%",
        //         "margin-left": (-$width / 2)
        //     });
        //     labelLooper += 1;
        // });
        // applying the process line width
        $owlCarouselDot.on("owlDotClassChange", (function() {
            // making the previous dots stay filled
            // $owlCarouselDot.each(function() {
            //     var $this = $(this);
            //     if ($this.attr('data-que') < $owlCarouselDotActive.attr('data-que')) {
            //         $this.children("span").addClass("process-active-dot");
            //     } else {
            //         $this.children("span").removeClass("process-active-dot");
            //     }
            // });
            // $processLabel.each(function() {
            //     var $this = $(this);
            //     if ($this.attr('data-que') == $owlCarouselDotActive.attr('data-que')) {
            //         $this.addClass("process-label-active");
            //     } else {
            //         $this.removeClass("process-label-active");
            //     }
            // });
        }));







        // $processLabel.each(function() {
        //     // j++;
        //     var self = $(this);
        //     btnLtxt1 = self.find(".letters:nth-child(1)");
        //     btnLtxt2 = self.find(".letters:nth-child(2)");
        //     var btnLtxtSplit1 = new Lettering(btnLtxt1, { type: "letters" }),
        //         btnLtxtSplit2 = new Lettering(btnLtxt2, { type: "letters" }),
        //         btnLtxtChars1 = btnLtxtSplit1.letters,
        //         btnLtxtChars2 = btnLtxtSplit2.letters,
        //         btnAnim1 = new TimelineMax({ paused: true }),
        //         btnAnim2 = new TimelineMax({ paused: true });

        //     btnAnim1.staggerFromTo(btnLtxtChars1, 0.4, { opacity: 0, x: 10, rotationY: 90, ease: Power2.easeOut }, { opacity: 1, x: 0, rotationY: 0, ease: Power2.easeOut }, 0.02);

        //     btnAnim2.staggerFromTo(btnLtxtChars2, 0.4, { opacity: 1, x: 0, rotationY: 0, ease: Power2.easeOut }, { opacity: 0, x: -10, rotationY: -90, ease: Power2.easeOut }, 0.02);

        //     TweenMax.set(btnLtxtChars1, { transformPerspective: 30 });

        //     TweenMax.set(btnLtxtChars2, { transformPerspective: 30 });


        //     self.on('cls_ad', function() {
        //         btnAnim1.play();
        //         btnAnim2.play();
        //     });
        //     self.on('cls_rmv', function() {
        //         btnAnim1.reverse();
        //         btnAnim2.reverse();
        //     });

        //     if (self.hasClass('process__label--active')) {
        //         btnAnim1.play();
        //         btnAnim2.play();
        //     }
        // });





        function slide_change(event) {
            $owlCarouselDotActive = $owlCarouselDots.find(".owl-dot.active");
            var left = $owlCarouselDotActive.data("posLeft"),
                eq = $owlCarouselDotActive.index();
            TweenMax.to($process_line, 0.8, { x: left, ease: Power2.easeOut });
            $processLabels.find(".has-active").removeClass("has-active");
            $processLabel.eq(eq).addClass("has-active");

            $owlCarouselDot.each((function() {
                var el = $(this);
                if (el.index() < $owlCarouselDotActive.index()) {
                    el.addClass("passed");
                } else {
                    el.removeClass("passed");
                }
            }));
        }

        slide_change();
        
        function slide_resize(event) {
            // el.each(function() {
            //     var $el = $(this);
            //     $el.data("posLeft", $el.position().left);
            // });
        }
        // var $carousel = $(".carousel"),
        //     $carouselPrev = $carousel.find(".owl-prev"),
        //     $carouselNext = $carousel.find(".owl-next");
        // // applying arrows styles
        // $carouselPrev.addClass("left carousel-control").empty()
        // .append("<i class='arrow-left'></i>"); $carouselNext
        // .addClass("right carousel-control").empty().append("<i class='arrow-right'></i>");
    };




    // *** 7.3) Quotes slider - using Master Slider plugin
    // -----------------------------------------------------------
    var ms_quotes = function() {
        var $sq = $('.slider-quotes');
        if ($sq.length) {
            $sq.masterslider({
                width: 1200, // slider standard width
                height: 100, // slider standard height
                space: 0,
                fullwidth: true,
                autoHeight: true,
                view: "basic",
                // more options...
                controls: {
                    arrows: { autohide: false },
                    bullets: { autohide: false, dir: "h", align: "bottom" },
                    // scrollbar: {dir:"h"}
                    // more slider controls...
                }
            });
        }

        var $sgl = $('.slider-gallery--partial-view');
        if ($sgl.length) {
            $sgl.masterslider({
                width:750,
                height:430,
                layout:'partialview',
                space:5,
                view:'basic',
                loop:true,
                filters: {
                    grayscale:1,
                    contrast:1.5
                },
                // more options...
                controls: {
                    arrows: { autohide: false },
                    bullets: { autohide: false, dir: "h", align: "bottom" },
                    // scrollbar: {dir:"h"}
                    // more slider controls...
                }
            });
        }
        var $cvg = $('.ms-partialview-features');
        if ($cvg.length) {
            $cvg.masterslider({
                width:460,
                height:670,
                space:-520,
                mouse: false,
                swipe: false,
                autoplay: true,
                loop:true,
                view:'flow',
                layout:'partialview',
                overPause: false,
                speed: 15
            });
        }
        var $cvg = $('.ms-partialview-features--2');
        if ($cvg.length) {
            $cvg.masterslider({
                width:460,
                height:670,
                space:-200,
                mouse: false,
                swipe: false,
                autoplay: true,
                loop:true,
                view:'flow',
                layout:'partialview',
                overPause: false,
                speed: 15
            });
        }

        var $shm = $(".slider-hero-mask");
        if ($shm.length) {
            var ms_dark_theme = $shm.parents(".color--dark").length,
            ms_color = "#fff";
            if (ms_dark_theme) {
                ms_color = "#000";
            }

            $shm.masterslider({
                width: 1024,
                height: 768,
                space: 0,
                view: 'parallaxMask',
                layout: 'autofill',

                instantStartLayers: true,
                fullscreenMargin: 0,
                speed: 17,
                autoplay: true,
                loop: true,
                overPause: false,

                // width           : 1366,
                // height          : 768,
                // minHeight       : 0,
                // space           : 0,
                // start           : 1,
                // grabCursor      : true,
                // swipe           : true,
                // mouse           : true,
                // keyboard        : false,
                // layout          : "fullscreen",
                // wheel           : false,
                // autoplay        : false,
                // instantStartLayers:true,
                // loop            : true,
                // shuffle         : false,
                // preload         : 0,
                // heightLimit     : true,
                // autoHeight      : false,
                // smoothHeight    : true,
                // endPause        : false,
                // overPause       : true,
                // fillMode        : "fill",
                // centerControls  : true,
                // startOnAppear   : false,
                // layersMode      : "center",
                // autofillTarget  : "",
                // hideLayers      : true,
                // fullscreenMargin: 80,
                // speed           : 10,
                // dir             : "h",
                // parallaxMode    : 'swipe',
                // view            : "parallaxMask",

                controls: {
                    arrows: { autohide: false, insertTo: '.slider-hero-mask' },
                    bullets: { autohide: false, dir: "h", align: "bottom" },
                    // timebar: {},
                    circletimer: { color: ms_color, stroke: 8, radius: 4 },
                    // scrollbar: {dir:"h"}
                    // more slider contr,ols...
                }
            });
        }

        var $shm = $(".slider-mask");
        if ($shm.length) {
            var ms_dark_theme = $shm.parents(".text--dark").length,
            ms_color = "#fff";
            if (ms_dark_theme) {
                ms_color = "#000";
            }

            $shm.masterslider({
                width:1080,
                height:683.1,
                space:0,
                view:'parallaxMask',
                // layout: 'autofill',

                // instantStartLayers: true,
                speed: 17,
                autoplay: true,
                loop: true,
                overPause: false,

                // forceInit           : true,       // Force calling init even an error occurs in jQuery's dom ready method.
                // autoplay            : false,      // Enables the autoplay slideshow.
                // loop                : false,      // Enables the continuous sliding mode.
                // mouse               : true,       // Whether the user can use mouse drag navigation.
                // swipe               : true,       // Whether the drag/swipe navigation is enabled.
                // grabCursor          : true,       // Whether the slider uses grab mouse cursor.
                // space               : 0,          // The spacing value between slides in pixels.
                // fillMode            : 'fill',     // Specifies the slide background scaling method. Its acceptable values are "fill", "fit", "stretch", "center" and "tile".
                // start               : 1,          // The slider starting slide number.
                // view                : 'basic',    // The slide changing transition.
                // width               : 300,        // The base width of slides. It helps the slider to resize in correct ratio.
                // height              : 150,        // The base height of slides, It helps the slider to resize in correct ratio.
                // inView              : 15,         // Specifies number of slides which will be added at a same time in DOM.
                // critMargin          : 1,          //
                // mobileBGVideo       : false,      // Whether show background videos in mobile devices.
                // heightLimit         : true,       // It force the slide to use max height value as its base specified height value.
                // smoothHeight        : true,       // Whether the slider uses smooth animation while its height changes.
                // autoHeight          : false,      // Whether the slider adapts its height to each slide height or not. It overrides heightLimit option.
                // minHeight           : -1,         // @since 2.13.0, Specifies min height value for the slider, it prevents slider to shows too narrow in small screens.
                // fullwidth           : false,      // It enables the slider to adapt width to its parent element. It's very useful for creating full-width sliders. In default it takes max width as its base width value.
                // fullheight          : false,      // It enables the slider to adapt height to its parent element.
                // autofill            : false,      // It enables the slider to adapt width and height to its parent element, It's very useful for creating fullscreen or fullwindow slider.
                // layersMode          : 'center',   // It accepts two values "center" and "full". The "center" value indicates that the slider aligns layers to the center. This option is only effective in full width mode.
                // hideLayers          : false,      // Whether the slider hides all layers before changing slide.
                // endPause            : false,      // Whether the slider pauses slideshow when it stays at the last slide.
                // centerControls      : true,       // Whether the slider aligns UI controls to center. This option is only effective in full width mode.
                // overPause           : true,       // Whether the slider pauses slideshow on hover.
                // shuffle             : false,      // Enables the shuffle slide order.
                // speed               : 17,         // Specifies slide changing speed. It accepts float values between 0 and 100.
                // dir                 : 'h',        // Specifies slide changing direction. It accepts two values "h" (horizontal) and "v" (vertical).
                // preload             : 0,          // Specifies number of slides which will be loaded by slider. 0 value means the slider loads slides in sequence.
                // wheel               : false,      // Whether slider uses mouse wheel for navigation.
                // layout              : 'boxed',    // It accepts 'fullwidth', 'fullscreen', 'fillwidth', 'autofill', 'partialview', 'boxed'. It overrides 'fullwidth' and 'autofill' (added in v1.5.6)
                // autofillTarget      : null,       // @since 2.13.0, Specifies the parent element of slider width jQuery selector, it used for sizing slider with autofill layout. Default value is the first parent element of slider.
                // fullscreenMargin    : 0,          // Specifies margin amount to the bottom of slider, it's only effective on fullscreen slider.
                // instantStartLayers  : false,      // @since 1.5.0, Whether instantly shows slide layers.
                // parallaxMode        : 'mouse',    // @since 1.6.0, Specifies mode of parallax effect accepts: "mouse", "mouse:x-only", "mouse:y-only" and "swipe"
                // rtl                 : false,      // @since 1.8.0, Whether Right-to-left direction slider.
                // deepLink            : null,       // @since 2.1.0, null value disables slider deep-linking any string values identifies the slider in page's url like /#msslider-1
                // deepLinkType        : 'path',     // @since 2.1.0, type of hash value in page's url possible values, path and query (  #gallery/1 || #gallery=4 )
                // disablePlugins      : []          // @since 2.9.6, list of disabled Master Slider plugin names for this instance.

                controls: {
                    arrows: { autohide: false, insertTo: '.slider-mask' },
                    bullets: { autohide: false, dir: "h", align: "bottom" },
                    // timebar: {},
                    // circletimer: { color: ms_color, stroke: 8, radius: 4 },
                    scrollbar: {dir:"h"}
                    // more slider contr,ols...
                }
            });
        }


        // var slider = new MasterSlider();
        // slider.control('arrows' ,{insertTo:'#masterslider'});  
        // slider.control('bullets'); 

        // $('.text-slider').masterslider({
        //     width: 800, // slider standard width
        //     height: 100, // slider standard height
        //     space: 0,
        //     fullwidth: true,
        //     autoHeight: true,
        //     view: "basic",
        //     // more options...
        //     controls: {
        //         arrows: { autohide: false },
        //         bullets: { autohide: false, dir: "h", align: "bottom" },
        //         // scrollbar: {dir:"h"}
        //         // more slider controls...
        //     }
        // });

        // var $mts = new MasterSlider();
        // $mts.setup('text-slider', {
        //     width: 1024,
        //     height: 580,
        //     //space:100,
        //     fullwidth: true,
        //     centerControls: false,
        //     speed: 18,
        //     view: 'basic'
        // });
        //slider.control('arrows');
        // $mts.control('bullets', { autohide: false });

        // $('.slider-quotes').masterslider({
        //     width: 800, // slider standard width
        //     height: 100, // slider standard height
        //     space: 0,
        //     fullwidth: true,
        //     autoHeight: true,
        //     view: "basic",
        //     // more options...
        //     controls: {
        //         arrows: { autohide: false },
        //         bullets: { autohide: false, dir: "h", align: "bottom" },
        //         // scrollbar: {dir:"h"}
        //         // more slider controls...
        //     }
        // });
    };
    // -----------------------




    // *** 7.4) Logos slider - using owlCarousel plugin
    // -----------------------------------------------------------
    var owl_logos = function() {
        var $sl1 = $(".slider-logos-1");
        if ($sl1.length) {
            $sl1.owlCarousel({
                items: 5,
                pullDrag: false,
                mouseDrag: false,
                touchDrag: false,
                // loop: true,
                margin: 10,
                nav: false,
                dots: false,
                smartSpeed: 1000,
                rewind: true,
                autoplay: true,
                responsive: {
                    0: {
                        items: 2
                    },
                    768: {
                        items: 3
                    },
                    992: {
                        items: 4
                    }
                }
            });
        }

        var $sl2 = $(".slider-logos-2");
        if ($sl2.length) {
            $sl2.owlCarousel({
                items: 5,
                pullDrag: false,
                mouseDrag: false,
                touchDrag: false,
                rtl: true,
                margin: 10,
                nav: false,
                dots: false,
                smartSpeed: 1000,
                rewind: true,
                autoplay: true,
                responsive: {
                    0: {
                        items: 2
                    },
                    600: {
                        items: 3
                    },
                    1000: {
                        items: 4
                    }
                }
            });
        }
    };
    // -----------------------




    // *** 7.5) required elements for owlCarousel dots styles
    // have been added here
    // but owlCarousel custom arrows should be set
    // in the main owl carusel functions options each
    // time it is defined - This function will be
    // called in the main owl carusel functions
    // everytime - no need to call it gobally
    // -----------------------------------------------------------
    var owl_custom_dots = function(event) {
        var $owlCar = $(".owl-carousel");
        if ($owlCar.hasClass('dots--filling-circle')) {
            $owlCar.find(".owl-dot").append('<button type="button" data-role="none" role="button"></button><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" preserveAspectRatio="none"><circle cx="500" cy="500" r="400"></circle></svg>');
        } else {
            $owlCar.find(".owl-dot").append('<button type="button" data-role="none" role="button"></button>');
        }
    };
    // -----------------------




    // *** 7.6) Required elements fo Master Slider
    // are being added here - must be called globally
    // -----------------------------------------------------------
    var ms_custom_controls = function() {

        var $master = $('.master-slider');
        $master.on(MSSliderEvent.INIT, (function(e) {
            $master.find(".ms-nav-next").append('<span></span><span></span><span></span>');
            $master.find(".ms-nav-prev").append('<span></span><span></span><span></span>');
            if ($master.hasClass('dots--filling-circle')) {
                $master.find(".ms-bullet").append('<button type="button" data-role="none" role="button"></button><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 1000 1000" preserveAspectRatio="none"><circle cx="500" cy="500" r="400"></circle></svg>');
            } else if ($master.hasClass('dots--filling-line')) {
                $master.find(".ms-bullet").append('<button type="button" data-role="none" role="button"></button>');
            }
        }));
    };

    //
    //
    //
    // ==============    End of Slider functions    ==============







    // =========================================================
    // =                  8) Form functions                    =
    // =========================================================
    //
    //
    // 

    // mailchimp-ajax-signup

    // An example mailchimp signup form, without redirects.

    // To use the example:

    // Replace the form action url in HTML file with your own from the MailChimp supplied embed code
    // Within the action url, replace "subscribe/post" with "subscribe/post-json"
    // Be sure the action url starts with http://. If it doesn't, the form will hang when testing the html as a local file in your browser.
    // Open the html file in a browser on your local machine


    // *** 8.1) Submit form - Main function
    // ---------------------------------------------------------
    var submit_form = function(params) {
        var default_opts = {
            form__el: ".contact-form",
            result__el: ".submit",
            loader__el: ".btn--ajax__svg-icon",
            result_width: 600,
            btn_width: 170,
            loader_width: 50,
            mailchimp: true,
            mailchimp_msg__error: "Sorry. Unable to subscribe. Please try again later.",
            mailchimp_msg__double: "You're already subscribed. Thank you.",
            mailchimp_msg__success: "Thank you! You must confirm the subscription in your inbox.",

        };

        params = $.extend({}, default_opts, params);

        var form = $(params.form__el);
        if (form.length) {
            // Hijack the submission. We'll submit the form manually.
            form.submit(function(e) {
                e.preventDefault();

                var $this = $(this),
                    result = $this.find(params.result__el),
                    loader = $this.find(params.loader__el);
                // if (!isValidEmail(form)) {
                //     var error = "A valid email address must be provided.";
                //     result.html(error);
                //     result.css("color", "red");
                // } else {
                result.css("color", "black");
                // result.html("Subscribing...");
                result.addClass("loading").width(params.loader_width).prop("disabled", true);
                loader.addClass("loading");

                if (params.mailchimp) {
                    submit_form_mailchimp({
                        formElement: form,
                        resultElement: result,
                        loaderElement: loader,
                        resultWidth: params.result_width,
                        btnWidth: params.btn_width,
                        MsgError: params.mailchimp_msg__error,
                        MsgDouble: params.mailchimp_msg__double,
                        MsgSuccess: params.mailchimp_msg__success
                    });
                } else {
                    submit_form_custom({
                        formElement: form,
                        resultElement: result,
                        loaderElement: loader,
                        resultWidth: params.result_width,
                        btnWidth: params.btn_width,
                    });
                }
            });
        }
    };
    // -----------------------




    // *** 8.2) Submit form - Mailchimp
    // Submit the form with an ajax/jsonp request.
    // Based on http://stackoverflow.com/a/15120409/215821
    // ---------------------------------------------------------
    var submit_form_mailchimp = function(params) {
        var form = params.formElement,
            result = params.resultElement,
            loader = params.loaderElement;

        if (form.length) {
            $.ajax({
                type: "GET",
                url: form.attr("action"),
                data: form.serialize(),
                cache: false,
                dataType: "jsonp",
                jsonp: "c", // trigger MailChimp to return a JSONP response
                contentType: "application/json; charset=utf-8",
                error: function(error) {
                    // According to jquery docs, this is never called for cross-domain JSONP requests
                },
                success: function(data) {
                    var x,
                        y,
                        z;

                    if (data.result != "success") {
                        var message = data.msg || params.MsgError;
                        if (data.msg && data.msg.indexOf("already subscribed") >= 0) {
                            message = params.MsgDouble;
                        }

                        result.find('.btn--ajax__text--loaded').css("color", "red").html(message);

                        clearTimeout(x);
                        x = setTimeout((function() {
                            result.removeClass("loading").addClass('btn--ajax__message--just-apeared').width(params.resultWidth);
                            loader.removeClass("loading");
                        }), 1400);

                        clearTimeout(y);
                        y = setTimeout((function() {
                            result.removeClass('btn--ajax__message--just-apeared').width(params.btnWidth).prop("disabled", false);
                        }), 7000);

                        clearTimeout(z);
                        z = setTimeout((function() {
                            form.trigger("reset");
                            form.find('.input--filled').removeClass("input--filled");
                        }), 8000);
                    } else {
                        result.find('.btn--ajax__text--loaded').css("color", "").html(params.MsgSuccess);

                        clearTimeout(x);
                        x = setTimeout((function() {
                            result.removeClass("loading").addClass('btn--ajax__message--just-apeared').width(params.resultWidth);
                            loader.removeClass("loading");
                        }), 1400);

                        clearTimeout(y);
                        y = setTimeout((function() {
                            result.removeClass('btn--ajax__message--just-apeared').width(params.btnWidth).prop("disabled", false);
                        }), 7000);

                        clearTimeout(z);
                        z = setTimeout((function() {
                            form.trigger("reset");
                            form.find('.input--filled').removeClass("input--filled");
                        }), 8000);

                    }
                }
            });
        }
    };
    // -----------------------




    // *** 8.3) Submit form - Custom
    // ---------------------------------------------------------
    var submit_form_custom = function(params) {
        var form = params.formElement,
            result = params.resultElement,
            loader = params.loaderElement,
            x,
            y,
            z;

        if (form.length) {
            $.ajax({
                    type: 'POST',
                    url: form.attr("action"),
                    data: form.serialize(),
                })
                .done((function(response) {
                    result.find('.btn--ajax__text--loaded').css("color", "").html(response);

                    clearTimeout(x);
                    x = setTimeout((function() {
                        result.removeClass("loading").addClass('btn--ajax__message--just-apeared').width(params.resultWidth);
                        loader.removeClass("loading");
                    }), 1400);

                    clearTimeout(y);
                    y = setTimeout((function() {
                        result.removeClass('btn--ajax__message--just-apeared').width(params.btnWidth).prop("disabled", false);
                    }), 7000);

                    clearTimeout(z);
                    z = setTimeout((function() {
                        form.trigger("reset");
                        form.find('.input--filled').removeClass("input--filled");
                    }), 8000);
                }))
                .fail((function(data) {
                    result.find('.btn--ajax__text--loaded').css("color", "red");

                    if (data.responseText !== '') {
                        result.find('.btn--ajax__text--loaded').html(data.responseText);
                    } else {
                        result.find('.btn--ajax__text--loaded').html('Oops! An error occured and your message could not be sent.');
                    }

                    clearTimeout(x);
                    x = setTimeout((function() {
                        result.removeClass("loading").addClass('btn--ajax__message--just-apeared').width(params.resultWidth);
                        loader.removeClass("loading");
                    }), 1400);

                    clearTimeout(y);
                    y = setTimeout((function() {
                        result.removeClass('btn--ajax__message--just-apeared').width(params.btnWidth).prop("disabled", false);
                    }), 7000);

                    clearTimeout(z);
                    z = setTimeout((function() {
                        form.trigger("reset");
                        form.find('.input--filled').removeClass("input--filled");
                    }), 8000);
                }));
        }
    };
    // -----------------------




    // *** 8.4) Form - Stay active on focus
    // ---------------------------------------------------------
    var active_form_focus = function(params) {
        var container = params.containerElemnt,
            el = params.formElement;
        if (container.length) {
            container.find(el).each(function() {
                var $this = $(this);
                if ($this.val().length) {
                    $this.parent().addClass("input--filled");
                }
                $this.on("focus", (function() {
                    $this.parent().addClass("input--filled");
                }));
                $this.on("blur", (function() {
                    if (!$this.val().length) {
                        $this.parent().removeClass("input--filled");
                    }
                }));
            });
        }

        var $mcesf = $("#mc-embedded-subscribe-form");
        if ($mcesf.length) {
            $mcesf.each(function() {
                var $this = $(this),
                    $input = $this.find('.fieldset--email'),
                    $submit_btn = $this.find('#mc-embedded-subscribe');

                $submit_btn.on('mousedown', (function() {
                    var t;
                    clearTimeout(t);
                    t = setTimeout((function() {
                        $input.removeClass('input--filled');
                    }), 1000);
                }));
            });
        }
    };

    //
    //
    //
    // ==============    End of form functions    ==============







    // =========================================================
    // =                  9) Loading Animations                  =
    // =========================================================
    //
    //
    // 
    

    // *** 9.1)
    // ---------------------------------------------------------
    if (animations__on_page_load) {

        var loading_anim = function() {
        
            if (!__mar) {
                blur_text_animation({
                    parent: ".blurred-words-intro",
                    element: ".blurred-words-intro__el",
                    l_type: "letters",
                    time: 1,
                    onScroll: false,
                    // if it is deferred it means that the timeline and initial styles of elements
                    // will be set and they wait to be animated by blur_text_animation.playAnim() func;
                    deferred: true,
                    deferred_function_name: "playAnim_blur_intro",
                    random: true,
                    percent: 100, // the percent of the letters that you want to be animated
                    initial_delay: 0,
                    stagger_delay: 0.1,
                    easing: Sine.easeOut,
                });
            }


            cover_animation({
                class_Name: ".slide-up-intro",

                onScroll: false,
                deferred: true,
                deferred_function_name: "slideUpIntro",
                // el__Time: 1,
                el_Content__Time: 2,
                // cover__Time: 1,
                // el__Stagger_Time: 0.5,
                el_Content__Stagger_Time: 0.2,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: true,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                anim_Dir: "y",
                el__Pos_Ini: "0%",
                // el__Easing: Power2.easeOut,

                el_Content__Pos_Ini: "100%",
                // el_Content__Easing: Power2.easeOut,

                cover__Easing: Power4.easeOut,
            });

            fade_move({
                parent: ".fade-up-intro",
                element: ".fade-up-intro__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "fadeUpIntro",
                x: 0,
                y: 20,
                opacity: 0,
                rotateX: 0,
                rotateY: 0,
                time: 1,
                initial_delay: 0,
                stagger_delay: 0.2,
                // each_set_delay: 0.3,
                // perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            fade_move({
                parent: ".fade-right-intro",
                element: ".fade-right-intro__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "fadeRightIntro",
                x: -100,
                y: 0,
                opacity: 0,
                rotateX: 0,
                rotateY: 0,
                time: 1,
                initial_delay: 0,
                stagger_delay: 0.2,
                // each_set_delay: 0.3,
                // perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            fade_move({
                parent: ".fade-down-intro",
                element: ".fade-down-intro__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "fadeDownIntro",
                x: 0,
                y: -70,
                opacity: 0,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                time: 1,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            fade_move({
                parent: ".fade-in-intro",
                element: ".fade-in-intro__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "fadeInIntro",
                x: 0,
                y: 0,
                z: 0.01,
                opacity: 0,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
                blur_start: "0px",
                blur_end: "0px",
                time: 3,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 300,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power2.easeOut,
            });
            // center_transition_origin({
            //     item: $page_contents,
            // });

            // TweenMax.set($(".hero__parallax"), {scale: 1.1,});
            // });

            fade_move({
                parent: ".hero_img-intro",
                element: ".hero_img-intro__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "heroImgIntro",
                x: 0,
                y: 150,
                z: 0.01,
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                scale: 1.2,
                time: 2,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 300,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            fade_move({
                parent: ".hero_img-intro--zoom",
                element: ".hero_img-intro--zoom__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "heroImgIntroZoom",
                x: 0,
                y: 0,
                z: 0.01,
                opacity: 1,
                rotateX: 5,
                rotateY: 0,
                scale: 1.5,
                time: 3,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 300,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            fade_move({
                parent: ".hero_img-intro--zoom-move",
                element: ".hero_img-intro--zoom-move__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "heroImgIntroZoomMove",
                x: 0,
                y: 200,
                z: 0.01,
                opacity: 1,
                rotateX: 5,
                rotateY: 0,
                scale: 1.7,
                time: 2,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 300,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            fade_move({
                parent: ".zoom-in--intro",
                element: ".zoom-in--intro__el",
                onScroll: false,
                deferred: true,
                deferred_function_name: "zoomInItro",
                x: 0,
                y: 0,
                z: 0.01,
                opacity: 1,
                rotateX: 0,
                rotateY: 0,
                scale: 0.2,
                time: 5,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 300,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });

            // 1. Prepare the animations for the page elments to be
            // drawn once th epage has loaded
            svg_draw_animation({
                class_Name: ".svg-draw-intro--stroke",
                onScroll: false,
                deferred: true,
                deferred_function_name: "playAnim_stroke", // This should be unique foe each function run
                draw_time: 4,
                draw_stagger_time: 0.7,
                fill_time: 1,
                fill_overlap_time: "-=2",
                // initial_delay: 0,
                // each_group_delay: 0,
                easing: Power2.easeOut,
            });

            svg_draw_animation({
                class_Name: ".svg-draw-intro",
                onScroll: false,
                deferred: true,
                deferred_function_name: "playAnim_fill", // This should be unique foe each function run
                draw_time: $(".infinito__word").data('drawing-time-sec'),
                draw_stagger_time: $(".infinito__word").data('stagger-time-sec'),
                fill_time: 1,
                fill_overlap_time: "-=2",
                initial_delay: 0,
                each_group_delay: 2,
                easing: Power4.easeOut,
            });


            // 2. get the elements of the loading screen
            var $paace = $(".pace"),
                $paace_lcl_stls = $("#pace-local-styles"),
                $loodr = $(".loader"),
                $loodr_scrn = $("#loading-screen"),
                $prgrs = $(".pace-progress"),
                $loodr_snk = $(".infinito__loader__snake"),

                // 3. Defining the animation related vars
                // .pace element animation vars
                time__paace = 1,
                delay_additional__paace = 0,
                scaleX__paace = $window.outerWidth() / $paace.outerWidth(),
                scaleY__paace = $window.outerHeight() / $paace.outerHeight(),
                translateX__paace = 0,
                translateY__paace = 0,
                left__paace = "50%",
                top__paace = "50%",
                opacity__paace = 0,

                // .loader element animations vars
                time__loodr = 1,
                delay_additional__loodr = 0,
                scaleX__loodr = 1,
                scaleY__loodr = 1,
                translateX__loodr = 0,
                translateY__loodr = 0,
                left__loodr = "50%",
                top__loodr = "50%",
                m__top__loodr = $loodr.css('margin-top'),
                opacity__loodr = 0,

                // .loader-screen animation vars
                time__loodr_scrn = 1,
                delay_additional__loodr_scrn = 0,
                scaleX__loodr_scrn = 1,
                scaleY__loodr_scrn = 1,
                translateX__loodr_scrn = 0,
                translateY__loodr_scrn = 0,
                left__loodr_scrn = 0,
                top__loodr_scrn = 0,
                opacity__loodr_scrn = 0,
                lsVisibility = "hidden";


            // enabling the ability to change animation in html elment via data attributes
            if (typeof $paace_lcl_stls.data('x-percent') !== 'undefined') {
                translateX__paace = $paace_lcl_stls.data('x-percent');
            }

            if (typeof $paace_lcl_stls.data('y-percent') !== 'undefined') {
                translateY__paace = $paace_lcl_stls.data('y-percent');
            }

            if (typeof $paace_lcl_stls.data('scale-x') !== 'undefined') {
                scaleX__paace = $paace_lcl_stls.data('scale-x');
            }

            if (typeof $paace_lcl_stls.data('scale-y') !== 'undefined') {
                scaleY__paace = $paace_lcl_stls.data('scale-y');
            }

            if (typeof $paace_lcl_stls.data('left') !== 'undefined') {
                left__paace = $paace_lcl_stls.data('left');
            }

            if (typeof $paace_lcl_stls.data('top') !== 'undefined') {
                top__paace = $paace_lcl_stls.data('top');
            }

            if (typeof $paace_lcl_stls.data('opacity') !== 'undefined') {
                opacity__paace = $paace_lcl_stls.data('opacity');
            }

            if (typeof $paace_lcl_stls.data('time') !== 'undefined') {
                time__paace = $paace_lcl_stls.data('time');
            }

            if (typeof $paace_lcl_stls.data('delay') !== 'undefined') {
                delay_additional__paace = $paace_lcl_stls.data('delay');
            }



            if (typeof $loodr.data('x-percent') !== 'undefined') {
                translateX__loodr = $loodr.data('x-percent');
            }

            if (typeof $loodr.data('y-percent') !== 'undefined') {
                translateY__loodr = $loodr.data('y-percent');
            }

            if (typeof $loodr.data('left') !== 'undefined') {
                left__loodr = $loodr.data('left');
            }

            if (typeof $loodr.data('top') !== 'undefined') {
                top__loodr = $loodr.data('top');
            }

            if (typeof $loodr.data('margin-top') !== 'undefined') {
                m__top__loodr = $loodr.data('margin-top');
            }

            if (typeof $loodr.data('scale-x') !== 'undefined') {
                scaleX__loodr = $loodr.data('scale-x');
            }

            if (typeof $loodr.data('scale-y') !== 'undefined') {
                scaleY__loodr = $loodr.data('scale-y');
            }

            if (typeof $loodr.data('opacity') !== 'undefined') {
                opacity__loodr = $loodr.data('opacity');
            }

            if (typeof $loodr.data('time') !== 'undefined') {
                time__loodr = $loodr.data('time');
            }

            if (typeof $loodr.data('delay') !== 'undefined') {
                delay_additional__loodr = $loodr.data('delay');
            }


            if (typeof $loodr_scrn.data('x-percent') !== 'undefined') {
                translateX__loodr_scrn = $loodr_scrn.data('x-percent');
            }

            if (typeof $loodr_scrn.data('y-percent') !== 'undefined') {
                translateY__loodr_scrn = $loodr_scrn.data('y-percent');
            }

            if (typeof $loodr_scrn.data('left') !== 'undefined') {
                left__loodr_scrn = $loodr_scrn.data('left');
            }

            if (typeof $loodr_scrn.data('top') !== 'undefined') {
                top__loodr_scrn = $loodr_scrn.data('top');
            }

            if (typeof $loodr_scrn.data('scale-x') !== 'undefined') {
                scaleX__loodr_scrn = $loodr_scrn.data('scale-x');
            }

            if (typeof $loodr_scrn.data('scale-y') !== 'undefined') {
                scaleY__loodr_scrn = $loodr_scrn.data('scale-y');
            }

            if (typeof $loodr_scrn.data('opacity') !== 'undefined') {
                opacity__loodr_scrn = $loodr_scrn.data('opacity');
            }

            if (typeof $loodr_scrn.data('time') !== 'undefined') {
                time__loodr_scrn = $loodr_scrn.data('time');
            }

            if (typeof $loodr_scrn.data('delay') !== 'undefined') {
                delay_additional__loodr_scrn = $loodr_scrn.data('delay');
            }

            if (typeof $loodr_scrn.data('visibility') !== 'undefined') {
                lsVisibility = $loodr_scrn.data('visibility');
            }

            if ($loodr_scrn.data('curtain-rows')) {
                $(function() {
                    var rows = $loodr_scrn.data('curtain-rows'),
                        cols = $loodr_scrn.data('curtain-cols'),
                        no = rows * cols,
                        w = 100 / cols,
                        h = 100 / rows;

                    $loodr_scrn.append('<div class="curtain__wrapper"></div>');
                    
                    for (var i=0; i<no; i++) {
                        $(".curtain__wrapper").append('<div class="curtain"><div class="curtain__line"></div></div>');
                    }

                    $(".curtain").css({
                        height: h + "%",
                        width: w + "%",
                    });

                    $loodr_scrn.css('background', 'transparent');
                });
            }

            // 4. make the loader visible
            var t_1 = 0, // **OPTIONAL** loader opacity --> 1
                t_svg_word_draw = $(".infinito__word").data('total-drawing-time-milisec'),
                t_svg_icon_draw = 4000;

            // if (t_svg_word_draw >= t_svg_icon_draw || !$loodr_snk.length) { //if drawing the word takes longer than the icon or the icon does not exist at all
            //     t_2 = t_1 + t_svg_word_draw; // draw the svg word 
            // } else {
             var t_2 = t_1 + t_svg_icon_draw, // draw the svg loader icon
            // }
                t_wait_before_rolling = 0, // **OPTIONAL** it is to wait after drawing is finished
                t_go_to_rolling_mode = 1000, // it is to draw the loader icon into animating mode time! *look into css*
                t_3 = t_2 + t_wait_before_rolling,
                t_4 = t_3 + t_go_to_rolling_mode,
                t_svg_loader_loop_time = 1600, // look up in the css animation keyes to find the loop time
                t_number_of_the_rolls = 1,
                t_loder = t_svg_loader_loop_time * t_number_of_the_rolls,
                t_5;

            if (!$loodr_snk.length) {
                t_3 = t_2;
                t_4 = t_2;
                t_loder = 0;
            }

            if ($loodr_snk.length) {
                t_svg_word_draw =  Math.ceil((t_svg_word_draw - t_svg_icon_draw)/t_svg_loader_loop_time) * t_svg_loader_loop_time + t_svg_icon_draw;
            }

            if ((t_1 + t_svg_word_draw + t_wait_before_rolling + t_go_to_rolling_mode >= t_4 ) || !$loodr_snk.length) {
                t_5 = t_1 + t_svg_word_draw + t_wait_before_rolling + t_go_to_rolling_mode + t_loder;
            } else {
                t_5 = t_4 + t_loder;
            }

            // if (!$body.hasClass("is-loading")) {
            //     $body.addClass("is-loading");
            // }

            setTimeout((function() {
                $loodr.css('opacity', '1');
            }), t_1);
            var t_0 = performance.now();

            setTimeout((function() {
                svg_draw_animation.playAnim_fill();
                svg_draw_animation.playAnim_stroke();
            }), t_1);

            setTimeout((function() {
                $loodr_snk.addClass('aaa');
            }), t_3);

            setTimeout((function() {
                $loodr_snk.addClass('bbb');
            }), t_4);


            Pace.on('done', (function() {
                // alert("g");
                // $(window).on('load', function(){

                    var t_passed = performance.now() - t_0,
                        t_tap,
                        t_gap; // the time between finishing the previous animations and pace being done

                    if (t_passed < t_5) { //loading is fast
                        t_gap = t_5 - t_passed;
                    } else if (t_passed > t_5) { //loading is slow
                        t_tap = t_passed - t_5;
                        t_gap = (Math.ceil(t_tap / 1600) * 1600) - t_tap;
                        if (!$loodr_snk.length) {
                            t_gap = 0;
                        }
                    }

                    var t_last_watch = $loodr_scrn.data("time-last-watch"), // **OPTIONAL** a rest time after all loading animations are done before animating out the loading screen and revealing the page,
                        t_loader_stop = 1800; // it is the time required to end the svg icon loading and become still ..

                    if (!$loodr_snk.length) {
                        t_loader_stop = 0;
                    }

                    var t_6 = t_gap + t_loader_stop + t_last_watch, // time for the svg loader to stop looping animation and become still and maybe watch it a little bit if t_last_watch has a time
                        t_7 = t_6 + 500, // **OPTIONAL** the 2nd part is the time required to scale progress bar to zero, if you wwant to scale it down!
                        t_overtake = $loodr_scrn.data("time-page_els_overtake"), // it is the time that the original page elments start to animate in before loading screen animates out
                        t_8 = t_7 + t_overtake,
                        t_9 = t_8 + 1000 + (time__loodr_scrn + delay_additional__loodr_scrn) * 1000; // the 2nd time is the time needed for the page elemnts to animate in and/or loading screen animates out and removing .is-loading class from body after that.

                    setTimeout((function() {
                        $loodr_snk.addClass('ccc');
                    }), t_gap);


                    if ($paace_lcl_stls.data('scale-x') == 0) {
                        TweenMax.to($paace, 1, { scaleX: 0, delay: (t_6 / 1000), transformOrigin: "right", ease: Power4.easeOut });
                        // TweenMax.to($loodr, 0.5, { opacity: 0, delay: (t_6 / 1000), ease: Power2.easeOut });
                    }

                    TweenMax.staggerTo($(".infinito__word__inner"), 2, {yPercent: -100, delay: (t_6 / 1000), ease: Power4.easeOut}, 0.2);

                    TweenMax.staggerTo($(".curtain__line"), 1, {scaleY: 1, delay: (t_6 / 1000), ease: Power4.easeOut}, 0.1);

                    setTimeout((function() {
                        if (!__mar)
                            blur_text_animation.playAnim_blur_intro();
                    }), t_7);

                    setTimeout((function() {
                        fade_move.fadeDownIntro();
                        fade_move.fadeInIntro();
                        fade_move.heroImgIntro();
                        fade_move.heroImgIntroZoom();
                        fade_move.heroImgIntroZoomMove();
                        fade_move.zoomInItro();
                        cover_animation.slideUpIntro();
                        fade_move.fadeUpIntro();
                        fade_move.fadeRightIntro();
                    }), t_7);

                    // TweenMax.to($loodr_scrn, 2, { autoAlpha: 0, delay: (t_8 / 1000), ease: Power4.easeOut });
                    // TweenMax.to($loodr_scrn, 1, { yPercent: -100, z: 0.01, delay: (t_8 / 1000), ease: Power4.easeOut });
                    // TweenMax.to($(".loader"), 1, { top: "150%", z: 0.01, delay: (t_8 / 1000), ease: Power4.easeOut });
                    // TweenMax.to($paace, 1, { top: "150%", z: 0.01, delay: (t_8 / 1000), ease: Power4.easeOut });



                    // TweenMax.to($loord_scrn, 0, { yPercent: -100, z: 0.01, delay: (t_8 / 1000) + 1, ease: Power4.easeOut });
                    // TweenMax.to($loodr, 0.3, { opacity: 0, z: 0.01, delay: (t_8 / 1000), ease: Power4.easeOut });
                    // TweenMax.to($paace, 1, { scaleX: scaleeX, scaleY: scaleeY, z: 0.01, delay: (t_8 / 1000), ease: Power4.easeOut });

                    TweenMax.staggerFromTo(".curtain", 1, {scaleX:1}, {scaleX:0, delay: (t_8 / 1000) + 0.5, ease: Power4.easeOut },  0.1);

                    TweenMax.to($loodr, time__loodr, {
                                autoAlpha: opacity__loodr,
                                scaleX: scaleX__loodr,
                                scaleY: scaleY__loodr,
                                left: left__loodr,
                                top: top__loodr,
                                marginTop: m__top__loodr,
                                yPercent: translateY__loodr,
                                xPercent: translateX__loodr,
                                z: 0.01,
                                delay: (t_8 / 1000) + delay_additional__loodr,
                                ease: Power4.easeOut });

                    TweenMax.to($paace, time__paace, {
                                autoAlpha: opacity__paace,
                                scaleX: scaleX__paace,
                                scaleY: scaleY__paace,
                                yPercent: translateY__paace,
                                xPercent: translateX__paace,
                                left: left__paace,
                                top: top__paace,
                                z: 0.01,
                                delay: (t_8 / 1000) + delay_additional__paace,
                                ease: Power4.easeOut });
                    
                    var ldrScrnTl = new TimelineLite();

                    ldrScrnTl.to($loodr_scrn, time__loodr_scrn, {
                                autoAlpha: opacity__loodr_scrn,
                                scaleX: scaleX__loodr_scrn,
                                scaleY: scaleY__loodr_scrn,
                                left: left__loodr_scrn,
                                top: top__loodr_scrn,
                                yPercent: translateY__loodr_scrn,
                                xPercent: translateX__loodr_scrn,
                                delay: (t_8 / 1000) + delay_additional__loodr_scrn,
                                ease: Power4.easeOut })
                             .to($(".loader--nav-comp").find('.infinito__word'), 0.4, {
                                opacity: 0
                             }, "=-2")
                             .to($loodr_scrn, 0, {
                                yPercent: -100,
                                visibility: lsVisibility,
                                zIndex: 98,
                             });

                    // TweenMax.to($(".hero__parallax"), 5, { scale: 1, ease: Power4.easeOut });

                    setTimeout((function() {
                        $body.addClass("is-loaded");
                    }), t_9);
                // });
            }));
        };

        loading_anim();
    }

    //
    //
    //
    // ==============    End of form functions    ==============

    // ------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------

    // ---------------------------End of the defining functions----------------------------------

    // ------------------------------------------------------------------------------------------

    // ------------------------------------------------------------------------------------------












    // =========================================================
    // =                  CALLING THE FUNCTIONS               =
    // =========================================================

    ie_11_detector();
    ie_10_below_detector();
    msEdge_detector();
    ie_classes();
    css3_properties_detector();
    toggleClass_onClick({
        condition: is_mobile,
        toggle_button: ".nav-header .has--dropdown__branch > .nav-link",
        class: 'hovered'
    });
    remove_list_item();
    cart_counter();
    navtabs_activetor();
    tabs_horizontal();
    two_optioned_pricing_table_plans();
    sliding_section();
    sliding_section({
        element: ".js-sliding--search",
        trigger: ".js-sliding--search__toggle",
        close: ".js-sliding--search__close"
    });
    content_fadeIn_over({
        trigger: "#search-toggle",
        content: ".search-screen--overlay",
        trigger_class_open: "clicked",
        content_class_open: "revealed",
        html_class_when_covered: "covered"
    });

    fake_search_function();

    if ($(".portfolio.fit-rows").length) {
        $(".portfolio.fit-rows").imagesLoaded((function() {
            img_cover({ item: ".fit-rows img" });
        }));
    }

    img_cover({ item: ".img-cover" });

    animated_words();
    lettering_rotator({
        parent: ".hero__text-rotator",
        el: ".hero__text-rotator__text",
        y_in: 0,
        x_in: 0,
        rotateX_in: 0,
        rotateY_in: 0,
        scale_in: 1,
        opacity_in: 0,
        blur_in: "0 0 30px", // The blur product__amount to animate from

        y_out: 0,
        x_out: 0,
        rotateX_out: 0,
        rotateY_out: 0,
        scale_out: 1,
        opacity_out: 0,

        dur_in: 1.5,
        dur_out: 2,
        ease_in: Power2.easeOut,
        ease_out: Power2.easeOut,
        stagger: 0.1,
        pause: 2, // quote static time
        overlap: 1,

        perspective: 1000,
        transform_origin: "50% 50% 0",

        lettering_type: "words", // letters -or- words -or- lines 
        random: true, // if you want random stagger
        percent: 100, // the percent of the letters that you want to be animated
        bounce: false, // sholud out animation start from the end?
    });
    lettering_rotator({
        parent: ".hero__text-rotatory",
        el: ".hero__text-rotatory__text",
        y_in: 0,
        x_in: 20,
        rotateX_in: 0,
        rotateY_in: 90,
        scale_in: 1,
        opacity_in: 1,
        blur_in: "0 0 0px", // The blur product__amount to animate from

        y_out: 0,
        x_out: -20,
        rotateX_out: 0,
        rotateY_out: -90,
        scale_out: 1,
        opacity_out: 0,

        dur_in: 0.6,
        dur_out: 0.6,
        ease_in: Power4.easeOut,
        ease_out: Power4.easeOut,
        stagger: 0.05,
        pause: 5, // quote static time
        overlap: 1,

        perspective: 100,
        transform_origin: "50% 50% 0",

        lettering_type: "letters", // letters -or- words -or- lines 
        random: false, // if you want random stagger
        percent: 100, // the percent of the letters that you want to be animated
        bounce: false, // sholud out animation start from the end?
    });

    menu_bg_img();
    nav_show_hide();

    if (!is_edge) {
        nav_header_fade_scroll();
    }

    nav_static();
    side_menu_dropdown();

    if ($("#js-portfolio").length) {
        $("#js-portfolio").imagesLoaded((function() {
            portfolio();
        }));
    }
    // Running lighboxes functions with the data defined before
    // $('.portfolio').Chocolat(chocolat_data);
    var light_gallery_portfolio = $lightgallery.lightGallery(lightGallery_data);
    var light_gallery_video = $(".js-lightgallery-video").lightGallery(lightGallery_video_data);

    ms_quotes();
    owl_logos();

    ms_custom_controls();

    active_form_focus({
        containerElemnt: $(".form-style--02"),
        formElement: "input"
    });
    active_form_focus({
        containerElemnt: $(".form-style--02"),
        formElement: "textarea"
    });
    active_form_focus({
        containerElemnt: $(".form-style--03"),
        formElement: "input"
    });
    active_form_focus({
        containerElemnt: $(".form-style--03"),
        formElement: "textarea"
    });

    submit_form({
        form__el: ".subscribe-form",
        result__el: ".submit",
        loader__el: ".btn--ajax__svg-icon",
        result_width: 170,
        mailchimp: true,
        mailchimp_msg__error: "oops!",
        mailchimp_msg__double: "Tnx again",
        mailchimp_msg__success: "Done! ツ"
    });
    submit_form({
        form__el: ".contact-form",
        result__el: ".submit",
        loader__el: ".btn--ajax__svg-icon"
    });

    // Function that must be run only on desktops
    // ------------------------------------------
    if (is_desktop) {
        // This is because we want to disable scroll when menu is open 
        // and we dont want the jump when browser scrollbar disapears ..
        // -------------------------------------------------------------
        TweenMax.set($body, { paddingRight: $body.css('padding-right') });
        btn_components_pageContents();
        btn_components_nav();
        hover_bg_pageContent();
        btn_shuffle();
        box_move({
            parent: ".hover--move.nav-tabs--line, .hover--move.nav-tabs--box",
            children: 'li',
            active_class: '.active',
            magic_el_id_class: 'magic-box',
            transition_time: 0.3,
            // easing: Power3.easeOut,
            easing: Back.easeOut.config(1),
        });
        box_move({
            parent: ".hover--move.nav-tabs--line-vertical, .hover--move.nav-tabs--box-vertical",
            children: 'li',
            active_class: '.active',
            magic_el_id_class: 'magic-box',
            transition_time: 0.3,
            // easing: Power3.easeOut,
            easing: Back.easeOut.config(1),
            vertical: true,
        });
        fix_an_ie_bug($(".dropdown__branch-wrapper"));
        fix_ie11_bug();
        glitch();

        if (animations__on_mouse_move__enabled) {
            flow_bg_dir_aware({
                container: ".js-flow-bg-dir-aware",
                element: ".hover--bg-flow__el",
                oppsite_direction: false,
            });
            flow_bg_dir_aware({
                container: ".js-flow-bg-dir-aware--opp",
                element: ".hover--bg-flow__el",
                oppsite_direction: true,
            });

            move_hover({
                parent: ".js-backgound-move-hover",
                element: ".background-interactive > div",
                invert: true, // if not set it is false
                maxMoveX: 100,
                maxMoveY: 100,
                xSensitivity: 5, // Min: 1  |  Max: 10
                ySensitivity: 5, // Min: 1  |  Max: 10
                // mouseSensitiveArea: $window, // if not set it's the parent element
                easing: Power1.easeOut,
                movementTime: 15
            });

            threeD_hover({
                parent: ".td-hover",
                element: ".td-hover__item",
                maxRotateDegreeX: 30,
                maxRotateDegreeY: 30,
                xSensitivity: 5, // Min: 1  |  Max: 10
                ySensitivity: 10, // Min: 1  |  Max: 10
                perspective: 1000,
                movementTime: 1,
                movementTimeBack: 1.5
            });
            threeD_hover({
                parent: ".illusional-field",
                element: ".illusional-object",
                maxRotateDegreeX: 20,
                maxRotateDegreeY: 20,
                xSensitivity: 4, // Min: 1  |  Max: 10
                ySensitivity: 4, // Min: 1  |  Max: 10
                perspective: 1200,
                transform_origin: 120,
                movementTime: 0.7,
                movementTimeBack: 1.5
            });
        }
    }

    if (animations__on_scroll__enabled) {

        if (isChrome && is_desktop) {
            parallax_hero({});
            parallax_hero({
                background_item: ".hero__parallax--blur",
                // blur_item: ".hero__parallax--dub",
                // cover_item: ".hero__parallax--cover",
                y_start: "-1%",
                y_end: "-60%",
                z_start: 0.01,
                z_end: 180,
                opacity_start: 1,
                opacity_end: 0,
                blur_start: "0px",
                blur_end: "14px",
                anim_durtion: "130%",
                easing: Power0.easeNone,
            });

            parallax_hero({
                background_item: ".hero__parallax--zoom",
                // blur_item: ".hero__parallax--dub",
                // cover_item: ".hero__parallax--cover",
                y_start: -1,
                y_end: -350,
                z_start: 0.01,
                z_end: 600,
                opacity_start: 1,
                opacity_end: 1,
                blur_start: "0px",
                blur_end: "0px",
                anim_durtion: "100%",
                easing: Power0.easeNone,
            });

            parallax_bg();
        }

        if (!__mar) {
            if ($("#js-portfolio").length) {
                $("#js-portfolio").imagesLoaded((function() {
                    portfoilio_filters_fixed();
                }));
            }

            // blur_text_animation();
            blur_text_animation({
                parent: ".blurred-words",
                element: ".blurred-words__el",
                l_type: "words",
                time: 0.6,
                onScroll: true,
                // if it is deferred it means that the timeline and initial styles of elements
                // will be set and they wait to be animated by blur_text_animation.playAnim() func;
                deferred: false,
                deferred_function_name: "playAnim",
                random: true,
                percent: 100, // the percent of the letters that you want to be animated
                initial_delay: 0,
                stagger_delay: 0.1,
                easing: Sine.easeOut,
            });
            
            fixed_position({
                reverse: true,
                hook: 'onCenter', //'onEnter' or 'onCenter'or 'onLeave',
                element: ".timeline__bar div", // The element that fixes
                course_element: ".timeline", // The element that the fixed element is fixed along it
                course_adjustment_bottom: 0, // The product__amount to be added or removed from the course element height
                element_with_event: ".timeline", // The element that the function must be refereshed on its event
                the_event: "height-changed", // The event that make us to referesh the function
                ourse_adjustment_top: -30, // 60 is the height of the page navbar and 115 is the outerHeight ..
                // .. of the element plus the space between it and the start of the cousrse elemnt - Ajust this carefully
            });

            fixed_position({
                reverse: true,
                hook: 'onLeave', //'onEnter' or 'onCenter'or 'onLeave',
                element: ".sidebar--fixed", // The element that fixes
                course_element: ".sidebar--fixed__course", // The element that the fixed element is fixed along it
                course_adjustment_bottom: 0, // The product__amount to be added or removed from the course element height
                element_with_event: ".sidebar--fixed", // The element that the function must be refereshed on its event
                the_event: "height-changed", // The event that make us to referesh the function
                ourse_adjustment_top: -90, // 60 is the height of the page navbar and 115 is the outerHeight ..
                // .. of the element plus the space between it and the start of the cousrse elemnt - Ajust this carefully
            });
            // blur_text_animation.playAnim();
            fade_move({
                parent: ".fade-up-large",
                element: ".fade-up-large__el",
                // onScroll: false,
                // deferred: true,
                x: 0,
                y: 170,
                rotateX: 0,
                rotateY: 0,
                time: 1,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });
            // addClass_staggered();
            fade_move({
                parent: ".rotate-in",
                element: ".rotate-in__el",
                onScroll: true,
                deferred: false,
                // deferred_function_name: "playAnim", // This should be unique foe each function run
                // x: 0,
                y: 23,
                // z: 0,
                opacity: 0,
                rotateX: -90,
                // rotateY: 0,
                // scale: 1,
                time: 0.6,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.3,
                perspective: 500,
                transformOrigin: "50% 50% 0", // x y z
                easing: Power4.easeOut,
            });
            fade_move({
                parent: ".fade-up",
                element: ".fade-up__el",
                // onScroll: false,
                // deferred: true,
                x: 0,
                y: 30,
                // z: 0,
                rotateX: 0,
                rotateY: 0,
                // opacity: 0,
                // scale: 1,
                time: 0.6,
                initial_delay: 0,
                stagger_delay: 0.1,
                each_set_delay: 0.2,
                perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power3.easeOut,
                // deferred_function_name: "playAnim", // This should be unique foe each function run
                // el_set_function_name: "fade_move__el_set_func",
                // offset: 0,
                // trigger_hook: "onCenter", //"onEnter", "onLeave",
            });
            fade_move({
                parent: ".fade-up__text",
                element: ".fade-up__text__el",
                // onScroll: false,
                // deferred: true,
                onScroll: true,
                deferred: false,
                x: 0,
                y: 50,
                // z: 0,
                rotateX: 0,
                rotateY: 0,
                // opacity: 0,
                // scale: 1,
                time: 1,
                initial_delay: 0,
                stagger_delay: 0.06,
                each_set_delay: 0.2,
                perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Back.easeOut.config(1.4),
                // deferred_function_name: "playAnim", // This should be unique foe each function run
                // el_set_function_name: "fade_move__el_set_func",
                // offset: 0,
                // trigger_hook: "onCenter", //"onEnter", "onLeave",
            });
            fade_move({
                parent: ".fade-letter",
                element: ".fade-letter__el",
                // onScroll: false,
                // deferred: true,
                onScroll: true,
                deferred: false,
                x: 20,
                y: 0,
                // z: 0,
                rotateX: 0,
                rotateY: 70,
                // opacity: 0,
                // scale: 1,
                time: 0.6,
                initial_delay: 0,
                stagger_delay: 0.04,
                each_set_delay: 0.2,
                perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
                // deferred_function_name: "playAnim", // This should be unique foe each function run
                // el_set_function_name: "fade_move__el_set_func",
                // offset: 0,
                // trigger_hook: "onCenter", //"onEnter", "onLeave",
            });
            fade_move({
                parent: ".fade-in",
                element: ".fade-in__el",
                x: 0,
                y: 1,
                rotateX: 0,
                rotateY: 0,
                time: 1,
                initial_delay: 0,
                stagger_delay: 0.2,
                each_set_delay: 0.3,
                perspective: 1000,
                transformOrigin: "50% 0% -50", // x y z
                easing: Power4.easeOut,
            });
            svg_draw_animation();

            cover_animation({
                class_Name: ".slide-cover",
                // onScroll: false,
                // deferred: true,
                el__Time: 0.6,
                el_Content__Time: 0.9,
                cover__Time: 0,
                el__Stagger_Time: 0.06,
                el_Content__Stagger_Time: 0.06,
                each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                // cover__Draw_From_0: false,
                no_Cover: true,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                anim_Dir: "y",
                el__Pos_Ini: "0%",
                el__Easing: Power4.easeOut,

                el_Content__Pos_Ini: "115%",
                el_Content__Easing: Power3.easeOut,

                // cover__Easing: Power2.easeOut,
                // to_add_class_to: ".dot",
                // class_to_be_added: "has-active",
            });
            cover_animation({
                class_Name: ".double-cover-right",
                el__Time: 0.6,
                el_Content__Time: 1,
                cover__Time: 1,
                el__Stagger_Time: 0.2,
                el_Content__Stagger_Time: 0.2,
                cover__Stagger_Time: 0.2,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: true,
                scale_Ini: "1",
                anim_Dir: "x",
                el__Pos_Ini: "0%",

                element_class_remove: ".hover-style--01, .hover-style--02", // class "no-hover" will be added to these until the revealing animation ends!
                onComplete_class_remove: "no-hover",
                el__Easing: Power3.easeOut,

                el_Content__Pos_Ini: "20%",
                el__content__opacity_ini: "0",
                el_Content__Easing: Power3.easeOut,

                cover__Easing: Power3.easeOut,
            });
            cover_animation({
                class_Name: ".double-cover",
                el__Time: 0.7,
                el_Content__Time: 0.7,
                cover__Time: 0.7,
                el__Stagger_Time: 0.1,
                el_Content__Stagger_Time: 0.1,
                cover__Stagger_Time: 0.1,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: true,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: true,
                triple_Cover: false,
                scale_Ini: "1",
                anim_Dir: "x",
                el__Pos_Ini: "-5%",

                element_class_remove: ".hover-style--01, .hover-style--02", // class "no-hover" will be added to these until the revealing animation ends!
                onComplete_class_remove: "no-hover",
                el__Easing: Power3.easeOut,

                el_Content__Pos_Ini: "-40%",
                el__content__opacity_ini: "0",
                el_Content__Easing: Power3.easeOut,

                cover__Easing: Power3.easeOut,
            });
            cover_animation({
                class_Name: ".cover-bounce",
                el__Time: 1,
                el_Content__Time: 1.2,
                cover__Time: 1.2,
                el__Stagger_Time: 0.15,
                el_Content__Stagger_Time: 0.4,


                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                cover__Anim_Dir__To_Default: false,
                cover__Anim_Dir__To_Default_Bounce: true,
                el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: true,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                scale_Ini: 1,
                anim_Dir: "x",
                el__Pos_Ini: "0%",
                // el__Easing: Power2.easeOut,
                onComplete_class_remove: "no-hover",

                el_Content__Pos_Ini: "-20%",
                el_Content__Easing: Power4.easeOut,

                cover__Easing: Power4.easeOut,
            });
            cover_animation({
                class_Name: ".cover-bounce-up",
                el__Time: 1,
                el_Content__Time: 0.8,
                cover__Time: 0.8,
                el__Stagger_Time: 0.2,
                el_Content__Stagger_Time: 0.3,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                cover__Anim_Dir__To_Default: false,
                cover__Anim_Dir__To_Default_Bounce: true,
                el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: true,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                scale_Ini: 1,
                anim_Dir: "y",
                el__Pos_Ini: "0%",
                // el__Easing: Power2.easeOut,
                onComplete_class_remove: "no-hover",

                el_Content__Pos_Ini: "-20%",
                // el_Content__Easing: Power2.easeOut,

                // cover__Easing: Power2.easeOut,
            });
            cover_animation({
                class_Name: ".cover-up",
                el__Time: 0.6,
                el_Content__Time: 2,
                cover__Time: 1.5,
                el__Stagger_Time: 0.2,
                el_Content__Stagger_Time: 0.2,
                cover__Stagger_Time: 0.2,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: true,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                scale_Ini: 1,
                anim_Dir: "y",

                // height: 52px;
                //     width: 88%;
                //     opacity: 0.3;
                //     left: 29px;


                el__Pos_Ini: "0%",
                // el__Easing: Power2.easeOut,

                el_Content__Pos_Ini: "0%",
                // el_Content__Easing: Power4.easeOut,

                cover__Easing: Power3.easeOut,
            });
            cover_animation({
                class_Name: ".cover-d-r-img",
                el__Time: 0.8,
                el_Content__Time: 0.8,
                cover__Time: 0.8,
                el__Stagger_Time: 0.1,
                el_Content__Stagger_Time: 0.1,
                cover__Stagger_Time: 0.1,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                scale_Ini: 1.15,
                anim_Dir: "x",
                el__Pos_Ini: "-5%",
                el__content__opacity_ini: "0",
                el__opacity_ini: "1",
                el__Easing: Power3.easeOut,

                el_Content__Pos_Ini: "-10%",
                el_Content__Easing: Power3.easeOut,

                element_class_remove: ".hover-style--01, .hover-style--02", // class "no-hover" will be added to these until the revealing animation ends!
                onComplete_class_remove: "no-hover",

                cover__Easing: Power3.easeOut,
            });
            cover_animation({
                class_Name: ".cover-d-t-img",
                el__Time: 0.8,
                el_Content__Time: 0.8,
                cover__Time: 0.8,
                el__Stagger_Time: 0.3,
                el_Content__Stagger_Time: 0.3,
                cover__Stagger_Time: 0.3,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                scale_Ini: 1.15,
                anim_Dir: "y",
                el__Pos_Ini: "5%",
                el__Easing: Power3.easeOut,

                el_Content__Pos_Ini: "10%",
                el_Content__Easing: Power3.easeOut,

                onComplete_class_remove: "no-hover",

                cover__Easing: Power3.easeOut,
            });
            cover_animation({
                class_Name: ".slide-up",

                // onScroll: false,
                // deferred: true,
                el__Time: 0.4,
                el_Content__Time: 0.4,
                cover__Time: 0,
                el__Stagger_Time: 0.1,
                el_Content__Stagger_Time: 0.1,
                each_Group_Delay: 0.1,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: true,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                anim_Dir: "y",
                el__Pos_Ini: "50%",
                el__Easing: Power3.easeOut,

                el_Content__Pos_Ini: "120%",
                el_Content__Easing: Power3.easeOut,

                // cover__Easing: Power2.easeOut,
                // to_add_class_to: ".dot",
                // class_to_be_added: "has-active",
            });
            cover_animation({
                class_Name: ".slide-sp",
                el__Time: 1,
                el_Content__Time: 1,
                cover__Time: 0.8,
                el__Stagger_Time: 0.3,
                el_Content__Stagger_Time: 0.3,
                cover__Stagger_Time: 0.3,
                each_Group_Delay: 0.2,
                cover_Addtional_Delay: 0.2,
                initial_Delay: 0,
                cover__Anim_Dir__To_Default: false,
                cover__Anim_Dir__To_Default_Bounce: false,
                el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: true,
                scale_Ini: "1",
                anim_Dir: "y",
                el__Pos_Ini: "100px",
                el__opacity_ini: "1",
                el__Easing: Power3.easeOut,
                el_Content__Pos_Ini: "0%",
                el_Content__Easing: Power3.easeOut,

                cover__Easing: Power3.easeOut,
                element_class_remove: "default", // the element which the below class will be aded and then removed. default = [parent]
                onComplete_class_remove: false, // add a class to the parent alement and remove it after animation is done
                c_offset: 0, // start this scene after scrolling for 0px
                to_add_class_to: false, // if this is undefined or false and below variable is defined
                //  then the class will be applied to the parent element itself; here ".class_Name"
                class_to_be_added: false
            });
            cover_animation({
                class_Name: ".slide-upx", //just like slide-up; used for combinations of bare anim__el and anim__el-set

                // onScroll: false,
                // deferred: true,
                el__Time: 0.6,
                el_Content__Time: 0.6,
                cover__Time: 0,
                el__Stagger_Time: 0.1,
                el_Content__Stagger_Time: 0.1,
                each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: true,
                double_Reveal: false,
                double_Cover: false,
                triple_Cover: false,
                anim_Dir: "y",
                el__Pos_Ini: "50%",
                // el__Easing: Power2.easeOut,

                el_Content__Pos_Ini: "120%",
                // el_Content__Easing: Power2.easeOut,

                // cover__Easing: Power2.easeOut,
                // to_add_class_to: ".dot",
                // class_to_be_added: "has-active",
            });
            cover_animation({
                class_Name: ".slide-up2",
                el__Time: 0.6,
                el_Content__Time: 0.6,
                cover__Time: 0.6,
                el__Stagger_Time: 0.1,
                el_Content__Stagger_Time: 0.1,
                each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: true,
                double_Cover: false,
                triple_Cover: false,
                anim_Dir: "y",
                el__Pos_Ini: "0%",
                el__Easing: Power3.easeOut,

                el_Content__Pos_Ini: "100%",
                el_Content__Easing: Power3.easeOut,

                cover__Easing: Power3.easeOut,
            });
            cover_animation({
                class_Name: ".slide-up2x",
                el__Time: 0.6,
                el_Content__Time: 0.6,
                cover__Time: 0.6,
                el__Stagger_Time: 0.2,
                el_Content__Stagger_Time: 0.2,
                // each_Group_Delay: 0.2,
                initial_Delay: 0,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: false,
                no_Cover: false,
                double_Reveal: true,
                double_Cover: false,
                triple_Cover: false,
                anim_Dir: "y",
                el__Pos_Ini: "0%",
                // el__Easing: Power2.easeOut,

                el_Content__Pos_Ini: "100%",
                // el_Content__Easing: Power2.easeOut,

                // cover__Easing: Power2.easeOut,
            });
            // cover_animation.playAnim();
            cover_animation({
                class_Name: ".text-cover",
                // el__Time: 1,
                el_Content__Time: 0.6,
                cover__Time: 0.6,
                // el__Stagger_Time: 2,
                el_Content__Stagger_Time: 0.1,
                // each_Group_Delay: 0.2,
                initial_Delay: 0.6,
                // cover__Anim_Dir__To_Default: false,
                // el__Anim_Dir__From_Default: false,
                cover__Draw_From_0: true,
                // no_Cover: false,
                // anim_Dir: "x",
                // el__Pos_Ini: "-100%",
                // el__Easing: Power2.easeOut,

                el_Content__Pos_Ini: "0%",
                // el_Content__Easing: Power2.easeOut,

                // cover__Easing: Power2.easeOut,
            });

            linear_bar_draw_animation();
            linear_bar_draw_animation({

                parent: ".bars--vertical",
                element: ".bar",
                onScroll: true,
                deferred: false,
                deferred_function_name: "playAnim_v",
                // in [ orientation ] option,
                // [ h ] stands for horizontal and
                // [ v ] stands for vertical
                orientation: "v",

                initial_delay: 0,
                transform_origin: "0% 0% 0",

                scale_x: 0.2,
                time_scale_x: .8,
                time_stagger_scale_x: 0.04,
                easing_scale_x: Power4.easeOut,

                scale_y: 0,
                time_scale_y: .4,
                time_stagger_scale_y: 0.02,
                easing_scale_y: Power4.easeOut,
                // The overlap time between
                // two scale animations of the
                // whole group
                time_overlap: "-=1"
            });
        }

        if (!is_mobile) {
            number_counter();
        }
    }


    if (!is_mobile) {
        if (is_desktop) {
            hover_bg_nav();
        }

        dropdown_relative_branch({
            item: $nav.find(".dropdown__branch-wrapper"),
            margin: 10,
        });
        dropdown_relative_branch({
            item: $nav.find(".dropdown__simple").find(".has--dropdown__branch").children("ul"),
            margin: 10,
        });

        side_menu_dropdown_hovering();
        nav_bar_masonry_grid();
        nav_bar_simple_dropdown();
    }

    $window.imagesLoaded(function() {
        // document.fonts.ready.then(function () {
        init_process_slider();
        scroll_spy();
        inpage_scroll();

        if ($("#js-hero__text--shine").length) {
            shinejs();
        }

        if ($("#granim-canvas").length) {
            granim_canvas();
        }

        if ($("#granim-canvas-02").length) {
            granim_canvas_02();
        }

        if ($(".blub-cloudy").length) {
            blub_cloudy();
        }

        if ($("#planetygon").length) {
            planetygon();
        }

        if ($(".prism-slider").length) {
            slideshow.init();
        }

        if ($("#ripples").length) {
            ripples();
        }

        if ($(".background--fluid").length) {
            var scroller = new HeaderScroller(
                document.getElementById("headerImage"),
                document.getElementById("logoImage"),
                document.getElementById("displacementMap")
            );
        }

        if (!is_edge) {
            var tt;
            clearTimeout(tt);
            tt = setTimeout((function() {
                got_top();
            }), 300);
        }
    });
    
    FontFaceOnload("Linearicons-Free", {
        success: function() {

            if (!is_mobile) {

                var xu;
                clearTimeout(xu);
                xu = setTimeout((function() {
                    navbar_switch();
                    navbar_fit();
                }), 100);

                var t;
                clearTimeout(t);
                t = setTimeout((function() {
                    navbar_dropdown_placement();
                    navbar_dropdown_placement({
                        grand_parent: ".nav-bar",
                        element: ".dropdown__block-wrapper",
                        el_min_width: 400,
                    });
                    navbar_dropdown_placement({
                        grand_parent: ".nav-header",
                        element: ".dropdown__block-wrapper",
                        el_min_width: 400,
                    });
                }), 1000);
            }
        },
    });
    



    // ----- Presenting function --- //

    function panelDrawer() {
        var panel = $("#panel-settings"),
            toggle = $("#panel__toggle"),
            tlOpen = new TimelineMax({ paused: true }),
            tlClose = new TimelineMax({ paused: true }),
            opened = 0;

        tlOpen.to(panel, 0.3, { xPercent: -100, ease: Power4.easeOut, force3D: true });
        tlClose.to(panel, 0.3, { xPercent: 0, ease: Power4.easeOut, force3D: true });

        toggle.on('click', function(event) {
            event.preventDefault();
            if (opened === 0) {
                tlOpen.restart();
                opened = 1;
            } else {
                tlClose.restart();
                opened = 0;
            }
        });

        $("#page-contents-wrapper").on('click', function(event) {
            if (opened === 1) {
                event.preventDefault();
                tlClose.restart();
                opened = 0;
            }
        });
    }
    panelDrawer();

    function styleChanger() {
        var linkEl = 0,
            link;

        $('input[type=radio][name=header-color]').change(function() {
            if (this.value == 'dark') {
                $nav_wrapper.addClass('nav--theme-dark');
                $(".panel--header-bg").addClass('dark');

                $("#nav-wrapper").find("a[class*='dark']").each( function() {
                   var value = $(this).attr("class");
                   value = value.replace("-dark", "-white"); // because .replace() returns a new string (it does not modify the existing string)
                   $(this).attr("class", value);
                });

            }
            else if (this.value == 'white') {
                $nav_wrapper.removeClass('nav--theme-dark');
                $(".panel--header-bg").removeClass('dark');

                $("#nav-wrapper").find("a[class*='white']").each( function() {
                   var value = $(this).attr("class");
                   value = value.replace("-white", "-dark"); // because .replace() returns a new string (it does not modify the existing string)
                   $(this).attr("class", value);
                });
            }
        });




        $('input[type=radio][name=corners]').change(function() {
            if (this.value == 'round') {
                $body.addClass('round-corners');
            }
            else if (this.value == 'sharp') {
                $body.removeClass('round-corners');
            }
        });

        var address = $("#theme--special");
            

        $('input[type=radio][name=theme-color]').each(function() {
            var val = $(this).val(),
                lnk,
                loaded = 0;
            
            $(this).on('click', function(event) {
                if (loaded == 0) {
                    if (address.length) {
                        val = address.attr('href').replace(".css", "--" + val);
                    } else {
                        val = 'css/theme--color/' + val;
                    }

                    lnk = $('<link rel="stylesheet" class="theme--added" href="' + val + '.css"/>');
                    lnk.appendTo('head')[0];

                    loaded = 1;
                    $(".theme--added").not(lnk).prop('disabled', true);
                } else {
                    lnk.prop('disabled', false);
                    $(".theme--added").not(lnk).prop('disabled', true);
                }

            });
        });
    }
    styleChanger();
})(jQuery);