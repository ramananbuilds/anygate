var Fl = Object.defineProperty
var Vs = e => {
  throw TypeError(e)
}
var Rl = (e, t, r) =>
  t in e ? Fl(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)
var Ve = (e, t, r) => Rl(e, typeof t != 'symbol' ? t + '' : t, r),
  Xa = (e, t, r) => t.has(e) || Vs('Cannot ' + r)
var S = (e, t, r) => (Xa(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  de = (e, t, r) =>
    t.has(e)
      ? Vs('Cannot add the same private member more than once')
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, r),
  ve = (e, t, r, a) => (Xa(e, t, 'write to private field'), a ? a.call(e, r) : t.set(e, r), r),
  xe = (e, t, r) => (Xa(e, t, 'access private method'), r)
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
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
const mn = !1
var As = Array.isArray,
  Nl = Array.prototype.indexOf,
  Da = Array.prototype.includes,
  Va = Array.from,
  Dl = Object.defineProperty,
  Rr = Object.getOwnPropertyDescriptor,
  yn = Object.getOwnPropertyDescriptors,
  jl = Object.prototype,
  ql = Array.prototype,
  Ts = Object.getPrototypeOf,
  Ys = Object.isExtensible
const wn = () => {}
function Bl(e) {
  return e()
}
function os(e) {
  for (var t = 0; t < e.length; t++) e[t]()
}
function bn() {
  var e,
    t,
    r = new Promise((a, s) => {
      ;((e = a), (t = s))
    })
  return { promise: r, resolve: e, reject: t }
}
const Be = 2,
  Wr = 4,
  xa = 8,
  xn = 1 << 24,
  St = 16,
  gt = 32,
  Vt = 64,
  vs = 128,
  _t = 512,
  Ne = 1024,
  De = 2048,
  Et = 4096,
  Xe = 8192,
  vt = 16384,
  Xr = 32768,
  ds = 1 << 25,
  Er = 65536,
  ja = 1 << 17,
  Hl = 1 << 18,
  Zr = 1 << 19,
  kn = 1 << 20,
  Ct = 1 << 25,
  Mr = 65536,
  qa = 1 << 21,
  Nr = 1 << 22,
  ir = 1 << 23,
  Wt = Symbol('$state'),
  Ul = Symbol('legacy props'),
  Gl = Symbol(''),
  Ca = Symbol('attributes'),
  cs = Symbol('class'),
  us = Symbol('style'),
  sa = Symbol('text'),
  Ia = Symbol('form reset'),
  ka = new (class extends Error {
    constructor() {
      super(...arguments)
      Ve(this, 'name', 'StaleReactionError')
      Ve(this, 'message', 'The reaction that called `getAbortSignal()` was re-run or destroyed')
    }
  })()
var hn
const Wl =
  !!((hn = globalThis.document) != null && hn.contentType) &&
  globalThis.document.contentType.includes('xml')
function Kl(e) {
  throw new Error('https://svelte.dev/e/lifecycle_outside_component')
}
function Vl() {
  throw new Error('https://svelte.dev/e/async_derived_orphan')
}
function Yl(e, t, r) {
  throw new Error('https://svelte.dev/e/each_key_duplicate')
}
function Jl(e) {
  throw new Error('https://svelte.dev/e/effect_in_teardown')
}
function Xl() {
  throw new Error('https://svelte.dev/e/effect_in_unowned_derived')
}
function Zl(e) {
  throw new Error('https://svelte.dev/e/effect_orphan')
}
function Ql() {
  throw new Error('https://svelte.dev/e/effect_update_depth_exceeded')
}
function ei(e) {
  throw new Error('https://svelte.dev/e/props_invalid_value')
}
function ti() {
  throw new Error('https://svelte.dev/e/state_descriptors_fixed')
}
function ri() {
  throw new Error('https://svelte.dev/e/state_prototype_fixed')
}
function ai() {
  throw new Error('https://svelte.dev/e/state_unsafe_mutation')
}
function si() {
  throw new Error('https://svelte.dev/e/svelte_boundary_reset_onerror')
}
const ni = 1,
  li = 2,
  Sn = 4,
  ii = 8,
  oi = 16,
  vi = 1,
  di = 2,
  ci = 4,
  ui = 8,
  fi = 16,
  pi = 1,
  hi = 2,
  Re = Symbol('uninitialized'),
  Pn = 'http://www.w3.org/1999/xhtml',
  _i = 'http://www.w3.org/2000/svg',
  gi = 'http://www.w3.org/1998/Math/MathML'
function mi() {
  console.warn('https://svelte.dev/e/derived_inert')
}
function yi() {
  console.warn('https://svelte.dev/e/select_multiple_invalid_value')
}
function wi() {
  console.warn('https://svelte.dev/e/svelte_boundary_reset_noop')
}
function En(e) {
  return e === this.v
}
function bi(e, t) {
  return e != e ? t == t : e !== t || (e !== null && typeof e == 'object') || typeof e == 'function'
}
function Mn(e) {
  return !bi(e, this.v)
}
let Qr = !1,
  xi = !1
function ki() {
  Qr = !0
}
let ze = null
function Kr(e) {
  ze = e
}
function fe(e, t = !1, r) {
  ze = {
    p: ze,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: ue,
    l: Qr && !t ? { s: null, u: null, $: [] } : null,
  }
}
function pe(e) {
  var t = ze,
    r = t.e
  if (r !== null) {
    t.e = null
    for (var a of r) Yn(a)
  }
  return ((t.i = !0), (ze = t.p), {})
}
function Sa() {
  return !Qr || (ze !== null && ze.l === null)
}
let fr = []
function zn() {
  var e = fr
  ;((fr = []), os(e))
}
function or(e) {
  if (fr.length === 0 && !da) {
    var t = fr
    queueMicrotask(() => {
      t === fr && zn()
    })
  }
  fr.push(e)
}
function Si() {
  for (; fr.length > 0;) zn()
}
function An(e) {
  var t = ue
  if (t === null) return ((he.f |= ir), e)
  if ((t.f & Xr) === 0 && (t.f & Wr) === 0) throw e
  ar(e, t)
}
function ar(e, t) {
  if (!(t !== null && (t.f & vt) !== 0)) {
    for (; t !== null;) {
      if ((t.f & vs) !== 0) {
        if ((t.f & Xr) === 0) throw e
        try {
          t.b.error(e)
          return
        } catch (r) {
          e = r
        }
      }
      t = t.parent
    }
    throw e
  }
}
const Pi = -7169
function Oe(e, t) {
  e.f = (e.f & Pi) | t
}
function $s(e) {
  ;(e.f & _t) !== 0 || e.deps === null ? Oe(e, Ne) : Oe(e, Et)
}
function Tn(e) {
  if (e !== null)
    for (const t of e) (t.f & Be) === 0 || (t.f & Mr) === 0 || ((t.f ^= Mr), Tn(t.deps))
}
function $n(e, t, r) {
  ;((e.f & De) !== 0 ? t.add(e) : (e.f & Et) !== 0 && r.add(e), Tn(e.deps), Oe(e, Ne))
}
let za = !1
function Ei(e) {
  var t = za
  try {
    return ((za = !1), [e(), za])
  } finally {
    za = t
  }
}
let Js = !1
function Mi() {
  Js ||
    ((Js = !0),
    document.addEventListener(
      'reset',
      e => {
        Promise.resolve().then(() => {
          var t
          if (!e.defaultPrevented)
            for (const r of e.target.elements) (t = r[Ia]) == null || t.call(r)
        })
      },
      { capture: !0 }
    ))
}
function ea(e) {
  var t = he,
    r = ue
  ;(mt(null), Ft(null))
  try {
    return e()
  } finally {
    ;(mt(t), Ft(r))
  }
}
function Cn(e, t, r, a = r) {
  e.addEventListener(t, () => ea(r))
  const s = e[Ia]
  ;(s
    ? (e[Ia] = () => {
        ;(s(), a(!0))
      })
    : (e[Ia] = () => a(!0)),
    Mi())
}
function zi(e) {
  let t = 0,
    r = Ar(0),
    a
  return () => {
    Fs() &&
      (n(r),
      Ns(
        () => (
          t === 0 && (a = ta(() => e(() => ca(r)))),
          (t += 1),
          () => {
            or(() => {
              ;((t -= 1), t === 0 && (a == null || a(), (a = void 0), ca(r)))
            })
          }
        )
      ))
  }
}
var Ai = Er | Zr
function Ti(e, t, r, a) {
  new $i(e, t, r, a)
}
var ut,
  zs,
  ft,
  gr,
  tt,
  pt,
  Ye,
  lt,
  Bt,
  mr,
  tr,
  Dr,
  ga,
  ma,
  Ht,
  Ga,
  Ce,
  Ci,
  Ii,
  Oi,
  fs,
  Oa,
  La,
  ps,
  hs
class $i {
  constructor(t, r, a, s) {
    de(this, Ce)
    Ve(this, 'parent')
    Ve(this, 'is_pending', !1)
    Ve(this, 'transform_error')
    de(this, ut)
    de(this, zs, null)
    de(this, ft)
    de(this, gr)
    de(this, tt)
    de(this, pt, null)
    de(this, Ye, null)
    de(this, lt, null)
    de(this, Bt, null)
    de(this, mr, 0)
    de(this, tr, 0)
    de(this, Dr, !1)
    de(this, ga, new Set())
    de(this, ma, new Set())
    de(this, Ht, null)
    de(
      this,
      Ga,
      zi(
        () => (
          ve(this, Ht, Ar(S(this, mr))),
          () => {
            ve(this, Ht, null)
          }
        )
      )
    )
    var l
    ;(ve(this, ut, t),
      ve(this, ft, r),
      ve(this, gr, i => {
        var o = ue
        ;((o.b = this), (o.f |= vs), a(i))
      }),
      (this.parent = ue.b),
      (this.transform_error =
        s ?? ((l = this.parent) == null ? void 0 : l.transform_error) ?? (i => i)),
      ve(
        this,
        tt,
        Ya(() => {
          xe(this, Ce, fs).call(this)
        }, Ai)
      ))
  }
  defer_effect(t) {
    $n(t, S(this, ga), S(this, ma))
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered())
  }
  has_pending_snippet() {
    return !!S(this, ft).pending
  }
  update_pending_count(t, r) {
    ;(xe(this, Ce, ps).call(this, t, r),
      ve(this, mr, S(this, mr) + t),
      !(!S(this, Ht) || S(this, Dr)) &&
        (ve(this, Dr, !0),
        or(() => {
          ;(ve(this, Dr, !1), S(this, Ht) && Yr(S(this, Ht), S(this, mr)))
        })))
  }
  get_effect_pending() {
    return (S(this, Ga).call(this), n(S(this, Ht)))
  }
  error(t) {
    if (!S(this, ft).onerror && !S(this, ft).failed) throw t
    se != null && se.is_fork
      ? (S(this, pt) && se.skip_effect(S(this, pt)),
        S(this, Ye) && se.skip_effect(S(this, Ye)),
        S(this, lt) && se.skip_effect(S(this, lt)),
        se.oncommit(() => {
          xe(this, Ce, hs).call(this, t)
        }))
      : xe(this, Ce, hs).call(this, t)
  }
}
;((ut = new WeakMap()),
  (zs = new WeakMap()),
  (ft = new WeakMap()),
  (gr = new WeakMap()),
  (tt = new WeakMap()),
  (pt = new WeakMap()),
  (Ye = new WeakMap()),
  (lt = new WeakMap()),
  (Bt = new WeakMap()),
  (mr = new WeakMap()),
  (tr = new WeakMap()),
  (Dr = new WeakMap()),
  (ga = new WeakMap()),
  (ma = new WeakMap()),
  (Ht = new WeakMap()),
  (Ga = new WeakMap()),
  (Ce = new WeakSet()),
  (Ci = function () {
    try {
      ve(
        this,
        pt,
        ht(() => S(this, gr).call(this, S(this, ut)))
      )
    } catch (t) {
      this.error(t)
    }
  }),
  (Ii = function (t) {
    const r = S(this, ft).failed
    r &&
      ve(
        this,
        lt,
        ht(() => {
          r(
            S(this, ut),
            () => t,
            () => () => {}
          )
        })
      )
  }),
  (Oi = function () {
    const t = S(this, ft).pending
    t &&
      ((this.is_pending = !0),
      ve(
        this,
        Ye,
        ht(() => t(S(this, ut)))
      ),
      or(() => {
        var r = ve(this, Bt, document.createDocumentFragment()),
          a = Kt()
        ;(r.append(a),
          ve(
            this,
            pt,
            xe(this, Ce, La).call(this, () => ht(() => S(this, gr).call(this, a)))
          ),
          S(this, tr) === 0 &&
            (S(this, ut).before(r),
            ve(this, Bt, null),
            kr(S(this, Ye), () => {
              ve(this, Ye, null)
            }),
            xe(this, Ce, Oa).call(this, se)))
      }))
  }),
  (fs = function () {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        ve(this, tr, 0),
        ve(this, mr, 0),
        ve(
          this,
          pt,
          ht(() => {
            S(this, gr).call(this, S(this, ut))
          })
        ),
        S(this, tr) > 0)
      ) {
        var t = ve(this, Bt, document.createDocumentFragment())
        js(S(this, pt), t)
        const r = S(this, ft).pending
        ve(
          this,
          Ye,
          ht(() => r(S(this, ut)))
        )
      } else xe(this, Ce, Oa).call(this, se)
    } catch (r) {
      this.error(r)
    }
  }),
  (Oa = function (t) {
    ;((this.is_pending = !1), t.transfer_effects(S(this, ga), S(this, ma)))
  }),
  (La = function (t) {
    var r = ue,
      a = he,
      s = ze
    ;(Ft(S(this, tt)), mt(S(this, tt)), Kr(S(this, tt).ctx))
    try {
      return (zr.ensure(), t())
    } catch (l) {
      return (An(l), null)
    } finally {
      ;(Ft(r), mt(a), Kr(s))
    }
  }),
  (ps = function (t, r) {
    var a
    if (!this.has_pending_snippet()) {
      this.parent && xe((a = this.parent), Ce, ps).call(a, t, r)
      return
    }
    ;(ve(this, tr, S(this, tr) + t),
      S(this, tr) === 0 &&
        (xe(this, Ce, Oa).call(this, r),
        S(this, Ye) &&
          kr(S(this, Ye), () => {
            ve(this, Ye, null)
          }),
        S(this, Bt) && (S(this, ut).before(S(this, Bt)), ve(this, Bt, null))))
  }),
  (hs = function (t) {
    ;(S(this, pt) && (st(S(this, pt)), ve(this, pt, null)),
      S(this, Ye) && (st(S(this, Ye)), ve(this, Ye, null)),
      S(this, lt) && (st(S(this, lt)), ve(this, lt, null)))
    var r = S(this, ft).onerror
    let a = S(this, ft).failed
    var s = !1,
      l = !1
    const i = () => {
        if (s) {
          wi()
          return
        }
        ;((s = !0),
          l && si(),
          S(this, lt) !== null &&
            kr(S(this, lt), () => {
              ve(this, lt, null)
            }),
          xe(this, Ce, La).call(this, () => {
            xe(this, Ce, fs).call(this)
          }))
      },
      o = v => {
        try {
          ;((l = !0), r == null || r(v, i), (l = !1))
        } catch (d) {
          ar(d, S(this, tt) && S(this, tt).parent)
        }
        a &&
          ve(
            this,
            lt,
            xe(this, Ce, La).call(this, () => {
              try {
                return ht(() => {
                  var d = ue
                  ;((d.b = this),
                    (d.f |= vs),
                    a(
                      S(this, ut),
                      () => v,
                      () => i
                    ))
                })
              } catch (d) {
                return (ar(d, S(this, tt).parent), null)
              }
            })
          )
      }
    or(() => {
      var v
      try {
        v = this.transform_error(t)
      } catch (d) {
        ar(d, S(this, tt) && S(this, tt).parent)
        return
      }
      v !== null && typeof v == 'object' && typeof v.then == 'function'
        ? v.then(o, d => ar(d, S(this, tt) && S(this, tt).parent))
        : o(v)
    })
  }))
function Li(e, t, r, a) {
  const s = Sa() ? Vr : Cs
  var l = e.filter(g => !g.settled),
    i = t.map(s)
  if (r.length === 0 && l.length === 0) {
    a(i)
    return
  }
  var o = ue,
    v = Fi(),
    d = l.length === 1 ? l[0].promise : l.length > 1 ? Promise.all(l.map(g => g.promise)) : null
  function h(g) {
    if ((o.f & vt) === 0) {
      v()
      try {
        a([...i, ...g])
      } catch (m) {
        ar(m, o)
      }
      Ba()
    }
  }
  var _ = In()
  if (r.length === 0) {
    d.then(() => h([])).finally(_)
    return
  }
  function f() {
    Promise.all(r.map(g => Ri(g)))
      .then(h)
      .catch(g => ar(g, o))
      .finally(_)
  }
  d
    ? d.then(() => {
        ;(v(), f(), Ba())
      })
    : f()
}
function Fi() {
  var e = ue,
    t = he,
    r = ze,
    a = se
  return function (l = !0) {
    ;(Ft(e),
      mt(t),
      Kr(r),
      l && (e.f & vt) === 0 && (a == null || a.activate(), a == null || a.apply()))
  }
}
function Ba(e = !0) {
  ;(Ft(null), mt(null), Kr(null), e && (se == null || se.deactivate()))
}
function In() {
  var e = ue,
    t = e.b,
    r = se,
    a = !!(t != null && t.is_rendered())
  return (
    t == null || t.update_pending_count(1, r),
    r.increment(a, e),
    () => {
      ;(t == null || t.update_pending_count(-1, r), r.decrement(a, e))
    }
  )
}
function Vr(e) {
  var t = Be | De
  return (
    ue !== null && (ue.f |= Zr),
    {
      ctx: ze,
      deps: null,
      effects: null,
      equals: En,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: Re,
      wv: 0,
      parent: ue,
      ac: null,
    }
  )
}
const na = Symbol('obsolete')
function Ri(e, t, r) {
  let a = ue
  a === null && Vl()
  var s = void 0,
    l = Ar(Re),
    i = !he,
    o = new Set()
  return (
    Zi(() => {
      var g, m
      var v = ue,
        d = bn()
      s = d.promise
      try {
        Promise.resolve(e())
          .then(d.resolve, y => {
            y !== ka && d.reject(y)
          })
          .finally(Ba)
      } catch (y) {
        ;(d.reject(y), Ba())
      }
      var h = se
      if (i) {
        if ((v.f & Xr) !== 0) var _ = In()
        if ((g = a.b) != null && g.is_rendered())
          (m = h.async_deriveds.get(v)) == null || m.reject(na)
        else for (const y of o.values()) y.reject(na)
        ;(o.add(d), h.async_deriveds.set(v, d))
      }
      const f = (y, w = void 0) => {
        ;(_ == null || _(),
          o.delete(d),
          w !== na &&
            (h.activate(),
            w ? ((l.f |= ir), Yr(l, w)) : ((l.f & ir) !== 0 && (l.f ^= ir), Yr(l, y)),
            h.deactivate()))
      }
      d.promise.then(f, y => f(null, y || 'unknown'))
    }),
    Rs(() => {
      for (const v of o) v.reject(na)
    }),
    new Promise(v => {
      function d(h) {
        function _() {
          h === s ? v(l) : d(s)
        }
        h.then(_, _)
      }
      d(s)
    })
  )
}
function J(e) {
  const t = Vr(e)
  return (rl(t), t)
}
function Cs(e) {
  const t = Vr(e)
  return ((t.equals = Mn), t)
}
function Ni(e) {
  var t = e.effects
  if (t !== null) {
    e.effects = null
    for (var r = 0; r < t.length; r += 1) st(t[r])
  }
}
function Is(e) {
  var t,
    r = ue,
    a = e.parent
  if (!Yt && a !== null && e.v !== Re && (a.f & (vt | Xe)) !== 0) return (mi(), e.v)
  Ft(a)
  try {
    ;((e.f &= ~Mr), Ni(e), (t = ll(e)))
  } finally {
    Ft(r)
  }
  return t
}
function On(e) {
  var t = Is(e)
  if (
    !e.equals(t) &&
    ((e.wv = sl()),
    (!(se != null && se.is_fork) || e.deps === null) &&
      (se !== null ? (se.capture(e, t, !0), va == null || va.capture(e, t, !0)) : (e.v = t),
      e.deps === null))
  ) {
    Oe(e, Ne)
    return
  }
  Yt || (He !== null ? (Fs() || (se != null && se.is_fork)) && He.set(e, t) : $s(e))
}
function Di(e) {
  var t
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) &&
        ((t = r.teardown) == null || t.call(r),
        r.ac !== null &&
          ea(() => {
            ;(r.ac.abort(ka), (r.ac = null))
          }),
        r.fn !== null && (r.teardown = wn),
        ha(r, 0),
        Ds(r))
}
function Ln(e) {
  if (e.effects !== null) for (const t of e.effects) t.teardown && t.fn !== null && Jr(t)
}
let Za = null,
  Ir = null,
  se = null,
  va = null,
  He = null,
  _s = null,
  da = !1,
  Qa = !1,
  Lr = null,
  Fa = null
var Xs = 0
let ji = 1
var jr, rr, yr, qr, Br, Hr, Ut, Ur, rt, ya, Gt, bt, Tt, Gr, wr, Pe, gs, la, ms, Fn, Rn, Or, qi, ia
const Wa = class Wa {
  constructor() {
    de(this, Pe)
    Ve(this, 'id', ji++)
    de(this, jr, !1)
    Ve(this, 'linked', !0)
    de(this, rr, null)
    de(this, yr, null)
    Ve(this, 'async_deriveds', new Map())
    Ve(this, 'current', new Map())
    Ve(this, 'previous', new Map())
    de(this, qr, new Set())
    de(this, Br, new Set())
    de(this, Hr, 0)
    de(this, Ut, new Map())
    de(this, Ur, null)
    de(this, rt, [])
    de(this, ya, [])
    de(this, Gt, new Set())
    de(this, bt, new Set())
    de(this, Tt, new Map())
    de(this, Gr, new Set())
    Ve(this, 'is_fork', !1)
    de(this, wr, !1)
    ;(Ir === null ? (Za = Ir = this) : (ve(Ir, yr, this), ve(this, rr, Ir)), (Ir = this))
  }
  skip_effect(t) {
    ;(S(this, Tt).has(t) || S(this, Tt).set(t, { d: [], m: [] }), S(this, Gr).delete(t))
  }
  unskip_effect(t, r = a => this.schedule(a)) {
    var a = S(this, Tt).get(t)
    if (a) {
      S(this, Tt).delete(t)
      for (var s of a.d) (Oe(s, De), r(s))
      for (s of a.m) (Oe(s, Et), r(s))
    }
    S(this, Gr).add(t)
  }
  capture(t, r, a = !1) {
    ;(t.v !== Re && !this.previous.has(t) && this.previous.set(t, t.v),
      (t.f & ir) === 0 && (this.current.set(t, [r, a]), He == null || He.set(t, r)),
      this.is_fork || (t.v = r))
  }
  activate() {
    se = this
  }
  deactivate() {
    ;((se = null), (He = null))
  }
  flush() {
    try {
      ;((Qa = !0), (se = this), xe(this, Pe, la).call(this))
    } finally {
      ;((Xs = 0),
        (_s = null),
        (Lr = null),
        (Fa = null),
        (Qa = !1),
        (se = null),
        (He = null),
        xr.clear())
    }
  }
  discard() {
    var t
    for (const r of S(this, Br)) r(this)
    S(this, Br).clear()
    for (const r of this.async_deriveds.values()) r.reject(na)
    ;(xe(this, Pe, ia).call(this), (t = S(this, Ur)) == null || t.resolve())
  }
  register_created_effect(t) {
    S(this, ya).push(t)
  }
  increment(t, r) {
    if ((ve(this, Hr, S(this, Hr) + 1), t)) {
      let a = S(this, Ut).get(r) ?? 0
      S(this, Ut).set(r, a + 1)
    }
  }
  decrement(t, r) {
    if ((ve(this, Hr, S(this, Hr) - 1), t)) {
      let a = S(this, Ut).get(r) ?? 0
      a === 1 ? S(this, Ut).delete(r) : S(this, Ut).set(r, a - 1)
    }
    S(this, wr) ||
      (ve(this, wr, !0),
      or(() => {
        ;(ve(this, wr, !1), this.linked && this.flush())
      }))
  }
  transfer_effects(t, r) {
    for (const a of t) S(this, Gt).add(a)
    for (const a of r) S(this, bt).add(a)
    ;(t.clear(), r.clear())
  }
  oncommit(t) {
    S(this, qr).add(t)
  }
  ondiscard(t) {
    S(this, Br).add(t)
  }
  settled() {
    return (S(this, Ur) ?? ve(this, Ur, bn())).promise
  }
  static ensure() {
    if (se === null) {
      const t = (se = new Wa())
      !Qa &&
        !da &&
        or(() => {
          S(t, jr) || t.flush()
        })
    }
    return se
  }
  apply() {
    {
      He = null
      return
    }
  }
  schedule(t) {
    var s
    if (
      ((_s = t),
      (s = t.b) != null && s.is_pending && (t.f & (Wr | xa | xn)) !== 0 && (t.f & Xr) === 0)
    ) {
      t.b.defer_effect(t)
      return
    }
    for (var r = t; r.parent !== null;) {
      r = r.parent
      var a = r.f
      if (Lr !== null && r === ue && (he === null || (he.f & Be) === 0)) return
      if ((a & (Vt | gt)) !== 0) {
        if ((a & Ne) === 0) return
        r.f ^= Ne
      }
    }
    S(this, rt).push(r)
  }
}
;((jr = new WeakMap()),
  (rr = new WeakMap()),
  (yr = new WeakMap()),
  (qr = new WeakMap()),
  (Br = new WeakMap()),
  (Hr = new WeakMap()),
  (Ut = new WeakMap()),
  (Ur = new WeakMap()),
  (rt = new WeakMap()),
  (ya = new WeakMap()),
  (Gt = new WeakMap()),
  (bt = new WeakMap()),
  (Tt = new WeakMap()),
  (Gr = new WeakMap()),
  (wr = new WeakMap()),
  (Pe = new WeakSet()),
  (gs = function () {
    if (this.is_fork) return !0
    for (const a of S(this, Ut).keys()) {
      for (var t = a, r = !1; t.parent !== null;) {
        if (S(this, Tt).has(t)) {
          r = !0
          break
        }
        t = t.parent
      }
      if (!r) return !0
    }
    return !1
  }),
  (la = function () {
    var v, d, h, _
    ;(ve(this, jr, !0), Xs++ > 1e3 && (xe(this, Pe, ia).call(this), Hi()))
    for (const f of S(this, Gt)) (S(this, bt).delete(f), Oe(f, De), this.schedule(f))
    for (const f of S(this, bt)) (Oe(f, Et), this.schedule(f))
    const t = S(this, rt)
    ;(ve(this, rt, []), this.apply())
    var r = (Lr = []),
      a = [],
      s = (Fa = [])
    for (const f of t)
      try {
        xe(this, Pe, ms).call(this, f, r, a)
      } catch (g) {
        throw (jn(f), xe(this, Pe, gs).call(this) || this.discard(), g)
      }
    if (((se = null), s.length > 0)) {
      var l = Wa.ensure()
      for (const f of s) l.schedule(f)
    }
    if (((Lr = null), (Fa = null), xe(this, Pe, gs).call(this))) {
      ;(xe(this, Pe, Or).call(this, a), xe(this, Pe, Or).call(this, r))
      for (const [f, g] of S(this, Tt)) Dn(f, g)
      s.length > 0 && xe((v = se), Pe, la).call(v)
      return
    }
    const i = xe(this, Pe, Fn).call(this)
    if (i) {
      ;(xe(this, Pe, Or).call(this, a),
        xe(this, Pe, Or).call(this, r),
        xe((d = i), Pe, Rn).call(d, this))
      return
    }
    ;(S(this, Gt).clear(), S(this, bt).clear())
    for (const f of S(this, qr)) f(this)
    ;(S(this, qr).clear(),
      (va = this),
      Zs(a),
      Zs(r),
      (va = null),
      (h = S(this, Ur)) == null || h.resolve())
    var o = se
    if (
      (S(this, Hr) === 0 && (S(this, rt).length === 0 || o !== null) && xe(this, Pe, ia).call(this),
      S(this, rt).length > 0)
    )
      if (o !== null) {
        const f = o
        S(f, rt).push(...S(this, rt).filter(g => !S(f, rt).includes(g)))
      } else o = this
    o !== null && xe((_ = o), Pe, la).call(_)
  }),
  (ms = function (t, r, a) {
    t.f ^= Ne
    for (var s = t.first; s !== null;) {
      var l = s.f,
        i = (l & (gt | Vt)) !== 0,
        o = i && (l & Ne) !== 0,
        v = o || (l & Xe) !== 0 || S(this, Tt).has(s)
      if (!v && s.fn !== null) {
        i
          ? (s.f ^= Ne)
          : (l & Wr) !== 0
            ? r.push(s)
            : Ea(s) && ((l & St) !== 0 && S(this, bt).add(s), Jr(s))
        var d = s.first
        if (d !== null) {
          s = d
          continue
        }
      }
      for (; s !== null;) {
        var h = s.next
        if (h !== null) {
          s = h
          break
        }
        s = s.parent
      }
    }
  }),
  (Fn = function () {
    for (var t = S(this, rr); t !== null;) {
      if (!t.is_fork) {
        for (const [r, [, a]] of this.current) if (t.current.has(r) && !a) return t
      }
      t = S(t, rr)
    }
    return null
  }),
  (Rn = function (t) {
    var a
    for (const [s, l] of t.current)
      (!this.previous.has(s) && t.previous.has(s) && this.previous.set(s, t.previous.get(s)),
        this.current.set(s, l))
    for (const [s, l] of t.async_deriveds) {
      const i = this.async_deriveds.get(s)
      i && l.promise.then(i.resolve).catch(i.reject)
    }
    ;(t.async_deriveds.clear(), this.transfer_effects(S(t, Gt), S(t, bt)))
    const r = s => {
      var l = s.reactions
      if (l !== null && !((s.f & Be) !== 0 && (s.f & (De | Et)) === 0))
        for (const v of l) {
          var i = v.f
          if ((i & Be) !== 0) r(v)
          else {
            var o = v
            i & (Nr | St) &&
              !this.async_deriveds.has(o) &&
              (S(this, bt).delete(o), Oe(o, De), this.schedule(o))
          }
        }
    }
    for (const s of this.current.keys()) r(s)
    ;(this.oncommit(() => t.discard()),
      xe((a = t), Pe, ia).call(a),
      (se = this),
      xe(this, Pe, la).call(this))
  }),
  (Or = function (t) {
    for (var r = 0; r < t.length; r += 1) $n(t[r], S(this, Gt), S(this, bt))
  }),
  (qi = function () {
    var _
    for (let f = Za; f !== null; f = S(f, yr)) {
      var t = f.id < this.id,
        r = []
      for (const [g, [m, y]] of this.current) {
        if (f.current.has(g)) {
          var a = f.current.get(g)[0]
          if (t && m !== a) f.current.set(g, [m, y])
          else continue
        }
        r.push(g)
      }
      if (t)
        for (const [g, m] of this.async_deriveds) {
          const y = f.async_deriveds.get(g)
          y && m.promise.then(y.resolve).catch(y.reject)
        }
      var s = [...f.current.keys()].filter(g => !f.current.get(g)[1])
      if (!(!S(f, jr) || s.length === 0)) {
        var l = s.filter(g => !this.current.has(g))
        if (l.length === 0) t && f.discard()
        else if (r.length > 0) {
          if (t)
            for (const g of S(this, Gr))
              f.unskip_effect(g, m => {
                var y
                ;(m.f & (St | Nr)) !== 0 ? f.schedule(m) : xe((y = f), Pe, Or).call(y, [m])
              })
          f.activate()
          var i = new Set(),
            o = new Map()
          for (var v of r) Nn(v, l, i, o)
          o = new Map()
          var d = [...f.current]
            .filter(([g, m]) => {
              const y = this.current.get(g)
              return y ? y[0] !== m[0] || y[1] !== m[1] : !0
            })
            .map(([g]) => g)
          if (d.length > 0)
            for (const g of S(this, ya))
              (g.f & (vt | Xe | ja)) === 0 &&
                Os(g, d, o) &&
                ((g.f & (Nr | St)) !== 0 ? (Oe(g, De), f.schedule(g)) : S(f, Gt).add(g))
          if (S(f, rt).length > 0 && !S(f, wr)) {
            f.apply()
            for (var h of S(f, rt)) xe((_ = f), Pe, ms).call(_, h, [], [])
            ve(f, rt, [])
          }
          f.deactivate()
        }
      }
    }
  }),
  (ia = function () {
    if (this.linked) {
      var t = S(this, rr),
        r = S(this, yr)
      ;(t === null ? (Za = r) : ve(t, yr, r),
        r === null ? (Ir = t) : ve(r, rr, t),
        (this.linked = !1))
    }
  }))
