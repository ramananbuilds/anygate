var ql = Object.defineProperty
var Zs = e => {
  throw TypeError(e)
}
var Ul = (e, t, r) =>
  t in e ? ql(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)
var st = (e, t, r) => Ul(e, typeof t != 'symbol' ? t + '' : t, r),
  ts = (e, t, r) => t.has(e) || Zs('Cannot ' + r)
var S = (e, t, r) => (ts(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  fe = (e, t, r) =>
    t.has(e)
      ? Zs('Cannot add the same private member more than once')
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, r),
  ce = (e, t, r, s) => (ts(e, t, 'write to private field'), s ? s.call(e, r) : t.set(e, r), r),
  Ee = (e, t, r) => (ts(e, t, 'access private method'), r)
;(function () {
  const t = document.createElement('link').relList
  if (t && t.supports && t.supports('modulepreload')) return
  for (const n of document.querySelectorAll('link[rel="modulepreload"]')) s(n)
  new MutationObserver(n => {
    for (const l of n)
      if (l.type === 'childList')
        for (const i of l.addedNodes) i.tagName === 'LINK' && i.rel === 'modulepreload' && s(i)
  }).observe(document, { childList: !0, subtree: !0 })
  function r(n) {
    const l = {}
    return (
      n.integrity && (l.integrity = n.integrity),
      n.referrerPolicy && (l.referrerPolicy = n.referrerPolicy),
      n.crossOrigin === 'use-credentials'
        ? (l.credentials = 'include')
        : n.crossOrigin === 'anonymous'
          ? (l.credentials = 'omit')
          : (l.credentials = 'same-origin'),
      l
    )
  }
  function s(n) {
    if (n.ep) return
    n.ep = !0
    const l = r(n)
    fetch(n.href, l)
  }
})()
const xn = !1
var Is = Array.isArray,
  Bl = Array.prototype.indexOf,
  Ua = Array.prototype.includes,
  Xa = Array.from,
  Hl = Object.defineProperty,
  Fr = Object.getOwnPropertyDescriptor,
  kn = Object.getOwnPropertyDescriptors,
  Gl = Object.prototype,
  Wl = Array.prototype,
  Ls = Object.getPrototypeOf,
  Qs = Object.isExtensible
const Sn = () => {}
function Kl(e) {
  return e()
}
function us(e) {
  for (var t = 0; t < e.length; t++) e[t]()
}
function Pn() {
  var e,
    t,
    r = new Promise((s, n) => {
      ;((e = s), (t = n))
    })
  return { promise: r, resolve: e, reject: t }
}
const tt = 2,
  Kr = 4,
  Pa = 8,
  En = 1 << 24,
  Tt = 16,
  St = 32,
  Jt = 64,
  fs = 128,
  kt = 512,
  Ye = 1024,
  Je = 2048,
  $t = 4096,
  lt = 8192,
  gt = 16384,
  Zr = 32768,
  ps = 1 << 25,
  Mr = 65536,
  Ba = 1 << 17,
  Vl = 1 << 18,
  Qr = 1 << 19,
  Mn = 1 << 20,
  Nt = 1 << 25,
  Ar = 65536,
  Ha = 1 << 21,
  Dr = 1 << 22,
  dr = 1 << 23,
  Vt = Symbol('$state'),
  Yl = Symbol('legacy props'),
  Jl = Symbol(''),
  Oa = Symbol('attributes'),
  hs = Symbol('class'),
  _s = Symbol('style'),
  ia = Symbol('text'),
  Ra = Symbol('form reset'),
  Ea = new (class extends Error {
    constructor() {
      super(...arguments)
      st(this, 'name', 'StaleReactionError')
      st(this, 'message', 'The reaction that called `getAbortSignal()` was re-run or destroyed')
    }
  })()
var yn
const Xl =
  !!((yn = globalThis.document) != null && yn.contentType) &&
  globalThis.document.contentType.includes('xml')
function Zl(e) {
  throw new Error('https://svelte.dev/e/lifecycle_outside_component')
}
function Ql() {
  throw new Error('https://svelte.dev/e/async_derived_orphan')
}
function ei(e, t, r) {
  throw new Error('https://svelte.dev/e/each_key_duplicate')
}
function ti(e) {
  throw new Error('https://svelte.dev/e/effect_in_teardown')
}
function ri() {
  throw new Error('https://svelte.dev/e/effect_in_unowned_derived')
}
function ai(e) {
  throw new Error('https://svelte.dev/e/effect_orphan')
}
function si() {
  throw new Error('https://svelte.dev/e/effect_update_depth_exceeded')
}
function ni(e) {
  throw new Error('https://svelte.dev/e/props_invalid_value')
}
function li() {
  throw new Error('https://svelte.dev/e/state_descriptors_fixed')
}
function ii() {
  throw new Error('https://svelte.dev/e/state_prototype_fixed')
}
function oi() {
  throw new Error('https://svelte.dev/e/state_unsafe_mutation')
}
function vi() {
  throw new Error('https://svelte.dev/e/svelte_boundary_reset_onerror')
}
const di = 1,
  ci = 2,
  An = 4,
  ui = 8,
  fi = 16,
  pi = 1,
  hi = 2,
  _i = 4,
  gi = 8,
  mi = 16,
  yi = 1,
  wi = 2,
  Ve = Symbol('uninitialized'),
  zn = 'http://www.w3.org/1999/xhtml',
  bi = 'http://www.w3.org/2000/svg',
  xi = 'http://www.w3.org/1998/Math/MathML'
function ki() {
  console.warn('https://svelte.dev/e/derived_inert')
}
function Si() {
  console.warn('https://svelte.dev/e/select_multiple_invalid_value')
}
function Pi() {
  console.warn('https://svelte.dev/e/svelte_boundary_reset_noop')
}
function Tn(e) {
  return e === this.v
}
function Ei(e, t) {
  return e != e ? t == t : e !== t || (e !== null && typeof e == 'object') || typeof e == 'function'
}
function Cn(e) {
  return !Ei(e, this.v)
}
let ea = !1,
  Mi = !1
function Ai() {
  ea = !0
}
let Le = null
function Vr(e) {
  Le = e
}
function ge(e, t = !1, r) {
  Le = {
    p: Le,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: _e,
    l: ea && !t ? { s: null, u: null, $: [] } : null,
  }
}
function me(e) {
  var t = Le,
    r = t.e
  if (r !== null) {
    t.e = null
    for (var s of r) Qn(s)
  }
  return ((t.i = !0), (Le = t.p), {})
}
function Ma() {
  return !ea || (Le !== null && Le.l === null)
}
let fr = []
function $n() {
  var e = fr
  ;((fr = []), us(e))
}
function cr(e) {
  if (fr.length === 0 && !fa) {
    var t = fr
    queueMicrotask(() => {
      t === fr && $n()
    })
  }
  fr.push(e)
}
function zi() {
  for (; fr.length > 0;) $n()
}
function In(e) {
  var t = _e
  if (t === null) return ((ye.f |= dr), e)
  if ((t.f & Zr) === 0 && (t.f & Kr) === 0) throw e
  lr(e, t)
}
function lr(e, t) {
  if (!(t !== null && (t.f & gt) !== 0)) {
    for (; t !== null;) {
      if ((t.f & fs) !== 0) {
        if ((t.f & Zr) === 0) throw e
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
const Ti = -7169
function Ge(e, t) {
  e.f = (e.f & Ti) | t
}
function Os(e) {
  ;(e.f & kt) !== 0 || e.deps === null ? Ge(e, Ye) : Ge(e, $t)
}
function Ln(e) {
  if (e !== null)
    for (const t of e) (t.f & tt) === 0 || (t.f & Ar) === 0 || ((t.f ^= Ar), Ln(t.deps))
}
function On(e, t, r) {
  ;((e.f & Je) !== 0 ? t.add(e) : (e.f & $t) !== 0 && r.add(e), Ln(e.deps), Ge(e, Ye))
}
let Ca = !1
function Ci(e) {
  var t = Ca
  try {
    return ((Ca = !1), [e(), Ca])
  } finally {
    Ca = t
  }
}
let en = !1
function $i() {
  en ||
    ((en = !0),
    document.addEventListener(
      'reset',
      e => {
        Promise.resolve().then(() => {
          var t
          if (!e.defaultPrevented)
            for (const r of e.target.elements) (t = r[Ra]) == null || t.call(r)
        })
      },
      { capture: !0 }
    ))
}
function ta(e) {
  var t = ye,
    r = _e
  ;(Pt(null), jt(null))
  try {
    return e()
  } finally {
    ;(Pt(t), jt(r))
  }
}
function Rn(e, t, r, s = r) {
  e.addEventListener(t, () => ta(r))
  const n = e[Ra]
  ;(n
    ? (e[Ra] = () => {
        ;(n(), s(!0))
      })
    : (e[Ra] = () => s(!0)),
    $i())
}
function Ii(e) {
  let t = 0,
    r = Tr(0),
    s
  return () => {
    js() &&
      (a(r),
      Us(
        () => (
          t === 0 && (s = ra(() => e(() => pa(r)))),
          (t += 1),
          () => {
            cr(() => {
              ;((t -= 1), t === 0 && (s == null || s(), (s = void 0), pa(r)))
            })
          }
        )
      ))
  }
}
var Li = Mr | Qr
function Oi(e, t, r, s) {
  new Ri(e, t, r, s)
}
var yt,
  $s,
  wt,
  gr,
  vt,
  bt,
  nt,
  pt,
  Ht,
  mr,
  sr,
  jr,
  wa,
  ba,
  Gt,
  Va,
  Be,
  Ni,
  Fi,
  Di,
  gs,
  Na,
  Fa,
  ms,
  ys
class Ri {
  constructor(t, r, s, n) {
    fe(this, Be)
    st(this, 'parent')
    st(this, 'is_pending', !1)
    st(this, 'transform_error')
    fe(this, yt)
    fe(this, $s, null)
    fe(this, wt)
    fe(this, gr)
    fe(this, vt)
    fe(this, bt, null)
    fe(this, nt, null)
    fe(this, pt, null)
    fe(this, Ht, null)
    fe(this, mr, 0)
    fe(this, sr, 0)
    fe(this, jr, !1)
    fe(this, wa, new Set())
    fe(this, ba, new Set())
    fe(this, Gt, null)
    fe(
      this,
      Va,
      Ii(
        () => (
          ce(this, Gt, Tr(S(this, mr))),
          () => {
            ce(this, Gt, null)
          }
        )
      )
    )
    var l
    ;(ce(this, yt, t),
      ce(this, wt, r),
      ce(this, gr, i => {
        var o = _e
        ;((o.b = this), (o.f |= fs), s(i))
      }),
      (this.parent = _e.b),
      (this.transform_error =
        n ?? ((l = this.parent) == null ? void 0 : l.transform_error) ?? (i => i)),
      ce(
        this,
        vt,
        Za(() => {
          Ee(this, Be, gs).call(this)
        }, Li)
      ))
  }
  defer_effect(t) {
    On(t, S(this, wa), S(this, ba))
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered())
  }
  has_pending_snippet() {
    return !!S(this, wt).pending
  }
  update_pending_count(t, r) {
    ;(Ee(this, Be, ms).call(this, t, r),
      ce(this, mr, S(this, mr) + t),
      !(!S(this, Gt) || S(this, jr)) &&
        (ce(this, jr, !0),
        cr(() => {
          ;(ce(this, jr, !1), S(this, Gt) && Jr(S(this, Gt), S(this, mr)))
        })))
  }
  get_effect_pending() {
    return (S(this, Va).call(this), a(S(this, Gt)))
  }
  error(t) {
    if (!S(this, wt).onerror && !S(this, wt).failed) throw t
    le != null && le.is_fork
      ? (S(this, bt) && le.skip_effect(S(this, bt)),
        S(this, nt) && le.skip_effect(S(this, nt)),
        S(this, pt) && le.skip_effect(S(this, pt)),
        le.oncommit(() => {
          Ee(this, Be, ys).call(this, t)
        }))
      : Ee(this, Be, ys).call(this, t)
  }
}
;((yt = new WeakMap()),
  ($s = new WeakMap()),
  (wt = new WeakMap()),
  (gr = new WeakMap()),
  (vt = new WeakMap()),
  (bt = new WeakMap()),
  (nt = new WeakMap()),
  (pt = new WeakMap()),
  (Ht = new WeakMap()),
  (mr = new WeakMap()),
  (sr = new WeakMap()),
  (jr = new WeakMap()),
  (wa = new WeakMap()),
  (ba = new WeakMap()),
  (Gt = new WeakMap()),
  (Va = new WeakMap()),
  (Be = new WeakSet()),
  (Ni = function () {
    try {
      ce(
        this,
        bt,
        xt(() => S(this, gr).call(this, S(this, yt)))
      )
    } catch (t) {
      this.error(t)
    }
  }),
  (Fi = function (t) {
    const r = S(this, wt).failed
    r &&
      ce(
        this,
        pt,
        xt(() => {
          r(
            S(this, yt),
            () => t,
            () => () => {}
          )
        })
      )
  }),
  (Di = function () {
    const t = S(this, wt).pending
    t &&
      ((this.is_pending = !0),
      ce(
        this,
        nt,
        xt(() => t(S(this, yt)))
      ),
      cr(() => {
        var r = ce(this, Ht, document.createDocumentFragment()),
          s = Yt()
        ;(r.append(s),
          ce(
            this,
            bt,
            Ee(this, Be, Fa).call(this, () => xt(() => S(this, gr).call(this, s)))
          ),
          S(this, sr) === 0 &&
            (S(this, yt).before(r),
            ce(this, Ht, null),
            kr(S(this, nt), () => {
              ce(this, nt, null)
            }),
            Ee(this, Be, Na).call(this, le)))
      }))
  }),
  (gs = function () {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        ce(this, sr, 0),
        ce(this, mr, 0),
        ce(
          this,
          bt,
          xt(() => {
            S(this, gr).call(this, S(this, yt))
          })
        ),
        S(this, sr) > 0)
      ) {
        var t = ce(this, Ht, document.createDocumentFragment())
        Hs(S(this, bt), t)
        const r = S(this, wt).pending
        ce(
          this,
          nt,
          xt(() => r(S(this, yt)))
        )
      } else Ee(this, Be, Na).call(this, le)
    } catch (r) {
      this.error(r)
    }
  }),
  (Na = function (t) {
    ;((this.is_pending = !1), t.transfer_effects(S(this, wa), S(this, ba)))
  }),
  (Fa = function (t) {
    var r = _e,
      s = ye,
      n = Le
    ;(jt(S(this, vt)), Pt(S(this, vt)), Vr(S(this, vt).ctx))
    try {
      return (zr.ensure(), t())
    } catch (l) {
      return (In(l), null)
    } finally {
      ;(jt(r), Pt(s), Vr(n))
    }
  }),
  (ms = function (t, r) {
    var s
    if (!this.has_pending_snippet()) {
      this.parent && Ee((s = this.parent), Be, ms).call(s, t, r)
      return
    }
    ;(ce(this, sr, S(this, sr) + t),
      S(this, sr) === 0 &&
        (Ee(this, Be, Na).call(this, r),
        S(this, nt) &&
          kr(S(this, nt), () => {
            ce(this, nt, null)
          }),
        S(this, Ht) && (S(this, yt).before(S(this, Ht)), ce(this, Ht, null))))
  }),
  (ys = function (t) {
    ;(S(this, bt) && (ut(S(this, bt)), ce(this, bt, null)),
      S(this, nt) && (ut(S(this, nt)), ce(this, nt, null)),
      S(this, pt) && (ut(S(this, pt)), ce(this, pt, null)))
    var r = S(this, wt).onerror
    let s = S(this, wt).failed
    var n = !1,
      l = !1
    const i = () => {
        if (n) {
          Pi()
          return
        }
        ;((n = !0),
          l && vi(),
          S(this, pt) !== null &&
            kr(S(this, pt), () => {
              ce(this, pt, null)
            }),
          Ee(this, Be, Fa).call(this, () => {
            Ee(this, Be, gs).call(this)
          }))
      },
      o = v => {
        try {
          ;((l = !0), r == null || r(v, i), (l = !1))
        } catch (d) {
          lr(d, S(this, vt) && S(this, vt).parent)
        }
        s &&
          ce(
            this,
            pt,
            Ee(this, Be, Fa).call(this, () => {
              try {
                return xt(() => {
                  var d = _e
                  ;((d.b = this),
                    (d.f |= fs),
                    s(
                      S(this, yt),
                      () => v,
                      () => i
                    ))
                })
              } catch (d) {
                return (lr(d, S(this, vt).parent), null)
              }
            })
          )
      }
    cr(() => {
      var v
      try {
        v = this.transform_error(t)
      } catch (d) {
        lr(d, S(this, vt) && S(this, vt).parent)
        return
      }
      v !== null && typeof v == 'object' && typeof v.then == 'function'
        ? v.then(o, d => lr(d, S(this, vt) && S(this, vt).parent))
        : o(v)
    })
  }))
function ji(e, t, r, s) {
  const n = Ma() ? Yr : Rs
  var l = e.filter(g => !g.settled),
    i = t.map(n)
  if (r.length === 0 && l.length === 0) {
    s(i)
    return
  }
  var o = _e,
    v = qi(),
    d = l.length === 1 ? l[0].promise : l.length > 1 ? Promise.all(l.map(g => g.promise)) : null
  function h(g) {
    if ((o.f & gt) === 0) {
      v()
      try {
        s([...i, ...g])
      } catch (m) {
        lr(m, o)
      }
      Ga()
    }
  }
  var _ = Nn()
  if (r.length === 0) {
    d.then(() => h([])).finally(_)
    return
  }
  function f() {
    Promise.all(r.map(g => Ui(g)))
      .then(h)
      .catch(g => lr(g, o))
      .finally(_)
  }
  d
    ? d.then(() => {
        ;(v(), f(), Ga())
      })
    : f()
}
function qi() {
  var e = _e,
    t = ye,
    r = Le,
    s = le
  return function (l = !0) {
    ;(jt(e),
      Pt(t),
      Vr(r),
      l && (e.f & gt) === 0 && (s == null || s.activate(), s == null || s.apply()))
  }
}
function Ga(e = !0) {
  ;(jt(null), Pt(null), Vr(null), e && (le == null || le.deactivate()))
}
function Nn() {
  var e = _e,
    t = e.b,
    r = le,
    s = !!(t != null && t.is_rendered())
  return (
    t == null || t.update_pending_count(1, r),
    r.increment(s, e),
    () => {
      ;(t == null || t.update_pending_count(-1, r), r.decrement(s, e))
    }
  )
}
function Yr(e) {
  var t = tt | Je
  return (
    _e !== null && (_e.f |= Qr),
    {
      ctx: Le,
      deps: null,
      effects: null,
      equals: Tn,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: Ve,
      wv: 0,
      parent: _e,
      ac: null,
    }
  )
}
const oa = Symbol('obsolete')
function Ui(e, t, r) {
  let s = _e
  s === null && Ql()
  var n = void 0,
    l = Tr(Ve),
    i = !ye,
    o = new Set()
  return (
    ao(() => {
      var g, m
      var v = _e,
        d = Pn()
      n = d.promise
      try {
        Promise.resolve(e())
          .then(d.resolve, y => {
            y !== Ea && d.reject(y)
          })
          .finally(Ga)
      } catch (y) {
        ;(d.reject(y), Ga())
      }
      var h = le
      if (i) {
        if ((v.f & Zr) !== 0) var _ = Nn()
        if ((g = s.b) != null && g.is_rendered())
          (m = h.async_deriveds.get(v)) == null || m.reject(oa)
        else for (const y of o.values()) y.reject(oa)
        ;(o.add(d), h.async_deriveds.set(v, d))
      }
      const f = (y, w = void 0) => {
        ;(_ == null || _(),
          o.delete(d),
          w !== oa &&
            (h.activate(),
            w ? ((l.f |= dr), Jr(l, w)) : ((l.f & dr) !== 0 && (l.f ^= dr), Jr(l, y)),
            h.deactivate()))
      }
      d.promise.then(f, y => f(null, y || 'unknown'))
    }),
    qs(() => {
      for (const v of o) v.reject(oa)
    }),
    new Promise(v => {
      function d(h) {
        function _() {
          h === n ? v(l) : d(n)
        }
        h.then(_, _)
      }
      d(n)
    })
  )
}
function Y(e) {
  const t = Yr(e)
  return (ll(t), t)
}
function Rs(e) {
  const t = Yr(e)
  return ((t.equals = Cn), t)
}
function Bi(e) {
  var t = e.effects
  if (t !== null) {
    e.effects = null
    for (var r = 0; r < t.length; r += 1) ut(t[r])
  }
}
function Ns(e) {
  var t,
    r = _e,
    s = e.parent
  if (!Xt && s !== null && e.v !== Ve && (s.f & (gt | lt)) !== 0) return (ki(), e.v)
  jt(s)
  try {
    ;((e.f &= ~Ar), Bi(e), (t = dl(e)))
  } finally {
    jt(r)
  }
  return t
}
function Fn(e) {
  var t = Ns(e)
  if (
    !e.equals(t) &&
    ((e.wv = ol()),
    (!(le != null && le.is_fork) || e.deps === null) &&
      (le !== null ? (le.capture(e, t, !0), ua == null || ua.capture(e, t, !0)) : (e.v = t),
      e.deps === null))
  ) {
    Ge(e, Ye)
    return
  }
  Xt || (rt !== null ? (js() || (le != null && le.is_fork)) && rt.set(e, t) : Os(e))
}
function Hi(e) {
  var t
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) &&
        ((t = r.teardown) == null || t.call(r),
        r.ac !== null &&
          ta(() => {
            ;(r.ac.abort(Ea), (r.ac = null))
          }),
        r.fn !== null && (r.teardown = Sn),
        ma(r, 0),
        Bs(r))
}
function Dn(e) {
  if (e.effects !== null) for (const t of e.effects) t.teardown && t.fn !== null && Xr(t)
}
let rs = null,
  Lr = null,
  le = null,
  ua = null,
  rt = null,
  ws = null,
  fa = !1,
  as = !1,
  Rr = null,
  Da = null
var tn = 0
let Gi = 1
var qr, nr, yr, Ur, Br, Hr, Wt, Gr, dt, xa, Kt, Mt, Ot, Wr, wr, ze, bs, va, xs, jn, qn, Or, Wi, da
const Ya = class Ya {
  constructor() {
    fe(this, ze)
    st(this, 'id', Gi++)
    fe(this, qr, !1)
    st(this, 'linked', !0)
    fe(this, nr, null)
    fe(this, yr, null)
    st(this, 'async_deriveds', new Map())
    st(this, 'current', new Map())
    st(this, 'previous', new Map())
    fe(this, Ur, new Set())
    fe(this, Br, new Set())
    fe(this, Hr, 0)
    fe(this, Wt, new Map())
    fe(this, Gr, null)
    fe(this, dt, [])
    fe(this, xa, [])
    fe(this, Kt, new Set())
    fe(this, Mt, new Set())
    fe(this, Ot, new Map())
    fe(this, Wr, new Set())
    st(this, 'is_fork', !1)
    fe(this, wr, !1)
    ;(Lr === null ? (rs = Lr = this) : (ce(Lr, yr, this), ce(this, nr, Lr)), (Lr = this))
  }
  skip_effect(t) {
    ;(S(this, Ot).has(t) || S(this, Ot).set(t, { d: [], m: [] }), S(this, Wr).delete(t))
  }
  unskip_effect(t, r = s => this.schedule(s)) {
    var s = S(this, Ot).get(t)
    if (s) {
      S(this, Ot).delete(t)
      for (var n of s.d) (Ge(n, Je), r(n))
      for (n of s.m) (Ge(n, $t), r(n))
    }
    S(this, Wr).add(t)
  }
  capture(t, r, s = !1) {
    ;(t.v !== Ve && !this.previous.has(t) && this.previous.set(t, t.v),
      (t.f & dr) === 0 && (this.current.set(t, [r, s]), rt == null || rt.set(t, r)),
      this.is_fork || (t.v = r))
  }
  activate() {
    le = this
  }
  deactivate() {
    ;((le = null), (rt = null))
  }
  flush() {
    try {
      ;((as = !0), (le = this), Ee(this, ze, va).call(this))
    } finally {
      ;((tn = 0),
        (ws = null),
        (Rr = null),
        (Da = null),
        (as = !1),
        (le = null),
        (rt = null),
        xr.clear())
    }
  }
  discard() {
    var t
    for (const r of S(this, Br)) r(this)
    S(this, Br).clear()
    for (const r of this.async_deriveds.values()) r.reject(oa)
    ;(Ee(this, ze, da).call(this), (t = S(this, Gr)) == null || t.resolve())
  }
  register_created_effect(t) {
    S(this, xa).push(t)
  }
  increment(t, r) {
    if ((ce(this, Hr, S(this, Hr) + 1), t)) {
      let s = S(this, Wt).get(r) ?? 0
      S(this, Wt).set(r, s + 1)
    }
  }
  decrement(t, r) {
    if ((ce(this, Hr, S(this, Hr) - 1), t)) {
      let s = S(this, Wt).get(r) ?? 0
      s === 1 ? S(this, Wt).delete(r) : S(this, Wt).set(r, s - 1)
    }
    S(this, wr) ||
      (ce(this, wr, !0),
      cr(() => {
        ;(ce(this, wr, !1), this.linked && this.flush())
      }))
  }
  transfer_effects(t, r) {
    for (const s of t) S(this, Kt).add(s)
    for (const s of r) S(this, Mt).add(s)
    ;(t.clear(), r.clear())
  }
  oncommit(t) {
    S(this, Ur).add(t)
  }
  ondiscard(t) {
    S(this, Br).add(t)
  }
  settled() {
    return (S(this, Gr) ?? ce(this, Gr, Pn())).promise
  }
  static ensure() {
    if (le === null) {
      const t = (le = new Ya())
      !as &&
        !fa &&
        cr(() => {
          S(t, qr) || t.flush()
        })
    }
    return le
  }
  apply() {
    {
      rt = null
      return
    }
  }
  schedule(t) {
    var n
    if (
      ((ws = t),
      (n = t.b) != null && n.is_pending && (t.f & (Kr | Pa | En)) !== 0 && (t.f & Zr) === 0)
    ) {
      t.b.defer_effect(t)
      return
    }
    for (var r = t; r.parent !== null;) {
      r = r.parent
      var s = r.f
      if (Rr !== null && r === _e && (ye === null || (ye.f & tt) === 0)) return
      if ((s & (Jt | St)) !== 0) {
        if ((s & Ye) === 0) return
        r.f ^= Ye
      }
    }
    S(this, dt).push(r)
  }
}
;((qr = new WeakMap()),
  (nr = new WeakMap()),
  (yr = new WeakMap()),
  (Ur = new WeakMap()),
  (Br = new WeakMap()),
  (Hr = new WeakMap()),
  (Wt = new WeakMap()),
  (Gr = new WeakMap()),
  (dt = new WeakMap()),
  (xa = new WeakMap()),
  (Kt = new WeakMap()),
  (Mt = new WeakMap()),
  (Ot = new WeakMap()),
  (Wr = new WeakMap()),
  (wr = new WeakMap()),
  (ze = new WeakSet()),
  (bs = function () {
    if (this.is_fork) return !0
    for (const s of S(this, Wt).keys()) {
      for (var t = s, r = !1; t.parent !== null;) {
        if (S(this, Ot).has(t)) {
          r = !0
          break
        }
        t = t.parent
      }
      if (!r) return !0
    }
    return !1
  }),
  (va = function () {
    var v, d, h, _
    ;(ce(this, qr, !0), tn++ > 1e3 && (Ee(this, ze, da).call(this), Vi()))
    for (const f of S(this, Kt)) (S(this, Mt).delete(f), Ge(f, Je), this.schedule(f))
    for (const f of S(this, Mt)) (Ge(f, $t), this.schedule(f))
    const t = S(this, dt)
    ;(ce(this, dt, []), this.apply())
    var r = (Rr = []),
      s = [],
      n = (Da = [])
    for (const f of t)
      try {
        Ee(this, ze, xs).call(this, f, r, s)
      } catch (g) {
        throw (Hn(f), Ee(this, ze, bs).call(this) || this.discard(), g)
      }
    if (((le = null), n.length > 0)) {
      var l = Ya.ensure()
      for (const f of n) l.schedule(f)
    }
    if (((Rr = null), (Da = null), Ee(this, ze, bs).call(this))) {
      ;(Ee(this, ze, Or).call(this, s), Ee(this, ze, Or).call(this, r))
      for (const [f, g] of S(this, Ot)) Bn(f, g)
      n.length > 0 && Ee((v = le), ze, va).call(v)
      return
    }
    const i = Ee(this, ze, jn).call(this)
    if (i) {
      ;(Ee(this, ze, Or).call(this, s),
        Ee(this, ze, Or).call(this, r),
        Ee((d = i), ze, qn).call(d, this))
      return
    }
    ;(S(this, Kt).clear(), S(this, Mt).clear())
    for (const f of S(this, Ur)) f(this)
    ;(S(this, Ur).clear(),
      (ua = this),
      rn(s),
      rn(r),
      (ua = null),
      (h = S(this, Gr)) == null || h.resolve())
    var o = le
    if (
      (S(this, Hr) === 0 && (S(this, dt).length === 0 || o !== null) && Ee(this, ze, da).call(this),
      S(this, dt).length > 0)
    )
      if (o !== null) {
        const f = o
        S(f, dt).push(...S(this, dt).filter(g => !S(f, dt).includes(g)))
      } else o = this
    o !== null && Ee((_ = o), ze, va).call(_)
  }),
  (xs = function (t, r, s) {
    t.f ^= Ye
    for (var n = t.first; n !== null;) {
      var l = n.f,
        i = (l & (St | Jt)) !== 0,
        o = i && (l & Ye) !== 0,
        v = o || (l & lt) !== 0 || S(this, Ot).has(n)
      if (!v && n.fn !== null) {
        i
          ? (n.f ^= Ye)
          : (l & Kr) !== 0
            ? r.push(n)
            : za(n) && ((l & Tt) !== 0 && S(this, Mt).add(n), Xr(n))
        var d = n.first
        if (d !== null) {
          n = d
          continue
        }
      }
      for (; n !== null;) {
        var h = n.next
        if (h !== null) {
          n = h
          break
        }
        n = n.parent
      }
    }
  }),
  (jn = function () {
    for (var t = S(this, nr); t !== null;) {
      if (!t.is_fork) {
        for (const [r, [, s]] of this.current) if (t.current.has(r) && !s) return t
      }
      t = S(t, nr)
    }
    return null
  }),
  (qn = function (t) {
    var s
    for (const [n, l] of t.current)
      (!this.previous.has(n) && t.previous.has(n) && this.previous.set(n, t.previous.get(n)),
        this.current.set(n, l))
    for (const [n, l] of t.async_deriveds) {
      const i = this.async_deriveds.get(n)
      i && l.promise.then(i.resolve).catch(i.reject)
    }
    ;(t.async_deriveds.clear(), this.transfer_effects(S(t, Kt), S(t, Mt)))
    const r = n => {
      var l = n.reactions
      if (l !== null && !((n.f & tt) !== 0 && (n.f & (Je | $t)) === 0))
        for (const v of l) {
          var i = v.f
          if ((i & tt) !== 0) r(v)
          else {
            var o = v
            i & (Dr | Tt) &&
              !this.async_deriveds.has(o) &&
              (S(this, Mt).delete(o), Ge(o, Je), this.schedule(o))
          }
        }
    }
    for (const n of this.current.keys()) r(n)
    ;(this.oncommit(() => t.discard()),
      Ee((s = t), ze, da).call(s),
      (le = this),
      Ee(this, ze, va).call(this))
  }),
  (Or = function (t) {
    for (var r = 0; r < t.length; r += 1) On(t[r], S(this, Kt), S(this, Mt))
  }),
  (Wi = function () {
    var _
    for (let f = rs; f !== null; f = S(f, yr)) {
      var t = f.id < this.id,
        r = []
      for (const [g, [m, y]] of this.current) {
        if (f.current.has(g)) {
          var s = f.current.get(g)[0]
          if (t && m !== s) f.current.set(g, [m, y])
          else continue
        }
        r.push(g)
      }
      if (t)
        for (const [g, m] of this.async_deriveds) {
          const y = f.async_deriveds.get(g)
          y && m.promise.then(y.resolve).catch(y.reject)
        }
      var n = [...f.current.keys()].filter(g => !f.current.get(g)[1])
      if (!(!S(f, qr) || n.length === 0)) {
        var l = n.filter(g => !this.current.has(g))
        if (l.length === 0) t && f.discard()
        else if (r.length > 0) {
          if (t)
            for (const g of S(this, Wr))
              f.unskip_effect(g, m => {
                var y
                ;(m.f & (Tt | Dr)) !== 0 ? f.schedule(m) : Ee((y = f), ze, Or).call(y, [m])
              })
          f.activate()
          var i = new Set(),
            o = new Map()
          for (var v of r) Un(v, l, i, o)
          o = new Map()
          var d = [...f.current]
            .filter(([g, m]) => {
              const y = this.current.get(g)
              return y ? y[0] !== m[0] || y[1] !== m[1] : !0
            })
            .map(([g]) => g)
          if (d.length > 0)
            for (const g of S(this, xa))
              (g.f & (gt | lt | Ba)) === 0 &&
                Fs(g, d, o) &&
                ((g.f & (Dr | Tt)) !== 0 ? (Ge(g, Je), f.schedule(g)) : S(f, Kt).add(g))
          if (S(f, dt).length > 0 && !S(f, wr)) {
            f.apply()
            for (var h of S(f, dt)) Ee((_ = f), ze, xs).call(_, h, [], [])
            ce(f, dt, [])
          }
          f.deactivate()
        }
      }
    }
  }),
  (da = function () {
    if (this.linked) {
      var t = S(this, nr),
        r = S(this, yr)
      ;(t === null ? (rs = r) : ce(t, yr, r),
        r === null ? (Lr = t) : ce(r, nr, t),
        (this.linked = !1))
    }
  }))
