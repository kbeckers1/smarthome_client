(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorate = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i9 = decorators.length - 1, decorator; i9 >= 0; i9--)
      if (decorator = decorators[i9])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };

  // node_modules/@lit/reactive-element/css-tag.js
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var t = globalThis;
  var e = t.ShadowRoot && (t.ShadyCSS === void 0 || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
  var s = Symbol();
  var o = new WeakMap();
  var n = class {
    constructor(t8, e10, o13) {
      if (this._$cssResult$ = true, o13 !== s)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t8, this.t = e10;
    }
    get styleSheet() {
      let t8 = this.o;
      const s11 = this.t;
      if (e && t8 === void 0) {
        const e10 = s11 !== void 0 && s11.length === 1;
        e10 && (t8 = o.get(s11)), t8 === void 0 && ((this.o = t8 = new CSSStyleSheet()).replaceSync(this.cssText), e10 && o.set(s11, t8));
      }
      return t8;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t8) => new n(typeof t8 == "string" ? t8 : t8 + "", void 0, s);
  var i = (t8, ...e10) => {
    const o13 = t8.length === 1 ? t8[0] : e10.reduce((e11, s11, o14) => e11 + ((t9) => {
      if (t9._$cssResult$ === true)
        return t9.cssText;
      if (typeof t9 == "number")
        return t9;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t9 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s11) + t8[o14 + 1], t8[0]);
    return new n(o13, t8, s);
  };
  var S = (s11, o13) => {
    if (e)
      s11.adoptedStyleSheets = o13.map((t8) => t8 instanceof CSSStyleSheet ? t8 : t8.styleSheet);
    else
      for (const e10 of o13) {
        const o14 = document.createElement("style"), n12 = t.litNonce;
        n12 !== void 0 && o14.setAttribute("nonce", n12), o14.textContent = e10.cssText, s11.appendChild(o14);
      }
  };
  var c = e ? (t8) => t8 : (t8) => t8 instanceof CSSStyleSheet ? ((t9) => {
    let e10 = "";
    for (const s11 of t9.cssRules)
      e10 += s11.cssText;
    return r(e10);
  })(t8) : t8;

  // node_modules/@lit/reactive-element/reactive-element.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var {is: i2, defineProperty: e2, getOwnPropertyDescriptor: h, getOwnPropertyNames: r2, getOwnPropertySymbols: o2, getPrototypeOf: n2} = Object;
  var a = globalThis;
  var c2 = a.trustedTypes;
  var l = c2 ? c2.emptyScript : "";
  var p = a.reactiveElementPolyfillSupport;
  var d = (t8, s11) => t8;
  var u = {toAttribute(t8, s11) {
    switch (s11) {
      case Boolean:
        t8 = t8 ? l : null;
        break;
      case Object:
      case Array:
        t8 = t8 == null ? t8 : JSON.stringify(t8);
    }
    return t8;
  }, fromAttribute(t8, s11) {
    let i9 = t8;
    switch (s11) {
      case Boolean:
        i9 = t8 !== null;
        break;
      case Number:
        i9 = t8 === null ? null : Number(t8);
        break;
      case Object:
      case Array:
        try {
          i9 = JSON.parse(t8);
        } catch (t9) {
          i9 = null;
        }
    }
    return i9;
  }};
  var f = (t8, s11) => !i2(t8, s11);
  var b = {attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f};
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = new WeakMap());
  var y = class extends HTMLElement {
    static addInitializer(t8) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t8);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t8, s11 = b) {
      if (s11.state && (s11.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t8) && ((s11 = Object.create(s11)).wrapped = true), this.elementProperties.set(t8, s11), !s11.noAccessor) {
        const i9 = Symbol(), h7 = this.getPropertyDescriptor(t8, i9, s11);
        h7 !== void 0 && e2(this.prototype, t8, h7);
      }
    }
    static getPropertyDescriptor(t8, s11, i9) {
      const {get: e10, set: r12} = h(this.prototype, t8) ?? {get() {
        return this[s11];
      }, set(t9) {
        this[s11] = t9;
      }};
      return {get: e10, set(s12) {
        const h7 = e10?.call(this);
        r12?.call(this, s12), this.requestUpdate(t8, h7, i9);
      }, configurable: true, enumerable: true};
    }
    static getPropertyOptions(t8) {
      return this.elementProperties.get(t8) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties")))
        return;
      const t8 = n2(this);
      t8.finalize(), t8.l !== void 0 && (this.l = [...t8.l]), this.elementProperties = new Map(t8.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized")))
        return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t9 = this.properties, s11 = [...r2(t9), ...o2(t9)];
        for (const i9 of s11)
          this.createProperty(i9, t9[i9]);
      }
      const t8 = this[Symbol.metadata];
      if (t8 !== null) {
        const s11 = litPropertyMetadata.get(t8);
        if (s11 !== void 0)
          for (const [t9, i9] of s11)
            this.elementProperties.set(t9, i9);
      }
      this._$Eh = new Map();
      for (const [t9, s11] of this.elementProperties) {
        const i9 = this._$Eu(t9, s11);
        i9 !== void 0 && this._$Eh.set(i9, t9);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s11) {
      const i9 = [];
      if (Array.isArray(s11)) {
        const e10 = new Set(s11.flat(1 / 0).reverse());
        for (const s12 of e10)
          i9.unshift(c(s12));
      } else
        s11 !== void 0 && i9.push(c(s11));
      return i9;
    }
    static _$Eu(t8, s11) {
      const i9 = s11.attribute;
      return i9 === false ? void 0 : typeof i9 == "string" ? i9 : typeof t8 == "string" ? t8.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t8) => this.enableUpdating = t8), this._$AL = new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t8) => t8(this));
    }
    addController(t8) {
      (this._$EO ?? (this._$EO = new Set())).add(t8), this.renderRoot !== void 0 && this.isConnected && t8.hostConnected?.();
    }
    removeController(t8) {
      this._$EO?.delete(t8);
    }
    _$E_() {
      const t8 = new Map(), s11 = this.constructor.elementProperties;
      for (const i9 of s11.keys())
        this.hasOwnProperty(i9) && (t8.set(i9, this[i9]), delete this[i9]);
      t8.size > 0 && (this._$Ep = t8);
    }
    createRenderRoot() {
      const t8 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t8, this.constructor.elementStyles), t8;
    }
    connectedCallback() {
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t8) => t8.hostConnected?.());
    }
    enableUpdating(t8) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t8) => t8.hostDisconnected?.());
    }
    attributeChangedCallback(t8, s11, i9) {
      this._$AK(t8, i9);
    }
    _$ET(t8, s11) {
      const i9 = this.constructor.elementProperties.get(t8), e10 = this.constructor._$Eu(t8, i9);
      if (e10 !== void 0 && i9.reflect === true) {
        const h7 = (i9.converter?.toAttribute !== void 0 ? i9.converter : u).toAttribute(s11, i9.type);
        this._$Em = t8, h7 == null ? this.removeAttribute(e10) : this.setAttribute(e10, h7), this._$Em = null;
      }
    }
    _$AK(t8, s11) {
      const i9 = this.constructor, e10 = i9._$Eh.get(t8);
      if (e10 !== void 0 && this._$Em !== e10) {
        const t9 = i9.getPropertyOptions(e10), h7 = typeof t9.converter == "function" ? {fromAttribute: t9.converter} : t9.converter?.fromAttribute !== void 0 ? t9.converter : u;
        this._$Em = e10;
        const r12 = h7.fromAttribute(s11, t9.type);
        this[e10] = r12 ?? this._$Ej?.get(e10) ?? r12, this._$Em = null;
      }
    }
    requestUpdate(t8, s11, i9) {
      if (t8 !== void 0) {
        const e10 = this.constructor, h7 = this[t8];
        if (i9 ?? (i9 = e10.getPropertyOptions(t8)), !((i9.hasChanged ?? f)(h7, s11) || i9.useDefault && i9.reflect && h7 === this._$Ej?.get(t8) && !this.hasAttribute(e10._$Eu(t8, i9))))
          return;
        this.C(t8, s11, i9);
      }
      this.isUpdatePending === false && (this._$ES = this._$EP());
    }
    C(t8, s11, {useDefault: i9, reflect: e10, wrapped: h7}, r12) {
      i9 && !(this._$Ej ?? (this._$Ej = new Map())).has(t8) && (this._$Ej.set(t8, r12 ?? s11 ?? this[t8]), h7 !== true || r12 !== void 0) || (this._$AL.has(t8) || (this.hasUpdated || i9 || (s11 = void 0), this._$AL.set(t8, s11)), e10 === true && this._$Em !== t8 && (this._$Eq ?? (this._$Eq = new Set())).add(t8));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t9) {
        Promise.reject(t9);
      }
      const t8 = this.scheduleUpdate();
      return t8 != null && await t8, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending)
        return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t10, s12] of this._$Ep)
            this[t10] = s12;
          this._$Ep = void 0;
        }
        const t9 = this.constructor.elementProperties;
        if (t9.size > 0)
          for (const [s12, i9] of t9) {
            const {wrapped: t10} = i9, e10 = this[s12];
            t10 !== true || this._$AL.has(s12) || e10 === void 0 || this.C(s12, void 0, i9, e10);
          }
      }
      let t8 = false;
      const s11 = this._$AL;
      try {
        t8 = this.shouldUpdate(s11), t8 ? (this.willUpdate(s11), this._$EO?.forEach((t9) => t9.hostUpdate?.()), this.update(s11)) : this._$EM();
      } catch (s12) {
        throw t8 = false, this._$EM(), s12;
      }
      t8 && this._$AE(s11);
    }
    willUpdate(t8) {
    }
    _$AE(t8) {
      this._$EO?.forEach((t9) => t9.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t8)), this.updated(t8);
    }
    _$EM() {
      this._$AL = new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t8) {
      return true;
    }
    update(t8) {
      this._$Eq && (this._$Eq = this._$Eq.forEach((t9) => this._$ET(t9, this[t9]))), this._$EM();
    }
    updated(t8) {
    }
    firstUpdated(t8) {
    }
  };
  y.elementStyles = [], y.shadowRootOptions = {mode: "open"}, y[d("elementProperties")] = new Map(), y[d("finalized")] = new Map(), p?.({ReactiveElement: y}), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.1.1");

  // node_modules/lit-html/lit-html.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var t2 = globalThis;
  var i3 = t2.trustedTypes;
  var s2 = i3 ? i3.createPolicy("lit-html", {createHTML: (t8) => t8}) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t8) => t8 === null || typeof t8 != "object" && typeof t8 != "function";
  var a2 = Array.isArray;
  var u2 = (t8) => a2(t8) || typeof t8?.[Symbol.iterator] == "function";
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t8) => (i9, ...s11) => ({_$litType$: t8, strings: i9, values: s11});
  var x = y2(1);
  var b2 = y2(2);
  var w = y2(3);
  var T = Symbol.for("lit-noChange");
  var E = Symbol.for("lit-nothing");
  var A = new WeakMap();
  var C = r3.createTreeWalker(r3, 129);
  function P(t8, i9) {
    if (!a2(t8) || !t8.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return s2 !== void 0 ? s2.createHTML(i9) : i9;
  }
  var V = (t8, i9) => {
    const s11 = t8.length - 1, o13 = [];
    let r12, l8 = i9 === 2 ? "<svg>" : i9 === 3 ? "<math>" : "", c9 = f2;
    for (let i10 = 0; i10 < s11; i10++) {
      const s12 = t8[i10];
      let a5, u7, d4 = -1, y4 = 0;
      for (; y4 < s12.length && (c9.lastIndex = y4, u7 = c9.exec(s12), u7 !== null); )
        y4 = c9.lastIndex, c9 === f2 ? u7[1] === "!--" ? c9 = v : u7[1] !== void 0 ? c9 = _ : u7[2] !== void 0 ? ($.test(u7[2]) && (r12 = RegExp("</" + u7[2], "g")), c9 = m) : u7[3] !== void 0 && (c9 = m) : c9 === m ? u7[0] === ">" ? (c9 = r12 ?? f2, d4 = -1) : u7[1] === void 0 ? d4 = -2 : (d4 = c9.lastIndex - u7[2].length, a5 = u7[1], c9 = u7[3] === void 0 ? m : u7[3] === '"' ? g : p2) : c9 === g || c9 === p2 ? c9 = m : c9 === v || c9 === _ ? c9 = f2 : (c9 = m, r12 = void 0);
      const x3 = c9 === m && t8[i10 + 1].startsWith("/>") ? " " : "";
      l8 += c9 === f2 ? s12 + n3 : d4 >= 0 ? (o13.push(a5), s12.slice(0, d4) + e3 + s12.slice(d4) + h2 + x3) : s12 + h2 + (d4 === -2 ? i10 : x3);
    }
    return [P(t8, l8 + (t8[s11] || "<?>") + (i9 === 2 ? "</svg>" : i9 === 3 ? "</math>" : "")), o13];
  };
  var N = class {
    constructor({strings: t8, _$litType$: s11}, n12) {
      let r12;
      this.parts = [];
      let c9 = 0, a5 = 0;
      const u7 = t8.length - 1, d4 = this.parts, [f6, v4] = V(t8, s11);
      if (this.el = N.createElement(f6, n12), C.currentNode = this.el.content, s11 === 2 || s11 === 3) {
        const t9 = this.el.content.firstChild;
        t9.replaceWith(...t9.childNodes);
      }
      for (; (r12 = C.nextNode()) !== null && d4.length < u7; ) {
        if (r12.nodeType === 1) {
          if (r12.hasAttributes())
            for (const t9 of r12.getAttributeNames())
              if (t9.endsWith(e3)) {
                const i9 = v4[a5++], s12 = r12.getAttribute(t9).split(h2), e10 = /([.?@])?(.*)/.exec(i9);
                d4.push({type: 1, index: c9, name: e10[2], strings: s12, ctor: e10[1] === "." ? H : e10[1] === "?" ? I : e10[1] === "@" ? L : k}), r12.removeAttribute(t9);
              } else
                t9.startsWith(h2) && (d4.push({type: 6, index: c9}), r12.removeAttribute(t9));
          if ($.test(r12.tagName)) {
            const t9 = r12.textContent.split(h2), s12 = t9.length - 1;
            if (s12 > 0) {
              r12.textContent = i3 ? i3.emptyScript : "";
              for (let i9 = 0; i9 < s12; i9++)
                r12.append(t9[i9], l2()), C.nextNode(), d4.push({type: 2, index: ++c9});
              r12.append(t9[s12], l2());
            }
          }
        } else if (r12.nodeType === 8)
          if (r12.data === o3)
            d4.push({type: 2, index: c9});
          else {
            let t9 = -1;
            for (; (t9 = r12.data.indexOf(h2, t9 + 1)) !== -1; )
              d4.push({type: 7, index: c9}), t9 += h2.length - 1;
          }
        c9++;
      }
    }
    static createElement(t8, i9) {
      const s11 = r3.createElement("template");
      return s11.innerHTML = t8, s11;
    }
  };
  function S2(t8, i9, s11 = t8, e10) {
    if (i9 === T)
      return i9;
    let h7 = e10 !== void 0 ? s11._$Co?.[e10] : s11._$Cl;
    const o13 = c3(i9) ? void 0 : i9._$litDirective$;
    return h7?.constructor !== o13 && (h7?._$AO?.(false), o13 === void 0 ? h7 = void 0 : (h7 = new o13(t8), h7._$AT(t8, s11, e10)), e10 !== void 0 ? (s11._$Co ?? (s11._$Co = []))[e10] = h7 : s11._$Cl = h7), h7 !== void 0 && (i9 = S2(t8, h7._$AS(t8, i9.values), h7, e10)), i9;
  }
  var M = class {
    constructor(t8, i9) {
      this._$AV = [], this._$AN = void 0, this._$AD = t8, this._$AM = i9;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t8) {
      const {el: {content: i9}, parts: s11} = this._$AD, e10 = (t8?.creationScope ?? r3).importNode(i9, true);
      C.currentNode = e10;
      let h7 = C.nextNode(), o13 = 0, n12 = 0, l8 = s11[0];
      for (; l8 !== void 0; ) {
        if (o13 === l8.index) {
          let i10;
          l8.type === 2 ? i10 = new R(h7, h7.nextSibling, this, t8) : l8.type === 1 ? i10 = new l8.ctor(h7, l8.name, l8.strings, this, t8) : l8.type === 6 && (i10 = new z(h7, this, t8)), this._$AV.push(i10), l8 = s11[++n12];
        }
        o13 !== l8?.index && (h7 = C.nextNode(), o13++);
      }
      return C.currentNode = r3, e10;
    }
    p(t8) {
      let i9 = 0;
      for (const s11 of this._$AV)
        s11 !== void 0 && (s11.strings !== void 0 ? (s11._$AI(t8, s11, i9), i9 += s11.strings.length - 2) : s11._$AI(t8[i9])), i9++;
    }
  };
  var R = class {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t8, i9, s11, e10) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t8, this._$AB = i9, this._$AM = s11, this.options = e10, this._$Cv = e10?.isConnected ?? true;
    }
    get parentNode() {
      let t8 = this._$AA.parentNode;
      const i9 = this._$AM;
      return i9 !== void 0 && t8?.nodeType === 11 && (t8 = i9.parentNode), t8;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t8, i9 = this) {
      t8 = S2(this, t8, i9), c3(t8) ? t8 === E || t8 == null || t8 === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : t8 !== this._$AH && t8 !== T && this._(t8) : t8._$litType$ !== void 0 ? this.$(t8) : t8.nodeType !== void 0 ? this.T(t8) : u2(t8) ? this.k(t8) : this._(t8);
    }
    O(t8) {
      return this._$AA.parentNode.insertBefore(t8, this._$AB);
    }
    T(t8) {
      this._$AH !== t8 && (this._$AR(), this._$AH = this.O(t8));
    }
    _(t8) {
      this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t8 : this.T(r3.createTextNode(t8)), this._$AH = t8;
    }
    $(t8) {
      const {values: i9, _$litType$: s11} = t8, e10 = typeof s11 == "number" ? this._$AC(t8) : (s11.el === void 0 && (s11.el = N.createElement(P(s11.h, s11.h[0]), this.options)), s11);
      if (this._$AH?._$AD === e10)
        this._$AH.p(i9);
      else {
        const t9 = new M(e10, this), s12 = t9.u(this.options);
        t9.p(i9), this.T(s12), this._$AH = t9;
      }
    }
    _$AC(t8) {
      let i9 = A.get(t8.strings);
      return i9 === void 0 && A.set(t8.strings, i9 = new N(t8)), i9;
    }
    k(t8) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i9 = this._$AH;
      let s11, e10 = 0;
      for (const h7 of t8)
        e10 === i9.length ? i9.push(s11 = new R(this.O(l2()), this.O(l2()), this, this.options)) : s11 = i9[e10], s11._$AI(h7), e10++;
      e10 < i9.length && (this._$AR(s11 && s11._$AB.nextSibling, e10), i9.length = e10);
    }
    _$AR(t8 = this._$AA.nextSibling, i9) {
      for (this._$AP?.(false, true, i9); t8 !== this._$AB; ) {
        const i10 = t8.nextSibling;
        t8.remove(), t8 = i10;
      }
    }
    setConnected(t8) {
      this._$AM === void 0 && (this._$Cv = t8, this._$AP?.(t8));
    }
  };
  var k = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t8, i9, s11, e10, h7) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t8, this.name = i9, this._$AM = e10, this.options = h7, s11.length > 2 || s11[0] !== "" || s11[1] !== "" ? (this._$AH = Array(s11.length - 1).fill(new String()), this.strings = s11) : this._$AH = E;
    }
    _$AI(t8, i9 = this, s11, e10) {
      const h7 = this.strings;
      let o13 = false;
      if (h7 === void 0)
        t8 = S2(this, t8, i9, 0), o13 = !c3(t8) || t8 !== this._$AH && t8 !== T, o13 && (this._$AH = t8);
      else {
        const e11 = t8;
        let n12, r12;
        for (t8 = h7[0], n12 = 0; n12 < h7.length - 1; n12++)
          r12 = S2(this, e11[s11 + n12], i9, n12), r12 === T && (r12 = this._$AH[n12]), o13 || (o13 = !c3(r12) || r12 !== this._$AH[n12]), r12 === E ? t8 = E : t8 !== E && (t8 += (r12 ?? "") + h7[n12 + 1]), this._$AH[n12] = r12;
      }
      o13 && !e10 && this.j(t8);
    }
    j(t8) {
      t8 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t8 ?? "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t8) {
      this.element[this.name] = t8 === E ? void 0 : t8;
    }
  };
  var I = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t8) {
      this.element.toggleAttribute(this.name, !!t8 && t8 !== E);
    }
  };
  var L = class extends k {
    constructor(t8, i9, s11, e10, h7) {
      super(t8, i9, s11, e10, h7), this.type = 5;
    }
    _$AI(t8, i9 = this) {
      if ((t8 = S2(this, t8, i9, 0) ?? E) === T)
        return;
      const s11 = this._$AH, e10 = t8 === E && s11 !== E || t8.capture !== s11.capture || t8.once !== s11.once || t8.passive !== s11.passive, h7 = t8 !== E && (s11 === E || e10);
      e10 && this.element.removeEventListener(this.name, this, s11), h7 && this.element.addEventListener(this.name, this, t8), this._$AH = t8;
    }
    handleEvent(t8) {
      typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t8) : this._$AH.handleEvent(t8);
    }
  };
  var z = class {
    constructor(t8, i9, s11) {
      this.element = t8, this.type = 6, this._$AN = void 0, this._$AM = i9, this.options = s11;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t8) {
      S2(this, t8);
    }
  };
  var Z = {M: e3, P: h2, A: o3, C: 1, L: V, R: M, D: u2, V: S2, I: R, H: k, N: I, U: L, B: H, F: z};
  var j = t2.litHtmlPolyfillSupport;
  j?.(N, R), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.1");
  var B = (t8, i9, s11) => {
    const e10 = s11?.renderBefore ?? i9;
    let h7 = e10._$litPart$;
    if (h7 === void 0) {
      const t9 = s11?.renderBefore ?? null;
      e10._$litPart$ = h7 = new R(i9.insertBefore(l2(), t9), t9, void 0, s11 ?? {});
    }
    return h7._$AI(t8), h7;
  };

  // node_modules/lit-element/lit-element.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s3 = globalThis;
  var i4 = class extends y {
    constructor() {
      super(...arguments), this.renderOptions = {host: this}, this._$Do = void 0;
    }
    createRenderRoot() {
      var _a;
      const t8 = super.createRenderRoot();
      return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t8.firstChild), t8;
    }
    update(t8) {
      const r12 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t8), this._$Do = B(r12, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      super.connectedCallback(), this._$Do?.setConnected(true);
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this._$Do?.setConnected(false);
    }
    render() {
      return T;
    }
  };
  i4._$litElement$ = true, i4["finalized"] = true, s3.litElementHydrateSupport?.({LitElement: i4});
  var o4 = s3.litElementPolyfillSupport;
  o4?.({LitElement: i4});
  (s3.litElementVersions ?? (s3.litElementVersions = [])).push("4.2.1");

  // node_modules/lit-html/is-server.js
  /**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/custom-element.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var t3 = (t8) => (e10, o13) => {
    o13 !== void 0 ? o13.addInitializer(() => {
      customElements.define(t8, e10);
    }) : customElements.define(t8, e10);
  };

  // node_modules/@lit/reactive-element/decorators/property.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var o5 = {attribute: true, type: String, converter: u, reflect: false, hasChanged: f};
  var r4 = (t8 = o5, e10, r12) => {
    const {kind: n12, metadata: i9} = r12;
    let s11 = globalThis.litPropertyMetadata.get(i9);
    if (s11 === void 0 && globalThis.litPropertyMetadata.set(i9, s11 = new Map()), n12 === "setter" && ((t8 = Object.create(t8)).wrapped = true), s11.set(r12.name, t8), n12 === "accessor") {
      const {name: o13} = r12;
      return {set(r13) {
        const n13 = e10.get.call(this);
        e10.set.call(this, r13), this.requestUpdate(o13, n13, t8);
      }, init(e11) {
        return e11 !== void 0 && this.C(o13, void 0, t8, e11), e11;
      }};
    }
    if (n12 === "setter") {
      const {name: o13} = r12;
      return function(r13) {
        const n13 = this[o13];
        e10.call(this, r13), this.requestUpdate(o13, n13, t8);
      };
    }
    throw Error("Unsupported decorator location: " + n12);
  };
  function n4(t8) {
    return (e10, o13) => typeof o13 == "object" ? r4(t8, e10, o13) : ((t9, e11, o14) => {
      const r12 = e11.hasOwnProperty(o14);
      return e11.constructor.createProperty(o14, t9), r12 ? Object.getOwnPropertyDescriptor(e11, o14) : void 0;
    })(t8, e10, o13);
  }

  // node_modules/@lit/reactive-element/decorators/state.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/event-options.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/base.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/query.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/query-all.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/query-async.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/signal-polyfill/dist/index.js
  var __defProp2 = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp2(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };
  var __accessCheck = (obj, member, msg) => {
    if (!member.has(obj))
      throw TypeError("Cannot " + msg);
  };
  var __privateIn = (member, obj) => {
    if (Object(obj) !== obj)
      throw TypeError('Cannot use the "in" operator on this value');
    return member.has(obj);
  };
  var __privateAdd = (obj, member, value) => {
    if (member.has(obj))
      throw TypeError("Cannot add the same private member more than once");
    member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  };
  var __privateMethod = (obj, member, method) => {
    __accessCheck(obj, member, "access private method");
    return method;
  };
  /**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  function defaultEquals(a5, b4) {
    return Object.is(a5, b4);
  }
  /**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  var activeConsumer = null;
  var inNotificationPhase = false;
  var epoch = 1;
  var SIGNAL = /* @__PURE__ */ Symbol("SIGNAL");
  function setActiveConsumer(consumer) {
    const prev = activeConsumer;
    activeConsumer = consumer;
    return prev;
  }
  function getActiveConsumer() {
    return activeConsumer;
  }
  function isInNotificationPhase() {
    return inNotificationPhase;
  }
  var REACTIVE_NODE = {
    version: 0,
    lastCleanEpoch: 0,
    dirty: false,
    producerNode: void 0,
    producerLastReadVersion: void 0,
    producerIndexOfThis: void 0,
    nextProducerIndex: 0,
    liveConsumerNode: void 0,
    liveConsumerIndexOfThis: void 0,
    consumerAllowSignalWrites: false,
    consumerIsAlwaysLive: false,
    producerMustRecompute: () => false,
    producerRecomputeValue: () => {
    },
    consumerMarkedDirty: () => {
    },
    consumerOnSignalRead: () => {
    }
  };
  function producerAccessed(node) {
    if (inNotificationPhase) {
      throw new Error(typeof ngDevMode !== "undefined" && ngDevMode ? `Assertion error: signal read during notification phase` : "");
    }
    if (activeConsumer === null) {
      return;
    }
    activeConsumer.consumerOnSignalRead(node);
    const idx = activeConsumer.nextProducerIndex++;
    assertConsumerNode(activeConsumer);
    if (idx < activeConsumer.producerNode.length && activeConsumer.producerNode[idx] !== node) {
      if (consumerIsLive(activeConsumer)) {
        const staleProducer = activeConsumer.producerNode[idx];
        producerRemoveLiveConsumerAtIndex(staleProducer, activeConsumer.producerIndexOfThis[idx]);
      }
    }
    if (activeConsumer.producerNode[idx] !== node) {
      activeConsumer.producerNode[idx] = node;
      activeConsumer.producerIndexOfThis[idx] = consumerIsLive(activeConsumer) ? producerAddLiveConsumer(node, activeConsumer, idx) : 0;
    }
    activeConsumer.producerLastReadVersion[idx] = node.version;
  }
  function producerIncrementEpoch() {
    epoch++;
  }
  function producerUpdateValueVersion(node) {
    if (!node.dirty && node.lastCleanEpoch === epoch) {
      return;
    }
    if (!node.producerMustRecompute(node) && !consumerPollProducersForChange(node)) {
      node.dirty = false;
      node.lastCleanEpoch = epoch;
      return;
    }
    node.producerRecomputeValue(node);
    node.dirty = false;
    node.lastCleanEpoch = epoch;
  }
  function producerNotifyConsumers(node) {
    if (node.liveConsumerNode === void 0) {
      return;
    }
    const prev = inNotificationPhase;
    inNotificationPhase = true;
    try {
      for (const consumer of node.liveConsumerNode) {
        if (!consumer.dirty) {
          consumerMarkDirty(consumer);
        }
      }
    } finally {
      inNotificationPhase = prev;
    }
  }
  function producerUpdatesAllowed() {
    return (activeConsumer == null ? void 0 : activeConsumer.consumerAllowSignalWrites) !== false;
  }
  function consumerMarkDirty(node) {
    var _a;
    node.dirty = true;
    producerNotifyConsumers(node);
    (_a = node.consumerMarkedDirty) == null ? void 0 : _a.call(node.wrapper ?? node);
  }
  function consumerBeforeComputation(node) {
    node && (node.nextProducerIndex = 0);
    return setActiveConsumer(node);
  }
  function consumerAfterComputation(node, prevConsumer) {
    setActiveConsumer(prevConsumer);
    if (!node || node.producerNode === void 0 || node.producerIndexOfThis === void 0 || node.producerLastReadVersion === void 0) {
      return;
    }
    if (consumerIsLive(node)) {
      for (let i9 = node.nextProducerIndex; i9 < node.producerNode.length; i9++) {
        producerRemoveLiveConsumerAtIndex(node.producerNode[i9], node.producerIndexOfThis[i9]);
      }
    }
    while (node.producerNode.length > node.nextProducerIndex) {
      node.producerNode.pop();
      node.producerLastReadVersion.pop();
      node.producerIndexOfThis.pop();
    }
  }
  function consumerPollProducersForChange(node) {
    assertConsumerNode(node);
    for (let i9 = 0; i9 < node.producerNode.length; i9++) {
      const producer = node.producerNode[i9];
      const seenVersion = node.producerLastReadVersion[i9];
      if (seenVersion !== producer.version) {
        return true;
      }
      producerUpdateValueVersion(producer);
      if (seenVersion !== producer.version) {
        return true;
      }
    }
    return false;
  }
  function producerAddLiveConsumer(node, consumer, indexOfThis) {
    var _a;
    assertProducerNode(node);
    assertConsumerNode(node);
    if (node.liveConsumerNode.length === 0) {
      (_a = node.watched) == null ? void 0 : _a.call(node.wrapper);
      for (let i9 = 0; i9 < node.producerNode.length; i9++) {
        node.producerIndexOfThis[i9] = producerAddLiveConsumer(node.producerNode[i9], node, i9);
      }
    }
    node.liveConsumerIndexOfThis.push(indexOfThis);
    return node.liveConsumerNode.push(consumer) - 1;
  }
  function producerRemoveLiveConsumerAtIndex(node, idx) {
    var _a;
    assertProducerNode(node);
    assertConsumerNode(node);
    if (typeof ngDevMode !== "undefined" && ngDevMode && idx >= node.liveConsumerNode.length) {
      throw new Error(`Assertion error: active consumer index ${idx} is out of bounds of ${node.liveConsumerNode.length} consumers)`);
    }
    if (node.liveConsumerNode.length === 1) {
      (_a = node.unwatched) == null ? void 0 : _a.call(node.wrapper);
      for (let i9 = 0; i9 < node.producerNode.length; i9++) {
        producerRemoveLiveConsumerAtIndex(node.producerNode[i9], node.producerIndexOfThis[i9]);
      }
    }
    const lastIdx = node.liveConsumerNode.length - 1;
    node.liveConsumerNode[idx] = node.liveConsumerNode[lastIdx];
    node.liveConsumerIndexOfThis[idx] = node.liveConsumerIndexOfThis[lastIdx];
    node.liveConsumerNode.length--;
    node.liveConsumerIndexOfThis.length--;
    if (idx < node.liveConsumerNode.length) {
      const idxProducer = node.liveConsumerIndexOfThis[idx];
      const consumer = node.liveConsumerNode[idx];
      assertConsumerNode(consumer);
      consumer.producerIndexOfThis[idxProducer] = idx;
    }
  }
  function consumerIsLive(node) {
    var _a;
    return node.consumerIsAlwaysLive || (((_a = node == null ? void 0 : node.liveConsumerNode) == null ? void 0 : _a.length) ?? 0) > 0;
  }
  function assertConsumerNode(node) {
    node.producerNode ?? (node.producerNode = []);
    node.producerIndexOfThis ?? (node.producerIndexOfThis = []);
    node.producerLastReadVersion ?? (node.producerLastReadVersion = []);
  }
  function assertProducerNode(node) {
    node.liveConsumerNode ?? (node.liveConsumerNode = []);
    node.liveConsumerIndexOfThis ?? (node.liveConsumerIndexOfThis = []);
  }
  /**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  function computedGet(node) {
    producerUpdateValueVersion(node);
    producerAccessed(node);
    if (node.value === ERRORED) {
      throw node.error;
    }
    return node.value;
  }
  function createComputed(computation) {
    const node = Object.create(COMPUTED_NODE);
    node.computation = computation;
    const computed = () => computedGet(node);
    computed[SIGNAL] = node;
    return computed;
  }
  var UNSET = /* @__PURE__ */ Symbol("UNSET");
  var COMPUTING = /* @__PURE__ */ Symbol("COMPUTING");
  var ERRORED = /* @__PURE__ */ Symbol("ERRORED");
  var COMPUTED_NODE = /* @__PURE__ */ (() => {
    return {
      ...REACTIVE_NODE,
      value: UNSET,
      dirty: true,
      error: null,
      equal: defaultEquals,
      producerMustRecompute(node) {
        return node.value === UNSET || node.value === COMPUTING;
      },
      producerRecomputeValue(node) {
        if (node.value === COMPUTING) {
          throw new Error("Detected cycle in computations.");
        }
        const oldValue = node.value;
        node.value = COMPUTING;
        const prevConsumer = consumerBeforeComputation(node);
        let newValue;
        let wasEqual = false;
        try {
          newValue = node.computation.call(node.wrapper);
          const oldOk = oldValue !== UNSET && oldValue !== ERRORED;
          wasEqual = oldOk && node.equal.call(node.wrapper, oldValue, newValue);
        } catch (err) {
          newValue = ERRORED;
          node.error = err;
        } finally {
          consumerAfterComputation(node, prevConsumer);
        }
        if (wasEqual) {
          node.value = oldValue;
          return;
        }
        node.value = newValue;
        node.version++;
      }
    };
  })();
  /**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  function defaultThrowError() {
    throw new Error();
  }
  var throwInvalidWriteToSignalErrorFn = defaultThrowError;
  function throwInvalidWriteToSignalError() {
    throwInvalidWriteToSignalErrorFn();
  }
  /**
   * @license
   * Copyright Google LLC All Rights Reserved.
   *
   * Use of this source code is governed by an MIT-style license that can be
   * found in the LICENSE file at https://angular.io/license
   */
  function createSignal(initialValue) {
    const node = Object.create(SIGNAL_NODE);
    node.value = initialValue;
    const getter = () => {
      producerAccessed(node);
      return node.value;
    };
    getter[SIGNAL] = node;
    return getter;
  }
  function signalGetFn() {
    producerAccessed(this);
    return this.value;
  }
  function signalSetFn(node, newValue) {
    if (!producerUpdatesAllowed()) {
      throwInvalidWriteToSignalError();
    }
    if (!node.equal.call(node.wrapper, node.value, newValue)) {
      node.value = newValue;
      signalValueChanged(node);
    }
  }
  var SIGNAL_NODE = /* @__PURE__ */ (() => {
    return {
      ...REACTIVE_NODE,
      equal: defaultEquals,
      value: void 0
    };
  })();
  function signalValueChanged(node) {
    node.version++;
    producerIncrementEpoch();
    producerNotifyConsumers(node);
  }
  /**
   * @license
   * Copyright 2024 Bloomberg Finance L.P.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *     http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var NODE = Symbol("node");
  var Signal;
  ((Signal22) => {
    var _a, _brand, brand_fn, _b, _brand2, brand_fn2;
    class State {
      constructor(initialValue, options = {}) {
        __privateAdd(this, _brand);
        __publicField(this, _a);
        const ref = createSignal(initialValue);
        const node = ref[SIGNAL];
        this[NODE] = node;
        node.wrapper = this;
        if (options) {
          const equals = options.equals;
          if (equals) {
            node.equal = equals;
          }
          node.watched = options[Signal22.subtle.watched];
          node.unwatched = options[Signal22.subtle.unwatched];
        }
      }
      get() {
        if (!(0, Signal22.isState)(this))
          throw new TypeError("Wrong receiver type for Signal.State.prototype.get");
        return signalGetFn.call(this[NODE]);
      }
      set(newValue) {
        if (!(0, Signal22.isState)(this))
          throw new TypeError("Wrong receiver type for Signal.State.prototype.set");
        if (isInNotificationPhase()) {
          throw new Error("Writes to signals not permitted during Watcher callback");
        }
        const ref = this[NODE];
        signalSetFn(ref, newValue);
      }
    }
    _a = NODE;
    _brand = new WeakSet();
    brand_fn = function() {
    };
    Signal22.isState = (s11) => typeof s11 === "object" && __privateIn(_brand, s11);
    Signal22.State = State;
    class Computed {
      constructor(computation, options) {
        __privateAdd(this, _brand2);
        __publicField(this, _b);
        const ref = createComputed(computation);
        const node = ref[SIGNAL];
        node.consumerAllowSignalWrites = true;
        this[NODE] = node;
        node.wrapper = this;
        if (options) {
          const equals = options.equals;
          if (equals) {
            node.equal = equals;
          }
          node.watched = options[Signal22.subtle.watched];
          node.unwatched = options[Signal22.subtle.unwatched];
        }
      }
      get() {
        if (!(0, Signal22.isComputed)(this))
          throw new TypeError("Wrong receiver type for Signal.Computed.prototype.get");
        return computedGet(this[NODE]);
      }
    }
    _b = NODE;
    _brand2 = new WeakSet();
    brand_fn2 = function() {
    };
    Signal22.isComputed = (c9) => typeof c9 === "object" && __privateIn(_brand2, c9);
    Signal22.Computed = Computed;
    ((subtle2) => {
      var _a2, _brand3, brand_fn3, _assertSignals, assertSignals_fn;
      function untrack(cb) {
        let output;
        let prevActiveConsumer = null;
        try {
          prevActiveConsumer = setActiveConsumer(null);
          output = cb();
        } finally {
          setActiveConsumer(prevActiveConsumer);
        }
        return output;
      }
      subtle2.untrack = untrack;
      function introspectSources(sink) {
        var _a3;
        if (!(0, Signal22.isComputed)(sink) && !(0, Signal22.isWatcher)(sink)) {
          throw new TypeError("Called introspectSources without a Computed or Watcher argument");
        }
        return ((_a3 = sink[NODE].producerNode) == null ? void 0 : _a3.map((n12) => n12.wrapper)) ?? [];
      }
      subtle2.introspectSources = introspectSources;
      function introspectSinks(signal) {
        var _a3;
        if (!(0, Signal22.isComputed)(signal) && !(0, Signal22.isState)(signal)) {
          throw new TypeError("Called introspectSinks without a Signal argument");
        }
        return ((_a3 = signal[NODE].liveConsumerNode) == null ? void 0 : _a3.map((n12) => n12.wrapper)) ?? [];
      }
      subtle2.introspectSinks = introspectSinks;
      function hasSinks(signal) {
        if (!(0, Signal22.isComputed)(signal) && !(0, Signal22.isState)(signal)) {
          throw new TypeError("Called hasSinks without a Signal argument");
        }
        const liveConsumerNode = signal[NODE].liveConsumerNode;
        if (!liveConsumerNode)
          return false;
        return liveConsumerNode.length > 0;
      }
      subtle2.hasSinks = hasSinks;
      function hasSources(signal) {
        if (!(0, Signal22.isComputed)(signal) && !(0, Signal22.isWatcher)(signal)) {
          throw new TypeError("Called hasSources without a Computed or Watcher argument");
        }
        const producerNode = signal[NODE].producerNode;
        if (!producerNode)
          return false;
        return producerNode.length > 0;
      }
      subtle2.hasSources = hasSources;
      class Watcher {
        constructor(notify) {
          __privateAdd(this, _brand3);
          __privateAdd(this, _assertSignals);
          __publicField(this, _a2);
          let node = Object.create(REACTIVE_NODE);
          node.wrapper = this;
          node.consumerMarkedDirty = notify;
          node.consumerIsAlwaysLive = true;
          node.consumerAllowSignalWrites = false;
          node.producerNode = [];
          this[NODE] = node;
        }
        watch(...signals) {
          if (!(0, Signal22.isWatcher)(this)) {
            throw new TypeError("Called unwatch without Watcher receiver");
          }
          __privateMethod(this, _assertSignals, assertSignals_fn).call(this, signals);
          const node = this[NODE];
          node.dirty = false;
          const prev = setActiveConsumer(node);
          for (const signal of signals) {
            producerAccessed(signal[NODE]);
          }
          setActiveConsumer(prev);
        }
        unwatch(...signals) {
          if (!(0, Signal22.isWatcher)(this)) {
            throw new TypeError("Called unwatch without Watcher receiver");
          }
          __privateMethod(this, _assertSignals, assertSignals_fn).call(this, signals);
          const node = this[NODE];
          assertConsumerNode(node);
          for (let i9 = node.producerNode.length - 1; i9 >= 0; i9--) {
            if (signals.includes(node.producerNode[i9].wrapper)) {
              producerRemoveLiveConsumerAtIndex(node.producerNode[i9], node.producerIndexOfThis[i9]);
              const lastIdx = node.producerNode.length - 1;
              node.producerNode[i9] = node.producerNode[lastIdx];
              node.producerIndexOfThis[i9] = node.producerIndexOfThis[lastIdx];
              node.producerNode.length--;
              node.producerIndexOfThis.length--;
              node.nextProducerIndex--;
              if (i9 < node.producerNode.length) {
                const idxConsumer = node.producerIndexOfThis[i9];
                const producer = node.producerNode[i9];
                assertProducerNode(producer);
                producer.liveConsumerIndexOfThis[idxConsumer] = i9;
              }
            }
          }
        }
        getPending() {
          if (!(0, Signal22.isWatcher)(this)) {
            throw new TypeError("Called getPending without Watcher receiver");
          }
          const node = this[NODE];
          return node.producerNode.filter((n12) => n12.dirty).map((n12) => n12.wrapper);
        }
      }
      _a2 = NODE;
      _brand3 = new WeakSet();
      brand_fn3 = function() {
      };
      _assertSignals = new WeakSet();
      assertSignals_fn = function(signals) {
        for (const signal of signals) {
          if (!(0, Signal22.isComputed)(signal) && !(0, Signal22.isState)(signal)) {
            throw new TypeError("Called watch/unwatch without a Computed or State argument");
          }
        }
      };
      Signal22.isWatcher = (w3) => __privateIn(_brand3, w3);
      subtle2.Watcher = Watcher;
      function currentComputed() {
        var _a3;
        return (_a3 = getActiveConsumer()) == null ? void 0 : _a3.wrapper;
      }
      subtle2.currentComputed = currentComputed;
      subtle2.watched = Symbol("watched");
      subtle2.unwatched = Symbol("unwatched");
    })(Signal22.subtle || (Signal22.subtle = {}));
  })(Signal || (Signal = {}));

  // node_modules/@lit-labs/signals/lib/signal-watcher.js
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var i5 = false;
  var s4 = new Signal.subtle.Watcher(() => {
    i5 || (i5 = true, queueMicrotask(() => {
      i5 = false;
      for (const t8 of s4.getPending())
        t8.get();
      s4.watch();
    }));
  });
  var h3 = Symbol("SignalWatcherBrand");
  var e5 = new FinalizationRegistry((i9) => {
    i9.unwatch(...Signal.subtle.introspectSources(i9));
  });
  var n5 = new WeakMap();

  // node_modules/lit-html/directive.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var t4 = {ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6};
  var e6 = (t8) => (...e10) => ({_$litDirective$: t8, values: e10});
  var i6 = class {
    constructor(t8) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t8, e10, i9) {
      this._$Ct = t8, this._$AM = e10, this._$Ci = i9;
    }
    _$AS(t8, e10) {
      return this.update(t8, e10);
    }
    update(t8, e10) {
      return this.render(...e10);
    }
  };

  // node_modules/lit-html/directive-helpers.js
  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var {I: t5} = Z;
  var f3 = (o13) => o13.strings === void 0;
  var r5 = () => document.createComment("");
  var s5 = (o13, i9, n12) => {
    const e10 = o13._$AA.parentNode, l8 = i9 === void 0 ? o13._$AB : i9._$AA;
    if (n12 === void 0) {
      const i10 = e10.insertBefore(r5(), l8), d4 = e10.insertBefore(r5(), l8);
      n12 = new t5(i10, d4, o13, o13.options);
    } else {
      const t8 = n12._$AB.nextSibling, i10 = n12._$AM, d4 = i10 !== o13;
      if (d4) {
        let t9;
        n12._$AQ?.(o13), n12._$AM = o13, n12._$AP !== void 0 && (t9 = o13._$AU) !== i10._$AU && n12._$AP(t9);
      }
      if (t8 !== l8 || d4) {
        let o14 = n12._$AA;
        for (; o14 !== t8; ) {
          const t9 = o14.nextSibling;
          e10.insertBefore(o14, l8), o14 = t9;
        }
      }
    }
    return n12;
  };
  var v2 = (o13, t8, i9 = o13) => (o13._$AI(t8, i9), o13);
  var u3 = {};
  var m2 = (o13, t8 = u3) => o13._$AH = t8;
  var p3 = (o13) => o13._$AH;
  var M2 = (o13) => {
    o13._$AR(), o13._$AA.remove();
  };

  // node_modules/lit-html/async-directive.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s6 = (i9, t8) => {
    const e10 = i9._$AN;
    if (e10 === void 0)
      return false;
    for (const i10 of e10)
      i10._$AO?.(t8, false), s6(i10, t8);
    return true;
  };
  var o6 = (i9) => {
    let t8, e10;
    do {
      if ((t8 = i9._$AM) === void 0)
        break;
      e10 = t8._$AN, e10.delete(i9), i9 = t8;
    } while (e10?.size === 0);
  };
  var r6 = (i9) => {
    for (let t8; t8 = i9._$AM; i9 = t8) {
      let e10 = t8._$AN;
      if (e10 === void 0)
        t8._$AN = e10 = new Set();
      else if (e10.has(i9))
        break;
      e10.add(i9), c4(t8);
    }
  };
  function h4(i9) {
    this._$AN !== void 0 ? (o6(this), this._$AM = i9, r6(this)) : this._$AM = i9;
  }
  function n6(i9, t8 = false, e10 = 0) {
    const r12 = this._$AH, h7 = this._$AN;
    if (h7 !== void 0 && h7.size !== 0)
      if (t8)
        if (Array.isArray(r12))
          for (let i10 = e10; i10 < r12.length; i10++)
            s6(r12[i10], false), o6(r12[i10]);
        else
          r12 != null && (s6(r12, false), o6(r12));
      else
        s6(this, i9);
  }
  var c4 = (i9) => {
    i9.type == t4.CHILD && (i9._$AP ?? (i9._$AP = n6), i9._$AQ ?? (i9._$AQ = h4));
  };
  var f4 = class extends i6 {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(i9, t8, e10) {
      super._$AT(i9, t8, e10), r6(this), this.isConnected = i9._$AU;
    }
    _$AO(i9, t8 = true) {
      i9 !== this.isConnected && (this.isConnected = i9, i9 ? this.reconnected?.() : this.disconnected?.()), t8 && (s6(this, i9), o6(this));
    }
    setValue(t8) {
      if (f3(this._$Ct))
        this._$Ct._$AI(t8, this);
      else {
        const i9 = [...this._$Ct._$AH];
        i9[this._$Ci] = t8, this._$Ct._$AI(i9, this, 0);
      }
    }
    disconnected() {
    }
    reconnected() {
    }
  };

  // node_modules/@lit-labs/signals/lib/watch.js
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var o7 = false;
  var n7 = new Signal.subtle.Watcher(async () => {
    o7 || (o7 = true, queueMicrotask(() => {
      o7 = false;
      for (const i9 of n7.getPending())
        i9.get();
      n7.watch();
    }));
  });
  var r7 = class extends f4 {
    _$S_() {
      var i9, t8;
      this._$Sm === void 0 && (this._$Sj = new Signal.Computed(() => {
        var i10;
        const t9 = (i10 = this._$SW) === null || i10 === void 0 ? void 0 : i10.get();
        return this.setValue(t9), t9;
      }), this._$Sm = (t8 = (i9 = this._$Sk) === null || i9 === void 0 ? void 0 : i9.h) !== null && t8 !== void 0 ? t8 : n7, this._$Sm.watch(this._$Sj), Signal.subtle.untrack(() => {
        var i10;
        return (i10 = this._$Sj) === null || i10 === void 0 ? void 0 : i10.get();
      }));
    }
    _$Sp() {
      this._$Sm !== void 0 && (this._$Sm.unwatch(this._$SW), this._$Sm = void 0);
    }
    render(i9) {
      return Signal.subtle.untrack(() => i9.get());
    }
    update(i9, [t8]) {
      var o13, n12;
      return (o13 = this._$Sk) !== null && o13 !== void 0 || (this._$Sk = (n12 = i9.options) === null || n12 === void 0 ? void 0 : n12.host), t8 !== this._$SW && this._$SW !== void 0 && this._$Sp(), this._$SW = t8, this._$S_(), Signal.subtle.untrack(() => this._$SW.get());
    }
    disconnected() {
      this._$Sp();
    }
    reconnected() {
      this._$S_();
    }
  };
  var h5 = e6(r7);

  // node_modules/@lit-labs/signals/lib/html-tag.js
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var m3 = (o13) => (t8, ...m5) => o13(t8, ...m5.map((o14) => o14 instanceof Signal.State || o14 instanceof Signal.Computed ? h5(o14) : o14));
  var l3 = m3(x);
  var r8 = m3(b2);

  // node_modules/@lit-labs/signals/index.js
  /**
   * @license
   * Copyright 2023 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var l4 = Signal.State;
  var o9 = Signal.Computed;
  var r9 = (l8, o13) => new Signal.State(l8, o13);

  // src/services/RouterService.ts
  var Routes = {
    0: {vanityName: "Home", iconPath: "/public/home.svg", pageSelector: "ly-home", show: true},
    1: {vanityName: "Apparaten", iconPath: "/public/devices.svg", pageSelector: "ly-devices", show: true},
    2: {vanityName: "Sensoren", iconPath: "/public/sensors.svg", pageSelector: "ly-sensors", show: true},
    3: {vanityName: "Weersvoorspelling", iconPath: "/public/weather.svg", pageSelector: "ly-predictions", show: true},
    4: {vanityName: "Account", iconPath: "/public/account.svg", pageSelector: "ly-account", show: true},
    5: {vanityName: "Auth", iconPath: "/public/account.svg", pageSelector: "ly-auth", show: false}
  };
  var _Router = class {
    constructor() {
      this.state = r9(5);
    }
    route(route) {
      this.state.set(route);
      try {
        window.dispatchEvent(new CustomEvent("route-changed", {detail: route}));
      } catch (e10) {
        console.warn("Could not dispatch route-changed event", e10);
      }
    }
  };
  var Router = new _Router();

  // src/components/sidebar/MenuEntry.ts
  var base_style = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        :host {
            display: inline-flex;
            height: 45px;
            justify-content: center;
            align-items: center;
            border-radius: 5px;
            cursor: pointer;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
        }
        .inner {
            display: inline-flex;
            font-family: "Funnel Display", Helvetica;
            font-size: 16px;
            border-radius: 20px;
            width: 100%;
            justify-content: left;
            padding-left: 10px;
            align-items: center;
            cursor: inherit;
            color: white;
            vertical-align: middle;
            margin: 0px !important;
            height: 100%;
            box-sizing: border-box;
            min-width: 0;
            transition: 0.3s;
        }
        p {
            padding: 0;
            text-align: center;
        }
    </style>
`;
  var selected = x`
    <style>
        .inner {
            background-color: #4ac088;
            color: white;
            border: solid 0px #00851f;
        }
        .inner:hover {
            background-color: #46b481;
        }
    </style>
`;
  var unselected = x`
    <style>
        .inner {
            background-color: transparent;
            color: white;
            border: solid 0px #00851f;
        }
        .inner:hover {
            background-color: #bfebc9;
        }
    </style>
`;
  var Styles;
  (function(Styles3) {
    Styles3[Styles3["SELECTED"] = 0] = "SELECTED";
    Styles3[Styles3["UNSELECTED"] = 1] = "UNSELECTED";
  })(Styles || (Styles = {}));
  var LocalStyles = {
    [0]: selected,
    [1]: unselected
  };
  var MenuEntry = class extends i4 {
    constructor() {
      super();
      this.title = "Entry";
      this.entry = 0;
      this.type = 0;
      this.icon = "";
    }
    _handleClick(e10) {
      Router.route(this.entry.valueOf());
    }
    render() {
      return x`
            ${base_style}
            ${this.type == 0 ? selected : unselected}
            <button @click="${this._handleClick}" class="inner">
                <img src=${this.icon} style="margin-right: 5px;" height="22px;" />
                <p>${this.title}</p>
            </button>
        `;
    }
  };
  __decorate([
    n4()
  ], MenuEntry.prototype, "title", 2);
  __decorate([
    n4({type: Number})
  ], MenuEntry.prototype, "type", 2);
  __decorate([
    n4({type: String})
  ], MenuEntry.prototype, "icon", 2);
  __decorate([
    n4({type: Number})
  ], MenuEntry.prototype, "entry", 2);
  MenuEntry = __decorate([
    t3("menu-entry")
  ], MenuEntry);

  // src/components/forms/Title.ts
  var base_style2 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: block;
            border-radius: 100px;
            width: calc(100% - (5px / 2));
            justify-content: center;
            align-items: center;
            cursor: inherit;
            color: black;
            margin: 0px;
            height: 13px;
            box-sizing: border-box;
            transition: 0.3s;
        }
        h2 {
            margin-top: 0px;
            margin-bottom: 0px;
            padding: 0;
            font-family: "Funnel Display", sans-serif;
            font-weight: 900;
        }
    </style>    
`;
  var Title = class extends i4 {
    constructor() {
      super();
      this.margined = true;
      this.size = "24px";
    }
    render() {
      const margins = this.margined === true ? x`
                <style>
                    h2 {
                        margin-top: 5px;
                        margin-bottom: 3px;
                    }
                </style>
            ` : x`
                <style>
                    h2 {
                        margin-top: 0px;
                        margin-bottom: 0px;
                    }
                </style>
            `;
      return x`
            ${base_style2}
            ${margins}
            <h2 style="font-size: ${this.size};">
                <slot></slot>
            </h2>
        `;
    }
  };
  __decorate([
    n4({type: Boolean, reflect: true})
  ], Title.prototype, "margined", 2);
  __decorate([
    n4({type: String})
  ], Title.prototype, "size", 2);
  Title = __decorate([
    t3("md-title")
  ], Title);

  // src/components/forms/RichText.ts
  var base_style3 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: inline-flex;
            border-radius: 100px;
            width: calc(100% - (5px / 2));
            justify-content: center;
            align-items: center;
            cursor: inherit;
            color: black;
            vertical-align: middle;
            margin: 0px;
            height: 13px;
            box-sizing: border-box;
            transition: 0.3s;
        }
        slot {
            padding: 0;
            font-size: 15px!important;
            font-family: "Funnel Display", Helvetica;
            line-height: 20px;
            white-space: normal;
            margin-block-start: 0!important;
            margin-block-end: 0!important;
            margin-block: 0!important;
        }
    </style>    
`;
  var RichText = class extends i4 {
    constructor() {
      super();
      this.text = "Continue";
    }
    render() {
      return x`
            ${base_style3}
            <slot></slot>
        `;
    }
  };
  __decorate([
    n4()
  ], RichText.prototype, "text", 2);
  RichText = __decorate([
    t3("md-richtext")
  ], RichText);

  // src/components/general/Surface.ts
  var base_style4 = x`
    <style>
        :root { 

        }
        :host {
            display: flex;
            border: solid 1px #a2a2a2;
            width: 500px;
            height: 300px;
            border-radius: 15px;
            background-color: #ffffff;
            min-width: 0;
            min-height: 0;
            flex-shrink: 1;
            overflow: auto;
        }
    </style>    
`;
  var Surface = class extends i4 {
    constructor() {
      super();
      this.padding = "15px";
      this.width = "fit-content";
      this.height = "auto";
    }
    render() {
      return x`
            ${base_style4}
            <style>
                :host {
                    width: ${this.width};
                    height: ${this.height};
                    padding: ${this.padding};
                }
            </style>
            <slot></slot>
        `;
    }
  };
  __decorate([
    n4({type: String})
  ], Surface.prototype, "width", 2);
  __decorate([
    n4({type: String})
  ], Surface.prototype, "height", 2);
  __decorate([
    n4({type: String})
  ], Surface.prototype, "padding", 2);
  Surface = __decorate([
    t3("gl-surface")
  ], Surface);

  // src/components/general/DataTile.ts
  var base_style5 = x`
    <style>
        :root { 

        }
        :host {
            display: flex;
            width: 500px;
            height: 300px;
            border-radius: 15px;
            padding: 15px;
            min-width: 0;
            min-height: 0;
            flex-shrink: 1;
            overflow: auto;
            color: white;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
    </style>    
`;
  var DataTile = class extends i4 {
    constructor() {
      super();
      this.width = "fit-content";
      this.height = "auto";
      this.color = "#ffffff";
      this.border_color = "#ffffff";
    }
    render() {
      return x`
            ${base_style5}
            <style>
                :host {
                    width: ${this.width};
                    height: ${this.height};
                    color: ${this.color};
                    border: solid 2px ${this.color};
                }
            </style>
            <slot></slot>
        `;
    }
  };
  __decorate([
    n4({type: String})
  ], DataTile.prototype, "width", 2);
  __decorate([
    n4({type: String})
  ], DataTile.prototype, "height", 2);
  __decorate([
    n4({type: String})
  ], DataTile.prototype, "color", 2);
  __decorate([
    n4({type: String})
  ], DataTile.prototype, "border_color", 2);
  DataTile = __decorate([
    t3("gl-data-tile")
  ], DataTile);

  // src/components/forms/Button.ts
  var base_style6 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        :host {
            display: inline-flex;
            height: 40px;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            margin-right: 5px;
        }
        .inner {
            display: inline-flex;
            font-family: "Funnel Display", Helvetica;
            font-size: 14px;
            border-radius: 15px;
            width: calc(100% - (5px / 2));
            justify-content: center;
            align-items: center;
            cursor: inherit;
            vertical-align: middle;
            margin: 0px !important;
            height: calc(100% - (5px / 2));
            box-sizing: border-box;
            transition: 0.3s;
            padding-left: 25px;
            padding-right: 25px;
            min-width: 90px;
            white-space: nowrap;
        }
        p {
            margin: 30px;
            padding: 0;
            text-align: center;
        }
    </style>
`;
  var red = x`
    <style>
        .inner {
            border: solid 1px #c30000;
            background: #c30000;
            color: white;
        }
        .inner:hover {
            border: solid 1px #a70000;
            background-color: #a70000;
        }
        .inner:disabled {
            border: solid 1px #ffb8b8;
            background-color: #ffb8b8;
            cursor: default;
        }
    </style>
`;
  var yellow = x`
    <style>
        .inner {
            border: solid 1px #e1b400;
            background: #e1b400;
            color: white;
        }
        .inner:hover {
            border: solid 1px #c49c00;
            background-color: #c49c00;
        }
        .inner:disabled {
            border: solid 1px #dfcd83;
            background-color: #dfcd83;
            cursor: default;
        }
    </style>
`;
  var secondary = x`
    <style>
        .inner {
            background-color: #f9fff9;
            color: black;
            border: solid 1px #a2a2a2;
        }
        .inner:hover {
            background-color: #def4e4;
            border: solid 1px #8d8d8d;
        }
    </style>
`;
  var primary = x`
    <style>
        .inner {
            border: solid 1px #008905;
            background: #008905;
            color: white;
        }
        .inner:hover {
            border: solid 1px #007604;
            background-color: #007604;
        }
        .inner:disabled {
            border: solid 1px #78b27a;
            background-color: #78b27a;
            cursor: default;
        }
    </style>
`;
  var Styles2 = {
    Red: red,
    Primary: primary,
    Secondary: secondary,
    Yellow: yellow
  };
  var Button = class extends i4 {
    constructor() {
      super();
      this.type = red;
      this.icon = "";
      this.callback = () => {
      };
      this.disabled = false;
    }
    _handleClick(e10) {
      if (this.disabled === false) {
        this.callback();
      }
    }
    render() {
      let icon;
      if (this.icon !== "") {
        icon = x`<img src=${this.icon} style="margin-right: 5px; color: white;" height="17px;" />`;
      }
      return x`
            ${base_style6}
            ${this.type}
            <button class="inner" @click=${(e10) => this._handleClick(e10)} ?disabled=${this.disabled} >
                ${icon}
                <slot></slot>
            </button>
        `;
    }
  };
  __decorate([
    n4({type: Object})
  ], Button.prototype, "type", 2);
  __decorate([
    n4({type: String})
  ], Button.prototype, "icon", 2);
  __decorate([
    n4({type: Boolean})
  ], Button.prototype, "disabled", 2);
  __decorate([
    n4({attribute: false})
  ], Button.prototype, "callback", 2);
  Button = __decorate([
    t3("md-button")
  ], Button);

  // node_modules/lit-html/directives/when.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function n8(n12, r12, t8) {
    return n12 ? r12(n12) : t8?.(n12);
  }

  // node_modules/lit-html/directives/repeat.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var u4 = (e10, s11, t8) => {
    const r12 = new Map();
    for (let l8 = s11; l8 <= t8; l8++)
      r12.set(e10[l8], l8);
    return r12;
  };
  var c5 = e6(class extends i6 {
    constructor(e10) {
      if (super(e10), e10.type !== t4.CHILD)
        throw Error("repeat() can only be used in text expressions");
    }
    dt(e10, s11, t8) {
      let r12;
      t8 === void 0 ? t8 = s11 : s11 !== void 0 && (r12 = s11);
      const l8 = [], o13 = [];
      let i9 = 0;
      for (const s12 of e10)
        l8[i9] = r12 ? r12(s12, i9) : i9, o13[i9] = t8(s12, i9), i9++;
      return {values: o13, keys: l8};
    }
    render(e10, s11, t8) {
      return this.dt(e10, s11, t8).values;
    }
    update(s11, [t8, r12, c9]) {
      const d4 = p3(s11), {values: p5, keys: a5} = this.dt(t8, r12, c9);
      if (!Array.isArray(d4))
        return this.ut = a5, p5;
      const h7 = this.ut ?? (this.ut = []), v4 = [];
      let m5, y4, x3 = 0, j3 = d4.length - 1, k2 = 0, w3 = p5.length - 1;
      for (; x3 <= j3 && k2 <= w3; )
        if (d4[x3] === null)
          x3++;
        else if (d4[j3] === null)
          j3--;
        else if (h7[x3] === a5[k2])
          v4[k2] = v2(d4[x3], p5[k2]), x3++, k2++;
        else if (h7[j3] === a5[w3])
          v4[w3] = v2(d4[j3], p5[w3]), j3--, w3--;
        else if (h7[x3] === a5[w3])
          v4[w3] = v2(d4[x3], p5[w3]), s5(s11, v4[w3 + 1], d4[x3]), x3++, w3--;
        else if (h7[j3] === a5[k2])
          v4[k2] = v2(d4[j3], p5[k2]), s5(s11, d4[x3], d4[j3]), j3--, k2++;
        else if (m5 === void 0 && (m5 = u4(a5, k2, w3), y4 = u4(h7, x3, j3)), m5.has(h7[x3]))
          if (m5.has(h7[j3])) {
            const e10 = y4.get(a5[k2]), t9 = e10 !== void 0 ? d4[e10] : null;
            if (t9 === null) {
              const e11 = s5(s11, d4[x3]);
              v2(e11, p5[k2]), v4[k2] = e11;
            } else
              v4[k2] = v2(t9, p5[k2]), s5(s11, d4[x3], t9), d4[e10] = null;
            k2++;
          } else
            M2(d4[j3]), j3--;
        else
          M2(d4[x3]), x3++;
      for (; k2 <= w3; ) {
        const e10 = s5(s11, v4[w3 + 1]);
        v2(e10, p5[k2]), v4[k2++] = e10;
      }
      for (; x3 <= j3; ) {
        const e10 = d4[x3++];
        e10 !== null && M2(e10);
      }
      return this.ut = a5, m2(s11, v4), T;
    }
  });

  // src/components/general/Popup.ts
  var PopupSurface = class extends i4 {
    constructor() {
      super();
      this.shape = {width: "500"};
      this.counter = 0;
      this.style.setProperty("--width", this.shape.width || "");
    }
    updated(changed) {
      this.style.setProperty("--width", this.shape.width || "");
    }
    render() {
      return x`
            <split-layout orientation="vertical" start-size="54px" end-size="61px" class="container">
                ${n8("title" in this.shape, () => x`
                        <div slot="start" class="slot">
                            <md-title .margined=${false} size="20px">
                                ${this.shape.title?.content}
                            </md-title>
                        </div>
                    `)}
                ${n8("body" in this.shape, () => x`
                        <div slot="middle" class="slot">
                            ${this.shape.body}
                        </div>
                    `)}
                ${n8("button_bar" in this.shape, () => x`
                        <div slot="end" class="slot" style="vertical-align: middle; justify-content: flex-end; padding: 10px!important;">
                            ${c5(this.shape.button_bar ?? [], (item) => `${item.title}-${item.disabled}`, (item, index) => {
        let button_type = Styles2.Primary;
        switch (item.type) {
          case "Primary":
            button_type = Styles2.Primary;
            break;
          case "Secondary":
            button_type = Styles2.Secondary;
            break;
          case "Red":
            button_type = Styles2.Red;
            break;
        }
        return x`
                                        <md-button .type=${button_type} .callback=${item.callback} icon=${item.icon} .disabled=${item.disabled}>${item.title}</md-button>
                                    `;
      })}
                        </div>
                    `)}
            </split-layout>
        `;
    }
  };
  PopupSurface.styles = i`
        :root {
            --width: 500px;
        }

        @keyframes slideUp {
            0% {
                transform: translateY(20px);
                opacity: 0;
            }
            100% {
                transform: translateY(0);
                opacity: 1;
            }
        }
        :host {
            display: flex;
            border: solid 1px #a2a2a2;
            width: var(--width);
            border-radius: 15px;
            background-color: #ffffff;
            animation: 0.5s ease-out 0s 1 slideUp;
        }
        .slot {
            display: flex;
            padding: 15px;
        }
        .container > * + * {
            border-top: solid 1px #a2a2a2;
        }  
    `;
  __decorate([
    n4({type: Object, attribute: false})
  ], PopupSurface.prototype, "shape", 2);
  __decorate([
    n4({type: Number})
  ], PopupSurface.prototype, "counter", 2);
  PopupSurface = __decorate([
    t3("gl-popup-surface")
  ], PopupSurface);

  // node_modules/lit-html/directives/if-defined.js
  /**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var o10 = (o13) => o13 ?? E;

  // node_modules/lit-html/static.js
  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var a3 = Symbol.for("");
  var o11 = (t8) => {
    if (t8?.r === a3)
      return t8?._$litStatic$;
  };
  var s7 = (t8) => ({_$litStatic$: t8, r: a3});
  var l5 = new Map();
  var n9 = (t8) => (r12, ...e10) => {
    const a5 = e10.length;
    let s11, i9;
    const n12 = [], u7 = [];
    let c9, $3 = 0, f6 = false;
    for (; $3 < a5; ) {
      for (c9 = r12[$3]; $3 < a5 && (i9 = e10[$3], s11 = o11(i9)) !== void 0; )
        c9 += s11 + r12[++$3], f6 = true;
      $3 !== a5 && u7.push(i9), n12.push(c9), $3++;
    }
    if ($3 === a5 && n12.push(r12[a5]), f6) {
      const t9 = n12.join("$$lit$$");
      (r12 = l5.get(t9)) === void 0 && (n12.raw = n12, l5.set(t9, r12 = n12)), e10 = u7;
    }
    return t8(r12, ...e10);
  };
  var u5 = n9(x);
  var c6 = n9(b2);
  var $2 = n9(w);

  // src/components/general/Notification.ts
  var base_style7 = u5`
    <style>
        .filter-black {
            filter: brightness(0%);
        }
        :host {
            display: flex;
            border: solid 1px #a2a2a2;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
        }
    </style>    
`;
  var red2 = u5`
    <style>
        .filter-black {
            filter: brightness(0%);
        }
        :host {
            display: flex;
            border: solid 1px #ff0000;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
            color: #ff0000;
        }
    </style>
`;
  var yellow2 = u5`
    <style>
        .filter-black {
            filter: brightness(0%);
        }
        :host {
            display: flex;
            border: solid 1px #e1b400;
            border-radius: 15px;
            background-color: #ffffff;
            padding: 15px;
            color: #e1b400;
        }
    </style>
`;
  var PopupSurface2 = class extends i4 {
    constructor() {
      super();
      this.width = "250px";
      this.height = "100px";
      this.shape = {style: "red", title: "New Message", description: "DescriptionDescriptionDescription DescriptionDescriptionDescription"};
    }
    render() {
      return u5`
            ${base_style7}
            ${n8(this.shape.style === "red", () => u5`
                    ${red2}
                `)}
            ${n8(this.shape.style === "yellow", () => u5`
                    ${yellow2}
                `)}
            <style>
                :host {
                    width: ${this.width};
                    height: auto;
                }
            </style>
            <div>
                <split-layout orientation="vertical" start-size="30px">
                    ${n8("title" in this.shape || "icon" in this.shape, () => u5`
                            <div slot="start">
                                <split-layout orientation="horizontal" start-size="30px">
                                    ${n8("icon" in this.shape, () => u5`
                                            <div slot="start">
                                                <img src="${o10(this.shape?.icon)}" height="22px" class="filter-black">
                                            </div>
                                        `)}
                                    ${n8("title" in this.shape, () => u5`
                                            <div slot="middle" style="vertical-align: middle;">
                                                <md-title size="18px" .margined=${false}>${this.shape?.title}</md-title>
                                            </div>
                                        `)}
                                </split-layout>
                            </div>
                        `)}
                    ${n8("description" in this.shape, () => u5`
                            <div slot="middle" style="vertical-align: middle;">
                                <md-richtext>${this.shape?.description}</md-richtext>
                            </div>
                        `)}
                </split-layout>
            </div>
        `;
    }
  };
  __decorate([
    n4({attribute: false})
  ], PopupSurface2.prototype, "width", 2);
  __decorate([
    n4({attribute: false})
  ], PopupSurface2.prototype, "height", 2);
  __decorate([
    n4({type: Object})
  ], PopupSurface2.prototype, "shape", 2);
  PopupSurface2 = __decorate([
    t3("gl-notification")
  ], PopupSurface2);

  // src/components/forms/TextField.ts
  var base_style8 = x`
    <style>
        :root { 

        }
        :host {
        }
        input {
            border-radius: 15px;
            height: 30px;
            width: 100%;
            border: solid 1px #000;
            padding: 5px;
            padding-left: 15px;
            font-family:"Funnel Display", Helvetica;
        }
    </style>    
`;
  var TextField = class extends i4 {
    constructor() {
      super();
      this.text = "Continue";
      this.password = false;
      this.callback = () => {
      };
    }
    render() {
      const type = this.password === true ? "password" : "text";
      return x`
            ${base_style8}
            <input type="${type}" @input=${(e10) => this.callback(e10)}></input>
            <slot></slot>
        `;
    }
  };
  __decorate([
    n4()
  ], TextField.prototype, "text", 2);
  __decorate([
    n4({type: Boolean})
  ], TextField.prototype, "password", 2);
  __decorate([
    n4({attribute: false})
  ], TextField.prototype, "callback", 2);
  TextField = __decorate([
    t3("md-textfield")
  ], TextField);

  // src/services/graph_renderers/ColumnRenderer.ts
  function drawColumns(ctx, graph2, graphBox, x_range, y_range) {
    for (let i9 = 0; i9 <= graph2.graph.length - 1; i9++) {
      const column = graph2.graph[i9];
      const start_x = column.x - column.width / 2;
      const end_x = column.x + column.width / 2;
      const start_y = column.y;
      const baseline_y = graphBox.y + graphBox.height;
      const x_entries = x_range.end - x_range.start;
      const abs_start_x = start_x * (graphBox.width / x_entries) + graphBox.x;
      const abs_end_x = end_x * (graphBox.width / x_entries) + graphBox.x;
      const abs_start_y = -1 * (start_y * (graphBox.height / (y_range.end - y_range.start)));
      const width = abs_end_x - abs_start_x;
      ctx.fillStyle = graph2.color;
      ctx.fillRect(abs_start_x, baseline_y, width, abs_start_y);
    }
    ;
  }

  // src/services/graph_renderers/LineRenderer.ts
  function drawLine(ctx, graph2, graphBox, x_range, y_range) {
    ctx.strokeStyle = graph2.color;
    ctx.lineWidth = 5;
    ctx.beginPath();
    const dataset = graph2.graph;
    const x_entries = x_range.end - x_range.start;
    const y_entries = y_range.end - y_range.start;
    const transform_point = (point) => {
      const rel_x = point.x - x_range.start;
      const rel_y = point.y - y_range.start;
      return {
        x: rel_x * (graphBox.width / x_entries) + graphBox.x,
        y: graphBox.height - rel_y * (graphBox.height / y_entries) + graphBox.y
      };
    };
    if (dataset.length === 0)
      return;
    const base = transform_point(dataset[0]);
    ctx.moveTo(base.x, base.y);
    for (let i9 = 1; i9 < dataset.length; i9++) {
      const p5 = transform_point(dataset[i9]);
      ctx.lineTo(p5.x, p5.y);
    }
    ctx.stroke();
  }

  // src/services/GraphController.ts
  var MAX_AXIS_LENGTH = 4;
  var GraphTypes;
  (function(GraphTypes2) {
    GraphTypes2[GraphTypes2["LineGraph"] = 0] = "LineGraph";
    GraphTypes2[GraphTypes2["WaterfallGraph"] = 1] = "WaterfallGraph";
    GraphTypes2[GraphTypes2["ColumnGraph"] = 2] = "ColumnGraph";
    GraphTypes2[GraphTypes2["ScatterGraph"] = 3] = "ScatterGraph";
  })(GraphTypes || (GraphTypes = {}));
  var GraphRenderers = {
    [0]: drawLine,
    [1]: () => {
    },
    [2]: drawColumns,
    [3]: () => {
    }
  };
  var GraphController = class {
    constructor(host) {
      (this.host = host).addController(this);
    }
    hostConnected() {
    }
    hostDisconnected() {
    }
    setGraph(graph2) {
      this.graphs = graph2?.graphs;
      this.x_range = graph2?.x_range;
      this.y_range = graph2?.y_range;
      this.x_label = graph2?.x_label;
      this.y_label = graph2?.y_label;
    }
    start(graph2) {
      this.setGraph(graph2);
      this.context = this.host.canvas.getContext("2d");
      const ctx = this.context;
      const dpr = window.devicePixelRatio || 1;
      const width = this.host.canvas.width / dpr;
      const height = this.host.canvas.height / dpr;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      this.graphBox = {
        x: 60,
        y: 0,
        width: width - 60,
        height: height - 40
      };
      this.render();
    }
    render() {
      const ctx = this.context;
      if (this.graphs?.has(0)) {
        const x_span = this.x_range.end - this.x_range.start;
        const y_span = this.y_range.end - this.y_range.start;
        const x_tickSpacing = this.x_range.step > 0 ? 1 / this.x_range.step : x_span;
        const y_tickSpacing = this.y_range.step > 0 ? 1 / this.y_range.step : y_span;
        const x_intervals = Math.max(1, Math.round(x_span / x_tickSpacing));
        const y_intervals = Math.max(1, Math.round(y_span / y_tickSpacing));
        this.drawGridLines(ctx, this.graphBox.width, this.graphBox.height, this.graphBox.x, this.graphBox.y, x_intervals, y_intervals);
        this.drawYAxis(ctx, this.graphBox.y, this.graphBox.height, this.y_range, this.y_label);
        this.drawXAxis(ctx, this.graphBox.x, this.graphBox.y, this.graphBox.width, this.graphBox.height, this.x_range, this.x_label);
      }
      for (const graph2 of this?.graphs ?? []) {
        GraphRenderers[graph2[1].type](ctx, graph2[1], this.graphBox, this.x_range, this.y_range);
      }
    }
    drawGridLines(ctx, width, height, start_x, start_y, x_entries, y_entries) {
      ctx.strokeStyle = "#e3e3e3";
      ctx.lineWidth = 1;
      const absolute_x_interval = width / x_entries;
      const absolute_y_interval = height / y_entries;
      for (let i9 = 0; i9 <= x_entries; i9++) {
        const px = i9 * absolute_x_interval;
        ctx.beginPath();
        ctx.moveTo(px + start_x, start_y);
        ctx.lineTo(px + start_x, height + start_y);
        ctx.stroke();
      }
      for (let j3 = 0; j3 <= y_entries; j3++) {
        const py = height - j3 * absolute_y_interval;
        ctx.beginPath();
        ctx.moveTo(start_x, py + start_y);
        ctx.lineTo(width + start_x, py + start_y);
        ctx.stroke();
      }
    }
    drawYAxis(ctx, start_y, y_height, y_range, label) {
      const tickSpacing = y_range.step > 0 ? 1 / y_range.step : y_range.end - y_range.start;
      const intervals = Math.max(1, Math.round((y_range.end - y_range.start) / tickSpacing));
      const absolute_y_interval = y_height / intervals;
      ctx.font = "14px 'Funnel Display'";
      ctx.fillStyle = "#000000";
      for (let i9 = 0; i9 <= intervals; i9++) {
        const labelValue = y_range.start + (intervals - i9) * tickSpacing;
        const abs_pos = i9 * absolute_y_interval + 12;
        ctx.fillText(`${labelValue}`.substring(0, MAX_AXIS_LENGTH), 30, abs_pos);
      }
      ctx.save();
      ctx.translate(10, y_height / 2 + start_y);
      ctx.rotate(-Math.PI / 2);
      ctx.textAlign = "center";
      ctx.fillText(label ? label : "", 0, 0);
      ctx.restore();
    }
    drawXAxis(ctx, start_x, start_y, x_width, y_height, x_range, label) {
      const x_tickSpacing = x_range.step > 0 ? 1 / x_range.step : x_range.end - x_range.start;
      const x_intervals = Math.max(1, Math.round((x_range.end - x_range.start) / x_tickSpacing));
      const absolute_x_interval = x_width / x_intervals;
      ctx.font = "14px 'Funnel Display'";
      ctx.fillStyle = "#000000";
      ctx.save();
      ctx.textAlign = "right";
      for (let i9 = 0; i9 <= x_intervals; i9++) {
        const abs_pos = i9 * absolute_x_interval + start_x;
        const textValue = (x_range.start + i9 * x_tickSpacing).toString();
        ctx.fillText(textValue, abs_pos, y_height + 20);
      }
      ctx.restore();
      ctx.save();
      ctx.textAlign = "center";
      ctx.fillText(label ? label : "", x_width / 2 + start_x, start_y + y_height + 40);
      ctx.restore();
    }
  };

  // src/components/advanced/Graph.ts
  var base_style9 = x`
    <style>
        :root { 

        }
        :host {
            height: calc(100% - 10px);
            width: 100%;
        }
    </style>    
`;
  var Graph = class extends i4 {
    constructor() {
      super();
      this.graphController = new GraphController(this);
      this.width = "100px";
      this.height = "100px";
    }
    firstUpdated(_changedProperties) {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = window.setTimeout(() => {
          this.updateCanvasSize();
          this.graphController.render();
        }, 200);
      });
      this.updateCanvasSize();
      this.graphController.start(this.graph);
      this.resizeObserver.observe(this);
    }
    updated(_changedProperties) {
      if (_changedProperties.has("graph")) {
        this.graphController.setGraph(this.graph);
        this.graphController.render();
      }
    }
    updateCanvasSize() {
      const style = getComputedStyle(this);
      this.width = style.width;
      this.height = style.height;
      this.canvas = this.shadowRoot?.querySelector("#canvas");
      const dpr = window.devicePixelRatio || 1;
      this.canvas.style.width = style.width;
      this.canvas.style.height = style.height;
      this.canvas.height = parseInt(this.height) * dpr;
      this.canvas.width = parseInt(this.width) * dpr;
      const ctx = this.canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.graphController.start(this.graph);
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.resizeObserver?.disconnect();
    }
    render() {
      return x`
            ${base_style9}
            <canvas 
                id="canvas"
            ></canvas>
        `;
    }
  };
  __decorate([
    n4({attribute: false})
  ], Graph.prototype, "canvas", 2);
  __decorate([
    n4({attribute: false})
  ], Graph.prototype, "graph", 2);
  Graph = __decorate([
    t3("adv-graph")
  ], Graph);

  // src/components/advanced/cell_renderers/Boolean.ts
  function cell_bool(value) {
    return x`
        <style>
            .base {
                height: 100%;
                width: 100%;
                align-content: center;
                justify-content: center;
                text-align: center;
                border-radius: 10px;
                color: white;
            }
            .true {
                background-color: #007604;
            }
            .false {
                background-color: #c30000;
            }
        </style>
        <div class="base ${value}">
            <span>${value === true ? "Ja" : "Nee"}</span>
        </div>
      `;
  }

  // src/components/advanced/cell_renderers/Button.ts
  function cell_button(value) {
    return x`
        <style>
            .base {
                height: 100%;
                width: 100%;
                align-content: center;
                justify-content: center;
                text-align: center;
                border-radius: 10px;
                color: white;
            }
        </style>
        <md-button icon=${value.icon} .callback=${value.callback} .type=${Styles2[value.type]} .disabled=${value.disabled}>${value.title}</md-button>
      `;
  }

  // src/components/advanced/Table.ts
  var RenderNames;
  (function(RenderNames2) {
    RenderNames2[RenderNames2["number"] = 0] = "number";
    RenderNames2[RenderNames2["boolean"] = 1] = "boolean";
    RenderNames2[RenderNames2["string"] = 2] = "string";
    RenderNames2[RenderNames2["button"] = 3] = "button";
  })(RenderNames || (RenderNames = {}));
  var Renderers = {
    [2]: {
      render: (value) => {
        return x`${value}`;
      }
    },
    [0]: {
      render: (value) => {
        let newVal;
        if (typeof value === "number") {
          newVal = value.toFixed(2);
        } else {
          newVal = value;
        }
        return x`${newVal}`;
      }
    },
    [1]: {
      render: cell_bool
    },
    [3]: {
      render: cell_button
    }
  };
  var sheet = {
    headers: {
      firstName: {
        label: "First name",
        renderer: 2
      },
      lastName: {
        label: "Last name",
        renderer: 2
      },
      age: {
        label: "Age",
        renderer: 0
      },
      active: {
        label: "Active",
        renderer: 1
      }
    },
    values: [
      {
        firstName: "John",
        lastName: "Doe",
        age: 32,
        active: true
      },
      {
        firstName: "Mary",
        lastName: "Jane",
        age: 28,
        active: false
      }
    ]
  };
  var base_style10 = x`
    <style>
        :root { 

        }
        :host {
            width: calc(100% - 20px);
            height: calc(100% - 5px);
            margin-top: 5px;
            padding-left: 10px;
            padding-right: 10px;
        }
        table {
            overflow: hidden;
            width: 100%;
            border-collapse: collapse; /* ensures borders are not doubled */
            border-style: hidden;
            border-bottom: 1px solid #f3f3f3;
        }

        th, td {
            border-bottom: 1px solid #f3f3f3;   /* add visible borders */
            padding: 4px;              /* optional: makes cells readable */
            text-align: left;
            height: 30px;
            vertical-align: middle;
            font-family: "Funnel Display", Helvetica;
            font-size: 14px;
        }

        th:first-child, td:first-child {
            padding-left: 10px;
        }
    </style>    