let zr = Wa
function Bi(e) {
  var t = da
  da = !0
  try {
    for (var r; ;) {
      if ((Si(), se === null)) return r
      se.flush()
    }
  } finally {
    da = t
  }
}
function Hi() {
  try {
    Ql()
  } catch (e) {
    ar(e, _s)
  }
}
let wt = null
function Zs(e) {
  var t = e.length
  if (t !== 0) {
    for (var r = 0; r < t;) {
      var a = e[r++]
      if (
        (a.f & (vt | Xe)) === 0 &&
        Ea(a) &&
        ((wt = new Set()),
        Jr(a),
        a.deps === null &&
          a.first === null &&
          a.nodes === null &&
          a.teardown === null &&
          a.ac === null &&
          Qn(a),
        (wt == null ? void 0 : wt.size) > 0)
      ) {
        xr.clear()
        for (const s of wt) {
          if ((s.f & (vt | Xe)) !== 0) continue
          const l = [s]
          let i = s.parent
          for (; i !== null;) (wt.has(i) && (wt.delete(i), l.push(i)), (i = i.parent))
          for (let o = l.length - 1; o >= 0; o--) {
            const v = l[o]
            ;(v.f & (vt | Xe)) === 0 && Jr(v)
          }
        }
        wt.clear()
      }
    }
    wt = null
  }
}
function Nn(e, t, r, a) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const s of e.reactions) {
      const l = s.f
      ;(l & Be) !== 0
        ? Nn(s, t, r, a)
        : (l & (Nr | St)) !== 0 && (l & De) === 0 && Os(s, t, a) && (Oe(s, De), Ls(s))
    }
}
function Os(e, t, r) {
  const a = r.get(e)
  if (a !== void 0) return a
  if (e.deps !== null)
    for (const s of e.deps) {
      if (Da.call(t, s)) return !0
      if ((s.f & Be) !== 0 && Os(s, t, r)) return (r.set(s, !0), !0)
    }
  return (r.set(e, !1), !1)
}
function Ls(e) {
  se.schedule(e)
}
function Dn(e, t) {
  if (!((e.f & gt) !== 0 && (e.f & Ne) !== 0)) {
    ;((e.f & De) !== 0 ? t.d.push(e) : (e.f & Et) !== 0 && t.m.push(e), Oe(e, Ne))
    for (var r = e.first; r !== null;) (Dn(r, t), (r = r.next))
  }
}
function jn(e) {
  Oe(e, Ne)
  for (var t = e.first; t !== null;) (jn(t), (t = t.next))
}
let Ha = new Set()
const xr = new Map()
let qn = !1
function Ar(e, t) {
  var r = { f: 0, v: e, reactions: null, equals: En, rv: 0, wv: 0 }
  return r
}
function re(e, t) {
  const r = Ar(e)
  return (rl(r), r)
}
function Ui(e, t = !1, r = !0) {
  var s
  const a = Ar(e)
  return (
    t || (a.equals = Mn),
    Qr && r && ze !== null && ze.l !== null && ((s = ze.l).s ?? (s.s = [])).push(a),
    a
  )
}
function L(e, t, r = !1) {
  he !== null &&
    (!Pt || (he.f & ja) !== 0) &&
    Sa() &&
    (he.f & (Be | St | Nr | ja)) !== 0 &&
    (Ot === null || !Ot.has(e)) &&
    ai()
  let a = r ? Le(t) : t
  return Yr(e, a, Fa)
}
function Yr(e, t, r = null) {
  if (!e.equals(t)) {
    xr.set(e, Yt ? t : e.v)
    var a = zr.ensure()
    if ((a.capture(e, t), (e.f & Be) !== 0)) {
      const s = e
      ;((e.f & De) !== 0 && Is(s), He === null && $s(s))
    }
    ;((e.wv = sl()),
      Bn(e, De, r),
      Sa() &&
        ue !== null &&
        (ue.f & Ne) !== 0 &&
        (ue.f & (gt | Vt)) === 0 &&
        (ct === null ? eo([e]) : ct.push(e)),
      !a.is_fork && Ha.size > 0 && !qn && Gi())
  }
  return t
}
function Gi() {
  qn = !1
  for (const e of Ha) {
    ;(e.f & Ne) !== 0 && Oe(e, Et)
    let t
    try {
      t = Ea(e)
    } catch {
      t = !0
    }
    t && Jr(e)
  }
  Ha.clear()
}
function ca(e) {
  L(e, e.v + 1)
}
function Bn(e, t, r) {
  var a = e.reactions
  if (a !== null)
    for (var s = Sa(), l = a.length, i = 0; i < l; i++) {
      var o = a[i],
        v = o.f
      if (!(!s && o === ue)) {
        var d = (v & De) === 0
        if ((d && Oe(o, t), (v & ja) !== 0)) Ha.add(o)
        else if ((v & Be) !== 0) {
          var h = o
          ;(He == null || He.delete(h),
            (v & Mr) === 0 &&
              (v & _t && (ue === null || (ue.f & qa) === 0) && (o.f |= Mr), Bn(h, Et, r)))
        } else if (d) {
          var _ = o
          ;((v & St) !== 0 && wt !== null && wt.add(_), r !== null ? r.push(_) : Ls(_))
        }
      }
    }
}
function Le(e) {
  if (typeof e != 'object' || e === null || Wt in e) return e
  const t = Ts(e)
  if (t !== jl && t !== ql) return e
  var r = new Map(),
    a = As(e),
    s = re(0),
    l = Sr,
    i = o => {
      if (Sr === l) return o()
      var v = he,
        d = Sr
      ;(mt(null), tn(l))
      var h = o()
      return (mt(v), tn(d), h)
    }
  return (
    a && r.set('length', re(e.length)),
    new Proxy(e, {
      defineProperty(o, v, d) {
        ;(!('value' in d) || d.configurable === !1 || d.enumerable === !1 || d.writable === !1) &&
          ti()
        var h = r.get(v)
        return (
          h === void 0
            ? i(() => {
                var _ = re(d.value)
                return (r.set(v, _), _)
              })
            : L(h, d.value, !0),
          !0
        )
      },
      deleteProperty(o, v) {
        var d = r.get(v)
        if (d === void 0) {
          if (v in o) {
            const h = i(() => re(Re))
            ;(r.set(v, h), ca(s))
          }
        } else (L(d, Re), ca(s))
        return !0
      },
      get(o, v, d) {
        var g
        if (v === Wt) return e
        var h = r.get(v),
          _ = v in o
        if (
          (h === void 0 &&
            (!_ || ((g = Rr(o, v)) != null && g.writable)) &&
            ((h = i(() => {
              var m = Le(_ ? o[v] : Re),
                y = re(m)
              return y
            })),
            r.set(v, h)),
          h !== void 0)
        ) {
          var f = n(h)
          return f === Re ? void 0 : f
        }
        return Reflect.get(o, v, d)
      },
      getOwnPropertyDescriptor(o, v) {
        var d = Reflect.getOwnPropertyDescriptor(o, v)
        if (d && 'value' in d) {
          var h = r.get(v)
          h && (d.value = n(h))
        } else if (d === void 0) {
          var _ = r.get(v),
            f = _ == null ? void 0 : _.v
          if (_ !== void 0 && f !== Re)
            return { enumerable: !0, configurable: !0, value: f, writable: !0 }
        }
        return d
      },
      has(o, v) {
        var f
        if (v === Wt) return !0
        var d = r.get(v),
          h = (d !== void 0 && d.v !== Re) || Reflect.has(o, v)
        if (d !== void 0 || (ue !== null && (!h || ((f = Rr(o, v)) != null && f.writable)))) {
          d === void 0 &&
            ((d = i(() => {
              var g = h ? Le(o[v]) : Re,
                m = re(g)
              return m
            })),
            r.set(v, d))
          var _ = n(d)
          if (_ === Re) return !1
        }
        return h
      },
      set(o, v, d, h) {
        var x
        var _ = r.get(v),
          f = v in o
        if (a && v === 'length')
          for (var g = d; g < _.v; g += 1) {
            var m = r.get(g + '')
            m !== void 0 ? L(m, Re) : g in o && ((m = i(() => re(Re))), r.set(g + '', m))
          }
        if (_ === void 0)
          (!f || ((x = Rr(o, v)) != null && x.writable)) &&
            ((_ = i(() => re(void 0))), L(_, Le(d)), r.set(v, _))
        else {
          f = _.v !== Re
          var y = i(() => Le(d))
          L(_, y)
        }
        var w = Reflect.getOwnPropertyDescriptor(o, v)
        if ((w != null && w.set && w.set.call(h, d), !f)) {
          if (a && typeof v == 'string') {
            var O = r.get('length'),
              H = Number(v)
            Number.isInteger(H) && H >= O.v && L(O, H + 1)
          }
          ca(s)
        }
        return !0
      },
      ownKeys(o) {
        n(s)
        var v = Reflect.ownKeys(o).filter(_ => {
          var f = r.get(_)
          return f === void 0 || f.v !== Re
        })
        for (var [d, h] of r) h.v !== Re && !(d in o) && v.push(d)
        return v
      },
      setPrototypeOf() {
        ri()
      },
    })
  )
}
function Qs(e) {
  try {
    if (e !== null && typeof e == 'object' && Wt in e) return e[Wt]
  } catch {}
  return e
}
function Wi(e, t) {
  return Object.is(Qs(e), Qs(t))
}
var ys, Hn, Un, Gn
function Ki() {
  if (ys === void 0) {
    ;((ys = window), (Hn = /Firefox/.test(navigator.userAgent)))
    var e = Element.prototype,
      t = Node.prototype,
      r = Text.prototype
    ;((Un = Rr(t, 'firstChild').get),
      (Gn = Rr(t, 'nextSibling').get),
      Ys(e) && ((e[cs] = void 0), (e[Ca] = null), (e[us] = void 0), (e.__e = void 0)),
      Ys(r) && (r[sa] = void 0))
  }
}
function Kt(e = '') {
  return document.createTextNode(e)
}
function It(e) {
  return Un.call(e)
}
function Pa(e) {
  return Gn.call(e)
}
function u(e, t) {
  return It(e)
}
function ee(e, t = !1) {
  {
    var r = It(e)
    return r instanceof Comment && r.data === '' ? Pa(r) : r
  }
}
function c(e, t = 1, r = !1) {
  let a = e
  for (; t--;) a = Pa(a)
  return a
}
function Vi(e) {
  e.textContent = ''
}
function Wn() {
  return !1
}
function Kn(e, t, r) {
  return t == null || t === Pn
    ? r
      ? document.createElement(e, { is: r })
      : document.createElement(e)
    : r
      ? document.createElementNS(t, e, { is: r })
      : document.createElementNS(t, e)
}
function Vn(e) {
  ;(ue === null && (he === null && Zl(), Xl()), Yt && Jl())
}
function Yi(e, t) {
  var r = t.last
  r === null ? (t.last = t.first = e) : ((r.next = e), (e.prev = r), (t.last = e))
}
function Rt(e, t) {
  var r = ue
  r !== null && (r.f & Xe) !== 0 && (e |= Xe)
  var a = {
    ctx: ze,
    deps: null,
    nodes: null,
    f: e | De | _t,
    first: null,
    fn: t,
    last: null,
    next: null,
    parent: r,
    b: r && r.b,
    prev: null,
    teardown: null,
    wv: 0,
    ac: null,
  }
  se == null || se.register_created_effect(a)
  var s = a
  if ((e & Wr) !== 0) Lr !== null ? Lr.push(a) : zr.ensure().schedule(a)
  else if (t !== null) {
    try {
      Jr(a)
    } catch (i) {
      throw (st(a), i)
    }
    s.deps === null &&
      s.teardown === null &&
      s.nodes === null &&
      s.first === s.last &&
      (s.f & Zr) === 0 &&
      ((s = s.first), (e & St) !== 0 && (e & Er) !== 0 && s !== null && (s.f |= Er))
  }
  if (
    s !== null &&
    ((s.parent = r), r !== null && Yi(s, r), he !== null && (he.f & Be) !== 0 && (e & Vt) === 0)
  ) {
    var l = he
    ;(l.effects ?? (l.effects = [])).push(s)
  }
  return a
}
function Fs() {
  return he !== null && !Pt
}
function Rs(e) {
  const t = Rt(xa, null)
  return (Oe(t, Ne), (t.teardown = e), t)
}
function Lt(e) {
  Vn()
  var t = ue.f,
    r = !he && (t & gt) !== 0 && ze !== null && !ze.i
  if (r) {
    var a = ze
    ;(a.e ?? (a.e = [])).push(e)
  } else return Yn(e)
}
function Yn(e) {
  return Rt(Wr | kn, e)
}
function Ji(e) {
  return (Vn(), Rt(xa | kn, e))
}
function Xi(e) {
  zr.ensure()
  const t = Rt(Vt | Zr, e)
  return (r = {}) =>
    new Promise(a => {
      r.outro
        ? kr(t, () => {
            ;(st(t), a(void 0))
          })
        : (st(t), a(void 0))
    })
}
function Jn(e) {
  return Rt(Wr, e)
}
function Zi(e) {
  return Rt(Nr | Zr, e)
}
function Ns(e, t = 0) {
  return Rt(xa | t, e)
}
function F(e, t = [], r = [], a = []) {
  Li(a, t, r, s => {
    Rt(xa, () => {
      e(...s.map(n))
    })
  })
}
function Ya(e, t = 0) {
  var r = Rt(St | t, e)
  return r
}
function ht(e) {
  return Rt(gt | Zr, e)
}
function Xn(e) {
  var t = e.teardown
  if (t !== null) {
    const r = Yt,
      a = he
    ;(en(!0), mt(null))
    try {
      t.call(null)
    } finally {
      ;(en(r), mt(a))
    }
  }
}
function Ds(e, t = !1) {
  var r = e.first
  for (e.first = e.last = null; r !== null;) {
    const s = r.ac
    s !== null &&
      ea(() => {
        s.abort(ka)
      })
    var a = r.next
    ;((r.f & Vt) !== 0 ? (r.parent = null) : st(r, t), (r = a))
  }
}
function Qi(e) {
  for (var t = e.first; t !== null;) {
    var r = t.next
    ;((t.f & gt) === 0 && st(t), (t = r))
  }
}
function st(e, t = !0) {
  var r = !1
  ;((t || (e.f & Hl) !== 0) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (Zn(e.nodes.start, e.nodes.end), (r = !0)),
    (e.f |= ds),
    Ds(e, t && !r),
    ha(e, 0))
  var a = e.nodes && e.nodes.t
  if (a !== null) for (const l of a) l.stop()
  ;(Xn(e), (e.f ^= ds), (e.f |= vt))
  var s = e.parent
  ;(s !== null && s.first !== null && Qn(e),
    (e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null))
}
function Zn(e, t) {
  for (; e !== null;) {
    var r = e === t ? null : Pa(e)
    ;(e.remove(), (e = r))
  }
}
function Qn(e) {
  var t = e.parent,
    r = e.prev,
    a = e.next
  ;(r !== null && (r.next = a),
    a !== null && (a.prev = r),
    t !== null && (t.first === e && (t.first = a), t.last === e && (t.last = r)))
}
function kr(e, t, r = !0) {
  var a = []
  el(e, a, !0)
  var s = () => {
      ;(r && st(e), t && t())
    },
    l = a.length
  if (l > 0) {
    var i = () => --l || s()
    for (var o of a) o.out(i)
  } else s()
}
function el(e, t, r) {
  if ((e.f & Xe) === 0) {
    e.f ^= Xe
    var a = e.nodes && e.nodes.t
    if (a !== null) for (const o of a) (o.is_global || r) && t.push(o)
    for (var s = e.first; s !== null;) {
      var l = s.next
      if ((s.f & Vt) === 0) {
        var i = (s.f & Er) !== 0 || ((s.f & gt) !== 0 && (e.f & St) !== 0)
        el(s, t, i ? r : !1)
      }
      s = l
    }
  }
}
function Ua(e) {
  tl(e, !0)
}
function tl(e, t) {
  if ((e.f & Xe) !== 0) {
    ;((e.f ^= Xe), (e.f & Ne) === 0 && (Oe(e, De), zr.ensure().schedule(e)))
    for (var r = e.first; r !== null;) {
      var a = r.next,
        s = (r.f & Er) !== 0 || (r.f & gt) !== 0
      ;(tl(r, s ? t : !1), (r = a))
    }
    var l = e.nodes && e.nodes.t
    if (l !== null) for (const i of l) (i.is_global || t) && i.in()
  }
}
function js(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, a = e.nodes.end; r !== null;) {
      var s = r === a ? null : Pa(r)
      ;(t.append(r), (r = s))
    }
}
let Ra = !1,
  Yt = !1
function en(e) {
  Yt = e
}
let he = null,
  Pt = !1
function mt(e) {
  he = e
}
let ue = null
function Ft(e) {
  ue = e
}
let Ot = null
function rl(e) {
  he !== null && (Ot ?? (Ot = new Set())).add(e)
}
let at = null,
  nt = 0,
  ct = null
function eo(e) {
  ct = e
}
let al = 1,
  pr = 0,
  Sr = pr
function tn(e) {
  Sr = e
}
function sl() {
  return ++al
}
function Ea(e) {
  var t = e.f
  if ((t & De) !== 0) return !0
  if ((t & Be && (e.f &= ~Mr), (t & Et) !== 0)) {
    for (var r = e.deps, a = r.length, s = 0; s < a; s++) {
      var l = r[s]
      if ((Ea(l) && On(l), l.wv > e.wv)) return !0
    }
    ;(t & _t) !== 0 && He === null && Oe(e, Ne)
  }
  return !1
}
function nl(e, t, r = !0) {
  var a = e.reactions
  if (a !== null && !(Ot !== null && Ot.has(e)))
    for (var s = 0; s < a.length; s++) {
      var l = a[s]
      ;(l.f & Be) !== 0
        ? nl(l, t, !1)
        : t === l && (r ? Oe(l, De) : (l.f & Ne) !== 0 && Oe(l, Et), Ls(l))
    }
}
function ll(e) {
  var y
  var t = at,
    r = nt,
    a = ct,
    s = he,
    l = Ot,
    i = ze,
    o = Pt,
    v = Sr,
    d = e.f
  ;((at = null),
    (nt = 0),
    (ct = null),
    (he = (d & (gt | Vt)) === 0 ? e : null),
    (Ot = null),
    Kr(e.ctx),
    (Pt = !1),
    (Sr = ++pr),
    e.ac !== null &&
      (ea(() => {
        e.ac.abort(ka)
      }),
      (e.ac = null)))
  try {
    e.f |= qa
    var h = e.fn,
      _ = h()
    e.f |= Xr
    var f = e.deps,
      g = se == null ? void 0 : se.is_fork
    if (at !== null) {
      var m
      if ((g || ha(e, nt), f !== null && nt > 0))
        for (f.length = nt + at.length, m = 0; m < at.length; m++) f[nt + m] = at[m]
      else e.deps = f = at
      if (Fs() && (e.f & _t) !== 0)
        for (m = nt; m < f.length; m++) ((y = f[m]).reactions ?? (y.reactions = [])).push(e)
    } else !g && f !== null && nt < f.length && (ha(e, nt), (f.length = nt))
    if (Sa() && ct !== null && !Pt && f !== null && (e.f & (Be | Et | De)) === 0)
      for (m = 0; m < ct.length; m++) nl(ct[m], e)
    if (s !== null && s !== e) {
      if ((pr++, s.deps !== null)) for (let w = 0; w < r; w += 1) s.deps[w].rv = pr
      if (t !== null) for (const w of t) w.rv = pr
      ct !== null && (a === null ? (a = ct) : a.push(...ct))
    }
    return ((e.f & ir) !== 0 && (e.f ^= ir), _)
  } catch (w) {
    return An(w)
  } finally {
    ;((e.f ^= qa), (at = t), (nt = r), (ct = a), (he = s), (Ot = l), Kr(i), (Pt = o), (Sr = v))
  }
}
function to(e, t) {
  let r = t.reactions
  if (r !== null) {
    var a = Nl.call(r, e)
    if (a !== -1) {
      var s = r.length - 1
      s === 0 ? (r = t.reactions = null) : ((r[a] = r[s]), r.pop())
    }
  }
  if (r === null && (t.f & Be) !== 0 && (at === null || !Da.call(at, t))) {
    var l = t
    ;((l.f & _t) !== 0 && ((l.f ^= _t), (l.f &= ~Mr)),
      l.v !== Re && $s(l),
      l.ac !== null &&
        ea(() => {
          ;(l.ac.abort(ka), (l.ac = null))
        }),
      Di(l),
      ha(l, 0))
  }
}
function ha(e, t) {
  var r = e.deps
  if (r !== null) for (var a = t; a < r.length; a++) to(e, r[a])
}
function Jr(e) {
  var t = e.f
  if ((t & vt) === 0) {
    Oe(e, Ne)
    var r = ue,
      a = Ra
    ;((ue = e), (Ra = (t & (gt | Vt)) === 0))
    try {
      ;((t & (St | xn)) !== 0 ? Qi(e) : Ds(e), Xn(e))
      var s = ll(e)
      ;((e.teardown = typeof s == 'function' ? s : null), (e.wv = al))
      var l
      mn && xi && (e.f & De) !== 0 && e.deps
    } finally {
      ;((Ra = a), (ue = r))
    }
  }
}
async function ro() {
  ;(await Promise.resolve(), Bi())
}
function n(e) {
  var t = e.f,
    r = (t & Be) !== 0
  if (he !== null && !Pt) {
    var a = ue !== null && (ue.f & vt) !== 0
    if (!a && (Ot === null || !Ot.has(e))) {
      var s = he.deps
      if ((he.f & qa) !== 0)
        e.rv < pr &&
          ((e.rv = pr),
          at === null && s !== null && s[nt] === e ? nt++ : at === null ? (at = [e]) : at.push(e))
      else {
        ;(he.deps ?? (he.deps = []), Da.call(he.deps, e) || he.deps.push(e))
        var l = e.reactions
        l === null ? (e.reactions = [he]) : Da.call(l, he) || l.push(he)
      }
    }
  }
  if (Yt && xr.has(e)) return xr.get(e)
  if (r) {
    var i = e
    if (Yt) {
      var o = i.v
      return ((((i.f & Ne) === 0 && i.reactions !== null) || ol(i)) && (o = Is(i)), xr.set(i, o), o)
    }
    var v = (i.f & _t) === 0 && !Pt && he !== null && (Ra || (he.f & _t) !== 0),
      d = (i.f & Xr) === 0
    ;(Ea(i) && (v && (i.f |= _t), On(i)), v && !d && (Ln(i), il(i)))
  }
  if (He != null && He.has(e)) return He.get(e)
  if ((e.f & ir) !== 0) throw e.v
  return e.v
}
function il(e) {
  if (((e.f |= _t), e.deps !== null))
    for (const t of e.deps)
      ((t.reactions ?? (t.reactions = [])).push(e),
        (t.f & Be) !== 0 && (t.f & _t) === 0 && (Ln(t), il(t)))
}
function ol(e) {
  if (e.v === Re) return !0
  if (e.deps === null) return !1
  for (const t of e.deps) if (xr.has(t) || ((t.f & Be) !== 0 && ol(t))) return !0
  return !1
}
function ta(e) {
  var t = Pt
  try {
    return ((Pt = !0), e())
  } finally {
    Pt = t
  }
}
function ao(e) {
  if (!(typeof e != 'object' || !e || e instanceof EventTarget)) {
    if (Wt in e) ws(e)
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t]
        typeof r == 'object' && r && Wt in r && ws(r)
      }
  }
}
function ws(e, t = new Set()) {
  if (typeof e == 'object' && e !== null && !(e instanceof EventTarget) && !t.has(e)) {
    ;(t.add(e), e instanceof Date && e.getTime())
    for (let a in e)
      try {
        ws(e[a], t)
      } catch {}
    const r = Ts(e)
    if (
      r !== Object.prototype &&
      r !== Array.prototype &&
      r !== Map.prototype &&
      r !== Set.prototype &&
      r !== Date.prototype
    ) {
      const a = yn(r)
      for (let s in a) {
        const l = a[s].get
        if (l)
          try {
            l.call(e)
          } catch {}
      }
    }
  }
}
const so = ['touchstart', 'touchmove']
function no(e) {
  return so.includes(e)
}
const hr = Symbol('events'),
  vl = new Set(),
  bs = new Set()
function lo(e, t, r, a = {}) {
  function s(l) {
    if ((a.capture || xs.call(t, l), !l.cancelBubble))
      return ea(() => (r == null ? void 0 : r.call(this, l)))
  }
  return (
    e.startsWith('pointer') || e.startsWith('touch') || e === 'wheel'
      ? or(() => {
          t.addEventListener(e, s, a)
        })
      : t.addEventListener(e, s, a),
    s
  )
}
function Na(e, t, r, a, s) {
  var l = { capture: a, passive: s },
    i = lo(e, t, r, l)
  ;(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) &&
    Rs(() => {
      t.removeEventListener(e, i, l)
    })
}
function oe(e, t, r) {
  ;(t[hr] ?? (t[hr] = {}))[e] = r
}
function Fe(e) {
  for (var t = 0; t < e.length; t++) vl.add(e[t])
  for (var r of bs) r(e)
}
let rn = null
function xs(e) {
  var y, w
  var t = this,
    r = t.ownerDocument,
    a = e.type,
    s = ((y = e.composedPath) == null ? void 0 : y.call(e)) || [],
    l = s[0] || e.target
  rn = e
  var i = 0,
    o = rn === e && e[hr]
  if (o) {
    var v = s.indexOf(o)
    if (v !== -1 && (t === document || t === window)) {
      e[hr] = t
      return
    }
    var d = s.indexOf(t)
    if (d === -1) return
    v <= d && (i = v)
  }
  if (((l = s[i] || e.target), l !== t)) {
    Dl(e, 'currentTarget', {
      configurable: !0,
      get() {
        return l || r
      },
    })
    var h = he,
      _ = ue
    ;(mt(null), Ft(null))
    try {
      for (var f, g = []; l !== null && l !== t;) {
        try {
          var m = (w = l[hr]) == null ? void 0 : w[a]
          m != null && (!l.disabled || e.target === l) && m.call(l, e)
        } catch (O) {
          f ? g.push(O) : (f = O)
        }
        if (e.cancelBubble) break
        ;(i++, (l = i < s.length ? s[i] : null))
      }
      if (f) {
        for (let O of g)
          queueMicrotask(() => {
            throw O
          })
        throw f
      }
    } finally {
      ;((e[hr] = t), delete e.currentTarget, mt(h), Ft(_))
    }
  }
}
var _n
const es =
  ((_n = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : _n.trustedTypes) &&
  globalThis.window.trustedTypes.createPolicy('svelte-trusted-html', { createHTML: e => e })
function io(e) {
  return (es == null ? void 0 : es.createHTML(e)) ?? e
}
function dl(e) {
  var t = Kn('template')
  return ((t.innerHTML = io(e.replaceAll('<!>', '<!---->'))), t.content)
}
function Tr(e, t) {
  var r = ue
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null })
}
function b(e, t) {
  var r = (t & pi) !== 0,
    a = (t & hi) !== 0,
    s,
    l = !e.startsWith('<!>')
  return () => {
    s === void 0 && ((s = dl(l ? e : '<!>' + e)), r || (s = It(s)))
    var i = a || Hn ? document.importNode(s, !0) : s.cloneNode(!0)
    if (r) {
      var o = It(i),
        v = i.lastChild
      Tr(o, v)
    } else Tr(i, i)
    return i
  }
}
function oo(e, t, r = 'svg') {
  var a = !e.startsWith('<!>'),
    s = `<${r}>${a ? e : '<!>' + e}</${r}>`,
    l
  return () => {
    if (!l) {
      var i = dl(s),
        o = It(i)
      l = It(o)
    }
    var v = l.cloneNode(!0)
    return (Tr(v, v), v)
  }
}
function qs(e, t) {
  return oo(e, t, 'svg')
}
function Q(e = '') {
  {
    var t = Kt(e + '')
    return (Tr(t, t), t)
  }
}
function Ze() {
  var e = document.createDocumentFragment(),
    t = document.createComment(''),
    r = Kt()
  return (e.append(t, r), Tr(t, r), e)
}
function p(e, t) {
  e !== null && e.before(t)
}
function z(e, t) {
  var r = t == null ? '' : typeof t == 'object' ? `${t}` : t
  r !== (e[sa] ?? (e[sa] = e.nodeValue)) && ((e[sa] = r), (e.nodeValue = `${r}`))
}
function vo(e, t) {
  return co(e, t)
}
const Aa = new Map()
function co(
  e,
  { target: t, anchor: r, props: a = {}, events: s, context: l, intro: i = !0, transformError: o }
) {
  Ki()
  var v = void 0,
    d = Xi(() => {
      var h = r ?? t.appendChild(Kt())
      Ti(
        h,
        { pending: () => {} },
        g => {
          fe({})
          var m = ze
          ;(l && (m.c = l), s && (a.$$events = s), (v = e(g, a) || {}), pe())
        },
        o
      )
      var _ = new Set(),
        f = g => {
          for (var m = 0; m < g.length; m++) {
            var y = g[m]
            if (!_.has(y)) {
              _.add(y)
              var w = no(y)
              for (const x of [t, document]) {
                var O = Aa.get(x)
                O === void 0 && ((O = new Map()), Aa.set(x, O))
                var H = O.get(y)
                H === void 0
                  ? (x.addEventListener(y, xs, { passive: w }), O.set(y, 1))
                  : O.set(y, H + 1)
              }
            }
          }
        }
      return (
        f(Va(vl)),
        bs.add(f),
        () => {
          var w
          for (var g of _)
            for (const O of [t, document]) {
              var m = Aa.get(O),
                y = m.get(g)
              --y == 0
                ? (O.removeEventListener(g, xs), m.delete(g), m.size === 0 && Aa.delete(O))
                : m.set(g, y)
            }
          ;(bs.delete(f), h !== r && ((w = h.parentNode) == null || w.removeChild(h)))
        }
      )
    })
  return (uo.set(v, d), v)
}
let uo = new WeakMap()
var xt, $t, it, br, wa, ba, Ka
class cl {
  constructor(t, r = !0) {
    Ve(this, 'anchor')
    de(this, xt, new Map())
    de(this, $t, new Map())
    de(this, it, new Map())
    de(this, br, new Set())
    de(this, wa, !0)
    de(this, ba, t => {
      if (S(this, xt).has(t)) {
        var r = S(this, xt).get(t),
          a = S(this, $t).get(r)
        if (a) (Ua(a), S(this, br).delete(r))
        else {
          var s = S(this, it).get(r)
          s &&
            (Ua(s.effect),
            S(this, $t).set(r, s.effect),
            S(this, it).delete(r),
            s.fragment.lastChild.remove(),
            this.anchor.before(s.fragment),
            (a = s.effect))
        }
        for (const [l, i] of S(this, xt)) {
          if ((S(this, xt).delete(l), l === t)) break
          const o = S(this, it).get(i)
          o && (st(o.effect), S(this, it).delete(i))
        }
        for (const [l, i] of S(this, $t)) {
          if (l === r || S(this, br).has(l)) continue
          const o = () => {
            if (Array.from(S(this, xt).values()).includes(l)) {
              var d = document.createDocumentFragment()
              ;(js(i, d), d.append(Kt()), S(this, it).set(l, { effect: i, fragment: d }))
            } else st(i)
            ;(S(this, br).delete(l), S(this, $t).delete(l))
          }
          S(this, wa) || !a ? (S(this, br).add(l), kr(i, o, !1)) : o()
        }
      }
    })
    de(this, Ka, t => {
      S(this, xt).delete(t)
      const r = Array.from(S(this, xt).values())
      for (const [a, s] of S(this, it)) r.includes(a) || (st(s.effect), S(this, it).delete(a))
    })
    ;((this.anchor = t), ve(this, wa, r))
  }
  ensure(t, r) {
    var a = se,
      s = Wn()
    if (r && !S(this, $t).has(t) && !S(this, it).has(t))
      if (s) {
        var l = document.createDocumentFragment(),
          i = Kt()
        ;(l.append(i), S(this, it).set(t, { effect: ht(() => r(i)), fragment: l }))
      } else
        S(this, $t).set(
          t,
          ht(() => r(this.anchor))
        )
    if ((S(this, xt).set(a, t), s)) {
      for (const [o, v] of S(this, $t)) o === t ? a.unskip_effect(v) : a.skip_effect(v)
      for (const [o, v] of S(this, it))
        o === t ? a.unskip_effect(v.effect) : a.skip_effect(v.effect)
      ;(a.oncommit(S(this, ba)), a.ondiscard(S(this, Ka)))
    } else S(this, ba).call(this, a)
  }
}
;((xt = new WeakMap()),
  ($t = new WeakMap()),
  (it = new WeakMap()),
  (br = new WeakMap()),
  (wa = new WeakMap()),
  (ba = new WeakMap()),
  (Ka = new WeakMap()))
