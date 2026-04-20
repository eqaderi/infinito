var _smSc = "undefined" != typeof module && module.exports && "undefined" != typeof global ? global : this || window;
! function(e) {
    "use strict";
    var t = e.summitGlobals || e,
        i = function(e) {
            var i, n = e.split("."),
                r = t;
            for (i = 0; i < n.length; i++) r[n[i]] = r = r[n[i]] || {};
            return r
        },
        n = i("com.summit.utils"),
        r = function(e) {
            var t = e.nodeType,
                i = "";
            if (1 === t || 9 === t || 11 === t) {
                if ("string" == typeof e.textContent) return e.textContent;
                for (e = e.firstChild; e; e = e.nextSibling) i += r(e)
            } else if (3 === t || 4 === t) return e.nodeValue;
            return i
        },
        s = document,
        o = s.defaultView ? s.defaultView.getComputedStyle : function() {},
        l = /([A-Z])/g,
        h = "Lettering",
        d = String.fromCharCode(103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109),
        a = (String.fromCharCode(47, 114, 101, 113, 117, 105, 114, 101, 115, 45, 109, 101, 109, 98, 101, 114, 115, 104, 105, 112, 47), function(t) {
            for (var i = -1 !== (e ? e.location.href : "").indexOf(String.fromCharCode(103, 114, 101, 101, 110, 115, 111, 99, 107)) && -1 !== t.indexOf(String.fromCharCode(108, 111, 99, 97, 108, 104, 111, 115, 116)), n = [d, String.fromCharCode(99, 111, 100, 101, 112, 101, 110, 46, 105, 111), String.fromCharCode(99, 111, 100, 101, 112, 101, 110, 46, 100, 101, 118), String.fromCharCode(99, 115, 115, 45, 116, 114, 105, 99, 107, 115, 46, 99, 111, 109), String.fromCharCode(99, 100, 112, 110, 46, 105, 111), String.fromCharCode(103, 97, 110, 110, 111, 110, 46, 116, 118), String.fromCharCode(99, 111, 100, 101, 99, 97, 110, 121, 111, 110, 46, 110, 101, 116), String.fromCharCode(116, 104, 101, 109, 101, 102, 111, 114, 101, 115, 116, 46, 110, 101, 116), String.fromCharCode(99, 101, 114, 101, 98, 114, 97, 120, 46, 99, 111, 46, 117, 107), String.fromCharCode(116, 121, 109, 112, 97, 110, 117, 115, 46, 110, 101, 116), String.fromCharCode(116, 119, 101, 101, 110, 109, 97, 120, 46, 99, 111, 109), String.fromCharCode(116, 119, 101, 101, 110, 108, 105, 116, 101, 46, 99, 111, 109), String.fromCharCode(112, 108, 110, 107, 114, 46, 99, 111), String.fromCharCode(104, 111, 116, 106, 97, 114, 46, 99, 111, 109), String.fromCharCode(106, 115, 102, 105, 100, 100, 108, 101, 46, 110, 101, 116)], r = n.length; --r > -1;)
                if (-1 !== t.indexOf(n[r])) return !0;
            return i && e && e.console && console.log(String.fromCharCode(87, 65, 82, 78, 73, 78, 71, 58, 32, 97, 32, 115, 112, 101, 99, 105, 97, 108, 32, 118, 101, 114, 115, 105, 111, 110, 32, 111, 102, 32) + h + String.fromCharCode(32, 105, 115, 32, 114, 117, 110, 110, 105, 110, 103, 32, 108, 111, 99, 97, 108, 108, 121, 44, 32, 98, 117, 116, 32, 105, 116, 32, 119, 105, 108, 108, 32, 110, 111, 116, 32, 119, 111, 114, 107, 32, 111, 110, 32, 97, 32, 108, 105, 118, 101, 32, 100, 111, 109, 97, 105, 110, 32, 98, 101, 99, 97, 117, 115, 101, 32, 105, 116, 32, 105, 115, 32, 97, 32, 109, 101, 109, 98, 101, 114, 115, 104, 105, 112, 32, 98, 101, 110, 101, 102, 105, 116, 32, 111, 102, 32, 67, 108, 117, 98, 32, 71, 114, 101, 101, 110, 83, 111, 99, 107, 46, 32, 80, 108, 101, 97, 115, 101, 32, 115, 105, 103, 110, 32, 117, 112, 32, 97, 116, 32, 104, 116, 116, 112, 58, 47, 47, 103, 114, 101, 101, 110, 115, 111, 99, 107, 46, 99, 111, 109, 47, 99, 108, 117, 98, 47, 32, 97, 110, 100, 32, 116, 104, 101, 110, 32, 100, 111, 119, 110, 108, 111, 97, 100, 32, 116, 104, 101, 32, 39, 114, 101, 97, 108, 39, 32, 118, 101, 114, 115, 105, 111, 110, 32, 102, 114, 111, 109, 32, 121, 111, 117, 114, 32, 71, 114, 101, 101, 110, 83, 111, 99, 107, 32, 97, 99, 99, 111, 117, 110, 116, 32, 119, 104, 105, 99, 104, 32, 104, 97, 115, 32, 110, 111, 32, 115, 117, 99, 104, 32, 108, 105, 109, 105, 116, 97, 116, 105, 111, 110, 115, 46, 32, 84, 104, 101, 32, 102, 105, 108, 101, 32, 121, 111, 117, 39, 114, 101, 32, 117, 115, 105, 110, 103, 32, 119, 97, 115, 32, 108, 105, 107, 101, 108, 121, 32, 100, 111, 119, 110, 108, 111, 97, 100, 101, 100, 32, 102, 114, 111, 109, 32, 101, 108, 115, 101, 119, 104, 101, 114, 101, 32, 111, 110, 32, 116, 104, 101, 32, 119, 101, 98, 32, 97, 110, 100, 32, 105, 115, 32, 114, 101, 115, 116, 114, 105, 99, 116, 101, 100, 32, 116, 111, 32, 108, 111, 99, 97, 108, 32, 117, 115, 101, 32, 111, 114, 32, 111, 110, 32, 115, 105, 116, 101, 115, 32, 108, 105, 107, 101, 32, 99, 111, 100, 101, 112, 101, 110, 46, 105, 111, 46)), i
        }(e ? e.location.host : ""), function(e, t, i, n) {
            var r;
            return (i = i || o(e, null)) ? (e = i.getPropertyValue(t.replace(l, "-$1").toLowerCase()), r = e || i.length ? e : i[t]) : e.currentStyle && (i = e.currentStyle, r = i[t]), n ? r : parseInt(r, 10) || 0
        }),
        f = function(e) {
            return e.length && e[0] && (e[0].nodeType && e[0].style && !e.nodeType || e[0].length && e[0][0]) ? !0 : !1
        },
        p = function(e) {
            var t, i, n, r = [],
                s = e.length;
            for (t = 0; s > t; t++)
                if (i = e[t], f(i))
                    for (n = i.length, n = 0; n < i.length; n++) r.push(i[n]);
                else r.push(i);
            return r
        },
        u = /(?:\r|\n|\s\s|\t\t)/g,
        c = ")eefec303079ad17405c",
        g = /(?:<br>|<br\/>|<br \/>)/gi,
        m = s.all && !s.addEventListener,
        C = " style='position:relative;display:inline-block;" + (m ? "*display:inline;*zoom:1;'" : "'"),
        y = function(e, t) {
            e = e || "";
            var i = -1 !== e.indexOf("++"),
                n = 1;
            return i && (e = e.split("++").join("")),
                function() {
                    return "<" + t + C + (e ? " class='" + e + (i ? n++ : "") + "'>" : ">")
                }
        },
        x = n.Lettering = t.Lettering = function(e, t) {
            if ("string" == typeof e && (e = x.selector(e)), !e) throw "cannot split a null element.";
            this.elements = f(e) ? p(e) : [e], this.letters = [], this.words = [], this.lines = [], this._originals = [], this.vars = t || {}, void this.split(t)
        },
        S = function(e, t, i) {
            var n = e.nodeType;
            if (1 === n || 9 === n || 11 === n)
                for (e = e.firstChild; e; e = e.nextSibling) S(e, t, i);
            else(3 === n || 4 === n) && (e.nodeValue = e.nodeValue.split(t).join(i))
        },
        v = function(e, t) {
            for (var i = t.length; --i > -1;) e.push(t[i])
        },
        b = function(e, t, i, n, l) {
            g.test(e.innerHTML) && (e.innerHTML = e.innerHTML.replace(g, c));
            var h, d, f, p, m, C, x, b, T, _, L, w, H, N, B = r(e),
                M = t.span ? "span" : "div",
                W = t.type || t.split || "letters,words,lines",
                A = -1 !== W.indexOf("lines") ? [] : null,
                O = -1 !== W.indexOf("words"),
                R = -1 !== W.indexOf("letters"),
                j = "absolute" === t.position || t.absolute === !0,
                E = j ? "&#173; " : " ",
                V = -999,
                k = o(e),
                $ = a(e, "paddingLeft", k),
                q = a(e, "borderBottomWidth", k) + a(e, "borderTopWidth", k),
                z = a(e, "borderLeftWidth", k) + a(e, "borderRightWidth", k),
                G = a(e, "paddingTop", k) + a(e, "paddingBottom", k),
                I = a(e, "paddingLeft", k) + a(e, "paddingRight", k),
                P = a(e, "textAlign", k, !0),
                Q = .2 * a(e, "fontSize"),
                Z = e.clientHeight,
                D = e.clientWidth,
                F = t.span ? "</span>" : "</div>",
                J = y(t.wordsClass, M),
                K = y(t.lettersClass, M),
                U = -1 !== (t.linesClass || "").indexOf("++"),
                X = t.linesClass,
                Y = -1 !== B.indexOf("<"),
                et = !0,
                tt = [],
                it = [],
                nt = [];
            for (0 != !t.reduceWhiteSpace && (B = B.replace(u, "")), U && (X = X.split("++").join("")), Y && (B = B.split("<").join("{{LT}}")), h = B.length, p = J(), m = 0; h > m; m++)
                if (x = B.charAt(m), ")" === x && B.substr(m, 20) === c) p += (et ? F : "") + "<BR/>", et = !1, m !== h - 20 && B.substr(m + 20, 20) !== c && (p += " " + J(), et = !0), m += 19;
                else if (" " === x && " " !== B.charAt(m - 1) && m !== h - 1 && B.substr(m - 20, 20) !== c) {
                for (p += et ? F : "", et = !1;
                    " " === B.charAt(m + 1);) p += E, m++;
                (")" !== B.charAt(m + 1) || B.substr(m + 1, 20) !== c) && (p += E + J(), et = !0)
            } else "{" === x && "{{LT}}" === B.substr(m, 6) ? (p += R ? K() + "{{LT}}</" + M + ">" : "{{LT}}", m += 5) : p += R && " " !== x ? K() + x + "</" + M + ">" : x;
            for (e.innerHTML = p + (et ? F : ""), Y && S(e, "{{LT}}", "<"), C = e.getElementsByTagName("*"), h = C.length, b = [], m = 0; h > m; m++) b[m] = C[m];
            if (A || j)
                for (m = 0; h > m; m++) T = b[m], f = T.parentNode === e, (f || j || R && !O) && (_ = T.offsetTop, A && f && Math.abs(_ - V) > Q && "BR" !== T.nodeName && (d = [], A.push(d), V = _), j && (T._x = T.offsetLeft, T._y = _, T._w = T.offsetWidth, T._h = T.offsetHeight), A && (O !== f && R || (d.push(T), T._x -= $), f && m && (b[m - 1]._wordEnd = !0), "BR" === T.nodeName && T.nextSibling && "BR" === T.nextSibling.nodeName && A.push([])));
            for (m = 0; h > m; m++) T = b[m], f = T.parentNode === e, "BR" !== T.nodeName ? (j && (w = T.style, O || f || (T._x += T.parentNode._x, T._y += T.parentNode._y), w.left = T._x + "px", w.top = T._y + "px", w.position = "absolute", w.display = "inline-block", w.width = T._w + 1 + "px", w.height = T._h + "px"), O ? f && "" !== T.innerHTML ? it.push(T) : R && tt.push(T) : f ? (e.removeChild(T), b.splice(m--, 1), h--) : !f && R && (_ = !A && !j && T.nextSibling, e.appendChild(T), _ || e.appendChild(s.createTextNode(" ")), tt.push(T))) : A || j ? (e.removeChild(T), b.splice(m--, 1), h--) : O || e.appendChild(T);
            if (A) {
                for (j && (L = s.createElement(M), e.appendChild(L), H = L.offsetWidth + "px", _ = L.offsetParent === e ? 0 : e.offsetLeft, e.removeChild(L)), w = e.style.cssText, e.style.cssText = "display:none;"; e.firstChild;) e.removeChild(e.firstChild);
                for (N = !j || !O && !R, m = 0; m < A.length; m++) {
                    for (d = A[m], L = s.createElement(M), L.style.cssText = "display:block;text-align:" + P + ";position:" + (j ? "absolute;" : "relative;"), X && (L.className = X + (U ? m + 1 : "")), nt.push(L), h = d.length, C = 0; h > C; C++) "BR" !== d[C].nodeName && (T = d[C], L.appendChild(T), N && (T._wordEnd || O) && L.appendChild(s.createTextNode(" ")), j && (0 === C && (L.style.top = T._y + "px", L.style.left = $ + _ + "px"), T.style.top = "0px", _ && (T.style.left = T._x - _ + "px")));
                    0 === h && (L.innerHTML = "&nbsp;"), O || R || (L.innerHTML = r(L).split(String.fromCharCode(160)).join(" ")), j && (L.style.width = H, L.style.height = T._h + "px"), e.appendChild(L)
                }
                e.style.cssText = w
            }
            j && (Z > e.clientHeight && (e.style.height = Z - G + "px", e.clientHeight < Z && (e.style.height = Z + q + "px")), D > e.clientWidth && (e.style.width = D - I + "px", e.clientWidth < D && (e.style.width = D + z + "px"))), v(i, tt), v(n, it), v(l, nt)
        },
        T = x.prototype;
    T.split = function(e) {
        this.isSplit && this.revert(), this.vars = e || this.vars, this._originals.length = this.letters.length = this.words.length = this.lines.length = 0;
        for (var t = this.elements.length; --t > -1;) this._originals[t] = this.elements[t].innerHTML, b(this.elements[t], this.vars, this.letters, this.words, this.lines);
        return this.letters.reverse(), this.words.reverse(), this.lines.reverse(), this.isSplit = !0, this
    }, T.revert = function() {
        if (!this._originals) throw "revert() call wasn't scoped properly.";
        for (var e = this._originals.length; --e > -1;) this.elements[e].innerHTML = this._originals[e];
        return this.letters = [], this.words = [], this.lines = [], this.isSplit = !1, this
    }, x.selector = e.$ || e.jQuery || function(t) {
        var i = e.$ || e.jQuery;
        return i ? (x.selector = i, i(t)) : "undefined" == typeof document ? t : document.querySelectorAll ? document.querySelectorAll(t) : document.getElementById("#" === t.charAt(0) ? t.substr(1) : t)
    }, x.version = "0.3.6"
}(_smSc),
function(e) {
    "use strict";
    var t = function() {
        return (_smSc.summitGlobals || _smSc)[e]
    };
    "function" == typeof define && define.amd ? define([], t) : "undefined" != typeof module && module.exports && (module.exports = t())
}("Lettering");
