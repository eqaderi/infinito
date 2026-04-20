/**
 * The slideshow controller.
 * Get settings and initialise PrismSlider for each layer,
 * add controls and events, then call slideTo method on click.
 * @return {Object} The set of public methods.
 */
var slideshow = (function(window, undefined) {

    'use strict';


    /**
     * Enum dotsNav classes, attributes and
     * provide dotsNav DOM element container.
     */
    var dotsNav = {
        selector: '.prism-dots',
        element: null,
        dot: 'li',
        attrs: {
            active: 'active',
            index: 'data-index'
        }
    };

    var arrows = {
        selector: '.prism-arrows',
        element: null,
        arrow: 'button',
        attrs: {
            disabled: 'disabled ',
            prev: 'arrow--prev',
            next: 'arrow--next',
        }
    };

    /**
     * Enum main element, sizes and provide
     * main DOM element container.
     * @type {Object}
     */
    var container = {
        selector: '.prism-slider',
        element: null,
        autoSizes: {
          w: null,
          h: null
        },
        sizes: {
            w: 1800,
            h: 1000
        }
    };

    /**
     * Set of images to be used.
     * @type {Array}
     */
    var slides = [
        // 'images/backgrounds/dd-a.jpg',
        // 'images/backgrounds/dd-b.jpg',
        // 'images/backgrounds/dd-c.jpg',
        // 'images/backgrounds/dd-d.jpg',
        // 'images/backgrounds/dd-e.jpg',


        'images/backgrounds/pr_01.jpg',
        'images/backgrounds/pr_02.jpg',
        'images/backgrounds/pr_05.jpg',
        'images/backgrounds/pr_10.jpg',


        // 'images/backgrounds/ff5e9d51170473.58e4dcbd54a15.jpg',
        // 'images/backgrounds/kyle-sudu-653089-unsplash.jpg',
        // 'images/backgrounds/mark-basarab-122141-unsplash.jpg',
        // 'images/backgrounds/stock-photo-229854803.jpg',
        // // 'images/backgrounds/dd-f.jpg',
        // // 'images/backgrounds/dd-g.jpg',
        // // 'images/backgrounds/dd-h.jpg',
        // 'images/backgrounds/dd-i.jpg',
        // 'images/backgrounds/dd-j.jpg',
        // // 'images/backgrounds/dd-k.jpg',
        // 'images/backgrounds/dd-l.jpg',
        // 'images/backgrounds/dd-m.jpg',
    ];

    /**
     * Set of masks with related effects.
     * @type {Array}
     */


    // var masks = [{
    //     source: 'images/masks/fold-triangle.svg', // dark green
    //     effects: {
    //         flip: 'Y',
    //         rotate: 0 // degrees
    //     }
    // }, {
    //     source: 'images/masks/fold-f.svg', // green
    //     effects: {
    //         flip: 'X',
    //         rotate: 22.5 // degrees
    //     }
    // }, {
    //     source: 'images/masks/fold-o.svg', // dark red
    //     effects: {
    //         flip: 'Y',
    //         rotate: 45 // degrees
    //     }
    // }, {
    //     source: 'images/masks/fold-l.svg', // brown
    //     effects: {
    //         flip: 'X',
    //         rotate: 67.5 // degrees
    //     }
    // }, {
    //     source: 'images/masks/fold-d.svg', // red
    //     effects: {
    //         flip: 'Y',
    //         rotate: 90 // degrees
    //     }
    // }];



    // var masks = [{
    //     source: 'images/masks/prisma-a.svg', // dark green
    //     effects: {
    //         flip: 'Y',
    //         rotate: 0 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-b.svg', // green
    //     effects: {
    //         flip: 'Y',
    //         rotate: 45 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-c.svg', // dark red
    //     effects: {
    //         flip: 'Y',
    //         rotate: 90 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-d.svg', // brown
    //     effects: {
    //         flip: 'Y',
    //         rotate: 135 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-e.svg', // red
    //     effects: {
    //         flip: 'Y',
    //         rotate: 180 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-f.svg', // blue
    //     effects: {
    //         flip: 'Y',
    //         rotate: 225 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-g.svg', // black
    //     effects: {
    //         flip: 'Y',
    //         rotate: 270 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-h.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 315 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-i.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 10 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-j.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 32 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-k.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 64 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-l.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 96 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-m.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 128 // degrees
    //     }
    // }, {
    //     source: 'images/masks/prisma-n.svg', // purple
    //     effects: {
    //         flip: 'X',
    //         rotate: 160 // degrees
    //     }
    // }];



    var masks = [{
        source: 'images/masks/diamond-a.svg', // dark green
        effects: {
            flip: 'Y',
            rotate: 0 // degrees
        }
    }, {
        source: 'images/masks/diamond-b.svg', // green
        effects: {
            flip: 'Y',
            rotate: 45 // degrees
        }
    }, {
        source: 'images/masks/diamond-d.svg', // dark red
        effects: {
            flip: 'Y',
            rotate: 90 // degrees
        }
    }, {
        source: 'images/masks/diamond-e.svg', // brown
        effects: {
            flip: 'Y',
            rotate: 135 // degrees
        }
    }, {
        source: 'images/masks/diamond-f.svg', // red
        effects: {
            flip: 'Y',
            rotate: 180 // degrees
        }
    }, {
        source: 'images/masks/diamond-g.svg', // blue
        effects: {
            flip: 'Y',
            rotate: 225 // degrees
        }
    }, {
        source: 'images/masks/diamond-h.svg', // black
        effects: {
            flip: 'Y',
            rotate: 270 // degrees
        }
    }, {
        source: 'images/masks/diamond-c.svg', // purple
        effects: {
            flip: 'Y',
            rotate: 315 // degrees
        }
    }];



 // var masks = [{
 //        source: 'img/masks/cobalt-a.svg', // yellow
 //        effects: {
 //            flip: 'Y',
 //            rotate: 205 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-b.svg', // pink
 //        effects: {
 //            flip: 'Y',
 //            rotate: 40 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-c.svg', // dark green
 //        effects: {
 //            flip: 'Y',
 //            rotate: 155 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-d.svg', // light blue
 //        effects: {
 //            flip: 'Y',
 //            rotate: 175 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-e.svg', // red
 //        effects: {
 //            flip: 'Y',
 //            rotate: 10 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-f.svg', // light green
 //        effects: {
 //            flip: 'X',
 //            rotate: 10 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-g.svg', // dark blue
 //        effects: {
 //            flip: 'X',
 //            rotate: 170 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-h.svg', // black
 //        effects: {
 //            flip: 'X',
 //            rotate: 200 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-i.svg', // brown red
 //        effects: {
 //            flip: 'Y',
 //            rotate: 115 // degrees
 //        }
 //    }, {
 //        source: 'img/masks/cobalt-j.svg', // brown yellow
 //        effects: {
 //            flip: 'Y',
 //            rotate: 100 // degrees
 //        }
 //    }];





    //     /**
    //  * Set of masks with related effects.
    //  * @type {Array}
    //  */
    // var masks = [{
    //     source: 'img/masks/polygon-a.svg',
    //     effects: {
    //         flip: 'X',
    //         rotate: 150 // degrees
    //     }
    // }, {
    //     source: 'img/masks/polygon-b.svg',
    //     effects: {
    //         flip: 'X',
    //         rotate: 330 // degrees
    //     }
    // }, {
    //     source: 'img/masks/polygon-c.svg',
    //     effects: {
    //         flip: 'Y',
    //         rotate: 270 // degrees
    //     }
    // }, {
    //     source: 'img/masks/polygon-d.svg',
    //     effects: {
    //         flip: 'Y',
    //         rotate: 90 // degrees
    //     }
    // }, {
    //     source: 'img/masks/polygon-e.svg',
    //     effects: {
    //         flip: 'X',
    //         rotate: 30 // degrees
    //     }
    // }, {
    //     source: 'img/masks/polygon-f.svg',
    //     effects: {
    //         flip: 'X',
    //         rotate: 210 // degrees
    //     }
    // }];



    // alert("ooops");
    console.log("______________________________________________________________________________________________");
    /**
     * Set global easing.
     * @type {Function(currentTime)}
     */
    var easing = Easing.easeInOutQuint;

    /**
     * Set global duration.
     * @type {Number}
     */
    var duration = 1000;

    /**
     * Container for PrismSlider instances.
     * @type {Object}
     */
    var instances = {};


    /**
     * Init.
     */
    function init() {

        getContainer_();

        initSlider_();

        initPrism_();

        addNavigation_();

        addEvents_();
    }


    /**
     * Get main container element, and store in container element.
     */
    function getContainer_() {
        container.element = document.querySelector(container.selector);
        container.autoSizes.w = container.element.offsetWidth;
        container.autoSizes.h = container.element.offsetHeight;
        console.log("container.autoSizes.w , , container.autoSizes.h = " + container.autoSizes.w + " , " + container.autoSizes.h);

    }


    /**
     * Init Slides.
     * Create and initialise main background slider (first layer).
     * Since we'll use this as main slider no mask is given.
     */
    function initSlider_() {

        instances.slider = new PrismSlider({
            container: container,
            slides: slides,
            mask: false,
            duration: duration,
            easing: easing
        });

        // Initialise instance.
        instances.slider.init();
    }


    /**
     * Init Masks.
     * Loop masks variable and create a new layer for each mask object.
     */
    function initPrism_() {

        masks.forEach(function(mask, i) {
            // Generate reference name.
            var name = 'mask_' + i;

            instances[name] = new PrismSlider({
                container: container,
                slides: slides,
                mask: mask, // Here is the mask object.
                duration: duration,
                easing: easing
            });

            // Initialise instance.
            instances[name].init();
        });
    }


    /**
     * Add Navigation.
     * Create a new dot for each slide and add it to dotsNav (ul)
     * with data-index reference.
     */
    var arrow_prev,
        arrow_next,
        dot;

    function addNavigation_() {

        // Store dotsNav element.
        dotsNav.element = document.querySelector(dotsNav.selector);

        slides.forEach(function(slide, i) {

            dot = document.createElement(dotsNav.dot);

            dot.setAttribute(dotsNav.attrs.index, i);

            var dot_btn = document.createElement("button");
            dot.appendChild(dot_btn);

            // When it's first dot set class as active.
            if (i === 0) dot.className = dotsNav.attrs.active;

            dotsNav.element.appendChild(dot);
        });

        // Store arrows element.
        arrows.element = document.querySelector(arrows.selector);
        // Add arrows
        arrow_prev = document.createElement(arrows.arrow);
        arrow_next = arrow_prev.cloneNode(true);

        arrow_prev.className = arrows.attrs.prev;
        arrow_next.className = arrows.attrs.next;

        arrows.element.appendChild(arrow_prev);
        arrows.element.appendChild(arrow_next);

        for (var i = 0; i < 3; i++) {
            var span = document.createElement("span"),
                span2 = document.createElement("span");

            arrow_prev.appendChild(span);
            arrow_next.appendChild(span2);
        }
    }

    // hasClass, takes two params: element and classname
    function hasClass(el, cls) {
        return el.className && new RegExp("(\\s|^)" + cls + "(\\s|$)").test(el.className);
    }


    // /* use like below */
    // // Check if an element has class "foo"
    // if (hasClass(element, "foo")) {

    //   // Show an alert message if it does
    //   alert("Element has the class!");
    // }

    /**
     * Add Events.
     * Bind click on dotsNav.
     */
    function addEvents_() {
        // Detect click on dotsNav elment (ul).
        dotsNav.element.addEventListener('click', function(e) {
            // Get clicked element.
            var targ = e.target;

            var activeIndex;

            // Detect if the clicked element is actually a dot (li).
            var isdot = targ.nodeName === dotsNav.dot.toUpperCase();

            // Check dot and prevent action if animation is in progress.
            if (isdot && !instances.slider.isAnimated) {

                // Get index from data attribute and convert string to number.
                var index = Number(targ.getAttribute(dotsNav.attrs.index));

                // Call slideAllTo method with index.
                slideAllTo_(index);


                arrow_prev.className = arrows.attrs.prev;
                arrow_next.className = arrows.attrs.next;

                console.log("index = " + index + ", dotsNav.element.childNodes.length - 1 = " + dotsNav.element.childNodes.length - 1);
                if (index === 0) {
                    arrow_prev.className = arrows.attrs.disabled + arrows.attrs.prev;
                }

                if (index == dotsNav.element.childNodes.length - 1) {
                    arrow_next.className = arrows.attrs.disabled + arrows.attrs.next;
                }
                // Remove active class from all dotsNav.
                for (var i = 0; i < dotsNav.element.childNodes.length; i++) {
                    dotsNav.element.childNodes[i].className = '';
                }
                // Add active class to clicked dot.
                targ.className = dotsNav.attrs.active;
            }

        });


        arrows.element.addEventListener('click', function(e) {
            // Get clicked element.
            var targ = e.target,
                activeEl,
                activeElBefore,
                activeElAfter,
                activeIndex;

            // Detect if the clicked element is actually a dot (li).
            var isArrow = targ.nodeName === arrows.arrow.toUpperCase();
            // Check dot and prevent action if animation is in progress.
            if (isArrow && !instances.slider.isAnimated) {

                // Remove active class from all dotsNav.
                for (var j = 0; j < dotsNav.element.childNodes.length; j++) {
                    // Check if an element has class "active"
                    if (hasClass(dotsNav.element.childNodes[j], "active")) {
                        activeEl = dotsNav.element.childNodes[j];
                        activeElBefore = dotsNav.element.childNodes[j - 1];
                        activeElAfter = dotsNav.element.childNodes[j + 1];
                        activeIndex = j;
                    }
                }
                // Add active class to clicked dot.
                // targ.className = dotsNav.attrs.active;
                if (targ === arrow_prev && (activeIndex) > 0) {

                    slideAllTo_(activeIndex - 1);

                    arrow_prev.className = arrows.attrs.prev;
                    arrow_next.className = arrows.attrs.next;

                    activeEl.className = '';

                    activeElBefore.className = dotsNav.attrs.active;

                    if (activeIndex === 1) {
                        targ.className = arrows.attrs.disabled + arrows.attrs.prev;
                    }

                } else if (targ === arrow_next && (activeIndex + 1) < dotsNav.element.childNodes.length) {

                    slideAllTo_(activeIndex + 1);

                    arrow_prev.className = arrows.attrs.prev;
                    arrow_next.className = arrows.attrs.next;

                    activeEl.className = '';

                    activeElAfter.className = dotsNav.attrs.active;

                    if ((activeIndex + 1) == dotsNav.element.childNodes.length - 1) {
                        targ.className = arrows.attrs.disabled + arrows.attrs.next;
                    }
                }
            }
        });
    }


    /**
     * Call slideTo method of each instance.
     * In order to sync sliding of all layers we'll loop through the
     * instances object and call the slideTo method for each instance.
     * @param {Number} index The index of the destination slide.
     */
    function slideAllTo_(index) {
        // Loop PrismSlider instances.
        for (var key in instances) {
            if (instances.hasOwnProperty(key)) {
                // Call slideTo for current instance.
                instances[key].slideTo(index);
            }
        }
    }


    return {
        init: init
    };

})(window);



/**
 * Bootstrap slideshow plugin.
 * For demo purposes images are preloaded inside a div hidden with css,
 * the plugin initialisation is delayed through window.onload, in a real life
 * scenario would be better to preload images asynchronously with javascript.
 */
// window.onload = slideshow.init;





























