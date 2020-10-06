parcelRequire = (function (e, r, t, n) {
  var i,
    o = 'function' == typeof parcelRequire && parcelRequire,
    u = 'function' == typeof require && require;
  function f(t, n) {
    if (!r[t]) {
      if (!e[t]) {
        var i = 'function' == typeof parcelRequire && parcelRequire;
        if (!n && i) return i(t, !0);
        if (o) return o(t, !0);
        if (u && 'string' == typeof t) return u(t);
        var c = new Error("Cannot find module '" + t + "'");
        throw ((c.code = 'MODULE_NOT_FOUND'), c);
      }
      (p.resolve = function (r) {
        return e[t][1][r] || r;
      }),
        (p.cache = {});
      var l = (r[t] = new f.Module(t));
      e[t][0].call(l.exports, p, l, l.exports, this);
    }
    return r[t].exports;
    function p(e) {
      return f(p.resolve(e));
    }
  }
  (f.isParcelRequire = !0),
    (f.Module = function (e) {
      (this.id = e), (this.bundle = f), (this.exports = {});
    }),
    (f.modules = e),
    (f.cache = r),
    (f.parent = o),
    (f.register = function (r, t) {
      e[r] = [
        function (e, r) {
          r.exports = t;
        },
        {}
      ];
    });
  for (var c = 0; c < t.length; c++)
    try {
      f(t[c]);
    } catch (e) {
      i || (i = e);
    }
  if (t.length) {
    var l = f(t[t.length - 1]);
    'object' == typeof exports && 'undefined' != typeof module
      ? (module.exports = l)
      : 'function' == typeof define && define.amd
      ? define(function () {
          return l;
        })
      : n && (this[n] = l);
  }
  if (((parcelRequire = f), i)) throw i;
  return f;
})(
  {
    JCLd: [
      function (require, module, exports) {
        function t(e) {
          return (t =
            'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
              ? function (t) {
                  return typeof t;
                }
              : function (t) {
                  return t &&
                    'function' == typeof Symbol &&
                    t.constructor === Symbol &&
                    t !== Symbol.prototype
                    ? 'symbol'
                    : typeof t;
                })(e);
        }
        function e(t, e) {
          return o(t) || r(t, e) || u(t, e) || n();
        }
        function n() {
          throw new TypeError(
            'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
          );
        }
        function r(t, e) {
          if ('undefined' != typeof Symbol && Symbol.iterator in Object(t)) {
            var n = [],
              r = !0,
              o = !1,
              i = void 0;
            try {
              for (
                var c, u = t[Symbol.iterator]();
                !(r = (c = u.next()).done) && (n.push(c.value), !e || n.length !== e);
                r = !0
              );
            } catch (a) {
              (o = !0), (i = a);
            } finally {
              try {
                r || null == u.return || u.return();
              } finally {
                if (o) throw i;
              }
            }
            return n;
          }
        }
        function o(t) {
          if (Array.isArray(t)) return t;
        }
        function i(t) {
          return f(t) || a(t) || u(t) || c();
        }
        function c() {
          throw new TypeError(
            'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
          );
        }
        function u(t, e) {
          if (t) {
            if ('string' == typeof t) return l(t, e);
            var n = Object.prototype.toString.call(t).slice(8, -1);
            return (
              'Object' === n && t.constructor && (n = t.constructor.name),
              'Map' === n || 'Set' === n
                ? Array.from(t)
                : 'Arguments' === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                ? l(t, e)
                : void 0
            );
          }
        }
        function a(t) {
          if ('undefined' != typeof Symbol && Symbol.iterator in Object(t)) return Array.from(t);
        }
        function f(t) {
          if (Array.isArray(t)) return l(t);
        }
        function l(t, e) {
          (null == e || e > t.length) && (e = t.length);
          for (var n = 0, r = new Array(e); n < e; n++) r[n] = t[n];
          return r;
        }
        function s(t, e) {
          if (!(t instanceof e)) throw new TypeError('Cannot call a class as a function');
        }
        function y(t, e) {
          for (var n = 0; n < e.length; n++) {
            var r = e[n];
            (r.enumerable = r.enumerable || !1),
              (r.configurable = !0),
              'value' in r && (r.writable = !0),
              Object.defineProperty(t, r.key, r);
          }
        }
        function p(t, e, n) {
          return e && y(t.prototype, e), n && y(t, n), t;
        }
        function b(t, e) {
          if ('function' != typeof e && null !== e)
            throw new TypeError('Super expression must either be null or a function');
          (t.prototype = Object.create(e && e.prototype, {
            constructor: { value: t, writable: !0, configurable: !0 }
          })),
            e && d(t, e);
        }
        function d(t, e) {
          return (d =
            Object.setPrototypeOf ||
            function (t, e) {
              return (t.__proto__ = e), t;
            })(t, e);
        }
        function m(t) {
          var e = w();
          return function () {
            var n,
              r = g(t);
            if (e) {
              var o = g(this).constructor;
              n = Reflect.construct(r, arguments, o);
            } else n = r.apply(this, arguments);
            return h(this, n);
          };
        }
        function h(e, n) {
          return !n || ('object' !== t(n) && 'function' != typeof n) ? v(e) : n;
        }
        function v(t) {
          if (void 0 === t)
            throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          return t;
        }
        function w() {
          if ('undefined' == typeof Reflect || !Reflect.construct) return !1;
          if (Reflect.construct.sham) return !1;
          if ('function' == typeof Proxy) return !0;
          try {
            return Date.prototype.toString.call(Reflect.construct(Date, [], function () {})), !0;
          } catch (t) {
            return !1;
          }
        }
        function g(t) {
          return (g = Object.setPrototypeOf
            ? Object.getPrototypeOf
            : function (t) {
                return t.__proto__ || Object.getPrototypeOf(t);
              })(t);
        }
        var O = (function (t) {
          b(r, window.HTMLElement);
          var n = m(r);
          function r() {
            var t;
            s(this, r);
            for (var e = arguments.length, o = new Array(e), c = 0; c < e; c++) o[c] = arguments[c];
            return (
              ((t = n.call.apply(n, [this].concat(o))).config = Object.fromEntries(
                i(t.attributes).map(function (t) {
                  return [t.name, t.value];
                })
              )),
              (t.config.clientId = t.config.clientid),
              (t.config.origin = window.location.host),
              (t.style.width = t.config.width),
              t
            );
          }
          return (
            p(r, [
              {
                key: 'connectedCallback',
                value: function () {
                  var t = this.attachShadow({ mode: 'closed' }),
                    n = document.createElement('iframe');
                  (n.src = './index.html'),
                    (n.style = 'border: none; display: block;'),
                    n.setAttribute('frameborder', 0),
                    n.setAttribute('width', this.config.width),
                    n.setAttribute('referrerpolicy', 'unsafe-url'),
                    Object.entries(this.config).forEach(function (t) {
                      var r = e(t, 2),
                        o = r[0],
                        i = r[1];
                      i && (n.dataset[o] = i);
                    }),
                    t.appendChild(n);
                }
              }
            ]),
            r
          );
        })();
        document.addEventListener('DOMContentLoaded', function () {
          window.customElements.define('znaiderest-widget', O);
        });
      },
      {}
    ]
  },
  {},
  ['JCLd'],
  null
);
