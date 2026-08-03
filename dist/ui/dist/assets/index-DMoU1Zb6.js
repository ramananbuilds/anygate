var kl = Object.defineProperty
var Ds = t => {
  throw TypeError(t)
}
var Sl = (t, e, r) =>
  e in t ? kl(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (t[e] = r)
var We = (t, e, r) => Sl(t, typeof e != 'symbol' ? e + '' : e, r),
  Ga = (t, e, r) => e.has(t) || Ds('Cannot ' + r)
var x = (t, e, r) => (Ga(t, e, 'read from private field'), r ? r.call(t) : e.get(t)),
  de = (t, e, r) =>
    e.has(t)
      ? Ds('Cannot add the same private member more than once')
      : e instanceof WeakSet
        ? e.add(t)
        : e.set(t, r),
  oe = (t, e, r, a) => (Ga(t, e, 'write to private field'), a ? a.call(t, r) : e.set(t, r), r),
  ye = (t, e, r) => (Ga(t, e, 'access private method'), r)
;(function () {
  const e = document.createElement('link').relList
  if (e && e.supports && e.supports('modulepreload')) return
  for (const s of document.querySelectorAll('link[rel="modulepreload"]')) a(s)
  new MutationObserver(s => {
    for (const l of s)
      if (l.type === 'childList')
        for (const i of l.addedNodes) i.tagName === 'LINK' && i.rel === 'modulepreload' && a(i)
  }).observe(document, { childList: !0, subtree: !0 })
  function r(s) {
    const l = {}
    return (
      s.integrity && (l.integrity = s.integrity),
      s.referrerPolicy && (l.referrerPolicy = s.referrerPolicy),
      s.crossOrigin === 'use-credentials'
        ? (l.credentials = 'include')
        : s.crossOrigin === 'anonymous'
          ? (l.credentials = 'omit')
          : (l.credentials = 'same-origin'),
      l
    )
  }
  function a(s) {
    if (s.ep) return
    s.ep = !0
    const l = r(s)
    fetch(s.href, l)
  }
})()
const on = !1
var ws = Array.isArray,
  Pl = Array.prototype.indexOf,
  Oa = Array.prototype.includes,
  Ha = Array.from,
  El = Object.defineProperty,
  $r = Object.getOwnPropertyDescriptor,
  vn = Object.getOwnPropertyDescriptors,
  Ml = Object.prototype,
  zl = Array.prototype,
  bs = Object.getPrototypeOf,
  js = Object.isExtensible
const dn = () => {}
function Al(t) {
  return t()
}
function es(t) {
  for (var e = 0; e < t.length; e++) t[e]()
}
function cn() {
  var t,
    e,
    r = new Promise((a, s) => {
      ;((t = a), (e = s))
    })
  return { promise: r, resolve: t, reject: e }
}
const je = 2,
  Br = 4,
  ga = 8,
  un = 1 << 24,
  xt = 16,
  _t = 32,
  Kt = 64,
  ts = 128,
  pt = 512,
  Ne = 1024,
  Re = 2048,
  St = 4096,
  Je = 8192,
  it = 16384,
  Vr = 32768,
  rs = 1 << 25,
  kr = 65536,
  $a = 1 << 17,
  Tl = 1 << 18,
  Yr = 1 << 19,
  fn = 1 << 20,
  Ct = 1 << 25,
  Sr = 65536,
  La = 1 << 21,
  Lr = 1 << 22,
  nr = 1 << 23,
  Ut = Symbol('$state'),
  Cl = Symbol('legacy props'),
  Il = Symbol(''),
  Ea = Symbol('attributes'),
  as = Symbol('class'),
  ss = Symbol('style'),
  ta = Symbol('text'),
  Ma = Symbol('form reset'),
  ma = new (class extends Error {
    constructor() {
      super(...arguments)
      We(this, 'name', 'StaleReactionError')
      We(this, 'message', 'The reaction that called `getAbortSignal()` was re-run or destroyed')
    }
  })()
var sn
const Ol =
  !!((sn = globalThis.document) != null && sn.contentType) &&
  globalThis.document.contentType.includes('xml')
function $l(t) {
  throw new Error('https://svelte.dev/e/lifecycle_outside_component')
}
function Ll() {
  throw new Error('https://svelte.dev/e/async_derived_orphan')
}
function Nl(t, e, r) {
  throw new Error('https://svelte.dev/e/each_key_duplicate')
}
function Rl(t) {
  throw new Error('https://svelte.dev/e/effect_in_teardown')
}
function Fl() {
  throw new Error('https://svelte.dev/e/effect_in_unowned_derived')
}
function Dl(t) {
  throw new Error('https://svelte.dev/e/effect_orphan')
}
function jl() {
  throw new Error('https://svelte.dev/e/effect_update_depth_exceeded')
}
function ql(t) {
  throw new Error('https://svelte.dev/e/props_invalid_value')
}
function Hl() {
  throw new Error('https://svelte.dev/e/state_descriptors_fixed')
}
function Bl() {
  throw new Error('https://svelte.dev/e/state_prototype_fixed')
}
function Ul() {
  throw new Error('https://svelte.dev/e/state_unsafe_mutation')
}
function Gl() {
  throw new Error('https://svelte.dev/e/svelte_boundary_reset_onerror')
}
const Kl = 1,
  Wl = 2,
  hn = 4,
  Vl = 8,
  Yl = 16,
  Jl = 1,
  Xl = 2,
  Zl = 4,
  Ql = 8,
  ei = 16,
  ti = 1,
  ri = 2,
  Le = Symbol('uninitialized'),
  pn = 'http://www.w3.org/1999/xhtml',
  ai = 'http://www.w3.org/2000/svg',
  si = 'http://www.w3.org/1998/Math/MathML'
function ni() {
  console.warn('https://svelte.dev/e/derived_inert')
}
function li() {
  console.warn('https://svelte.dev/e/select_multiple_invalid_value')
}
function ii() {
  console.warn('https://svelte.dev/e/svelte_boundary_reset_noop')
}
function _n(t) {
  return t === this.v
}
function oi(t, e) {
  return t != t ? e == e : t !== e || (t !== null && typeof t == 'object') || typeof t == 'function'
}
function gn(t) {
  return !oi(t, this.v)
}
let Jr = !1,
  vi = !1
function di() {
  Jr = !0
}
let Me = null
function Ur(t) {
  Me = t
}
function pe(t, e = !1, r) {
  Me = {
    p: Me,
    i: !1,
    c: null,
    e: null,
    s: t,
    x: null,
    r: ce,
    l: Jr && !e ? { s: null, u: null, $: [] } : null,
  }
}
function _e(t) {
  var e = Me,
    r = e.e
  if (r !== null) {
    e.e = null
    for (var a of r) Dn(a)
  }
  return ((e.i = !0), (Me = e.p), {})
}
function ya() {
  return !Jr || (Me !== null && Me.l === null)
}
let dr = []
function mn() {
  var t = dr
  ;((dr = []), es(t))
}
function lr(t) {
  if (dr.length === 0 && !ia) {
    var e = dr
    queueMicrotask(() => {
      e === dr && mn()
    })
  }
  dr.push(t)
}
function ci() {
  for (; dr.length > 0;) mn()
}
function yn(t) {
  var e = ce
  if (e === null) return ((ue.f |= nr), t)
  if ((e.f & Vr) === 0 && (e.f & Br) === 0) throw t
  tr(t, e)
}
function tr(t, e) {
  if (!(e !== null && (e.f & it) !== 0)) {
    for (; e !== null;) {
      if ((e.f & ts) !== 0) {
        if ((e.f & Vr) === 0) throw t
        try {
          e.b.error(t)
          return
        } catch (r) {
          t = r
        }
      }
      e = e.parent
    }
    throw t
  }
}
const ui = -7169
function Te(t, e) {
  t.f = (t.f & ui) | e
}
function xs(t) {
  ;(t.f & pt) !== 0 || t.deps === null ? Te(t, Ne) : Te(t, St)
}
function wn(t) {
  if (t !== null)
    for (const e of t) (e.f & je) === 0 || (e.f & Sr) === 0 || ((e.f ^= Sr), wn(e.deps))
}
function bn(t, e, r) {
  ;((t.f & Re) !== 0 ? e.add(t) : (t.f & St) !== 0 && r.add(t), wn(t.deps), Te(t, Ne))
}
let ka = !1
function fi(t) {
  var e = ka
  try {
    return ((ka = !1), [t(), ka])
  } finally {
    ka = e
  }
}
let qs = !1
function hi() {
  qs ||
    ((qs = !0),
    document.addEventListener(
      'reset',
      t => {
        Promise.resolve().then(() => {
          var e
          if (!t.defaultPrevented)
            for (const r of t.target.elements) (e = r[Ma]) == null || e.call(r)
        })
      },
      { capture: !0 }
    ))
}
function Xr(t) {
  var e = ue,
    r = ce
  ;(gt(null), Lt(null))
  try {
    return t()
  } finally {
    ;(gt(e), Lt(r))
  }
}
function xn(t, e, r, a = r) {
  t.addEventListener(e, () => Xr(r))
  const s = t[Ma]
  ;(s
    ? (t[Ma] = () => {
        ;(s(), a(!0))
      })
    : (t[Ma] = () => a(!0)),
    hi())
}
function pi(t) {
  let e = 0,
    r = Er(0),
    a
  return () => {
    Ms() &&
      (n(r),
      As(
        () => (
          e === 0 && (a = Zr(() => t(() => oa(r)))),
          (e += 1),
          () => {
            lr(() => {
              ;((e -= 1), e === 0 && (a == null || a(), (a = void 0), oa(r)))
            })
          }
        )
      ))
  }
}
var _i = kr | Yr
function gi(t, e, r, a) {
  new mi(t, e, r, a)
}
var ct,
  ys,
  ut,
  fr,
  Ze,
  ft,
  Ve,
  nt,
  jt,
  hr,
  Qt,
  Nr,
  ua,
  fa,
  qt,
  Da,
  ze,
  yi,
  wi,
  bi,
  ns,
  za,
  Aa,
  ls,
  is
class mi {
  constructor(e, r, a, s) {
    de(this, ze)
    We(this, 'parent')
    We(this, 'is_pending', !1)
    We(this, 'transform_error')
    de(this, ct)
    de(this, ys, null)
    de(this, ut)
    de(this, fr)
    de(this, Ze)
    de(this, ft, null)
    de(this, Ve, null)
    de(this, nt, null)
    de(this, jt, null)
    de(this, hr, 0)
    de(this, Qt, 0)
    de(this, Nr, !1)
    de(this, ua, new Set())
    de(this, fa, new Set())
    de(this, qt, null)
    de(
      this,
      Da,
      pi(
        () => (
          oe(this, qt, Er(x(this, hr))),
          () => {
            oe(this, qt, null)
          }
        )
      )
    )
    var l
    ;(oe(this, ct, e),
      oe(this, ut, r),
      oe(this, fr, i => {
        var v = ce
        ;((v.b = this), (v.f |= ts), a(i))
      }),
      (this.parent = ce.b),
      (this.transform_error =
        s ?? ((l = this.parent) == null ? void 0 : l.transform_error) ?? (i => i)),
      oe(
        this,
        Ze,
        Ba(() => {
          ye(this, ze, ns).call(this)
        }, _i)
      ))
  }
  defer_effect(e) {
    bn(e, x(this, ua), x(this, fa))
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered())
  }
  has_pending_snippet() {
    return !!x(this, ut).pending
  }
  update_pending_count(e, r) {
    ;(ye(this, ze, ls).call(this, e, r),
      oe(this, hr, x(this, hr) + e),
      !(!x(this, qt) || x(this, Nr)) &&
        (oe(this, Nr, !0),
        lr(() => {
          ;(oe(this, Nr, !1), x(this, qt) && Kr(x(this, qt), x(this, hr)))
        })))
  }
  get_effect_pending() {
    return (x(this, Da).call(this), n(x(this, qt)))
  }
  error(e) {
    if (!x(this, ut).onerror && !x(this, ut).failed) throw e
    ae != null && ae.is_fork
      ? (x(this, ft) && ae.skip_effect(x(this, ft)),
        x(this, Ve) && ae.skip_effect(x(this, Ve)),
        x(this, nt) && ae.skip_effect(x(this, nt)),
        ae.oncommit(() => {
          ye(this, ze, is).call(this, e)
        }))
      : ye(this, ze, is).call(this, e)
  }
}
;((ct = new WeakMap()),
  (ys = new WeakMap()),
  (ut = new WeakMap()),
  (fr = new WeakMap()),
  (Ze = new WeakMap()),
  (ft = new WeakMap()),
  (Ve = new WeakMap()),
  (nt = new WeakMap()),
  (jt = new WeakMap()),
  (hr = new WeakMap()),
  (Qt = new WeakMap()),
  (Nr = new WeakMap()),
  (ua = new WeakMap()),
  (fa = new WeakMap()),
  (qt = new WeakMap()),
  (Da = new WeakMap()),
  (ze = new WeakSet()),
  (yi = function () {
    try {
      oe(
        this,
        ft,
        ht(() => x(this, fr).call(this, x(this, ct)))
      )
    } catch (e) {
      this.error(e)
    }
  }),
  (wi = function (e) {
    const r = x(this, ut).failed
    r &&
      oe(
        this,
        nt,
        ht(() => {
          r(
            x(this, ct),
            () => e,
            () => () => {}
          )
        })
      )
  }),
  (bi = function () {
    const e = x(this, ut).pending
    e &&
      ((this.is_pending = !0),
      oe(
        this,
        Ve,
        ht(() => e(x(this, ct)))
      ),
      lr(() => {
        var r = oe(this, jt, document.createDocumentFragment()),
          a = Gt()
        ;(r.append(a),
          oe(
            this,
            ft,
            ye(this, ze, Aa).call(this, () => ht(() => x(this, fr).call(this, a)))
          ),
          x(this, Qt) === 0 &&
            (x(this, ct).before(r),
            oe(this, jt, null),
            yr(x(this, Ve), () => {
              oe(this, Ve, null)
            }),
            ye(this, ze, za).call(this, ae)))
      }))
  }),
  (ns = function () {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        oe(this, Qt, 0),
        oe(this, hr, 0),
        oe(
          this,
          ft,
          ht(() => {
            x(this, fr).call(this, x(this, ct))
          })
        ),
        x(this, Qt) > 0)
      ) {
        var e = oe(this, jt, document.createDocumentFragment())
        Cs(x(this, ft), e)
        const r = x(this, ut).pending
        oe(
          this,
          Ve,
          ht(() => r(x(this, ct)))
        )
      } else ye(this, ze, za).call(this, ae)
    } catch (r) {
      this.error(r)
    }
  }),
  (za = function (e) {
    ;((this.is_pending = !1), e.transfer_effects(x(this, ua), x(this, fa)))
  }),
  (Aa = function (e) {
    var r = ce,
      a = ue,
      s = Me
    ;(Lt(x(this, Ze)), gt(x(this, Ze)), Ur(x(this, Ze).ctx))
    try {
      return (Pr.ensure(), e())
    } catch (l) {
      return (yn(l), null)
    } finally {
      ;(Lt(r), gt(a), Ur(s))
    }
  }),
  (ls = function (e, r) {
    var a
    if (!this.has_pending_snippet()) {
      this.parent && ye((a = this.parent), ze, ls).call(a, e, r)
      return
    }
    ;(oe(this, Qt, x(this, Qt) + e),
      x(this, Qt) === 0 &&
        (ye(this, ze, za).call(this, r),
        x(this, Ve) &&
          yr(x(this, Ve), () => {
            oe(this, Ve, null)
          }),
        x(this, jt) && (x(this, ct).before(x(this, jt)), oe(this, jt, null))))
  }),
  (is = function (e) {
    ;(x(this, ft) && (tt(x(this, ft)), oe(this, ft, null)),
      x(this, Ve) && (tt(x(this, Ve)), oe(this, Ve, null)),
      x(this, nt) && (tt(x(this, nt)), oe(this, nt, null)))
    var r = x(this, ut).onerror
    let a = x(this, ut).failed
    var s = !1,
      l = !1
    const i = () => {
        if (s) {
          ii()
          return
        }
        ;((s = !0),
          l && Gl(),
          x(this, nt) !== null &&
            yr(x(this, nt), () => {
              oe(this, nt, null)
            }),
          ye(this, ze, Aa).call(this, () => {
            ye(this, ze, ns).call(this)
          }))
      },
      v = o => {
        try {
          ;((l = !0), r == null || r(o, i), (l = !1))
        } catch (d) {
          tr(d, x(this, Ze) && x(this, Ze).parent)
        }
        a &&
          oe(
            this,
            nt,
            ye(this, ze, Aa).call(this, () => {
              try {
                return ht(() => {
                  var d = ce
                  ;((d.b = this),
                    (d.f |= ts),
                    a(
                      x(this, ct),
                      () => o,
                      () => i
                    ))
                })
              } catch (d) {
                return (tr(d, x(this, Ze).parent), null)
              }
            })
          )
      }
    lr(() => {
      var o
      try {
        o = this.transform_error(e)
      } catch (d) {
        tr(d, x(this, Ze) && x(this, Ze).parent)
        return
      }
      o !== null && typeof o == 'object' && typeof o.then == 'function'
        ? o.then(v, d => tr(d, x(this, Ze) && x(this, Ze).parent))
        : v(o)
    })
  }))
function xi(t, e, r, a) {
  const s = ya() ? Gr : ks
  var l = t.filter(_ => !_.settled),
    i = e.map(s)
  if (r.length === 0 && l.length === 0) {
    a(i)
    return
  }
  var v = ce,
    o = ki(),
    d = l.length === 1 ? l[0].promise : l.length > 1 ? Promise.all(l.map(_ => _.promise)) : null
  function p(_) {
    if ((v.f & it) === 0) {
      o()
      try {
        a([...i, ..._])
      } catch (y) {
        tr(y, v)
      }
      Na()
    }
  }
  var g = kn()
  if (r.length === 0) {
    d.then(() => p([])).finally(g)
    return
  }
  function f() {
    Promise.all(r.map(_ => Si(_)))
      .then(p)
      .catch(_ => tr(_, v))
      .finally(g)
  }
  d
    ? d.then(() => {
        ;(o(), f(), Na())
      })
    : f()
}
function ki() {
  var t = ce,
    e = ue,
    r = Me,
    a = ae
  return function (l = !0) {
    ;(Lt(t),
      gt(e),
      Ur(r),
      l && (t.f & it) === 0 && (a == null || a.activate(), a == null || a.apply()))
  }
}
function Na(t = !0) {
  ;(Lt(null), gt(null), Ur(null), t && (ae == null || ae.deactivate()))
}
function kn() {
  var t = ce,
    e = t.b,
    r = ae,
    a = !!(e != null && e.is_rendered())
  return (
    e == null || e.update_pending_count(1, r),
    r.increment(a, t),
    () => {
      ;(e == null || e.update_pending_count(-1, r), r.decrement(a, t))
    }
  )
}
function Gr(t) {
  var e = je | Re
  return (
    ce !== null && (ce.f |= Yr),
    {
      ctx: Me,
      deps: null,
      effects: null,
      equals: _n,
      f: e,
      fn: t,
      reactions: null,
      rv: 0,
      v: Le,
      wv: 0,
      parent: ce,
      ac: null,
    }
  )
}
const ra = Symbol('obsolete')
function Si(t, e, r) {
  let a = ce
  a === null && Ll()
  var s = void 0,
    l = Er(Le),
    i = !ue,
    v = new Set()
  return (
    Di(() => {
      var _, y
      var o = ce,
        d = cn()
      s = d.promise
      try {
        Promise.resolve(t())
          .then(d.resolve, m => {
            m !== ma && d.reject(m)
          })
          .finally(Na)
      } catch (m) {
        ;(d.reject(m), Na())
      }
      var p = ae
      if (i) {
        if ((o.f & Vr) !== 0) var g = kn()
        if ((_ = a.b) != null && _.is_rendered())
          (y = p.async_deriveds.get(o)) == null || y.reject(ra)
        else for (const m of v.values()) m.reject(ra)
        ;(v.add(d), p.async_deriveds.set(o, d))
      }
      const f = (m, w = void 0) => {
        ;(g == null || g(),
          v.delete(d),
          w !== ra &&
            (p.activate(),
            w ? ((l.f |= nr), Kr(l, w)) : ((l.f & nr) !== 0 && (l.f ^= nr), Kr(l, m)),
            p.deactivate()))
      }
      d.promise.then(f, m => f(null, m || 'unknown'))
    }),
    zs(() => {
      for (const o of v) o.reject(ra)
    }),
    new Promise(o => {
      function d(p) {
        function g() {
          p === s ? o(l) : d(s)
        }
        p.then(g, g)
      }
      d(s)
    })
  )
}
function J(t) {
  const e = Gr(t)
  return (Kn(e), e)
}
function ks(t) {
  const e = Gr(t)
  return ((e.equals = gn), e)
}
function Pi(t) {
  var e = t.effects
  if (e !== null) {
    t.effects = null
    for (var r = 0; r < e.length; r += 1) tt(e[r])
  }
}
function Ss(t) {
  var e,
    r = ce,
    a = t.parent
  if (!Wt && a !== null && t.v !== Le && (a.f & (it | Je)) !== 0) return (ni(), t.v)
  Lt(a)
  try {
    ;((t.f &= ~Sr), Pi(t), (e = Jn(t)))
  } finally {
    Lt(r)
  }
  return e
}
function Sn(t) {
  var e = Ss(t)
  if (
    !t.equals(e) &&
    ((t.wv = Vn()),
    (!(ae != null && ae.is_fork) || t.deps === null) &&
      (ae !== null ? (ae.capture(t, e, !0), la == null || la.capture(t, e, !0)) : (t.v = e),
      t.deps === null))
  ) {
    Te(t, Ne)
    return
  }
  Wt || (He !== null ? (Ms() || (ae != null && ae.is_fork)) && He.set(t, e) : xs(t))
}
function Ei(t) {
  var e
  if (t.effects !== null)
    for (const r of t.effects)
      (r.teardown || r.ac) &&
        ((e = r.teardown) == null || e.call(r),
        r.ac !== null &&
          Xr(() => {
            ;(r.ac.abort(ma), (r.ac = null))
          }),
        r.fn !== null && (r.teardown = dn),
        ca(r, 0),
        Ts(r))
}
function Pn(t) {
  if (t.effects !== null) for (const e of t.effects) e.teardown && e.fn !== null && Wr(e)
}
let Ka = null,
  Cr = null,
  ae = null,
  la = null,
  He = null,
  os = null,
  ia = !1,
  Wa = !1,
  Or = null,
  Ta = null
var Hs = 0
let Mi = 1
var Rr, er, pr, Fr, Dr, jr, Ht, qr, Qe, ha, Bt, yt, At, Hr, _r, ke, vs, aa, ds, En, Mn, Ir, zi, sa
const ja = class ja {
  constructor() {
    de(this, ke)
    We(this, 'id', Mi++)
    de(this, Rr, !1)
    We(this, 'linked', !0)
    de(this, er, null)
    de(this, pr, null)
    We(this, 'async_deriveds', new Map())
    We(this, 'current', new Map())
    We(this, 'previous', new Map())
    de(this, Fr, new Set())
    de(this, Dr, new Set())
    de(this, jr, 0)
    de(this, Ht, new Map())
    de(this, qr, null)
    de(this, Qe, [])
    de(this, ha, [])
    de(this, Bt, new Set())
    de(this, yt, new Set())
    de(this, At, new Map())
    de(this, Hr, new Set())
    We(this, 'is_fork', !1)
    de(this, _r, !1)
    ;(Cr === null ? (Ka = Cr = this) : (oe(Cr, pr, this), oe(this, er, Cr)), (Cr = this))
  }
  skip_effect(e) {
    ;(x(this, At).has(e) || x(this, At).set(e, { d: [], m: [] }), x(this, Hr).delete(e))
  }
  unskip_effect(e, r = a => this.schedule(a)) {
    var a = x(this, At).get(e)
    if (a) {
      x(this, At).delete(e)
      for (var s of a.d) (Te(s, Re), r(s))
      for (s of a.m) (Te(s, St), r(s))
    }
    x(this, Hr).add(e)
  }
  capture(e, r, a = !1) {
    ;(e.v !== Le && !this.previous.has(e) && this.previous.set(e, e.v),
      (e.f & nr) === 0 && (this.current.set(e, [r, a]), He == null || He.set(e, r)),
      this.is_fork || (e.v = r))
  }
  activate() {
    ae = this
  }
  deactivate() {
    ;((ae = null), (He = null))
  }
  flush() {
    try {
      ;((Wa = !0), (ae = this), ye(this, ke, aa).call(this))
    } finally {
      ;((Hs = 0),
        (os = null),
        (Or = null),
        (Ta = null),
        (Wa = !1),
        (ae = null),
        (He = null),
        mr.clear())
    }
  }
  discard() {
    var e
    for (const r of x(this, Dr)) r(this)
    x(this, Dr).clear()
    for (const r of this.async_deriveds.values()) r.reject(ra)
    ;(ye(this, ke, sa).call(this), (e = x(this, qr)) == null || e.resolve())
  }
  register_created_effect(e) {
    x(this, ha).push(e)
  }
  increment(e, r) {
    if ((oe(this, jr, x(this, jr) + 1), e)) {
      let a = x(this, Ht).get(r) ?? 0
      x(this, Ht).set(r, a + 1)
    }
  }
  decrement(e, r) {
    if ((oe(this, jr, x(this, jr) - 1), e)) {
      let a = x(this, Ht).get(r) ?? 0
      a === 1 ? x(this, Ht).delete(r) : x(this, Ht).set(r, a - 1)
    }
    x(this, _r) ||
      (oe(this, _r, !0),
      lr(() => {
        ;(oe(this, _r, !1), this.linked && this.flush())
      }))
  }
  transfer_effects(e, r) {
    for (const a of e) x(this, Bt).add(a)
    for (const a of r) x(this, yt).add(a)
    ;(e.clear(), r.clear())
  }
  oncommit(e) {
    x(this, Fr).add(e)
  }
  ondiscard(e) {
    x(this, Dr).add(e)
  }
  settled() {
    return (x(this, qr) ?? oe(this, qr, cn())).promise
  }
  static ensure() {
    if (ae === null) {
      const e = (ae = new ja())
      !Wa &&
        !ia &&
        lr(() => {
          x(e, Rr) || e.flush()
        })
    }
    return ae
  }
  apply() {
    {
      He = null
      return
    }
  }
  schedule(e) {
    var s
    if (
      ((os = e),
      (s = e.b) != null && s.is_pending && (e.f & (Br | ga | un)) !== 0 && (e.f & Vr) === 0)
    ) {
      e.b.defer_effect(e)
      return
    }
    for (var r = e; r.parent !== null;) {
      r = r.parent
      var a = r.f
      if (Or !== null && r === ce && (ue === null || (ue.f & je) === 0)) return
      if ((a & (Kt | _t)) !== 0) {
        if ((a & Ne) === 0) return
        r.f ^= Ne
      }
    }
    x(this, Qe).push(r)
  }
}
;((Rr = new WeakMap()),
  (er = new WeakMap()),
  (pr = new WeakMap()),
  (Fr = new WeakMap()),
  (Dr = new WeakMap()),
  (jr = new WeakMap()),
  (Ht = new WeakMap()),
  (qr = new WeakMap()),
  (Qe = new WeakMap()),
  (ha = new WeakMap()),
  (Bt = new WeakMap()),
  (yt = new WeakMap()),
  (At = new WeakMap()),
  (Hr = new WeakMap()),
  (_r = new WeakMap()),
  (ke = new WeakSet()),
  (vs = function () {
    if (this.is_fork) return !0
    for (const a of x(this, Ht).keys()) {
      for (var e = a, r = !1; e.parent !== null;) {
        if (x(this, At).has(e)) {
          r = !0
          break
        }
        e = e.parent
      }
      if (!r) return !0
    }
    return !1
  }),
  (aa = function () {
    var o, d, p, g
    ;(oe(this, Rr, !0), Hs++ > 1e3 && (ye(this, ke, sa).call(this), Ti()))
    for (const f of x(this, Bt)) (x(this, yt).delete(f), Te(f, Re), this.schedule(f))
    for (const f of x(this, yt)) (Te(f, St), this.schedule(f))
    const e = x(this, Qe)
    ;(oe(this, Qe, []), this.apply())
    var r = (Or = []),
      a = [],
      s = (Ta = [])
    for (const f of e)
      try {
        ye(this, ke, ds).call(this, f, r, a)
      } catch (_) {
        throw (Tn(f), ye(this, ke, vs).call(this) || this.discard(), _)
      }
    if (((ae = null), s.length > 0)) {
      var l = ja.ensure()
      for (const f of s) l.schedule(f)
    }
    if (((Or = null), (Ta = null), ye(this, ke, vs).call(this))) {
      ;(ye(this, ke, Ir).call(this, a), ye(this, ke, Ir).call(this, r))
      for (const [f, _] of x(this, At)) An(f, _)
      s.length > 0 && ye((o = ae), ke, aa).call(o)
      return
    }
    const i = ye(this, ke, En).call(this)
    if (i) {
      ;(ye(this, ke, Ir).call(this, a),
        ye(this, ke, Ir).call(this, r),
        ye((d = i), ke, Mn).call(d, this))
      return
    }
    ;(x(this, Bt).clear(), x(this, yt).clear())
    for (const f of x(this, Fr)) f(this)
    ;(x(this, Fr).clear(),
      (la = this),
      Bs(a),
      Bs(r),
      (la = null),
      (p = x(this, qr)) == null || p.resolve())
    var v = ae
    if (
      (x(this, jr) === 0 && (x(this, Qe).length === 0 || v !== null) && ye(this, ke, sa).call(this),
      x(this, Qe).length > 0)
    )
      if (v !== null) {
        const f = v
        x(f, Qe).push(...x(this, Qe).filter(_ => !x(f, Qe).includes(_)))
      } else v = this
    v !== null && ye((g = v), ke, aa).call(g)
  }),
  (ds = function (e, r, a) {
    e.f ^= Ne
    for (var s = e.first; s !== null;) {
      var l = s.f,
        i = (l & (_t | Kt)) !== 0,
        v = i && (l & Ne) !== 0,
        o = v || (l & Je) !== 0 || x(this, At).has(s)
      if (!o && s.fn !== null) {
        i
          ? (s.f ^= Ne)
          : (l & Br) !== 0
            ? r.push(s)
            : ba(s) && ((l & xt) !== 0 && x(this, yt).add(s), Wr(s))
        var d = s.first
        if (d !== null) {
          s = d
          continue
        }
      }
      for (; s !== null;) {
        var p = s.next
        if (p !== null) {
          s = p
          break
        }
        s = s.parent
      }
    }
  }),
  (En = function () {
    for (var e = x(this, er); e !== null;) {
      if (!e.is_fork) {
        for (const [r, [, a]] of this.current) if (e.current.has(r) && !a) return e
      }
      e = x(e, er)
    }
    return null
  }),
  (Mn = function (e) {
    var a
    for (const [s, l] of e.current)
      (!this.previous.has(s) && e.previous.has(s) && this.previous.set(s, e.previous.get(s)),
        this.current.set(s, l))
    for (const [s, l] of e.async_deriveds) {
      const i = this.async_deriveds.get(s)
      i && l.promise.then(i.resolve).catch(i.reject)
    }
    ;(e.async_deriveds.clear(), this.transfer_effects(x(e, Bt), x(e, yt)))
    const r = s => {
      var l = s.reactions
      if (l !== null && !((s.f & je) !== 0 && (s.f & (Re | St)) === 0))
        for (const o of l) {
          var i = o.f
          if ((i & je) !== 0) r(o)
          else {
            var v = o
            i & (Lr | xt) &&
              !this.async_deriveds.has(v) &&
              (x(this, yt).delete(v), Te(v, Re), this.schedule(v))
          }
        }
    }
    for (const s of this.current.keys()) r(s)
    ;(this.oncommit(() => e.discard()),
      ye((a = e), ke, sa).call(a),
      (ae = this),
      ye(this, ke, aa).call(this))
  }),
  (Ir = function (e) {
    for (var r = 0; r < e.length; r += 1) bn(e[r], x(this, Bt), x(this, yt))
  }),
  (zi = function () {
    var g
    for (let f = Ka; f !== null; f = x(f, pr)) {
      var e = f.id < this.id,
        r = []
      for (const [_, [y, m]] of this.current) {
        if (f.current.has(_)) {
          var a = f.current.get(_)[0]
          if (e && y !== a) f.current.set(_, [y, m])
          else continue
        }
        r.push(_)
      }
      if (e)
        for (const [_, y] of this.async_deriveds) {
          const m = f.async_deriveds.get(_)
          m && y.promise.then(m.resolve).catch(m.reject)
        }
      var s = [...f.current.keys()].filter(_ => !f.current.get(_)[1])
      if (!(!x(f, Rr) || s.length === 0)) {
        var l = s.filter(_ => !this.current.has(_))
        if (l.length === 0) e && f.discard()
        else if (r.length > 0) {
          if (e)
            for (const _ of x(this, Hr))
              f.unskip_effect(_, y => {
                var m
                ;(y.f & (xt | Lr)) !== 0 ? f.schedule(y) : ye((m = f), ke, Ir).call(m, [y])
              })
          f.activate()
          var i = new Set(),
            v = new Map()
          for (var o of r) zn(o, l, i, v)
          v = new Map()
          var d = [...f.current]
            .filter(([_, y]) => {
              const m = this.current.get(_)
              return m ? m[0] !== y[0] || m[1] !== y[1] : !0
            })
            .map(([_]) => _)
          if (d.length > 0)
            for (const _ of x(this, ha))
              (_.f & (it | Je | $a)) === 0 &&
                Ps(_, d, v) &&
                ((_.f & (Lr | xt)) !== 0 ? (Te(_, Re), f.schedule(_)) : x(f, Bt).add(_))
          if (x(f, Qe).length > 0 && !x(f, _r)) {
            f.apply()
            for (var p of x(f, Qe)) ye((g = f), ke, ds).call(g, p, [], [])
            oe(f, Qe, [])
          }
          f.deactivate()
        }
      }
    }
  }),
  (sa = function () {
    if (this.linked) {
      var e = x(this, er),
        r = x(this, pr)
      ;(e === null ? (Ka = r) : oe(e, pr, r),
        r === null ? (Cr = e) : oe(r, er, e),
        (this.linked = !1))
    }
  }))