`;
  var Table = class extends i4 {
    constructor() {
      super();
      this.text = "Continue";
      this.table = sheet;
    }
    render() {
      const headers = Object.entries(this.table?.headers ?? {});
      const values = Array.isArray(this.table?.values) ? this.table.values : [];
      if (values.length === 0)
        return x`<div style="vertical-align: center; justify-content: middle;"><md-richtext>Awaiting data</md-richtext></div>`;
      return x`
            ${base_style10}
            <table>
                ${c5(Object.entries(this.table.headers), (instance) => x`
                        <th>
                            ${instance[1].label}
                        </th>
                    `)}
                ${c5(this.table.values, (instance) => x`
                        <tr>
                        ${c5(Object.entries(instance), (key) => {
        const renderer_type = this.table.headers[key[0]].renderer;
        const renderer = Renderers[renderer_type];
        return x`<td>${renderer.render(key[1])}</td>`;
      })}
                        </tr>
                    `)}
            </table>
        `;
    }
  };
  __decorate([
    n4()
  ], Table.prototype, "text", 2);
  __decorate([
    n4({attribute: false})
  ], Table.prototype, "table", 2);
  Table = __decorate([
    t3("adv-table")
  ], Table);

  // src/components/general/DeviceTile.ts
  var DeviceTile = class extends i4 {
    constructor() {
      super();
      this.disabled = false;
      this.callback = () => {
      };
    }
    isLamp(name) {
      return name.toLowerCase().includes("lamp");
    }
    isServo(name) {
      return name.toLowerCase().includes("servo");
    }
    render() {
      if (!this.device)
        return x``;
      const name = this.device.naam ?? "";
      const active = Boolean(this.device.actief);
      let bg = "#ffffff";
      let textColor = "#000000";
      if (this.disabled) {
        bg = "#dcdcdc";
        textColor = "#666";
      } else if (this.isLamp(name)) {
        bg = active ? "#FFF5DE" : "#ffffff";
        textColor = active ? "#fff" : "#000";
      } else if (this.isServo(name)) {
        bg = active ? "#E0FFE1" : "#c30000";
        textColor = "#fff";
      }
      const buttonLabel = this.device.beheerd ? "Beheerd" : active ? "Uit" : "Aan";
      return x`
            <style>
                :host { background: ${bg}; color: ${textColor}; position: relative; }
            </style>
            <div class="inner">
                <div class="meta">
                    <div>
                        <div class="title">${this.device.naam}</div>
                        <div class="sub">${this.device.kamer}</div>
                    </div>
                    <div class="sub">ID: ${this.device.apparaat_id}</div>
                </div>

                <div class="bottom">
                    <div>
                        <div class="energy">${Number(this.device.huidig_verbruik).toFixed(2)} W</div>
                        <div class="sub">${this.device.actief ? "Actief" : "Inactief"}</div>
                    </div>
                    <div>
                        <md-button
                            .type=${Styles2.Primary}
                            ?disabled=${this.device.beheerd || this.disabled}
                            .callback=${() => this.callback(this.device.apparaat_id, this.device.actief)}
                        >${buttonLabel}</md-button>
                    </div>
                </div>

                ${n8(this.disabled, () => x`<div class="overlay">Bezig met schakelen...</div>`)}
            </div>
        `;
    }
  };
  DeviceTile.styles = i`
        :host {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: 12px;
            overflow: hidden;
            border: solid 1px #a2a2a2;
            color: black;
            font-family: "Funnel Display", Helvetica, Arial;
        }
        .inner {
            display: flex;
            flex-direction: column;
            gap: 8px;
            padding: 12px;
            height: 100%;
            box-sizing: border-box;
            justify-content: space-between;
        }
        .meta {
            display:flex;
            justify-content: space-between;
            align-items: center;
        }
        .title {
            font-weight: 700;
            font-size: 16px;
        }
        .sub {
            font-size: 12px;
            color: rgba(0,0,0,0.6);
        }
        .bottom {
            display:flex;
            justify-content: space-between;
            align-items: center;
        }
        .energy {
            font-weight: 600;
        }
        .overlay {
            position: absolute;
            inset: 0;
            background: rgba(255,255,255,0.6);
            display:flex;
            align-items:center;
            justify-content:center;
            font-size: 14px;
            color: #666;
        }
    `;
  __decorate([
    n4({type: Object, attribute: false})
  ], DeviceTile.prototype, "device", 2);
  __decorate([
    n4({type: Boolean})
  ], DeviceTile.prototype, "disabled", 2);
  __decorate([
    n4({attribute: false})
  ], DeviceTile.prototype, "callback", 2);
  DeviceTile = __decorate([
    t3("gl-device-tile")
  ], DeviceTile);

  // src/layouts/Split.ts
  var SplitLayout = class extends i4 {
    constructor() {
      super();
      this.orientation = "horizontal";
      this.startSize = "20%";
      this.endSize = "10%";
    }
    render() {
      return x`
            <style>
                /* Flex directions */
                :host([orientation="horizontal"]) {
                  flex-direction: row;
                }
                :host([orientation="vertical"]) {
                  flex-direction: column;
                }
                /* Width/height resetting */
                :host([orientation="horizontal"]) ::slotted([slot="start"]) {
                  width: ${this.startSize};
                }
                :host([orientation="horizontal"]) ::slotted([slot="end"]) {
                  width: ${this.endSize};
                }
                :host([orientation="vertical"]) ::slotted([slot="start"]) {
                  height: ${this.startSize};
                }
                :host([orientation="vertical"]) ::slotted([slot="end"]) {
                  height: ${this.endSize};
                }
            </style>
            <slot name="start"></slot>
            <slot name="middle"></slot>
            <slot name="end"></slot>
        `;
    }
  };
  SplitLayout.styles = i`
        :host {
            display: flex;
            width: 100%;
            height: 100%;
        }
        ::slotted(*) {
            overflow: auto;
            min-width: 0;
            min-height: 0;
            box-sizing: border-box;
        }
        ::slotted([slot="middle"]) {
              flex: 1;
        }
    `;
  __decorate([
    n4({type: String, reflect: true})
  ], SplitLayout.prototype, "orientation", 2);
  __decorate([
    n4({type: String, attribute: "start-size"})
  ], SplitLayout.prototype, "startSize", 2);
  __decorate([
    n4({type: String, attribute: "end-size"})
  ], SplitLayout.prototype, "endSize", 2);
  SplitLayout = __decorate([
    t3("split-layout")
  ], SplitLayout);

  // node_modules/@lit/context/lib/context-request-event.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s8 = class extends Event {
    constructor(s11, t8, e10, o13) {
      super("context-request", {bubbles: true, composed: true}), this.context = s11, this.contextTarget = t8, this.callback = e10, this.subscribe = o13 ?? false;
    }
  };

  // node_modules/@lit/context/lib/create-context.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function n10(n12) {
    return n12;
  }

  // node_modules/@lit/context/lib/controllers/context-consumer.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s9 = class {
    constructor(t8, s11, i9, h7) {
      if (this.subscribe = false, this.provided = false, this.value = void 0, this.t = (t9, s12) => {
        this.unsubscribe && (this.unsubscribe !== s12 && (this.provided = false, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = t9, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = true, this.callback && this.callback(t9, s12)), this.unsubscribe = s12;
      }, this.host = t8, s11.context !== void 0) {
        const t9 = s11;
        this.context = t9.context, this.callback = t9.callback, this.subscribe = t9.subscribe ?? false;
      } else
        this.context = s11, this.callback = i9, this.subscribe = h7 ?? false;
      this.host.addController(this);
    }
    hostConnected() {
      this.dispatchRequest();
    }
    hostDisconnected() {
      this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
    }
    dispatchRequest() {
      this.host.dispatchEvent(new s8(this.context, this.host, this.t, this.subscribe));
    }
  };

  // node_modules/@lit/context/lib/value-notifier.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s10 = class {
    get value() {
      return this.o;
    }
    set value(s11) {
      this.setValue(s11);
    }
    setValue(s11, t8 = false) {
      const i9 = t8 || !Object.is(s11, this.o);
      this.o = s11, i9 && this.updateObservers();
    }
    constructor(s11) {
      this.subscriptions = new Map(), this.updateObservers = () => {
        for (const [s12, {disposer: t8}] of this.subscriptions)
          s12(this.o, t8);
      }, s11 !== void 0 && (this.value = s11);
    }
    addCallback(s11, t8, i9) {
      if (!i9)
        return void s11(this.value);
      this.subscriptions.has(s11) || this.subscriptions.set(s11, {disposer: () => {
        this.subscriptions.delete(s11);
      }, consumerHost: t8});
      const {disposer: h7} = this.subscriptions.get(s11);
      s11(this.value, h7);
    }
    clearCallbacks() {
      this.subscriptions.clear();
    }
  };

  // node_modules/@lit/context/lib/controllers/context-provider.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var e7 = class extends Event {
    constructor(t8, s11) {
      super("context-provider", {bubbles: true, composed: true}), this.context = t8, this.contextTarget = s11;
    }
  };
  var i7 = class extends s10 {
    constructor(s11, e10, i9) {
      super(e10.context !== void 0 ? e10.initialValue : i9), this.onContextRequest = (t8) => {
        if (t8.context !== this.context)
          return;
        const s12 = t8.contextTarget ?? t8.composedPath()[0];
        s12 !== this.host && (t8.stopPropagation(), this.addCallback(t8.callback, s12, t8.subscribe));
      }, this.onProviderRequest = (s12) => {
        if (s12.context !== this.context)
          return;
        if ((s12.contextTarget ?? s12.composedPath()[0]) === this.host)
          return;
        const e11 = new Set();
        for (const [s13, {consumerHost: i10}] of this.subscriptions)
          e11.has(s13) || (e11.add(s13), i10.dispatchEvent(new s8(this.context, i10, s13, true)));
        s12.stopPropagation();
      }, this.host = s11, e10.context !== void 0 ? this.context = e10.context : this.context = e10, this.attachListeners(), this.host.addController?.(this);
    }
    attachListeners() {
      this.host.addEventListener("context-request", this.onContextRequest), this.host.addEventListener("context-provider", this.onProviderRequest);
    }
    hostConnected() {
      this.host.dispatchEvent(new e7(this.context, this.host));
    }
  };

  // node_modules/@lit/context/lib/context-root.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/context/lib/decorators/provide.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */

  // node_modules/@lit/context/lib/decorators/consume.js
  /**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function c7({context: c9, subscribe: e10}) {
    return (o13, n12) => {
      typeof n12 == "object" ? n12.addInitializer(function() {
        new s9(this, {context: c9, callback: (t8) => {
          o13.set.call(this, t8);
        }, subscribe: e10});
      }) : o13.constructor.addInitializer((o14) => {
        new s9(o14, {context: c9, callback: (t8) => {
          o14[n12] = t8;
        }, subscribe: e10});
      });
    };
  }

  // src/services/PopupController.ts
  var PopupController = class {
    constructor(host, timeout = 1e3) {
      (this.host = host).addController(this);
      this.active_popups = [];
    }
    hostConnected() {
    }
    hostDisconnected() {
    }
    notify(popup) {
      this.active_popups.push(popup);
      this.host.requestUpdate();
      return 0;
    }
    dismiss(popup_id) {
      this.active_popups.splice(popup_id, 1);
      this.host.requestUpdate();
    }
    _render() {
      return x`
            <style>
                .overlay {
                    display: block;
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background-color: rgba(0, 0, 0, 0.6);
                    z-index: 200;
                    justify-content: center;
                }
                .overlay > .wrapper {
                   position: absolute; 
                   left: 50%; 
                   top: 50%; 
                   transform: translate(-50%, calc(-50% - 100px));
                }
                .overlay > .wrapper > * {
                    position: relative; /* allows variable size naturally */
                    pointer-events: auto;
                }
            </style>
            ${n8(this.active_popups.length > 0, () => x`
                    <div class="overlay">
                        ${c5(Object.entries(this.active_popups), ([key, value]) => key, ([key, value]) => {
        return x`
                                    <div class="wrapper">
                                        <gl-popup-surface .shape=${value}></gl-popup-surface>
                                    </div>
                                `;
      })}
                    </div>
                        `)}
        `;
    }
  };
  var popupContext = n10("popupController");

  // node_modules/@lit-labs/motion/animate-controller.js
  var i8 = new WeakMap();

  // node_modules/@lit-labs/motion/animate.js
  var o12 = 0;
  var r10 = new Map();
  var n11 = new WeakSet();
  var a4 = () => new Promise((t8) => requestAnimationFrame(t8));
  var g2 = (t8, i9) => {
    const s11 = t8 - i9;
    return s11 === 0 ? void 0 : s11;
  };
  var w2 = (t8, i9) => {
    const s11 = t8 / i9;
    return s11 === 1 ? void 0 : s11;
  };
  var N2 = {left: (t8, i9) => {
    const s11 = g2(t8, i9);
    return {value: s11, transform: s11 == null || isNaN(s11) ? void 0 : `translateX(${s11}px)`};
  }, top: (t8, i9) => {
    const s11 = g2(t8, i9);
    return {value: s11, transform: s11 == null || isNaN(s11) ? void 0 : `translateY(${s11}px)`};
  }, width: (t8, i9) => {
    let s11;
    i9 === 0 && (i9 = 1, s11 = {width: "1px"});
    const e10 = w2(t8, i9);
    return {value: e10, overrideFrom: s11, transform: e10 == null || isNaN(e10) ? void 0 : `scaleX(${e10})`};
  }, height: (t8, i9) => {
    let s11;
    i9 === 0 && (i9 = 1, s11 = {height: "1px"});
    const e10 = w2(t8, i9);
    return {value: e10, overrideFrom: s11, transform: e10 == null || isNaN(e10) ? void 0 : `scaleY(${e10})`};
  }};
  var A2 = {duration: 333, easing: "ease-in-out"};
  var b3 = ["left", "top", "width", "height", "opacity", "color", "background"];
  var j2 = new WeakMap();
  var x2 = class extends f4 {
    constructor(t8) {
      if (super(t8), this.t = false, this.i = null, this.o = null, this.h = true, this.shouldLog = false, t8.type === t4.CHILD)
        throw Error("The `animate` directive must be used in attribute position.");
      this.createFinished();
    }
    createFinished() {
      this.resolveFinished?.(), this.finished = new Promise((t8) => {
        this.l = t8;
      });
    }
    async resolveFinished() {
      this.l?.(), this.l = void 0;
    }
    render(i9) {
      return E;
    }
    getController() {
      return i8.get(this.u);
    }
    isDisabled() {
      return this.options.disabled || this.getController()?.disabled;
    }
    update(t8, [i9]) {
      const s11 = this.u === void 0;
      return s11 && (this.u = t8.options?.host, this.u.addController(this), this.u.updateComplete.then((t9) => this.t = true), this.element = t8.element, j2.set(this.element, this)), this.optionsOrCallback = i9, (s11 || typeof i9 != "function") && this.m(i9), this.render(i9);
    }
    m(t8) {
      t8 = t8 ?? {};
      const i9 = this.getController();
      i9 !== void 0 && ((t8 = {...i9.defaultOptions, ...t8}).keyframeOptions = {...i9.defaultOptions.keyframeOptions, ...t8.keyframeOptions}), t8.properties ?? (t8.properties = b3), this.options = t8;
    }
    p() {
      const t8 = {}, i9 = this.element.getBoundingClientRect(), s11 = getComputedStyle(this.element);
      return this.options.properties.forEach((e10) => {
        const h7 = i9[e10] ?? (N2[e10] ? void 0 : s11[e10]), o13 = Number(h7);
        t8[e10] = isNaN(o13) ? h7 + "" : o13;
      }), t8;
    }
    v() {
      let t8, i9 = true;
      return this.options.guard && (t8 = this.options.guard(), i9 = ((t9, i10) => {
        if (Array.isArray(t9)) {
          if (Array.isArray(i10) && i10.length === t9.length && t9.every((t10, s11) => t10 === i10[s11]))
            return false;
        } else if (i10 === t9)
          return false;
        return true;
      })(t8, this._)), this.h = this.t && !this.isDisabled() && !this.isAnimating() && i9 && this.element.isConnected, this.h && (this._ = Array.isArray(t8) ? Array.from(t8) : t8), this.h;
    }
    hostUpdate() {
      typeof this.optionsOrCallback == "function" && this.m(this.optionsOrCallback()), this.v() && (this.A = this.p(), this.i = this.i ?? this.element.parentNode, this.o = this.element.nextSibling);
    }
    async hostUpdated() {
      if (!this.h || !this.element.isConnected || this.options.skipInitial && !this.isHostRendered)
        return;
      let t8;
      this.prepare(), await a4;
      const i9 = this.P(), s11 = this.V(this.options.keyframeOptions, i9), e10 = this.p();
      if (this.A !== void 0) {
        const {from: s12, to: h7} = this.O(this.A, e10, i9);
        this.log("measured", [this.A, e10, s12, h7]), t8 = this.calculateKeyframes(s12, h7);
      } else {
        const s12 = r10.get(this.options.inId);
        if (s12) {
          r10.delete(this.options.inId);
          const {from: h7, to: n12} = this.O(s12, e10, i9);
          t8 = this.calculateKeyframes(h7, n12), t8 = this.options.in ? [{...this.options.in[0], ...t8[0]}, ...this.options.in.slice(1), t8[1]] : t8, o12++, t8.forEach((t9) => t9.zIndex = o12);
        } else
          this.options.in && (t8 = [...this.options.in, {}]);
      }
      this.animate(t8, s11);
    }
    resetStyles() {
      this.j !== void 0 && (this.element.setAttribute("style", this.j ?? ""), this.j = void 0);
    }
    commitStyles() {
      this.j = this.element.getAttribute("style"), this.webAnimation?.commitStyles(), this.webAnimation?.cancel();
    }
    reconnected() {
    }
    async disconnected() {
      if (!this.h)
        return;
      if (this.options.id !== void 0 && r10.set(this.options.id, this.A), this.options.out === void 0)
        return;
      if (this.prepare(), await a4(), this.i?.isConnected) {
        const t9 = this.o && this.o.parentNode === this.i ? this.o : null;
        if (this.i.insertBefore(this.element, t9), this.options.stabilizeOut) {
          const t10 = this.p();
          this.log("stabilizing out");
          const i9 = this.A.left - t10.left, s11 = this.A.top - t10.top;
          !(getComputedStyle(this.element).position === "static") || i9 === 0 && s11 === 0 || (this.element.style.position = "relative"), i9 !== 0 && (this.element.style.left = i9 + "px"), s11 !== 0 && (this.element.style.top = s11 + "px");
        }
      }
      const t8 = this.V(this.options.keyframeOptions);
      await this.animate(this.options.out, t8), this.element.remove();
    }
    prepare() {
      this.createFinished();
    }
    start() {
      this.options.onStart?.(this);
    }
    didFinish(t8) {
      t8 && this.options.onComplete?.(this), this.A = void 0, this.animatingProperties = void 0, this.frames = void 0, this.resolveFinished();
    }
    P() {
      const t8 = [];
      for (let i9 = this.element.parentNode; i9; i9 = i9?.parentNode) {
        const s11 = j2.get(i9);
        s11 && !s11.isDisabled() && s11 && t8.push(s11);
      }
      return t8;
    }
    get isHostRendered() {
      const t8 = n11.has(this.u);
      return t8 || this.u.updateComplete.then(() => {
        n11.add(this.u);
      }), t8;
    }
    V(t8, i9 = this.P()) {
      const s11 = {...A2};
      return i9.forEach((t9) => Object.assign(s11, t9.options.keyframeOptions)), Object.assign(s11, t8), s11;
    }
    O(t8, i9, s11) {
      t8 = {...t8}, i9 = {...i9};
      const e10 = s11.map((t9) => t9.animatingProperties).filter((t9) => t9 !== void 0);
      let h7 = 1, o13 = 1;
      return e10.length > 0 && (e10.forEach((t9) => {
        t9.width && (h7 /= t9.width), t9.height && (o13 /= t9.height);
      }), t8.left !== void 0 && i9.left !== void 0 && (t8.left = h7 * t8.left, i9.left = h7 * i9.left), t8.top !== void 0 && i9.top !== void 0 && (t8.top = o13 * t8.top, i9.top = o13 * i9.top)), {from: t8, to: i9};
    }
    calculateKeyframes(t8, i9, s11 = false) {
      const e10 = {}, h7 = {};
      let o13 = false;
      const r12 = {};
      for (const s12 in i9) {
        const n12 = t8[s12], a5 = i9[s12];
        if (s12 in N2) {
          const t9 = N2[s12];
          if (n12 === void 0 || a5 === void 0)
            continue;
          const i10 = t9(n12, a5);
          i10.transform !== void 0 && (r12[s12] = i10.value, o13 = true, e10.transform = `${e10.transform ?? ""} ${i10.transform}`, i10.overrideFrom !== void 0 && Object.assign(e10, i10.overrideFrom));
        } else
          n12 !== a5 && n12 !== void 0 && a5 !== void 0 && (o13 = true, e10[s12] = n12, h7[s12] = a5);
      }
      return e10.transformOrigin = h7.transformOrigin = s11 ? "center center" : "top left", this.animatingProperties = r12, o13 ? [e10, h7] : void 0;
    }
    async animate(t8, i9 = this.options.keyframeOptions) {
      this.start(), this.frames = t8;
      let s11 = false;
      if (!this.isAnimating() && !this.isDisabled() && (this.options.onFrames && (this.frames = t8 = this.options.onFrames(this), this.log("modified frames", t8)), t8 !== void 0)) {
        this.log("animate", [t8, i9]), s11 = true, this.webAnimation = this.element.animate(t8, i9);
        const e10 = this.getController();
        e10?.add(this);
        try {
          await this.webAnimation.finished;
        } catch (t9) {
        }
        e10?.remove(this);
      }
      return this.didFinish(s11), s11;
    }
    isAnimating() {
      return this.webAnimation?.playState === "running" || this.webAnimation?.pending;
    }
    log(t8, i9) {
      this.shouldLog && !this.isDisabled() && console.log(t8, this.options.id, i9);
    }
  };
  var F = e6(x2);

  // node_modules/@lit-labs/motion/position.js
  var r11 = ["top", "right", "bottom", "left"];
  var e9 = class extends f4 {
    constructor(t8) {
      if (super(t8), t8.type !== t4.ELEMENT)
        throw Error("The `position` directive must be used in attribute position.");
    }
    render(i9, s11) {
      return E;
    }
    update(t8, [i9, s11]) {
      return this.u === void 0 && (this.u = t8.options?.host, this.u.addController(this)), this.C = t8.element, this.N = i9, this.S = s11 ?? ["left", "top", "width", "height"], this.render(i9, s11);
    }
    hostUpdated() {
      this.F();
    }
    F() {
      const t8 = typeof this.N == "function" ? this.N() : this.N?.value, i9 = t8.offsetParent;
      if (t8 === void 0 || !i9)
        return;
      const s11 = t8.getBoundingClientRect(), o13 = i9.getBoundingClientRect();
      this.S?.forEach((t9) => {
        const i10 = r11.includes(t9) ? s11[t9] - o13[t9] : s11[t9];
        this.C.style[t9] = i10 + "px";
      });
    }
  };
  var h6 = e6(e9);

  // src/services/NotificationController.ts
  var NotificationController = class {
    constructor(host, timeout = 1e3) {
      (this.host = host).addController(this);
      this.ordered_notifications = [];
      this.notification_ownership = new Map();
    }
    hostConnected() {
    }
    hostDisconnected() {
    }
    notify(notification) {
      const keys = Array.from(this.notification_ownership.keys());
      const maxKey = keys.length ? Math.max(...keys) : 0;
      const firstMissing = keys.find((k2) => !this.notification_ownership.has(k2)) ?? maxKey + 1;
      this.ordered_notifications.push({notification, id: firstMissing});
      this.notification_ownership.set(firstMissing, notification);
      this.host.requestUpdate();
      new Promise((resolve) => {
        setTimeout(() => {
          this.dismiss(firstMissing);
        }, 5e3);
      });
      return firstMissing;
    }
    dismiss(ownership_id) {
      const notification = this.notification_ownership.get(ownership_id);
      this.ordered_notifications = this.ordered_notifications.filter((n12) => n12.id !== ownership_id);
      this.notification_ownership.delete(ownership_id);
      this.host.requestUpdate();
    }
    _render() {
      return x`
            <style>
                .notification_overlay {
                    display: block;
                    position: absolute;
                    top: 15px;
                    right: 0;
                    height: 100%;
                    width: 100%;
                    z-index: 100;
                    justify-content: right;
                    pointer-events: none;
                }
                .notification_overlay > .wrapper {
                    position: absolute; 
                    right: 15px; 
                }
                .notification_overlay > .wrapper > * {
                    position: relative; /* allows variable size naturally */
                    pointer-events: auto;
                    margin-bottom: 15px;
                }
            </style>
            ${n8(this.ordered_notifications.length > 0, () => x`
                    <div class="notification_overlay">
                        <motion-host class="wrapper">
                            ${c5(this.ordered_notifications, (wrapper) => wrapper.id, (wrapper) => x`
                                    <gl-notification
                                    ${F()}
                                    .shape=${wrapper.notification}
                                    ></gl-notification>
                                `)}
                        </motion-host>
                    </div>
                        `)}
        `;
    }
  };
  var notificationContext = n10("notificationController");

  // src/services/GlobalState.ts
  var Store = class extends EventTarget {
    constructor(initial) {
      super();
      this._state = initial;
    }
    get value() {
      return this._state;
    }
    set(patch) {
      if (Array.isArray(this._state) || Array.isArray(patch)) {
        this._state = patch;
        this.dispatchEvent(new CustomEvent("change", {detail: this._state}));
        return;
      }
      if (typeof this._state === "object" && this._state !== null && typeof patch === "object" && patch !== null) {
        this._state = {...this._state, ...patch};
      } else {
        this._state = patch;
      }
      this.dispatchEvent(new CustomEvent("change", {detail: this._state}));
    }
    subscribe(callback) {
      const handler = (e10) => callback(e10.detail);
      this.addEventListener("change", handler);
      callback(this._state);
      return () => this.removeEventListener("change", handler);
    }
  };
  var globalState = new Store({});
  var StoreConsumer = class {
    constructor(host, store) {
      this.host = host;
      this.store = store;
      this.host.addController(this);
    }
    hostConnected() {
      this.unsub = this.store.subscribe(() => this.host.requestUpdate());
    }
    hostDisconnected() {
      if (this.unsub)
        this.unsub();
    }
    get state() {
      return this.store.value;
    }
    set(updates) {
      this.store.set(updates);
    }
  };

  // src/services/AuthService.ts
  var Result;
  (function(Result3) {
    Result3[Result3["Success"] = 0] = "Success";
    Result3[Result3["Fail"] = 1] = "Fail";
  })(Result || (Result = {}));
  var AuthService = class {
    constructor(host) {
      this.host = host;
      this.api = host.apiService.value;
      this.authenticated = false;
    }
    async generate_token(username, password) {
      const res = await this.api.request({
        Url: "http://localhost:5000/api/login",
        Catch: false,
        Type: "POST",
        Authorization: false,
        Body: {
          naam: username,
          wachtwoord: password
        }
      });
      if (res.success === false) {
        this.host.notificationController.value.notify({
          style: "red",
          description: "Incorrect username or password."
        });
        return 1;
      }
      this.authenticated = true;
      this.token = res.data["token"];
      this.api.initial_population();
      return 0;
    }
    deauthenticate() {
      const temp_token = this.token;
      this.authenticated = false;
      this.token = "";
      this.host.notificationController.value.notify({
        style: "default",
        description: "Logged out"
      });
      Router.route(5);
      const res = this.api.request({
        Url: "http://localhost:5000/api/logout",
        Catch: false,
        Type: "POST",
        Authorization: true,
        Params: new URLSearchParams({
          token: temp_token
        })
      });
    }
  };
  var authContext = n10("authController");

  // src/services/APIService.ts
  var APIService = class {
    constructor(host, timeout = 5e3) {
      this.devices = new Store({});
      this.accounts = new Store({});
      this.me = new Store({});
      this.innerTemp = new Store(0);
      this.outerTemp = new Store(0);
      this.humidity = new Store(0);
      this.predictedTrend = new Store([]);
      this.trendlineCoeffs = new Store(null);
      (this.host = host).addController(this);
      this.timeout = timeout;
    }
    hostConnected() {
    }
    hostDisconnected() {
    }
    async request(req) {
      try {
        const params = req.Params ? req.Params : new URLSearchParams();
        params.append("token", this.host.authService.value.token);
        const url = `${req.Url}?${params.toString()}`;
        const headers = {};
        if (req.Headers) {
          req.Headers.forEach((value, key) => headers[key] = value);
        }
        let body;
        if (req.Body != null && req.Type !== "GET") {
          body = JSON.stringify(req.Body);
          headers["Content-Type"] = headers["Content-Type"] || "application/json";
        }
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);
        const response = await fetch(url, {
          method: req.Type,
          headers,
          body,
          signal: controller.signal,
          credentials: req.Cookies ? "include" : "same-origin"
        });
        clearTimeout(timeoutId);
        if (!response.ok) {
          const text = await response.text().catch(() => "");
          if (req.Catch === true) {
            this.handleHttpError(response);
          }
          return {success: false, error_code: response.status, message: text};
        }
        const contentType = response.headers.get("Content-Type") || "";
        if (contentType.includes("application/json")) {
          const parsed = await response.json();
          return {success: true, data: parsed};
        } else {
          const txt = await response.text();
          return {success: true, data: txt};
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          this.host.notificationController.value.notify({
            style: "red",
            description: "Request timed out"
          });
          return {success: false, error_code: 418, message: "I'm a teapot"};
        }
        this.host.notificationController.value.notify({
          style: "red",
          description: "Unknown network error"
        });
        return {success: false, error_code: 100, message: "Unknown network error"};
      }
    }
    async handleHttpError(response) {
      const text = await response.text().catch(() => "");
      switch (response.status) {
        case 401:
          this.host.notificationController.value.notify({
            style: "red",
            description: "Session expired; please reauthenticate."
          });
          break;
        case 403:
          this.host.notificationController.value.notify({
            style: "red",
            description: "You are not allowed to access this resource."
          });
          break;
        case 500:
          this.host.notificationController.value.notify({
            style: "red",
            description: "Internal Server Error"
          });
          break;
        default:
          this.host.notificationController.value.notify({
            style: "red",
            description: `${response.status} Server Error`
          });
          break;
      }
      this.host.authService.value.deauthenticate();
    }
    async initial_population() {
      await Promise.all([
        this.fetch_devices(),
        this.fetch_accounts(),
        this.fetch_me(),
        this.fetch_weather_data(),
        this.fetch_trendline()
      ]);
      console.log("Data retrieval finished");
    }
    async fetch_trendline() {
      const res = await this.request({
        Url: "http://localhost:5000/api/predictions/trendline",
        Catch: false,
        Type: "GET",
        Authorization: true
      });
      if (!res.success) {
        console.warn("fetch_trendline failed", res.message);
        return;
      }
      const data = res.data;
      if (data && typeof data.slope === "number" && typeof data.offset === "number") {
        this.trendlineCoeffs.set({slope: data.slope, offset: data.offset});
        const feature = typeof data.feature === "string" ? data.feature : null;
        if (feature === "Buitentemperatuur (C)") {
          try {
            const temps = await this.fetch_temperature_24h_hourly();
            const temps15 = this.interpolateTo15Min(temps);
            const predicted = this.applyTrendlineToTemps(temps15, data.slope, data.offset);
            this.predictedTrend.set(predicted);
          } catch (e10) {
            console.warn("failed computing predicted trend from coeffs", e10);
          }
        } else {
          console.warn("trendline feature is not temperature:", feature);
          this.predictedTrend.set([]);
        }
        return;
      }
      console.warn("fetch_trendline: unknown response format", data);
    }
    async fetch_temperature_24h_hourly() {
      const res = await this.request({
        Url: "https://api.open-meteo.com/v1/forecast",
        Catch: false,
        Type: "GET",
        Authorization: false,
        Params: new URLSearchParams({
          latitude: "52.0908",
          longitude: "5.1222",
          hourly: "temperature_2m",
          forecast_days: "1",
          timezone: "Europe/Amsterdam"
        })
      });
      if (!res.success)
        throw new Error("weather fetch failed");
      const hourly = (res.data ?? {}).hourly ?? {};
      const temps = hourly.temperature_2m ?? [];
      if (!temps || temps.length < 2)
        throw new Error("insufficient hourly temps");
      if (temps.length < 25) {
        const last = temps[temps.length - 1];
        while (temps.length < 25)
          temps.push(last);
      }
      return temps.slice(0, 25);
    }
    interpolateTo15Min(hourlyTemps) {
      const result = [];
      for (let i9 = 0; i9 < 96; i9++) {
        const t8 = i9 / 4;
        const lo = Math.floor(t8);
        const hi = Math.min(lo + 1, hourlyTemps.length - 1);
        const frac = t8 - lo;
        const val = hourlyTemps[lo] * (1 - frac) + hourlyTemps[hi] * frac;
        result.push(val);
      }
      return result;
    }
    applyTrendlineToTemps(temps15, slope, intercept) {
      return temps15.map((t8) => slope * t8 + intercept);
    }
    async fetch_devices() {
      const res = await this.request({
        Url: "http://localhost:5000/api/devices",
        Catch: false,
        Type: "GET",
        Authorization: true
      });
      if (!res.success) {
        this.host.notificationController.value.notify({
          style: "red",
          description: "Error fetching data"
        });
        return Result.Fail;
      }
      const dataArray = res.data || [];
      const data = dataArray.map(({status, ...rest}) => rest);
      const map = Object.fromEntries(data.map((d4) => [d4.apparaat_id, d4]));
      this.devices.set(map);
      return Result.Success;
    }
    async fetch_accounts() {
      const res = await this.request({
        Url: "http://localhost:5000/api/users",
        Catch: false,
        Type: "GET",
        Authorization: true
      });
      if (!res.success) {
        this.host.notificationController.value.notify({
          style: "red",
          description: "Error fetching data"
        });
        return Result.Fail;
      }
      const dataArray = res.data ?? [];
      const map = Object.fromEntries(dataArray.map((d4) => [d4.gebruiker_id, d4]));
      this.accounts.set(map);
      return Result.Success;
    }
    async fetch_me() {
      const res = await this.request({
        Url: "http://localhost:5000/api/me",
        Catch: false,
        Type: "GET",
        Authorization: true
      });
      if (!res.success) {
        this.host.notificationController.value.notify({
          style: "red",
          description: "Error fetching data"
        });
        return Result.Fail;
      }
      const d4 = res.data;
      if (!d4)
        return Result.Fail;
      this.me.set({0: d4});
      return Result.Success;
    }
    async revoke_account_access(id) {
      const req = {
        Authorization: true,
        Catch: false,
        Type: "POST",
        Url: "http://localhost:5000/api/revoke",
        Params: new URLSearchParams({
          user_id: String(id)
        })
      };
      const res = await this.request(req);
      if (res.success) {
        await Promise.all([
          this.fetch_accounts(),
          this.fetch_me()
        ]);
        return Result.Success;
      } else {
        return Result.Fail;
      }
    }
    async toggle_device(id, target_state) {
      const req = {
        Authorization: true,
        Catch: false,
        Type: "POST",
        Url: "http://localhost:5000/api/devices/toggle",
        Body: {
          apparaat_id: id,
          gewenste_status: target_state
        }
      };
      const res = await this.request(req);
      if (res.success) {
        return Result.Success;
      } else {
        return Result.Fail;
      }
    }
    async fetch_weather_data() {
      const current_data = await this.request({
        Url: "https://api.open-meteo.com/v1/forecast",
        Catch: false,
        Type: "GET",
        Authorization: false,
        Params: new URLSearchParams({
          latitude: "52.0908",
          longitude: "5.1222",
          current: "temperature_2m,relative_humidity_2m"
        })
      });
      const data = (current_data?.data ?? {})["current"];
      this.outerTemp.set(data["temperature_2m"]);
      this.humidity.set(data["relative_humidity_2m"]);
    }
  };
  var apiContext = n10("apiService");

  // src/pages/Dashboard.ts
  var base_style11 = u5`
    <style>
        :root { 
            --border-width: 5px;
        }
        :host {
            display: block; 
            flex: 1;
            position: fixed;
            height: 100%;
            width: 100%;
            background-color: #f2f9f1;
        }
    </style>    
