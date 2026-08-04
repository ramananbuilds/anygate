var Ul = Object.defineProperty
var Qs = e => {
  throw TypeError(e)
}
var Bl = (e, t, r) =>
  t in e ? Ul(e, t, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (e[t] = r)
var st = (e, t, r) => Bl(e, typeof t != 'symbol' ? t + '' : t, r),
  as = (e, t, r) => t.has(e) || Qs('Cannot ' + r)
var S = (e, t, r) => (as(e, t, 'read from private field'), r ? r.call(e) : t.get(e)),
  fe = (e, t, r) =>
    t.has(e)
      ? Qs('Cannot add the same private member more than once')
      : t instanceof WeakSet
        ? t.add(e)
        : t.set(e, r),
  ce = (e, t, r, s) => (as(e, t, 'write to private field'), s ? s.call(e, r) : t.set(e, r), r),
  Ae = (e, t, r) => (as(e, t, 'access private method'), r)
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
const kn = !1
var Ls = Array.isArray,
  Hl = Array.prototype.indexOf,
  Ha = Array.prototype.includes,
  Qa = Array.from,
  Gl = Object.defineProperty,
  Fr = Object.getOwnPropertyDescriptor,
  Sn = Object.getOwnPropertyDescriptors,
  Wl = Object.prototype,
  Kl = Array.prototype,
  Os = Object.getPrototypeOf,
  en = Object.isExtensible
const Pn = () => {}
function Vl(e) {
  return e()
}
function fs(e) {
  for (var t = 0; t < e.length; t++) e[t]()
}
function En() {
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
  Mn = 1 << 24,
  Ct = 16,
  Pt = 32,
  Xt = 64,
  ps = 128,
  St = 512,
  Xe = 1024,
  Ze = 2048,
  It = 4096,
  lt = 8192,
  mt = 16384,
  Zr = 32768,
  hs = 1 << 25,
  Mr = 65536,
  Ga = 1 << 17,
  Yl = 1 << 18,
  Qr = 1 << 19,
  An = 1 << 20,
  Ft = 1 << 25,
  Ar = 65536,
  Wa = 1 << 21,
  Dr = 1 << 22,
  dr = 1 << 23,
  Yt = Symbol('$state'),
  Jl = Symbol('legacy props'),
  Xl = Symbol(''),
  Na = Symbol('attributes'),
  _s = Symbol('class'),
  gs = Symbol('style'),
  ia = Symbol('text'),
  Fa = Symbol('form reset'),
  Ea = new (class extends Error {
    constructor() {
      super(...arguments)
      st(this, 'name', 'StaleReactionError')
      st(this, 'message', 'The reaction that called `getAbortSignal()` was re-run or destroyed')
    }
  })()
var wn
const Zl =
  !!((wn = globalThis.document) != null && wn.contentType) &&
  globalThis.document.contentType.includes('xml')
function Ql(e) {
  throw new Error('https://svelte.dev/e/lifecycle_outside_component')
}
function ei() {
  throw new Error('https://svelte.dev/e/async_derived_orphan')
}
function ti(e, t, r) {
  throw new Error('https://svelte.dev/e/each_key_duplicate')
}
function ri(e) {
  throw new Error('https://svelte.dev/e/effect_in_teardown')
}
function ai() {
  throw new Error('https://svelte.dev/e/effect_in_unowned_derived')
}
function si(e) {
  throw new Error('https://svelte.dev/e/effect_orphan')
}
function ni() {
  throw new Error('https://svelte.dev/e/effect_update_depth_exceeded')
}
function li(e) {
  throw new Error('https://svelte.dev/e/props_invalid_value')
}
function ii() {
  throw new Error('https://svelte.dev/e/state_descriptors_fixed')
}
function oi() {
  throw new Error('https://svelte.dev/e/state_prototype_fixed')
}
function vi() {
  throw new Error('https://svelte.dev/e/state_unsafe_mutation')
}
function di() {
  throw new Error('https://svelte.dev/e/svelte_boundary_reset_onerror')
}
const ci = 1,
  ui = 2,
  zn = 4,
  fi = 8,
  pi = 16,
  hi = 1,
  _i = 2,
  gi = 4,
  mi = 8,
  yi = 16,
  wi = 1,
  bi = 2,
  Je = Symbol('uninitialized'),
  Tn = 'http://www.w3.org/1999/xhtml',
  xi = 'http://www.w3.org/2000/svg',
  ki = 'http://www.w3.org/1998/Math/MathML'
function Si() {
  console.warn('https://svelte.dev/e/derived_inert')
}
function Pi() {
  console.warn('https://svelte.dev/e/select_multiple_invalid_value')
}
function Ei() {
  console.warn('https://svelte.dev/e/svelte_boundary_reset_noop')
}
function Cn(e) {
  return e === this.v
}
function Mi(e, t) {
  return e != e ? t == t : e !== t || (e !== null && typeof e == 'object') || typeof e == 'function'
}
function $n(e) {
  return !Mi(e, this.v)
}
let ea = !1,
  Ai = !1
function zi() {
  ea = !0
}
let Re = null
function Vr(e) {
  Re = e
}
function me(e, t = !1, r) {
  Re = {
    p: Re,
    i: !1,
    c: null,
    e: null,
    s: e,
    x: null,
    r: ge,
    l: ea && !t ? { s: null, u: null, $: [] } : null,
  }
}
function ye(e) {
  var t = Re,
    r = t.e
  if (r !== null) {
    t.e = null
    for (var s of r) el(s)
  }
  return ((t.i = !0), (Re = t.p), {})
}
function Ma() {
  return !ea || (Re !== null && Re.l === null)
}
let fr = []
function In() {
  var e = fr
  ;((fr = []), fs(e))
}
function cr(e) {
  if (fr.length === 0 && !fa) {
    var t = fr
    queueMicrotask(() => {
      t === fr && In()
    })
  }
  fr.push(e)
}
function Ti() {
  for (; fr.length > 0;) In()
}
function Ln(e) {
  var t = ge
  if (t === null) return ((we.f |= dr), e)
  if ((t.f & Zr) === 0 && (t.f & Kr) === 0) throw e
  lr(e, t)
}
function lr(e, t) {
  if (!(t !== null && (t.f & mt) !== 0)) {
    for (; t !== null;) {
      if ((t.f & ps) !== 0) {
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
const Ci = -7169
function We(e, t) {
  e.f = (e.f & Ci) | t
}
function Rs(e) {
  ;(e.f & St) !== 0 || e.deps === null ? We(e, Xe) : We(e, It)
}
function On(e) {
  if (e !== null)
    for (const t of e) (t.f & tt) === 0 || (t.f & Ar) === 0 || ((t.f ^= Ar), On(t.deps))
}
function Rn(e, t, r) {
  ;((e.f & Ze) !== 0 ? t.add(e) : (e.f & It) !== 0 && r.add(e), On(e.deps), We(e, Xe))
}
let $a = !1
function $i(e) {
  var t = $a
  try {
    return (($a = !1), [e(), $a])
  } finally {
    $a = t
  }
}
let tn = !1
function Ii() {
  tn ||
    ((tn = !0),
    document.addEventListener(
      'reset',
      e => {
        Promise.resolve().then(() => {
          var t
          if (!e.defaultPrevented)
            for (const r of e.target.elements) (t = r[Fa]) == null || t.call(r)
        })
      },
      { capture: !0 }
    ))
}
function ta(e) {
  var t = we,
    r = ge
  ;(Et(null), qt(null))
  try {
    return e()
  } finally {
    ;(Et(t), qt(r))
  }
}
function Nn(e, t, r, s = r) {
  e.addEventListener(t, () => ta(r))
  const n = e[Fa]
  ;(n
    ? (e[Fa] = () => {
        ;(n(), s(!0))
      })
    : (e[Fa] = () => s(!0)),
    Ii())
}
function Li(e) {
  let t = 0,
    r = Tr(0),
    s
  return () => {
    qs() &&
      (a(r),
      Bs(
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
var Oi = Mr | Qr
function Ri(e, t, r, s) {
  new Ni(e, t, r, s)
}
var wt,
  Is,
  bt,
  gr,
  vt,
  xt,
  nt,
  ht,
  Gt,
  mr,
  sr,
  jr,
  wa,
  ba,
  Wt,
  Ja,
  Ue,
  Fi,
  Di,
  ji,
  ms,
  Da,
  ja,
  ys,
  ws
class Ni {
  constructor(t, r, s, n) {
    fe(this, Ue)
    st(this, 'parent')
    st(this, 'is_pending', !1)
    st(this, 'transform_error')
    fe(this, wt)
    fe(this, Is, null)
    fe(this, bt)
    fe(this, gr)
    fe(this, vt)
    fe(this, xt, null)
    fe(this, nt, null)
    fe(this, ht, null)
    fe(this, Gt, null)
    fe(this, mr, 0)
    fe(this, sr, 0)
    fe(this, jr, !1)
    fe(this, wa, new Set())
    fe(this, ba, new Set())
    fe(this, Wt, null)
    fe(
      this,
      Ja,
      Li(
        () => (
          ce(this, Wt, Tr(S(this, mr))),
          () => {
            ce(this, Wt, null)
          }
        )
      )
    )
    var l
    ;(ce(this, wt, t),
      ce(this, bt, r),
      ce(this, gr, i => {
        var o = ge
        ;((o.b = this), (o.f |= ps), s(i))
      }),
      (this.parent = ge.b),
      (this.transform_error =
        n ?? ((l = this.parent) == null ? void 0 : l.transform_error) ?? (i => i)),
      ce(
        this,
        vt,
        es(() => {
          Ae(this, Ue, ms).call(this)
        }, Oi)
      ))
  }
  defer_effect(t) {
    Rn(t, S(this, wa), S(this, ba))
  }
  is_rendered() {
    return !this.is_pending && (!this.parent || this.parent.is_rendered())
  }
  has_pending_snippet() {
    return !!S(this, bt).pending
  }
  update_pending_count(t, r) {
    ;(Ae(this, Ue, ys).call(this, t, r),
      ce(this, mr, S(this, mr) + t),
      !(!S(this, Wt) || S(this, jr)) &&
        (ce(this, jr, !0),
        cr(() => {
          ;(ce(this, jr, !1), S(this, Wt) && Jr(S(this, Wt), S(this, mr)))
        })))
  }
  get_effect_pending() {
    return (S(this, Ja).call(this), a(S(this, Wt)))
  }
  error(t) {
    if (!S(this, bt).onerror && !S(this, bt).failed) throw t
    se != null && se.is_fork
      ? (S(this, xt) && se.skip_effect(S(this, xt)),
        S(this, nt) && se.skip_effect(S(this, nt)),
        S(this, ht) && se.skip_effect(S(this, ht)),
        se.oncommit(() => {
          Ae(this, Ue, ws).call(this, t)
        }))
      : Ae(this, Ue, ws).call(this, t)
  }
}
;((wt = new WeakMap()),
  (Is = new WeakMap()),
  (bt = new WeakMap()),
  (gr = new WeakMap()),
  (vt = new WeakMap()),
  (xt = new WeakMap()),
  (nt = new WeakMap()),
  (ht = new WeakMap()),
  (Gt = new WeakMap()),
  (mr = new WeakMap()),
  (sr = new WeakMap()),
  (jr = new WeakMap()),
  (wa = new WeakMap()),
  (ba = new WeakMap()),
  (Wt = new WeakMap()),
  (Ja = new WeakMap()),
  (Ue = new WeakSet()),
  (Fi = function () {
    try {
      ce(
        this,
        xt,
        kt(() => S(this, gr).call(this, S(this, wt)))
      )
    } catch (t) {
      this.error(t)
    }
  }),
  (Di = function (t) {
    const r = S(this, bt).failed
    r &&
      ce(
        this,
        ht,
        kt(() => {
          r(
            S(this, wt),
            () => t,
            () => () => {}
          )
        })
      )
  }),
  (ji = function () {
    const t = S(this, bt).pending
    t &&
      ((this.is_pending = !0),
      ce(
        this,
        nt,
        kt(() => t(S(this, wt)))
      ),
      cr(() => {
        var r = ce(this, Gt, document.createDocumentFragment()),
          s = Jt()
        ;(r.append(s),
          ce(
            this,
            xt,
            Ae(this, Ue, ja).call(this, () => kt(() => S(this, gr).call(this, s)))
          ),
          S(this, sr) === 0 &&
            (S(this, wt).before(r),
            ce(this, Gt, null),
            kr(S(this, nt), () => {
              ce(this, nt, null)
            }),
            Ae(this, Ue, Da).call(this, se)))
      }))
  }),
  (ms = function () {
    try {
      if (
        ((this.is_pending = this.has_pending_snippet()),
        ce(this, sr, 0),
        ce(this, mr, 0),
        ce(
          this,
          xt,
          kt(() => {
            S(this, gr).call(this, S(this, wt))
          })
        ),
        S(this, sr) > 0)
      ) {
        var t = ce(this, Gt, document.createDocumentFragment())
        Gs(S(this, xt), t)
        const r = S(this, bt).pending
        ce(
          this,
          nt,
          kt(() => r(S(this, wt)))
        )
      } else Ae(this, Ue, Da).call(this, se)
    } catch (r) {
      this.error(r)
    }
  }),
  (Da = function (t) {
    ;((this.is_pending = !1), t.transfer_effects(S(this, wa), S(this, ba)))
  }),
  (ja = function (t) {
    var r = ge,
      s = we,
      n = Re
    ;(qt(S(this, vt)), Et(S(this, vt)), Vr(S(this, vt).ctx))
    try {
      return (zr.ensure(), t())
    } catch (l) {
      return (Ln(l), null)
    } finally {
      ;(qt(r), Et(s), Vr(n))
    }
  }),
  (ys = function (t, r) {
    var s
    if (!this.has_pending_snippet()) {
      this.parent && Ae((s = this.parent), Ue, ys).call(s, t, r)
      return
    }
    ;(ce(this, sr, S(this, sr) + t),
      S(this, sr) === 0 &&
        (Ae(this, Ue, Da).call(this, r),
        S(this, nt) &&
          kr(S(this, nt), () => {
            ce(this, nt, null)
          }),
        S(this, Gt) && (S(this, wt).before(S(this, Gt)), ce(this, Gt, null))))
  }),
  (ws = function (t) {
    ;(S(this, xt) && (ut(S(this, xt)), ce(this, xt, null)),
      S(this, nt) && (ut(S(this, nt)), ce(this, nt, null)),
      S(this, ht) && (ut(S(this, ht)), ce(this, ht, null)))
    var r = S(this, bt).onerror
    let s = S(this, bt).failed
    var n = !1,
      l = !1
    const i = () => {
        if (n) {
          Ei()
          return
        }
        ;((n = !0),
          l && di(),
          S(this, ht) !== null &&
            kr(S(this, ht), () => {
              ce(this, ht, null)
            }),
          Ae(this, Ue, ja).call(this, () => {
            Ae(this, Ue, ms).call(this)
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
            ht,
            Ae(this, Ue, ja).call(this, () => {
              try {
                return kt(() => {
                  var d = ge
                  ;((d.b = this),
                    (d.f |= ps),
                    s(
                      S(this, wt),
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
function qi(e, t, r, s) {
  const n = Ma() ? Yr : Ns
  var l = e.filter(g => !g.settled),
    i = t.map(n)
  if (r.length === 0 && l.length === 0) {
    s(i)
    return
  }
  var o = ge,
    v = Ui(),
    d = l.length === 1 ? l[0].promise : l.length > 1 ? Promise.all(l.map(g => g.promise)) : null
  function h(g) {
    if ((o.f & mt) === 0) {
      v()
      try {
        s([...i, ...g])
      } catch (m) {
        lr(m, o)
      }
      Ka()
    }
  }
  var _ = Fn()
  if (r.length === 0) {
    d.then(() => h([])).finally(_)
    return
  }
  function f() {
    Promise.all(r.map(g => Bi(g)))
      .then(h)
      .catch(g => lr(g, o))
      .finally(_)
  }
  d
    ? d.then(() => {
        ;(v(), f(), Ka())
      })
    : f()
}
function Ui() {
  var e = ge,
    t = we,
    r = Re,
    s = se
  return function (l = !0) {
    ;(qt(e),
      Et(t),
      Vr(r),
      l && (e.f & mt) === 0 && (s == null || s.activate(), s == null || s.apply()))
  }
}
function Ka(e = !0) {
  ;(qt(null), Et(null), Vr(null), e && (se == null || se.deactivate()))
}
function Fn() {
  var e = ge,
    t = e.b,
    r = se,
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
  var t = tt | Ze
  return (
    ge !== null && (ge.f |= Qr),
    {
      ctx: Re,
      deps: null,
      effects: null,
      equals: Cn,
      f: t,
      fn: e,
      reactions: null,
      rv: 0,
      v: Je,
      wv: 0,
      parent: ge,
      ac: null,
    }
  )
}
const oa = Symbol('obsolete')
function Bi(e, t, r) {
  let s = ge
  s === null && ei()
  var n = void 0,
    l = Tr(Je),
    i = !we,
    o = new Set()
  return (
    so(() => {
      var g, m
      var v = ge,
        d = En()
      n = d.promise
      try {
        Promise.resolve(e())
          .then(d.resolve, y => {
            y !== Ea && d.reject(y)
          })
          .finally(Ka)
      } catch (y) {
        ;(d.reject(y), Ka())
      }
      var h = se
      if (i) {
        if ((v.f & Zr) !== 0) var _ = Fn()
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
    Us(() => {
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
function J(e) {
  const t = Yr(e)
  return (il(t), t)
}
function Ns(e) {
  const t = Yr(e)
  return ((t.equals = $n), t)
}
function Hi(e) {
  var t = e.effects
  if (t !== null) {
    e.effects = null
    for (var r = 0; r < t.length; r += 1) ut(t[r])
  }
}
function Fs(e) {
  var t,
    r = ge,
    s = e.parent
  if (!Zt && s !== null && e.v !== Je && (s.f & (mt | lt)) !== 0) return (Si(), e.v)
  qt(s)
  try {
    ;((e.f &= ~Ar), Hi(e), (t = cl(e)))
  } finally {
    qt(r)
  }
  return t
}
function Dn(e) {
  var t = Fs(e)
  if (
    !e.equals(t) &&
    ((e.wv = vl()),
    (!(se != null && se.is_fork) || e.deps === null) &&
      (se !== null ? (se.capture(e, t, !0), ua == null || ua.capture(e, t, !0)) : (e.v = t),
      e.deps === null))
  ) {
    We(e, Xe)
    return
  }
  Zt || (rt !== null ? (qs() || (se != null && se.is_fork)) && rt.set(e, t) : Rs(e))
}
function Gi(e) {
  var t
  if (e.effects !== null)
    for (const r of e.effects)
      (r.teardown || r.ac) &&
        ((t = r.teardown) == null || t.call(r),
        r.ac !== null &&
          ta(() => {
            ;(r.ac.abort(Ea), (r.ac = null))
          }),
        r.fn !== null && (r.teardown = Pn),
        ma(r, 0),
        Hs(r))
}
function jn(e) {
  if (e.effects !== null) for (const t of e.effects) t.teardown && t.fn !== null && Xr(t)
}
let ss = null,
  Lr = null,
  se = null,
  ua = null,
  rt = null,
  bs = null,
  fa = !1,
  ns = !1,
  Rr = null,
  qa = null
var rn = 0
let Wi = 1
var qr, nr, yr, Ur, Br, Hr, Kt, Gr, dt, xa, Vt, At, Rt, Wr, wr, Te, xs, va, ks, qn, Un, Or, Ki, da
const Xa = class Xa {
  constructor() {
    fe(this, Te)
    st(this, 'id', Wi++)
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
    fe(this, Kt, new Map())
    fe(this, Gr, null)
    fe(this, dt, [])
    fe(this, xa, [])
    fe(this, Vt, new Set())
    fe(this, At, new Set())
    fe(this, Rt, new Map())
    fe(this, Wr, new Set())
    st(this, 'is_fork', !1)
    fe(this, wr, !1)
    ;(Lr === null ? (ss = Lr = this) : (ce(Lr, yr, this), ce(this, nr, Lr)), (Lr = this))
  }
  skip_effect(t) {
    ;(S(this, Rt).has(t) || S(this, Rt).set(t, { d: [], m: [] }), S(this, Wr).delete(t))
  }
  unskip_effect(t, r = s => this.schedule(s)) {
    var s = S(this, Rt).get(t)
    if (s) {
      S(this, Rt).delete(t)
      for (var n of s.d) (We(n, Ze), r(n))
      for (n of s.m) (We(n, It), r(n))
    }
    S(this, Wr).add(t)
  }
  capture(t, r, s = !1) {
    ;(t.v !== Je && !this.previous.has(t) && this.previous.set(t, t.v),
      (t.f & dr) === 0 && (this.current.set(t, [r, s]), rt == null || rt.set(t, r)),
      this.is_fork || (t.v = r))
  }
  activate() {
    se = this
  }
  deactivate() {
    ;((se = null), (rt = null))
  }
  flush() {
    try {
      ;((ns = !0), (se = this), Ae(this, Te, va).call(this))
    } finally {
      ;((rn = 0),
        (bs = null),
        (Rr = null),
        (qa = null),
        (ns = !1),
        (se = null),
        (rt = null),
        xr.clear())
    }
  }
  discard() {
    var t
    for (const r of S(this, Br)) r(this)
    S(this, Br).clear()
    for (const r of this.async_deriveds.values()) r.reject(oa)
    ;(Ae(this, Te, da).call(this), (t = S(this, Gr)) == null || t.resolve())
  }
  register_created_effect(t) {
    S(this, xa).push(t)
  }
  increment(t, r) {
    if ((ce(this, Hr, S(this, Hr) + 1), t)) {
      let s = S(this, Kt).get(r) ?? 0
      S(this, Kt).set(r, s + 1)
    }
  }
  decrement(t, r) {
    if ((ce(this, Hr, S(this, Hr) - 1), t)) {
      let s = S(this, Kt).get(r) ?? 0
      s === 1 ? S(this, Kt).delete(r) : S(this, Kt).set(r, s - 1)
    }
    S(this, wr) ||
      (ce(this, wr, !0),
      cr(() => {
        ;(ce(this, wr, !1), this.linked && this.flush())
      }))
  }
  transfer_effects(t, r) {
    for (const s of t) S(this, Vt).add(s)
    for (const s of r) S(this, At).add(s)
    ;(t.clear(), r.clear())
  }
  oncommit(t) {
    S(this, Ur).add(t)
  }
  ondiscard(t) {
    S(this, Br).add(t)
  }
  settled() {
    return (S(this, Gr) ?? ce(this, Gr, En())).promise
  }
  static ensure() {
    if (se === null) {
      const t = (se = new Xa())
      !ns &&
        !fa &&
        cr(() => {
          S(t, qr) || t.flush()
        })
    }
    return se
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
      ((bs = t),
      (n = t.b) != null && n.is_pending && (t.f & (Kr | Pa | Mn)) !== 0 && (t.f & Zr) === 0)
    ) {
      t.b.defer_effect(t)
      return
    }
    for (var r = t; r.parent !== null;) {
      r = r.parent
      var s = r.f
      if (Rr !== null && r === ge && (we === null || (we.f & tt) === 0)) return
      if ((s & (Xt | Pt)) !== 0) {
        if ((s & Xe) === 0) return
        r.f ^= Xe
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
  (Kt = new WeakMap()),
  (Gr = new WeakMap()),
  (dt = new WeakMap()),
  (xa = new WeakMap()),
  (Vt = new WeakMap()),
  (At = new WeakMap()),
  (Rt = new WeakMap()),
  (Wr = new WeakMap()),
  (wr = new WeakMap()),
  (Te = new WeakSet()),
  (xs = function () {
    if (this.is_fork) return !0
    for (const s of S(this, Kt).keys()) {
      for (var t = s, r = !1; t.parent !== null;) {
        if (S(this, Rt).has(t)) {
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
    ;(ce(this, qr, !0), rn++ > 1e3 && (Ae(this, Te, da).call(this), Yi()))
    for (const f of S(this, Vt)) (S(this, At).delete(f), We(f, Ze), this.schedule(f))
    for (const f of S(this, At)) (We(f, It), this.schedule(f))
    const t = S(this, dt)
    ;(ce(this, dt, []), this.apply())
    var r = (Rr = []),
      s = [],
      n = (qa = [])
    for (const f of t)
      try {
        Ae(this, Te, ks).call(this, f, r, s)
      } catch (g) {
        throw (Gn(f), Ae(this, Te, xs).call(this) || this.discard(), g)
      }
    if (((se = null), n.length > 0)) {
      var l = Xa.ensure()
      for (const f of n) l.schedule(f)
    }
    if (((Rr = null), (qa = null), Ae(this, Te, xs).call(this))) {
      ;(Ae(this, Te, Or).call(this, s), Ae(this, Te, Or).call(this, r))
      for (const [f, g] of S(this, Rt)) Hn(f, g)
      n.length > 0 && Ae((v = se), Te, va).call(v)
      return
    }
    const i = Ae(this, Te, qn).call(this)
    if (i) {
      ;(Ae(this, Te, Or).call(this, s),
        Ae(this, Te, Or).call(this, r),
        Ae((d = i), Te, Un).call(d, this))
      return
    }
    ;(S(this, Vt).clear(), S(this, At).clear())
    for (const f of S(this, Ur)) f(this)
    ;(S(this, Ur).clear(),
      (ua = this),
      an(s),
      an(r),
      (ua = null),
      (h = S(this, Gr)) == null || h.resolve())
    var o = se
    if (
      (S(this, Hr) === 0 && (S(this, dt).length === 0 || o !== null) && Ae(this, Te, da).call(this),
      S(this, dt).length > 0)
    )
      if (o !== null) {
        const f = o
        S(f, dt).push(...S(this, dt).filter(g => !S(f, dt).includes(g)))
      } else o = this
    o !== null && Ae((_ = o), Te, va).call(_)
  }),
  (ks = function (t, r, s) {
    t.f ^= Xe
    for (var n = t.first; n !== null;) {
      var l = n.f,
        i = (l & (Pt | Xt)) !== 0,
        o = i && (l & Xe) !== 0,
        v = o || (l & lt) !== 0 || S(this, Rt).has(n)
      if (!v && n.fn !== null) {
        i
          ? (n.f ^= Xe)
          : (l & Kr) !== 0
            ? r.push(n)
            : za(n) && ((l & Ct) !== 0 && S(this, At).add(n), Xr(n))
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
  (qn = function () {
    for (var t = S(this, nr); t !== null;) {
      if (!t.is_fork) {
        for (const [r, [, s]] of this.current) if (t.current.has(r) && !s) return t
      }
      t = S(t, nr)
    }
    return null
  }),
  (Un = function (t) {
    var s
    for (const [n, l] of t.current)
      (!this.previous.has(n) && t.previous.has(n) && this.previous.set(n, t.previous.get(n)),
        this.current.set(n, l))
    for (const [n, l] of t.async_deriveds) {
      const i = this.async_deriveds.get(n)
      i && l.promise.then(i.resolve).catch(i.reject)
    }
    ;(t.async_deriveds.clear(), this.transfer_effects(S(t, Vt), S(t, At)))
    const r = n => {
      var l = n.reactions
      if (l !== null && !((n.f & tt) !== 0 && (n.f & (Ze | It)) === 0))
        for (const v of l) {
          var i = v.f
          if ((i & tt) !== 0) r(v)
          else {
            var o = v
            i & (Dr | Ct) &&
              !this.async_deriveds.has(o) &&
              (S(this, At).delete(o), We(o, Ze), this.schedule(o))
          }
        }
    }
    for (const n of this.current.keys()) r(n)
    ;(this.oncommit(() => t.discard()),
      Ae((s = t), Te, da).call(s),
      (se = this),
      Ae(this, Te, va).call(this))
  }),
  (Or = function (t) {
    for (var r = 0; r < t.length; r += 1) Rn(t[r], S(this, Vt), S(this, At))
  }),
  (Ki = function () {
    var _
    for (let f = ss; f !== null; f = S(f, yr)) {
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
                ;(m.f & (Ct | Dr)) !== 0 ? f.schedule(m) : Ae((y = f), Te, Or).call(y, [m])
              })
          f.activate()
          var i = new Set(),
            o = new Map()
          for (var v of r) Bn(v, l, i, o)
          o = new Map()
          var d = [...f.current]
            .filter(([g, m]) => {
              const y = this.current.get(g)
              return y ? y[0] !== m[0] || y[1] !== m[1] : !0
            })
            .map(([g]) => g)
          if (d.length > 0)
            for (const g of S(this, xa))
              (g.f & (mt | lt | Ga)) === 0 &&
                Ds(g, d, o) &&
                ((g.f & (Dr | Ct)) !== 0 ? (We(g, Ze), f.schedule(g)) : S(f, Vt).add(g))
          if (S(f, dt).length > 0 && !S(f, wr)) {
            f.apply()
            for (var h of S(f, dt)) Ae((_ = f), Te, ks).call(_, h, [], [])
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
      ;(t === null ? (ss = r) : ce(t, yr, r),
        r === null ? (Lr = t) : ce(r, nr, t),
        (this.linked = !1))
    }
  }))
let zr = Xa
function Vi(e) {
  var t = fa
  fa = !0
  try {
    for (var r; ;) {
      if ((Ti(), se === null)) return r
      se.flush()
    }
  } finally {
    fa = t
  }
}
function Yi() {
  try {
    ni()
  } catch (e) {
    lr(e, bs)
  }
}
let Mt = null
function an(e) {
  var t = e.length
  if (t !== 0) {
    for (var r = 0; r < t;) {
      var s = e[r++]
      if (
        (s.f & (mt | lt)) === 0 &&
        za(s) &&
        ((Mt = new Set()),
        Xr(s),
        s.deps === null &&
          s.first === null &&
          s.nodes === null &&
          s.teardown === null &&
          s.ac === null &&
          sl(s),
        (Mt == null ? void 0 : Mt.size) > 0)
      ) {
        xr.clear()
        for (const n of Mt) {
          if ((n.f & (mt | lt)) !== 0) continue
          const l = [n]
          let i = n.parent
          for (; i !== null;) (Mt.has(i) && (Mt.delete(i), l.push(i)), (i = i.parent))
          for (let o = l.length - 1; o >= 0; o--) {
            const v = l[o]
            ;(v.f & (mt | lt)) === 0 && Xr(v)
          }
        }
        Mt.clear()
      }
    }
    Mt = null
  }
}
function Bn(e, t, r, s) {
  if (!r.has(e) && (r.add(e), e.reactions !== null))
    for (const n of e.reactions) {
      const l = n.f
      ;(l & tt) !== 0
        ? Bn(n, t, r, s)
        : (l & (Dr | Ct)) !== 0 && (l & Ze) === 0 && Ds(n, t, s) && (We(n, Ze), js(n))
    }
}
function Ds(e, t, r) {
  const s = r.get(e)
  if (s !== void 0) return s
  if (e.deps !== null)
    for (const n of e.deps) {
      if (Ha.call(t, n)) return !0
      if ((n.f & tt) !== 0 && Ds(n, t, r)) return (r.set(n, !0), !0)
    }
  return (r.set(e, !1), !1)
}
function js(e) {
  se.schedule(e)
}
function Hn(e, t) {
  if (!((e.f & Pt) !== 0 && (e.f & Xe) !== 0)) {
    ;((e.f & Ze) !== 0 ? t.d.push(e) : (e.f & It) !== 0 && t.m.push(e), We(e, Xe))
    for (var r = e.first; r !== null;) (Hn(r, t), (r = r.next))
  }
}
function Gn(e) {
  We(e, Xe)
  for (var t = e.first; t !== null;) (Gn(t), (t = t.next))
}
let Va = new Set()
const xr = new Map()
let Wn = !1
function Tr(e, t) {
  var r = { f: 0, v: e, reactions: null, equals: Cn, rv: 0, wv: 0 }
  return r
}
function re(e, t) {
  const r = Tr(e)
  return (il(r), r)
}
function Ji(e, t = !1, r = !0) {
  var n
  const s = Tr(e)
  return (
    t || (s.equals = $n),
    ea && r && Re !== null && Re.l !== null && ((n = Re.l).s ?? (n.s = [])).push(s),
    s
  )
}
function $(e, t, r = !1) {
  we !== null &&
    (!$t || (we.f & Ga) !== 0) &&
    Ma() &&
    (we.f & (tt | Ct | Dr | Ga)) !== 0 &&
    (jt === null || !jt.has(e)) &&
    vi()
  let s = r ? Ke(t) : t
  return Jr(e, s, qa)
}
function Jr(e, t, r = null) {
  if (!e.equals(t)) {
    xr.set(e, Zt ? t : e.v)
    var s = zr.ensure()
    if ((s.capture(e, t), (e.f & tt) !== 0)) {
      const n = e
      ;((e.f & Ze) !== 0 && Fs(n), rt === null && Rs(n))
    }
    ;((e.wv = vl()),
      Kn(e, Ze, r),
      Ma() &&
        ge !== null &&
        (ge.f & Xe) !== 0 &&
        (ge.f & (Pt | Xt)) === 0 &&
        (yt === null ? lo([e]) : yt.push(e)),
      !s.is_fork && Va.size > 0 && !Wn && Xi())
  }
  return t
}
function Xi() {
  Wn = !1
  for (const e of Va) {
    ;(e.f & Xe) !== 0 && We(e, It)
    let t
    try {
      t = za(e)
    } catch {
      t = !0
    }
    t && Xr(e)
  }
  Va.clear()
}
function pa(e) {
  $(e, e.v + 1)
}
function Kn(e, t, r) {
  var s = e.reactions
  if (s !== null)
    for (var n = Ma(), l = s.length, i = 0; i < l; i++) {
      var o = s[i],
        v = o.f
      if (!(!n && o === ge)) {
        var d = (v & Ze) === 0
        if ((d && We(o, t), (v & Ga) !== 0)) Va.add(o)
        else if ((v & tt) !== 0) {
          var h = o
          ;(rt == null || rt.delete(h),
            (v & Ar) === 0 &&
              (v & St && (ge === null || (ge.f & Wa) === 0) && (o.f |= Ar), Kn(h, It, r)))
        } else if (d) {
          var _ = o
          ;((v & Ct) !== 0 && Mt !== null && Mt.add(_), r !== null ? r.push(_) : js(_))
        }
      }
    }
}
function Ke(e) {
  if (typeof e != 'object' || e === null || Yt in e) return e
  const t = Os(e)
  if (t !== Wl && t !== Kl) return e
  var r = new Map(),
    s = Ls(e),
    n = re(0),
    l = Sr,
    i = o => {
      if (Sr === l) return o()
      var v = we,
        d = Sr
      ;(Et(null), ln(l))
      var h = o()
      return (Et(v), ln(d), h)
    }
  return (
    s && r.set('length', re(e.length)),
    new Proxy(e, {
      defineProperty(o, v, d) {
        ;(!('value' in d) || d.configurable === !1 || d.enumerable === !1 || d.writable === !1) &&
          ii()
        var h = r.get(v)
        return (
          h === void 0
            ? i(() => {
                var _ = re(d.value)
                return (r.set(v, _), _)
              })
            : $(h, d.value, !0),
          !0
        )
      },
      deleteProperty(o, v) {
        var d = r.get(v)
        if (d === void 0) {
          if (v in o) {
            const h = i(() => re(Je))
            ;(r.set(v, h), pa(n))
          }
        } else ($(d, Je), pa(n))
        return !0
      },
      get(o, v, d) {
        var g
        if (v === Yt) return e
        var h = r.get(v),
          _ = v in o
        if (
          (h === void 0 &&
            (!_ || ((g = Fr(o, v)) != null && g.writable)) &&
            ((h = i(() => {
              var m = Ke(_ ? o[v] : Je),
                y = re(m)
              return y
            })),
            r.set(v, h)),
          h !== void 0)
        ) {
          var f = a(h)
          return f === Je ? void 0 : f
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
          if (_ !== void 0 && f !== Je)
            return { enumerable: !0, configurable: !0, value: f, writable: !0 }
        }
        return d
      },
      has(o, v) {
        var f
        if (v === Yt) return !0
        var d = r.get(v),
          h = (d !== void 0 && d.v !== Je) || Reflect.has(o, v)
        if (d !== void 0 || (ge !== null && (!h || ((f = Fr(o, v)) != null && f.writable)))) {
          d === void 0 &&
            ((d = i(() => {
              var g = h ? Ke(o[v]) : Je,
                m = re(g)
              return m
            })),
            r.set(v, d))
          var _ = a(d)
          if (_ === Je) return !1
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
            m !== void 0 ? $(m, Je) : g in o && ((m = i(() => re(Je))), r.set(g + '', m))
          }
        if (_ === void 0)
          (!f || ((x = Fr(o, v)) != null && x.writable)) &&
            ((_ = i(() => re(void 0))), $(_, Ke(d)), r.set(v, _))
        else {
          f = _.v !== Je
          var y = i(() => Ke(d))
          $(_, y)
        }
        var w = Reflect.getOwnPropertyDescriptor(o, v)
        if ((w != null && w.set && w.set.call(h, d), !f)) {
          if (s && typeof v == 'string') {
            var O = r.get('length'),
              B = Number(v)
            Number.isInteger(B) && B >= O.v && $(O, B + 1)
          }
          pa(n)
        }
        return !0
      },
      ownKeys(o) {
        a(n)
        var v = Reflect.ownKeys(o).filter(_ => {
          var f = r.get(_)
          return f === void 0 || f.v !== Je
        })
        for (var [d, h] of r) h.v !== Je && !(d in o) && v.push(d)
        return v
      },
      setPrototypeOf() {
        oi()
      },
    })
  )
}
function sn(e) {
  try {
    if (e !== null && typeof e == 'object' && Yt in e) return e[Yt]
  } catch {}
  return e
}
function Zi(e, t) {
  return Object.is(sn(e), sn(t))
}
var Ss, Vn, Yn, Jn
function Qi() {
  if (Ss === void 0) {
    ;((Ss = window), (Vn = /Firefox/.test(navigator.userAgent)))
    var e = Element.prototype,
      t = Node.prototype,
      r = Text.prototype
    ;((Yn = Fr(t, 'firstChild').get),
      (Jn = Fr(t, 'nextSibling').get),
      en(e) && ((e[_s] = void 0), (e[Na] = null), (e[gs] = void 0), (e.__e = void 0)),
      en(r) && (r[ia] = void 0))
  }
}
function Jt(e = '') {
  return document.createTextNode(e)
}
function Dt(e) {
  return Yn.call(e)
}
function Aa(e) {
  return Jn.call(e)
}
function u(e, t) {
  return Dt(e)
}
function ee(e, t = !1) {
  {
    var r = Dt(e)
    return r instanceof Comment && r.data === '' ? Aa(r) : r
  }
}
function c(e, t = 1, r = !1) {
  let s = e
  for (; t--;) s = Aa(s)
  return s
}
function eo(e) {
  e.textContent = ''
}
function Xn() {
  return !1
}
function Zn(e, t, r) {
  return t == null || t === Tn
    ? r
      ? document.createElement(e, { is: r })
      : document.createElement(e)
    : r
      ? document.createElementNS(t, e, { is: r })
      : document.createElementNS(t, e)
}
function Qn(e) {
  ;(ge === null && (we === null && si(), ai()), Zt && ri())
}
function to(e, t) {
  var r = t.last
  r === null ? (t.last = t.first = e) : ((r.next = e), (e.prev = r), (t.last = e))
}
function Ut(e, t) {
  var r = ge
  r !== null && (r.f & lt) !== 0 && (e |= lt)
  var s = {
    ctx: Re,
    deps: null,
    nodes: null,
    f: e | Ze | St,
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
  se == null || se.register_created_effect(s)
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
      ((n = n.first), (e & Ct) !== 0 && (e & Mr) !== 0 && n !== null && (n.f |= Mr))
  }
  if (
    n !== null &&
    ((n.parent = r), r !== null && to(n, r), we !== null && (we.f & tt) !== 0 && (e & Xt) === 0)
  ) {
    var l = we
    ;(l.effects ?? (l.effects = [])).push(n)
  }
  return s
}
function qs() {
  return we !== null && !$t
}
function Us(e) {
  const t = Ut(Pa, null)
  return (We(t, Xe), (t.teardown = e), t)
}
function Ot(e) {
  Qn()
  var t = ge.f,
    r = !we && (t & Pt) !== 0 && Re !== null && !Re.i
  if (r) {
    var s = Re
    ;(s.e ?? (s.e = [])).push(e)
  } else return el(e)
}
function el(e) {
  return Ut(Kr | An, e)
}
function ro(e) {
  return (Qn(), Ut(Pa | An, e))
}
function ao(e) {
  zr.ensure()
  const t = Ut(Xt | Qr, e)
  return (r = {}) =>
    new Promise(s => {
      r.outro
        ? kr(t, () => {
            ;(ut(t), s(void 0))
          })
        : (ut(t), s(void 0))
    })
}
function tl(e) {
  return Ut(Kr, e)
}
function so(e) {
  return Ut(Dr | Qr, e)
}
function Bs(e, t = 0) {
  return Ut(Pa | t, e)
}
function I(e, t = [], r = [], s = []) {
  qi(s, t, r, n => {
    Ut(Pa, () => {
      e(...n.map(a))
    })
  })
}
function es(e, t = 0) {
  var r = Ut(Ct | t, e)
  return r
}
function kt(e) {
  return Ut(Pt | Qr, e)
}
function rl(e) {
  var t = e.teardown
  if (t !== null) {
    const r = Zt,
      s = we
    ;(nn(!0), Et(null))
    try {
      t.call(null)
    } finally {
      ;(nn(r), Et(s))
    }
  }
}
function Hs(e, t = !1) {
  var r = e.first
  for (e.first = e.last = null; r !== null;) {
    const n = r.ac
    n !== null &&
      ta(() => {
        n.abort(Ea)
      })
    var s = r.next
    ;((r.f & Xt) !== 0 ? (r.parent = null) : ut(r, t), (r = s))
  }
}
function no(e) {
  for (var t = e.first; t !== null;) {
    var r = t.next
    ;((t.f & Pt) === 0 && ut(t), (t = r))
  }
}
function ut(e, t = !0) {
  var r = !1
  ;((t || (e.f & Yl) !== 0) &&
    e.nodes !== null &&
    e.nodes.end !== null &&
    (al(e.nodes.start, e.nodes.end), (r = !0)),
    (e.f |= hs),
    Hs(e, t && !r),
    ma(e, 0))
  var s = e.nodes && e.nodes.t
  if (s !== null) for (const l of s) l.stop()
  ;(rl(e), (e.f ^= hs), (e.f |= mt))
  var n = e.parent
  ;(n !== null && n.first !== null && sl(e),
    (e.next = e.prev = e.teardown = e.ctx = e.deps = e.fn = e.nodes = e.ac = e.b = null))
}
function al(e, t) {
  for (; e !== null;) {
    var r = e === t ? null : Aa(e)
    ;(e.remove(), (e = r))
  }
}
function sl(e) {
  var t = e.parent,
    r = e.prev,
    s = e.next
  ;(r !== null && (r.next = s),
    s !== null && (s.prev = r),
    t !== null && (t.first === e && (t.first = s), t.last === e && (t.last = r)))
}
function kr(e, t, r = !0) {
  var s = []
  nl(e, s, !0)
  var n = () => {
      ;(r && ut(e), t && t())
    },
    l = s.length
  if (l > 0) {
    var i = () => --l || n()
    for (var o of s) o.out(i)
  } else n()
}
function nl(e, t, r) {
  if ((e.f & lt) === 0) {
    e.f ^= lt
    var s = e.nodes && e.nodes.t
    if (s !== null) for (const o of s) (o.is_global || r) && t.push(o)
    for (var n = e.first; n !== null;) {
      var l = n.next
      if ((n.f & Xt) === 0) {
        var i = (n.f & Mr) !== 0 || ((n.f & Pt) !== 0 && (e.f & Ct) !== 0)
        nl(n, t, i ? r : !1)
      }
      n = l
    }
  }
}
function Ya(e) {
  ll(e, !0)
}
function ll(e, t) {
  if ((e.f & lt) !== 0) {
    ;((e.f ^= lt), (e.f & Xe) === 0 && (We(e, Ze), zr.ensure().schedule(e)))
    for (var r = e.first; r !== null;) {
      var s = r.next,
        n = (r.f & Mr) !== 0 || (r.f & Pt) !== 0
      ;(ll(r, n ? t : !1), (r = s))
    }
    var l = e.nodes && e.nodes.t
    if (l !== null) for (const i of l) (i.is_global || t) && i.in()
  }
}
function Gs(e, t) {
  if (e.nodes)
    for (var r = e.nodes.start, s = e.nodes.end; r !== null;) {
      var n = r === s ? null : Aa(r)
      ;(t.append(r), (r = n))
    }
}
let Ua = !1,
  Zt = !1
function nn(e) {
  Zt = e
}
let we = null,
  $t = !1
function Et(e) {
  we = e
}
let ge = null
function qt(e) {
  ge = e
}
let jt = null
function il(e) {
  we !== null && (jt ?? (jt = new Set())).add(e)
}
let ct = null,
  pt = 0,
  yt = null
function lo(e) {
  yt = e
}
let ol = 1,
  pr = 0,
  Sr = pr
function ln(e) {
  Sr = e
}
function vl() {
  return ++ol
}
function za(e) {
  var t = e.f
  if ((t & Ze) !== 0) return !0
  if ((t & tt && (e.f &= ~Ar), (t & It) !== 0)) {
    for (var r = e.deps, s = r.length, n = 0; n < s; n++) {
      var l = r[n]
      if ((za(l) && Dn(l), l.wv > e.wv)) return !0
    }
    ;(t & St) !== 0 && rt === null && We(e, Xe)
  }
  return !1
}
function dl(e, t, r = !0) {
  var s = e.reactions
  if (s !== null && !(jt !== null && jt.has(e)))
    for (var n = 0; n < s.length; n++) {
      var l = s[n]
      ;(l.f & tt) !== 0
        ? dl(l, t, !1)
        : t === l && (r ? We(l, Ze) : (l.f & Xe) !== 0 && We(l, It), js(l))
    }
}
function cl(e) {
  var y
  var t = ct,
    r = pt,
    s = yt,
    n = we,
    l = jt,
    i = Re,
    o = $t,
    v = Sr,
    d = e.f
  ;((ct = null),
    (pt = 0),
    (yt = null),
    (we = (d & (Pt | Xt)) === 0 ? e : null),
    (jt = null),
    Vr(e.ctx),
    ($t = !1),
    (Sr = ++pr),
    e.ac !== null &&
      (ta(() => {
        e.ac.abort(Ea)
      }),
      (e.ac = null)))
  try {
    e.f |= Wa
    var h = e.fn,
      _ = h()
    e.f |= Zr
    var f = e.deps,
      g = se == null ? void 0 : se.is_fork
    if (ct !== null) {
      var m
      if ((g || ma(e, pt), f !== null && pt > 0))
        for (f.length = pt + ct.length, m = 0; m < ct.length; m++) f[pt + m] = ct[m]
      else e.deps = f = ct
      if (qs() && (e.f & St) !== 0)
        for (m = pt; m < f.length; m++) ((y = f[m]).reactions ?? (y.reactions = [])).push(e)
    } else !g && f !== null && pt < f.length && (ma(e, pt), (f.length = pt))
    if (Ma() && yt !== null && !$t && f !== null && (e.f & (tt | It | Ze)) === 0)
      for (m = 0; m < yt.length; m++) dl(yt[m], e)
    if (n !== null && n !== e) {
      if ((pr++, n.deps !== null)) for (let w = 0; w < r; w += 1) n.deps[w].rv = pr
      if (t !== null) for (const w of t) w.rv = pr
      yt !== null && (s === null ? (s = yt) : s.push(...yt))
    }
    return ((e.f & dr) !== 0 && (e.f ^= dr), _)
  } catch (w) {
    return Ln(w)
  } finally {
    ;((e.f ^= Wa), (ct = t), (pt = r), (yt = s), (we = n), (jt = l), Vr(i), ($t = o), (Sr = v))
  }
}
function io(e, t) {
  let r = t.reactions
  if (r !== null) {
    var s = Hl.call(r, e)
    if (s !== -1) {
      var n = r.length - 1
      n === 0 ? (r = t.reactions = null) : ((r[s] = r[n]), r.pop())
    }
  }
  if (r === null && (t.f & tt) !== 0 && (ct === null || !Ha.call(ct, t))) {
    var l = t
    ;((l.f & St) !== 0 && ((l.f ^= St), (l.f &= ~Ar)),
      l.v !== Je && Rs(l),
      l.ac !== null &&
        ta(() => {
          ;(l.ac.abort(Ea), (l.ac = null))
        }),
      Gi(l),
      ma(l, 0))
  }
}
function ma(e, t) {
  var r = e.deps
  if (r !== null) for (var s = t; s < r.length; s++) io(e, r[s])
}
function Xr(e) {
  var t = e.f
  if ((t & mt) === 0) {
    We(e, Xe)
    var r = ge,
      s = Ua
    ;((ge = e), (Ua = (t & (Pt | Xt)) === 0))
    try {
      ;((t & (Ct | Mn)) !== 0 ? no(e) : Hs(e), rl(e))
      var n = cl(e)
      ;((e.teardown = typeof n == 'function' ? n : null), (e.wv = ol))
      var l
      kn && Ai && (e.f & Ze) !== 0 && e.deps
    } finally {
      ;((Ua = s), (ge = r))
    }
  }
}
async function oo() {
  ;(await Promise.resolve(), Vi())
}
function a(e) {
  var t = e.f,
    r = (t & tt) !== 0
  if (we !== null && !$t) {
    var s = ge !== null && (ge.f & mt) !== 0
    if (!s && (jt === null || !jt.has(e))) {
      var n = we.deps
      if ((we.f & Wa) !== 0)
        e.rv < pr &&
          ((e.rv = pr),
          ct === null && n !== null && n[pt] === e ? pt++ : ct === null ? (ct = [e]) : ct.push(e))
      else {
        ;(we.deps ?? (we.deps = []), Ha.call(we.deps, e) || we.deps.push(e))
        var l = e.reactions
        l === null ? (e.reactions = [we]) : Ha.call(l, we) || l.push(we)
      }
    }
  }
  if (Zt && xr.has(e)) return xr.get(e)
  if (r) {
    var i = e
    if (Zt) {
      var o = i.v
      return ((((i.f & Xe) === 0 && i.reactions !== null) || fl(i)) && (o = Fs(i)), xr.set(i, o), o)
    }
    var v = (i.f & St) === 0 && !$t && we !== null && (Ua || (we.f & St) !== 0),
      d = (i.f & Zr) === 0
    ;(za(i) && (v && (i.f |= St), Dn(i)), v && !d && (jn(i), ul(i)))
  }
  if (rt != null && rt.has(e)) return rt.get(e)
  if ((e.f & dr) !== 0) throw e.v
  return e.v
}
function ul(e) {
  if (((e.f |= St), e.deps !== null))
    for (const t of e.deps)
      ((t.reactions ?? (t.reactions = [])).push(e),
        (t.f & tt) !== 0 && (t.f & St) === 0 && (jn(t), ul(t)))
}
function fl(e) {
  if (e.v === Je) return !0
  if (e.deps === null) return !1
  for (const t of e.deps) if (xr.has(t) || ((t.f & tt) !== 0 && fl(t))) return !0
  return !1
}
function ra(e) {
  var t = $t
  try {
    return (($t = !0), e())
  } finally {
    $t = t
  }
}
function vo(e) {
  if (!(typeof e != 'object' || !e || e instanceof EventTarget)) {
    if (Yt in e) Ps(e)
    else if (!Array.isArray(e))
      for (let t in e) {
        const r = e[t]
        typeof r == 'object' && r && Yt in r && Ps(r)
      }
  }
}
function Ps(e, t = new Set()) {
  if (typeof e == 'object' && e !== null && !(e instanceof EventTarget) && !t.has(e)) {
    ;(t.add(e), e instanceof Date && e.getTime())
    for (let s in e)
      try {
        Ps(e[s], t)
      } catch {}
    const r = Os(e)
    if (
      r !== Object.prototype &&
      r !== Array.prototype &&
      r !== Map.prototype &&
      r !== Set.prototype &&
      r !== Date.prototype
    ) {
      const s = Sn(r)
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
const co = ['touchstart', 'touchmove']
function uo(e) {
  return co.includes(e)
}
const hr = Symbol('events'),
  pl = new Set(),
  Es = new Set()
function fo(e, t, r, s = {}) {
  function n(l) {
    if ((s.capture || Ms.call(t, l), !l.cancelBubble))
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
function Ba(e, t, r, s, n) {
  var l = { capture: s, passive: n },
    i = fo(e, t, r, l)
  ;(t === document.body || t === window || t === document || t instanceof HTMLMediaElement) &&
    Us(() => {
      t.removeEventListener(e, i, l)
    })
}
function ne(e, t, r) {
  ;(t[hr] ?? (t[hr] = {}))[e] = r
}
function Ve(e) {
  for (var t = 0; t < e.length; t++) pl.add(e[t])
  for (var r of Es) r(e)
}
let on = null
function Ms(e) {
  var y, w
  var t = this,
    r = t.ownerDocument,
    s = e.type,
    n = ((y = e.composedPath) == null ? void 0 : y.call(e)) || [],
    l = n[0] || e.target
  on = e
  var i = 0,
    o = on === e && e[hr]
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
    Gl(e, 'currentTarget', {
      configurable: !0,
      get() {
        return l || r
      },
    })
    var h = we,
      _ = ge
    ;(Et(null), qt(null))
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
      ;((e[hr] = t), delete e.currentTarget, Et(h), qt(_))
    }
  }
}
var bn
const ls =
  ((bn = globalThis == null ? void 0 : globalThis.window) == null ? void 0 : bn.trustedTypes) &&
  globalThis.window.trustedTypes.createPolicy('svelte-trusted-html', { createHTML: e => e })
function po(e) {
  return (ls == null ? void 0 : ls.createHTML(e)) ?? e
}
function hl(e) {
  var t = Zn('template')
  return ((t.innerHTML = po(e.replaceAll('<!>', '<!---->'))), t.content)
}
function Cr(e, t) {
  var r = ge
  r.nodes === null && (r.nodes = { start: e, end: t, a: null, t: null })
}
function b(e, t) {
  var r = (t & wi) !== 0,
    s = (t & bi) !== 0,
    n,
    l = !e.startsWith('<!>')
  return () => {
    n === void 0 && ((n = hl(l ? e : '<!>' + e)), r || (n = Dt(n)))
    var i = s || Vn ? document.importNode(n, !0) : n.cloneNode(!0)
    if (r) {
      var o = Dt(i),
        v = i.lastChild
      Cr(o, v)
    } else Cr(i, i)
    return i
  }
}
function ho(e, t, r = 'svg') {
  var s = !e.startsWith('<!>'),
    n = `<${r}>${s ? e : '<!>' + e}</${r}>`,
    l
  return () => {
    if (!l) {
      var i = hl(n),
        o = Dt(i)
      l = Dt(o)
    }
    var v = l.cloneNode(!0)
    return (Cr(v, v), v)
  }
}
function Ws(e, t) {
  return ho(e, t, 'svg')
}
function Q(e = '') {
  {
    var t = Jt(e + '')
    return (Cr(t, t), t)
  }
}
function it() {
  var e = document.createDocumentFragment(),
    t = document.createComment(''),
    r = Jt()
  return (e.append(t, r), Cr(t, r), e)
}
function p(e, t) {
  e !== null && e.before(t)
}
function M(e, t) {
  var r = t == null ? '' : typeof t == 'object' ? `${t}` : t
  r !== (e[ia] ?? (e[ia] = e.nodeValue)) && ((e[ia] = r), (e.nodeValue = `${r}`))
}
function _o(e, t) {
  return go(e, t)
}
const Ia = new Map()
function go(
  e,
  { target: t, anchor: r, props: s = {}, events: n, context: l, intro: i = !0, transformError: o }
) {
  Qi()
  var v = void 0,
    d = ao(() => {
      var h = r ?? t.appendChild(Jt())
      Ri(
        h,
        { pending: () => {} },
        g => {
          me({})
          var m = Re
          ;(l && (m.c = l), n && (s.$$events = n), (v = e(g, s) || {}), ye())
        },
        o
      )
      var _ = new Set(),
        f = g => {
          for (var m = 0; m < g.length; m++) {
            var y = g[m]
            if (!_.has(y)) {
              _.add(y)
              var w = uo(y)
              for (const x of [t, document]) {
                var O = Ia.get(x)
                O === void 0 && ((O = new Map()), Ia.set(x, O))
                var B = O.get(y)
                B === void 0
                  ? (x.addEventListener(y, Ms, { passive: w }), O.set(y, 1))
                  : O.set(y, B + 1)
              }
            }
          }
        }
      return (
        f(Qa(pl)),
        Es.add(f),
        () => {
          var w
          for (var g of _)
            for (const O of [t, document]) {
              var m = Ia.get(O),
                y = m.get(g)
              --y == 0
                ? (O.removeEventListener(g, Ms), m.delete(g), m.size === 0 && Ia.delete(O))
                : m.set(g, y)
            }
          ;(Es.delete(f), h !== r && ((w = h.parentNode) == null || w.removeChild(h)))
        }
      )
    })
  return (mo.set(v, d), v)
}
let mo = new WeakMap()
var zt, Nt, _t, br, ka, Sa, Za
class _l {
  constructor(t, r = !0) {
    st(this, 'anchor')
    fe(this, zt, new Map())
    fe(this, Nt, new Map())
    fe(this, _t, new Map())
    fe(this, br, new Set())
    fe(this, ka, !0)
    fe(this, Sa, t => {
      if (S(this, zt).has(t)) {
        var r = S(this, zt).get(t),
          s = S(this, Nt).get(r)
        if (s) (Ya(s), S(this, br).delete(r))
        else {
          var n = S(this, _t).get(r)
          n &&
            (Ya(n.effect),
            S(this, Nt).set(r, n.effect),
            S(this, _t).delete(r),
            n.fragment.lastChild.remove(),
            this.anchor.before(n.fragment),
            (s = n.effect))
        }
        for (const [l, i] of S(this, zt)) {
          if ((S(this, zt).delete(l), l === t)) break
          const o = S(this, _t).get(i)
          o && (ut(o.effect), S(this, _t).delete(i))
        }
        for (const [l, i] of S(this, Nt)) {
          if (l === r || S(this, br).has(l)) continue
          const o = () => {
            if (Array.from(S(this, zt).values()).includes(l)) {
              var d = document.createDocumentFragment()
              ;(Gs(i, d), d.append(Jt()), S(this, _t).set(l, { effect: i, fragment: d }))
            } else ut(i)
            ;(S(this, br).delete(l), S(this, Nt).delete(l))
          }
          S(this, ka) || !s ? (S(this, br).add(l), kr(i, o, !1)) : o()
        }
      }
    })
    fe(this, Za, t => {
      S(this, zt).delete(t)
      const r = Array.from(S(this, zt).values())
      for (const [s, n] of S(this, _t)) r.includes(s) || (ut(n.effect), S(this, _t).delete(s))
    })
    ;((this.anchor = t), ce(this, ka, r))
  }
  ensure(t, r) {
    var s = se,
      n = Xn()
    if (r && !S(this, Nt).has(t) && !S(this, _t).has(t))
      if (n) {
        var l = document.createDocumentFragment(),
          i = Jt()
        ;(l.append(i), S(this, _t).set(t, { effect: kt(() => r(i)), fragment: l }))
      } else
        S(this, Nt).set(
          t,
          kt(() => r(this.anchor))
        )
    if ((S(this, zt).set(s, t), n)) {
      for (const [o, v] of S(this, Nt)) o === t ? s.unskip_effect(v) : s.skip_effect(v)
      for (const [o, v] of S(this, _t))
        o === t ? s.unskip_effect(v.effect) : s.skip_effect(v.effect)
      ;(s.oncommit(S(this, Sa)), s.ondiscard(S(this, Za)))
    } else S(this, Sa).call(this, s)
  }
}
;((zt = new WeakMap()),
  (Nt = new WeakMap()),
  (_t = new WeakMap()),
  (br = new WeakMap()),
  (ka = new WeakMap()),
  (Sa = new WeakMap()),
  (Za = new WeakMap()))
function q(e, t, r = !1) {
  var s = new _l(e),
    n = r ? Mr : 0
  function l(i, o) {
    s.ensure(i, o)
  }
  es(() => {
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
function yo(e, t, r) {
  for (var s = [], n = t.length, l, i = t.length, o = 0; o < n; o++) {
    let _ = t[o]
    kr(
      _,
      () => {
        if (l) {
          if ((l.pending.delete(_), l.done.add(_), l.pending.size === 0)) {
            var f = e.outrogroups
            ;(As(e, Qa(l.done)), f.delete(l), f.size === 0 && (e.outrogroups = null))
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
      ;(eo(h), h.append(d), e.items.clear())
    }
    As(e, t, !v)
  } else
    ((l = { pending: new Set(t), done: new Set() }),
      (e.outrogroups ?? (e.outrogroups = new Set())).add(l))
}
function As(e, t, r = !0) {
  var s
  if (e.pending.size > 0) {
    s = new Set()
    for (const i of e.pending.values()) for (const o of i) s.add(e.items.get(o).e)
  }
  for (var n = 0; n < t.length; n++) {
    var l = t[n]
    if (s != null && s.has(l)) {
      l.f |= Ft
      const i = document.createDocumentFragment()
      Gs(l, i)
    } else ut(t[n], r)
  }
}
var vn
function Ee(e, t, r, s, n, l = null) {
  var i = e,
    o = new Map(),
    v = (t & zn) !== 0
  if (v) {
    var d = e
    i = d.appendChild(Jt())
  }
  var h = null,
    _ = Ns(() => {
      var x = r()
      return Ls(x) ? x : x == null ? [] : Qa(x)
    }),
    f,
    g = new Map(),
    m = !0
  function y(x) {
    ;(B.effect.f & mt) === 0 &&
      (B.pending.delete(x),
      (B.fallback = h),
      wo(B, f, i, t, s),
      h !== null &&
        (f.length === 0
          ? (h.f & Ft) === 0
            ? Ya(h)
            : ((h.f ^= Ft), ca(h, null, i))
          : kr(h, () => {
              h = null
            })))
  }
  function w(x) {
    B.pending.delete(x)
  }
  var O = es(() => {
      f = a(_)
      for (var x = f.length, L = new Set(), T = se, G = Xn(), A = 0; A < x; A += 1) {
        var U = f[A],
          W = s(U, A),
          R = m ? null : o.get(W)
        ;(R
          ? (R.v && Jr(R.v, U), R.i && Jr(R.i, A), G && T.unskip_effect(R.e))
          : ((R = bo(o, m ? i : (vn ?? (vn = Jt())), U, W, A, n, t, r)),
            m || (R.e.f |= Ft),
            o.set(W, R)),
          L.add(W))
      }
      if (
        (x === 0 &&
          l &&
          !h &&
          (m ? (h = kt(() => l(i))) : ((h = kt(() => l(vn ?? (vn = Jt())))), (h.f |= Ft))),
        x > L.size && ti(),
        !m)
      )
        if ((g.set(T, L), G)) {
          for (const [E, C] of o) L.has(E) || T.skip_effect(C.e)
          ;(T.oncommit(y), T.ondiscard(w))
        } else y(T)
      a(_)
    }),
    B = { effect: O, items: o, pending: g, outrogroups: null, fallback: h }
  m = !1
}
function na(e) {
  for (; e !== null && (e.f & Pt) === 0;) e = e.next
  return e
}
function wo(e, t, r, s, n) {
  var R, E, C, k, H, P, N, z, j
  var l = (s & fi) !== 0,
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
        (w.f & Ft) === 0 &&
          ((E = (R = w.nodes) == null ? void 0 : R.a) == null || E.measure(),
          (_ ?? (_ = new Set())).add(w)))
  for (O = 0; O < i; O += 1) {
    if (((m = t[O]), (y = n(m, O)), (w = o.get(y).e), e.outrogroups !== null))
      for (const D of e.outrogroups) (D.pending.delete(w), D.done.delete(w))
    if (
      ((w.f & lt) !== 0 &&
        (Ya(w),
        l &&
          ((k = (C = w.nodes) == null ? void 0 : C.a) == null || k.unfix(),
          (_ ?? (_ = new Set())).delete(w))),
      (w.f & Ft) !== 0)
    )
      if (((w.f ^= Ft), w === v)) ca(w, null, r)
      else {
        var B = h ? h.next : v
        ;(w === e.effect.last && (e.effect.last = w.prev),
          w.prev && (w.prev.next = w.next),
          w.next && (w.next.prev = w.prev),
          tr(e, h, w),
          tr(e, w, B),
          ca(w, B, r),
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
            L
          h = x.prev
          var T = f[0],
            G = f[f.length - 1]
          for (L = 0; L < f.length; L += 1) ca(f[L], x, r)
          for (L = 0; L < g.length; L += 1) d.delete(g[L])
          ;(tr(e, T.prev, G.next),
            tr(e, h, T),
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
    ;((w.f & Ft) === 0 && f.push(w), (h = w), (v = na(w.next)))
  }
  if (e.outrogroups !== null) {
    for (const D of e.outrogroups)
      D.pending.size === 0 && (As(e, Qa(D.done)), (H = e.outrogroups) == null || H.delete(D))
    e.outrogroups.size === 0 && (e.outrogroups = null)
  }
  if (v !== null || d !== void 0) {
    var A = []
    if (d !== void 0) for (w of d) (w.f & lt) === 0 && A.push(w)
    for (; v !== null;) ((v.f & lt) === 0 && v !== e.fallback && A.push(v), (v = na(v.next)))
    var U = A.length
    if (U > 0) {
      var W = (s & zn) !== 0 && i === 0 ? r : null
      if (l) {
        for (O = 0; O < U; O += 1)
          (N = (P = A[O].nodes) == null ? void 0 : P.a) == null || N.measure()
        for (O = 0; O < U; O += 1) (j = (z = A[O].nodes) == null ? void 0 : z.a) == null || j.fix()
      }
      yo(e, A, W)
    }
  }
  l &&
    cr(() => {
      var D, F
      if (_ !== void 0) for (w of _) (F = (D = w.nodes) == null ? void 0 : D.a) == null || F.apply()
    })
}
function bo(e, t, r, s, n, l, i, o) {
  var v = (i & ci) !== 0 ? ((i & pi) === 0 ? Ji(r, !1, !1) : Tr(r)) : null,
    d = (i & ui) !== 0 ? Tr(n) : null
  return {
    v,
    i: d,
    e: kt(
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
      var s = e.nodes.start, n = e.nodes.end, l = t && (t.f & Ft) === 0 ? t.nodes.start : r;
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
function xo(e, t, r = !1, s = !1, n = !1, l = !1) {
  var i = e,
    o = ''
  if (r) var v = e
  I(() => {
    var d = ge
    if (o !== (o = t() ?? '')) {
      if (r) {
        ;((d.nodes = null), (v.innerHTML = o), o !== '' && Cr(Dt(v), v.lastChild))
        return
      }
      if ((d.nodes !== null && (al(d.nodes.start, d.nodes.end), (d.nodes = null)), o !== '')) {
        var h = s ? xi : n ? ki : void 0,
          _ = Zn(s ? 'svg' : n ? 'math' : 'template', h)
        _.innerHTML = o
        var f = s || n ? _ : _.content
        if ((Cr(Dt(f), f.lastChild), s || n)) for (; Dt(f);) i.before(Dt(f))
        else i.before(f)
      }
    }
  })
}
function Ir(e, t, ...r) {
  var s = new _l(e)
  es(() => {
    const n = t() ?? null
    s.ensure(n, n && (l => n(l, ...r)))
  }, Mr)
}
const dn = [
  ...` 	
\r\f \v\uFEFF`,
]
function ko(e, t, r) {
  var s = e == null ? '' : '' + e
  if ((t && (s = s ? s + ' ' + t : t), r)) {
    for (var n of Object.keys(r))
      if (r[n]) s = s ? s + ' ' + n : n
      else if (s.length)
        for (var l = n.length, i = 0; (i = s.indexOf(n, i)) >= 0;) {
          var o = i + l
          ;(i === 0 || dn.includes(s[i - 1])) && (o === s.length || dn.includes(s[o]))
            ? (s = (i === 0 ? '' : s.substring(0, i)) + s.substring(o + 1))
            : (i = o)
        }
  }
  return s === '' ? null : s
}
function cn(e, t = !1) {
  var r = t ? ' !important;' : ';',
    s = ''
  for (var n of Object.keys(e)) {
    var l = e[n]
    l != null && l !== '' && (s += ' ' + n + ': ' + l + r)
  }
  return s
}
function is(e) {
  return e[0] !== '-' || e[1] !== '-' ? e.toLowerCase() : e
}
function So(e, t) {
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
      ;(s && v.push(...Object.keys(s).map(is)), n && v.push(...Object.keys(n).map(is)))
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
              var g = is(e.substring(d, h).trim())
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
    return (s && (r += cn(s)), n && (r += cn(n, !0)), (r = r.trim()), r === '' ? null : r)
  }
  return e == null ? null : String(e)
}
function Fe(e, t, r, s, n, l) {
  var i = e[_s]
  if (i !== r || i === void 0) {
    var o = ko(r, s, l)
    ;(o == null ? e.removeAttribute('class') : (e.className = o), (e[_s] = r))
  } else if (l && n !== l)
    for (var v in l) {
      var d = !!l[v]
      ;(n == null || d !== !!n[v]) && e.classList.toggle(v, d)
    }
  return l
}
function os(e, t = {}, r, s) {
  for (var n in r) {
    var l = r[n]
    t[n] !== l && (r[n] == null ? e.style.removeProperty(n) : e.style.setProperty(n, l, s))
  }
}
function et(e, t, r, s) {
  var n = e[gs]
  if (n !== t) {
    var l = So(t, s)
    ;(l == null ? e.removeAttribute('style') : (e.style.cssText = l), (e[gs] = t))
  } else
    s &&
      (Array.isArray(s)
        ? (os(e, r == null ? void 0 : r[0], s[0]),
          os(e, r == null ? void 0 : r[1], s[1], 'important'))
        : os(e, r, s))
  return s
}
function Bt(e, t, r = !1) {
  if (e.multiple) {
    if (t == null) return
    if (!Ls(t)) return Pi()
    for (var s of e.options) s.selected = t.includes(ha(s))
    return
  }
  for (s of e.options) {
    var n = ha(s)
    if (Zi(n, t)) {
      s.selected = !0
      return
    }
  }
  ;(!r || t !== void 0) && (e.selectedIndex = -1)
}
function rr(e) {
  var t = new MutationObserver(() => {
    Bt(e, e.__value)
  })
  ;(t.observe(e, { childList: !0, subtree: !0, attributes: !0, attributeFilter: ['value'] }),
    Us(() => {
      t.disconnect()
    }))
}
function Po(e, t, r = t) {
  var s = new WeakSet(),
    n = !0
  ;(Nn(e, 'change', l => {
    var i = l ? '[selected]' : ':checked',
      o
    if (e.multiple) o = [].map.call(e.querySelectorAll(i), ha)
    else {
      var v = e.querySelector(i) ?? e.querySelector('option:not([disabled])')
      o = v && ha(v)
    }
    ;(r(o), (e.__value = o), se !== null && s.add(se))
  }),
    tl(() => {
      var l = t()
      if (e === document.activeElement) {
        var i = se
        if (s.has(i)) return
      }
      if ((Bt(e, l, n), n && l === void 0)) {
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
const Eo = Symbol('is custom element'),
  Mo = Symbol('is html'),
  Ao = Zl ? 'progress' : 'PROGRESS'
function Ks(e, t) {
  var r = gl(e)
  r.value === (r.value = t ?? void 0) ||
    (e.value === t && (t !== 0 || e.nodeName !== Ao)) ||
    (e.value = t ?? '')
}
function _e(e, t, r, s) {
  var n = gl(e)
  n[t] !== (n[t] = r) &&
    (t === 'loading' && (e[Xl] = r),
    r == null
      ? e.removeAttribute(t)
      : typeof r != 'string' && zo(e).includes(t)
        ? (e[t] = r)
        : e.setAttribute(t, r))
}
function gl(e) {
  return e[Na] ?? (e[Na] = { [Eo]: e.nodeName.includes('-'), [Mo]: e.namespaceURI === Tn })
}
var un = new Map()
function zo(e) {
  var t = e.getAttribute('is') || e.nodeName,
    r = un.get(t)
  if (r) return r
  un.set(t, (r = []))
  for (var s, n = e, l = Element.prototype; l !== n;) {
    s = Sn(n)
    for (var i in s)
      s[i].set && i !== 'innerHTML' && i !== 'textContent' && i !== 'innerText' && r.push(i)
    n = Os(n)
  }
  return r
}
function Ta(e, t, r = t) {
  var s = new WeakSet()
  ;(Nn(e, 'input', async n => {
    var l = n ? e.defaultValue : e.value
    if (((l = vs(e) ? ds(l) : l), r(l), se !== null && s.add(se), await oo(), l !== (l = t()))) {
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
    ra(t) == null && e.value && (r(vs(e) ? ds(e.value) : e.value), se !== null && s.add(se)),
    Bs(() => {
      var n = t()
      if (e === document.activeElement) {
        var l = se
        if (s.has(l)) return
      }
      ;(vs(e) && n === ds(e.value)) ||
        (e.type === 'date' && !n && !e.value) ||
        (n !== e.value && (e.value = n ?? ''))
    }))
}
function vs(e) {
  var t = e.type
  return t === 'number' || t === 'range'
}
function ds(e) {
  return e === '' ? null : +e
}
function cs(e, t) {
  return e === t || (e == null ? void 0 : e[Yt]) === t
}
function ml(e = {}, t, r, s) {
  var n = Re.r,
    l = ge
  return (
    tl(() => {
      var i, o
      return (
        Bs(() => {
          ;((i = o),
            (o = []),
            ra(() => {
              cs(r(...o), e) || (t(e, ...o), i && cs(r(...i), e) && t(null, ...i))
            }))
        }),
        () => {
          let v = l
          for (; v !== n && v.parent !== null && v.parent.f & hs;) v = v.parent
          const d = () => {
              o && cs(r(...o), e) && t(null, ...o)
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
function yl(e = !1) {
  const t = Re,
    r = t.l.u
  if (!r) return
  let s = () => vo(t.s)
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
    ro(() => {
      ;(fn(t, s), fs(r.b))
    }),
    Ot(() => {
      const n = ra(() => r.m.map(Vl))
      return () => {
        for (const l of n) typeof l == 'function' && l()
      }
    }),
    r.a.length &&
      Ot(() => {
        ;(fn(t, s), fs(r.a))
      }))
}
function fn(e, t) {
  if (e.l.s) for (const r of e.l.s) a(r)
  t()
}
function be(e, t, r, s) {
  var L
  var n = !ea || (r & _i) !== 0,
    l = (r & mi) !== 0,
    i = (r & yi) !== 0,
    o = s,
    v = !0,
    d = void 0,
    h = () => (i && n ? (d ?? (d = Yr(s)), a(d)) : (v && ((v = !1), (o = i ? ra(s) : s)), o))
  let _
  if (l) {
    var f = Yt in e || Jl in e
    _ = ((L = Fr(e, t)) == null ? void 0 : L.set) ?? (f && t in e ? T => (e[t] = T) : void 0)
  }
  var g,
    m = !1
  ;(l ? ([g, m] = $i(() => e[t])) : (g = e[t]),
    g === void 0 && s !== void 0 && ((g = h()), _ && (n && li(), _(g))))
  var y
  if (
    (n
      ? (y = () => {
          var T = e[t]
          return T === void 0 ? h() : ((v = !0), T)
        })
      : (y = () => {
          var T = e[t]
          return (T !== void 0 && (o = void 0), T === void 0 ? o : T)
        }),
    n && (r & gi) === 0)
  )
    return y
  if (_) {
    var w = e.$$legacy
    return function (T, G) {
      return arguments.length > 0 ? ((!n || !G || w || m) && _(G ? y() : T), T) : y()
    }
  }
  var O = !1,
    B = ((r & hi) !== 0 ? Yr : Ns)(() => ((O = !1), y()))
  l && a(B)
  var x = ge
  return function (T, G) {
    if (arguments.length > 0) {
      const A = G ? a(B) : n && l ? Ke(T) : T
      return ($(B, A), (O = !0), o !== void 0 && (o = A), T)
    }
    return (Zt && O) || (x.f & mt) !== 0 ? B.v : a(B)
  }
}
function Vs(e) {
  ;(Re === null && Ql(),
    ea && Re.l !== null
      ? To(Re).m.push(e)
      : Ot(() => {
          const t = ra(e)
          if (typeof t == 'function') return t
        }))
}
function To(e) {
  var t = e.l
  return t.u ?? (t.u = { a: [], b: [], m: [] })
}
const Co = '5'
var xn
typeof window < 'u' &&
  ((xn = window.__svelte ?? (window.__svelte = {})).v ?? (xn.v = new Set())).add(Co)
const $o = ['dashboard', 'providers', 'models', 'apps', 'server', 'tester', 'settings']
function wl() {
  const e = typeof window < 'u' ? window.location.hash.replace(/^#\/?/, '') : ''
  return $o.includes(e) ? e : 'dashboard'
}
const Tt = Ke({ route: wl() })
function ur(e) {
  typeof window < 'u' && (window.location.hash = `/${e}`)
}
function Io() {
  const e = () => {
    Tt.route = wl()
  }
  ;(window.addEventListener('hashchange', e), e())
}
const Lt = Ke({ toasts: [], commandOpen: !1, loadingRoutes: new Set() })
let Lo = 0
function he(e, t = 'info', r = 4e3) {
  const s = ++Lo,
    n = { id: s, message: e, kind: t }
  ;((Lt.toasts = [...Lt.toasts, n]), (n.timeout = setTimeout(() => zs(s), r)))
}
function zs(e) {
  const t = Lt.toasts.find(r => r.id === e)
  ;(t != null && t.timeout && clearTimeout(t.timeout),
    (Lt.toasts = Lt.toasts.filter(r => r.id !== e)))
}
function us() {
  Lt.commandOpen = !0
}
function Oo() {
  Lt.commandOpen = !1
}
function Ro() {
  Lt.commandOpen = !Lt.commandOpen
}
const No = {},
  Fo = typeof import.meta < 'u' && No && !1,
  bl = 'anygate-recent-folders'
function xl() {
  try {
    const e = localStorage.getItem(bl)
    return e ? JSON.parse(e) : []
  } catch {
    return []
  }
}
function Do(e) {
  const t = xl().filter(s => s !== e)
  t.unshift(e)
  const r = t.slice(0, 10)
  try {
    localStorage.setItem(bl, JSON.stringify(r))
  } catch {}
  return r
}
function jo(e) {
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
class pn extends Error {
  constructor(r, s, n) {
    super(r)
    st(this, 'hint')
    st(this, 'status')
    ;((this.name = 'ApiError'), (this.status = s), (this.hint = n))
  }
}
async function kl(e, t, r, s) {
  const n = { method: e, headers: {} }
  r !== void 0 && ((n.headers['Content-Type'] = 'application/json'), (n.body = JSON.stringify(r)))
  let l
  try {
    l = await fetch(t, n)
  } catch (v) {
    throw new pn(`Network error: ${String(v)}`, 0)
  }
  const i = await l.text(),
    o = i ? JSON.parse(i) : void 0
  if (!l.ok) {
    const v = o
    throw new pn(
      (v == null ? void 0 : v.error) ?? `Request failed (${l.status})`,
      l.status,
      v == null ? void 0 : v.hint
    )
  }
  return o
}
function er(e, t) {
  return kl('GET', e, void 0)
}
function ot(e, t, r) {
  return kl('POST', e, t)
}
function Ys() {
  return er('/api/config')
}
function Sl(e) {
  return ot('/api/config', e)
}
function qo() {
  return er('/api/models')
}
function Uo(e) {
  return ot('/api/models/test', e)
}
function Bo(e, t) {
  return ot('/api/keys', { providerId: e, key: t })
}
function Ho(e) {
  return ot('/api/providers/refresh', { providerId: e })
}
function Go() {
  return ot('/api/providers/refresh-all')
}
function Wo() {
  return er('/api/providers/templates')
}
function Ko(e, t, r) {
  return ot('/api/providers/add', { templateId: e, key: t, baseUrl: r })
}
function Vo(e) {
  return ot('/api/providers/add-custom', e)
}
function Yo(e) {
  return ot('/api/providers/delete', { providerId: e })
}
function Jo(e) {
  return ot('/api/providers/oauth/start', { providerId: e })
}
function Xo(e) {
  return er(`/api/providers/oauth/status?sessionId=${encodeURIComponent(e)}`)
}
function Zo() {
  return er('/api/apps')
}
function Qo(e, t) {
  return ot('/api/apps/path', { appId: e, path: t })
}
function ev(e) {
  return ot('/api/apps/launch', e)
}
function tv() {
  return ot('/api/apps/browse-folder')
}
function rv() {
  return er('/api/server/status')
}
function av() {
  return er('/api/server/providers')
}
function sv(e) {
  return ot('/api/server/start', e)
}
function nv() {
  return ot('/api/server/stop')
}
async function lv() {
  return er('/api/health')
}
async function iv() {
  return (await er('/api/presets')).presets ?? []
}
async function ov(e) {
  return ot('/api/presets', { presets: e })
}
async function vv() {
  const e = await Ys()
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
async function dv(e) {
  const t = JSON.parse(e)
  if (!Array.isArray(t.favoriteModels) && !Array.isArray(t.antigravityCliFavoriteModels))
    throw new Error('Invalid config file: missing favoriteModels')
  await Sl({
    favoriteModels: t.favoriteModels ?? [],
    antigravityCliFavoriteModels: t.antigravityCliFavoriteModels ?? [],
  })
}
function cv(e) {
  return jo(e)
}
const uv = new Set([
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
  fv = new Set(['openai', 'openai-oauth']),
  pv = new Set(['google', 'vertex'])
function hv(e, t) {
  const r = e.toLowerCase()
  if (r.startsWith('claude') || r.includes('anthropic')) return 'anthropic'
  if (t) {
    const s = t.toLowerCase()
    if (fv.has(s))
      return r.startsWith('gpt') || r.startsWith('o1') || r.startsWith('o3') || r.startsWith('o4')
        ? 'unsupported'
        : 'openai'
    if (uv.has(s)) return 'openai'
    if (pv.has(s)) return r.startsWith('gemini') ? 'unsupported' : 'openai'
  }
  return 'openai'
}
function _v(e) {
  return e.format ? e.format : hv(e.id, e.providerId)
}
function Pl(e) {
  if (typeof e.reasoning == 'boolean') return e.reasoning
  const t = e.id.toLowerCase()
  return /(opus|sonnet|o1|o3|o4|gpt-5|deepseek-r(1|2)|qwen3?-(plus|max|pro)|claude-(3-7|4))/.test(t)
}
function gv(e) {
  if (Array.isArray(e.supportedParameters)) return e.supportedParameters
  const t = ['tools', 'system']
  return (Pl(e) && t.push('reasoning_effort'), e.isFree || t.push('streaming'), t)
}
function mv(e) {
  return { ...e, format: _v(e), reasoning: Pl(e), supportedParameters: gv(e) }
}
function yv(e) {
  const t = new Set(),
    r = e.models.filter(s => (t.has(s.id) ? !1 : (t.add(s.id), !0)))
  return { ...e, enrichedModels: r.map(mv) }
}
const Oe = Ke({ list: [], loading: !1, error: null })
async function Js(e) {
  ;((Oe.loading = !0), (Oe.error = null))
  try {
    const t = await qo()
    Oe.list = t.providers.map(yv)
  } catch (t) {
    Oe.error = t instanceof Error ? t.message : String(t)
  } finally {
    Oe.loading = !1
  }
}
async function El(e) {
  try {
    const t = await Ho(e)
    if (!t.ok) {
      he(t.error ? String(t.error) : 'Refresh failed', 'error')
      return
    }
    ;(await Js(), he(`Refreshed ${e} (${t.count ?? 0} models)`, 'success'))
  } catch (t) {
    he(t instanceof Error ? t.message : String(t), 'error')
  }
}
async function La() {
  try {
    const e = await Go()
    ;(await Js(), he(`Refreshed all · ${e.total} models`, 'success'))
  } catch (e) {
    he(e instanceof Error ? e.message : String(e), 'error')
  }
}
const wv = 20,
  bv = 6,
  ke = Ke({ general: [], agy: [], loading: !1, error: null })
async function Ml() {
  ke.loading = !0
  try {
    const e = await Ys()
    ;((ke.general = e.favoriteModels ?? []), (ke.agy = e.antigravityCliFavoriteModels ?? []))
  } catch (e) {
    ke.error = e instanceof Error ? e.message : String(e)
  } finally {
    ke.loading = !1
  }
}
async function Xs() {
  await Sl({ favoriteModels: ke.general, antigravityCliFavoriteModels: ke.agy })
}
function Al(e, t, r = !1) {
  return (r ? ke.agy : ke.general).some(n => n.providerId === e && n.modelId === t)
}
async function zl(e, t = !1) {
  const r = t ? ke.agy : ke.general,
    s = t ? bv : wv
  return Al(e.providerId, e.modelId, t)
    ? !0
    : r.length >= s
      ? (he(`Favorite limit reached (${s})`, 'error'), !1)
      : (t ? (ke.agy = [...ke.agy, e]) : (ke.general = [...ke.general, e]), await Xs(), !0)
}
async function Ts(e, t, r = !1) {
  ;(r
    ? (ke.agy = ke.agy.filter(s => !(s.providerId === e && s.modelId === t)))
    : (ke.general = ke.general.filter(s => !(s.providerId === e && s.modelId === t))),
    await Xs())
}
async function xv(e, t = !1) {
  ;(t ? (ke.agy = e) : (ke.general = e), await Xs())
}
const kv = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        addFavorite: zl,
        favorites: ke,
        isFavorite: Al,
        loadFavorites: Ml,
        removeFavorite: Ts,
        reorder: xv,
      },
      Symbol.toStringTag,
      { value: 'Module' }
    )
  ),
  at = Ke({ list: [], recentFolders: [], loading: !1, error: null })
async function Sv() {
  at.loading = !0
  try {
    const e = await Zo()
    ;((at.list = e.apps), (at.recentFolders = e.recentLaunchFolders ?? xl()))
  } catch (e) {
    at.error = e instanceof Error ? e.message : String(e)
  } finally {
    at.loading = !1
  }
}
async function Pv(e, t) {
  const r = await Qo(e, t)
  r.ok && ((at.list = r.apps), he(t ? 'Path saved' : 'Path cleared', 'success'))
}
async function Oa(e) {
  try {
    const t = await ev(e)
    ;(e.cwd && (at.recentFolders = Do(e.cwd)), he(`Launched ${e.appId}`, 'success'))
  } catch (t) {
    he(t instanceof Error ? t.message : String(t), 'error')
  }
}
async function hn() {
  const e = await tv()
  return e.ok && !e.canceled && e.path ? e.path : null
}
const ir = Ke({
  loaded: null,
  tier: 'zen',
  defaultFolder: null,
  anygateHome: null,
  logPaths: {},
  loading: !1,
})
async function Ev() {
  var e, t
  ir.loading = !0
  try {
    ;((ir.loaded = await Ys()),
      (ir.anygateHome =
        ((t = (e = globalThis.process) == null ? void 0 : e.env) == null
          ? void 0
          : t.ANYGATE_HOME) ?? null))
  } catch {
  } finally {
    ir.loading = !1
  }
}
function Mv(e) {
  ir.tier = e
}
const gt = Ke({ list: [], loading: !1, error: null })
async function Tl() {
  ;((gt.loading = !0), (gt.error = null))
  try {
    gt.list = await iv()
  } catch (e) {
    gt.error = e instanceof Error ? e.message : String(e)
  } finally {
    gt.loading = !1
  }
}
async function Cl(e, t) {
  const r = gt.list
  gt.list = e
  try {
    return (await ov(e), t && he(t, 'success'), !0)
  } catch (s) {
    return (
      (gt.list = r),
      he(
        s instanceof Error ? `Couldn't save preset: ${s.message}` : "Couldn't save preset",
        'error'
      ),
      !1
    )
  }
}
async function Av(e) {
  const t = e.id ?? `preset-${Date.now()}`,
    r = { ...e, id: t },
    s = gt.list.findIndex(l => l.id === t),
    n = [...gt.list]
  ;(s >= 0 ? (n[s] = r) : n.push(r), await Cl(n, 'Preset saved'))
}
async function zv(e) {
  await Cl(
    gt.list.filter(t => t.id !== e),
    'Preset deleted'
  )
}
const ze = Ke({ report: null, available: !1, loading: !1, error: null })
async function Cs() {
  ;((ze.loading = !0), (ze.error = null))
  try {
    const e = await lv()
    ;((ze.report = e), (ze.available = !0))
  } catch (e) {
    ;((ze.report = null),
      (ze.available = !1),
      (ze.error = e instanceof Error ? e.message : String(e)))
  } finally {
    ze.loading = !1
  }
}
const Ht = Ke({ connected: !1, degraded: !1, lastEventAt: null }),
  $s = new Set()
let _r = null,
  _n = 0
const Tv = 3
function $l(e) {
  return ($s.add(e), () => $s.delete(e))
}
function Il() {
  if (_r || Fo || typeof EventSource > 'u') {
    typeof EventSource > 'u' && (Ht.degraded = !0)
    return
  }
  const e = new EventSource('/api/events')
  ;((_r = e),
    (e.onopen = () => {
      ;((_n = 0), (Ht.connected = !0), (Ht.degraded = !1))
    }),
    (e.onmessage = t => {
      Ht.lastEventAt = Date.now()
      let r
      try {
        r = JSON.parse(t.data)
      } catch {
        return
      }
      for (const s of $s)
        try {
          s(r)
        } catch {}
    }),
    (e.onerror = () => {
      ;((Ht.connected = !1), ++_n >= Tv && ((Ht.degraded = !0), e.close(), (_r = null)))
    }))
}
function Cv() {
  ;(_r == null || _r.close(), (_r = null), (Ht.connected = !1))
}
const Qe = Ke({ status: null, loading: !1, starting: !1, error: null })
let _a = null,
  ga = null,
  Nr = null,
  Ll = 5e3
async function ya() {
  Qe.status || (Qe.loading = !0)
  try {
    ;((Qe.status = await rv()), (Qe.error = null))
  } catch (e) {
    Qe.error = e instanceof Error ? e.message : String(e)
  } finally {
    Qe.loading = !1
  }
}
function $v() {
  _a ||
    (_a = setInterval(() => {
      ya()
    }, Ll))
}
function Ol() {
  _a && (clearInterval(_a), (_a = null))
}
function Iv(e = 5e3) {
  ;((Ll = e),
    ya(),
    Il(),
    Nr ||
      (Nr = $l(t => {
        t.type === 'server' && ya()
      })),
    ga ||
      (ga = setInterval(() => {
        Ht.degraded ? $v() : Ol()
      }, 1e3)))
}
function Lv() {
  ;(Ol(), ga && (clearInterval(ga), (ga = null)), Nr == null || Nr(), (Nr = null))
}
async function Ov(e) {
  Qe.starting = !0
  try {
    const t = await sv(e)
    return t.ok && t.status
      ? ((Qe.status = t.status), he('Server gateway started', 'success'), !0)
      : (he(t.error ?? 'Failed to start server', 'error'), !1)
  } catch (t) {
    return (he(t instanceof Error ? t.message : String(t), 'error'), !1)
  } finally {
    Qe.starting = !1
  }
}
async function Rv() {
  try {
    ;(await nv(), await ya(), he('Server gateway stopped', 'info'))
  } catch (e) {
    he(e instanceof Error ? e.message : String(e), 'error')
  }
}
var Nv = b(
    '<button><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svelte-6dohdz"><path></path></svg> <span> </span></button>'
  ),
  Fv = b(
    '<aside class="sidebar svelte-6dohdz"><div class="brand svelte-6dohdz"><div class="monogram svelte-6dohdz">a</div> <div class="brand-meta"><div class="brand-name svelte-6dohdz">anygate</div> <div class="brand-byline svelte-6dohdz">ramananbuilds</div></div></div> <div class="version-row svelte-6dohdz"><span class="version svelte-6dohdz"> </span> <span role="img"></span></div> <nav class="nav svelte-6dohdz" aria-label="Sections"></nav></aside>'
  )
function Dv(e, t) {
  me(t, !0)
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
    n = J(() => {
      var g
      if (ze.loading && !ze.report) return { tone: 'unknown', label: 'Checking system health…' }
      if (ze.error || !ze.report) return { tone: 'unknown', label: 'System health unavailable' }
      const f = ((g = ze.report.checks) == null ? void 0 : g.filter(m => !m.ok)) ?? []
      return ze.report.ok
        ? f.length > 0
          ? { tone: 'warn', label: `${f.length} check${f.length === 1 ? '' : 's'} need attention` }
          : { tone: 'ok', label: 'All health checks passing' }
        : { tone: 'error', label: 'Critical check failing' }
    })
  var l = Fv(),
    i = c(u(l), 2),
    o = u(i),
    v = u(o),
    d = c(o, 2)
  let h
  var _ = c(i, 2)
  ;(Ee(
    _,
    21,
    () => r,
    f => f.id,
    (f, g) => {
      var m = Nv()
      let y
      var w = u(m),
        O = u(w),
        B = c(w, 2),
        x = u(B)
      ;(I(() => {
        ;((y = Fe(m, 1, 'nav-item svelte-6dohdz', null, y, { active: Tt.route === a(g).id })),
          _e(m, 'aria-current', Tt.route === a(g).id ? 'page' : void 0),
          _e(O, 'd', a(g).icon),
          M(x, a(g).label))
      }),
        ne('click', m, () => ur(a(g).id)),
        p(f, m))
    }
  ),
    I(() => {
      ;(M(v, `v${s}`),
        (h = Fe(d, 1, 'health-dot svelte-6dohdz', null, h, {
          ok: a(n).tone === 'ok',
          warn: a(n).tone === 'warn',
          error: a(n).tone === 'error',
        })),
        _e(d, 'title', a(n).label),
        _e(d, 'aria-label', a(n).label))
    }),
    p(e, l),
    ye())
}
Ve(['click'])
function jv() {
  return typeof localStorage > 'u'
    ? 'dark'
    : localStorage.getItem('anygate-theme') === 'light'
      ? 'light'
      : 'dark'
}
const or = Ke({ value: jv() })
function Rl(e) {
  typeof document > 'u' || document.documentElement.setAttribute('data-theme', e)
}
typeof document < 'u' && Rl(or.value)
function Nl() {
  ;((or.value = or.value === 'dark' ? 'light' : 'dark'),
    typeof localStorage < 'u' && localStorage.setItem('anygate-theme', or.value),
    Rl(or.value))
}
var qv = b('<span><!></span>')
function qe(e, t) {
  let r = be(t, 'tone', 3, 'neutral')
  var s = qv(),
    n = u(s)
  ;(Ir(n, () => t.children), I(() => Fe(s, 1, `badge ${r() ?? ''}`, 'svelte-7j44kq')), p(e, s))
}
var Uv = b('<button><!></button>')
function Pe(e, t) {
  let r = be(t, 'variant', 3, 'primary'),
    s = be(t, 'size', 3, 'md'),
    n = be(t, 'disabled', 3, !1),
    l = be(t, 'type', 3, 'button')
  var i = Uv(),
    o = u(i)
  ;(Ir(o, () => t.children),
    I(() => {
      ;(_e(i, 'type', l()),
        Fe(i, 1, `btn ${r() ?? ''} ${s() ?? ''}`, 'svelte-8a1c4v'),
        (i.disabled = n()))
    }),
    ne('click', i, function (...v) {
      var d
      ;(d = t.onclick) == null || d.apply(this, v)
    }),
    p(e, i))
}
Ve(['click'])
var Bv = b('<div><!></div>')
function Ne(e, t) {
  let r = be(t, 'padding', 3, '18px'),
    s = be(t, 'hover', 3, !1),
    n = be(t, 'class', 3, '')
  var l = Bv()
  let i
  var o = u(l)
  ;(Ir(o, () => t.children),
    I(() => {
      ;((i = Fe(l, 1, `card glass ${n() ?? ''}`, 'svelte-it2i29', i, { hover: s() })),
        et(l, `padding:${r() ?? ''}`),
        _e(l, 'role', t.onclick ? 'button' : void 0))
    }),
    ne('click', l, function (...v) {
      var d
      ;(d = t.onclick) == null || d.apply(this, v)
    }),
    p(e, l))
}
Ve(['click'])
var Hv = b('<div class="drawer-head svelte-1cuwqu"> </div>'),
  Gv = b(
    '<div class="backdrop svelte-1cuwqu" role="presentation"><div role="dialog" aria-modal="true" tabindex="-1"><!> <div class="drawer-body svelte-1cuwqu"><!></div></div></div>'
  )
function Wv(e, t) {
  let r = be(t, 'title', 3, ''),
    s = be(t, 'side', 3, 'right')
  var n = it(),
    l = ee(n)
  {
    var i = o => {
      var v = Gv(),
        d = u(v),
        h = u(d)
      {
        var _ = m => {
          var y = Hv(),
            w = u(y)
          ;(I(() => M(w, r())), p(m, y))
        }
        q(h, m => {
          r() && m(_)
        })
      }
      var f = c(h, 2),
        g = u(f)
      ;(Ir(g, () => t.children),
        I(() => Fe(d, 1, `drawer glass ${s() ?? ''}`, 'svelte-1cuwqu')),
        ne('click', v, function (...m) {
          var y
          ;(y = t.onclose) == null || y.apply(this, m)
        }),
        ne('click', d, m => m.stopPropagation()),
        ne('keydown', d, m => m.stopPropagation()),
        p(o, v))
    }
    q(l, o => {
      t.open && o(i)
    })
  }
  p(e, n)
}
Ve(['click', 'keydown'])
var Kv = b('<div class="sub svelte-16dv2jh"><!></div>'),
  Vv = b(
    '<div class="empty svelte-16dv2jh"><svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path></path></svg> <div class="title svelte-16dv2jh"> </div> <!></div>'
  )
function $r(e, t) {
  let r = be(t, 'title', 3, 'Nothing here yet'),
    s = be(t, 'icon', 3, 'M4 4h16v16H4z')
  var n = Vv(),
    l = u(n),
    i = u(l),
    o = c(l, 2),
    v = u(o),
    d = c(o, 2)
  {
    var h = _ => {
      var f = Kv(),
        g = u(f)
      ;(Ir(g, () => t.children), p(_, f))
    }
    q(d, _ => {
      t.children && _(h)
    })
  }
  ;(I(() => {
    ;(_e(i, 'd', s()), M(v, r()))
  }),
    p(e, n))
}
var Yv = b('<span> </span>'),
  Jv = b('<button class="icon-btn svelte-w50x32"><!> <!></button>')
function Fl(e, t) {
  let r = be(t, 'label', 3, ''),
    s = be(t, 'disabled', 3, !1),
    n = be(t, 'title', 3, '')
  var l = Jv(),
    i = u(l)
  {
    var o = d => {
      var h = Yv(),
        _ = u(h)
      ;(I(() => M(_, r())), p(d, h))
    }
    q(i, d => {
      r() && d(o)
    })
  }
  var v = c(i, 2)
  ;(Ir(v, () => t.children ?? Pn),
    I(() => {
      ;((l.disabled = s()), _e(l, 'title', n()), _e(l, 'aria-label', n() || r()))
    }),
    ne('click', l, function (...d) {
      var h
      ;(h = t.onclick) == null || h.apply(this, d)
    }),
    p(e, l))
}
Ve(['click'])
var Xv = b('<input class="input svelte-1xuvd1z"/>')
function ar(e, t) {
  me(t, !0)
  let r = be(t, 'value', 15, ''),
    s = be(t, 'placeholder', 3, ''),
    n = be(t, 'type', 3, 'text'),
    l = be(t, 'id', 3, '')
  var i = Xv()
  ;(I(() => {
    ;(_e(i, 'id', l()), _e(i, 'type', n()), _e(i, 'placeholder', s()), Ks(i, r()))
  }),
    ne('input', i, o => {
      var v
      ;(r(o.currentTarget.value), (v = t.oninput) == null || v.call(t, r()))
    }),
    ne('keydown', i, function (...o) {
      var v
      ;(v = t.onkeydown) == null || v.apply(this, o)
    }),
    p(e, i),
    ye())
}
Ve(['input', 'keydown'])
var Zv = b('<div class="modal-head svelte-1qk8a2o"> </div>'),
  Qv = b(
    '<div class="backdrop svelte-1qk8a2o" role="presentation"><div class="modal glass svelte-1qk8a2o" role="dialog" aria-modal="true" tabindex="-1"><!> <div class="modal-body"><!></div> <button class="modal-x svelte-1qk8a2o" aria-label="Close">×</button></div></div>'
  )
function Er(e, t) {
  let r = be(t, 'title', 3, '')
  var s = it(),
    n = ee(s)
  {
    var l = i => {
      var o = Qv(),
        v = u(o),
        d = u(v)
      {
        var h = m => {
          var y = Zv(),
            w = u(y)
          ;(I(() => M(w, r())), p(m, y))
        }
        q(d, m => {
          r() && m(h)
        })
      }
      var _ = c(d, 2),
        f = u(_)
      Ir(f, () => t.children)
      var g = c(_, 2)
      ;(ne('click', o, function (...m) {
        var y
        ;(y = t.onclose) == null || y.apply(this, m)
      }),
        ne('click', v, m => m.stopPropagation()),
        ne('keydown', v, m => m.stopPropagation()),
        ne('click', g, function (...m) {
          var y
          ;(y = t.onclose) == null || y.apply(this, m)
        }),
        p(i, o))
    }
    q(n, i => {
      t.open && i(l)
    })
  }
  p(e, s)
}
Ve(['click', 'keydown'])
var ed = b('<option> </option>'),
  td = b('<select class="select svelte-13vr5hb"></select>')
function vr(e, t) {
  me(t, !0)
  let r = be(t, 'value', 15, ''),
    s = be(t, 'id', 3, ''),
    n = be(t, 'disabled', 3, !1)
  function l(v) {
    var d
    ;(r(v.currentTarget.value), (d = t.onchange) == null || d.call(t, r()))
  }
  var i = td()
  Ee(
    i,
    21,
    () => t.options,
    v => v.value,
    (v, d) => {
      var h = ed(),
        _ = u(h),
        f = {}
      ;(I(() => {
        ;(M(_, a(d).label), f !== (f = a(d).value) && (h.value = (h.__value = a(d).value) ?? ''))
      }),
        p(v, h))
    }
  )
  var o
  ;(rr(i),
    I(() => {
      ;(_e(i, 'id', s()),
        (i.disabled = n()),
        o !== (o = r()) && ((i.value = (i.__value = r()) ?? ''), Bt(i, r())))
    }),
    ne('change', i, l),
    p(e, i),
    ye())
}
Ve(['change'])
var rd = b('<span class="spinner inline svelte-18351lc"></span>'),
  ad = b('<span class="lbl"> </span>'),
  sd = b(
    '<div class="spinner-wrap svelte-18351lc" role="status"><span class="spinner svelte-18351lc"></span> <!></div>'
  )
function Qt(e, t) {
  let r = be(t, 'size', 3, 18),
    s = be(t, 'label', 3, ''),
    n = be(t, 'inline', 3, !1)
  var l = it(),
    i = ee(l)
  {
    var o = d => {
        var h = rd()
        ;(I(() => et(h, `width:${r() ?? ''}px;height:${r() ?? ''}px`)), p(d, h))
      },
      v = d => {
        var h = sd(),
          _ = u(h),
          f = c(_, 2)
        {
          var g = m => {
            var y = ad(),
              w = u(y)
            ;(I(() => M(w, s())), p(m, y))
          }
          q(f, m => {
            s() && m(g)
          })
        }
        ;(I(() => {
          ;(_e(h, 'aria-label', s() || 'Loading'),
            et(_, `width:${r() ?? ''}px;height:${r() ?? ''}px`))
        }),
          p(d, h))
      }
    q(i, d => {
      n() ? d(o) : d(v, -1)
    })
  }
  p(e, l)
}
var nd = b('<button role="tab"> </button>'),
  ld = b('<div class="tabs svelte-9oumej" role="tablist"></div>')
function Dl(e, t) {
  me(t, !0)
  let r = be(t, 'active', 15, '')
  var s = ld()
  ;(Ee(
    s,
    21,
    () => t.tabs,
    n => n.id,
    (n, l) => {
      var i = nd()
      let o
      var v = u(i)
      ;(I(() => {
        ;((o = Fe(i, 1, 'tab svelte-9oumej', null, o, { active: r() === a(l).id })),
          _e(i, 'aria-selected', r() === a(l).id),
          M(v, a(l).label))
      }),
        ne('click', i, () => {
          var d
          ;(r(a(l).id), (d = t.onchange) == null || d.call(t, a(l).id))
        }),
        p(n, i))
    }
  ),
    p(e, s),
    ye())
}
Ve(['click'])
var id = b('<span class="lbl svelte-km5m9b"> </span>'),
  od = b(
    '<label class="toggle-wrap svelte-km5m9b"><button type="button" role="switch"><span class="knob svelte-km5m9b"></span></button> <!></label>'
  )
function la(e, t) {
  me(t, !0)
  let r = be(t, 'checked', 15, !1),
    s = be(t, 'label', 3, '')
  function n() {
    var h
    ;(r(!r()), (h = t.onchange) == null || h.call(t, r()))
  }
  var l = od(),
    i = u(l)
  let o
  var v = c(i, 2)
  {
    var d = h => {
      var _ = id(),
        f = u(_)
      ;(I(() => M(f, s())), p(h, _))
    }
    q(v, h => {
      s() && h(d)
    })
  }
  ;(I(() => {
    ;(_e(i, 'aria-label', s() || 'toggle'),
      _e(i, 'aria-checked', r()),
      (o = Fe(i, 1, 'toggle svelte-km5m9b', null, o, { on: r() })))
  }),
    ne('click', i, n),
    p(e, l),
    ye())
}
Ve(['click'])
var vd = Ws(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></svg>'
  ),
  dd = Ws(
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>'
  ),
  cd = b(
    '<header class="topbar glass svelte-y7n507"><div class="title svelte-y7n507"><h1 class="svelte-y7n507"> </h1></div> <div class="actions svelte-y7n507"><button class="cmdk svelte-y7n507" title="Command palette (⌘K)"><span class="kbd svelte-y7n507">⌘K</span> Search</button> <!></div></header>'
  )
function ud(e, t) {
  me(t, !0)
  const r = {
      dashboard: 'Dashboard',
      providers: 'Providers & Keys',
      models: 'Models',
      apps: 'Apps & Launch',
      server: 'Server Gateway',
      tester: 'Model Tester',
      settings: 'Settings',
    },
    s = J(() => r[Tt.route] ?? 'anygate')
  var n = cd(),
    l = u(n),
    i = u(l),
    o = u(i),
    v = c(l, 2),
    d = u(v),
    h = c(d, 2)
  {
    let _ = J(() => (or.value === 'dark' ? 'Switch to light' : 'Switch to dark'))
    Fl(h, {
      get title() {
        return a(_)
      },
      get onclick() {
        return Nl
      },
      children: (f, g) => {
        var m = it(),
          y = ee(m)
        {
          var w = B => {
              var x = vd()
              p(B, x)
            },
            O = B => {
              var x = dd()
              p(B, x)
            }
          q(y, B => {
            or.value === 'dark' ? B(w) : B(O, -1)
          })
        }
        p(f, m)
      },
      $$slots: { default: !0 },
    })
  }
  ;(I(() => M(o, a(s))),
    ne('click', d, function (..._) {
      us == null || us.apply(this, _)
    }),
    p(e, n),
    ye())
}
Ve(['click'])
zi()
var fd = b(
    '<div role="button" tabindex="0"><span class="dot svelte-1kymlcg"></span> <span class="msg"> </span></div>'
  ),
  pd = b('<div class="toaster svelte-1kymlcg" aria-live="polite"></div>')
function hd(e, t) {
  me(t, !1)
  function r(n, l) {
    ;(n.key === 'Enter' || n.key === ' ') && (n.preventDefault(), zs(l))
  }
  yl()
  var s = pd()
  ;(Ee(
    s,
    5,
    () => Lt.toasts,
    n => n.id,
    (n, l) => {
      var i = fd(),
        o = c(u(i), 2),
        v = u(o)
      ;(I(() => {
        ;(Fe(i, 1, `toast ${a(l).kind ?? ''}`, 'svelte-1kymlcg'), M(v, a(l).message))
      }),
        ne('click', i, () => zs(a(l).id)),
        ne('keydown', i, d => r(d, a(l).id)),
        p(n, i))
    }
  ),
    p(e, s),
    ye())
}
Ve(['click', 'keydown'])
var _d = b(
    '<button class="opt svelte-wh9uu8"><span class="lbl svelte-wh9uu8"> </span> <span class="hint svelte-wh9uu8"> </span></button>'
  ),
  gd = b('<div class="none svelte-wh9uu8">No matches</div>'),
  md = b(
    '<div class="backdrop svelte-wh9uu8" role="presentation"><div class="palette glass svelte-wh9uu8" role="dialog" aria-modal="true" tabindex="-1"><input class="q svelte-wh9uu8" placeholder="Search providers, models, apps…"/> <div class="list svelte-wh9uu8"><!> <!></div></div></div>'
  )
function yd(e, t) {
  me(t, !0)
  let r = be(t, 'query', 15, ''),
    s
  Ot(() => {
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
    l = J(() =>
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
  var v = md()
  Ba('keydown', Ss, o)
  var d = u(v),
    h = u(d)
  ml(
    h,
    y => (s = y),
    () => s
  )
  var _ = c(h, 2),
    f = u(_)
  Ee(
    f,
    17,
    () => a(l),
    y => y.id,
    (y, w) => {
      var O = _d(),
        B = u(O),
        x = u(B),
        L = c(B, 2),
        T = u(L)
      ;(I(() => {
        ;(M(x, a(w).label), M(T, a(w).hint))
      }),
        ne('click', O, () => i(a(w))),
        p(y, O))
    }
  )
  var g = c(f, 2)
  {
    var m = y => {
      var w = gd()
      p(y, w)
    }
    q(g, y => {
      a(l).length === 0 && y(m)
    })
  }
  ;(ne('click', v, function (...y) {
    var w
    ;(w = t.onclose) == null || w.apply(this, y)
  }),
    ne('click', d, y => y.stopPropagation()),
    ne('keydown', d, y => y.stopPropagation()),
    Ta(h, r),
    p(e, v),
    ye())
}
Ve(['click', 'keydown'])
async function wd(e) {
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
const xe = Ke({ report: null, range: 'all', loading: !1, error: null, hasData: !1 })
let Ra = 0
async function gn(e = xe.range) {
  const t = ++Ra
  ;((xe.range = e), (xe.loading = !0), (xe.error = null))
  try {
    const r = await wd(e)
    if (t !== Ra) return
    ;((xe.report = r), (xe.hasData = r.totalTokens > 0 || r.messages > 0))
  } catch (r) {
    if (t !== Ra) return
    ;((xe.report = null),
      (xe.hasData = !1),
      (xe.error =
        r instanceof Error
          ? `Couldn't reach the analytics backend (${r.message}). Run \`anygate ui\` and reload.`
          : 'Couldn’t reach the analytics backend. Run `anygate ui` and reload.'))
  } finally {
    t === Ra && (xe.loading = !1)
  }
}
var bd = b('<div class="note error svelte-lftxrq"> </div>'),
  xd = b('<span class="crit svelte-lftxrq">critical</span>'),
  kd = b(
    '<div class="check svelte-lftxrq"><span aria-hidden="true"> </span> <span class="k svelte-lftxrq"> <!></span> <span class="v svelte-lftxrq"> </span></div>'
  ),
  Sd = b('<div class="checks svelte-lftxrq"></div>'),
  Pd = b('<div class="note svelte-lftxrq"> </div>'),
  Ed = b(
    '<div class="panel svelte-lftxrq"><div class="row svelte-lftxrq"><h3 class="svelte-lftxrq">System Health</h3> <!></div> <!> <!> <!> <div class="actions svelte-lftxrq"><!></div></div>'
  )
function Md(e, t) {
  ;(me(t, !0),
    Ot(() => {
      !ze.report && !ze.loading && !ze.error && Cs()
    }))
  const r = J(() => {
    var x, L
    return (
      ((L = (x = ze.report) == null ? void 0 : x.checks) == null ? void 0 : L.filter(T => !T.ok)) ??
      []
    )
  })
  var s = Ed(),
    n = u(s),
    l = c(u(n), 2)
  {
    var i = x => {
        Qt(x, { inline: !0, size: 16 })
      },
      o = x => {
        qe(x, {
          tone: 'error',
          children: (L, T) => {
            var G = Q('Unavailable')
            p(L, G)
          },
          $$slots: { default: !0 },
        })
      },
      v = x => {
        qe(x, {
          tone: 'success',
          children: (L, T) => {
            var G = Q('All checks passed')
            p(L, G)
          },
          $$slots: { default: !0 },
        })
      },
      d = x => {
        qe(x, {
          tone: 'warning',
          children: (L, T) => {
            var G = Q()
            ;(I(() => M(G, `${a(r).length ?? ''} warning${a(r).length === 1 ? '' : 's'}`)), p(L, G))
          },
          $$slots: { default: !0 },
        })
      },
      h = x => {
        qe(x, {
          tone: 'error',
          children: (L, T) => {
            var G = Q('Critical')
            p(L, G)
          },
          $$slots: { default: !0 },
        })
      }
    q(l, x => {
      var L, T
      ze.loading
        ? x(i)
        : ze.error
          ? x(o, 1)
          : (L = ze.report) != null && L.ok && a(r).length === 0
            ? x(v, 2)
            : (T = ze.report) != null && T.ok
              ? x(d, 3)
              : ze.report && x(h, 4)
    })
  }
  var _ = c(n, 2)
  {
    var f = x => {
      var L = bd(),
        T = u(L)
      ;(I(() =>
        M(
          T,
          `Couldn’t reach the health endpoint (${ze.error ?? ''}). Diagnostics are unavailable — no values are shown rather than guessed.`
        )
      ),
        p(x, L))
    }
    q(_, x => {
      ze.error && x(f)
    })
  }
  var g = c(_, 2)
  {
    var m = x => {
      var L = Sd()
      ;(Ee(
        L,
        21,
        () => ze.report.checks,
        T => T.id,
        (T, G) => {
          var A = kd(),
            U = u(A)
          let W
          var R = u(U),
            E = c(U, 2),
            C = u(E),
            k = c(C)
          {
            var H = z => {
              var j = xd()
              p(z, j)
            }
            q(k, z => {
              !a(G).ok && a(G).critical && z(H)
            })
          }
          var P = c(E, 2),
            N = u(P)
          ;(I(() => {
            ;((W = Fe(U, 1, 'mark svelte-lftxrq', null, W, { ok: a(G).ok, bad: !a(G).ok })),
              M(R, a(G).ok ? '✓' : '✗'),
              M(C, `${a(G).label ?? ''} `),
              _e(P, 'title', a(G).detail),
              M(N, a(G).detail))
          }),
            p(T, A))
        }
      ),
        p(x, L))
    }
    q(g, x => {
      var L, T
      ;(T = (L = ze.report) == null ? void 0 : L.checks) != null && T.length && x(m)
    })
  }
  var y = c(g, 2)
  {
    var w = x => {
      var L = Pd(),
        T = u(L)
      ;(I(() => M(T, ze.report.note)), p(x, L))
    }
    q(y, x => {
      var L
      ;(L = ze.report) != null && L.note && x(w)
    })
  }
  var O = c(y, 2),
    B = u(O)
  ;(Pe(B, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => Cs(),
    children: (x, L) => {
      var T = Q('Re-check')
      p(x, T)
    },
    $$slots: { default: !0 },
  }),
    p(e, s),
    ye())
}
var Ad = b('<button> </button>'),
  zd = b('<div class="seg svelte-1yfbpb7" role="group" aria-label="Time range"></div>')
function Td(e, t) {
  me(t, !0)
  let r = be(t, 'value', 15, 'all')
  const s = [
    { id: 'all', label: 'All' },
    { id: '30d', label: '30d' },
    { id: '7d', label: '7d' },
  ]
  var n = zd()
  ;(Ee(
    n,
    21,
    () => s,
    l => l.id,
    (l, i) => {
      var o = Ad()
      let v
      var d = u(o)
      ;(I(() => {
        ;((v = Fe(o, 1, 'opt svelte-1yfbpb7', null, v, { active: r() === a(i).id })),
          _e(o, 'aria-pressed', r() === a(i).id),
          M(d, a(i).label))
      }),
        ne('click', o, () => {
          var h
          ;(r(a(i).id), (h = t.onchange) == null || h.call(t, a(i).id))
        }),
        p(l, o))
    }
  ),
    p(e, n),
    ye())
}
Ve(['click'])
var Cd = b('<span class="sub svelte-14oot77"> </span>'),
  $d = b(
    '<div class="stat svelte-14oot77"><span class="lbl svelte-14oot77"> </span> <span class="num svelte-14oot77"> </span> <!></div>'
  )
function Id(e, t) {
  var r = $d(),
    s = u(r),
    n = u(s),
    l = c(s, 2),
    i = u(l),
    o = c(l, 2)
  {
    var v = d => {
      var h = Cd(),
        _ = u(h)
      ;(I(() => M(_, t.sub)), p(d, h))
    }
    q(o, d => {
      t.sub && d(v)
    })
  }
  ;(I(() => {
    ;(M(n, t.label), _e(l, 'title', t.value), M(i, t.value))
  }),
    p(e, r))
}
var Ld = b('<div class="grid svelte-9jn9wt"></div>')
function Od(e, t) {
  me(t, !0)
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
  const n = J(() => [
    { label: 'Sessions', value: r(t.report.sessions) },
    { label: 'Messages', value: r(t.report.messages) },
    { label: 'Total tokens', value: r(t.report.totalTokens) },
    { label: 'Active days', value: String(t.report.activeDays) },
    { label: 'Current streak', value: `${t.report.currentStreakDays}d` },
    { label: 'Longest streak', value: `${t.report.longestStreakDays}d` },
    { label: 'Peak hour', value: s(t.report.peakHour) },
    { label: 'Favorite model', value: t.report.favoriteModel },
  ])
  var l = Ld()
  ;(Ee(
    l,
    21,
    () => a(n),
    i => i.label,
    (i, o) => {
      Ne(i, {
        padding: '18px',
        children: (v, d) => {
          Id(v, {
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
    ye())
}
var Rd = b('<span> </span>'),
  Nd = b('<div class="cell svelte-1ryzkww"></div>'),
  Fd = b('<div class="cell empty svelte-1ryzkww"></div>'),
  Dd = b('<div class="col svelte-1ryzkww"></div>'),
  jd = b('<span class="key svelte-1ryzkww"></span>'),
  qd = b(
    '<div class="heat svelte-1ryzkww"><div class="months svelte-1ryzkww"></div> <div class="weeks svelte-1ryzkww"></div> <div class="legend svelte-1ryzkww"><span>Less</span> <!> <span>More</span></div></div>'
  )
function Ud(e, t) {
  me(t, !0)
  const r = J(() => {
      if (t.days.length === 0) return []
      const f = new Date(t.days[0].date + 'T00:00:00').getDay(),
        g = [...Array(f).fill(null), ...t.days],
        m = []
      for (let y = 0; y < g.length; y += 7) m.push(g.slice(y, y + 7))
      return m
    }),
    s = J(() => {
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
  var i = qd(),
    o = u(i)
  Ee(
    o,
    21,
    () => a(r),
    Pr,
    (_, f, g) => {
      const m = J(() => a(s).find(B => B.col === g))
      var y = Rd()
      let w
      var O = u(y)
      ;(I(() => {
        ;((w = Fe(y, 1, 'month svelte-1ryzkww', null, w, { has: !!a(m) })),
          M(O, a(m) ? a(m).label : ''))
      }),
        p(_, y))
    }
  )
  var v = c(o, 2)
  Ee(
    v,
    21,
    () => a(r),
    Pr,
    (_, f) => {
      var g = Dd()
      ;(Ee(
        g,
        21,
        () => a(f),
        Pr,
        (m, y) => {
          var w = it(),
            O = ee(w)
          {
            var B = L => {
                var T = Nd()
                ;(I(
                  (G, A) => {
                    ;(et(T, `background:${G ?? ''}`), _e(T, 'title', A))
                  },
                  [() => l(a(y).intensity), () => `${a(y).date} · ${n(a(y).count)} tokens`]
                ),
                  p(L, T))
              },
              x = L => {
                var T = Fd()
                p(L, T)
              }
            q(O, L => {
              a(y) ? L(B) : L(x, -1)
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
  ;(Ee(
    h,
    16,
    () => [0, 1, 2, 3, 4],
    _ => _,
    (_, f) => {
      var g = jd()
      ;(I(m => et(g, `background:${m ?? ''}`), [() => l(f)]), p(_, g))
    }
  ),
    p(e, i),
    ye())
}
var Bd = b('<span> </span>'),
  Hd = b('<div class="gridline svelte-1ozbyr9"></div>'),
  Gd = b(
    '<div class="bar-col svelte-1ozbyr9"><div class="bar-area svelte-1ozbyr9"><div></div></div> <div class="xlabel svelte-1ozbyr9"><!></div></div>'
  ),
  Wd = b('<div class="scroll-hint svelte-1ozbyr9">→ scroll left for older days</div>'),
  Kd = b(
    '<div class="chart svelte-1ozbyr9"><div class="yaxis svelte-1ozbyr9" aria-hidden="true"></div> <div class="scroll svelte-1ozbyr9"><div class="bars svelte-1ozbyr9"><div class="gridlines svelte-1ozbyr9"></div> <!></div> <!></div></div>'
  )
function Vd(e, t) {
  me(t, !0)
  const r = J(() => Math.max(1, ...t.data.map(x => x.tokens)))
  function s(x) {
    if (x <= 0) return 1
    const L = Math.floor(Math.log10(x)),
      T = Math.pow(10, L),
      G = x / T
    let A
    return (G <= 1 ? (A = 1) : G <= 2 ? (A = 2) : G <= 5 ? (A = 5) : (A = 10), A * T)
  }
  const n = J(() => s(a(r))),
    l = J(() => Array.from({ length: 5 }, (x, L) => a(n) * (1 - L / 4)))
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
    const L = new Date(t.data[x - 1].date + 'T00:00:00').getMonth(),
      T = new Date(t.data[x].date + 'T00:00:00').getMonth()
    return L !== T
  }
  let d = re(null)
  const h = J(() => (a(d) ? a(d).scrollWidth - a(d).clientWidth > 8 : !1))
  Ot(() => {
    t.data
    const x = a(d)
    x && x.scrollWidth > x.clientWidth && (x.scrollLeft = x.scrollWidth)
  })
  var _ = Kd(),
    f = u(_)
  Ee(
    f,
    20,
    () => a(l),
    x => x,
    (x, L) => {
      var T = Bd(),
        G = u(T)
      ;(I(A => M(G, A), [() => i(L)]), p(x, T))
    }
  )
  var g = c(f, 2),
    m = u(g),
    y = u(m)
  Ee(
    y,
    20,
    () => a(l),
    x => x,
    (x, L) => {
      var T = Hd()
      p(x, T)
    }
  )
  var w = c(y, 2)
  Ee(
    w,
    19,
    () => t.data,
    x => x.date,
    (x, L, T) => {
      var G = Gd(),
        A = u(G),
        U = u(A)
      let W
      var R = c(A, 2),
        E = u(R)
      {
        var C = H => {
            var P = Q()
            ;(I(N => M(P, N), [() => o(a(L).date)]), p(H, P))
          },
          k = J(() => v(a(T)))
        q(E, H => {
          a(k) && H(C)
        })
      }
      ;(I(
        H => {
          ;(_e(G, 'title', H),
            (W = Fe(U, 1, 'bar svelte-1ozbyr9', null, W, { active: a(L).tokens > 0 })),
            et(U, `height:${(a(L).tokens / a(n)) * 100}%`))
        },
        [() => `${a(L).date} · ${i(a(L).tokens)} tokens`]
      ),
        p(x, G))
    }
  )
  var O = c(m, 2)
  {
    var B = x => {
      var L = Wd()
      p(x, L)
    }
    q(O, x => {
      a(h) && x(B)
    })
  }
  ;(ml(
    g,
    x => $(d, x),
    () => a(d)
  ),
    p(e, _),
    ye())
}
var Yd = b('<span> </span>'),
  Jd = b('<span class="app-badge svelte-1ca0tub"> </span>'),
  Xd = b(
    '<div class="row svelte-1ca0tub"><span class="dot svelte-1ca0tub"></span> <div class="id svelte-1ca0tub"><div class="name svelte-1ca0tub"> </div> <div class="meta svelte-1ca0tub"><!></div></div> <div class="nums svelte-1ca0tub"><span class="in svelte-1ca0tub"> </span> <span class="out svelte-1ca0tub"> </span></div> <div class="share svelte-1ca0tub"><div class="track svelte-1ca0tub"><div class="fill svelte-1ca0tub"></div></div> <span class="pct svelte-1ca0tub"> </span></div></div>'
  ),
  Zd = b('<div class="list svelte-1ca0tub"></div>')
function Qd(e, t) {
  me(t, !0)
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
  const n = J(() => s(t.models))
  var l = Zd()
  ;(Ee(
    l,
    23,
    () => t.models,
    i => i.provider + i.model,
    (i, o, v) => {
      var d = Xd(),
        h = u(d),
        _ = c(h, 2),
        f = u(_),
        g = u(f),
        m = c(f, 2),
        y = u(m)
      {
        var w = C => {
            var k = it(),
              H = ee(k)
            ;(Ee(
              H,
              16,
              () => a(o).apps,
              P => P,
              (P, N) => {
                var z = Yd()
                let j
                var D = u(z)
                ;(I(
                  F => {
                    ;((j = Fe(z, 1, 'app-badge svelte-1ca0tub', null, j, F)), M(D, N))
                  },
                  [() => ({ agy: N.toLowerCase() === 'antigravity' })]
                ),
                  p(P, z))
              }
            ),
              p(C, k))
          },
          O = C => {
            var k = Jd(),
              H = u(k)
            ;(I(() => M(H, a(o).app)), p(C, k))
          }
        q(y, C => {
          var k
          ;(k = a(o).apps) != null && k.length ? C(w) : C(O, -1)
        })
      }
      var B = c(_, 2),
        x = u(B),
        L = u(x),
        T = c(x, 2),
        G = u(T),
        A = c(B, 2),
        U = u(A),
        W = u(U),
        R = c(U, 2),
        E = u(R)
      ;(I(
        (C, k) => {
          ;(et(h, `background:${a(o).color ?? ''}`),
            _e(f, 'title', `${a(o).provider ?? ''}: ${a(o).model ?? ''}`),
            M(g, `${a(o).provider ?? ''}: ${a(o).model ?? ''}`),
            M(L, `↓ ${C ?? ''}`),
            M(G, `↑ ${k ?? ''}`),
            et(W, `width:${a(n)[a(v)] ?? ''}%; background:${a(o).color ?? ''}`),
            M(E, `${a(n)[a(v)] ?? ''}%`))
        },
        [() => r(a(o).inputTokens), () => r(a(o).outputTokens)]
      ),
        p(i, d))
    }
  ),
    p(e, l),
    ye())
}
var ec = b('<p class="empty svelte-1ev3km3">No requests recorded in this range.</p>'),
  tc = b('<span class="tick svelte-1ev3km3"> </span>'),
  rc = b('<span class="tick svelte-1ev3km3"></span>'),
  ac = b(
    '<div><div class="track svelte-1ev3km3"><div class="bar svelte-1ev3km3"></div></div> <!></div>'
  ),
  sc = b(
    '<div class="bars svelte-1ev3km3" role="img" aria-label="Requests by hour of day (UTC)"></div> <p class="note svelte-1ev3km3">Busiest at <strong class="svelte-1ev3km3"> </strong> </p>',
    1
  ),
  nc = b('<div class="wrap svelte-1ev3km3"><!></div>')
function lc(e, t) {
  me(t, !0)
  const r = J(() => Math.max(1, ...t.hourly)),
    s = J(() => t.hourly.reduce((d, h) => d + h, 0))
  function n(d) {
    return d === 0 ? '12a' : d === 12 ? '12p' : d < 12 ? `${d}a` : `${d - 12}p`
  }
  var l = nc(),
    i = u(l)
  {
    var o = d => {
        var h = ec()
        p(d, h)
      },
      v = d => {
        var h = sc(),
          _ = ee(h)
        Ee(
          _,
          21,
          () => t.hourly,
          Pr,
          (w, O, B) => {
            var x = ac()
            let L
            var T = u(x),
              G = u(T)
            let A
            var U = c(T, 2)
            {
              var W = E => {
                  var C = tc(),
                    k = u(C)
                  ;(I(H => M(k, H), [() => n(B)]), p(E, C))
                },
                R = E => {
                  var C = rc()
                  p(E, C)
                }
              q(U, E => {
                B % 3 === 0 ? E(W) : E(R, -1)
              })
            }
            ;(I(
              (E, C) => {
                ;((L = Fe(x, 1, 'col svelte-1ev3km3', null, L, {
                  peak: B === t.peakHour && a(O) > 0,
                })),
                  _e(G, 'title', `${E ?? ''} · ${a(O) ?? ''} request${a(O) === 1 ? '' : 's'}`),
                  (A = et(G, '', A, C)))
              },
              [
                () => n(B),
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
        ;(I(
          w => {
            ;(M(m, w), M(y, ` UTC · ${a(s) ?? ''} request${a(s) === 1 ? '' : 's'}`))
          },
          [() => n(t.peakHour)]
        ),
          p(d, h))
      }
    q(i, d => {
      a(s) === 0 ? d(o) : d(v, -1)
    })
  }
  ;(p(e, l), ye())
}
var ic = b('<p class="empty svelte-1tsh0oh">No app usage recorded in this range.</p>'),
  oc = b(
    '<div class="row svelte-1tsh0oh"><span class="dot svelte-1tsh0oh"></span> <span class="name svelte-1tsh0oh"> </span> <div class="meter svelte-1tsh0oh" aria-hidden="true"><div class="fill svelte-1tsh0oh"></div></div> <span class="pct svelte-1tsh0oh"> </span> <span class="tok svelte-1tsh0oh"> </span></div>'
  ),
  vc = b(
    '<div class="split svelte-1tsh0oh"><div class="split-bar svelte-1tsh0oh" aria-hidden="true"><div class="in svelte-1tsh0oh"></div> <div class="out svelte-1tsh0oh"></div></div> <div class="legend svelte-1tsh0oh"><span class="svelte-1tsh0oh"><i class="sw in svelte-1tsh0oh"></i> </span> <span class="svelte-1tsh0oh"><i class="sw out svelte-1tsh0oh"></i> </span></div></div>'
  ),
  dc = b('<div class="rows svelte-1tsh0oh"></div> <!>', 1),
  cc = b('<div class="wrap svelte-1tsh0oh"><!></div>')
function uc(e, t) {
  me(t, !0)
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
    s = J(() => t.inputTokens + t.outputTokens)
  function n(d) {
    return d >= 1e9
      ? `${(d / 1e9).toFixed(1)}B`
      : d >= 1e6
        ? `${(d / 1e6).toFixed(1)}M`
        : d >= 1e3
          ? `${(d / 1e3).toFixed(1)}k`
          : String(d)
  }
  var l = cc(),
    i = u(l)
  {
    var o = d => {
        var h = ic()
        p(d, h)
      },
      v = d => {
        var h = dc(),
          _ = ee(h)
        Ee(
          _,
          21,
          () => t.apps,
          m => m.app,
          (m, y) => {
            var w = oc(),
              O = u(w)
            let B
            var x = c(O, 2),
              L = u(x),
              T = c(x, 2),
              G = u(T)
            let A
            var U = c(T, 2),
              W = u(U),
              R = c(U, 2),
              E = u(R)
            ;(I(
              (C, k, H) => {
                ;((B = et(O, '', B, { background: a(y).color })),
                  M(L, r[a(y).app] ?? a(y).app),
                  (A = et(G, '', A, C)),
                  M(W, `${k ?? ''}%`),
                  _e(R, 'title', `${a(y).messages ?? ''} request${a(y).messages === 1 ? '' : 's'}`),
                  M(E, H))
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
            var y = vc(),
              w = u(y),
              O = u(w)
            let B
            var x = c(O, 2)
            let L
            var T = c(w, 2),
              G = u(T),
              A = c(u(G)),
              U = c(G, 2),
              W = c(u(U))
            ;(I(
              (R, E) => {
                ;((B = et(O, '', B, { width: `${(t.inputTokens / a(s)) * 100}%` })),
                  (L = et(x, '', L, { width: `${(t.outputTokens / a(s)) * 100}%` })),
                  M(A, `Prompt ${R ?? ''}`),
                  M(W, `Completion ${E ?? ''}`))
              },
              [() => n(t.inputTokens), () => n(t.outputTokens)]
            ),
              p(m, y))
          }
          q(f, m => {
            a(s) > 0 && m(g)
          })
        }
        p(d, h)
      }
    q(i, d => {
      t.apps.length === 0 ? d(o) : d(v, -1)
    })
  }
  ;(p(e, l), ye())
}
var fc = b(
    '<span class="live svelte-1thed0a" title="Receiving live updates"><i class="svelte-1thed0a"></i>Live</span>'
  ),
  pc = b('<span class="offline svelte-1thed0a">Offline</span>'),
  hc = b(
    '<span class="empty svelte-1thed0a" title="No usage recorded yet — use anygate with a provider to populate real stats">No data yet</span>'
  ),
  _c = b('<div class="loading svelte-1thed0a"><!></div>'),
  gc = b(
    '<div class="notice svelte-1thed0a"><p class="notice-title svelte-1thed0a">Can’t load real analytics</p> <p class="notice-body svelte-1thed0a"> </p></div>'
  ),
  mc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Activity</h3><span class="hint svelte-1thed0a"> </span></div> <!>',
    1
  ),
  yc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">When you work</h3><span class="hint svelte-1thed0a">Requests by hour (UTC)</span></div> <!>',
    1
  ),
  wc = b('<div class="section svelte-1thed0a"><!></div> <!> <!>', 1),
  bc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Token volume</h3><span class="hint svelte-1thed0a">Total tokens per day</span></div> <!>',
    1
  ),
  xc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Model breakdown</h3><span class="hint svelte-1thed0a">Share of total usage</span></div> <!>',
    1
  ),
  kc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">By app</h3><span class="hint svelte-1thed0a">Which launcher spent the tokens</span></div> <!>',
    1
  ),
  Sc = b('<!> <!> <!>', 1),
  Pc = b('<p class="muted svelte-1thed0a">No apps detected. Add a provider first.</p>'),
  Ec = b(
    '<p class="launch-note svelte-1thed0a">Open your agents with anygate models pre-wired, or send your whole favorites catalog into the app switcher.</p> <div class="quick svelte-1thed0a"></div>',
    1
  ),
  Mc = b(
    '<div class="sec-head svelte-1thed0a"><h3 class="svelte-1thed0a">Apps &amp; Launch</h3></div> <!>',
    1
  ),
  Ac = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Providers</span></div>'
  ),
  zc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Models</span></div>'
  ),
  Tc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Favorites</span></div>'
  ),
  Cc = b(
    '<div class="stat svelte-1thed0a"><span class="num svelte-1thed0a"> </span><span class="lbl svelte-1thed0a">Apps ready</span> <!></div>'
  ),
  $c = b(
    '<div class="dash svelte-1thed0a"><div class="head svelte-1thed0a"><div class="title svelte-1thed0a"><div class="title-row svelte-1thed0a"><h2 class="svelte-1thed0a">Dashboard</h2> <!> <!> <!></div> <p class="svelte-1thed0a"> </p></div> <!></div> <!> <!> <div class="cols mt svelte-1thed0a"><!> <!></div> <div class="grid mt svelte-1thed0a"><!> <!> <!> <!></div></div>'
  )
function Ic(e, t) {
  ;(me(t, !0), be(t, 'showSampleBadge', 3, !0))
  let r = re('overview')
  const s = J(() => Oe.list.reduce((z, j) => z + j.enrichedModels.length, 0)),
    n = J(() => Oe.list.length),
    l = J(() => at.list.filter(z => z.installed))
  Ot(() => {
    gn(xe.range)
  })
  const i = 1500
  Vs(() => {
    let z = null
    const j = $l(D => {
      D.type === 'usage' &&
        (z && clearTimeout(z),
        (z = setTimeout(() => {
          gn(xe.range)
        }, i)))
    })
    return () => {
      ;(z && clearTimeout(z), j())
    }
  })
  var o = $c(),
    v = u(o),
    d = u(v),
    h = u(d),
    _ = c(u(h), 2)
  {
    var f = z => {
      var j = fc()
      p(z, j)
    }
    q(_, z => {
      Ht.connected && z(f)
    })
  }
  var g = c(_, 2)
  {
    var m = z => {
      var j = pc()
      ;(I(() => _e(j, 'title', xe.error)), p(z, j))
    }
    q(g, z => {
      xe.error && z(m)
    })
  }
  var y = c(g, 2)
  {
    var w = z => {
      var j = hc()
      p(z, j)
    }
    q(y, z => {
      !xe.error && !xe.hasData && z(w)
    })
  }
  var O = c(h, 2),
    B = u(O),
    x = c(d, 2)
  Td(x, {
    get value() {
      return xe.range
    },
    onchange: z => (xe.range = z),
  })
  var L = c(v, 2)
  Dl(L, {
    tabs: [
      { id: 'overview', label: 'Overview' },
      { id: 'models', label: 'Models' },
    ],
    get active() {
      return a(r)
    },
    set active(z) {
      $(r, z, !0)
    },
  })
  var T = c(L, 2)
  {
    var G = z => {
        var j = _c(),
          D = u(j)
        ;(Qt(D, { label: 'Loading analytics…' }), p(z, j))
      },
      A = z => {
        var j = gc(),
          D = c(u(j), 2),
          F = u(D)
        ;(I(() => M(F, xe.error)), p(z, j))
      },
      U = z => {
        var j = it(),
          D = ee(j)
        {
          var F = V => {
              var Y = wc(),
                X = ee(Y),
                te = u(X)
              Od(te, {
                get report() {
                  return xe.report
                },
              })
              var le = c(X, 2)
              Ne(le, {
                padding: '20px',
                class: 'mt',
                children: (ie, ue) => {
                  var Z = mc(),
                    oe = ee(Z),
                    Se = c(u(oe)),
                    ve = u(Se),
                    Me = c(oe, 2)
                  ;(Ud(Me, {
                    get days() {
                      return xe.report.heatmap
                    },
                  }),
                    I(() =>
                      M(
                        ve,
                        `Daily activity over ${(xe.range === 'all' ? 'the last year' : xe.range) ?? ''}`
                      )
                    ),
                    p(ie, Z))
                },
                $$slots: { default: !0 },
              })
              var ae = c(le, 2)
              ;(Ne(ae, {
                padding: '20px',
                class: 'mt',
                children: (ie, ue) => {
                  var Z = yc(),
                    oe = c(ee(Z), 2)
                  ;(lc(oe, {
                    get hourly() {
                      return xe.report.hourly
                    },
                    get peakHour() {
                      return xe.report.peakHour
                    },
                  }),
                    p(ie, Z))
                },
                $$slots: { default: !0 },
              }),
                p(V, Y))
            },
            K = V => {
              var Y = Sc(),
                X = ee(Y)
              Ne(X, {
                padding: '20px',
                class: 'mt',
                children: (ae, ie) => {
                  var ue = bc(),
                    Z = c(ee(ue), 2)
                  ;(Vd(Z, {
                    get data() {
                      return xe.report.dailyTokens
                    },
                  }),
                    p(ae, ue))
                },
                $$slots: { default: !0 },
              })
              var te = c(X, 2)
              Ne(te, {
                padding: '20px',
                class: 'mt',
                children: (ae, ie) => {
                  var ue = xc(),
                    Z = c(ee(ue), 2)
                  ;(Qd(Z, {
                    get models() {
                      return xe.report.models
                    },
                  }),
                    p(ae, ue))
                },
                $$slots: { default: !0 },
              })
              var le = c(te, 2)
              ;(Ne(le, {
                padding: '20px',
                class: 'mt',
                children: (ae, ie) => {
                  var ue = kc(),
                    Z = c(ee(ue), 2)
                  ;(uc(Z, {
                    get apps() {
                      return xe.report.apps
                    },
                    get inputTokens() {
                      return xe.report.inputTokens
                    },
                    get outputTokens() {
                      return xe.report.outputTokens
                    },
                  }),
                    p(ae, ue))
                },
                $$slots: { default: !0 },
              }),
                p(V, Y))
            }
          q(D, V => {
            a(r) === 'overview' ? V(F) : V(K, -1)
          })
        }
        p(z, j)
      }
    q(T, z => {
      xe.loading && !xe.report ? z(G) : xe.error ? z(A, 1) : xe.report && z(U, 2)
    })
  }
  var W = c(T, 2),
    R = u(W)
  Ne(R, {
    padding: '20px',
    children: (z, j) => {
      var D = Mc(),
        F = c(ee(D), 2)
      {
        var K = X => {
            Qt(X, { label: 'Loading apps…' })
          },
          V = X => {
            var te = Pc()
            p(X, te)
          },
          Y = X => {
            var te = Ec(),
              le = c(ee(te), 2)
            ;(Ee(
              le,
              21,
              () => a(l),
              ae => ae.id,
              (ae, ie) => {
                Pe(ae, {
                  variant: 'subtle',
                  onclick: () => ur('apps'),
                  children: (ue, Z) => {
                    var oe = Q()
                    ;(I(() => M(oe, a(ie).name)), p(ue, oe))
                  },
                  $$slots: { default: !0 },
                })
              }
            ),
              p(X, te))
          }
        q(F, X => {
          at.loading ? X(K) : a(l).length === 0 ? X(V, 1) : X(Y, -1)
        })
      }
      p(z, D)
    },
    $$slots: { default: !0 },
  })
  var E = c(R, 2)
  Md(E, {})
  var C = c(W, 2),
    k = u(C)
  Ne(k, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('providers'),
    children: (z, j) => {
      var D = Ac(),
        F = u(D),
        K = u(F)
      ;(I(() => M(K, a(n))), p(z, D))
    },
    $$slots: { default: !0 },
  })
  var H = c(k, 2)
  Ne(H, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('models'),
    children: (z, j) => {
      var D = zc(),
        F = u(D),
        K = u(F)
      ;(I(() => M(K, a(s))), p(z, D))
    },
    $$slots: { default: !0 },
  })
  var P = c(H, 2)
  Ne(P, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('models'),
    children: (z, j) => {
      var D = Tc(),
        F = u(D),
        K = u(F)
      ;(I(() => M(K, ke.general.length + ke.agy.length)), p(z, D))
    },
    $$slots: { default: !0 },
  })
  var N = c(P, 2)
  ;(Ne(N, {
    hover: !0,
    padding: '18px',
    onclick: () => ur('apps'),
    children: (z, j) => {
      var D = Cc(),
        F = u(D),
        K = u(F),
        V = c(F, 3)
      {
        var Y = X => {
          qe(X, {
            tone: 'success',
            children: (te, le) => {
              var ae = Q('server on')
              p(te, ae)
            },
            $$slots: { default: !0 },
          })
        }
        q(V, X => {
          var te
          ;(te = Qe.status) != null && te.running && X(Y)
        })
      }
      ;(I(() => M(K, a(l).length)), p(z, D))
    },
    $$slots: { default: !0 },
  }),
    I(() =>
      M(
        B,
        `Usage analytics for your local gateway · ${(xe.range === 'all' ? 'all time' : xe.range) ?? ''}`
      )
    ),
    p(e, o),
    ye())
}
const mn = {
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
  Lc = {
    anthropic:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a1 1 0 0 1 1 1v3.2l6.5-3.75a1 1 0 0 1 1.5.87V11l3.5-2.02a1 1 0 0 1 1 1.73L21.5 13l3.5 2.02a1 1 0 0 1-1 1.73L20 14.98V22a1 1 0 0 1-1.5.87L12 19.12V23a1 1 0 0 1-2 0v-3.88L3.5 22.87A1 1 0 0 1 2 22v-7.02L-1.5 17a1 1 0 0 1-1-1.73L2.5 13l-3.5-2.02a1 1 0 0 1 1-1.73L4 9.98V2a1 1 0 0 1 1.5-.87L12 4.8V3a1 1 0 0 1 1-1z" transform="translate(1 1)"/></svg>',
    openai:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a4 4 0 0 0-.7-2.3l.1-.1a3.7 3.7 0 0 0-5.2-5.2l-.1.1A4 4 0 0 0 12 2l-.1.1A3.7 3.7 0 0 0 7.1 4.7l-.1-.1a3.7 3.7 0 0 0-5.2 5.2l.1.1A4 4 0 0 0 2 12l-.1.1A3.7 3.7 0 0 0 4.7 16.9l.1-.1A4 4 0 0 0 12 22l.1-.1A3.7 3.7 0 0 0 16.9 19.3l.1.1a3.7 3.7 0 0 0 5.2-5.2l-.1-.1A4 4 0 0 0 22 12zM12 18.5a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13z"/></svg>',
    google:
      '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 11v3.6h5.1a4.4 4.4 0 0 1-1.9 2.9l3 2.3c1.7-1.6 2.8-4 2.8-6.9 0-.7-.1-1.3-.2-1.9zM6.5 13.5a4.5 4.5 0 0 1 0-3l-3-2.3a8 8 0 0 0 0 7.6zM12 6.2c1.5 0 2.8.5 3.8 1.5l2.9-2.9A8 8 0 0 0 3.5 8.7l3 2.3A4.5 4.5 0 0 1 12 6.2z"/></svg>',
  }
function Oc(e) {
  const t = e.toLowerCase()
  return { svg: Lc[t], gradient: mn[t] ?? mn.default }
}
var Rc = b('<span class="svg svelte-1va9fof"></span>'),
  Nc = b('<span class="mono svelte-1va9fof"> </span>'),
  Fc = b('<span class="logo svelte-1va9fof"><!></span>')
function Zs(e, t) {
  me(t, !0)
  let r = be(t, 'size', 3, 34)
  const s = J(() => Oc(t.id)),
    n = J(() => t.id.slice(0, 1).toUpperCase())
  var l = Fc(),
    i = u(l)
  {
    var o = d => {
        var h = Rc()
        ;(xo(h, () => a(s).svg, !0),
          I(() => et(h, `width:${r() * 0.55}px;height:${r() * 0.55}px`)),
          p(d, h))
      },
      v = d => {
        var h = Nc(),
          _ = u(h)
        ;(I(() => {
          ;(et(h, `font-size:${r() * 0.42}px`), M(_, a(n)))
        }),
          p(d, h))
      }
    q(i, d => {
      a(s).svg ? d(o) : d(v, -1)
    })
  }
  ;(I(() =>
    et(
      l,
      `width:${r() ?? ''}px;height:${r() ?? ''}px;background:linear-gradient(135deg,${a(s).gradient[0] ?? ''},${a(s).gradient[1] ?? ''});`
    )
  ),
    p(e, l),
    ye())
}
var Dc = b('<span class="chip svelte-1p75598"> </span>'),
  jc = b('<span class="chip more svelte-1p75598"> </span>'),
  qc = b('<span class="chip empty svelte-1p75598">no models yet</span>'),
  Uc = b(
    '<a class="keylink svelte-1p75598" target="_blank" rel="noopener noreferrer">Get key →</a>'
  ),
  Bc = b('<!> <!>', 1),
  Hc = Ws(
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"></path></svg>'
  ),
  Gc = b(
    '<div class="card svelte-1p75598"><div class="head svelte-1p75598"><!> <div class="meta svelte-1p75598"><div class="name svelte-1p75598"> </div> <div class="sub svelte-1p75598"> <span class="id svelte-1p75598"> </span></div></div> <div class="status"><!></div></div> <div class="models svelte-1p75598"><!> <!> <!></div> <div class="actions svelte-1p75598"><!> <!></div></div>'
  )
function Wc(e, t) {
  me(t, !0)
  var r = Gc(),
    s = u(r),
    n = u(s)
  Zs(n, {
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
        qe(k, {
          tone: 'success',
          children: (H, P) => {
            var N = Q()
            ;(I(() => M(N, t.provider.freeAccess ? 'Free access' : 'Key set')), p(H, N))
          },
          $$slots: { default: !0 },
        })
      },
      y = k => {
        qe(k, {
          tone: 'accent',
          children: (H, P) => {
            var N = Q('OAuth')
            p(H, N)
          },
          $$slots: { default: !0 },
        })
      },
      w = k => {
        qe(k, {
          tone: 'warning',
          children: (H, P) => {
            var N = Q('No key')
            p(H, N)
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
  var O = c(s, 2),
    B = u(O)
  Ee(
    B,
    17,
    () => t.provider.enrichedModels.slice(0, 5),
    k => k.id,
    (k, H) => {
      var P = Dc(),
        N = u(P)
      ;(I(() => {
        ;(_e(P, 'title', a(H).id), M(N, a(H).name ?? a(H).id))
      }),
        p(k, P))
    }
  )
  var x = c(B, 2)
  {
    var L = k => {
      var H = jc(),
        P = u(H)
      ;(I(() => M(P, `+${t.provider.enrichedModels.length - 5}`)), p(k, H))
    }
    q(x, k => {
      t.provider.enrichedModels.length > 5 && k(L)
    })
  }
  var T = c(x, 2)
  {
    var G = k => {
      var H = qc()
      p(k, H)
    }
    q(T, k => {
      t.provider.enrichedModels.length === 0 && k(G)
    })
  }
  var A = c(O, 2),
    U = u(A)
  {
    var W = k => {
        Pe(k, {
          size: 'sm',
          variant: 'subtle',
          onclick: () => t.onOAuth(t.provider),
          children: (H, P) => {
            var N = Q('Sign in')
            p(H, N)
          },
          $$slots: { default: !0 },
        })
      },
      R = k => {
        var H = Bc(),
          P = ee(H)
        Pe(P, {
          size: 'sm',
          variant: 'primary',
          onclick: () => t.onAddKey(t.provider),
          children: (j, D) => {
            var F = Q('Add key')
            p(j, F)
          },
          $$slots: { default: !0 },
        })
        var N = c(P, 2)
        {
          var z = j => {
            var D = Uc()
            ;(I(() => _e(D, 'href', t.provider.signupUrl)), p(j, D))
          }
          q(N, j => {
            t.provider.signupUrl && j(z)
          })
        }
        p(k, H)
      },
      E = k => {
        Pe(k, {
          size: 'sm',
          variant: 'ghost',
          onclick: () => El(t.provider.id),
          children: (H, P) => {
            var N = Q('Refresh')
            p(H, N)
          },
          $$slots: { default: !0 },
        })
      }
    q(U, k => {
      t.provider.authType === 'oauth'
        ? k(W)
        : !t.provider.hasKey && !t.provider.freeAccess
          ? k(R, 1)
          : k(E, -1)
    })
  }
  var C = c(U, 2)
  ;(Fl(C, {
    title: 'Delete provider',
    onclick: () => t.onDelete(t.provider),
    children: (k, H) => {
      var P = Hc()
      p(k, P)
    },
    $$slots: { default: !0 },
  }),
    I(() => {
      ;(M(o, t.provider.name),
        M(d, `${t.provider.modelCount ?? ''} models · `),
        M(_, t.provider.id))
    }),
    p(e, r),
    ye())
}
var Kc = b('<p style="color:var(--text-3)">Loading templates…</p>'),
  Vc = b('<option> </option>'),
  Yc = b('<span style="color:var(--text-3)">(optional)</span>'),
  Jc = b(
    '<a class="hint-link svelte-263z8" target="_blank" rel="noopener noreferrer">Get an API key →</a>'
  ),
  Xc = b('<span class="signup-note svelte-263z8"> </span>'),
  Zc = b('<span class="lbl svelte-263z8" style="margin-top:14px">API key<!></span> <!> <!> <!>', 1),
  Qc = b('<span class="lbl svelte-263z8" style="margin-top:14px"> </span> <!>', 1),
  eu = b(
    '<span class="lbl svelte-263z8" style="margin-top:14px">Display name</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Base URL</span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">API key <span style="color:var(--text-3)">(optional)</span></span> <!> <span class="lbl svelte-263z8" style="margin-top:14px">Custom headers <span style="color:var(--text-3)">(optional)</span></span> <textarea class="hdrs svelte-263z8" rows="3" placeholder="One per line, e.g. User-Agent: claude-cli/1.0.0 (external, cli) x-app: cli"></textarea> <span class="hint-txt svelte-263z8">Some endpoints only accept requests from a recognized client. Add headers like <code class="svelte-263z8">User-Agent</code> here if the provider requires them.</span>',
    1
  ),
  tu = b(
    '<span class="lbl svelte-263z8">Provider</span> <select class="sel svelte-263z8"><option>Select a provider…</option><!></select> <!> <!> <!> <div class="row svelte-263z8" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  )
function ru(e, t) {
  me(t, !0)
  let r = re(Ke([])),
    s = re(!1),
    n = re(null),
    l = re(''),
    i = re(''),
    o = re(''),
    v = re(''),
    d = re(!1)
  function h(w) {
    const O = {}
    for (const B of w.split(`
`)) {
      const x = B.indexOf(':')
      if (x === -1) continue
      const L = B.slice(0, x).trim(),
        T = B.slice(x + 1).trim()
      L && T && (O[L] = T)
    }
    return O
  }
  async function _() {
    $(s, !0)
    try {
      $(r, (await Wo()).templates, !0)
    } catch (w) {
      he(String(w), 'error')
    }
    $(s, !1)
  }
  Ot(() => {
    t.open && (_(), $(n, null), $(l, ''), $(i, ''), $(o, ''), $(v, ''))
  })
  const f = J(() => a(r).find(w => w.id === a(n))),
    g = J(() => a(n) === '__custom_openai__'),
    m = J(() => a(n) === '__custom_anthropic__')
  async function y() {
    if (a(n)) {
      $(d, !0)
      try {
        let w
        if (a(g) || a(m)) {
          const O = h(a(v))
          w = await Vo({
            kind: a(g) ? 'openai' : 'anthropic',
            displayName: a(o),
            baseUrl: a(i),
            apiKey: a(l),
            ...(Object.keys(O).length > 0 ? { headers: O } : {}),
          })
        } else w = await Ko(a(n), a(l) || void 0, a(i) || void 0)
        w.ok
          ? (he(`Added ${w.name ?? a(n)}`, 'success'), t.onadded(), t.onclose())
          : he(w.error ?? 'Failed to add provider', 'error')
      } catch (w) {
        he(w instanceof Error ? w.message : String(w), 'error')
      }
      $(d, !1)
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
      var B = it(),
        x = ee(B)
      {
        var L = G => {
            var A = Kc()
            p(G, A)
          },
          T = G => {
            var A = tu(),
              U = c(ee(A), 2),
              W = u(U)
            W.value = (W.__value = null) ?? ''
            var R = c(W)
            Ee(
              R,
              17,
              () => a(r),
              F => F.id,
              (F, K) => {
                var V = Vc(),
                  Y = u(V),
                  X = {}
                ;(I(() => {
                  ;(M(
                    Y,
                    `${a(K).name ?? ''}${a(K).anonymousFreeModels ? ' (free)' : ''}${a(K).subscriptionRisk ? ' ⚠' : ''}`
                  ),
                    X !== (X = a(K).id) && (V.value = (V.__value = a(K).id) ?? ''))
                }),
                  p(F, V))
              }
            )
            var E = c(U, 2)
            {
              var C = F => {
                var K = Zc(),
                  V = ee(K),
                  Y = c(u(V))
                {
                  var X = Z => {
                    var oe = Yc()
                    p(Z, oe)
                  }
                  q(Y, Z => {
                    a(f).apiKeyOptional && Z(X)
                  })
                }
                var te = c(V, 2)
                {
                  let Z = J(() =>
                    a(f).apiKeyOptional
                      ? 'Leave blank for a local server without auth'
                      : 'Paste your key'
                  )
                  ar(te, {
                    get placeholder() {
                      return a(Z)
                    },
                    get value() {
                      return a(l)
                    },
                    set value(oe) {
                      $(l, oe, !0)
                    },
                  })
                }
                var le = c(te, 2)
                {
                  var ae = Z => {
                    var oe = Jc()
                    ;(I(() => _e(oe, 'href', a(f).signupUrl)), p(Z, oe))
                  }
                  q(le, Z => {
                    a(f).signupUrl && Z(ae)
                  })
                }
                var ie = c(le, 2)
                {
                  var ue = Z => {
                    var oe = Xc(),
                      Se = u(oe)
                    ;(I(() => M(Se, a(f).signupNote)), p(Z, oe))
                  }
                  q(ie, Z => {
                    a(f).signupNote && Z(ue)
                  })
                }
                p(F, K)
              }
              q(E, F => {
                a(f) && a(f).authType === 'api' && !a(g) && !a(m) && F(C)
              })
            }
            var k = c(E, 2)
            {
              var H = F => {
                var K = Qc(),
                  V = ee(K),
                  Y = u(V),
                  X = c(V, 2)
                {
                  let te = J(() => a(f).defaultBaseUrl ?? 'https://')
                  ar(X, {
                    get placeholder() {
                      return a(te)
                    },
                    get value() {
                      return a(i)
                    },
                    set value(le) {
                      $(i, le, !0)
                    },
                  })
                }
                ;(I(() => M(Y, a(f).urlPrompt)), p(F, K))
              }
              q(k, F => {
                var K
                ;(K = a(f)) != null && K.urlPrompt && F(H)
              })
            }
            var P = c(k, 2)
            {
              var N = F => {
                var K = eu(),
                  V = c(ee(K), 2)
                ar(V, {
                  placeholder: 'My endpoint',
                  get value() {
                    return a(o)
                  },
                  set value(le) {
                    $(o, le, !0)
                  },
                })
                var Y = c(V, 4)
                ar(Y, {
                  placeholder: 'https://',
                  get value() {
                    return a(i)
                  },
                  set value(le) {
                    $(i, le, !0)
                  },
                })
                var X = c(Y, 4)
                ar(X, {
                  get value() {
                    return a(l)
                  },
                  set value(le) {
                    $(l, le, !0)
                  },
                })
                var te = c(X, 4)
                ;(Ta(
                  te,
                  () => a(v),
                  le => $(v, le)
                ),
                  p(F, K))
              }
              q(P, F => {
                ;(a(g) || a(m)) && F(N)
              })
            }
            var z = c(P, 2),
              j = u(z)
            Pe(j, {
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
            var D = c(j, 2)
            {
              let F = J(() => !a(n) || a(d))
              Pe(D, {
                get disabled() {
                  return a(F)
                },
                onclick: y,
                children: (K, V) => {
                  var Y = Q()
                  ;(I(() => M(Y, a(d) ? 'Adding…' : 'Add provider')), p(K, Y))
                },
                $$slots: { default: !0 },
              })
            }
            ;(Po(
              U,
              () => a(n),
              F => $(n, F)
            ),
              p(G, A))
          }
        q(x, G => {
          a(s) ? G(L) : G(T, -1)
        })
      }
      p(w, B)
    },
    $$slots: { default: !0 },
  }),
    ye())
}
var au = b(
  '<p style="color:var(--text-2);font-size:13.5px;line-height:1.6">Remove <strong style="color:var(--text-1)"> </strong> </p> <div class="row" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
  1
)
function su(e, t) {
  me(t, !0)
  {
    let r = J(() => !!t.provider)
    Er(e, {
      get open() {
        return a(r)
      },
      title: 'Delete provider',
      get onclose() {
        return t.onclose
      },
      children: (s, n) => {
        var l = au(),
          i = ee(l),
          o = c(u(i)),
          v = u(o),
          d = c(o),
          h = c(i, 2),
          _ = u(h)
        Pe(_, {
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
        ;(Pe(f, {
          variant: 'danger',
          onclick: () => t.provider && t.onconfirm(t.provider),
          children: (g, m) => {
            var y = Q('Delete')
            p(g, y)
          },
          $$slots: { default: !0 },
        }),
          I(() => {
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
  ye()
}
var nu = b('<div class="grid svelte-1sgc4qo"></div>'),
  lu = b('<p class="code svelte-1sgc4qo">Enter code: <strong> </strong></p>'),
  iu = b(
    '<div class="backdrop svelte-1sgc4qo" role="presentation"><div class="modal glass svelte-1sgc4qo" role="dialog" tabindex="-1"><h3 class="svelte-1sgc4qo"> </h3> <!> <!> <p class="note svelte-1sgc4qo">This window will close automatically once authentication completes.</p> <!></div></div>'
  ),
  ou = b(
    '<div class="page"><div class="head svelte-1sgc4qo"><div><h2 class="svelte-1sgc4qo">Providers & Keys</h2> <p class="sub svelte-1sgc4qo">Connect model providers via API key or OAuth. Refresh to pull the latest model list.</p></div> <div class="acts svelte-1sgc4qo"><!> <!></div></div> <!></div> <!> <!> <!>',
    1
  )
function vu(e, t) {
  me(t, !0)
  let r = re(!1),
    s = re(null),
    n = re(null),
    l = re(''),
    i = re(''),
    o = re(null)
  async function v(R) {
    try {
      const E = await Yo(R.id)
      E.ok
        ? he(`Deleted ${R.name}`, 'success')
        : he(E.error ? String(E.error) : 'Delete failed', 'error')
    } catch (E) {
      he(E instanceof Error ? E.message : String(E), 'error')
    }
    ;($(s, null), await La())
  }
  async function d(R) {
    const E = prompt(`API key for ${R.name}:`)
    if (E)
      try {
        ;(await Bo(R.id, E)).ok
          ? (he('Key saved', 'success'), await El(R.id))
          : he('Save failed', 'error')
      } catch (C) {
        he(C instanceof Error ? C.message : String(C), 'error')
      }
  }
  async function h(R) {
    $(n, R, !0)
    try {
      const E = await Jo(R.id)
      ;($(l, E.authUrl ?? E.url, !0),
        $(i, E.userCode ?? '', !0),
        E.sessionId &&
          $(
            o,
            setInterval(async () => {
              const C = await Xo(E.sessionId)
              C.status !== 'pending' &&
                (a(o) && clearInterval(a(o)),
                C.status === 'done'
                  ? (he(`${R.name} connected`, 'success'), $(n, null), await La())
                  : he(C.error ?? 'OAuth failed', 'error'))
            }, 2e3),
            !0
          ),
        E.pkce && a(l) && window.open(a(l), '_blank'))
    } catch (E) {
      he(E instanceof Error ? E.message : String(E), 'error')
    }
  }
  var _ = ou(),
    f = ee(_),
    g = u(f),
    m = c(u(g), 2),
    y = u(m)
  Pe(y, {
    variant: 'ghost',
    onclick: () => La(),
    children: (R, E) => {
      var C = Q('Refresh all')
      p(R, C)
    },
    $$slots: { default: !0 },
  })
  var w = c(y, 2)
  Pe(w, {
    onclick: () => $(r, !0),
    children: (R, E) => {
      var C = Q('+ Add provider')
      p(R, C)
    },
    $$slots: { default: !0 },
  })
  var O = c(g, 2)
  {
    var B = R => {
        Qt(R, { label: 'Loading providers…' })
      },
      x = R => {
        $r(R, {
          title: 'Could not load providers',
          icon: 'M12 8v5M12 17h.01',
          children: (E, C) => {
            var k = Q()
            ;(I(() => M(k, Oe.error)), p(E, k))
          },
          $$slots: { default: !0 },
        })
      },
      L = R => {
        $r(R, {
          title: 'No providers yet',
          icon: 'M12 11h8M4 11h4M4 19h16',
          children: (E, C) => {
            var k = Q('Add a provider to start browsing models.')
            p(E, k)
          },
          $$slots: { default: !0 },
        })
      },
      T = R => {
        var E = nu()
        ;(Ee(
          E,
          21,
          () => Oe.list,
          C => C.id,
          (C, k) => {
            Wc(C, {
              get provider() {
                return a(k)
              },
              onAddKey: d,
              onDelete: H => $(s, H, !0),
              onOAuth: h,
            })
          }
        ),
          p(R, E))
      }
    q(O, R => {
      Oe.loading ? R(B) : Oe.error ? R(x, 1) : Oe.list.length === 0 ? R(L, 2) : R(T, -1)
    })
  }
  var G = c(f, 2)
  ru(G, {
    get open() {
      return a(r)
    },
    onclose: () => $(r, !1),
    onadded: () => La(),
  })
  var A = c(G, 2)
  su(A, {
    get provider() {
      return a(s)
    },
    onclose: () => $(s, null),
    onconfirm: v,
  })
  var U = c(A, 2)
  {
    var W = R => {
      var E = iu(),
        C = u(E),
        k = u(C),
        H = u(k),
        P = c(k, 2)
      {
        var N = F => {
          var K = lu(),
            V = c(u(K)),
            Y = u(V)
          ;(I(() => M(Y, a(i))), p(F, K))
        }
        q(P, F => {
          a(i) && F(N)
        })
      }
      var z = c(P, 2)
      {
        var j = F => {
          Pe(F, {
            onclick: () => window.open(a(l), '_blank'),
            children: (K, V) => {
              var Y = Q('Open sign-in page')
              p(K, Y)
            },
            $$slots: { default: !0 },
          })
        }
        q(z, F => {
          a(l) && F(j)
        })
      }
      var D = c(z, 4)
      ;(Pe(D, {
        variant: 'ghost',
        onclick: () => $(n, null),
        children: (F, K) => {
          var V = Q('Close')
          p(F, V)
        },
        $$slots: { default: !0 },
      }),
        I(() => M(H, `Sign in to ${a(n).name ?? ''}`)),
        ne('click', E, () => $(n, null)),
        ne('keydown', E, F => {
          F.key === 'Escape' && $(n, null)
        }),
        ne('click', C, F => F.stopPropagation()),
        ne('keydown', C, F => F.stopPropagation()),
        p(R, E))
    }
    q(U, R => {
      a(n) && R(W)
    })
  }
  ;(p(e, _), ye())
}
Ve(['click', 'keydown'])
const du = 'modulepreload',
  cu = function (e) {
    return '/' + e
  },
  yn = {},
  uu = function (t, r, s) {
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
          if (((d = cu(d)), d in yn)) return
          yn[d] = !0
          const h = d.endsWith('.css'),
            _ = h ? '[rel="stylesheet"]' : ''
          if (document.querySelector(`link[href="${d}"]${_}`)) return
          const f = document.createElement('link')
          if (
            ((f.rel = h ? 'stylesheet' : du),
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
var fu = b('<span class="group svelte-xohxs0"><!> <!> <!> <!> <!></span>')
function jl(e, t) {
  me(t, !0)
  var r = fu(),
    s = u(r)
  {
    var n = g => {
      qe(g, {
        tone: 'success',
        children: (m, y) => {
          var w = Q('Free')
          p(m, w)
        },
        $$slots: { default: !0 },
      })
    }
    q(s, g => {
      t.model.isFree && g(n)
    })
  }
  var l = c(s, 2)
  {
    var i = g => {
      qe(g, {
        tone: 'warning',
        children: (m, y) => {
          var w = Q()
          ;(I(() => M(w, t.model.freeLabel)), p(m, w))
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
    qe(o, {
      get tone() {
        return a(g)
      },
      children: (m, y) => {
        var w = Q()
        ;(I(() => M(w, t.model.format)), p(m, w))
      },
      $$slots: { default: !0 },
    })
  }
  var v = c(o, 2)
  {
    var d = g => {
        qe(g, {
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
      a(h) && g(d)
    })
  }
  var _ = c(v, 2)
  {
    var f = g => {
      qe(g, {
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
  ;(p(e, r), ye())
}
var pu = b('<button> </button>'),
  hu = b(
    '<div class="info svelte-19h4ccs"><div class="name svelte-19h4ccs"> <span class="pid svelte-19h4ccs"> </span></div> <div class="meta svelte-19h4ccs"> </div></div> <div class="tags svelte-19h4ccs"><!></div> <!>',
    1
  ),
  _u = b('<div class="row clickable svelte-19h4ccs" role="button" tabindex="0"><!></div>'),
  gu = b('<div class="row svelte-19h4ccs"><!></div>')
function mu(e, t) {
  me(t, !0)
  const r = h => {
    var _ = hu(),
      f = ee(_),
      g = u(f),
      m = u(g),
      y = c(m),
      w = u(y),
      O = c(g, 2),
      B = u(O),
      x = c(f, 2),
      L = u(x)
    jl(L, {
      get model() {
        return t.model
      },
    })
    var T = c(x, 2)
    {
      var G = A => {
        var U = pu()
        let W
        var R = u(U)
        ;(I(() => {
          ;((W = Fe(U, 1, 'star svelte-19h4ccs', null, W, { on: s() })),
            _e(U, 'title', s() ? 'Remove favorite' : 'Add favorite'),
            _e(U, 'aria-label', s() ? 'Remove favorite' : 'Add favorite'),
            M(R, s() ? '★' : '☆'))
        }),
          ne('click', U, E => {
            ;(E.stopPropagation(), t.onToggleFav())
          }),
          p(A, U))
      }
      q(T, A => {
        t.onToggleFav && A(G)
      })
    }
    ;(I(
      (A, U) => {
        ;(M(m, t.model.name ?? t.model.id),
          M(w, `· ${t.providerId ?? ''}`),
          M(B, `ctx ${A ?? ''} · ${U ?? ''}`))
      },
      [() => n(t.model.contextWindow), () => l(t.model.cost)]
    ),
      p(h, _))
  }
  let s = be(t, 'favorited', 3, !1)
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
        var _ = _u(),
          f = u(_)
        ;(r(f),
          ne('click', _, () => t.onOpen()),
          ne('keydown', _, g => {
            ;(g.key === 'Enter' || g.key === ' ') && (g.preventDefault(), t.onOpen())
          }),
          p(h, _))
      },
      d = h => {
        var _ = gu(),
          f = u(_)
        ;(r(f), p(h, _))
      }
    q(o, h => {
      t.onOpen ? h(v) : h(d, -1)
    })
  }
  ;(p(e, i), ye())
}
Ve(['click', 'keydown'])
var yu = b('<option> </option>'),
  wu = b(
    '<div class="filters svelte-1y45iff"><input class="q svelte-1y45iff" placeholder="Search models…"/> <select class="s svelte-1y45iff"><option>All providers</option><!></select> <select class="s svelte-1y45iff"><option>Any format</option><option>anthropic</option><option>openai</option><option>unsupported</option></select> <select class="s svelte-1y45iff"><option>Free & paid</option><option>Free only</option><option>Paid only</option></select> <select class="s svelte-1y45iff"><option>Any reasoning</option><option>Reasoning</option><option>No reasoning</option></select> <select class="s svelte-1y45iff"><option>Any vision</option><option>Vision</option><option>No vision</option></select> <select class="s svelte-1y45iff"><option>Sort: context</option><option>Sort: cost</option><option>Sort: name</option></select></div>'
  )
function bu(e, t) {
  me(t, !0)
  let r = be(t, 'value', 15)
  function s(F, K) {
    var V
    ;(r({ ...r(), [F]: K }), (V = t.onchange) == null || V.call(t, r()))
  }
  var n = wu(),
    l = u(n),
    i = c(l, 2),
    o = u(i)
  o.value = o.__value = ''
  var v = c(o)
  Ee(
    v,
    17,
    () => t.providers,
    Pr,
    (F, K) => {
      var V = yu(),
        Y = u(V),
        X = {}
      ;(I(() => {
        ;(M(Y, a(K).name), X !== (X = a(K).id) && (V.value = (V.__value = a(K).id) ?? ''))
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
  var B = c(O)
  B.value = B.__value = 'free'
  var x = c(B)
  x.value = x.__value = 'paid'
  var L
  rr(w)
  var T = c(w, 2),
    G = u(T)
  G.value = G.__value = ''
  var A = c(G)
  A.value = A.__value = 'yes'
  var U = c(A)
  U.value = U.__value = 'no'
  var W
  rr(T)
  var R = c(T, 2),
    E = u(R)
  E.value = E.__value = ''
  var C = c(E)
  C.value = C.__value = 'yes'
  var k = c(C)
  k.value = k.__value = 'no'
  var H
  rr(R)
  var P = c(R, 2),
    N = u(P)
  N.value = N.__value = 'ctx'
  var z = c(N)
  z.value = z.__value = 'cost'
  var j = c(z)
  j.value = j.__value = 'name'
  var D
  ;(rr(P),
    I(() => {
      ;(Ks(l, r().query),
        d !== (d = r().provider) &&
          ((i.value = (i.__value = r().provider) ?? ''), Bt(i, r().provider)),
        y !== (y = r().format) && ((h.value = (h.__value = r().format) ?? ''), Bt(h, r().format)),
        L !== (L = r().free) && ((w.value = (w.__value = r().free) ?? ''), Bt(w, r().free)),
        W !== (W = r().reasoning) &&
          ((T.value = (T.__value = r().reasoning) ?? ''), Bt(T, r().reasoning)),
        H !== (H = r().vision) && ((R.value = (R.__value = r().vision) ?? ''), Bt(R, r().vision)),
        D !== (D = r().sort) && ((P.value = (P.__value = r().sort) ?? ''), Bt(P, r().sort)))
    }),
    ne('input', l, F => s('query', F.currentTarget.value)),
    ne('change', i, F => s('provider', F.currentTarget.value)),
    ne('change', h, F => s('format', F.currentTarget.value)),
    ne('change', w, F => s('free', F.currentTarget.value)),
    ne('change', T, F => s('reasoning', F.currentTarget.value)),
    ne('change', R, F => s('vision', F.currentTarget.value)),
    ne('change', P, F => s('sort', F.currentTarget.value)),
    p(e, n),
    ye())
}
Ve(['input', 'change'])
var xu = b(
    '<div><div class="h svelte-1efx48s">Source backend</div><div class="v svelte-1efx48s"> </div></div>'
  ),
  ku = b(
    '<div class="stack svelte-1efx48s"><div><div class="h svelte-1efx48s">Name</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Model ID</div> <code class="v mono svelte-1efx48s"> </code></div> <div><div class="h svelte-1efx48s">Provider</div> <div class="v svelte-1efx48s"> <span class="sub svelte-1efx48s"> </span></div></div> <div class="grid svelte-1efx48s"><div><div class="h svelte-1efx48s">Context window</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Free</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Format</div><div class="v svelte-1efx48s"><!></div></div> <div><div class="h svelte-1efx48s">Reasoning</div><div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Image input</div><div class="v svelte-1efx48s"> </div></div></div> <div><div class="h svelte-1efx48s">Cost</div> <div class="v svelte-1efx48s"> </div></div> <div><div class="h svelte-1efx48s">Supported parameters</div> <div class="v chips svelte-1efx48s"></div></div> <!></div>'
  )
function Su(e, t) {
  me(t, !0)
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
  ;(Wv(e, {
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
          var d = ku(),
            h = u(d),
            _ = c(u(h), 2),
            f = u(_),
            g = c(h, 2),
            m = c(u(g), 2),
            y = u(m),
            w = c(g, 2),
            O = c(u(w), 2),
            B = u(O),
            x = c(B),
            L = u(x),
            T = c(w, 2),
            G = u(T),
            A = c(u(G)),
            U = u(A),
            W = c(G, 2),
            R = c(u(W)),
            E = u(R),
            C = c(W, 2),
            k = c(u(C)),
            H = u(k)
          jl(H, {
            get model() {
              return t.model
            },
          })
          var P = c(C, 2),
            N = c(u(P)),
            z = u(N),
            j = c(P, 2),
            D = c(u(j)),
            F = u(D),
            K = c(T, 2),
            V = c(u(K), 2),
            Y = u(V),
            X = c(K, 2),
            te = c(u(X), 2)
          Ee(
            te,
            21,
            () => t.model.supportedParameters ?? [],
            Pr,
            (ie, ue) => {
              qe(ie, {
                tone: 'neutral',
                children: (Z, oe) => {
                  var Se = Q()
                  ;(I(() => M(Se, a(ue))), p(Z, Se))
                },
                $$slots: { default: !0 },
              })
            }
          )
          var le = c(X, 2)
          {
            var ae = ie => {
              var ue = xu(),
                Z = c(u(ue)),
                oe = u(Z)
              ;(I(() => M(oe, t.model.sourceBackend)), p(ie, ue))
            }
            q(le, ie => {
              t.model.sourceBackend && ie(ae)
            })
          }
          ;(I(
            (ie, ue, Z) => {
              ;(M(f, t.model.name ?? t.model.id),
                M(y, t.model.id),
                M(B, `${t.providerName ?? ''} `),
                M(L, `(${t.providerId ?? ''})`),
                M(U, ie),
                M(E, t.model.isFree ? 'Yes' : (t.model.freeLabel ?? 'No')),
                M(z, t.model.reasoning ? 'Supported' : 'No'),
                M(F, ue),
                M(Y, Z))
            },
            [
              () =>
                t.model.contextWindow ? t.model.contextWindow.toLocaleString() + ' tokens' : '—',
              () => {
                var ie
                return (ie = t.model.inputTypes) != null && ie.includes('image')
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
      p(s, l)
    },
    $$slots: { default: !0 },
  }),
    ye())
}
var Pu = b(
  '<div class="item svelte-drwign" role="listitem" draggable="true"><span class="handle svelte-drwign" title="Drag to reorder">⠿⠿⠿</span> <span class="idx svelte-drwign"> </span> <!> <div class="meta svelte-drwign"><div class="name svelte-drwign"> </div> <div class="sub svelte-drwign"> </div></div> <button class="x svelte-drwign" title="Remove">×</button></div>'
)
function Eu(e, t) {
  me(t, !0)
  var r = Pu(),
    s = c(u(r), 2),
    n = u(s),
    l = c(s, 2)
  Zs(l, {
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
  ;(I(() => {
    ;(M(n, t.index + 1), M(v, t.fav.model), M(h, t.fav.providerName))
  }),
    Ba('dragstart', r, function (...f) {
      var g
      ;(g = t.ondragstart) == null || g.apply(this, f)
    }),
    Ba('dragover', r, f => f.preventDefault()),
    Ba('drop', r, function (...f) {
      var g
      ;(g = t.ondrop) == null || g.apply(this, f)
    }),
    ne('click', _, function (...f) {
      var g
      ;(g = t.onremove) == null || g.apply(this, f)
    }),
    p(e, r),
    ye())
}
Ve(['click'])
var Mu = b('<div class="list svelte-156gwh2"><!> <div class="cap svelte-156gwh2"> </div></div>')
function Au(e, t) {
  me(t, !0)
  let r = re(null)
  function s(_, f) {
    var g
    ;($(r, _, !0), (g = f.dataTransfer) == null || g.setData('text/plain', String(_)))
  }
  function n(_) {
    if (a(r) === null || a(r) === _) return
    const f = [...t.items],
      [g] = f.splice(a(r), 1)
    ;(f.splice(_, 0, g), $(r, null), t.onreorder(f))
  }
  var l = Mu(),
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
        ;(Ee(
          g,
          19,
          () => t.items,
          m => m.providerId + '/' + m.modelId,
          (m, y, w) => {
            Eu(m, {
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
    q(i, _ => {
      t.items.length === 0 ? _(o) : _(v, -1)
    })
  }
  var d = c(i, 2),
    h = u(d)
  ;(I(() => M(h, `${t.items.length ?? ''} / ${t.max ?? ''} used`)), p(e, l), ye())
}
var zu = b(
  '<div class="meter svelte-19jc277"><div class="top svelte-19jc277"><span> </span><span class="n svelte-19jc277"> </span></div> <div class="track svelte-19jc277"><div></div></div></div>'
)
function Tu(e, t) {
  let r = be(t, 'label', 3, '')
  const s = J(() => Math.min(100, Math.round((t.used / t.max) * 100))),
    n = J(() => t.used >= t.max)
  var l = zu(),
    i = u(l),
    o = u(i),
    v = u(o),
    d = c(o),
    h = u(d),
    _ = c(i, 2),
    f = u(_)
  let g
  ;(I(() => {
    ;(M(v, r()),
      M(h, `${t.used ?? ''}/${t.max ?? ''}`),
      (g = Fe(f, 1, 'fill svelte-19jc277', null, g, { full: a(n) })),
      et(f, `width:${a(s) ?? ''}%`))
  }),
    p(e, l))
}
var Cu = b(
    '<div class="fav-head svelte-p8xmpw"><h3 class="svelte-p8xmpw">Favorites</h3> <!></div> <!> <div style="margin-top:14px"><!></div>',
    1
  ),
  $u = b(
    '<div class="page"><div class="head svelte-p8xmpw"><h2 class="svelte-p8xmpw">Models</h2> <p class="sub svelte-p8xmpw">Browse every model anygate can route. Star any model to add it to your favorites.</p></div> <div class="layout svelte-p8xmpw"><div class="main-col"><!> <!></div> <aside class="fav-col"><!></aside></div></div> <!>',
    1
  )
function Iu(e, t) {
  me(t, !0)
  let r = re(
      Ke({ provider: '', format: '', free: '', reasoning: '', vision: '', query: '', sort: 'ctx' })
    ),
    s = re(null),
    n = re('general')
  const l = J(() =>
    Oe.list.flatMap(A =>
      A.enrichedModels.map(U => ({ model: U, providerId: A.id, providerName: A.name }))
    )
  )
  function i(A) {
    if (!A || typeof A != 'object') return 0
    const U = A
    return (U.input ?? 0) + (U.output ?? 0)
  }
  const o = J(() =>
    a(l)
      .filter(A => {
        var U, W
        return (
          (!a(r).provider || A.providerId === a(r).provider) &&
          (!a(r).format || A.model.format === a(r).format) &&
          (!a(r).free || (a(r).free === 'free' ? A.model.isFree : !A.model.isFree)) &&
          (!a(r).reasoning ||
            (a(r).reasoning === 'yes' ? A.model.reasoning : !A.model.reasoning)) &&
          (!a(r).vision ||
            (a(r).vision === 'yes'
              ? (U = A.model.inputTypes) == null
                ? void 0
                : U.includes('image')
              : !((W = A.model.inputTypes) != null && W.includes('image')))) &&
          (!a(r).query ||
            (A.model.name ?? A.model.id).toLowerCase().includes(a(r).query.toLowerCase()) ||
            A.model.id.toLowerCase().includes(a(r).query.toLowerCase()))
        )
      })
      .sort((A, U) =>
        a(r).sort === 'name'
          ? (A.model.name ?? A.model.id).localeCompare(U.model.name ?? U.model.id)
          : a(r).sort === 'cost'
            ? i(A.model.cost) - i(U.model.cost)
            : (U.model.contextWindow ?? 0) - (A.model.contextWindow ?? 0)
      )
  )
  function v(A, U) {
    return (a(n) === 'agy' ? ke.agy : ke.general).some(R => R.providerId === A && R.modelId === U)
  }
  async function d(A) {
    const U = A.model
    if (v(A.providerId, U.id)) await Ts(A.providerId, U.id, a(n) === 'agy')
    else {
      const W = {
        providerId: A.providerId,
        providerName: A.providerName,
        model: U.id,
        modelId: U.id,
        contextWindow: U.contextWindow,
        cost: U.cost,
      }
      await zl(W, a(n) === 'agy')
    }
  }
  async function h(A) {
    ;(a(n) === 'agy' ? (ke.agy = A) : (ke.general = A),
      await uu(() => Promise.resolve().then(() => kv), void 0).then(U =>
        U.reorder(A, a(n) === 'agy')
      ))
  }
  var _ = $u(),
    f = ee(_),
    g = c(u(f), 2),
    m = u(g),
    y = u(m)
  {
    let A = J(() => Oe.list.map(U => ({ id: U.id, name: U.name })))
    bu(y, {
      get providers() {
        return a(A)
      },
      get value() {
        return a(r)
      },
      set value(U) {
        $(r, U, !0)
      },
    })
  }
  var w = c(y, 2)
  {
    var O = A => {
        Qt(A, { label: 'Loading models…' })
      },
      B = A => {
        $r(A, {
          title: 'No models match',
          icon: 'M4 6h16M4 12h16M4 18h16',
          children: (U, W) => {
            var R = Q('Adjust filters or connect more providers.')
            p(U, R)
          },
          $$slots: { default: !0 },
        })
      },
      x = A => {
        Ne(A, {
          padding: '6px',
          children: (U, W) => {
            var R = it(),
              E = ee(R)
            ;(Ee(
              E,
              17,
              () => a(o),
              C => C.providerId + '/' + C.model.id,
              (C, k) => {
                {
                  let H = J(() => v(a(k).providerId, a(k).model.id))
                  mu(C, {
                    get model() {
                      return a(k).model
                    },
                    get providerId() {
                      return a(k).providerId
                    },
                    get favorited() {
                      return a(H)
                    },
                    onToggleFav: () => d(a(k)),
                    onOpen: () => $(s, a(k), !0),
                  })
                }
              }
            ),
              p(U, R))
          },
          $$slots: { default: !0 },
        })
      }
    q(w, A => {
      Oe.loading ? A(O) : a(o).length === 0 ? A(B, 1) : A(x, -1)
    })
  }
  var L = c(m, 2),
    T = u(L)
  Ne(T, {
    padding: '18px',
    children: (A, U) => {
      var W = Cu(),
        R = ee(W),
        E = c(u(R), 2)
      {
        let P = J(() => (a(n) === 'agy' ? ke.agy.length : ke.general.length)),
          N = J(() => (a(n) === 'agy' ? 6 : 20)),
          z = J(() => (a(n) === 'agy' ? 'AGY' : 'General'))
        Tu(E, {
          get used() {
            return a(P)
          },
          get max() {
            return a(N)
          },
          get label() {
            return a(z)
          },
        })
      }
      var C = c(R, 2)
      Dl(C, {
        tabs: [
          { id: 'general', label: 'General (20)' },
          { id: 'agy', label: 'AGY (6)' },
        ],
        get active() {
          return a(n)
        },
        set active(P) {
          $(n, P, !0)
        },
      })
      var k = c(C, 2),
        H = u(k)
      {
        let P = J(() => (a(n) === 'agy' ? ke.agy : ke.general)),
          N = J(() => (a(n) === 'agy' ? 6 : 20))
        Au(H, {
          get items() {
            return a(P)
          },
          get max() {
            return a(N)
          },
          onreorder: h,
          onremove: z => Ts(z.providerId, z.modelId, a(n) === 'agy'),
        })
      }
      p(A, W)
    },
    $$slots: { default: !0 },
  })
  var G = c(f, 2)
  {
    let A = J(() => !!a(s)),
      U = J(() => {
        var E
        return ((E = a(s)) == null ? void 0 : E.model) ?? null
      }),
      W = J(() => {
        var E
        return ((E = a(s)) == null ? void 0 : E.providerId) ?? ''
      }),
      R = J(() => {
        var E
        return ((E = a(s)) == null ? void 0 : E.providerName) ?? ''
      })
    Su(G, {
      get open() {
        return a(A)
      },
      get model() {
        return a(U)
      },
      get providerId() {
        return a(W)
      },
      get providerName() {
        return a(R)
      },
      onclose: () => $(s, null),
    })
  }
  ;(p(e, _), ye())
}
var Lu = b('<div class="path svelte-1gp522a"> </div>'),
  Ou = b(
    '<div class="favs svelte-1gp522a"><span class="star svelte-1gp522a">★</span> <span> </span></div>'
  ),
  Ru = b('<a class="install-link svelte-1gp522a" target="_blank" rel="noopener noreferrer"> </a>'),
  Nu = b(
    '<code class="cmd svelte-1gp522a"> </code> <button class="copy svelte-1gp522a" type="button">Copy</button>',
    1
  ),
  Fu = b('<div class="install svelte-1gp522a"><!></div>'),
  Du = b(
    '<div class="card svelte-1gp522a"><div class="head svelte-1gp522a"><div><!></div> <div class="meta svelte-1gp522a"><div class="name svelte-1gp522a"> </div> <div class="sub svelte-1gp522a"> </div></div> <!></div> <!> <!> <!> <div class="actions svelte-1gp522a"><!> <!></div></div>'
  )
function ju(e, t) {
  me(t, !0)
  let r = be(t, 'favCount', 3, 0)
  var s = Du(),
    n = u(s),
    l = u(n)
  let i
  var o = u(l)
  Zs(o, {
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
        qe(W, {
          tone: 'success',
          children: (R, E) => {
            var C = Q('Installed')
            p(R, C)
          },
          $$slots: { default: !0 },
        })
      },
      y = W => {
        qe(W, {
          tone: 'warning',
          children: (R, E) => {
            var C = Q('Not installed')
            p(R, C)
          },
          $$slots: { default: !0 },
        })
      }
    q(g, W => {
      t.app.installed ? W(m) : W(y, -1)
    })
  }
  var w = c(n, 2)
  {
    var O = W => {
      var R = Lu(),
        E = u(R)
      ;(I(() => {
        ;(_e(R, 'title', t.app.path), M(E, t.app.path))
      }),
        p(W, R))
    }
    q(w, W => {
      t.app.path && W(O)
    })
  }
  var B = c(w, 2)
  {
    var x = W => {
      var R = Ou(),
        E = c(u(R), 2),
        C = u(E)
      ;(I(() => M(C, `${r() ?? ''} favorite${r() === 1 ? '' : 's'} ready`)), p(W, R))
    }
    q(B, W => {
      r() > 0 && W(x)
    })
  }
  var L = c(B, 2)
  {
    var T = W => {
      var R = Fu(),
        E = u(R)
      {
        var C = H => {
            var P = Ru(),
              N = u(P)
            ;(I(() => {
              ;(_e(P, 'href', t.app.installUrl), M(N, `Get ${t.app.name ?? ''} →`))
            }),
              p(H, P))
          },
          k = H => {
            var P = Nu(),
              N = ee(P),
              z = u(N),
              j = c(N, 2)
            ;(I(() => M(z, t.app.installHint)),
              ne('click', j, () => {
                var D
                return (D = navigator.clipboard) == null
                  ? void 0
                  : D.writeText(t.app.installHint ?? '')
              }),
              p(H, P))
          }
        q(E, H => {
          t.app.installUrl ? H(C) : t.app.installHint && H(k, 1)
        })
      }
      p(W, R)
    }
    q(L, W => {
      t.app.installed || W(T)
    })
  }
  var G = c(L, 2),
    A = u(G)
  Pe(A, {
    size: 'sm',
    variant: 'ghost',
    onclick: () => t.onsetpath(t.app),
    children: (W, R) => {
      var E = Q('Path')
      p(W, E)
    },
    $$slots: { default: !0 },
  })
  var U = c(A, 2)
  {
    let W = J(() => !t.app.installed)
    Pe(U, {
      size: 'sm',
      variant: 'primary',
      get disabled() {
        return a(W)
      },
      onclick: () => t.onlaunch(t.app),
      children: (R, E) => {
        var C = Q()
        ;(I(() => M(C, r() > 0 ? 'Launch with favorites' : 'Launch')), p(R, C))
      },
      $$slots: { default: !0 },
    })
  }
  ;(I(() => {
    ;((i = Fe(l, 1, 'logo svelte-1gp522a', null, i, { dim: !t.app.installed })),
      M(h, t.app.name),
      M(f, t.app.type === 'cli' ? 'CLI' : 'Desktop app'))
  }),
    p(e, s),
    ye())
}
Ve(['click'])
var qu = b('<div class="grid svelte-ishglm"></div>'),
  Uu = b(
    '<div class="opts svelte-ishglm"><span class="lbl svelte-ishglm">Provider</span> <!> <span class="lbl svelte-ishglm">Model</span> <!></div>'
  ),
  Bu = b(
    '<div class="hintbox svelte-ishglm"><!> <span>Opens the app with every favorite routed through one anygate gateway — switch live from the in-app model menu.</span></div>'
  ),
  Hu = b('<button class="recent svelte-ishglm"> </button>'),
  Gu = b('<div class="recents svelte-ishglm"></div>'),
  Wu = b(
    '<div class="modes svelte-ishglm"><button><span class="mode-ico svelte-ishglm">★</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">All favorites</span> <span class="mode-desc svelte-ishglm"> </span></span></button> <button><span class="mode-ico svelte-ishglm">◉</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">One model</span> <span class="mode-desc svelte-ishglm">Launch with a single pre-selected model</span></span></button> <button><span class="mode-ico svelte-ishglm">⤢</span> <span class="mode-body svelte-ishglm"><span class="mode-title svelte-ishglm">Just open</span> <span class="mode-desc svelte-ishglm">Launch the app with no model pre-set</span></span></button></div> <!> <div class="opts svelte-ishglm" style="margin-top:16px"><span class="lbl svelte-ishglm">Launch folder</span> <div class="folder svelte-ishglm"><!> <!></div> <!></div> <div class="row svelte-ishglm" style="margin-top:22px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Ku = b(
    '<span class="lbl svelte-ishglm">Executable path</span> <div class="folder svelte-ishglm"><!> <!></div> <div class="row svelte-ishglm" style="margin-top:20px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Vu = b(
    `<div class="page"><div class="head svelte-ishglm"><div><h2 class="svelte-ishglm">Apps & Launch</h2> <p class="sub svelte-ishglm">Open Claude, Codex, Gemini, or Antigravity with your anygate models pre-wired. Pick a launch folder per app, or send your whole favorites catalog into the app's model switcher.</p></div></div> <!></div> <!> <!>`,
    1
  )
function Yu(e, t) {
  me(t, !0)
  let r = re(null),
    s = re('specific'),
    n = re(''),
    l = re(''),
    i = re(''),
    o = re(null),
    v = re('')
  const d = J(() => at.list.find(C => C.id === a(r))),
    h = J(() =>
      a(d) && (a(d).id === 'antigravity' || a(d).id === 'agy' || a(d).id === 'antigravity-ide')
        ? ke.agy.length
        : ke.general.length
    ),
    _ = J(() => {
      var C
      return a(n)
        ? (((C = Oe.list.find(k => k.id === a(n))) == null ? void 0 : C.enrichedModels) ?? []).map(
            k => ({ value: k.id, label: k.name ?? k.id })
          )
        : []
    })
  async function f(C) {
    ;($(r, C.id, !0), $(s, 'specific'), $(n, ''), $(l, ''), $(i, ''))
    const k = at.recentFolders
    $(i, k[0] ?? '', !0)
  }
  async function g() {
    a(r) &&
      (a(s) === 'favorites'
        ? await Oa({ appId: a(r), favoritesCatalog: !0, cwd: a(i) || void 0 })
        : a(s) === 'specific'
          ? a(l) === '__all__' && a(n)
            ? await Oa({ appId: a(r), providerId: a(n), allModels: !0, cwd: a(i) || void 0 })
            : await Oa({
                appId: a(r),
                providerId: a(n) || void 0,
                modelId: a(l) || void 0,
                cwd: a(i) || void 0,
              })
          : await Oa({ appId: a(r), cwd: a(i) || void 0 }),
      $(r, null))
  }
  async function m(C) {
    ;($(o, C, !0), $(v, C.path ?? '', !0))
  }
  async function y() {
    a(o) && (await Pv(a(o).id, a(v).trim() || null), $(o, null))
  }
  async function w() {
    const C = await hn()
    C && $(i, C, !0)
  }
  async function O() {
    const C = await hn()
    C && $(v, C, !0)
  }
  var B = Vu(),
    x = ee(B),
    L = c(u(x), 2)
  {
    var T = C => {
        Qt(C, { label: 'Detecting installed apps…' })
      },
      G = C => {
        $r(C, {
          title: 'No apps found',
          icon: 'M2 3h20v14H2z',
          children: (k, H) => {
            var P = Q("anygate couldn't detect supported apps on this system.")
            p(k, P)
          },
          $$slots: { default: !0 },
        })
      },
      A = C => {
        var k = qu()
        ;(Ee(
          k,
          21,
          () => at.list,
          H => H.id,
          (H, P) => {
            {
              let N = J(() =>
                a(P).id === 'antigravity' || a(P).id === 'agy' || a(P).id === 'antigravity-ide'
                  ? ke.agy.length
                  : ke.general.length
              )
              ju(H, {
                get app() {
                  return a(P)
                },
                get favCount() {
                  return a(N)
                },
                onlaunch: f,
                onsetpath: m,
              })
            }
          }
        ),
          p(C, k))
      }
    q(L, C => {
      at.loading ? C(T) : at.list.length === 0 ? C(G, 1) : C(A, -1)
    })
  }
  var U = c(x, 2)
  {
    var W = C => {
      {
        let k = J(() => !!a(d)),
          H = J(() => `Launch ${a(d).name}`)
        Er(C, {
          get open() {
            return a(k)
          },
          get title() {
            return a(H)
          },
          onclose: () => $(r, null),
          children: (P, N) => {
            var z = Wu(),
              j = ee(z),
              D = u(j)
            let F
            var K = c(u(D), 2),
              V = c(u(K), 2),
              Y = u(V),
              X = c(D, 2)
            let te
            var le = c(X, 2)
            let ae
            var ie = c(j, 2)
            {
              var ue = de => {
                  var pe = Uu(),
                    $e = c(u(pe), 2)
                  {
                    let Ge = J(() => [
                      { value: '', label: 'All' },
                      ...Oe.list.map(Le => ({ value: Le.id, label: Le.name })),
                    ])
                    vr($e, {
                      get options() {
                        return a(Ge)
                      },
                      get value() {
                        return a(n)
                      },
                      set value(Le) {
                        $(n, Le, !0)
                      },
                    })
                  }
                  var Ie = c($e, 4)
                  {
                    let Ge = J(() => !a(n)),
                      Le = J(() =>
                        a(n)
                          ? [{ value: '__all__', label: 'All models' }, ...a(_)]
                          : [{ value: '', label: '— pick a provider first —' }]
                      )
                    vr(Ie, {
                      get disabled() {
                        return a(Ge)
                      },
                      get options() {
                        return a(Le)
                      },
                      get value() {
                        return a(l)
                      },
                      set value(ft) {
                        $(l, ft, !0)
                      },
                    })
                  }
                  p(de, pe)
                },
                Z = de => {
                  var pe = Bu(),
                    $e = u(pe)
                  ;(qe($e, {
                    tone: 'success',
                    children: (Ie, Ge) => {
                      var Le = Q()
                      ;(I(() => M(Le, `${a(h) ?? ''} favorites`)), p(Ie, Le))
                    },
                    $$slots: { default: !0 },
                  }),
                    p(de, pe))
                }
              q(ie, de => {
                a(s) === 'specific' ? de(ue) : a(s) === 'favorites' && de(Z, 1)
              })
            }
            var oe = c(ie, 2),
              Se = c(u(oe), 2),
              ve = u(Se)
            ar(ve, {
              placeholder: 'Path or browse…',
              get value() {
                return a(i)
              },
              set value(de) {
                $(i, de, !0)
              },
            })
            var Me = c(ve, 2)
            Pe(Me, {
              size: 'sm',
              variant: 'ghost',
              onclick: w,
              children: (de, pe) => {
                var $e = Q('Browse')
                p(de, $e)
              },
              $$slots: { default: !0 },
            })
            var Ce = c(Se, 2)
            {
              var Be = de => {
                  var pe = Gu()
                  ;(Ee(
                    pe,
                    21,
                    () => at.recentFolders.filter($e => $e !== a(i)).slice(0, 4),
                    Pr,
                    ($e, Ie) => {
                      var Ge = Hu(),
                        Le = u(Ge)
                      ;(I(() => M(Le, a(Ie))), ne('click', Ge, () => $(i, a(Ie), !0)), p($e, Ge))
                    }
                  ),
                    p(de, pe))
                },
                De = J(() => at.recentFolders.filter(de => de !== a(i)).length)
              q(Ce, de => {
                a(De) && de(Be)
              })
            }
            var He = c(oe, 2),
              je = u(He)
            Pe(je, {
              variant: 'ghost',
              onclick: () => $(r, null),
              children: (de, pe) => {
                var $e = Q('Cancel')
                p(de, $e)
              },
              $$slots: { default: !0 },
            })
            var Ye = c(je, 2)
            {
              let de = J(() => !a(d).installed || (a(s) === 'specific' && !!a(n) && !a(l)))
              Pe(Ye, {
                get disabled() {
                  return a(de)
                },
                onclick: g,
                children: (pe, $e) => {
                  var Ie = Q('Launch')
                  p(pe, Ie)
                },
                $$slots: { default: !0 },
              })
            }
            ;(I(() => {
              ;((F = Fe(D, 1, 'mode svelte-ishglm', null, F, { active: a(s) === 'favorites' })),
                (D.disabled = a(h) === 0),
                M(Y, a(h) > 0 ? `${a(h)} models into the app switcher` : 'No favorites saved yet'),
                (te = Fe(X, 1, 'mode svelte-ishglm', null, te, { active: a(s) === 'specific' })),
                (ae = Fe(le, 1, 'mode svelte-ishglm', null, ae, { active: a(s) === 'open' })))
            }),
              ne('click', D, () => $(s, 'favorites')),
              ne('click', X, () => $(s, 'specific')),
              ne('click', le, () => $(s, 'open')),
              p(P, z))
          },
          $$slots: { default: !0 },
        })
      }
    }
    q(U, C => {
      a(d) && C(W)
    })
  }
  var R = c(U, 2)
  {
    var E = C => {
      {
        let k = J(() => !!a(o)),
          H = J(() => `Set path → ${a(o).name}`)
        Er(C, {
          get open() {
            return a(k)
          },
          get title() {
            return a(H)
          },
          onclose: () => $(o, null),
          children: (P, N) => {
            var z = Ku(),
              j = c(ee(z), 2),
              D = u(j)
            ar(D, {
              placeholder: '/path/to/executable',
              get value() {
                return a(v)
              },
              set value(X) {
                $(v, X, !0)
              },
            })
            var F = c(D, 2)
            Pe(F, {
              size: 'sm',
              variant: 'ghost',
              onclick: O,
              children: (X, te) => {
                var le = Q('Browse')
                p(X, le)
              },
              $$slots: { default: !0 },
            })
            var K = c(j, 2),
              V = u(K)
            Pe(V, {
              variant: 'ghost',
              onclick: () => $(o, null),
              children: (X, te) => {
                var le = Q('Cancel')
                p(X, le)
              },
              $$slots: { default: !0 },
            })
            var Y = c(V, 2)
            ;(Pe(Y, {
              onclick: y,
              children: (X, te) => {
                var le = Q('Save')
                p(X, le)
              },
              $$slots: { default: !0 },
            }),
              p(P, z))
          },
          $$slots: { default: !0 },
        })
      }
    }
    q(R, C => {
      a(o) && C(E)
    })
  }
  ;(p(e, B), ye())
}
Ve(['click'])
var Ju = b('<!> <!>', 1)
function Xu(e, t) {
  me(t, !0)
  var r = it(),
    s = ee(r)
  {
    var n = i => {
        var o = Ju(),
          v = ee(o)
        qe(v, {
          tone: 'success',
          children: (_, f) => {
            var g = Q()
            ;(I(() => M(g, `Running · ${t.status.listenMode === 'network' ? 'Network' : 'Local'}`)),
              p(_, g))
          },
          $$slots: { default: !0 },
        })
        var d = c(v, 2)
        {
          var h = _ => {
            qe(_, {
              tone: 'neutral',
              children: (f, g) => {
                var m = Q()
                ;(I(() => M(m, `${t.status.models.length ?? ''} models`)), p(f, m))
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
        qe(i, {
          tone: 'neutral',
          children: (o, v) => {
            var d = Q('Stopped')
            p(o, d)
          },
          $$slots: { default: !0 },
        })
      }
    q(s, i => {
      var o
      ;(o = t.status) != null && o.running ? i(n) : i(l, -1)
    })
  }
  ;(p(e, r), ye())
}
var Zu = b(
    '<div class="url svelte-swldy1"><span class="lbl svelte-swldy1"> </span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy URL">Copy</button></div>'
  ),
  Qu = b(
    '<!> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Key</span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy API key">Copy</button></div>',
    1
  ),
  ef = b('<div class="summary svelte-swldy1"> </div>'),
  tf = b(
    '<div class="model svelte-swldy1"><span class="model-name svelte-swldy1"> </span> <button class="mid svelte-swldy1"> </button></div>'
  ),
  rf = b(
    '<div class="group svelte-swldy1"><div class="group-name svelte-swldy1"> <span class="group-count svelte-swldy1"> </span></div> <!></div>'
  ),
  af = b(
    '<div class="served svelte-swldy1"><div class="served-head svelte-swldy1"><h4 class="svelte-swldy1">Model endpoints</h4> <span class="hint svelte-swldy1"> </span></div> <!></div>'
  ),
  sf = b(
    '<div class="urls svelte-swldy1"><div class="url svelte-swldy1"><span class="lbl svelte-swldy1">Anthropic</span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy URL">Copy</button></div> <div class="url svelte-swldy1"><span class="lbl svelte-swldy1">OpenAI</span><code class="svelte-swldy1"> </code> <button class="copy svelte-swldy1" title="Copy URL">Copy</button></div> <!></div> <!> <!>',
    1
  ),
  nf = b(
    '<span class="lbl svelte-swldy1">Server password</span> <input class="inp svelte-swldy1" type="password"/> <!>',
    1
  ),
  lf = b(
    '<div class="prov-actions svelte-swldy1"><button class="link svelte-swldy1">All</button> <button class="link svelte-swldy1">None</button></div>'
  ),
  of = b(
    '<p class="prov-err svelte-swldy1"> <button class="link svelte-swldy1">Retry</button></p>'
  ),
  vf = b('<p class="prov-empty svelte-swldy1">No providers available. Add one first.</p>'),
  df = b(
    '<button><span class="tick svelte-swldy1" aria-hidden="true"> </span> <span class="prov-name svelte-swldy1"> </span> <span class="prov-count svelte-swldy1"> </span></button>'
  ),
  cf = b('<span class="warn svelte-swldy1">No providers selected — pick at least one.</span>'),
  uf = b(
    '<div class="prov-grid svelte-swldy1"></div> <p class="prov-sum svelte-swldy1"><!></p>',
    1
  ),
  ff = b(
    '<div class="opts svelte-swldy1"><!> <!> <!> <!> <!></div> <div class="providers svelte-swldy1"><div class="prov-head svelte-swldy1"><div><h4 class="svelte-swldy1">Providers to serve</h4> <p class="prov-desc svelte-swldy1">Choose which providers appear on the model endpoints. Leave all selected to serve everything.</p></div> <!></div> <!></div>',
    1
  ),
  pf = b(
    '<div class="panel svelte-swldy1"><div class="row svelte-swldy1"><div><h3 class="svelte-swldy1">Server Gateway</h3> <p class="desc svelte-swldy1">Expose your anygate models over a local OpenAI/Anthropic-compatible endpoint.</p></div> <!></div> <!> <div class="actions svelte-swldy1"><!></div></div>'
  )
function hf(e, t) {
  me(t, !0)
  let r = re(!1),
    s = re(!1),
    n = re(!1),
    l = re('local'),
    i = re(''),
    o = re(!0),
    v = re(null),
    d = re(Ke([])),
    h = re(!1),
    _ = re(null)
  const f = J(() => Qe.status),
    g = J(() => {
      var P
      return ((P = a(f)) == null ? void 0 : P.saved.hasSavedPassword) ?? !1
    }),
    m = J(() => {
      var z
      const P = ((z = a(f)) == null ? void 0 : z.models) ?? [],
        N = new Map()
      for (const j of P) {
        const D = N.get(j.providerLabel) ?? []
        ;(D.push(j), N.set(j.providerLabel, D))
      }
      return [...N.entries()].map(([j, D]) => ({ label: j, models: D }))
    }),
    y = J(() => {
      if (a(v) === null) return a(d).reduce((N, z) => N + z.modelCount, 0)
      const P = new Set(a(v))
      return a(d)
        .filter(N => P.has(N.id))
        .reduce((N, z) => N + z.modelCount, 0)
    })
  let w = null
  function O() {
    a(f) &&
      ($(r, a(f).saved.favoritesOnly, !0),
      $(s, a(f).saved.freeModelsOnly, !0),
      $(n, a(f).saved.maskGatewayIds, !0),
      $(l, a(f).saved.listenMode, !0),
      $(v, a(f).saved.exposedProviders ?? null, !0))
  }
  Ot(() => {
    if (!a(f)) return
    const P = JSON.stringify(a(f).saved)
    P !== w && ((w = P), O())
  })
  async function B() {
    ;($(h, !0), $(_, null))
    try {
      const P = await av()
      $(d, P.providers ?? [], !0)
    } catch (P) {
      $(_, P instanceof Error ? P.message : String(P), !0)
    } finally {
      $(h, !1)
    }
  }
  Ot(() => {
    var P
    !((P = a(f)) != null && P.running) && a(d).length === 0 && !a(h) && !a(_) && B()
  })
  function x(P) {
    const N = a(v) ?? a(d).map(j => j.id),
      z = N.includes(P) ? N.filter(j => j !== P) : [...N, P]
    $(v, z.length === a(d).length ? null : z, !0)
  }
  function L(P) {
    return a(v) === null || a(v).includes(P)
  }
  async function T(P) {
    try {
      ;(await navigator.clipboard.writeText(P), he('Copied to clipboard', 'success'))
    } catch {
      he('Could not copy to clipboard', 'error')
    }
  }
  async function G() {
    var j, D, F
    if ((j = a(f)) != null && j.running) {
      await Rv()
      return
    }
    if (a(v) !== null && a(v).length === 0) {
      he('Select at least one provider to serve', 'error')
      return
    }
    const P = a(i).trim(),
      N = a(l) === 'network' && !P && a(g)
    if (a(l) === 'network' && !P && !a(g)) {
      he('A server password is required for network mode', 'error')
      return
    }
    !(await Ov({
      favoritesOnly: a(r),
      freeModelsOnly: a(s),
      exposedProviders: a(v),
      maskGatewayIds: a(n),
      listenMode: a(l),
      passwordMode: N ? 'saved' : 'new',
      password: N ? void 0 : P,
      savePassword: a(o),
    })) &&
      (D = Qe.error) != null &&
      D.includes('No providers') &&
      ((F = t.onneedsmodels) == null || F.call(t))
  }
  var A = pf(),
    U = u(A),
    W = c(u(U), 2)
  Xu(W, {
    get status() {
      return a(f)
    },
  })
  var R = c(U, 2)
  {
    var E = P => {
        var N = sf(),
          z = ee(N),
          j = u(z),
          D = c(u(j)),
          F = u(D),
          K = c(D, 2),
          V = c(j, 2),
          Y = c(u(V)),
          X = u(Y),
          te = c(Y, 2),
          le = c(V, 2)
        {
          var ae = Se => {
            var ve = Qu(),
              Me = ee(ve)
            Ee(
              Me,
              17,
              () => a(f).networkUrls,
              je => je.name,
              (je, Ye) => {
                var de = Zu(),
                  pe = u(de),
                  $e = u(pe),
                  Ie = c(pe),
                  Ge = u(Ie),
                  Le = c(Ie, 2)
                ;(I(() => {
                  ;(M($e, a(Ye).name), M(Ge, a(Ye).anthropicUrl))
                }),
                  ne('click', Le, () => T(a(Ye).anthropicUrl)),
                  p(je, de))
              }
            )
            var Ce = c(Me, 2),
              Be = c(u(Ce)),
              De = u(Be),
              He = c(Be, 2)
            ;(I(() => M(De, a(f).apiKey)), ne('click', He, () => T(a(f).apiKey ?? '')), p(Se, ve))
          }
          q(le, Se => {
            a(f).listenMode === 'network' && a(f).networkUrls && Se(ae)
          })
        }
        var ie = c(z, 2)
        {
          var ue = Se => {
            var ve = ef(),
              Me = u(ve)
            ;(I(() => M(Me, a(f).providerSummary)), p(Se, ve))
          }
          q(ie, Se => {
            a(f).providerSummary && Se(ue)
          })
        }
        var Z = c(ie, 2)
        {
          var oe = Se => {
            var ve = af(),
              Me = u(ve),
              Ce = c(u(Me), 2),
              Be = u(Ce),
              De = c(Me, 2)
            ;(Ee(
              De,
              17,
              () => a(m),
              He => He.label,
              (He, je) => {
                var Ye = rf(),
                  de = u(Ye),
                  pe = u(de),
                  $e = c(pe),
                  Ie = u($e),
                  Ge = c(de, 2)
                ;(Ee(
                  Ge,
                  17,
                  () => a(je).models,
                  Le => Le.anthropicId,
                  (Le, ft) => {
                    var Ca = tf(),
                      aa = u(Ca),
                      ts = u(aa),
                      sa = c(aa, 2),
                      rs = u(sa)
                    ;(I(() => {
                      ;(_e(aa, 'title', a(ft).name),
                        M(ts, a(ft).name),
                        _e(sa, 'title', `Copy Anthropic model id: ${a(ft).anthropicId ?? ''}`),
                        M(rs, a(ft).anthropicId))
                    }),
                      ne('click', sa, () => T(a(ft).anthropicId)),
                      p(Le, Ca))
                  }
                ),
                  I(() => {
                    ;(M(pe, a(je).label), M(Ie, a(je).models.length))
                  }),
                  p(He, Ye))
              }
            ),
              I(() => {
                var He, je
                return M(
                  Be,
                  `${((He = a(f).models) == null ? void 0 : He.length) ?? ''} model${((je = a(f).models) == null ? void 0 : je.length) === 1 ? '' : 's'} served`
                )
              }),
              p(Se, ve))
          }
          q(Z, Se => {
            a(m).length > 0 && Se(oe)
          })
        }
        ;(I(() => {
          ;(M(F, a(f).anthropicUrl), M(X, a(f).openaiUrl))
        }),
          ne('click', K, () => T(a(f).anthropicUrl ?? '')),
          ne('click', te, () => T(a(f).openaiUrl ?? '')),
          p(P, N))
      },
      C = P => {
        var N = ff(),
          z = ee(N),
          j = u(z)
        la(j, {
          label: 'Favorites only',
          get checked() {
            return a(r)
          },
          set checked(ve) {
            $(r, ve, !0)
          },
        })
        var D = c(j, 2)
        la(D, {
          label: 'Free models only',
          get checked() {
            return a(s)
          },
          set checked(ve) {
            $(s, ve, !0)
          },
        })
        var F = c(D, 2)
        la(F, {
          label: 'Mask gateway IDs',
          get checked() {
            return a(n)
          },
          set checked(ve) {
            $(n, ve, !0)
          },
        })
        var K = c(F, 2)
        {
          let ve = J(() => a(l) === 'network')
          la(K, {
            get checked() {
              return a(ve)
            },
            onchange: Me => $(l, Me ? 'network' : 'local', !0),
            label: 'Network mode',
          })
        }
        var V = c(K, 2)
        {
          var Y = ve => {
            var Me = nf(),
              Ce = c(ee(Me), 2),
              Be = c(Ce, 2)
            ;(la(Be, {
              label: 'Save password',
              get checked() {
                return a(o)
              },
              set checked(De) {
                $(o, De, !0)
              },
            }),
              I(() =>
                _e(
                  Ce,
                  'placeholder',
                  a(g) ? 'Using saved password — type to replace' : 'required for network mode'
                )
              ),
              Ta(
                Ce,
                () => a(i),
                De => $(i, De)
              ),
              p(ve, Me))
          }
          q(V, ve => {
            a(l) === 'network' && ve(Y)
          })
        }
        var X = c(z, 2),
          te = u(X),
          le = c(u(te), 2)
        {
          var ae = ve => {
            var Me = lf(),
              Ce = u(Me),
              Be = c(Ce, 2)
            ;(ne('click', Ce, () => $(v, null)), ne('click', Be, () => $(v, [], !0)), p(ve, Me))
          }
          q(le, ve => {
            a(d).length > 0 && ve(ae)
          })
        }
        var ie = c(te, 2)
        {
          var ue = ve => {
              Qt(ve, { label: 'Loading providers…' })
            },
            Z = ve => {
              var Me = of(),
                Ce = u(Me),
                Be = c(Ce)
              ;(I(() => M(Ce, `Couldn’t load providers (${a(_) ?? ''}). `)),
                ne('click', Be, () => B()),
                p(ve, Me))
            },
            oe = ve => {
              var Me = vf()
              p(ve, Me)
            },
            Se = ve => {
              var Me = uf(),
                Ce = ee(Me)
              Ee(
                Ce,
                21,
                () => a(d),
                de => de.id,
                (de, pe) => {
                  var $e = df()
                  let Ie
                  var Ge = u($e),
                    Le = u(Ge),
                    ft = c(Ge, 2),
                    Ca = u(ft),
                    aa = c(ft, 2),
                    ts = u(aa)
                  ;(I(
                    (sa, rs, ql) => {
                      ;((Ie = Fe($e, 1, 'prov svelte-swldy1', null, Ie, sa)),
                        _e($e, 'aria-pressed', rs),
                        M(Le, ql),
                        _e(ft, 'title', a(pe).id),
                        M(Ca, a(pe).name),
                        M(ts, a(pe).modelCount))
                    },
                    [() => ({ on: L(a(pe).id) }), () => L(a(pe).id), () => (L(a(pe).id) ? '✓' : '')]
                  ),
                    ne('click', $e, () => x(a(pe).id)),
                    p(de, $e))
                }
              )
              var Be = c(Ce, 2),
                De = u(Be)
              {
                var He = de => {
                    var pe = Q()
                    ;(I(() =>
                      M(pe, `Serving all ${a(d).length ?? ''} providers · ${a(y) ?? ''} models`)
                    ),
                      p(de, pe))
                  },
                  je = de => {
                    var pe = cf()
                    p(de, pe)
                  },
                  Ye = de => {
                    var pe = Q()
                    ;(I(() =>
                      M(
                        pe,
                        `Serving ${a(v).length ?? ''} of ${a(d).length ?? ''} providers · ${a(y) ?? ''} models`
                      )
                    ),
                      p(de, pe))
                  }
                q(De, de => {
                  a(v) === null ? de(He) : a(v).length === 0 ? de(je, 1) : de(Ye, -1)
                })
              }
              p(ve, Me)
            }
          q(ie, ve => {
            a(h) ? ve(ue) : a(_) ? ve(Z, 1) : a(d).length === 0 ? ve(oe, 2) : ve(Se, -1)
          })
        }
        p(P, N)
      }
    q(R, P => {
      var N
      ;(N = a(f)) != null && N.running ? P(E) : P(C, -1)
    })
  }
  var k = c(R, 2),
    H = u(k)
  {
    let P = J(() => {
      var N
      return (N = a(f)) != null && N.running ? 'danger' : 'primary'
    })
    Pe(H, {
      get variant() {
        return a(P)
      },
      get disabled() {
        return Qe.starting
      },
      onclick: G,
      children: (N, z) => {
        var j = Q()
        ;(I(() => {
          var D
          return M(
            j,
            Qe.starting
              ? 'Working…'
              : (D = a(f)) != null && D.running
                ? 'Stop server'
                : 'Start server'
          )
        }),
          p(N, j))
      },
      $$slots: { default: !0 },
    })
  }
  ;(p(e, A), ye())
}
Ve(['click'])
var _f = b('<p style="color:var(--error);font-size:13px"> </p>'),
  gf = b(
    '<div class="page"><div class="head svelte-124gvcr"><h2 class="svelte-124gvcr">Server Gateway</h2> <p class="sub svelte-124gvcr">Run a local OpenAI / Anthropic-compatible server exposing your anygate models to any tool.</p></div> <!> <!></div>'
  )
function mf(e, t) {
  ;(me(t, !1),
    Vs(() => {
      ya()
    }),
    yl())
  var r = gf(),
    s = c(u(r), 2)
  {
    var n = v => {
        Qt(v, { label: 'Reading server status…' })
      },
      l = v => {
        hf(v, { onneedsmodels: () => (location.hash = '#/providers') })
      }
    q(s, v => {
      Qe.loading && !Qe.status ? v(n) : v(l, -1)
    })
  }
  var i = c(s, 2)
  {
    var o = v => {
      Ne(v, {
        padding: '16px',
        children: (d, h) => {
          var _ = _f(),
            f = u(_)
          ;(I(() => M(f, Qe.error)), p(d, _))
        },
        $$slots: { default: !0 },
      })
    }
    q(i, v => {
      Qe.error && v(o)
    })
  }
  ;(p(e, r), ye())
}
var yf = b('<div class="muted svelte-hss3zz">Loading providers…</div>'),
  wf = b('<div class="muted svelte-hss3zz">No providers configured.</div>'),
  bf = b('<div class="muted svelte-hss3zz">Select a provider first.</div>'),
  xf = b(
    '<div class="muted svelte-hss3zz">This provider has no directly-testable (OpenAI/Anthropic) models.</div>'
  ),
  kf = b('<!> Testing…', 1),
  Sf = b(
    '<h3 class="panel-title svelte-hss3zz">Test configuration</h3> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Provider</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Model</span> <!></label> <label class="field svelte-hss3zz"><span class="field-label svelte-hss3zz">Prompt</span> <textarea class="prompt svelte-hss3zz" rows="3" placeholder="What to send to the model…" id="tester-prompt"></textarea></label> <div class="run svelte-hss3zz"><!></div>',
    1
  ),
  Pf = b(
    '<div class="live-pulse svelte-hss3zz"></div> <p class="live-text svelte-hss3zz">Probing <strong class="svelte-hss3zz"> </strong>…</p> <p class="muted svelte-hss3zz">Connecting to upstream endpoint.</p>',
    1
  ),
  Ef = b(
    '<div class="sample svelte-hss3zz"><span class="sample-label svelte-hss3zz">Sample response</span> <pre class="sample-body svelte-hss3zz"> </pre></div>'
  ),
  Mf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot ok svelte-hss3zz"></span> <span class="status-text ok svelte-hss3zz">Endpoint responds</span> <!></div> <div class="metrics svelte-hss3zz"><div class="metric gauge svelte-hss3zz"><svg viewBox="0 0 120 120" class="gauge-svg svelte-hss3zz"><circle class="gauge-bg svelte-hss3zz" cx="60" cy="60" r="52"></circle><circle class="gauge-fg svelte-hss3zz" cx="60" cy="60" r="52"></circle></svg> <div class="gauge-center svelte-hss3zz"><span class="gauge-value svelte-hss3zz"> </span> <span class="gauge-unit svelte-hss3zz">ms TTFT</span></div> <span class="metric-label svelte-hss3zz">Time to first token</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Connect</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Total round-trip</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Tokens / sec</span></div> <div class="metric svelte-hss3zz"><span class="metric-value mono svelte-hss3zz"> </span> <span class="metric-label svelte-hss3zz">Streamed chunks</span></div> <div class="metric svelte-hss3zz"><span> </span> <span class="metric-label svelte-hss3zz">Stream stability</span></div></div> <!>',
    1
  ),
  Af = b('<p class="fail-hint svelte-hss3zz"> </p>'),
  zf = b(
    '<div class="mini-metrics svelte-hss3zz"><span class="svelte-hss3zz"> </span> <span class="svelte-hss3zz"> </span></div>'
  ),
  Tf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Endpoint did not respond correctly</span></div> <p class="fail-error svelte-hss3zz"> </p> <!> <!>',
    1
  ),
  Cf = b(
    '<div class="result-head svelte-hss3zz"><span class="status-dot no svelte-hss3zz"></span> <span class="status-text no svelte-hss3zz">Request error</span></div> <p class="fail-error svelte-hss3zz"> </p>',
    1
  ),
  $f = b(
    'Select a provider + model and hit <strong class="svelte-hss3zz">Run test</strong> to measure live latency.',
    1
  ),
  If =
    b(`<div class="page svelte-hss3zz"><div class="head svelte-hss3zz"><div class="svelte-hss3zz"><h2 class="svelte-hss3zz">Model Tester</h2> <p class="sub svelte-hss3zz">Pick a provider and model, then fire a live request at its real endpoint.
        Measures connection time, time-to-first-token, and total latency.</p></div> <!></div> <div class="grid svelte-hss3zz"><!> <div class="results svelte-hss3zz"><!></div></div></div>`)
function Lf(e, t) {
  me(t, !0)
  let r = re(''),
    s = re(''),
    n = re('Reply with a single word: pong'),
    l = re(!1),
    i = re(null),
    o = re(null)
  const v = J(() =>
      Oe.list
        .filter(k => {
          var H
          return (((H = k.enrichedModels) == null ? void 0 : H.length) ?? 0) > 0
        })
        .map(k => ({ value: k.id, label: k.name }))
    ),
    d = J(() => Oe.list.find(k => k.id === a(r)))
  function h(k) {
    return k.format === 'anthropic' || k.format === 'openai'
  }
  const _ = J(() => {
      var k
      return (((k = a(d)) == null ? void 0 : k.enrichedModels) ?? []).filter(h)
    }),
    f = J(() =>
      a(_).map(k => ({
        value: k.id,
        label: `${k.name ?? k.id}${k.contextWindow ? ` · ${Math.round(k.contextWindow / 1e3)}k` : ''}`,
      }))
    )
  Ot(() => {
    ;(a(r) && a(d) && a(_).some(H => H.id === a(s))) || $(s, '')
  })
  const g = J(() => !!a(r) && !!a(s) && !a(l))
  async function m() {
    if (a(g)) {
      ;($(l, !0), $(i, null), $(o, null))
      try {
        const k = await Uo({ providerId: a(r), modelId: a(s), prompt: a(n) })
        ;($(i, k, !0),
          k.ok
            ? he(`Test passed · ${k.ttftMs}ms TTFT`, 'success')
            : he(k.error ?? 'Test failed', 'error'))
      } catch (k) {
        ;($(o, k instanceof Error ? k.message : String(k), !0), he('Network error', 'error'))
      } finally {
        $(l, !1)
      }
    }
  }
  function y(k) {
    return k == null ? '—' : k < 1e3 ? `${k} ms` : `${(k / 1e3).toFixed(2)} s`
  }
  const w = J(() =>
    a(i) && a(i).ttftMs !== null ? Math.max(0, Math.min(100, 100 - (a(i).ttftMs / 3e3) * 100)) : 0
  )
  var O = If(),
    B = u(O),
    x = c(u(B), 2)
  qe(x, {
    children: (k, H) => {
      var P = Q('server-side · live')
      p(k, P)
    },
    $$slots: { default: !0 },
  })
  var L = c(B, 2),
    T = u(L)
  Ne(T, {
    padding: '22px',
    class: 'panel',
    children: (k, H) => {
      var P = Sf(),
        N = c(ee(P), 2),
        z = c(u(N), 2)
      {
        var j = Z => {
            var oe = yf()
            p(Z, oe)
          },
          D = Z => {
            var oe = wf()
            p(Z, oe)
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
              set value(oe) {
                $(r, oe, !0)
              },
            })
          }
        q(z, Z => {
          Oe.loading ? Z(j) : a(v).length === 0 ? Z(D, 1) : Z(F, -1)
        })
      }
      var K = c(N, 2),
        V = c(u(K), 2)
      {
        var Y = Z => {
            var oe = bf()
            p(Z, oe)
          },
          X = Z => {
            var oe = xf()
            p(Z, oe)
          },
          te = Z => {
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
              set value(oe) {
                $(s, oe, !0)
              },
            })
          }
        q(V, Z => {
          a(r) ? (a(f).length === 0 ? Z(X, 1) : Z(te, -1)) : Z(Y)
        })
      }
      var le = c(K, 2),
        ae = c(u(le), 2),
        ie = c(le, 2),
        ue = u(ie)
      {
        let Z = J(() => !a(g))
        Pe(ue, {
          variant: 'primary',
          size: 'lg',
          get disabled() {
            return a(Z)
          },
          onclick: m,
          children: (oe, Se) => {
            var ve = it(),
              Me = ee(ve)
            {
              var Ce = De => {
                  var He = kf(),
                    je = ee(He)
                  ;(Qt(je, { label: '' }), p(De, He))
                },
                Be = De => {
                  var He = Q('Run test')
                  p(De, He)
                }
              q(Me, De => {
                a(l) ? De(Ce) : De(Be, -1)
              })
            }
            p(oe, ve)
          },
          $$slots: { default: !0 },
        })
      }
      ;(I(() => (ae.disabled = a(l))),
        Ta(
          ae,
          () => a(n),
          Z => $(n, Z)
        ),
        p(k, P))
    },
    $$slots: { default: !0 },
  })
  var G = c(T, 2),
    A = u(G)
  {
    var U = k => {
        Ne(k, {
          padding: '28px',
          class: 'result-card live',
          children: (H, P) => {
            var N = Pf(),
              z = c(ee(N), 2),
              j = c(u(z)),
              D = u(j)
            ;(I(() => M(D, a(s))), p(H, N))
          },
          $$slots: { default: !0 },
        })
      },
      W = k => {
        Ne(k, {
          padding: '24px',
          class: 'result-card pass',
          children: (H, P) => {
            var N = Mf(),
              z = ee(N),
              j = c(u(z), 4)
            qe(j, {
              children: (Ie, Ge) => {
                var Le = Q()
                ;(I(() => M(Le, a(i).format)), p(Ie, Le))
              },
              $$slots: { default: !0 },
            })
            var D = c(z, 2),
              F = u(D),
              K = u(F),
              V = c(u(K)),
              Y = c(K, 2),
              X = u(Y),
              te = u(X),
              le = c(F, 2),
              ae = u(le),
              ie = u(ae),
              ue = c(le, 2),
              Z = u(ue),
              oe = u(Z),
              Se = c(ue, 2),
              ve = u(Se),
              Me = u(ve),
              Ce = c(Se, 2),
              Be = u(Ce),
              De = u(Be),
              He = c(Ce, 2),
              je = u(He)
            let Ye
            var de = u(je),
              pe = c(D, 2)
            {
              var $e = Ie => {
                var Ge = Ef(),
                  Le = c(u(Ge), 2),
                  ft = u(Le)
                ;(I(() => M(ft, a(i).sample)), p(Ie, Ge))
              }
              q(pe, Ie => {
                a(i).sample && Ie($e)
              })
            }
            ;(I(
              (Ie, Ge) => {
                ;(et(V, `stroke-dashoffset: ${329.9 - (329.9 * a(w)) / 100}`),
                  M(te, a(i).ttftMs ?? '—'),
                  M(ie, Ie),
                  M(oe, Ge),
                  M(Me, a(i).tokensPerSec ?? '—'),
                  M(De, a(i).tokens),
                  (Ye = Fe(je, 1, 'metric-value mono svelte-hss3zz', null, Ye, {
                    warn: a(i).streamStability === 'intermittent',
                  })),
                  M(de, a(i).streamStability))
              },
              [() => y(a(i).connectMs), () => y(a(i).totalMs)]
            ),
              p(H, N))
          },
          $$slots: { default: !0 },
        })
      },
      R = k => {
        Ne(k, {
          padding: '24px',
          class: 'result-card fail',
          children: (H, P) => {
            var N = Tf(),
              z = c(ee(N), 2),
              j = u(z),
              D = c(z, 2)
            {
              var F = Y => {
                var X = Af(),
                  te = u(X)
                ;(I(() => M(te, `↳ ${a(i).errorHint ?? ''}`)), p(Y, X))
              }
              q(D, Y => {
                a(i).errorHint && Y(F)
              })
            }
            var K = c(D, 2)
            {
              var V = Y => {
                var X = zf(),
                  te = u(X),
                  le = u(te),
                  ae = c(te, 2),
                  ie = u(ae)
                ;(I(
                  (ue, Z) => {
                    ;(M(le, `connect ${ue ?? ''}`), M(ie, `total ${Z ?? ''}`))
                  },
                  [() => y(a(i).connectMs), () => y(a(i).totalMs)]
                ),
                  p(Y, X))
              }
              q(K, Y => {
                a(i).connectMs !== null && Y(V)
              })
            }
            ;(I(() => M(j, a(i).error)), p(H, N))
          },
          $$slots: { default: !0 },
        })
      },
      E = k => {
        Ne(k, {
          padding: '24px',
          class: 'result-card fail',
          children: (H, P) => {
            var N = Cf(),
              z = c(ee(N), 2),
              j = u(z)
            ;(I(() => M(j, a(o))), p(H, N))
          },
          $$slots: { default: !0 },
        })
      },
      C = k => {
        $r(k, {
          title: 'No test run yet',
          icon: 'M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16M12 12l5-3',
          children: (H, P) => {
            var N = $f()
            p(H, N)
          },
          $$slots: { default: !0 },
        })
      }
    q(A, k => {
      a(l)
        ? k(U)
        : a(i) && a(i).ok
          ? k(W, 1)
          : a(i) && !a(i).ok
            ? k(R, 2)
            : a(o)
              ? k(E, 3)
              : k(C, -1)
    })
  }
  ;(p(e, O), ye())
}
var Of = b(
    '<h3 class="svelte-15j4tnx">Appearance</h3> <div class="line svelte-15j4tnx"><span>Theme</span> <!></div>',
    1
  ),
  Rf = b(
    '<div class="kv svelte-15j4tnx"><span>ANYGATE_HOME</span><code class="svelte-15j4tnx"> </code></div>'
  ),
  Nf = b(
    '<h3 class="svelte-15j4tnx">Subscription tier</h3> <div class="line svelte-15j4tnx"><span>Backend selection for wizards</span> <!></div> <!>',
    1
  ),
  Ff = b(
    '<h3 class="svelte-15j4tnx">Config backup</h3> <p class="muted svelte-15j4tnx">Export favorites to a portable JSON file and re-import on another machine.</p> <div class="acts svelte-15j4tnx"><!> <!></div>',
    1
  ),
  Df = b(
    '<div class="preset svelte-15j4tnx"><div class="pmeta"><span class="pname svelte-15j4tnx"> </span> <span class="psub svelte-15j4tnx"> </span></div> <div class="pacts svelte-15j4tnx"><!> <!></div></div> <pre class="dryrun svelte-15j4tnx"> </pre>',
    1
  ),
  jf = b(
    '<div class="sec-head svelte-15j4tnx"><h3 class="svelte-15j4tnx">Launch presets</h3><!></div> <!>',
    1
  ),
  qf = b(
    '<textarea class="ta svelte-15j4tnx" readonly=""></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Uf = b(
    '<p class="muted svelte-15j4tnx">Paste an anygate config JSON (from Export favorites).</p> <textarea class="ta svelte-15j4tnx" placeholder="Paste JSON here"></textarea> <div class="row svelte-15j4tnx" style="margin-top:14px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Bf = b('<span class="lbl svelte-15j4tnx" style="margin-top:12px">Model</span> <!>', 1),
  Hf = b(
    '<span class="lbl svelte-15j4tnx">Label</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">App</span> <!> <span class="lbl svelte-15j4tnx" style="margin-top:12px">Provider</span> <!> <!> <div class="row svelte-15j4tnx" style="margin-top:18px;justify-content:flex-end;gap:8px"><!> <!></div>',
    1
  ),
  Gf = b(
    '<div class="page"><div class="head svelte-15j4tnx"><h2 class="svelte-15j4tnx">Settings</h2><p class="sub svelte-15j4tnx">Theme, subscription tier, launch presets, and portable config backup.</p></div> <div class="cols svelte-15j4tnx"><div class="stack svelte-15j4tnx"><!> <!> <!></div> <div class="stack svelte-15j4tnx"><!></div></div></div> <!> <!> <!>',
    1
  )
function Wf(e, t) {
  me(t, !0)
  let r = re(!1),
    s = re(''),
    n = re(!1),
    l = re('')
  const i = [
    { value: 'free', label: 'Free' },
    { value: 'zen', label: 'Zen' },
    { value: 'go', label: 'Go' },
    { value: 'both', label: 'Both' },
  ]
  function o() {
    vv()
      .then(P => {
        ;($(s, P, !0), $(r, !0))
      })
      .catch(P => he(String(P), 'error'))
  }
  async function v() {
    try {
      ;(await dv(a(l)), he('Config imported', 'success'), $(n, !1), await Tl())
    } catch (P) {
      he(P instanceof Error ? P.message : String(P), 'error')
    }
  }
  function d() {
    const P = new Blob([a(s)], { type: 'application/json' }),
      N = document.createElement('a')
    ;((N.href = URL.createObjectURL(P)), (N.download = 'anygate-config.json'), N.click())
  }
  let h = re(!1),
    _ = re(''),
    f = re(''),
    g = re(''),
    m = re('')
  function y(P) {
    const N = Oe.list.find(D => D.id === P.providerId),
      z = N == null ? void 0 : N.enrichedModels.find(D => D.id === P.modelId)
    return !N || !z
      ? '—'
      : cv({ provider: N, modelId: z.id, contextWindow: z.contextWindow }).env.map(
          D => `${D.key}=${D.masked ? '•••' : D.value}`
        ).join(`
`)
  }
  var w = Gf(),
    O = ee(w),
    B = c(u(O), 2),
    x = u(B),
    L = u(x)
  Ne(L, {
    padding: '20px',
    children: (P, N) => {
      var z = Of(),
        j = c(ee(z), 2),
        D = c(u(j), 2)
      ;(Pe(D, {
        size: 'sm',
        variant: 'ghost',
        get onclick() {
          return Nl
        },
        children: (F, K) => {
          var V = Q()
          ;(I(() => M(V, `${or.value === 'dark' ? 'Dark' : 'Light'} · toggle`)), p(F, V))
        },
        $$slots: { default: !0 },
      }),
        p(P, z))
    },
    $$slots: { default: !0 },
  })
  var T = c(L, 2)
  Ne(T, {
    padding: '20px',
    children: (P, N) => {
      var z = Nf(),
        j = c(ee(z), 2),
        D = c(u(j), 2)
      vr(D, {
        get value() {
          return ir.tier
        },
        get options() {
          return i
        },
        onchange: V => Mv(V),
      })
      var F = c(j, 2)
      {
        var K = V => {
          var Y = Rf(),
            X = c(u(Y)),
            te = u(X)
          ;(I(() => M(te, ir.anygateHome)), p(V, Y))
        }
        q(F, V => {
          ir.anygateHome && V(K)
        })
      }
      p(P, z)
    },
    $$slots: { default: !0 },
  })
  var G = c(T, 2)
  Ne(G, {
    padding: '20px',
    children: (P, N) => {
      var z = Ff(),
        j = c(ee(z), 4),
        D = u(j)
      Pe(D, {
        size: 'sm',
        variant: 'subtle',
        onclick: o,
        children: (K, V) => {
          var Y = Q('Export favorites')
          p(K, Y)
        },
        $$slots: { default: !0 },
      })
      var F = c(D, 2)
      ;(Pe(F, {
        size: 'sm',
        variant: 'ghost',
        onclick: () => $(n, !0),
        children: (K, V) => {
          var Y = Q('Import')
          p(K, Y)
        },
        $$slots: { default: !0 },
      }),
        p(P, z))
    },
    $$slots: { default: !0 },
  })
  var A = c(x, 2),
    U = u(A)
  Ne(U, {
    padding: '20px',
    children: (P, N) => {
      var z = jf(),
        j = ee(z),
        D = c(u(j))
      Pe(D, {
        size: 'sm',
        onclick: () => {
          ;($(h, !0), $(_, ''), $(f, ''), $(g, ''), $(m, ''))
        },
        children: (Y, X) => {
          var te = Q('New')
          p(Y, te)
        },
        $$slots: { default: !0 },
      })
      var F = c(j, 2)
      {
        var K = Y => {
            $r(Y, {
              title: 'No presets',
              icon: 'M12 5v14M5 12h14',
              children: (X, te) => {
                var le = Q('Save an app + provider + model combo for one-click launch.')
                p(X, le)
              },
              $$slots: { default: !0 },
            })
          },
          V = Y => {
            var X = it(),
              te = ee(X)
            ;(Ee(
              te,
              17,
              () => gt.list,
              le => le.id,
              (le, ae) => {
                var ie = Df(),
                  ue = ee(ie),
                  Z = u(ue),
                  oe = u(Z),
                  Se = u(oe),
                  ve = c(oe, 2),
                  Me = u(ve),
                  Ce = c(Z, 2),
                  Be = u(Ce)
                Pe(Be, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => navigator.clipboard.writeText(y(a(ae))),
                  children: (Ye, de) => {
                    var pe = Q('Dry run')
                    p(Ye, pe)
                  },
                  $$slots: { default: !0 },
                })
                var De = c(Be, 2)
                Pe(De, {
                  size: 'sm',
                  variant: 'ghost',
                  onclick: () => zv(a(ae).id),
                  children: (Ye, de) => {
                    var pe = Q('Delete')
                    p(Ye, pe)
                  },
                  $$slots: { default: !0 },
                })
                var He = c(ue, 2),
                  je = u(He)
                ;(I(
                  Ye => {
                    ;(M(Se, a(ae).label ?? a(ae).appId),
                      M(
                        Me,
                        `${a(ae).providerId ?? ''}${a(ae).modelId ? ' · ' + a(ae).modelId : ''}${a(ae).folder ? ' · ' + a(ae).folder : ''}`
                      ),
                      M(je, Ye))
                  },
                  [() => y(a(ae))]
                ),
                  p(le, ie))
              }
            ),
              p(Y, X))
          }
        q(F, Y => {
          gt.list.length === 0 ? Y(K) : Y(V, -1)
        })
      }
      p(P, z)
    },
    $$slots: { default: !0 },
  })
  var W = c(O, 2)
  {
    var R = P => {
      Er(P, {
        get open() {
          return a(r)
        },
        title: 'Export favorites',
        onclose: () => $(r, !1),
        children: (N, z) => {
          var j = qf(),
            D = ee(j),
            F = c(D, 2),
            K = u(F)
          Pe(K, {
            variant: 'ghost',
            onclick: () => $(r, !1),
            children: (Y, X) => {
              var te = Q('Close')
              p(Y, te)
            },
            $$slots: { default: !0 },
          })
          var V = c(K, 2)
          ;(Pe(V, {
            onclick: d,
            children: (Y, X) => {
              var te = Q('Download')
              p(Y, te)
            },
            $$slots: { default: !0 },
          }),
            I(() => Ks(D, a(s))),
            p(N, j))
        },
        $$slots: { default: !0 },
      })
    }
    q(W, P => {
      a(r) && P(R)
    })
  }
  var E = c(W, 2)
  {
    var C = P => {
      Er(P, {
        get open() {
          return a(n)
        },
        title: 'Import config',
        onclose: () => $(n, !1),
        children: (N, z) => {
          var j = Uf(),
            D = c(ee(j), 2),
            F = c(D, 2),
            K = u(F)
          Pe(K, {
            variant: 'ghost',
            onclick: () => $(n, !1),
            children: (Y, X) => {
              var te = Q('Cancel')
              p(Y, te)
            },
            $$slots: { default: !0 },
          })
          var V = c(K, 2)
          ;(Pe(V, {
            onclick: v,
            children: (Y, X) => {
              var te = Q('Import')
              p(Y, te)
            },
            $$slots: { default: !0 },
          }),
            Ta(
              D,
              () => a(l),
              Y => $(l, Y)
            ),
            p(N, j))
        },
        $$slots: { default: !0 },
      })
    }
    q(E, P => {
      a(n) && P(C)
    })
  }
  var k = c(E, 2)
  {
    var H = P => {
      Er(P, {
        get open() {
          return a(h)
        },
        title: 'New preset',
        onclose: () => $(h, !1),
        children: (N, z) => {
          var j = Hf(),
            D = c(ee(j), 2)
          ar(D, {
            placeholder: 'My daily setup',
            get value() {
              return a(m)
            },
            set value(ae) {
              $(m, ae, !0)
            },
          })
          var F = c(D, 4)
          {
            let ae = J(() => [
              { value: '', label: '—' },
              ...(Oe.list.length
                ? [
                    { value: 'claude', label: 'Claude' },
                    { value: 'codex', label: 'Codex' },
                    { value: 'antigravity', label: 'Antigravity' },
                  ]
                : []),
            ])
            vr(F, {
              get options() {
                return a(ae)
              },
              get value() {
                return a(_)
              },
              set value(ie) {
                $(_, ie, !0)
              },
            })
          }
          var K = c(F, 4)
          {
            let ae = J(() => [
              { value: '', label: '—' },
              ...Oe.list.map(ie => ({ value: ie.id, label: ie.name })),
            ])
            vr(K, {
              get options() {
                return a(ae)
              },
              get value() {
                return a(f)
              },
              set value(ie) {
                $(f, ie, !0)
              },
            })
          }
          var V = c(K, 2)
          {
            var Y = ae => {
              var ie = Bf(),
                ue = c(ee(ie), 2)
              {
                let Z = J(() => {
                  var oe
                  return [
                    { value: '', label: '—' },
                    ...(
                      ((oe = Oe.list.find(Se => Se.id === a(f))) == null
                        ? void 0
                        : oe.enrichedModels) ?? []
                    ).map(Se => ({ value: Se.id, label: Se.name ?? Se.id })),
                  ]
                })
                vr(ue, {
                  get options() {
                    return a(Z)
                  },
                  get value() {
                    return a(g)
                  },
                  set value(oe) {
                    $(g, oe, !0)
                  },
                })
              }
              p(ae, ie)
            }
            q(V, ae => {
              a(f) && ae(Y)
            })
          }
          var X = c(V, 2),
            te = u(X)
          Pe(te, {
            variant: 'ghost',
            onclick: () => $(h, !1),
            children: (ae, ie) => {
              var ue = Q('Cancel')
              p(ae, ue)
            },
            $$slots: { default: !0 },
          })
          var le = c(te, 2)
          {
            let ae = J(() => !a(_) || !a(m))
            Pe(le, {
              get disabled() {
                return a(ae)
              },
              onclick: async () => {
                ;(await Av({
                  appId: a(_),
                  providerId: a(f) || void 0,
                  modelId: a(g) || void 0,
                  label: a(m),
                }),
                  $(h, !1))
              },
              children: (ie, ue) => {
                var Z = Q('Save')
                p(ie, Z)
              },
              $$slots: { default: !0 },
            })
          }
          p(N, j)
        },
        $$slots: { default: !0 },
      })
    }
    q(k, P => {
      a(h) && P(H)
    })
  }
  ;(p(e, w), ye())
}
var Kf = b(
  '<div class="app-shell svelte-1n46o8q"><!> <div class="main svelte-1n46o8q"><!> <main class="content svelte-1n46o8q"><!> <!> <!> <!> <!> <!> <!></main></div></div> <!> <!>',
  1
)
function Vf(e, t) {
  me(t, !0)
  let r = ''
  function s(E) {
    ;(E.metaKey || E.ctrlKey) && E.key.toLowerCase() === 'k' && (E.preventDefault(), Ro())
  }
  Vs(
    () => (
      Io(),
      window.addEventListener('keydown', s),
      Js(),
      Ml(),
      Sv(),
      Ev(),
      Tl(),
      Cs(),
      Il(),
      Iv(),
      () => {
        ;(window.removeEventListener('keydown', s), Lv(), Cv())
      }
    )
  )
  var n = Kf(),
    l = ee(n),
    i = u(l)
  Dv(i, {})
  var o = c(i, 2),
    v = u(o)
  ud(v, {})
  var d = c(v, 2),
    h = u(d)
  {
    var _ = E => {
      Ic(E, {})
    }
    q(h, E => {
      Tt.route === 'dashboard' && E(_)
    })
  }
  var f = c(h, 2)
  {
    var g = E => {
      vu(E, {})
    }
    q(f, E => {
      Tt.route === 'providers' && E(g)
    })
  }
  var m = c(f, 2)
  {
    var y = E => {
      Iu(E, {})
    }
    q(m, E => {
      Tt.route === 'models' && E(y)
    })
  }
  var w = c(m, 2)
  {
    var O = E => {
      Yu(E, {})
    }
    q(w, E => {
      Tt.route === 'apps' && E(O)
    })
  }
  var B = c(w, 2)
  {
    var x = E => {
      mf(E, {})
    }
    q(B, E => {
      Tt.route === 'server' && E(x)
    })
  }
  var L = c(B, 2)
  {
    var T = E => {
      Lf(E, {})
    }
    q(L, E => {
      Tt.route === 'tester' && E(T)
    })
  }
  var G = c(L, 2)
  {
    var A = E => {
      Wf(E, {})
    }
    q(G, E => {
      Tt.route === 'settings' && E(A)
    })
  }
  var U = c(l, 2)
  hd(U, {})
  var W = c(U, 2)
  {
    var R = E => {
      yd(E, {
        query: r,
        get onclose() {
          return Oo
        },
      })
    }
    q(W, E => {
      Lt.commandOpen && E(R)
    })
  }
  ;(p(e, n), ye())
}
try {
  _o(Vf, { target: document.getElementById('app') })
} catch (e) {
  console.error('Runtime error during mount:', e)
  const t = document.getElementById('app'),
    r = e instanceof Error ? e.stack || e.message : String(e)
  t &&
    (t.innerHTML = `<pre style="color:#ff8a8a;background:#161616;padding:24px;margin:0;white-space:pre-wrap;font:13px ui-monospace,monospace;max-height:100vh;overflow:auto">MOUNT ERROR:

${r.replace(/[<>&]/g, s => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[s])}</pre>`)
}