let Pr = ja
function Ai(t) {
  var e = ia
  ia = !0
  try {
    for (var r; ;) {
      if ((ci(), ae === null)) return r
      ae.flush()
    }
  } finally {
    ia = e
  }
}
function Ti() {
  try {
    jl()
  } catch (t) {
    tr(t, os)
  }
}
let mt = null
function Bs(t) {
  var e = t.length
  if (e !== 0) {
    for (var r = 0; r < e;) {
      var a = t[r++]
      if (
        (a.f & (it | Je)) === 0 &&
        ba(a) &&
        ((mt = new Set()),
        Wr(a),
        a.deps === null &&
          a.first === null &&
          a.nodes === null &&
          a.teardown === null &&
          a.ac === null &&
          Bn(a),
        (mt == null ? void 0 : mt.size) > 0)
      ) {
        mr.clear()
        for (const s of mt) {
          if ((s.f & (it | Je)) !== 0) continue
          const l = [s]
          let i = s.parent
          for (; i !== null;) (mt.has(i) && (mt.delete(i), l.push(i)), (i = i.parent))
          for (let v = l.length - 1; v >= 0; v--) {
            const o = l[v]
            ;(o.f & (it | Je)) === 0 && Wr(o)
          }
        }
        mt.clear()
      }
    }
    mt = null
  }
}
function zn(t, e, r, a) {
  if (!r.has(t) && (r.add(t), t.reactions !== null))
    for (const s of t.reactions) {
      const l = s.f
      ;(l & je) !== 0
        ? zn(s, e, r, a)
        : (l & (Lr | xt)) !== 0 && (l & Re) === 0 && Ps(s, e, a) && (Te(s, Re), Es(s))
    }
}
function Ps(t, e, r) {
  const a = r.get(t)
  if (a !== void 0) return a
  if (t.deps !== null)
    for (const s of t.deps) {
      if (Oa.call(e, s)) return !0
      if ((s.f & je) !== 0 && Ps(s, e, r)) return (r.set(s, !0), !0)
    }
  return (r.set(t, !1), !1)
}
function Es(t) {
  ae.schedule(t)
}
function An(t, e) {
  if (!((t.f & _t) !== 0 && (t.f & Ne) !== 0)) {
    ;((t.f & Re) !== 0 ? e.d.push(t) : (t.f & St) !== 0 && e.m.push(t), Te(t, Ne))
    for (var r = t.first; r !== null;) (An(r, e), (r = r.next))
  }
}
function Tn(t) {
  Te(t, Ne)
  for (var e = t.first; e !== null;) (Tn(e), (e = e.next))
}
let Ra = new Set()
const mr = new Map()
let Cn = !1
function Er(t, e) {
  var r = { f: 0, v: t, reactions: null, equals: _n, rv: 0, wv: 0 }
  return r
}
function ee(t, e) {
  const r = Er(t)
  return (Kn(r), r)
}
function Ci(t, e = !1, r = !0) {
  var s
  const a = Er(t)
  return (
    e || (a.equals = gn),
    Jr && r && Me !== null && Me.l !== null && ((s = Me.l).s ?? (s.s = [])).push(a),
    a
  )
}
function T(t, e, r = !1) {
  ue !== null &&
    (!kt || (ue.f & $a) !== 0) &&
    ya() &&
    (ue.f & (je | xt | Lr | $a)) !== 0 &&
    (Ot === null || !Ot.has(t)) &&
    Ul()
  let a = r ? Fe(e) : e
  return Kr(t, a, Ta)
}
function Kr(t, e, r = null) {
  if (!t.equals(e)) {
    mr.set(t, Wt ? e : t.v)
    var a = Pr.ensure()
    if ((a.capture(t, e), (t.f & je) !== 0)) {
      const s = t
      ;((t.f & Re) !== 0 && Ss(s), He === null && xs(s))
    }
    ;((t.wv = Vn()),
      In(t, Re, r),
      ya() &&
        ce !== null &&
        (ce.f & Ne) !== 0 &&
        (ce.f & (_t | Kt)) === 0 &&
        (dt === null ? qi([t]) : dt.push(t)),
      !a.is_fork && Ra.size > 0 && !Cn && Ii())
  }
  return e
}
function Ii() {
  Cn = !1
  for (const t of Ra) {
    ;(t.f & Ne) !== 0 && Te(t, St)
    let e
    try {
      e = ba(t)
    } catch {
      e = !0
    }
    e && Wr(t)
  }
  Ra.clear()
}
function oa(t) {
  T(t, t.v + 1)
}
function In(t, e, r) {
  var a = t.reactions
  if (a !== null)
    for (var s = ya(), l = a.length, i = 0; i < l; i++) {
      var v = a[i],
        o = v.f
      if (!(!s && v === ce)) {
        var d = (o & Re) === 0
        if ((d && Te(v, e), (o & $a) !== 0)) Ra.add(v)
        else if ((o & je) !== 0) {
          var p = v
          ;(He == null || He.delete(p),
            (o & Sr) === 0 &&
              (o & pt && (ce === null || (ce.f & La) === 0) && (v.f |= Sr), In(p, St, r)))
        } else if (d) {
          var g = v
          ;((o & xt) !== 0 && mt !== null && mt.add(g), r !== null ? r.push(g) : Es(g))
        }
      }
    }
}
function Fe(t) {
  if (typeof t != 'object' || t === null || Ut in t) return t
  const e = bs(t)
  if (e !== Ml && e !== zl) return t
  var r = new Map(),
    a = ws(t),
    s = ee(0),
    l = wr,
    i = v => {
      if (wr === l) return v()
      var o = ue,
        d = wr
      ;(gt(null), Ks(l))
      var p = v()
      return (gt(o), Ks(d), p)
    }
  return (
    a && r.set('length', ee(t.length)),
    new Proxy(t, {
      defineProperty(v, o, d) {
        ;(!('value' in d) || d.configurable === !1 || d.enumerable === !1 || d.writable === !1) &&
          Hl()
        var p = r.get(o)
        return (
          p === void 0
            ? i(() => {
                var g = ee(d.value)
                return (r.set(o, g), g)
              })
            : T(p, d.value, !0),
          !0
        )
      },
      deleteProperty(v, o) {
        var d = r.get(o)
        if (d === void 0) {
          if (o in v) {
            const p = i(() => ee(Le))
            ;(r.set(o, p), oa(s))
          }
        } else (T(d, Le), oa(s))
        return !0
      },
      get(v, o, d) {
        var _
        if (o === Ut) return t
        var p = r.get(o),
          g = o in v
        if (
          (p === void 0 &&
            (!g || ((_ = $r(v, o)) != null && _.writable)) &&
            ((p = i(() => {
              var y = Fe(g ? v[o] : Le),
                m = ee(y)
              return m
            })),
            r.set(o, p)),
          p !== void 0)
        ) {
          var f = n(p)
          return f === Le ? void 0 : f
        }
        return Reflect.get(v, o, d)
      },
      getOwnPropertyDescriptor(v, o) {
        var d = Reflect.getOwnPropertyDescriptor(v, o)
        if (d && 'value' in d) {
          var p = r.get(o)
          p && (d.value = n(p))
        } else if (d === void 0) {
          var g = r.get(o),
            f = g == null ? void 0 : g.v
          if (g !== void 0 && f !== Le)
            return { enumerable: !0, configurable: !0, value: f, writable: !0 }
        }
        return d
      },
      has(v, o) {
        var f
        if (o === Ut) return !0
        var d = r.get(o),
          p = (d !== void 0 && d.v !== Le) || Reflect.has(v, o)
        if (d !== void 0 || (ce !== null && (!p || ((f = $r(v, o)) != null && f.writable)))) {
          d === void 0 &&
            ((d = i(() => {
              var _ = p ? Fe(v[o]) : Le,
                y = ee(_)
              return y
            })),
            r.set(o, d))
          var g = n(d)
          if (g === Le) return !1
        }
        return p
      },
      set(v, o, d, p) {
        var E
        var g = r.get(o),
          f = o in v
        if (a && o === 'length')
          for (var _ = d; _ < g.v; _ += 1) {
            var y = r.get(_ + '')
            y !== void 0 ? T(y, Le) : _ in v && ((y = i(() => ee(Le))), r.set(_ + '', y))
          }
        if (g === void 0)
          (!f || ((E = $r(v, o)) != null && E.writable)) &&
            ((g = i(() => ee(void 0))), T(g, Fe(d)), r.set(o, g))
        else {
          f = g.v !== Le
          var m = i(() => Fe(d))
          T(g, m)
        }
        var w = Reflect.getOwnPropertyDescriptor(v, o)
        if ((w != null && w.set && w.set.call(p, d), !f)) {
          if (a && typeof o == 'string') {
            var I = r.get('length'),
              $ = Number(o)
            Number.isInteger($) && $ >= I.v && T(I, $ + 1)
          }
          oa(s)
        }
        return !0
      },
      ownKeys(v) {
        n(s)
        var o = Reflect.ownKeys(v).filter(g => {
          var f = r.get(g)
          return f === void 0 || f.v !== Le
        })
        for (var [d, p] of r) p.v !== Le && !(d in v) && o.push(d)
        return o
      },
      setPrototypeOf() {
        Bl()
      },
    })
  )
}
function Us(t) {
  try {
    if (t !== null && typeof t == 'object' && Ut in t) return t[Ut]
  } catch {}
  return t
}
function Oi(t, e) {
  return Object.is(Us(t), Us(e))
}
var cs, On, $n, Ln
function $i() {
  if (cs === void 0) {
    ;((cs = window), (On = /Firefox/.test(navigator.userAgent)))
    var t = Element.prototype,
      e = Node.prototype,
      r = Text.prototype
    ;(($n = $r(e, 'firstChild').get),
      (Ln = $r(e, 'nextSibling').get),
      js(t) && ((t[as] = void 0), (t[Ea] = null), (t[ss] = void 0), (t.__e = void 0)),
      js(r) && (r[ta] = void 0))
  }
}
function Gt(t = '') {
  return document.createTextNode(t)
}
function It(t) {
  return $n.call(t)
}
function wa(t) {
  return Ln.call(t)
}
function u(t, e) {
  return It(t)
}
function te(t, e = !1) {
  {
    var r = It(t)
    return r instanceof Comment && r.data === '' ? wa(r) : r
  }
}
function c(t, e = 1, r = !1) {
  let a = t
  for (; e--;) a = wa(a)
  return a
}
function Li(t) {
  t.textContent = ''
}
function Nn() {
  return !1
}
function Rn(t, e, r) {
  return e == null || e === pn
    ? r
      ? document.createElement(t, { is: r })
      : document.createElement(t)
    : r
      ? document.createElementNS(e, t, { is: r })
      : document.createElementNS(e, t)
}
function Fn(t) {
  ;(ce === null && (ue === null && Dl(), Fl()), Wt && Rl())
}
function Ni(t, e) {
  var r = e.last
  r === null ? (e.last = e.first = t) : ((r.next = t), (t.prev = r), (e.last = t))
}
function Nt(t, e) {
  var r = ce
  r !== null && (r.f & Je) !== 0 && (t |= Je)
  var a = {
    ctx: Me,
    deps: null,
    nodes: null,
    f: t | Re | pt,
    first: null,
    fn: e,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
  }
  ae == null || ae.register_created_effect(a)
  var s = a
  if ((t & Br) !== 0) Or !== null ? Or.push(a) : Pr.ensure().schedule(a)
  else if (e !== null) {
    try {
      Wr(a)
    } catch (i) {
      throw (tt(a), i)
    }
    s.deps === null &&
      s.teardown === null &&
      s.nodes === null &&
      s.first === s.last &&
      (s.f & Yr) === 0 &&
      ((s = s.first), (t & xt) !== 0 && (t & kr) !== 0 && s !== null && (s.f |= kr))
  }
  if (
    s !== null &&
    ((s.parent = r), r !== null && Ni(s, r), ue !== null && (ue.f & je) !== 0 && (t & Kt) === 0)
  ) {
    var l = ue
    ;(l.effects ?? (l.effects = [])).push(s)
  }
  return a
}
function Ms() {
  return ue !== null && !kt
}
function zs(t) {
  const e = Nt(ga, null)
  return (Te(e, Ne), (e.teardown = t), e)
}
function $t(t) {
  Fn()
  var e = ce.f,
    r = !ue && (e & _t) !== 0 && Me !== null && !Me.i
  if (r) {
    var a = Me
    ;(a.e ?? (a.e = [])).push(t)
  } else return Dn(t)
}
function Dn(t) {
  return Nt(Br | fn, t)
}
function Ri(t) {
  return (Fn(), Nt(ga | fn, t))
}
function Fi(t) {
  Pr.ensure()
  const e = Nt(Kt | Yr, t)
  return (r = {}) =>
    new Promise(a => {
      r.outro
        ? yr(e, () => {
            ;(tt(e), a(void 0))
          })
        : (tt(e), a(void 0))
    })
}
function jn(t) {
  return Nt(Br, t)
}
function Di(t) {
  return Nt(Lr | Yr, t)
}
function As(t, e = 0) {
  return Nt(ga | e, t)
}
function L(t, e = [], r = [], a = []) {
  xi(a, e, r, s => {
    Nt(ga, () => {
      t(...s.map(n))
    })
  })
}
function Ba(t, e = 0) {
  var r = Nt(xt | e, t)
  return r
}
function ht(t) {
  return Nt(_t | Yr, t)
}
function qn(t) {
  var e = t.teardown
  if (e !== null) {
    const r = Wt,
      a = ue
    ;(Gs(!0), gt(null))
    try {
      e.call(null)
    } finally {
      ;(Gs(r), gt(a))
    }
  }
}
function Ts(t, e = !1) {
  var r = t.first
  for (t.first = t.last = null; r !== null;) {
    const s = r.ac
    s !== null &&
      Xr(() => {
        s.abort(ma)
      })
    var a = r.next
    ;((r.f & Kt) !== 0 ? (r.parent = null) : tt(r, e), (r = a))
  }
}
function ji(t) {
  for (var e = t.first; e !== null;) {
    var r = e.next
    ;((e.f & _t) === 0 && tt(e), (e = r))
  }
}
function tt(t, e = !0) {
  var r = !1
  ;((e || (t.f & Tl) !== 0) &&
    t.nodes !== null &&
    t.nodes.end !== null &&
    (Hn(t.nodes.start, t.nodes.end), (r = !0)),
    (t.f |= rs),
    Ts(t, e && !r),
    ca(t, 0))
  var a = t.nodes && t.nodes.t
  if (a !== null) for (const l of a) l.stop()
  ;(qn(t), (t.f ^= rs), (t.f |= it))
  var s = t.parent
  ;(s !== null && s.first !== null && Bn(t),
    (t.next = t.prev = t.teardown = t.ctx = t.deps = t.fn = t.nodes = t.ac = t.b = null))
}
function Hn(t, e) {
  for (; t !== null;) {
    var r = t === e ? null : wa(t)
    ;(t.remove(), (t = r))
  }
}
function Bn(t) {
  var e = t.parent,
    r = t.prev,
    a = t.next
  ;(r !== null && (r.next = a),
    a !== null && (a.prev = r),
    e !== null && (e.first === t && (e.first = a), e.last === t && (e.last = r)))
}
function yr(t, e, r = !0) {
  var a = []
  Un(t, a, !0)
  var s = () => {
      ;(r && tt(t), e && e())
    },
    l = a.length
  if (l > 0) {
    var i = () => --l || s()
    for (var v of a) v.out(i)
  } else s()
}
function Un(t, e, r) {
  if ((t.f & Je) === 0) {
    t.f ^= Je
    var a = t.nodes && t.nodes.t
    if (a !== null) for (const v of a) (v.is_global || r) && e.push(v)
    for (var s = t.first; s !== null;) {
      var l = s.next
      if ((s.f & Kt) === 0) {
        var i = (s.f & kr) !== 0 || ((s.f & _t) !== 0 && (t.f & xt) !== 0)
        Un(s, e, i ? r : !1)
      }
      s = l
    }
  }
}
function Fa(t) {
  Gn(t, !0)
}
function Gn(t, e) {
  if ((t.f & Je) !== 0) {
    ;((t.f ^= Je), (t.f & Ne) === 0 && (Te(t, Re), Pr.ensure().schedule(t)))
    for (var r = t.first; r !== null;) {
      var a = r.next,
        s = (r.f & kr) !== 0 || (r.f & _t) !== 0
      ;(Gn(r, s ? e : !1), (r = a))
    }
    var l = t.nodes && t.nodes.t
    if (l !== null) for (const i of l) (i.is_global || e) && i.in()
  }
}
function Cs(t, e) {
  if (t.nodes)
    for (var r = t.nodes.start, a = t.nodes.end; r !== null;) {
      var s = r === a ? null : wa(r)
      ;(e.append(r), (r = s))
    }
}
let Ca = !1,
  Wt = !1
function Gs(t) {
  Wt = t
}
let ue = null,
  kt = !1
function gt(t) {
  ue = t
}
let ce = null
function Lt(t) {
  ce = t
}
let Ot = null
function Kn(t) {
  ue !== null && (Ot ?? (Ot = new Set())).add(t)
}
let et = null,
  st = 0,
  dt = null
function qi(t) {
  dt = t
}
let Wn = 1,
  cr = 0,
  wr = cr
function Ks(t) {
  wr = t
}
function Vn() {
  return ++Wn
}
function ba(t) {
  var e = t.f
  if ((e & Re) !== 0) return !0
  if ((e & je && (t.f &= ~Sr), (e & St) !== 0)) {
    for (var r = t.deps, a = r.length, s = 0; s < a; s++) {
      var l = r[s]
      if ((ba(l) && Sn(l), l.wv > t.wv)) return !0
    }
    ;(e & pt) !== 0 && He === null && Te(t, Ne)
  }
  return !1
}
function Yn(t, e, r = !0) {
  var a = t.reactions
  if (a !== null && !(Ot !== null && Ot.has(t)))
    for (var s = 0; s < a.length; s++) {
      var l = a[s]
      ;(l.f & je) !== 0
        ? Yn(l, e, !1)
        : e === l && (r ? Te(l, Re) : (l.f & Ne) !== 0 && Te(l, St), Es(l))
    }
}
function Jn(t) {
  var m
  var e = et,
    r = st,
    a = dt,
    s = ue,
    l = Ot,
    i = Me,
    v = kt,
    o = wr,
    d = t.f
  ;((et = null),
    (st = 0),
    (dt = null),
    (ue = (d & (_t | Kt)) === 0 ? t : null),
    (Ot = null),
    Ur(t.ctx),
    (kt = !1),
    (wr = ++cr),
    t.ac !== null &&
      (Xr(() => {
        t.ac.abort(ma)
      }),
      (t.ac = null)))
  try {
    t.f |= La
    var p = t.fn,
      g = p()
    t.f |= Vr
    var f = t.deps,
      _ = ae == null ? void 0 : ae.is_fork
    if (et !== null) {
      var y
      if ((_ || ca(t, st), f !== null && st > 0))
        for (f.length = st + et.length, y = 0; y < et.length; y++) f[st + y] = et[y]
      else t.deps = f = et
      if (Ms() && (t.f & pt) !== 0)
        for (y = st; y < f.length; y++) ((m = f[y]).reactions ?? (m.reactions = [])).push(t)
    } else !_ && f !== null && st < f.length && (ca(t, st), (f.length = st))
    if (ya() && dt !== null && !kt && f !== null && (t.f & (je | St | Re)) === 0)
      for (y = 0; y < dt.length; y++) Yn(dt[y], t)
    if (s !== null && s !== t) {
      if ((cr++, s.deps !== null)) for (let w = 0; w < r; w += 1) s.deps[w].rv = cr
      if (e !== null) for (const w of e) w.rv = cr
      dt !== null && (a === null ? (a = dt) : a.push(...dt))
    }
    return ((t.f & nr) !== 0 && (t.f ^= nr), g)
  } catch (w) {
    return yn(w)
  } finally {
    ;((t.f ^= La), (et = e), (st = r), (dt = a), (ue = s), (Ot = l), Ur(i), (kt = v), (wr = o))
  }
}
function Hi(t, e) {
  let r = e.reactions
  if (r !== null) {
    var a = Pl.call(r, t)
    if (a !== -1) {
      var s = r.length - 1
      s === 0 ? (r = e.reactions = null) : ((r[a] = r[s]), r.pop())
    }
  }
  if (r === null && (e.f & je) !== 0 && (et === null || !Oa.call(et, e))) {
    var l = e
    ;((l.f & pt) !== 0 && ((l.f ^= pt), (l.f &= ~Sr)),
      l.v !== Le && xs(l),
      l.ac !== null &&
        Xr(() => {
          ;(l.ac.abort(ma), (l.ac = null))
        }),
      Ei(l),
      ca(l, 0))
  }
}
function ca(t, e) {
  var r = t.deps
  if (r !== null) for (var a = e; a < r.length; a++) Hi(t, r[a])
}
function Wr(t) {
  var e = t.f
  if ((e & it) === 0) {
    Te(t, Ne)
    var r = ce,
      a = Ca
    ;((ce = t), (Ca = (e & (_t | Kt)) === 0))
    try {
      ;((e & (xt | un)) !== 0 ? ji(t) : Ts(t), qn(t))
      var s = Jn(t)
      ;((t.teardown = typeof s == 'function' ? s : null), (t.wv = Wn))
      var l
      on && vi && (t.f & Re) !== 0 && t.deps
    } finally {
      ;((Ca = a), (ce = r))
    }
  }
}
async function Bi() {
  ;(await Promise.resolve(), Ai())
}
function n(t) {
  var e = t.f,
    r = (e & je) !== 0
  if (ue !== null && !kt) {
    var a = ce !== null && (ce.f & it) !== 0
    if (!a && (Ot === null || !Ot.has(t))) {
      var s = ue.deps
      if ((ue.f & La) !== 0)
        t.rv < cr &&
          ((t.rv = cr),
          et === null && s !== null && s[st] === t ? st++ : et === null ? (et = [t]) : et.push(t))
      else {
        ;(ue.deps ?? (ue.deps = []), Oa.call(ue.deps, t) || ue.deps.push(t))
        var l = t.reactions
        l === null ? (t.reactions = [ue]) : Oa.call(l, ue) || l.push(ue)
      }
    }
  }
  if (Wt && mr.has(t)) return mr.get(t)
  if (r) {
    var i = t
    if (Wt) {
      var v = i.v
      return ((((i.f & Ne) === 0 && i.reactions !== null) || Zn(i)) && (v = Ss(i)), mr.set(i, v), v)
    }
    var o = (i.f & pt) === 0 && !kt && ue !== null && (Ca || (ue.f & pt) !== 0),
      d = (i.f & Vr) === 0
    ;(ba(i) && (o && (i.f |= pt), Sn(i)), o && !d && (Pn(i), Xn(i)))
  }
  if (He != null && He.has(t)) return He.get(t)
  if ((t.f & nr) !== 0) throw t.v
  return t.v
}
function Xn(t) {
  if (((t.f |= pt), t.deps !== null))
    for (const e of t.deps)
      ((e.reactions ?? (e.reactions = [])).push(t),
        (e.f & je) !== 0 && (e.f & pt) === 0 && (Pn(e), Xn(e)))
}
function Zn(t) {
  if (t.v === Le) return !0
  if (t.deps === null) return !1
  for (const e of t.deps) if (mr.has(e) || ((e.f & je) !== 0 && Zn(e))) return !0
  return !1
}
function Zr(t) {
  var e = kt
  try {
    return ((kt = !0), t())
  } finally {
    kt = e
  }
}
function Ui(t) {
  if (!(typeof t != 'object' || !t || t instanceof EventTarget)) {
    if (Ut in t) us(t)
    else if (!Array.isArray(t))
      for (let e in t) {
        const r = t[e]
        typeof r == 'object' && r && Ut in r && us(r)
      }
  }
}
function us(t, e = new Set()) {
  if (typeof t == 'object' && t !== null && !(t instanceof EventTarget) && !e.has(t)) {
    ;(e.add(t), t instanceof Date && t.getTime())
    for (let a in t)
      try {
        us(t[a], e)
      } catch {}
    const r = bs(t)
    if (
      r !== Object.prototype &&
      r !== Array.prototype &&
      r !== Map.prototype &&
      r !== Set.prototype &&
      r !== Date.prototype
    ) {
      const a = vn(r)
      for (let s in a) {
        const l = a[s].get
        if (l)
          try {
            l.call(t)
          } catch {}
      }
    }
  }
}
const Gi = ['touchstart', 'touchmove']
function Ki(t) {
  return Gi.includes(t)
}
const ur = Symbol('events'),
  Qn = new Set(),
  fs = new Set()