function q(e, t, r = !1) {
  var a = new cl(e),
    s = r ? Er : 0
  function l(i, o) {
    a.ensure(i, o)
  }
  Ya(() => {
    var i = !1
    ;(t((o, v = 0) => {
      ;((i = !0), l(v, o))
    }),
      i || l(-1, null))
  }, s)
}
function vr(e, t) {
  return t
}
function fo(e, t, r) {
  for (var a = [], s = t.length, l, i = t.length, o = 0; o < s; o++) {
    let _ = t[o]
    kr(
      _,
      () => {
        if (l) {
          if ((l.pending.delete(_), l.done.add(_), l.pending.size === 0)) {
            var f = e.outrogroups
            ;(ks(e, Va(l.done)), f.delete(l), f.size === 0 && (e.outrogroups = null))
          }
        } else i -= 1
      },
      !1
    )
  }
  if (i === 0) {
    var v = a.length === 0 && r !== null
    if (v) {
      var d = r,
        h = d.parentNode
      ;(Vi(h), h.append(d), e.items.clear())
    }
    ks(e, t, !v)
  } else
    ((l = { pending: new Set(t), done: new Set() }),
      (e.outrogroups ?? (e.outrogroups = new Set())).add(l))
}
function ks(e, t, r = !0) {
  var a
  if (e.pending.size > 0) {
    a = new Set()
    for (const i of e.pending.values()) for (const o of i) a.add(e.items.get(o).e)
  }
  for (var s = 0; s < t.length; s++) {
    var l = t[s]
    if (a != null && a.has(l)) {
      l.f |= Ct
      const i = document.createDocumentFragment()
      js(l, i)
    } else st(t[s], r)
  }
}
var an
function ke(e, t, r, a, s, l = null) {
  var i = e,
    o = new Map(),
    v = (t & Sn) !== 0
  if (v) {
    var d = e
    i = d.appendChild(Kt())
  }
  var h = null,
    _ = Cs(() => {
      var x = r()
      return As(x) ? x : x == null ? [] : Va(x)
    }),
    f,
    g = new Map(),
    m = !0
  function y(x) {
    ;(H.effect.f & vt) === 0 &&
      (H.pending.delete(x),
      (H.fallback = h),
      po(H, f, i, t, a),
      h !== null &&
        (f.length === 0
          ? (h.f & Ct) === 0
            ? Ua(h)
            : ((h.f ^= Ct), oa(h, null, i))
          : kr(h, () => {
              h = null
            })))
  }
  function w(x) {
    H.pending.delete(x)
  }
  var O = Ya(() => {
      f = n(_)
      for (var x = f.length, M = new Set(), T = se, D = Wn(), E = 0; E < x; E += 1) {
        var N = f[E],
          W = a(N, E),
          I = m ? null : o.get(W)
        ;(I
          ? (I.v && Yr(I.v, N), I.i && Yr(I.i, E), D && T.unskip_effect(I.e))
          : ((I = ho(o, m ? i : (an ?? (an = Kt())), N, W, E, s, t, r)),
            m || (I.e.f |= Ct),
            o.set(W, I)),
          M.add(W))
      }
      if (
        (x === 0 &&
          l &&
          !h &&
          (m ? (h = ht(() => l(i))) : ((h = ht(() => l(an ?? (an = Kt())))), (h.f |= Ct))),
        x > M.size && Yl(),
        !m)
      )
        if ((g.set(T, M), D)) {
          for (const [P, A] of o) M.has(P) || T.skip_effect(A.e)
          ;(T.oncommit(y), T.ondiscard(w))
        } else y(T)
      n(_)
    }),
    H = { effect: O, items: o, pending: g, outrogroups: null, fallback: h }
  m = !1
}
function ra(e) {
  for (; e !== null && (e.f & gt) === 0;) e = e.next
  return e
}
function po(e, t, r, a, s) {
  var I, P, A, k, j, $, U, C, G
  var l = (a & ii) !== 0,
    i = t.length,
    o = e.items,
    v = ra(e.effect.first),
    d,
    h = null,
    _,
    f = [],
    g = [],
    m,
    y,
    w,
    O
  if (l)
    for (O = 0; O < i; O += 1)
      ((m = t[O]),
        (y = s(m, O)),
        (w = o.get(y).e),
        (w.f & Ct) === 0 &&
          ((P = (I = w.nodes) == null ? void 0 : I.a) == null || P.measure(),
          (_ ?? (_ = new Set())).add(w)))
  for (O = 0; O < i; O += 1) {
    if (((m = t[O]), (y = s(m, O)), (w = o.get(y).e), e.outrogroups !== null))
      for (const B of e.outrogroups) (B.pending.delete(w), B.done.delete(w))
    if (
      ((w.f & Xe) !== 0 &&
        (Ua(w),
        l &&
          ((k = (A = w.nodes) == null ? void 0 : A.a) == null || k.unfix(),
          (_ ?? (_ = new Set())).delete(w))),
      (w.f & Ct) !== 0)
    )
      if (((w.f ^= Ct), w === v)) oa(w, null, r)
      else {
        var H = h ? h.next : v
        ;(w === e.effect.last && (e.effect.last = w.prev),
          w.prev && (w.prev.next = w.next),
          w.next && (w.next.prev = w.prev),
          Zt(e, h, w),
          Zt(e, w, H),
          oa(w, H, r),
          (h = w),
          (f = []),
          (g = []),
          (v = ra(h.next)))
        continue
      }
    if (w !== v) {
      if (d !== void 0 && d.has(w)) {
        if (f.length < g.length) {
          var x = g[0],
            M
          h = x.prev
          var T = f[0],
            D = f[f.length - 1]
          for (M = 0; M < f.length; M += 1) oa(f[M], x, r)
          for (M = 0; M < g.length; M += 1) d.delete(g[M])
          ;(Zt(e, T.prev, D.next),
            Zt(e, h, T),
            Zt(e, D, x),
            (v = x),
            (h = D),
            (O -= 1),
            (f = []),
            (g = []))
        } else
          (d.delete(w),
            oa(w, v, r),
            Zt(e, w.prev, w.next),
            Zt(e, w, h === null ? e.effect.first : h.next),
            Zt(e, h, w),
            (h = w))
        continue
      }
      for (f = [], g = []; v !== null && v !== w;)
        ((d ?? (d = new Set())).add(v), g.push(v), (v = ra(v.next)))
      if (v === null) continue
    }
    ;((w.f & Ct) === 0 && f.push(w), (h = w), (v = ra(w.next)))
  }
  if (e.outrogroups !== null) {
    for (const B of e.outrogroups)
      B.pending.size === 0 && (ks(e, Va(B.done)), (j = e.outrogroups) == null || j.delete(B))
    e.outrogroups.size === 0 && (e.outrogroups = null)
  }
  if (v !== null || d !== void 0) {
    var E = []
    if (d !== void 0) for (w of d) (w.f & Xe) === 0 && E.push(w)
    for (; v !== null;) ((v.f & Xe) === 0 && v !== e.fallback && E.push(v), (v = ra(v.next)))
    var N = E.length
    if (N > 0) {
      var W = (a & Sn) !== 0 && i === 0 ? r : null
      if (l) {
        for (O = 0; O < N; O += 1)
          (U = ($ = E[O].nodes) == null ? void 0 : $.a) == null || U.measure()
        for (O = 0; O < N; O += 1) (G = (C = E[O].nodes) == null ? void 0 : C.a) == null || G.fix()
      }
      fo(e, E, W)
    }
  }
  l &&
    or(() => {
      var B, R
      if (_ !== void 0) for (w of _) (R = (B = w.nodes) == null ? void 0 : B.a) == null || R.apply()
    })
}
function ho(e, t, r, a, s, l, i, o) {
  var v = (i & ni) !== 0 ? ((i & oi) === 0 ? Ui(r, !1, !1) : Ar(r)) : null,
    d = (i & li) !== 0 ? Ar(s) : null
  return {
    v,
    i: d,
    e: ht(
      () => (
        l(t, v ?? r, d ?? s, o),
        () => {
          e.delete(a)
        }
      )
    ),
  }
}
function oa(e, t, r) {
  if (e.nodes)
    for (
      var a = e.nodes.start, s = e.nodes.end, l = t && (t.f & Ct) === 0 ? t.nodes.start : r;
      a !== null;
    ) {
      var i = Pa(a)
      if ((l.before(a), a === s)) return
      a = i
    }
}
function Zt(e, t, r) {
  ;(t === null ? (e.effect.first = r) : (t.next = r),
    r === null ? (e.effect.last = t) : (r.prev = t))
}
function _o(e, t, r = !1, a = !1, s = !1, l = !1) {
  var i = e,
    o = ''
  if (r) var v = e
  F(() => {
    var d = ue
    if (o !== (o = t() ?? '')) {
      if (r) {
        ;((d.nodes = null), (v.innerHTML = o), o !== '' && Tr(It(v), v.lastChild))
        return
      }
      if ((d.nodes !== null && (Zn(d.nodes.start, d.nodes.end), (d.nodes = null)), o !== '')) {
        var h = a ? _i : s ? gi : void 0,
          _ = Kn(a ? 'svg' : s ? 'math' : 'template', h)
        _.innerHTML = o
        var f = a || s ? _ : _.content
        if ((Tr(It(f), f.lastChild), a || s)) for (; It(f);) i.before(It(f))
        else i.before(f)
      }
    }
  })
}
function Cr(e, t, ...r) {
  var a = new cl(e)
  Ya(() => {
    const s = t() ?? null
    a.ensure(s, s && (l => s(l, ...r)))
  }, Er)
}
const sn = [
  ...` 	
\r\f \v\uFEFF`,
]
function go(e, t, r) {
  var a = e == null ? '' : '' + e
  if ((t && (a = a ? a + ' ' + t : t), r)) {
    for (var s of Object.keys(r))
      if (r[s]) a = a ? a + ' ' + s : s
      else if (a.length)
        for (var l = s.length, i = 0; (i = a.indexOf(s, i)) >= 0;) {
          var o = i + l
          ;(i === 0 || sn.includes(a[i - 1])) && (o === a.length || sn.includes(a[o]))
            ? (a = (i === 0 ? '' : a.substring(0, i)) + a.substring(o + 1))
            : (i = o)
        }
  }
  return a === '' ? null : a
}
function nn(e, t = !1) {
  var r = t ? ' !important;' : ';',
    a = ''
  for (var s of Object.keys(e)) {
    var l = e[s]
    l != null && l !== '' && (a += ' ' + s + ': ' + l + r)
  }
  return a
}
function ts(e) {
  return e[0] !== '-' || e[1] !== '-' ? e.toLowerCase() : e
}
function mo(e, t) {
  if (t) {
    var r = '',
      a,
      s
    if ((Array.isArray(t) ? ((a = t[0]), (s = t[1])) : (a = t), e)) {
      e = String(e)
        .replaceAll(/\s*\/\*.*?\*\/\s*/g, '')
        .trim()
      var l = !1,
        i = 0,
        o = !1,
        v = []
      ;(a && v.push(...Object.keys(a).map(ts)), s && v.push(...Object.keys(s).map(ts)))
      var d = 0,
        h = -1
      const y = e.length
      for (var _ = 0; _ < y; _++) {
        var f = e[_]
        if (
          (o
            ? f === '/' && e[_ - 1] === '*' && (o = !1)
            : l
              ? l === f && (l = !1)
              : f === '/' && e[_ + 1] === '*'
                ? (o = !0)
                : f === '"' || f === "'"
                  ? (l = f)
                  : f === '('
                    ? i++
                    : f === ')' && i--,
          !o && l === !1 && i === 0)
        ) {
          if (f === ':' && h === -1) h = _
          else if (f === ';' || _ === y - 1) {
            if (h !== -1) {
              var g = ts(e.substring(d, h).trim())
              if (!v.includes(g)) {
                f !== ';' && _++
                var m = e.substring(d, _).trim()
                r += ' ' + m + ';'
              }
            }
            ;((d = _ + 1), (h = -1))
          }
        }
      }
    }
    return (a && (r += nn(a)), s && (r += nn(s, !0)), (r = r.trim()), r === '' ? null : r)
  }
  return e == null ? null : String(e)
}
function $e(e, t, r, a, s, l) {
  var i = e[cs]
  if (i !== r || i === void 0) {
    var o = go(r, a, l)
    ;(o == null ? e.removeAttribute('class') : (e.className = o), (e[cs] = r))
  } else if (l && s !== l)
    for (var v in l) {
      var d = !!l[v]
      ;(s == null || d !== !!s[v]) && e.classList.toggle(v, d)
    }
  return l
}
function rs(e, t = {}, r, a) {
  for (var s in r) {
    var l = r[s]
    t[s] !== l && (r[s] == null ? e.style.removeProperty(s) : e.style.setProperty(s, l, a))
  }
}
function qe(e, t, r, a) {
  var s = e[us]
  if (s !== t) {
    var l = mo(t, a)
    ;(l == null ? e.removeAttribute('style') : (e.style.cssText = l), (e[us] = t))
  } else
    a &&
      (Array.isArray(a)
        ? (rs(e, r == null ? void 0 : r[0], a[0]),
          rs(e, r == null ? void 0 : r[1], a[1], 'important'))
        : rs(e, r, a))
  return a
}
function jt(e, t, r = !1) {
  if (e.multiple) {
    if (t == null) return
    if (!As(t)) return yi()
    for (var a of e.options) a.selected = t.includes(ua(a))
    return
  }
  for (a of e.options) {
    var s = ua(a)
    if (Wi(s, t)) {
      a.selected = !0
      return
    }
  }
  ;(!r || t !== void 0) && (e.selectedIndex = -1)
}
function Qt(e) {
  var t = new MutationObserver(() => {
    jt(e, e.__value)
  })
  ;(t.observe(e, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ['value'] }),
    Rs(() => {
      t.disconnect()
    }))
}
function yo(e, t, r = t) {
  var a = new WeakSet(),
    s = !0
  ;(Cn(e, 'change', l => {
    var i = l ? '[selected]' : ':checked',
      o
    if (e.multiple) o = [].map.call(e.querySelectorAll(i), ua)
    else {
      var v = e.querySelector(i) ?? e.querySelector('option:not([disabled])')
      o = v && ua(v)
    }
    ;(r(o), (e.__value = o), se !== null && a.add(se))
  }),
    Jn(() => {
      var l = t()
      if (e === document.activeElement) {
        var i = se
        if (a.has(i)) return
      }
      if ((jt(e, l, s), s && l === void 0)) {
        var o = e.querySelector(':checked')
        o !== null && ((l = ua(o)), r(l))
      }
      ;((e.__value = l), (s = !1))
    }),
    Qt(e))
}
function ua(e) {
  return '__value' in e ? e.__value : e.value
}
const wo = Symbol('is custom element'),
  bo = Symbol('is html'),
  xo = Wl ? 'progress' : 'PROGRESS'
function Bs(e, t) {
  var r = ul(e)
  r.value === (r.value = t ?? void 0) ||
    (e.value === t && (t !== 0 || e.nodeName !== xo)) ||
    (e.value = t ?? '')
}
function be(e, t, r, a) {
  var s = ul(e)
  s[t] !== (s[t] = r) &&
    (t === 'loading' && (e[Gl] = r),
    r == null
      ? e.removeAttribute(t)
      : typeof r != 'string' && ko(e).includes(t)
        ? (e[t] = r)
        : e.setAttribute(t, r))
}
function ul(e) {
  return e[Ca] ?? (e[Ca] = { [wo]: e.nodeName.includes('-'), [bo]: e.namespaceURI === Pn })
}
var ln = new Map()
function ko(e) {
  var t = e.getAttribute('is') || e.nodeName,
    r = ln.get(t)
  if (r) return r
  ln.set(t, (r = []))
  for (var a, s = e, l = Element.prototype; l !== s;) {
    a = yn(s)
    for (var i in a)
      a[i].set && i !== 'innerHTML' && i !== 'textContent' && i !== 'innerText' && r.push(i)
    s = Ts(s)
  }
  return r
}
function Ma(e, t, r = t) {
  var a = new WeakSet()
  ;(Cn(e, 'input', async s => {
    var l = s ? e.defaultValue : e.value
    if (((l = as(e) ? ss(l) : l), r(l), se !== null && a.add(se), await ro(), l !== (l = t()))) {
      var i = e.selectionStart,
        o = e.selectionEnd,
        v = e.value.length
      if (((e.value = l ?? ''), o !== null)) {
        var d = e.value.length
        i === o && o === v && d > v
          ? ((e.selectionStart = d), (e.selectionEnd = d))
          : ((e.selectionStart = i), (e.selectionEnd = Math.min(o, d)))
      }
    }
  }),
    ta(t) == null && e.value && (r(as(e) ? ss(e.value) : e.value), se !== null && a.add(se)),
    Ns(() => {
      var s = t()
      if (e === document.activeElement) {
        var l = se
        if (a.has(l)) return
      }
      ;(as(e) && s === ss(e.value)) ||
        (e.type === 'date' && !s && !e.value) ||
        (s !== e.value && (e.value = s ?? ''))
    }))
}
function as(e) {
  var t = e.type
  return t === 'number' || t === 'range'
}
function ss(e) {
  return e === '' ? null : +e
}
function ns(e, t) {
  return e === t || (e == null ? void 0 : e[Wt]) === t
}
function fl(e = {}, t, r, a) {
  var s = ze.r,
    l = ue
  return (
    Jn(() => {
      var i, o
      return (
        Ns(() => {
          ;((i = o),
            (o = []),
            ta(() => {
              ns(r(...o), e) || (t(e, ...o), i && ns(r(...i), e) && t(null, ...i))
            }))
        }),
        () => {
          let v = l
          for (; v !== s && v.parent !== null && v.parent.f & ds;) v = v.parent
          const d = () => {
              o && ns(r(...o), e) && t(null, ...o)
            },
            h = v.teardown
          v.teardown = () => {
            ;(d(), h == null || h())
          }
        }
      )
    }),
    e
  )
}
function pl(e = !1) {
  const t = ze,
    r = t.l.u
  if (!r) return
  let a = () => ao(t.s)
  if (e) {
    let s = 0,
      l = {}
    const i = Vr(() => {
      let o = !1
      const v = t.s
      for (const d in v) v[d] !== l[d] && ((l[d] = v[d]), (o = !0))
      return (o && s++, s)
    })
    a = () => n(i)
  }
  ;(r.b.length &&
    Ji(() => {
      ;(on(t, a), os(r.b))
    }),
    Lt(() => {
      const s = ta(() => r.m.map(Bl))
      return () => {
        for (const l of s) typeof l == 'function' && l()
      }
    }),
    r.a.length &&
      Lt(() => {
        ;(on(t, a), os(r.a))
      }))
}
function on(e, t) {
  if (e.l.s) for (const r of e.l.s) n(r)
  t()
}
function _e(e, t, r, a) {
  var M
  var s = !Qr || (r & di) !== 0,
    l = (r & ui) !== 0,
    i = (r & fi) !== 0,
    o = a,
    v = !0,
    d = void 0,
    h = () => (i && s ? (d ?? (d = Vr(a)), n(d)) : (v && ((v = !1), (o = i ? ta(a) : a)), o))
  let _
  if (l) {
    var f = Wt in e || Ul in e
    _ = ((M = Rr(e, t)) == null ? void 0 : M.set) ?? (f && t in e ? T => (e[t] = T) : void 0)
  }
  var g,
    m = !1
  ;(l ? ([g, m] = Ei(() => e[t])) : (g = e[t]),
    g === void 0 && a !== void 0 && ((g = h()), _ && (s && ei(), _(g))))
  var y
  if (
    (s
      ? (y = () => {
          var T = e[t]
          return T === void 0 ? h() : ((v = !0), T)
        })
      : (y = () => {
          var T = e[t]
          return (T !== void 0 && (o = void 0), T === void 0 ? o : T)
        }),
    s && (r & ci) === 0)
  )
    return y
  if (_) {
    var w = e.$$legacy
    return function (T, D) {
      return arguments.length > 0 ? ((!s || !D || w || m) && _(D ? y() : T), T) : y()
    }
  }
  var O = !1,
    H = ((r & vi) !== 0 ? Vr : Cs)(() => ((O = !1), y()))
  l && n(H)
  var x = ue
  return function (T, D) {
    if (arguments.length > 0) {
      const E = D ? n(H) : s && l ? Le(T) : T
      return (L(H, E), (O = !0), o !== void 0 && (o = E), T)
    }
    return (Yt && O) || (x.f & vt) !== 0 ? H.v : n(H)
  }
}
function Hs(e) {
  ;(ze === null && Kl(),
    Qr && ze.l !== null
      ? So(ze).m.push(e)
      : Lt(() => {
          const t = ta(e)
          if (typeof t == 'function') return t
        }))
}
function So(e) {
  var t = e.l
  return t.u ?? (t.u = { a: [], b: [], m: [] })
}
const Po = '5'
var gn
typeof window < 'u' &&
  ((gn = window.__svelte ?? (window.__svelte = {})).v ?? (gn.v = new Set())).add(Po)