let zr = Ya
function Ki(e) {
  var t = fa
  fa = !0
  try {
    for (var r; ;) {
      if ((zi(), le === null)) return r
      le.flush()
    }
  } finally {
    fa = t
  }
}
function Vi() {
  try {
    si()
  } catch (e) {
    lr(e, ws)
  }
}
let Et = null
function rn(e) {
  var t = e.length
  if (t !== 0) {
    for (var r = 0; r < t;) {
      var s = e[r++]
      if (
        (s.f & (gt | lt)) === 0 &&
        za(s) &&
        ((Et = new Set()),
        Xr(s),
        s.deps === null &&
          s.first === null &&
          s.nodes === null &&
          s.teardown === null &&
          s.ac === null &&
          al(s),
        (Et == null ? void 0 : Et.size) > 0)
      ) {
        xr.clear()
        for (const n of Et) {
          if ((n.f & (gt | lt)) !== 0) continue
          const l = [n]
          let i = n.parent
          for (; i !== null;) (Et.has(i) && (Et.delete(i), l.push(i)), (i = i.parent))
          for (let o = l.length - 1; o >= 0; o--) {
            const v = l[o]
            ;(v.f & (gt | lt)) === 0 && Xr(v)
          }
        }
        Et.clear()
      }
    }
    Et = null
  }
}
function Un(e, t, r, s) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const n of e.reactions) {
      const l = n.f
      ;(l & tt) !== 0
        ? Un(n, t, r, s)
        : (l & (Dr | Tt)) !== 0 && (l & Je) === 0 && Fs(n, t, s) && (Ge(n, Je), Ds(n))
    }
}
function Fs(e, t, r) {
  const s = r.get(e)
  if (s !== void 0) return s
  if (e.deps !== null)
    for (const n of e.deps) {
      if (Ua.call(t, n)) return !0
      if ((n.f & tt) !== 0 && Fs(n, t, r)) return (r.set(n, !0), !0)
    }
  return (r.set(e, !1), !1)
}
function Ds(e) {
  le.schedule(e)
}
function Bn(e, t) {
  if (!((e.f & St) !== 0 && (e.f & Ye) !== 0)) {
    ;((e.f & Je) !== 0 ? t.d.push(e) : (e.f & $t) !== 0 && t.m.push(e), Ge(e, Ye))
    for (var r = e.first; r !== null;) (Bn(r, t), (r = r.next))
  }
}
function Hn(e) {
  Ge(e, Ye)
  for (var t = e.first; t !== null;) (Hn(t), (t = t.next))
}
let Wa = new Set()
const xr = new Map()
let Gn = !1
function Tr(e, t) {
  var r = { f: 0, v: e, reactions: null, equals: Tn, rv: 0, wv: 0 }
  return r
}
function ae(e, t) {
  const r = Tr(e)
  return (ll(r), r)
}
function Yi(e, t = !1, r = !0) {
  var n
  const s = Tr(e)
  return (
    t || (s.equals = Cn),
    ea && r && Le !== null && Le.l !== null && ((n = Le.l).s ?? (n.s = [])).push(s),
    s
  )
}
function I(e, t, r = !1) {
  ye !== null &&
    (!Ct || (ye.f & Ba) !== 0) &&
    Ma() &&
    (ye.f & (tt | Tt | Dr | Ba)) !== 0 &&
    (Dt === null || !Dt.has(e)) &&
    oi()
  let s = r ? We(t) : t
  return Jr(e, s, Da)
}
function Jr(e, t, r = null) {
  if (!e.equals(t)) {
    xr.set(e, Xt ? t : e.v)
    var s = zr.ensure()
    if ((s.capture(e, t), (e.f & tt) !== 0)) {
      const n = e
      ;((e.f & Je) !== 0 && Ns(n), rt === null && Os(n))
    }
    ;((e.wv = ol()),
      Wn(e, Je, r),
      Ma() &&
        _e !== null &&
        (_e.f & Ye) !== 0 &&
        (_e.f & (St | Jt)) === 0 &&
        (mt === null ? no([e]) : mt.push(e)),
      !s.is_fork && Wa.size > 0 && !Gn && Ji())
  }
  return t
}
function Ji() {
  Gn = !1
  for (const e of Wa) {
    ;(e.f & Ye) !== 0 && Ge(e, $t)
    let t
    try {
      t = za(e)
    } catch {
      t = !0
    }
    t && Xr(e)
  }
  Wa.clear()
}
function pa(e) {
  I(e, e.v + 1)
}
function Wn(e, t, r) {
  var s = e.reactions
  if (s !== null)
    for (var n = Ma(), l = s.length, i = 0; i < l; i++) {
      var o = s[i],
        v = o.f
      if (!(!n && o === _e)) {
        var d = (v & Je) === 0
        if ((d && Ge(o, t), (v & Ba) !== 0)) Wa.add(o)
        else if ((v & tt) !== 0) {
          var h = o
          ;(rt == null || rt.delete(h),
            (v & Ar) === 0 &&
              (v & kt && (_e === null || (_e.f & Ha) === 0) && (o.f |= Ar), Wn(h, $t, r)))
        } else if (d) {
          var _ = o
          ;((v & Tt) !== 0 && Et !== null && Et.add(_), r !== null ? r.push(_) : Ds(_))
        }
      }
    }
}
function We(e) {
  if (typeof e != 'object' || e === null || Vt in e) return e
  const t = Ls(e)
  if (t !== Gl && t !== Wl) return e
  var r = new Map(),
    s = Is(e),
    n = ae(0),
    l = Sr,
    i = o => {
      if (Sr === l) return o()
      var v = ye,
        d = Sr
      ;(Pt(null), nn(l))
      var h = o()
      return (Pt(v), nn(d), h)
    }
  return (
    s && r.set('length', ae(e.length)),
    new Proxy(e, {
      defineProperty(o, v, d) {
        ;(!('value' in d) || d.configurable === !1 || d.enumerable === !1 || d.writable === !1) &&
          li()
        var h = r.get(v)
        return (
          h === void 0
            ? i(() => {
                var _ = ae(d.value)
                return (r.set(v, _), _)
              })
            : I(h, d.value, !0),
          !0
        )
      },
      deleteProperty(o, v) {
        var d = r.get(v)
        if (d === void 0) {
          if (v in o) {
            const h = i(() => ae(Ve))
            ;(r.set(v, h), pa(n))
          }
        } else (I(d, Ve), pa(n))
        return !0
      },
      get(o, v, d) {
        var g
        if (v === Vt) return e
        var h = r.get(v),
          _ = v in o
        if (
          (h === void 0 &&
            (!_ || ((g = Fr(o, v)) != null && g.writable)) &&
            ((h = i(() => {
              var m = We(_ ? o[v] : Ve),
                y = ae(m)
              return y
            })),
            r.set(v, h)),
          h !== void 0)
        ) {
          var f = a(h)
          return f === Ve ? void 0 : f
        }
        return Reflect.get(o, v, d)
      },
      getOwnPropertyDescriptor(o, v) {
        var d = Reflect.getOwnPropertyDescriptor(o, v)
        if (d && 'value' in d) {
          var h = r.get(v)
          h && (d.value = a(h))
        } else if (d === void 0) {
          var _ = r.get(v),
            f = _ == null ? void 0 : _.v
          if (_ !== void 0 && f !== Ve)
            return { enumerable: !0, configurable: !0, value: f, writable: !0 }
        }
        return d
      },
      has(o, v) {
        var f
        if (v === Vt) return !0
        var d = r.get(v),
          h = (d !== void 0 && d.v !== Ve) || Reflect.has(o, v)
        if (d !== void 0 || (_e !== null && (!h || ((f = Fr(o, v)) != null && f.writable)))) {
          d === void 0 &&
            ((d = i(() => {
              var g = h ? We(o[v]) : Ve,
                m = ae(g)
              return m
            })),
            r.set(v, d))
          var _ = a(d)
          if (_ === Ve) return !1
        }
        return h
      },
      set(o, v, d, h) {
        var x
        var _ = r.get(v),
          f = v in o
        if (s && v === 'length')
          for (var g = d; g < _.v; g += 1) {
            var m = r.get(g + '')
            m !== void 0 ? I(m, Ve) : g in o && ((m = i(() => ae(Ve))), r.set(g + '', m))
          }
        if (_ === void 0)
          (!f || ((x = Fr(o, v)) != null && x.writable)) &&
            ((_ = i(() => ae(void 0))), I(_, We(d)), r.set(v, _))
        else {
          f = _.v !== Ve
          var y = i(() => We(d))
          I(_, y)
        }
        var w = Reflect.getOwnPropertyDescriptor(o, v)
        if ((w != null && w.set && w.set.call(h, d), !f)) {
          if (s && typeof v == 'string') {
            var O = r.get('length'),
              H = Number(v)
            Number.isInteger(H) && H >= O.v && I(O, H + 1)
          }
          pa(n)
        }
        return !0
      },
      ownKeys(o) {
        a(n)
        var v = Reflect.ownKeys(o).filter(_ => {
          var f = r.get(_)
          return f === void 0 || f.v !== Ve
        })
        for (var [d, h] of r) h.v !== Ve && !(d in o) && v.push(d)
        return v
      },
      setPrototypeOf() {
        ii()
      },
    })
  )
}
function an(e) {
  try {
    if (e !== null && typeof e == 'object' && Vt in e) return e[Vt]
  } catch {}
  return e
}
function Xi(e, t) {
  return Object.is(an(e), an(t))
}
var ks, Kn, Vn, Yn
function Zi() {
  if (ks === void 0) {
    ;((ks = window), (Kn = /Firefox/.test(navigator.userAgent)))
    var e = Element.prototype,
      t = Node.prototype,
      r = Text.prototype
    ;((Vn = Fr(t, 'firstChild').get),
      (Yn = Fr(t, 'nextSibling').get),
      Qs(e) && ((e[hs] = void 0), (e[Oa] = null), (e[_s] = void 0), (e.__e = void 0)),
      Qs(r) && (r[ia] = void 0))
  }
}
function Yt(e = '') {
  return document.createTextNode(e)
}
function Ft(e) {
  return Vn.call(e)
}
function Aa(e) {
  return Yn.call(e)
}
function u(e, t) {
  return Ft(e)
}
function ee(e, t = !1) {
  {
    var r = Ft(e)
    return r instanceof Comment && r.data === '' ? Aa(r) : r
  }
}
function c(e, t = 1, r = !1) {
  let s = e
  for (; t--;) s = Aa(s)
  return s
}
function Qi(e) {
  e.textContent = ''
}
function Jn() {
  return !1
}
function Xn(e, t, r) {
  return t == null || t === zn
    ? r
      ? document.createElement(e, { is: r })
      : document.createElement(e)
    : r
      ? document.createElementNS(t, e, { is: r })
      : document.createElementNS(t, e)
}
function Zn(e) {
  ;(_e === null && (ye === null && ai(), ri()), Xt && ti())
}
function eo(e, t) {
  var r = t.last
  r === null ? (t.last = t.first = e) : ((r.next = e), (e.prev = r), (t.last = e))
}
function qt(e, t) {
  var r = _e
  r !== null && (r.f & lt) !== 0 && (e |= lt)
  var s = {
    ctx: Le,
    deps: null,
    nodes: null,
    f: e | Je | kt,
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
  le == null || le.register_created_effect(s)
  var n = s
  if ((e & Kr) !== 0) Rr !== null ? Rr.push(s) : zr.ensure().schedule(s)
  else if (t !== null) {
    try {
      Xr(s)
    } catch (i) {
      throw (ut(s), i)
    }
    n.deps === null &&
      n.teardown === null &&
      n.nodes === null &&
      n.first === n.last &&
      (n.f & Qr) === 0 &&
      ((n = n.first), (e & Tt) !== 0 && (e & Mr) !== 0 && n !== null && (n.f |= Mr))
  }
  if (
    n !== null &&
    ((n.parent = r), r !== null && eo(n, r), ye !== null && (ye.f & tt) !== 0 && (e & Jt) === 0)
  ) {
    var l = ye
    ;(l.effects ?? (l.effects = [])).push(n)
  }
  return s
}
function js() {
  return ye !== null && !Ct
}
function qs(e) {
  const t = qt(Pa, null)
  return (Ge(t, Ye), (t.teardown = e), t)
}
function Lt(e) {
  Zn()
  var t = _e.f,
    r = !ye && (t & St) !== 0 && Le !== null && !Le.i
  if (r) {
    var s = Le
    ;(s.e ?? (s.e = [])).push(e)
  } else return Qn(e)
}
function Qn(e) {
  return qt(Kr | Mn, e)
}
function to(e) {
  return (Zn(), qt(Pa | Mn, e))
}
function ro(e) {
  zr.ensure()
  const t = qt(Jt | Qr, e)
  return (r = {}) =>
    new Promise(s => {
      r.outro
        ? kr(t, () => {
            ;(ut(t), s(void 0))
          })
        : (ut(t), s(void 0))
    })
}
function el(e) {
  return qt(Kr, e)
}
function ao(e) {
  return qt(Dr | Qr, e)
}
function Us(e, t = 0) {
  return qt(Pa | t, e)
}
function L(e, t = [], r = [], s = []) {
  ji(s, t, r, n => {
    qt(Pa, () => {
      e(...n.map(a))
    })
  })
}
function Za(e, t = 0) {
  var r = qt(Tt | t, e)
  return r
}
function xt(e) {
  return qt(St | Qr, e)
}
function tl(e) {
  var t = e.teardown
  if (t !== null) {
    const r = Xt,
      s = ye
    ;(sn(!0), Pt(null))
    try {
      t.call(null)
    } finally {
      ;(sn(r), Pt(s))
    }
  }
}
function Bs(e, t = !1) {
  var r = e.first
  for (e.first = e.last = null; r !== null;) {
    const n = r.ac
    n !== null &&
      ta(() => {
        n.abort(Ea)
      })
    var s = r.next
    ;((r.f & Jt) !== 0 ? (r.parent = null) : ut(r, t), (r = s))
  }
}
function so(e) {
  for (var t = e.first; t !== null;) {
    var r = t.next
    ;((t.f & St) === 0 && ut(t), (t = r))
  }
}
function ut(e, t = !0) {
  var r = !1
  ;((t || (e.f & Vl) !== 0) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (rl(e.nodes.start, e.nodes.end), (r = !0)),
    (e.f |= ps),
    Bs(e, t && !r),
    ma(e, 0))
  var s = e.nodes && e.nodes.t
  if (s !== null) for (const l of s) l.stop()
  ;(tl(e), (e.f ^= ps), (e.f |= gt))
  var n = e.parent
  ;(n !== null && n.first !== null && al(e),
    (e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null))
}
function rl(e, t) {
  for (; e !== null;) {
    var r = e === t ? null : Aa(e)
    ;(e.remove(), (e = r))
  }
}
function al(e) {
  var t = e.parent,
    r = e.prev,
    s = e.next
  ;(r !== null && (r.next = s),
    s !== null && (s.prev = r),
    t !== null && (t.first === e && (t.first = s), t.last === e && (t.last = r)))
}
function kr(e, t, r = !0) {
  var s = []
  sl(e, s, !0)
  var n = () => {
      ;(r && ut(e), t && t())
    },
    l = s.length
  if (l > 0) {
    var i = () => --l || n()
    for (var o of s) o.out(i)
  } else n()
}
function sl(e, t, r) {
  if ((e.f & lt) === 0) {
    e.f ^= lt
    var s = e.nodes && e.nodes.t
    if (s !== null) for (const o of s) (o.is_global || r) && t.push(o)
    for (var n = e.first; n !== null;) {
      var l = n.next
      if ((n.f & Jt) === 0) {
        var i = (n.f & Mr) !== 0 || ((n.f & St) !== 0 && (e.f & Tt) !== 0)
        sl(n, t, i ? r : !1)
      }
      n = l
    }
  }
}
function Ka(e) {
  nl(e, !0)
}
function nl(e, t) {
  if ((e.f & lt) !== 0) {
    ;((e.f ^= lt), (e.f & Ye) === 0 && (Ge(e, Je), zr.ensure().schedule(e)))
    for (var r = e.first; r !== null;) {
      var s = r.next,
        n = (r.f & Mr) !== 0 || (r.f & St) !== 0
      ;(nl(r, n ? t : !1), (r = s))
    }
    var l = e.nodes && e.nodes.t
    if (l !== null) for (const i of l) (i.is_global || t) && i.in()
  }
}
function Hs(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, s = e.nodes.end; r !== null;) {
      var n = r === s ? null : Aa(r)
      ;(t.append(r), (r = n))
    }
}
let ja = !1,
  Xt = !1
function sn(e) {
  Xt = e
}
let ye = null,
  Ct = !1
function Pt(e) {
  ye = e
}
let _e = null
function jt(e) {
  _e = e
}
let Dt = null
function ll(e) {
  ye !== null && (Dt ?? (Dt = new Set())).add(e)
}
let ct = null,
  ft = 0,
  mt = null
function no(e) {
  mt = e
}
let il = 1,
  pr = 0,
  Sr = pr
function nn(e) {
  Sr = e
}
function ol() {
  return ++il
}
function za(e) {
  var t = e.f
  if ((t & Je) !== 0) return !0
  if ((t & tt && (e.f &= ~Ar), (t & $t) !== 0)) {
    for (var r = e.deps, s = r.length, n = 0; n < s; n++) {
      var l = r[n]
      if ((za(l) && Fn(l), l.wv > e.wv)) return !0
    }
    ;(t & kt) !== 0 && rt === null && Ge(e, Ye)
  }
  return !1
}
function vl(e, t, r = !0) {
  var s = e.reactions
  if (s !== null && !(Dt !== null && Dt.has(e)))
    for (var n = 0; n < s.length; n++) {
      var l = s[n]
      ;(l.f & tt) !== 0
        ? vl(l, t, !1)
        : t === l && (r ? Ge(l, Je) : (l.f & Ye) !== 0 && Ge(l, $t), Ds(l))
    }
}
function dl(e) {
  var y
  var t = ct,
    r = ft,
    s = mt,
    n = ye,
    l = Dt,
    i = Le,
    o = Ct,
    v = Sr,
    d = e.f
  ;((ct = null),
    (ft = 0),
    (mt = null),
    (ye = (d & (St | Jt)) === 0 ? e : null),
    (Dt = null),
    Vr(e.ctx),
    (Ct = !1),
    (Sr = ++pr),
    e.ac !== null &&
      (ta(() => {
        e.ac.abort(Ea)
      }),
      (e.ac = null)))
  try {
    e.f |= Ha
    var h = e.fn,
      _ = h()
    e.f |= Zr
    var f = e.deps,
      g = le == null ? void 0 : le.is_fork
    if (ct !== null) {
      var m
      if ((g || ma(e, ft), f !== null && ft > 0))
        for (f.length = ft + ct.length, m = 0; m < ct.length; m++) f[ft + m] = ct[m]
      else e.deps = f = ct
      if (js() && (e.f & kt) !== 0)
        for (m = ft; m < f.length; m++) ((y = f[m]).reactions ?? (y.reactions = [])).push(e)
    } else !g && f !== null && ft < f.length && (ma(e, ft), (f.length = ft))
    if (Ma() && mt !== null && !Ct && f !== null && (e.f & (tt | $t | Je)) === 0)
      for (m = 0; m < mt.length; m++) vl(mt[m], e)
    if (n !== null && n !== e) {
      if ((pr++, n.deps !== null)) for (let w = 0; w < r; w += 1) n.deps[w].rv = pr
      if (t !== null) for (const w of t) w.rv = pr
      mt !== null && (s === null ? (s = mt) : s.push(...mt))
    }
    return ((e.f & dr) !== 0 && (e.f ^= dr), _)
  } catch (w) {
    return In(w)
  } finally {
    ;((e.f ^= Ha), (ct = t), (ft = r), (mt = s), (ye = n), (Dt = l), Vr(i), (Ct = o), (Sr = v))
  }
}
function lo(e, t) {
  let r = t.reactions
  if (r !== null) {
    var s = Bl.call(r, e)
    if (s !== -1) {
      var n = r.length - 1
      n === 0 ? (r = t.reactions = null) : ((r[s] = r[n]), r.pop())
    }
  }
  if (r === null && (t.f & tt) !== 0 && (ct === null || !Ua.call(ct, t))) {
    var l = t
    ;((l.f & kt) !== 0 && ((l.f ^= kt), (l.f &= ~Ar)),
      l.v !== Ve && Os(l),
      l.ac !== null &&
        ta(() => {
          ;(l.ac.abort(Ea), (l.ac = null))
        }),
      Hi(l),
      ma(l, 0))
  }
}
function ma(e, t) {
  var r = e.deps
  if (r !== null) for (var s = t; s < r.length; s++) lo(e, r[s])
}
function Xr(e) {
  var t = e.f
  if ((t & gt) === 0) {
    Ge(e, Ye)
    var r = _e,
      s = ja
    ;((_e = e), (ja = (t & (St | Jt)) === 0))
    try {
      ;((t & (Tt | En)) !== 0 ? so(e) : Bs(e), tl(e))
      var n = dl(e)
      ;((e.teardown = typeof n == 'function' ? n : null), (e.wv = il))
      var l
      xn && Mi && (e.f & Je) !== 0 && e.deps
    } finally {
      ;((ja = s), (_e = r))
    }
  }
}
async function io() {
  ;(await Promise.resolve(), Ki())
}
function a(e) {
  var t = e.f,
    r = (t & tt) !== 0
  if (ye !== null && !Ct) {
    var s = _e !== null && (_e.f & gt) !== 0
    if (!s && (Dt === null || !Dt.has(e))) {
      var n = ye.deps
      if ((ye.f & Ha) !== 0)
        e.rv < pr &&
          ((e.rv = pr),
          ct === null && n !== null && n[ft] === e ? ft++ : ct === null ? (ct = [e]) : ct.push(e))
      else {
        ;(ye.deps ?? (ye.deps = []), Ua.call(ye.deps, e) || ye.deps.push(e))
        var l = e.reactions
        l === null ? (e.reactions = [ye]) : Ua.call(l, ye) || l.push(ye)
      }
    }
  }
  if (Xt && xr.has(e)) return xr.get(e)
  if (r) {
    var i = e
    if (Xt) {
      var o = i.v
      return ((((i.f & Ye) === 0 && i.reactions !== null) || ul(i)) && (o = Ns(i)), xr.set(i, o), o)
    }
    var v = (i.f & kt) === 0 && !Ct && ye !== null && (ja || (ye.f & kt) !== 0),
      d = (i.f & Zr) === 0
    ;(za(i) && (v && (i.f |= kt), Fn(i)), v && !d && (Dn(i), cl(i)))
  }
  if (rt != null && rt.has(e)) return rt.get(e)
  if ((e.f & dr) !== 0) throw e.v
  return e.v
}
function cl(e) {
  if (((e.f |= kt), e.deps !== null))
    for (const t of e.deps)
      ((t.reactions ?? (t.reactions = [])).push(e),
        (t.f & tt) !== 0 && (t.f & kt) === 0 && (Dn(t), cl(t)))
}
function ul(e) {
  if (e.v === Ve) return !0
  if (e.deps === null) return !1
  for (const t of e.deps) if (xr.has(t) || ((t.f & tt) !== 0 && ul(t))) return !0
  return !1
}
function ra(e) {
  var t = Ct
  try {
    return ((Ct = !0), e())
  } finally {
    Ct = t
  }
}
function oo(e) {
  if (!(typeof e != 'object' || !e || e instanceof EventTarget)) {
    if (Vt in e) Ss(e)
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t]
        typeof r == 'object' && r && Vt in r && Ss(r)
      }
  }
}
function Ss(e, t = new Set()) {
  if (typeof e == 'object' && e !== null && !(e instanceof EventTarget) && !t.has(e)) {
    ;(t.add(e), e instanceof Date && e.getTime())
    for (let s in e)
      try {
        Ss(e[s], t)
      } catch {}
    const r = Ls(e)
    if (
      r !== Object.prototype &&
      r !== Array.prototype &&
      r !== Map.prototype &&
      r !== Set.prototype &&
      r !== Date.prototype
    ) {
      const s = kn(r)
      for (let n in s) {
        const l = s[n].get
        if (l)
          try {
            l.call(e)
          } catch {}
      }
    }
  }
}
const vo = ['touchstart', 'touchmove']
function co(e) {
  return vo.includes(e)
}
const hr = Symbol('events'),
  fl = new Set(),
  Ps = new Set()
function uo(e, t, r, s = {}) {
  function n(l) {
    if ((s.capture || Es.call(t, l), !l.cancelBubble))
      return ta(() => (r == null ? void 0 : r.call(this, l)))
  }
  return (
    e.startsWith('pointer') || e.startsWith('touch') || e === 'wheel'
      ? cr(() => {
          t.addEventListener(e, n, s)
        })
      : t.addEventListener(e, n, s),
    n
  )
}
function qa(e, t, r, s, n) {
  var l = { capture: s, passive: n },
    i = uo(e, t, r, l)
  ;(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) &&
    qs(() => {
      t.removeEventListener(e, i, l)
    })
}
function ie(e, t, r) {
  ;(t[hr] ?? (t[hr] = {}))[e] = r
}
function Ke(e) {
  for (var t = 0; t < e.length; t++) fl.add(e[t])
  for (var r of Ps) r(e)
}
let ln = null
function Es(e) {
  var y, w
  var t = this,
    r = t.ownerDocument,
    s = e.type,
    n = ((y = e.composedPath) == null ? void 0 : y.call(e)) || [],
    l = n[0] || e.target
  ln = e
  var i = 0,
    o = ln === e && e[hr]
  if (o) {
    var v = n.indexOf(o)
    if (v !== -1 && (t === document || t === window)) {
      e[hr] = t
      return
    }
    var d = n.indexOf(t)
    if (d === -1) return
    v <= d && (i = v)
  }
  if (((l = n[i] || e.target), l !== t)) {
    Hl(e, 'currentTarget', {
      configurable: !0,
      get() {
        return l || r
      },
    })
    var h = ye,
      _ = _e
    ;(Pt(null), jt(null))
    try {
      for (var f, g = []; l !== null && l !== t;) {
        try {
          var m = (w = l[hr]) == null ? void 0 : w[s]
          m != null && (!l.disabled || e.target === l) && m.call(l, e)
        } catch (O) {
          f ? g.push(O) : (f = O)
        }
        if (e.cancelBubble) break
        ;(i++, (l = i < n.length ? n[i] : null))
      }
      if (f) {
        for (let O of g)
          queueMicrotask(() => {
            throw O
          })
        throw f
      }
    } finally {
      ;((e[hr] = t), delete e.currentTarget, Pt(h), jt(_))
    }
  }
}
var wn
const ss =
  ((wn = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : wn.trustedTypes) &&
  globalThis.window.trustedTypes.createPolicy('svelte-trusted-html', { createHTML: e => e })
function fo(e) {
  return (ss == null ? void 0 : ss.createHTML(e)) ?? e
}
function pl(e) {
  var t = Xn('template')
  return ((t.innerHTML = fo(e.replaceAll('<!>', '<!---->'))), t.content)
}
function Cr(e, t) {
  var r = _e
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null })
}
function b(e, t) {
  var r = (t & yi) !== 0,
    s = (t & wi) !== 0,
    n,
    l = !e.startsWith('<!>')
  return () => {
    n === void 0 && ((n = pl(l ? e : '<!>' + e)), r || (n = Ft(n)))
    var i = s || Kn ? document.importNode(n, !0) : n.cloneNode(!0)
    if (r) {
      var o = Ft(i),
        v = i.lastChild
      Cr(o, v)
    } else Cr(i, i)
    return i
  }
}
function po(e, t, r = 'svg') {
  var s = !e.startsWith('<!>'),
    n = `<${r}>${s ? e : '<!>' + e}</${r}>`,
    l
  return () => {
    if (!l) {
      var i = pl(n),
        o = Ft(i)
      l = Ft(o)
    }
    var v = l.cloneNode(!0)
    return (Cr(v, v), v)
  }
}
function Gs(e, t) {
  return po(e, t, 'svg')
}
function Q(e = '') {
  {
    var t = Yt(e + '')
    return (Cr(t, t), t)
  }
}
function it() {
  var e = document.createDocumentFragment(),
    t = document.createComment(''),
    r = Yt()
  return (e.append(t, r), Cr(t, r), e)
}
function p(e, t) {
  e !== null && e.before(t)
}
function M(e, t) {
  var r = t == null ? '' : typeof t == 'object' ? `${t}` : t
  r !== (e[ia] ?? (e[ia] = e.nodeValue)) && ((e[ia] = r), (e.nodeValue = `${r}`))
}
function ho(e, t) {
  return _o(e, t)
}
const $a = new Map()
function _o(
  e,
  { target: t, anchor: r, props: s = {}, events: n, context: l, intro: i = !0, transformError: o }
) {
  Zi()
  var v = void 0,
    d = ro(() => {
      var h = r ?? t.appendChild(Yt())
      Oi(
        h,
        { pending: () => {} },
        g => {
          ge({})
          var m = Le
          ;(l && (m.c = l), n && (s.$$events = n), (v = e(g, s) || {}), me())
        },
        o
      )
      var _ = new Set(),
        f = g => {
          for (var m = 0; m < g.length; m++) {
            var y = g[m]
            if (!_.has(y)) {
              _.add(y)
              var w = co(y)
              for (const x of [t, document]) {
                var O = $a.get(x)
                O === void 0 && ((O = new Map()), $a.set(x, O))
                var H = O.get(y)
                H === void 0
                  ? (x.addEventListener(y, Es, { passive: w }), O.set(y, 1))
                  : O.set(y, H + 1)
              }
            }
          }
        }
      return (
        f(Xa(fl)),
        Ps.add(f),
        () => {
          var w
          for (var g of _)
            for (const O of [t, document]) {
              var m = $a.get(O),
                y = m.get(g)
              --y == 0
                ? (O.removeEventListener(g, Es), m.delete(g), m.size === 0 && $a.delete(O))
                : m.set(g, y)
            }
          ;(Ps.delete(f), h !== r && ((w = h.parentNode) == null || w.removeChild(h)))
        }
      )
    })
  return (go.set(v, d), v)
}
let go = new WeakMap()
var At, Rt, ht, br, ka, Sa, Ja
class hl {
  constructor(t, r = !0) {
    st(this, 'anchor')
    fe(this, At, new Map())
    fe(this, Rt, new Map())
    fe(this, ht, new Map())
    fe(this, br, new Set())
    fe(this, ka, !0)
    fe(this, Sa, t => {
      if (S(this, At).has(t)) {
        var r = S(this, At).get(t),
          s = S(this, Rt).get(r)
        if (s) (Ka(s), S(this, br).delete(r))
        else {
          var n = S(this, ht).get(r)
          n &&
            (Ka(n.effect),
            S(this, Rt).set(r, n.effect),
            S(this, ht).delete(r),
            n.fragment.lastChild.remove(),
            this.anchor.before(n.fragment),
            (s = n.effect))
        }
        for (const [l, i] of S(this, At)) {
          if ((S(this, At).delete(l), l === t)) break
          const o = S(this, ht).get(i)
          o && (ut(o.effect), S(this, ht).delete(i))
        }
        for (const [l, i] of S(this, Rt)) {
          if (l === r || S(this, br).has(l)) continue
          const o = () => {
            if (Array.from(S(this, At).values()).includes(l)) {
              var d = document.createDocumentFragment()
              ;(Hs(i, d), d.append(Yt()), S(this, ht).set(l, { effect: i, fragment: d }))
            } else ut(i)
            ;(S(this, br).delete(l), S(this, Rt).delete(l))
          }
          S(this, ka) || !s ? (S(this, br).add(l), kr(i, o, !1)) : o()
        }
      }
    })
    fe(this, Ja, t => {
      S(this, At).delete(t)
      const r = Array.from(S(this, At).values())
      for (const [s, n] of S(this, ht)) r.includes(s) || (ut(n.effect), S(this, ht).delete(s))
    })
    ;((this.anchor = t), ce(this, ka, r))
  }
  ensure(t, r) {
    var s = le,
      n = Jn()
    if (r && !S(this, Rt).has(t) && !S(this, ht).has(t))
      if (n) {
        var l = document.createDocumentFragment(),
          i = Yt()
        ;(l.append(i), S(this, ht).set(t, { effect: xt(() => r(i)), fragment: l }))
      } else
        S(this, Rt).set(
          t,
          xt(() => r(this.anchor))
        )
    if ((S(this, At).set(s, t), n)) {
      for (const [o, v] of S(this, Rt)) o === t ? s.unskip_effect(v) : s.skip_effect(v)
      for (const [o, v] of S(this, ht))
        o === t ? s.unskip_effect(v.effect) : s.skip_effect(v.effect)
      ;(s.oncommit(S(this, Sa)), s.ondiscard(S(this, Ja)))
    } else S(this, Sa).call(this, s)
  }
}
;((At = new WeakMap()),
  (Rt = new WeakMap()),
  (ht = new WeakMap()),
  (br = new WeakMap()),
  (ka = new WeakMap()),
  (Sa = new WeakMap()),
  (Ja = new WeakMap()))