function Wi(t, e, r, a = {}) {
  function s(l) {
    if ((a.capture || hs.call(e, l), !l.cancelBubble))
      return Xr(() => (r == null ? void 0 : r.call(this, l)))
  }
  return (
    t.startsWith('pointer') || t.startsWith('touch') || t === 'wheel'
      ? lr(() => {
          e.addEventListener(t, s, a)
        })
      : e.addEventListener(t, s, a),
    s
  )
}
function Ia(t, e, r, a, s) {
  var l = { capture: a, passive: s },
    i = Wi(t, e, r, l)
  ;(e === document.body || e === window || e === document || e instanceof HTMLMediaElement) &&
    zs(() => {
      e.removeEventListener(t, i, l)
    })
}
function le(t, e, r) {
  ;(e[ur] ?? (e[ur] = {}))[t] = r
}
function Oe(t) {
  for (var e = 0; e < t.length; e++) Qn.add(t[e])
  for (var r of fs) r(t)
}
let Ws = null
function hs(t) {
  var m, w
  var e = this,
    r = e.ownerDocument,
    a = t.type,
    s = ((m = t.composedPath) == null ? void 0 : m.call(t)) || [],
    l = s[0] || t.target
  Ws = t
  var i = 0,
    v = Ws === t && t[ur]
  if (v) {
    var o = s.indexOf(v)
    if (o !== -1 && (e === document || e === window)) {
      t[ur] = e
      return
    }
    var d = s.indexOf(e)
    if (d === -1) return
    o <= d && (i = o)
  }
  if (((l = s[i] || t.target), l !== e)) {
    El(t, 'currentTarget', {
      configurable: !0,
      get() {
        return l || r
      },
    })
    var p = ue,
      g = ce
    ;(gt(null), Lt(null))
    try {
      for (var f, _ = []; l !== null && l !== e;) {
        try {
          var y = (w = l[ur]) == null ? void 0 : w[a]
          y != null && (!l.disabled || t.target === l) && y.call(l, t)
        } catch (I) {
          f ? _.push(I) : (f = I)
        }
        if (t.cancelBubble) break
        ;(i++, (l = i < s.length ? s[i] : null))
      }
      if (f) {
        for (let I of _)
          queueMicrotask(() => {
            throw I
          })
        throw f
      }
    } finally {
      ;((t[ur] = e), delete t.currentTarget, gt(p), Lt(g))
    }
  }
}
var nn
const Va =
  ((nn = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : nn.trustedTypes) &&
  globalThis.window.trustedTypes.createPolicy('svelte-trusted-html', { createHTML: t => t })
function Vi(t) {
  return (Va == null ? void 0 : Va.createHTML(t)) ?? t
}
function el(t) {
  var e = Rn('template')
  return ((e.innerHTML = Vi(t.replaceAll('<!>', '<!---->'))), e.content)
}
function Mr(t, e) {
  var r = ce
  r.nodes === null && (r.nodes = { start: t, end: e, a: null, t: null })
}
function k(t, e) {
  var r = (e & ti) !== 0,
    a = (e & ri) !== 0,
    s,
    l = !t.startsWith('<!>')
  return () => {
    s === void 0 && ((s = el(l ? t : '<!>' + t)), r || (s = It(s)))
    var i = a || On ? document.importNode(s, !0) : s.cloneNode(!0)
    if (r) {
      var v = It(i),
        o = i.lastChild
      Mr(v, o)
    } else Mr(i, i)
    return i
  }
}
function Yi(t, e, r = 'svg') {
  var a = !t.startsWith('<!>'),
    s = `<${r}>${a ? t : '<!>' + t}</${r}>`,
    l
  return () => {
    if (!l) {
      var i = el(s),
        v = It(i)
      l = It(v)
    }
    var o = l.cloneNode(!0)
    return (Mr(o, o), o)
  }
}
function Is(t, e) {
  return Yi(t, e, 'svg')
}
function Z(t = '') {
  {
    var e = Gt(t + '')
    return (Mr(e, e), e)
  }
}
function rt() {
  var t = document.createDocumentFragment(),
    e = document.createComment(''),
    r = Gt()
  return (t.append(e, r), Mr(e, r), t)
}
function h(t, e) {
  t !== null && t.before(e)
}
function A(t, e) {
  var r = e == null ? '' : typeof e == 'object' ? `${e}` : e
  r !== (t[ta] ?? (t[ta] = t.nodeValue)) && ((t[ta] = r), (t.nodeValue = `${r}`))
}
function Ji(t, e) {
  return Xi(t, e)
}
const Sa = new Map()
function Xi(
  t,
  { target: e, anchor: r, props: a = {}, events: s, context: l, intro: i = !0, transformError: v }
) {
  $i()
  var o = void 0,
    d = Fi(() => {
      var p = r ?? e.appendChild(Gt())
      gi(
        p,
        { pending: () => {} },
        _ => {
          pe({})
          var y = Me
          ;(l && (y.c = l), s && (a.$$events = s), (o = t(_, a) || {}), _e())
        },
        v
      )
      var g = new Set(),
        f = _ => {
          for (var y = 0; y < _.length; y++) {
            var m = _[y]
            if (!g.has(m)) {
              g.add(m)
              var w = Ki(m)
              for (const E of [e, document]) {
                var I = Sa.get(E)
                I === void 0 && ((I = new Map()), Sa.set(E, I))
                var $ = I.get(m)
                $ === void 0
                  ? (E.addEventListener(m, hs, { passive: w }), I.set(m, 1))
                  : I.set(m, $ + 1)
              }
            }
          }
        }
      return (
        f(Ha(Qn)),
        fs.add(f),
        () => {
          var w
          for (var _ of g)
            for (const I of [e, document]) {
              var y = Sa.get(I),
                m = y.get(_)
              --m == 0
                ? (I.removeEventListener(_, hs), y.delete(_), y.size === 0 && Sa.delete(I))
                : y.set(_, m)
            }
          ;(fs.delete(f), p !== r && ((w = p.parentNode) == null || w.removeChild(p)))
        }
      )
    })
  return (Zi.set(o, d), o)
}
let Zi = new WeakMap()
var wt, Tt, lt, gr, pa, _a, qa
class tl {
  constructor(e, r = !0) {
    We(this, 'anchor')
    de(this, wt, new Map())
    de(this, Tt, new Map())
    de(this, lt, new Map())
    de(this, gr, new Set())
    de(this, pa, !0)
    de(this, _a, e => {
      if (x(this, wt).has(e)) {
        var r = x(this, wt).get(e),
          a = x(this, Tt).get(r)
        if (a) (Fa(a), x(this, gr).delete(r))
        else {
          var s = x(this, lt).get(r)
          s &&
            (Fa(s.effect),
            x(this, Tt).set(r, s.effect),
            x(this, lt).delete(r),
            s.fragment.lastChild.remove(),
            this.anchor.before(s.fragment),
            (a = s.effect))
        }
        for (const [l, i] of x(this, wt)) {
          if ((x(this, wt).delete(l), l === e)) break
          const v = x(this, lt).get(i)
          v && (tt(v.effect), x(this, lt).delete(i))
        }
        for (const [l, i] of x(this, Tt)) {
          if (l === r || x(this, gr).has(l)) continue
          const v = () => {
            if (Array.from(x(this, wt).values()).includes(l)) {
              var d = document.createDocumentFragment()
              ;(Cs(i, d), d.append(Gt()), x(this, lt).set(l, { effect: i, fragment: d }))
            } else tt(i)
            ;(x(this, gr).delete(l), x(this, Tt).delete(l))
          }
          x(this, pa) || !a ? (x(this, gr).add(l), yr(i, v, !1)) : v()
        }
      }
    })
    de(this, qa, e => {
      x(this, wt).delete(e)
      const r = Array.from(x(this, wt).values())
      for (const [a, s] of x(this, lt)) r.includes(a) || (tt(s.effect), x(this, lt).delete(a))
    })
    ;((this.anchor = e), oe(this, pa, r))
  }
  ensure(e, r) {
    var a = ae,
      s = Nn()
    if (r && !x(this, Tt).has(e) && !x(this, lt).has(e))
      if (s) {
        var l = document.createDocumentFragment(),
          i = Gt()
        ;(l.append(i), x(this, lt).set(e, { effect: ht(() => r(i)), fragment: l }))
      } else
        x(this, Tt).set(
          e,
          ht(() => r(this.anchor))
        )
    if ((x(this, wt).set(a, e), s)) {
      for (const [v, o] of x(this, Tt)) v === e ? a.unskip_effect(o) : a.skip_effect(o)
      for (const [v, o] of x(this, lt))
        v === e ? a.unskip_effect(o.effect) : a.skip_effect(o.effect)
      ;(a.oncommit(x(this, _a)), a.ondiscard(x(this, qa)))
    } else x(this, _a).call(this, a)
  }
}
;((wt = new WeakMap()),
  (Tt = new WeakMap()),
  (lt = new WeakMap()),
  (gr = new WeakMap()),
  (pa = new WeakMap()),
  (_a = new WeakMap()),
  (qa = new WeakMap()))
function j(t, e, r = !1) {
  var a = new tl(t),
    s = r ? kr : 0
  function l(i, v) {
    a.ensure(i, v)
  }
  Ba(() => {
    var i = !1
    ;(e((v, o = 0) => {
      ;((i = !0), l(o, v))
    }),
      i || l(-1, null))
  }, s)
}
function br(t, e) {
  return e
}
function Qi(t, e, r) {
  for (var a = [], s = e.length, l, i = e.length, v = 0; v < s; v++) {
    let g = e[v]
    yr(
      g,
      () => {
        if (l) {
          if ((l.pending.delete(g), l.done.add(g), l.pending.size === 0)) {
            var f = t.outrogroups
            ;(ps(t, Ha(l.done)), f.delete(l), f.size === 0 && (t.outrogroups = null))
          }
        } else i -= 1
      },
      !1
    )
  }
  if (i === 0) {
    var o = a.length === 0 && r !== null
    if (o) {
      var d = r,
        p = d.parentNode
      ;(Li(p), p.append(d), t.items.clear())
    }
    ps(t, e, !o)
  } else
    ((l = { pending: new Set(e), done: new Set() }),
      (t.outrogroups ?? (t.outrogroups = new Set())).add(l))
}
function ps(t, e, r = !0) {
  var a
  if (t.pending.size > 0) {
    a = new Set()
    for (const i of t.pending.values()) for (const v of i) a.add(t.items.get(v).e)
  }
  for (var s = 0; s < e.length; s++) {
    var l = e[s]
    if (a != null && a.has(l)) {
      l.f |= Ct
      const i = document.createDocumentFragment()
      Cs(l, i)
    } else tt(e[s], r)
  }
}
var Vs
function Se(t, e, r, a, s, l = null) {
  var i = t,
    v = new Map(),
    o = (e & hn) !== 0
  if (o) {
    var d = t
    i = d.appendChild(Gt())
  }
  var p = null,
    g = ks(() => {
      var E = r()
      return ws(E) ? E : E == null ? [] : Ha(E)
    }),
    f,
    _ = new Map(),
    y = !0
  function m(E) {
    ;($.effect.f & it) === 0 &&
      ($.pending.delete(E),
      ($.fallback = p),
      eo($, f, i, e, a),
      p !== null &&
        (f.length === 0
          ? (p.f & Ct) === 0
            ? Fa(p)
            : ((p.f ^= Ct), na(p, null, i))
          : yr(p, () => {
              p = null
            })))
  }
  function w(E) {
    $.pending.delete(E)
  }
  var I = Ba(() => {
      f = n(g)
      for (var E = f.length, R = new Set(), F = ae, Y = Nn(), M = 0; M < E; M += 1) {
        var B = f[M],
          K = a(B, M),
          O = y ? null : v.get(K)
        ;(O
          ? (O.v && Kr(O.v, B), O.i && Kr(O.i, M), Y && F.unskip_effect(O.e))
          : ((O = to(v, y ? i : (Vs ?? (Vs = Gt())), B, K, M, s, e, r)),
            y || (O.e.f |= Ct),
            v.set(K, O)),
          R.add(K))
      }
      if (
        (E === 0 &&
          l &&
          !p &&
          (y ? (p = ht(() => l(i))) : ((p = ht(() => l(Vs ?? (Vs = Gt())))), (p.f |= Ct))),
        E > R.size && Nl(),
        !y)
      )
        if ((_.set(F, R), Y)) {
          for (const [P, z] of v) R.has(P) || F.skip_effect(z.e)
          ;(F.oncommit(m), F.ondiscard(w))
        } else m(F)
      n(g)
    }),
    $ = { effect: I, items: v, pending: _, outrogroups: null, fallback: p }
  y = !1
}
function Qr(t) {
  for (; t !== null && (t.f & _t) === 0;) t = t.next
  return t
}
function eo(t, e, r, a, s) {
  var O, P, z, b, D, S, C, q, W
  var l = (a & Vl) !== 0,
    i = e.length,
    v = t.items,
    o = Qr(t.effect.first),
    d,
    p = null,
    g,
    f = [],
    _ = [],
    y,
    m,
    w,
    I
  if (l)
    for (I = 0; I < i; I += 1)
      ((y = e[I]),
        (m = s(y, I)),
        (w = v.get(m).e),
        (w.f & Ct) === 0 &&
          ((P = (O = w.nodes) == null ? void 0 : O.a) == null || P.measure(),
          (g ?? (g = new Set())).add(w)))
  for (I = 0; I < i; I += 1) {
    if (((y = e[I]), (m = s(y, I)), (w = v.get(m).e), t.outrogroups !== null))
      for (const H of t.outrogroups) (H.pending.delete(w), H.done.delete(w))
    if (
      ((w.f & Je) !== 0 &&
        (Fa(w),
        l &&
          ((b = (z = w.nodes) == null ? void 0 : z.a) == null || b.unfix(),
          (g ?? (g = new Set())).delete(w))),
      (w.f & Ct) !== 0)
    )
      if (((w.f ^= Ct), w === o)) na(w, null, r)
      else {
        var $ = p ? p.next : o
        ;(w === t.effect.last && (t.effect.last = w.prev),
          w.prev && (w.prev.next = w.next),
          w.next && (w.next.prev = w.prev),
          Jt(t, p, w),
          Jt(t, w, $),
          na(w, $, r),
          (p = w),
          (f = []),
          (_ = []),
          (o = Qr(p.next)))
        continue
      }
    if (w !== o) {
      if (d !== void 0 && d.has(w)) {
        if (f.length < _.length) {
          var E = _[0],
            R
          p = E.prev
          var F = f[0],
            Y = f[f.length - 1]
          for (R = 0; R < f.length; R += 1) na(f[R], E, r)
          for (R = 0; R < _.length; R += 1) d.delete(_[R])
          ;(Jt(t, F.prev, Y.next),
            Jt(t, p, F),
            Jt(t, Y, E),
            (o = E),
            (p = Y),
            (I -= 1),
            (f = []),
            (_ = []))
        } else
          (d.delete(w),
            na(w, o, r),
            Jt(t, w.prev, w.next),
            Jt(t, w, p === null ? t.effect.first : p.next),
            Jt(t, p, w),
            (p = w))
        continue
      }
      for (f = [], _ = []; o !== null && o !== w;)
        ((d ?? (d = new Set())).add(o), _.push(o), (o = Qr(o.next)))
      if (o === null) continue
    }
    ;((w.f & Ct) === 0 && f.push(w), (p = w), (o = Qr(w.next)))
  }
  if (t.outrogroups !== null) {
    for (const H of t.outrogroups)
      H.pending.size === 0 && (ps(t, Ha(H.done)), (D = t.outrogroups) == null || D.delete(H))
    t.outrogroups.size === 0 && (t.outrogroups = null)
  }
  if (o !== null || d !== void 0) {
    var M = []
    if (d !== void 0) for (w of d) (w.f & Je) === 0 && M.push(w)
    for (; o !== null;) ((o.f & Je) === 0 && o !== t.fallback && M.push(o), (o = Qr(o.next)))
    var B = M.length
    if (B > 0) {
      var K = (a & hn) !== 0 && i === 0 ? r : null
      if (l) {
        for (I = 0; I < B; I += 1)
          (C = (S = M[I].nodes) == null ? void 0 : S.a) == null || C.measure()
        for (I = 0; I < B; I += 1) (W = (q = M[I].nodes) == null ? void 0 : q.a) == null || W.fix()
      }
      Qi(t, M, K)
    }
  }
  l &&
    lr(() => {
      var H, N
      if (g !== void 0) for (w of g) (N = (H = w.nodes) == null ? void 0 : H.a) == null || N.apply()
    })
}
function to(t, e, r, a, s, l, i, v) {
  var o = (i & Kl) !== 0 ? ((i & Yl) === 0 ? Ci(r, !1, !1) : Er(r)) : null,
    d = (i & Wl) !== 0 ? Er(s) : null
  return {
    v: o,
    i: d,
    e: ht(
      () => (
        l(e, o ?? r, d ?? s, v),
        () => {
          t.delete(a)
        }
      )
    ),
  }
}
function na(t, e, r) {
  if (t.nodes)
    for (
      var a = t.nodes.start, s = t.nodes.end, l = e && (e.f & Ct) === 0 ? e.nodes.start : r;
      a !== null;
    ) {
      var i = wa(a)
      if ((l.before(a), a === s)) return
      a = i
    }
}
function Jt(t, e, r) {
  ;(e === null ? (t.effect.first = r) : (e.next = r),
    r === null ? (t.effect.last = e) : (r.prev = e))
}
function ro(t, e, r = !1, a = !1, s = !1, l = !1) {
  var i = t,
    v = ''
  if (r) var o = t
  L(() => {
    var d = ce
    if (v !== (v = e() ?? '')) {
      if (r) {
        ;((d.nodes = null), (o.innerHTML = v), v !== '' && Mr(It(o), o.lastChild))
        return
      }
      if ((d.nodes !== null && (Hn(d.nodes.start, d.nodes.end), (d.nodes = null)), v !== '')) {
        var p = a ? ai : s ? si : void 0,
          g = Rn(a ? 'svg' : s ? 'math' : 'template', p)
        g.innerHTML = v
        var f = a || s ? g : g.content
        if ((Mr(It(f), f.lastChild), a || s)) for (; It(f);) i.before(It(f))
        else i.before(f)
      }
    }
  })
}
function Ar(t, e, ...r) {
  var a = new tl(t)
  Ba(() => {
    const s = e() ?? null
    a.ensure(s, s && (l => s(l, ...r)))
  }, kr)
}
const Ys = [
  ...` 	
\r\f \v\uFEFF`,
]
function ao(t, e, r) {
  var a = t == null ? '' : '' + t
  if ((e && (a = a ? a + ' ' + e : e), r)) {
    for (var s of Object.keys(r))
      if (r[s]) a = a ? a + ' ' + s : s
      else if (a.length)
        for (var l = s.length, i = 0; (i = a.indexOf(s, i)) >= 0;) {
          var v = i + l
          ;(i === 0 || Ys.includes(a[i - 1])) && (v === a.length || Ys.includes(a[v]))
            ? (a = (i === 0 ? '' : a.substring(0, i)) + a.substring(v + 1))
            : (i = v)
        }
  }
  return a === '' ? null : a
}
function so(t, e) {
  return t == null ? null : String(t)
}
function Ie(t, e, r, a, s, l) {
  var i = t[as]
  if (i !== r || i === void 0) {
    var v = ao(r, a, l)
    ;(v == null ? t.removeAttribute('class') : (t.className = v), (t[as] = r))
  } else if (l && s !== l)
    for (var o in l) {
      var d = !!l[o]
      ;(s == null || d !== !!s[o]) && t.classList.toggle(o, d)
    }
  return l
}
function ot(t, e, r, a) {
  var s = t[ss]
  if (s !== e) {
    var l = so(e)
    ;(l == null ? t.removeAttribute('style') : (t.style.cssText = l), (t[ss] = e))
  }
  return a
}
function Dt(t, e, r = !1) {
  if (t.multiple) {
    if (e == null) return
    if (!ws(e)) return li()
    for (var a of t.options) a.selected = e.includes(va(a))
    return
  }
  for (a of t.options) {
    var s = va(a)
    if (Oi(s, e)) {
      a.selected = !0
      return
    }
  }
  ;(!r || e !== void 0) && (t.selectedIndex = -1)
}
function Xt(t) {
  var e = new MutationObserver(() => {
    Dt(t, t.__value)
  })
  ;(e.observe(t, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ['value'] }),
    zs(() => {
      e.disconnect()
    }))
}
function no(t, e, r = e) {
  var a = new WeakSet(),
    s = !0
  ;(xn(t, 'change', l => {
    var i = l ? '[selected]' : ':checked',
      v
    if (t.multiple) v = [].map.call(t.querySelectorAll(i), va)
    else {
      var o = t.querySelector(i) ?? t.querySelector('option:not([disabled])')
      v = o && va(o)
    }
    ;(r(v), (t.__value = v), ae !== null && a.add(ae))
  }),
    jn(() => {
      var l = e()
      if (t === document.activeElement) {
        var i = ae
        if (a.has(i)) return
      }
      if ((Dt(t, l, s), s && l === void 0)) {
        var v = t.querySelector(':checked')
        v !== null && ((l = va(v)), r(l))
      }
      ;((t.__value = l), (s = !1))
    }),
    Xt(t))
}
function va(t) {
  return '__value' in t ? t.__value : t.value
}
const lo = Symbol('is custom element'),
  io = Symbol('is html'),
  oo = Ol ? 'progress' : 'PROGRESS'
function Os(t, e) {
  var r = rl(t)
  r.value === (r.value = e ?? void 0) ||
    (t.value === e && (e !== 0 || t.nodeName !== oo)) ||
    (t.value = e ?? '')
}
function be(t, e, r, a) {
  var s = rl(t)
  s[e] !== (s[e] = r) &&
    (e === 'loading' && (t[Il] = r),
    r == null
      ? t.removeAttribute(e)
      : typeof r != 'string' && vo(t).includes(e)
        ? (t[e] = r)
        : t.setAttribute(e, r))
}
function rl(t) {
  return t[Ea] ?? (t[Ea] = { [lo]: t.nodeName.includes('-'), [io]: t.namespaceURI === pn })
}
var Js = new Map()
function vo(t) {
  var e = t.getAttribute('is') || t.nodeName,
    r = Js.get(e)
  if (r) return r
  Js.set(e, (r = []))
  for (var a, s = t, l = Element.prototype; l !== s;) {
    a = vn(s)
    for (var i in a)
      a[i].set && i !== 'innerHTML' && i !== 'textContent' && i !== 'innerText' && r.push(i)
    s = bs(s)
  }
  return r
}
function xa(t, e, r = e) {
  var a = new WeakSet()
  ;(xn(t, 'input', async s => {
    var l = s ? t.defaultValue : t.value
    if (((l = Ya(t) ? Ja(l) : l), r(l), ae !== null && a.add(ae), await Bi(), l !== (l = e()))) {
      var i = t.selectionStart,
        v = t.selectionEnd,
        o = t.value.length
      if (((t.value = l ?? ''), v !== null)) {
        var d = t.value.length
        i === v && v === o && d > o
          ? ((t.selectionStart = d), (t.selectionEnd = d))
          : ((t.selectionStart = i), (t.selectionEnd = Math.min(v, d)))
      }
    }
  }),
    Zr(e) == null && t.value && (r(Ya(t) ? Ja(t.value) : t.value), ae !== null && a.add(ae)),
    As(() => {
      var s = e()
      if (t === document.activeElement) {
        var l = ae
        if (a.has(l)) return
      }
      ;(Ya(t) && s === Ja(t.value)) ||
        (t.type === 'date' && !s && !t.value) ||
        (s !== t.value && (t.value = s ?? ''))
    }))
}
function Ya(t) {
  var e = t.type
  return e === 'number' || e === 'range'
}
function Ja(t) {
  return t === '' ? null : +t
}
function Xa(t, e) {
  return t === e || (t == null ? void 0 : t[Ut]) === e
}
function al(t = {}, e, r, a) {
  var s = Me.r,
    l = ce
  return (
    jn(() => {
      var i, v
      return (
        As(() => {
          ;((i = v),
            (v = []),
            Zr(() => {
              Xa(r(...v), t) || (e(t, ...v), i && Xa(r(...i), t) && e(null, ...i))
            }))
        }),
        () => {
          let o = l
          for (; o !== s && o.parent !== null && o.parent.f & rs;) o = o.parent
          const d = () => {
              v && Xa(r(...v), t) && e(null, ...v)
            },
            p = o.teardown
          o.teardown = () => {
            ;(d(), p == null || p())
          }
        }
      )
    }),
    t
  )
}
function $s(t = !1) {
  const e = Me,
    r = e.l.u
  if (!r) return
  let a = () => Ui(e.s)
  if (t) {
    let s = 0,
      l = {}
    const i = Gr(() => {
      let v = !1
      const o = e.s
      for (const d in o) o[d] !== l[d] && ((l[d] = o[d]), (v = !0))
      return (v && s++, s)
    })
    a = () => n(i)
  }
  ;(r.b.length &&
    Ri(() => {
      ;(Xs(e, a), es(r.b))
    }),
    $t(() => {
      const s = Zr(() => r.m.map(Al))
      return () => {
        for (const l of s) typeof l == 'function' && l()
      }
    }),
    r.a.length &&
      $t(() => {
        ;(Xs(e, a), es(r.a))
      }))
}
function Xs(t, e) {
  if (t.l.s) for (const r of t.l.s) n(r)
  e()
}
function fe(t, e, r, a) {
  var R
  var s = !Jr || (r & Xl) !== 0,
    l = (r & Ql) !== 0,
    i = (r & ei) !== 0,
    v = a,
    o = !0,
    d = void 0,
    p = () => (i && s ? (d ?? (d = Gr(a)), n(d)) : (o && ((o = !1), (v = i ? Zr(a) : a)), v))
  let g
  if (l) {
    var f = Ut in t || Cl in t
    g = ((R = $r(t, e)) == null ? void 0 : R.set) ?? (f && e in t ? F => (t[e] = F) : void 0)
  }
  var _,
    y = !1
  ;(l ? ([_, y] = fi(() => t[e])) : (_ = t[e]),
    _ === void 0 && a !== void 0 && ((_ = p()), g && (s && ql(), g(_))))
  var m
  if (
    (s
      ? (m = () => {
          var F = t[e]
          return F === void 0 ? p() : ((o = !0), F)
        })
      : (m = () => {
          var F = t[e]
          return (F !== void 0 && (v = void 0), F === void 0 ? v : F)
        }),
    s && (r & Zl) === 0)
  )
    return m
  if (g) {
    var w = t.$$legacy
    return function (F, Y) {
      return arguments.length > 0 ? ((!s || !Y || w || y) && g(Y ? m() : F), F) : m()
    }
  }
  var I = !1,
    $ = ((r & Jl) !== 0 ? Gr : ks)(() => ((I = !1), m()))
  l && n($)
  var E = ce
  return function (F, Y) {
    if (arguments.length > 0) {
      const M = Y ? n($) : s && l ? Fe(F) : F
      return (T($, M), (I = !0), v !== void 0 && (v = M), F)
    }
    return (Wt && I) || (E.f & it) !== 0 ? $.v : n($)
  }
}
function sl(t) {
  ;(Me === null && $l(),
    Jr && Me.l !== null
      ? co(Me).m.push(t)
      : $t(() => {
          const e = Zr(t)
          if (typeof e == 'function') return e
        }))
}
function co(t) {
  var e = t.l
  return e.u ?? (e.u = { a: [], b: [], m: [] })
}
const uo = '5'
var ln
typeof window < 'u' &&
  ((ln = window.__svelte ?? (window.__svelte = {})).v ?? (ln.v = new Set())).add(uo)