const Eo = ['dashboard', 'providers', 'models', 'apps', 'server', 'tester', 'settings']
function hl() {
  const e = typeof window < 'u' ? window.location.hash.replace(/^#\/?/, '') : ''
  return Eo.includes(e) ? e : 'dashboard'
}
const kt = Le({ route: hl() })
function ur(e) {
  typeof window < 'u' && (window.location.hash = `/${e}`)
}
function Mo() {
  const e = () => {
    kt.route = hl()
  }
  ;(window.addEventListener('hashchange', e), e())
}
const Mt = Le({ toasts: [], commandOpen: !1, loadingRoutes: new Set() })
let zo = 0
function we(e, t = 'info', r = 4e3) {
  const a = ++zo,
    s = { id: a, message: e, kind: t }
  ;((Mt.toasts = [...Mt.toasts, s]), (s.timeout = setTimeout(() => Ss(a), r)))
}
function Ss(e) {
  const t = Mt.toasts.find(r => r.id === e)
  ;(t != null && t.timeout && clearTimeout(t.timeout),
    (Mt.toasts = Mt.toasts.filter(r => r.id !== e)))
}
function ls() {
  Mt.commandOpen = !0
}
function Ao() {
  Mt.commandOpen = !1
}
function To() {
  Mt.commandOpen = !Mt.commandOpen
}
const $o = {},
  Co = typeof import.meta < 'u' && $o && !1,
  _l = 'anygate-recent-folders'
function gl() {
  try {
    const e = localStorage.getItem(_l)
    return e ? JSON.parse(e) : []
  } catch {
    return []
  }
}
function Io(e) {
  const t = gl().filter(a => a !== e)
  t.unshift(e)
  const r = t.slice(0, 10)
  try {
    localStorage.setItem(_l, JSON.stringify(r))
  } catch {}
  return r
}
function Oo(e) {
  const { provider: t, modelId: r, contextWindow: a } = e,
    s = []
  return (
    s.push({ key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:<proxy-port>' }),
    t &&
      r &&
      (s.push({ key: 'ANTHROPIC_MODEL', value: `${t.id}__${r}` }),
      s.push({ key: 'CLAUDE_CODE_MAX_CONTEXT_TOKENS', value: String(a ?? 2e5) })),
    s.push({ key: 'ANTHROPIC_AUTH_TOKEN', value: '<proxy-local-token>', masked: !0 }),
    s.push({ key: 'CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY', value: '1' }),
    { env: s, command: t && r ? `anygate ${t.id} --model ${r}` : 'anygate <provider>' }
  )
}
class vn extends Error {
  constructor(r, a, s) {
    super(r)
    Ve(this, 'hint')
    Ve(this, 'status')
    ;((this.name = 'ApiError'), (this.status = a), (this.hint = s))
  }
}
async function ml(e, t, r, a) {
  const s = { method: e, headers: {} }
  r !== void 0 && ((s.headers['Content-Type'] = 'application/json'), (s.body = JSON.stringify(r)))
  let l
  try {
    l = await fetch(t, s)
  } catch (v) {
    throw new vn(`Network error: ${String(v)}`, 0)
  }
  const i = await l.text(),
    o = i ? JSON.parse(i) : void 0
  if (!l.ok) {
    const v = o
    throw new vn(
      (v == null ? void 0 : v.error) ?? `Request failed (${l.status})`,
      l.status,
      v == null ? void 0 : v.hint
    )
  }
  return o
}
function cr(e, t) {
  return ml('GET', e, void 0)
}
function Qe(e, t, r) {
  return ml('POST', e, t)
}
function Us() {
  return cr('/api/config')
}
function yl(e) {
  return Qe('/api/config', e)
}
function Lo() {
  return cr('/api/models')
}
function Fo(e) {
  return Qe('/api/models/test', e)
}
function Ro(e, t) {
  return Qe('/api/keys', { providerId: e, key: t })
}
function No(e) {
  return Qe('/api/providers/refresh', { providerId: e })
}
function Do() {
  return Qe('/api/providers/refresh-all')
}
function jo() {
  return cr('/api/providers/templates')
}
function qo(e, t, r) {
  return Qe('/api/providers/add', { templateId: e, key: t, baseUrl: r })
}
function Bo(e) {
  return Qe('/api/providers/add-custom', e)
}
function Ho(e) {
  return Qe('/api/providers/delete', { providerId: e })
}
function Uo(e) {
  return Qe('/api/providers/oauth/start', { providerId: e })
}
function Go(e) {
  return cr(`/api/providers/oauth/status?sessionId=${encodeURIComponent(e)}`)
}
function Wo() {
  return cr('/api/apps')
}
function Ko(e, t) {
  return Qe('/api/apps/path', { appId: e, path: t })
}
function Vo(e) {
  return Qe('/api/apps/launch', e)
}
function Yo() {
  return Qe('/api/apps/browse-folder')
}
function Jo() {
  return cr('/api/server/status')
}
function Xo(e) {
  return Qe('/api/server/start', e)
}
function Zo() {
  return Qe('/api/server/stop')
}
async function Qo() {
  return cr('/api/health')
}
async function ev() {
  return (await cr('/api/presets')).presets ?? []
}
async function tv(e) {
  return Qe('/api/presets', { presets: e })
}
async function rv() {
  const e = await Us()
  return JSON.stringify(
    {
      version: 1,
      favoriteModels: e.favoriteModels,
      antigravityCliFavoriteModels: e.antigravityCliFavoriteModels,
    },
    null,
    2
  )
}
async function av(e) {
  const t = JSON.parse(e)
  if (!Array.isArray(t.favoriteModels) && !Array.isArray(t.antigravityCliFavoriteModels))
    throw new Error('Invalid config file: missing favoriteModels')
  await yl({
    favoriteModels: t.favoriteModels ?? [],
    antigravityCliFavoriteModels: t.antigravityCliFavoriteModels ?? [],
  })
}
function sv(e) {
  return Oo(e)
}
const nv = new Set([
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
  lv = new Set(['openai', 'openai-oauth']),
  iv = new Set(['google', 'vertex'])
function ov(e, t) {
  const r = e.toLowerCase()
  if (r.startsWith('claude') || r.includes('anthropic')) return 'anthropic'
  if (t) {
    const a = t.toLowerCase()
    if (lv.has(a))
      return r.startsWith('gpt') || r.startsWith('o1') || r.startsWith('o3') || r.startsWith('o4')
        ? 'unsupported'
        : 'openai'
    if (nv.has(a)) return 'openai'
    if (iv.has(a)) return r.startsWith('gemini') ? 'unsupported' : 'openai'
  }
  return 'openai'
}
function vv(e) {
  return e.format ? e.format : ov(e.id, e.providerId)
}
function wl(e) {
  if (typeof e.reasoning == 'boolean') return e.reasoning
  const t = e.id.toLowerCase()
  return /(opus|sonnet|o1|o3|o4|gpt-5|deepseek-r(1|2)|qwen3?-(plus|max|pro)|claude-(3-7|4))/.test(t)
}
function dv(e) {
  if (Array.isArray(e.supportedParameters)) return e.supportedParameters
  const t = ['tools', 'system']
  return (wl(e) && t.push('reasoning_effort'), e.isFree || t.push('streaming'), t)
}
function cv(e) {
  return { ...e, format: vv(e), reasoning: wl(e), supportedParameters: dv(e) }
}
function uv(e) {
  const t = new Set(),
    r = e.models.filter(a => (t.has(a.id) ? !1 : (t.add(a.id), !0)))
  return { ...e, enrichedModels: r.map(cv) }
}
const Me = Le({ list: [], loading: !1, error: null })
async function Gs(e) {
  ;((Me.loading = !0), (Me.error = null))
  try {
    const t = await Lo()
    Me.list = t.providers.map(uv)
  } catch (t) {
    Me.error = t instanceof Error ? t.message : String(t)
  } finally {
    Me.loading = !1
  }
}
async function bl(e) {
  try {
    const t = await No(e)
    if (!t.ok) {
      we(t.error ? String(t.error) : 'Refresh failed', 'error')
      return
    }
    ;(await Gs(), we(`Refreshed ${e} (${t.count ?? 0} models)`, 'success'))
  } catch (t) {
    we(t instanceof Error ? t.message : String(t), 'error')
  }
}
async function Ta() {
  try {
    const e = await Do()
    ;(await Gs(), we(`Refreshed all · ${e.total} models`, 'success'))
  } catch (e) {
    we(e instanceof Error ? e.message : String(e), 'error')
  }
}
const fv = 20,
  pv = 6,
  me = Le({ general: [], agy: [], loading: !1, error: null })
async function xl() {
  me.loading = !0
  try {
    const e = await Us()
    ;((me.general = e.favoriteModels ?? []), (me.agy = e.antigravityCliFavoriteModels ?? []))
  } catch (e) {
    me.error = e instanceof Error ? e.message : String(e)
  } finally {
    me.loading = !1
  }
}
async function Ws() {
  await yl({ favoriteModels: me.general, antigravityCliFavoriteModels: me.agy })
}
function kl(e, t, r = !1) {
  return (r ? me.agy : me.general).some(s => s.providerId === e && s.modelId === t)
}
async function Sl(e, t = !1) {
  const r = t ? me.agy : me.general,
    a = t ? pv : fv
  return kl(e.providerId, e.modelId, t)
    ? !0
    : r.length >= a
      ? (we(`Favorite limit reached (${a})`, 'error'), !1)
      : (t ? (me.agy = [...me.agy, e]) : (me.general = [...me.general, e]), await Ws(), !0)
}
async function Ps(e, t, r = !1) {
  ;(r
    ? (me.agy = me.agy.filter(a => !(a.providerId === e && a.modelId === t)))
    : (me.general = me.general.filter(a => !(a.providerId === e && a.modelId === t))),
    await Ws())
}
async function hv(e, t = !1) {
  ;(t ? (me.agy = e) : (me.general = e), await Ws())
}
const _v = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        addFavorite: Sl,
        favorites: me,
        isFavorite: kl,
        loadFavorites: xl,
        removeFavorite: Ps,
        reorder: hv,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  We = Le({ list: [], recentFolders: [], loading: !1, error: null })
async function gv() {
  We.loading = !0
  try {
    const e = await Wo()
    ;((We.list = e.apps), (We.recentFolders = e.recentLaunchFolders ?? gl()))
  } catch (e) {
    We.error = e instanceof Error ? e.message : String(e)
  } finally {
    We.loading = !1
  }
}
async function mv(e, t) {
  const r = await Ko(e, t)
  r.ok && ((We.list = r.apps), we(t ? 'Path saved' : 'Path cleared', 'success'))
}
async function is(e) {
  try {
    const t = await Vo(e)
    ;(e.cwd && (We.recentFolders = Io(e.cwd)), we(`Launched ${e.appId}`, 'success'))
  } catch (t) {
    we(t instanceof Error ? t.message : String(t), 'error')
  }
}
async function dn() {
  const e = await Yo()
  return e.ok && !e.canceled && e.path ? e.path : null
}
const sr = Le({
  loaded: null,
  tier: 'zen',
  defaultFolder: null,
  anygateHome: null,
  logPaths: {},
  loading: !1,
})
async function yv() {
  var e, t
  sr.loading = !0
  try {
    ;((sr.loaded = await Us()),
      (sr.anygateHome =
        ((t = (e = globalThis.process) == null ? void 0 : e.env) == null
          ? void 0
          : t.ANYGATE_HOME) ?? null))
  } catch {
  } finally {
    sr.loading = !1
  }
}
function wv(e) {
  sr.tier = e
}
const ot = Le({ list: [], loading: !1, error: null })
async function Pl() {
  ;((ot.loading = !0), (ot.error = null))
  try {
    ot.list = await ev()
  } catch (e) {
    ot.error = e instanceof Error ? e.message : String(e)
  } finally {
    ot.loading = !1
  }
}
async function El(e, t) {
  const r = ot.list
  ot.list = e
  try {
    return (await tv(e), t && we(t, 'success'), !0)
  } catch (a) {
    return (
      (ot.list = r),
      we(
        a instanceof Error ? `Couldn't save preset: ${a.message}` : "Couldn't save preset",
        'error'
      ),
      !1
    )
  }
}
async function bv(e) {
  const t = e.id ?? `preset-${Date.now()}`,
    r = { ...e, id: t },
    a = ot.list.findIndex(l => l.id === t),
    s = [...ot.list]
  ;(a >= 0 ? (s[a] = r) : s.push(r), await El(s, 'Preset saved'))
}
async function xv(e) {
  await El(
    ot.list.filter(t => t.id !== e),
    'Preset deleted'
  )
}
const Se = Le({ report: null, available: !1, loading: !1, error: null })
async function Es() {
  ;((Se.loading = !0), (Se.error = null))
  try {
    const e = await Qo()
    ;((Se.report = e), (Se.available = !0))
  } catch (e) {
    ;((Se.report = null),
      (Se.available = !1),
      (Se.error = e instanceof Error ? e.message : String(e)))
  } finally {
    Se.loading = !1
  }
}
const qt = Le({ connected: !1, degraded: !1, lastEventAt: null }),
  Ms = new Set()
let _r = null,
  cn = 0
const kv = 3
function Ml(e) {
  return (Ms.add(e), () => Ms.delete(e))
}
function zl() {
  if (_r || Co || typeof EventSource > 'u') {
    typeof EventSource > 'u' && (qt.degraded = !0)
    return
  }
  const e = new EventSource('/api/events')
  ;((_r = e),
    (e.onopen = () => {
      ;((cn = 0), (qt.connected = !0), (qt.degraded = !1))
    }),
    (e.onmessage = t => {
      qt.lastEventAt = Date.now()
      let r
      try {
        r = JSON.parse(t.data)
      } catch {
        return
      }
      for (const a of Ms)
        try {
          a(r)
        } catch {}
    }),
    (e.onerror = () => {
      ;((qt.connected = !1), ++cn >= kv && ((qt.degraded = !0), e.close(), (_r = null)))
    }))
}
function Sv() {
  ;(_r == null || _r.close(), (_r = null), (qt.connected = !1))
}
const Je = Le({ status: null, loading: !1, starting: !1, error: null })
let fa = null,
  pa = null,
  Fr = null,
  Al = 5e3
async function _a() {
  try {
    ;((Je.status = await Jo()), (Je.error = null))
  } catch (e) {
    Je.error = e instanceof Error ? e.message : String(e)
  }
}
function Pv() {
  fa ||
    (fa = setInterval(() => {
      _a()
    }, Al))
}
function Tl() {
  fa && (clearInterval(fa), (fa = null))
}
function Ev(e = 5e3) {
  ;((Al = e),
    _a(),
    zl(),
    Fr ||
      (Fr = Ml(t => {
        t.type === 'server' && _a()
      })),
    pa ||
      (pa = setInterval(() => {
        qt.degraded ? Pv() : Tl()
      }, 1e3)))
}
function Mv() {
  ;(Tl(), pa && (clearInterval(pa), (pa = null)), Fr == null || Fr(), (Fr = null))
}
async function zv(e) {
  Je.starting = !0
  try {
    const t = await Xo(e)
    return t.ok && t.status
      ? ((Je.status = t.status), we('Server gateway started', 'success'), !0)
      : (we(t.error ?? 'Failed to start server', 'error'), !1)
  } catch (t) {
    return (we(t instanceof Error ? t.message : String(t), 'error'), !1)
  } finally {
    Je.starting = !1
  }
}
async function Av() {
  try {
    ;(await Zo(), await _a(), we('Server gateway stopped', 'info'))
  } catch (e) {
    we(e instanceof Error ? e.message : String(e), 'error')
  }
}
var Tv = b(
    '<button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-6dohdz"><path></path></svg> <span> </span></button>'
  ),
  $v = b(
    '<aside class="sidebar svelte-6dohdz"><div class="brand svelte-6dohdz"><div class="monogram svelte-6dohdz">a</div> <div class="brand-meta"><div class="brand-name svelte-6dohdz">anygate</div> <div class="brand-byline svelte-6dohdz">ramananbuilds</div></div></div> <div class="version-row svelte-6dohdz"><span class="version svelte-6dohdz"> </span> <span role="img"></span></div> <nav class="nav svelte-6dohdz" aria-label="Sections"></nav></aside>'
  )
function Cv(e, t) {
  fe(t, !0)
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
    a = '0.6.1',
    s = J(() => {
      var g
      if (Se.loading && !Se.report) return { tone: 'unknown', label: 'Checking system health…' }
      if (Se.error || !Se.report) return { tone: 'unknown', label: 'System health unavailable' }
      const f = ((g = Se.report.checks) == null ? void 0 : g.filter(m => !m.ok)) ?? []
      return Se.report.ok
        ? f.length > 0
          ? { tone: 'warn', label: `${f.length} check${f.length === 1 ? '' : 's'} need attention` }
          : { tone: 'ok', label: 'All health checks passing' }
        : { tone: 'error', label: 'Critical check failing' }
    })
  var l = $v(),
    i = c(u(l), 2),
    o = u(i),
    v = u(o),
    d = c(o, 2)
  let h
  var _ = c(i, 2)
  ;(ke(
    _,
    21,
    () => r,
    f => f.id,
    (f, g) => {
      var m = Tv()
      let y
      var w = u(m),
        O = u(w),
        H = c(w, 2),
        x = u(H)
      ;(F(() => {
        ;((y = $e(m, 1, 'nav-item svelte-6dohdz', null, y, { active: kt.route === n(g).id })),
          be(m, 'aria-current', kt.route === n(g).id ? 'page' : void 0),
          be(O, 'd', n(g).icon),
          z(x, n(g).label))
      }),
        oe('click', m, () => ur(n(g).id)),
        p(f, m))
    }
  ),
    F(() => {
      ;(z(v, `v${a}`),
        (h = $e(d, 1, 'health-dot svelte-6dohdz', null, h, {
          ok: n(s).tone === 'ok',
          warn: n(s).tone === 'warn',
          error: n(s).tone === 'error',
        })),
        be(d, 'title', n(s).label),
        be(d, 'aria-label', n(s).label))
    }),
    p(e, l),
    pe())
}
Fe(['click'])
function Iv() {
  return typeof localStorage > 'u'
    ? 'dark'
    : localStorage.getItem('anygate-theme') === 'light'
      ? 'light'
      : 'dark'
}
const nr = Le({ value: Iv() })
function $l(e) {
  typeof document > 'u' || document.documentElement.setAttribute('data-theme', e)
}
typeof document < 'u' && $l(nr.value)
function Cl() {
  ;((nr.value = nr.value === 'dark' ? 'light' : 'dark'),
    typeof localStorage < 'u' && localStorage.setItem('anygate-theme', nr.value),
    $l(nr.value))
}
var Ov = b('<span><!></span>')
function Te(e, t) {
  let r = _e(t, 'tone', 3, 'neutral')
  var a = Ov(),
    s = u(a)
  ;(Cr(s, () => t.children), F(() => $e(a, 1, `badge ${r() ?? ''}`, 'svelte-7j44kq')), p(e, a))
}
var Lv = b('<button><!></button>')
function ye(e, t) {
  let r = _e(t, 'variant', 3, 'primary'),
    a = _e(t, 'size', 3, 'md'),
    s = _e(t, 'disabled', 3, !1),
    l = _e(t, 'type', 3, 'button')
  var i = Lv(),
    o = u(i)
  ;(Cr(o, () => t.children),
    F(() => {
      ;(be(i, 'type', l()),
        $e(i, 1, `btn ${r() ?? ''} ${a() ?? ''}`, 'svelte-8a1c4v'),
        (i.disabled = s()))
    }),
    oe('click', i, function (...v) {
      var d
      ;(d = t.onclick) == null || d.apply(this, v)
    }),
    p(e, i))
}
Fe(['click'])
var Fv = b('<div><!></div>')
function Ae(e, t) {
  let r = _e(t, 'padding', 3, '18px'),
    a = _e(t, 'hover', 3, !1),
    s = _e(t, 'class', 3, '')
  var l = Fv()
  let i
  var o = u(l)
  ;(Cr(o, () => t.children),
    F(() => {
      ;((i = $e(l, 1, `card glass ${s() ?? ''}`, 'svelte-it2i29', i, { hover: a() })),
        qe(l, `padding:${r() ?? ''}`),
        be(l, 'role', t.onclick ? 'button' : void 0))
    }),
    oe('click', l, function (...v) {
      var d
      ;(d = t.onclick) == null || d.apply(this, v)
    }),
    p(e, l))
}
Fe(['click'])
var Rv = b('<div class="drawer-head svelte-1cuwqu"> </div>'),
  Nv = b(
    '<div class="backdrop svelte-1cuwqu" role="presentation"><div role="dialog" aria-modal="true" tabindex="-1"><!> <div class="drawer-body svelte-1cuwqu"><!></div></div></div>'
  )
function Dv(e, t) {
  let r = _e(t, 'title', 3, ''),
    a = _e(t, 'side', 3, 'right')
  var s = Ze(),
    l = ee(s)
  {
    var i = o => {
      var v = Nv(),
        d = u(v),
        h = u(d)
      {
        var _ = m => {
          var y = Rv(),
            w = u(y)
          ;(F(() => z(w, r())), p(m, y))
        }
        q(h, m => {
          r() && m(_)
        })
      }
      var f = c(h, 2),
        g = u(f)
      ;(Cr(g, () => t.children),
        F(() => $e(d, 1, `drawer glass ${a() ?? ''}`, 'svelte-1cuwqu')),
        oe('click', v, function (...m) {
          var y
          ;(y = t.onclose) == null || y.apply(this, m)
        }),
        oe('click', d, m => m.stopPropagation()),
        oe('keydown', d, m => m.stopPropagation()),
        p(o, v))
    }
    q(l, o => {
      t.open && o(i)
    })
  }
  p(e, s)
}
Fe(['click', 'keydown'])
var jv = b('<div class="sub svelte-16dv2jh"><!></div>'),
  qv = b(
    '<div class="empty svelte-16dv2jh"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path></path></svg> <div class="title svelte-16dv2jh"> </div> <!></div>'
  )
function $r(e, t) {
  let r = _e(t, 'title', 3, 'Nothing here yet'),
    a = _e(t, 'icon', 3, 'M4 4h16v16H4z')
  var s = qv(),
    l = u(s),
    i = u(l),
    o = c(l, 2),
    v = u(o),
    d = c(o, 2)
  {
    var h = _ => {
      var f = jv(),
        g = u(f)
      ;(Cr(g, () => t.children), p(_, f))
    }
    q(d, _ => {
      t.children && _(h)
    })
  }
  ;(F(() => {
    ;(be(i, 'd', a()), z(v, r()))
  }),
    p(e, s))
}
var Bv = b('<span> </span>'),
  Hv = b('<button class="icon-btn svelte-w50x32"><!> <!></button>')
function Il(e, t) {
  let r = _e(t, 'label', 3, ''),
    a = _e(t, 'disabled', 3, !1),
    s = _e(t, 'title', 3, '')
  var l = Hv(),
    i = u(l)
  {
    var o = d => {
      var h = Bv(),
        _ = u(h)
      ;(F(() => z(_, r())), p(d, h))
    }
    q(i, d => {
      r() && d(o)
    })
  }
  var v = c(i, 2)
  ;(Cr(v, () => t.children ?? wn),
    F(() => {
      ;((l.disabled = a()), be(l, 'title', s()), be(l, 'aria-label', s() || r()))
    }),
    oe('click', l, function (...d) {
      var h
      ;(h = t.onclick) == null || h.apply(this, d)
    }),
    p(e, l))
}
Fe(['click'])
var Uv = b('<input class="input svelte-1xuvd1z"/>')
function er(e, t) {
  fe(t, !0)
  let r = _e(t, 'value', 15, ''),
    a = _e(t, 'placeholder', 3, ''),
    s = _e(t, 'type', 3, 'text'),
    l = _e(t, 'id', 3, '')
  var i = Uv()
  ;(F(() => {
    ;(be(i, 'id', l()), be(i, 'type', s()), be(i, 'placeholder', a()), Bs(i, r()))
  }),
    oe('input', i, o => {
      var v
      ;(r(o.currentTarget.value), (v = t.oninput) == null || v.call(t, r()))
    }),
    oe('keydown', i, function (...o) {
      var v
      ;(v = t.onkeydown) == null || v.apply(this, o)
    }),
    p(e, i),
    pe())
}
Fe(['input', 'keydown'])
var Gv = b('<div class="modal-head svelte-1qk8a2o"> </div>'),
  Wv = b(
    '<div class="backdrop svelte-1qk8a2o" role="presentation"><div class="modal glass svelte-1qk8a2o" role="dialog" aria-modal="true" tabindex="-1"><!> <div class="modal-body"><!></div> <button class="modal-x svelte-1qk8a2o" aria-label="Close">×</button></div></div>'
  )
function Pr(e, t) {
  let r = _e(t, 'title', 3, '')
  var a = Ze(),
    s = ee(a)
  {
    var l = i => {
      var o = Wv(),
        v = u(o),
        d = u(v)
      {
        var h = m => {
          var y = Gv(),
            w = u(y)
          ;(F(() => z(w, r())), p(m, y))
        }
        q(d, m => {
          r() && m(h)
        })
      }
      var _ = c(d, 2),
        f = u(_)
      Cr(f, () => t.children)
      var g = c(_, 2)
      ;(oe('click', o, function (...m) {
        var y
        ;(y = t.onclose) == null || y.apply(this, m)
      }),
        oe('click', v, m => m.stopPropagation()),
        oe('keydown', v, m => m.stopPropagation()),
        oe('click', g, function (...m) {
          var y
          ;(y = t.onclose) == null || y.apply(this, m)
        }),
        p(i, o))
    }
    q(s, i => {
      t.open && i(l)
    })
  }
  p(e, a)
}
Fe(['click', 'keydown'])
var Kv = b('<option> </option>'),
  Vv = b('<select class="select svelte-13vr5hb"></select>')
function lr(e, t) {
  fe(t, !0)
  let r = _e(t, 'value', 15, ''),
    a = _e(t, 'id', 3, ''),
    s = _e(t, 'disabled', 3, !1)
  function l(v) {
    var d
    ;(r(v.currentTarget.value), (d = t.onchange) == null || d.call(t, r()))
  }
  var i = Vv()
  ke(
    i,
    21,
    () => t.options,
    v => v.value,
    (v, d) => {
      var h = Kv(),
        _ = u(h),
        f = {}
      ;(F(() => {
        ;(z(_, n(d).label), f !== (f = n(d).value) && (h.value = (h.__value = n(d).value) ?? ''))
      }),
        p(v, h))
    }
  )
  var o
  ;(Qt(i),
    F(() => {
      ;(be(i, 'id', a()),
        (i.disabled = s()),
        o !== (o = r()) && ((i.value = (i.__value = r()) ?? ''), jt(i, r())))
    }),
    oe('change', i, l),
    p(e, i),
    pe())
}
Fe(['change'])
var Yv = b('<span class="spinner inline svelte-18351lc"></span>'),
  Jv = b('<span class="lbl"> </span>'),
  Xv = b(
    '<div class="spinner-wrap svelte-18351lc" role="status"><span class="spinner svelte-18351lc"></span> <!></div>'
  )
function dr(e, t) {
  let r = _e(t, 'size', 3, 18),
    a = _e(t, 'label', 3, ''),
    s = _e(t, 'inline', 3, !1)
  var l = Ze(),
    i = ee(l)
  {
    var o = d => {
        var h = Yv()
        ;(F(() => qe(h, `width:${r() ?? ''}px;height:${r() ?? ''}px`)), p(d, h))
      },
      v = d => {
        var h = Xv(),
          _ = u(h),
          f = c(_, 2)
        {
          var g = m => {
            var y = Jv(),
              w = u(y)
            ;(F(() => z(w, a())), p(m, y))
          }
          q(f, m => {
            a() && m(g)
          })
        }
        ;(F(() => {
          ;(be(h, 'aria-label', a() || 'Loading'),
            qe(_, `width:${r() ?? ''}px;height:${r() ?? ''}px`))
        }),
          p(d, h))
      }
    q(i, d => {
      s() ? d(o) : d(v, -1)
    })
  }
  p(e, l)
}
var Zv = b('<button role="tab"> </button>'),
  Qv = b('<div class="tabs svelte-9oumej" role="tablist"></div>')
function Ol(e, t) {
  fe(t, !0)
  let r = _e(t, 'active', 15, '')
  var a = Qv()
  ;(ke(
    a,
    21,
    () => t.tabs,
    s => s.id,
    (s, l) => {
      var i = Zv()
      let o
      var v = u(i)
      ;(F(() => {
        ;((o = $e(i, 1, 'tab svelte-9oumej', null, o, { active: r() === n(l).id })),
          be(i, 'aria-selected', r() === n(l).id),
          z(v, n(l).label))
      }),
        oe('click', i, () => {
          var d
          ;(r(n(l).id), (d = t.onchange) == null || d.call(t, n(l).id))
        }),
        p(s, i))
    }
  ),
    p(e, a),
    pe())
}
Fe(['click'])
var ed = b('<span class="lbl svelte-km5m9b"> </span>'),
  td = b(
    '<label class="toggle-wrap svelte-km5m9b"><button type="button" role="switch"><span class="knob svelte-km5m9b"></span></button> <!></label>'
  )
function aa(e, t) {
  fe(t, !0)
  let r = _e(t, 'checked', 11, !1),
    a = _e(t, 'label', 3, '')
  var s = td(),
    l = u(s)
  let i
  var o = c(l, 2)
  {
    var v = d => {
      var h = ed(),
        _ = u(h)
      ;(F(() => z(_, a())), p(d, h))
    }
    q(o, d => {
      a() && d(v)
    })
  }
  ;(F(() => {
    ;(be(l, 'aria-label', a() || 'toggle'),
      be(l, 'aria-checked', r()),
      (i = $e(l, 1, 'toggle svelte-km5m9b', null, i, { on: r() })))
  }),
    oe('click', l, () => {
      var d
      return (d = t.onchange) == null ? void 0 : d.call(t, !r())
    }),
    p(e, s),
    pe())
}
Fe(['click'])
var rd = qs(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>'
  ),
  ad = qs(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>'
  ),
  sd = b(
    '<header class="topbar glass svelte-y7n507"><div class="title svelte-y7n507"><h1 class="svelte-y7n507"> </h1></div> <div class="actions svelte-y7n507"><button class="cmdk svelte-y7n507" title="Command palette (⌘K)"><span class="kbd svelte-y7n507">⌘K</span> Search</button> <!></div></header>'
  )
function nd(e, t) {
  fe(t, !0)
  const r = {
      dashboard: 'Dashboard',
      providers: 'Providers & Keys',
      models: 'Models',
      apps: 'Apps & Launch',
      server: 'Server Gateway',
      tester: 'Model Tester',
      settings: 'Settings',
    },
    a = J(() => r[kt.route] ?? 'anygate')
  var s = sd(),
    l = u(s),
    i = u(l),
    o = u(i),
    v = c(l, 2),
    d = u(v),
    h = c(d, 2)
  {
    let _ = J(() => (nr.value === 'dark' ? 'Switch to light' : 'Switch to dark'))
    Il(h, {
      get title() {
        return n(_)
      },
      get onclick() {
        return Cl
      },
      children: (f, g) => {
        var m = Ze(),
          y = ee(m)
        {
          var w = H => {
              var x = rd()
              p(H, x)
            },
            O = H => {
              var x = ad()
              p(H, x)
            }
          q(y, H => {
            nr.value === 'dark' ? H(w) : H(O, -1)
          })
        }
        p(f, m)
      },
      $$slots: { default: !0 },
    })
  }
  ;(F(() => z(o, n(a))),
    oe('click', d, function (..._) {
      ls == null || ls.apply(this, _)
    }),
    p(e, s),
    pe())
}
Fe(['click'])
ki()
var ld = b(
    '<div role="button" tabindex="0"><span class="dot svelte-1kymlcg"></span> <span class="msg"> </span></div>'
  ),
  id = b('<div class="toaster svelte-1kymlcg" aria-live="polite"></div>')
function od(e, t) {
  fe(t, !1)
  function r(s, l) {
    ;(s.key === 'Enter' || s.key === ' ') && (s.preventDefault(), Ss(l))
  }
  pl()
  var a = id()
  ;(ke(
    a,
    5,
    () => Mt.toasts,
    s => s.id,
    (s, l) => {
      var i = ld(),
        o = c(u(i), 2),
        v = u(o)
      ;(F(() => {
        ;($e(i, 1, `toast ${n(l).kind ?? ''}`, 'svelte-1kymlcg'), z(v, n(l).message))
      }),
        oe('click', i, () => Ss(n(l).id)),
        oe('keydown', i, d => r(d, n(l).id)),
        p(s, i))
    }
  ),
    p(e, a),
    pe())
}
Fe(['click', 'keydown'])
var vd = b(
    '<button class="opt svelte-wh9uu8"><span class="lbl svelte-wh9uu8"> </span> <span class="hint svelte-wh9uu8"> </span></button>'
  ),
  dd = b('<div class="none svelte-wh9uu8">No matches</div>'),
  cd = b(
    '<div class="backdrop svelte-wh9uu8" role="presentation"><div class="palette glass svelte-wh9uu8" role="dialog" aria-modal="true" tabindex="-1"><input class="q svelte-wh9uu8" placeholder="Search providers, models, apps…"/> <div class="list svelte-wh9uu8"><!> <!></div></div></div>'
  )
function ud(e, t) {
  fe(t, !0)
  let r = _e(t, 'query', 15, ''),
    a
  Lt(() => {
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
        y =>
          y.label.toLowerCase().includes(r().toLowerCase()) ||
          y.hint.toLowerCase().includes(r().toLowerCase())
      )
    )
  function i(y) {
    ;(ur(y.route), t.onclose())
  }
  function o(y) {
    y.key === 'Escape' && t.onclose()
  }
  var v = cd()
  Na('keydown', ys, o)
  var d = u(v),
    h = u(d)
  fl(
    h,
    y => (a = y),
    () => a
  )
  var _ = c(h, 2),
    f = u(_)
  ke(
    f,
    17,
    () => n(l),
    y => y.id,
    (y, w) => {
      var O = vd(),
        H = u(O),
        x = u(H),
        M = c(H, 2),
        T = u(M)
      ;(F(() => {
        ;(z(x, n(w).label), z(T, n(w).hint))
      }),
        oe('click', O, () => i(n(w))),
        p(y, O))
    }
  )
  var g = c(f, 2)
  {
    var m = y => {
      var w = dd()
      p(y, w)
    }
    q(g, y => {
      n(l).length === 0 && y(m)
    })
  }
  ;(oe('click', v, function (...y) {
    var w
    ;(w = t.onclose) == null || w.apply(this, y)
  }),
    oe('click', d, y => y.stopPropagation()),
    oe('keydown', d, y => y.stopPropagation()),
    Ma(h, r),
    p(e, v),
    pe())
}
Fe(['click', 'keydown'])
async function fd(e) {
  const t = await fetch(`/api/analytics?range=${e}`, { headers: { Accept: 'application/json' } })
  if (!t.ok) throw new Error(`analytics ${t.status}`)
  const r = await t.json()
  return {
    ...r,
    hourly: Array.isArray(r.hourly) && r.hourly.length === 24 ? r.hourly : new Array(24).fill(0),
    apps: Array.isArray(r.apps) ? r.apps : [],
    models: Array.isArray(r.models) ? r.models : [],
    heatmap: Array.isArray(r.heatmap) ? r.heatmap : [],
    dailyTokens: Array.isArray(r.dailyTokens) ? r.dailyTokens : [],
    inputTokens: r.inputTokens ?? 0,
    outputTokens: r.outputTokens ?? 0,
  }
}
const ge = Le({ report: null, range: 'all', loading: !1, error: null, hasData: !1 })
let $a = 0
async function un(e = ge.range) {
  const t = ++$a
  ;((ge.range = e), (ge.loading = !0), (ge.error = null))
  try {
    const r = await fd(e)
    if (t !== $a) return
    ;((ge.report = r), (ge.hasData = r.totalTokens > 0 || r.messages > 0))
  } catch (r) {
    if (t !== $a) return
    ;((ge.report = null),
      (ge.hasData = !1),
      (ge.error =
        r instanceof Error
          ? `Couldn't reach the analytics backend (${r.message}). Run \`anygate ui\` and reload.`
          : 'Couldn’t reach the analytics backend. Run `anygate ui` and reload.'))
  } finally {
    t === $a && (ge.loading = !1)
  }
}
var pd = b('<div class="note error svelte-lftxrq"> </div>'),
  hd = b('<span class="crit svelte-lftxrq">critical</span>'),
  _d = b(
    '<div class="check svelte-lftxrq"><span aria-hidden="true"> </span> <span class="k svelte-lftxrq"> <!></span> <span class="v svelte-lftxrq"> </span></div>'
  ),
  gd = b('<div class="checks svelte-lftxrq"></div>'),
  md = b('<div class="note svelte-lftxrq"> </div>'),
  yd = b(
    '<div class="panel svelte-lftxrq"><div class="row svelte-lftxrq"><h3 class="svelte-lftxrq">System Health</h3> <!></div> <!> <!> <!> <div class="actions svelte-lftxrq"><!></div></div>'
  )
function wd(e, t) {
  ;(fe(t, !0),
    Lt(() => {
      !Se.report && !Se.loading && !Se.error && Es()
    }))
  const r = J(() => {
    var x, M
    return (
      ((M = (x = Se.report) == null ? void 0 : x.checks) == null ? void 0 : M.filter(T => !T.ok)) ??
      []
    )
  })
  var a = yd(),
    s = u(a),
    l = c(u(s), 2)
  {
    var i = x => {
        dr(x, { inline: !0, size: 16 })
      },
      o = x => {
        Te(x, {
          tone: 'error',
          children: (M, T) => {
            var D = Q('Unavailable')
            p(M, D)
          },
          $$slots: { default: !0 },
        })
      },
      v = x => {
        Te(x, {
          tone: 'success',
          children: (M, T) => {
            var D = Q('All checks passed')
            p(M, D)
          },
          $$slots: { default: !0 },
        })
      },
      d = x => {
        Te(x, {
          tone: 'warning',
          children: (M, T) => {
            var D = Q()
            ;(F(() => z(D, `${n(r).length ?? ''} warning${n(r).length === 1 ? '' : 's'}`)), p(M, D))
          },
          $$slots: { default: !0 },
        })
      },
      h = x => {
        Te(x, {
          tone: 'error',
          children: (M, T) => {
            var D = Q('Critical')
            p(M, D)
          },
          $$slots: { default: !0 },
        })
      }
    q(l, x => {
      var M, T
      Se.loading
        ? x(i)
        : Se.error
          ? x(o, 1)
          : (M = Se.report) != null && M.ok && n(r).length === 0
            ? x(v, 2)
            : (T = Se.report) != null && T.ok
              ? x(d, 3)
              : Se.report && x(h, 4)
    })
  }
  var _ = c(s, 2)
  {
    var f = x => {
      var M = pd(),
        T = u(M)
      ;(F(() =>
        z(
          T,
          `Couldn’t reach the health endpoint (${Se.error ?? ''}). Diagnostics are unavailable — no values are shown rather than guessed.`
        )
      ),
        p(x, M))
    }
    q(_, x => {
      Se.error && x(f)
    })
  }
  var g = c(_, 2)
  {
    var m = x => {
      var M = gd()
      ;(ke(
        M,
        21,
        () => Se.report.checks,
        T => T.id,
        (T, D) => {
          var E = _d(),
            N = u(E)
          let W
          var I = u(N),
            P = c(N, 2),
            A = u(P),
            k = c(A)
          {
            var j = C => {
              var G = hd()
              p(C, G)
            }
            q(k, C => {
              !n(D).ok && n(D).critical && C(j)
            })
          }
          var $ = c(P, 2),
            U = u($)
          ;(F(() => {
            ;((W = $e(N, 1, 'mark svelte-lftxrq', null, W, { ok: n(D).ok, bad: !n(D).ok })),
              z(I, n(D).ok ? '✓' : '✗'),
              z(A, `${n(D).label ?? ''} `),
              be($, 'title', n(D).detail),
              z(U, n(D).detail))
          }),
            p(T, E))
        }
      ),
        p(x, M))
    }
    q(g, x => {
      var M, T
      ;(T = (M = Se.report) == null ? void 0 : M.checks) != null && T.length && x(m)
    })
  }
  var y = c(g, 2)
  {
    var w = x => {
      var M = md(),
        T = u(M)
      ;(F(() => z(T, Se.report.note)), p(x, M))
    }
    q(y, x => {
      var M
      ;(M = Se.report) != null && M.note && x(w)
    })
  }
  var O = c(y, 2),
    H = u(O)
  ;(ye(H, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => Es(),
    children: (x, M) => {
      var T = Q('Re-check')
      p(x, T)
    },
    $$slots: { default: !0 },
  }),
    p(e, a),
    pe())
}
var bd = b('<button> </button>'),
  xd = b('<div class="seg svelte-1yfbpb7" role="group" aria-label="Time range"></div>')
function kd(e, t) {
  fe(t, !0)
  let r = _e(t, 'value', 15, 'all')
  const a = [
    { id: 'all', label: 'All' },
    { id: '30d', label: '30d' },
    { id: '7d', label: '7d' },
  ]
  var s = xd()
  ;(ke(
    s,
    21,
    () => a,
    l => l.id,
    (l, i) => {
      var o = bd()
      let v
      var d = u(o)
      ;(F(() => {
        ;((v = $e(o, 1, 'opt svelte-1yfbpb7', null, v, { active: r() === n(i).id })),
          be(o, 'aria-pressed', r() === n(i).id),
          z(d, n(i).label))
      }),
        oe('click', o, () => {
          var h
          ;(r(n(i).id), (h = t.onchange) == null || h.call(t, n(i).id))
        }),
        p(l, o))
    }
  ),
    p(e, s),
    pe())
}
Fe(['click'])
var Sd = b('<span class="sub svelte-14oot77"> </span>'),
  Pd = b(
    '<div class="stat svelte-14oot77"><span class="lbl svelte-14oot77"> </span> <span class="num svelte-14oot77"> </span> <!></div>'
  )
function Ed(e, t) {
  var r = Pd(),
    a = u(r),
    s = u(a),
    l = c(a, 2),
    i = u(l),
    o = c(l, 2)
  {
    var v = d => {
      var h = Sd(),
        _ = u(h)
      ;(F(() => z(_, t.sub)), p(d, h))
    }
    q(o, d => {
      t.sub && d(v)
    })
  }
  ;(F(() => {
    ;(z(s, t.label), be(l, 'title', t.value), z(i, t.value))
  }),
    p(e, r))
}
var Md = b('<div class="grid svelte-9jn9wt"></div>')
function zd(e, t) {
  fe(t, !0)
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
    const o = i < 12
    return `${i % 12 === 0 ? 12 : i % 12} ${o ? 'AM' : 'PM'}`
  }
  const s = J(() => [
    { label: 'Sessions', value: r(t.report.sessions) },
    { label: 'Messages', value: r(t.report.messages) },
    { label: 'Total tokens', value: r(t.report.totalTokens) },
    { label: 'Active days', value: String(t.report.activeDays) },
    { label: 'Current streak', value: `${t.report.currentStreakDays}d` },
    { label: 'Longest streak', value: `${t.report.longestStreakDays}d` },
    { label: 'Peak hour', value: a(t.report.peakHour) },
    { label: 'Favorite model', value: t.report.favoriteModel },
  ])
  var l = Md()
  ;(ke(
    l,
    21,
    () => n(s),
    i => i.label,
    (i, o) => {
      Ae(i, {
        padding: '18px',
        children: (v, d) => {
          Ed(v, {
            get label() {
              return n(o).label
            },
            get value() {
              return n(o).value
            },
          })
        },
        $$slots: { default: !0 },
      })
    }
  ),
    p(e, l),
    pe())
}
var Ad = b('<span> </span>'),
  Td = b('<div class="cell svelte-1ryzkww"></div>'),
  $d = b('<div class="cell empty svelte-1ryzkww"></div>'),
  Cd = b('<div class="col svelte-1ryzkww"></div>'),
  Id = b('<span class="key svelte-1ryzkww"></span>'),
  Od = b(
    '<div class="heat svelte-1ryzkww"><div class="months svelte-1ryzkww"></div> <div class="weeks svelte-1ryzkww"></div> <div class="legend svelte-1ryzkww"><span>Less</span> <!> <span>More</span></div></div>'
  )
function Ld(e, t) {
  fe(t, !0)
  const r = J(() => {
      if (t.days.length === 0) return []
      const f = new Date(t.days[0].date + 'T00:00:00').getDay(),
        g = [...Array(f).fill(null), ...t.days],
        m = []
      for (let y = 0; y < g.length; y += 7) m.push(g.slice(y, y + 7))
      return m
    }),
    a = J(() => {
      const _ = []
      let f = -1
      return (
        t.days.forEach((g, m) => {
          const y = m + (n(r).length ? new Date(t.days[0].date + 'T00:00:00').getDay() : 0),
            w = Math.floor(y / 7),
            O = new Date(g.date + 'T00:00:00').getMonth()
          O !== f &&
            (_.push({
              col: w,
              label: new Date(g.date + 'T00:00:00').toLocaleString('en', { month: 'short' }),
            }),
            (f = O))
        }),
        _
      )
    }),
    s = _ =>
      _ >= 1e9
        ? `${(_ / 1e9).toFixed(1)}B`
        : _ >= 1e6
          ? `${(_ / 1e6).toFixed(1)}M`
          : _ >= 1e3
            ? `${(_ / 1e3).toFixed(1)}k`
            : String(_),
    l = _ => {
      switch (_) {
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
  var i = Od(),
    o = u(i)
  ke(
    o,
    21,
    () => n(r),
    vr,
    (_, f, g) => {
      const m = J(() => n(a).find(H => H.col === g))
      var y = Ad()
      let w
      var O = u(y)
      ;(F(() => {
        ;((w = $e(y, 1, 'month svelte-1ryzkww', null, w, { has: !!n(m) })),
          z(O, n(m) ? n(m).label : ''))
      }),
        p(_, y))
    }
  )
  var v = c(o, 2)
  ke(
    v,
    21,
    () => n(r),
    vr,
    (_, f) => {
      var g = Cd()
      ;(ke(
        g,
        21,
        () => n(f),
        vr,
        (m, y) => {
          var w = Ze(),
            O = ee(w)
          {
            var H = M => {
                var T = Td()
                ;(F(
                  (D, E) => {
                    ;(qe(T, `background:${D ?? ''}`), be(T, 'title', E))
                  },
                  [() => l(n(y).intensity), () => `${n(y).date} · ${s(n(y).count)} tokens`]
                ),
                  p(M, T))
              },
              x = M => {
                var T = $d()
                p(M, T)
              }
            q(O, M => {
              n(y) ? M(H) : M(x, -1)
            })
          }
          p(m, w)
        }
      ),
        p(_, g))
    }
  )
  var d = c(v, 2),
    h = c(u(d), 2)
  ;(ke(
    h,
    16,
    () => [0, 1, 2, 3, 4],
    _ => _,
    (_, f) => {
      var g = Id()
      ;(F(m => qe(g, `background:${m ?? ''}`), [() => l(f)]), p(_, g))
    }
  ),
    p(e, i),
    pe())
}
var Fd = b('<span> </span>'),
  Rd = b('<div class="gridline svelte-1ozbyr9"></div>'),
  Nd = b(
    '<div class="bar-col svelte-1ozbyr9"><div class="bar-area svelte-1ozbyr9"><div></div></div> <div class="xlabel svelte-1ozbyr9"><!></div></div>'
  ),
  Dd = b('<div class="scroll-hint svelte-1ozbyr9">→ scroll left for older days</div>'),
  jd = b(
    '<div class="chart svelte-1ozbyr9"><div class="yaxis svelte-1ozbyr9" aria-hidden="true"></div> <div class="scroll svelte-1ozbyr9"><div class="bars svelte-1ozbyr9"><div class="gridlines svelte-1ozbyr9"></div> <!></div> <!></div></div>'
  )
function qd(e, t) {
  fe(t, !0)
  const r = J(() => Math.max(1, ...t.data.map(x => x.tokens)))
  function a(x) {
    if (x <= 0) return 1
    const M = Math.floor(Math.log10(x)),
      T = Math.pow(10, M),
      D = x / T
    let E
    return (D <= 1 ? (E = 1) : D <= 2 ? (E = 2) : D <= 5 ? (E = 5) : (E = 10), E * T)
  }
  const s = J(() => a(n(r))),
    l = J(() => Array.from({ length: 5 }, (x, M) => n(s) * (1 - M / 4)))
  function i(x) {
    return x >= 1e9
      ? `${(x / 1e9).toFixed(1)}B`
      : x >= 1e6
        ? `${(x / 1e6).toFixed(0)}M`
        : x >= 1e3
          ? `${(x / 1e3).toFixed(0)}k`
          : String(x)
  }
  function o(x) {
    return new Date(x + 'T00:00:00').toLocaleString('en', { month: 'short' })
  }
  function v(x) {
    if (x === 0) return !0
    const M = new Date(t.data[x - 1].date + 'T00:00:00').getMonth(),
      T = new Date(t.data[x].date + 'T00:00:00').getMonth()
    return M !== T
  }
  let d = re(null)
  const h = J(() => (n(d) ? n(d).scrollWidth - n(d).clientWidth > 8 : !1))
  Lt(() => {
    t.data
    const x = n(d)
    x && x.scrollWidth > x.clientWidth && (x.scrollLeft = x.scrollWidth)
  })
  var _ = jd(),
    f = u(_)
  ke(
    f,
    20,
    () => n(l),
    x => x,
    (x, M) => {
      var T = Fd(),
        D = u(T)
      ;(F(E => z(D, E), [() => i(M)]), p(x, T))
    }
  )
  var g = c(f, 2),
    m = u(g),
    y = u(m)
  ke(
    y,
    20,
    () => n(l),
    x => x,
    (x, M) => {
      var T = Rd()
      p(x, T)
    }
  )
  var w = c(y, 2)
  ke(
    w,
    19,
    () => t.data,
    x => x.date,
    (x, M, T) => {
      var D = Nd(),
        E = u(D),
        N = u(E)
      let W
      var I = c(E, 2),
        P = u(I)
      {
        var A = j => {
            var $ = Q()
            ;(F(U => z($, U), [() => o(n(M).date)]), p(j, $))
          },
          k = J(() => v(n(T)))
        q(P, j => {
          n(k) && j(A)
        })
      }
      ;(F(
        j => {
          ;(be(D, 'title', j),
            (W = $e(N, 1, 'bar svelte-1ozbyr9', null, W, { active: n(M).tokens > 0 })),
            qe(N, `height:${(n(M).tokens / n(s)) * 100}%`))
        },
        [() => `${n(M).date} · ${i(n(M).tokens)} tokens`]
      ),
        p(x, D))
    }
  )
  var O = c(m, 2)
  {
    var H = x => {
      var M = Dd()
      p(x, M)
    }
    q(O, x => {
      n(h) && x(H)
    })
  }
  ;(fl(
    g,
    x => L(d, x),
    () => n(d)
  ),
    p(e, _),
    pe())
}
var Bd = b('<span> </span>'),
  Hd = b('<span class="app-badge svelte-1ca0tub"> </span>'),
  Ud = b(
    '<div class="row svelte-1ca0tub"><span class="dot svelte-1ca0tub"></span> <div class="id svelte-1ca0tub"><div class="name svelte-1ca0tub"> </div> <div class="meta svelte-1ca0tub"><!></div></div> <div class="nums svelte-1ca0tub"><span class="in svelte-1ca0tub"> </span> <span class="out svelte-1ca0tub"> </span></div> <div class="share svelte-1ca0tub"><div class="track svelte-1ca0tub"><div class="fill svelte-1ca0tub"></div></div> <span class="pct svelte-1ca0tub"> </span></div></div>'
  ),
  Gd = b('<div class="list svelte-1ca0tub"></div>')
function Wd(e, t) {
  fe(t, !0)
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
    const o = i.map(f => f.share * 100),
      v = o.map(f => Math.floor(f))
    let d = 100 - v.reduce((f, g) => f + g, 0)
    const h = o.map((f, g) => ({ i: g, frac: f - Math.floor(f) })).sort((f, g) => g.frac - f.frac),
      _ = v.slice()
    for (let f = 0; f < h.length && d > 0; f++) ((_[h[f].i] += 1), d--)
    return _
  }
  const s = J(() => a(t.models))
  var l = Gd()
  ;(ke(
    l,
    23,
    () => t.models,
    i => i.provider + i.model,
    (i, o, v) => {
      var d = Ud(),
        h = u(d),
        _ = c(h, 2),
        f = u(_),
        g = u(f),
        m = c(f, 2),
        y = u(m)
      {
        var w = A => {
            var k = Ze(),
              j = ee(k)
            ;(ke(
              j,
              16,
              () => n(o).apps,
              $ => $,
              ($, U) => {
                var C = Bd()
                let G
                var B = u(C)
                ;(F(
                  R => {
                    ;((G = $e(C, 1, 'app-badge svelte-1ca0tub', null, G, R)), z(B, U))
                  },
                  [() => ({ agy: U.toLowerCase() === 'antigravity' })]
                ),
                  p($, C))
              }
            ),
              p(A, k))
          },
          O = A => {
            var k = Hd(),
              j = u(k)
            ;(F(() => z(j, n(o).app)), p(A, k))
          }
        q(y, A => {
          var k
          ;(k = n(o).apps) != null && k.length ? A(w) : A(O, -1)
        })
      }
      var H = c(_, 2),
        x = u(H),
        M = u(x),
        T = c(x, 2),
        D = u(T),
        E = c(H, 2),
        N = u(E),
        W = u(N),
        I = c(N, 2),
        P = u(I)
      ;(F(
        (A, k) => {
          ;(qe(h, `background:${n(o).color ?? ''}`),
            be(f, 'title', `${n(o).provider ?? ''}: ${n(o).model ?? ''}`),
            z(g, `${n(o).provider ?? ''}: ${n(o).model ?? ''}`),
            z(M, `↓ ${A ?? ''}`),
            z(D, `↑ ${k ?? ''}`),
            qe(W, `width:${n(s)[n(v)] ?? ''}%; background:${n(o).color ?? ''}`),
            z(P, `${n(s)[n(v)] ?? ''}%`))
        },
        [() => r(n(o).inputTokens), () => r(n(o).outputTokens)]
      ),
        p(i, d))
    }
  ),
    p(e, l),
    pe())
}
var Kd = b('<p class="empty svelte-1ev3km3">No requests recorded in this range.</p>'),
  Vd = b('<span class="tick svelte-1ev3km3"> </span>'),
  Yd = b('<span class="tick svelte-1ev3km3"></span>'),
  Jd = b(
    '<div><div class="track svelte-1ev3km3"><div class="bar svelte-1ev3km3"></div></div> <!></div>'
  ),
  Xd = b(
    '<div class="bars svelte-1ev3km3" role="img" aria-label="Requests by hour of day (UTC)"></div> <p class="note svelte-1ev3km3">Busiest at <strong class="svelte-1ev3km3"> </strong> </p>',
    1
  ),
  Zd = b('<div class="wrap svelte-1ev3km3"><!></div>')
function Qd(e, t) {
  fe(t, !0)
  const r = J(() => Math.max(1, ...t.hourly)),
    a = J(() => t.hourly.reduce((d, h) => d + h, 0))
  function s(d) {
    return d === 0 ? '12a' : d === 12 ? '12p' : d < 12 ? `${d}a` : `${d - 12}p`
  }
  var l = Zd(),
    i = u(l)
  {
    var o = d => {
        var h = Kd()
        p(d, h)
      },
      v = d => {
        var h = Xd(),
          _ = ee(h)
        ke(
          _,
          21,
          () => t.hourly,
          vr,
          (w, O, H) => {
            var x = Jd()
            let M
            var T = u(x),
              D = u(T)
            let E
            var N = c(T, 2)
            {
              var W = P => {
                  var A = Vd(),
                    k = u(A)
                  ;(F(j => z(k, j), [() => s(H)]), p(P, A))
                },
                I = P => {
                  var A = Yd()
                  p(P, A)
                }
              q(N, P => {
                H % 3 === 0 ? P(W) : P(I, -1)
              })
            }
            ;(F(
              (P, A) => {
                ;((M = $e(x, 1, 'col svelte-1ev3km3', null, M, {
                  peak: H === t.peakHour && n(O) > 0,
                })),
                  be(D, 'title', `${P ?? ''} · ${n(O) ?? ''} request${n(O) === 1 ? '' : 's'}`),
                  (E = qe(D, '', E, A)))
              },
              [
                () => s(H),
                () => ({ height: `${n(O) === 0 ? 0 : Math.max(4, (n(O) / n(r)) * 100)}%` }),
              ]
            ),
              p(w, x))
          }
        )
        var f = c(_, 2),
          g = c(u(f)),
          m = u(g),
          y = c(g)
        ;(F(
          w => {
            ;(z(m, w), z(y, ` UTC · ${n(a) ?? ''} request${n(a) === 1 ? '' : 's'}`))
          },
          [() => s(t.peakHour)]
        ),
          p(d, h))
      }
    q(i, d => {
      n(a) === 0 ? d(o) : d(v, -1)
    })
  }
  ;(p(e, l), pe())
}
var ec = b('<p class="empty svelte-1tsh0oh">No app usage recorded in this range.</p>'),
  tc = b(
    '<div class="row svelte-1tsh0oh"><span class="dot svelte-1tsh0oh"></span> <span class="name svelte-1tsh0oh"> </span> <div class="meter svelte-1tsh0oh" aria-hidden="true"><div class="fill svelte-1tsh0oh"></div></div> <span class="pct svelte-1tsh0oh"> </span> <span class="tok svelte-1tsh0oh"> </span></div>'
  ),
  rc = b(
    '<div class="split svelte-1tsh0oh"><div class="split-bar svelte-1tsh0oh" aria-hidden="true"><div class="in svelte-1tsh0oh"></div> <div class="out svelte-1tsh0oh"></div></div> <div class="legend svelte-1tsh0oh"><span class="svelte-1tsh0oh"><i class="sw in svelte-1tsh0oh"></i> </span> <span class="svelte-1tsh0oh"><i class="sw out svelte-1tsh0oh"></i> </span></div></div>'
  ),
  ac = b('<div class="rows svelte-1tsh0oh"></div> <!>', 1),
  sc = b('<div class="wrap svelte-1tsh0oh"><!></div>')
function nc(e, t) {
  fe(t, !0)
  const r = {
      gateway: 'Server gateway',
      claude: 'Claude Code',
      codex: 'Codex',
      gemini: 'Gemini',
      antigravity: 'Antigravity',
      unknown: 'Unknown source',
    },
    a = J(() => t.inputTokens + t.outputTokens)
  function s(d) {
    return d >= 1e9
      ? `${(d / 1e9).toFixed(1)}B`
      : d >= 1e6
        ? `${(d / 1e6).toFixed(1)}M`
        : d >= 1e3
          ? `${(d / 1e3).toFixed(1)}k`
          : String(d)
  }
  var l = sc(),
    i = u(l)
  {
    var o = d => {
        var h = ec()
        p(d, h)
      },
      v = d => {
        var h = ac(),
          _ = ee(h)
        ke(
          _,
          21,
          () => t.apps,
          m => m.app,
          (m, y) => {
            var w = tc(),
              O = u(w)
            let H
            var x = c(O, 2),
              M = u(x),
              T = c(x, 2),
              D = u(T)
            let E
            var N = c(T, 2),
              W = u(N),
              I = c(N, 2),
              P = u(I)
            ;(F(
              (A, k, j) => {
                ;((H = qe(O, '', H, { background: n(y).color })),
                  z(M, r[n(y).app] ?? n(y).app),
                  (E = qe(D, '', E, A)),
                  z(W, `${k ?? ''}%`),
                  be(I, 'title', `${n(y).messages ?? ''} request${n(y).messages === 1 ? '' : 's'}`),
                  z(P, j))
              },
              [
                () => ({ width: `${Math.max(2, n(y).share * 100)}%`, background: n(y).color }),
                () => (n(y).share * 100).toFixed(n(y).share < 0.1 ? 1 : 0),
                () => s(n(y).inputTokens + n(y).outputTokens),
              ]
            ),
              p(m, w))
          }
        )
        var f = c(_, 2)
        {
          var g = m => {
            var y = rc(),
              w = u(y),
              O = u(w)
            let H
            var x = c(O, 2)
            let M
            var T = c(w, 2),
              D = u(T),
              E = c(u(D)),
              N = c(D, 2),
              W = c(u(N))
            ;(F(
              (I, P) => {
                ;((H = qe(O, '', H, { width: `${(t.inputTokens / n(a)) * 100}%` })),
                  (M = qe(x, '', M, { width: `${(t.outputTokens / n(a)) * 100}%` })),
                  z(E, `Prompt ${I ?? ''}`),
                  z(W, `Completion ${P ?? ''}`))
              },
              [() => s(t.inputTokens), () => s(t.outputTokens)]
            ),
              p(m, y))
          }
          q(f, m => {
            n(a) > 0 && m(g)
          })
        }
        p(d, h)
      }
    q(i, d => {
      t.apps.length === 0 ? d(o) : d(v, -1)
    })
  }
  ;(p(e, l), pe())
}
var lc = b(
    '<span class="live svelte-1thed0a" title="Receiving live updates"><i class="svelte-1thed0a"></i>Live</span>'
  ),
  ic = b('<span class="offline svelte-1thed0a">Offline</span>'),
  oc = b(
    '<span class="empty svelte-1thed0a" title="No usage recorded yet — use anygate with a provider to populate real stats">No data yet</span>'
  ),
  vc = b('<div class="loading svelte-1thed0a"><!></div>'),
  dc = b(
    '<div class="notice svelte-1thed0a"><p class="notice-title svelte-1thed0a">Can’t load real analytics</p> <p class="notice-body svelte-1thed0a"> </p></div>'
  ),
  cc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Activity</h3><span class="hint svelte-1thed0a"> </span></div> <!>',
    1
  ),
  uc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">When you work</h3><span class="hint svelte-1thed0a">Requests by hour (UTC)</span></div> <!>',
    1
  ),
  fc = b('<div class="section svelte-1thed0a"><!></div> <!> <!>', 1),
  pc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Token volume</h3><span class="hint svelte-1thed0a">Total tokens per day</span></div> <!>',
    1
  ),
  hc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Model breakdown</h3><span class="hint svelte-1thed0a">Share of total usage</span></div> <!>',
    1
  ),
  _c = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">By app</h3><span class="hint svelte-1thed0a">Which launcher spent the tokens</span></div> <!>',
    1
  ),
  gc = b('<!> <!> <!>', 1),
  mc = b('<p class="muted svelte-1thed0a">No apps detected. Add a provider first.</p>'),
  yc = b(
    '<p class="launch-note svelte-1thed0a">Open your agents with anygate models pre-wired, or send your whole favorites catalog into the app switcher.</p> <div class="quick svelte-1thed0a"></div>',
    1
  ),
  wc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Apps &amp; Launch</h3></div> <!>',
    1
  ),
  bc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Providers</span></div>'
  ),
  xc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Models</span></div>'
  ),
  kc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Favorites</span></div>'
  ),
  Sc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Apps ready</span> <!></div>'
  ),
  Pc = b(
    '<div class="dash svelte-1thed0a"><div class="head svelte-1thed0a"><div class="title svelte-1thed0a"><div class="title-row svelte-1thed0a"><h2 class="svelte-1thed0a">Dashboard</h2> <!> <!> <!></div> <p class="svelte-1thed0a"> </p></div> <!></div> <!> <!> <div class="cols mt svelte-1thed0a"><!> <!></div> <div class="grid mt svelte-1thed0a"><!> <!> <!> <!></div></div>'
  )