`;
  var Dashboard = class extends i4 {
    constructor() {
      super();
      this.popupController = new i7(this, {context: popupContext, initialValue: new PopupController(this, 100)});
      this.notificationController = new i7(this, {context: notificationContext, initialValue: new NotificationController(this, 100)});
      this.apiService = new i7(this, {context: apiContext, initialValue: new APIService(this)});
      this.authService = new i7(this, {context: authContext, initialValue: new AuthService(this)});
      this.text = "Continue";
      this._onRoute = () => this.requestUpdate();
    }
    connectedCallback() {
      super.connectedCallback();
      window.addEventListener("route-changed", this._onRoute);
    }
    disconnectedCallback() {
      window.removeEventListener("route-changed", this._onRoute);
      super.disconnectedCallback();
    }
    render() {
      const route = Routes[Router.state.get()];
      const tag = String(route.pageSelector);
      return u5`
            ${base_style11}
            <split-layout orientation="horizontal" start-size="220px">
                ${n8(route.show === true, () => u5`
                        <div slot="start">
                            <side-bar></side-bar>
                        </div>
                    `)}
                <div slot="middle">
                    <div style="padding: 15px; display: block; height: calc(100% - 30px);">
                        <${s7(tag)}>
                        </${s7(tag)}>
                    </div>
                </div>
            </split-layout>
            ${this.popupController.value._render()}
            ${this.notificationController.value._render()}
        `;
    }
  };
  __decorate([
    n4()
  ], Dashboard.prototype, "text", 2);
  Dashboard = __decorate([
    t3("pg-dashboard")
  ], Dashboard);

  // src/pages/views/Sidebar.ts
  var base_style12 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            padding: 10px;
            gap: 5px;
            height: 100%;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            background-color: #3f9062;
            overflow: auto;
            border-radius: 0px 15px 15px 0px;
        }
        .menu-container {
            margin-top: 5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: stretch;
            gap: 5px;
        }
        .top {
            font-family: "Funnel Display", Helvetica;
            font-weight: 500;
            color: black;
            font-size: 18px;
            background-color: #ffb300;
            align-items: center;
            text-align: center;
            vertical-align: middle;
            display: inline;
            padding-top: 12px;
            border-radius: 15px;
        }
    </style>    
`;
  var Sidebar = class extends i4 {
    constructor() {
      super();
      this._onRoute = () => this.requestUpdate();
    }
    connectedCallback() {
      super.connectedCallback();
      window.addEventListener("route-changed", this._onRoute);
    }
    disconnectedCallback() {
      window.removeEventListener("route-changed", this._onRoute);
      super.disconnectedCallback();
    }
    render() {
      const selected2 = Router.state.get();
      const container = document.createElement("div");
      container.slot = "middle";
      container.className = "menu-container";
      const entries = Object.entries(Routes).filter((route) => route[1].pageSelector != "ly-account").filter((route) => route[1].show === true).map((route) => {
        const el = document.createElement("menu-entry");
        container.appendChild(el);
        el.title = route[1].vanityName;
        el.icon = route[1].iconPath;
        el.entry = Number(route[0]);
        el.type = Styles.UNSELECTED;
        return el;
      });
      let account_style = Styles.UNSELECTED;
      if (selected2 == 4) {
        account_style = Styles.SELECTED;
      } else {
        if (selected2 in entries) {
          entries[selected2].type = Styles.SELECTED;
        }
      }
      const account = document.createElement("menu-entry");
      account.title = Routes[4].vanityName;
      account.icon = Routes[4].iconPath;
      account.entry = Number(4);
      account.type = account_style;
      return x`
            ${base_style12}
            <div class="inner">
                <split-layout orientation="vertical" start-size="50px" end-size="50px">
                    <div slot="start" class="top">SlimHuis</div>
                    ${container}
                    <div slot="end">
                        <div style="vertical-align: bottom; height: 100%; display: flex; flex-direction: column-reverse;">
                            ${account}
                        </div>
                    </div>
                </split-layout>
            </div>
        `;
    }
  };
  Sidebar = __decorate([
    t3("side-bar")
  ], Sidebar);

  // src/directives/Wrap.ts
  async function Wrap(managed_object, before, after, during, ...passed_object) {
    await before(managed_object);
    try {
      await during(...passed_object);
    } catch (e10) {
    }
    await after(managed_object);
  }

  // src/services/micro/BaseFlow.ts
  var BaseFlow = class {
  };

  // src/services/micro/ToggleDevice.ts
  var ToggleDevice = class extends BaseFlow {
    constructor(controller, api) {
      super();
      this.toggling_notification = {
        style: "default",
        description: "Toggling device"
      };
      this.error_notification = {
        style: "red",
        description: "Failed to toggle device"
      };
      this.success_notification = {
        style: "default",
        description: "Succesfully toggled device!"
      };
      this.api = api;
      this.controller = controller;
      return this;
    }
    async start(id, now_active) {
      const target_state = !now_active;
      const result = await this.api.toggle_device(id, target_state);
      if (result === Result.Success) {
        const devices = this.api.devices.value;
        const current = devices[id];
        if (current) {
          const updated = {...current, actief: target_state, huidig_verbruik: now_active ? 0 : 2};
          this.api.devices.set({[id]: updated});
        }
        this.controller.notify(this.success_notification);
      } else {
        this.controller.notify(this.error_notification);
      }
    }
  };

  // src/pages/views/full_frame/Home.ts
  var sheet2 = {
    headers: {
      naam: {
        label: "Apparaat",
        renderer: RenderNames.string
      },
      kamer: {
        label: "Kamer",
        renderer: RenderNames.string
      },
      energieverbruik: {
        label: "Energieverbruik",
        renderer: RenderNames.number
      },
      actief: {
        label: "Actief",
        renderer: RenderNames.boolean
      },
      schakel: {
        label: "Schakelen",
        renderer: RenderNames.button
      }
    },
    values: [
      {
        naam: "Servo",
        kamer: "Woonkamer",
        energieverbruik: "0.1 W",
        actief: true,
        schakel: {
          disabled: true,
          type: "Yellow",
          title: "Beheerd",
          icon: "",
          callback: () => {
          }
        }
      }
    ]
  };
  var graph = {
    type: GraphTypes.ColumnGraph,
    color: "#e1b400",
    graph: [
      {x: 0.5, y: 1, width: 0.8},
      {x: 1.5, y: 1.2, width: 0.8},
      {x: 2.5, y: 1.2, width: 0.8},
      {x: 3.5, y: 1.3, width: 0.8},
      {x: 4.5, y: 1.4, width: 0.8},
      {x: 5.5, y: 1.4, width: 0.8},
      {x: 6.5, y: 1.4, width: 0.8},
      {x: 7.5, y: 1.5, width: 0.8},
      {x: 8.5, y: 1.5, width: 0.8},
      {x: 9.5, y: 1.5, width: 0.8},
      {x: 10.5, y: 1.5, width: 0.8},
      {x: 11.5, y: 1.4, width: 0.8},
      {x: 12.5, y: 1.4, width: 0.8},
      {x: 13.5, y: 1.3, width: 0.8},
      {x: 14.5, y: 1.4, width: 0.8},
      {x: 15.5, y: 1.5, width: 0.8},
      {x: 16.5, y: 1.7, width: 0.8},
      {x: 17.5, y: 1.8, width: 0.8},
      {x: 18.5, y: 1.9, width: 0.8},
      {x: 19.5, y: 2, width: 0.8},
      {x: 20.5, y: 1.7, width: 0.8},
      {x: 21.5, y: 1.5, width: 0.8},
      {x: 22.5, y: 1.3, width: 0.8},
      {x: 23.5, y: 1.2, width: 0.8}
    ]
  };
  var kwh_graph = {
    x_range: {
      start: 0,
      end: 24,
      step: 0.25
    },
    y_range: {
      start: 0,
      end: 5,
      step: 1
    },
    x_label: "Tijd in uren (vandaag)",
    y_label: "Energieverbruik in kWh",
    graphs: new Map([
      [0, graph]
    ])
  };
  var base_style13 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: calc(100% - 15px);
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .content {
            flex: 1 1 auto; /* take remaining space */
            overflow: auto; /* scroll if needed */
        }
        .container > * + * {
            border-top: solid 1px #a2a2a2;
        }
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr;
            grid-auto-rows: 10%;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .graph_box {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 4;
            grid-row-end: 9;
            flex-direction: column;
        }
        .detail_box {
            grid-column-start: 1;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 4;
        }
        .table_box {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 4;
            grid-row-end: 9;
            flex-direction: column;
        }
    </style>    