const fo = ['dashboard', 'providers', 'models', 'apps', 'server', 'tester', 'settings']
function nl() {
  const t = typeof window < 'u' ? window.location.hash.replace(/^#\/?/, '') : ''
  return fo.includes(t) ? t : 'dashboard'
}
const bt = Fe({ route: nl() })
function vr(t) {
  typeof window < 'u' && (window.location.hash = `/${t}`)
}
function ho() {
  const t = () => {
    bt.route = nl()
  }
  ;(window.addEventListener('hashchange', t), t())
}
const Pt = Fe({ toasts: [], commandOpen: !1, loadingRoutes: new Set() })
let po = 0
function me(t, e = 'info', r = 4e3) {
  const a = ++po,
    s = { id: a, message: t, kind: e }
  ;((Pt.toasts = [...Pt.toasts, s]), (s.timeout = setTimeout(() => _s(a), r)))
}
function _s(t) {
  const e = Pt.toasts.find(r => r.id === t)
  ;(e != null && e.timeout && clearTimeout(e.timeout),
    (Pt.toasts = Pt.toasts.filter(r => r.id !== t)))
}
function Za() {
  Pt.commandOpen = !0
}
function _o() {
  Pt.commandOpen = !1
}
function go() {
  Pt.commandOpen = !Pt.commandOpen
}
const ll = 'anygate-presets',
  il = 'anygate-recent-folders'
function mo(t) {
  const r = (t == null ? void 0 : t.status) === 404
  return {
    ok: r,
    keychain: {
      available: !1,
      note: r ? 'Health check needs a newer anygate' : 'Unable to reach backend',
    },
    conflictingEnvVars: [],
    port17645Available: !0,
    providerReachability: [],
  }
}
function yo() {
  try {
    const t = localStorage.getItem(ll)
    return t ? JSON.parse(t) : []
  } catch {
    return []
  }
}
function wo(t) {
  try {
    localStorage.setItem(ll, JSON.stringify(t))
  } catch {}
}
function ol() {
  try {
    const t = localStorage.getItem(il)
    return t ? JSON.parse(t) : []
  } catch {
    return []
  }
}
function bo(t) {
  const e = ol().filter(a => a !== t)
  e.unshift(t)
  const r = e.slice(0, 10)
  try {
    localStorage.setItem(il, JSON.stringify(r))
  } catch {}
  return r
}
function xo(t) {
  const { provider: e, modelId: r, contextWindow: a } = t,
    s = []
  return (
    s.push({ key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:<proxy-port>' }),
    e &&
      r &&
      (s.push({ key: 'ANTHROPIC_MODEL', value: `${e.id}__${r}` }),
      s.push({ key: 'CLAUDE_CODE_MAX_CONTEXT_TOKENS', value: String(a ?? 2e5) })),
    s.push({ key: 'ANTHROPIC_AUTH_TOKEN', value: '<proxy-local-token>', masked: !0 }),
    s.push({ key: 'CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY', value: '1' }),
    { env: s, command: e && r ? `anygate ${e.id} --model ${r}` : 'anygate <provider>' }
  )
}
class Zs extends Error {
  constructor(r, a, s) {
    super(r)
    We(this, 'hint')
    We(this, 'status')
    ;((this.name = 'ApiError'), (this.status = a), (this.hint = s))
  }
}
async function vl(t, e, r, a) {
  const s = { method: t, headers: {} }
  r !== void 0 && ((s.headers['Content-Type'] = 'application/json'), (s.body = JSON.stringify(r)))
  let l
  try {
    l = await fetch(e, s)
  } catch (o) {
    throw new Zs(`Network error: ${String(o)}`, 0)
  }
  const i = await l.text(),
    v = i ? JSON.parse(i) : void 0
  if (!l.ok) {
    const o = v
    throw new Zs(
      (o == null ? void 0 : o.error) ?? `Request failed (${l.status})`,
      l.status,
      o == null ? void 0 : o.hint
    )
  }
  return v
}
function Tr(t, e) {
  return vl('GET', t, void 0)
}
function at(t, e, r) {
  return vl('POST', t, e)
}
function Ls() {
  return Tr('/api/config')
}
function dl(t) {
  return at('/api/config', t)
}
function ko() {
  return Tr('/api/models')
}
function So(t) {
  return at('/api/models/test', t)
}
function Po(t, e) {
  return at('/api/keys', { providerId: t, key: e })
}
function Eo(t) {
  return at('/api/providers/refresh', { providerId: t })
}
function Mo() {
  return at('/api/providers/refresh-all')
}
function zo() {
  return Tr('/api/providers/templates')
}
function Ao(t, e, r) {
  return at('/api/providers/add', { templateId: t, key: e, baseUrl: r })
}
function To(t) {
  return at('/api/providers/add-custom', t)
}
function Co(t) {
  return at('/api/providers/delete', { providerId: t })
}
function Io(t) {
  return at('/api/providers/oauth/start', { providerId: t })
}
function Oo(t) {
  return Tr(`/api/providers/oauth/status?sessionId=${encodeURIComponent(t)}`)
}
function $o() {
  return Tr('/api/apps')
}
function Lo(t, e) {
  return at('/api/apps/path', { appId: t, path: e })
}
function No(t) {
  return at('/api/apps/launch', t)
}
function Ro() {
  return at('/api/apps/browse-folder')
}
function Fo() {
  return Tr('/api/server/status')
}
function Do(t) {
  return at('/api/server/start', t)
}
function jo() {
  return at('/api/server/stop')
}
async function qo() {
  try {
    return await Tr('/api/health')
  } catch (t) {
    return mo(t)
  }
}
function Ho() {
  return Promise.resolve(yo())
}
function cl(t) {
  return (wo(t), Promise.resolve({ ok: !0 }))
}
async function Bo() {
  const t = await Ls()
  return JSON.stringify(
    {
      version: 1,
      favoriteModels: t.favoriteModels,
      antigravityCliFavoriteModels: t.antigravityCliFavoriteModels,
    },
    null,
    2
  )
}
async function Uo(t) {
  const e = JSON.parse(t)
  if (!Array.isArray(e.favoriteModels) && !Array.isArray(e.antigravityCliFavoriteModels))
    throw new Error('Invalid config file: missing favoriteModels')
  await dl({
    favoriteModels: e.favoriteModels ?? [],
    antigravityCliFavoriteModels: e.antigravityCliFavoriteModels ?? [],
  })
}
function Go(t) {
  return xo(t)
}
const Ko = new Set([
    'nvidia',
    'groq',
    'togetherai',
    'cerebras',
    'deepinfra',
    'mistral',
    'perplexity',
    'xai',
    'cohere',
    'fireworks',
    'sambanova',
    'scaleway',
    'ovh',
    'venice',
    'openrouter',
    'kilo',
    'ollama',
    'lmstudio',
    'requesty',
    'bytedance',
    'stepfun',
    'z.ai',
    'minimaxai',
    'microsoft',
    'qwen',
    'meta',
    'upstage',
    'sarvamai',
    'abacusai',
  ]),
  Wo = new Set(['openai', 'openai-oauth']),
  Vo = new Set(['google', 'vertex'])
function Yo(t, e) {
  const r = t.toLowerCase()
  if (r.startsWith('claude') || r.includes('anthropic')) return 'anthropic'
  if (e) {
    const a = e.toLowerCase()
    if (Wo.has(a))
      return r.startsWith('gpt') || r.startsWith('o1') || r.startsWith('o3') || r.startsWith('o4')
        ? 'unsupported'
        : 'openai'
    if (Ko.has(a)) return 'openai'
    if (Vo.has(a)) return r.startsWith('gemini') ? 'unsupported' : 'openai'
  }
  return 'openai'
}
function Jo(t) {
  return t.format ? t.format : Yo(t.id, t.providerId)
}
function ul(t) {
  if (typeof t.reasoning == 'boolean') return t.reasoning
  const e = t.id.toLowerCase()
  return /(opus|sonnet|o1|o3|o4|gpt-5|deepseek-r(1|2)|qwen3?-(plus|max|pro)|claude-(3-7|4))/.test(e)
}
function Xo(t) {
  if (Array.isArray(t.supportedParameters)) return t.supportedParameters
  const e = ['tools', 'system']
  return (ul(t) && e.push('reasoning_effort'), t.isFree || e.push('streaming'), e)
}
function Zo(t) {
  return { ...t, format: Jo(t), reasoning: ul(t), supportedParameters: Xo(t) }
}
function Qo(t) {
  const e = new Set(),
    r = t.models.filter(a => (e.has(a.id) ? !1 : (e.add(a.id), !0)))
  return { ...t, enrichedModels: r.map(Zo) }
}
const Ee = Fe({ list: [], loading: !1, error: null })
async function Ns(t) {
  ;((Ee.loading = !0), (Ee.error = null))
  try {
    const e = await ko()
    Ee.list = e.providers.map(Qo)
  } catch (e) {
    Ee.error = e instanceof Error ? e.message : String(e)
  } finally {
    Ee.loading = !1
  }
}
async function fl(t) {
  try {
    const e = await Eo(t)
    if (!e.ok) {
      me(e.error ? String(e.error) : 'Refresh failed', 'error')
      return
    }
    ;(await Ns(), me(`Refreshed ${t} (${e.count ?? 0} models)`, 'success'))
  } catch (e) {
    me(e instanceof Error ? e.message : String(e), 'error')
  }
}
async function Pa() {
  try {
    const t = await Mo()
    ;(await Ns(), me(`Refreshed all · ${t.total} models`, 'success'))
  } catch (t) {
    me(t instanceof Error ? t.message : String(t), 'error')
  }
}
const ev = 20,
  tv = 6,
  he = Fe({ general: [], agy: [], loading: !1, error: null })
async function hl() {
  he.loading = !0
  try {
    const t = await Ls()
    ;((he.general = t.favoriteModels ?? []), (he.agy = t.antigravityCliFavoriteModels ?? []))
  } catch (t) {
    he.error = t instanceof Error ? t.message : String(t)
  } finally {
    he.loading = !1
  }
}
async function Rs() {
  await dl({ favoriteModels: he.general, antigravityCliFavoriteModels: he.agy })
}
function pl(t, e, r = !1) {
  return (r ? he.agy : he.general).some(s => s.providerId === t && s.modelId === e)
}
async function _l(t, e = !1) {
  const r = e ? he.agy : he.general,
    a = e ? tv : ev
  return pl(t.providerId, t.modelId, e)
    ? !0
    : r.length >= a
      ? (me(`Favorite limit reached (${a})`, 'error'), !1)
      : (e ? (he.agy = [...he.agy, t]) : (he.general = [...he.general, t]), await Rs(), !0)
}
async function gs(t, e, r = !1) {
  ;(r
    ? (he.agy = he.agy.filter(a => !(a.providerId === t && a.modelId === e)))
    : (he.general = he.general.filter(a => !(a.providerId === t && a.modelId === e))),
    await Rs())
}
async function rv(t, e = !1) {
  ;(e ? (he.agy = t) : (he.general = t), await Rs())
}
const av = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        addFavorite: _l,
        favorites: he,
        isFavorite: pl,
        loadFavorites: hl,
        removeFavorite: gs,
        reorder: rv,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  Ge = Fe({ list: [], recentFolders: [], loading: !1, error: null })
async function sv() {
  Ge.loading = !0
  try {
    const t = await $o()
    ;((Ge.list = t.apps), (Ge.recentFolders = t.recentLaunchFolders ?? ol()))
  } catch (t) {
    Ge.error = t instanceof Error ? t.message : String(t)
  } finally {
    Ge.loading = !1
  }
}
async function nv(t, e) {
  const r = await Lo(t, e)
  r.ok && ((Ge.list = r.apps), me(e ? 'Path saved' : 'Path cleared', 'success'))
}
async function Qa(t) {
  try {
    const e = await No(t)
    ;(t.cwd && (Ge.recentFolders = bo(t.cwd)), me(`Launched ${t.appId}`, 'success'))
  } catch (e) {
    me(e instanceof Error ? e.message : String(e), 'error')
  }
}
async function Qs() {
  const t = await Ro()
  return t.ok && !t.canceled && t.path ? t.path : null
}
const rr = Fe({
  loaded: null,
  tier: 'zen',
  defaultFolder: null,
  anygateHome: null,
  logPaths: {},
  loading: !1,
})
async function lv() {
  var t, e
  rr.loading = !0
  try {
    ;((rr.loaded = await Ls()),
      (rr.anygateHome =
        ((e = (t = globalThis.process) == null ? void 0 : t.env) == null
          ? void 0
          : e.ANYGATE_HOME) ?? null))
  } catch {
  } finally {
    rr.loading = !1
  }
}
function iv(t) {
  rr.tier = t
}
const Et = Fe({ list: [], loading: !1 })
async function gl() {
  Et.loading = !0
  try {
    Et.list = await Ho()
  } finally {
    Et.loading = !1
  }
}
async function ov(t) {
  const e = t.id ?? `preset-${Date.now()}`,
    r = Et.list.findIndex(l => l.id === e),
    a = [...Et.list],
    s = { ...t, id: e }
  ;(r >= 0 ? (a[r] = s) : a.push(s), (Et.list = a), await cl(a), me('Preset saved', 'success'))
}
async function vv(t) {
  ;((Et.list = Et.list.filter(e => e.id !== t)), await cl(Et.list))
}
di()
var dv = k(
    '<button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-6dohdz"><path></path></svg> <span> </span></button>'
  ),
  cv = k(
    '<aside class="sidebar svelte-6dohdz"><div class="brand svelte-6dohdz"><div class="monogram svelte-6dohdz">a</div> <div class="brand-meta"><div class="brand-name svelte-6dohdz">anygate</div> <div class="brand-byline svelte-6dohdz">ramananbuilds</div></div></div> <div class="version-row svelte-6dohdz"><span class="version svelte-6dohdz"> </span> <span class="health-dot svelte-6dohdz" title="Health check available"></span></div> <nav class="nav svelte-6dohdz" aria-label="Sections"></nav></aside>'
  )
function uv(t, e) {
  pe(e, !1)
  const r = [
      { id: 'dashboard', label: 'Dashboard', icon: 'M3 12l9-9 9 9M5 10v10h5v-6h4v6h5V10' },
      {
        id: 'providers',
        label: 'Providers & Keys',
        icon: 'M3 11h18v11H3zM7 11V7a5 5 0 0 1 10 0v4',
      },
      { id: 'models', label: 'Models', icon: 'M4 6h16M4 12h16M4 18h16' },
      { id: 'apps', label: 'Apps & Launch', icon: 'M2 3h20v14H2zM8 21h8M12 17v4' },
      { id: 'server', label: 'Server', icon: 'M12 2v6M6 8a8 8 0 1 0 12 0' },
      {
        id: 'tester',
        label: 'Model Tester',
        icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3',
      },
      {
        id: 'settings',
        label: 'Settings',
        icon: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 12h2M19 12h2',
      },
    ],
    a = '0.6.0'
  $s()
  var s = cv(),
    l = c(u(s), 2),
    i = u(l),
    v = u(i),
    o = c(l, 2)
  ;(Se(
    o,
    5,
    () => r,
    d => d.id,
    (d, p) => {
      var g = dv()
      let f
      var _ = u(g),
        y = u(_),
        m = c(_, 2),
        w = u(m)
      ;(L(() => {
        ;((f = Ie(g, 1, 'nav-item svelte-6dohdz', null, f, { active: bt.route === n(p).id })),
          be(g, 'aria-current', bt.route === n(p).id ? 'page' : void 0),
          be(y, 'd', n(p).icon),
          A(w, n(p).label))
      }),
        le('click', g, () => vr(n(p).id)),
        h(d, g))
    }
  ),
    L(() => A(v, `v${a}`)),
    h(t, s),
    _e())
}
Oe(['click'])
function fv() {
  return typeof localStorage > 'u'
    ? 'dark'
    : localStorage.getItem('anygate-theme') === 'light'
      ? 'light'
      : 'dark'
}
const ar = Fe({ value: fv() })
function ml(t) {
  typeof document > 'u' || document.documentElement.setAttribute('data-theme', t)
}
typeof document < 'u' && ml(ar.value)
function yl() {
  ;((ar.value = ar.value === 'dark' ? 'light' : 'dark'),
    typeof localStorage < 'u' && localStorage.setItem('anygate-theme', ar.value),
    ml(ar.value))
}
var hv = k('<span><!></span>')
function Ce(t, e) {
  let r = fe(e, 'tone', 3, 'neutral')
  var a = hv(),
    s = u(a)
  ;(Ar(s, () => e.children), L(() => Ie(a, 1, `badge ${r() ?? ''}`, 'svelte-7j44kq')), h(t, a))
}
var pv = k('<button><!></button>')
function ge(t, e) {
  let r = fe(e, 'variant', 3, 'primary'),
    a = fe(e, 'size', 3, 'md'),
    s = fe(e, 'disabled', 3, !1),
    l = fe(e, 'type', 3, 'button')
  var i = pv(),
    v = u(i)
  ;(Ar(v, () => e.children),
    L(() => {
      ;(be(i, 'type', l()),
        Ie(i, 1, `btn ${r() ?? ''} ${a() ?? ''}`, 'svelte-8a1c4v'),
        (i.disabled = s()))
    }),
    le('click', i, function (...o) {
      var d
      ;(d = e.onclick) == null || d.apply(this, o)
    }),
    h(t, i))
}
Oe(['click'])
var _v = k('<div><!></div>')
function Ae(t, e) {
  let r = fe(e, 'padding', 3, '18px'),
    a = fe(e, 'hover', 3, !1),
    s = fe(e, 'class', 3, '')
  var l = _v()
  let i
  var v = u(l)
  ;(Ar(v, () => e.children),
    L(() => {
      ;((i = Ie(l, 1, `card glass ${s() ?? ''}`, 'svelte-it2i29', i, { hover: a() })),
        ot(l, `padding:${r() ?? ''}`),
        be(l, 'role', e.onclick ? 'button' : void 0))
    }),
    le('click', l, function (...o) {
      var d
      ;(d = e.onclick) == null || d.apply(this, o)
    }),
    h(t, l))
}
Oe(['click'])
var gv = k('<div class="drawer-head svelte-1cuwqu"> </div>'),
  mv = k(
    '<div class="backdrop svelte-1cuwqu" role="presentation"><div role="dialog" aria-modal="true" tabindex="-1"><!> <div class="drawer-body svelte-1cuwqu"><!></div></div></div>'
  )
function yv(t, e) {
  let r = fe(e, 'title', 3, ''),
    a = fe(e, 'side', 3, 'right')
  var s = rt(),
    l = te(s)
  {
    var i = v => {
      var o = mv(),
        d = u(o),
        p = u(d)
      {
        var g = y => {
          var m = gv(),
            w = u(m)
          ;(L(() => A(w, r())), h(y, m))
        }
        j(p, y => {
          r() && y(g)
        })
      }
      var f = c(p, 2),
        _ = u(f)
      ;(Ar(_, () => e.children),
        L(() => Ie(d, 1, `drawer glass ${a() ?? ''}`, 'svelte-1cuwqu')),
        le('click', o, function (...y) {
          var m
          ;(m = e.onclose) == null || m.apply(this, y)
        }),
        le('click', d, y => y.stopPropagation()),
        le('keydown', d, y => y.stopPropagation()),
        h(v, o))
    }
    j(l, v => {
      e.open && v(i)
    })
  }
  h(t, s)
}
Oe(['click', 'keydown'])
var wv = k('<div class="sub svelte-16dv2jh"><!></div>'),
  bv = k(
    '<div class="empty svelte-16dv2jh"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path></path></svg> <div class="title svelte-16dv2jh"> </div> <!></div>'
  )
function zr(t, e) {
  let r = fe(e, 'title', 3, 'Nothing here yet'),
    a = fe(e, 'icon', 3, 'M4 4h16v16H4z')
  var s = bv(),
    l = u(s),
    i = u(l),
    v = c(l, 2),
    o = u(v),
    d = c(v, 2)
  {
    var p = g => {
      var f = wv(),
        _ = u(f)
      ;(Ar(_, () => e.children), h(g, f))
    }
    j(d, g => {
      e.children && g(p)
    })
  }
  ;(L(() => {
    ;(be(i, 'd', a()), A(o, r()))
  }),
    h(t, s))
}
var xv = k('<span> </span>'),
  kv = k('<button class="icon-btn svelte-w50x32"><!> <!></button>')
function wl(t, e) {
  let r = fe(e, 'label', 3, ''),
    a = fe(e, 'disabled', 3, !1),
    s = fe(e, 'title', 3, '')
  var l = kv(),
    i = u(l)
  {
    var v = d => {
      var p = xv(),
        g = u(p)
      ;(L(() => A(g, r())), h(d, p))
    }
    j(i, d => {
      r() && d(v)
    })
  }
  var o = c(i, 2)
  ;(Ar(o, () => e.children ?? dn),
    L(() => {
      ;((l.disabled = a()), be(l, 'title', s()), be(l, 'aria-label', s() || r()))
    }),
    le('click', l, function (...d) {
      var p
      ;(p = e.onclick) == null || p.apply(this, d)
    }),
    h(t, l))
}
Oe(['click'])
var Sv = k('<input class="input svelte-1xuvd1z"/>')
function Zt(t, e) {
  pe(e, !0)
  let r = fe(e, 'value', 15, ''),
    a = fe(e, 'placeholder', 3, ''),
    s = fe(e, 'type', 3, 'text'),
    l = fe(e, 'id', 3, '')
  var i = Sv()
  ;(L(() => {
    ;(be(i, 'id', l()), be(i, 'type', s()), be(i, 'placeholder', a()), Os(i, r()))
  }),
    le('input', i, v => {
      var o
      ;(r(v.currentTarget.value), (o = e.oninput) == null || o.call(e, r()))
    }),
    le('keydown', i, function (...v) {
      var o
      ;(o = e.onkeydown) == null || o.apply(this, v)
    }),
    h(t, i),
    _e())
}
Oe(['input', 'keydown'])
var Pv = k('<div class="modal-head svelte-1qk8a2o"> </div>'),
  Ev = k(
    '<div class="backdrop svelte-1qk8a2o" role="presentation"><div class="modal glass svelte-1qk8a2o" role="dialog" aria-modal="true" tabindex="-1"><!> <div class="modal-body"><!></div> <button class="modal-x svelte-1qk8a2o" aria-label="Close">×</button></div></div>'
  )
function xr(t, e) {
  let r = fe(e, 'title', 3, '')
  var a = rt(),
    s = te(a)
  {
    var l = i => {
      var v = Ev(),
        o = u(v),
        d = u(o)
      {
        var p = y => {
          var m = Pv(),
            w = u(m)
          ;(L(() => A(w, r())), h(y, m))
        }
        j(d, y => {
          r() && y(p)
        })
      }
      var g = c(d, 2),
        f = u(g)
      Ar(f, () => e.children)
      var _ = c(g, 2)
      ;(le('click', v, function (...y) {
        var m
        ;(m = e.onclose) == null || m.apply(this, y)
      }),
        le('click', o, y => y.stopPropagation()),
        le('keydown', o, y => y.stopPropagation()),
        le('click', _, function (...y) {
          var m
          ;(m = e.onclose) == null || m.apply(this, y)
        }),
        h(i, v))
    }
    j(s, i => {
      e.open && i(l)
    })
  }
  h(t, a)
}
Oe(['click', 'keydown'])
var Mv = k('<option> </option>'),
  zv = k('<select class="select svelte-13vr5hb"></select>')
function sr(t, e) {
  pe(e, !0)
  let r = fe(e, 'value', 15, ''),
    a = fe(e, 'id', 3, ''),
    s = fe(e, 'disabled', 3, !1)
  function l(o) {
    var d
    ;(r(o.currentTarget.value), (d = e.onchange) == null || d.call(e, r()))
  }
  var i = zv()
  Se(
    i,
    21,
    () => e.options,
    o => o.value,
    (o, d) => {
      var p = Mv(),
        g = u(p),
        f = {}
      ;(L(() => {
        ;(A(g, n(d).label), f !== (f = n(d).value) && (p.value = (p.__value = n(d).value) ?? ''))
      }),
        h(o, p))
    }
  )
  var v
  ;(Xt(i),
    L(() => {
      ;(be(i, 'id', a()),
        (i.disabled = s()),
        v !== (v = r()) && ((i.value = (i.__value = r()) ?? ''), Dt(i, r())))
    }),
    le('change', i, l),
    h(t, i),
    _e())
}
Oe(['change'])
var Av = k('<span class="spinner inline svelte-18351lc"></span>'),
  Tv = k('<span class="lbl"> </span>'),
  Cv = k(
    '<div class="spinner-wrap svelte-18351lc" role="status"><span class="spinner svelte-18351lc"></span> <!></div>'
  )
function ir(t, e) {
  let r = fe(e, 'size', 3, 18),
    a = fe(e, 'label', 3, ''),
    s = fe(e, 'inline', 3, !1)
  var l = rt(),
    i = te(l)
  {
    var v = d => {
        var p = Av()
        ;(L(() => ot(p, `width:${r() ?? ''}px;height:${r() ?? ''}px`)), h(d, p))
      },
      o = d => {
        var p = Cv(),
          g = u(p),
          f = c(g, 2)
        {
          var _ = y => {
            var m = Tv(),
              w = u(m)
            ;(L(() => A(w, a())), h(y, m))
          }
          j(f, y => {
            a() && y(_)
          })
        }
        ;(L(() => {
          ;(be(p, 'aria-label', a() || 'Loading'),
            ot(g, `width:${r() ?? ''}px;height:${r() ?? ''}px`))
        }),
          h(d, p))
      }
    j(i, d => {
      s() ? d(v) : d(o, -1)
    })
  }
  h(t, l)
}
var Iv = k('<button role="tab"> </button>'),
  Ov = k('<div class="tabs svelte-9oumej" role="tablist"></div>')
function bl(t, e) {
  pe(e, !0)
  let r = fe(e, 'active', 15, '')
  var a = Ov()
  ;(Se(
    a,
    21,
    () => e.tabs,
    s => s.id,
    (s, l) => {
      var i = Iv()
      let v
      var o = u(i)
      ;(L(() => {
        ;((v = Ie(i, 1, 'tab svelte-9oumej', null, v, { active: r() === n(l).id })),
          be(i, 'aria-selected', r() === n(l).id),
          A(o, n(l).label))
      }),
        le('click', i, () => {
          var d
          ;(r(n(l).id), (d = e.onchange) == null || d.call(e, n(l).id))
        }),
        h(s, i))
    }
  ),
    h(t, a),
    _e())
}
Oe(['click'])
var $v = k('<span class="lbl svelte-km5m9b"> </span>'),
  Lv = k(
    '<label class="toggle-wrap svelte-km5m9b"><button type="button" role="switch"><span class="knob svelte-km5m9b"></span></button> <!></label>'
  )
function ea(t, e) {
  pe(e, !0)
  let r = fe(e, 'checked', 11, !1),
    a = fe(e, 'label', 3, '')
  var s = Lv(),
    l = u(s)
  let i
  var v = c(l, 2)
  {
    var o = d => {
      var p = $v(),
        g = u(p)
      ;(L(() => A(g, a())), h(d, p))
    }
    j(v, d => {
      a() && d(o)
    })
  }
  ;(L(() => {
    ;(be(l, 'aria-label', a() || 'toggle'),
      be(l, 'aria-checked', r()),
      (i = Ie(l, 1, 'toggle svelte-km5m9b', null, i, { on: r() })))
  }),
    le('click', l, () => {
      var d
      return (d = e.onchange) == null ? void 0 : d.call(e, !r())
    }),
    h(t, s),
    _e())
}
Oe(['click'])
var Nv = Is(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>'
  ),
  Rv = Is(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>'
  ),
  Fv = k(
    '<header class="topbar glass svelte-y7n507"><div class="title svelte-y7n507"><h1 class="svelte-y7n507"> </h1></div> <div class="actions svelte-y7n507"><button class="cmdk svelte-y7n507" title="Command palette (⌘K)"><span class="kbd svelte-y7n507">⌘K</span> Search</button> <!></div></header>'
  )
function Dv(t, e) {
  pe(e, !0)
  const r = {
      dashboard: 'Dashboard',
      providers: 'Providers & Keys',
      models: 'Models',
      apps: 'Apps & Launch',
      server: 'Server Gateway',
      tester: 'Model Tester',
      settings: 'Settings',
    },
    a = J(() => r[bt.route] ?? 'anygate')
  var s = Fv(),
    l = u(s),
    i = u(l),
    v = u(i),
    o = c(l, 2),
    d = u(o),
    p = c(d, 2)
  {
    let g = J(() => (ar.value === 'dark' ? 'Switch to light' : 'Switch to dark'))
    wl(p, {
      get title() {
        return n(g)
      },
      get onclick() {
        return yl
      },
      children: (f, _) => {
        var y = rt(),
          m = te(y)
        {
          var w = $ => {
              var E = Nv()
              h($, E)
            },
            I = $ => {
              var E = Rv()
              h($, E)
            }
          j(m, $ => {
            ar.value === 'dark' ? $(w) : $(I, -1)
          })
        }
        h(f, y)
      },
      $$slots: { default: !0 },
    })
  }
  ;(L(() => A(v, n(a))),
    le('click', d, function (...g) {
      Za == null || Za.apply(this, g)
    }),
    h(t, s),
    _e())
}
Oe(['click'])
var jv = k(
    '<div role="button" tabindex="0"><span class="dot svelte-1kymlcg"></span> <span class="msg"> </span></div>'
  ),
  qv = k('<div class="toaster svelte-1kymlcg" aria-live="polite"></div>')
function Hv(t, e) {
  pe(e, !1)
  function r(s, l) {
    ;(s.key === 'Enter' || s.key === ' ') && (s.preventDefault(), _s(l))
  }
  $s()
  var a = qv()
  ;(Se(
    a,
    5,
    () => Pt.toasts,
    s => s.id,
    (s, l) => {
      var i = jv(),
        v = c(u(i), 2),
        o = u(v)
      ;(L(() => {
        ;(Ie(i, 1, `toast ${n(l).kind ?? ''}`, 'svelte-1kymlcg'), A(o, n(l).message))
      }),
        le('click', i, () => _s(n(l).id)),
        le('keydown', i, d => r(d, n(l).id)),
        h(s, i))
    }
  ),
    h(t, a),
    _e())
}
Oe(['click', 'keydown'])
const Ye = Fe({ status: null, loading: !1, starting: !1, error: null })
let da = null
async function ms() {
  try {
    ;((Ye.status = await Fo()), (Ye.error = null))
  } catch (t) {
    Ye.error = t instanceof Error ? t.message : String(t)
  }
}
function Bv(t = 5e3) {
  da ||
    (ms(),
    (da = setInterval(() => {
      ms()
    }, t)))
}
function Uv() {
  da && (clearInterval(da), (da = null))
}
async function Gv(t) {
  Ye.starting = !0
  try {
    const e = await Do(t)
    return e.ok && e.status
      ? ((Ye.status = e.status), me('Server gateway started', 'success'), !0)
      : (me(e.error ?? 'Failed to start server', 'error'), !1)
  } catch (e) {
    return (me(e instanceof Error ? e.message : String(e), 'error'), !1)
  } finally {
    Ye.starting = !1
  }
}
async function Kv() {
  try {
    ;(await jo(), await ms(), me('Server gateway stopped', 'info'))
  } catch (t) {
    me(t instanceof Error ? t.message : String(t), 'error')
  }
}
var Wv = k(
    '<button class="opt svelte-wh9uu8"><span class="lbl svelte-wh9uu8"> </span> <span class="hint svelte-wh9uu8"> </span></button>'
  ),
  Vv = k('<div class="none svelte-wh9uu8">No matches</div>'),
  Yv = k(
    '<div class="backdrop svelte-wh9uu8" role="presentation"><div class="palette glass svelte-wh9uu8" role="dialog" aria-modal="true" tabindex="-1"><input class="q svelte-wh9uu8" placeholder="Search providers, models, apps…"/> <div class="list svelte-wh9uu8"><!> <!></div></div></div>'
  )
function Jv(t, e) {
  pe(e, !0)
  let r = fe(e, 'query', 15, ''),
    a
  $t(() => {
    a == null || a.focus()
  })
  const s = [
      { id: 'dashboard', route: 'dashboard', label: 'Dashboard', hint: 'Overview & quick launch' },
      {
        id: 'providers',
        route: 'providers',
        label: 'Providers & Keys',
        hint: 'Manage API keys & OAuth',
      },
      { id: 'models', route: 'models', label: 'Models', hint: 'Browse & favorite models' },
      { id: 'apps', route: 'apps', label: 'Apps & Launch', hint: 'Launch Claude, Codex, Gemini' },
      {
        id: 'server',
        route: 'server',
        label: 'Server Gateway',
        hint: 'Start the local API server',
      },
      {
        id: 'settings',
        route: 'settings',
        label: 'Settings',
        hint: 'Theme, presets, import/export',
      },
    ],
    l = J(() =>
      s.filter(
        m =>
          m.label.toLowerCase().includes(r().toLowerCase()) ||
          m.hint.toLowerCase().includes(r().toLowerCase())
      )
    )
  function i(m) {
    ;(vr(m.route), e.onclose())
  }
  function v(m) {
    m.key === 'Escape' && e.onclose()
  }
  var o = Yv()
  Ia('keydown', cs, v)
  var d = u(o),
    p = u(d)
  al(
    p,
    m => (a = m),
    () => a
  )
  var g = c(p, 2),
    f = u(g)
  Se(
    f,
    17,
    () => n(l),
    m => m.id,
    (m, w) => {
      var I = Wv(),
        $ = u(I),
        E = u($),
        R = c($, 2),
        F = u(R)
      ;(L(() => {
        ;(A(E, n(w).label), A(F, n(w).hint))
      }),
        le('click', I, () => i(n(w))),
        h(m, I))
    }
  )
  var _ = c(f, 2)
  {
    var y = m => {
      var w = Vv()
      h(m, w)
    }
    j(_, m => {
      n(l).length === 0 && m(y)
    })
  }
  ;(le('click', o, function (...m) {
    var w
    ;(w = e.onclose) == null || w.apply(this, m)
  }),
    le('click', d, m => m.stopPropagation()),
    le('keydown', d, m => m.stopPropagation()),
    xa(p, r),
    h(t, o),
    _e())
}
Oe(['click', 'keydown'])
async function Xv(t) {
  const e = await fetch(`/api/analytics?range=${t}`, { headers: { Accept: 'application/json' } })
  if (!e.ok) throw new Error(`analytics ${e.status}`)
  return await e.json()
}
const xe = Fe({ report: null, range: 'all', loading: !1, error: null, hasData: !1 })
async function en(t = xe.range) {
  ;((xe.range = t), (xe.loading = !0), (xe.error = null))
  try {
    const e = await Xv(t)
    ;((xe.report = e), (xe.hasData = e.totalTokens > 0 || e.messages > 0))
  } catch (e) {
    ;((xe.report = null),
      (xe.hasData = !1),
      (xe.error =
        e instanceof Error
          ? `Couldn't reach the analytics backend (${e.message}). Run \`anygate ui\` and reload.`
          : 'Couldn’t reach the analytics backend. Run `anygate ui` and reload.'))
  } finally {
    xe.loading = !1
  }
}
const qe = Fe({ report: null, available: !1, loading: !1, error: null })
async function tn() {
  var t, e
  qe.loading = !0
  try {
    const r = await qo()
    ;((qe.report = r),
      (qe.available =
        r.ok ||
        !!((t = r.keychain) != null && t.available) ||
        (((e = r.conflictingEnvVars) == null ? void 0 : e.length) ?? 0) > 0))
  } catch (r) {
    ;((qe.error = r instanceof Error ? r.message : String(r)), (qe.available = !1))
  } finally {
    qe.loading = !1
  }
}
var Zv = k(
    '<div class="note svelte-lftxrq">Health check needs a newer anygate. Showing degraded diagnostics until the backend implements <code class="svelte-lftxrq">/api/health</code>.</div>'
  ),
  Qv = k('<div class="note svelte-lftxrq"> </div>'),
  ed = k(
    '<div class="checks svelte-lftxrq"><div class="check svelte-lftxrq"><span class="k svelte-lftxrq">Keychain / credential store</span> <span class="v svelte-lftxrq"> </span></div> <div class="check svelte-lftxrq"><span class="k svelte-lftxrq">Port 17645</span> <span class="v svelte-lftxrq"> </span></div> <div class="check svelte-lftxrq"><span class="k svelte-lftxrq">Conflicting env vars</span> <span class="v svelte-lftxrq"> </span></div></div> <!>',
    1
  ),
  td = k(
    '<div class="panel svelte-lftxrq"><div class="row svelte-lftxrq"><h3 class="svelte-lftxrq">Connection Health</h3> <!></div> <!> <!> <div class="actions svelte-lftxrq"><!></div></div>'
  )
function rd(t, e) {
  pe(e, !0)
  let r = ee(!1)
  $t(() => {
    n(r) || (tn(), T(r, !0))
  })
  var a = td(),
    s = u(a),
    l = c(u(s), 2)
  {
    var i = m => {
        ir(m, { inline: !0, size: 16 })
      },
      v = m => {
        Ce(m, {
          tone: 'success',
          children: (w, I) => {
            var $ = Z('OK')
            h(w, $)
          },
          $$slots: { default: !0 },
        })
      },
      o = m => {
        Ce(m, {
          tone: 'warning',
          children: (w, I) => {
            var $ = Z('Limited')
            h(w, $)
          },
          $$slots: { default: !0 },
        })
      }
    j(l, m => {
      qe.loading ? m(i) : qe.available ? m(v, 1) : m(o, -1)
    })
  }
  var d = c(s, 2)
  {
    var p = m => {
      var w = Zv()
      h(m, w)
    }
    j(d, m => {
      !qe.available && !qe.loading && m(p)
    })
  }
  var g = c(d, 2)
  {
    var f = m => {
      var w = ed(),
        I = te(w),
        $ = u(I),
        E = c(u($), 2),
        R = u(E),
        F = c($, 2),
        Y = c(u(F), 2),
        M = u(Y),
        B = c(F, 2),
        K = c(u(B), 2),
        O = u(K),
        P = c(I, 2)
      {
        var z = b => {
          var D = Qv(),
            S = u(D)
          ;(L(() => A(S, qe.report.note)), h(b, D))
        }
        j(P, b => {
          qe.report.note && b(z)
        })
      }
      ;(L(
        b => {
          var D
          ;(A(R, (D = qe.report.keychain) != null && D.available ? 'Available' : 'Unavailable'),
            A(M, qe.report.port17645Available ? 'Free' : 'In use'),
            A(O, b))
        },
        [
          () => {
            var b
            return (b = qe.report.conflictingEnvVars) != null && b.length
              ? qe.report.conflictingEnvVars.join(', ')
              : 'None'
          },
        ]
      ),
        h(m, w))
    }
    j(g, m => {
      qe.report && m(f)
    })
  }
  var _ = c(g, 2),
    y = u(_)
  ;(ge(y, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => tn(),
    children: (m, w) => {
      var I = Z('Re-check')
      h(m, I)
    },
    $$slots: { default: !0 },
  }),
    h(t, a),
    _e())
}
var ad = k('<button> </button>'),
  sd = k('<div class="seg svelte-1yfbpb7" role="group" aria-label="Time range"></div>')
function nd(t, e) {
  pe(e, !0)
  let r = fe(e, 'value', 15, 'all')
  const a = [
    { id: 'all', label: 'All' },
    { id: '30d', label: '30d' },
    { id: '7d', label: '7d' },
  ]
  var s = sd()
  ;(Se(
    s,
    21,
    () => a,
    l => l.id,
    (l, i) => {
      var v = ad()
      let o
      var d = u(v)
      ;(L(() => {
        ;((o = Ie(v, 1, 'opt svelte-1yfbpb7', null, o, { active: r() === n(i).id })),
          be(v, 'aria-pressed', r() === n(i).id),
          A(d, n(i).label))
      }),
        le('click', v, () => {
          var p
          ;(r(n(i).id), (p = e.onchange) == null || p.call(e, n(i).id))
        }),
        h(l, v))
    }
  ),
    h(t, s),
    _e())
}
Oe(['click'])
var ld = k('<span class="sub svelte-14oot77"> </span>'),
  id = k(
    '<div class="stat svelte-14oot77"><span class="lbl svelte-14oot77"> </span> <span class="num svelte-14oot77"> </span> <!></div>'
  )
function od(t, e) {
  var r = id(),
    a = u(r),
    s = u(a),
    l = c(a, 2),
    i = u(l),
    v = c(l, 2)
  {
    var o = d => {
      var p = ld(),
        g = u(p)
      ;(L(() => A(g, e.sub)), h(d, p))
    }
    j(v, d => {
      e.sub && d(o)
    })
  }
  ;(L(() => {
    ;(A(s, e.label), be(l, 'title', e.value), A(i, e.value))
  }),
    h(t, r))
}
var vd = k('<div class="grid svelte-9jn9wt"></div>')
function dd(t, e) {
  pe(e, !0)
  function r(i) {
    return i >= 1e9
      ? `${(i / 1e9).toFixed(1)}B`
      : i >= 1e6
        ? `${(i / 1e6).toFixed(1)}M`
        : i >= 1e3
          ? `${(i / 1e3).toFixed(1)}k`
          : String(i)
  }
  function a(i) {
    const v = i < 12
    return `${i % 12 === 0 ? 12 : i % 12} ${v ? 'AM' : 'PM'}`
  }
  const s = J(() => [
    { label: 'Sessions', value: r(e.report.sessions) },
    { label: 'Messages', value: r(e.report.messages) },
    { label: 'Total tokens', value: r(e.report.totalTokens) },
    { label: 'Active days', value: String(e.report.activeDays) },
    { label: 'Current streak', value: `${e.report.currentStreakDays}d` },
    { label: 'Longest streak', value: `${e.report.longestStreakDays}d` },
    { label: 'Peak hour', value: a(e.report.peakHour) },
    { label: 'Favorite model', value: e.report.favoriteModel },
  ])
  var l = vd()
  ;(Se(
    l,
    21,
    () => n(s),
    i => i.label,
    (i, v) => {
      Ae(i, {
        padding: '18px',
        children: (o, d) => {
          od(o, {
            get label() {
              return n(v).label
            },
            get value() {
              return n(v).value
            },
          })
        },
        $$slots: { default: !0 },
      })
    }
  ),
    h(t, l),
    _e())
}
var cd = k('<span> </span>'),
  ud = k('<div class="cell svelte-1ryzkww"></div>'),
  fd = k('<div class="cell empty svelte-1ryzkww"></div>'),
  hd = k('<div class="col svelte-1ryzkww"></div>'),
  pd = k('<span class="key svelte-1ryzkww"></span>'),
  _d = k(
    '<div class="heat svelte-1ryzkww"><div class="months svelte-1ryzkww"></div> <div class="weeks svelte-1ryzkww"></div> <div class="legend svelte-1ryzkww"><span>Less</span> <!> <span>More</span></div></div>'
  )
function gd(t, e) {
  pe(e, !0)
  const r = J(() => {
      if (e.days.length === 0) return []
      const f = new Date(e.days[0].date + 'T00:00:00').getDay(),
        _ = [...Array(f).fill(null), ...e.days],
        y = []
      for (let m = 0; m < _.length; m += 7) y.push(_.slice(m, m + 7))
      return y
    }),
    a = J(() => {
      const g = []
      let f = -1
      return (
        e.days.forEach((_, y) => {
          const m = y + (n(r).length ? new Date(e.days[0].date + 'T00:00:00').getDay() : 0),
            w = Math.floor(m / 7),
            I = new Date(_.date + 'T00:00:00').getMonth()
          I !== f &&
            (g.push({
              col: w,
              label: new Date(_.date + 'T00:00:00').toLocaleString('en', { month: 'short' }),
            }),
            (f = I))
        }),
        g
      )
    }),
    s = g =>
      g >= 1e9
        ? `${(g / 1e9).toFixed(1)}B`
        : g >= 1e6
          ? `${(g / 1e6).toFixed(1)}M`
          : g >= 1e3
            ? `${(g / 1e3).toFixed(1)}k`
            : String(g),
    l = g => {
      switch (g) {
        case 0:
          return 'var(--bg)'
        case 1:
          return 'color-mix(in srgb, var(--accent) 22%, transparent)'
        case 2:
          return 'color-mix(in srgb, var(--accent) 45%, transparent)'
        case 3:
          return 'color-mix(in srgb, var(--accent) 70%, transparent)'
        default:
          return 'var(--accent)'
      }
    }
  var i = _d(),
    v = u(i)
  Se(
    v,
    21,
    () => n(r),
    br,
    (g, f, _) => {
      const y = J(() => n(a).find($ => $.col === _))
      var m = cd()
      let w
      var I = u(m)
      ;(L(() => {
        ;((w = Ie(m, 1, 'month svelte-1ryzkww', null, w, { has: !!n(y) })),
          A(I, n(y) ? n(y).label : ''))
      }),
        h(g, m))
    }
  )
  var o = c(v, 2)
  Se(
    o,
    21,
    () => n(r),
    br,
    (g, f) => {
      var _ = hd()
      ;(Se(
        _,
        21,
        () => n(f),
        br,
        (y, m) => {
          var w = rt(),
            I = te(w)
          {
            var $ = R => {
                var F = ud()
                ;(L(
                  (Y, M) => {
                    ;(ot(F, `background:${Y ?? ''}`), be(F, 'title', M))
                  },
                  [() => l(n(m).intensity), () => `${n(m).date} · ${s(n(m).count)} tokens`]
                ),
                  h(R, F))
              },
              E = R => {
                var F = fd()
                h(R, F)
              }
            j(I, R => {
              n(m) ? R($) : R(E, -1)
            })
          }
          h(y, w)
        }
      ),
        h(g, _))
    }
  )
  var d = c(o, 2),
    p = c(u(d), 2)
  ;(Se(
    p,
    16,
    () => [0, 1, 2, 3, 4],
    g => g,
    (g, f) => {
      var _ = pd()
      ;(L(y => ot(_, `background:${y ?? ''}`), [() => l(f)]), h(g, _))
    }
  ),
    h(t, i),
    _e())
}
var md = k('<span> </span>'),
  yd = k('<div class="gridline svelte-1ozbyr9"></div>'),
  wd = k(
    '<div class="bar-col svelte-1ozbyr9"><div class="bar-area svelte-1ozbyr9"><div></div></div> <div class="xlabel svelte-1ozbyr9"><!></div></div>'
  ),
  bd = k('<div class="scroll-hint svelte-1ozbyr9">→ scroll left for older days</div>'),
  xd = k(
    '<div class="chart svelte-1ozbyr9"><div class="yaxis svelte-1ozbyr9" aria-hidden="true"></div> <div class="scroll svelte-1ozbyr9"><div class="bars svelte-1ozbyr9"><div class="gridlines svelte-1ozbyr9"></div> <!></div> <!></div></div>'
  )
function kd(t, e) {
  pe(e, !0)
  const r = J(() => Math.max(1, ...e.data.map(E => E.tokens)))
  function a(E) {
    if (E <= 0) return 1
    const R = Math.floor(Math.log10(E)),
      F = Math.pow(10, R),
      Y = E / F
    let M
    return (Y <= 1 ? (M = 1) : Y <= 2 ? (M = 2) : Y <= 5 ? (M = 5) : (M = 10), M * F)
  }
  const s = J(() => a(n(r))),
    l = J(() => Array.from({ length: 5 }, (E, R) => n(s) * (1 - R / 4)))
  function i(E) {
    return E >= 1e9
      ? `${(E / 1e9).toFixed(1)}B`
      : E >= 1e6
        ? `${(E / 1e6).toFixed(0)}M`
        : E >= 1e3
          ? `${(E / 1e3).toFixed(0)}k`
          : String(E)
  }
  function v(E) {
    return new Date(E + 'T00:00:00').toLocaleString('en', { month: 'short' })
  }
  function o(E) {
    if (E === 0) return !0
    const R = new Date(e.data[E - 1].date + 'T00:00:00').getMonth(),
      F = new Date(e.data[E].date + 'T00:00:00').getMonth()
    return R !== F
  }
  let d = ee(null)
  const p = J(() => (n(d) ? n(d).scrollWidth - n(d).clientWidth > 8 : !1))
  $t(() => {
    e.data
    const E = n(d)
    E && E.scrollWidth > E.clientWidth && (E.scrollLeft = E.scrollWidth)
  })
  var g = xd(),
    f = u(g)
  Se(
    f,
    20,
    () => n(l),
    E => E,
    (E, R) => {
      var F = md(),
        Y = u(F)
      ;(L(M => A(Y, M), [() => i(R)]), h(E, F))
    }
  )
  var _ = c(f, 2),
    y = u(_),
    m = u(y)
  Se(
    m,
    20,
    () => n(l),
    E => E,
    (E, R) => {
      var F = yd()
      h(E, F)
    }
  )
  var w = c(m, 2)
  Se(
    w,
    19,
    () => e.data,
    E => E.date,
    (E, R, F) => {
      var Y = wd(),
        M = u(Y),
        B = u(M)
      let K
      var O = c(M, 2),
        P = u(O)
      {
        var z = D => {
            var S = Z()
            ;(L(C => A(S, C), [() => v(n(R).date)]), h(D, S))
          },
          b = J(() => o(n(F)))
        j(P, D => {
          n(b) && D(z)
        })
      }
      ;(L(
        D => {
          ;(be(Y, 'title', D),
            (K = Ie(B, 1, 'bar svelte-1ozbyr9', null, K, { active: n(R).tokens > 0 })),
            ot(B, `height:${(n(R).tokens / n(s)) * 100}%`))
        },
        [() => `${n(R).date} · ${i(n(R).tokens)} tokens`]
      ),
        h(E, Y))
    }
  )
  var I = c(y, 2)
  {
    var $ = E => {
      var R = bd()
      h(E, R)
    }
    j(I, E => {
      n(p) && E($)
    })
  }
  ;(al(
    _,
    E => T(d, E),
    () => n(d)
  ),
    h(t, g),
    _e())
}
var Sd = k('<span> </span>'),
  Pd = k('<span class="app-badge svelte-1ca0tub"> </span>'),
  Ed = k(
    '<div class="row svelte-1ca0tub"><span class="dot svelte-1ca0tub"></span> <div class="id svelte-1ca0tub"><div class="name svelte-1ca0tub"> </div> <div class="meta svelte-1ca0tub"><!></div></div> <div class="nums svelte-1ca0tub"><span class="in svelte-1ca0tub"> </span> <span class="out svelte-1ca0tub"> </span></div> <div class="share svelte-1ca0tub"><div class="track svelte-1ca0tub"><div class="fill svelte-1ca0tub"></div></div> <span class="pct svelte-1ca0tub"> </span></div></div>'
  ),
  Md = k('<div class="list svelte-1ca0tub"></div>')
function zd(t, e) {
  pe(e, !0)
  function r(i) {
    return i >= 1e9
      ? `${(i / 1e9).toFixed(1)}B`
      : i >= 1e6
        ? `${(i / 1e6).toFixed(1)}M`
        : i >= 1e3
          ? `${(i / 1e3).toFixed(0)}k`
          : String(i)
  }
  function a(i) {
    const v = i.map(f => f.share * 100),
      o = v.map(f => Math.floor(f))
    let d = 100 - o.reduce((f, _) => f + _, 0)
    const p = v.map((f, _) => ({ i: _, frac: f - Math.floor(f) })).sort((f, _) => _.frac - f.frac),
      g = o.slice()
    for (let f = 0; f < p.length && d > 0; f++) ((g[p[f].i] += 1), d--)
    return g
  }
  const s = J(() => a(e.models))
  var l = Md()
  ;(Se(
    l,
    23,
    () => e.models,
    i => i.provider + i.model,
    (i, v, o) => {
      var d = Ed(),
        p = u(d),
        g = c(p, 2),
        f = u(g),
        _ = u(f),
        y = c(f, 2),
        m = u(y)
      {
        var w = z => {
            var b = rt(),
              D = te(b)
            ;(Se(
              D,
              16,
              () => n(v).apps,
              S => S,
              (S, C) => {
                var q = Sd()
                let W
                var H = u(q)
                ;(L(
                  N => {
                    ;((W = Ie(q, 1, 'app-badge svelte-1ca0tub', null, W, N)), A(H, C))
                  },
                  [() => ({ agy: C.toLowerCase() === 'antigravity' })]
                ),
                  h(S, q))
              }
            ),
              h(z, b))
          },
          I = z => {
            var b = Pd(),
              D = u(b)
            ;(L(() => A(D, n(v).app)), h(z, b))
          }
        j(m, z => {
          var b
          ;(b = n(v).apps) != null && b.length ? z(w) : z(I, -1)
        })
      }
      var $ = c(g, 2),
        E = u($),
        R = u(E),
        F = c(E, 2),
        Y = u(F),
        M = c($, 2),
        B = u(M),
        K = u(B),
        O = c(B, 2),
        P = u(O)
      ;(L(
        (z, b) => {
          ;(ot(p, `background:${n(v).color ?? ''}`),
            be(f, 'title', `${n(v).provider ?? ''}: ${n(v).model ?? ''}`),
            A(_, `${n(v).provider ?? ''}: ${n(v).model ?? ''}`),
            A(R, `↓ ${z ?? ''}`),
            A(Y, `↑ ${b ?? ''}`),
            ot(K, `width:${n(s)[n(o)] ?? ''}%; background:${n(v).color ?? ''}`),
            A(P, `${n(s)[n(o)] ?? ''}%`))
        },
        [() => r(n(v).inputTokens), () => r(n(v).outputTokens)]
      ),
        h(i, d))
    }
  ),
    h(t, l),
    _e())
}
var Ad = k('<span class="offline svelte-1thed0a">Offline</span>'),
  Td = k(
    '<span class="empty svelte-1thed0a" title="No usage recorded yet — use anygate with a provider to populate real stats">No data yet</span>'
  ),
  Cd = k('<div class="loading svelte-1thed0a"><!></div>'),
  Id = k(
    '<div class="notice svelte-1thed0a"><p class="notice-title svelte-1thed0a">Can’t load real analytics</p> <p class="notice-body svelte-1thed0a"> </p></div>'
  ),
  Od = k(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Activity</h3><span class="hint svelte-1thed0a"> </span></div> <!>',
    1
  ),
  $d = k('<div class="section svelte-1thed0a"><!></div> <!>', 1),
  Ld = k(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Token volume</h3><span class="hint svelte-1thed0a">Total tokens per day</span></div> <!>',
    1
  ),
  Nd = k(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Model breakdown</h3><span class="hint svelte-1thed0a">Share of total usage</span></div> <!>',
    1
  ),
  Rd = k('<!> <!>', 1),
  Fd = k('<p class="muted svelte-1thed0a">No apps detected. Add a provider first.</p>'),
  Dd = k(
    '<p class="launch-note svelte-1thed0a">Open your agents with anygate models pre-wired, or send your whole favorites catalog into the app switcher.</p> <div class="quick svelte-1thed0a"></div>',
    1
  ),
  jd = k(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Apps &amp; Launch</h3></div> <!>',
    1
  ),
  qd = k(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Providers</span></div>'
  ),
  Hd = k(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Models</span></div>'
  ),
  Bd = k(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Favorites</span></div>'
  ),
  Ud = k(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Apps ready</span> <!></div>'
  ),
  Gd = k(
    '<div class="dash svelte-1thed0a"><div class="head svelte-1thed0a"><div class="title svelte-1thed0a"><div class="title-row svelte-1thed0a"><h2 class="svelte-1thed0a">Dashboard</h2> <!> <!></div> <p class="svelte-1thed0a"> </p></div> <!></div> <!> <!> <div class="cols mt svelte-1thed0a"><!> <!></div> <div class="grid mt svelte-1thed0a"><!> <!> <!> <!></div></div>'
  )
function Kd(t, e) {
  ;(pe(e, !0), fe(e, 'showSampleBadge', 3, !0))
  let r = ee('overview')
  const a = J(() => Ee.list.reduce((S, C) => S + C.enrichedModels.length, 0)),
    s = J(() => Ee.list.length),
    l = J(() => Ge.list.filter(S => S.installed))
  function i(S) {
    en(S)
  }
  $t(() => {
    en(xe.range)
  })
  var v = Gd(),
    o = u(v),
    d = u(o),
    p = u(d),
    g = c(u(p), 2)
  {
    var f = S => {
      var C = Ad()
      ;(L(() => be(C, 'title', xe.error)), h(S, C))
    }
    j(g, S => {
      xe.error && S(f)
    })
  }
  var _ = c(g, 2)
  {
    var y = S => {
      var C = Td()
      h(S, C)
    }
    j(_, S => {
      !xe.error && !xe.hasData && S(y)
    })
  }
  var m = c(p, 2),
    w = u(m),
    I = c(d, 2)
  nd(I, {
    get value() {
      return xe.range
    },
    onchange: i,
  })
  var $ = c(o, 2)
  bl($, {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'models', label: 'Models' },
    ],
    get active() {
      return n(r)
    },
    set active(S) {
      T(r, S, !0)
    },
  })
  var E = c($, 2)
  {
    var R = S => {
        var C = Cd(),
          q = u(C)
        ;(ir(q, { label: 'Loading analytics…' }), h(S, C))
      },
      F = S => {
        var C = Id(),
          q = c(u(C), 2),
          W = u(q)
        ;(L(() => A(W, xe.error)), h(S, C))
      },
      Y = S => {
        var C = rt(),
          q = te(C)
        {
          var W = N => {
              var V = $d(),
                U = te(V),
                G = u(U)
              dd(G, {
                get report() {
                  return xe.report
                },
              })
              var X = c(U, 2)
              ;(Ae(X, {
                padding: '20px',
                class: 'mt',
                children: (re, se) => {
                  var ne = Od(),
                    ie = te(ne),
                    we = c(u(ie)),
                    Q = u(we),
                    ve = c(ie, 2)
                  ;(gd(ve, {
                    get days() {
                      return xe.report.heatmap
                    },
                  }),
                    L(() =>
                      A(
                        Q,
                        `Daily activity over ${(xe.range === 'all' ? 'the last year' : xe.range) ?? ''}`
                      )
                    ),
                    h(re, ne))
                },
                $$slots: { default: !0 },
              }),
                h(N, V))
            },
            H = N => {
              var V = Rd(),
                U = te(V)
              Ae(U, {
                padding: '20px',
                class: 'mt',
                children: (X, re) => {
                  var se = Ld(),
                    ne = c(te(se), 2)
                  ;(kd(ne, {
                    get data() {
                      return xe.report.dailyTokens
                    },
                  }),
                    h(X, se))
                },
                $$slots: { default: !0 },
              })
              var G = c(U, 2)
              ;(Ae(G, {
                padding: '20px',
                class: 'mt',
                children: (X, re) => {
                  var se = Nd(),
                    ne = c(te(se), 2)
                  ;(zd(ne, {
                    get models() {
                      return xe.report.models
                    },
                  }),
                    h(X, se))
                },
                $$slots: { default: !0 },
              }),
                h(N, V))
            }
          j(q, N => {
            n(r) === 'overview' ? N(W) : N(H, -1)
          })
        }
        h(S, C)
      }
    j(E, S => {
      xe.loading && !xe.report ? S(R) : xe.error ? S(F, 1) : xe.report && S(Y, 2)
    })
  }
  var M = c(E, 2),
    B = u(M)
  Ae(B, {
    padding: '20px',
    children: (S, C) => {
      var q = jd(),
        W = c(te(q), 2)
      {
        var H = U => {
            ir(U, { label: 'Loading apps…' })
          },
          N = U => {
            var G = Fd()
            h(U, G)
          },
          V = U => {
            var G = Dd(),
              X = c(te(G), 2)
            ;(Se(
              X,
              21,
              () => n(l),
              re => re.id,
              (re, se) => {
                ge(re, {
                  variant: 'subtle',
                  onclick: () => vr('apps'),
                  children: (ne, ie) => {
                    var we = Z()
                    ;(L(() => A(we, n(se).name)), h(ne, we))
                  },
                  $$slots: { default: !0 },
                })
              }
            ),
              h(U, G))
          }
        j(W, U => {
          Ge.loading ? U(H) : n(l).length === 0 ? U(N, 1) : U(V, -1)
        })
      }
      h(S, q)
    },
    $$slots: { default: !0 },
  })
  var K = c(B, 2)
  rd(K, {})
  var O = c(M, 2),
    P = u(O)
  Ae(P, {
    hover: !0,
    padding: '18px',
    onclick: () => vr('providers'),
    children: (S, C) => {
      var q = qd(),
        W = u(q),
        H = u(W)
      ;(L(() => A(H, n(s))), h(S, q))
    },
    $$slots: { default: !0 },
  })
  var z = c(P, 2)
  Ae(z, {
    hover: !0,
    padding: '18px',
    onclick: () => vr('models'),
    children: (S, C) => {
      var q = Hd(),
        W = u(q),
        H = u(W)
      ;(L(() => A(H, n(a))), h(S, q))
    },
    $$slots: { default: !0 },
  })
  var b = c(z, 2)
  Ae(b, {
    hover: !0,
    padding: '18px',
    onclick: () => vr('models'),
    children: (S, C) => {
      var q = Bd(),
        W = u(q),
        H = u(W)
      ;(L(() => A(H, he.general.length + he.agy.length)), h(S, q))
    },
    $$slots: { default: !0 },
  })
  var D = c(b, 2)
  ;(Ae(D, {
    hover: !0,
    padding: '18px',
    onclick: () => vr('apps'),
    children: (S, C) => {
      var q = Ud(),
        W = u(q),
        H = u(W),
        N = c(W, 3)
      {
        var V = U => {
          Ce(U, {
            tone: 'success',
            children: (G, X) => {
              var re = Z('server on')
              h(G, re)
            },
            $$slots: { default: !0 },
          })
        }
        j(N, U => {
          var G
          ;(G = Ye.status) != null && G.running && U(V)
        })
      }
      ;(L(() => A(H, n(l).length)), h(S, q))
    },
    $$slots: { default: !0 },
  }),
    L(() =>
      A(
        w,
        `Usage analytics for your local gateway · ${(xe.range === 'all' ? 'all time' : xe.range) ?? ''}`
      )
    ),
    h(t, v),
    _e())
}
const rn = {
    anthropic: ['#d97757', '#b3543a'],
    openai: ['#10a37f', '#0d8268'],
    google: ['#4285f4', '#34a853'],
    gemini: ['#4285f4', '#a855f7'],
    xai: ['#ae1fym', '#1a1a1a'],
    openrouter: ['#f1553a', '#c43e26'],
    deepseek: ['#4d6bfe', '#3457d5'],
    ollama: ['#e6e6e6', '#b0b0b0'],
    kilocode: ['#7c5cff', '#5b3fd6'],
    mistral: ['#fa520f', '#d23c00'],
    meta: ['#0668e1', '#0a4fb0'],
    qwen: ['#615ced', '#4633c4'],
    default: ['#e0a44a', '#b5822f'],
  },
  Wd = {
    anthropic:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3.2l6.5-3.75a1 1 0 0 1 1.5.87V11l3.5-2.02a1 1 0 0 1 1 1.73L21.5 13l3.5 2.02a1 1 0 0 1-1 1.73L20 14.98V22a1 1 0 0 1-1.5.87L12 19.12V23a1 1 0 0 1-2 0v-3.88L3.5 22.87A1 1 0 0 1 2 22v-7.02L-1.5 17a1 1 0 0 1-1-1.73L2.5 13l-3.5-2.02a1 1 0 0 1 1-1.73L4 9.98V2a1 1 0 0 1 1.5-.87L12 4.8V3a1 1 0 0 1 1-1z" transform="translate(1 1)"/></svg>',
    openai:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a4 4 0 0 0-.7-2.3l.1-.1a3.7 3.7 0 0 0-5.2-5.2l-.1.1A4 4 0 0 0 12 2l-.1.1A3.7 3.7 0 0 0 7.1 4.7l-.1-.1a3.7 3.7 0 0 0-5.2 5.2l.1.1A4 4 0 0 0 2 12l-.1.1A3.7 3.7 0 0 0 4.7 16.9l.1-.1A4 4 0 0 0 12 22l.1-.1A3.7 3.7 0 0 0 16.9 19.3l.1.1a3.7 3.7 0 0 0 5.2-5.2l-.1-.1A4 4 0 0 0 22 12zM12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/></svg>',
    google:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9l3 2.3c1.7-1.6 2.8-4 2.8-6.9 0-.7-.1-1.3-.2-1.9zM6.5 13.5a4.5 4.5 0 0 1 0-3l-3-2.3a8 8 0 0 0 0 7.6zM12 6.2c1.5 0 2.8.5 3.8 1.5l2.9-2.9A8 8 0 0 0 3.5 8.7l3 2.3A4.5 4.5 0 0 1 12 6.2z"/></svg>',
  }