function U(e, t, r = !1) {
  var s = new hl(e),
    n = r ? Mr : 0
  function l(i, o) {
    s.ensure(i, o)
  }
  Za(() => {
    var i = !1
    ;(t((o, v = 0) => {
      ;((i = !0), l(v, o))
    }),
      i || l(-1, null))
  }, n)
}
function Pr(e, t) {
  return t
}
function mo(e, t, r) {
  for (var s = [], n = t.length, l, i = t.length, o = 0; o < n; o++) {
    let _ = t[o]
    kr(
      _,
      () => {
        if (l) {
          if ((l.pending.delete(_), l.done.add(_), l.pending.size === 0)) {
            var f = e.outrogroups
            ;(Ms(e, Xa(l.done)), f.delete(l), f.size === 0 && (e.outrogroups = null))
          }
        } else i -= 1
      },
      !1
    )
  }
  if (i === 0) {
    var v = s.length === 0 && r !== null
    if (v) {
      var d = r,
        h = d.parentNode
      ;(Qi(h), h.append(d), e.items.clear())
    }
    Ms(e, t, !v)
  } else
    ((l = { pending: new Set(t), done: new Set() }),
      (e.outrogroups ?? (e.outrogroups = new Set())).add(l))
}
function Ms(e, t, r = !0) {
  var s
  if (e.pending.size > 0) {
    s = new Set()
    for (const i of e.pending.values()) for (const o of i) s.add(e.items.get(o).e)
  }
  for (var n = 0; n < t.length; n++) {
    var l = t[n]
    if (s != null && s.has(l)) {
      l.f |= Nt
      const i = document.createDocumentFragment()
      Hs(l, i)
    } else ut(t[n], r)
  }
}
var on
function Pe(e, t, r, s, n, l = null) {
  var i = e,
    o = new Map(),
    v = (t & An) !== 0
  if (v) {
    var d = e
    i = d.appendChild(Yt())
  }
  var h = null,
    _ = Rs(() => {
      var x = r()
      return Is(x) ? x : x == null ? [] : Xa(x)
    }),
    f,
    g = new Map(),
    m = !0
  function y(x) {
    ;(H.effect.f & gt) === 0 &&
      (H.pending.delete(x),
      (H.fallback = h),
      yo(H, f, i, t, s),
      h !== null &&
        (f.length === 0
          ? (h.f & Nt) === 0
            ? Ka(h)
            : ((h.f ^= Nt), ca(h, null, i))
          : kr(h, () => {
              h = null
            })))
  }
  function w(x) {
    H.pending.delete(x)
  }
  var O = Za(() => {
      f = a(_)
      for (var x = f.length, C = new Set(), R = le, G = Jn(), z = 0; z < x; z += 1) {
        var B = f[z],
          W = s(B, z),
          N = m ? null : o.get(W)
        ;(N
          ? (N.v && Jr(N.v, B), N.i && Jr(N.i, z), G && R.unskip_effect(N.e))
          : ((N = wo(o, m ? i : (on ?? (on = Yt())), B, W, z, n, t, r)),
            m || (N.e.f |= Nt),
            o.set(W, N)),
          C.add(W))
      }
      if (
        (x === 0 &&
          l &&
          !h &&
          (m ? (h = xt(() => l(i))) : ((h = xt(() => l(on ?? (on = Yt())))), (h.f |= Nt))),
        x > C.size && ei(),
        !m)
      )
        if ((g.set(R, C), G)) {
          for (const [P, $] of o) C.has(P) || R.skip_effect($.e)
          ;(R.oncommit(y), R.ondiscard(w))
        } else y(R)
      a(_)
    }),
    H = { effect: O, items: o, pending: g, outrogroups: null, fallback: h }
  m = !1
}
function na(e) {
  for (; e !== null && (e.f & St) === 0;) e = e.next
  return e
}
function yo(e, t, r, s, n) {
  var N, P, $, k, T, E, D, A, j
  var l = (s & ui) !== 0,
    i = t.length,
    o = e.items,
    v = na(e.effect.first),
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
        (y = n(m, O)),
        (w = o.get(y).e),
        (w.f & Nt) === 0 &&
          ((P = (N = w.nodes) == null ? void 0 : N.a) == null || P.measure(),
          (_ ?? (_ = new Set())).add(w)))
  for (O = 0; O < i; O += 1) {
    if (((m = t[O]), (y = n(m, O)), (w = o.get(y).e), e.outrogroups !== null))
      for (const q of e.outrogroups) (q.pending.delete(w), q.done.delete(w))
    if (
      ((w.f & lt) !== 0 &&
        (Ka(w),
        l &&
          ((k = ($ = w.nodes) == null ? void 0 : $.a) == null || k.unfix(),
          (_ ?? (_ = new Set())).delete(w))),
      (w.f & Nt) !== 0)
    )
      if (((w.f ^= Nt), w === v)) ca(w, null, r)
      else {
        var H = h ? h.next : v
        ;(w === e.effect.last && (e.effect.last = w.prev),
          w.prev && (w.prev.next = w.next),
          w.next && (w.next.prev = w.prev),
          tr(e, h, w),
          tr(e, w, H),
          ca(w, H, r),
          (h = w),
          (f = []),
          (g = []),
          (v = na(h.next)))
        continue
      }
    if (w !== v) {
      if (d !== void 0 && d.has(w)) {
        if (f.length < g.length) {
          var x = g[0],
            C
          h = x.prev
          var R = f[0],
            G = f[f.length - 1]
          for (C = 0; C < f.length; C += 1) ca(f[C], x, r)
          for (C = 0; C < g.length; C += 1) d.delete(g[C])
          ;(tr(e, R.prev, G.next),
            tr(e, h, R),
            tr(e, G, x),
            (v = x),
            (h = G),
            (O -= 1),
            (f = []),
            (g = []))
        } else
          (d.delete(w),
            ca(w, v, r),
            tr(e, w.prev, w.next),
            tr(e, w, h === null ? e.effect.first : h.next),
            tr(e, h, w),
            (h = w))
        continue
      }
      for (f = [], g = []; v !== null && v !== w;)
        ((d ?? (d = new Set())).add(v), g.push(v), (v = na(v.next)))
      if (v === null) continue
    }
    ;((w.f & Nt) === 0 && f.push(w), (h = w), (v = na(w.next)))
  }
  if (e.outrogroups !== null) {
    for (const q of e.outrogroups)
      q.pending.size === 0 && (Ms(e, Xa(q.done)), (T = e.outrogroups) == null || T.delete(q))
    e.outrogroups.size === 0 && (e.outrogroups = null)
  }
  if (v !== null || d !== void 0) {
    var z = []
    if (d !== void 0) for (w of d) (w.f & lt) === 0 && z.push(w)
    for (; v !== null;) ((v.f & lt) === 0 && v !== e.fallback && z.push(v), (v = na(v.next)))
    var B = z.length
    if (B > 0) {
      var W = (s & An) !== 0 && i === 0 ? r : null
      if (l) {
        for (O = 0; O < B; O += 1)
          (D = (E = z[O].nodes) == null ? void 0 : E.a) == null || D.measure()
        for (O = 0; O < B; O += 1) (j = (A = z[O].nodes) == null ? void 0 : A.a) == null || j.fix()
      }
      mo(e, z, W)
    }
  }
  l &&
    cr(() => {
      var q, F
      if (_ !== void 0) for (w of _) (F = (q = w.nodes) == null ? void 0 : q.a) == null || F.apply()
    })
}
function wo(e, t, r, s, n, l, i, o) {
  var v = (i & di) !== 0 ? ((i & fi) === 0 ? Yi(r, !1, !1) : Tr(r)) : null,
    d = (i & ci) !== 0 ? Tr(n) : null
  return {
    v,
    i: d,
    e: xt(
      () => (
        l(t, v ?? r, d ?? n, o),
        () => {
          e.delete(s)
        }
      )
    ),
  }
}
function ca(e, t, r) {
  if (e.nodes)
    for (
      var s = e.nodes.start, n = e.nodes.end, l = t && (t.f & Nt) === 0 ? t.nodes.start : r;
      s !== null;
    ) {
      var i = Aa(s)
      if ((l.before(s), s === n)) return
      s = i
    }
}
function tr(e, t, r) {
  ;(t === null ? (e.effect.first = r) : (t.next = r),
    r === null ? (e.effect.last = t) : (r.prev = t))
}
function bo(e, t, r = !1, s = !1, n = !1, l = !1) {
  var i = e,
    o = ''
  if (r) var v = e
  L(() => {
    var d = _e
    if (o !== (o = t() ?? '')) {
      if (r) {
        ;((d.nodes = null), (v.innerHTML = o), o !== '' && Cr(Ft(v), v.lastChild))
        return
      }
      if ((d.nodes !== null && (rl(d.nodes.start, d.nodes.end), (d.nodes = null)), o !== '')) {
        var h = s ? bi : n ? xi : void 0,
          _ = Xn(s ? 'svg' : n ? 'math' : 'template', h)
        _.innerHTML = o
        var f = s || n ? _ : _.content
        if ((Cr(Ft(f), f.lastChild), s || n)) for (; Ft(f);) i.before(Ft(f))
        else i.before(f)
      }
    }
  })
}
function Ir(e, t, ...r) {
  var s = new hl(e)
  Za(() => {
    const n = t() ?? null
    s.ensure(n, n && (l => n(l, ...r)))
  }, Mr)
}
const vn = [
  ...` 	
\r\f \v\uFEFF`,
]
function xo(e, t, r) {
  var s = e == null ? '' : '' + e
  if ((t && (s = s ? s + ' ' + t : t), r)) {
    for (var n of Object.keys(r))
      if (r[n]) s = s ? s + ' ' + n : n
      else if (s.length)
        for (var l = n.length, i = 0; (i = s.indexOf(n, i)) >= 0;) {
          var o = i + l
          ;(i === 0 || vn.includes(s[i - 1])) && (o === s.length || vn.includes(s[o]))
            ? (s = (i === 0 ? '' : s.substring(0, i)) + s.substring(o + 1))
            : (i = o)
        }
  }
  return s === '' ? null : s
}
function dn(e, t = !1) {
  var r = t ? ' !important;' : ';',
    s = ''
  for (var n of Object.keys(e)) {
    var l = e[n]
    l != null && l !== '' && (s += ' ' + n + ': ' + l + r)
  }
  return s
}
function ns(e) {
  return e[0] !== '-' || e[1] !== '-' ? e.toLowerCase() : e
}
function ko(e, t) {
  if (t) {
    var r = '',
      s,
      n
    if ((Array.isArray(t) ? ((s = t[0]), (n = t[1])) : (s = t), e)) {
      e = String(e)
        .replaceAll(/\s*\/\*.*?\*\/\s*/g, '')
        .trim()
      var l = !1,
        i = 0,
        o = !1,
        v = []
      ;(s && v.push(...Object.keys(s).map(ns)), n && v.push(...Object.keys(n).map(ns)))
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
              var g = ns(e.substring(d, h).trim())
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
    return (s && (r += dn(s)), n && (r += dn(n, !0)), (r = r.trim()), r === '' ? null : r)
  }
  return e == null ? null : String(e)
}
function je(e, t, r, s, n, l) {
  var i = e[hs]
  if (i !== r || i === void 0) {
    var o = xo(r, s, l)
    ;(o == null ? e.removeAttribute('class') : (e.className = o), (e[hs] = r))
  } else if (l && n !== l)
    for (var v in l) {
      var d = !!l[v]
      ;(n == null || d !== !!n[v]) && e.classList.toggle(v, d)
    }
  return l
}
function ls(e, t = {}, r, s) {
  for (var n in r) {
    var l = r[n]
    t[n] !== l && (r[n] == null ? e.style.removeProperty(n) : e.style.setProperty(n, l, s))
  }
}
function et(e, t, r, s) {
  var n = e[_s]
  if (n !== t) {
    var l = ko(t, s)
    ;(l == null ? e.removeAttribute('style') : (e.style.cssText = l), (e[_s] = t))
  } else
    s &&
      (Array.isArray(s)
        ? (ls(e, r == null ? void 0 : r[0], s[0]),
          ls(e, r == null ? void 0 : r[1], s[1], 'important'))
        : ls(e, r, s))
  return s
}
function Ut(e, t, r = !1) {
  if (e.multiple) {
    if (t == null) return
    if (!Is(t)) return Si()
    for (var s of e.options) s.selected = t.includes(ha(s))
    return
  }
  for (s of e.options) {
    var n = ha(s)
    if (Xi(n, t)) {
      s.selected = !0
      return
    }
  }
  ;(!r || t !== void 0) && (e.selectedIndex = -1)
}
function rr(e) {
  var t = new MutationObserver(() => {
    Ut(e, e.__value)
  })
  ;(t.observe(e, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ['value'] }),
    qs(() => {
      t.disconnect()
    }))
}
function So(e, t, r = t) {
  var s = new WeakSet(),
    n = !0
  ;(Rn(e, 'change', l => {
    var i = l ? '[selected]' : ':checked',
      o
    if (e.multiple) o = [].map.call(e.querySelectorAll(i), ha)
    else {
      var v = e.querySelector(i) ?? e.querySelector('option:not([disabled])')
      o = v && ha(v)
    }
    ;(r(o), (e.__value = o), le !== null && s.add(le))
  }),
    el(() => {
      var l = t()
      if (e === document.activeElement) {
        var i = le
        if (s.has(i)) return
      }
      if ((Ut(e, l, n), n && l === void 0)) {
        var o = e.querySelector(':checked')
        o !== null && ((l = ha(o)), r(l))
      }
      ;((e.__value = l), (n = !1))
    }),
    rr(e))
}
function ha(e) {
  return '__value' in e ? e.__value : e.value
}
const Po = Symbol('is custom element'),
  Eo = Symbol('is html'),
  Mo = Xl ? 'progress' : 'PROGRESS'