`;
  var HomeLayout = class extends i4 {
    constructor() {
      super();
      this.disabledTableButtons = new Set([]);
      this.button_callback = this.button_callback.bind(this);
    }
    firstUpdated(_changedProperties) {
      if (this.APIService?.devices && !this.DeviceConsumer) {
        this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
      }
    }
    updated(_changedProperties) {
      if (!this.DeviceConsumer && this.APIService?.devices) {
        this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
      }
    }
    disconnectedCallback() {
      super.disconnectedCallback();
    }
    async button_callback(apparaat_id, nu_actief) {
      await Wrap(this.disabledTableButtons, (set) => {
        set.add(apparaat_id);
        this.requestUpdate();
      }, (set) => {
        set.delete(apparaat_id);
        this.requestUpdate();
      }, async (id, now_active) => {
        await new ToggleDevice(this.NotificationController, this.APIService).start(id, now_active);
      }, apparaat_id, nu_actief);
    }
    render() {
      const devicesState = Object.values(this.APIService?.devices.value);
      const passable = devicesState.map((value) => ({
        naam: value.naam,
        kamer: value.kamer,
        energieverbruik: value.huidig_verbruik,
        actief: value.actief,
        schakel: {
          disabled: value.beheerd || this.disabledTableButtons.has(value.apparaat_id),
          type: "Yellow",
          title: "Schakel",
          icon: "",
          callback: (e10) => {
            return this.button_callback(value.apparaat_id, value.actief);
          }
        }
      }));
      const dynamicSheet = Object.assign({}, sheet2, {values: Object.values(passable)});
      return x`
            ${base_style13}
            <div class="inner">
                <md-title>
                    Home
                </md-title>
                <div class="grid">
                    <gl-surface style="gap: 15px; overflow: hidden;" class="detail_box" width="auto" height="auto">
                        <gl-data-tile height="200px" color="#005ec3" style="flex: 1 1 auto;">
                            <md-richtext>Luchtvochtigheid</md-richtext>
                            <md-title>${this.APIService.humidity.value}%</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#3f9062" style="flex: 1 1 auto;">
                            <md-richtext>Binnentemperatuur</md-richtext>
                            <md-title>21 °C</md-title>
                            <md-richtext style="color: #3f9062!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile height="200px" color="#c30000" style="flex: 1 1 auto;">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>${Object.entries(this.APIService.devices.value).reduce((acc, device) => acc + Number(device[1].huidig_verbruik), 0).toFixed(2)}</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                    <gl-surface class="table_box" width="auto" height="auto">
                        <adv-table .table=${dynamicSheet}>
                        </adv-table>
                    </gl-surface>
                    <gl-surface class="graph_box" width="auto" height="auto">
                        <adv-graph .graph=${kwh_graph}>
                        </adv-graph>
                    </gl-surface>
                </div>
                <br/>
            </div>
        `;
    }
  };
  __decorate([
    c7({context: popupContext})
  ], HomeLayout.prototype, "PopupController", 2);
  __decorate([
    c7({context: notificationContext})
  ], HomeLayout.prototype, "NotificationController", 2);
  __decorate([
    c7({context: authContext})
  ], HomeLayout.prototype, "AuthService", 2);
  __decorate([
    c7({context: apiContext})
  ], HomeLayout.prototype, "APIService", 2);
  __decorate([
    n4({attribute: false})
  ], HomeLayout.prototype, "disabledTableButtons", 2);
  HomeLayout = __decorate([
    t3("ly-home")
  ], HomeLayout);

  // src/services/micro/LogOut.ts
  var LogOut = class extends BaseFlow {
    constructor(controller, auth) {
      super();
      this.popup = {
        width: "400px",
        title: {
          icon: "",
          content: "Logout"
        },
        button_bar: [
          {
            icon: "/public/home.svg",
            callback: () => this.confirm(),
            title: "Log out",
            type: "Red",
            disabled: false
          },
          {
            icon: "",
            callback: () => this.cancel(),
            title: "Cancel",
            type: "Secondary",
            disabled: false
          }
        ]
      };
      this.auth = auth;
      this.controller = controller;
      return this;
    }
    start() {
      const id = this.controller.notify(this.popup);
      this.controller_id = id;
    }
    confirm() {
      if (this.controller_id !== void 0) {
        this.controller.dismiss(this.controller_id);
        this.auth.deauthenticate();
      }
    }
    cancel() {
      if (this.controller_id !== void 0) {
        this.controller.dismiss(this.controller_id);
      }
    }
  };

  // src/services/micro/LogAllOut.ts
  var LogAllOut = class extends BaseFlow {
    constructor(controller, api, notification, target_id) {
      super();
      this.popup = {
        width: "400px",
        title: {
          icon: "",
          content: "Deze gebruiker uitloggen?"
        },
        body: u5`<md-richtext>Dit zal de sessies van deze gebruikers direct stopzetten (m.u.v. de huidige sessie op dit apparaat).</md-richtext>`,
        button_bar: [
          {
            icon: "/public/home.svg",
            callback: () => this.confirm(),
            title: "Log uit",
            type: "Red",
            disabled: false
          },
          {
            icon: "",
            callback: () => this.cancel(),
            title: "Annuleren",
            type: "Secondary",
            disabled: false
          }
        ]
      };
      this.api = api;
      this.controller = controller;
      this.notification = notification;
      this.target_id = target_id;
      this.promise = new Promise((resolve, reject) => {
        this.resolve = resolve;
      });
      return this;
    }
    async start() {
      const id = this.controller.notify(this.popup);
      this.controller_id = id;
      return await this.promise;
    }
    async confirm() {
      if (this.controller_id !== void 0) {
        this.controller.dismiss(this.controller_id);
        const result = await this.api.revoke_account_access(this.target_id);
        this.resolve?.();
        if (result === Result.Success) {
          this.notification.notify({
            style: "default",
            description: "Succesvol alle sessies van deze gebruiker opgezegd."
          });
        } else {
          this.notification.notify({
            style: "red",
            description: "Er ging iets mis met het opzeggen van de sessies van deze gebruiker."
          });
        }
      }
    }
    cancel() {
      if (this.controller_id !== void 0) {
        this.resolve?.();
        this.controller.dismiss(this.controller_id);
      }
    }
  };

  // src/pages/views/full_frame/Account.ts
  var sheet3 = {
    headers: {
      gebruiker: {
        label: "Gebruikersnaam",
        renderer: RenderNames.string
      },
      email: {
        label: "Email",
        renderer: RenderNames.string
      },
      sessies: {
        label: "Sessies",
        renderer: RenderNames.number
      },
      beheer: {
        label: "Sessiebeheer",
        renderer: RenderNames.button
      }
    },
    values: []
  };
  var base_style14 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: 100%;
            overflow: auto;
            display: inline-flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .container > * + * {
            border-top: solid 1px #a2a2a2;
        }  
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr;
            grid-auto-rows: 10%;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .detail_box {
            grid-column-start: 1;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 5;
        }
        .table_box {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 9;
            flex-direction: column;
        }
    </style>  
`;
  var AccountLayout = class extends i4 {
    constructor() {
      super();
      this.disabledTableButtons = new Set([]);
      this.button_callback = this.button_callback.bind(this);
    }
    firstUpdated(_changedProperties) {
      if (this.APIService?.accounts && !this.AccountConsumer) {
        this.AccountConsumer = new StoreConsumer(this, this.APIService.accounts);
      }
      if (this.APIService?.me && !this.MeConsumer) {
        this.MeConsumer = new StoreConsumer(this, this.APIService.me);
      }
    }
    updated(_changedProperties) {
      if (this.APIService?.accounts && !this.AccountConsumer) {
        this.AccountConsumer = new StoreConsumer(this, this.APIService.accounts);
      }
      if (this.APIService?.me && !this.MeConsumer) {
        this.MeConsumer = new StoreConsumer(this, this.APIService.me);
      }
    }
    async button_callback(gebruiker_id) {
      await Wrap(this.disabledTableButtons, (set) => {
        set.add(gebruiker_id);
        this.requestUpdate();
      }, (set) => {
        set.delete(gebruiker_id);
        this.requestUpdate();
      }, async (id) => {
        await new LogAllOut(this.PopupController, this.APIService, this.NotificationController, id).start();
      }, gebruiker_id);
    }
    render() {
      const accountsState = Object.values(this.APIService?.accounts.value);
      const passable = accountsState.map((value) => ({
        gebruiker: value.naam,
        email: value.email,
        sessies: value.sessies,
        beheer: {
          disabled: this.disabledTableButtons.has(value.gebruiker_id),
          type: "Red",
          title: "Log gebruiker uit",
          icon: "",
          callback: (e10) => {
            return this.button_callback(value.gebruiker_id);
          }
        }
      }));
      const dynamicSheet = Object.assign({}, sheet3, {values: Object.values(passable)});
      return x`
            ${base_style14}
            <div class="inner">
                <md-title>
                    Account
                </md-title>
                <div class="grid">
                    <gl-surface style="flex-direction: column; gap: 5px;" class="detail_box" width="auto" height="fit-content">
                        <md-title>
                            Account
                        </md-title>
                        <md-richtext>Naam: ${this.APIService.me?.value[0]?.naam}</md-richtext>
                        <md-richtext>Email: ${this.APIService.me?.value[0]?.email}</md-richtext>
                        <md-richtext>Identificatienummer: ${this.APIService.me?.value[0]?.gebruiker_id}</md-richtext>
                        <md-richtext>Actieve Sessies: ${this.APIService.me?.value[0]?.sessies}</md-richtext>
                        <br/>
                        <md-title>
                            Log uit
                        </md-title>
                        <md-button .type=${Styles2.Red} .callback=${() => new LogOut(this.PopupController, this.AuthService).start()}>
                            Log uit
                        </md-button>
                    </gl-surface>
                    <gl-surface class="table_box" width="auto" height="auto">
                        <adv-table .table=${dynamicSheet}>

                        </adv-table>
                    </gl-surface>
                    <br/>
                </div>
            </div>
        `;
    }
  };
  __decorate([
    c7({context: popupContext})
  ], AccountLayout.prototype, "PopupController", 2);
  __decorate([
    c7({context: notificationContext})
  ], AccountLayout.prototype, "NotificationController", 2);
  __decorate([
    c7({context: authContext})
  ], AccountLayout.prototype, "AuthService", 2);
  __decorate([
    c7({context: apiContext})
  ], AccountLayout.prototype, "APIService", 2);
  __decorate([
    n4({attribute: false})
  ], AccountLayout.prototype, "disabledTableButtons", 2);
  AccountLayout = __decorate([
    t3("ly-account")
  ], AccountLayout);

  // src/pages/views/full_frame/Devices.ts
  var base_style15 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: calc(100% - 15px);
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr;
            grid-auto-rows: 2fr 2fr;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .box_1 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_2 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_3 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 1;
            grid-row-end: 1;
        }
        .box_4 {
            grid-column-start: 1;
            grid-column-end: 1;
            grid-row-start: 2;
            grid-row-end: 2;
        }
        .box_5 {
            grid-column-start: 2;
            grid-column-end: 2;
            grid-row-start: 2;
            grid-row-end: 2;
        }
        .box_6 {
            grid-column-start: 3;
            grid-column-end: 3;
            grid-row-start: 2;
            grid-row-end: 2;
        }
    </style>    