function Vd(t) {
  const e = t.toLowerCase()
  return { svg: Wd[e], gradient: rn[e] ?? rn.default }
}
var Yd = k('<span class="svg svelte-1va9fof"></span>'),
  Jd = k('<span class="mono svelte-1va9fof"> </span>'),
  Xd = k('<span class="logo svelte-1va9fof"><!></span>')
function Fs(t, e) {
  pe(e, !0)
  let r = fe(e, 'size', 3, 34)
  const a = J(() => Vd(e.id)),
    s = J(() => e.id.slice(0, 1).toUpperCase())
  var l = Xd(),
    i = u(l)
  {
    var v = d => {
        var p = Yd()
        ;(ro(p, () => n(a).svg, !0),
          L(() => ot(p, `width:${r() * 0.55}px;height:${r() * 0.55}px`)),
          h(d, p))
      },
      o = d => {
        var p = Jd(),
          g = u(p)
        ;(L(() => {
          ;(ot(p, `font-size:${r() * 0.42}px`), A(g, n(s)))
        }),
          h(d, p))
      }
    j(i, d => {
      n(a).svg ? d(v) : d(o, -1)
    })
  }
  ;(L(() =>
    ot(
      l,
      `width:${r() ?? ''}px;height:${r() ?? ''}px;background:linear-gradient(135deg,${n(a).gradient[0] ?? ''},${n(a).gradient[1] ?? ''});`
    )
  ),
    h(t, l),
    _e())
}
var Zd = k('<span class="chip svelte-1p75598"> </span>'),
  Qd = k('<span class="chip more svelte-1p75598"> </span>'),
  ec = k('<span class="chip empty svelte-1p75598">no models yet</span>'),
  tc = k(
    '<a class="keylink svelte-1p75598" target="_blank" rel="noopener noreferrer">Get key →</a>'
  ),
  rc = k('<!> <!>', 1),
  ac = Is(
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"></path></svg>'
  ),
  sc = k(
    '<div class="card svelte-1p75598"><div class="head svelte-1p75598"><!> <div class="meta svelte-1p75598"><div class="name svelte-1p75598"> </div> <div class="sub svelte-1p75598"> <span class="id svelte-1p75598"> </span></div></div> <div class="status"><!></div></div> <div class="models svelte-1p75598"><!> <!> <!></div> <div class="actions svelte-1p75598"><!> <!></div></div>'
  )
