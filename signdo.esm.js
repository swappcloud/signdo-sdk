function e(e = "contain", t = "center") {
	return {
		objectFit: e === "cover" ? "cover" : "contain",
		objectPosition: t === "baseline" ? "center bottom" : t === "top-left" ? "left top" : "center center",
		width: e === "fit-width" ? "100%" : e === "fit-height" ? "auto" : "100%",
		height: e === "fit-height" ? "100%" : e === "fit-width" ? "auto" : "100%"
	};
}
// ../core/src/events.ts
function t(e, t) {
	return t.sequence > e;
}
// src/transport.ts
var n = class {
	options;
	source = null;
	pollTimer = null;
	lastSequence = 0;
	attempt = 0;
	closed = !1;
	constructor(e) {
		this.options = e;
	}
	start() {
		this.closed = !1, this.connect();
	}
	url(e) {
		return `${this.options.apiBase.replace(/\/$/, "")}${e}${e.includes("?") ? "&" : "?"}channelToken=${encodeURIComponent(this.options.channelToken)}`;
	}
	connect() {
		if (!this.closed) try {
			let e = new EventSource(this.url(`/v1/signature-transactions/${this.options.transactionId}/events`));
			this.source = e, e.onopen = () => {
				this.attempt = 0, this.stopPolling();
			}, e.onmessage = (e) => this.handle(e.data);
			for (let t of [
				"transaction.snapshot",
				"transaction.scanned",
				"transaction.signing_started",
				"transaction.signed",
				"transaction.delivered",
				"transaction.confirmed",
				"transaction.expired",
				"transaction.cancelled",
				"transaction.failed"
			]) e.addEventListener(t, (e) => this.handle(e.data));
			e.addEventListener("overloaded", () => {
				e.close(), this.startPolling();
			}), e.onerror = () => {
				if (e.close(), this.source = null, this.closed) return;
				this.startPolling(), this.attempt += 1;
				let t = Math.min(3e4, 500 * 2 ** this.attempt) * (.5 + Math.random() / 2);
				window.setTimeout(() => this.connect(), t);
			};
		} catch (e) {
			this.options.onError?.(e), this.startPolling();
		}
	}
	handle(e) {
		let n;
		try {
			n = JSON.parse(e);
		} catch {
			return;
		}
		t(this.lastSequence, n) && (this.lastSequence = n.sequence, this.options.onEvent(n));
	}
	startPolling() {
		this.pollTimer !== null || this.closed || (this.pollTimer = window.setInterval(async () => {
			try {
				let e = await fetch(this.url(`/v1/signature-transactions/${this.options.transactionId}/status`));
				if (!e.ok) return;
				let t = await e.json();
				this.handle(JSON.stringify({
					eventId: "poll",
					transactionId: this.options.transactionId,
					sequence: t.sequence,
					type: `transaction.${t.status.toLowerCase()}`,
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					status: t.status
				}));
			} catch {}
		}, 2e3));
	}
	stopPolling() {
		this.pollTimer !== null && (window.clearInterval(this.pollTimer), this.pollTimer = null);
	}
	close() {
		this.closed = !0, this.stopPolling(), this.source?.close(), this.source = null;
	}
};
// ../../../node_modules/.pnpm/dompurify@3.4.17/node_modules/dompurify/dist/purify.es.mjs
function r(e, t) {
	this.v = e, this.k = t;
}
function i(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function a(e) {
	if (Array.isArray(e)) return e;
}
function o(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t === 0) {
				if (Object(n) !== n) return;
				c = !1;
			} else for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
		} catch (e) {
			l = !0, i = e;
		} finally {
			try {
				if (!c && n.return != null && (o = n.return(), Object(o) !== o)) return;
			} finally {
				if (l) throw i;
			}
		}
		return s;
	}
}
function s() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function c(e, t) {
	return a(e) || o(e, t) || l(e, t) || s();
}
function l(e, t) {
	if (e) {
		if (typeof e == "string") return i(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? i(e, t) : void 0;
	}
}
function u(e) {
	var t, n;
	function i(t, n) {
		try {
			var o = e[t](n), s = o.value, c = s instanceof r;
			Promise.resolve(c ? s.v : s).then(function(n) {
				if (c) {
					var r = t === "return" && s.k ? t : "next";
					if (!s.k || n.done) return i(r, n);
					n = e[r](n).value;
				}
				a(!!o.done, n);
			}, function(e) {
				i("throw", e);
			});
		} catch (e) {
			a(2, e);
		}
	}
	function a(e, r) {
		e === 2 ? t.reject(r) : t.resolve({
			value: r,
			done: e
		}), (t = t.next) ? i(t.key, t.arg) : n = null;
	}
	this._invoke = function(e, r) {
		return new Promise(function(a, o) {
			var s = {
				key: e,
				arg: r,
				resolve: a,
				reject: o,
				next: null
			};
			n ? n = n.next = s : (t = n = s, i(e, r));
		});
	}, typeof e.return != "function" && (this.return = void 0);
}
u.prototype[typeof Symbol == "function" && Symbol.asyncIterator || "@@asyncIterator"] = function() {
	return this;
}, u.prototype.next = function(e) {
	return this._invoke("next", e);
}, u.prototype.throw = function(e) {
	return this._invoke("throw", e);
}, u.prototype.return = function(e) {
	return this._invoke("return", e);
};
var d = Object.entries, f = Object.setPrototypeOf, ee = Object.isFrozen, te = Object.getPrototypeOf, ne = Object.getOwnPropertyDescriptor, p = Object.freeze, m = Object.seal, re = Object.create, ie = typeof Reflect < "u" && Reflect, h = ie.apply, g = ie.construct;
p ||= function(e) {
	return e;
}, m ||= function(e) {
	return e;
}, h ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, g ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var _ = T(Array.prototype.forEach);
Array.prototype.indexOf;
var ae = T(Array.prototype.lastIndexOf), oe = T(Array.prototype.pop), se = T(Array.prototype.push), ce = T(Array.prototype.slice), le = T(Array.prototype.splice), ue = Array.isArray, de = E(Set), fe = T(Set.prototype.add), pe = T(Set.prototype.has), v = T(String.prototype.toLowerCase), me = T(String.prototype.toString), he = T(String.prototype.match), ge = T(String.prototype.replace), _e = T(String.prototype.indexOf), ve = T(String.prototype.trim), ye = T(Number.prototype.toString), be = T(Boolean.prototype.toString), y = typeof BigInt > "u" ? null : T(BigInt.prototype.toString), b = typeof Symbol > "u" ? null : T(Symbol.prototype.toString), x = T(Object.prototype.hasOwnProperty), S = T(Object.prototype.toString), C = T(RegExp.prototype.test), w = E(TypeError);
function T(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return h(e, t, n);
	};
}
function E(e) {
	return function() {
		return g(e, [...arguments]);
	};
}
function D(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : v;
	if (f && f(e, null), !ue(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (ee(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function xe(e) {
	for (let t = 0; t < e.length; t++) x(e, t) || (e[t] = null);
	return e;
}
function O(e) {
	let t = re(null);
	for (let r of d(e)) {
		var n = c(r, 2);
		let i = n[0], a = n[1];
		x(e, i) && (t[i] = ue(a) ? xe(a) : a && typeof a == "object" && a.constructor === Object ? O(a) : a);
	}
	return t;
}
function Se(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return ye(e);
		case "boolean": return be(e);
		case "bigint": return y ? y(e) : "0";
		case "symbol": return b ? b(e) : "Symbol()";
		case "undefined": return S(e);
		case "function":
		case "object": {
			if (e === null) return S(e);
			let t = e, n = k(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : S(e);
			}
			return S(e);
		}
		default: return S(e);
	}
}
function k(e, t) {
	for (; e !== null;) {
		let n = ne(e, t);
		if (n) {
			if (n.get) return T(n.get);
			if (typeof n.value == "function") return T(n.value);
		}
		e = te(e);
	}
	function n() {
		return null;
	}
	return n;
}
function Ce(e, t) {
	for (; e !== null;) {
		let n = ne(e, t);
		if (n) return n.get ? T(n.get) : null;
		e = te(e);
	}
	return null;
}
function we(e) {
	try {
		return C(e, ""), !0;
	} catch {
		return !1;
	}
}
var Te = p(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), Ee = p(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), De = p([
	"feBlend",
	"feColorMatrix",
	"feComponentTransfer",
	"feComposite",
	"feConvolveMatrix",
	"feDiffuseLighting",
	"feDisplacementMap",
	"feDistantLight",
	"feDropShadow",
	"feFlood",
	"feFuncA",
	"feFuncB",
	"feFuncG",
	"feFuncR",
	"feGaussianBlur",
	"feImage",
	"feMerge",
	"feMergeNode",
	"feMorphology",
	"feOffset",
	"fePointLight",
	"feSpecularLighting",
	"feSpotLight",
	"feTile",
	"feTurbulence"
]), Oe = p([
	"animate",
	"color-profile",
	"cursor",
	"discard",
	"font-face",
	"font-face-format",
	"font-face-name",
	"font-face-src",
	"font-face-uri",
	"foreignobject",
	"hatch",
	"hatchpath",
	"mesh",
	"meshgradient",
	"meshpatch",
	"meshrow",
	"missing-glyph",
	"script",
	"set",
	"solidcolor",
	"unknown",
	"use"
]), ke = p(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), Ae = p([
	"maction",
	"maligngroup",
	"malignmark",
	"mlongdiv",
	"mscarries",
	"mscarry",
	"msgroup",
	"mstack",
	"msline",
	"msrow",
	"semantics",
	"annotation",
	"annotation-xml",
	"mprescripts",
	"none"
]), je = p(["#text"]), Me = p(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), Ne = p(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Pe = p(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), Fe = p([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Ie = m(/{{[\w\W]*|^[\w\W]*}}/g), Le = m(/<%[\w\W]*|^[\w\W]*%>/g), Re = m(/\${[\w\W]*/g), ze = m(/^data-[\-\w.\u00B7-\uFFFF]+$/), Be = m(/^aria-[\-\w]+$/), Ve = m(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), He = m(/^(?:\w+script|data):/i), Ue = m(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), We = m(/^html$/i), Ge = m(/^[a-z][.\w]*(-[.\w]+)+$/i), Ke = m(/<[/\w!]/g), qe = m(/<[/\w]/g), Je = m(/<\/no(script|embed|frames)/i), Ye = m(/\/>/i), A = {
	element: 1,
	attribute: 2,
	text: 3,
	cdataSection: 4,
	entityReference: 5,
	entityNode: 6,
	processingInstruction: 7,
	comment: 8,
	document: 9,
	documentType: 10,
	documentFragment: 11,
	notation: 12
}, Xe = p(D({}, [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
])), Ze = function() {
	return typeof window > "u" ? null : window;
}, Qe = function(e, t) {
	if (typeof e != "object" || typeof e.createPolicy != "function") return null;
	let n = null, r = "data-tt-policy-suffix";
	t && t.hasAttribute(r) && (n = t.getAttribute(r));
	let i = "dompurify" + (n ? "#" + n : "");
	try {
		return e.createPolicy(i, {
			createHTML(e) {
				return e;
			},
			createScriptURL(e) {
				return e;
			}
		});
	} catch {
		return console.warn("TrustedTypes policy " + i + " could not be created."), null;
	}
}, $e = function() {
	return {
		afterSanitizeAttributes: [],
		afterSanitizeElements: [],
		afterSanitizeShadowDOM: [],
		beforeSanitizeAttributes: [],
		beforeSanitizeElements: [],
		beforeSanitizeShadowDOM: [],
		uponSanitizeAttribute: [],
		uponSanitizeElement: [],
		uponSanitizeShadowNode: []
	};
}, j = function(e, t, n, r) {
	return x(e, t) && ue(e[t]) ? D(r.base ? O(r.base) : {}, e[t], r.transform) : n;
}, et = function(e, t, n) {
	let r = x(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? O(r) : n();
};
function tt() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ze(), t = (e) => tt(e);
	if (t.version = "3.4.17", t.removed = [], !e || !e.document || e.document.nodeType !== A.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let l = e.DOMParser, u = e.trustedTypes, f = s.prototype, ee = k(f, "cloneNode"), te = k(f, "remove"), ne = k(f, "removeAttributeNode"), ie = k(f, "nextSibling"), h = k(f, "childNodes"), g = k(f, "parentNode"), ye = k(f, "shadowRoot"), be = k(f, "attributes"), y = o && o.prototype ? k(o.prototype, "nodeType") : null, b = o && o.prototype ? k(o.prototype, "nodeName") : null, S = o && o.prototype ? k(o.prototype, "ownerDocument") : null, T = function(e) {
		return y ? y(e) : e.nodeType;
	}, E = function(e) {
		return b ? b(e) : e.nodeName;
	}, xe = Ce(f, "namespaceURI"), nt = function(e) {
		return xe ? xe(e) : e.namespaceURI;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let M, N = "", rt, it = !1, at = 0, ot = function() {
		if (at > 0) throw w("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, P = function(e) {
		ot(), at++;
		try {
			return M.createHTML(e);
		} finally {
			at--;
		}
	}, st = function(e) {
		ot(), at++;
		try {
			return M.createScriptURL(e);
		} finally {
			at--;
		}
	}, ct = function() {
		return it ||= (rt = Qe(u, i), !0), rt;
	}, F = n, I = F.implementation, lt = F.createNodeIterator, ut = F.createDocumentFragment, dt = F.getElementsByTagName, ft = r.importNode, L = $e();
	t.isSupported = typeof d == "function" && typeof g == "function" && I && I.createHTMLDocument !== void 0;
	let pt = Ie, mt = Le, ht = Re, gt = ze, _t = Be, vt = He, yt = Ue, bt = Ge, xt = Ve, R = null, St = D({}, [
		...Te,
		...Ee,
		...De,
		...ke,
		...je
	]), z = null, Ct = D({}, [
		...Me,
		...Ne,
		...Pe,
		...Fe
	]), B = Object.seal(re(null, {
		tagNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeNameCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		allowCustomizedBuiltInElements: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: !1
		}
	})), wt = null, Tt = null, V = Object.seal(re(null, {
		tagCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		},
		attributeCheck: {
			writable: !0,
			configurable: !1,
			enumerable: !0,
			value: null
		}
	})), Et = !0, Dt = !0, Ot = !1, kt = !0, H = !1, U = !0, W = !1, At = !1, jt = null, Mt = null, Nt = !1, G = !1, Pt = !1, Ft = !1, It = !0, Lt = !1, Rt = "user-content-", zt = !0, Bt = !1, K = null, Vt = {}, q = null, Ht = D({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ut = null, Wt = D({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Gt = null, Kt = D({}, [
		"alt",
		"class",
		"for",
		"id",
		"label",
		"name",
		"pattern",
		"placeholder",
		"role",
		"summary",
		"title",
		"value",
		"style",
		"xmlns"
	]), qt = "http://www.w3.org/1998/Math/MathML", Jt = "http://www.w3.org/2000/svg", J = "http://www.w3.org/1999/xhtml", Yt = J, Xt = !1, Zt = null, Qt = D({}, [
		qt,
		Jt,
		J
	], me), $t = p([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), en = D({}, $t), tn = p(["annotation-xml"]), nn = D({}, tn), rn = D({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), an = null, on = ["application/xhtml+xml", "text/html"], Y = null, sn = null, cn = n.createElement("form"), ln = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, un = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (sn && sn === e) return;
		e && typeof e == "object" || (e = {}), e = O(e), an = on.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, Y = an === "application/xhtml+xml" ? me : v, R = j(e, "ALLOWED_TAGS", St, { transform: Y }), z = j(e, "ALLOWED_ATTR", Ct, { transform: Y }), Zt = j(e, "ALLOWED_NAMESPACES", Qt, { transform: me }), Gt = j(e, "ADD_URI_SAFE_ATTR", Kt, {
			transform: Y,
			base: Kt
		}), Ut = j(e, "ADD_DATA_URI_TAGS", Wt, {
			transform: Y,
			base: Wt
		}), q = j(e, "FORBID_CONTENTS", Ht, { transform: Y }), wt = j(e, "FORBID_TAGS", O({}), { transform: Y }), Tt = j(e, "FORBID_ATTR", O({}), { transform: Y }), Vt = x(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? O(e.USE_PROFILES) : e.USE_PROFILES : !1, Et = e.ALLOW_ARIA_ATTR !== !1, Dt = e.ALLOW_DATA_ATTR !== !1, Ot = e.ALLOW_UNKNOWN_PROTOCOLS || !1, kt = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, H = e.SAFE_FOR_TEMPLATES || !1, U = e.SAFE_FOR_XML !== !1, W = e.WHOLE_DOCUMENT || !1, G = e.RETURN_DOM || !1, Pt = e.RETURN_DOM_FRAGMENT || !1, Ft = e.RETURN_TRUSTED_TYPE || !1, Nt = e.FORCE_BODY || !1, It = e.SANITIZE_DOM !== !1, Lt = e.SANITIZE_NAMED_PROPS || !1, zt = e.KEEP_CONTENT !== !1, Bt = e.IN_PLACE || !1, xt = we(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : Ve, Yt = typeof e.NAMESPACE == "string" ? e.NAMESPACE : J, en = et(e, "MATHML_TEXT_INTEGRATION_POINTS", () => D({}, $t)), nn = et(e, "HTML_INTEGRATION_POINTS", () => D({}, tn));
		let t = et(e, "CUSTOM_ELEMENT_HANDLING", () => re(null));
		if (B = re(null), x(t, "tagNameCheck") && ln(t.tagNameCheck) && (B.tagNameCheck = t.tagNameCheck), x(t, "attributeNameCheck") && ln(t.attributeNameCheck) && (B.attributeNameCheck = t.attributeNameCheck), x(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (B.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), m(B), H && (Dt = !1), Pt && (G = !0), Vt && (R = D({}, je), z = re(null), Vt.html === !0 && (D(R, Te), D(z, Me)), Vt.svg === !0 && (D(R, Ee), D(z, Ne), D(z, Fe)), Vt.svgFilters === !0 && (D(R, De), D(z, Ne), D(z, Fe)), Vt.mathMl === !0 && (D(R, ke), D(z, Pe), D(z, Fe))), V.tagCheck = null, V.attributeCheck = null, x(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? V.tagCheck = e.ADD_TAGS : ue(e.ADD_TAGS) && (R === St && (R = O(R)), D(R, e.ADD_TAGS, Y))), x(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? V.attributeCheck = e.ADD_ATTR : ue(e.ADD_ATTR) && (z === Ct && (z = O(z)), D(z, e.ADD_ATTR, Y))), x(e, "ADD_FORBID_CONTENTS") && ue(e.ADD_FORBID_CONTENTS) && (q === Ht && (q = O(q)), D(q, e.ADD_FORBID_CONTENTS, Y)), zt && (R["#text"] = !0), W && D(R, [
			"html",
			"head",
			"body"
		]), R.table && (D(R, ["tbody"]), delete wt.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw w("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw w("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = M;
			M = e.TRUSTED_TYPES_POLICY;
			try {
				N = P("");
			} catch (e) {
				throw M = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (M = void 0, N = "") : (M === void 0 && (M = ct()), M && typeof N == "string" && (N = P("")));
		p && p(e), sn = e;
	}, dn = D({}, [
		...Ee,
		...De,
		...Oe
	]), fn = D({}, [...ke, ...Ae]), pn = function(e, t, n) {
		return t.namespaceURI === J ? e === "svg" : t.namespaceURI === qt ? e === "svg" && (n === "annotation-xml" || en[n]) : !!dn[e];
	}, mn = function(e, t, n) {
		return t.namespaceURI === J ? e === "math" : t.namespaceURI === Jt ? e === "math" && nn[n] : !!fn[e];
	}, hn = function(e, t, n) {
		return t.namespaceURI === Jt && !nn[n] || t.namespaceURI === qt && !en[n] ? !1 : !fn[e] && (rn[e] || !dn[e]);
	}, gn = function(e) {
		let t = nt(e), n = v(E(e)), r = g(e), i, a;
		return r && T(r) === A.element ? (i = { namespaceURI: nt(r) }, a = v(E(r))) : (i = { namespaceURI: Yt }, a = "template"), Zt[t] ? t === Jt ? pn(n, i, a) : t === qt ? mn(n, i, a) : t === J ? hn(n, i, a) : !!(an === "application/xhtml+xml" && Zt[t]) : !1;
	}, X = function(e) {
		se(t.removed, { element: e });
		try {
			g(e).removeChild(e);
		} catch {
			if (te(e), !g(e)) throw w("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, _n = function(e, t, n) {
		try {
			ne(e, t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, vn = function(e) {
		Sn(e);
		let t = h(e);
		t && _(ce(t), (e) => {
			try {
				te(e);
			} catch {}
		});
		let n = T(e) === A.element ? be(e) : null;
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && _n(e, r, i);
		}
	}, yn = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		se(t.removed, {
			attribute: r || null,
			from: n
		});
		try {
			r ? ne(n, r) : n.removeAttribute(e);
		} catch {
			try {
				n.removeAttribute(e);
			} catch {}
		}
		if (e === "is") {
			if (G || Pt) try {
				X(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, bn = function(e) {
		let t = be(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || z[Y(i)] || _n(e, r, i);
		}
	}, xn = function(e, t) {
		let n = arguments.length > 2 && arguments[2] !== void 0 && arguments[2], r = [e];
		for (; r.length > 0;) {
			let e = r.pop();
			if (t(e) === !1) continue;
			if (n && T(e) === A.element) {
				let t = ye(e);
				Z(t) && r.push(t);
			}
			let i = h(e);
			if (i) for (let e = i.length - 1; e >= 0; --e) r.push(i[e]);
		}
	}, Sn = function(e) {
		xn(e, (e) => {
			T(e) === A.element && bn(e);
		});
	}, Cn = function(e) {
		let t = [];
		return xn(e, (e) => {
			t.push(e);
		}, !0), t;
	}, wn = function(e, t) {
		let n = de();
		_(Cn(e), (e) => {
			T(e) === A.element && fe(n, e);
		}), _(t, (e) => {
			T(e) === A.element && !pe(n, e) && bn(e);
		});
	}, Tn = function(e, n) {
		let r = !1;
		return _(t.removed, (t) => {
			t.element && (r ||= t.element === e, Sn(t.element));
		}), wn(e, n), r;
	}, En = function(e, t) {
		let n = K, r = null, i = () => (r || (r = de(), _(t, (e) => {
			fe(r, e);
		})), r);
		for (let t = 0;; t++) {
			let r = Cn(e), a = [e], o = !1;
			if (_(r, (e) => {
				T(e) === A.documentFragment ? se(a, e) : !o && !pe(n, e) && (o = pe(i(), e));
			}), !o) return;
			if (t >= 8) throw w("the tree kept changing during in-place sanitization; refusing to return it");
			_(a, (t, n) => {
				Dn(t, n > 0, e, i());
			});
		}
	}, Dn = function(e, t, n, r) {
		let i = Mn(e), a;
		for (; a = i.nextNode();) pe(r, a) && !pe(K, a) && (t && Q(L.uponSanitizeShadowNode, a, null), Hn(a, n), Yn(a, n), Z(a.content) && Xn(a.content));
	}, On = function(e) {
		K && fe(K, e);
	}, kn = function(e, t) {
		return U ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, An = function(e) {
		U && xn(e, (e) => {
			let t = T(e);
			if (t === A.processingInstruction || t === A.comment && C(qe, e.data)) {
				try {
					te(e);
				} catch {}
				return !1;
			}
			if (t === A.element) {
				let t = e, n = Y(E(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && kn("for", n) && t.removeAttribute("for");
				} catch {}
			}
			return !0;
		});
	}, jn = function(e) {
		let t = null, r = null;
		if (Nt) e = "<remove></remove>" + e;
		else {
			let t = he(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		an === "application/xhtml+xml" && Yt === J && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = M ? P(e) : e;
		if (Yt === J) try {
			t = new l().parseFromString(i, an);
		} catch {}
		if (!t || !t.documentElement) {
			t = I.createDocument(Yt, "template", null);
			try {
				t.documentElement.innerHTML = Xt ? N : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), Yt === J ? dt.call(t, W ? "html" : "body")[0] : W ? t.documentElement : a;
	}, Mn = function(e) {
		let t = S ? S(e) : e.ownerDocument;
		return lt.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, Nn = function(e) {
		return e = ge(e, pt, " "), e = ge(e, mt, " "), e = ge(e, ht, " "), e;
	}, Pn = function(e) {
		Fn(e);
		let t = e.querySelectorAll?.call(e, "template");
		t && _(t, (e) => {
			Z(e.content) && Pn(e.content);
		});
	}, Fn = function(e) {
		e.normalize();
		let t = S ? S(e) : e.ownerDocument, n = lt.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = Nn(r.data), r = n.nextNode();
	}, In = function(e) {
		let t = b ? b(e) : null;
		return typeof t != "string" || Y(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== be(e) || typeof e.removeAttribute != "function" || typeof e.removeAttributeNode != "function" || typeof e.getAttributeNode != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== y(e) || e.childNodes !== h(e);
	}, Z = function(e) {
		if (!y || typeof e != "object" || !e) return !1;
		try {
			return y(e) === A.documentFragment;
		} catch {
			return !1;
		}
	}, Ln = function(e) {
		if (!y || typeof e != "object" || !e) return !1;
		try {
			return typeof y(e) == "number";
		} catch {
			return !1;
		}
	};
	function Q(e, n, r) {
		e.length !== 0 && _(e, (e) => {
			e.call(t, n, r, sn);
		});
	}
	let Rn = function(e, t) {
		return !!(U && e.hasChildNodes() && !Ln(e.firstElementChild) && C(Ke, e.textContent) && C(Ke, e.innerHTML) || U && Xe[t] && T(e) === A.element && nt(e) === J && (Ln(e.firstElementChild) || typeof e.textContent == "string" && C(Ke, e.textContent)) || e.nodeType === A.processingInstruction || U && e.nodeType === A.comment && C(qe, e.data));
	}, zn = function(e, t) {
		return e instanceof RegExp ? C(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, Bn = function(e, t, n) {
		if (!wt[t] && Gn(t) && zn(B.tagNameCheck, t)) return !1;
		if (zt && !q[t] && !q[v(t)]) {
			let t = g(e), r = h(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? ee(r[a], !0) : r[a];
					t.insertBefore(i, ie(e));
				}
			}
		}
		return X(e), !0;
	}, Vn = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? O(t) : t;
	}, $ = function(e, t) {
		return e === t || g(e) !== null ? !1 : (Bt && Sn(e), !0);
	}, Hn = function(e, n) {
		if (On(e), Q(L.beforeSanitizeElements, e, null), $(e, n)) return !0;
		if (In(e)) return X(e), !0;
		let r = Y(E(e));
		if (R = Vn(L.uponSanitizeElement, R, St, jt), Q(L.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: R
		}), $(e, n)) return !0;
		if (Rn(e, r)) return X(e), !0;
		if (wt[r] || !(V.tagCheck instanceof Function && V.tagCheck(r)) && !R[r]) {
			let t = Bn(e, r, n);
			return t === !1 && (Q(L.afterSanitizeElements, e, null), $(e, n)) ? !0 : t;
		}
		if (T(e) === A.element && !gn(e) || (r === "noscript" || r === "noembed" || r === "noframes") && C(Je, e.innerHTML)) return X(e), !0;
		if (H && e.nodeType === A.text) {
			let n = Nn(e.textContent);
			e.textContent !== n && (se(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return Q(L.afterSanitizeElements, e, null), $(e, n);
	}, Un = function(e, t, r) {
		if (Tt[t] || kn(t, e) || It && (t === "id" || t === "name") && (r in n || r in cn)) return !1;
		let i = z[t] || V.attributeCheck instanceof Function && V.attributeCheck(t, e);
		return Dt && C(gt, t) || Et && C(_t, t) ? !0 : i ? Gt[t] || C(xt, ge(r, yt, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && _e(r, "data:") === 0 && Ut[e] || Ot && !C(vt, ge(r, yt, "")) ? !0 : !r : Gn(e) && zn(B.tagNameCheck, e) && zn(B.attributeNameCheck, t, e) || t === "is" && B.allowCustomizedBuiltInElements && zn(B.tagNameCheck, r);
	}, Wn = D({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), Gn = function(e) {
		return !Wn[v(e)] && C(bt, e);
	}, Kn = function(e, t, n, r) {
		if (M && typeof u == "object" && typeof u.getAttributeType == "function" && !n) switch (u.getAttributeType(e, t)) {
			case "TrustedHTML": return P(r);
			case "TrustedScriptURL": return st(r);
		}
		return r;
	}, qn = function(e, t, n, r) {
		try {
			return n ? e.setAttributeNS(n, t, r) : e.setAttribute(t, r), !In(e) || (X(e), !1);
		} catch {
			return yn(t, e), !1;
		}
	}, Jn = function(e, t) {
		return U && C(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, t) ? !0 : v(e) === "attributename" && he(t, "href") !== null;
	}, Yn = function(e, n) {
		if (Q(L.beforeSanitizeAttributes, e, null), $(e, n)) return;
		let r = e.attributes;
		if (!r || In(e)) return;
		z = Vn(L.uponSanitizeAttribute, z, Ct, Mt);
		let i = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: z,
			forceKeepAttr: void 0
		}, a = r.length, o = Y(e.nodeName);
		for (; a--;) {
			let n = r[a], s = n.name, c = n.namespaceURI, l = n.value, u = Y(s), d = l, f = s === "value" ? d : ve(d), ee = !1;
			i.attrName = u, i.attrValue = f, i.keepAttr = !0, i.forceKeepAttr = void 0, Q(L.uponSanitizeAttribute, e, i), f = i.attrValue, Lt && (u === "id" || u === "name") && _e(f, Rt) !== 0 && (yn(s, e, n), f = Rt + f, ee = !0), Jn(s, f) ? yn(s, e, n) : i.forceKeepAttr || (i.keepAttr ? !kt && C(Ye, f) ? yn(s, e, n) : (H && (f = Nn(f)), Un(o, u, f) ? (f = Kn(o, u, c, f), f !== d && qn(e, s, c, f) && ee && oe(t.removed)) : yn(s, e, n)) : yn(s, e, n));
		}
		Q(L.afterSanitizeAttributes, e, null), $(e, n);
	}, Xn = function(e) {
		let t = null, n = Mn(e);
		for (Q(L.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if (Q(L.uponSanitizeShadowNode, t, null), Hn(t, e), Yn(t, e), Z(t.content) && Xn(t.content), T(t) === A.element) {
			let e = ye(t);
			Z(e) && (Zn(e), Xn(e));
		}
		H && Fn(e), Q(L.afterSanitizeShadowDOM, e, null);
	}, Zn = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				Xn(e.shadow);
				continue;
			}
			let n = e.node, r = T(n) === A.element, i = h(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = b ? b(n) : null;
				if (typeof e == "string" && Y(e) === "template") {
					let e = n.content;
					Z(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = ye(n);
				Z(e) && t.push({
					node: null,
					shadow: e
				}, {
					node: e,
					shadow: null
				});
			}
		}
	};
	return t.sanitize = function(e) {
		let n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = null, a = null, o = null, s = null;
		if (Xt = !e, Xt && (e = "<!-->"), typeof e != "string" && !Ln(e) && (e = Se(e), typeof e != "string")) throw w("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		At ? (R = jt, z = Mt) : un(n), (L.uponSanitizeElement.length > 0 || L.uponSanitizeAttribute.length > 0) && (R = O(R)), L.uponSanitizeAttribute.length > 0 && (z = O(z)), t.removed = [];
		let c = Bt && typeof e != "string" && Ln(e), l = [], u = K;
		if (c) {
			An(e);
			let t = E(e);
			if (typeof t == "string") {
				let n = Y(t);
				if (!R[n] || wt[n]) throw vn(e), w("root node is forbidden and cannot be sanitized in-place");
			}
			if (In(e)) throw vn(e), w("root node is clobbered and cannot be sanitized in-place");
			l = Cn(e), K = de();
		} else if (Ln(e)) i = jn("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === A.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Zn(i);
		else {
			if (!G && !H && !W && e.indexOf("<") === -1) return M && Ft ? P(e) : e;
			if (i = jn(e), !i) return G ? null : Ft ? N : "";
		}
		i && Nt && X(i.firstChild);
		let d = c ? e : i;
		try {
			c && Zn(e);
			let t = Mn(d);
			for (; o = t.nextNode();) Hn(o, d), Yn(o, d), Z(o.content) && Xn(o.content);
			c && En(e, l);
		} catch (t) {
			throw c && (vn(e), Tn(e, l)), t;
		} finally {
			K = u;
		}
		if (c) {
			if (Tn(e, l)) throw w("a node selected for removal could not be safely returned; refusing to sanitize in place");
			return H && Pn(e), e;
		}
		if (G) {
			if (H && Pn(i), Pt) for (s = ut.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (z.shadowroot || z.shadowrootmode) && (s = ft.call(r, s, !0)), s;
		}
		let f = W ? i.outerHTML : i.innerHTML;
		return W && R["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && C(We, i.ownerDocument.doctype.name) && (f = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + f), H && (f = Nn(f)), M && Ft ? P(f) : f;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		un(e), At = !0, jt = R, Mt = z;
	}, t.clearConfig = function() {
		sn = null, At = !1, jt = null, Mt = null, M = rt, N = "";
	}, t.isValidAttribute = function(e, t, n) {
		sn || un({});
		let r = Y(e), i = Y(t);
		return typeof n == "string" && (Jn(t, n) || !kt && C(Ye, n)) ? !1 : Un(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && x(L, e) && se(L[e], t);
	}, t.removeHook = function(e, t) {
		if (x(L, e)) {
			if (t !== void 0) {
				let n = ae(L[e], t);
				return n === -1 ? void 0 : le(L[e], n, 1)[0];
			}
			return oe(L[e]);
		}
	}, t.removeHooks = function(e) {
		x(L, e) && (L[e] = []);
	}, t.removeAllHooks = function() {
		L = $e();
	}, t;
}
var nt = tt(), M = {
	en: {
		heading: "Scan to sign",
		hint: "Point your phone camera at the code.",
		link: "Open signing link",
		code: "Code"
	},
	it: {
		heading: "Scansiona per firmare",
		hint: "Inquadra il codice con la fotocamera del telefono.",
		link: "Apri il link per firmare",
		code: "Codice"
	},
	pt: {
		heading: "Aponte para assinar",
		hint: "Aponte a câmera do celular para o código.",
		link: "Abrir link de assinatura",
		code: "Código"
	}
};
function N(e, t, n) {
	return new Promise((r, i) => {
		let a = new Image();
		a.onload = () => {
			try {
				let e = document.createElement("canvas");
				e.width = t, e.height = n;
				let o = e.getContext("2d");
				if (!o) {
					i(/* @__PURE__ */ Error("Signdo: canvas 2d context unavailable"));
					return;
				}
				o.drawImage(a, 0, 0, t, n), r(e.toDataURL("image/png"));
			} catch (e) {
				i(e);
			} finally {
				URL.revokeObjectURL(a.src);
			}
		}, a.onerror = () => i(/* @__PURE__ */ Error("Signdo: failed to load SVG for PNG conversion"));
		let o = new Blob([e], { type: "image/svg+xml;charset=utf-8" });
		a.src = URL.createObjectURL(o);
	});
}
async function rt(t) {
	let { container: n, width: r, height: i } = t, a = nt.sanitize(t.svg, {
		USE_PROFILES: {
			svg: !0,
			svgFilters: !1
		},
		FORBID_TAGS: [
			"script",
			"foreignObject",
			"image",
			"use",
			"style",
			"a"
		],
		FORBID_ATTR: [
			"href",
			"xlink:href",
			"style",
			"onload",
			"onerror"
		]
	});
	n.classList.add("signdo-signature-field"), n.style.width = `${r}px`, n.style.height = `${i}px`, n.style.position = "relative", n.style.overflow = "hidden", n.replaceChildren();
	let o = e(t.fitPolicy, t.align), s = document.createElement("img"), c = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(a)}`, l, u;
	return t.format === "png" ? (l = await N(c, r, i), u = "png") : (l = c, u = "svg"), s.src = l, s.alt = "Handwritten signature", s.decoding = "async", s.style.display = "block", s.style.width = o.width, s.style.height = o.height, s.style.maxWidth = "100%", s.style.maxHeight = "100%", s.style.objectFit = o.objectFit, s.style.objectPosition = o.objectPosition, s.style.margin = "auto", s.style.position = "absolute", s.style.inset = "0", n.appendChild(s), {
		image: s,
		dataUrl: l,
		format: u
	};
}
function it(e, t) {
	let n = M[t.lang ?? "en"];
	e.classList.add("signdo-signature-field"), e.style.width = `${t.width}px`, e.style.height = `${t.height}px`, e.replaceChildren();
	let r = document.createElement("div");
	r.setAttribute("role", "group"), r.setAttribute("aria-label", n.heading), Object.assign(r.style, {
		display: "flex",
		alignItems: "center",
		gap: "12px",
		width: "100%",
		height: "100%",
		boxSizing: "border-box",
		padding: "8px",
		border: "1px dashed var(--signdo-border, #c7c7c7)",
		borderRadius: "8px",
		font: "13px/1.4 system-ui, sans-serif",
		color: "var(--signdo-text, #333)"
	});
	let i = document.createElement("div");
	i.innerHTML = nt.sanitize(t.qrSvg, { USE_PROFILES: { svg: !0 } });
	let a = i.querySelector("svg");
	a && (a.style.width = `${Math.min(t.height - 16, 120)}px`, a.style.height = "auto", a.style.display = "block");
	let o = document.createElement("div"), s = document.createElement("strong");
	s.textContent = n.heading;
	let c = document.createElement("div");
	c.textContent = n.hint, c.style.color = "var(--signdo-muted, #666)";
	let l = document.createElement("a");
	l.href = t.qrUrl, l.textContent = n.link, l.rel = "noopener", l.target = "_blank", l.style.color = "var(--signdo-link, #0b57d0)";
	let u = document.createElement("div");
	u.textContent = `${n.code}: ${t.pairingCode}`, u.style.cssText = "font-family:ui-monospace,monospace;letter-spacing:.05em;color:var(--signdo-muted, #666)", o.append(s, c, l, u), r.append(i, o), e.appendChild(r);
}
// src/index.ts
var at = [
	"en",
	"it",
	"pt"
];
function ot(e, t) {
	if (t) return t;
	if (e) return e;
	let n = [
		document.documentElement.lang,
		...navigator.languages ?? [],
		navigator.language
	];
	for (let e of n) {
		let t = e?.toLowerCase().split("-")[0];
		if (t && at.includes(t)) return t;
	}
	return "en";
}
var P = "signdo:tx:", st = "https://signdo-api.swappscloud.com";
function ct(e) {
	let t = typeof e == "string" ? document.querySelector(e) : e;
	if (!t) throw Error(`Signdo: element not found: ${String(e)}`);
	return t;
}
function F() {
	let e = "signdo:session", t = sessionStorage.getItem(e);
	return t || (t = Array.from(crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(24))).map((e) => e.toString(16).padStart(2, "0")).join(""), sessionStorage.setItem(e, t)), t;
}
var I = class {
	config;
	options;
	transport = null;
	listeners = /* @__PURE__ */ new Map();
	element;
	transactionId = null;
	channelToken = null;
	applied = /* @__PURE__ */ new Set();
	destroyed = !1;
	currentImage = null;
	currentWidth;
	currentHeight;
	constructor(e, t) {
		this.config = e, this.options = t, this.element = ct(t.element), this.currentWidth = t.width, this.currentHeight = t.height;
	}
	on(e, t) {
		let n = this.listeners.get(e);
		return n || (n = /* @__PURE__ */ new Set(), this.listeners.set(e, n)), n.add(t), this;
	}
	off(e, t) {
		return this.listeners.get(e)?.delete(t), this;
	}
	emit(e, t) {
		for (let n of this.listeners.get(e) ?? []) try {
			n(t);
		} catch (e) {
			console.error("[signdo] listener threw", e);
		}
	}
	api(e) {
		return `${this.config.apiBase.replace(/\/$/, "")}${e}`;
	}
	async open() {
		try {
			await this.openTransaction();
		} catch (e) {
			let t = e instanceof Error ? e : /* @__PURE__ */ Error("Signdo: could not start signing");
			throw this.destroyed || this.emit("error", t), t;
		}
	}
	async openTransaction() {
		if (this.destroyed) throw Error("Signdo: field has been destroyed");
		if (await this.tryRecover()) return;
		let e = ot(this.config.lang, this.options.lang), t = await fetch(this.api("/v1/signature-transactions"), {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${this.config.publicKey}`,
				"idempotency-key": `${F()}:${this.options.fieldId ?? this.options.element}`
			},
			body: JSON.stringify({
				applicationId: this.config.applicationId,
				field: {
					fieldId: this.options.fieldId,
					width: this.options.width,
					height: this.options.height,
					fitPolicy: this.options.fitPolicy ?? "contain",
					align: this.options.align ?? "center",
					format: this.options.format ?? "svg"
				},
				browserSessionId: F(),
				documentLabel: this.options.documentLabel,
				lang: e
			})
		});
		if (!t.ok) throw Error(`Signdo: could not start signing (${t.status})`);
		let n = await t.json();
		if (!n.qrUrl || !n.pairingCode) {
			sessionStorage.removeItem(`${P}${this.recoveryKey()}`);
			let t = await fetch(this.api("/v1/signature-transactions"), {
				method: "POST",
				headers: {
					"content-type": "application/json",
					authorization: `Bearer ${this.config.publicKey}`,
					"idempotency-key": crypto.randomUUID()
				},
				body: JSON.stringify({
					applicationId: this.config.applicationId,
					field: {
						fieldId: this.options.fieldId,
						width: this.options.width,
						height: this.options.height,
						fitPolicy: this.options.fitPolicy ?? "contain",
						align: this.options.align ?? "center",
						format: this.options.format ?? "svg"
					},
					browserSessionId: F(),
					documentLabel: this.options.documentLabel,
					lang: e
				})
			});
			if (!t.ok) throw Error(`Signdo: could not restart signing (${t.status})`);
			Object.assign(n, await t.json());
		}
		this.transactionId = n.id, this.channelToken = n.channelToken, sessionStorage.setItem(`${P}${this.recoveryKey()}`, JSON.stringify({
			id: n.id,
			channelToken: n.channelToken
		})), it(this.element, {
			qrSvg: n.qrSvg,
			qrUrl: n.qrUrl,
			pairingCode: n.pairingCode,
			width: this.options.width,
			height: this.options.height,
			lang: e
		}), this.emit("ready", {
			transactionId: n.id,
			qrUrl: n.qrUrl,
			pairingCode: n.pairingCode
		}), this.listen();
	}
	recoveryKey() {
		return `${this.options.fieldId ?? String(this.options.element)}`;
	}
	async tryRecover() {
		let e = sessionStorage.getItem(`${P}${this.recoveryKey()}`);
		if (!e) return !1;
		try {
			let { id: t, channelToken: n } = JSON.parse(e), r = await fetch(this.api(`/v1/signature-transactions/${t}?channelToken=${encodeURIComponent(n)}`));
			if (!r.ok) throw Error("not recoverable");
			let i = await r.json();
			if ([
				"EXPIRED",
				"CANCELLED",
				"FAILED"
			].includes(i.status)) throw Error("terminal");
			return this.transactionId = t, this.channelToken = n, i.signature ? await this.applySignature(i) : it(this.element, {
				qrSvg: "",
				qrUrl: "",
				pairingCode: "",
				width: this.options.width,
				height: this.options.height,
				lang: ot(this.config.lang, this.options.lang)
			}), this.listen(), !0;
		} catch {
			return sessionStorage.removeItem(`${P}${this.recoveryKey()}`), !1;
		}
	}
	listen() {
		this.transactionId && this.channelToken && (this.transport = new n({
			apiBase: this.config.apiBase,
			transactionId: this.transactionId,
			channelToken: this.channelToken,
			onEvent: (e) => void this.onEvent(e),
			onError: (e) => this.emit("error", e)
		}), this.transport.start());
	}
	async onEvent(e) {
		switch (e.status) {
			case "SCANNED":
				this.emit("scanned", e);
				break;
			case "SIGNING":
				this.emit("signing", e);
				break;
			case "SIGNED":
			case "DELIVERING":
			case "DELIVERED":
			case "CONFIRMED":
				await this.fetchAndApply();
				break;
			case "EXPIRED":
				this.emit("expired", e), this.transport?.close();
				break;
			case "CANCELLED": this.emit("cancelled", e), this.transport?.close();
		}
	}
	async fetchAndApply() {
		if (!this.transactionId || !this.channelToken) return;
		let e = await fetch(this.api(`/v1/signature-transactions/${this.transactionId}?channelToken=${encodeURIComponent(this.channelToken)}`));
		e.ok && await this.applySignature(await e.json());
	}
	async applySignature(e) {
		let t = e.signature;
		if (!t || e.id !== this.transactionId) return;
		if (e.field?.width !== this.options.width || e.field?.height !== this.options.height) {
			this.emit("error", /* @__PURE__ */ Error("Signdo: field geometry does not match this transaction"));
			return;
		}
		if (this.applied.has(t.signatureId)) return;
		this.applied.add(t.signatureId);
		let n = await rt({
			container: this.element,
			svg: t.content,
			width: this.options.width,
			height: this.options.height,
			fitPolicy: this.options.fitPolicy,
			align: this.options.align,
			format: this.options.format
		});
		this.currentImage = n.image;
		let r = {
			transactionId: e.id,
			status: e.status,
			signatureHash: t.contentHash,
			format: n.format,
			width: t.intrinsicWidth,
			height: t.intrinsicHeight,
			boundingBox: t.boundingBox
		};
		this.emit("completed", r), sessionStorage.removeItem(`${P}${this.recoveryKey()}`), e.status !== "CONFIRMED" && await fetch(this.api(`/v1/signature-transactions/${e.id}/confirm`), {
			method: "POST",
			headers: {
				"content-type": "application/json",
				"x-signdo-channel-token": this.channelToken
			},
			body: JSON.stringify({
				deliveryId: t.signatureId,
				signatureHash: t.contentHash
			})
		}).catch(() => {});
	}
	resize(e) {
		if (this.destroyed) throw Error("Signdo: field has been destroyed");
		let t = this.options.width, n = this.options.height, r = t / n, i, a;
		if (e.width != null && e.height != null) {
			let r = e.width / t, o = e.height / n, s = Math.min(r, o);
			i = t * s, a = n * s;
		} else if (e.width != null) i = e.width, a = e.width / r;
		else if (e.height != null) a = e.height, i = e.height * r;
		else return this;
		if (!Number.isFinite(i) || i <= 0 || !Number.isFinite(a) || a <= 0) throw Error("Signdo: resize dimensions must be positive finite numbers");
		return this.currentWidth = i, this.currentHeight = a, this.element.style.width = `${i}px`, this.element.style.height = `${a}px`, this;
	}
	scale(e) {
		if (this.destroyed) throw Error("Signdo: field has been destroyed");
		if (!Number.isFinite(e) || e <= 0) throw Error("Signdo: scale factor must be a positive finite number");
		return this.resize({
			width: this.options.width * e,
			height: this.options.height * e
		});
	}
	async cancel() {
		this.transactionId && this.channelToken && (await fetch(this.api(`/v1/signature-transactions/${this.transactionId}/cancel`), {
			method: "POST",
			headers: { "x-signdo-channel-token": this.channelToken }
		}).catch(() => {}), this.emit("cancelled", { transactionId: this.transactionId }), this.destroy());
	}
	destroy() {
		this.destroyed = !0, this.transport?.close(), this.transport = null, this.listeners.clear();
	}
}, lt = new class {
	config = null;
	init(e) {
		if (e.publicKey.startsWith("sk_")) throw Error("Signdo: never use a secret key (sk_) in browser code. Use your pk_ key.");
		let t = e.apiBase ?? st;
		if (!t) throw Error("Signdo: apiBase is required when the bundle has no baked API origin");
		this.config = {
			...e,
			apiBase: t
		};
	}
	requireConfig() {
		if (!this.config) throw Error("Signdo: call Signdo.init({ publicKey, applicationId }) first");
		return this.config;
	}
	createSignatureField(e) {
		let t = new I(this.requireConfig(), e);
		return e.autoOpen !== !1 && t.open().catch(() => {}), t;
	}
	createSignature(e) {
		let t = new I(this.requireConfig(), {
			...e,
			element: e.container ?? e.element
		}), n = new Promise((e, n) => {
			t.on("completed", e), t.on("error", n), t.on("expired", () => n(/* @__PURE__ */ Error("Signdo: signing session expired"))), t.on("cancelled", () => n(/* @__PURE__ */ Error("Signdo: signing session cancelled")));
		});
		return t.open().catch(() => {}), Object.assign(n, { field: t });
	}
	createField = (e) => this.createSignatureField(e);
}();
export { I as SignatureField, lt as Signdo, lt as default };
typeof globalThis < "u" && (globalThis.Signdo = globalThis.Signdo.Signdo || globalThis.Signdo);

//# sourceMappingURL=signdo.esm.js.map