`;
  var DeviceLayout = class extends i4 {
    constructor() {
      super();
      this.disabledDeviceButtons = new Set([]);
      this.button_callback = this.button_callback.bind(this);
    }
    firstUpdated(_changedProperties) {
      if (this.APIService?.devices && !this.DeviceConsumer) {
        this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
      }
    }
    updated(_changedProperties) {
      if (!this.DeviceConsumer && this.APIService?.devices) {
        this.DeviceConsumer = new StoreConsumer(this, this.APIService.devices);
      }
    }
    async button_callback(apparaat_id, nu_actief) {
      await Wrap(this.disabledDeviceButtons, (set) => {
        set.add(apparaat_id);
        this.requestUpdate();
      }, (set) => {
        set.delete(apparaat_id);
        this.requestUpdate();
      }, async (id, now_active) => {
        await new ToggleDevice(this.NotificationController, this.APIService).start(id, now_active);
      }, apparaat_id, nu_actief);
    }
    render() {
      const devicesState = Object.values(this.APIService?.devices?.value ?? {});
      return x`
            ${base_style15}
            <div class="inner">
                <md-title>Apparaten</md-title>
                <div class="grid">
                    ${[0, 1, 2, 3, 4, 5].map((idx) => x`
                        ${devicesState[idx] ? x`
                            <gl-device-tile
                                class="box_${idx + 1}"
                                .device=${devicesState[idx]}
                                ?disabled=${this.disabledDeviceButtons.has(devicesState[idx].apparaat_id)}
                                .callback=${this.button_callback}
                            ></gl-device-tile>
                        ` : x``}
                    `)}
                </div>
            </div>
        `;
    }
  };
  __decorate([
    c7({context: apiContext})
  ], DeviceLayout.prototype, "APIService", 2);
  __decorate([
    c7({context: notificationContext})
  ], DeviceLayout.prototype, "NotificationController", 2);
  __decorate([
    n4({attribute: false})
  ], DeviceLayout.prototype, "disabledDeviceButtons", 2);
  DeviceLayout = __decorate([
    t3("ly-devices")
  ], DeviceLayout);

  // src/pages/views/full_frame/Layout.ts
  var base_style16 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: flex;
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            overflow: auto;
        }
    </style>    
`;
  var LayoutLayout = class extends i4 {
    constructor() {
      super();
    }
    render() {
      return x`
            ${base_style16}
            <div class="inner">
                <md-title>
                    Plattegrond
                </md-title>
            </div>
        `;
    }
  };
  LayoutLayout = __decorate([
    t3("ly-layout")
  ], LayoutLayout);

  // src/pages/views/full_frame/Predictions.ts
  var base_style17 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: calc(100% - 15px);
            overflow: auto;
            display: flex;
            flex-direction: column;
            gap: 10px; /* Space between all children */
        }
        .grid {
            display: grid;
            grid-template-columns: 2fr 2fr 2fr 2fr;
            grid-auto-rows: 10%;
            height: 100%;
            width: 100%;
            gap: 15px;
        }
        .graph_box {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 7;
        }
        .detail_box {
            grid-column-start: 4;
            grid-column-end: 4;
            grid-row-start: 1;
            grid-row-end: 9;
            display: flex;
            flex-direction: column;
        }
        .controller_box {
            grid-column-start: 1;
            grid-column-end: 4;
            grid-row-start: 7;
            grid-row-end: 8;
        }
    </style>    