function nc(t, e) {
  pe(e, !0)
  var r = sc(),
    a = u(r),
    s = u(a)
  Fs(s, {
    get id() {
      return e.provider.id
    },
  })
  var l = c(s, 2),
    i = u(l),
    v = u(i),
    o = c(i, 2),
    d = u(o),
    p = c(d),
    g = u(p),
    f = c(l, 2),
    _ = u(f)
  {
    var y = b => {
        Ce(b, {
          tone: 'success',
          children: (D, S) => {
            var C = Z()
            ;(L(() => A(C, e.provider.freeAccess ? 'Free access' : 'Key set')), h(D, C))
          },
          $$slots: { default: !0 },
        })
      },
      m = b => {
        Ce(b, {
          tone: 'accent',
          children: (D, S) => {
            var C = Z('OAuth')
            h(D, C)
          },
          $$slots: { default: !0 },
        })
      },
      w = b => {
        Ce(b, {
          tone: 'warning',
          children: (D, S) => {
            var C = Z('No key')
            h(D, C)
          },
          $$slots: { default: !0 },
        })
      }
    j(_, b => {
      e.provider.hasKey || e.provider.freeAccess
        ? b(y)
        : e.provider.authType === 'oauth'
          ? b(m, 1)
          : b(w, -1)
    })
  }
  var I = c(a, 2),
    $ = u(I)
  Se(
    $,
    17,
    () => e.provider.enrichedModels.slice(0, 5),
    b => b.id,
    (b, D) => {
      var S = Zd(),
        C = u(S)
      ;(L(() => {
        ;(be(S, 'title', n(D).id), A(C, n(D).name ?? n(D).id))
      }),
        h(b, S))
    }
  )
  var E = c($, 2)
  {
    var R = b => {
      var D = Qd(),
        S = u(D)
      ;(L(() => A(S, `+${e.provider.enrichedModels.length - 5}`)), h(b, D))
    }
    j(E, b => {
      e.provider.enrichedModels.length > 5 && b(R)
    })
  }
  var F = c(E, 2)
  {
    var Y = b => {
      var D = ec()
      h(b, D)
    }
    j(F, b => {
      e.provider.enrichedModels.length === 0 && b(Y)
    })
  }
  var M = c(I, 2),
    B = u(M)
  {
    var K = b => {
        ge(b, {
          size: 'sm',
          variant: 'subtle',
          onclick: () => e.onOAuth(e.provider),
          children: (D, S) => {
            var C = Z('Sign in')
            h(D, C)
          },
          $$slots: { default: !0 },
        })
      },
      O = b => {
        var D = rc(),
          S = te(D)
        ge(S, {
          size: 'sm',
          variant: 'primary',
          onclick: () => e.onAddKey(e.provider),
          children: (W, H) => {
            var N = Z('Add key')
            h(W, N)
          },
          $$slots: { default: !0 },
        })
        var C = c(S, 2)
        {
          var q = W => {
            var H = tc()
            ;(L(() => be(H, 'href', e.provider.signupUrl)), h(W, H))
          }
          j(C, W => {
            e.provider.signupUrl && W(q)
          })
        }
        h(b, D)
      },
      P = b => {
        ge(b, {
          size: 'sm',
          variant: 'ghost',
          onclick: () => fl(e.provider.id),
          children: (D, S) => {
            var C = Z('Refresh')
            h(D, C)
          },
          $$slots: { default: !0 },
        })
      }
    j(B, b => {
      e.provider.authType === 'oauth'
        ? b(K)
        : !e.provider.hasKey && !e.provider.freeAccess
          ? b(O, 1)
          : b(P, -1)
    })
  }
  var z = c(B, 2)
  ;(wl(z, {
    title: 'Delete provider',
    onclick: () => e.onDelete(e.provider),
    children: (b, D) => {
      var S = ac()
      h(b, S)
    },
    $$slots: { default: !0 },
  }),
    L(() => {
      ;(A(v, e.provider.name),
        A(d, `${e.provider.modelCount ?? ''} models · `),
        A(g, e.provider.id))
    }),
    h(t, r),
    _e())
}
var lc = k('<p style="color:var(--text-3)">Loading templates…</p>'),
  ic = k('<option> </option>'),
  oc = k('<span style="color:var(--text-3)">(optional)</span>'),
  vc = k(
    '<a class="hint-link svelte-263z8" target="_blank" rel="noopener noreferrer">Get an API key →</a>'
  ),
  dc = k('<span class="signup-note svelte-263z8"> </span>'),
  cc = k('<span class="lbl svelte-263z8" style="margin-top:14px">API key<!></span> <!> <!> <!>', 1),
  uc = k('<span class="lbl svelte-263z8" style="margin-top:14px"> </span> <!>', 1),
  fc = k(
    '<span class="lbl svelte-263z8" style="margin-top:14px">Display name</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Base URL</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">API key <span style="color:var(--text-3)">(optional)</span></span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Custom headers <span style="color:var(--text-3)">(optional)</span></span> <textarea class="hdrs svelte-263z8" rows="3" placeholder="One per line, e.g. User-Agent: claude-cli/1.0.0 (external, cli) x-app: cli"></textarea> <span class="hint-txt svelte-263z8">Some endpoints only accept requests from a recognized client. Add headers like <code class="svelte-263z8">User-Agent</code> here if the provider requires them.</span>',
    1
  ),
  hc = k(
    '<span class="lbl svelte-263z8">Provider</span> <select class="sel svelte-263z8"><option>Select a provider…</option><!></select> <!> <!> <!> <div class="row svelte-263z8" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  )
function pc(t, e) {
  pe(e, !0)
  let r = ee(Fe([])),
    a = ee(!1),
    s = ee(null),
    l = ee(''),
    i = ee(''),
    v = ee(''),
    o = ee(''),
    d = ee(!1)
  function p(w) {
    const I = {}
    for (const $ of w.split(`
`)) {
      const E = $.indexOf(':')
      if (E === -1) continue
      const R = $.slice(0, E).trim(),
        F = $.slice(E + 1).trim()
      R && F && (I[R] = F)
    }
    return I
  }
  async function g() {
    T(a, !0)
    try {
      T(r, (await zo()).templates, !0)
    } catch (w) {
      me(String(w), 'error')
    }
    T(a, !1)
  }
  $t(() => {
    e.open && (g(), T(s, null), T(l, ''), T(i, ''), T(v, ''), T(o, ''))
  })
  const f = J(() => n(r).find(w => w.id === n(s))),
    _ = J(() => n(s) === '__custom_openai__'),
    y = J(() => n(s) === '__custom_anthropic__')
  async function m() {
    if (n(s)) {
      T(d, !0)
      try {
        let w
        if (n(_) || n(y)) {
          const I = p(n(o))
          w = await To({
            kind: n(_) ? 'openai' : 'anthropic',
            displayName: n(v),
            baseUrl: n(i),
            apiKey: n(l),
            ...(Object.keys(I).length > 0 ? { headers: I } : {}),
          })
        } else w = await Ao(n(s), n(l) || void 0, n(i) || void 0)
        w.ok
          ? (me(`Added ${w.name ?? n(s)}`, 'success'), e.onadded(), e.onclose())
          : me(w.error ?? 'Failed to add provider', 'error')
      } catch (w) {
        me(w instanceof Error ? w.message : String(w), 'error')
      }
      T(d, !1)
    }
  }
  ;(xr(t, {
    get open() {
      return e.open
    },
    title: 'Add provider',
    get onclose() {
      return e.onclose
    },
    children: (w, I) => {
      var $ = rt(),
        E = te($)
      {
        var R = Y => {
            var M = lc()
            h(Y, M)
          },
          F = Y => {
            var M = hc(),
              B = c(te(M), 2),
              K = u(B)
            K.value = (K.__value = null) ?? ''
            var O = c(K)
            Se(
              O,
              17,
              () => n(r),
              N => N.id,
              (N, V) => {
                var U = ic(),
                  G = u(U),
                  X = {}
                ;(L(() => {
                  ;(A(
                    G,
                    `${n(V).name ?? ''}${n(V).anonymousFreeModels ? ' (free)' : ''}${n(V).subscriptionRisk ? ' ⚠' : ''}`
                  ),
                    X !== (X = n(V).id) && (U.value = (U.__value = n(V).id) ?? ''))
                }),
                  h(N, U))
              }
            )
            var P = c(B, 2)
            {
              var z = N => {
                var V = cc(),
                  U = te(V),
                  G = c(u(U))
                {
                  var X = Q => {
                    var ve = oc()
                    h(Q, ve)
                  }
                  j(G, Q => {
                    n(f).apiKeyOptional && Q(X)
                  })
                }
                var re = c(U, 2)
                {
                  let Q = J(() =>
                    n(f).apiKeyOptional
                      ? 'Leave blank for a local server without auth'
                      : 'Paste your key'
                  )
                  Zt(re, {
                    get placeholder() {
                      return n(Q)
                    },
                    get value() {
                      return n(l)
                    },
                    set value(ve) {
                      T(l, ve, !0)
                    },
                  })
                }
                var se = c(re, 2)
                {
                  var ne = Q => {
                    var ve = vc()
                    ;(L(() => be(ve, 'href', n(f).signupUrl)), h(Q, ve))
                  }
                  j(se, Q => {
                    n(f).signupUrl && Q(ne)
                  })
                }
                var ie = c(se, 2)
                {
                  var we = Q => {
                    var ve = dc(),
                      $e = u(ve)
                    ;(L(() => A($e, n(f).signupNote)), h(Q, ve))
                  }
                  j(ie, Q => {
                    n(f).signupNote && Q(we)
                  })
                }
                h(N, V)
              }
              j(P, N => {
                n(f) && n(f).authType === 'api' && !n(_) && !n(y) && N(z)
              })
            }
            var b = c(P, 2)
            {
              var D = N => {
                var V = uc(),
                  U = te(V),
                  G = u(U),
                  X = c(U, 2)
                {
                  let re = J(() => n(f).defaultBaseUrl ?? 'https://')
                  Zt(X, {
                    get placeholder() {
                      return n(re)
                    },
                    get value() {
                      return n(i)
                    },
                    set value(se) {
                      T(i, se, !0)
                    },
                  })
                }
                ;(L(() => A(G, n(f).urlPrompt)), h(N, V))
              }
              j(b, N => {
                var V
                ;(V = n(f)) != null && V.urlPrompt && N(D)
              })
            }
            var S = c(b, 2)
            {
              var C = N => {
                var V = fc(),
                  U = c(te(V), 2)
                Zt(U, {
                  placeholder: 'My endpoint',
                  get value() {
                    return n(v)
                  },
                  set value(se) {
                    T(v, se, !0)
                  },
                })
                var G = c(U, 4)
                Zt(G, {
                  placeholder: 'https://',
                  get value() {
                    return n(i)
                  },
                  set value(se) {
                    T(i, se, !0)
                  },
                })
                var X = c(G, 4)
                Zt(X, {
                  get value() {
                    return n(l)
                  },
                  set value(se) {
                    T(l, se, !0)
                  },
                })
                var re = c(X, 4)
                ;(xa(
                  re,
                  () => n(o),
                  se => T(o, se)
                ),
                  h(N, V))
              }
              j(S, N => {
                ;(n(_) || n(y)) && N(C)
              })
            }
            var q = c(S, 2),
              W = u(q)
            ge(W, {
              variant: 'ghost',
              get onclick() {
                return e.onclose
              },
              children: (N, V) => {
                var U = Z('Cancel')
                h(N, U)
              },
              $$slots: { default: !0 },
            })
            var H = c(W, 2)
            {
              let N = J(() => !n(s) || n(d))
              ge(H, {
                get disabled() {
                  return n(N)
                },
                onclick: m,
                children: (V, U) => {
                  var G = Z()
                  ;(L(() => A(G, n(d) ? 'Adding…' : 'Add provider')), h(V, G))
                },
                $$slots: { default: !0 },
              })
            }
            ;(no(
              B,
              () => n(s),
              N => T(s, N)
            ),
              h(Y, M))
          }
        j(E, Y => {
          n(a) ? Y(R) : Y(F, -1)
        })
      }
      h(w, $)
    },
    $$slots: { default: !0 },
  }),
    _e())
}
var _c = k(
  '<p style="color:var(--text-2);font-size:13.5px;line-height:1.6">Remove <strong style="color:var(--text-1)"> </strong> </p> <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
  1
)
function gc(t, e) {
  pe(e, !0)
  {
    let r = J(() => !!e.provider)
    xr(t, {
      get open() {
        return n(r)
      },
      title: 'Delete provider',
      get onclose() {
        return e.onclose
      },
      children: (a, s) => {
        var l = _c(),
          i = te(l),
          v = c(u(i)),
          o = u(v),
          d = c(v),
          p = c(i, 2),
          g = u(p)
        ge(g, {
          variant: 'ghost',
          get onclick() {
            return e.onclose
          },
          children: (_, y) => {
            var m = Z('Cancel')
            h(_, m)
          },
          $$slots: { default: !0 },
        })
        var f = c(g, 2)
        ;(ge(f, {
          variant: 'danger',
          onclick: () => e.provider && e.onconfirm(e.provider),
          children: (_, y) => {
            var m = Z('Delete')
            h(_, m)
          },
          $$slots: { default: !0 },
        }),
          L(() => {
            var _, y
            ;(A(o, (_ = e.provider) == null ? void 0 : _.name),
              A(
                d,
                ` and all ${((y = e.provider) == null ? void 0 : y.modelCount) ?? 0 ?? ''} of its models from anygate? This clears stored credentials.`
              ))
          }),
          h(a, l))
      },
      $$slots: { default: !0 },
    })
  }
  _e()
}
var mc = k('<div class="grid svelte-1sgc4qo"></div>'),
  yc = k('<p class="code svelte-1sgc4qo">Enter code: <strong> </strong></p>'),
  wc = k(
    '<div class="backdrop svelte-1sgc4qo" role="presentation"><div class="modal glass svelte-1sgc4qo" role="dialog" tabindex="-1"><h3 class="svelte-1sgc4qo"> </h3> <!> <!> <p class="note svelte-1sgc4qo">This window will close automatically once authentication completes.</p> <!></div></div>'
  ),
  bc = k(
    '<div class="page"><div class="head svelte-1sgc4qo"><div><h2 class="svelte-1sgc4qo">Providers & Keys</h2> <p class="sub svelte-1sgc4qo">Connect model providers via API key or OAuth. Refresh to pull the latest model list.</p></div> <div class="acts svelte-1sgc4qo"><!> <!></div></div> <!></div> <!> <!> <!>',
    1
  )
function xc(t, e) {
  pe(e, !0)
  let r = ee(!1),
    a = ee(null),
    s = ee(null),
    l = ee(''),
    i = ee(''),
    v = ee(null)
  async function o(O) {
    try {
      const P = await Co(O.id)
      P.ok
        ? me(`Deleted ${O.name}`, 'success')
        : me(P.error ? String(P.error) : 'Delete failed', 'error')
    } catch (P) {
      me(P instanceof Error ? P.message : String(P), 'error')
    }
    ;(T(a, null), await Pa())
  }
  async function d(O) {
    const P = prompt(`API key for ${O.name}:`)
    if (P)
      try {
        ;(await Po(O.id, P)).ok
          ? (me('Key saved', 'success'), await fl(O.id))
          : me('Save failed', 'error')
      } catch (z) {
        me(z instanceof Error ? z.message : String(z), 'error')
      }
  }
  async function p(O) {
    T(s, O, !0)
    try {
      const P = await Io(O.id)
      ;(T(l, P.authUrl ?? P.url, !0),
        T(i, P.userCode ?? '', !0),
        P.sessionId &&
          T(
            v,
            setInterval(async () => {
              const z = await Oo(P.sessionId)
              z.status !== 'pending' &&
                (n(v) && clearInterval(n(v)),
                z.status === 'done'
                  ? (me(`${O.name} connected`, 'success'), T(s, null), await Pa())
                  : me(z.error ?? 'OAuth failed', 'error'))
            }, 2e3),
            !0
          ),
        P.pkce && n(l) && window.open(n(l), '_blank'))
    } catch (P) {
      me(P instanceof Error ? P.message : String(P), 'error')
    }
  }
  var g = bc(),
    f = te(g),
    _ = u(f),
    y = c(u(_), 2),
    m = u(y)
  ge(m, {
    variant: 'ghost',
    onclick: () => Pa(),
    children: (O, P) => {
      var z = Z('Refresh all')
      h(O, z)
    },
    $$slots: { default: !0 },
  })
  var w = c(m, 2)
  ge(w, {
    onclick: () => T(r, !0),
    children: (O, P) => {
      var z = Z('+ Add provider')
      h(O, z)
    },
    $$slots: { default: !0 },
  })
  var I = c(_, 2)
  {
    var $ = O => {
        ir(O, { label: 'Loading providers…' })
      },
      E = O => {
        zr(O, {
          title: 'Could not load providers',
          icon: 'M12 8v5M12 17h.01',
          children: (P, z) => {
            var b = Z()
            ;(L(() => A(b, Ee.error)), h(P, b))
          },
          $$slots: { default: !0 },
        })
      },
      R = O => {
        zr(O, {
          title: 'No providers yet',
          icon: 'M12 11h8M4 11h4M4 19h16',
          children: (P, z) => {
            var b = Z('Add a provider to start browsing models.')
            h(P, b)
          },
          $$slots: { default: !0 },
        })
      },
      F = O => {
        var P = mc()
        ;(Se(
          P,
          21,
          () => Ee.list,
          z => z.id,
          (z, b) => {
            nc(z, {
              get provider() {
                return n(b)
              },
              onAddKey: d,
              onDelete: D => T(a, D, !0),
              onOAuth: p,
            })
          }
        ),
          h(O, P))
      }
    j(I, O => {
      Ee.loading ? O($) : Ee.error ? O(E, 1) : Ee.list.length === 0 ? O(R, 2) : O(F, -1)
    })
  }
  var Y = c(f, 2)
  pc(Y, {
    get open() {
      return n(r)
    },
    onclose: () => T(r, !1),
    onadded: () => Pa(),
  })
  var M = c(Y, 2)
  gc(M, {
    get provider() {
      return n(a)
    },
    onclose: () => T(a, null),
    onconfirm: o,
  })
  var B = c(M, 2)
  {
    var K = O => {
      var P = wc(),
        z = u(P),
        b = u(z),
        D = u(b),
        S = c(b, 2)
      {
        var C = N => {
          var V = yc(),
            U = c(u(V)),
            G = u(U)
          ;(L(() => A(G, n(i))), h(N, V))
        }
        j(S, N => {
          n(i) && N(C)
        })
      }
      var q = c(S, 2)
      {
        var W = N => {
          ge(N, {
            onclick: () => window.open(n(l), '_blank'),
            children: (V, U) => {
              var G = Z('Open sign-in page')
              h(V, G)
            },
            $$slots: { default: !0 },
          })
        }
        j(q, N => {
          n(l) && N(W)
        })
      }
      var H = c(q, 4)
      ;(ge(H, {
        variant: 'ghost',
        onclick: () => T(s, null),
        children: (N, V) => {
          var U = Z('Close')
          h(N, U)
        },
        $$slots: { default: !0 },
      }),
        L(() => A(D, `Sign in to ${n(s).name ?? ''}`)),
        le('click', P, () => T(s, null)),
        le('keydown', P, N => {
          N.key === 'Escape' && T(s, null)
        }),
        le('click', z, N => N.stopPropagation()),
        le('keydown', z, N => N.stopPropagation()),
        h(O, P))
    }
    j(B, O => {
      n(s) && O(K)
    })
  }
  ;(h(t, g), _e())
}
Oe(['click', 'keydown'])
const kc = 'modulepreload',
  Sc = function (t) {
    return '/' + t
  },
  an = {},
  Pc = function (e, r, a) {
    let s = Promise.resolve()
    if (r && r.length > 0) {
      let i = function (d) {
        return Promise.all(
          d.map(p =>
            Promise.resolve(p).then(
              g => ({ status: 'fulfilled', value: g }),
              g => ({ status: 'rejected', reason: g })
            )
          )
        )
      }
      document.getElementsByTagName('link')
      const v = document.querySelector('meta[property=csp-nonce]'),
        o = (v == null ? void 0 : v.nonce) || (v == null ? void 0 : v.getAttribute('nonce'))
      s = i(
        r.map(d => {
          if (((d = Sc(d)), d in an)) return
          an[d] = !0
          const p = d.endsWith('.css'),
            g = p ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${d}"]${g}`)) return
          const f = document.createElement('link')
          if (
            ((f.rel = p ? 'stylesheet' : kc),
            p || (f.as = 'script'),
            (f.crossOrigin = ''),
            (f.href = d),
            o && f.setAttribute('nonce', o),
            document.head.appendChild(f),
            p)
          )
            return new Promise((_, y) => {
              ;(f.addEventListener('load', _),
                f.addEventListener('error', () => y(new Error(`Unable to preload CSS for ${d}`))))
            })
        })
      )
    }
    function l(i) {
      const v = new Event('vite:preloadError', { cancelable: !0 })
      if (((v.payload = i), window.dispatchEvent(v), !v.defaultPrevented)) throw i
    }
    return s.then(i => {
      for (const v of i || []) v.status === 'rejected' && l(v.reason)
      return e().catch(l)
    })
  }
var Ec = k('<span class="group svelte-xohxs0"><!> <!> <!> <!> <!></span>')
function xl(t, e) {
  pe(e, !0)
  var r = Ec(),
    a = u(r)
  {
    var s = _ => {
      Ce(_, {
        tone: 'success',
        children: (y, m) => {
          var w = Z('Free')
          h(y, w)
        },
        $$slots: { default: !0 },
      })
    }
    j(a, _ => {
      e.model.isFree && _(s)
    })
  }
  var l = c(a, 2)
  {
    var i = _ => {
      Ce(_, {
        tone: 'warning',
        children: (y, m) => {
          var w = Z()
          ;(L(() => A(w, e.model.freeLabel)), h(y, w))
        },
        $$slots: { default: !0 },
      })
    }
    j(l, _ => {
      e.model.freeLabel && !e.model.isFree && _(i)
    })
  }
  var v = c(l, 2)
  {
    let _ = J(() =>
      e.model.format === 'anthropic'
        ? 'accent'
        : e.model.format === 'unsupported'
          ? 'error'
          : 'neutral'
    )
    Ce(v, {
      get tone() {
        return n(_)
      },
      children: (y, m) => {
        var w = Z()
        ;(L(() => A(w, e.model.format)), h(y, w))
      },
      $$slots: { default: !0 },
    })
  }
  var o = c(v, 2)
  {
    var d = _ => {
        Ce(_, {
          tone: 'accent',
          children: (y, m) => {
            var w = Z('vision')
            h(y, w)
          },
          $$slots: { default: !0 },
        })
      },
      p = J(() => {
        var _
        return (_ = e.model.inputTypes) == null ? void 0 : _.includes('image')
      })
    j(o, _ => {
      n(p) && _(d)
    })
  }
  var g = c(o, 2)
  {
    var f = _ => {
      Ce(_, {
        tone: 'accent',
        children: (y, m) => {
          var w = Z('reasoning')
          h(y, w)
        },
        $$slots: { default: !0 },
      })
    }
    j(g, _ => {
      e.model.reasoning && _(f)
    })
  }
  ;(h(t, r), _e())
}
var Mc = k('<button> </button>'),
  zc = k(
    '<div><div class="info svelte-19h4ccs"><div class="name svelte-19h4ccs"> <span class="pid svelte-19h4ccs"> </span></div> <div class="meta svelte-19h4ccs"> </div></div> <div class="tags svelte-19h4ccs"><!></div> <!></div>'
  )
function Ac(t, e) {
  pe(e, !0)
  let r = fe(e, 'favorited', 3, !1)
  function a($) {
    return $ ? `${($ / 1e3).toFixed(0)}k` : '—'
  }
  function s($) {
    if (!$ || typeof $ != 'object') return '—'
    const E = $,
      R = []
    return (
      E.input != null && R.push(`$${E.input}/M in`),
      E.output != null && R.push(`$${E.output}/M out`),
      R.join(' · ') || '—'
    )
  }
  var l = zc()
  let i
  var v = u(l),
    o = u(v),
    d = u(o),
    p = c(d),
    g = u(p),
    f = c(o, 2),
    _ = u(f),
    y = c(v, 2),
    m = u(y)
  xl(m, {
    get model() {
      return e.model
    },
  })
  var w = c(y, 2)
  {
    var I = $ => {
      var E = Mc()
      let R
      var F = u(E)
      ;(L(() => {
        ;((R = Ie(E, 1, 'star svelte-19h4ccs', null, R, { on: r() })),
          be(E, 'title', r() ? 'Remove favorite' : 'Add favorite'),
          be(E, 'aria-label', r() ? 'Remove favorite' : 'Add favorite'),
          A(F, r() ? '★' : '☆'))
      }),
        le('click', E, Y => {
          ;(Y.stopPropagation(), e.onToggleFav())
        }),
        h($, E))
    }
    j(w, $ => {
      e.onToggleFav && $(I)
    })
  }
  ;(L(
    ($, E) => {
      ;((i = Ie(l, 1, 'row svelte-19h4ccs', null, i, { clickable: !!e.onOpen })),
        be(l, 'role', e.onOpen ? 'button' : void 0),
        be(l, 'tabindex', e.onOpen ? 0 : void 0),
        A(d, e.model.name ?? e.model.id),
        A(g, `· ${e.providerId ?? ''}`),
        A(_, `ctx ${$ ?? ''} · ${E ?? ''}`))
    },
    [() => a(e.model.contextWindow), () => s(e.model.cost)]
  ),
    le('click', l, () => {
      var $
      return ($ = e.onOpen) == null ? void 0 : $.call(e)
    }),
    le('keydown', l, $ => {
      e.onOpen && ($.key === 'Enter' || $.key === ' ') && ($.preventDefault(), e.onOpen())
    }),
    h(t, l),
    _e())
}
Oe(['click', 'keydown'])
var Tc = k('<option> </option>'),
  Cc = k(
    '<div class="filters svelte-1y45iff"><input class="q svelte-1y45iff" placeholder="Search models…"/> <select class="s svelte-1y45iff"><option>All providers</option><!></select> <select class="s svelte-1y45iff"><option>Any format</option><option>anthropic</option><option>openai</option><option>unsupported</option></select> <select class="s svelte-1y45iff"><option>Free & paid</option><option>Free only</option><option>Paid only</option></select> <select class="s svelte-1y45iff"><option>Any reasoning</option><option>Reasoning</option><option>No reasoning</option></select> <select class="s svelte-1y45iff"><option>Any vision</option><option>Vision</option><option>No vision</option></select> <select class="s svelte-1y45iff"><option>Sort: context</option><option>Sort: cost</option><option>Sort: name</option></select></div>'
  )
function Ic(t, e) {
  pe(e, !0)
  let r = fe(e, 'value', 15)
  function a(N, V) {
    var U
    ;(r({ ...r(), [N]: V }), (U = e.onchange) == null || U.call(e, r()))
  }
  var s = Cc(),
    l = u(s),
    i = c(l, 2),
    v = u(i)
  v.value = v.__value = ''
  var o = c(v)
  Se(
    o,
    17,
    () => e.providers,
    br,
    (N, V) => {
      var U = Tc(),
        G = u(U),
        X = {}
      ;(L(() => {
        ;(A(G, n(V).name), X !== (X = n(V).id) && (U.value = (U.__value = n(V).id) ?? ''))
      }),
        h(N, U))
    }
  )
  var d
  Xt(i)
  var p = c(i, 2),
    g = u(p)
  g.value = g.__value = ''
  var f = c(g)
  f.value = f.__value = 'anthropic'
  var _ = c(f)
  _.value = _.__value = 'openai'
  var y = c(_)
  y.value = y.__value = 'unsupported'
  var m
  Xt(p)
  var w = c(p, 2),
    I = u(w)
  I.value = I.__value = ''
  var $ = c(I)
  $.value = $.__value = 'free'
  var E = c($)
  E.value = E.__value = 'paid'
  var R
  Xt(w)
  var F = c(w, 2),
    Y = u(F)
  Y.value = Y.__value = ''
  var M = c(Y)
  M.value = M.__value = 'yes'
  var B = c(M)
  B.value = B.__value = 'no'
  var K
  Xt(F)
  var O = c(F, 2),
    P = u(O)
  P.value = P.__value = ''
  var z = c(P)
  z.value = z.__value = 'yes'
  var b = c(z)
  b.value = b.__value = 'no'
  var D
  Xt(O)
  var S = c(O, 2),
    C = u(S)
  C.value = C.__value = 'ctx'
  var q = c(C)
  q.value = q.__value = 'cost'
  var W = c(q)
  W.value = W.__value = 'name'
  var H
  ;(Xt(S),
    L(() => {
      ;(Os(l, r().query),
        d !== (d = r().provider) &&
          ((i.value = (i.__value = r().provider) ?? ''), Dt(i, r().provider)),
        m !== (m = r().format) && ((p.value = (p.__value = r().format) ?? ''), Dt(p, r().format)),
        R !== (R = r().free) && ((w.value = (w.__value = r().free) ?? ''), Dt(w, r().free)),
        K !== (K = r().reasoning) &&
          ((F.value = (F.__value = r().reasoning) ?? ''), Dt(F, r().reasoning)),
        D !== (D = r().vision) && ((O.value = (O.__value = r().vision) ?? ''), Dt(O, r().vision)),
        H !== (H = r().sort) && ((S.value = (S.__value = r().sort) ?? ''), Dt(S, r().sort)))
    }),
    le('input', l, N => a('query', N.currentTarget.value)),
    le('change', i, N => a('provider', N.currentTarget.value)),
    le('change', p, N => a('format', N.currentTarget.value)),
    le('change', w, N => a('free', N.currentTarget.value)),
    le('change', F, N => a('reasoning', N.currentTarget.value)),
    le('change', O, N => a('vision', N.currentTarget.value)),
    le('change', S, N => a('sort', N.currentTarget.value)),
    h(t, s),
    _e())
}
Oe(['input', 'change'])
var Oc = k(
    '<div><div class="h svelte-1efx48s">Source backend</div><div class="v svelte-1efx48s"> </div></div>'
  ),
  $c = k(
    '<div class="stack svelte-1efx48s"><div><div class="h svelte-1efx48s">Name</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Model ID</div> <code class="v mono svelte-1efx48s"> </code></div> <div><div class="h svelte-1efx48s">Provider</div> <div class="v svelte-1efx48s"> <span class="sub svelte-1efx48s"> </span></div></div> <div class="grid svelte-1efx48s"><div><div class="h svelte-1efx48s">Context window</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Free</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Format</div><div class="v svelte-1efx48s"><!></div></div> <div><div class="h svelte-1efx48s">Reasoning</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Image input</div><div class="v svelte-1efx48s"> </div></div></div> <div><div class="h svelte-1efx48s">Cost</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Supported parameters</div> <div class="v chips svelte-1efx48s"></div></div> <!></div>'
  )
function Lc(t, e) {
  pe(e, !0)
  function r(a) {
    if (!a || typeof a != 'object') return 'Not published'
    const s = a
    return (
      [
        s.input != null ? `$${s.input} / 1M input` : null,
        s.output != null ? `$${s.output} / 1M output` : null,
      ]
        .filter(Boolean)
        .join('  ·  ') || 'Not published'
    )
  }
  ;(yv(t, {
    get open() {
      return e.open
    },
    title: 'Model details',
    get onclose() {
      return e.onclose
    },
    children: (a, s) => {
      var l = rt(),
        i = te(l)
      {
        var v = o => {
          var d = $c(),
            p = u(d),
            g = c(u(p), 2),
            f = u(g),
            _ = c(p, 2),
            y = c(u(_), 2),
            m = u(y),
            w = c(_, 2),
            I = c(u(w), 2),
            $ = u(I),
            E = c($),
            R = u(E),
            F = c(w, 2),
            Y = u(F),
            M = c(u(Y)),
            B = u(M),
            K = c(Y, 2),
            O = c(u(K)),
            P = u(O),
            z = c(K, 2),
            b = c(u(z)),
            D = u(b)
          xl(D, {
            get model() {
              return e.model
            },
          })
          var S = c(z, 2),
            C = c(u(S)),
            q = u(C),
            W = c(S, 2),
            H = c(u(W)),
            N = u(H),
            V = c(F, 2),
            U = c(u(V), 2),
            G = u(U),
            X = c(V, 2),
            re = c(u(X), 2)
          Se(
            re,
            21,
            () => e.model.supportedParameters ?? [],
            br,
            (ie, we) => {
              Ce(ie, {
                tone: 'neutral',
                children: (Q, ve) => {
                  var $e = Z()
                  ;(L(() => A($e, n(we))), h(Q, $e))
                },
                $$slots: { default: !0 },
              })
            }
          )
          var se = c(X, 2)
          {
            var ne = ie => {
              var we = Oc(),
                Q = c(u(we)),
                ve = u(Q)
              ;(L(() => A(ve, e.model.sourceBackend)), h(ie, we))
            }
            j(se, ie => {
              e.model.sourceBackend && ie(ne)
            })
          }
          ;(L(
            (ie, we, Q) => {
              ;(A(f, e.model.name ?? e.model.id),
                A(m, e.model.id),
                A($, `${e.providerName ?? ''} `),
                A(R, `(${e.providerId ?? ''})`),
                A(B, ie),
                A(P, e.model.isFree ? 'Yes' : (e.model.freeLabel ?? 'No')),
                A(q, e.model.reasoning ? 'Supported' : 'No'),
                A(N, we),
                A(G, Q))
            },
            [
              () =>
                e.model.contextWindow ? e.model.contextWindow.toLocaleString() + ' tokens' : '—',
              () => {
                var ie
                return (ie = e.model.inputTypes) != null && ie.includes('image')
                  ? 'Supported'
                  : 'No'
              },
              () => r(e.model.cost),
            ]
          ),
            h(o, d))
        }
        j(i, o => {
          e.model && o(v)
        })
      }
      h(a, l)
    },
    $$slots: { default: !0 },
  }),
    _e())
}
var Nc = k(
  '<div class="item svelte-drwign" role="listitem" draggable="true"><span class="handle svelte-drwign" title="Drag to reorder">⠿⠿⠿</span> <span class="idx svelte-drwign"> </span> <!> <div class="meta svelte-drwign"><div class="name svelte-drwign"> </div> <div class="sub svelte-drwign"> </div></div> <button class="x svelte-drwign" title="Remove">×</button></div>'
)
function Rc(t, e) {
  pe(e, !0)
  var r = Nc(),
    a = c(u(r), 2),
    s = u(a),
    l = c(a, 2)
  Fs(l, {
    get id() {
      return e.fav.providerId
    },
    size: 28,
  })
  var i = c(l, 2),
    v = u(i),
    o = u(v),
    d = c(v, 2),
    p = u(d),
    g = c(i, 2)
  ;(L(() => {
    ;(A(s, e.index + 1), A(o, e.fav.model), A(p, e.fav.providerName))
  }),
    Ia('dragstart', r, function (...f) {
      var _
      ;(_ = e.ondragstart) == null || _.apply(this, f)
    }),
    Ia('dragover', r, f => f.preventDefault()),
    Ia('drop', r, function (...f) {
      var _
      ;(_ = e.ondrop) == null || _.apply(this, f)
    }),
    le('click', g, function (...f) {
      var _
      ;(_ = e.onremove) == null || _.apply(this, f)
    }),
    h(t, r),
    _e())
}
Oe(['click'])
var Fc = k('<div class="list svelte-156gwh2"><!> <div class="cap svelte-156gwh2"> </div></div>')
function Dc(t, e) {
  pe(e, !0)
  let r = ee(null)
  function a(g, f) {
    var _
    ;(T(r, g, !0), (_ = f.dataTransfer) == null || _.setData('text/plain', String(g)))
  }
  function s(g) {
    if (n(r) === null || n(r) === g) return
    const f = [...e.items],
      [_] = f.splice(n(r), 1)
    ;(f.splice(g, 0, _), T(r, null), e.onreorder(f))
  }
  var l = Fc(),
    i = u(l)
  {
    var v = g => {
        zr(g, {
          title: 'No favorites yet',
          icon: 'M12 5v14M5 12h14',
          children: (f, _) => {
            var y = Z('Star models from the Models tab to build your quick-launch list.')
            h(f, y)
          },
          $$slots: { default: !0 },
        })
      },
      o = g => {
        var f = rt(),
          _ = te(f)
        ;(Se(
          _,
          19,
          () => e.items,
          y => y.providerId + '/' + y.modelId,
          (y, m, w) => {
            Rc(y, {
              get fav() {
                return n(m)
              },
              get index() {
                return n(w)
              },
              onremove: () => e.onremove(n(m)),
              ondragstart: I => a(n(w), I),
              ondrop: () => s(n(w)),
            })
          }
        ),
          h(g, f))
      }
    j(i, g => {
      e.items.length === 0 ? g(v) : g(o, -1)
    })
  }
  var d = c(i, 2),
    p = u(d)
  ;(L(() => A(p, `${e.items.length ?? ''} / ${e.max ?? ''} used`)), h(t, l), _e())
}
var jc = k(
  '<div class="meter svelte-19jc277"><div class="top svelte-19jc277"><span> </span><span class="n svelte-19jc277"> </span></div> <div class="track svelte-19jc277"><div></div></div></div>'
)
function qc(t, e) {
  let r = fe(e, 'label', 3, '')
  const a = J(() => Math.min(100, Math.round((e.used / e.max) * 100))),
    s = J(() => e.used >= e.max)
  var l = jc(),
    i = u(l),
    v = u(i),
    o = u(v),
    d = c(v),
    p = u(d),
    g = c(i, 2),
    f = u(g)
  let _
  ;(L(() => {
    ;(A(o, r()),
      A(p, `${e.used ?? ''}/${e.max ?? ''}`),
      (_ = Ie(f, 1, 'fill svelte-19jc277', null, _, { full: n(s) })),
      ot(f, `width:${n(a) ?? ''}%`))
  }),
    h(t, l))
}
var Hc = k(
    '<div class="fav-head svelte-p8xmpw"><h3 class="svelte-p8xmpw">Favorites</h3> <!></div> <!> <div style="margin-top:14px"><!></div>',
    1
  ),
  Bc = k(
    '<div class="page"><div class="head svelte-p8xmpw"><h2 class="svelte-p8xmpw">Models</h2> <p class="sub svelte-p8xmpw">Browse every model anygate can route. Star any model to add it to your favorites.</p></div> <div class="layout svelte-p8xmpw"><div class="main-col"><!> <!></div> <aside class="fav-col"><!></aside></div></div> <!>',
    1
  )
function Uc(t, e) {
  pe(e, !0)
  let r = ee(
      Fe({ provider: '', format: '', free: '', reasoning: '', vision: '', query: '', sort: 'ctx' })
    ),
    a = ee(null),
    s = ee('general')
  const l = J(() =>
    Ee.list.flatMap(M =>
      M.enrichedModels.map(B => ({ model: B, providerId: M.id, providerName: M.name }))
    )
  )
  function i(M) {
    if (!M || typeof M != 'object') return 0
    const B = M
    return (B.input ?? 0) + (B.output ?? 0)
  }
  const v = J(() =>
    n(l)
      .filter(M => {
        var B, K
        return (
          (!n(r).provider || M.providerId === n(r).provider) &&
          (!n(r).format || M.model.format === n(r).format) &&
          (!n(r).free || (n(r).free === 'free' ? M.model.isFree : !M.model.isFree)) &&
          (!n(r).reasoning ||
            (n(r).reasoning === 'yes' ? M.model.reasoning : !M.model.reasoning)) &&
          (!n(r).vision ||
            (n(r).vision === 'yes'
              ? (B = M.model.inputTypes) == null
                ? void 0
                : B.includes('image')
              : !((K = M.model.inputTypes) != null && K.includes('image')))) &&
          (!n(r).query ||
            (M.model.name ?? M.model.id).toLowerCase().includes(n(r).query.toLowerCase()) ||
            M.model.id.toLowerCase().includes(n(r).query.toLowerCase()))
        )
      })
      .sort((M, B) =>
        n(r).sort === 'name'
          ? (M.model.name ?? M.model.id).localeCompare(B.model.name ?? B.model.id)
          : n(r).sort === 'cost'
            ? i(M.model.cost) - i(B.model.cost)
            : (B.model.contextWindow ?? 0) - (M.model.contextWindow ?? 0)
      )
  )
  function o(M, B) {
    return (n(s) === 'agy' ? he.agy : he.general).some(O => O.providerId === M && O.modelId === B)
  }
  async function d(M) {
    const B = M.model
    if (o(M.providerId, B.id)) await gs(M.providerId, B.id, n(s) === 'agy')
    else {
      const K = {
        providerId: M.providerId,
        providerName: M.providerName,
        model: B.id,
        modelId: B.id,
        contextWindow: B.contextWindow,
        cost: B.cost,
      }
      await _l(K, n(s) === 'agy')
    }
  }
  async function p(M) {
    ;(n(s) === 'agy' ? (he.agy = M) : (he.general = M),
      await Pc(() => Promise.resolve().then(() => av), void 0).then(B =>
        B.reorder(M, n(s) === 'agy')
      ))
  }
  var g = Bc(),
    f = te(g),
    _ = c(u(f), 2),
    y = u(_),
    m = u(y)
  {
    let M = J(() => Ee.list.map(B => ({ id: B.id, name: B.name })))
    Ic(m, {
      get providers() {
        return n(M)
      },
      get value() {
        return n(r)
      },
      set value(B) {
        T(r, B, !0)
      },
    })
  }
  var w = c(m, 2)
  {
    var I = M => {
        ir(M, { label: 'Loading models…' })
      },
      $ = M => {
        zr(M, {
          title: 'No models match',
          icon: 'M4 6h16M4 12h16M4 18h16',
          children: (B, K) => {
            var O = Z('Adjust filters or connect more providers.')
            h(B, O)
          },
          $$slots: { default: !0 },
        })
      },
      E = M => {
        Ae(M, {
          padding: '6px',
          children: (B, K) => {
            var O = rt(),
              P = te(O)
            ;(Se(
              P,
              17,
              () => n(v),
              z => z.providerId + '/' + z.model.id,
              (z, b) => {
                {
                  let D = J(() => o(n(b).providerId, n(b).model.id))
                  Ac(z, {
                    get model() {
                      return n(b).model
                    },
                    get providerId() {
                      return n(b).providerId
                    },
                    get favorited() {
                      return n(D)
                    },
                    onToggleFav: () => d(n(b)),
                    onOpen: () => T(a, n(b), !0),
                  })
                }
              }
            ),
              h(B, O))
          },
          $$slots: { default: !0 },
        })
      }
    j(w, M => {
      Ee.loading ? M(I) : n(v).length === 0 ? M($, 1) : M(E, -1)
    })
  }
  var R = c(y, 2),
    F = u(R)
  Ae(F, {
    padding: '18px',
    children: (M, B) => {
      var K = Hc(),
        O = te(K),
        P = c(u(O), 2)
      {
        let S = J(() => (n(s) === 'agy' ? he.agy.length : he.general.length)),
          C = J(() => (n(s) === 'agy' ? 6 : 20)),
          q = J(() => (n(s) === 'agy' ? 'AGY' : 'General'))
        qc(P, {
          get used() {
            return n(S)
          },
          get max() {
            return n(C)
          },
          get label() {
            return n(q)
          },
        })
      }
      var z = c(O, 2)
      bl(z, {
        tabs: [
          { id: 'general', label: 'General (20)' },
          { id: 'agy', label: 'AGY (6)' },
        ],
        get active() {
          return n(s)
        },
        set active(S) {
          T(s, S, !0)
        },
      })
      var b = c(z, 2),
        D = u(b)
      {
        let S = J(() => (n(s) === 'agy' ? he.agy : he.general)),
          C = J(() => (n(s) === 'agy' ? 6 : 20))
        Dc(D, {
          get items() {
            return n(S)
          },
          get max() {
            return n(C)
          },
          onreorder: p,
          onremove: q => gs(q.providerId, q.modelId, n(s) === 'agy'),
        })
      }
      h(M, K)
    },
    $$slots: { default: !0 },
  })
  var Y = c(f, 2)
  {
    let M = J(() => !!n(a)),
      B = J(() => {
        var P
        return ((P = n(a)) == null ? void 0 : P.model) ?? null
      }),
      K = J(() => {
        var P
        return ((P = n(a)) == null ? void 0 : P.providerId) ?? ''
      }),
      O = J(() => {
        var P
        return ((P = n(a)) == null ? void 0 : P.providerName) ?? ''
      })
    Lc(Y, {
      get open() {
        return n(M)
      },
      get model() {
        return n(B)
      },
      get providerId() {
        return n(K)
      },
      get providerName() {
        return n(O)
      },
      onclose: () => T(a, null),
    })
  }
  ;(h(t, g), _e())
}
var Gc = k('<div class="path svelte-1gp522a"> </div>'),
  Kc = k(
    '<div class="favs svelte-1gp522a"><span class="star svelte-1gp522a">★</span> <span> </span></div>'
  ),
  Wc = k('<a class="install-link svelte-1gp522a" target="_blank" rel="noopener noreferrer"> </a>'),
  Vc = k(
    '<code class="cmd svelte-1gp522a"> </code> <button class="copy svelte-1gp522a" type="button">Copy</button>',
    1
  ),
  Yc = k('<div class="install svelte-1gp522a"><!></div>'),
  Jc = k(
    '<div class="card svelte-1gp522a"><div class="head svelte-1gp522a"><div><!></div> <div class="meta svelte-1gp522a"><div class="name svelte-1gp522a"> </div> <div class="sub svelte-1gp522a"> </div></div> <!></div> <!> <!> <!> <div class="actions svelte-1gp522a"><!> <!></div></div>'
  )
function Xc(t, e) {
  pe(e, !0)
  let r = fe(e, 'favCount', 3, 0)
  var a = Jc(),
    s = u(a),
    l = u(s)
  let i
  var v = u(l)
  Fs(v, {
    get id() {
      return e.app.id
    },
    size: 38,
  })
  var o = c(l, 2),
    d = u(o),
    p = u(d),
    g = c(d, 2),
    f = u(g),
    _ = c(o, 2)
  {
    var y = K => {
        Ce(K, {
          tone: 'success',
          children: (O, P) => {
            var z = Z('Installed')
            h(O, z)
          },
          $$slots: { default: !0 },
        })
      },
      m = K => {
        Ce(K, {
          tone: 'warning',
          children: (O, P) => {
            var z = Z('Not installed')
            h(O, z)
          },
          $$slots: { default: !0 },
        })
      }
    j(_, K => {
      e.app.installed ? K(y) : K(m, -1)
    })
  }
  var w = c(s, 2)
  {
    var I = K => {
      var O = Gc(),
        P = u(O)
      ;(L(() => {
        ;(be(O, 'title', e.app.path), A(P, e.app.path))
      }),
        h(K, O))
    }
    j(w, K => {
      e.app.path && K(I)
    })
  }
  var $ = c(w, 2)
  {
    var E = K => {
      var O = Kc(),
        P = c(u(O), 2),
        z = u(P)
      ;(L(() => A(z, `${r() ?? ''} favorite${r() === 1 ? '' : 's'} ready`)), h(K, O))
    }
    j($, K => {
      r() > 0 && K(E)
    })
  }
  var R = c($, 2)
  {
    var F = K => {
      var O = Yc(),
        P = u(O)
      {
        var z = D => {
            var S = Wc(),
              C = u(S)
            ;(L(() => {
              ;(be(S, 'href', e.app.installUrl), A(C, `Get ${e.app.name ?? ''} →`))
            }),
              h(D, S))
          },
          b = D => {
            var S = Vc(),
              C = te(S),
              q = u(C),
              W = c(C, 2)
            ;(L(() => A(q, e.app.installHint)),
              le('click', W, () => {
                var H
                return (H = navigator.clipboard) == null
                  ? void 0
                  : H.writeText(e.app.installHint ?? '')
              }),
              h(D, S))
          }
        j(P, D => {
          e.app.installUrl ? D(z) : e.app.installHint && D(b, 1)
        })
      }
      h(K, O)
    }
    j(R, K => {
      e.app.installed || K(F)
    })
  }
  var Y = c(R, 2),
    M = u(Y)
  ge(M, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => e.onsetpath(e.app),
    children: (K, O) => {
      var P = Z('Path')
      h(K, P)
    },
    $$slots: { default: !0 },
  })
  var B = c(M, 2)
  {
    let K = J(() => !e.app.installed)
    ge(B, {
      size: 'sm',
      variant: 'primary',
      get disabled() {
        return n(K)
      },
      onclick: () => e.onlaunch(e.app),
      children: (O, P) => {
        var z = Z()
        ;(L(() => A(z, r() > 0 ? 'Launch with favorites' : 'Launch')), h(O, z))
      },
      $$slots: { default: !0 },
    })
  }
  ;(L(() => {
    ;((i = Ie(l, 1, 'logo svelte-1gp522a', null, i, { dim: !e.app.installed })),
      A(p, e.app.name),
      A(f, e.app.type === 'cli' ? 'CLI' : 'Desktop app'))
  }),
    h(t, a),
    _e())
}
Oe(['click'])
var Zc = k('<div class="grid svelte-ishglm"></div>'),
  Qc = k(
    '<div class="opts svelte-ishglm"><span class="lbl svelte-ishglm">Provider</span> <!> <span class="lbl svelte-ishglm">Model</span> <!></div>'
  ),
  eu = k(
    '<div class="hintbox svelte-ishglm"><!> <span>Opens the app with every favorite routed through one anygate gateway — switch live from the in-app model menu.</span></div>'
  ),
  tu = k('<button class="recent svelte-ishglm"> </button>'),
  ru = k('<div class="recents svelte-ishglm"></div>'),
  au = k(
    '<div class="modes svelte-ishglm"><button><span class="mode-ico svelte-ishglm">★</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">All favorites</span> <span class="mode-desc svelte-ishglm"> </span></span></button> <button><span class="mode-ico svelte-ishglm">◉</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">One model</span> <span class="mode-desc svelte-ishglm">Launch with a single pre-selected model</span></span></button> <button><span class="mode-ico svelte-ishglm">⤢</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">Just open</span> <span class="mode-desc svelte-ishglm">Launch the app with no model pre-set</span></span></button></div> <!> <div class="opts svelte-ishglm" style="margin-top:16px"><span class="lbl svelte-ishglm">Launch folder</span> <div class="folder svelte-ishglm"><!> <!></div> <!></div> <div class="row svelte-ishglm" style="margin-top:22px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  su = k(
    '<span class="lbl svelte-ishglm">Executable path</span> <div class="folder svelte-ishglm"><!> <!></div> <div class="row svelte-ishglm" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  nu = k(
    `<div class="page"><div class="head svelte-ishglm"><div><h2 class="svelte-ishglm">Apps & Launch</h2> <p class="sub svelte-ishglm">Open Claude, Codex, Gemini, or Antigravity with your anygate models pre-wired. Pick a launch folder per app, or send your whole favorites catalog into the app's model switcher.</p></div></div> <!></div> <!> <!>`,
    1
  )