function Ws(e, t) {
  var r = _l(e)
  r.value === (r.value = t ?? void 0) ||
    (e.value === t && (t !== 0 || e.nodeName !== Mo)) ||
    (e.value = t ?? '')
}
function he(e, t, r, s) {
  var n = _l(e)
  n[t] !== (n[t] = r) &&
    (t === 'loading' && (e[Jl] = r),
    r == null
      ? e.removeAttribute(t)
      : typeof r != 'string' && Ao(e).includes(t)
        ? (e[t] = r)
        : e.setAttribute(t, r))
}
function _l(e) {
  return e[Oa] ?? (e[Oa] = { [Po]: e.nodeName.includes('-'), [Eo]: e.namespaceURI === zn })
}
var cn = new Map()
function Ao(e) {
  var t = e.getAttribute('is') || e.nodeName,
    r = cn.get(t)
  if (r) return r
  cn.set(t, (r = []))
  for (var s, n = e, l = Element.prototype; l !== n;) {
    s = kn(n)
    for (var i in s)
      s[i].set && i !== 'innerHTML' && i !== 'textContent' && i !== 'innerText' && r.push(i)
    n = Ls(n)
  }
  return r
}
function Ta(e, t, r = t) {
  var s = new WeakSet()
  ;(Rn(e, 'input', async n => {
    var l = n ? e.defaultValue : e.value
    if (((l = is(e) ? os(l) : l), r(l), le !== null && s.add(le), await io(), l !== (l = t()))) {
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
    ra(t) == null && e.value && (r(is(e) ? os(e.value) : e.value), le !== null && s.add(le)),
    Us(() => {
      var n = t()
      if (e === document.activeElement) {
        var l = le
        if (s.has(l)) return
      }
      ;(is(e) && n === os(e.value)) ||
        (e.type === 'date' && !n && !e.value) ||
        (n !== e.value && (e.value = n ?? ''))
    }))
}
function is(e) {
  var t = e.type
  return t === 'number' || t === 'range'
}
function os(e) {
  return e === '' ? null : +e
}
function vs(e, t) {
  return e === t || (e == null ? void 0 : e[Vt]) === t
}
function gl(e = {}, t, r, s) {
  var n = Le.r,
    l = _e
  return (
    el(() => {
      var i, o
      return (
        Us(() => {
          ;((i = o),
            (o = []),
            ra(() => {
              vs(r(...o), e) || (t(e, ...o), i && vs(r(...i), e) && t(null, ...i))
            }))
        }),
        () => {
          let v = l
          for (; v !== n && v.parent !== null && v.parent.f & ps;) v = v.parent
          const d = () => {
              o && vs(r(...o), e) && t(null, ...o)
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
function ml(e = !1) {
  const t = Le,
    r = t.l.u
  if (!r) return
  let s = () => oo(t.s)
  if (e) {
    let n = 0,
      l = {}
    const i = Yr(() => {
      let o = !1
      const v = t.s
      for (const d in v) v[d] !== l[d] && ((l[d] = v[d]), (o = !0))
      return (o && n++, n)
    })
    s = () => a(i)
  }
  ;(r.b.length &&
    to(() => {
      ;(un(t, s), us(r.b))
    }),
    Lt(() => {
      const n = ra(() => r.m.map(Kl))
      return () => {
        for (const l of n) typeof l == 'function' && l()
      }
    }),
    r.a.length &&
      Lt(() => {
        ;(un(t, s), us(r.a))
      }))
}
function un(e, t) {
  if (e.l.s) for (const r of e.l.s) a(r)
  t()
}
function we(e, t, r, s) {
  var C
  var n = !ea || (r & hi) !== 0,
    l = (r & gi) !== 0,
    i = (r & mi) !== 0,
    o = s,
    v = !0,
    d = void 0,
    h = () => (i && n ? (d ?? (d = Yr(s)), a(d)) : (v && ((v = !1), (o = i ? ra(s) : s)), o))
  let _
  if (l) {
    var f = Vt in e || Yl in e
    _ = ((C = Fr(e, t)) == null ? void 0 : C.set) ?? (f && t in e ? R => (e[t] = R) : void 0)
  }
  var g,
    m = !1
  ;(l ? ([g, m] = Ci(() => e[t])) : (g = e[t]),
    g === void 0 && s !== void 0 && ((g = h()), _ && (n && ni(), _(g))))
  var y
  if (
    (n
      ? (y = () => {
          var R = e[t]
          return R === void 0 ? h() : ((v = !0), R)
        })
      : (y = () => {
          var R = e[t]
          return (R !== void 0 && (o = void 0), R === void 0 ? o : R)
        }),
    n && (r & _i) === 0)
  )
    return y
  if (_) {
    var w = e.$$legacy
    return function (R, G) {
      return arguments.length > 0 ? ((!n || !G || w || m) && _(G ? y() : R), R) : y()
    }
  }
  var O = !1,
    H = ((r & pi) !== 0 ? Yr : Rs)(() => ((O = !1), y()))
  l && a(H)
  var x = _e
  return function (R, G) {
    if (arguments.length > 0) {
      const z = G ? a(H) : n && l ? We(R) : R
      return (I(H, z), (O = !0), o !== void 0 && (o = z), R)
    }
    return (Xt && O) || (x.f & gt) !== 0 ? H.v : a(H)
  }
}
function Ks(e) {
  ;(Le === null && Zl(),
    ea && Le.l !== null
      ? zo(Le).m.push(e)
      : Lt(() => {
          const t = ra(e)
          if (typeof t == 'function') return t
        }))
}
function zo(e) {
  var t = e.l
  return t.u ?? (t.u = { a: [], b: [], m: [] })
}
const To = '5'
var bn
typeof window < 'u' &&
  ((bn = window.__svelte ?? (window.__svelte = {})).v ?? (bn.v = new Set())).add(To)
const Co = ['dashboard', 'providers', 'models', 'apps', 'server', 'tester', 'settings']
function yl() {
  const e = typeof window < 'u' ? window.location.hash.replace(/^#\/?/, '') : ''
  return Co.includes(e) ? e : 'dashboard'
}
const zt = We({ route: yl() })
function ur(e) {
  typeof window < 'u' && (window.location.hash = `/${e}`)
}
function $o() {
  const e = () => {
    zt.route = yl()
  }
  ;(window.addEventListener('hashchange', e), e())
}
const It = We({ toasts: [], commandOpen: !1, loadingRoutes: new Set() })
let Io = 0
function pe(e, t = 'info', r = 4e3) {
  const s = ++Io,
    n = { id: s, message: e, kind: t }
  ;((It.toasts = [...It.toasts, n]), (n.timeout = setTimeout(() => As(s), r)))
}
function As(e) {
  const t = It.toasts.find(r => r.id === e)
  ;(t != null && t.timeout && clearTimeout(t.timeout),
    (It.toasts = It.toasts.filter(r => r.id !== e)))
}
function ds() {
  It.commandOpen = !0
}
function Lo() {
  It.commandOpen = !1
}
function Oo() {
  It.commandOpen = !It.commandOpen
}
const Ro = {},
  No = typeof import.meta < 'u' && Ro && !1,
  wl = 'anygate-recent-folders'
function bl() {
  try {
    const e = localStorage.getItem(wl)
    return e ? JSON.parse(e) : []
  } catch {
    return []
  }
}
function Fo(e) {
  const t = bl().filter(s => s !== e)
  t.unshift(e)
  const r = t.slice(0, 10)
  try {
    localStorage.setItem(wl, JSON.stringify(r))
  } catch {}
  return r
}
function Do(e) {
  const { provider: t, modelId: r, contextWindow: s } = e,
    n = []
  return (
    n.push({ key: 'ANTHROPIC_BASE_URL', value: 'http://127.0.0.1:<proxy-port>' }),
    t &&
      r &&
      (n.push({ key: 'ANTHROPIC_MODEL', value: `${t.id}__${r}` }),
      n.push({ key: 'CLAUDE_CODE_MAX_CONTEXT_TOKENS', value: String(s ?? 2e5) })),
    n.push({ key: 'ANTHROPIC_AUTH_TOKEN', value: '<proxy-local-token>', masked: !0 }),
    n.push({ key: 'CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY', value: '1' }),
    { env: n, command: t && r ? `anygate ${t.id} --model ${r}` : 'anygate <provider>' }
  )
}
class fn extends Error {
  constructor(r, s, n) {
    super(r)
    st(this, 'hint')
    st(this, 'status')
    ;((this.name = 'ApiError'), (this.status = s), (this.hint = n))
  }
}
async function xl(e, t, r, s) {
  const n = { method: e, headers: {} }
  r !== void 0 && ((n.headers['Content-Type'] = 'application/json'), (n.body = JSON.stringify(r)))
  let l
  try {
    l = await fetch(t, n)
  } catch (v) {
    throw new fn(`Network error: ${String(v)}`, 0)
  }
  const i = await l.text(),
    o = i ? JSON.parse(i) : void 0
  if (!l.ok) {
    const v = o
    throw new fn(
      (v == null ? void 0 : v.error) ?? `Request failed (${l.status})`,
      l.status,
      v == null ? void 0 : v.hint
    )
  }
  return o
}
function Qt(e, t) {
  return xl('GET', e, void 0)
}
function ot(e, t, r) {
  return xl('POST', e, t)
}
function Vs() {
  return Qt('/api/config')
}
function kl(e) {
  return ot('/api/config', e)
}
function jo() {
  return Qt('/api/models')
}
function qo(e) {
  return ot('/api/models/test', e)
}
function Uo(e, t) {
  return ot('/api/keys', { providerId: e, key: t })
}
function Bo(e) {
  return ot('/api/providers/refresh', { providerId: e })
}
function Ho() {
  return ot('/api/providers/refresh-all')
}
function Go() {
  return Qt('/api/providers/templates')
}
function Wo(e, t, r) {
  return ot('/api/providers/add', { templateId: e, key: t, baseUrl: r })
}
function Ko(e) {
  return ot('/api/providers/add-custom', e)
}
function Vo(e) {
  return ot('/api/providers/delete', { providerId: e })
}
function Yo(e) {
  return ot('/api/providers/oauth/start', { providerId: e })
}
function Jo(e) {
  return Qt(`/api/providers/oauth/status?sessionId=${encodeURIComponent(e)}`)
}
function Xo() {
  return Qt('/api/apps')
}
function Zo(e, t) {
  return ot('/api/apps/path', { appId: e, path: t })
}
function Qo(e) {
  return ot('/api/apps/launch', e)
}
function ev() {
  return ot('/api/apps/browse-folder')
}
function tv() {
  return Qt('/api/server/status')
}
function rv() {
  return Qt('/api/server/providers')
}
function av(e) {
  return ot('/api/server/start', e)
}
function sv() {
  return ot('/api/server/stop')
}
async function nv() {
  return Qt('/api/health')
}
async function lv() {
  return (await Qt('/api/presets')).presets ?? []
}
async function iv(e) {
  return ot('/api/presets', { presets: e })
}
async function ov() {
  const e = await Vs()
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
async function vv(e) {
  const t = JSON.parse(e)
  if (!Array.isArray(t.favoriteModels) && !Array.isArray(t.antigravityCliFavoriteModels))
    throw new Error('Invalid config file: missing favoriteModels')
  await kl({
    favoriteModels: t.favoriteModels ?? [],
    antigravityCliFavoriteModels: t.antigravityCliFavoriteModels ?? [],
  })
}
function dv(e) {
  return Do(e)
}
const cv = new Set([
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
  uv = new Set(['openai', 'openai-oauth']),
  fv = new Set(['google', 'vertex'])
function pv(e, t) {
  const r = e.toLowerCase()
  if (r.startsWith('claude') || r.includes('anthropic')) return 'anthropic'
  if (t) {
    const s = t.toLowerCase()
    if (uv.has(s))
      return r.startsWith('gpt') || r.startsWith('o1') || r.startsWith('o3') || r.startsWith('o4')
        ? 'unsupported'
        : 'openai'
    if (cv.has(s)) return 'openai'
    if (fv.has(s)) return r.startsWith('gemini') ? 'unsupported' : 'openai'
  }
  return 'openai'
}
function hv(e) {
  return e.format ? e.format : pv(e.id, e.providerId)
}
function Sl(e) {
  if (typeof e.reasoning == 'boolean') return e.reasoning
  const t = e.id.toLowerCase()
  return /(opus|sonnet|o1|o3|o4|gpt-5|deepseek-r(1|2)|qwen3?-(plus|max|pro)|claude-(3-7|4))/.test(t)
}
function _v(e) {
  if (Array.isArray(e.supportedParameters)) return e.supportedParameters
  const t = ['tools', 'system']
  return (Sl(e) && t.push('reasoning_effort'), e.isFree || t.push('streaming'), t)
}
function gv(e) {
  return { ...e, format: hv(e), reasoning: Sl(e), supportedParameters: _v(e) }
}
function mv(e) {
  const t = new Set(),
    r = e.models.filter(s => (t.has(s.id) ? !1 : (t.add(s.id), !0)))
  return { ...e, enrichedModels: r.map(gv) }
}
const Ie = We({ list: [], loading: !1, error: null })
async function Ys(e) {
  ;((Ie.loading = !0), (Ie.error = null))
  try {
    const t = await jo()
    Ie.list = t.providers.map(mv)
  } catch (t) {
    Ie.error = t instanceof Error ? t.message : String(t)
  } finally {
    Ie.loading = !1
  }
}
async function Pl(e) {
  try {
    const t = await Bo(e)
    if (!t.ok) {
      pe(t.error ? String(t.error) : 'Refresh failed', 'error')
      return
    }
    ;(await Ys(), pe(`Refreshed ${e} (${t.count ?? 0} models)`, 'success'))
  } catch (t) {
    pe(t instanceof Error ? t.message : String(t), 'error')
  }
}
async function Ia() {
  try {
    const e = await Ho()
    ;(await Ys(), pe(`Refreshed all · ${e.total} models`, 'success'))
  } catch (e) {
    pe(e instanceof Error ? e.message : String(e), 'error')
  }
}
const yv = 20,
  wv = 6,
  xe = We({ general: [], agy: [], loading: !1, error: null })
async function El() {
  xe.loading = !0
  try {
    const e = await Vs()
    ;((xe.general = e.favoriteModels ?? []), (xe.agy = e.antigravityCliFavoriteModels ?? []))
  } catch (e) {
    xe.error = e instanceof Error ? e.message : String(e)
  } finally {
    xe.loading = !1
  }
}
async function Js() {
  await kl({ favoriteModels: xe.general, antigravityCliFavoriteModels: xe.agy })
}
function Ml(e, t, r = !1) {
  return (r ? xe.agy : xe.general).some(n => n.providerId === e && n.modelId === t)
}
async function Al(e, t = !1) {
  const r = t ? xe.agy : xe.general,
    s = t ? wv : yv
  return Ml(e.providerId, e.modelId, t)
    ? !0
    : r.length >= s
      ? (pe(`Favorite limit reached (${s})`, 'error'), !1)
      : (t ? (xe.agy = [...xe.agy, e]) : (xe.general = [...xe.general, e]), await Js(), !0)
}
async function zs(e, t, r = !1) {
  ;(r
    ? (xe.agy = xe.agy.filter(s => !(s.providerId === e && s.modelId === t)))
    : (xe.general = xe.general.filter(s => !(s.providerId === e && s.modelId === t))),
    await Js())
}
async function bv(e, t = !1) {
  ;(t ? (xe.agy = e) : (xe.general = e), await Js())
}
const xv = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        addFavorite: Al,
        favorites: xe,
        isFavorite: Ml,
        loadFavorites: El,
        removeFavorite: zs,
        reorder: bv,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  at = We({ list: [], recentFolders: [], loading: !1, error: null })
async function kv() {
  at.loading = !0
  try {
    const e = await Xo()
    ;((at.list = e.apps), (at.recentFolders = e.recentLaunchFolders ?? bl()))
  } catch (e) {
    at.error = e instanceof Error ? e.message : String(e)
  } finally {
    at.loading = !1
  }
}
async function Sv(e, t) {
  const r = await Zo(e, t)
  r.ok && ((at.list = r.apps), pe(t ? 'Path saved' : 'Path cleared', 'success'))
}
async function cs(e) {
  try {
    const t = await Qo(e)
    ;(e.cwd && (at.recentFolders = Fo(e.cwd)), pe(`Launched ${e.appId}`, 'success'))
  } catch (t) {
    pe(t instanceof Error ? t.message : String(t), 'error')
  }
}
async function pn() {
  const e = await ev()
  return e.ok && !e.canceled && e.path ? e.path : null
}
const ir = We({
  loaded: null,
  tier: 'zen',
  defaultFolder: null,
  anygateHome: null,
  logPaths: {},
  loading: !1,
})
async function Pv() {
  var e, t
  ir.loading = !0
  try {
    ;((ir.loaded = await Vs()),
      (ir.anygateHome =
        ((t = (e = globalThis.process) == null ? void 0 : e.env) == null
          ? void 0
          : t.ANYGATE_HOME) ?? null))
  } catch {
  } finally {
    ir.loading = !1
  }
}
function Ev(e) {
  ir.tier = e
}
const _t = We({ list: [], loading: !1, error: null })
async function zl() {
  ;((_t.loading = !0), (_t.error = null))
  try {
    _t.list = await lv()
  } catch (e) {
    _t.error = e instanceof Error ? e.message : String(e)
  } finally {
    _t.loading = !1
  }
}
async function Tl(e, t) {
  const r = _t.list
  _t.list = e
  try {
    return (await iv(e), t && pe(t, 'success'), !0)
  } catch (s) {
    return (
      (_t.list = r),
      pe(
        s instanceof Error ? `Couldn't save preset: ${s.message}` : "Couldn't save preset",
        'error'
      ),
      !1
    )
  }
}
async function Mv(e) {
  const t = e.id ?? `preset-${Date.now()}`,
    r = { ...e, id: t },
    s = _t.list.findIndex(l => l.id === t),
    n = [..._t.list]
  ;(s >= 0 ? (n[s] = r) : n.push(r), await Tl(n, 'Preset saved'))
}
async function Av(e) {
  await Tl(
    _t.list.filter(t => t.id !== e),
    'Preset deleted'
  )
}
const Ae = We({ report: null, available: !1, loading: !1, error: null })
async function Ts() {
  ;((Ae.loading = !0), (Ae.error = null))
  try {
    const e = await nv()
    ;((Ae.report = e), (Ae.available = !0))
  } catch (e) {
    ;((Ae.report = null),
      (Ae.available = !1),
      (Ae.error = e instanceof Error ? e.message : String(e)))
  } finally {
    Ae.loading = !1
  }
}
const Bt = We({ connected: !1, degraded: !1, lastEventAt: null }),
  Cs = new Set()
let _r = null,
  hn = 0
const zv = 3
function Cl(e) {
  return (Cs.add(e), () => Cs.delete(e))
}
function $l() {
  if (_r || No || typeof EventSource > 'u') {
    typeof EventSource > 'u' && (Bt.degraded = !0)
    return
  }
  const e = new EventSource('/api/events')
  ;((_r = e),
    (e.onopen = () => {
      ;((hn = 0), (Bt.connected = !0), (Bt.degraded = !1))
    }),
    (e.onmessage = t => {
      Bt.lastEventAt = Date.now()
      let r
      try {
        r = JSON.parse(t.data)
      } catch {
        return
      }
      for (const s of Cs)
        try {
          s(r)
        } catch {}
    }),
    (e.onerror = () => {
      ;((Bt.connected = !1), ++hn >= zv && ((Bt.degraded = !0), e.close(), (_r = null)))
    }))
}
function Tv() {
  ;(_r == null || _r.close(), (_r = null), (Bt.connected = !1))
}
const Qe = We({ status: null, loading: !1, starting: !1, error: null })
let _a = null,
  ga = null,
  Nr = null,
  Il = 5e3
async function ya() {
  Qe.status || (Qe.loading = !0)
  try {
    ;((Qe.status = await tv()), (Qe.error = null))
  } catch (e) {
    Qe.error = e instanceof Error ? e.message : String(e)
  } finally {
    Qe.loading = !1
  }
}
function Cv() {
  _a ||
    (_a = setInterval(() => {
      ya()
    }, Il))
}
function Ll() {
  _a && (clearInterval(_a), (_a = null))
}
function $v(e = 5e3) {
  ;((Il = e),
    ya(),
    $l(),
    Nr ||
      (Nr = Cl(t => {
        t.type === 'server' && ya()
      })),
    ga ||
      (ga = setInterval(() => {
        Bt.degraded ? Cv() : Ll()
      }, 1e3)))
}
function Iv() {
  ;(Ll(), ga && (clearInterval(ga), (ga = null)), Nr == null || Nr(), (Nr = null))
}
async function Lv(e) {
  Qe.starting = !0
  try {
    const t = await av(e)
    return t.ok && t.status
      ? ((Qe.status = t.status), pe('Server gateway started', 'success'), !0)
      : (pe(t.error ?? 'Failed to start server', 'error'), !1)
  } catch (t) {
    return (pe(t instanceof Error ? t.message : String(t), 'error'), !1)
  } finally {
    Qe.starting = !1
  }
}
async function Ov() {
  try {
    ;(await sv(), await ya(), pe('Server gateway stopped', 'info'))
  } catch (e) {
    pe(e instanceof Error ? e.message : String(e), 'error')
  }
}
var Rv = b(
    '<button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-6dohdz"><path></path></svg> <span> </span></button>'
  ),
  Nv = b(
    '<aside class="sidebar svelte-6dohdz"><div class="brand svelte-6dohdz"><div class="monogram svelte-6dohdz">a</div> <div class="brand-meta"><div class="brand-name svelte-6dohdz">anygate</div> <div class="brand-byline svelte-6dohdz">ramananbuilds</div></div></div> <div class="version-row svelte-6dohdz"><span class="version svelte-6dohdz"> </span> <span role="img"></span></div> <nav class="nav svelte-6dohdz" aria-label="Sections"></nav></aside>'
  )
function Fv(e, t) {
  ge(t, !0)
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
    s = '0.6.1',
    n = Y(() => {
      var g
      if (Ae.loading && !Ae.report) return { tone: 'unknown', label: 'Checking system health…' }
      if (Ae.error || !Ae.report) return { tone: 'unknown', label: 'System health unavailable' }
      const f = ((g = Ae.report.checks) == null ? void 0 : g.filter(m => !m.ok)) ?? []
      return Ae.report.ok
        ? f.length > 0
          ? { tone: 'warn', label: `${f.length} check${f.length === 1 ? '' : 's'} need attention` }
          : { tone: 'ok', label: 'All health checks passing' }
        : { tone: 'error', label: 'Critical check failing' }
    })
  var l = Nv(),
    i = c(u(l), 2),
    o = u(i),
    v = u(o),
    d = c(o, 2)
  let h
  var _ = c(i, 2)
  ;(Pe(
    _,
    21,
    () => r,
    f => f.id,
    (f, g) => {
      var m = Rv()
      let y
      var w = u(m),
        O = u(w),
        H = c(w, 2),
        x = u(H)
      ;(L(() => {
        ;((y = je(m, 1, 'nav-item svelte-6dohdz', null, y, { active: zt.route === a(g).id })),
          he(m, 'aria-current', zt.route === a(g).id ? 'page' : void 0),
          he(O, 'd', a(g).icon),
          M(x, a(g).label))
      }),
        ie('click', m, () => ur(a(g).id)),
        p(f, m))
    }
  ),
    L(() => {
      ;(M(v, `v${s}`),
        (h = je(d, 1, 'health-dot svelte-6dohdz', null, h, {
          ok: a(n).tone === 'ok',
          warn: a(n).tone === 'warn',
          error: a(n).tone === 'error',
        })),
        he(d, 'title', a(n).label),
        he(d, 'aria-label', a(n).label))
    }),
    p(e, l),
    me())
}
Ke(['click'])
function Dv() {
  return typeof localStorage > 'u'
    ? 'dark'
    : localStorage.getItem('anygate-theme') === 'light'
      ? 'light'
      : 'dark'
}
const or = We({ value: Dv() })
function Ol(e) {
  typeof document > 'u' || document.documentElement.setAttribute('data-theme', e)
}
typeof document < 'u' && Ol(or.value)
function Rl() {
  ;((or.value = or.value === 'dark' ? 'light' : 'dark'),
    typeof localStorage < 'u' && localStorage.setItem('anygate-theme', or.value),
    Ol(or.value))
}
var jv = b('<span><!></span>')
function Ue(e, t) {
  let r = we(t, 'tone', 3, 'neutral')
  var s = jv(),
    n = u(s)
  ;(Ir(n, () => t.children), L(() => je(s, 1, `badge ${r() ?? ''}`, 'svelte-7j44kq')), p(e, s))
}
var qv = b('<button><!></button>')
function Se(e, t) {
  let r = we(t, 'variant', 3, 'primary'),
    s = we(t, 'size', 3, 'md'),
    n = we(t, 'disabled', 3, !1),
    l = we(t, 'type', 3, 'button')
  var i = qv(),
    o = u(i)
  ;(Ir(o, () => t.children),
    L(() => {
      ;(he(i, 'type', l()),
        je(i, 1, `btn ${r() ?? ''} ${s() ?? ''}`, 'svelte-8a1c4v'),
        (i.disabled = n()))
    }),
    ie('click', i, function (...v) {
      var d
      ;(d = t.onclick) == null || d.apply(this, v)
    }),
    p(e, i))
}
Ke(['click'])
var Uv = b('<div><!></div>')
function De(e, t) {
  let r = we(t, 'padding', 3, '18px'),
    s = we(t, 'hover', 3, !1),
    n = we(t, 'class', 3, '')
  var l = Uv()
  let i
  var o = u(l)
  ;(Ir(o, () => t.children),
    L(() => {
      ;((i = je(l, 1, `card glass ${n() ?? ''}`, 'svelte-it2i29', i, { hover: s() })),
        et(l, `padding:${r() ?? ''}`),
        he(l, 'role', t.onclick ? 'button' : void 0))
    }),
    ie('click', l, function (...v) {
      var d
      ;(d = t.onclick) == null || d.apply(this, v)
    }),
    p(e, l))
}
Ke(['click'])
var Bv = b('<div class="drawer-head svelte-1cuwqu"> </div>'),
  Hv = b(
    '<div class="backdrop svelte-1cuwqu" role="presentation"><div role="dialog" aria-modal="true" tabindex="-1"><!> <div class="drawer-body svelte-1cuwqu"><!></div></div></div>'
  )
function Gv(e, t) {
  let r = we(t, 'title', 3, ''),
    s = we(t, 'side', 3, 'right')
  var n = it(),
    l = ee(n)
  {
    var i = o => {
      var v = Hv(),
        d = u(v),
        h = u(d)
      {
        var _ = m => {
          var y = Bv(),
            w = u(y)
          ;(L(() => M(w, r())), p(m, y))
        }
        U(h, m => {
          r() && m(_)
        })
      }
      var f = c(h, 2),
        g = u(f)
      ;(Ir(g, () => t.children),
        L(() => je(d, 1, `drawer glass ${s() ?? ''}`, 'svelte-1cuwqu')),
        ie('click', v, function (...m) {
          var y
          ;(y = t.onclose) == null || y.apply(this, m)
        }),
        ie('click', d, m => m.stopPropagation()),
        ie('keydown', d, m => m.stopPropagation()),
        p(o, v))
    }
    U(l, o => {
      t.open && o(i)
    })
  }
  p(e, n)
}
Ke(['click', 'keydown'])
var Wv = b('<div class="sub svelte-16dv2jh"><!></div>'),
  Kv = b(
    '<div class="empty svelte-16dv2jh"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path></path></svg> <div class="title svelte-16dv2jh"> </div> <!></div>'
  )
function $r(e, t) {
  let r = we(t, 'title', 3, 'Nothing here yet'),
    s = we(t, 'icon', 3, 'M4 4h16v16H4z')
  var n = Kv(),
    l = u(n),
    i = u(l),
    o = c(l, 2),
    v = u(o),
    d = c(o, 2)
  {
    var h = _ => {
      var f = Wv(),
        g = u(f)
      ;(Ir(g, () => t.children), p(_, f))
    }
    U(d, _ => {
      t.children && _(h)
    })
  }
  ;(L(() => {
    ;(he(i, 'd', s()), M(v, r()))
  }),
    p(e, n))
}
var Vv = b('<span> </span>'),
  Yv = b('<button class="icon-btn svelte-w50x32"><!> <!></button>')
function Nl(e, t) {
  let r = we(t, 'label', 3, ''),
    s = we(t, 'disabled', 3, !1),
    n = we(t, 'title', 3, '')
  var l = Yv(),
    i = u(l)
  {
    var o = d => {
      var h = Vv(),
        _ = u(h)
      ;(L(() => M(_, r())), p(d, h))
    }
    U(i, d => {
      r() && d(o)
    })
  }
  var v = c(i, 2)
  ;(Ir(v, () => t.children ?? Sn),
    L(() => {
      ;((l.disabled = s()), he(l, 'title', n()), he(l, 'aria-label', n() || r()))
    }),
    ie('click', l, function (...d) {
      var h
      ;(h = t.onclick) == null || h.apply(this, d)
    }),
    p(e, l))
}
Ke(['click'])
var Jv = b('<input class="input svelte-1xuvd1z"/>')
function ar(e, t) {
  ge(t, !0)
  let r = we(t, 'value', 15, ''),
    s = we(t, 'placeholder', 3, ''),
    n = we(t, 'type', 3, 'text'),
    l = we(t, 'id', 3, '')
  var i = Jv()
  ;(L(() => {
    ;(he(i, 'id', l()), he(i, 'type', n()), he(i, 'placeholder', s()), Ws(i, r()))
  }),
    ie('input', i, o => {
      var v
      ;(r(o.currentTarget.value), (v = t.oninput) == null || v.call(t, r()))
    }),
    ie('keydown', i, function (...o) {
      var v
      ;(v = t.onkeydown) == null || v.apply(this, o)
    }),
    p(e, i),
    me())
}
Ke(['input', 'keydown'])
var Xv = b('<div class="modal-head svelte-1qk8a2o"> </div>'),
  Zv = b(
    '<div class="backdrop svelte-1qk8a2o" role="presentation"><div class="modal glass svelte-1qk8a2o" role="dialog" aria-modal="true" tabindex="-1"><!> <div class="modal-body"><!></div> <button class="modal-x svelte-1qk8a2o" aria-label="Close">×</button></div></div>'
  )
function Er(e, t) {
  let r = we(t, 'title', 3, '')
  var s = it(),
    n = ee(s)
  {
    var l = i => {
      var o = Zv(),
        v = u(o),
        d = u(v)
      {
        var h = m => {
          var y = Xv(),
            w = u(y)
          ;(L(() => M(w, r())), p(m, y))
        }
        U(d, m => {
          r() && m(h)
        })
      }
      var _ = c(d, 2),
        f = u(_)
      Ir(f, () => t.children)
      var g = c(_, 2)
      ;(ie('click', o, function (...m) {
        var y
        ;(y = t.onclose) == null || y.apply(this, m)
      }),
        ie('click', v, m => m.stopPropagation()),
        ie('keydown', v, m => m.stopPropagation()),
        ie('click', g, function (...m) {
          var y
          ;(y = t.onclose) == null || y.apply(this, m)
        }),
        p(i, o))
    }
    U(n, i => {
      t.open && i(l)
    })
  }
  p(e, s)
}
Ke(['click', 'keydown'])
var Qv = b('<option> </option>'),
  ed = b('<select class="select svelte-13vr5hb"></select>')
function vr(e, t) {
  ge(t, !0)
  let r = we(t, 'value', 15, ''),
    s = we(t, 'id', 3, ''),
    n = we(t, 'disabled', 3, !1)
  function l(v) {
    var d
    ;(r(v.currentTarget.value), (d = t.onchange) == null || d.call(t, r()))
  }
  var i = ed()
  Pe(
    i,
    21,
    () => t.options,
    v => v.value,
    (v, d) => {
      var h = Qv(),
        _ = u(h),
        f = {}
      ;(L(() => {
        ;(M(_, a(d).label), f !== (f = a(d).value) && (h.value = (h.__value = a(d).value) ?? ''))
      }),
        p(v, h))
    }
  )
  var o
  ;(rr(i),
    L(() => {
      ;(he(i, 'id', s()),
        (i.disabled = n()),
        o !== (o = r()) && ((i.value = (i.__value = r()) ?? ''), Ut(i, r())))
    }),
    ie('change', i, l),
    p(e, i),
    me())
}
Ke(['change'])
var td = b('<span class="spinner inline svelte-18351lc"></span>'),
  rd = b('<span class="lbl"> </span>'),
  ad = b(
    '<div class="spinner-wrap svelte-18351lc" role="status"><span class="spinner svelte-18351lc"></span> <!></div>'
  )
function Zt(e, t) {
  let r = we(t, 'size', 3, 18),
    s = we(t, 'label', 3, ''),
    n = we(t, 'inline', 3, !1)
  var l = it(),
    i = ee(l)
  {
    var o = d => {
        var h = td()
        ;(L(() => et(h, `width:${r() ?? ''}px;height:${r() ?? ''}px`)), p(d, h))
      },
      v = d => {
        var h = ad(),
          _ = u(h),
          f = c(_, 2)
        {
          var g = m => {
            var y = rd(),
              w = u(y)
            ;(L(() => M(w, s())), p(m, y))
          }
          U(f, m => {
            s() && m(g)
          })
        }
        ;(L(() => {
          ;(he(h, 'aria-label', s() || 'Loading'),
            et(_, `width:${r() ?? ''}px;height:${r() ?? ''}px`))
        }),
          p(d, h))
      }
    U(i, d => {
      n() ? d(o) : d(v, -1)
    })
  }
  p(e, l)
}
var sd = b('<button role="tab"> </button>'),
  nd = b('<div class="tabs svelte-9oumej" role="tablist"></div>')
function Fl(e, t) {
  ge(t, !0)
  let r = we(t, 'active', 15, '')
  var s = nd()
  ;(Pe(
    s,
    21,
    () => t.tabs,
    n => n.id,
    (n, l) => {
      var i = sd()
      let o
      var v = u(i)
      ;(L(() => {
        ;((o = je(i, 1, 'tab svelte-9oumej', null, o, { active: r() === a(l).id })),
          he(i, 'aria-selected', r() === a(l).id),
          M(v, a(l).label))
      }),
        ie('click', i, () => {
          var d
          ;(r(a(l).id), (d = t.onchange) == null || d.call(t, a(l).id))
        }),
        p(n, i))
    }
  ),
    p(e, s),
    me())
}
Ke(['click'])
var ld = b('<span class="lbl svelte-km5m9b"> </span>'),
  id = b(
    '<label class="toggle-wrap svelte-km5m9b"><button type="button" role="switch"><span class="knob svelte-km5m9b"></span></button> <!></label>'
  )
function la(e, t) {
  ge(t, !0)
  let r = we(t, 'checked', 11, !1),
    s = we(t, 'label', 3, '')
  var n = id(),
    l = u(n)
  let i
  var o = c(l, 2)
  {
    var v = d => {
      var h = ld(),
        _ = u(h)
      ;(L(() => M(_, s())), p(d, h))
    }
    U(o, d => {
      s() && d(v)
    })
  }
  ;(L(() => {
    ;(he(l, 'aria-label', s() || 'toggle'),
      he(l, 'aria-checked', r()),
      (i = je(l, 1, 'toggle svelte-km5m9b', null, i, { on: r() })))
  }),
    ie('click', l, () => {
      var d
      return (d = t.onchange) == null ? void 0 : d.call(t, !r())
    }),
    p(e, n),
    me())
}
Ke(['click'])
var od = Gs(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>'
  ),
  vd = Gs(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>'
  ),
  dd = b(
    '<header class="topbar glass svelte-y7n507"><div class="title svelte-y7n507"><h1 class="svelte-y7n507"> </h1></div> <div class="actions svelte-y7n507"><button class="cmdk svelte-y7n507" title="Command palette (⌘K)"><span class="kbd svelte-y7n507">⌘K</span> Search</button> <!></div></header>'
  )
function cd(e, t) {
  ge(t, !0)
  const r = {
      dashboard: 'Dashboard',
      providers: 'Providers & Keys',
      models: 'Models',
      apps: 'Apps & Launch',
      server: 'Server Gateway',
      tester: 'Model Tester',
      settings: 'Settings',
    },
    s = Y(() => r[zt.route] ?? 'anygate')
  var n = dd(),
    l = u(n),
    i = u(l),
    o = u(i),
    v = c(l, 2),
    d = u(v),
    h = c(d, 2)
  {
    let _ = Y(() => (or.value === 'dark' ? 'Switch to light' : 'Switch to dark'))
    Nl(h, {
      get title() {
        return a(_)
      },
      get onclick() {
        return Rl
      },
      children: (f, g) => {
        var m = it(),
          y = ee(m)
        {
          var w = H => {
              var x = od()
              p(H, x)
            },
            O = H => {
              var x = vd()
              p(H, x)
            }
          U(y, H => {
            or.value === 'dark' ? H(w) : H(O, -1)
          })
        }
        p(f, m)
      },
      $$slots: { default: !0 },
    })
  }
  ;(L(() => M(o, a(s))),
    ie('click', d, function (..._) {
      ds == null || ds.apply(this, _)
    }),
    p(e, n),
    me())
}
Ke(['click'])
Ai()
var ud = b(
    '<div role="button" tabindex="0"><span class="dot svelte-1kymlcg"></span> <span class="msg"> </span></div>'
  ),
  fd = b('<div class="toaster svelte-1kymlcg" aria-live="polite"></div>')
function pd(e, t) {
  ge(t, !1)
  function r(n, l) {
    ;(n.key === 'Enter' || n.key === ' ') && (n.preventDefault(), As(l))
  }
  ml()
  var s = fd()
  ;(Pe(
    s,
    5,
    () => It.toasts,
    n => n.id,
    (n, l) => {
      var i = ud(),
        o = c(u(i), 2),
        v = u(o)
      ;(L(() => {
        ;(je(i, 1, `toast ${a(l).kind ?? ''}`, 'svelte-1kymlcg'), M(v, a(l).message))
      }),
        ie('click', i, () => As(a(l).id)),
        ie('keydown', i, d => r(d, a(l).id)),
        p(n, i))
    }
  ),
    p(e, s),
    me())
}
Ke(['click', 'keydown'])
var hd = b(
    '<button class="opt svelte-wh9uu8"><span class="lbl svelte-wh9uu8"> </span> <span class="hint svelte-wh9uu8"> </span></button>'
  ),
  _d = b('<div class="none svelte-wh9uu8">No matches</div>'),
  gd = b(
    '<div class="backdrop svelte-wh9uu8" role="presentation"><div class="palette glass svelte-wh9uu8" role="dialog" aria-modal="true" tabindex="-1"><input class="q svelte-wh9uu8" placeholder="Search providers, models, apps…"/> <div class="list svelte-wh9uu8"><!> <!></div></div></div>'
  )
function md(e, t) {
  ge(t, !0)
  let r = we(t, 'query', 15, ''),
    s
  Lt(() => {
    s == null || s.focus()
  })
  const n = [
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
    l = Y(() =>
      n.filter(
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
  var v = gd()
  qa('keydown', ks, o)
  var d = u(v),
    h = u(d)
  gl(
    h,
    y => (s = y),
    () => s
  )
  var _ = c(h, 2),
    f = u(_)
  Pe(
    f,
    17,
    () => a(l),
    y => y.id,
    (y, w) => {
      var O = hd(),
        H = u(O),
        x = u(H),
        C = c(H, 2),
        R = u(C)
      ;(L(() => {
        ;(M(x, a(w).label), M(R, a(w).hint))
      }),
        ie('click', O, () => i(a(w))),
        p(y, O))
    }
  )
  var g = c(f, 2)
  {
    var m = y => {
      var w = _d()
      p(y, w)
    }
    U(g, y => {
      a(l).length === 0 && y(m)
    })
  }
  ;(ie('click', v, function (...y) {
    var w
    ;(w = t.onclose) == null || w.apply(this, y)
  }),
    ie('click', d, y => y.stopPropagation()),
    ie('keydown', d, y => y.stopPropagation()),
    Ta(h, r),
    p(e, v),
    me())
}
Ke(['click', 'keydown'])
async function yd(e) {
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
const be = We({ report: null, range: 'all', loading: !1, error: null, hasData: !1 })
let La = 0
async function _n(e = be.range) {
  const t = ++La
  ;((be.range = e), (be.loading = !0), (be.error = null))
  try {
    const r = await yd(e)
    if (t !== La) return
    ;((be.report = r), (be.hasData = r.totalTokens > 0 || r.messages > 0))
  } catch (r) {
    if (t !== La) return
    ;((be.report = null),
      (be.hasData = !1),
      (be.error =
        r instanceof Error
          ? `Couldn't reach the analytics backend (${r.message}). Run \`anygate ui\` and reload.`
          : 'Couldn’t reach the analytics backend. Run `anygate ui` and reload.'))
  } finally {
    t === La && (be.loading = !1)
  }
}
var wd = b('<div class="note error svelte-lftxrq"> </div>'),
  bd = b('<span class="crit svelte-lftxrq">critical</span>'),
  xd = b(
    '<div class="check svelte-lftxrq"><span aria-hidden="true"> </span> <span class="k svelte-lftxrq"> <!></span> <span class="v svelte-lftxrq"> </span></div>'
  ),
  kd = b('<div class="checks svelte-lftxrq"></div>'),
  Sd = b('<div class="note svelte-lftxrq"> </div>'),
  Pd = b(
    '<div class="panel svelte-lftxrq"><div class="row svelte-lftxrq"><h3 class="svelte-lftxrq">System Health</h3> <!></div> <!> <!> <!> <div class="actions svelte-lftxrq"><!></div></div>'
  )
function Ed(e, t) {
  ;(ge(t, !0),
    Lt(() => {
      !Ae.report && !Ae.loading && !Ae.error && Ts()
    }))
  const r = Y(() => {
    var x, C
    return (
      ((C = (x = Ae.report) == null ? void 0 : x.checks) == null ? void 0 : C.filter(R => !R.ok)) ??
      []
    )
  })
  var s = Pd(),
    n = u(s),
    l = c(u(n), 2)
  {
    var i = x => {
        Zt(x, { inline: !0, size: 16 })
      },
      o = x => {
        Ue(x, {
          tone: 'error',
          children: (C, R) => {
            var G = Q('Unavailable')
            p(C, G)
          },
          $$slots: { default: !0 },
        })
      },
      v = x => {
        Ue(x, {
          tone: 'success',
          children: (C, R) => {
            var G = Q('All checks passed')
            p(C, G)
          },
          $$slots: { default: !0 },
        })
      },
      d = x => {
        Ue(x, {
          tone: 'warning',
          children: (C, R) => {
            var G = Q()
            ;(L(() => M(G, `${a(r).length ?? ''} warning${a(r).length === 1 ? '' : 's'}`)), p(C, G))
          },
          $$slots: { default: !0 },
        })
      },
      h = x => {
        Ue(x, {
          tone: 'error',
          children: (C, R) => {
            var G = Q('Critical')
            p(C, G)
          },
          $$slots: { default: !0 },
        })
      }
    U(l, x => {
      var C, R
      Ae.loading
        ? x(i)
        : Ae.error
          ? x(o, 1)
          : (C = Ae.report) != null && C.ok && a(r).length === 0
            ? x(v, 2)
            : (R = Ae.report) != null && R.ok
              ? x(d, 3)
              : Ae.report && x(h, 4)
    })
  }
  var _ = c(n, 2)
  {
    var f = x => {
      var C = wd(),
        R = u(C)
      ;(L(() =>
        M(
          R,
          `Couldn’t reach the health endpoint (${Ae.error ?? ''}). Diagnostics are unavailable — no values are shown rather than guessed.`
        )
      ),
        p(x, C))
    }
    U(_, x => {
      Ae.error && x(f)
    })
  }
  var g = c(_, 2)
  {
    var m = x => {
      var C = kd()
      ;(Pe(
        C,
        21,
        () => Ae.report.checks,
        R => R.id,
        (R, G) => {
          var z = xd(),
            B = u(z)
          let W
          var N = u(B),
            P = c(B, 2),
            $ = u(P),
            k = c($)
          {
            var T = A => {
              var j = bd()
              p(A, j)
            }
            U(k, A => {
              !a(G).ok && a(G).critical && A(T)
            })
          }
          var E = c(P, 2),
            D = u(E)
          ;(L(() => {
            ;((W = je(B, 1, 'mark svelte-lftxrq', null, W, { ok: a(G).ok, bad: !a(G).ok })),
              M(N, a(G).ok ? '✓' : '✗'),
              M($, `${a(G).label ?? ''} `),
              he(E, 'title', a(G).detail),
              M(D, a(G).detail))
          }),
            p(R, z))
        }
      ),
        p(x, C))
    }
    U(g, x => {
      var C, R
      ;(R = (C = Ae.report) == null ? void 0 : C.checks) != null && R.length && x(m)
    })
  }
  var y = c(g, 2)
  {
    var w = x => {
      var C = Sd(),
        R = u(C)
      ;(L(() => M(R, Ae.report.note)), p(x, C))
    }
    U(y, x => {
      var C
      ;(C = Ae.report) != null && C.note && x(w)
    })
  }
  var O = c(y, 2),
    H = u(O)
  ;(Se(H, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => Ts(),
    children: (x, C) => {
      var R = Q('Re-check')
      p(x, R)
    },
    $$slots: { default: !0 },
  }),
    p(e, s),
    me())
}
var Md = b('<button> </button>'),
  Ad = b('<div class="seg svelte-1yfbpb7" role="group" aria-label="Time range"></div>')
function zd(e, t) {
  ge(t, !0)
  let r = we(t, 'value', 15, 'all')
  const s = [
    { id: 'all', label: 'All' },
    { id: '30d', label: '30d' },
    { id: '7d', label: '7d' },
  ]
  var n = Ad()
  ;(Pe(
    n,
    21,
    () => s,
    l => l.id,
    (l, i) => {
      var o = Md()
      let v
      var d = u(o)
      ;(L(() => {
        ;((v = je(o, 1, 'opt svelte-1yfbpb7', null, v, { active: r() === a(i).id })),
          he(o, 'aria-pressed', r() === a(i).id),
          M(d, a(i).label))
      }),
        ie('click', o, () => {
          var h
          ;(r(a(i).id), (h = t.onchange) == null || h.call(t, a(i).id))
        }),
        p(l, o))
    }
  ),
    p(e, n),
    me())
}
Ke(['click'])
var Td = b('<span class="sub svelte-14oot77"> </span>'),
  Cd = b(
    '<div class="stat svelte-14oot77"><span class="lbl svelte-14oot77"> </span> <span class="num svelte-14oot77"> </span> <!></div>'
  )
function $d(e, t) {
  var r = Cd(),
    s = u(r),
    n = u(s),
    l = c(s, 2),
    i = u(l),
    o = c(l, 2)
  {
    var v = d => {
      var h = Td(),
        _ = u(h)
      ;(L(() => M(_, t.sub)), p(d, h))
    }
    U(o, d => {
      t.sub && d(v)
    })
  }
  ;(L(() => {
    ;(M(n, t.label), he(l, 'title', t.value), M(i, t.value))
  }),
    p(e, r))
}
var Id = b('<div class="grid svelte-9jn9wt"></div>')
function Ld(e, t) {
  ge(t, !0)
  function r(i) {
    return i >= 1e9
      ? `${(i / 1e9).toFixed(1)}B`
      : i >= 1e6
        ? `${(i / 1e6).toFixed(1)}M`
        : i >= 1e3
          ? `${(i / 1e3).toFixed(1)}k`
          : String(i)
  }
  function s(i) {
    const o = i < 12
    return `${i % 12 === 0 ? 12 : i % 12} ${o ? 'AM' : 'PM'}`
  }
  const n = Y(() => [
    { label: 'Sessions', value: r(t.report.sessions) },
    { label: 'Messages', value: r(t.report.messages) },
    { label: 'Total tokens', value: r(t.report.totalTokens) },
    { label: 'Active days', value: String(t.report.activeDays) },
    { label: 'Current streak', value: `${t.report.currentStreakDays}d` },
    { label: 'Longest streak', value: `${t.report.longestStreakDays}d` },
    { label: 'Peak hour', value: s(t.report.peakHour) },
    { label: 'Favorite model', value: t.report.favoriteModel },
  ])
  var l = Id()
  ;(Pe(
    l,
    21,
    () => a(n),
    i => i.label,
    (i, o) => {
      De(i, {
        padding: '18px',
        children: (v, d) => {
          $d(v, {
            get label() {
              return a(o).label
            },
            get value() {
              return a(o).value
            },
          })
        },
        $$slots: { default: !0 },
      })
    }
  ),
    p(e, l),
    me())
}
var Od = b('<span> </span>'),
  Rd = b('<div class="cell svelte-1ryzkww"></div>'),
  Nd = b('<div class="cell empty svelte-1ryzkww"></div>'),
  Fd = b('<div class="col svelte-1ryzkww"></div>'),
  Dd = b('<span class="key svelte-1ryzkww"></span>'),
  jd = b(
    '<div class="heat svelte-1ryzkww"><div class="months svelte-1ryzkww"></div> <div class="weeks svelte-1ryzkww"></div> <div class="legend svelte-1ryzkww"><span>Less</span> <!> <span>More</span></div></div>'
  )
function qd(e, t) {
  ge(t, !0)
  const r = Y(() => {
      if (t.days.length === 0) return []
      const f = new Date(t.days[0].date + 'T00:00:00').getDay(),
        g = [...Array(f).fill(null), ...t.days],
        m = []
      for (let y = 0; y < g.length; y += 7) m.push(g.slice(y, y + 7))
      return m
    }),
    s = Y(() => {
      const _ = []
      let f = -1
      return (
        t.days.forEach((g, m) => {
          const y = m + (a(r).length ? new Date(t.days[0].date + 'T00:00:00').getDay() : 0),
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
    n = _ =>
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
  var i = jd(),
    o = u(i)
  Pe(
    o,
    21,
    () => a(r),
    Pr,
    (_, f, g) => {
      const m = Y(() => a(s).find(H => H.col === g))
      var y = Od()
      let w
      var O = u(y)
      ;(L(() => {
        ;((w = je(y, 1, 'month svelte-1ryzkww', null, w, { has: !!a(m) })),
          M(O, a(m) ? a(m).label : ''))
      }),
        p(_, y))
    }
  )
  var v = c(o, 2)
  Pe(
    v,
    21,
    () => a(r),
    Pr,
    (_, f) => {
      var g = Fd()
      ;(Pe(
        g,
        21,
        () => a(f),
        Pr,
        (m, y) => {
          var w = it(),
            O = ee(w)
          {
            var H = C => {
                var R = Rd()
                ;(L(
                  (G, z) => {
                    ;(et(R, `background:${G ?? ''}`), he(R, 'title', z))
                  },
                  [() => l(a(y).intensity), () => `${a(y).date} · ${n(a(y).count)} tokens`]
                ),
                  p(C, R))
              },
              x = C => {
                var R = Nd()
                p(C, R)
              }
            U(O, C => {
              a(y) ? C(H) : C(x, -1)
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
  ;(Pe(
    h,
    16,
    () => [0, 1, 2, 3, 4],
    _ => _,
    (_, f) => {
      var g = Dd()
      ;(L(m => et(g, `background:${m ?? ''}`), [() => l(f)]), p(_, g))
    }
  ),
    p(e, i),
    me())
}
var Ud = b('<span> </span>'),
  Bd = b('<div class="gridline svelte-1ozbyr9"></div>'),
  Hd = b(
    '<div class="bar-col svelte-1ozbyr9"><div class="bar-area svelte-1ozbyr9"><div></div></div> <div class="xlabel svelte-1ozbyr9"><!></div></div>'
  ),
  Gd = b('<div class="scroll-hint svelte-1ozbyr9">→ scroll left for older days</div>'),
  Wd = b(
    '<div class="chart svelte-1ozbyr9"><div class="yaxis svelte-1ozbyr9" aria-hidden="true"></div> <div class="scroll svelte-1ozbyr9"><div class="bars svelte-1ozbyr9"><div class="gridlines svelte-1ozbyr9"></div> <!></div> <!></div></div>'
  )
function Kd(e, t) {
  ge(t, !0)
  const r = Y(() => Math.max(1, ...t.data.map(x => x.tokens)))
  function s(x) {
    if (x <= 0) return 1
    const C = Math.floor(Math.log10(x)),
      R = Math.pow(10, C),
      G = x / R
    let z
    return (G <= 1 ? (z = 1) : G <= 2 ? (z = 2) : G <= 5 ? (z = 5) : (z = 10), z * R)
  }
  const n = Y(() => s(a(r))),
    l = Y(() => Array.from({ length: 5 }, (x, C) => a(n) * (1 - C / 4)))
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
    const C = new Date(t.data[x - 1].date + 'T00:00:00').getMonth(),
      R = new Date(t.data[x].date + 'T00:00:00').getMonth()
    return C !== R
  }
  let d = ae(null)
  const h = Y(() => (a(d) ? a(d).scrollWidth - a(d).clientWidth > 8 : !1))
  Lt(() => {
    t.data
    const x = a(d)
    x && x.scrollWidth > x.clientWidth && (x.scrollLeft = x.scrollWidth)
  })
  var _ = Wd(),
    f = u(_)
  Pe(
    f,
    20,
    () => a(l),
    x => x,
    (x, C) => {
      var R = Ud(),
        G = u(R)
      ;(L(z => M(G, z), [() => i(C)]), p(x, R))
    }
  )
  var g = c(f, 2),
    m = u(g),
    y = u(m)
  Pe(
    y,
    20,
    () => a(l),
    x => x,
    (x, C) => {
      var R = Bd()
      p(x, R)
    }
  )
  var w = c(y, 2)
  Pe(
    w,
    19,
    () => t.data,
    x => x.date,
    (x, C, R) => {
      var G = Hd(),
        z = u(G),
        B = u(z)
      let W
      var N = c(z, 2),
        P = u(N)
      {
        var $ = T => {
            var E = Q()
            ;(L(D => M(E, D), [() => o(a(C).date)]), p(T, E))
          },
          k = Y(() => v(a(R)))
        U(P, T => {
          a(k) && T($)
        })
      }
      ;(L(
        T => {
          ;(he(G, 'title', T),
            (W = je(B, 1, 'bar svelte-1ozbyr9', null, W, { active: a(C).tokens > 0 })),
            et(B, `height:${(a(C).tokens / a(n)) * 100}%`))
        },
        [() => `${a(C).date} · ${i(a(C).tokens)} tokens`]
      ),
        p(x, G))
    }
  )
  var O = c(m, 2)
  {
    var H = x => {
      var C = Gd()
      p(x, C)
    }
    U(O, x => {
      a(h) && x(H)
    })
  }
  ;(gl(
    g,
    x => I(d, x),
    () => a(d)
  ),
    p(e, _),
    me())
}
var Vd = b('<span> </span>'),
  Yd = b('<span class="app-badge svelte-1ca0tub"> </span>'),
  Jd = b(
    '<div class="row svelte-1ca0tub"><span class="dot svelte-1ca0tub"></span> <div class="id svelte-1ca0tub"><div class="name svelte-1ca0tub"> </div> <div class="meta svelte-1ca0tub"><!></div></div> <div class="nums svelte-1ca0tub"><span class="in svelte-1ca0tub"> </span> <span class="out svelte-1ca0tub"> </span></div> <div class="share svelte-1ca0tub"><div class="track svelte-1ca0tub"><div class="fill svelte-1ca0tub"></div></div> <span class="pct svelte-1ca0tub"> </span></div></div>'
  ),
  Xd = b('<div class="list svelte-1ca0tub"></div>')
function Zd(e, t) {
  ge(t, !0)
  function r(i) {
    return i >= 1e9
      ? `${(i / 1e9).toFixed(1)}B`
      : i >= 1e6
        ? `${(i / 1e6).toFixed(1)}M`
        : i >= 1e3
          ? `${(i / 1e3).toFixed(0)}k`
          : String(i)
  }
  function s(i) {
    const o = i.map(f => f.share * 100),
      v = o.map(f => Math.floor(f))
    let d = 100 - v.reduce((f, g) => f + g, 0)
    const h = o.map((f, g) => ({ i: g, frac: f - Math.floor(f) })).sort((f, g) => g.frac - f.frac),
      _ = v.slice()
    for (let f = 0; f < h.length && d > 0; f++) ((_[h[f].i] += 1), d--)
    return _
  }
  const n = Y(() => s(t.models))
  var l = Xd()
  ;(Pe(
    l,
    23,
    () => t.models,
    i => i.provider + i.model,
    (i, o, v) => {
      var d = Jd(),
        h = u(d),
        _ = c(h, 2),
        f = u(_),
        g = u(f),
        m = c(f, 2),
        y = u(m)
      {
        var w = $ => {
            var k = it(),
              T = ee(k)
            ;(Pe(
              T,
              16,
              () => a(o).apps,
              E => E,
              (E, D) => {
                var A = Vd()
                let j
                var q = u(A)
                ;(L(
                  F => {
                    ;((j = je(A, 1, 'app-badge svelte-1ca0tub', null, j, F)), M(q, D))
                  },
                  [() => ({ agy: D.toLowerCase() === 'antigravity' })]
                ),
                  p(E, A))
              }
            ),
              p($, k))
          },
          O = $ => {
            var k = Yd(),
              T = u(k)
            ;(L(() => M(T, a(o).app)), p($, k))
          }
        U(y, $ => {
          var k
          ;(k = a(o).apps) != null && k.length ? $(w) : $(O, -1)
        })
      }
      var H = c(_, 2),
        x = u(H),
        C = u(x),
        R = c(x, 2),
        G = u(R),
        z = c(H, 2),
        B = u(z),
        W = u(B),
        N = c(B, 2),
        P = u(N)
      ;(L(
        ($, k) => {
          ;(et(h, `background:${a(o).color ?? ''}`),
            he(f, 'title', `${a(o).provider ?? ''}: ${a(o).model ?? ''}`),
            M(g, `${a(o).provider ?? ''}: ${a(o).model ?? ''}`),
            M(C, `↓ ${$ ?? ''}`),
            M(G, `↑ ${k ?? ''}`),
            et(W, `width:${a(n)[a(v)] ?? ''}%; background:${a(o).color ?? ''}`),
            M(P, `${a(n)[a(v)] ?? ''}%`))
        },
        [() => r(a(o).inputTokens), () => r(a(o).outputTokens)]
      ),
        p(i, d))
    }
  ),
    p(e, l),
    me())
}
var Qd = b('<p class="empty svelte-1ev3km3">No requests recorded in this range.</p>'),
  ec = b('<span class="tick svelte-1ev3km3"> </span>'),
  tc = b('<span class="tick svelte-1ev3km3"></span>'),
  rc = b(
    '<div><div class="track svelte-1ev3km3"><div class="bar svelte-1ev3km3"></div></div> <!></div>'
  ),
  ac = b(
    '<div class="bars svelte-1ev3km3" role="img" aria-label="Requests by hour of day (UTC)"></div> <p class="note svelte-1ev3km3">Busiest at <strong class="svelte-1ev3km3"> </strong> </p>',
    1
  ),
  sc = b('<div class="wrap svelte-1ev3km3"><!></div>')
function nc(e, t) {
  ge(t, !0)
  const r = Y(() => Math.max(1, ...t.hourly)),
    s = Y(() => t.hourly.reduce((d, h) => d + h, 0))
  function n(d) {
    return d === 0 ? '12a' : d === 12 ? '12p' : d < 12 ? `${d}a` : `${d - 12}p`
  }
  var l = sc(),
    i = u(l)
  {
    var o = d => {
        var h = Qd()
        p(d, h)
      },
      v = d => {
        var h = ac(),
          _ = ee(h)
        Pe(
          _,
          21,
          () => t.hourly,
          Pr,
          (w, O, H) => {
            var x = rc()
            let C
            var R = u(x),
              G = u(R)
            let z
            var B = c(R, 2)
            {
              var W = P => {
                  var $ = ec(),
                    k = u($)
                  ;(L(T => M(k, T), [() => n(H)]), p(P, $))
                },
                N = P => {
                  var $ = tc()
                  p(P, $)
                }
              U(B, P => {
                H % 3 === 0 ? P(W) : P(N, -1)
              })
            }
            ;(L(
              (P, $) => {
                ;((C = je(x, 1, 'col svelte-1ev3km3', null, C, {
                  peak: H === t.peakHour && a(O) > 0,
                })),
                  he(G, 'title', `${P ?? ''} · ${a(O) ?? ''} request${a(O) === 1 ? '' : 's'}`),
                  (z = et(G, '', z, $)))
              },
              [
                () => n(H),
                () => ({ height: `${a(O) === 0 ? 0 : Math.max(4, (a(O) / a(r)) * 100)}%` }),
              ]
            ),
              p(w, x))
          }
        )
        var f = c(_, 2),
          g = c(u(f)),
          m = u(g),
          y = c(g)
        ;(L(
          w => {
            ;(M(m, w), M(y, ` UTC · ${a(s) ?? ''} request${a(s) === 1 ? '' : 's'}`))
          },
          [() => n(t.peakHour)]
        ),
          p(d, h))
      }
    U(i, d => {
      a(s) === 0 ? d(o) : d(v, -1)
    })
  }
  ;(p(e, l), me())
}
var lc = b('<p class="empty svelte-1tsh0oh">No app usage recorded in this range.</p>'),
  ic = b(
    '<div class="row svelte-1tsh0oh"><span class="dot svelte-1tsh0oh"></span> <span class="name svelte-1tsh0oh"> </span> <div class="meter svelte-1tsh0oh" aria-hidden="true"><div class="fill svelte-1tsh0oh"></div></div> <span class="pct svelte-1tsh0oh"> </span> <span class="tok svelte-1tsh0oh"> </span></div>'
  ),
  oc = b(
    '<div class="split svelte-1tsh0oh"><div class="split-bar svelte-1tsh0oh" aria-hidden="true"><div class="in svelte-1tsh0oh"></div> <div class="out svelte-1tsh0oh"></div></div> <div class="legend svelte-1tsh0oh"><span class="svelte-1tsh0oh"><i class="sw in svelte-1tsh0oh"></i> </span> <span class="svelte-1tsh0oh"><i class="sw out svelte-1tsh0oh"></i> </span></div></div>'
  ),
  vc = b('<div class="rows svelte-1tsh0oh"></div> <!>', 1),
  dc = b('<div class="wrap svelte-1tsh0oh"><!></div>')
function cc(e, t) {
  ge(t, !0)
  const r = {
      gateway: 'Server gateway',
      claude: 'Claude Code',
      'claude-desktop': 'Claude Desktop',
      codex: 'Codex',
      'codex-app': 'Codex app',
      gemini: 'Gemini',
      antigravity: 'Antigravity',
      unknown: 'Unknown source',
    },
    s = Y(() => t.inputTokens + t.outputTokens)
  function n(d) {
    return d >= 1e9
      ? `${(d / 1e9).toFixed(1)}B`
      : d >= 1e6
        ? `${(d / 1e6).toFixed(1)}M`
        : d >= 1e3
          ? `${(d / 1e3).toFixed(1)}k`
          : String(d)
  }
  var l = dc(),
    i = u(l)
  {
    var o = d => {
        var h = lc()
        p(d, h)
      },
      v = d => {
        var h = vc(),
          _ = ee(h)
        Pe(
          _,
          21,
          () => t.apps,
          m => m.app,
          (m, y) => {
            var w = ic(),
              O = u(w)
            let H
            var x = c(O, 2),
              C = u(x),
              R = c(x, 2),
              G = u(R)
            let z
            var B = c(R, 2),
              W = u(B),
              N = c(B, 2),
              P = u(N)
            ;(L(
              ($, k, T) => {
                ;((H = et(O, '', H, { background: a(y).color })),
                  M(C, r[a(y).app] ?? a(y).app),
                  (z = et(G, '', z, $)),
                  M(W, `${k ?? ''}%`),
                  he(N, 'title', `${a(y).messages ?? ''} request${a(y).messages === 1 ? '' : 's'}`),
                  M(P, T))
              },
              [
                () => ({ width: `${Math.max(2, a(y).share * 100)}%`, background: a(y).color }),
                () => (a(y).share * 100).toFixed(a(y).share < 0.1 ? 1 : 0),
                () => n(a(y).inputTokens + a(y).outputTokens),
              ]
            ),
              p(m, w))
          }
        )
        var f = c(_, 2)
        {
          var g = m => {
            var y = oc(),
              w = u(y),
              O = u(w)
            let H
            var x = c(O, 2)
            let C
            var R = c(w, 2),
              G = u(R),
              z = c(u(G)),
              B = c(G, 2),
              W = c(u(B))
            ;(L(
              (N, P) => {
                ;((H = et(O, '', H, { width: `${(t.inputTokens / a(s)) * 100}%` })),
                  (C = et(x, '', C, { width: `${(t.outputTokens / a(s)) * 100}%` })),
                  M(z, `Prompt ${N ?? ''}`),
                  M(W, `Completion ${P ?? ''}`))
              },
              [() => n(t.inputTokens), () => n(t.outputTokens)]
            ),
              p(m, y))
          }
          U(f, m => {
            a(s) > 0 && m(g)
          })
        }
        p(d, h)
      }
    U(i, d => {
      t.apps.length === 0 ? d(o) : d(v, -1)
    })
  }
  ;(p(e, l), me())
}
var uc = b(
    '<span class="live svelte-1thed0a" title="Receiving live updates"><i class="svelte-1thed0a"></i>Live</span>'
  ),
  fc = b('<span class="offline svelte-1thed0a">Offline</span>'),
  pc = b(
    '<span class="empty svelte-1thed0a" title="No usage recorded yet — use anygate with a provider to populate real stats">No data yet</span>'
  ),
  hc = b('<div class="loading svelte-1thed0a"><!></div>'),
  _c = b(
    '<div class="notice svelte-1thed0a"><p class="notice-title svelte-1thed0a">Can’t load real analytics</p> <p class="notice-body svelte-1thed0a"> </p></div>'
  ),
  gc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Activity</h3><span class="hint svelte-1thed0a"> </span></div> <!>',
    1
  ),
  mc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">When you work</h3><span class="hint svelte-1thed0a">Requests by hour (UTC)</span></div> <!>',
    1
  ),
  yc = b('<div class="section svelte-1thed0a"><!></div> <!> <!>', 1),
  wc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Token volume</h3><span class="hint svelte-1thed0a">Total tokens per day</span></div> <!>',
    1
  ),
  bc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Model breakdown</h3><span class="hint svelte-1thed0a">Share of total usage</span></div> <!>',
    1
  ),
  xc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">By app</h3><span class="hint svelte-1thed0a">Which launcher spent the tokens</span></div> <!>',
    1
  ),
  kc = b('<!> <!> <!>', 1),
  Sc = b('<p class="muted svelte-1thed0a">No apps detected. Add a provider first.</p>'),
  Pc = b(
    '<p class="launch-note svelte-1thed0a">Open your agents with anygate models pre-wired, or send your whole favorites catalog into the app switcher.</p> <div class="quick svelte-1thed0a"></div>',
    1
  ),
  Ec = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Apps &amp; Launch</h3></div> <!>',
    1
  ),
  Mc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Providers</span></div>'
  ),
  Ac = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Models</span></div>'
  ),
  zc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Favorites</span></div>'
  ),
  Tc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Apps ready</span> <!></div>'
  ),
  Cc = b(
    '<div class="dash svelte-1thed0a"><div class="head svelte-1thed0a"><div class="title svelte-1thed0a"><div class="title-row svelte-1thed0a"><h2 class="svelte-1thed0a">Dashboard</h2> <!> <!> <!></div> <p class="svelte-1thed0a"> </p></div> <!></div> <!> <!> <div class="cols mt svelte-1thed0a"><!> <!></div> <div class="grid mt svelte-1thed0a"><!> <!> <!> <!></div></div>'
  )
function $c(e, t) {
  ;(ge(t, !0), we(t, 'showSampleBadge', 3, !0))
  let r = ae('overview')
  const s = Y(() => Ie.list.reduce((A, j) => A + j.enrichedModels.length, 0)),
    n = Y(() => Ie.list.length),
    l = Y(() => at.list.filter(A => A.installed))
  Lt(() => {
    _n(be.range)
  })
  const i = 1500
  Ks(() => {
    let A = null
    const j = Cl(q => {
      q.type === 'usage' &&
        (A && clearTimeout(A),
        (A = setTimeout(() => {
          _n(be.range)
        }, i)))
    })
    return () => {
      ;(A && clearTimeout(A), j())
    }
  })
  var o = Cc(),
    v = u(o),
    d = u(v),
    h = u(d),
    _ = c(u(h), 2)
  {
    var f = A => {
      var j = uc()
      p(A, j)
    }
    U(_, A => {
      Bt.connected && A(f)
    })
  }
  var g = c(_, 2)
  {
    var m = A => {
      var j = fc()
      ;(L(() => he(j, 'title', be.error)), p(A, j))
    }
    U(g, A => {
      be.error && A(m)
    })
  }
  var y = c(g, 2)
  {
    var w = A => {
      var j = pc()
      p(A, j)
    }
    U(y, A => {
      !be.error && !be.hasData && A(w)
    })
  }
  var O = c(h, 2),
    H = u(O),
    x = c(d, 2)
  zd(x, {
    get value() {
      return be.range
    },
    onchange: A => (be.range = A),
  })
  var C = c(v, 2)
  Fl(C, {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'models', label: 'Models' },
    ],
    get active() {
      return a(r)
    },
    set active(A) {
      I(r, A, !0)
    },
  })
  var R = c(C, 2)
  {
    var G = A => {
        var j = hc(),
          q = u(j)
        ;(Zt(q, { label: 'Loading analytics…' }), p(A, j))
      },
      z = A => {
        var j = _c(),
          q = c(u(j), 2),
          F = u(q)
        ;(L(() => M(F, be.error)), p(A, j))
      },
      B = A => {
        var j = it(),
          q = ee(j)
        {
          var F = V => {
              var J = yc(),
                X = ee(J),
                re = u(X)
              Ld(re, {
                get report() {
                  return be.report
                },
              })
              var oe = c(X, 2)
              De(oe, {
                padding: '20px',
                class: 'mt',
                children: (ve, ue) => {
                  var Z = gc(),
                    te = ee(Z),
                    se = c(u(te)),
                    ke = u(se),
                    Ce = c(te, 2)
                  ;(qd(Ce, {
                    get days() {
                      return be.report.heatmap
                    },
                  }),
                    L(() =>
                      M(
                        ke,
                        `Daily activity over ${(be.range === 'all' ? 'the last year' : be.range) ?? ''}`
                      )
                    ),
                    p(ve, Z))
                },
                $$slots: { default: !0 },
              })
              var ne = c(oe, 2)
              ;(De(ne, {
                padding: '20px',
                class: 'mt',
                children: (ve, ue) => {
                  var Z = mc(),
                    te = c(ee(Z), 2)
                  ;(nc(te, {
                    get hourly() {
                      return be.report.hourly
                    },
                    get peakHour() {
                      return be.report.peakHour
                    },
                  }),
                    p(ve, Z))
                },
                $$slots: { default: !0 },
              }),
                p(V, J))
            },
            K = V => {
              var J = kc(),
                X = ee(J)
              De(X, {
                padding: '20px',
                class: 'mt',
                children: (ne, ve) => {
                  var ue = wc(),
                    Z = c(ee(ue), 2)
                  ;(Kd(Z, {
                    get data() {
                      return be.report.dailyTokens
                    },
                  }),
                    p(ne, ue))
                },
                $$slots: { default: !0 },
              })
              var re = c(X, 2)
              De(re, {
                padding: '20px',
                class: 'mt',
                children: (ne, ve) => {
                  var ue = bc(),
                    Z = c(ee(ue), 2)
                  ;(Zd(Z, {
                    get models() {
                      return be.report.models
                    },
                  }),
                    p(ne, ue))
                },
                $$slots: { default: !0 },
              })
              var oe = c(re, 2)
              ;(De(oe, {
                padding: '20px',
                class: 'mt',
                children: (ne, ve) => {
                  var ue = xc(),
                    Z = c(ee(ue), 2)
                  ;(cc(Z, {
                    get apps() {
                      return be.report.apps
                    },
                    get inputTokens() {
                      return be.report.inputTokens
                    },
                    get outputTokens() {
                      return be.report.outputTokens
                    },
                  }),
                    p(ne, ue))
                },
                $$slots: { default: !0 },
              }),
                p(V, J))
            }
          U(q, V => {
            a(r) === 'overview' ? V(F) : V(K, -1)
          })
        }
        p(A, j)
      }
    U(R, A => {
      be.loading && !be.report ? A(G) : be.error ? A(z, 1) : be.report && A(B, 2)
    })
  }
  var W = c(R, 2),
    N = u(W)
  De(N, {
    padding: '20px',
    children: (A, j) => {
      var q = Ec(),
        F = c(ee(q), 2)
      {
        var K = X => {
            Zt(X, { label: 'Loading apps…' })
          },
          V = X => {
            var re = Sc()
            p(X, re)
          },
          J = X => {
            var re = Pc(),
              oe = c(ee(re), 2)
            ;(Pe(
              oe,
              21,
              () => a(l),
              ne => ne.id,
              (ne, ve) => {
                Se(ne, {
                  variant: 'subtle',
                  onclick: () => ur('apps'),
                  children: (ue, Z) => {
                    var te = Q()
                    ;(L(() => M(te, a(ve).name)), p(ue, te))
                  },
                  $$slots: { default: !0 },
                })
              }
            ),
              p(X, re))
          }
        U(F, X => {
          at.loading ? X(K) : a(l).length === 0 ? X(V, 1) : X(J, -1)
        })
      }
      p(A, q)
    },
    $$slots: { default: !0 },
  })
  var P = c(N, 2)
  Ed(P, {})
  var $ = c(W, 2),
    k = u($)
  De(k, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('providers'),
    children: (A, j) => {
      var q = Mc(),
        F = u(q),
        K = u(F)
      ;(L(() => M(K, a(n))), p(A, q))
    },
    $$slots: { default: !0 },
  })
  var T = c(k, 2)
  De(T, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('models'),
    children: (A, j) => {
      var q = Ac(),
        F = u(q),
        K = u(F)
      ;(L(() => M(K, a(s))), p(A, q))
    },
    $$slots: { default: !0 },
  })
  var E = c(T, 2)
  De(E, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('models'),
    children: (A, j) => {
      var q = zc(),
        F = u(q),
        K = u(F)
      ;(L(() => M(K, xe.general.length + xe.agy.length)), p(A, q))
    },
    $$slots: { default: !0 },
  })
  var D = c(E, 2)
  ;(De(D, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('apps'),
    children: (A, j) => {
      var q = Tc(),
        F = u(q),
        K = u(F),
        V = c(F, 3)
      {
        var J = X => {
          Ue(X, {
            tone: 'success',
            children: (re, oe) => {
              var ne = Q('server on')
              p(re, ne)
            },
            $$slots: { default: !0 },
          })
        }
        U(V, X => {
          var re
          ;(re = Qe.status) != null && re.running && X(J)
        })
      }
      ;(L(() => M(K, a(l).length)), p(A, q))
    },
    $$slots: { default: !0 },
  }),
    L(() =>
      M(
        H,
        `Usage analytics for your local gateway · ${(be.range === 'all' ? 'all time' : be.range) ?? ''}`
      )
    ),
    p(e, o),
    me())
}
const gn = {
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
  Ic = {
    anthropic:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3.2l6.5-3.75a1 1 0 0 1 1.5.87V11l3.5-2.02a1 1 0 0 1 1 1.73L21.5 13l3.5 2.02a1 1 0 0 1-1 1.73L20 14.98V22a1 1 0 0 1-1.5.87L12 19.12V23a1 1 0 0 1-2 0v-3.88L3.5 22.87A1 1 0 0 1 2 22v-7.02L-1.5 17a1 1 0 0 1-1-1.73L2.5 13l-3.5-2.02a1 1 0 0 1 1-1.73L4 9.98V2a1 1 0 0 1 1.5-.87L12 4.8V3a1 1 0 0 1 1-1z" transform="translate(1 1)"/></svg>',
    openai:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a4 4 0 0 0-.7-2.3l.1-.1a3.7 3.7 0 0 0-5.2-5.2l-.1.1A4 4 0 0 0 12 2l-.1.1A3.7 3.7 0 0 0 7.1 4.7l-.1-.1a3.7 3.7 0 0 0-5.2 5.2l.1.1A4 4 0 0 0 2 12l-.1.1A3.7 3.7 0 0 0 4.7 16.9l.1-.1A4 4 0 0 0 12 22l.1-.1A3.7 3.7 0 0 0 16.9 19.3l.1.1a3.7 3.7 0 0 0 5.2-5.2l-.1-.1A4 4 0 0 0 22 12zM12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/></svg>',
    google:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9l3 2.3c1.7-1.6 2.8-4 2.8-6.9 0-.7-.1-1.3-.2-1.9zM6.5 13.5a4.5 4.5 0 0 1 0-3l-3-2.3a8 8 0 0 0 0 7.6zM12 6.2c1.5 0 2.8.5 3.8 1.5l2.9-2.9A8 8 0 0 0 3.5 8.7l3 2.3A4.5 4.5 0 0 1 12 6.2z"/></svg>',
  }
function Lc(e) {
  const t = e.toLowerCase()
  return { svg: Ic[t], gradient: gn[t] ?? gn.default }
}
var Oc = b('<span class="svg svelte-1va9fof"></span>'),
  Rc = b('<span class="mono svelte-1va9fof"> </span>'),
  Nc = b('<span class="logo svelte-1va9fof"><!></span>')
function Xs(e, t) {
  ge(t, !0)
  let r = we(t, 'size', 3, 34)
  const s = Y(() => Lc(t.id)),
    n = Y(() => t.id.slice(0, 1).toUpperCase())
  var l = Nc(),
    i = u(l)
  {
    var o = d => {
        var h = Oc()
        ;(bo(h, () => a(s).svg, !0),
          L(() => et(h, `width:${r() * 0.55}px;height:${r() * 0.55}px`)),
          p(d, h))
      },
      v = d => {
        var h = Rc(),
          _ = u(h)
        ;(L(() => {
          ;(et(h, `font-size:${r() * 0.42}px`), M(_, a(n)))
        }),
          p(d, h))
      }
    U(i, d => {
      a(s).svg ? d(o) : d(v, -1)
    })
  }
  ;(L(() =>
    et(
      l,
      `width:${r() ?? ''}px;height:${r() ?? ''}px;background:linear-gradient(135deg,${a(s).gradient[0] ?? ''},${a(s).gradient[1] ?? ''});`
    )
  ),
    p(e, l),
    me())
}
var Fc = b('<span class="chip svelte-1p75598"> </span>'),
  Dc = b('<span class="chip more svelte-1p75598"> </span>'),
  jc = b('<span class="chip empty svelte-1p75598">no models yet</span>'),
  qc = b(
    '<a class="keylink svelte-1p75598" target="_blank" rel="noopener noreferrer">Get key →</a>'
  ),
  Uc = b('<!> <!>', 1),
  Bc = Gs(
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"></path></svg>'
  ),
  Hc = b(
    '<div class="card svelte-1p75598"><div class="head svelte-1p75598"><!> <div class="meta svelte-1p75598"><div class="name svelte-1p75598"> </div> <div class="sub svelte-1p75598"> <span class="id svelte-1p75598"> </span></div></div> <div class="status"><!></div></div> <div class="models svelte-1p75598"><!> <!> <!></div> <div class="actions svelte-1p75598"><!> <!></div></div>'
  )
function Gc(e, t) {
  ge(t, !0)
  var r = Hc(),
    s = u(r),
    n = u(s)
  Xs(n, {
    get id() {
      return t.provider.id
    },
  })
  var l = c(n, 2),
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
        Ue(k, {
          tone: 'success',
          children: (T, E) => {
            var D = Q()
            ;(L(() => M(D, t.provider.freeAccess ? 'Free access' : 'Key set')), p(T, D))
          },
          $$slots: { default: !0 },
        })
      },
      y = k => {
        Ue(k, {
          tone: 'accent',
          children: (T, E) => {
            var D = Q('OAuth')
            p(T, D)
          },
          $$slots: { default: !0 },
        })
      },
      w = k => {
        Ue(k, {
          tone: 'warning',
          children: (T, E) => {
            var D = Q('No key')
            p(T, D)
          },
          $$slots: { default: !0 },
        })
      }
    U(g, k => {
      t.provider.hasKey || t.provider.freeAccess
        ? k(m)
        : t.provider.authType === 'oauth'
          ? k(y, 1)
          : k(w, -1)
    })
  }
  var O = c(s, 2),
    H = u(O)
  Pe(
    H,
    17,
    () => t.provider.enrichedModels.slice(0, 5),
    k => k.id,
    (k, T) => {
      var E = Fc(),
        D = u(E)
      ;(L(() => {
        ;(he(E, 'title', a(T).id), M(D, a(T).name ?? a(T).id))
      }),
        p(k, E))
    }
  )
  var x = c(H, 2)
  {
    var C = k => {
      var T = Dc(),
        E = u(T)
      ;(L(() => M(E, `+${t.provider.enrichedModels.length - 5}`)), p(k, T))
    }
    U(x, k => {
      t.provider.enrichedModels.length > 5 && k(C)
    })
  }
  var R = c(x, 2)
  {
    var G = k => {
      var T = jc()
      p(k, T)
    }
    U(R, k => {
      t.provider.enrichedModels.length === 0 && k(G)
    })
  }
  var z = c(O, 2),
    B = u(z)
  {
    var W = k => {
        Se(k, {
          size: 'sm',
          variant: 'subtle',
          onclick: () => t.onOAuth(t.provider),
          children: (T, E) => {
            var D = Q('Sign in')
            p(T, D)
          },
          $$slots: { default: !0 },
        })
      },
      N = k => {
        var T = Uc(),
          E = ee(T)
        Se(E, {
          size: 'sm',
          variant: 'primary',
          onclick: () => t.onAddKey(t.provider),
          children: (j, q) => {
            var F = Q('Add key')
            p(j, F)
          },
          $$slots: { default: !0 },
        })
        var D = c(E, 2)
        {
          var A = j => {
            var q = qc()
            ;(L(() => he(q, 'href', t.provider.signupUrl)), p(j, q))
          }
          U(D, j => {
            t.provider.signupUrl && j(A)
          })
        }
        p(k, T)
      },
      P = k => {
        Se(k, {
          size: 'sm',
          variant: 'ghost',
          onclick: () => Pl(t.provider.id),
          children: (T, E) => {
            var D = Q('Refresh')
            p(T, D)
          },
          $$slots: { default: !0 },
        })
      }
    U(B, k => {
      t.provider.authType === 'oauth'
        ? k(W)
        : !t.provider.hasKey && !t.provider.freeAccess
          ? k(N, 1)
          : k(P, -1)
    })
  }
  var $ = c(B, 2)
  ;(Nl($, {
    title: 'Delete provider',
    onclick: () => t.onDelete(t.provider),
    children: (k, T) => {
      var E = Bc()
      p(k, E)
    },
    $$slots: { default: !0 },
  }),
    L(() => {
      ;(M(o, t.provider.name),
        M(d, `${t.provider.modelCount ?? ''} models · `),
        M(_, t.provider.id))
    }),
    p(e, r),
    me())
}
var Wc = b('<p style="color:var(--text-3)">Loading templates…</p>'),
  Kc = b('<option> </option>'),
  Vc = b('<span style="color:var(--text-3)">(optional)</span>'),
  Yc = b(
    '<a class="hint-link svelte-263z8" target="_blank" rel="noopener noreferrer">Get an API key →</a>'
  ),
  Jc = b('<span class="signup-note svelte-263z8"> </span>'),
  Xc = b('<span class="lbl svelte-263z8" style="margin-top:14px">API key<!></span> <!> <!> <!>', 1),
  Zc = b('<span class="lbl svelte-263z8" style="margin-top:14px"> </span> <!>', 1),
  Qc = b(
    '<span class="lbl svelte-263z8" style="margin-top:14px">Display name</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Base URL</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">API key <span style="color:var(--text-3)">(optional)</span></span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Custom headers <span style="color:var(--text-3)">(optional)</span></span> <textarea class="hdrs svelte-263z8" rows="3" placeholder="One per line, e.g. User-Agent: claude-cli/1.0.0 (external, cli) x-app: cli"></textarea> <span class="hint-txt svelte-263z8">Some endpoints only accept requests from a recognized client. Add headers like <code class="svelte-263z8">User-Agent</code> here if the provider requires them.</span>',
    1
  ),
  eu = b(
    '<span class="lbl svelte-263z8">Provider</span> <select class="sel svelte-263z8"><option>Select a provider…</option><!></select> <!> <!> <!> <div class="row svelte-263z8" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  )
function tu(e, t) {
  ge(t, !0)
  let r = ae(We([])),
    s = ae(!1),
    n = ae(null),
    l = ae(''),
    i = ae(''),
    o = ae(''),
    v = ae(''),
    d = ae(!1)
  function h(w) {
    const O = {}
    for (const H of w.split(`
`)) {
      const x = H.indexOf(':')
      if (x === -1) continue
      const C = H.slice(0, x).trim(),
        R = H.slice(x + 1).trim()
      C && R && (O[C] = R)
    }
    return O
  }
  async function _() {
    I(s, !0)
    try {
      I(r, (await Go()).templates, !0)
    } catch (w) {
      pe(String(w), 'error')
    }
    I(s, !1)
  }
  Lt(() => {
    t.open && (_(), I(n, null), I(l, ''), I(i, ''), I(o, ''), I(v, ''))
  })
  const f = Y(() => a(r).find(w => w.id === a(n))),
    g = Y(() => a(n) === '__custom_openai__'),
    m = Y(() => a(n) === '__custom_anthropic__')
  async function y() {
    if (a(n)) {
      I(d, !0)
      try {
        let w
        if (a(g) || a(m)) {
          const O = h(a(v))
          w = await Ko({
            kind: a(g) ? 'openai' : 'anthropic',
            displayName: a(o),
            baseUrl: a(i),
            apiKey: a(l),
            ...(Object.keys(O).length > 0 ? { headers: O } : {}),
          })
        } else w = await Wo(a(n), a(l) || void 0, a(i) || void 0)
        w.ok
          ? (pe(`Added ${w.name ?? a(n)}`, 'success'), t.onadded(), t.onclose())
          : pe(w.error ?? 'Failed to add provider', 'error')
      } catch (w) {
        pe(w instanceof Error ? w.message : String(w), 'error')
      }
      I(d, !1)
    }
  }
  ;(Er(e, {
    get open() {
      return t.open
    },
    title: 'Add provider',
    get onclose() {
      return t.onclose
    },
    children: (w, O) => {
      var H = it(),
        x = ee(H)
      {
        var C = G => {
            var z = Wc()
            p(G, z)
          },
          R = G => {
            var z = eu(),
              B = c(ee(z), 2),
              W = u(B)
            W.value = (W.__value = null) ?? ''
            var N = c(W)
            Pe(
              N,
              17,
              () => a(r),
              F => F.id,
              (F, K) => {
                var V = Kc(),
                  J = u(V),
                  X = {}
                ;(L(() => {
                  ;(M(
                    J,
                    `${a(K).name ?? ''}${a(K).anonymousFreeModels ? ' (free)' : ''}${a(K).subscriptionRisk ? ' ⚠' : ''}`
                  ),
                    X !== (X = a(K).id) && (V.value = (V.__value = a(K).id) ?? ''))
                }),
                  p(F, V))
              }
            )
            var P = c(B, 2)
            {
              var $ = F => {
                var K = Xc(),
                  V = ee(K),
                  J = c(u(V))
                {
                  var X = Z => {
                    var te = Vc()
                    p(Z, te)
                  }
                  U(J, Z => {
                    a(f).apiKeyOptional && Z(X)
                  })
                }
                var re = c(V, 2)
                {
                  let Z = Y(() =>
                    a(f).apiKeyOptional
                      ? 'Leave blank for a local server without auth'
                      : 'Paste your key'
                  )
                  ar(re, {
                    get placeholder() {
                      return a(Z)
                    },
                    get value() {
                      return a(l)
                    },
                    set value(te) {
                      I(l, te, !0)
                    },
                  })
                }
                var oe = c(re, 2)
                {
                  var ne = Z => {
                    var te = Yc()
                    ;(L(() => he(te, 'href', a(f).signupUrl)), p(Z, te))
                  }
                  U(oe, Z => {
                    a(f).signupUrl && Z(ne)
                  })
                }
                var ve = c(oe, 2)
                {
                  var ue = Z => {
                    var te = Jc(),
                      se = u(te)
                    ;(L(() => M(se, a(f).signupNote)), p(Z, te))
                  }
                  U(ve, Z => {
                    a(f).signupNote && Z(ue)
                  })
                }
                p(F, K)
              }
              U(P, F => {
                a(f) && a(f).authType === 'api' && !a(g) && !a(m) && F($)
              })
            }
            var k = c(P, 2)
            {
              var T = F => {
                var K = Zc(),
                  V = ee(K),
                  J = u(V),
                  X = c(V, 2)
                {
                  let re = Y(() => a(f).defaultBaseUrl ?? 'https://')
                  ar(X, {
                    get placeholder() {
                      return a(re)
                    },
                    get value() {
                      return a(i)
                    },
                    set value(oe) {
                      I(i, oe, !0)
                    },
                  })
                }
                ;(L(() => M(J, a(f).urlPrompt)), p(F, K))
              }
              U(k, F => {
                var K
                ;(K = a(f)) != null && K.urlPrompt && F(T)
              })
            }
            var E = c(k, 2)
            {
              var D = F => {
                var K = Qc(),
                  V = c(ee(K), 2)
                ar(V, {
                  placeholder: 'My endpoint',
                  get value() {
                    return a(o)
                  },
                  set value(oe) {
                    I(o, oe, !0)
                  },
                })
                var J = c(V, 4)
                ar(J, {
                  placeholder: 'https://',
                  get value() {
                    return a(i)
                  },
                  set value(oe) {
                    I(i, oe, !0)
                  },
                })
                var X = c(J, 4)
                ar(X, {
                  get value() {
                    return a(l)
                  },
                  set value(oe) {
                    I(l, oe, !0)
                  },
                })
                var re = c(X, 4)
                ;(Ta(
                  re,
                  () => a(v),
                  oe => I(v, oe)
                ),
                  p(F, K))
              }
              U(E, F => {
                ;(a(g) || a(m)) && F(D)
              })
            }
            var A = c(E, 2),
              j = u(A)
            Se(j, {
              variant: 'ghost',
              get onclick() {
                return t.onclose
              },
              children: (F, K) => {
                var V = Q('Cancel')
                p(F, V)
              },
              $$slots: { default: !0 },
            })
            var q = c(j, 2)
            {
              let F = Y(() => !a(n) || a(d))
              Se(q, {
                get disabled() {
                  return a(F)
                },
                onclick: y,
                children: (K, V) => {
                  var J = Q()
                  ;(L(() => M(J, a(d) ? 'Adding…' : 'Add provider')), p(K, J))
                },
                $$slots: { default: !0 },
              })
            }
            ;(So(
              B,
              () => a(n),
              F => I(n, F)
            ),
              p(G, z))
          }
        U(x, G => {
          a(s) ? G(C) : G(R, -1)
        })
      }
      p(w, H)
    },
    $$slots: { default: !0 },
  }),
    me())
}
var ru = b(
  '<p style="color:var(--text-2);font-size:13.5px;line-height:1.6">Remove <strong style="color:var(--text-1)"> </strong> </p> <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
  1
)
function au(e, t) {
  ge(t, !0)
  {
    let r = Y(() => !!t.provider)
    Er(e, {
      get open() {
        return a(r)
      },
      title: 'Delete provider',
      get onclose() {
        return t.onclose
      },
      children: (s, n) => {
        var l = ru(),
          i = ee(l),
          o = c(u(i)),
          v = u(o),
          d = c(o),
          h = c(i, 2),
          _ = u(h)
        Se(_, {
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
        ;(Se(f, {
          variant: 'danger',
          onclick: () => t.provider && t.onconfirm(t.provider),
          children: (g, m) => {
            var y = Q('Delete')
            p(g, y)
          },
          $$slots: { default: !0 },
        }),
          L(() => {
            var g, m
            ;(M(v, (g = t.provider) == null ? void 0 : g.name),
              M(
                d,
                ` and all ${((m = t.provider) == null ? void 0 : m.modelCount) ?? 0 ?? ''} of its models from anygate? This clears stored credentials.`
              ))
          }),
          p(s, l))
      },
      $$slots: { default: !0 },
    })
  }
  me()
}
var su = b('<div class="grid svelte-1sgc4qo"></div>'),
  nu = b('<p class="code svelte-1sgc4qo">Enter code: <strong> </strong></p>'),
  lu = b(
    '<div class="backdrop svelte-1sgc4qo" role="presentation"><div class="modal glass svelte-1sgc4qo" role="dialog" tabindex="-1"><h3 class="svelte-1sgc4qo"> </h3> <!> <!> <p class="note svelte-1sgc4qo">This window will close automatically once authentication completes.</p> <!></div></div>'
  ),
  iu = b(
    '<div class="page"><div class="head svelte-1sgc4qo"><div><h2 class="svelte-1sgc4qo">Providers & Keys</h2> <p class="sub svelte-1sgc4qo">Connect model providers via API key or OAuth. Refresh to pull the latest model list.</p></div> <div class="acts svelte-1sgc4qo"><!> <!></div></div> <!></div> <!> <!> <!>',
    1
  )
function ou(e, t) {
  ge(t, !0)
  let r = ae(!1),
    s = ae(null),
    n = ae(null),
    l = ae(''),
    i = ae(''),
    o = ae(null)
  async function v(N) {
    try {
      const P = await Vo(N.id)
      P.ok
        ? pe(`Deleted ${N.name}`, 'success')
        : pe(P.error ? String(P.error) : 'Delete failed', 'error')
    } catch (P) {
      pe(P instanceof Error ? P.message : String(P), 'error')
    }
    ;(I(s, null), await Ia())
  }
  async function d(N) {
    const P = prompt(`API key for ${N.name}:`)
    if (P)
      try {
        ;(await Uo(N.id, P)).ok
          ? (pe('Key saved', 'success'), await Pl(N.id))
          : pe('Save failed', 'error')
      } catch ($) {
        pe($ instanceof Error ? $.message : String($), 'error')
      }
  }
  async function h(N) {
    I(n, N, !0)
    try {
      const P = await Yo(N.id)
      ;(I(l, P.authUrl ?? P.url, !0),
        I(i, P.userCode ?? '', !0),
        P.sessionId &&
          I(
            o,
            setInterval(async () => {
              const $ = await Jo(P.sessionId)
              $.status !== 'pending' &&
                (a(o) && clearInterval(a(o)),
                $.status === 'done'
                  ? (pe(`${N.name} connected`, 'success'), I(n, null), await Ia())
                  : pe($.error ?? 'OAuth failed', 'error'))
            }, 2e3),
            !0
          ),
        P.pkce && a(l) && window.open(a(l), '_blank'))
    } catch (P) {
      pe(P instanceof Error ? P.message : String(P), 'error')
    }
  }
  var _ = iu(),
    f = ee(_),
    g = u(f),
    m = c(u(g), 2),
    y = u(m)
  Se(y, {
    variant: 'ghost',
    onclick: () => Ia(),
    children: (N, P) => {
      var $ = Q('Refresh all')
      p(N, $)
    },
    $$slots: { default: !0 },
  })
  var w = c(y, 2)
  Se(w, {
    onclick: () => I(r, !0),
    children: (N, P) => {
      var $ = Q('+ Add provider')
      p(N, $)
    },
    $$slots: { default: !0 },
  })
  var O = c(g, 2)
  {
    var H = N => {
        Zt(N, { label: 'Loading providers…' })
      },
      x = N => {
        $r(N, {
          title: 'Could not load providers',
          icon: 'M12 8v5M12 17h.01',
          children: (P, $) => {
            var k = Q()
            ;(L(() => M(k, Ie.error)), p(P, k))
          },
          $$slots: { default: !0 },
        })
      },
      C = N => {
        $r(N, {
          title: 'No providers yet',
          icon: 'M12 11h8M4 11h4M4 19h16',
          children: (P, $) => {
            var k = Q('Add a provider to start browsing models.')
            p(P, k)
          },
          $$slots: { default: !0 },
        })
      },
      R = N => {
        var P = su()
        ;(Pe(
          P,
          21,
          () => Ie.list,
          $ => $.id,
          ($, k) => {
            Gc($, {
              get provider() {
                return a(k)
              },
              onAddKey: d,
              onDelete: T => I(s, T, !0),
              onOAuth: h,
            })
          }
        ),
          p(N, P))
      }
    U(O, N => {
      Ie.loading ? N(H) : Ie.error ? N(x, 1) : Ie.list.length === 0 ? N(C, 2) : N(R, -1)
    })
  }
  var G = c(f, 2)
  tu(G, {
    get open() {
      return a(r)
    },
    onclose: () => I(r, !1),
    onadded: () => Ia(),
  })
  var z = c(G, 2)
  au(z, {
    get provider() {
      return a(s)
    },
    onclose: () => I(s, null),
    onconfirm: v,
  })
  var B = c(z, 2)
  {
    var W = N => {
      var P = lu(),
        $ = u(P),
        k = u($),
        T = u(k),
        E = c(k, 2)
      {
        var D = F => {
          var K = nu(),
            V = c(u(K)),
            J = u(V)
          ;(L(() => M(J, a(i))), p(F, K))
        }
        U(E, F => {
          a(i) && F(D)
        })
      }
      var A = c(E, 2)
      {
        var j = F => {
          Se(F, {
            onclick: () => window.open(a(l), '_blank'),
            children: (K, V) => {
              var J = Q('Open sign-in page')
              p(K, J)
            },
            $$slots: { default: !0 },
          })
        }
        U(A, F => {
          a(l) && F(j)
        })
      }
      var q = c(A, 4)
      ;(Se(q, {
        variant: 'ghost',
        onclick: () => I(n, null),
        children: (F, K) => {
          var V = Q('Close')
          p(F, V)
        },
        $$slots: { default: !0 },
      }),
        L(() => M(T, `Sign in to ${a(n).name ?? ''}`)),
        ie('click', P, () => I(n, null)),
        ie('keydown', P, F => {
          F.key === 'Escape' && I(n, null)
        }),
        ie('click', $, F => F.stopPropagation()),
        ie('keydown', $, F => F.stopPropagation()),
        p(N, P))
    }
    U(B, N => {
      a(n) && N(W)
    })
  }
  ;(p(e, _), me())
}
Ke(['click', 'keydown'])
const vu = 'modulepreload',
  du = function (e) {
    return '/' + e
  },
  mn = {},
  cu = function (t, r, s) {
    let n = Promise.resolve()
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
      n = i(
        r.map(d => {
          if (((d = du(d)), d in mn)) return
          mn[d] = !0
          const h = d.endsWith('.css'),
            _ = h ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${d}"]${_}`)) return
          const f = document.createElement('link')
          if (
            ((f.rel = h ? 'stylesheet' : vu),
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
    return n.then(i => {
      for (const o of i || []) o.status === 'rejected' && l(o.reason)
      return t().catch(l)
    })
  }
var uu = b('<span class="group svelte-xohxs0"><!> <!> <!> <!> <!></span>')
function Dl(e, t) {
  ge(t, !0)
  var r = uu(),
    s = u(r)
  {
    var n = g => {
      Ue(g, {
        tone: 'success',
        children: (m, y) => {
          var w = Q('Free')
          p(m, w)
        },
        $$slots: { default: !0 },
      })
    }
    U(s, g => {
      t.model.isFree && g(n)
    })
  }
  var l = c(s, 2)
  {
    var i = g => {
      Ue(g, {
        tone: 'warning',
        children: (m, y) => {
          var w = Q()
          ;(L(() => M(w, t.model.freeLabel)), p(m, w))
        },
        $$slots: { default: !0 },
      })
    }
    U(l, g => {
      t.model.freeLabel && !t.model.isFree && g(i)
    })
  }
  var o = c(l, 2)
  {
    let g = Y(() =>
      t.model.format === 'anthropic'
        ? 'accent'
        : t.model.format === 'unsupported'
          ? 'error'
          : 'neutral'
    )
    Ue(o, {
      get tone() {
        return a(g)
      },
      children: (m, y) => {
        var w = Q()
        ;(L(() => M(w, t.model.format)), p(m, w))
      },
      $$slots: { default: !0 },
    })
  }
  var v = c(o, 2)
  {
    var d = g => {
        Ue(g, {
          tone: 'accent',
          children: (m, y) => {
            var w = Q('vision')
            p(m, w)
          },
          $$slots: { default: !0 },
        })
      },
      h = Y(() => {
        var g
        return (g = t.model.inputTypes) == null ? void 0 : g.includes('image')
      })
    U(v, g => {
      a(h) && g(d)
    })
  }
  var _ = c(v, 2)
  {
    var f = g => {
      Ue(g, {
        tone: 'accent',
        children: (m, y) => {
          var w = Q('reasoning')
          p(m, w)
        },
        $$slots: { default: !0 },
      })
    }
    U(_, g => {
      t.model.reasoning && g(f)
    })
  }
  ;(p(e, r), me())
}
var fu = b('<button> </button>'),
  pu = b(
    '<div class="info svelte-19h4ccs"><div class="name svelte-19h4ccs"> <span class="pid svelte-19h4ccs"> </span></div> <div class="meta svelte-19h4ccs"> </div></div> <div class="tags svelte-19h4ccs"><!></div> <!>',
    1
  ),
  hu = b('<div class="row clickable svelte-19h4ccs" role="button" tabindex="0"><!></div>'),
  _u = b('<div class="row svelte-19h4ccs"><!></div>')
function gu(e, t) {
  ge(t, !0)
  const r = h => {
    var _ = pu(),
      f = ee(_),
      g = u(f),
      m = u(g),
      y = c(m),
      w = u(y),
      O = c(g, 2),
      H = u(O),
      x = c(f, 2),
      C = u(x)
    Dl(C, {
      get model() {
        return t.model
      },
    })
    var R = c(x, 2)
    {
      var G = z => {
        var B = fu()
        let W
        var N = u(B)
        ;(L(() => {
          ;((W = je(B, 1, 'star svelte-19h4ccs', null, W, { on: s() })),
            he(B, 'title', s() ? 'Remove favorite' : 'Add favorite'),
            he(B, 'aria-label', s() ? 'Remove favorite' : 'Add favorite'),
            M(N, s() ? '★' : '☆'))
        }),
          ie('click', B, P => {
            ;(P.stopPropagation(), t.onToggleFav())
          }),
          p(z, B))
      }
      U(R, z => {
        t.onToggleFav && z(G)
      })
    }
    ;(L(
      (z, B) => {
        ;(M(m, t.model.name ?? t.model.id),
          M(w, `· ${t.providerId ?? ''}`),
          M(H, `ctx ${z ?? ''} · ${B ?? ''}`))
      },
      [() => n(t.model.contextWindow), () => l(t.model.cost)]
    ),
      p(h, _))
  }
  let s = we(t, 'favorited', 3, !1)
  function n(h) {
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
  var i = it(),
    o = ee(i)
  {
    var v = h => {
        var _ = hu(),
          f = u(_)
        ;(r(f),
          ie('click', _, () => t.onOpen()),
          ie('keydown', _, g => {
            ;(g.key === 'Enter' || g.key === ' ') && (g.preventDefault(), t.onOpen())
          }),
          p(h, _))
      },
      d = h => {
        var _ = _u(),
          f = u(_)
        ;(r(f), p(h, _))
      }
    U(o, h => {
      t.onOpen ? h(v) : h(d, -1)
    })
  }
  ;(p(e, i), me())
}
Ke(['click', 'keydown'])
var mu = b('<option> </option>'),
  yu = b(
    '<div class="filters svelte-1y45iff"><input class="q svelte-1y45iff" placeholder="Search models…"/> <select class="s svelte-1y45iff"><option>All providers</option><!></select> <select class="s svelte-1y45iff"><option>Any format</option><option>anthropic</option><option>openai</option><option>unsupported</option></select> <select class="s svelte-1y45iff"><option>Free & paid</option><option>Free only</option><option>Paid only</option></select> <select class="s svelte-1y45iff"><option>Any reasoning</option><option>Reasoning</option><option>No reasoning</option></select> <select class="s svelte-1y45iff"><option>Any vision</option><option>Vision</option><option>No vision</option></select> <select class="s svelte-1y45iff"><option>Sort: context</option><option>Sort: cost</option><option>Sort: name</option></select></div>'
  )
function wu(e, t) {
  ge(t, !0)
  let r = we(t, 'value', 15)
  function s(F, K) {
    var V
    ;(r({ ...r(), [F]: K }), (V = t.onchange) == null || V.call(t, r()))
  }
  var n = yu(),
    l = u(n),
    i = c(l, 2),
    o = u(i)
  o.value = o.__value = ''
  var v = c(o)
  Pe(
    v,
    17,
    () => t.providers,
    Pr,
    (F, K) => {
      var V = mu(),
        J = u(V),
        X = {}
      ;(L(() => {
        ;(M(J, a(K).name), X !== (X = a(K).id) && (V.value = (V.__value = a(K).id) ?? ''))
      }),
        p(F, V))
    }
  )
  var d
  rr(i)
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
  rr(h)
  var w = c(h, 2),
    O = u(w)
  O.value = O.__value = ''
  var H = c(O)
  H.value = H.__value = 'free'
  var x = c(H)
  x.value = x.__value = 'paid'
  var C
  rr(w)
  var R = c(w, 2),
    G = u(R)
  G.value = G.__value = ''
  var z = c(G)
  z.value = z.__value = 'yes'
  var B = c(z)
  B.value = B.__value = 'no'
  var W
  rr(R)
  var N = c(R, 2),
    P = u(N)
  P.value = P.__value = ''
  var $ = c(P)
  $.value = $.__value = 'yes'
  var k = c($)
  k.value = k.__value = 'no'
  var T
  rr(N)
  var E = c(N, 2),
    D = u(E)
  D.value = D.__value = 'ctx'
  var A = c(D)
  A.value = A.__value = 'cost'
  var j = c(A)
  j.value = j.__value = 'name'
  var q
  ;(rr(E),
    L(() => {
      ;(Ws(l, r().query),
        d !== (d = r().provider) &&
          ((i.value = (i.__value = r().provider) ?? ''), Ut(i, r().provider)),
        y !== (y = r().format) && ((h.value = (h.__value = r().format) ?? ''), Ut(h, r().format)),
        C !== (C = r().free) && ((w.value = (w.__value = r().free) ?? ''), Ut(w, r().free)),
        W !== (W = r().reasoning) &&
          ((R.value = (R.__value = r().reasoning) ?? ''), Ut(R, r().reasoning)),
        T !== (T = r().vision) && ((N.value = (N.__value = r().vision) ?? ''), Ut(N, r().vision)),
        q !== (q = r().sort) && ((E.value = (E.__value = r().sort) ?? ''), Ut(E, r().sort)))
    }),
    ie('input', l, F => s('query', F.currentTarget.value)),
    ie('change', i, F => s('provider', F.currentTarget.value)),
    ie('change', h, F => s('format', F.currentTarget.value)),
    ie('change', w, F => s('free', F.currentTarget.value)),
    ie('change', R, F => s('reasoning', F.currentTarget.value)),
    ie('change', N, F => s('vision', F.currentTarget.value)),
    ie('change', E, F => s('sort', F.currentTarget.value)),
    p(e, n),
    me())
}
Ke(['input', 'change'])
var bu = b(
    '<div><div class="h svelte-1efx48s">Source backend</div><div class="v svelte-1efx48s"> </div></div>'
  ),
  xu = b(
    '<div class="stack svelte-1efx48s"><div><div class="h svelte-1efx48s">Name</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Model ID</div> <code class="v mono svelte-1efx48s"> </code></div> <div><div class="h svelte-1efx48s">Provider</div> <div class="v svelte-1efx48s"> <span class="sub svelte-1efx48s"> </span></div></div> <div class="grid svelte-1efx48s"><div><div class="h svelte-1efx48s">Context window</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Free</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Format</div><div class="v svelte-1efx48s"><!></div></div> <div><div class="h svelte-1efx48s">Reasoning</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Image input</div><div class="v svelte-1efx48s"> </div></div></div> <div><div class="h svelte-1efx48s">Cost</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Supported parameters</div> <div class="v chips svelte-1efx48s"></div></div> <!></div>'
  )
function ku(e, t) {
  ge(t, !0)
  function r(s) {
    if (!s || typeof s != 'object') return 'Not published'
    const n = s
    return (
      [
        n.input != null ? `$${n.input} / 1M input` : null,
        n.output != null ? `$${n.output} / 1M output` : null,
      ]
        .filter(Boolean)
        .join('  ·  ') || 'Not published'
    )
  }
  ;(Gv(e, {
    get open() {
      return t.open
    },
    title: 'Model details',
    get onclose() {
      return t.onclose
    },
    children: (s, n) => {
      var l = it(),
        i = ee(l)
      {
        var o = v => {
          var d = xu(),
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
            C = u(x),
            R = c(w, 2),
            G = u(R),
            z = c(u(G)),
            B = u(z),
            W = c(G, 2),
            N = c(u(W)),
            P = u(N),
            $ = c(W, 2),
            k = c(u($)),
            T = u(k)
          Dl(T, {
            get model() {
              return t.model
            },
          })
          var E = c($, 2),
            D = c(u(E)),
            A = u(D),
            j = c(E, 2),
            q = c(u(j)),
            F = u(q),
            K = c(R, 2),
            V = c(u(K), 2),
            J = u(V),
            X = c(K, 2),
            re = c(u(X), 2)
          Pe(
            re,
            21,
            () => t.model.supportedParameters ?? [],
            Pr,
            (ve, ue) => {
              Ue(ve, {
                tone: 'neutral',
                children: (Z, te) => {
                  var se = Q()
                  ;(L(() => M(se, a(ue))), p(Z, se))
                },
                $$slots: { default: !0 },
              })
            }
          )
          var oe = c(X, 2)
          {
            var ne = ve => {
              var ue = bu(),
                Z = c(u(ue)),
                te = u(Z)
              ;(L(() => M(te, t.model.sourceBackend)), p(ve, ue))
            }
            U(oe, ve => {
              t.model.sourceBackend && ve(ne)
            })
          }
          ;(L(
            (ve, ue, Z) => {
              ;(M(f, t.model.name ?? t.model.id),
                M(y, t.model.id),
                M(H, `${t.providerName ?? ''} `),
                M(C, `(${t.providerId ?? ''})`),
                M(B, ve),
                M(P, t.model.isFree ? 'Yes' : (t.model.freeLabel ?? 'No')),
                M(A, t.model.reasoning ? 'Supported' : 'No'),
                M(F, ue),
                M(J, Z))
            },
            [
              () =>
                t.model.contextWindow ? t.model.contextWindow.toLocaleString() + ' tokens' : '—',
              () => {
                var ve
                return (ve = t.model.inputTypes) != null && ve.includes('image')
                  ? 'Supported'
                  : 'No'
              },
              () => r(t.model.cost),
            ]
          ),
            p(v, d))
        }
        U(i, v => {
          t.model && v(o)
        })
      }
      p(s, l)
    },
    $$slots: { default: !0 },
  }),
    me())
}
var Su = b(
  '<div class="item svelte-drwign" role="listitem" draggable="true"><span class="handle svelte-drwign" title="Drag to reorder">⠿⠿⠿</span> <span class="idx svelte-drwign"> </span> <!> <div class="meta svelte-drwign"><div class="name svelte-drwign"> </div> <div class="sub svelte-drwign"> </div></div> <button class="x svelte-drwign" title="Remove">×</button></div>'
)
function Pu(e, t) {
  ge(t, !0)
  var r = Su(),
    s = c(u(r), 2),
    n = u(s),
    l = c(s, 2)
  Xs(l, {
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
  ;(L(() => {
    ;(M(n, t.index + 1), M(v, t.fav.model), M(h, t.fav.providerName))
  }),
    qa('dragstart', r, function (...f) {
      var g
      ;(g = t.ondragstart) == null || g.apply(this, f)
    }),
    qa('dragover', r, f => f.preventDefault()),
    qa('drop', r, function (...f) {
      var g
      ;(g = t.ondrop) == null || g.apply(this, f)
    }),
    ie('click', _, function (...f) {
      var g
      ;(g = t.onremove) == null || g.apply(this, f)
    }),
    p(e, r),
    me())
}
Ke(['click'])
var Eu = b('<div class="list svelte-156gwh2"><!> <div class="cap svelte-156gwh2"> </div></div>')
function Mu(e, t) {
  ge(t, !0)
  let r = ae(null)
  function s(_, f) {
    var g
    ;(I(r, _, !0), (g = f.dataTransfer) == null || g.setData('text/plain', String(_)))
  }
  function n(_) {
    if (a(r) === null || a(r) === _) return
    const f = [...t.items],
      [g] = f.splice(a(r), 1)
    ;(f.splice(_, 0, g), I(r, null), t.onreorder(f))
  }
  var l = Eu(),
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
        var f = it(),
          g = ee(f)
        ;(Pe(
          g,
          19,
          () => t.items,
          m => m.providerId + '/' + m.modelId,
          (m, y, w) => {
            Pu(m, {
              get fav() {
                return a(y)
              },
              get index() {
                return a(w)
              },
              onremove: () => t.onremove(a(y)),
              ondragstart: O => s(a(w), O),
              ondrop: () => n(a(w)),
            })
          }
        ),
          p(_, f))
      }
    U(i, _ => {
      t.items.length === 0 ? _(o) : _(v, -1)
    })
  }
  var d = c(i, 2),
    h = u(d)
  ;(L(() => M(h, `${t.items.length ?? ''} / ${t.max ?? ''} used`)), p(e, l), me())
}
var Au = b(
  '<div class="meter svelte-19jc277"><div class="top svelte-19jc277"><span> </span><span class="n svelte-19jc277"> </span></div> <div class="track svelte-19jc277"><div></div></div></div>'
)
function zu(e, t) {
  let r = we(t, 'label', 3, '')
  const s = Y(() => Math.min(100, Math.round((t.used / t.max) * 100))),
    n = Y(() => t.used >= t.max)
  var l = Au(),
    i = u(l),
    o = u(i),
    v = u(o),
    d = c(o),
    h = u(d),
    _ = c(i, 2),
    f = u(_)
  let g
  ;(L(() => {
    ;(M(v, r()),
      M(h, `${t.used ?? ''}/${t.max ?? ''}`),
      (g = je(f, 1, 'fill svelte-19jc277', null, g, { full: a(n) })),
      et(f, `width:${a(s) ?? ''}%`))
  }),
    p(e, l))
}
var Tu = b(
    '<div class="fav-head svelte-p8xmpw"><h3 class="svelte-p8xmpw">Favorites</h3> <!></div> <!> <div style="margin-top:14px"><!></div>',
    1
  ),
  Cu = b(
    '<div class="page"><div class="head svelte-p8xmpw"><h2 class="svelte-p8xmpw">Models</h2> <p class="sub svelte-p8xmpw">Browse every model anygate can route. Star any model to add it to your favorites.</p></div> <div class="layout svelte-p8xmpw"><div class="main-col"><!> <!></div> <aside class="fav-col"><!></aside></div></div> <!>',
    1
  )
function $u(e, t) {
  ge(t, !0)
  let r = ae(
      We({ provider: '', format: '', free: '', reasoning: '', vision: '', query: '', sort: 'ctx' })
    ),
    s = ae(null),
    n = ae('general')
  const l = Y(() =>
    Ie.list.flatMap(z =>
      z.enrichedModels.map(B => ({ model: B, providerId: z.id, providerName: z.name }))
    )
  )
  function i(z) {
    if (!z || typeof z != 'object') return 0
    const B = z
    return (B.input ?? 0) + (B.output ?? 0)
  }
  const o = Y(() =>
    a(l)
      .filter(z => {
        var B, W
        return (
          (!a(r).provider || z.providerId === a(r).provider) &&
          (!a(r).format || z.model.format === a(r).format) &&
          (!a(r).free || (a(r).free === 'free' ? z.model.isFree : !z.model.isFree)) &&
          (!a(r).reasoning ||
            (a(r).reasoning === 'yes' ? z.model.reasoning : !z.model.reasoning)) &&
          (!a(r).vision ||
            (a(r).vision === 'yes'
              ? (B = z.model.inputTypes) == null
                ? void 0
                : B.includes('image')
              : !((W = z.model.inputTypes) != null && W.includes('image')))) &&
          (!a(r).query ||
            (z.model.name ?? z.model.id).toLowerCase().includes(a(r).query.toLowerCase()) ||
            z.model.id.toLowerCase().includes(a(r).query.toLowerCase()))
        )
      })
      .sort((z, B) =>
        a(r).sort === 'name'
          ? (z.model.name ?? z.model.id).localeCompare(B.model.name ?? B.model.id)
          : a(r).sort === 'cost'
            ? i(z.model.cost) - i(B.model.cost)
            : (B.model.contextWindow ?? 0) - (z.model.contextWindow ?? 0)
      )
  )
  function v(z, B) {
    return (a(n) === 'agy' ? xe.agy : xe.general).some(N => N.providerId === z && N.modelId === B)
  }
  async function d(z) {
    const B = z.model
    if (v(z.providerId, B.id)) await zs(z.providerId, B.id, a(n) === 'agy')
    else {
      const W = {
        providerId: z.providerId,
        providerName: z.providerName,
        model: B.id,
        modelId: B.id,
        contextWindow: B.contextWindow,
        cost: B.cost,
      }
      await Al(W, a(n) === 'agy')
    }
  }
  async function h(z) {
    ;(a(n) === 'agy' ? (xe.agy = z) : (xe.general = z),
      await cu(() => Promise.resolve().then(() => xv), void 0).then(B =>
        B.reorder(z, a(n) === 'agy')
      ))
  }
  var _ = Cu(),
    f = ee(_),
    g = c(u(f), 2),
    m = u(g),
    y = u(m)
  {
    let z = Y(() => Ie.list.map(B => ({ id: B.id, name: B.name })))
    wu(y, {
      get providers() {
        return a(z)
      },
      get value() {
        return a(r)
      },
      set value(B) {
        I(r, B, !0)
      },
    })
  }
  var w = c(y, 2)
  {
    var O = z => {
        Zt(z, { label: 'Loading models…' })
      },
      H = z => {
        $r(z, {
          title: 'No models match',
          icon: 'M4 6h16M4 12h16M4 18h16',
          children: (B, W) => {
            var N = Q('Adjust filters or connect more providers.')
            p(B, N)
          },
          $$slots: { default: !0 },
        })
      },
      x = z => {
        De(z, {
          padding: '6px',
          children: (B, W) => {
            var N = it(),
              P = ee(N)
            ;(Pe(
              P,
              17,
              () => a(o),
              $ => $.providerId + '/' + $.model.id,
              ($, k) => {
                {
                  let T = Y(() => v(a(k).providerId, a(k).model.id))
                  gu($, {
                    get model() {
                      return a(k).model
                    },
                    get providerId() {
                      return a(k).providerId
                    },
                    get favorited() {
                      return a(T)
                    },
                    onToggleFav: () => d(a(k)),
                    onOpen: () => I(s, a(k), !0),
                  })
                }
              }
            ),
              p(B, N))
          },
          $$slots: { default: !0 },
        })
      }
    U(w, z => {
      Ie.loading ? z(O) : a(o).length === 0 ? z(H, 1) : z(x, -1)
    })
  }
  var C = c(m, 2),
    R = u(C)
  De(R, {
    padding: '18px',
    children: (z, B) => {
      var W = Tu(),
        N = ee(W),
        P = c(u(N), 2)
      {
        let E = Y(() => (a(n) === 'agy' ? xe.agy.length : xe.general.length)),
          D = Y(() => (a(n) === 'agy' ? 6 : 20)),
          A = Y(() => (a(n) === 'agy' ? 'AGY' : 'General'))
        zu(P, {
          get used() {
            return a(E)
          },
          get max() {
            return a(D)
          },
          get label() {
            return a(A)
          },
        })
      }
      var $ = c(N, 2)
      Fl($, {
        tabs: [
          { id: 'general', label: 'General (20)' },
          { id: 'agy', label: 'AGY (6)' },
        ],
        get active() {
          return a(n)
        },
        set active(E) {
          I(n, E, !0)
        },
      })
      var k = c($, 2),
        T = u(k)
      {
        let E = Y(() => (a(n) === 'agy' ? xe.agy : xe.general)),
          D = Y(() => (a(n) === 'agy' ? 6 : 20))
        Mu(T, {
          get items() {
            return a(E)
          },
          get max() {
            return a(D)
          },
          onreorder: h,
          onremove: A => zs(A.providerId, A.modelId, a(n) === 'agy'),
        })
      }
      p(z, W)
    },
    $$slots: { default: !0 },
  })
  var G = c(f, 2)
  {
    let z = Y(() => !!a(s)),
      B = Y(() => {
        var P
        return ((P = a(s)) == null ? void 0 : P.model) ?? null
      }),
      W = Y(() => {
        var P
        return ((P = a(s)) == null ? void 0 : P.providerId) ?? ''
      }),
      N = Y(() => {
        var P
        return ((P = a(s)) == null ? void 0 : P.providerName) ?? ''
      })
    ku(G, {
      get open() {
        return a(z)
      },
      get model() {
        return a(B)
      },
      get providerId() {
        return a(W)
      },
      get providerName() {
        return a(N)
      },
      onclose: () => I(s, null),
    })
  }
  ;(p(e, _), me())
}
var Iu = b('<div class="path svelte-1gp522a"> </div>'),
  Lu = b(
    '<div class="favs svelte-1gp522a"><span class="star svelte-1gp522a">★</span> <span> </span></div>'
  ),
  Ou = b('<a class="install-link svelte-1gp522a" target="_blank" rel="noopener noreferrer"> </a>'),
  Ru = b(
    '<code class="cmd svelte-1gp522a"> </code> <button class="copy svelte-1gp522a" type="button">Copy</button>',
    1
  ),
  Nu = b('<div class="install svelte-1gp522a"><!></div>'),
  Fu = b(
    '<div class="card svelte-1gp522a"><div class="head svelte-1gp522a"><div><!></div> <div class="meta svelte-1gp522a"><div class="name svelte-1gp522a"> </div> <div class="sub svelte-1gp522a"> </div></div> <!></div> <!> <!> <!> <div class="actions svelte-1gp522a"><!> <!></div></div>'
  )
function Du(e, t) {
  ge(t, !0)
  let r = we(t, 'favCount', 3, 0)
  var s = Fu(),
    n = u(s),
    l = u(n)
  let i
  var o = u(l)
  Xs(o, {
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
        Ue(W, {
          tone: 'success',
          children: (N, P) => {
            var $ = Q('Installed')
            p(N, $)
          },
          $$slots: { default: !0 },
        })
      },
      y = W => {
        Ue(W, {
          tone: 'warning',
          children: (N, P) => {
            var $ = Q('Not installed')
            p(N, $)
          },
          $$slots: { default: !0 },
        })
      }
    U(g, W => {
      t.app.installed ? W(m) : W(y, -1)
    })
  }
  var w = c(n, 2)
  {
    var O = W => {
      var N = Iu(),
        P = u(N)
      ;(L(() => {
        ;(he(N, 'title', t.app.path), M(P, t.app.path))
      }),
        p(W, N))
    }
    U(w, W => {
      t.app.path && W(O)
    })
  }
  var H = c(w, 2)
  {
    var x = W => {
      var N = Lu(),
        P = c(u(N), 2),
        $ = u(P)
      ;(L(() => M($, `${r() ?? ''} favorite${r() === 1 ? '' : 's'} ready`)), p(W, N))
    }
    U(H, W => {
      r() > 0 && W(x)
    })
  }
  var C = c(H, 2)
  {
    var R = W => {
      var N = Nu(),
        P = u(N)
      {
        var $ = T => {
            var E = Ou(),
              D = u(E)
            ;(L(() => {
              ;(he(E, 'href', t.app.installUrl), M(D, `Get ${t.app.name ?? ''} →`))
            }),
              p(T, E))
          },
          k = T => {
            var E = Ru(),
              D = ee(E),
              A = u(D),
              j = c(D, 2)
            ;(L(() => M(A, t.app.installHint)),
              ie('click', j, () => {
                var q
                return (q = navigator.clipboard) == null
                  ? void 0
                  : q.writeText(t.app.installHint ?? '')
              }),
              p(T, E))
          }
        U(P, T => {
          t.app.installUrl ? T($) : t.app.installHint && T(k, 1)
        })
      }
      p(W, N)
    }
    U(C, W => {
      t.app.installed || W(R)
    })
  }
  var G = c(C, 2),
    z = u(G)
  Se(z, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => t.onsetpath(t.app),
    children: (W, N) => {
      var P = Q('Path')
      p(W, P)
    },
    $$slots: { default: !0 },
  })
  var B = c(z, 2)
  {
    let W = Y(() => !t.app.installed)
    Se(B, {
      size: 'sm',
      variant: 'primary',
      get disabled() {
        return a(W)
      },
      onclick: () => t.onlaunch(t.app),
      children: (N, P) => {
        var $ = Q()
        ;(L(() => M($, r() > 0 ? 'Launch with favorites' : 'Launch')), p(N, $))
      },
      $$slots: { default: !0 },
    })
  }
  ;(L(() => {
    ;((i = je(l, 1, 'logo svelte-1gp522a', null, i, { dim: !t.app.installed })),
      M(h, t.app.name),
      M(f, t.app.type === 'cli' ? 'CLI' : 'Desktop app'))
  }),
    p(e, s),
    me())
}
Ke(['click'])
var ju = b('<div class="grid svelte-ishglm"></div>'),
  qu = b(
    '<div class="opts svelte-ishglm"><span class="lbl svelte-ishglm">Provider</span> <!> <span class="lbl svelte-ishglm">Model</span> <!></div>'
  ),
  Uu = b(
    '<div class="hintbox svelte-ishglm"><!> <span>Opens the app with every favorite routed through one anygate gateway — switch live from the in-app model menu.</span></div>'
  ),
  Bu = b('<button class="recent svelte-ishglm"> </button>'),
  Hu = b('<div class="recents svelte-ishglm"></div>'),
  Gu = b(
    '<div class="modes svelte-ishglm"><button><span class="mode-ico svelte-ishglm">★</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">All favorites</span> <span class="mode-desc svelte-ishglm"> </span></span></button> <button><span class="mode-ico svelte-ishglm">◉</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">One model</span> <span class="mode-desc svelte-ishglm">Launch with a single pre-selected model</span></span></button> <button><span class="mode-ico svelte-ishglm">⤢</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">Just open</span> <span class="mode-desc svelte-ishglm">Launch the app with no model pre-set</span></span></button></div> <!> <div class="opts svelte-ishglm" style="margin-top:16px"><span class="lbl svelte-ishglm">Launch folder</span> <div class="folder svelte-ishglm"><!> <!></div> <!></div> <div class="row svelte-ishglm" style="margin-top:22px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Wu = b(
    '<span class="lbl svelte-ishglm">Executable path</span> <div class="folder svelte-ishglm"><!> <!></div> <div class="row svelte-ishglm" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Ku = b(
    `<div class="page"><div class="head svelte-ishglm"><div><h2 class="svelte-ishglm">Apps & Launch</h2> <p class="sub svelte-ishglm">Open Claude, Codex, Gemini, or Antigravity with your anygate models pre-wired. Pick a launch folder per app, or send your whole favorites catalog into the app's model switcher.</p></div></div> <!></div> <!> <!>`,
    1
  )
function Vu(e, t) {
  ge(t, !0)
  let r = ae(null),
    s = ae('favorites'),
    n = ae(''),
    l = ae(''),
    i = ae(''),
    o = ae(null),
    v = ae('')
  const d = Y(() => at.list.find($ => $.id === a(r))),
    h = Y(() =>
      a(d) && (a(d).id === 'antigravity' || a(d).id === 'agy' || a(d).id === 'antigravity-ide')
        ? xe.agy.length
        : xe.general.length
    ),
    _ = Y(() => {
      var $
      return a(n)
        ? ((($ = Ie.list.find(k => k.id === a(n))) == null ? void 0 : $.enrichedModels) ?? []).map(
            k => ({ value: k.id, label: k.name ?? k.id })
          )
        : []
    })
  async function f($) {
    ;(I(r, $.id, !0), I(s, a(h) > 0 ? 'favorites' : 'specific', !0), I(n, ''), I(l, ''), I(i, ''))
    const k = at.recentFolders
    I(i, k[0] ?? '', !0)
  }
  async function g() {
    a(r) &&
      (a(s) === 'favorites'
        ? await cs({ appId: a(r), favoritesCatalog: !0, cwd: a(i) || void 0 })
        : a(s) === 'specific'
          ? await cs({
              appId: a(r),
              providerId: a(n) || void 0,
              modelId: a(l) || void 0,
              cwd: a(i) || void 0,
            })
          : await cs({ appId: a(r), cwd: a(i) || void 0 }),
      I(r, null))
  }
  async function m($) {
    ;(I(o, $, !0), I(v, $.path ?? '', !0))
  }
  async function y() {
    a(o) && (await Sv(a(o).id, a(v).trim() || null), I(o, null))
  }
  async function w() {
    const $ = await pn()
    $ && I(i, $, !0)
  }
  async function O() {
    const $ = await pn()
    $ && I(v, $, !0)
  }
  var H = Ku(),
    x = ee(H),
    C = c(u(x), 2)
  {
    var R = $ => {
        Zt($, { label: 'Detecting installed apps…' })
      },
      G = $ => {
        $r($, {
          title: 'No apps found',
          icon: 'M2 3h20v14H2z',
          children: (k, T) => {
            var E = Q("anygate couldn't detect supported apps on this system.")
            p(k, E)
          },
          $$slots: { default: !0 },
        })
      },
      z = $ => {
        var k = ju()
        ;(Pe(
          k,
          21,
          () => at.list,
          T => T.id,
          (T, E) => {
            {
              let D = Y(() =>
                a(E).id === 'antigravity' || a(E).id === 'agy' || a(E).id === 'antigravity-ide'
                  ? xe.agy.length
                  : xe.general.length
              )
              Du(T, {
                get app() {
                  return a(E)
                },
                get favCount() {
                  return a(D)
                },
                onlaunch: f,
                onsetpath: m,
              })
            }
          }
        ),
          p($, k))
      }
    U(C, $ => {
      at.loading ? $(R) : at.list.length === 0 ? $(G, 1) : $(z, -1)
    })
  }
  var B = c(x, 2)
  {
    var W = $ => {
      {
        let k = Y(() => !!a(d)),
          T = Y(() => `Launch ${a(d).name}`)
        Er($, {
          get open() {
            return a(k)
          },
          get title() {
            return a(T)
          },
          onclose: () => I(r, null),
          children: (E, D) => {
            var A = Gu(),
              j = ee(A),
              q = u(j)
            let F
            var K = c(u(q), 2),
              V = c(u(K), 2),
              J = u(V),
              X = c(q, 2)
            let re
            var oe = c(X, 2)
            let ne
            var ve = c(j, 2)
            {
              var ue = de => {
                  var Te = qu(),
                    Ne = c(u(Te), 2)
                  {
                    let qe = Y(() => [
                      { value: '', label: 'All' },
                      ...Ie.list.map($e => ({ value: $e.id, label: $e.name })),
                    ])
                    vr(Ne, {
                      get options() {
                        return a(qe)
                      },
                      get value() {
                        return a(n)
                      },
                      set value($e) {
                        I(n, $e, !0)
                      },
                    })
                  }
                  var Fe = c(Ne, 4)
                  {
                    let qe = Y(() => !a(n)),
                      $e = Y(() =>
                        a(n)
                          ? [{ value: '', label: 'All' }, ...a(_)]
                          : [{ value: '', label: '— pick a provider first —' }]
                      )
                    vr(Fe, {
                      get disabled() {
                        return a(qe)
                      },
                      get options() {
                        return a($e)
                      },
                      get value() {
                        return a(l)
                      },
                      set value(er) {
                        I(l, er, !0)
                      },
                    })
                  }
                  p(de, Te)
                },
                Z = de => {
                  var Te = Uu(),
                    Ne = u(Te)
                  ;(Ue(Ne, {
                    tone: 'success',
                    children: (Fe, qe) => {
                      var $e = Q()
                      ;(L(() => M($e, `${a(h) ?? ''} favorites`)), p(Fe, $e))
                    },
                    $$slots: { default: !0 },
                  }),
                    p(de, Te))
                }
              U(ve, de => {
                a(s) === 'specific' ? de(ue) : a(s) === 'favorites' && de(Z, 1)
              })
            }
            var te = c(ve, 2),
              se = c(u(te), 2),
              ke = u(se)
            ar(ke, {
              placeholder: 'Path or browse…',
              get value() {
                return a(i)
              },
              set value(de) {
                I(i, de, !0)
              },
            })
            var Ce = c(ke, 2)
            Se(Ce, {
              size: 'sm',
              variant: 'ghost',
              onclick: w,
              children: (de, Te) => {
                var Ne = Q('Browse')
                p(de, Ne)
              },
              $$slots: { default: !0 },
            })
            var He = c(se, 2)
            {
              var Xe = de => {
                  var Te = Hu()
                  ;(Pe(
                    Te,
                    21,
                    () => at.recentFolders.filter(Ne => Ne !== a(i)).slice(0, 4),
                    Pr,
                    (Ne, Fe) => {
                      var qe = Bu(),
                        $e = u(qe)
                      ;(L(() => M($e, a(Fe))), ie('click', qe, () => I(i, a(Fe), !0)), p(Ne, qe))
                    }
                  ),
                    p(de, Te))
                },
                Oe = Y(() => at.recentFolders.filter(de => de !== a(i)).length)
              U(He, de => {
                a(Oe) && de(Xe)
              })
            }
            var Re = c(te, 2),
              Ze = u(Re)
            Se(Ze, {
              variant: 'ghost',
              onclick: () => I(r, null),
              children: (de, Te) => {
                var Ne = Q('Cancel')
                p(de, Ne)
              },
              $$slots: { default: !0 },
            })
            var Me = c(Ze, 2)
            {
              let de = Y(() => !a(d).installed || (a(s) === 'specific' && !!a(n) && !a(l)))
              Se(Me, {
                get disabled() {
                  return a(de)
                },
                onclick: g,
                children: (Te, Ne) => {
                  var Fe = Q('Launch')
                  p(Te, Fe)
                },
                $$slots: { default: !0 },
              })
            }
            ;(L(() => {
              ;((F = je(q, 1, 'mode svelte-ishglm', null, F, { active: a(s) === 'favorites' })),
                (q.disabled = a(h) === 0),
                M(J, a(h) > 0 ? `${a(h)} models into the app switcher` : 'No favorites saved yet'),
                (re = je(X, 1, 'mode svelte-ishglm', null, re, { active: a(s) === 'specific' })),
                (ne = je(oe, 1, 'mode svelte-ishglm', null, ne, { active: a(s) === 'open' })))
            }),
              ie('click', q, () => I(s, 'favorites')),
              ie('click', X, () => I(s, 'specific')),
              ie('click', oe, () => I(s, 'open')),
              p(E, A))
          },
          $$slots: { default: !0 },
        })
      }
    }
    U(B, $ => {
      a(d) && $(W)
    })
  }
  var N = c(B, 2)
  {
    var P = $ => {
      {
        let k = Y(() => !!a(o)),
          T = Y(() => `Set path → ${a(o).name}`)
        Er($, {
          get open() {
            return a(k)
          },
          get title() {
            return a(T)
          },
          onclose: () => I(o, null),
          children: (E, D) => {
            var A = Wu(),
              j = c(ee(A), 2),
              q = u(j)
            ar(q, {
              placeholder: '/path/to/executable',
              get value() {
                return a(v)
              },
              set value(X) {
                I(v, X, !0)
              },
            })
            var F = c(q, 2)
            Se(F, {
              size: 'sm',
              variant: 'ghost',
              onclick: O,
              children: (X, re) => {
                var oe = Q('Browse')
                p(X, oe)
              },
              $$slots: { default: !0 },
            })
            var K = c(j, 2),
              V = u(K)
            Se(V, {
              variant: 'ghost',
              onclick: () => I(o, null),
              children: (X, re) => {
                var oe = Q('Cancel')
                p(X, oe)
              },
              $$slots: { default: !0 },
            })
            var J = c(V, 2)
            ;(Se(J, {
              onclick: y,
              children: (X, re) => {
                var oe = Q('Save')
                p(X, oe)
              },
              $$slots: { default: !0 },
            }),
              p(E, A))
          },
          $$slots: { default: !0 },
        })
      }
    }
    U(N, $ => {
      a(o) && $(P)
    })
  }
  ;(p(e, H), me())
}
Ke(['click'])
var Yu = b('<!> <!>', 1)
function Ju(e, t) {
  ge(t, !0)
  var r = it(),
    s = ee(r)
  {
    var n = i => {
        var o = Yu(),
          v = ee(o)
        Ue(v, {
          tone: 'success',
          children: (_, f) => {
            var g = Q()
            ;(L(() => M(g, `Running · ${t.status.listenMode === 'network' ? 'Network' : 'Local'}`)),
              p(_, g))
          },
          $$slots: { default: !0 },
        })
        var d = c(v, 2)
        {
          var h = _ => {
            Ue(_, {
              tone: 'neutral',
              children: (f, g) => {
                var m = Q()
                ;(L(() => M(m, `${t.status.models.length ?? ''} models`)), p(f, m))
              },
              $$slots: { default: !0 },
            })
          }
          U(d, _ => {
            t.status.models && _(h)
          })
        }
        p(i, o)
      },
      l = i => {
        Ue(i, {
          tone: 'neutral',
          children: (o, v) => {
            var d = Q('Stopped')
            p(o, d)
          },
          $$slots: { default: !0 },
        })
      }
    U(s, i => {
      var o
      ;(o = t.status) != null && o.running ? i(n) : i(l, -1)
    })
  }
  ;(p(e, r), me())
}
var Xu = b(
    '<div class="url svelte-swldy1"><span class="lbl svelte-swldy1"> </span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy URL">Copy</button></div>'
  ),
  Zu = b(
    '<!> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Key</span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy API key">Copy</button></div>',
    1
  ),
  Qu = b('<div class="summary svelte-swldy1"> </div>'),
  ef = b(
    '<div class="model svelte-swldy1"><span class="model-name svelte-swldy1"> </span> <button class="mid svelte-swldy1"> </button></div>'
  ),
  tf = b(
    '<div class="group svelte-swldy1"><div class="group-name svelte-swldy1"> <span class="group-count svelte-swldy1"> </span></div> <!></div>'
  ),
  rf = b(
    '<div class="served svelte-swldy1"><div class="served-head svelte-swldy1"><h4 class="svelte-swldy1">Model endpoints</h4> <span class="hint svelte-swldy1"> </span></div> <!></div>'
  ),
  af = b(
    '<div class="urls svelte-swldy1"><div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Anthropic</span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy URL">Copy</button></div> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">OpenAI</span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy URL">Copy</button></div> <!></div> <!> <!>',
    1
  ),
  sf = b(
    '<span class="lbl svelte-swldy1">Server password</span> <input class="inp svelte-swldy1" type="password"/> <!>',
    1
  ),
  nf = b(
    '<div class="prov-actions svelte-swldy1"><button class="link svelte-swldy1">All</button> <button class="link svelte-swldy1">None</button></div>'
  ),
  lf = b(
    '<p class="prov-err svelte-swldy1"> <button class="link svelte-swldy1">Retry</button></p>'
  ),
  of = b('<p class="prov-empty svelte-swldy1">No providers available. Add one first.</p>'),
  vf = b(
    '<button><span class="tick svelte-swldy1" aria-hidden="true"> </span> <span class="prov-name svelte-swldy1"> </span> <span class="prov-count svelte-swldy1"> </span></button>'
  ),
  df = b('<span class="warn svelte-swldy1">No providers selected — pick at least one.</span>'),
  cf = b(
    '<div class="prov-grid svelte-swldy1"></div> <p class="prov-sum svelte-swldy1"><!></p>',
    1
  ),
  uf = b(
    '<div class="opts svelte-swldy1"><!> <!> <!> <!> <!></div> <div class="providers svelte-swldy1"><div class="prov-head svelte-swldy1"><div><h4 class="svelte-swldy1">Providers to serve</h4> <p class="prov-desc svelte-swldy1">Choose which providers appear on the model endpoints. Leave all selected to serve everything.</p></div> <!></div> <!></div>',
    1
  ),
  ff = b(
    '<div class="panel svelte-swldy1"><div class="row svelte-swldy1"><div><h3 class="svelte-swldy1">Server Gateway</h3> <p class="desc svelte-swldy1">Expose your anygate models over a local OpenAI/Anthropic-compatible endpoint.</p></div> <!></div> <!> <div class="actions svelte-swldy1"><!></div></div>'
  )
function pf(e, t) {
  ge(t, !0)
  let r = ae(!1),
    s = ae(!1),
    n = ae(!1),
    l = ae('local'),
    i = ae(''),
    o = ae(!0),
    v = ae(null),
    d = ae(We([])),
    h = ae(!1),
    _ = ae(null)
  const f = Y(() => Qe.status),
    g = Y(() => {
      var T
      return ((T = a(f)) == null ? void 0 : T.saved.hasSavedPassword) ?? !1
    }),
    m = Y(() => {
      var D
      const T = ((D = a(f)) == null ? void 0 : D.models) ?? [],
        E = new Map()
      for (const A of T) {
        const j = E.get(A.providerLabel) ?? []
        ;(j.push(A), E.set(A.providerLabel, j))
      }
      return [...E.entries()].map(([A, j]) => ({ label: A, models: j }))
    }),
    y = Y(() => {
      if (a(v) === null) return a(d).reduce((E, D) => E + D.modelCount, 0)
      const T = new Set(a(v))
      return a(d)
        .filter(E => T.has(E.id))
        .reduce((E, D) => E + D.modelCount, 0)
    })
  function w() {
    a(f) &&
      (I(r, a(f).saved.favoritesOnly, !0),
      I(s, a(f).saved.freeModelsOnly, !0),
      I(n, a(f).saved.maskGatewayIds, !0),
      I(l, a(f).saved.listenMode, !0),
      I(v, a(f).saved.exposedProviders ?? null, !0))
  }
  Lt(() => {
    a(f) && w()
  })
  async function O() {
    ;(I(h, !0), I(_, null))
    try {
      const T = await rv()
      I(d, T.providers ?? [], !0)
    } catch (T) {
      I(_, T instanceof Error ? T.message : String(T), !0)
    } finally {
      I(h, !1)
    }
  }
  Lt(() => {
    var T
    !((T = a(f)) != null && T.running) && a(d).length === 0 && !a(h) && !a(_) && O()
  })
  function H(T) {
    const E = a(v) ?? a(d).map(A => A.id),
      D = E.includes(T) ? E.filter(A => A !== T) : [...E, T]
    I(v, D.length === a(d).length ? null : D, !0)
  }
  function x(T) {
    return a(v) === null || a(v).includes(T)
  }
  async function C(T) {
    try {
      ;(await navigator.clipboard.writeText(T), pe('Copied to clipboard', 'success'))
    } catch {
      pe('Could not copy to clipboard', 'error')
    }
  }
  async function R() {
    var A, j, q
    if ((A = a(f)) != null && A.running) {
      await Ov()
      return
    }
    if (a(v) !== null && a(v).length === 0) {
      pe('Select at least one provider to serve', 'error')
      return
    }
    const T = a(i).trim(),
      E = a(l) === 'network' && !T && a(g)
    if (a(l) === 'network' && !T && !a(g)) {
      pe('A server password is required for network mode', 'error')
      return
    }
    !(await Lv({
      favoritesOnly: a(r),
      freeModelsOnly: a(s),
      exposedProviders: a(v),
      maskGatewayIds: a(n),
      listenMode: a(l),
      passwordMode: E ? 'saved' : 'new',
      password: E ? void 0 : T,
      savePassword: a(o),
    })) &&
      (j = Qe.error) != null &&
      j.includes('No providers') &&
      ((q = t.onneedsmodels) == null || q.call(t))
  }
  var G = ff(),
    z = u(G),
    B = c(u(z), 2)
  Ju(B, {
    get status() {
      return a(f)
    },
  })
  var W = c(z, 2)
  {
    var N = T => {
        var E = af(),
          D = ee(E),
          A = u(D),
          j = c(u(A)),
          q = u(j),
          F = c(j, 2),
          K = c(A, 2),
          V = c(u(K)),
          J = u(V),
          X = c(V, 2),
          re = c(K, 2)
        {
          var oe = te => {
            var se = Zu(),
              ke = ee(se)
            Pe(
              ke,
              17,
              () => a(f).networkUrls,
              Re => Re.name,
              (Re, Ze) => {
                var Me = Xu(),
                  de = u(Me),
                  Te = u(de),
                  Ne = c(de),
                  Fe = u(Ne),
                  qe = c(Ne, 2)
                ;(L(() => {
                  ;(M(Te, a(Ze).name), M(Fe, a(Ze).anthropicUrl))
                }),
                  ie('click', qe, () => C(a(Ze).anthropicUrl)),
                  p(Re, Me))
              }
            )
            var Ce = c(ke, 2),
              He = c(u(Ce)),
              Xe = u(He),
              Oe = c(He, 2)
            ;(L(() => M(Xe, a(f).apiKey)), ie('click', Oe, () => C(a(f).apiKey ?? '')), p(te, se))
          }
          U(re, te => {
            a(f).listenMode === 'network' && a(f).networkUrls && te(oe)
          })
        }
        var ne = c(D, 2)
        {
          var ve = te => {
            var se = Qu(),
              ke = u(se)
            ;(L(() => M(ke, a(f).providerSummary)), p(te, se))
          }
          U(ne, te => {
            a(f).providerSummary && te(ve)
          })
        }
        var ue = c(ne, 2)
        {
          var Z = te => {
            var se = rf(),
              ke = u(se),
              Ce = c(u(ke), 2),
              He = u(Ce),
              Xe = c(ke, 2)
            ;(Pe(
              Xe,
              17,
              () => a(m),
              Oe => Oe.label,
              (Oe, Re) => {
                var Ze = tf(),
                  Me = u(Ze),
                  de = u(Me),
                  Te = c(de),
                  Ne = u(Te),
                  Fe = c(Me, 2)
                ;(Pe(
                  Fe,
                  17,
                  () => a(Re).models,
                  qe => qe.anthropicId,
                  (qe, $e) => {
                    var er = ef(),
                      aa = u(er),
                      Qa = u(aa),
                      sa = c(aa, 2),
                      es = u(sa)
                    ;(L(() => {
                      ;(he(aa, 'title', a($e).name),
                        M(Qa, a($e).name),
                        he(sa, 'title', `Copy Anthropic model id: ${a($e).anthropicId ?? ''}`),
                        M(es, a($e).anthropicId))
                    }),
                      ie('click', sa, () => C(a($e).anthropicId)),
                      p(qe, er))
                  }
                ),
                  L(() => {
                    ;(M(de, a(Re).label), M(Ne, a(Re).models.length))
                  }),
                  p(Oe, Ze))
              }
            ),
              L(() => {
                var Oe, Re
                return M(
                  He,
                  `${((Oe = a(f).models) == null ? void 0 : Oe.length) ?? ''} model${((Re = a(f).models) == null ? void 0 : Re.length) === 1 ? '' : 's'} served`
                )
              }),
              p(te, se))
          }
          U(ue, te => {
            a(m).length > 0 && te(Z)
          })
        }
        ;(L(() => {
          ;(M(q, a(f).anthropicUrl), M(J, a(f).openaiUrl))
        }),
          ie('click', F, () => C(a(f).anthropicUrl ?? '')),
          ie('click', X, () => C(a(f).openaiUrl ?? '')),
          p(T, E))
      },
      P = T => {
        var E = uf(),
          D = ee(E),
          A = u(D)
        la(A, {
          label: 'Favorites only',
          get checked() {
            return a(r)
          },
          set checked(se) {
            I(r, se, !0)
          },
        })
        var j = c(A, 2)
        la(j, {
          label: 'Free models only',
          get checked() {
            return a(s)
          },
          set checked(se) {
            I(s, se, !0)
          },
        })
        var q = c(j, 2)
        la(q, {
          label: 'Mask gateway IDs',
          get checked() {
            return a(n)
          },
          set checked(se) {
            I(n, se, !0)
          },
        })
        var F = c(q, 2)
        {
          let se = Y(() => a(l) === 'network')
          la(F, {
            get checked() {
              return a(se)
            },
            onchange: ke => I(l, ke ? 'network' : 'local', !0),
            label: 'Network mode',
          })
        }
        var K = c(F, 2)
        {
          var V = se => {
            var ke = sf(),
              Ce = c(ee(ke), 2),
              He = c(Ce, 2)
            ;(la(He, {
              label: 'Save password',
              get checked() {
                return a(o)
              },
              set checked(Xe) {
                I(o, Xe, !0)
              },
            }),
              L(() =>
                he(
                  Ce,
                  'placeholder',
                  a(g) ? 'Using saved password — type to replace' : 'required for network mode'
                )
              ),
              Ta(
                Ce,
                () => a(i),
                Xe => I(i, Xe)
              ),
              p(se, ke))
          }
          U(K, se => {
            a(l) === 'network' && se(V)
          })
        }
        var J = c(D, 2),
          X = u(J),
          re = c(u(X), 2)
        {
          var oe = se => {
            var ke = nf(),
              Ce = u(ke),
              He = c(Ce, 2)
            ;(ie('click', Ce, () => I(v, null)), ie('click', He, () => I(v, [], !0)), p(se, ke))
          }
          U(re, se => {
            a(d).length > 0 && se(oe)
          })
        }
        var ne = c(X, 2)
        {
          var ve = se => {
              Zt(se, { label: 'Loading providers…' })
            },
            ue = se => {
              var ke = lf(),
                Ce = u(ke),
                He = c(Ce)
              ;(L(() => M(Ce, `Couldn’t load providers (${a(_) ?? ''}). `)),
                ie('click', He, () => O()),
                p(se, ke))
            },
            Z = se => {
              var ke = of()
              p(se, ke)
            },
            te = se => {
              var ke = cf(),
                Ce = ee(ke)
              Pe(
                Ce,
                21,
                () => a(d),
                Me => Me.id,
                (Me, de) => {
                  var Te = vf()
                  let Ne
                  var Fe = u(Te),
                    qe = u(Fe),
                    $e = c(Fe, 2),
                    er = u($e),
                    aa = c($e, 2),
                    Qa = u(aa)
                  ;(L(
                    (sa, es, jl) => {
                      ;((Ne = je(Te, 1, 'prov svelte-swldy1', null, Ne, sa)),
                        he(Te, 'aria-pressed', es),
                        M(qe, jl),
                        he($e, 'title', a(de).id),
                        M(er, a(de).name),
                        M(Qa, a(de).modelCount))
                    },
                    [() => ({ on: x(a(de).id) }), () => x(a(de).id), () => (x(a(de).id) ? '✓' : '')]
                  ),
                    ie('click', Te, () => H(a(de).id)),
                    p(Me, Te))
                }
              )
              var He = c(Ce, 2),
                Xe = u(He)
              {
                var Oe = Me => {
                    var de = Q()
                    ;(L(() =>
                      M(de, `Serving all ${a(d).length ?? ''} providers · ${a(y) ?? ''} models`)
                    ),
                      p(Me, de))
                  },
                  Re = Me => {
                    var de = df()
                    p(Me, de)
                  },
                  Ze = Me => {
                    var de = Q()
                    ;(L(() =>
                      M(
                        de,
                        `Serving ${a(v).length ?? ''} of ${a(d).length ?? ''} providers · ${a(y) ?? ''} models`
                      )
                    ),
                      p(Me, de))
                  }
                U(Xe, Me => {
                  a(v) === null ? Me(Oe) : a(v).length === 0 ? Me(Re, 1) : Me(Ze, -1)
                })
              }
              p(se, ke)
            }
          U(ne, se => {
            a(h) ? se(ve) : a(_) ? se(ue, 1) : a(d).length === 0 ? se(Z, 2) : se(te, -1)
          })
        }
        p(T, E)
      }
    U(W, T => {
      var E
      ;(E = a(f)) != null && E.running ? T(N) : T(P, -1)
    })
  }
  var $ = c(W, 2),
    k = u($)
  {
    let T = Y(() => {
      var E
      return (E = a(f)) != null && E.running ? 'danger' : 'primary'
    })
    Se(k, {
      get variant() {
        return a(T)
      },
      get disabled() {
        return Qe.starting
      },
      onclick: R,
      children: (E, D) => {
        var A = Q()
        ;(L(() => {
          var j
          return M(
            A,
            Qe.starting
              ? 'Working…'
              : (j = a(f)) != null && j.running
                ? 'Stop server'
                : 'Start server'
          )
        }),
          p(E, A))
      },
      $$slots: { default: !0 },
    })
  }
  ;(p(e, G), me())
}
Ke(['click'])
var hf = b('<p style="color:var(--error);font-size:13px"> </p>'),
  _f = b(
    '<div class="page"><div class="head svelte-124gvcr"><h2 class="svelte-124gvcr">Server Gateway</h2> <p class="sub svelte-124gvcr">Run a local OpenAI / Anthropic-compatible server exposing your anygate models to any tool.</p></div> <!> <!></div>'
  )
function gf(e, t) {
  ;(ge(t, !1),
    Ks(() => {
      ya()
    }),
    ml())
  var r = _f(),
    s = c(u(r), 2)
  {
    var n = v => {
        Zt(v, { label: 'Reading server status…' })
      },
      l = v => {
        pf(v, { onneedsmodels: () => (location.hash = '#/providers') })
      }
    U(s, v => {
      Qe.loading && !Qe.status ? v(n) : v(l, -1)
    })
  }
  var i = c(s, 2)
  {
    var o = v => {
      De(v, {
        padding: '16px',
        children: (d, h) => {
          var _ = hf(),
            f = u(_)
          ;(L(() => M(f, Qe.error)), p(d, _))
        },
        $$slots: { default: !0 },
      })
    }
    U(i, v => {
      Qe.error && v(o)
    })
  }
  ;(p(e, r), me())
}
var mf = b('<div class="muted svelte-hss3zz">Loading providers…</div>'),
  yf = b('<div class="muted svelte-hss3zz">No providers configured.</div>'),
  wf = b('<div class="muted svelte-hss3zz">Select a provider first.</div>'),
  bf = b(
    '<div class="muted svelte-hss3zz">This provider has no directly-testable (OpenAI/Anthropic) models.</div>'
  ),
  xf = b('<!> Testing…', 1),
  kf = b(
    '<h3 class="panel-title svelte-hss3zz">Test configuration</h3> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Provider</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Model</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Prompt</span> <textarea class="prompt svelte-hss3zz" rows="3" placeholder="What to send to the model…" id="tester-prompt"></textarea></label> <div class="run svelte-hss3zz"><!></div>',
    1
  ),
  Sf = b(
    '<div class="live-pulse svelte-hss3zz"></div> <p class="live-text svelte-hss3zz">Probing <strong class="svelte-hss3zz"> </strong>…</p> <p class="muted svelte-hss3zz">Connecting to upstream endpoint.</p>',
    1
  ),
  Pf = b(
    '<div class="sample svelte-hss3zz"><span class="sample-label svelte-hss3zz">Sample response</span> <pre class="sample-body svelte-hss3zz"> </pre></div>'
  ),
  Ef = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot ok svelte-hss3zz"></span> <span class="status-text ok svelte-hss3zz">Endpoint responds</span> <!></div> <div class="metrics svelte-hss3zz"><div class="metric gauge svelte-hss3zz"><svg viewBox="0 0 120 120" class="gauge-svg svelte-hss3zz"><circle class="gauge-bg svelte-hss3zz" cx="60" cy="60" r="52"></circle><circle class="gauge-fg svelte-hss3zz" cx="60" cy="60" r="52"></circle></svg> <div class="gauge-center svelte-hss3zz"><span class="gauge-value svelte-hss3zz"> </span> <span class="gauge-unit svelte-hss3zz">ms TTFT</span></div> <span class="metric-label svelte-hss3zz">Time to first token</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Connect</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Total round-trip</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Tokens / sec</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Streamed chunks</span></div> <div class="metric svelte-hss3zz"><span> </span> <span class="metric-label svelte-hss3zz">Stream stability</span></div></div> <!>',
    1
  ),
  Mf = b('<p class="fail-hint svelte-hss3zz"> </p>'),
  Af = b(
    '<div class="mini-metrics svelte-hss3zz"><span class="svelte-hss3zz"> </span> <span class="svelte-hss3zz"> </span></div>'
  ),
  zf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Endpoint did not respond correctly</span></div> <p class="fail-error svelte-hss3zz"> </p> <!> <!>',
    1
  ),
  Tf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Request error</span></div> <p class="fail-error svelte-hss3zz"> </p>',
    1
  ),
  Cf = b(
    'Select a provider + model and hit <strong class="svelte-hss3zz">Run test</strong> to measure live latency.',
    1
  ),
  $f =
    b(`<div class="page svelte-hss3zz"><div class="head svelte-hss3zz"><div class="svelte-hss3zz"><h2 class="svelte-hss3zz">Model Tester</h2> <p class="sub svelte-hss3zz">Pick a provider and model, then fire a live request at its real endpoint.
        Measures connection time, time-to-first-token, and total latency.</p></div> <!></div> <div class="grid svelte-hss3zz"><!> <div class="results svelte-hss3zz"><!></div></div></div>`)
function If(e, t) {
  ge(t, !0)
  let r = ae(''),
    s = ae(''),
    n = ae('Reply with a single word: pong'),
    l = ae(!1),
    i = ae(null),
    o = ae(null)
  const v = Y(() =>
      Ie.list
        .filter(k => {
          var T
          return (((T = k.enrichedModels) == null ? void 0 : T.length) ?? 0) > 0
        })
        .map(k => ({ value: k.id, label: k.name }))
    ),
    d = Y(() => Ie.list.find(k => k.id === a(r)))
  function h(k) {
    return k.format === 'anthropic' || k.format === 'openai'
  }
  const _ = Y(() => {
      var k
      return (((k = a(d)) == null ? void 0 : k.enrichedModels) ?? []).filter(h)
    }),
    f = Y(() =>
      a(_).map(k => ({
        value: k.id,
        label: `${k.name ?? k.id}${k.contextWindow ? ` · ${Math.round(k.contextWindow / 1e3)}k` : ''}`,
      }))
    )
  Lt(() => {
    ;(a(r) && a(d) && a(_).some(T => T.id === a(s))) || I(s, '')
  })
  const g = Y(() => !!a(r) && !!a(s) && !a(l))
  async function m() {
    if (a(g)) {
      ;(I(l, !0), I(i, null), I(o, null))
      try {
        const k = await qo({ providerId: a(r), modelId: a(s), prompt: a(n) })
        ;(I(i, k, !0),
          k.ok
            ? pe(`Test passed · ${k.ttftMs}ms TTFT`, 'success')
            : pe(k.error ?? 'Test failed', 'error'))
      } catch (k) {
        ;(I(o, k instanceof Error ? k.message : String(k), !0), pe('Network error', 'error'))
      } finally {
        I(l, !1)
      }
    }
  }
  function y(k) {
    return k == null ? '—' : k < 1e3 ? `${k} ms` : `${(k / 1e3).toFixed(2)} s`
  }
  const w = Y(() =>
    a(i) && a(i).ttftMs !== null ? Math.max(0, Math.min(100, 100 - (a(i).ttftMs / 3e3) * 100)) : 0
  )
  var O = $f(),
    H = u(O),
    x = c(u(H), 2)
  Ue(x, {
    children: (k, T) => {
      var E = Q('server-side · live')
      p(k, E)
    },
    $$slots: { default: !0 },
  })
  var C = c(H, 2),
    R = u(C)
  De(R, {
    padding: '22px',
    class: 'panel',
    children: (k, T) => {
      var E = kf(),
        D = c(ee(E), 2),
        A = c(u(D), 2)
      {
        var j = Z => {
            var te = mf()
            p(Z, te)
          },
          q = Z => {
            var te = yf()
            p(Z, te)
          },
          F = Z => {
            vr(Z, {
              get options() {
                return a(v)
              },
              get disabled() {
                return a(l)
              },
              id: 'tester-provider',
              get value() {
                return a(r)
              },
              set value(te) {
                I(r, te, !0)
              },
            })
          }
        U(A, Z => {
          Ie.loading ? Z(j) : a(v).length === 0 ? Z(q, 1) : Z(F, -1)
        })
      }
      var K = c(D, 2),
        V = c(u(K), 2)
      {
        var J = Z => {
            var te = wf()
            p(Z, te)
          },
          X = Z => {
            var te = bf()
            p(Z, te)
          },
          re = Z => {
            vr(Z, {
              get options() {
                return a(f)
              },
              get disabled() {
                return a(l)
              },
              id: 'tester-model',
              get value() {
                return a(s)
              },
              set value(te) {
                I(s, te, !0)
              },
            })
          }
        U(V, Z => {
          a(r) ? (a(f).length === 0 ? Z(X, 1) : Z(re, -1)) : Z(J)
        })
      }
      var oe = c(K, 2),
        ne = c(u(oe), 2),
        ve = c(oe, 2),
        ue = u(ve)
      {
        let Z = Y(() => !a(g))
        Se(ue, {
          variant: 'primary',
          size: 'lg',
          get disabled() {
            return a(Z)
          },
          onclick: m,
          children: (te, se) => {
            var ke = it(),
              Ce = ee(ke)
            {
              var He = Oe => {
                  var Re = xf(),
                    Ze = ee(Re)
                  ;(Zt(Ze, { label: '' }), p(Oe, Re))
                },
                Xe = Oe => {
                  var Re = Q('Run test')
                  p(Oe, Re)
                }
              U(Ce, Oe => {
                a(l) ? Oe(He) : Oe(Xe, -1)
              })
            }
            p(te, ke)
          },
          $$slots: { default: !0 },
        })
      }
      ;(L(() => (ne.disabled = a(l))),
        Ta(
          ne,
          () => a(n),
          Z => I(n, Z)
        ),
        p(k, E))
    },
    $$slots: { default: !0 },
  })
  var G = c(R, 2),
    z = u(G)
  {
    var B = k => {
        De(k, {
          padding: '28px',
          class: 'result-card live',
          children: (T, E) => {
            var D = Sf(),
              A = c(ee(D), 2),
              j = c(u(A)),
              q = u(j)
            ;(L(() => M(q, a(s))), p(T, D))
          },
          $$slots: { default: !0 },
        })
      },
      W = k => {
        De(k, {
          padding: '24px',
          class: 'result-card pass',
          children: (T, E) => {
            var D = Ef(),
              A = ee(D),
              j = c(u(A), 4)
            Ue(j, {
              children: (Fe, qe) => {
                var $e = Q()
                ;(L(() => M($e, a(i).format)), p(Fe, $e))
              },
              $$slots: { default: !0 },
            })
            var q = c(A, 2),
              F = u(q),
              K = u(F),
              V = c(u(K)),
              J = c(K, 2),
              X = u(J),
              re = u(X),
              oe = c(F, 2),
              ne = u(oe),
              ve = u(ne),
              ue = c(oe, 2),
              Z = u(ue),
              te = u(Z),
              se = c(ue, 2),
              ke = u(se),
              Ce = u(ke),
              He = c(se, 2),
              Xe = u(He),
              Oe = u(Xe),
              Re = c(He, 2),
              Ze = u(Re)
            let Me
            var de = u(Ze),
              Te = c(q, 2)
            {
              var Ne = Fe => {
                var qe = Pf(),
                  $e = c(u(qe), 2),
                  er = u($e)
                ;(L(() => M(er, a(i).sample)), p(Fe, qe))
              }
              U(Te, Fe => {
                a(i).sample && Fe(Ne)
              })
            }
            ;(L(
              (Fe, qe) => {
                ;(et(V, `stroke-dashoffset: ${329.9 - (329.9 * a(w)) / 100}`),
                  M(re, a(i).ttftMs ?? '—'),
                  M(ve, Fe),
                  M(te, qe),
                  M(Ce, a(i).tokensPerSec ?? '—'),
                  M(Oe, a(i).tokens),
                  (Me = je(Ze, 1, 'metric-value mono svelte-hss3zz', null, Me, {
                    warn: a(i).streamStability === 'intermittent',
                  })),
                  M(de, a(i).streamStability))
              },
              [() => y(a(i).connectMs), () => y(a(i).totalMs)]
            ),
              p(T, D))
          },
          $$slots: { default: !0 },
        })
      },
      N = k => {
        De(k, {
          padding: '24px',
          class: 'result-card fail',
          children: (T, E) => {
            var D = zf(),
              A = c(ee(D), 2),
              j = u(A),
              q = c(A, 2)
            {
              var F = J => {
                var X = Mf(),
                  re = u(X)
                ;(L(() => M(re, `↳ ${a(i).errorHint ?? ''}`)), p(J, X))
              }
              U(q, J => {
                a(i).errorHint && J(F)
              })
            }
            var K = c(q, 2)
            {
              var V = J => {
                var X = Af(),
                  re = u(X),
                  oe = u(re),
                  ne = c(re, 2),
                  ve = u(ne)
                ;(L(
                  (ue, Z) => {
                    ;(M(oe, `connect ${ue ?? ''}`), M(ve, `total ${Z ?? ''}`))
                  },
                  [() => y(a(i).connectMs), () => y(a(i).totalMs)]
                ),
                  p(J, X))
              }
              U(K, J => {
                a(i).connectMs !== null && J(V)
              })
            }
            ;(L(() => M(j, a(i).error)), p(T, D))
          },
          $$slots: { default: !0 },
        })
      },
      P = k => {
        De(k, {
          padding: '24px',
          class: 'result-card fail',
          children: (T, E) => {
            var D = Tf(),
              A = c(ee(D), 2),
              j = u(A)
            ;(L(() => M(j, a(o))), p(T, D))
          },
          $$slots: { default: !0 },
        })
      },
      $ = k => {
        $r(k, {
          title: 'No test run yet',
          icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3',
          children: (T, E) => {
            var D = Cf()
            p(T, D)
          },
          $$slots: { default: !0 },
        })
      }
    U(z, k => {
      a(l)
        ? k(B)
        : a(i) && a(i).ok
          ? k(W, 1)
          : a(i) && !a(i).ok
            ? k(N, 2)
            : a(o)
              ? k(P, 3)
              : k($, -1)
    })
  }
  ;(p(e, O), me())
}
var Lf = b(
    '<h3 class="svelte-15j4tnx">Appearance</h3> <div class="line svelte-15j4tnx"><span>Theme</span> <!></div>',
    1
  ),
  Of = b(
    '<div class="kv svelte-15j4tnx"><span>ANYGATE_HOME</span><code class="svelte-15j4tnx"> </code></div>'
  ),
  Rf = b(
    '<h3 class="svelte-15j4tnx">Subscription tier</h3> <div class="line svelte-15j4tnx"><span>Backend selection for wizards</span> <!></div> <!>',
    1
  ),
  Nf = b(
    '<h3 class="svelte-15j4tnx">Config backup</h3> <p class="muted svelte-15j4tnx">Export favorites to a portable JSON file and re-import on another machine.</p> <div class="acts svelte-15j4tnx"><!> <!></div>',
    1
  ),
  Ff = b(
    '<div class="preset svelte-15j4tnx"><div class="pmeta"><span class="pname svelte-15j4tnx"> </span> <span class="psub svelte-15j4tnx"> </span></div> <div class="pacts svelte-15j4tnx"><!> <!></div></div> <pre class="dryrun svelte-15j4tnx"> </pre>',
    1
  ),
  Df = b(
    '<div class="sec-head svelte-15j4tnx"><h3 class="svelte-15j4tnx">Launch presets</h3><!></div> <!>',
    1
  ),
  jf = b(
    '<textarea class="ta svelte-15j4tnx" readonly=""></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  qf = b(
    '<p class="muted svelte-15j4tnx">Paste an anygate config JSON (from Export favorites).</p> <textarea class="ta svelte-15j4tnx" placeholder="Paste JSON here"></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Uf = b('<span class="lbl svelte-15j4tnx" style="margin-top:12px">Model</span> <!>', 1),
  Bf = b(
    '<span class="lbl svelte-15j4tnx">Label</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">App</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">Provider</span> <!> <!> <div class="row svelte-15j4tnx" style="margin-top:18px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Hf = b(
    '<div class="page"><div class="head svelte-15j4tnx"><h2 class="svelte-15j4tnx">Settings</h2><p class="sub svelte-15j4tnx">Theme, subscription tier, launch presets, and portable config backup.</p></div> <div class="cols svelte-15j4tnx"><div class="stack svelte-15j4tnx"><!> <!> <!></div> <div class="stack svelte-15j4tnx"><!></div></div></div> <!> <!> <!>',
    1
  )
function Gf(e, t) {
  ge(t, !0)
  let r = ae(!1),
    s = ae(''),
    n = ae(!1),
    l = ae('')
  const i = [
    { value: 'free', label: 'Free' },
    { value: 'zen', label: 'Zen' },
    { value: 'go', label: 'Go' },
    { value: 'both', label: 'Both' },
  ]
  function o() {
    ov()
      .then(E => {
        ;(I(s, E, !0), I(r, !0))
      })
      .catch(E => pe(String(E), 'error'))
  }
  async function v() {
    try {
      ;(await vv(a(l)), pe('Config imported', 'success'), I(n, !1), await zl())
    } catch (E) {
      pe(E instanceof Error ? E.message : String(E), 'error')
    }
  }
  function d() {
    const E = new Blob([a(s)], { type: 'application/json' }),
      D = document.createElement('a')
    ;((D.href = URL.createObjectURL(E)), (D.download = 'anygate-config.json'), D.click())
  }
  let h = ae(!1),
    _ = ae(''),
    f = ae(''),
    g = ae(''),
    m = ae('')
  function y(E) {
    const D = Ie.list.find(q => q.id === E.providerId),
      A = D == null ? void 0 : D.enrichedModels.find(q => q.id === E.modelId)
    return !D || !A
      ? '—'
      : dv({ provider: D, modelId: A.id, contextWindow: A.contextWindow }).env.map(
          q => `${q.key}=${q.masked ? '•••' : q.value}`
        ).join(`
`)
  }
  var w = Hf(),
    O = ee(w),
    H = c(u(O), 2),
    x = u(H),
    C = u(x)
  De(C, {
    padding: '20px',
    children: (E, D) => {
      var A = Lf(),
        j = c(ee(A), 2),
        q = c(u(j), 2)
      ;(Se(q, {
        size: 'sm',
        variant: 'ghost',
        get onclick() {
          return Rl
        },
        children: (F, K) => {
          var V = Q()
          ;(L(() => M(V, `${or.value === 'dark' ? 'Dark' : 'Light'} · toggle`)), p(F, V))
        },
        $$slots: { default: !0 },
      }),
        p(E, A))
    },
    $$slots: { default: !0 },
  })
  var R = c(C, 2)
  De(R, {
    padding: '20px',
    children: (E, D) => {
      var A = Rf(),
        j = c(ee(A), 2),
        q = c(u(j), 2)
      vr(q, {
        get value() {
          return ir.tier
        },
        get options() {
          return i
        },
        onchange: V => Ev(V),
      })
      var F = c(j, 2)
      {
        var K = V => {
          var J = Of(),
            X = c(u(J)),
            re = u(X)
          ;(L(() => M(re, ir.anygateHome)), p(V, J))
        }
        U(F, V => {
          ir.anygateHome && V(K)
        })
      }
      p(E, A)
    },
    $$slots: { default: !0 },
  })
  var G = c(R, 2)
  De(G, {
    padding: '20px',
    children: (E, D) => {
      var A = Nf(),
        j = c(ee(A), 4),
        q = u(j)
      Se(q, {
        size: 'sm',
        variant: 'subtle',
        onclick: o,
        children: (K, V) => {
          var J = Q('Export favorites')
          p(K, J)
        },
        $$slots: { default: !0 },
      })
      var F = c(q, 2)
      ;(Se(F, {
        size: 'sm',
        variant: 'ghost',
        onclick: () => I(n, !0),
        children: (K, V) => {
          var J = Q('Import')
          p(K, J)
        },
        $$slots: { default: !0 },
      }),
        p(E, A))
    },
    $$slots: { default: !0 },
  })
  var z = c(x, 2),
    B = u(z)
  De(B, {
    padding: '20px',
    children: (E, D) => {
      var A = Df(),
        j = ee(A),
        q = c(u(j))
      Se(q, {
        size: 'sm',
        onclick: () => {
          ;(I(h, !0), I(_, ''), I(f, ''), I(g, ''), I(m, ''))
        },
        children: (J, X) => {
          var re = Q('New')
          p(J, re)
        },
        $$slots: { default: !0 },
      })
      var F = c(j, 2)
      {
        var K = J => {
            $r(J, {
              title: 'No presets',
              icon: 'M12 5v14M5 12h14',
              children: (X, re) => {
                var oe = Q('Save an app + provider + model combo for one-click launch.')
                p(X, oe)
              },
              $$slots: { default: !0 },
            })
          },
          V = J => {
            var X = it(),
              re = ee(X)
            ;(Pe(
              re,
              17,
              () => _t.list,
              oe => oe.id,
              (oe, ne) => {
                var ve = Ff(),
                  ue = ee(ve),
                  Z = u(ue),
                  te = u(Z),
                  se = u(te),
                  ke = c(te, 2),
                  Ce = u(ke),
                  He = c(Z, 2),
                  Xe = u(He)
                Se(Xe, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => navigator.clipboard.writeText(y(a(ne))),
                  children: (Me, de) => {
                    var Te = Q('Dry run')
                    p(Me, Te)
                  },
                  $$slots: { default: !0 },
                })
                var Oe = c(Xe, 2)
                Se(Oe, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => Av(a(ne).id),
                  children: (Me, de) => {
                    var Te = Q('Delete')
                    p(Me, Te)
                  },
                  $$slots: { default: !0 },
                })
                var Re = c(ue, 2),
                  Ze = u(Re)
                ;(L(
                  Me => {
                    ;(M(se, a(ne).label ?? a(ne).appId),
                      M(
                        Ce,
                        `${a(ne).providerId ?? ''}${a(ne).modelId ? ' · ' + a(ne).modelId : ''}${a(ne).folder ? ' · ' + a(ne).folder : ''}`
                      ),
                      M(Ze, Me))
                  },
                  [() => y(a(ne))]
                ),
                  p(oe, ve))
              }
            ),
              p(J, X))
          }
        U(F, J => {
          _t.list.length === 0 ? J(K) : J(V, -1)
        })
      }
      p(E, A)
    },
    $$slots: { default: !0 },
  })
  var W = c(O, 2)
  {
    var N = E => {
      Er(E, {
        get open() {
          return a(r)
        },
        title: 'Export favorites',
        onclose: () => I(r, !1),
        children: (D, A) => {
          var j = jf(),
            q = ee(j),
            F = c(q, 2),
            K = u(F)
          Se(K, {
            variant: 'ghost',
            onclick: () => I(r, !1),
            children: (J, X) => {
              var re = Q('Close')
              p(J, re)
            },
            $$slots: { default: !0 },
          })
          var V = c(K, 2)
          ;(Se(V, {
            onclick: d,
            children: (J, X) => {
              var re = Q('Download')
              p(J, re)
            },
            $$slots: { default: !0 },
          }),
            L(() => Ws(q, a(s))),
            p(D, j))
        },
        $$slots: { default: !0 },
      })
    }
    U(W, E => {
      a(r) && E(N)
    })
  }
  var P = c(W, 2)
  {
    var $ = E => {
      Er(E, {
        get open() {
          return a(n)
        },
        title: 'Import config',
        onclose: () => I(n, !1),
        children: (D, A) => {
          var j = qf(),
            q = c(ee(j), 2),
            F = c(q, 2),
            K = u(F)
          Se(K, {
            variant: 'ghost',
            onclick: () => I(n, !1),
            children: (J, X) => {
              var re = Q('Cancel')
              p(J, re)
            },
            $$slots: { default: !0 },
          })
          var V = c(K, 2)
          ;(Se(V, {
            onclick: v,
            children: (J, X) => {
              var re = Q('Import')
              p(J, re)
            },
            $$slots: { default: !0 },
          }),
            Ta(
              q,
              () => a(l),
              J => I(l, J)
            ),
            p(D, j))
        },
        $$slots: { default: !0 },
      })
    }
    U(P, E => {
      a(n) && E($)
    })
  }
  var k = c(P, 2)
  {
    var T = E => {
      Er(E, {
        get open() {
          return a(h)
        },
        title: 'New preset',
        onclose: () => I(h, !1),
        children: (D, A) => {
          var j = Bf(),
            q = c(ee(j), 2)
          ar(q, {
            placeholder: 'My daily setup',
            get value() {
              return a(m)
            },
            set value(ne) {
              I(m, ne, !0)
            },
          })
          var F = c(q, 4)
          {
            let ne = Y(() => [
              { value: '', label: '—' },
              ...(Ie.list.length
                ? [
                    { value: 'claude', label: 'Claude' },
                    { value: 'codex', label: 'Codex' },
                    { value: 'antigravity', label: 'Antigravity' },
                  ]
                : []),
            ])
            vr(F, {
              get options() {
                return a(ne)
              },
              get value() {
                return a(_)
              },
              set value(ve) {
                I(_, ve, !0)
              },
            })
          }
          var K = c(F, 4)
          {
            let ne = Y(() => [
              { value: '', label: '—' },
              ...Ie.list.map(ve => ({ value: ve.id, label: ve.name })),
            ])
            vr(K, {
              get options() {
                return a(ne)
              },
              get value() {
                return a(f)
              },
              set value(ve) {
                I(f, ve, !0)
              },
            })
          }
          var V = c(K, 2)
          {
            var J = ne => {
              var ve = Uf(),
                ue = c(ee(ve), 2)
              {
                let Z = Y(() => {
                  var te
                  return [
                    { value: '', label: '—' },
                    ...(
                      ((te = Ie.list.find(se => se.id === a(f))) == null
                        ? void 0
                        : te.enrichedModels) ?? []
                    ).map(se => ({ value: se.id, label: se.name ?? se.id })),
                  ]
                })
                vr(ue, {
                  get options() {
                    return a(Z)
                  },
                  get value() {
                    return a(g)
                  },
                  set value(te) {
                    I(g, te, !0)
                  },
                })
              }
              p(ne, ve)
            }
            U(V, ne => {
              a(f) && ne(J)
            })
          }
          var X = c(V, 2),
            re = u(X)
          Se(re, {
            variant: 'ghost',
            onclick: () => I(h, !1),
            children: (ne, ve) => {
              var ue = Q('Cancel')
              p(ne, ue)
            },
            $$slots: { default: !0 },
          })
          var oe = c(re, 2)
          {
            let ne = Y(() => !a(_) || !a(m))
            Se(oe, {
              get disabled() {
                return a(ne)
              },
              onclick: async () => {
                ;(await Mv({
                  appId: a(_),
                  providerId: a(f) || void 0,
                  modelId: a(g) || void 0,
                  label: a(m),
                }),
                  I(h, !1))
              },
              children: (ve, ue) => {
                var Z = Q('Save')
                p(ve, Z)
              },
              $$slots: { default: !0 },
            })
          }
          p(D, j)
        },
        $$slots: { default: !0 },
      })
    }
    U(k, E => {
      a(h) && E(T)
    })
  }
  ;(p(e, w), me())
}
var Wf = b(
  '<div class="app-shell svelte-1n46o8q"><!> <div class="main svelte-1n46o8q"><!> <main class="content svelte-1n46o8q"><!> <!> <!> <!> <!> <!> <!></main></div></div> <!> <!>',
  1
)
function Kf(e, t) {
  ge(t, !0)
  let r = ''
  function s(P) {
    ;(P.metaKey || P.ctrlKey) && P.key.toLowerCase() === 'k' && (P.preventDefault(), Oo())
  }
  Ks(
    () => (
      $o(),
      window.addEventListener('keydown', s),
      Ys(),
      El(),
      kv(),
      Pv(),
      zl(),
      Ts(),
      $l(),
      $v(),
      () => {
        ;(window.removeEventListener('keydown', s), Iv(), Tv())
      }
    )
  )
  var n = Wf(),
    l = ee(n),
    i = u(l)
  Fv(i, {})
  var o = c(i, 2),
    v = u(o)
  cd(v, {})
  var d = c(v, 2),
    h = u(d)
  {
    var _ = P => {
      $c(P, {})
    }
    U(h, P => {
      zt.route === 'dashboard' && P(_)
    })
  }
  var f = c(h, 2)
  {
    var g = P => {
      ou(P, {})
    }
    U(f, P => {
      zt.route === 'providers' && P(g)
    })
  }
  var m = c(f, 2)
  {
    var y = P => {
      $u(P, {})
    }
    U(m, P => {
      zt.route === 'models' && P(y)
    })
  }
  var w = c(m, 2)
  {
    var O = P => {
      Vu(P, {})
    }
    U(w, P => {
      zt.route === 'apps' && P(O)
    })
  }
  var H = c(w, 2)
  {
    var x = P => {
      gf(P, {})
    }
    U(H, P => {
      zt.route === 'server' && P(x)
    })
  }
  var C = c(H, 2)
  {
    var R = P => {
      If(P, {})
    }
    U(C, P => {
      zt.route === 'tester' && P(R)
    })
  }
  var G = c(C, 2)
  {
    var z = P => {
      Gf(P, {})
    }
    U(G, P => {
      zt.route === 'settings' && P(z)
    })
  }
  var B = c(l, 2)
  pd(B, {})
  var W = c(B, 2)
  {
    var N = P => {
      md(P, {
        query: r,
        get onclose() {
          return Lo
        },
      })
    }
    U(W, P => {
      It.commandOpen && P(N)
    })
  }
  ;(p(e, n), me())
}
try {
  ho(Kf, { target: document.getElementById('app') })
} catch (e) {
  console.error('Runtime error during mount:', e)
  const t = document.getElementById('app'),
    r = e instanceof Error ? e.stack || e.message : String(e)
  t &&
    (t.innerHTML = `<pre style="color:#ff8a8a;background:#161616;padding:24px;margin:0;white-space:pre-wrap;font:13px ui-monospace,monospace;max-height:100vh;overflow:auto">MOUNT ERROR:

${r.replace(/[<>&]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[s])}</pre>`)
}