`;
  var PredictionLayout = class extends i4 {
    firstUpdated() {
      this.APIService.predictedTrend.subscribe(async (arr) => {
        const values = arr ?? [];
        console.log("h", values);
        const predictedDataset = values.map((v4, i9) => ({x: i9 * 0.25, y: v4}));
        let tempDataset = [];
        try {
          const hourly = await this.APIService.fetch_temperature_24h_hourly();
          const temps15 = this.APIService.interpolateTo15Min(hourly);
          tempDataset = temps15.map((t8, i9) => ({x: i9 * 0.25, y: t8}));
        } catch (e10) {
          console.warn("failed fetching temps for plotting", e10);
        }
        const combinedYs = [];
        if (predictedDataset.length)
          combinedYs.push(...predictedDataset.map((p5) => p5.y));
        if (tempDataset.length)
          combinedYs.push(...tempDataset.map((p5) => p5.y));
        const maxY = combinedYs.length ? Math.max(...combinedYs, 1) : 1;
        const minY = combinedYs.length ? Math.min(...combinedYs, 0) : 0;
        let yStart = Math.floor(minY * 1.2);
        let yEnd = Math.ceil(maxY * 1.2);
        if (yStart === yEnd)
          yEnd = yStart + 1;
        this.graphData = {
          graphs: new Map([
            [0, {type: GraphTypes.LineGraph, color: "#3f9062", graph: predictedDataset}],
            [1, {type: GraphTypes.LineGraph, color: "#005ec3", graph: tempDataset}]
          ]),
          x_range: {start: 0, end: 24, step: 0.25},
          y_range: {start: yStart, end: yEnd, step: 0.25},
          x_label: "Uren (in de toekomst, relatief aan nu)",
          y_label: "kWh / \xB0C"
        };
        this.requestUpdate();
      });
    }
    constructor() {
      super();
    }
    render() {
      return x`
            ${base_style17}
            <div class="inner">
                <md-title>
                    Weersvoorspellingen
                </md-title>
                <div class="grid">
                    <gl-surface class="graph_box" width="auto" height="auto">
                        <adv-graph .graph=${this.graphData}></adv-graph>
                    </gl-surface>
                    <gl-surface style="gap: 15px;" class="detail_box" width="auto" height="auto">
                        <gl-data-tile color="#e1b400" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Buitentemperatuur</md-richtext>
                            <md-title>${this.APIService.outerTemp.value} °C</md-title>
                            <md-richtext style="color: #e1b400!important; text-size: 10px;">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile color="#005ec3" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Luchtvochtigheid</md-richtext>
                            <md-title>${this.APIService.humidity.value}%</md-title>
                            <md-richtext style="color: #005ec3!important; text-size: 10px;" width="auto">huidig</md-richtext>
                        </gl-data-tile>
                        <gl-data-tile color="#3f9062" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Tijd</md-richtext>
                            <md-title>${new Date(Date.now()).toLocaleString("nl-NL", {
        hour: "2-digit",
        minute: "2-digit"
      })}</md-title>
                        </gl-data-tile>
                        <gl-data-tile color="#c30000" style="flex: 1 1 auto;" width="auto">
                            <md-richtext>Energieverbruik</md-richtext>
                            <md-title>${Object.entries(this.APIService.devices.value).reduce((acc, device) => acc + Number(device[1].huidig_verbruik), 0).toFixed(2)} kWh</md-title>
                            <md-richtext style="color: #c30000!important; text-size: 10px;">/ uur</md-richtext>
                        </gl-data-tile>
                    </gl-surface>
                </div>
            </div>
        `;
    }
  };
  __decorate([
    c7({context: apiContext})
  ], PredictionLayout.prototype, "APIService", 2);
  PredictionLayout = __decorate([
    t3("ly-predictions")
  ], PredictionLayout);

  // src/pages/views/full_frame/Sensors.ts
  var base_style18 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: flex;
            padding: 10px;
            padding-top: 0px;
            height: 100%;
            width: 100%;
            min-width: 0;
            box-sizing: border-box;
            overflow: auto;
        }
    </style>    
`;
  var SensorLayout = class extends i4 {
    constructor() {
      super();
    }
    render() {
      return x`
            ${base_style18}
            <div class="inner">
                <md-title>
                    Sensoren
                </md-title>
            </div>
        `;
    }
  };
  SensorLayout = __decorate([
    t3("ly-sensors")
  ], SensorLayout);

  // node_modules/lit-html/directives/live.js
  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var l7 = e6(class extends i6 {
    constructor(r12) {
      if (super(r12), r12.type !== t4.PROPERTY && r12.type !== t4.ATTRIBUTE && r12.type !== t4.BOOLEAN_ATTRIBUTE)
        throw Error("The `live` directive is not allowed on child or event bindings");
      if (!f3(r12))
        throw Error("`live` bindings can only contain a single expression");
    }
    render(r12) {
      return r12;
    }
    update(i9, [t8]) {
      if (t8 === T || t8 === E)
        return t8;
      const o13 = i9.element, l8 = i9.name;
      if (i9.type === t4.PROPERTY) {
        if (t8 === o13[l8])
          return T;
      } else if (i9.type === t4.BOOLEAN_ATTRIBUTE) {
        if (!!t8 === o13.hasAttribute(l8))
          return T;
      } else if (i9.type === t4.ATTRIBUTE && o13.getAttribute(l8) === t8 + "")
        return T;
      return m2(i9), t8;
    }
  });

  // src/pages/views/full_frame/Auth.ts
  var base_style19 = x`
    <style>
        :root { 
            --border-width: 5px;
        }
        .inner {
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            z-index: 200;
            justify-content: center;
        }
        .inner > .wrapper {
           position: absolute; 
           left: 50%; 
           top: 50%; 
           transform: translate(-50%, calc(-50% - 100px));
        }
        .inner > .wrapper > * {
            position: relative; /* allows variable size naturally */
            pointer-events: auto;
        }
    </style>    
`;
  var AuthLayout = class extends i4 {
    firstUpdated() {
      this.popupRef = this.shadowRoot?.querySelector("gl-popup-surface");
    }
    constructor() {
      super();
      this.invalid_state = false;
      this.counter = 0;
      this.button_callback = this.button_callback.bind(this);
      this.user_input_callback = this.user_input_callback.bind(this);
      this.passwd_input_callback = this.passwd_input_callback.bind(this);
      this.current_username_input = "";
      this.current_password_input = "";
      this.shape = {
        width: "700px",
        title: {
          content: "SlimHuis Login",
          icon: ""
        },
        button_bar: [
          {
            type: "Primary",
            title: "Log in",
            icon: "",
            disabled: false,
            callback: this.button_callback
          }
        ]
      };
    }
    async button_callback(e10) {
      const newShape = {
        ...this.shape,
        button_bar: [
          {
            ...this.shape.button_bar[0],
            disabled: true
          }
        ]
      };
      this.shape = newShape;
      this.counter += 1;
      this.requestUpdate();
      this.popupRef?.requestUpdate();
      const res = await this.AuthService.generate_token(this.current_username_input, this.current_password_input);
      const newShape2 = {
        ...this.shape,
        button_bar: [
          {
            ...this.shape.button_bar[0],
            disabled: false
          }
        ]
      };
      this.shape = newShape2;
      this.counter += 1;
      if (res == Result.Success) {
        Router.route(0);
        this.NotificationController.notify({
          style: "default",
          description: "Logged in"
        });
      } else {
        this.invalid_state = true;
      }
      this.requestUpdate();
      this.popupRef?.requestUpdate();
    }
    user_input_callback(e10) {
      this.current_username_input = e10.target.value;
    }
    passwd_input_callback(e10) {
      this.current_password_input = e10.target.value;
    }
    render() {
      const bodyContent = x`
            <style>
                .auth-fields {
                    display: flex;
                    flex-direction: column; /* stacks children vertically */
                    gap: 8px; /* space between lines */
                    width: calc(100% - 60%);
                }
            </style>
            <div class="auth-fields">
                <md-richtext><b>Gebruikersnaam</b></md-richtext>
                <md-textfield .callback=${this.user_input_callback}></md-textfield>
                <md-richtext><b>Wachtwoord</b></md-richtext>
                <md-textfield .password=${true} .callback=${this.passwd_input_callback}>
                    ${n8(this.invalid_state === true, () => x`
                            <div style="color: red; font-family:'Funnel Display', Helvetica; font-size: 14px; padding-top: 5px; padding-left: 5px;">
                                Invalide Wachtwoord of Gebruikersnaam
                            </div>
                        `)}
                </md-textfield>
            </div>
        `;
      this.computedShape = {...this.shape, body: bodyContent};
      return x`
            ${base_style19}
            <div class="inner">
                <div class="wrapper">
                    <gl-popup-surface .counter="${this.counter}" .shape=${l7(this.computedShape)}></gl-popup-surface>    
                </div>
            </div>
        `;
    }
  };
  __decorate([
    c7({context: authContext})
  ], AuthLayout.prototype, "AuthService", 2);
  __decorate([
    c7({context: notificationContext})
  ], AuthLayout.prototype, "NotificationController", 2);
  __decorate([
    n4({type: Boolean})
  ], AuthLayout.prototype, "invalid_state", 2);
  __decorate([
    n4({type: Object, attribute: false})
  ], AuthLayout.prototype, "shape", 2);
  __decorate([
    n4({type: Object, attribute: false, hasChanged: () => true})
  ], AuthLayout.prototype, "computedShape", 2);
  __decorate([
    n4({type: Number})
  ], AuthLayout.prototype, "counter", 2);
  AuthLayout = __decorate([
    t3("ly-auth")
  ], AuthLayout);

  // src/main.ts
  var element = document.createElement("pg-dashboard");
  document.body.appendChild(element);
})();
//# sourceMappingURL=bundle.js.map