function lu(t, e) {
  pe(e, !0)
  let r = ee(null),
    a = ee('favorites'),
    s = ee(''),
    l = ee(''),
    i = ee(''),
    v = ee(null),
    o = ee('')
  const d = J(() => Ge.list.find(z => z.id === n(r))),
    p = J(() =>
      n(d) && (n(d).id === 'antigravity' || n(d).id === 'agy' || n(d).id === 'antigravity-ide')
        ? he.agy.length
        : he.general.length
    ),
    g = J(() => {
      var z
      return n(s)
        ? (((z = Ee.list.find(b => b.id === n(s))) == null ? void 0 : z.enrichedModels) ?? []).map(
            b => ({ value: b.id, label: b.name ?? b.id })
          )
        : []
    })
  async function f(z) {
    ;(T(r, z.id, !0), T(a, n(p) > 0 ? 'favorites' : 'specific', !0), T(s, ''), T(l, ''), T(i, ''))
    const b = Ge.recentFolders
    T(i, b[0] ?? '', !0)
  }
  async function _() {
    n(r) &&
      (n(a) === 'favorites'
        ? await Qa({ appId: n(r), favoritesCatalog: !0, cwd: n(i) || void 0 })
        : n(a) === 'specific'
          ? await Qa({
              appId: n(r),
              providerId: n(s) || void 0,
              modelId: n(l) || void 0,
              cwd: n(i) || void 0,
            })
          : await Qa({ appId: n(r), cwd: n(i) || void 0 }),
      T(r, null))
  }
  async function y(z) {
    ;(T(v, z, !0), T(o, z.path ?? '', !0))
  }
  async function m() {
    n(v) && (await nv(n(v).id, n(o).trim() || null), T(v, null))
  }
  async function w() {
    const z = await Qs()
    z && T(i, z, !0)
  }
  async function I() {
    const z = await Qs()
    z && T(o, z, !0)
  }
  var $ = nu(),
    E = te($),
    R = c(u(E), 2)
  {
    var F = z => {
        ir(z, { label: 'Detecting installed apps…' })
      },
      Y = z => {
        zr(z, {
          title: 'No apps found',
          icon: 'M2 3h20v14H2z',
          children: (b, D) => {
            var S = Z("anygate couldn't detect supported apps on this system.")
            h(b, S)
          },
          $$slots: { default: !0 },
        })
      },
      M = z => {
        var b = Zc()
        ;(Se(
          b,
          21,
          () => Ge.list,
          D => D.id,
          (D, S) => {
            {
              let C = J(() =>
                n(S).id === 'antigravity' || n(S).id === 'agy' || n(S).id === 'antigravity-ide'
                  ? he.agy.length
                  : he.general.length
              )
              Xc(D, {
                get app() {
                  return n(S)
                },
                get favCount() {
                  return n(C)
                },
                onlaunch: f,
                onsetpath: y,
              })
            }
          }
        ),
          h(z, b))
      }
    j(R, z => {
      Ge.loading ? z(F) : Ge.list.length === 0 ? z(Y, 1) : z(M, -1)
    })
  }
  var B = c(E, 2)
  {
    var K = z => {
      {
        let b = J(() => !!n(d)),
          D = J(() => `Launch ${n(d).name}`)
        xr(z, {
          get open() {
            return n(b)
          },
          get title() {
            return n(D)
          },
          onclose: () => T(r, null),
          children: (S, C) => {
            var q = au(),
              W = te(q),
              H = u(W)
            let N
            var V = c(u(H), 2),
              U = c(u(V), 2),
              G = u(U),
              X = c(H, 2)
            let re
            var se = c(X, 2)
            let ne
            var ie = c(W, 2)
            {
              var we = Pe => {
                  var De = Qc(),
                    Ke = c(u(De), 2)
                  {
                    let Xe = J(() => [
                      { value: '', label: 'All' },
                      ...Ee.list.map(Ue => ({ value: Ue.id, label: Ue.name })),
                    ])
                    sr(Ke, {
                      get options() {
                        return n(Xe)
                      },
                      get value() {
                        return n(s)
                      },
                      set value(Ue) {
                        T(s, Ue, !0)
                      },
                    })
                  }
                  var Be = c(Ke, 4)
                  {
                    let Xe = J(() => !n(s)),
                      Ue = J(() =>
                        n(s)
                          ? [{ value: '', label: 'All' }, ...n(g)]
                          : [{ value: '', label: '— pick a provider first —' }]
                      )
                    sr(Be, {
                      get disabled() {
                        return n(Xe)
                      },
                      get options() {
                        return n(Ue)
                      },
                      get value() {
                        return n(l)
                      },
                      set value(Ua) {
                        T(l, Ua, !0)
                      },
                    })
                  }
                  h(Pe, De)
                },
                Q = Pe => {
                  var De = eu(),
                    Ke = u(De)
                  ;(Ce(Ke, {
                    tone: 'success',
                    children: (Be, Xe) => {
                      var Ue = Z()
                      ;(L(() => A(Ue, `${n(p) ?? ''} favorites`)), h(Be, Ue))
                    },
                    $$slots: { default: !0 },
                  }),
                    h(Pe, De))
                }
              j(ie, Pe => {
                n(a) === 'specific' ? Pe(we) : n(a) === 'favorites' && Pe(Q, 1)
              })
            }
            var ve = c(ie, 2),
              $e = c(u(ve), 2),
              Rt = u($e)
            Zt(Rt, {
              placeholder: 'Path or browse…',
              get value() {
                return n(i)
              },
              set value(Pe) {
                T(i, Pe, !0)
              },
            })
            var or = c(Rt, 2)
            ge(or, {
              size: 'sm',
              variant: 'ghost',
              onclick: w,
              children: (Pe, De) => {
                var Ke = Z('Browse')
                h(Pe, Ke)
              },
              $$slots: { default: !0 },
            })
            var Vt = c($e, 2)
            {
              var Yt = Pe => {
                  var De = ru()
                  ;(Se(
                    De,
                    21,
                    () => Ge.recentFolders.filter(Ke => Ke !== n(i)).slice(0, 4),
                    br,
                    (Ke, Be) => {
                      var Xe = tu(),
                        Ue = u(Xe)
                      ;(L(() => A(Ue, n(Be))), le('click', Xe, () => T(i, n(Be), !0)), h(Ke, Xe))
                    }
                  ),
                    h(Pe, De))
                },
                vt = J(() => Ge.recentFolders.filter(Pe => Pe !== n(i)).length)
              j(Vt, Pe => {
                n(vt) && Pe(Yt)
              })
            }
            var Mt = c(ve, 2),
              Ft = u(Mt)
            ge(Ft, {
              variant: 'ghost',
              onclick: () => T(r, null),
              children: (Pe, De) => {
                var Ke = Z('Cancel')
                h(Pe, Ke)
              },
              $$slots: { default: !0 },
            })
            var zt = c(Ft, 2)
            {
              let Pe = J(() => !n(d).installed || (n(a) === 'specific' && !!n(s) && !n(l)))
              ge(zt, {
                get disabled() {
                  return n(Pe)
                },
                onclick: _,
                children: (De, Ke) => {
                  var Be = Z('Launch')
                  h(De, Be)
                },
                $$slots: { default: !0 },
              })
            }
            ;(L(() => {
              ;((N = Ie(H, 1, 'mode svelte-ishglm', null, N, { active: n(a) === 'favorites' })),
                (H.disabled = n(p) === 0),
                A(G, n(p) > 0 ? `${n(p)} models into the app switcher` : 'No favorites saved yet'),
                (re = Ie(X, 1, 'mode svelte-ishglm', null, re, { active: n(a) === 'specific' })),
                (ne = Ie(se, 1, 'mode svelte-ishglm', null, ne, { active: n(a) === 'open' })))
            }),
              le('click', H, () => T(a, 'favorites')),
              le('click', X, () => T(a, 'specific')),
              le('click', se, () => T(a, 'open')),
              h(S, q))
          },
          $$slots: { default: !0 },
        })
      }
    }
    j(B, z => {
      n(d) && z(K)
    })
  }
  var O = c(B, 2)
  {
    var P = z => {
      {
        let b = J(() => !!n(v)),
          D = J(() => `Set path → ${n(v).name}`)
        xr(z, {
          get open() {
            return n(b)
          },
          get title() {
            return n(D)
          },
          onclose: () => T(v, null),
          children: (S, C) => {
            var q = su(),
              W = c(te(q), 2),
              H = u(W)
            Zt(H, {
              placeholder: '/path/to/executable',
              get value() {
                return n(o)
              },
              set value(X) {
                T(o, X, !0)
              },
            })
            var N = c(H, 2)
            ge(N, {
              size: 'sm',
              variant: 'ghost',
              onclick: I,
              children: (X, re) => {
                var se = Z('Browse')
                h(X, se)
              },
              $$slots: { default: !0 },
            })
            var V = c(W, 2),
              U = u(V)
            ge(U, {
              variant: 'ghost',
              onclick: () => T(v, null),
              children: (X, re) => {
                var se = Z('Cancel')
                h(X, se)
              },
              $$slots: { default: !0 },
            })
            var G = c(U, 2)
            ;(ge(G, {
              onclick: m,
              children: (X, re) => {
                var se = Z('Save')
                h(X, se)
              },
              $$slots: { default: !0 },
            }),
              h(S, q))
          },
          $$slots: { default: !0 },
        })
      }
    }
    j(O, z => {
      n(v) && z(P)
    })
  }
  ;(h(t, $), _e())
}
Oe(['click'])
var iu = k('<!> <!>', 1)
function ou(t, e) {
  pe(e, !0)
  var r = rt(),
    a = te(r)
  {
    var s = i => {
        var v = iu(),
          o = te(v)
        Ce(o, {
          tone: 'success',
          children: (g, f) => {
            var _ = Z()
            ;(L(() => A(_, `Running · ${e.status.listenMode === 'network' ? 'Network' : 'Local'}`)),
              h(g, _))
          },
          $$slots: { default: !0 },
        })
        var d = c(o, 2)
        {
          var p = g => {
            Ce(g, {
              tone: 'neutral',
              children: (f, _) => {
                var y = Z()
                ;(L(() => A(y, `${e.status.models.length ?? ''} models`)), h(f, y))
              },
              $$slots: { default: !0 },
            })
          }
          j(d, g => {
            e.status.models && g(p)
          })
        }
        h(i, v)
      },
      l = i => {
        Ce(i, {
          tone: 'neutral',
          children: (v, o) => {
            var d = Z('Stopped')
            h(v, d)
          },
          $$slots: { default: !0 },
        })
      }
    j(a, i => {
      var v
      ;(v = e.status) != null && v.running ? i(s) : i(l, -1)
    })
  }
  ;(h(t, r), _e())
}
var vu = k(
    '<div class="url svelte-swldy1"><span class="lbl svelte-swldy1"> </span><code class="svelte-swldy1"> </code></div>'
  ),
  du = k(
    '<!> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Key</span><code class="svelte-swldy1"> </code></div>',
    1
  ),
  cu = k('<div class="summary svelte-swldy1"> </div>'),
  uu = k(
    '<div class="urls svelte-swldy1"><div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Anthropic</span><code class="svelte-swldy1"> </code></div> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">OpenAI</span><code class="svelte-swldy1"> </code></div> <!></div> <!>',
    1
  ),
  fu = k(
    '<span class="lbl svelte-swldy1">Server password</span> <input class="inp svelte-swldy1" placeholder="required for network"/> <!>',
    1
  ),
  hu = k('<div class="opts svelte-swldy1"><!> <!> <!> <!> <!></div>'),
  pu = k(
    '<div class="panel svelte-swldy1"><div class="row svelte-swldy1"><div><h3 class="svelte-swldy1">Server Gateway</h3> <p class="desc svelte-swldy1">Expose your anygate models over a local OpenAI/Anthropic-compatible endpoint.</p></div> <!></div> <!> <div class="actions svelte-swldy1"><!></div></div>'
  )
function _u(t, e) {
  pe(e, !0)
  let r = ee(!1),
    a = ee(!1),
    s = ee(!1),
    l = ee('local'),
    i = ee(''),
    v = ee(!0)
  const o = J(() => Ye.status)
  function d() {
    n(o) &&
      (T(r, n(o).saved.favoritesOnly, !0),
      T(a, n(o).saved.freeModelsOnly, !0),
      T(s, n(o).saved.maskGatewayIds, !0),
      T(l, n(o).saved.listenMode, !0))
  }
  $t(() => {
    n(o) && d()
  })
  async function p() {
    var R, F, Y
    if ((R = n(o)) != null && R.running) {
      await Kv()
      return
    }
    ;(n(l) === 'network' && !n(i).trim() && T(i, Math.random().toString(36).slice(2, 12), !0),
      !(await Gv({
        favoritesOnly: n(r),
        freeModelsOnly: n(a),
        exposedProviders: null,
        maskGatewayIds: n(s),
        listenMode: n(l),
        passwordMode: 'new',
        password: n(i),
        savePassword: n(v),
      })) &&
        (F = Ye.error) != null &&
        F.includes('No providers') &&
        ((Y = e.onneedsmodels) == null || Y.call(e)))
  }
  var g = pu(),
    f = u(g),
    _ = c(u(f), 2)
  ou(_, {
    get status() {
      return n(o)
    },
  })
  var y = c(f, 2)
  {
    var m = E => {
        var R = uu(),
          F = te(R),
          Y = u(F),
          M = c(u(Y)),
          B = u(M),
          K = c(Y, 2),
          O = c(u(K)),
          P = u(O),
          z = c(K, 2)
        {
          var b = C => {
            var q = du(),
              W = te(q)
            Se(
              W,
              17,
              () => n(o).networkUrls,
              br,
              (U, G) => {
                var X = vu(),
                  re = u(X),
                  se = u(re),
                  ne = c(re),
                  ie = u(ne)
                ;(L(() => {
                  ;(A(se, n(G).name), A(ie, n(G).anthropicUrl))
                }),
                  h(U, X))
              }
            )
            var H = c(W, 2),
              N = c(u(H)),
              V = u(N)
            ;(L(() => A(V, n(o).apiKey)), h(C, q))
          }
          j(z, C => {
            n(o).listenMode === 'network' && n(o).networkUrls && C(b)
          })
        }
        var D = c(F, 2)
        {
          var S = C => {
            var q = cu(),
              W = u(q)
            ;(L(() => A(W, n(o).providerSummary)), h(C, q))
          }
          j(D, C => {
            n(o).providerSummary && C(S)
          })
        }
        ;(L(() => {
          ;(A(B, n(o).anthropicUrl), A(P, n(o).openaiUrl))
        }),
          h(E, R))
      },
      w = E => {
        var R = hu(),
          F = u(R)
        ea(F, {
          label: 'Favorites only',
          get checked() {
            return n(r)
          },
          set checked(P) {
            T(r, P, !0)
          },
        })
        var Y = c(F, 2)
        ea(Y, {
          label: 'Free models only',
          get checked() {
            return n(a)
          },
          set checked(P) {
            T(a, P, !0)
          },
        })
        var M = c(Y, 2)
        ea(M, {
          label: 'Mask gateway IDs',
          get checked() {
            return n(s)
          },
          set checked(P) {
            T(s, P, !0)
          },
        })
        var B = c(M, 2)
        {
          let P = J(() => n(l) === 'network')
          ea(B, {
            get checked() {
              return n(P)
            },
            onchange: z => T(l, z ? 'network' : 'local', !0),
            label: 'Network mode',
          })
        }
        var K = c(B, 2)
        {
          var O = P => {
            var z = fu(),
              b = c(te(z), 2),
              D = c(b, 2)
            ;(ea(D, {
              label: 'Save password',
              get checked() {
                return n(v)
              },
              set checked(S) {
                T(v, S, !0)
              },
            }),
              xa(
                b,
                () => n(i),
                S => T(i, S)
              ),
              h(P, z))
          }
          j(K, P => {
            n(l) === 'network' && P(O)
          })
        }
        h(E, R)
      }
    j(y, E => {
      var R
      ;(R = n(o)) != null && R.running ? E(m) : E(w, -1)
    })
  }
  var I = c(y, 2),
    $ = u(I)
  {
    let E = J(() => {
      var R
      return (R = n(o)) != null && R.running ? 'danger' : 'primary'
    })
    ge($, {
      get variant() {
        return n(E)
      },
      get disabled() {
        return Ye.starting
      },
      onclick: p,
      children: (R, F) => {
        var Y = Z()
        ;(L(() => {
          var M
          return A(
            Y,
            Ye.starting
              ? 'Working…'
              : (M = n(o)) != null && M.running
                ? 'Stop server'
                : 'Start server'
          )
        }),
          h(R, Y))
      },
      $$slots: { default: !0 },
    })
  }
  ;(h(t, g), _e())
}
var gu = k('<p style="color:var(--error);font-size:13px"> </p>'),
  mu = k(
    '<div class="page"><div class="head svelte-124gvcr"><h2 class="svelte-124gvcr">Server Gateway</h2> <p class="sub svelte-124gvcr">Run a local OpenAI / Anthropic-compatible server exposing your anygate models to any tool.</p></div> <!> <!></div>'
  )