function Ec(e, t) {
  ;(fe(t, !0), _e(t, 'showSampleBadge', 3, !0))
  let r = re('overview')
  const a = J(() => Me.list.reduce((C, G) => C + G.enrichedModels.length, 0)),
    s = J(() => Me.list.length),
    l = J(() => We.list.filter(C => C.installed))
  Lt(() => {
    un(ge.range)
  })
  const i = 1500
  Hs(() => {
    let C = null
    const G = Ml(B => {
      B.type === 'usage' &&
        (C && clearTimeout(C),
        (C = setTimeout(() => {
          un(ge.range)
        }, i)))
    })
    return () => {
      ;(C && clearTimeout(C), G())
    }
  })
  var o = Pc(),
    v = u(o),
    d = u(v),
    h = u(d),
    _ = c(u(h), 2)
  {
    var f = C => {
      var G = lc()
      p(C, G)
    }
    q(_, C => {
      qt.connected && C(f)
    })
  }
  var g = c(_, 2)
  {
    var m = C => {
      var G = ic()
      ;(F(() => be(G, 'title', ge.error)), p(C, G))
    }
    q(g, C => {
      ge.error && C(m)
    })
  }
  var y = c(g, 2)
  {
    var w = C => {
      var G = oc()
      p(C, G)
    }
    q(y, C => {
      !ge.error && !ge.hasData && C(w)
    })
  }
  var O = c(h, 2),
    H = u(O),
    x = c(d, 2)
  kd(x, {
    get value() {
      return ge.range
    },
    onchange: C => (ge.range = C),
  })
  var M = c(v, 2)
  Ol(M, {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'models', label: 'Models' },
    ],
    get active() {
      return n(r)
    },
    set active(C) {
      L(r, C, !0)
    },
  })
  var T = c(M, 2)
  {
    var D = C => {
        var G = vc(),
          B = u(G)
        ;(dr(B, { label: 'Loading analytics…' }), p(C, G))
      },
      E = C => {
        var G = dc(),
          B = c(u(G), 2),
          R = u(B)
        ;(F(() => z(R, ge.error)), p(C, G))
      },
      N = C => {
        var G = Ze(),
          B = ee(G)
        {
          var R = Y => {
              var V = fc(),
                X = ee(V),
                te = u(X)
              zd(te, {
                get report() {
                  return ge.report
                },
              })
              var ne = c(X, 2)
              Ae(ne, {
                padding: '20px',
                class: 'mt',
                children: (le, ce) => {
                  var Z = cc(),
                    ie = ee(Z),
                    Ie = c(u(ie)),
                    yt = u(Ie),
                    Nt = c(ie, 2)
                  ;(Ld(Nt, {
                    get days() {
                      return ge.report.heatmap
                    },
                  }),
                    F(() =>
                      z(
                        yt,
                        `Daily activity over ${(ge.range === 'all' ? 'the last year' : ge.range) ?? ''}`
                      )
                    ),
                    p(le, Z))
                },
                $$slots: { default: !0 },
              })
              var ae = c(ne, 2)
              ;(Ae(ae, {
                padding: '20px',
                class: 'mt',
                children: (le, ce) => {
                  var Z = uc(),
                    ie = c(ee(Z), 2)
                  ;(Qd(ie, {
                    get hourly() {
                      return ge.report.hourly
                    },
                    get peakHour() {
                      return ge.report.peakHour
                    },
                  }),
                    p(le, Z))
                },
                $$slots: { default: !0 },
              }),
                p(Y, V))
            },
            K = Y => {
              var V = gc(),
                X = ee(V)
              Ae(X, {
                padding: '20px',
                class: 'mt',
                children: (ae, le) => {
                  var ce = pc(),
                    Z = c(ee(ce), 2)
                  ;(qd(Z, {
                    get data() {
                      return ge.report.dailyTokens
                    },
                  }),
                    p(ae, ce))
                },
                $$slots: { default: !0 },
              })
              var te = c(X, 2)
              Ae(te, {
                padding: '20px',
                class: 'mt',
                children: (ae, le) => {
                  var ce = hc(),
                    Z = c(ee(ce), 2)
                  ;(Wd(Z, {
                    get models() {
                      return ge.report.models
                    },
                  }),
                    p(ae, ce))
                },
                $$slots: { default: !0 },
              })
              var ne = c(te, 2)
              ;(Ae(ne, {
                padding: '20px',
                class: 'mt',
                children: (ae, le) => {
                  var ce = _c(),
                    Z = c(ee(ce), 2)
                  ;(nc(Z, {
                    get apps() {
                      return ge.report.apps
                    },
                    get inputTokens() {
                      return ge.report.inputTokens
                    },
                    get outputTokens() {
                      return ge.report.outputTokens
                    },
                  }),
                    p(ae, ce))
                },
                $$slots: { default: !0 },
              }),
                p(Y, V))
            }
          q(B, Y => {
            n(r) === 'overview' ? Y(R) : Y(K, -1)
          })
        }
        p(C, G)
      }
    q(T, C => {
      ge.loading && !ge.report ? C(D) : ge.error ? C(E, 1) : ge.report && C(N, 2)
    })
  }
  var W = c(T, 2),
    I = u(W)
  Ae(I, {
    padding: '20px',
    children: (C, G) => {
      var B = wc(),
        R = c(ee(B), 2)
      {
        var K = X => {
            dr(X, { label: 'Loading apps…' })
          },
          Y = X => {
            var te = mc()
            p(X, te)
          },
          V = X => {
            var te = yc(),
              ne = c(ee(te), 2)
            ;(ke(
              ne,
              21,
              () => n(l),
              ae => ae.id,
              (ae, le) => {
                ye(ae, {
                  variant: 'subtle',
                  onclick: () => ur('apps'),
                  children: (ce, Z) => {
                    var ie = Q()
                    ;(F(() => z(ie, n(le).name)), p(ce, ie))
                  },
                  $$slots: { default: !0 },
                })
              }
            ),
              p(X, te))
          }
        q(R, X => {
          We.loading ? X(K) : n(l).length === 0 ? X(Y, 1) : X(V, -1)
        })
      }
      p(C, B)
    },
    $$slots: { default: !0 },
  })
  var P = c(I, 2)
  wd(P, {})
  var A = c(W, 2),
    k = u(A)
  Ae(k, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('providers'),
    children: (C, G) => {
      var B = bc(),
        R = u(B),
        K = u(R)
      ;(F(() => z(K, n(s))), p(C, B))
    },
    $$slots: { default: !0 },
  })
  var j = c(k, 2)
  Ae(j, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('models'),
    children: (C, G) => {
      var B = xc(),
        R = u(B),
        K = u(R)
      ;(F(() => z(K, n(a))), p(C, B))
    },
    $$slots: { default: !0 },
  })
  var $ = c(j, 2)
  Ae($, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('models'),
    children: (C, G) => {
      var B = kc(),
        R = u(B),
        K = u(R)
      ;(F(() => z(K, me.general.length + me.agy.length)), p(C, B))
    },
    $$slots: { default: !0 },
  })
  var U = c($, 2)
  ;(Ae(U, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('apps'),
    children: (C, G) => {
      var B = Sc(),
        R = u(B),
        K = u(R),
        Y = c(R, 3)
      {
        var V = X => {
          Te(X, {
            tone: 'success',
            children: (te, ne) => {
              var ae = Q('server on')
              p(te, ae)
            },
            $$slots: { default: !0 },
          })
        }
        q(Y, X => {
          var te
          ;(te = Je.status) != null && te.running && X(V)
        })
      }
      ;(F(() => z(K, n(l).length)), p(C, B))
    },
    $$slots: { default: !0 },
  }),
    F(() =>
      z(
        H,
        `Usage analytics for your local gateway · ${(ge.range === 'all' ? 'all time' : ge.range) ?? ''}`
      )
    ),
    p(e, o),
    pe())
}
const fn = {
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
  Mc = {
    anthropic:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3.2l6.5-3.75a1 1 0 0 1 1.5.87V11l3.5-2.02a1 1 0 0 1 1 1.73L21.5 13l3.5 2.02a1 1 0 0 1-1 1.73L20 14.98V22a1 1 0 0 1-1.5.87L12 19.12V23a1 1 0 0 1-2 0v-3.88L3.5 22.87A1 1 0 0 1 2 22v-7.02L-1.5 17a1 1 0 0 1-1-1.73L2.5 13l-3.5-2.02a1 1 0 0 1 1-1.73L4 9.98V2a1 1 0 0 1 1.5-.87L12 4.8V3a1 1 0 0 1 1-1z" transform="translate(1 1)"/></svg>',
    openai:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a4 4 0 0 0-.7-2.3l.1-.1a3.7 3.7 0 0 0-5.2-5.2l-.1.1A4 4 0 0 0 12 2l-.1.1A3.7 3.7 0 0 0 7.1 4.7l-.1-.1a3.7 3.7 0 0 0-5.2 5.2l.1.1A4 4 0 0 0 2 12l-.1.1A3.7 3.7 0 0 0 4.7 16.9l.1-.1A4 4 0 0 0 12 22l.1-.1A3.7 3.7 0 0 0 16.9 19.3l.1.1a3.7 3.7 0 0 0 5.2-5.2l-.1-.1A4 4 0 0 0 22 12zM12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/></svg>',
    google:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9l3 2.3c1.7-1.6 2.8-4 2.8-6.9 0-.7-.1-1.3-.2-1.9zM6.5 13.5a4.5 4.5 0 0 1 0-3l-3-2.3a8 8 0 0 0 0 7.6zM12 6.2c1.5 0 2.8.5 3.8 1.5l2.9-2.9A8 8 0 0 0 3.5 8.7l3 2.3A4.5 4.5 0 0 1 12 6.2z"/></svg>',
  }
function zc(e) {
  const t = e.toLowerCase()
  return { svg: Mc[t], gradient: fn[t] ?? fn.default }
}
var Ac = b('<span class="svg svelte-1va9fof"></span>'),
  Tc = b('<span class="mono svelte-1va9fof"> </span>'),
  $c = b('<span class="logo svelte-1va9fof"><!></span>')
function Ks(e, t) {
  fe(t, !0)
  let r = _e(t, 'size', 3, 34)
  const a = J(() => zc(t.id)),
    s = J(() => t.id.slice(0, 1).toUpperCase())
  var l = $c(),
    i = u(l)
  {
    var o = d => {
        var h = Ac()
        ;(_o(h, () => n(a).svg, !0),
          F(() => qe(h, `width:${r() * 0.55}px;height:${r() * 0.55}px`)),
          p(d, h))
      },
      v = d => {
        var h = Tc(),
          _ = u(h)
        ;(F(() => {
          ;(qe(h, `font-size:${r() * 0.42}px`), z(_, n(s)))
        }),
          p(d, h))
      }
    q(i, d => {
      n(a).svg ? d(o) : d(v, -1)
    })
  }
  ;(F(() =>
    qe(
      l,
      `width:${r() ?? ''}px;height:${r() ?? ''}px;background:linear-gradient(135deg,${n(a).gradient[0] ?? ''},${n(a).gradient[1] ?? ''});`
    )
  ),
    p(e, l),
    pe())
}
var Cc = b('<span class="chip svelte-1p75598"> </span>'),
  Ic = b('<span class="chip more svelte-1p75598"> </span>'),
  Oc = b('<span class="chip empty svelte-1p75598">no models yet</span>'),
  Lc = b(
    '<a class="keylink svelte-1p75598" target="_blank" rel="noopener noreferrer">Get key →</a>'
  ),
  Fc = b('<!> <!>', 1),
  Rc = qs(
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"></path></svg>'
  ),
  Nc = b(
    '<div class="card svelte-1p75598"><div class="head svelte-1p75598"><!> <div class="meta svelte-1p75598"><div class="name svelte-1p75598"> </div> <div class="sub svelte-1p75598"> <span class="id svelte-1p75598"> </span></div></div> <div class="status"><!></div></div> <div class="models svelte-1p75598"><!> <!> <!></div> <div class="actions svelte-1p75598"><!> <!></div></div>'
  )
function Dc(e, t) {
  fe(t, !0)
  var r = Nc(),
    a = u(r),
    s = u(a)
  Ks(s, {
    get id() {
      return t.provider.id
    },
  })
  var l = c(s, 2),
    i = u(l),
    o = u(i),
    v = c(i, 2),
    d = u(v),
    h = c(d),
    _ = u(h),
    f = c(l, 2),
    g = u(f)
  {
    var m = k => {
        Te(k, {
          tone: 'success',
          children: (j, $) => {
            var U = Q()
            ;(F(() => z(U, t.provider.freeAccess ? 'Free access' : 'Key set')), p(j, U))
          },
          $$slots: { default: !0 },
        })
      },
      y = k => {
        Te(k, {
          tone: 'accent',
          children: (j, $) => {
            var U = Q('OAuth')
            p(j, U)
          },
          $$slots: { default: !0 },
        })
      },
      w = k => {
        Te(k, {
          tone: 'warning',
          children: (j, $) => {
            var U = Q('No key')
            p(j, U)
          },
          $$slots: { default: !0 },
        })
      }
    q(g, k => {
      t.provider.hasKey || t.provider.freeAccess
        ? k(m)
        : t.provider.authType === 'oauth'
          ? k(y, 1)
          : k(w, -1)
    })
  }
  var O = c(a, 2),
    H = u(O)
  ke(
    H,
    17,
    () => t.provider.enrichedModels.slice(0, 5),
    k => k.id,
    (k, j) => {
      var $ = Cc(),
        U = u($)
      ;(F(() => {
        ;(be($, 'title', n(j).id), z(U, n(j).name ?? n(j).id))
      }),
        p(k, $))
    }
  )
  var x = c(H, 2)
  {
    var M = k => {
      var j = Ic(),
        $ = u(j)
      ;(F(() => z($, `+${t.provider.enrichedModels.length - 5}`)), p(k, j))
    }
    q(x, k => {
      t.provider.enrichedModels.length > 5 && k(M)
    })
  }
  var T = c(x, 2)
  {
    var D = k => {
      var j = Oc()
      p(k, j)
    }
    q(T, k => {
      t.provider.enrichedModels.length === 0 && k(D)
    })
  }
  var E = c(O, 2),
    N = u(E)
  {
    var W = k => {
        ye(k, {
          size: 'sm',
          variant: 'subtle',
          onclick: () => t.onOAuth(t.provider),
          children: (j, $) => {
            var U = Q('Sign in')
            p(j, U)
          },
          $$slots: { default: !0 },
        })
      },
      I = k => {
        var j = Fc(),
          $ = ee(j)
        ye($, {
          size: 'sm',
          variant: 'primary',
          onclick: () => t.onAddKey(t.provider),
          children: (G, B) => {
            var R = Q('Add key')
            p(G, R)
          },
          $$slots: { default: !0 },
        })
        var U = c($, 2)
        {
          var C = G => {
            var B = Lc()
            ;(F(() => be(B, 'href', t.provider.signupUrl)), p(G, B))
          }
          q(U, G => {
            t.provider.signupUrl && G(C)
          })
        }
        p(k, j)
      },
      P = k => {
        ye(k, {
          size: 'sm',
          variant: 'ghost',
          onclick: () => bl(t.provider.id),
          children: (j, $) => {
            var U = Q('Refresh')
            p(j, U)
          },
          $$slots: { default: !0 },
        })
      }
    q(N, k => {
      t.provider.authType === 'oauth'
        ? k(W)
        : !t.provider.hasKey && !t.provider.freeAccess
          ? k(I, 1)
          : k(P, -1)
    })
  }
  var A = c(N, 2)
  ;(Il(A, {
    title: 'Delete provider',
    onclick: () => t.onDelete(t.provider),
    children: (k, j) => {
      var $ = Rc()
      p(k, $)
    },
    $$slots: { default: !0 },
  }),
    F(() => {
      ;(z(o, t.provider.name),
        z(d, `${t.provider.modelCount ?? ''} models · `),
        z(_, t.provider.id))
    }),
    p(e, r),
    pe())
}
var jc = b('<p style="color:var(--text-3)">Loading templates…</p>'),
  qc = b('<option> </option>'),
  Bc = b('<span style="color:var(--text-3)">(optional)</span>'),
  Hc = b(
    '<a class="hint-link svelte-263z8" target="_blank" rel="noopener noreferrer">Get an API key →</a>'
  ),
  Uc = b('<span class="signup-note svelte-263z8"> </span>'),
  Gc = b('<span class="lbl svelte-263z8" style="margin-top:14px">API key<!></span> <!> <!> <!>', 1),
  Wc = b('<span class="lbl svelte-263z8" style="margin-top:14px"> </span> <!>', 1),
  Kc = b(
    '<span class="lbl svelte-263z8" style="margin-top:14px">Display name</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Base URL</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">API key <span style="color:var(--text-3)">(optional)</span></span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Custom headers <span style="color:var(--text-3)">(optional)</span></span> <textarea class="hdrs svelte-263z8" rows="3" placeholder="One per line, e.g. User-Agent: claude-cli/1.0.0 (external, cli) x-app: cli"></textarea> <span class="hint-txt svelte-263z8">Some endpoints only accept requests from a recognized client. Add headers like <code class="svelte-263z8">User-Agent</code> here if the provider requires them.</span>',
    1
  ),
  Vc = b(
    '<span class="lbl svelte-263z8">Provider</span> <select class="sel svelte-263z8"><option>Select a provider…</option><!></select> <!> <!> <!> <div class="row svelte-263z8" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  )
function Yc(e, t) {
  fe(t, !0)
  let r = re(Le([])),
    a = re(!1),
    s = re(null),
    l = re(''),
    i = re(''),
    o = re(''),
    v = re(''),
    d = re(!1)
  function h(w) {
    const O = {}
    for (const H of w.split(`
`)) {
      const x = H.indexOf(':')
      if (x === -1) continue
      const M = H.slice(0, x).trim(),
        T = H.slice(x + 1).trim()
      M && T && (O[M] = T)
    }
    return O
  }
  async function _() {
    L(a, !0)
    try {
      L(r, (await jo()).templates, !0)
    } catch (w) {
      we(String(w), 'error')
    }
    L(a, !1)
  }
  Lt(() => {
    t.open && (_(), L(s, null), L(l, ''), L(i, ''), L(o, ''), L(v, ''))
  })
  const f = J(() => n(r).find(w => w.id === n(s))),
    g = J(() => n(s) === '__custom_openai__'),
    m = J(() => n(s) === '__custom_anthropic__')
  async function y() {
    if (n(s)) {
      L(d, !0)
      try {
        let w
        if (n(g) || n(m)) {
          const O = h(n(v))
          w = await Bo({
            kind: n(g) ? 'openai' : 'anthropic',
            displayName: n(o),
            baseUrl: n(i),
            apiKey: n(l),
            ...(Object.keys(O).length > 0 ? { headers: O } : {}),
          })
        } else w = await qo(n(s), n(l) || void 0, n(i) || void 0)
        w.ok
          ? (we(`Added ${w.name ?? n(s)}`, 'success'), t.onadded(), t.onclose())
          : we(w.error ?? 'Failed to add provider', 'error')
      } catch (w) {
        we(w instanceof Error ? w.message : String(w), 'error')
      }
      L(d, !1)
    }
  }
  ;(Pr(e, {
    get open() {
      return t.open
    },
    title: 'Add provider',
    get onclose() {
      return t.onclose
    },
    children: (w, O) => {
      var H = Ze(),
        x = ee(H)
      {
        var M = D => {
            var E = jc()
            p(D, E)
          },
          T = D => {
            var E = Vc(),
              N = c(ee(E), 2),
              W = u(N)
            W.value = (W.__value = null) ?? ''
            var I = c(W)
            ke(
              I,
              17,
              () => n(r),
              R => R.id,
              (R, K) => {
                var Y = qc(),
                  V = u(Y),
                  X = {}
                ;(F(() => {
                  ;(z(
                    V,
                    `${n(K).name ?? ''}${n(K).anonymousFreeModels ? ' (free)' : ''}${n(K).subscriptionRisk ? ' ⚠' : ''}`
                  ),
                    X !== (X = n(K).id) && (Y.value = (Y.__value = n(K).id) ?? ''))
                }),
                  p(R, Y))
              }
            )
            var P = c(N, 2)
            {
              var A = R => {
                var K = Gc(),
                  Y = ee(K),
                  V = c(u(Y))
                {
                  var X = Z => {
                    var ie = Bc()
                    p(Z, ie)
                  }
                  q(V, Z => {
                    n(f).apiKeyOptional && Z(X)
                  })
                }
                var te = c(Y, 2)
                {
                  let Z = J(() =>
                    n(f).apiKeyOptional
                      ? 'Leave blank for a local server without auth'
                      : 'Paste your key'
                  )
                  er(te, {
                    get placeholder() {
                      return n(Z)
                    },
                    get value() {
                      return n(l)
                    },
                    set value(ie) {
                      L(l, ie, !0)
                    },
                  })
                }
                var ne = c(te, 2)
                {
                  var ae = Z => {
                    var ie = Hc()
                    ;(F(() => be(ie, 'href', n(f).signupUrl)), p(Z, ie))
                  }
                  q(ne, Z => {
                    n(f).signupUrl && Z(ae)
                  })
                }
                var le = c(ne, 2)
                {
                  var ce = Z => {
                    var ie = Uc(),
                      Ie = u(ie)
                    ;(F(() => z(Ie, n(f).signupNote)), p(Z, ie))
                  }
                  q(le, Z => {
                    n(f).signupNote && Z(ce)
                  })
                }
                p(R, K)
              }
              q(P, R => {
                n(f) && n(f).authType === 'api' && !n(g) && !n(m) && R(A)
              })
            }
            var k = c(P, 2)
            {
              var j = R => {
                var K = Wc(),
                  Y = ee(K),
                  V = u(Y),
                  X = c(Y, 2)
                {
                  let te = J(() => n(f).defaultBaseUrl ?? 'https://')
                  er(X, {
                    get placeholder() {
                      return n(te)
                    },
                    get value() {
                      return n(i)
                    },
                    set value(ne) {
                      L(i, ne, !0)
                    },
                  })
                }
                ;(F(() => z(V, n(f).urlPrompt)), p(R, K))
              }
              q(k, R => {
                var K
                ;(K = n(f)) != null && K.urlPrompt && R(j)
              })
            }
            var $ = c(k, 2)
            {
              var U = R => {
                var K = Kc(),
                  Y = c(ee(K), 2)
                er(Y, {
                  placeholder: 'My endpoint',
                  get value() {
                    return n(o)
                  },
                  set value(ne) {
                    L(o, ne, !0)
                  },
                })
                var V = c(Y, 4)
                er(V, {
                  placeholder: 'https://',
                  get value() {
                    return n(i)
                  },
                  set value(ne) {
                    L(i, ne, !0)
                  },
                })
                var X = c(V, 4)
                er(X, {
                  get value() {
                    return n(l)
                  },
                  set value(ne) {
                    L(l, ne, !0)
                  },
                })
                var te = c(X, 4)
                ;(Ma(
                  te,
                  () => n(v),
                  ne => L(v, ne)
                ),
                  p(R, K))
              }
              q($, R => {
                ;(n(g) || n(m)) && R(U)
              })
            }
            var C = c($, 2),
              G = u(C)
            ye(G, {
              variant: 'ghost',
              get onclick() {
                return t.onclose
              },
              children: (R, K) => {
                var Y = Q('Cancel')
                p(R, Y)
              },
              $$slots: { default: !0 },
            })
            var B = c(G, 2)
            {
              let R = J(() => !n(s) || n(d))
              ye(B, {
                get disabled() {
                  return n(R)
                },
                onclick: y,
                children: (K, Y) => {
                  var V = Q()
                  ;(F(() => z(V, n(d) ? 'Adding…' : 'Add provider')), p(K, V))
                },
                $$slots: { default: !0 },
              })
            }
            ;(yo(
              N,
              () => n(s),
              R => L(s, R)
            ),
              p(D, E))
          }
        q(x, D => {
          n(a) ? D(M) : D(T, -1)
        })
      }
      p(w, H)
    },
    $$slots: { default: !0 },
  }),
    pe())
}
var Jc = b(
  '<p style="color:var(--text-2);font-size:13.5px;line-height:1.6">Remove <strong style="color:var(--text-1)"> </strong> </p> <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
  1
)
function Xc(e, t) {
  fe(t, !0)
  {
    let r = J(() => !!t.provider)
    Pr(e, {
      get open() {
        return n(r)
      },
      title: 'Delete provider',
      get onclose() {
        return t.onclose
      },
      children: (a, s) => {
        var l = Jc(),
          i = ee(l),
          o = c(u(i)),
          v = u(o),
          d = c(o),
          h = c(i, 2),
          _ = u(h)
        ye(_, {
          variant: 'ghost',
          get onclick() {
            return t.onclose
          },
          children: (g, m) => {
            var y = Q('Cancel')
            p(g, y)
          },
          $$slots: { default: !0 },
        })
        var f = c(_, 2)
        ;(ye(f, {
          variant: 'danger',
          onclick: () => t.provider && t.onconfirm(t.provider),
          children: (g, m) => {
            var y = Q('Delete')
            p(g, y)
          },
          $$slots: { default: !0 },
        }),
          F(() => {
            var g, m
            ;(z(v, (g = t.provider) == null ? void 0 : g.name),
              z(
                d,
                ` and all ${((m = t.provider) == null ? void 0 : m.modelCount) ?? 0 ?? ''} of its models from anygate? This clears stored credentials.`
              ))
          }),
          p(a, l))
      },
      $$slots: { default: !0 },
    })
  }
  pe()
}
var Zc = b('<div class="grid svelte-1sgc4qo"></div>'),
  Qc = b('<p class="code svelte-1sgc4qo">Enter code: <strong> </strong></p>'),
  eu = b(
    '<div class="backdrop svelte-1sgc4qo" role="presentation"><div class="modal glass svelte-1sgc4qo" role="dialog" tabindex="-1"><h3 class="svelte-1sgc4qo"> </h3> <!> <!> <p class="note svelte-1sgc4qo">This window will close automatically once authentication completes.</p> <!></div></div>'
  ),
  tu = b(
    '<div class="page"><div class="head svelte-1sgc4qo"><div><h2 class="svelte-1sgc4qo">Providers & Keys</h2> <p class="sub svelte-1sgc4qo">Connect model providers via API key or OAuth. Refresh to pull the latest model list.</p></div> <div class="acts svelte-1sgc4qo"><!> <!></div></div> <!></div> <!> <!> <!>',
    1
  )
function ru(e, t) {
  fe(t, !0)
  let r = re(!1),
    a = re(null),
    s = re(null),
    l = re(''),
    i = re(''),
    o = re(null)
  async function v(I) {
    try {
      const P = await Ho(I.id)
      P.ok
        ? we(`Deleted ${I.name}`, 'success')
        : we(P.error ? String(P.error) : 'Delete failed', 'error')
    } catch (P) {
      we(P instanceof Error ? P.message : String(P), 'error')
    }
    ;(L(a, null), await Ta())
  }
  async function d(I) {
    const P = prompt(`API key for ${I.name}:`)
    if (P)
      try {
        ;(await Ro(I.id, P)).ok
          ? (we('Key saved', 'success'), await bl(I.id))
          : we('Save failed', 'error')
      } catch (A) {
        we(A instanceof Error ? A.message : String(A), 'error')
      }
  }
  async function h(I) {
    L(s, I, !0)
    try {
      const P = await Uo(I.id)
      ;(L(l, P.authUrl ?? P.url, !0),
        L(i, P.userCode ?? '', !0),
        P.sessionId &&
          L(
            o,
            setInterval(async () => {
              const A = await Go(P.sessionId)
              A.status !== 'pending' &&
                (n(o) && clearInterval(n(o)),
                A.status === 'done'
                  ? (we(`${I.name} connected`, 'success'), L(s, null), await Ta())
                  : we(A.error ?? 'OAuth failed', 'error'))
            }, 2e3),
            !0
          ),
        P.pkce && n(l) && window.open(n(l), '_blank'))
    } catch (P) {
      we(P instanceof Error ? P.message : String(P), 'error')
    }
  }
  var _ = tu(),
    f = ee(_),
    g = u(f),
    m = c(u(g), 2),
    y = u(m)
  ye(y, {
    variant: 'ghost',
    onclick: () => Ta(),
    children: (I, P) => {
      var A = Q('Refresh all')
      p(I, A)
    },
    $$slots: { default: !0 },
  })
  var w = c(y, 2)
  ye(w, {
    onclick: () => L(r, !0),
    children: (I, P) => {
      var A = Q('+ Add provider')
      p(I, A)
    },
    $$slots: { default: !0 },
  })
  var O = c(g, 2)
  {
    var H = I => {
        dr(I, { label: 'Loading providers…' })
      },
      x = I => {
        $r(I, {
          title: 'Could not load providers',
          icon: 'M12 8v5M12 17h.01',
          children: (P, A) => {
            var k = Q()
            ;(F(() => z(k, Me.error)), p(P, k))
          },
          $$slots: { default: !0 },
        })
      },
      M = I => {
        $r(I, {
          title: 'No providers yet',
          icon: 'M12 11h8M4 11h4M4 19h16',
          children: (P, A) => {
            var k = Q('Add a provider to start browsing models.')
            p(P, k)
          },
          $$slots: { default: !0 },
        })
      },
      T = I => {
        var P = Zc()
        ;(ke(
          P,
          21,
          () => Me.list,
          A => A.id,
          (A, k) => {
            Dc(A, {
              get provider() {
                return n(k)
              },
              onAddKey: d,
              onDelete: j => L(a, j, !0),
              onOAuth: h,
            })
          }
        ),
          p(I, P))
      }
    q(O, I => {
      Me.loading ? I(H) : Me.error ? I(x, 1) : Me.list.length === 0 ? I(M, 2) : I(T, -1)
    })
  }
  var D = c(f, 2)
  Yc(D, {
    get open() {
      return n(r)
    },
    onclose: () => L(r, !1),
    onadded: () => Ta(),
  })
  var E = c(D, 2)
  Xc(E, {
    get provider() {
      return n(a)
    },
    onclose: () => L(a, null),
    onconfirm: v,
  })
  var N = c(E, 2)
  {
    var W = I => {
      var P = eu(),
        A = u(P),
        k = u(A),
        j = u(k),
        $ = c(k, 2)
      {
        var U = R => {
          var K = Qc(),
            Y = c(u(K)),
            V = u(Y)
          ;(F(() => z(V, n(i))), p(R, K))
        }
        q($, R => {
          n(i) && R(U)
        })
      }
      var C = c($, 2)
      {
        var G = R => {
          ye(R, {
            onclick: () => window.open(n(l), '_blank'),
            children: (K, Y) => {
              var V = Q('Open sign-in page')
              p(K, V)
            },
            $$slots: { default: !0 },
          })
        }
        q(C, R => {
          n(l) && R(G)
        })
      }
      var B = c(C, 4)
      ;(ye(B, {
        variant: 'ghost',
        onclick: () => L(s, null),
        children: (R, K) => {
          var Y = Q('Close')
          p(R, Y)
        },
        $$slots: { default: !0 },
      }),
        F(() => z(j, `Sign in to ${n(s).name ?? ''}`)),
        oe('click', P, () => L(s, null)),
        oe('keydown', P, R => {
          R.key === 'Escape' && L(s, null)
        }),
        oe('click', A, R => R.stopPropagation()),
        oe('keydown', A, R => R.stopPropagation()),
        p(I, P))
    }
    q(N, I => {
      n(s) && I(W)
    })
  }
  ;(p(e, _), pe())
}
Fe(['click', 'keydown'])
const au = 'modulepreload',
  su = function (e) {
    return '/' + e
  },
  pn = {},
  nu = function (t, r, a) {
    let s = Promise.resolve()
    if (r && r.length > 0) {
      let i = function (d) {
        return Promise.all(
          d.map(h =>
            Promise.resolve(h).then(
              _ => ({ status: 'fulfilled', value: _ }),
              _ => ({ status: 'rejected', reason: _ })
            )
          )
        )
      }
      document.getElementsByTagName('link')
      const o = document.querySelector('meta[property=csp-nonce]'),
        v = (o == null ? void 0 : o.nonce) || (o == null ? void 0 : o.getAttribute('nonce'))
      s = i(
        r.map(d => {
          if (((d = su(d)), d in pn)) return
          pn[d] = !0
          const h = d.endsWith('.css'),
            _ = h ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${d}"]${_}`)) return
          const f = document.createElement('link')
          if (
            ((f.rel = h ? 'stylesheet' : au),
            h || (f.as = 'script'),
            (f.crossOrigin = ''),
            (f.href = d),
            v && f.setAttribute('nonce', v),
            document.head.appendChild(f),
            h)
          )
            return new Promise((g, m) => {
              ;(f.addEventListener('load', g),
                f.addEventListener('error', () => m(new Error(`Unable to preload CSS for ${d}`))))
            })
        })
      )
    }
    function l(i) {
      const o = new Event('vite:preloadError', { cancelable: !0 })
      if (((o.payload = i), window.dispatchEvent(o), !o.defaultPrevented)) throw i
    }
    return s.then(i => {
      for (const o of i || []) o.status === 'rejected' && l(o.reason)
      return t().catch(l)
    })
  }
var lu = b('<span class="group svelte-xohxs0"><!> <!> <!> <!> <!></span>')
function Ll(e, t) {
  fe(t, !0)
  var r = lu(),
    a = u(r)
  {
    var s = g => {
      Te(g, {
        tone: 'success',
        children: (m, y) => {
          var w = Q('Free')
          p(m, w)
        },
        $$slots: { default: !0 },
      })
    }
    q(a, g => {
      t.model.isFree && g(s)
    })
  }
  var l = c(a, 2)
  {
    var i = g => {
      Te(g, {
        tone: 'warning',
        children: (m, y) => {
          var w = Q()
          ;(F(() => z(w, t.model.freeLabel)), p(m, w))
        },
        $$slots: { default: !0 },
      })
    }
    q(l, g => {
      t.model.freeLabel && !t.model.isFree && g(i)
    })
  }
  var o = c(l, 2)
  {
    let g = J(() =>
      t.model.format === 'anthropic'
        ? 'accent'
        : t.model.format === 'unsupported'
          ? 'error'
          : 'neutral'
    )
    Te(o, {
      get tone() {
        return n(g)
      },
      children: (m, y) => {
        var w = Q()
        ;(F(() => z(w, t.model.format)), p(m, w))
      },
      $$slots: { default: !0 },
    })
  }
  var v = c(o, 2)
  {
    var d = g => {
        Te(g, {
          tone: 'accent',
          children: (m, y) => {
            var w = Q('vision')
            p(m, w)
          },
          $$slots: { default: !0 },
        })
      },
      h = J(() => {
        var g
        return (g = t.model.inputTypes) == null ? void 0 : g.includes('image')
      })
    q(v, g => {
      n(h) && g(d)
    })
  }
  var _ = c(v, 2)
  {
    var f = g => {
      Te(g, {
        tone: 'accent',
        children: (m, y) => {
          var w = Q('reasoning')
          p(m, w)
        },
        $$slots: { default: !0 },
      })
    }
    q(_, g => {
      t.model.reasoning && g(f)
    })
  }
  ;(p(e, r), pe())
}
var iu = b('<button> </button>'),
  ou = b(
    '<div class="info svelte-19h4ccs"><div class="name svelte-19h4ccs"> <span class="pid svelte-19h4ccs"> </span></div> <div class="meta svelte-19h4ccs"> </div></div> <div class="tags svelte-19h4ccs"><!></div> <!>',
    1
  ),
  vu = b('<div class="row clickable svelte-19h4ccs" role="button" tabindex="0"><!></div>'),
  du = b('<div class="row svelte-19h4ccs"><!></div>')
function cu(e, t) {
  fe(t, !0)
  const r = h => {
    var _ = ou(),
      f = ee(_),
      g = u(f),
      m = u(g),
      y = c(m),
      w = u(y),
      O = c(g, 2),
      H = u(O),
      x = c(f, 2),
      M = u(x)
    Ll(M, {
      get model() {
        return t.model
      },
    })
    var T = c(x, 2)
    {
      var D = E => {
        var N = iu()
        let W
        var I = u(N)
        ;(F(() => {
          ;((W = $e(N, 1, 'star svelte-19h4ccs', null, W, { on: a() })),
            be(N, 'title', a() ? 'Remove favorite' : 'Add favorite'),
            be(N, 'aria-label', a() ? 'Remove favorite' : 'Add favorite'),
            z(I, a() ? '★' : '☆'))
        }),
          oe('click', N, P => {
            ;(P.stopPropagation(), t.onToggleFav())
          }),
          p(E, N))
      }
      q(T, E => {
        t.onToggleFav && E(D)
      })
    }
    ;(F(
      (E, N) => {
        ;(z(m, t.model.name ?? t.model.id),
          z(w, `· ${t.providerId ?? ''}`),
          z(H, `ctx ${E ?? ''} · ${N ?? ''}`))
      },
      [() => s(t.model.contextWindow), () => l(t.model.cost)]
    ),
      p(h, _))
  }
  let a = _e(t, 'favorited', 3, !1)
  function s(h) {
    return h ? `${(h / 1e3).toFixed(0)}k` : '—'
  }
  function l(h) {
    if (!h || typeof h != 'object') return '—'
    const _ = h,
      f = []
    return (
      _.input != null && f.push(`$${_.input}/M in`),
      _.output != null && f.push(`$${_.output}/M out`),
      f.join(' · ') || '—'
    )
  }
  var i = Ze(),
    o = ee(i)
  {
    var v = h => {
        var _ = vu(),
          f = u(_)
        ;(r(f),
          oe('click', _, () => t.onOpen()),
          oe('keydown', _, g => {
            ;(g.key === 'Enter' || g.key === ' ') && (g.preventDefault(), t.onOpen())
          }),
          p(h, _))
      },
      d = h => {
        var _ = du(),
          f = u(_)
        ;(r(f), p(h, _))
      }
    q(o, h => {
      t.onOpen ? h(v) : h(d, -1)
    })
  }
  ;(p(e, i), pe())
}
Fe(['click', 'keydown'])
var uu = b('<option> </option>'),
  fu = b(
    '<div class="filters svelte-1y45iff"><input class="q svelte-1y45iff" placeholder="Search models…"/> <select class="s svelte-1y45iff"><option>All providers</option><!></select> <select class="s svelte-1y45iff"><option>Any format</option><option>anthropic</option><option>openai</option><option>unsupported</option></select> <select class="s svelte-1y45iff"><option>Free & paid</option><option>Free only</option><option>Paid only</option></select> <select class="s svelte-1y45iff"><option>Any reasoning</option><option>Reasoning</option><option>No reasoning</option></select> <select class="s svelte-1y45iff"><option>Any vision</option><option>Vision</option><option>No vision</option></select> <select class="s svelte-1y45iff"><option>Sort: context</option><option>Sort: cost</option><option>Sort: name</option></select></div>'
  )
function pu(e, t) {
  fe(t, !0)
  let r = _e(t, 'value', 15)
  function a(R, K) {
    var Y
    ;(r({ ...r(), [R]: K }), (Y = t.onchange) == null || Y.call(t, r()))
  }
  var s = fu(),
    l = u(s),
    i = c(l, 2),
    o = u(i)
  o.value = o.__value = ''
  var v = c(o)
  ke(
    v,
    17,
    () => t.providers,
    vr,
    (R, K) => {
      var Y = uu(),
        V = u(Y),
        X = {}
      ;(F(() => {
        ;(z(V, n(K).name), X !== (X = n(K).id) && (Y.value = (Y.__value = n(K).id) ?? ''))
      }),
        p(R, Y))
    }
  )
  var d
  Qt(i)
  var h = c(i, 2),
    _ = u(h)
  _.value = _.__value = ''
  var f = c(_)
  f.value = f.__value = 'anthropic'
  var g = c(f)
  g.value = g.__value = 'openai'
  var m = c(g)
  m.value = m.__value = 'unsupported'
  var y
  Qt(h)
  var w = c(h, 2),
    O = u(w)
  O.value = O.__value = ''
  var H = c(O)
  H.value = H.__value = 'free'
  var x = c(H)
  x.value = x.__value = 'paid'
  var M
  Qt(w)
  var T = c(w, 2),
    D = u(T)
  D.value = D.__value = ''
  var E = c(D)
  E.value = E.__value = 'yes'
  var N = c(E)
  N.value = N.__value = 'no'
  var W
  Qt(T)
  var I = c(T, 2),
    P = u(I)
  P.value = P.__value = ''
  var A = c(P)
  A.value = A.__value = 'yes'
  var k = c(A)
  k.value = k.__value = 'no'
  var j
  Qt(I)
  var $ = c(I, 2),
    U = u($)
  U.value = U.__value = 'ctx'
  var C = c(U)
  C.value = C.__value = 'cost'
  var G = c(C)
  G.value = G.__value = 'name'
  var B
  ;(Qt($),
    F(() => {
      ;(Bs(l, r().query),
        d !== (d = r().provider) &&
          ((i.value = (i.__value = r().provider) ?? ''), jt(i, r().provider)),
        y !== (y = r().format) && ((h.value = (h.__value = r().format) ?? ''), jt(h, r().format)),
        M !== (M = r().free) && ((w.value = (w.__value = r().free) ?? ''), jt(w, r().free)),
        W !== (W = r().reasoning) &&
          ((T.value = (T.__value = r().reasoning) ?? ''), jt(T, r().reasoning)),
        j !== (j = r().vision) && ((I.value = (I.__value = r().vision) ?? ''), jt(I, r().vision)),
        B !== (B = r().sort) && (($.value = ($.__value = r().sort) ?? ''), jt($, r().sort)))
    }),
    oe('input', l, R => a('query', R.currentTarget.value)),
    oe('change', i, R => a('provider', R.currentTarget.value)),
    oe('change', h, R => a('format', R.currentTarget.value)),
    oe('change', w, R => a('free', R.currentTarget.value)),
    oe('change', T, R => a('reasoning', R.currentTarget.value)),
    oe('change', I, R => a('vision', R.currentTarget.value)),
    oe('change', $, R => a('sort', R.currentTarget.value)),
    p(e, s),
    pe())
}
Fe(['input', 'change'])
var hu = b(
    '<div><div class="h svelte-1efx48s">Source backend</div><div class="v svelte-1efx48s"> </div></div>'
  ),
  _u = b(
    '<div class="stack svelte-1efx48s"><div><div class="h svelte-1efx48s">Name</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Model ID</div> <code class="v mono svelte-1efx48s"> </code></div> <div><div class="h svelte-1efx48s">Provider</div> <div class="v svelte-1efx48s"> <span class="sub svelte-1efx48s"> </span></div></div> <div class="grid svelte-1efx48s"><div><div class="h svelte-1efx48s">Context window</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Free</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Format</div><div class="v svelte-1efx48s"><!></div></div> <div><div class="h svelte-1efx48s">Reasoning</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Image input</div><div class="v svelte-1efx48s"> </div></div></div> <div><div class="h svelte-1efx48s">Cost</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Supported parameters</div> <div class="v chips svelte-1efx48s"></div></div> <!></div>'
  )
function gu(e, t) {
  fe(t, !0)
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
  ;(Dv(e, {
    get open() {
      return t.open
    },
    title: 'Model details',
    get onclose() {
      return t.onclose
    },
    children: (a, s) => {
      var l = Ze(),
        i = ee(l)
      {
        var o = v => {
          var d = _u(),
            h = u(d),
            _ = c(u(h), 2),
            f = u(_),
            g = c(h, 2),
            m = c(u(g), 2),
            y = u(m),
            w = c(g, 2),
            O = c(u(w), 2),
            H = u(O),
            x = c(H),
            M = u(x),
            T = c(w, 2),
            D = u(T),
            E = c(u(D)),
            N = u(E),
            W = c(D, 2),
            I = c(u(W)),
            P = u(I),
            A = c(W, 2),
            k = c(u(A)),
            j = u(k)
          Ll(j, {
            get model() {
              return t.model
            },
          })
          var $ = c(A, 2),
            U = c(u($)),
            C = u(U),
            G = c($, 2),
            B = c(u(G)),
            R = u(B),
            K = c(T, 2),
            Y = c(u(K), 2),
            V = u(Y),
            X = c(K, 2),
            te = c(u(X), 2)
          ke(
            te,
            21,
            () => t.model.supportedParameters ?? [],
            vr,
            (le, ce) => {
              Te(le, {
                tone: 'neutral',
                children: (Z, ie) => {
                  var Ie = Q()
                  ;(F(() => z(Ie, n(ce))), p(Z, Ie))
                },
                $$slots: { default: !0 },
              })
            }
          )
          var ne = c(X, 2)
          {
            var ae = le => {
              var ce = hu(),
                Z = c(u(ce)),
                ie = u(Z)
              ;(F(() => z(ie, t.model.sourceBackend)), p(le, ce))
            }
            q(ne, le => {
              t.model.sourceBackend && le(ae)
            })
          }
          ;(F(
            (le, ce, Z) => {
              ;(z(f, t.model.name ?? t.model.id),
                z(y, t.model.id),
                z(H, `${t.providerName ?? ''} `),
                z(M, `(${t.providerId ?? ''})`),
                z(N, le),
                z(P, t.model.isFree ? 'Yes' : (t.model.freeLabel ?? 'No')),
                z(C, t.model.reasoning ? 'Supported' : 'No'),
                z(R, ce),
                z(V, Z))
            },
            [
              () =>
                t.model.contextWindow ? t.model.contextWindow.toLocaleString() + ' tokens' : '—',
              () => {
                var le
                return (le = t.model.inputTypes) != null && le.includes('image')
                  ? 'Supported'
                  : 'No'
              },
              () => r(t.model.cost),
            ]
          ),
            p(v, d))
        }
        q(i, v => {
          t.model && v(o)
        })
      }
      p(a, l)
    },
    $$slots: { default: !0 },
  }),
    pe())
}
var mu = b(
  '<div class="item svelte-drwign" role="listitem" draggable="true"><span class="handle svelte-drwign" title="Drag to reorder">⠿⠿⠿</span> <span class="idx svelte-drwign"> </span> <!> <div class="meta svelte-drwign"><div class="name svelte-drwign"> </div> <div class="sub svelte-drwign"> </div></div> <button class="x svelte-drwign" title="Remove">×</button></div>'
)
function yu(e, t) {
  fe(t, !0)
  var r = mu(),
    a = c(u(r), 2),
    s = u(a),
    l = c(a, 2)
  Ks(l, {
    get id() {
      return t.fav.providerId
    },
    size: 28,
  })
  var i = c(l, 2),
    o = u(i),
    v = u(o),
    d = c(o, 2),
    h = u(d),
    _ = c(i, 2)
  ;(F(() => {
    ;(z(s, t.index + 1), z(v, t.fav.model), z(h, t.fav.providerName))
  }),
    Na('dragstart', r, function (...f) {
      var g
      ;(g = t.ondragstart) == null || g.apply(this, f)
    }),
    Na('dragover', r, f => f.preventDefault()),
    Na('drop', r, function (...f) {
      var g
      ;(g = t.ondrop) == null || g.apply(this, f)
    }),
    oe('click', _, function (...f) {
      var g
      ;(g = t.onremove) == null || g.apply(this, f)
    }),
    p(e, r),
    pe())
}
Fe(['click'])
var wu = b('<div class="list svelte-156gwh2"><!> <div class="cap svelte-156gwh2"> </div></div>')
function bu(e, t) {
  fe(t, !0)
  let r = re(null)
  function a(_, f) {
    var g
    ;(L(r, _, !0), (g = f.dataTransfer) == null || g.setData('text/plain', String(_)))
  }
  function s(_) {
    if (n(r) === null || n(r) === _) return
    const f = [...t.items],
      [g] = f.splice(n(r), 1)
    ;(f.splice(_, 0, g), L(r, null), t.onreorder(f))
  }
  var l = wu(),
    i = u(l)
  {
    var o = _ => {
        $r(_, {
          title: 'No favorites yet',
          icon: 'M12 5v14M5 12h14',
          children: (f, g) => {
            var m = Q('Star models from the Models tab to build your quick-launch list.')
            p(f, m)
          },
          $$slots: { default: !0 },
        })
      },
      v = _ => {
        var f = Ze(),
          g = ee(f)
        ;(ke(
          g,
          19,
          () => t.items,
          m => m.providerId + '/' + m.modelId,
          (m, y, w) => {
            yu(m, {
              get fav() {
                return n(y)
              },
              get index() {
                return n(w)
              },
              onremove: () => t.onremove(n(y)),
              ondragstart: O => a(n(w), O),
              ondrop: () => s(n(w)),
            })
          }
        ),
          p(_, f))
      }
    q(i, _ => {
      t.items.length === 0 ? _(o) : _(v, -1)
    })
  }
  var d = c(i, 2),
    h = u(d)
  ;(F(() => z(h, `${t.items.length ?? ''} / ${t.max ?? ''} used`)), p(e, l), pe())
}
var xu = b(
  '<div class="meter svelte-19jc277"><div class="top svelte-19jc277"><span> </span><span class="n svelte-19jc277"> </span></div> <div class="track svelte-19jc277"><div></div></div></div>'
)
function ku(e, t) {
  let r = _e(t, 'label', 3, '')
  const a = J(() => Math.min(100, Math.round((t.used / t.max) * 100))),
    s = J(() => t.used >= t.max)
  var l = xu(),
    i = u(l),
    o = u(i),
    v = u(o),
    d = c(o),
    h = u(d),
    _ = c(i, 2),
    f = u(_)
  let g
  ;(F(() => {
    ;(z(v, r()),
      z(h, `${t.used ?? ''}/${t.max ?? ''}`),
      (g = $e(f, 1, 'fill svelte-19jc277', null, g, { full: n(s) })),
      qe(f, `width:${n(a) ?? ''}%`))
  }),
    p(e, l))
}
var Su = b(
    '<div class="fav-head svelte-p8xmpw"><h3 class="svelte-p8xmpw">Favorites</h3> <!></div> <!> <div style="margin-top:14px"><!></div>',
    1
  ),
  Pu = b(
    '<div class="page"><div class="head svelte-p8xmpw"><h2 class="svelte-p8xmpw">Models</h2> <p class="sub svelte-p8xmpw">Browse every model anygate can route. Star any model to add it to your favorites.</p></div> <div class="layout svelte-p8xmpw"><div class="main-col"><!> <!></div> <aside class="fav-col"><!></aside></div></div> <!>',
    1
  )
function Eu(e, t) {
  fe(t, !0)
  let r = re(
      Le({ provider: '', format: '', free: '', reasoning: '', vision: '', query: '', sort: 'ctx' })
    ),
    a = re(null),
    s = re('general')
  const l = J(() =>
    Me.list.flatMap(E =>
      E.enrichedModels.map(N => ({ model: N, providerId: E.id, providerName: E.name }))
    )
  )
  function i(E) {
    if (!E || typeof E != 'object') return 0
    const N = E
    return (N.input ?? 0) + (N.output ?? 0)
  }
  const o = J(() =>
    n(l)
      .filter(E => {
        var N, W
        return (
          (!n(r).provider || E.providerId === n(r).provider) &&
          (!n(r).format || E.model.format === n(r).format) &&
          (!n(r).free || (n(r).free === 'free' ? E.model.isFree : !E.model.isFree)) &&
          (!n(r).reasoning ||
            (n(r).reasoning === 'yes' ? E.model.reasoning : !E.model.reasoning)) &&
          (!n(r).vision ||
            (n(r).vision === 'yes'
              ? (N = E.model.inputTypes) == null
                ? void 0
                : N.includes('image')
              : !((W = E.model.inputTypes) != null && W.includes('image')))) &&
          (!n(r).query ||
            (E.model.name ?? E.model.id).toLowerCase().includes(n(r).query.toLowerCase()) ||
            E.model.id.toLowerCase().includes(n(r).query.toLowerCase()))
        )
      })
      .sort((E, N) =>
        n(r).sort === 'name'
          ? (E.model.name ?? E.model.id).localeCompare(N.model.name ?? N.model.id)
          : n(r).sort === 'cost'
            ? i(E.model.cost) - i(N.model.cost)
            : (N.model.contextWindow ?? 0) - (E.model.contextWindow ?? 0)
      )
  )
  function v(E, N) {
    return (n(s) === 'agy' ? me.agy : me.general).some(I => I.providerId === E && I.modelId === N)
  }
  async function d(E) {
    const N = E.model
    if (v(E.providerId, N.id)) await Ps(E.providerId, N.id, n(s) === 'agy')
    else {
      const W = {
        providerId: E.providerId,
        providerName: E.providerName,
        model: N.id,
        modelId: N.id,
        contextWindow: N.contextWindow,
        cost: N.cost,
      }
      await Sl(W, n(s) === 'agy')
    }
  }
  async function h(E) {
    ;(n(s) === 'agy' ? (me.agy = E) : (me.general = E),
      await nu(() => Promise.resolve().then(() => _v), void 0).then(N =>
        N.reorder(E, n(s) === 'agy')
      ))
  }
  var _ = Pu(),
    f = ee(_),
    g = c(u(f), 2),
    m = u(g),
    y = u(m)
  {
    let E = J(() => Me.list.map(N => ({ id: N.id, name: N.name })))
    pu(y, {
      get providers() {
        return n(E)
      },
      get value() {
        return n(r)
      },
      set value(N) {
        L(r, N, !0)
      },
    })
  }
  var w = c(y, 2)
  {
    var O = E => {
        dr(E, { label: 'Loading models…' })
      },
      H = E => {
        $r(E, {
          title: 'No models match',
          icon: 'M4 6h16M4 12h16M4 18h16',
          children: (N, W) => {
            var I = Q('Adjust filters or connect more providers.')
            p(N, I)
          },
          $$slots: { default: !0 },
        })
      },
      x = E => {
        Ae(E, {
          padding: '6px',
          children: (N, W) => {
            var I = Ze(),
              P = ee(I)
            ;(ke(
              P,
              17,
              () => n(o),
              A => A.providerId + '/' + A.model.id,
              (A, k) => {
                {
                  let j = J(() => v(n(k).providerId, n(k).model.id))
                  cu(A, {
                    get model() {
                      return n(k).model
                    },
                    get providerId() {
                      return n(k).providerId
                    },
                    get favorited() {
                      return n(j)
                    },
                    onToggleFav: () => d(n(k)),
                    onOpen: () => L(a, n(k), !0),
                  })
                }
              }
            ),
              p(N, I))
          },
          $$slots: { default: !0 },
        })
      }
    q(w, E => {
      Me.loading ? E(O) : n(o).length === 0 ? E(H, 1) : E(x, -1)
    })
  }
  var M = c(m, 2),
    T = u(M)
  Ae(T, {
    padding: '18px',
    children: (E, N) => {
      var W = Su(),
        I = ee(W),
        P = c(u(I), 2)
      {
        let $ = J(() => (n(s) === 'agy' ? me.agy.length : me.general.length)),
          U = J(() => (n(s) === 'agy' ? 6 : 20)),
          C = J(() => (n(s) === 'agy' ? 'AGY' : 'General'))
        ku(P, {
          get used() {
            return n($)
          },
          get max() {
            return n(U)
          },
          get label() {
            return n(C)
          },
        })
      }
      var A = c(I, 2)
      Ol(A, {
        tabs: [
          { id: 'general', label: 'General (20)' },
          { id: 'agy', label: 'AGY (6)' },
        ],
        get active() {
          return n(s)
        },
        set active($) {
          L(s, $, !0)
        },
      })
      var k = c(A, 2),
        j = u(k)
      {
        let $ = J(() => (n(s) === 'agy' ? me.agy : me.general)),
          U = J(() => (n(s) === 'agy' ? 6 : 20))
        bu(j, {
          get items() {
            return n($)
          },
          get max() {
            return n(U)
          },
          onreorder: h,
          onremove: C => Ps(C.providerId, C.modelId, n(s) === 'agy'),
        })
      }
      p(E, W)
    },
    $$slots: { default: !0 },
  })
  var D = c(f, 2)
  {
    let E = J(() => !!n(a)),
      N = J(() => {
        var P
        return ((P = n(a)) == null ? void 0 : P.model) ?? null
      }),
      W = J(() => {
        var P
        return ((P = n(a)) == null ? void 0 : P.providerId) ?? ''
      }),
      I = J(() => {
        var P
        return ((P = n(a)) == null ? void 0 : P.providerName) ?? ''
      })
    gu(D, {
      get open() {
        return n(E)
      },
      get model() {
        return n(N)
      },
      get providerId() {
        return n(W)
      },
      get providerName() {
        return n(I)
      },
      onclose: () => L(a, null),
    })
  }
  ;(p(e, _), pe())
}
var Mu = b('<div class="path svelte-1gp522a"> </div>'),
  zu = b(
    '<div class="favs svelte-1gp522a"><span class="star svelte-1gp522a">★</span> <span> </span></div>'
  ),
  Au = b('<a class="install-link svelte-1gp522a" target="_blank" rel="noopener noreferrer"> </a>'),
  Tu = b(
    '<code class="cmd svelte-1gp522a"> </code> <button class="copy svelte-1gp522a" type="button">Copy</button>',
    1
  ),
  $u = b('<div class="install svelte-1gp522a"><!></div>'),
  Cu = b(
    '<div class="card svelte-1gp522a"><div class="head svelte-1gp522a"><div><!></div> <div class="meta svelte-1gp522a"><div class="name svelte-1gp522a"> </div> <div class="sub svelte-1gp522a"> </div></div> <!></div> <!> <!> <!> <div class="actions svelte-1gp522a"><!> <!></div></div>'
  )
function Iu(e, t) {
  fe(t, !0)
  let r = _e(t, 'favCount', 3, 0)
  var a = Cu(),
    s = u(a),
    l = u(s)
  let i
  var o = u(l)
  Ks(o, {
    get id() {
      return t.app.id
    },
    size: 38,
  })
  var v = c(l, 2),
    d = u(v),
    h = u(d),
    _ = c(d, 2),
    f = u(_),
    g = c(v, 2)
  {
    var m = W => {
        Te(W, {
          tone: 'success',
          children: (I, P) => {
            var A = Q('Installed')
            p(I, A)
          },
          $$slots: { default: !0 },
        })
      },
      y = W => {
        Te(W, {
          tone: 'warning',
          children: (I, P) => {
            var A = Q('Not installed')
            p(I, A)
          },
          $$slots: { default: !0 },
        })
      }
    q(g, W => {
      t.app.installed ? W(m) : W(y, -1)
    })
  }
  var w = c(s, 2)
  {
    var O = W => {
      var I = Mu(),
        P = u(I)
      ;(F(() => {
        ;(be(I, 'title', t.app.path), z(P, t.app.path))
      }),
        p(W, I))
    }
    q(w, W => {
      t.app.path && W(O)
    })
  }
  var H = c(w, 2)
  {
    var x = W => {
      var I = zu(),
        P = c(u(I), 2),
        A = u(P)
      ;(F(() => z(A, `${r() ?? ''} favorite${r() === 1 ? '' : 's'} ready`)), p(W, I))
    }
    q(H, W => {
      r() > 0 && W(x)
    })
  }
  var M = c(H, 2)
  {
    var T = W => {
      var I = $u(),
        P = u(I)
      {
        var A = j => {
            var $ = Au(),
              U = u($)
            ;(F(() => {
              ;(be($, 'href', t.app.installUrl), z(U, `Get ${t.app.name ?? ''} →`))
            }),
              p(j, $))
          },
          k = j => {
            var $ = Tu(),
              U = ee($),
              C = u(U),
              G = c(U, 2)
            ;(F(() => z(C, t.app.installHint)),
              oe('click', G, () => {
                var B
                return (B = navigator.clipboard) == null
                  ? void 0
                  : B.writeText(t.app.installHint ?? '')
              }),
              p(j, $))
          }
        q(P, j => {
          t.app.installUrl ? j(A) : t.app.installHint && j(k, 1)
        })
      }
      p(W, I)
    }
    q(M, W => {
      t.app.installed || W(T)
    })
  }
  var D = c(M, 2),
    E = u(D)
  ye(E, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => t.onsetpath(t.app),
    children: (W, I) => {
      var P = Q('Path')
      p(W, P)
    },
    $$slots: { default: !0 },
  })
  var N = c(E, 2)
  {
    let W = J(() => !t.app.installed)
    ye(N, {
      size: 'sm',
      variant: 'primary',
      get disabled() {
        return n(W)
      },
      onclick: () => t.onlaunch(t.app),
      children: (I, P) => {
        var A = Q()
        ;(F(() => z(A, r() > 0 ? 'Launch with favorites' : 'Launch')), p(I, A))
      },
      $$slots: { default: !0 },
    })
  }
  ;(F(() => {
    ;((i = $e(l, 1, 'logo svelte-1gp522a', null, i, { dim: !t.app.installed })),
      z(h, t.app.name),
      z(f, t.app.type === 'cli' ? 'CLI' : 'Desktop app'))
  }),
    p(e, a),
    pe())
}
Fe(['click'])
var Ou = b('<div class="grid svelte-ishglm"></div>'),
  Lu = b(
    '<div class="opts svelte-ishglm"><span class="lbl svelte-ishglm">Provider</span> <!> <span class="lbl svelte-ishglm">Model</span> <!></div>'
  ),
  Fu = b(
    '<div class="hintbox svelte-ishglm"><!> <span>Opens the app with every favorite routed through one anygate gateway — switch live from the in-app model menu.</span></div>'
  ),
  Ru = b('<button class="recent svelte-ishglm"> </button>'),
  Nu = b('<div class="recents svelte-ishglm"></div>'),
  Du = b(
    '<div class="modes svelte-ishglm"><button><span class="mode-ico svelte-ishglm">★</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">All favorites</span> <span class="mode-desc svelte-ishglm"> </span></span></button> <button><span class="mode-ico svelte-ishglm">◉</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">One model</span> <span class="mode-desc svelte-ishglm">Launch with a single pre-selected model</span></span></button> <button><span class="mode-ico svelte-ishglm">⤢</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">Just open</span> <span class="mode-desc svelte-ishglm">Launch the app with no model pre-set</span></span></button></div> <!> <div class="opts svelte-ishglm" style="margin-top:16px"><span class="lbl svelte-ishglm">Launch folder</span> <div class="folder svelte-ishglm"><!> <!></div> <!></div> <div class="row svelte-ishglm" style="margin-top:22px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  ju = b(
    '<span class="lbl svelte-ishglm">Executable path</span> <div class="folder svelte-ishglm"><!> <!></div> <div class="row svelte-ishglm" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  qu = b(
    `<div class="page"><div class="head svelte-ishglm"><div><h2 class="svelte-ishglm">Apps & Launch</h2> <p class="sub svelte-ishglm">Open Claude, Codex, Gemini, or Antigravity with your anygate models pre-wired. Pick a launch folder per app, or send your whole favorites catalog into the app's model switcher.</p></div></div> <!></div> <!> <!>`,
    1
  )
function Bu(e, t) {
  fe(t, !0)
  let r = re(null),
    a = re('favorites'),
    s = re(''),
    l = re(''),
    i = re(''),
    o = re(null),
    v = re('')
  const d = J(() => We.list.find(A => A.id === n(r))),
    h = J(() =>
      n(d) && (n(d).id === 'antigravity' || n(d).id === 'agy' || n(d).id === 'antigravity-ide')
        ? me.agy.length
        : me.general.length
    ),
    _ = J(() => {
      var A
      return n(s)
        ? (((A = Me.list.find(k => k.id === n(s))) == null ? void 0 : A.enrichedModels) ?? []).map(
            k => ({ value: k.id, label: k.name ?? k.id })
          )
        : []
    })
  async function f(A) {
    ;(L(r, A.id, !0), L(a, n(h) > 0 ? 'favorites' : 'specific', !0), L(s, ''), L(l, ''), L(i, ''))
    const k = We.recentFolders
    L(i, k[0] ?? '', !0)
  }
  async function g() {
    n(r) &&
      (n(a) === 'favorites'
        ? await is({ appId: n(r), favoritesCatalog: !0, cwd: n(i) || void 0 })
        : n(a) === 'specific'
          ? await is({
              appId: n(r),
              providerId: n(s) || void 0,
              modelId: n(l) || void 0,
              cwd: n(i) || void 0,
            })
          : await is({ appId: n(r), cwd: n(i) || void 0 }),
      L(r, null))
  }
  async function m(A) {
    ;(L(o, A, !0), L(v, A.path ?? '', !0))
  }
  async function y() {
    n(o) && (await mv(n(o).id, n(v).trim() || null), L(o, null))
  }
  async function w() {
    const A = await dn()
    A && L(i, A, !0)
  }
  async function O() {
    const A = await dn()
    A && L(v, A, !0)
  }
  var H = qu(),
    x = ee(H),
    M = c(u(x), 2)
  {
    var T = A => {
        dr(A, { label: 'Detecting installed apps…' })
      },
      D = A => {
        $r(A, {
          title: 'No apps found',
          icon: 'M2 3h20v14H2z',
          children: (k, j) => {
            var $ = Q("anygate couldn't detect supported apps on this system.")
            p(k, $)
          },
          $$slots: { default: !0 },
        })
      },
      E = A => {
        var k = Ou()
        ;(ke(
          k,
          21,
          () => We.list,
          j => j.id,
          (j, $) => {
            {
              let U = J(() =>
                n($).id === 'antigravity' || n($).id === 'agy' || n($).id === 'antigravity-ide'
                  ? me.agy.length
                  : me.general.length
              )
              Iu(j, {
                get app() {
                  return n($)
                },
                get favCount() {
                  return n(U)
                },
                onlaunch: f,
                onsetpath: m,
              })
            }
          }
        ),
          p(A, k))
      }
    q(M, A => {
      We.loading ? A(T) : We.list.length === 0 ? A(D, 1) : A(E, -1)
    })
  }
  var N = c(x, 2)
  {
    var W = A => {
      {
        let k = J(() => !!n(d)),
          j = J(() => `Launch ${n(d).name}`)
        Pr(A, {
          get open() {
            return n(k)
          },
          get title() {
            return n(j)
          },
          onclose: () => L(r, null),
          children: ($, U) => {
            var C = Du(),
              G = ee(C),
              B = u(G)
            let R
            var K = c(u(B), 2),
              Y = c(u(K), 2),
              V = u(Y),
              X = c(B, 2)
            let te
            var ne = c(X, 2)
            let ae
            var le = c(G, 2)
            {
              var ce = Ee => {
                  var je = Lu(),
                    Ke = c(u(je), 2)
                  {
                    let et = J(() => [
                      { value: '', label: 'All' },
                      ...Me.list.map(Ge => ({ value: Ge.id, label: Ge.name })),
                    ])
                    lr(Ke, {
                      get options() {
                        return n(et)
                      },
                      get value() {
                        return n(s)
                      },
                      set value(Ge) {
                        L(s, Ge, !0)
                      },
                    })
                  }
                  var Ue = c(Ke, 4)
                  {
                    let et = J(() => !n(s)),
                      Ge = J(() =>
                        n(s)
                          ? [{ value: '', label: 'All' }, ...n(_)]
                          : [{ value: '', label: '— pick a provider first —' }]
                      )
                    lr(Ue, {
                      get disabled() {
                        return n(et)
                      },
                      get options() {
                        return n(Ge)
                      },
                      get value() {
                        return n(l)
                      },
                      set value(Ja) {
                        L(l, Ja, !0)
                      },
                    })
                  }
                  p(Ee, je)
                },
                Z = Ee => {
                  var je = Fu(),
                    Ke = u(je)
                  ;(Te(Ke, {
                    tone: 'success',
                    children: (Ue, et) => {
                      var Ge = Q()
                      ;(F(() => z(Ge, `${n(h) ?? ''} favorites`)), p(Ue, Ge))
                    },
                    $$slots: { default: !0 },
                  }),
                    p(Ee, je))
                }
              q(le, Ee => {
                n(a) === 'specific' ? Ee(ce) : n(a) === 'favorites' && Ee(Z, 1)
              })
            }
            var ie = c(le, 2),
              Ie = c(u(ie), 2),
              yt = u(Ie)
            er(yt, {
              placeholder: 'Path or browse…',
              get value() {
                return n(i)
              },
              set value(Ee) {
                L(i, Ee, !0)
              },
            })
            var Nt = c(yt, 2)
            ye(Nt, {
              size: 'sm',
              variant: 'ghost',
              onclick: w,
              children: (Ee, je) => {
                var Ke = Q('Browse')
                p(Ee, Ke)
              },
              $$slots: { default: !0 },
            })
            var Jt = c(Ie, 2)
            {
              var Xt = Ee => {
                  var je = Nu()
                  ;(ke(
                    je,
                    21,
                    () => We.recentFolders.filter(Ke => Ke !== n(i)).slice(0, 4),
                    vr,
                    (Ke, Ue) => {
                      var et = Ru(),
                        Ge = u(et)
                      ;(F(() => z(Ge, n(Ue))), oe('click', et, () => L(i, n(Ue), !0)), p(Ke, et))
                    }
                  ),
                    p(Ee, je))
                },
                dt = J(() => We.recentFolders.filter(Ee => Ee !== n(i)).length)
              q(Jt, Ee => {
                n(dt) && Ee(Xt)
              })
            }
            var zt = c(ie, 2),
              Dt = u(zt)
            ye(Dt, {
              variant: 'ghost',
              onclick: () => L(r, null),
              children: (Ee, je) => {
                var Ke = Q('Cancel')
                p(Ee, Ke)
              },
              $$slots: { default: !0 },
            })
            var At = c(Dt, 2)
            {
              let Ee = J(() => !n(d).installed || (n(a) === 'specific' && !!n(s) && !n(l)))
              ye(At, {
                get disabled() {
                  return n(Ee)
                },
                onclick: g,
                children: (je, Ke) => {
                  var Ue = Q('Launch')
                  p(je, Ue)
                },
                $$slots: { default: !0 },
              })
            }
            ;(F(() => {
              ;((R = $e(B, 1, 'mode svelte-ishglm', null, R, { active: n(a) === 'favorites' })),
                (B.disabled = n(h) === 0),
                z(V, n(h) > 0 ? `${n(h)} models into the app switcher` : 'No favorites saved yet'),
                (te = $e(X, 1, 'mode svelte-ishglm', null, te, { active: n(a) === 'specific' })),
                (ae = $e(ne, 1, 'mode svelte-ishglm', null, ae, { active: n(a) === 'open' })))
            }),
              oe('click', B, () => L(a, 'favorites')),
              oe('click', X, () => L(a, 'specific')),
              oe('click', ne, () => L(a, 'open')),
              p($, C))
          },
          $$slots: { default: !0 },
        })
      }
    }
    q(N, A => {
      n(d) && A(W)
    })
  }
  var I = c(N, 2)
  {
    var P = A => {
      {
        let k = J(() => !!n(o)),
          j = J(() => `Set path → ${n(o).name}`)
        Pr(A, {
          get open() {
            return n(k)
          },
          get title() {
            return n(j)
          },
          onclose: () => L(o, null),
          children: ($, U) => {
            var C = ju(),
              G = c(ee(C), 2),
              B = u(G)
            er(B, {
              placeholder: '/path/to/executable',
              get value() {
                return n(v)
              },
              set value(X) {
                L(v, X, !0)
              },
            })
            var R = c(B, 2)
            ye(R, {
              size: 'sm',
              variant: 'ghost',
              onclick: O,
              children: (X, te) => {
                var ne = Q('Browse')
                p(X, ne)
              },
              $$slots: { default: !0 },
            })
            var K = c(G, 2),
              Y = u(K)
            ye(Y, {
              variant: 'ghost',
              onclick: () => L(o, null),
              children: (X, te) => {
                var ne = Q('Cancel')
                p(X, ne)
              },
              $$slots: { default: !0 },
            })
            var V = c(Y, 2)
            ;(ye(V, {
              onclick: y,
              children: (X, te) => {
                var ne = Q('Save')
                p(X, ne)
              },
              $$slots: { default: !0 },
            }),
              p($, C))
          },
          $$slots: { default: !0 },
        })
      }
    }
    q(I, A => {
      n(o) && A(P)
    })
  }
  ;(p(e, H), pe())
}
Fe(['click'])
var Hu = b('<!> <!>', 1)
function Uu(e, t) {
  fe(t, !0)
  var r = Ze(),
    a = ee(r)
  {
    var s = i => {
        var o = Hu(),
          v = ee(o)
        Te(v, {
          tone: 'success',
          children: (_, f) => {
            var g = Q()
            ;(F(() => z(g, `Running · ${t.status.listenMode === 'network' ? 'Network' : 'Local'}`)),
              p(_, g))
          },
          $$slots: { default: !0 },
        })
        var d = c(v, 2)
        {
          var h = _ => {
            Te(_, {
              tone: 'neutral',
              children: (f, g) => {
                var m = Q()
                ;(F(() => z(m, `${t.status.models.length ?? ''} models`)), p(f, m))
              },
              $$slots: { default: !0 },
            })
          }
          q(d, _ => {
            t.status.models && _(h)
          })
        }
        p(i, o)
      },
      l = i => {
        Te(i, {
          tone: 'neutral',
          children: (o, v) => {
            var d = Q('Stopped')
            p(o, d)
          },
          $$slots: { default: !0 },
        })
      }
    q(a, i => {
      var o
      ;(o = t.status) != null && o.running ? i(s) : i(l, -1)
    })
  }
  ;(p(e, r), pe())
}
var Gu = b(
    '<div class="url svelte-swldy1"><span class="lbl svelte-swldy1"> </span><code class="svelte-swldy1"> </code></div>'
  ),
  Wu = b(
    '<!> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Key</span><code class="svelte-swldy1"> </code></div>',
    1
  ),
  Ku = b('<div class="summary svelte-swldy1"> </div>'),
  Vu = b(
    '<div class="urls svelte-swldy1"><div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Anthropic</span><code class="svelte-swldy1"> </code></div> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">OpenAI</span><code class="svelte-swldy1"> </code></div> <!></div> <!>',
    1
  ),
  Yu = b(
    '<span class="lbl svelte-swldy1">Server password</span> <input class="inp svelte-swldy1" placeholder="required for network"/> <!>',
    1
  ),
  Ju = b('<div class="opts svelte-swldy1"><!> <!> <!> <!> <!></div>'),
  Xu = b(
    '<div class="panel svelte-swldy1"><div class="row svelte-swldy1"><div><h3 class="svelte-swldy1">Server Gateway</h3> <p class="desc svelte-swldy1">Expose your anygate models over a local OpenAI/Anthropic-compatible endpoint.</p></div> <!></div> <!> <div class="actions svelte-swldy1"><!></div></div>'
  )
function Zu(e, t) {
  fe(t, !0)
  let r = re(!1),
    a = re(!1),
    s = re(!1),
    l = re('local'),
    i = re(''),
    o = re(!0)
  const v = J(() => Je.status)
  function d() {
    n(v) &&
      (L(r, n(v).saved.favoritesOnly, !0),
      L(a, n(v).saved.freeModelsOnly, !0),
      L(s, n(v).saved.maskGatewayIds, !0),
      L(l, n(v).saved.listenMode, !0))
  }
  Lt(() => {
    n(v) && d()
  })
  async function h() {
    var M, T, D
    if ((M = n(v)) != null && M.running) {
      await Av()
      return
    }
    ;(n(l) === 'network' && !n(i).trim() && L(i, Math.random().toString(36).slice(2, 12), !0),
      !(await zv({
        favoritesOnly: n(r),
        freeModelsOnly: n(a),
        exposedProviders: null,
        maskGatewayIds: n(s),
        listenMode: n(l),
        passwordMode: 'new',
        password: n(i),
        savePassword: n(o),
      })) &&
        (T = Je.error) != null &&
        T.includes('No providers') &&
        ((D = t.onneedsmodels) == null || D.call(t)))
  }
  var _ = Xu(),
    f = u(_),
    g = c(u(f), 2)
  Uu(g, {
    get status() {
      return n(v)
    },
  })
  var m = c(f, 2)
  {
    var y = x => {
        var M = Vu(),
          T = ee(M),
          D = u(T),
          E = c(u(D)),
          N = u(E),
          W = c(D, 2),
          I = c(u(W)),
          P = u(I),
          A = c(W, 2)
        {
          var k = U => {
            var C = Wu(),
              G = ee(C)
            ke(
              G,
              17,
              () => n(v).networkUrls,
              vr,
              (Y, V) => {
                var X = Gu(),
                  te = u(X),
                  ne = u(te),
                  ae = c(te),
                  le = u(ae)
                ;(F(() => {
                  ;(z(ne, n(V).name), z(le, n(V).anthropicUrl))
                }),
                  p(Y, X))
              }
            )
            var B = c(G, 2),
              R = c(u(B)),
              K = u(R)
            ;(F(() => z(K, n(v).apiKey)), p(U, C))
          }
          q(A, U => {
            n(v).listenMode === 'network' && n(v).networkUrls && U(k)
          })
        }
        var j = c(T, 2)
        {
          var $ = U => {
            var C = Ku(),
              G = u(C)
            ;(F(() => z(G, n(v).providerSummary)), p(U, C))
          }
          q(j, U => {
            n(v).providerSummary && U($)
          })
        }
        ;(F(() => {
          ;(z(N, n(v).anthropicUrl), z(P, n(v).openaiUrl))
        }),
          p(x, M))
      },
      w = x => {
        var M = Ju(),
          T = u(M)
        aa(T, {
          label: 'Favorites only',
          get checked() {
            return n(r)
          },
          set checked(P) {
            L(r, P, !0)
          },
        })
        var D = c(T, 2)
        aa(D, {
          label: 'Free models only',
          get checked() {
            return n(a)
          },
          set checked(P) {
            L(a, P, !0)
          },
        })
        var E = c(D, 2)
        aa(E, {
          label: 'Mask gateway IDs',
          get checked() {
            return n(s)
          },
          set checked(P) {
            L(s, P, !0)
          },
        })
        var N = c(E, 2)
        {
          let P = J(() => n(l) === 'network')
          aa(N, {
            get checked() {
              return n(P)
            },
            onchange: A => L(l, A ? 'network' : 'local', !0),
            label: 'Network mode',
          })
        }
        var W = c(N, 2)
        {
          var I = P => {
            var A = Yu(),
              k = c(ee(A), 2),
              j = c(k, 2)
            ;(aa(j, {
              label: 'Save password',
              get checked() {
                return n(o)
              },
              set checked($) {
                L(o, $, !0)
              },
            }),
              Ma(
                k,
                () => n(i),
                $ => L(i, $)
              ),
              p(P, A))
          }
          q(W, P => {
            n(l) === 'network' && P(I)
          })
        }
        p(x, M)
      }
    q(m, x => {
      var M
      ;(M = n(v)) != null && M.running ? x(y) : x(w, -1)
    })
  }
  var O = c(m, 2),
    H = u(O)
  {
    let x = J(() => {
      var M
      return (M = n(v)) != null && M.running ? 'danger' : 'primary'
    })
    ye(H, {
      get variant() {
        return n(x)
      },
      get disabled() {
        return Je.starting
      },
      onclick: h,
      children: (M, T) => {
        var D = Q()
        ;(F(() => {
          var E
          return z(
            D,
            Je.starting
              ? 'Working…'
              : (E = n(v)) != null && E.running
                ? 'Stop server'
                : 'Start server'
          )
        }),
          p(M, D))
      },
      $$slots: { default: !0 },
    })
  }
  ;(p(e, _), pe())
}
var Qu = b('<p style="color:var(--error);font-size:13px"> </p>'),
  ef = b(
    '<div class="page"><div class="head svelte-124gvcr"><h2 class="svelte-124gvcr">Server Gateway</h2> <p class="sub svelte-124gvcr">Run a local OpenAI / Anthropic-compatible server exposing your anygate models to any tool.</p></div> <!> <!></div>'
  )
function tf(e, t) {
  ;(fe(t, !1),
    Hs(() => {
      _a()
    }),
    pl())
  var r = ef(),
    a = c(u(r), 2)
  {
    var s = v => {
        dr(v, { label: 'Reading server status…' })
      },
      l = v => {
        Zu(v, { onneedsmodels: () => (location.hash = '#/providers') })
      }
    q(a, v => {
      Je.loading && !Je.status ? v(s) : v(l, -1)
    })
  }
  var i = c(a, 2)
  {
    var o = v => {
      Ae(v, {
        padding: '16px',
        children: (d, h) => {
          var _ = Qu(),
            f = u(_)
          ;(F(() => z(f, Je.error)), p(d, _))
        },
        $$slots: { default: !0 },
      })
    }
    q(i, v => {
      Je.error && v(o)
    })
  }
  ;(p(e, r), pe())
}
var rf = b('<div class="muted svelte-hss3zz">Loading providers…</div>'),
  af = b('<div class="muted svelte-hss3zz">No providers configured.</div>'),
  sf = b('<div class="muted svelte-hss3zz">Select a provider first.</div>'),
  nf = b(
    '<div class="muted svelte-hss3zz">This provider has no directly-testable (OpenAI/Anthropic) models.</div>'
  ),
  lf = b('<!> Testing…', 1),
  of = b(
    '<h3 class="panel-title svelte-hss3zz">Test configuration</h3> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Provider</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Model</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Prompt</span> <textarea class="prompt svelte-hss3zz" rows="3" placeholder="What to send to the model…" id="tester-prompt"></textarea></label> <div class="run svelte-hss3zz"><!></div>',
    1
  ),
  vf = b(
    '<div class="live-pulse svelte-hss3zz"></div> <p class="live-text svelte-hss3zz">Probing <strong class="svelte-hss3zz"> </strong>…</p> <p class="muted svelte-hss3zz">Connecting to upstream endpoint.</p>',
    1
  ),
  df = b(
    '<div class="sample svelte-hss3zz"><span class="sample-label svelte-hss3zz">Sample response</span> <pre class="sample-body svelte-hss3zz"> </pre></div>'
  ),
  cf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot ok svelte-hss3zz"></span> <span class="status-text ok svelte-hss3zz">Endpoint responds</span> <!></div> <div class="metrics svelte-hss3zz"><div class="metric gauge svelte-hss3zz"><svg viewBox="0 0 120 120" class="gauge-svg svelte-hss3zz"><circle class="gauge-bg svelte-hss3zz" cx="60" cy="60" r="52"></circle><circle class="gauge-fg svelte-hss3zz" cx="60" cy="60" r="52"></circle></svg> <div class="gauge-center svelte-hss3zz"><span class="gauge-value svelte-hss3zz"> </span> <span class="gauge-unit svelte-hss3zz">ms TTFT</span></div> <span class="metric-label svelte-hss3zz">Time to first token</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Connect</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Total round-trip</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Tokens / sec</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Streamed chunks</span></div> <div class="metric svelte-hss3zz"><span> </span> <span class="metric-label svelte-hss3zz">Stream stability</span></div></div> <!>',
    1
  ),
  uf = b('<p class="fail-hint svelte-hss3zz"> </p>'),
  ff = b(
    '<div class="mini-metrics svelte-hss3zz"><span class="svelte-hss3zz"> </span> <span class="svelte-hss3zz"> </span></div>'
  ),
  pf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Endpoint did not respond correctly</span></div> <p class="fail-error svelte-hss3zz"> </p> <!> <!>',
    1
  ),
  hf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Request error</span></div> <p class="fail-error svelte-hss3zz"> </p>',
    1
  ),
  _f = b(
    'Select a provider + model and hit <strong class="svelte-hss3zz">Run test</strong> to measure live latency.',
    1
  ),
  gf =
    b(`<div class="page svelte-hss3zz"><div class="head svelte-hss3zz"><div class="svelte-hss3zz"><h2 class="svelte-hss3zz">Model Tester</h2> <p class="sub svelte-hss3zz">Pick a provider and model, then fire a live request at its real endpoint.
        Measures connection time, time-to-first-token, and total latency.</p></div> <!></div> <div class="grid svelte-hss3zz"><!> <div class="results svelte-hss3zz"><!></div></div></div>`)
