(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
  var __decorate = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i8 = decorators.length - 1, decorator; i8 >= 0; i8--)
      if (decorator = decorators[i8])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result)
      __defProp(target, key, result);
    return result;
  };
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
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
    constructor(t7, e9, o12) {
      if (this._$cssResult$ = true, o12 !== s)
        throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t7, this.t = e9;
    }
    get styleSheet() {
      let t7 = this.o;
      const s11 = this.t;
      if (e && t7 === void 0) {
        const e9 = s11 !== void 0 && s11.length === 1;
        e9 && (t7 = o.get(s11)), t7 === void 0 && ((this.o = t7 = new CSSStyleSheet()).replaceSync(this.cssText), e9 && o.set(s11, t7));
      }
      return t7;
    }
    toString() {
      return this.cssText;
    }
  };
  var r = (t7) => new n(typeof t7 == "string" ? t7 : t7 + "", void 0, s);
  var i = (t7, ...e9) => {
    const o12 = t7.length === 1 ? t7[0] : e9.reduce((e10, s11, o13) => e10 + ((t8) => {
      if (t8._$cssResult$ === true)
        return t8.cssText;
      if (typeof t8 == "number")
        return t8;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t8 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s11) + t7[o13 + 1], t7[0]);
    return new n(o12, t7, s);
  };
  var S = (s11, o12) => {
    if (e)
      s11.adoptedStyleSheets = o12.map((t7) => t7 instanceof CSSStyleSheet ? t7 : t7.styleSheet);
    else
      for (const e9 of o12) {
        const o13 = document.createElement("style"), n11 = t.litNonce;
        n11 !== void 0 && o13.setAttribute("nonce", n11), o13.textContent = e9.cssText, s11.appendChild(o13);
      }
  };
  var c = e ? (t7) => t7 : (t7) => t7 instanceof CSSStyleSheet ? ((t8) => {
    let e9 = "";
    for (const s11 of t8.cssRules)
      e9 += s11.cssText;
    return r(e9);
  })(t7) : t7;

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
  var d = (t7, s11) => t7;
  var u = {toAttribute(t7, s11) {
    switch (s11) {
      case Boolean:
        t7 = t7 ? l : null;
        break;
      case Object:
      case Array:
        t7 = t7 == null ? t7 : JSON.stringify(t7);
    }
    return t7;
  }, fromAttribute(t7, s11) {
    let i8 = t7;
    switch (s11) {
      case Boolean:
        i8 = t7 !== null;
        break;
      case Number:
        i8 = t7 === null ? null : Number(t7);
        break;
      case Object:
      case Array:
        try {
          i8 = JSON.parse(t7);
        } catch (t8) {
          i8 = null;
        }
    }
    return i8;
  }};
  var f = (t7, s11) => !i2(t7, s11);
  var b = {attribute: true, type: String, converter: u, reflect: false, useDefault: false, hasChanged: f};
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = new WeakMap());
  var y = class extends HTMLElement {
    static addInitializer(t7) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t7);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t7, s11 = b) {
      if (s11.state && (s11.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t7) && ((s11 = Object.create(s11)).wrapped = true), this.elementProperties.set(t7, s11), !s11.noAccessor) {
        const i8 = Symbol(), h6 = this.getPropertyDescriptor(t7, i8, s11);
        h6 !== void 0 && e2(this.prototype, t7, h6);
      }
    }
    static getPropertyDescriptor(t7, s11, i8) {
      const {get: e9, set: r10} = h(this.prototype, t7) ?? {get() {
        return this[s11];
      }, set(t8) {
        this[s11] = t8;
      }};
      return {get: e9, set(s12) {
        const h6 = e9?.call(this);
        r10?.call(this, s12), this.requestUpdate(t7, h6, i8);
      }, configurable: true, enumerable: true};
    }
    static getPropertyOptions(t7) {
      return this.elementProperties.get(t7) ?? b;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d("elementProperties")))
        return;
      const t7 = n2(this);
      t7.finalize(), t7.l !== void 0 && (this.l = [...t7.l]), this.elementProperties = new Map(t7.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d("finalized")))
        return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
        const t8 = this.properties, s11 = [...r2(t8), ...o2(t8)];
        for (const i8 of s11)
          this.createProperty(i8, t8[i8]);
      }
      const t7 = this[Symbol.metadata];
      if (t7 !== null) {
        const s11 = litPropertyMetadata.get(t7);
        if (s11 !== void 0)
          for (const [t8, i8] of s11)
            this.elementProperties.set(t8, i8);
      }
      this._$Eh = new Map();
      for (const [t8, s11] of this.elementProperties) {
        const i8 = this._$Eu(t8, s11);
        i8 !== void 0 && this._$Eh.set(i8, t8);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s11) {
      const i8 = [];
      if (Array.isArray(s11)) {
        const e9 = new Set(s11.flat(1 / 0).reverse());
        for (const s12 of e9)
          i8.unshift(c(s12));
      } else
        s11 !== void 0 && i8.push(c(s11));
      return i8;
    }
    static _$Eu(t7, s11) {
      const i8 = s11.attribute;
      return i8 === false ? void 0 : typeof i8 == "string" ? i8 : typeof t7 == "string" ? t7.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      this._$ES = new Promise((t7) => this.enableUpdating = t7), this._$AL = new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t7) => t7(this));
    }
    addController(t7) {
      (this._$EO ?? (this._$EO = new Set())).add(t7), this.renderRoot !== void 0 && this.isConnected && t7.hostConnected?.();
    }
    removeController(t7) {
      this._$EO?.delete(t7);
    }
    _$E_() {
      const t7 = new Map(), s11 = this.constructor.elementProperties;
      for (const i8 of s11.keys())
        this.hasOwnProperty(i8) && (t7.set(i8, this[i8]), delete this[i8]);
      t7.size > 0 && (this._$Ep = t7);
    }
    createRenderRoot() {
      const t7 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S(t7, this.constructor.elementStyles), t7;
    }
    connectedCallback() {
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t7) => t7.hostConnected?.());
    }
    enableUpdating(t7) {
    }
    disconnectedCallback() {
      this._$EO?.forEach((t7) => t7.hostDisconnected?.());
    }
    attributeChangedCallback(t7, s11, i8) {
      this._$AK(t7, i8);
    }
    _$ET(t7, s11) {
      const i8 = this.constructor.elementProperties.get(t7), e9 = this.constructor._$Eu(t7, i8);
      if (e9 !== void 0 && i8.reflect === true) {
        const h6 = (i8.converter?.toAttribute !== void 0 ? i8.converter : u).toAttribute(s11, i8.type);
        this._$Em = t7, h6 == null ? this.removeAttribute(e9) : this.setAttribute(e9, h6), this._$Em = null;
      }
    }
    _$AK(t7, s11) {
      const i8 = this.constructor, e9 = i8._$Eh.get(t7);
      if (e9 !== void 0 && this._$Em !== e9) {
        const t8 = i8.getPropertyOptions(e9), h6 = typeof t8.converter == "function" ? {fromAttribute: t8.converter} : t8.converter?.fromAttribute !== void 0 ? t8.converter : u;
        this._$Em = e9;
        const r10 = h6.fromAttribute(s11, t8.type);
        this[e9] = r10 ?? this._$Ej?.get(e9) ?? r10, this._$Em = null;
      }
    }
    requestUpdate(t7, s11, i8) {
      if (t7 !== void 0) {
        const e9 = this.constructor, h6 = this[t7];
        if (i8 ?? (i8 = e9.getPropertyOptions(t7)), !((i8.hasChanged ?? f)(h6, s11) || i8.useDefault && i8.reflect && h6 === this._$Ej?.get(t7) && !this.hasAttribute(e9._$Eu(t7, i8))))
          return;
        this.C(t7, s11, i8);
      }
      this.isUpdatePending === false && (this._$ES = this._$EP());
    }
    C(t7, s11, {useDefault: i8, reflect: e9, wrapped: h6}, r10) {
      i8 && !(this._$Ej ?? (this._$Ej = new Map())).has(t7) && (this._$Ej.set(t7, r10 ?? s11 ?? this[t7]), h6 !== true || r10 !== void 0) || (this._$AL.has(t7) || (this.hasUpdated || i8 || (s11 = void 0), this._$AL.set(t7, s11)), e9 === true && this._$Em !== t7 && (this._$Eq ?? (this._$Eq = new Set())).add(t7));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t8) {
        Promise.reject(t8);
      }
      const t7 = this.scheduleUpdate();
      return t7 != null && await t7, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      if (!this.isUpdatePending)
        return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t9, s12] of this._$Ep)
            this[t9] = s12;
          this._$Ep = void 0;
        }
        const t8 = this.constructor.elementProperties;
        if (t8.size > 0)
          for (const [s12, i8] of t8) {
            const {wrapped: t9} = i8, e9 = this[s12];
            t9 !== true || this._$AL.has(s12) || e9 === void 0 || this.C(s12, void 0, i8, e9);
          }
      }
      let t7 = false;
      const s11 = this._$AL;
      try {
        t7 = this.shouldUpdate(s11), t7 ? (this.willUpdate(s11), this._$EO?.forEach((t8) => t8.hostUpdate?.()), this.update(s11)) : this._$EM();
      } catch (s12) {
        throw t7 = false, this._$EM(), s12;
      }
      t7 && this._$AE(s11);
    }
    willUpdate(t7) {
    }
    _$AE(t7) {
      this._$EO?.forEach((t8) => t8.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t7)), this.updated(t7);
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
    shouldUpdate(t7) {
      return true;
    }
    update(t7) {
      this._$Eq && (this._$Eq = this._$Eq.forEach((t8) => this._$ET(t8, this[t8]))), this._$EM();
    }
    updated(t7) {
    }
    firstUpdated(t7) {
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
  var s2 = i3 ? i3.createPolicy("lit-html", {createHTML: (t7) => t7}) : void 0;
  var e3 = "$lit$";
  var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
  var o3 = "?" + h2;
  var n3 = `<${o3}>`;
  var r3 = document;
  var l2 = () => r3.createComment("");
  var c3 = (t7) => t7 === null || typeof t7 != "object" && typeof t7 != "function";
  var a2 = Array.isArray;
  var u2 = (t7) => a2(t7) || typeof t7?.[Symbol.iterator] == "function";
  var d2 = "[ 	\n\f\r]";
  var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
  var v = /-->/g;
  var _ = />/g;
  var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
  var p2 = /'/g;
  var g = /"/g;
  var $ = /^(?:script|style|textarea|title)$/i;
  var y2 = (t7) => (i8, ...s11) => ({_$litType$: t7, strings: i8, values: s11});
  var x = y2(1);
  var b2 = y2(2);
  var w = y2(3);
  var T = Symbol.for("lit-noChange");
  var E = Symbol.for("lit-nothing");
  var A = new WeakMap();
  var C = r3.createTreeWalker(r3, 129);
  function P(t7, i8) {
    if (!a2(t7) || !t7.hasOwnProperty("raw"))
      throw Error("invalid template strings array");
    return s2 !== void 0 ? s2.createHTML(i8) : i8;
  }
  var V = (t7, i8) => {
    const s11 = t7.length - 1, o12 = [];
    let r10, l6 = i8 === 2 ? "<svg>" : i8 === 3 ? "<math>" : "", c8 = f2;
    for (let i9 = 0; i9 < s11; i9++) {
      const s12 = t7[i9];
      let a4, u6, d3 = -1, y3 = 0;
      for (; y3 < s12.length && (c8.lastIndex = y3, u6 = c8.exec(s12), u6 !== null); )
        y3 = c8.lastIndex, c8 === f2 ? u6[1] === "!--" ? c8 = v : u6[1] !== void 0 ? c8 = _ : u6[2] !== void 0 ? ($.test(u6[2]) && (r10 = RegExp("</" + u6[2], "g")), c8 = m) : u6[3] !== void 0 && (c8 = m) : c8 === m ? u6[0] === ">" ? (c8 = r10 ?? f2, d3 = -1) : u6[1] === void 0 ? d3 = -2 : (d3 = c8.lastIndex - u6[2].length, a4 = u6[1], c8 = u6[3] === void 0 ? m : u6[3] === '"' ? g : p2) : c8 === g || c8 === p2 ? c8 = m : c8 === v || c8 === _ ? c8 = f2 : (c8 = m, r10 = void 0);
      const x2 = c8 === m && t7[i9 + 1].startsWith("/>") ? " " : "";
      l6 += c8 === f2 ? s12 + n3 : d3 >= 0 ? (o12.push(a4), s12.slice(0, d3) + e3 + s12.slice(d3) + h2 + x2) : s12 + h2 + (d3 === -2 ? i9 : x2);
    }
    return [P(t7, l6 + (t7[s11] || "<?>") + (i8 === 2 ? "</svg>" : i8 === 3 ? "</math>" : "")), o12];
  };
  var N = class {
    constructor({strings: t7, _$litType$: s11}, n11) {
      let r10;
      this.parts = [];
      let c8 = 0, a4 = 0;
      const u6 = t7.length - 1, d3 = this.parts, [f5, v3] = V(t7, s11);
      if (this.el = N.createElement(f5, n11), C.currentNode = this.el.content, s11 === 2 || s11 === 3) {
        const t8 = this.el.content.firstChild;
        t8.replaceWith(...t8.childNodes);
      }
      for (; (r10 = C.nextNode()) !== null && d3.length < u6; ) {
        if (r10.nodeType === 1) {
          if (r10.hasAttributes())
            for (const t8 of r10.getAttributeNames())
              if (t8.endsWith(e3)) {
                const i8 = v3[a4++], s12 = r10.getAttribute(t8).split(h2), e9 = /([.?@])?(.*)/.exec(i8);
                d3.push({type: 1, index: c8, name: e9[2], strings: s12, ctor: e9[1] === "." ? H : e9[1] === "?" ? I : e9[1] === "@" ? L : k}), r10.removeAttribute(t8);
              } else
                t8.startsWith(h2) && (d3.push({type: 6, index: c8}), r10.removeAttribute(t8));
          if ($.test(r10.tagName)) {
            const t8 = r10.textContent.split(h2), s12 = t8.length - 1;
            if (s12 > 0) {
              r10.textContent = i3 ? i3.emptyScript : "";
              for (let i8 = 0; i8 < s12; i8++)
                r10.append(t8[i8], l2()), C.nextNode(), d3.push({type: 2, index: ++c8});
              r10.append(t8[s12], l2());
            }
          }
        } else if (r10.nodeType === 8)
          if (r10.data === o3)
            d3.push({type: 2, index: c8});
          else {
            let t8 = -1;
            for (; (t8 = r10.data.indexOf(h2, t8 + 1)) !== -1; )
              d3.push({type: 7, index: c8}), t8 += h2.length - 1;
          }
        c8++;
      }
    }
    static createElement(t7, i8) {
      const s11 = r3.createElement("template");
      return s11.innerHTML = t7, s11;
    }
  };
  function S2(t7, i8, s11 = t7, e9) {
    if (i8 === T)
      return i8;
    let h6 = e9 !== void 0 ? s11._$Co?.[e9] : s11._$Cl;
    const o12 = c3(i8) ? void 0 : i8._$litDirective$;
    return h6?.constructor !== o12 && (h6?._$AO?.(false), o12 === void 0 ? h6 = void 0 : (h6 = new o12(t7), h6._$AT(t7, s11, e9)), e9 !== void 0 ? (s11._$Co ?? (s11._$Co = []))[e9] = h6 : s11._$Cl = h6), h6 !== void 0 && (i8 = S2(t7, h6._$AS(t7, i8.values), h6, e9)), i8;
  }
  var M = class {
    constructor(t7, i8) {
      this._$AV = [], this._$AN = void 0, this._$AD = t7, this._$AM = i8;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t7) {
      const {el: {content: i8}, parts: s11} = this._$AD, e9 = (t7?.creationScope ?? r3).importNode(i8, true);
      C.currentNode = e9;
      let h6 = C.nextNode(), o12 = 0, n11 = 0, l6 = s11[0];
      for (; l6 !== void 0; ) {
        if (o12 === l6.index) {
          let i9;
          l6.type === 2 ? i9 = new R(h6, h6.nextSibling, this, t7) : l6.type === 1 ? i9 = new l6.ctor(h6, l6.name, l6.strings, this, t7) : l6.type === 6 && (i9 = new z(h6, this, t7)), this._$AV.push(i9), l6 = s11[++n11];
        }
        o12 !== l6?.index && (h6 = C.nextNode(), o12++);
      }
      return C.currentNode = r3, e9;
    }
    p(t7) {
      let i8 = 0;
      for (const s11 of this._$AV)
        s11 !== void 0 && (s11.strings !== void 0 ? (s11._$AI(t7, s11, i8), i8 += s11.strings.length - 2) : s11._$AI(t7[i8])), i8++;
    }
  };
  var R = class {
    get _$AU() {
      return this._$AM?._$AU ?? this._$Cv;
    }
    constructor(t7, i8, s11, e9) {
      this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t7, this._$AB = i8, this._$AM = s11, this.options = e9, this._$Cv = e9?.isConnected ?? true;
    }
    get parentNode() {
      let t7 = this._$AA.parentNode;
      const i8 = this._$AM;
      return i8 !== void 0 && t7?.nodeType === 11 && (t7 = i8.parentNode), t7;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t7, i8 = this) {
      t7 = S2(this, t7, i8), c3(t7) ? t7 === E || t7 == null || t7 === "" ? (this._$AH !== E && this._$AR(), this._$AH = E) : t7 !== this._$AH && t7 !== T && this._(t7) : t7._$litType$ !== void 0 ? this.$(t7) : t7.nodeType !== void 0 ? this.T(t7) : u2(t7) ? this.k(t7) : this._(t7);
    }
    O(t7) {
      return this._$AA.parentNode.insertBefore(t7, this._$AB);
    }
    T(t7) {
      this._$AH !== t7 && (this._$AR(), this._$AH = this.O(t7));
    }
    _(t7) {
      this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t7 : this.T(r3.createTextNode(t7)), this._$AH = t7;
    }
    $(t7) {
      const {values: i8, _$litType$: s11} = t7, e9 = typeof s11 == "number" ? this._$AC(t7) : (s11.el === void 0 && (s11.el = N.createElement(P(s11.h, s11.h[0]), this.options)), s11);
      if (this._$AH?._$AD === e9)
        this._$AH.p(i8);
      else {
        const t8 = new M(e9, this), s12 = t8.u(this.options);
        t8.p(i8), this.T(s12), this._$AH = t8;
      }
    }
    _$AC(t7) {
      let i8 = A.get(t7.strings);
      return i8 === void 0 && A.set(t7.strings, i8 = new N(t7)), i8;
    }
    k(t7) {
      a2(this._$AH) || (this._$AH = [], this._$AR());
      const i8 = this._$AH;
      let s11, e9 = 0;
      for (const h6 of t7)
        e9 === i8.length ? i8.push(s11 = new R(this.O(l2()), this.O(l2()), this, this.options)) : s11 = i8[e9], s11._$AI(h6), e9++;
      e9 < i8.length && (this._$AR(s11 && s11._$AB.nextSibling, e9), i8.length = e9);
    }
    _$AR(t7 = this._$AA.nextSibling, i8) {
      for (this._$AP?.(false, true, i8); t7 !== this._$AB; ) {
        const i9 = t7.nextSibling;
        t7.remove(), t7 = i9;
      }
    }
    setConnected(t7) {
      this._$AM === void 0 && (this._$Cv = t7, this._$AP?.(t7));
    }
  };
  var k = class {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t7, i8, s11, e9, h6) {
      this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t7, this.name = i8, this._$AM = e9, this.options = h6, s11.length > 2 || s11[0] !== "" || s11[1] !== "" ? (this._$AH = Array(s11.length - 1).fill(new String()), this.strings = s11) : this._$AH = E;
    }
    _$AI(t7, i8 = this, s11, e9) {
      const h6 = this.strings;
      let o12 = false;
      if (h6 === void 0)
        t7 = S2(this, t7, i8, 0), o12 = !c3(t7) || t7 !== this._$AH && t7 !== T, o12 && (this._$AH = t7);
      else {
        const e10 = t7;
        let n11, r10;
        for (t7 = h6[0], n11 = 0; n11 < h6.length - 1; n11++)
          r10 = S2(this, e10[s11 + n11], i8, n11), r10 === T && (r10 = this._$AH[n11]), o12 || (o12 = !c3(r10) || r10 !== this._$AH[n11]), r10 === E ? t7 = E : t7 !== E && (t7 += (r10 ?? "") + h6[n11 + 1]), this._$AH[n11] = r10;
      }
      o12 && !e9 && this.j(t7);
    }
    j(t7) {
      t7 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t7 ?? "");
    }
  };
  var H = class extends k {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t7) {
      this.element[this.name] = t7 === E ? void 0 : t7;
    }
  };
  var I = class extends k {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t7) {
      this.element.toggleAttribute(this.name, !!t7 && t7 !== E);
    }
  };
  var L = class extends k {
    constructor(t7, i8, s11, e9, h6) {
      super(t7, i8, s11, e9, h6), this.type = 5;
    }
    _$AI(t7, i8 = this) {
      if ((t7 = S2(this, t7, i8, 0) ?? E) === T)
        return;
      const s11 = this._$AH, e9 = t7 === E && s11 !== E || t7.capture !== s11.capture || t7.once !== s11.once || t7.passive !== s11.passive, h6 = t7 !== E && (s11 === E || e9);
      e9 && this.element.removeEventListener(this.name, this, s11), h6 && this.element.addEventListener(this.name, this, t7), this._$AH = t7;
    }
    handleEvent(t7) {
      typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t7) : this._$AH.handleEvent(t7);
    }
  };
  var z = class {
    constructor(t7, i8, s11) {
      this.element = t7, this.type = 6, this._$AN = void 0, this._$AM = i8, this.options = s11;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t7) {
      S2(this, t7);
    }
  };
  var Z = {M: e3, P: h2, A: o3, C: 1, L: V, R: M, D: u2, V: S2, I: R, H: k, N: I, U: L, B: H, F: z};
  var j = t2.litHtmlPolyfillSupport;
  j?.(N, R), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.3.1");
  var B = (t7, i8, s11) => {
    const e9 = s11?.renderBefore ?? i8;
    let h6 = e9._$litPart$;
    if (h6 === void 0) {
      const t8 = s11?.renderBefore ?? null;
      e9._$litPart$ = h6 = new R(i8.insertBefore(l2(), t8), t8, void 0, s11 ?? {});
    }
    return h6._$AI(t7), h6;
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
      const t7 = super.createRenderRoot();
      return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t7.firstChild), t7;
    }
    update(t7) {
      const r10 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t7), this._$Do = B(r10, this.renderRoot, this.renderOptions);
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
  var t3 = (t7) => (e9, o12) => {
    o12 !== void 0 ? o12.addInitializer(() => {
      customElements.define(t7, e9);
    }) : customElements.define(t7, e9);
  };

  // node_modules/@lit/reactive-element/decorators/property.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var o5 = {attribute: true, type: String, converter: u, reflect: false, hasChanged: f};
  var r4 = (t7 = o5, e9, r10) => {
    const {kind: n11, metadata: i8} = r10;
    let s11 = globalThis.litPropertyMetadata.get(i8);
    if (s11 === void 0 && globalThis.litPropertyMetadata.set(i8, s11 = new Map()), n11 === "setter" && ((t7 = Object.create(t7)).wrapped = true), s11.set(r10.name, t7), n11 === "accessor") {
      const {name: o12} = r10;
      return {set(r11) {
        const n12 = e9.get.call(this);
        e9.set.call(this, r11), this.requestUpdate(o12, n12, t7);
      }, init(e10) {
        return e10 !== void 0 && this.C(o12, void 0, t7, e10), e10;
      }};
    }
    if (n11 === "setter") {
      const {name: o12} = r10;
      return function(r11) {
        const n12 = this[o12];
        e9.call(this, r11), this.requestUpdate(o12, n12, t7);
      };
    }
    throw Error("Unsupported decorator location: " + n11);
  };
  function n4(t7) {
    return (e9, o12) => typeof o12 == "object" ? r4(t7, e9, o12) : ((t8, e10, o13) => {
      const r10 = e10.hasOwnProperty(o13);
      return e10.constructor.createProperty(o13, t8), r10 ? Object.getOwnPropertyDescriptor(e10, o13) : void 0;
    })(t7, e9, o12);
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
  var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, {enumerable: true, configurable: true, writable: true, value}) : obj[key] = value;
  var __publicField2 = (obj, key, value) => {
    __defNormalProp2(obj, typeof key !== "symbol" ? key + "" : key, value);
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
  function defaultEquals(a4, b3) {
    return Object.is(a4, b3);
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
      for (let i8 = node.nextProducerIndex; i8 < node.producerNode.length; i8++) {
        producerRemoveLiveConsumerAtIndex(node.producerNode[i8], node.producerIndexOfThis[i8]);
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
    for (let i8 = 0; i8 < node.producerNode.length; i8++) {
      const producer = node.producerNode[i8];
      const seenVersion = node.producerLastReadVersion[i8];
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
      for (let i8 = 0; i8 < node.producerNode.length; i8++) {
        node.producerIndexOfThis[i8] = producerAddLiveConsumer(node.producerNode[i8], node, i8);
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
      for (let i8 = 0; i8 < node.producerNode.length; i8++) {
        producerRemoveLiveConsumerAtIndex(node.producerNode[i8], node.producerIndexOfThis[i8]);
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
        __publicField2(this, _a);
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
        __publicField2(this, _b);
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
    Signal22.isComputed = (c8) => typeof c8 === "object" && __privateIn(_brand2, c8);
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
        return ((_a3 = sink[NODE].producerNode) == null ? void 0 : _a3.map((n11) => n11.wrapper)) ?? [];
      }
      subtle2.introspectSources = introspectSources;
      function introspectSinks(signal) {
        var _a3;
        if (!(0, Signal22.isComputed)(signal) && !(0, Signal22.isState)(signal)) {
          throw new TypeError("Called introspectSinks without a Signal argument");
        }
        return ((_a3 = signal[NODE].liveConsumerNode) == null ? void 0 : _a3.map((n11) => n11.wrapper)) ?? [];
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
          __publicField2(this, _a2);
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
          for (let i8 = node.producerNode.length - 1; i8 >= 0; i8--) {
            if (signals.includes(node.producerNode[i8].wrapper)) {
              producerRemoveLiveConsumerAtIndex(node.producerNode[i8], node.producerIndexOfThis[i8]);
              const lastIdx = node.producerNode.length - 1;
              node.producerNode[i8] = node.producerNode[lastIdx];
              node.producerIndexOfThis[i8] = node.producerIndexOfThis[lastIdx];
              node.producerNode.length--;
              node.producerIndexOfThis.length--;
              node.nextProducerIndex--;
              if (i8 < node.producerNode.length) {
                const idxConsumer = node.producerIndexOfThis[i8];
                const producer = node.producerNode[i8];
                assertProducerNode(producer);
                producer.liveConsumerIndexOfThis[idxConsumer] = i8;
              }
            }
          }
        }
        getPending() {
          if (!(0, Signal22.isWatcher)(this)) {
            throw new TypeError("Called getPending without Watcher receiver");
          }
          const node = this[NODE];
          return node.producerNode.filter((n11) => n11.dirty).map((n11) => n11.wrapper);
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
      Signal22.isWatcher = (w2) => __privateIn(_brand3, w2);
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
      for (const t7 of s4.getPending())
        t7.get();
      s4.watch();
    }));
  });
  var h3 = Symbol("SignalWatcherBrand");
  var e5 = new FinalizationRegistry((i8) => {
    i8.unwatch(...Signal.subtle.introspectSources(i8));
  });
  var n5 = new WeakMap();

  // node_modules/lit-html/directive.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var t4 = {ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6};
  var e6 = (t7) => (...e9) => ({_$litDirective$: t7, values: e9});
  var i6 = class {
    constructor(t7) {
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AT(t7, e9, i8) {
      this._$Ct = t7, this._$AM = e9, this._$Ci = i8;
    }
    _$AS(t7, e9) {
      return this.update(t7, e9);
    }
    update(t7, e9) {
      return this.render(...e9);
    }
  };

  // node_modules/lit-html/directive-helpers.js
  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var {I: t5} = Z;
  var f3 = (o12) => o12.strings === void 0;
  var r5 = () => document.createComment("");
  var s5 = (o12, i8, n11) => {
    const e9 = o12._$AA.parentNode, l6 = i8 === void 0 ? o12._$AB : i8._$AA;
    if (n11 === void 0) {
      const i9 = e9.insertBefore(r5(), l6), d3 = e9.insertBefore(r5(), l6);
      n11 = new t5(i9, d3, o12, o12.options);
    } else {
      const t7 = n11._$AB.nextSibling, i9 = n11._$AM, d3 = i9 !== o12;
      if (d3) {
        let t8;
        n11._$AQ?.(o12), n11._$AM = o12, n11._$AP !== void 0 && (t8 = o12._$AU) !== i9._$AU && n11._$AP(t8);
      }
      if (t7 !== l6 || d3) {
        let o13 = n11._$AA;
        for (; o13 !== t7; ) {
          const t8 = o13.nextSibling;
          e9.insertBefore(o13, l6), o13 = t8;
        }
      }
    }
    return n11;
  };
  var v2 = (o12, t7, i8 = o12) => (o12._$AI(t7, i8), o12);
  var u3 = {};
  var m2 = (o12, t7 = u3) => o12._$AH = t7;
  var p3 = (o12) => o12._$AH;
  var M2 = (o12) => {
    o12._$AR(), o12._$AA.remove();
  };

  // node_modules/lit-html/async-directive.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s6 = (i8, t7) => {
    const e9 = i8._$AN;
    if (e9 === void 0)
      return false;
    for (const i9 of e9)
      i9._$AO?.(t7, false), s6(i9, t7);
    return true;
  };
  var o6 = (i8) => {
    let t7, e9;
    do {
      if ((t7 = i8._$AM) === void 0)
        break;
      e9 = t7._$AN, e9.delete(i8), i8 = t7;
    } while (e9?.size === 0);
  };
  var r6 = (i8) => {
    for (let t7; t7 = i8._$AM; i8 = t7) {
      let e9 = t7._$AN;
      if (e9 === void 0)
        t7._$AN = e9 = new Set();
      else if (e9.has(i8))
        break;
      e9.add(i8), c4(t7);
    }
  };
  function h4(i8) {
    this._$AN !== void 0 ? (o6(this), this._$AM = i8, r6(this)) : this._$AM = i8;
  }
  function n6(i8, t7 = false, e9 = 0) {
    const r10 = this._$AH, h6 = this._$AN;
    if (h6 !== void 0 && h6.size !== 0)
      if (t7)
        if (Array.isArray(r10))
          for (let i9 = e9; i9 < r10.length; i9++)
            s6(r10[i9], false), o6(r10[i9]);
        else
          r10 != null && (s6(r10, false), o6(r10));
      else
        s6(this, i8);
  }
  var c4 = (i8) => {
    i8.type == t4.CHILD && (i8._$AP ?? (i8._$AP = n6), i8._$AQ ?? (i8._$AQ = h4));
  };
  var f4 = class extends i6 {
    constructor() {
      super(...arguments), this._$AN = void 0;
    }
    _$AT(i8, t7, e9) {
      super._$AT(i8, t7, e9), r6(this), this.isConnected = i8._$AU;
    }
    _$AO(i8, t7 = true) {
      i8 !== this.isConnected && (this.isConnected = i8, i8 ? this.reconnected?.() : this.disconnected?.()), t7 && (s6(this, i8), o6(this));
    }
    setValue(t7) {
      if (f3(this._$Ct))
        this._$Ct._$AI(t7, this);
      else {
        const i8 = [...this._$Ct._$AH];
        i8[this._$Ci] = t7, this._$Ct._$AI(i8, this, 0);
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
      for (const i8 of n7.getPending())
        i8.get();
      n7.watch();
    }));
  });
  var r7 = class extends f4 {
    _$S_() {
      var i8, t7;
      this._$Sm === void 0 && (this._$Sj = new Signal.Computed(() => {
        var i9;
        const t8 = (i9 = this._$SW) === null || i9 === void 0 ? void 0 : i9.get();
        return this.setValue(t8), t8;
      }), this._$Sm = (t7 = (i8 = this._$Sk) === null || i8 === void 0 ? void 0 : i8.h) !== null && t7 !== void 0 ? t7 : n7, this._$Sm.watch(this._$Sj), Signal.subtle.untrack(() => {
        var i9;
        return (i9 = this._$Sj) === null || i9 === void 0 ? void 0 : i9.get();
      }));
    }
    _$Sp() {
      this._$Sm !== void 0 && (this._$Sm.unwatch(this._$SW), this._$Sm = void 0);
    }
    render(i8) {
      return Signal.subtle.untrack(() => i8.get());
    }
    update(i8, [t7]) {
      var o12, n11;
      return (o12 = this._$Sk) !== null && o12 !== void 0 || (this._$Sk = (n11 = i8.options) === null || n11 === void 0 ? void 0 : n11.host), t7 !== this._$SW && this._$SW !== void 0 && this._$Sp(), this._$SW = t7, this._$S_(), Signal.subtle.untrack(() => this._$SW.get());
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
  var m3 = (o12) => (t7, ...m4) => o12(t7, ...m4.map((o13) => o13 instanceof Signal.State || o13 instanceof Signal.Computed ? h5(o13) : o13));
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
  var r9 = (l6, o12) => new Signal.State(l6, o12);

  // src/services/RouterService.ts
  var Routes = {
    0: {vanityName: "Home", iconPath: "/public/home.svg", pageSelector: "ly-home", show: true},
    1: {vanityName: "Plattegrond", iconPath: "/public/layout.svg", pageSelector: "ly-layout", show: true},
    2: {vanityName: "Apparaten", iconPath: "/public/devices.svg", pageSelector: "ly-devices", show: true},
    3: {vanityName: "Sensoren", iconPath: "/public/sensors.svg", pageSelector: "ly-sensors", show: true},
    4: {vanityName: "Weersvoorspelling", iconPath: "/public/weather.svg", pageSelector: "ly-predictions", show: true},
    5: {vanityName: "Account", iconPath: "/public/account.svg", pageSelector: "ly-account", show: true},
    6: {vanityName: "Auth", iconPath: "/public/account.svg", pageSelector: "ly-auth", show: false}
  };
  var _Router = class {
    constructor() {
      __publicField(this, "state", r9(0));
    }
    route(route) {
      this.state.set(route);
      try {
        window.dispatchEvent(new CustomEvent("route-changed", {detail: route}));
      } catch (e9) {
        console.warn("Could not dispatch route-changed event", e9);
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
      __publicField(this, "title");
      __publicField(this, "type");
      __publicField(this, "icon");
      __publicField(this, "entry");
      this.title = "Entry";
      this.entry = 0;
      this.type = 0;
      this.icon = "";
    }
    _handleClick(e9) {
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
      __publicField(this, "margined");
      __publicField(this, "size");
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
      __publicField(this, "text");
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
            padding: 15px;
        }
    </style>    
`;
  var Surface = class extends i4 {
    constructor() {
      super();
      __publicField(this, "width");
      __publicField(this, "height");
      __publicField(this, "text");
      this.text = "Continue";
      this.width = "300px";
      this.height = "300px";
    }
    render() {
      return x`
            ${base_style4}
            <style>
                :host {
                    width: ${this.width};
                    height: ${this.height};
                }
            </style>
            <p style="margin: 0px;">${this.text}</p>
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
    n4()
  ], Surface.prototype, "text", 2);
  Surface = __decorate([
    t3("gl-surface")
  ], Surface);

  // src/components/forms/Button.ts
  var base_style5 = x`
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
      __publicField(this, "type");
      __publicField(this, "icon");
      __publicField(this, "callback");
      this.type = red;
      this.icon = "";
      this.callback = () => {
      };
    }
    _handleClick(e9) {
      this.callback();
    }
    render() {
      let icon;
      if (this.icon !== "") {
        icon = x`<img src=${this.icon} style="margin-right: 5px; color: white;" height="17px;" />`;
      }
      return x`
            ${base_style5}
            ${this.type}
            <button class="inner" @click=${(e9) => this._handleClick(e9)}>
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
  function n8(n11, r10, t7) {
    return n11 ? r10(n11) : t7?.(n11);
  }

  // node_modules/lit-html/directives/repeat.js
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var u4 = (e9, s11, t7) => {
    const r10 = new Map();
    for (let l6 = s11; l6 <= t7; l6++)
      r10.set(e9[l6], l6);
    return r10;
  };
  var c5 = e6(class extends i6 {
    constructor(e9) {
      if (super(e9), e9.type !== t4.CHILD)
        throw Error("repeat() can only be used in text expressions");
    }
    dt(e9, s11, t7) {
      let r10;
      t7 === void 0 ? t7 = s11 : s11 !== void 0 && (r10 = s11);
      const l6 = [], o12 = [];
      let i8 = 0;
      for (const s12 of e9)
        l6[i8] = r10 ? r10(s12, i8) : i8, o12[i8] = t7(s12, i8), i8++;
      return {values: o12, keys: l6};
    }
    render(e9, s11, t7) {
      return this.dt(e9, s11, t7).values;
    }
    update(s11, [t7, r10, c8]) {
      const d3 = p3(s11), {values: p4, keys: a4} = this.dt(t7, r10, c8);
      if (!Array.isArray(d3))
        return this.ut = a4, p4;
      const h6 = this.ut ?? (this.ut = []), v3 = [];
      let m4, y3, x2 = 0, j2 = d3.length - 1, k2 = 0, w2 = p4.length - 1;
      for (; x2 <= j2 && k2 <= w2; )
        if (d3[x2] === null)
          x2++;
        else if (d3[j2] === null)
          j2--;
        else if (h6[x2] === a4[k2])
          v3[k2] = v2(d3[x2], p4[k2]), x2++, k2++;
        else if (h6[j2] === a4[w2])
          v3[w2] = v2(d3[j2], p4[w2]), j2--, w2--;
        else if (h6[x2] === a4[w2])
          v3[w2] = v2(d3[x2], p4[w2]), s5(s11, v3[w2 + 1], d3[x2]), x2++, w2--;
        else if (h6[j2] === a4[k2])
          v3[k2] = v2(d3[j2], p4[k2]), s5(s11, d3[x2], d3[j2]), j2--, k2++;
        else if (m4 === void 0 && (m4 = u4(a4, k2, w2), y3 = u4(h6, x2, j2)), m4.has(h6[x2]))
          if (m4.has(h6[j2])) {
            const e9 = y3.get(a4[k2]), t8 = e9 !== void 0 ? d3[e9] : null;
            if (t8 === null) {
              const e10 = s5(s11, d3[x2]);
              v2(e10, p4[k2]), v3[k2] = e10;
            } else
              v3[k2] = v2(t8, p4[k2]), s5(s11, d3[x2], t8), d3[e9] = null;
            k2++;
          } else
            M2(d3[j2]), j2--;
        else
          M2(d3[x2]), x2++;
      for (; k2 <= w2; ) {
        const e9 = s5(s11, v3[w2 + 1]);
        v2(e9, p4[k2]), v3[k2++] = e9;
      }
      for (; x2 <= j2; ) {
        const e9 = d3[x2++];
        e9 !== null && M2(e9);
      }
      return this.ut = a4, m2(s11, v3), T;
    }
  });

  // src/components/general/Popup.ts
  var PopupSurface = class extends i4 {
    constructor() {
      super();
      __publicField(this, "shape");
      this.shape = {width: "500px"};
      this.style.setProperty("--width", this.shape.width || "");
    }
    updated(changed) {
      console.log(changed);
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
                            ${c5(this.shape.button_bar ?? [], (item) => item.title, (item, index) => {
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
                                        <md-button .type=${button_type} .callback=${item.callback} icon=${item.icon}>${item.title}</md-button>
                                    `;
      })}
                        </div>
                    `)}
            </split-layout>
        `;
    }
  };
  __publicField(PopupSurface, "styles", i`
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
    `);
  __decorate([
    n4({type: Object})
  ], PopupSurface.prototype, "shape", 2);
  PopupSurface = __decorate([
    t3("gl-popup-surface")
  ], PopupSurface);

  // node_modules/lit-html/directives/if-defined.js
  /**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var o10 = (o12) => o12 ?? E;

  // node_modules/lit-html/static.js
  /**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var a3 = Symbol.for("");
  var o11 = (t7) => {
    if (t7?.r === a3)
      return t7?._$litStatic$;
  };
  var s7 = (t7) => ({_$litStatic$: t7, r: a3});
  var l5 = new Map();
  var n9 = (t7) => (r10, ...e9) => {
    const a4 = e9.length;
    let s11, i8;
    const n11 = [], u6 = [];
    let c8, $3 = 0, f5 = false;
    for (; $3 < a4; ) {
      for (c8 = r10[$3]; $3 < a4 && (i8 = e9[$3], s11 = o11(i8)) !== void 0; )
        c8 += s11 + r10[++$3], f5 = true;
      $3 !== a4 && u6.push(i8), n11.push(c8), $3++;
    }
    if ($3 === a4 && n11.push(r10[a4]), f5) {
      const t8 = n11.join("$$lit$$");
      (r10 = l5.get(t8)) === void 0 && (n11.raw = n11, l5.set(t8, r10 = n11)), e9 = u6;
    }
    return t7(r10, ...e9);
  };
  var u5 = n9(x);
  var c6 = n9(b2);
  var $2 = n9(w);

  // src/components/general/Notification.ts
  var base_style6 = u5`
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
        :host {
            border: solid 1px #c30000;
            background: #ffefef;
        }
        :host(:hover) {
            border: solid 1px #a70000;
            background-color: #ffe4e4;
        }
    </style>
`;
  var yellow2 = u5`
    <style>
        :host {
            border: solid 1px #cdbf00;
            background: #feffef;
        }
        :host(:hover) {
            border: solid 1px #cdbf00;
            background-color: #feffe4;
        }
    </style>
`;
  var PopupSurface2 = class extends i4 {
    constructor() {
      super();
      __publicField(this, "width");
      __publicField(this, "height");
      __publicField(this, "shape");
      this.width = "250px";
      this.height = "100px";
      this.shape = {style: "red", title: "New Message", description: "DescriptionDescriptionDescription DescriptionDescriptionDescription"};
    }
    render() {
      return u5`
            ${base_style6}
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
  var base_style7 = x`
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
      __publicField(this, "text");
      __publicField(this, "password");
      __publicField(this, "callback");
      this.text = "Continue";
      this.password = false;
      this.callback = () => {
      };
    }
    render() {
      const type = this.password === true ? "password" : "text";
      return x`
            ${base_style7}
            <input type="${type}" @input=${(e9) => this.callback(e9)}></input>
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

  // src/layouts/Split.ts
  var SplitLayout = class extends i4 {
    constructor() {
      super();
      __publicField(this, "orientation", "horizontal");
      __publicField(this, "startSize");
      __publicField(this, "endSize");
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
  __publicField(SplitLayout, "styles", i`
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
    `);
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
    constructor(s11, t7, e9, o12) {
      super("context-request", {bubbles: true, composed: true}), this.context = s11, this.contextTarget = t7, this.callback = e9, this.subscribe = o12 ?? false;
    }
  };

  // node_modules/@lit/context/lib/create-context.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function n10(n11) {
    return n11;
  }

  // node_modules/@lit/context/lib/controllers/context-consumer.js
  /**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  var s9 = class {
    constructor(t7, s11, i8, h6) {
      if (this.subscribe = false, this.provided = false, this.value = void 0, this.t = (t8, s12) => {
        this.unsubscribe && (this.unsubscribe !== s12 && (this.provided = false, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = t8, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = true, this.callback && this.callback(t8, s12)), this.unsubscribe = s12;
      }, this.host = t7, s11.context !== void 0) {
        const t8 = s11;
        this.context = t8.context, this.callback = t8.callback, this.subscribe = t8.subscribe ?? false;
      } else
        this.context = s11, this.callback = i8, this.subscribe = h6 ?? false;
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
    setValue(s11, t7 = false) {
      const i8 = t7 || !Object.is(s11, this.o);
      this.o = s11, i8 && this.updateObservers();
    }
    constructor(s11) {
      this.subscriptions = new Map(), this.updateObservers = () => {
        for (const [s12, {disposer: t7}] of this.subscriptions)
          s12(this.o, t7);
      }, s11 !== void 0 && (this.value = s11);
    }
    addCallback(s11, t7, i8) {
      if (!i8)
        return void s11(this.value);
      this.subscriptions.has(s11) || this.subscriptions.set(s11, {disposer: () => {
        this.subscriptions.delete(s11);
      }, consumerHost: t7});
      const {disposer: h6} = this.subscriptions.get(s11);
      s11(this.value, h6);
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
    constructor(t7, s11) {
      super("context-provider", {bubbles: true, composed: true}), this.context = t7, this.contextTarget = s11;
    }
  };
  var i7 = class extends s10 {
    constructor(s11, e9, i8) {
      super(e9.context !== void 0 ? e9.initialValue : i8), this.onContextRequest = (t7) => {
        if (t7.context !== this.context)
          return;
        const s12 = t7.contextTarget ?? t7.composedPath()[0];
        s12 !== this.host && (t7.stopPropagation(), this.addCallback(t7.callback, s12, t7.subscribe));
      }, this.onProviderRequest = (s12) => {
        if (s12.context !== this.context)
          return;
        if ((s12.contextTarget ?? s12.composedPath()[0]) === this.host)
          return;
        const e10 = new Set();
        for (const [s13, {consumerHost: i9}] of this.subscriptions)
          e10.has(s13) || (e10.add(s13), i9.dispatchEvent(new s8(this.context, i9, s13, true)));
        s12.stopPropagation();
      }, this.host = s11, e9.context !== void 0 ? this.context = e9.context : this.context = e9, this.attachListeners(), this.host.addController?.(this);
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
  function c7({context: c8, subscribe: e9}) {
    return (o12, n11) => {
      typeof n11 == "object" ? n11.addInitializer(function() {
        new s9(this, {context: c8, callback: (t7) => {
          o12.set.call(this, t7);
        }, subscribe: e9});
      }) : o12.constructor.addInitializer((o13) => {
        new s9(o13, {context: c8, callback: (t7) => {
          o13[n11] = t7;
        }, subscribe: e9});
      });
    };
  }

  // src/services/PopupController.ts
  var PopupController = class {
    constructor(host, timeout = 1e3) {
      __publicField(this, "host");
      __publicField(this, "active_popups");
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

  // src/services/NotificationController.ts
  var NotificationController = class {
    constructor(host, timeout = 1e3) {
      __publicField(this, "host");
      __publicField(this, "ordered_notifications");
      __publicField(this, "notification_ownership");
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
      this.ordered_notifications.push(notification);
      this.notification_ownership.set(firstMissing, notification);
      this.host.requestUpdate();
      new Promise((resolve) => {
        setTimeout(() => {
          this.dismiss(firstMissing);
          console.log(this.notification_ownership);
          console.log(this.ordered_notifications);
        }, 3e3);
      });
      return firstMissing;
    }
    dismiss(ownership_id) {
      console.log("dismissed");
      const notification = this.notification_ownership.get(ownership_id);
      this.ordered_notifications.slice(this.ordered_notifications.findIndex((n11) => n11 === notification));
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
                        <div class="wrapper">
                            ${c5(Object.entries(this.ordered_notifications), ([key, value]) => key, ([key, value]) => {
        return x`
                                        <gl-notification .shape=${value}></gl-notification>
                                    `;
      })}
                        </div>
                    </div>
                        `)}
        `;
    }
  };
  var notificationContext = n10("notificationController");

  // src/pages/Dashboard.ts
  var base_style8 = u5`
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
      __publicField(this, "text");
      __publicField(this, "_onRoute");
      __publicField(this, "popupController", new i7(this, {context: popupContext, initialValue: new PopupController(this, 100)}));
      __publicField(this, "notificationController", new i7(this, {context: notificationContext, initialValue: new NotificationController(this, 100)}));
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
            ${base_style8}
            <split-layout orientation="horizontal" start-size="220px">
                ${n8(route.show === true, () => u5`
                        <div slot="start">
                            <side-bar></side-bar>
                        </div>
                    `)}
                <div slot="middle">
                    <div style="padding: 15px; display: block; flex: 1; min-width: 0; min-height: 0; overflow: hidden; ">
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
  var base_style9 = x`
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
      __publicField(this, "_onRoute");
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
      if (selected2 == 5) {
        account_style = Styles.SELECTED;
      } else {
        entries[selected2].type = Styles.SELECTED;
      }
      const account = document.createElement("menu-entry");
      account.title = Routes[5].vanityName;
      account.icon = Routes[5].iconPath;
      account.entry = Number(5);
      account.type = account_style;
      return x`
            ${base_style9}
            <div class="inner">
                <split-layout orientation="vertical" start-size="50px" end-size="50px">
                    <div slot="start" class="top">SmartHome</div>
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

  // src/services/micro/BaseFlow.ts
  var BaseFlow = class {
  };

  // src/services/micro/LogOut.ts
  var LogOut = class extends BaseFlow {
    constructor(controller) {
      super();
      __publicField(this, "controller");
      __publicField(this, "controller_id");
      __publicField(this, "popup", {
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
            type: "Red"
          },
          {
            icon: "",
            callback: () => this.cancel(),
            title: "Cancel",
            type: "Secondary"
          }
        ]
      });
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
      }
    }
    cancel() {
      if (this.controller_id !== void 0) {
        this.controller.dismiss(this.controller_id);
      }
    }
  };

  // src/pages/views/full_frame/Home.ts
  var base_style10 = x`
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
        }
    </style>    
`;
  var HomeLayout = class extends i4 {
    constructor() {
      super();
      __publicField(this, "PopupController");
      __publicField(this, "NotificationController");
    }
    render() {
      return x`
            ${base_style10}
            <div class="inner">
                <md-title>
                    Home
                </md-title>
                <md-button .type=${Styles2.Primary} .callback=${() => new LogOut(this.PopupController).start()}>
                    Show Popup
                </md-button>
                <md-button .type=${Styles2.Red} .callback=${() => this.NotificationController.notify({description: "Hhello world!", style: "default"})}>
                    Show Notification
                </md-button>
                <md-button .type=${Styles2.Yellow} .callback=${() => {
        Router.route(6);
      }}>
                    To Auth Page
                </md-button>
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
  HomeLayout = __decorate([
    t3("ly-home")
  ], HomeLayout);

  // src/pages/views/full_frame/Account.ts
  var base_style11 = x`
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
  var AccountLayout = class extends i4 {
    constructor() {
      super();
    }
    render() {
      return x`
            ${base_style11}
            <div class="inner">
                <md-title>
                    Account
                </md-title>
            </div>
        `;
    }
  };
  AccountLayout = __decorate([
    t3("ly-account")
  ], AccountLayout);

  // src/pages/views/full_frame/Devices.ts
  var base_style12 = x`
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
  var DeviceLayout = class extends i4 {
    constructor() {
      super();
    }
    render() {
      return x`
            ${base_style12}
            <div class="inner">
                <md-title>
                    Apparaten
                </md-title>
            </div>
        `;
    }
  };
  DeviceLayout = __decorate([
    t3("ly-devices")
  ], DeviceLayout);

  // src/pages/views/full_frame/Layout.ts
  var base_style13 = x`
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
            ${base_style13}
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
  var base_style14 = x`
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
  var PredictionLayout = class extends i4 {
    constructor() {
      super();
    }
    render() {
      return x`
            ${base_style14}
            <div class="inner">
                <md-title>
                    Weersvoorspellingen
                </md-title>
            </div>
        `;
    }
  };
  PredictionLayout = __decorate([
    t3("ly-predictions")
  ], PredictionLayout);

  // src/pages/views/full_frame/Sensors.ts
  var base_style15 = x`
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
            ${base_style15}
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

  // src/pages/views/full_frame/Auth.ts
  var base_style16 = x`
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
    constructor() {
      super();
      __publicField(this, "invalid_state");
      __publicField(this, "current_username_input");
      __publicField(this, "current_password_input");
      __publicField(this, "shape");
      this.invalid_state = false;
      this.button_callback = this.button_callback.bind(this);
      this.user_input_callback = this.user_input_callback.bind(this);
      this.passwd_input_callback = this.passwd_input_callback.bind(this);
      this.current_username_input = "";
      this.current_password_input = "";
      this.shape = {
        width: "700px",
        title: {
          content: "SmartHome Login",
          icon: ""
        },
        button_bar: [
          {
            type: "Primary",
            title: "Log in",
            icon: "",
            callback: this.button_callback
          }
        ]
      };
    }
    button_callback(e9) {
      console.log(this.current_username_input);
      console.log(this.current_password_input);
    }
    user_input_callback(e9) {
      this.current_username_input = e9.target.value;
    }
    passwd_input_callback(e9) {
      this.current_password_input = e9.target.value;
    }
    render() {
      this.shape.body = x`
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
      return x`
            ${base_style16}
            <div class="inner">
                <div class="wrapper">
                    <gl-popup-surface .shape=${this.shape}></gl-popup-surface>               
                </div>
            </div>
        `;
    }
  };
  __decorate([
    n4({type: Boolean})
  ], AuthLayout.prototype, "invalid_state", 2);
  AuthLayout = __decorate([
    t3("ly-auth")
  ], AuthLayout);

  // src/main.ts
  var element = document.createElement("pg-dashboard");
  document.body.appendChild(element);
})();
//# sourceMappingURL=bundle.js.map
