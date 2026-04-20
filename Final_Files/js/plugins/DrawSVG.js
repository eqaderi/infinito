/*!
 * VERSION: 0.2.0
 * DATE: 2016-08-16
 * UPDATES AND DOCS AT: http://greensock.com
 *
 * This is a special version of the plugin that is only to be used on certain sites like codepen.io. It will redirect to a page on GreenSock.com if you try using it on a different domain. Please sign up for Club GreenSock to get the fully-functional version at http://greensock.com/club/
 *
 * @license Copyright (c) 2008-2016, GreenSock. All rights reserved.
 * DrawSVGPlugin is a Club GreenSock membership benefit; You must have a valid membership to use
 * this code without violating the terms of use. Visit http://greensock.com/club/ to sign up or get more details.
 * For licensing details, see http://greensock.com/licensing/
 *
 * @author: Jack Doyle, jack@greensock.com
 */
var _gsScope = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
(_gsScope._gsQueue || (_gsScope._gsQueue = [])).push(function () {
        "use strict";

        function i(a, b, c, d, e, f) {
            return c = (parseFloat(c) - parseFloat(a)) * e, d = (parseFloat(d) - parseFloat(b)) * f, Math.sqrt(c * c + d * d)
        }

        function j(a) {
            return "string" != typeof a && a.nodeType || (a = _gsScope.TweenLite.selector(a), a.length && (a = a[0])), a
        }

        function k(a, b, c) {
            var e, f, d = a.indexOf(" ");
            return -1 === d ? (e = void 0 !== c ? c + "" : a, f = a) : (e = a.substr(0, d), f = a.substr(d + 1)), e = -1 !== e.indexOf("%") ? parseFloat(e) / 100 * b : parseFloat(e), f = -1 !== f.indexOf("%") ? parseFloat(f) / 100 * b : parseFloat(f), e > f ? [f, e] : [e, f]
        }

        function l(a) {
            if (!a) return 0;
            a = j(a);
            var f, g, h, k, l, m, n, c = a.tagName.toLowerCase(),
                d = 1,
                e = 1;
            if ("non-scaling-stroke" === a.getAttribute("vector-effect") && (e = a.getScreenCTM(), d = e.a, e = e.d), "path" === c) {
                k = a.style.strokeDasharray, a.style.strokeDasharray = "none", f = a.getTotalLength() || 0, d !== e && console.log("Warning: <path> length cannot be measured accurately when vector-effect is non-scaling-stroke and the element isn't proportionally scaled."), f *= (d + e) / 2;
                try {
                    g = a.getBBox()
                } catch (o) {}
                a.style.strokeDasharray = k
            } else if ("rect" === c) f = 2 * a.getAttribute("width") * d + 2 * a.getAttribute("height") * e;
            else if ("line" === c) f = i(a.getAttribute("x1"), a.getAttribute("y1"), a.getAttribute("x2"), a.getAttribute("y2"), d, e);
            else if ("polyline" === c || "polygon" === c)
                for (h = a.getAttribute("points").match(b) || [], "polygon" === c && h.push(h[0], h[1]), f = 0, l = 2; l < h.length; l += 2) f += i(h[l - 2], h[l - 1], h[l], h[l + 1], d, e) || 0;
            else("circle" === c || "ellipse" === c) && (m = parseFloat(a.getAttribute("circle" === c ? "r" : "rx")) * d, n = parseFloat(a.getAttribute("circle" === c ? "r" : "ry")) * e, f = Math.PI * (3 * (m + n) - Math.sqrt((3 * m + n) * (m + 3 * n))));
            return f || 0
        }

        function m(b, c) {
            if (!b) return [0, 0];
            b = j(b), c = c || l(b) + 1;
            var d = a(b),
                e = d.strokeDasharray || "",
                f = parseFloat(d.strokeDashoffset),
                g = e.indexOf(",");
            return 0 > g && (g = e.indexOf(" ")), e = 0 > g ? c : parseFloat(e.substr(0, g)) || 1e-5, e > c && (e = c), [Math.max(0, -f), Math.max(0, e - f)]
        }
        var c, a = document.defaultView ? document.defaultView.getComputedStyle : function () {},
            b = /(?:(-|-=|\+=)?\d*\.?\d*(?:e[\-+]?\d+)?)[0-9]/gi,
            d = "codepen",
            e = "DrawSVGPlugin",
            f = String.fromCharCode(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109),
            g = String.fromCharCode(47, 114, 101, 113, 117, 105, 114, 101, 115, 45, 109, 101, 109, 98, 101, 114, 115, 104, 105, 112, 47),
            h = true;
        c = _gsScope._gsDefine.plugin({
            propName: "drawSVG",
            API: 2,
            version: "0.1.1",
            global: !0,
            overwriteProps: ["drawSVG"],
            init: function (a, b, c, i) {
                if (!a.getBBox) return !1;
                var n, o, p, j = l(a) + 1;
                return this._style = a.style, "function" == typeof b && (b = b(i, a)), b === !0 || "true" === b ? b = "0 100%" : b ? -1 === (b + "").indexOf(" ") && (b = "0 " + b) : b = "0 0", n = m(a, j), o = k(b, j, n[0]), this._length = j + 10, 0 === n[0] && 0 === o[0] ? (p = Math.max(1e-5, o[1] - j), this._dash = j + p, this._offset = j - n[1] + p, this._addTween(this, "_offset", this._offset, j - o[1] + p, "drawSVG")) : (this._dash = n[1] - n[0] || 1e-6, this._offset = -n[0], this._addTween(this, "_dash", this._dash, o[1] - o[0] || 1e-5, "drawSVG"), this._addTween(this, "_offset", this._offset, -o[0], "drawSVG")), !0
            },
            set: function (a) {
                this._firstPT && (this._super.setRatio.call(this, a), this._style.strokeDashoffset = this._offset, 1 === a || 0 === a ? this._style.strokeDasharray = this._offset < .001 && this._length - this._dash <= 10 ? "none" : this._offset === this._dash ? "0px, 999999px" : this._dash + "px," + this._length + "px" : this._style.strokeDasharray = this._dash + "px," + this._length + "px")
            }
        }), c.getLength = l, c.getPosition = m
    }), _gsScope._gsDefine && _gsScope._gsQueue.pop()(),
    function (a) {
        "use strict";
        var b = function () {
            return (_gsScope.GreenSockGlobals || _gsScope)[a]
        };
        "function" == typeof define && define.amd ? define(["TweenLite"], b) : "undefined" != typeof module && module.exports && (require("../TweenLite.js"), module.exports = b())
    }("DrawSVGPlugin");