function mf(e, t) {
  fe(t, !0)
  let r = re(''),
    a = re(''),
    s = re('Reply with a single word: pong'),
    l = re(!1),
    i = re(null),
    o = re(null)
  const v = J(() =>
      Me.list
        .filter(k => {
          var j
          return (((j = k.enrichedModels) == null ? void 0 : j.length) ?? 0) > 0
        })
        .map(k => ({ value: k.id, label: k.name }))
    ),
    d = J(() => Me.list.find(k => k.id === n(r)))
  function h(k) {
    return k.format === 'anthropic' || k.format === 'openai'
  }
  const _ = J(() => {
      var k
      return (((k = n(d)) == null ? void 0 : k.enrichedModels) ?? []).filter(h)
    }),
    f = J(() =>
      n(_).map(k => ({
        value: k.id,
        label: `${k.name ?? k.id}${k.contextWindow ? ` · ${Math.round(k.contextWindow / 1e3)}k` : ''}`,
      }))
    )
  Lt(() => {
    ;(n(r) && n(d) && n(_).some(j => j.id === n(a))) || L(a, '')
  })
  const g = J(() => !!n(r) && !!n(a) && !n(l))
  async function m() {
    if (n(g)) {
      ;(L(l, !0), L(i, null), L(o, null))
      try {
        const k = await Fo({ providerId: n(r), modelId: n(a), prompt: n(s) })
        ;(L(i, k, !0),
          k.ok
            ? we(`Test passed · ${k.ttftMs}ms TTFT`, 'success')
            : we(k.error ?? 'Test failed', 'error'))
      } catch (k) {
        ;(L(o, k instanceof Error ? k.message : String(k), !0), we('Network error', 'error'))
      } finally {
        L(l, !1)
      }
    }
  }
  function y(k) {
    return k == null ? '—' : k < 1e3 ? `${k} ms` : `${(k / 1e3).toFixed(2)} s`
  }
  const w = J(() =>
    n(i) && n(i).ttftMs !== null ? Math.max(0, Math.min(100, 100 - (n(i).ttftMs / 3e3) * 100)) : 0
  )
  var O = gf(),
    H = u(O),
    x = c(u(H), 2)
  Te(x, {
    children: (k, j) => {
      var $ = Q('server-side · live')
      p(k, $)
    },
    $$slots: { default: !0 },
  })
  var M = c(H, 2),
    T = u(M)
  Ae(T, {
    padding: '22px',
    class: 'panel',
    children: (k, j) => {
      var $ = of(),
        U = c(ee($), 2),
        C = c(u(U), 2)
      {
        var G = Z => {
            var ie = rf()
            p(Z, ie)
          },
          B = Z => {
            var ie = af()
            p(Z, ie)
          },
          R = Z => {
            lr(Z, {
              get options() {
                return n(v)
              },
              get disabled() {
                return n(l)
              },
              id: 'tester-provider',
              get value() {
                return n(r)
              },
              set value(ie) {
                L(r, ie, !0)
              },
            })
          }
        q(C, Z => {
          Me.loading ? Z(G) : n(v).length === 0 ? Z(B, 1) : Z(R, -1)
        })
      }
      var K = c(U, 2),
        Y = c(u(K), 2)
      {
        var V = Z => {
            var ie = sf()
            p(Z, ie)
          },
          X = Z => {
            var ie = nf()
            p(Z, ie)
          },
          te = Z => {
            lr(Z, {
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
              set value(ie) {
                L(a, ie, !0)
              },
            })
          }
        q(Y, Z => {
          n(r) ? (n(f).length === 0 ? Z(X, 1) : Z(te, -1)) : Z(V)
        })
      }
      var ne = c(K, 2),
        ae = c(u(ne), 2),
        le = c(ne, 2),
        ce = u(le)
      {
        let Z = J(() => !n(g))
        ye(ce, {
          variant: 'primary',
          size: 'lg',
          get disabled() {
            return n(Z)
          },
          onclick: m,
          children: (ie, Ie) => {
            var yt = Ze(),
              Nt = ee(yt)
            {
              var Jt = dt => {
                  var zt = lf(),
                    Dt = ee(zt)
                  ;(dr(Dt, { label: '' }), p(dt, zt))
                },
                Xt = dt => {
                  var zt = Q('Run test')
                  p(dt, zt)
                }
              q(Nt, dt => {
                n(l) ? dt(Jt) : dt(Xt, -1)
              })
            }
            p(ie, yt)
          },
          $$slots: { default: !0 },
        })
      }
      ;(F(() => (ae.disabled = n(l))),
        Ma(
          ae,
          () => n(s),
          Z => L(s, Z)
        ),
        p(k, $))
    },
    $$slots: { default: !0 },
  })
  var D = c(T, 2),
    E = u(D)
  {
    var N = k => {
        Ae(k, {
          padding: '28px',
          class: 'result-card live',
          children: (j, $) => {
            var U = vf(),
              C = c(ee(U), 2),
              G = c(u(C)),
              B = u(G)
            ;(F(() => z(B, n(a))), p(j, U))
          },
          $$slots: { default: !0 },
        })
      },
      W = k => {
        Ae(k, {
          padding: '24px',
          class: 'result-card pass',
          children: (j, $) => {
            var U = cf(),
              C = ee(U),
              G = c(u(C), 4)
            Te(G, {
              children: (Ue, et) => {
                var Ge = Q()
                ;(F(() => z(Ge, n(i).format)), p(Ue, Ge))
              },
              $$slots: { default: !0 },
            })
            var B = c(C, 2),
              R = u(B),
              K = u(R),
              Y = c(u(K)),
              V = c(K, 2),
              X = u(V),
              te = u(X),
              ne = c(R, 2),
              ae = u(ne),
              le = u(ae),
              ce = c(ne, 2),
              Z = u(ce),
              ie = u(Z),
              Ie = c(ce, 2),
              yt = u(Ie),
              Nt = u(yt),
              Jt = c(Ie, 2),
              Xt = u(Jt),
              dt = u(Xt),
              zt = c(Jt, 2),
              Dt = u(zt)
            let At
            var Ee = u(Dt),
              je = c(B, 2)
            {
              var Ke = Ue => {
                var et = df(),
                  Ge = c(u(et), 2),
                  Ja = u(Ge)
                ;(F(() => z(Ja, n(i).sample)), p(Ue, et))
              }
              q(je, Ue => {
                n(i).sample && Ue(Ke)
              })
            }
            ;(F(
              (Ue, et) => {
                ;(qe(Y, `stroke-dashoffset: ${329.9 - (329.9 * n(w)) / 100}`),
                  z(te, n(i).ttftMs ?? '—'),
                  z(le, Ue),
                  z(ie, et),
                  z(Nt, n(i).tokensPerSec ?? '—'),
                  z(dt, n(i).tokens),
                  (At = $e(Dt, 1, 'metric-value mono svelte-hss3zz', null, At, {
                    warn: n(i).streamStability === 'intermittent',
                  })),
                  z(Ee, n(i).streamStability))
              },
              [() => y(n(i).connectMs), () => y(n(i).totalMs)]
            ),
              p(j, U))
          },
          $$slots: { default: !0 },
        })
      },
      I = k => {
        Ae(k, {
          padding: '24px',
          class: 'result-card fail',
          children: (j, $) => {
            var U = pf(),
              C = c(ee(U), 2),
              G = u(C),
              B = c(C, 2)
            {
              var R = V => {
                var X = uf(),
                  te = u(X)
                ;(F(() => z(te, `↳ ${n(i).errorHint ?? ''}`)), p(V, X))
              }
              q(B, V => {
                n(i).errorHint && V(R)
              })
            }
            var K = c(B, 2)
            {
              var Y = V => {
                var X = ff(),
                  te = u(X),
                  ne = u(te),
                  ae = c(te, 2),
                  le = u(ae)
                ;(F(
                  (ce, Z) => {
                    ;(z(ne, `connect ${ce ?? ''}`), z(le, `total ${Z ?? ''}`))
                  },
                  [() => y(n(i).connectMs), () => y(n(i).totalMs)]
                ),
                  p(V, X))
              }
              q(K, V => {
                n(i).connectMs !== null && V(Y)
              })
            }
            ;(F(() => z(G, n(i).error)), p(j, U))
          },
          $$slots: { default: !0 },
        })
      },
      P = k => {
        Ae(k, {
          padding: '24px',
          class: 'result-card fail',
          children: (j, $) => {
            var U = hf(),
              C = c(ee(U), 2),
              G = u(C)
            ;(F(() => z(G, n(o))), p(j, U))
          },
          $$slots: { default: !0 },
        })
      },
      A = k => {
        $r(k, {
          title: 'No test run yet',
          icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3',
          children: (j, $) => {
            var U = _f()
            p(j, U)
          },
          $$slots: { default: !0 },
        })
      }
    q(E, k => {
      n(l)
        ? k(N)
        : n(i) && n(i).ok
          ? k(W, 1)
          : n(i) && !n(i).ok
            ? k(I, 2)
            : n(o)
              ? k(P, 3)
              : k(A, -1)
    })
  }
  ;(p(e, O), pe())
}
var yf = b(
    '<h3 class="svelte-15j4tnx">Appearance</h3> <div class="line svelte-15j4tnx"><span>Theme</span> <!></div>',
    1
  ),
  wf = b(
    '<div class="kv svelte-15j4tnx"><span>ANYGATE_HOME</span><code class="svelte-15j4tnx"> </code></div>'
  ),
  bf = b(
    '<h3 class="svelte-15j4tnx">Subscription tier</h3> <div class="line svelte-15j4tnx"><span>Backend selection for wizards</span> <!></div> <!>',
    1
  ),
  xf = b(
    '<h3 class="svelte-15j4tnx">Config backup</h3> <p class="muted svelte-15j4tnx">Export favorites to a portable JSON file and re-import on another machine.</p> <div class="acts svelte-15j4tnx"><!> <!></div>',
    1
  ),
  kf = b(
    '<div class="preset svelte-15j4tnx"><div class="pmeta"><span class="pname svelte-15j4tnx"> </span> <span class="psub svelte-15j4tnx"> </span></div> <div class="pacts svelte-15j4tnx"><!> <!></div></div> <pre class="dryrun svelte-15j4tnx"> </pre>',
    1
  ),
  Sf = b(
    '<div class="sec-head svelte-15j4tnx"><h3 class="svelte-15j4tnx">Launch presets</h3><!></div> <!>',
    1
  ),
  Pf = b(
    '<textarea class="ta svelte-15j4tnx" readonly=""></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Ef = b(
    '<p class="muted svelte-15j4tnx">Paste an anygate config JSON (from Export favorites).</p> <textarea class="ta svelte-15j4tnx" placeholder="Paste JSON here"></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Mf = b('<span class="lbl svelte-15j4tnx" style="margin-top:12px">Model</span> <!>', 1),
  zf = b(
    '<span class="lbl svelte-15j4tnx">Label</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">App</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">Provider</span> <!> <!> <div class="row svelte-15j4tnx" style="margin-top:18px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Af = b(
    '<div class="page"><div class="head svelte-15j4tnx"><h2 class="svelte-15j4tnx">Settings</h2><p class="sub svelte-15j4tnx">Theme, subscription tier, launch presets, and portable config backup.</p></div> <div class="cols svelte-15j4tnx"><div class="stack svelte-15j4tnx"><!> <!> <!></div> <div class="stack svelte-15j4tnx"><!></div></div></div> <!> <!> <!>',
    1
  )
function Tf(e, t) {
  fe(t, !0)
  let r = re(!1),
    a = re(''),
    s = re(!1),
    l = re('')
  const i = [
    { value: 'free', label: 'Free' },
    { value: 'zen', label: 'Zen' },
    { value: 'go', label: 'Go' },
    { value: 'both', label: 'Both' },
  ]
  function o() {
    rv()
      .then($ => {
        ;(L(a, $, !0), L(r, !0))
      })
      .catch($ => we(String($), 'error'))
  }
  async function v() {
    try {
      ;(await av(n(l)), we('Config imported', 'success'), L(s, !1), await Pl())
    } catch ($) {
      we($ instanceof Error ? $.message : String($), 'error')
    }
  }
  function d() {
    const $ = new Blob([n(a)], { type: 'application/json' }),
      U = document.createElement('a')
    ;((U.href = URL.createObjectURL($)), (U.download = 'anygate-config.json'), U.click())
  }
  let h = re(!1),
    _ = re(''),
    f = re(''),
    g = re(''),
    m = re('')
  function y($) {
    const U = Me.list.find(B => B.id === $.providerId),
      C = U == null ? void 0 : U.enrichedModels.find(B => B.id === $.modelId)
    return !U || !C
      ? '—'
      : sv({ provider: U, modelId: C.id, contextWindow: C.contextWindow }).env.map(
          B => `${B.key}=${B.masked ? '•••' : B.value}`
        ).join(`
`)
  }
  var w = Af(),
    O = ee(w),
    H = c(u(O), 2),
    x = u(H),
    M = u(x)
  Ae(M, {
    padding: '20px',
    children: ($, U) => {
      var C = yf(),
        G = c(ee(C), 2),
        B = c(u(G), 2)
      ;(ye(B, {
        size: 'sm',
        variant: 'ghost',
        get onclick() {
          return Cl
        },
        children: (R, K) => {
          var Y = Q()
          ;(F(() => z(Y, `${nr.value === 'dark' ? 'Dark' : 'Light'} · toggle`)), p(R, Y))
        },
        $$slots: { default: !0 },
      }),
        p($, C))
    },
    $$slots: { default: !0 },
  })
  var T = c(M, 2)
  Ae(T, {
    padding: '20px',
    children: ($, U) => {
      var C = bf(),
        G = c(ee(C), 2),
        B = c(u(G), 2)
      lr(B, {
        get value() {
          return sr.tier
        },
        get options() {
          return i
        },
        onchange: Y => wv(Y),
      })
      var R = c(G, 2)
      {
        var K = Y => {
          var V = wf(),
            X = c(u(V)),
            te = u(X)
          ;(F(() => z(te, sr.anygateHome)), p(Y, V))
        }
        q(R, Y => {
          sr.anygateHome && Y(K)
        })
      }
      p($, C)
    },
    $$slots: { default: !0 },
  })
  var D = c(T, 2)
  Ae(D, {
    padding: '20px',
    children: ($, U) => {
      var C = xf(),
        G = c(ee(C), 4),
        B = u(G)
      ye(B, {
        size: 'sm',
        variant: 'subtle',
        onclick: o,
        children: (K, Y) => {
          var V = Q('Export favorites')
          p(K, V)
        },
        $$slots: { default: !0 },
      })
      var R = c(B, 2)
      ;(ye(R, {
        size: 'sm',
        variant: 'ghost',
        onclick: () => L(s, !0),
        children: (K, Y) => {
          var V = Q('Import')
          p(K, V)
        },
        $$slots: { default: !0 },
      }),
        p($, C))
    },
    $$slots: { default: !0 },
  })
  var E = c(x, 2),
    N = u(E)
  Ae(N, {
    padding: '20px',
    children: ($, U) => {
      var C = Sf(),
        G = ee(C),
        B = c(u(G))
      ye(B, {
        size: 'sm',
        onclick: () => {
          ;(L(h, !0), L(_, ''), L(f, ''), L(g, ''), L(m, ''))
        },
        children: (V, X) => {
          var te = Q('New')
          p(V, te)
        },
        $$slots: { default: !0 },
      })
      var R = c(G, 2)
      {
        var K = V => {
            $r(V, {
              title: 'No presets',
              icon: 'M12 5v14M5 12h14',
              children: (X, te) => {
                var ne = Q('Save an app + provider + model combo for one-click launch.')
                p(X, ne)
              },
              $$slots: { default: !0 },
            })
          },
          Y = V => {
            var X = Ze(),
              te = ee(X)
            ;(ke(
              te,
              17,
              () => ot.list,
              ne => ne.id,
              (ne, ae) => {
                var le = kf(),
                  ce = ee(le),
                  Z = u(ce),
                  ie = u(Z),
                  Ie = u(ie),
                  yt = c(ie, 2),
                  Nt = u(yt),
                  Jt = c(Z, 2),
                  Xt = u(Jt)
                ye(Xt, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => navigator.clipboard.writeText(y(n(ae))),
                  children: (At, Ee) => {
                    var je = Q('Dry run')
                    p(At, je)
                  },
                  $$slots: { default: !0 },
                })
                var dt = c(Xt, 2)
                ye(dt, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => xv(n(ae).id),
                  children: (At, Ee) => {
                    var je = Q('Delete')
                    p(At, je)
                  },
                  $$slots: { default: !0 },
                })
                var zt = c(ce, 2),
                  Dt = u(zt)
                ;(F(
                  At => {
                    ;(z(Ie, n(ae).label ?? n(ae).appId),
                      z(
                        Nt,
                        `${n(ae).providerId ?? ''}${n(ae).modelId ? ' · ' + n(ae).modelId : ''}${n(ae).folder ? ' · ' + n(ae).folder : ''}`
                      ),
                      z(Dt, At))
                  },
                  [() => y(n(ae))]
                ),
                  p(ne, le))
              }
            ),
              p(V, X))
          }
        q(R, V => {
          ot.list.length === 0 ? V(K) : V(Y, -1)
        })
      }
      p($, C)
    },
    $$slots: { default: !0 },
  })
  var W = c(O, 2)
  {
    var I = $ => {
      Pr($, {
        get open() {
          return n(r)
        },
        title: 'Export favorites',
        onclose: () => L(r, !1),
        children: (U, C) => {
          var G = Pf(),
            B = ee(G),
            R = c(B, 2),
            K = u(R)
          ye(K, {
            variant: 'ghost',
            onclick: () => L(r, !1),
            children: (V, X) => {
              var te = Q('Close')
              p(V, te)
            },
            $$slots: { default: !0 },
          })
          var Y = c(K, 2)
          ;(ye(Y, {
            onclick: d,
            children: (V, X) => {
              var te = Q('Download')
              p(V, te)
            },
            $$slots: { default: !0 },
          }),
            F(() => Bs(B, n(a))),
            p(U, G))
        },
        $$slots: { default: !0 },
      })
    }
    q(W, $ => {
      n(r) && $(I)
    })
  }
  var P = c(W, 2)
  {
    var A = $ => {
      Pr($, {
        get open() {
          return n(s)
        },
        title: 'Import config',
        onclose: () => L(s, !1),
        children: (U, C) => {
          var G = Ef(),
            B = c(ee(G), 2),
            R = c(B, 2),
            K = u(R)
          ye(K, {
            variant: 'ghost',
            onclick: () => L(s, !1),
            children: (V, X) => {
              var te = Q('Cancel')
              p(V, te)
            },
            $$slots: { default: !0 },
          })
          var Y = c(K, 2)
          ;(ye(Y, {
            onclick: v,
            children: (V, X) => {
              var te = Q('Import')
              p(V, te)
            },
            $$slots: { default: !0 },
          }),
            Ma(
              B,
              () => n(l),
              V => L(l, V)
            ),
            p(U, G))
        },
        $$slots: { default: !0 },
      })
    }
    q(P, $ => {
      n(s) && $(A)
    })
  }
  var k = c(P, 2)
  {
    var j = $ => {
      Pr($, {
        get open() {
          return n(h)
        },
        title: 'New preset',
        onclose: () => L(h, !1),
        children: (U, C) => {
          var G = zf(),
            B = c(ee(G), 2)
          er(B, {
            placeholder: 'My daily setup',
            get value() {
              return n(m)
            },
            set value(ae) {
              L(m, ae, !0)
            },
          })
          var R = c(B, 4)
          {
            let ae = J(() => [
              { value: '', label: '—' },
              ...(Me.list.length
                ? [
                    { value: 'claude', label: 'Claude' },
                    { value: 'codex', label: 'Codex' },
                    { value: 'antigravity', label: 'Antigravity' },
                  ]
                : []),
            ])
            lr(R, {
              get options() {
                return n(ae)
              },
              get value() {
                return n(_)
              },
              set value(le) {
                L(_, le, !0)
              },
            })
          }
          var K = c(R, 4)
          {
            let ae = J(() => [
              { value: '', label: '—' },
              ...Me.list.map(le => ({ value: le.id, label: le.name })),
            ])
            lr(K, {
              get options() {
                return n(ae)
              },
              get value() {
                return n(f)
              },
              set value(le) {
                L(f, le, !0)
              },
            })
          }
          var Y = c(K, 2)
          {
            var V = ae => {
              var le = Mf(),
                ce = c(ee(le), 2)
              {
                let Z = J(() => {
                  var ie
                  return [
                    { value: '', label: '—' },
                    ...(
                      ((ie = Me.list.find(Ie => Ie.id === n(f))) == null
                        ? void 0
                        : ie.enrichedModels) ?? []
                    ).map(Ie => ({ value: Ie.id, label: Ie.name ?? Ie.id })),
                  ]
                })
                lr(ce, {
                  get options() {
                    return n(Z)
                  },
                  get value() {
                    return n(g)
                  },
                  set value(ie) {
                    L(g, ie, !0)
                  },
                })
              }
              p(ae, le)
            }
            q(Y, ae => {
              n(f) && ae(V)
            })
          }
          var X = c(Y, 2),
            te = u(X)
          ye(te, {
            variant: 'ghost',
            onclick: () => L(h, !1),
            children: (ae, le) => {
              var ce = Q('Cancel')
              p(ae, ce)
            },
            $$slots: { default: !0 },
          })
          var ne = c(te, 2)
          {
            let ae = J(() => !n(_) || !n(m))
            ye(ne, {
              get disabled() {
                return n(ae)
              },
              onclick: async () => {
                ;(await bv({
                  appId: n(_),
                  providerId: n(f) || void 0,
                  modelId: n(g) || void 0,
                  label: n(m),
                }),
                  L(h, !1))
              },
              children: (le, ce) => {
                var Z = Q('Save')
                p(le, Z)
              },
              $$slots: { default: !0 },
            })
          }
          p(U, G)
        },
        $$slots: { default: !0 },
      })
    }
    q(k, $ => {
      n(h) && $(j)
    })
  }
  ;(p(e, w), pe())
}
var $f = b(
  '<div class="app-shell svelte-1n46o8q"><!> <div class="main svelte-1n46o8q"><!> <main class="content svelte-1n46o8q"><!> <!> <!> <!> <!> <!> <!></main></div></div> <!> <!>',
  1
)
function Cf(e, t) {
  fe(t, !0)
  let r = ''
  function a(P) {
    ;(P.metaKey || P.ctrlKey) && P.key.toLowerCase() === 'k' && (P.preventDefault(), To())
  }
  Hs(
    () => (
      Mo(),
      window.addEventListener('keydown', a),
      Gs(),
      xl(),
      gv(),
      yv(),
      Pl(),
      Es(),
      zl(),
      Ev(),
      () => {
        ;(window.removeEventListener('keydown', a), Mv(), Sv())
      }
    )
  )
  var s = $f(),
    l = ee(s),
    i = u(l)
  Cv(i, {})
  var o = c(i, 2),
    v = u(o)
  nd(v, {})
  var d = c(v, 2),
    h = u(d)
  {
    var _ = P => {
      Ec(P, {})
    }
    q(h, P => {
      kt.route === 'dashboard' && P(_)
    })
  }
  var f = c(h, 2)
  {
    var g = P => {
      ru(P, {})
    }
    q(f, P => {
      kt.route === 'providers' && P(g)
    })
  }
  var m = c(f, 2)
  {
    var y = P => {
      Eu(P, {})
    }
    q(m, P => {
      kt.route === 'models' && P(y)
    })
  }
  var w = c(m, 2)
  {
    var O = P => {
      Bu(P, {})
    }
    q(w, P => {
      kt.route === 'apps' && P(O)
    })
  }
  var H = c(w, 2)
  {
    var x = P => {
      tf(P, {})
    }
    q(H, P => {
      kt.route === 'server' && P(x)
    })
  }
  var M = c(H, 2)
  {
    var T = P => {
      mf(P, {})
    }
    q(M, P => {
      kt.route === 'tester' && P(T)
    })
  }
  var D = c(M, 2)
  {
    var E = P => {
      Tf(P, {})
    }
    q(D, P => {
      kt.route === 'settings' && P(E)
    })
  }
  var N = c(l, 2)
  od(N, {})
  var W = c(N, 2)
  {
    var I = P => {
      ud(P, {
        query: r,
        get onclose() {
          return Ao
        },
      })
    }
    q(W, P => {
      Mt.commandOpen && P(I)
    })
  }
  ;(p(e, s), pe())
}
try {
  vo(Cf, { target: document.getElementById('app') })
} catch (e) {
  console.error('Runtime error during mount:', e)
  const t = document.getElementById('app'),
    r = e instanceof Error ? e.stack || e.message : String(e)
  t &&
    (t.innerHTML = `<pre style="color:#ff8a8a;background:#161616;padding:24px;margin:0;white-space:pre-wrap;font:13px ui-monospace,monospace;max-height:100vh;overflow:auto">MOUNT ERROR:

${r.replace(/[<>&]/g, a => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[a])}</pre>`)
}