function yu(t, e) {
  ;(pe(e, !1), sl(() => (Bv(), () => Uv())), $s())
  var r = mu(),
    a = c(u(r), 2)
  {
    var s = o => {
        ir(o, { label: 'Reading server status…' })
      },
      l = o => {
        _u(o, { onneedsmodels: () => (location.hash = '#/providers') })
      }
    j(a, o => {
      Ye.loading && !Ye.status ? o(s) : o(l, -1)
    })
  }
  var i = c(a, 2)
  {
    var v = o => {
      Ae(o, {
        padding: '16px',
        children: (d, p) => {
          var g = gu(),
            f = u(g)
          ;(L(() => A(f, Ye.error)), h(d, g))
        },
        $$slots: { default: !0 },
      })
    }
    j(i, o => {
      Ye.error && o(v)
    })
  }
  ;(h(t, r), _e())
}
var wu = k('<div class="muted svelte-hss3zz">Loading providers…</div>'),
  bu = k('<div class="muted svelte-hss3zz">No providers configured.</div>'),
  xu = k('<div class="muted svelte-hss3zz">Select a provider first.</div>'),
  ku = k(
    '<div class="muted svelte-hss3zz">This provider has no directly-testable (OpenAI/Anthropic) models.</div>'
  ),
  Su = k('<!> Testing…', 1),
  Pu = k(
    '<h3 class="panel-title svelte-hss3zz">Test configuration</h3> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Provider</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Model</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Prompt</span> <textarea class="prompt svelte-hss3zz" rows="3" placeholder="What to send to the model…" id="tester-prompt"></textarea></label> <div class="run svelte-hss3zz"><!></div>',
    1
  ),
  Eu = k(
    '<div class="live-pulse svelte-hss3zz"></div> <p class="live-text svelte-hss3zz">Probing <strong class="svelte-hss3zz"> </strong>…</p> <p class="muted svelte-hss3zz">Connecting to upstream endpoint.</p>',
    1
  ),
  Mu = k(
    '<div class="sample svelte-hss3zz"><span class="sample-label svelte-hss3zz">Sample response</span> <pre class="sample-body svelte-hss3zz"> </pre></div>'
  ),
  zu = k(
    '<div class="result-head svelte-hss3zz"><span class="status-dot ok svelte-hss3zz"></span> <span class="status-text ok svelte-hss3zz">Endpoint responds</span> <!></div> <div class="metrics svelte-hss3zz"><div class="metric gauge svelte-hss3zz"><svg viewBox="0 0 120 120" class="gauge-svg svelte-hss3zz"><circle class="gauge-bg svelte-hss3zz" cx="60" cy="60" r="52"></circle><circle class="gauge-fg svelte-hss3zz" cx="60" cy="60" r="52"></circle></svg> <div class="gauge-center svelte-hss3zz"><span class="gauge-value svelte-hss3zz"> </span> <span class="gauge-unit svelte-hss3zz">ms TTFT</span></div> <span class="metric-label svelte-hss3zz">Time to first token</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Connect</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Total round-trip</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Tokens / sec</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Streamed chunks</span></div> <div class="metric svelte-hss3zz"><span> </span> <span class="metric-label svelte-hss3zz">Stream stability</span></div></div> <!>',
    1
  ),
  Au = k('<p class="fail-hint svelte-hss3zz"> </p>'),
  Tu = k(
    '<div class="mini-metrics svelte-hss3zz"><span class="svelte-hss3zz"> </span> <span class="svelte-hss3zz"> </span></div>'
  ),
  Cu = k(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Endpoint did not respond correctly</span></div> <p class="fail-error svelte-hss3zz"> </p> <!> <!>',
    1
  ),
  Iu = k(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Request error</span></div> <p class="fail-error svelte-hss3zz"> </p>',
    1
  ),
  Ou = k(
    'Select a provider + model and hit <strong class="svelte-hss3zz">Run test</strong> to measure live latency.',
    1
  ),
  $u =
    k(`<div class="page svelte-hss3zz"><div class="head svelte-hss3zz"><div class="svelte-hss3zz"><h2 class="svelte-hss3zz">Model Tester</h2> <p class="sub svelte-hss3zz">Pick a provider and model, then fire a live request at its real endpoint.
        Measures connection time, time-to-first-token, and total latency.</p></div> <!></div> <div class="grid svelte-hss3zz"><!> <div class="results svelte-hss3zz"><!></div></div></div>`)
function Lu(t, e) {
  pe(e, !0)
  let r = ee(''),
    a = ee(''),
    s = ee('Reply with a single word: pong'),
    l = ee(!1),
    i = ee(null),
    v = ee(null)
  const o = J(() =>
      Ee.list
        .filter(b => {
          var D
          return (((D = b.enrichedModels) == null ? void 0 : D.length) ?? 0) > 0
        })
        .map(b => ({ value: b.id, label: b.name }))
    ),
    d = J(() => Ee.list.find(b => b.id === n(r)))
  function p(b) {
    return b.format === 'anthropic' || b.format === 'openai'
  }
  const g = J(() => {
      var b
      return (((b = n(d)) == null ? void 0 : b.enrichedModels) ?? []).filter(p)
    }),
    f = J(() =>
      n(g).map(b => ({
        value: b.id,
        label: `${b.name ?? b.id}${b.contextWindow ? ` · ${Math.round(b.contextWindow / 1e3)}k` : ''}`,
      }))
    )
  $t(() => {
    ;(n(r) && n(d) && n(g).some(D => D.id === n(a))) || T(a, '')
  })
  const _ = J(() => !!n(r) && !!n(a) && !n(l))
  async function y() {
    if (n(_)) {
      ;(T(l, !0), T(i, null), T(v, null))
      try {
        const b = await So({ providerId: n(r), modelId: n(a), prompt: n(s) })
        ;(T(i, b, !0),
          b.ok
            ? me(`Test passed · ${b.ttftMs}ms TTFT`, 'success')
            : me(b.error ?? 'Test failed', 'error'))
      } catch (b) {
        ;(T(v, b instanceof Error ? b.message : String(b), !0), me('Network error', 'error'))
      } finally {
        T(l, !1)
      }
    }
  }
  function m(b) {
    return b == null ? '—' : b < 1e3 ? `${b} ms` : `${(b / 1e3).toFixed(2)} s`
  }
  const w = J(() =>
    n(i) && n(i).ttftMs !== null ? Math.max(0, Math.min(100, 100 - (n(i).ttftMs / 3e3) * 100)) : 0
  )
  var I = $u(),
    $ = u(I),
    E = c(u($), 2)
  Ce(E, {
    children: (b, D) => {
      var S = Z('server-side · live')
      h(b, S)
    },
    $$slots: { default: !0 },
  })
  var R = c($, 2),
    F = u(R)
  Ae(F, {
    padding: '22px',
    class: 'panel',
    children: (b, D) => {
      var S = Pu(),
        C = c(te(S), 2),
        q = c(u(C), 2)
      {
        var W = Q => {
            var ve = wu()
            h(Q, ve)
          },
          H = Q => {
            var ve = bu()
            h(Q, ve)
          },
          N = Q => {
            sr(Q, {
              get options() {
                return n(o)
              },
              get disabled() {
                return n(l)
              },
              id: 'tester-provider',
              get value() {
                return n(r)
              },
              set value(ve) {
                T(r, ve, !0)
              },
            })
          }
        j(q, Q => {
          Ee.loading ? Q(W) : n(o).length === 0 ? Q(H, 1) : Q(N, -1)
        })
      }
      var V = c(C, 2),
        U = c(u(V), 2)
      {
        var G = Q => {
            var ve = xu()
            h(Q, ve)
          },
          X = Q => {
            var ve = ku()
            h(Q, ve)
          },
          re = Q => {
            sr(Q, {
              get options() {
                return n(f)
              },
              get disabled() {
                return n(l)
              },
              id: 'tester-model',
              get value() {
                return n(a)
              },
              set value(ve) {
                T(a, ve, !0)
              },
            })
          }
        j(U, Q => {
          n(r) ? (n(f).length === 0 ? Q(X, 1) : Q(re, -1)) : Q(G)
        })
      }
      var se = c(V, 2),
        ne = c(u(se), 2),
        ie = c(se, 2),
        we = u(ie)
      {
        let Q = J(() => !n(_))
        ge(we, {
          variant: 'primary',
          size: 'lg',
          get disabled() {
            return n(Q)
          },
          onclick: y,
          children: (ve, $e) => {
            var Rt = rt(),
              or = te(Rt)
            {
              var Vt = vt => {
                  var Mt = Su(),
                    Ft = te(Mt)
                  ;(ir(Ft, { label: '' }), h(vt, Mt))
                },
                Yt = vt => {
                  var Mt = Z('Run test')
                  h(vt, Mt)
                }
              j(or, vt => {
                n(l) ? vt(Vt) : vt(Yt, -1)
              })
            }
            h(ve, Rt)
          },
          $$slots: { default: !0 },
        })
      }
      ;(L(() => (ne.disabled = n(l))),
        xa(
          ne,
          () => n(s),
          Q => T(s, Q)
        ),
        h(b, S))
    },
    $$slots: { default: !0 },
  })
  var Y = c(F, 2),
    M = u(Y)
  {
    var B = b => {
        Ae(b, {
          padding: '28px',
          class: 'result-card live',
          children: (D, S) => {
            var C = Eu(),
              q = c(te(C), 2),
              W = c(u(q)),
              H = u(W)
            ;(L(() => A(H, n(a))), h(D, C))
          },
          $$slots: { default: !0 },
        })
      },
      K = b => {
        Ae(b, {
          padding: '24px',
          class: 'result-card pass',
          children: (D, S) => {
            var C = zu(),
              q = te(C),
              W = c(u(q), 4)
            Ce(W, {
              children: (Be, Xe) => {
                var Ue = Z()
                ;(L(() => A(Ue, n(i).format)), h(Be, Ue))
              },
              $$slots: { default: !0 },
            })
            var H = c(q, 2),
              N = u(H),
              V = u(N),
              U = c(u(V)),
              G = c(V, 2),
              X = u(G),
              re = u(X),
              se = c(N, 2),
              ne = u(se),
              ie = u(ne),
              we = c(se, 2),
              Q = u(we),
              ve = u(Q),
              $e = c(we, 2),
              Rt = u($e),
              or = u(Rt),
              Vt = c($e, 2),
              Yt = u(Vt),
              vt = u(Yt),
              Mt = c(Vt, 2),
              Ft = u(Mt)
            let zt
            var Pe = u(Ft),
              De = c(H, 2)
            {
              var Ke = Be => {
                var Xe = Mu(),
                  Ue = c(u(Xe), 2),
                  Ua = u(Ue)
                ;(L(() => A(Ua, n(i).sample)), h(Be, Xe))
              }
              j(De, Be => {
                n(i).sample && Be(Ke)
              })
            }
            ;(L(
              (Be, Xe) => {
                ;(ot(U, `stroke-dashoffset: ${329.9 - (329.9 * n(w)) / 100}`),
                  A(re, n(i).ttftMs ?? '—'),
                  A(ie, Be),
                  A(ve, Xe),
                  A(or, n(i).tokensPerSec ?? '—'),
                  A(vt, n(i).tokens),
                  (zt = Ie(Ft, 1, 'metric-value mono svelte-hss3zz', null, zt, {
                    warn: n(i).streamStability === 'intermittent',
                  })),
                  A(Pe, n(i).streamStability))
              },
              [() => m(n(i).connectMs), () => m(n(i).totalMs)]
            ),
              h(D, C))
          },
          $$slots: { default: !0 },
        })
      },
      O = b => {
        Ae(b, {
          padding: '24px',
          class: 'result-card fail',
          children: (D, S) => {
            var C = Cu(),
              q = c(te(C), 2),
              W = u(q),
              H = c(q, 2)
            {
              var N = G => {
                var X = Au(),
                  re = u(X)
                ;(L(() => A(re, `↳ ${n(i).errorHint ?? ''}`)), h(G, X))
              }
              j(H, G => {
                n(i).errorHint && G(N)
              })
            }
            var V = c(H, 2)
            {
              var U = G => {
                var X = Tu(),
                  re = u(X),
                  se = u(re),
                  ne = c(re, 2),
                  ie = u(ne)
                ;(L(
                  (we, Q) => {
                    ;(A(se, `connect ${we ?? ''}`), A(ie, `total ${Q ?? ''}`))
                  },
                  [() => m(n(i).connectMs), () => m(n(i).totalMs)]
                ),
                  h(G, X))
              }
              j(V, G => {
                n(i).connectMs !== null && G(U)
              })
            }
            ;(L(() => A(W, n(i).error)), h(D, C))
          },
          $$slots: { default: !0 },
        })
      },
      P = b => {
        Ae(b, {
          padding: '24px',
          class: 'result-card fail',
          children: (D, S) => {
            var C = Iu(),
              q = c(te(C), 2),
              W = u(q)
            ;(L(() => A(W, n(v))), h(D, C))
          },
          $$slots: { default: !0 },
        })
      },
      z = b => {
        zr(b, {
          title: 'No test run yet',
          icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3',
          children: (D, S) => {
            var C = Ou()
            h(D, C)
          },
          $$slots: { default: !0 },
        })
      }
    j(M, b => {
      n(l)
        ? b(B)
        : n(i) && n(i).ok
          ? b(K, 1)
          : n(i) && !n(i).ok
            ? b(O, 2)
            : n(v)
              ? b(P, 3)
              : b(z, -1)
    })
  }
  ;(h(t, I), _e())
}
var Nu = k(
    '<h3 class="svelte-15j4tnx">Appearance</h3> <div class="line svelte-15j4tnx"><span>Theme</span> <!></div>',
    1
  ),
  Ru = k(
    '<div class="kv svelte-15j4tnx"><span>ANYGATE_HOME</span><code class="svelte-15j4tnx"> </code></div>'
  ),
  Fu = k(
    '<h3 class="svelte-15j4tnx">Subscription tier</h3> <div class="line svelte-15j4tnx"><span>Backend selection for wizards</span> <!></div> <!>',
    1
  ),
  Du = k(
    '<h3 class="svelte-15j4tnx">Config backup</h3> <p class="muted svelte-15j4tnx">Export favorites to a portable JSON file and re-import on another machine.</p> <div class="acts svelte-15j4tnx"><!> <!></div>',
    1
  ),
  ju = k(
    '<div class="preset svelte-15j4tnx"><div class="pmeta"><span class="pname svelte-15j4tnx"> </span> <span class="psub svelte-15j4tnx"> </span></div> <div class="pacts svelte-15j4tnx"><!> <!></div></div> <pre class="dryrun svelte-15j4tnx"> </pre>',
    1
  ),
  qu = k(
    '<div class="sec-head svelte-15j4tnx"><h3 class="svelte-15j4tnx">Launch presets</h3><!></div> <!>',
    1
  ),
  Hu = k(
    '<textarea class="ta svelte-15j4tnx" readonly=""></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Bu = k(
    '<p class="muted svelte-15j4tnx">Paste an anygate config JSON (from Export favorites).</p> <textarea class="ta svelte-15j4tnx" placeholder="Paste JSON here"></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Uu = k('<span class="lbl svelte-15j4tnx" style="margin-top:12px">Model</span> <!>', 1),
  Gu = k(
    '<span class="lbl svelte-15j4tnx">Label</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">App</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">Provider</span> <!> <!> <div class="row svelte-15j4tnx" style="margin-top:18px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Ku = k(
    '<div class="page"><div class="head svelte-15j4tnx"><h2 class="svelte-15j4tnx">Settings</h2><p class="sub svelte-15j4tnx">Theme, subscription tier, launch presets, and portable config backup.</p></div> <div class="cols svelte-15j4tnx"><div class="stack svelte-15j4tnx"><!> <!> <!></div> <div class="stack svelte-15j4tnx"><!></div></div></div> <!> <!> <!>',
    1
  )
function Wu(t, e) {
  pe(e, !0)
  let r = ee(!1),
    a = ee(''),
    s = ee(!1),
    l = ee('')
  const i = [
    { value: 'free', label: 'Free' },
    { value: 'zen', label: 'Zen' },
    { value: 'go', label: 'Go' },
    { value: 'both', label: 'Both' },
  ]
  function v() {
    Bo()
      .then(S => {
        ;(T(a, S, !0), T(r, !0))
      })
      .catch(S => me(String(S), 'error'))
  }
  async function o() {
    try {
      ;(await Uo(n(l)), me('Config imported', 'success'), T(s, !1), await gl())
    } catch (S) {
      me(S instanceof Error ? S.message : String(S), 'error')
    }
  }
  function d() {
    const S = new Blob([n(a)], { type: 'application/json' }),
      C = document.createElement('a')
    ;((C.href = URL.createObjectURL(S)), (C.download = 'anygate-config.json'), C.click())
  }
  let p = ee(!1),
    g = ee(''),
    f = ee(''),
    _ = ee(''),
    y = ee('')
  function m(S) {
    const C = Ee.list.find(H => H.id === S.providerId),
      q = C == null ? void 0 : C.enrichedModels.find(H => H.id === S.modelId)
    return !C || !q
      ? '—'
      : Go({ provider: C, modelId: q.id, contextWindow: q.contextWindow }).env.map(
          H => `${H.key}=${H.masked ? '•••' : H.value}`
        ).join(`
`)
  }
  var w = Ku(),
    I = te(w),
    $ = c(u(I), 2),
    E = u($),
    R = u(E)
  Ae(R, {
    padding: '20px',
    children: (S, C) => {
      var q = Nu(),
        W = c(te(q), 2),
        H = c(u(W), 2)
      ;(ge(H, {
        size: 'sm',
        variant: 'ghost',
        get onclick() {
          return yl
        },
        children: (N, V) => {
          var U = Z()
          ;(L(() => A(U, `${ar.value === 'dark' ? 'Dark' : 'Light'} · toggle`)), h(N, U))
        },
        $$slots: { default: !0 },
      }),
        h(S, q))
    },
    $$slots: { default: !0 },
  })
  var F = c(R, 2)
  Ae(F, {
    padding: '20px',
    children: (S, C) => {
      var q = Fu(),
        W = c(te(q), 2),
        H = c(u(W), 2)
      sr(H, {
        get value() {
          return rr.tier
        },
        get options() {
          return i
        },
        onchange: U => iv(U),
      })
      var N = c(W, 2)
      {
        var V = U => {
          var G = Ru(),
            X = c(u(G)),
            re = u(X)
          ;(L(() => A(re, rr.anygateHome)), h(U, G))
        }
        j(N, U => {
          rr.anygateHome && U(V)
        })
      }
      h(S, q)
    },
    $$slots: { default: !0 },
  })
  var Y = c(F, 2)
  Ae(Y, {
    padding: '20px',
    children: (S, C) => {
      var q = Du(),
        W = c(te(q), 4),
        H = u(W)
      ge(H, {
        size: 'sm',
        variant: 'subtle',
        onclick: v,
        children: (V, U) => {
          var G = Z('Export favorites')
          h(V, G)
        },
        $$slots: { default: !0 },
      })
      var N = c(H, 2)
      ;(ge(N, {
        size: 'sm',
        variant: 'ghost',
        onclick: () => T(s, !0),
        children: (V, U) => {
          var G = Z('Import')
          h(V, G)
        },
        $$slots: { default: !0 },
      }),
        h(S, q))
    },
    $$slots: { default: !0 },
  })
  var M = c(E, 2),
    B = u(M)
  Ae(B, {
    padding: '20px',
    children: (S, C) => {
      var q = qu(),
        W = te(q),
        H = c(u(W))
      ge(H, {
        size: 'sm',
        onclick: () => {
          ;(T(p, !0), T(g, ''), T(f, ''), T(_, ''), T(y, ''))
        },
        children: (G, X) => {
          var re = Z('New')
          h(G, re)
        },
        $$slots: { default: !0 },
      })
      var N = c(W, 2)
      {
        var V = G => {
            zr(G, {
              title: 'No presets',
              icon: 'M12 5v14M5 12h14',
              children: (X, re) => {
                var se = Z('Save an app + provider + model combo for one-click launch.')
                h(X, se)
              },
              $$slots: { default: !0 },
            })
          },
          U = G => {
            var X = rt(),
              re = te(X)
            ;(Se(
              re,
              17,
              () => Et.list,
              se => se.id,
              (se, ne) => {
                var ie = ju(),
                  we = te(ie),
                  Q = u(we),
                  ve = u(Q),
                  $e = u(ve),
                  Rt = c(ve, 2),
                  or = u(Rt),
                  Vt = c(Q, 2),
                  Yt = u(Vt)
                ge(Yt, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => navigator.clipboard.writeText(m(n(ne))),
                  children: (zt, Pe) => {
                    var De = Z('Dry run')
                    h(zt, De)
                  },
                  $$slots: { default: !0 },
                })
                var vt = c(Yt, 2)
                ge(vt, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => vv(n(ne).id),
                  children: (zt, Pe) => {
                    var De = Z('Delete')
                    h(zt, De)
                  },
                  $$slots: { default: !0 },
                })
                var Mt = c(we, 2),
                  Ft = u(Mt)
                ;(L(
                  zt => {
                    ;(A($e, n(ne).label ?? n(ne).appId),
                      A(
                        or,
                        `${n(ne).providerId ?? ''}${n(ne).modelId ? ' · ' + n(ne).modelId : ''}${n(ne).folder ? ' · ' + n(ne).folder : ''}`
                      ),
                      A(Ft, zt))
                  },
                  [() => m(n(ne))]
                ),
                  h(se, ie))
              }
            ),
              h(G, X))
          }
        j(N, G => {
          Et.list.length === 0 ? G(V) : G(U, -1)
        })
      }
      h(S, q)
    },
    $$slots: { default: !0 },
  })
  var K = c(I, 2)
  {
    var O = S => {
      xr(S, {
        get open() {
          return n(r)
        },
        title: 'Export favorites',
        onclose: () => T(r, !1),
        children: (C, q) => {
          var W = Hu(),
            H = te(W),
            N = c(H, 2),
            V = u(N)
          ge(V, {
            variant: 'ghost',
            onclick: () => T(r, !1),
            children: (G, X) => {
              var re = Z('Close')
              h(G, re)
            },
            $$slots: { default: !0 },
          })
          var U = c(V, 2)
          ;(ge(U, {
            onclick: d,
            children: (G, X) => {
              var re = Z('Download')
              h(G, re)
            },
            $$slots: { default: !0 },
          }),
            L(() => Os(H, n(a))),
            h(C, W))
        },
        $$slots: { default: !0 },
      })
    }
    j(K, S => {
      n(r) && S(O)
    })
  }
  var P = c(K, 2)
  {
    var z = S => {
      xr(S, {
        get open() {
          return n(s)
        },
        title: 'Import config',
        onclose: () => T(s, !1),
        children: (C, q) => {
          var W = Bu(),
            H = c(te(W), 2),
            N = c(H, 2),
            V = u(N)
          ge(V, {
            variant: 'ghost',
            onclick: () => T(s, !1),
            children: (G, X) => {
              var re = Z('Cancel')
              h(G, re)
            },
            $$slots: { default: !0 },
          })
          var U = c(V, 2)
          ;(ge(U, {
            onclick: o,
            children: (G, X) => {
              var re = Z('Import')
              h(G, re)
            },
            $$slots: { default: !0 },
          }),
            xa(
              H,
              () => n(l),
              G => T(l, G)
            ),
            h(C, W))
        },
        $$slots: { default: !0 },
      })
    }
    j(P, S => {
      n(s) && S(z)
    })
  }
  var b = c(P, 2)
  {
    var D = S => {
      xr(S, {
        get open() {
          return n(p)
        },
        title: 'New preset',
        onclose: () => T(p, !1),
        children: (C, q) => {
          var W = Gu(),
            H = c(te(W), 2)
          Zt(H, {
            placeholder: 'My daily setup',
            get value() {
              return n(y)
            },
            set value(ne) {
              T(y, ne, !0)
            },
          })
          var N = c(H, 4)
          {
            let ne = J(() => [
              { value: '', label: '—' },
              ...(Ee.list.length
                ? [
                    { value: 'claude', label: 'Claude' },
                    { value: 'codex', label: 'Codex' },
                    { value: 'antigravity', label: 'Antigravity' },
                  ]
                : []),
            ])
            sr(N, {
              get options() {
                return n(ne)
              },
              get value() {
                return n(g)
              },
              set value(ie) {
                T(g, ie, !0)
              },
            })
          }
          var V = c(N, 4)
          {
            let ne = J(() => [
              { value: '', label: '—' },
              ...Ee.list.map(ie => ({ value: ie.id, label: ie.name })),
            ])
            sr(V, {
              get options() {
                return n(ne)
              },
              get value() {
                return n(f)
              },
              set value(ie) {
                T(f, ie, !0)
              },
            })
          }
          var U = c(V, 2)
          {
            var G = ne => {
              var ie = Uu(),
                we = c(te(ie), 2)
              {
                let Q = J(() => {
                  var ve
                  return [
                    { value: '', label: '—' },
                    ...(
                      ((ve = Ee.list.find($e => $e.id === n(f))) == null
                        ? void 0
                        : ve.enrichedModels) ?? []
                    ).map($e => ({ value: $e.id, label: $e.name ?? $e.id })),
                  ]
                })
                sr(we, {
                  get options() {
                    return n(Q)
                  },
                  get value() {
                    return n(_)
                  },
                  set value(ve) {
                    T(_, ve, !0)
                  },
                })
              }
              h(ne, ie)
            }
            j(U, ne => {
              n(f) && ne(G)
            })
          }
          var X = c(U, 2),
            re = u(X)
          ge(re, {
            variant: 'ghost',
            onclick: () => T(p, !1),
            children: (ne, ie) => {
              var we = Z('Cancel')
              h(ne, we)
            },
            $$slots: { default: !0 },
          })
          var se = c(re, 2)
          {
            let ne = J(() => !n(g) || !n(y))
            ge(se, {
              get disabled() {
                return n(ne)
              },
              onclick: async () => {
                ;(await ov({
                  appId: n(g),
                  providerId: n(f) || void 0,
                  modelId: n(_) || void 0,
                  label: n(y),
                }),
                  T(p, !1))
              },
              children: (ie, we) => {
                var Q = Z('Save')
                h(ie, Q)
              },
              $$slots: { default: !0 },
            })
          }
          h(C, W)
        },
        $$slots: { default: !0 },
      })
    }
    j(b, S => {
      n(p) && S(D)
    })
  }
  ;(h(t, w), _e())
}
var Vu = k(
  '<div class="app-shell svelte-1n46o8q"><!> <div class="main svelte-1n46o8q"><!> <main class="content svelte-1n46o8q"><!> <!> <!> <!> <!> <!> <!></main></div></div> <!> <!>',
  1
)
function Yu(t, e) {
  pe(e, !0)
  let r = ''
  function a(P) {
    ;(P.metaKey || P.ctrlKey) && P.key.toLowerCase() === 'k' && (P.preventDefault(), go())
  }
  sl(
    () => (
      ho(),
      window.addEventListener('keydown', a),
      Ns(),
      hl(),
      sv(),
      lv(),
      gl(),
      () => window.removeEventListener('keydown', a)
    )
  )
  var s = Vu(),
    l = te(s),
    i = u(l)
  uv(i, {})
  var v = c(i, 2),
    o = u(v)
  Dv(o, {})
  var d = c(o, 2),
    p = u(d)
  {
    var g = P => {
      Kd(P, {})
    }
    j(p, P => {
      bt.route === 'dashboard' && P(g)
    })
  }
  var f = c(p, 2)
  {
    var _ = P => {
      xc(P, {})
    }
    j(f, P => {
      bt.route === 'providers' && P(_)
    })
  }
  var y = c(f, 2)
  {
    var m = P => {
      Uc(P, {})
    }
    j(y, P => {
      bt.route === 'models' && P(m)
    })
  }
  var w = c(y, 2)
  {
    var I = P => {
      lu(P, {})
    }
    j(w, P => {
      bt.route === 'apps' && P(I)
    })
  }
  var $ = c(w, 2)
  {
    var E = P => {
      yu(P, {})
    }
    j($, P => {
      bt.route === 'server' && P(E)
    })
  }
  var R = c($, 2)
  {
    var F = P => {
      Lu(P, {})
    }
    j(R, P => {
      bt.route === 'tester' && P(F)
    })
  }
  var Y = c(R, 2)
  {
    var M = P => {
      Wu(P, {})
    }
    j(Y, P => {
      bt.route === 'settings' && P(M)
    })
  }
  var B = c(l, 2)
  Hv(B, {})
  var K = c(B, 2)
  {
    var O = P => {
      Jv(P, {
        query: r,
        get onclose() {
          return _o
        },
      })
    }
    j(K, P => {
      Pt.commandOpen && P(O)
    })
  }
  ;(h(t, s), _e())
}
try {
  Ji(Yu, { target: document.getElementById('app') })
} catch (t) {
  console.error('Runtime error during mount:', t)
  const e = document.getElementById('app'),
    r = t instanceof Error ? t.stack || t.message : String(t)
  e &&
    (e.innerHTML = `<pre style="color:#ff8a8a;background:#161616;padding:24px;margin:0;white-space:pre-wrap;font:13px ui-monospace,monospace;max-height:100vh;overflow:auto">MOUNT ERROR:

${r.replace(/[<>&]/g, a => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[a])}</pre>`)
}
