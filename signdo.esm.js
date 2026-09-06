function e(e = "contain", t = "center") {
	return {
		objectFit: e === "cover" ? "cover" : "contain",
		objectPosition: t === "baseline" ? "center bottom" : t === "top-left" ? "left top" : "center center",
		width: e === "fit-width" ? "100%" : e === "fit-height" ? "auto" : "100%",
		height: e === "fit-height" ? "100%" : e === "fit-width" ? "auto" : "100%"
	};
}
//#endregion
//#region ../core/src/events.ts
function t(e, t) {
	return t.sequence > e;
}
//#endregion
//#region src/transport.ts
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
//#endregion
//#region ../../../node_modules/.pnpm/dompurify@3.4.14/node_modules/dompurify/dist/purify.es.mjs
function r(e, t) {
	(t == null || t > e.length) && (t = e.length);
	for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
	return r;
}
function i(e) {
	if (Array.isArray(e)) return e;
}
function a(e, t) {
	var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
	if (n != null) {
		var r, i, a, o, s = [], c = !0, l = !1;
		try {
			if (a = (n = n.call(e)).next, t !== 0) for (; !(c = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); c = !0);
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
function o() {
	throw TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function s(e, t) {
	return i(e) || a(e, t) || c(e, t) || o();
}
function c(e, t) {
	if (e) {
		if (typeof e == "string") return r(e, t);
		var n = {}.toString.call(e).slice(8, -1);
		return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? r(e, t) : void 0;
	}
}
var l = Object.entries, u = Object.setPrototypeOf, d = Object.isFrozen, f = Object.getPrototypeOf, ee = Object.getOwnPropertyDescriptor, p = Object.freeze, m = Object.seal, h = Object.create, te = typeof Reflect < "u" && Reflect, ne = te.apply, g = te.construct;
p ||= function(e) {
	return e;
}, m ||= function(e) {
	return e;
}, ne ||= function(e, t) {
	var n = [...arguments].slice(2);
	return e.apply(t, n);
}, g ||= function(e) {
	return new e(...[...arguments].slice(1));
};
var _ = T(Array.prototype.forEach), re = T(Array.prototype.lastIndexOf), ie = T(Array.prototype.pop), ae = T(Array.prototype.push), oe = T(Array.prototype.splice), v = Array.isArray, se = T(String.prototype.toLowerCase), ce = T(String.prototype.toString), le = T(String.prototype.match), ue = T(String.prototype.replace), de = T(String.prototype.indexOf), fe = T(String.prototype.trim), y = T(Number.prototype.toString), pe = T(Boolean.prototype.toString), me = typeof BigInt > "u" ? null : T(BigInt.prototype.toString), b = typeof Symbol > "u" ? null : T(Symbol.prototype.toString), x = T(Object.prototype.hasOwnProperty), S = T(Object.prototype.toString), C = T(RegExp.prototype.test), w = he(TypeError);
function T(e) {
	return function(t) {
		t instanceof RegExp && (t.lastIndex = 0);
		var n = [...arguments].slice(1);
		return ne(e, t, n);
	};
}
function he(e) {
	return function() {
		return g(e, [...arguments]);
	};
}
function E(e, t) {
	let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : se;
	if (u && u(e, null), !v(t)) return e;
	let r = t.length;
	for (; r--;) {
		let i = t[r];
		if (typeof i == "string") {
			let e = n(i);
			e !== i && (d(t) || (t[r] = e), i = e);
		}
		e[i] = !0;
	}
	return e;
}
function ge(e) {
	for (let t = 0; t < e.length; t++) x(e, t) || (e[t] = null);
	return e;
}
function D(e) {
	let t = h(null);
	for (let r of l(e)) {
		var n = s(r, 2);
		let i = n[0], a = n[1];
		x(e, i) && (t[i] = v(a) ? ge(a) : a && typeof a == "object" && a.constructor === Object ? D(a) : a);
	}
	return t;
}
function _e(e) {
	switch (typeof e) {
		case "string": return e;
		case "number": return y(e);
		case "boolean": return pe(e);
		case "bigint": return me ? me(e) : "0";
		case "symbol": return b ? b(e) : "Symbol()";
		case "undefined": return S(e);
		case "function":
		case "object": {
			if (e === null) return S(e);
			let t = e, n = O(t, "toString");
			if (typeof n == "function") {
				let e = n(t);
				return typeof e == "string" ? e : S(e);
			}
			return S(e);
		}
		default: return S(e);
	}
}
function O(e, t) {
	for (; e !== null;) {
		let n = ee(e, t);
		if (n) {
			if (n.get) return T(n.get);
			if (typeof n.value == "function") return T(n.value);
		}
		e = f(e);
	}
	function n() {
		return null;
	}
	return n;
}
function ve(e) {
	try {
		return C(e, ""), !0;
	} catch {
		return !1;
	}
}
var ye = p(/* @__PURE__ */ "a.abbr.acronym.address.area.article.aside.audio.b.bdi.bdo.big.blink.blockquote.body.br.button.canvas.caption.center.cite.code.col.colgroup.content.data.datalist.dd.decorator.del.details.dfn.dialog.dir.div.dl.dt.element.em.fieldset.figcaption.figure.font.footer.form.h1.h2.h3.h4.h5.h6.head.header.hgroup.hr.html.i.img.input.ins.kbd.label.legend.li.main.map.mark.marquee.menu.menuitem.meter.nav.nobr.ol.optgroup.option.output.p.picture.pre.progress.q.rp.rt.ruby.s.samp.search.section.select.shadow.slot.small.source.spacer.span.strike.strong.style.sub.summary.sup.table.tbody.td.template.textarea.tfoot.th.thead.time.tr.track.tt.u.ul.var.video.wbr".split(".")), be = p(/* @__PURE__ */ "svg.a.altglyph.altglyphdef.altglyphitem.animatecolor.animatemotion.animatetransform.circle.clippath.defs.desc.ellipse.enterkeyhint.exportparts.filter.font.g.glyph.glyphref.hkern.image.inputmode.line.lineargradient.marker.mask.metadata.mpath.part.path.pattern.polygon.polyline.radialgradient.rect.stop.style.switch.symbol.text.textpath.title.tref.tspan.view.vkern".split(".")), xe = p([
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
]), Se = p([
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
]), Ce = p(/* @__PURE__ */ "math.menclose.merror.mfenced.mfrac.mglyph.mi.mlabeledtr.mmultiscripts.mn.mo.mover.mpadded.mphantom.mroot.mrow.ms.mspace.msqrt.mstyle.msub.msup.msubsup.mtable.mtd.mtext.mtr.munder.munderover.mprescripts".split(".")), we = p([
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
]), Te = p(["#text"]), Ee = p(/* @__PURE__ */ "accept.action.align.alt.autocapitalize.autocomplete.autopictureinpicture.autoplay.background.bgcolor.border.capture.cellpadding.cellspacing.checked.cite.class.clear.color.cols.colspan.command.commandfor.controls.controlslist.coords.crossorigin.datetime.decoding.default.dir.disabled.disablepictureinpicture.disableremoteplayback.download.draggable.enctype.enterkeyhint.exportparts.face.for.headers.height.hidden.high.href.hreflang.id.inert.inputmode.integrity.ismap.kind.label.lang.list.loading.loop.low.max.maxlength.media.method.min.minlength.multiple.muted.name.nonce.noshade.novalidate.nowrap.open.optimum.part.pattern.placeholder.playsinline.popover.popovertarget.popovertargetaction.poster.preload.pubdate.radiogroup.readonly.rel.required.rev.reversed.role.rows.rowspan.spellcheck.scope.selected.shape.size.sizes.slot.span.srclang.start.src.srcset.step.style.summary.tabindex.title.translate.type.usemap.valign.value.width.wrap.xmlns".split(".")), De = p(/* @__PURE__ */ "accent-height.accumulate.additive.alignment-baseline.amplitude.ascent.attributename.attributetype.azimuth.basefrequency.baseline-shift.begin.bias.by.class.clip.clippathunits.clip-path.clip-rule.color.color-interpolation.color-interpolation-filters.color-profile.color-rendering.cx.cy.d.dx.dy.diffuseconstant.direction.display.divisor.dominant-baseline.dur.edgemode.elevation.end.exponent.fill.fill-opacity.fill-rule.filter.filterunits.flood-color.flood-opacity.font-family.font-size.font-size-adjust.font-stretch.font-style.font-variant.font-weight.fx.fy.g1.g2.glyph-name.glyphref.gradientunits.gradienttransform.height.href.id.image-rendering.in.in2.intercept.k.k1.k2.k3.k4.kerning.keypoints.keysplines.keytimes.lang.lengthadjust.letter-spacing.kernelmatrix.kernelunitlength.lighting-color.local.marker-end.marker-mid.marker-start.markerheight.markerunits.markerwidth.maskcontentunits.maskunits.max.mask.mask-type.media.method.mode.min.name.numoctaves.offset.operator.opacity.order.orient.orientation.origin.overflow.paint-order.path.pathlength.patterncontentunits.patterntransform.patternunits.pointer-events.points.preservealpha.preserveaspectratio.primitiveunits.r.rx.ry.radius.refx.refy.repeatcount.repeatdur.restart.result.rotate.scale.seed.shape-rendering.slope.specularconstant.specularexponent.spreadmethod.startoffset.stddeviation.stitchtiles.stop-color.stop-opacity.stroke-dasharray.stroke-dashoffset.stroke-linecap.stroke-linejoin.stroke-miterlimit.stroke-opacity.stroke.stroke-width.style.surfacescale.systemlanguage.tabindex.tablevalues.targetx.targety.transform.transform-origin.text-anchor.text-decoration.text-orientation.text-rendering.textlength.type.u1.u2.unicode.values.vector-effect.viewbox.visibility.version.vert-adv-y.vert-origin-x.vert-origin-y.width.word-spacing.wrap.writing-mode.xchannelselector.ychannelselector.x.x1.x2.xmlns.y.y1.y2.z.zoomandpan".split(".")), Oe = p(/* @__PURE__ */ "accent.accentunder.align.bevelled.close.columnalign.columnlines.columnspacing.columnspan.denomalign.depth.dir.display.displaystyle.encoding.fence.frame.height.href.id.largeop.length.linethickness.lquote.lspace.mathbackground.mathcolor.mathsize.mathvariant.maxsize.minsize.movablelimits.notation.numalign.open.rowalign.rowlines.rowspacing.rowspan.rspace.rquote.scriptlevel.scriptminsize.scriptsizemultiplier.selection.separator.separators.stretchy.subscriptshift.supscriptshift.symmetric.voffset.width.xmlns".split(".")), ke = p([
	"xlink:href",
	"xml:id",
	"xlink:title",
	"xml:space",
	"xmlns:xlink"
]), Ae = m(/{{[\w\W]*|^[\w\W]*}}/g), je = m(/<%[\w\W]*|^[\w\W]*%>/g), Me = m(/\${[\w\W]*/g), Ne = m(/^data-[\-\w.\u00B7-\uFFFF]+$/), Pe = m(/^aria-[\-\w]+$/), Fe = m(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i), Ie = m(/^(?:\w+script|data):/i), Le = m(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g), Re = m(/^html$/i), ze = m(/^[a-z][.\w]*(-[.\w]+)+$/i), Be = m(/<[/\w!]/g), Ve = m(/<[/\w]/g), He = m(/<\/no(script|embed|frames)/i), Ue = m(/\/>/i), k = {
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
}, A = [
	"style",
	"script",
	"xmp",
	"iframe",
	"noembed",
	"noframes",
	"plaintext",
	"noscript"
], We = p(E({}, A)), Ge = function() {
	let e = {};
	return _(A, (t) => {
		e[t] = m(RegExp("</" + t + "(?=[\\t\\n\\f\\r />])", "i"));
	}), p(e);
}(), Ke = function() {
	return typeof window > "u" ? null : window;
}, qe = function(e, t) {
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
}, Je = function() {
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
	return x(e, t) && v(e[t]) ? E(r.base ? D(r.base) : {}, e[t], r.transform) : n;
}, Ye = function(e, t, n) {
	let r = x(e, t) ? e[t] : void 0;
	return r && typeof r == "object" ? D(r) : n();
};
function Xe() {
	let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Ke(), t = (e) => Xe(e);
	if (t.version = "3.4.14", t.removed = [], !e || !e.document || e.document.nodeType !== k.document || !e.Element) return t.isSupported = !1, t;
	let n = e.document, r = n, i = r.currentScript;
	e.DocumentFragment;
	let a = e.HTMLTemplateElement, o = e.Node, s = e.Element, c = e.NodeFilter;
	e.NamedNodeMap === void 0 && (e.NamedNodeMap || e.MozNamedAttrMap), e.HTMLFormElement;
	let u = e.DOMParser, d = e.trustedTypes, f = s.prototype, ee = O(f, "cloneNode"), te = O(f, "remove"), ne = O(f, "nextSibling"), g = O(f, "childNodes"), y = O(f, "parentNode"), pe = O(f, "shadowRoot"), me = O(f, "attributes"), b = o && o.prototype ? O(o.prototype, "nodeType") : null, S = o && o.prototype ? O(o.prototype, "nodeName") : null, T = o && o.prototype ? O(o.prototype, "ownerDocument") : null, he = function(e) {
		return b ? b(e) : e.nodeType;
	}, ge = function(e) {
		return S ? S(e) : e.nodeName;
	};
	if (typeof a == "function") {
		let e = n.createElement("template");
		e.content && e.content.ownerDocument && (n = e.content.ownerDocument);
	}
	let A, M = "", Ze, Qe = !1, N = 0, P = function() {
		if (N > 0) throw w("A configured TRUSTED_TYPES_POLICY callback (createHTML or createScriptURL) must not call DOMPurify.sanitize, as that causes infinite recursion. Do not pass a policy whose callbacks wrap DOMPurify as TRUSTED_TYPES_POLICY; see the \"DOMPurify and Trusted Types\" section of the README.");
	}, F = function(e) {
		P(), N++;
		try {
			return A.createHTML(e);
		} finally {
			N--;
		}
	}, $e = function(e) {
		P(), N++;
		try {
			return A.createScriptURL(e);
		} finally {
			N--;
		}
	}, et = function() {
		return Qe ||= (Ze = qe(d, i), !0), Ze;
	}, I = n, tt = I.implementation, nt = I.createNodeIterator, rt = I.createDocumentFragment, it = I.getElementsByTagName, at = r.importNode, L = Je();
	t.isSupported = typeof l == "function" && typeof y == "function" && tt && tt.createHTMLDocument !== void 0;
	let ot = Ae, st = je, ct = Me, lt = Ne, ut = Pe, dt = Ie, ft = Le, pt = ze, mt = Fe, R = null, ht = E({}, [
		...ye,
		...be,
		...xe,
		...Ce,
		...Te
	]), z = null, gt = E({}, [
		...Ee,
		...De,
		...Oe,
		...ke
	]), B = Object.seal(h(null, {
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
	})), _t = null, vt = null, V = Object.seal(h(null, {
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
	})), yt = !0, bt = !0, xt = !1, St = !0, H = !1, U = !0, W = !1, Ct = !1, wt = null, Tt = null, Et = !1, G = !1, Dt = !1, Ot = !1, kt = !0, At = !1, jt = "user-content-", Mt = !0, Nt = !1, K = {}, q = null, Pt = E({}, /* @__PURE__ */ "annotation-xml.audio.colgroup.desc.foreignobject.head.iframe.math.mi.mn.mo.ms.mtext.noembed.noframes.noscript.plaintext.script.selectedcontent.style.svg.template.thead.title.video.xmp".split(".")), Ft = null, It = E({}, [
		"audio",
		"video",
		"img",
		"source",
		"image",
		"track"
	]), Lt = null, Rt = E({}, [
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
	]), zt = "http://www.w3.org/1998/Math/MathML", Bt = "http://www.w3.org/2000/svg", J = "http://www.w3.org/1999/xhtml", Y = J, Vt = !1, Ht = null, Ut = E({}, [
		zt,
		Bt,
		J
	], ce), Wt = p([
		"mi",
		"mo",
		"mn",
		"ms",
		"mtext"
	]), Gt = E({}, Wt), Kt = p(["annotation-xml"]), qt = E({}, Kt), Jt = E({}, [
		"title",
		"style",
		"font",
		"a",
		"script"
	]), Yt = null, Xt = ["application/xhtml+xml", "text/html"], X = null, Zt = null, Qt = n.createElement("form"), $t = function(e) {
		return e instanceof RegExp || e instanceof Function;
	}, en = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		if (Zt && Zt === e) return;
		(!e || typeof e != "object") && (e = {}), e = D(e), Yt = Xt.indexOf(e.PARSER_MEDIA_TYPE) === -1 ? "text/html" : e.PARSER_MEDIA_TYPE, X = Yt === "application/xhtml+xml" ? ce : se, R = j(e, "ALLOWED_TAGS", ht, { transform: X }), z = j(e, "ALLOWED_ATTR", gt, { transform: X }), Ht = j(e, "ALLOWED_NAMESPACES", Ut, { transform: ce }), Lt = j(e, "ADD_URI_SAFE_ATTR", Rt, {
			transform: X,
			base: Rt
		}), Ft = j(e, "ADD_DATA_URI_TAGS", It, {
			transform: X,
			base: It
		}), q = j(e, "FORBID_CONTENTS", Pt, { transform: X }), _t = j(e, "FORBID_TAGS", D({}), { transform: X }), vt = j(e, "FORBID_ATTR", D({}), { transform: X }), K = x(e, "USE_PROFILES") ? e.USE_PROFILES && typeof e.USE_PROFILES == "object" ? D(e.USE_PROFILES) : e.USE_PROFILES : !1, yt = e.ALLOW_ARIA_ATTR !== !1, bt = e.ALLOW_DATA_ATTR !== !1, xt = e.ALLOW_UNKNOWN_PROTOCOLS || !1, St = e.ALLOW_SELF_CLOSE_IN_ATTR !== !1, H = e.SAFE_FOR_TEMPLATES || !1, U = e.SAFE_FOR_XML !== !1, W = e.WHOLE_DOCUMENT || !1, G = e.RETURN_DOM || !1, Dt = e.RETURN_DOM_FRAGMENT || !1, Ot = e.RETURN_TRUSTED_TYPE || !1, Et = e.FORCE_BODY || !1, kt = e.SANITIZE_DOM !== !1, At = e.SANITIZE_NAMED_PROPS || !1, Mt = e.KEEP_CONTENT !== !1, Nt = e.IN_PLACE || !1, mt = ve(e.ALLOWED_URI_REGEXP) ? e.ALLOWED_URI_REGEXP : Fe, Y = typeof e.NAMESPACE == "string" ? e.NAMESPACE : J, Gt = Ye(e, "MATHML_TEXT_INTEGRATION_POINTS", () => E({}, Wt)), qt = Ye(e, "HTML_INTEGRATION_POINTS", () => E({}, Kt));
		let t = Ye(e, "CUSTOM_ELEMENT_HANDLING", () => h(null));
		if (B = h(null), x(t, "tagNameCheck") && $t(t.tagNameCheck) && (B.tagNameCheck = t.tagNameCheck), x(t, "attributeNameCheck") && $t(t.attributeNameCheck) && (B.attributeNameCheck = t.attributeNameCheck), x(t, "allowCustomizedBuiltInElements") && typeof t.allowCustomizedBuiltInElements == "boolean" && (B.allowCustomizedBuiltInElements = t.allowCustomizedBuiltInElements), m(B), H && (bt = !1), Dt && (G = !0), K && (R = E({}, Te), z = h(null), K.html === !0 && (E(R, ye), E(z, Ee)), K.svg === !0 && (E(R, be), E(z, De), E(z, ke)), K.svgFilters === !0 && (E(R, xe), E(z, De), E(z, ke)), K.mathMl === !0 && (E(R, Ce), E(z, Oe), E(z, ke))), V.tagCheck = null, V.attributeCheck = null, x(e, "ADD_TAGS") && (typeof e.ADD_TAGS == "function" ? V.tagCheck = e.ADD_TAGS : v(e.ADD_TAGS) && (R === ht && (R = D(R)), E(R, e.ADD_TAGS, X))), x(e, "ADD_ATTR") && (typeof e.ADD_ATTR == "function" ? V.attributeCheck = e.ADD_ATTR : v(e.ADD_ATTR) && (z === gt && (z = D(z)), E(z, e.ADD_ATTR, X))), x(e, "ADD_FORBID_CONTENTS") && v(e.ADD_FORBID_CONTENTS) && (q === Pt && (q = D(q)), E(q, e.ADD_FORBID_CONTENTS, X)), Mt && (R["#text"] = !0), W && E(R, [
			"html",
			"head",
			"body"
		]), R.table && (E(R, ["tbody"]), delete _t.tbody), e.TRUSTED_TYPES_POLICY) {
			if (typeof e.TRUSTED_TYPES_POLICY.createHTML != "function") throw w("TRUSTED_TYPES_POLICY configuration option must provide a \"createHTML\" hook.");
			if (typeof e.TRUSTED_TYPES_POLICY.createScriptURL != "function") throw w("TRUSTED_TYPES_POLICY configuration option must provide a \"createScriptURL\" hook.");
			let t = A;
			A = e.TRUSTED_TYPES_POLICY;
			try {
				M = F("");
			} catch (e) {
				throw A = t, e;
			}
		} else e.TRUSTED_TYPES_POLICY === null ? (A = void 0, M = "") : (A === void 0 && (A = et()), A && typeof M == "string" && (M = F("")));
		p && p(e), Zt = e;
	}, tn = E({}, [
		...be,
		...xe,
		...Se
	]), nn = E({}, [...Ce, ...we]), rn = function(e, t, n) {
		return t.namespaceURI === J ? e === "svg" : t.namespaceURI === zt ? e === "svg" && (n === "annotation-xml" || Gt[n]) : !!tn[e];
	}, an = function(e, t, n) {
		return t.namespaceURI === J ? e === "math" : t.namespaceURI === Bt ? e === "math" && qt[n] : !!nn[e];
	}, on = function(e, t, n) {
		return t.namespaceURI === Bt && !qt[n] || t.namespaceURI === zt && !Gt[n] ? !1 : !nn[e] && (Jt[e] || !tn[e]);
	}, sn = function(e) {
		let t = y(e);
		(!t || !t.tagName) && (t = {
			namespaceURI: Y,
			tagName: "template"
		});
		let n = se(e.tagName), r = se(t.tagName);
		return Ht[e.namespaceURI] ? e.namespaceURI === Bt ? rn(n, t, r) : e.namespaceURI === zt ? an(n, t, r) : e.namespaceURI === J ? on(n, t, r) : !!(Yt === "application/xhtml+xml" && Ht[e.namespaceURI]) : !1;
	}, Z = function(e) {
		ae(t.removed, { element: e });
		try {
			y(e).removeChild(e);
		} catch {
			if (te(e), !y(e)) throw w("a node selected for removal could not be detached from its tree and cannot be safely returned; refusing to sanitize in place");
		}
	}, cn = function(e, t, n) {
		try {
			e.removeAttributeNode(t);
		} catch {
			try {
				e.removeAttribute(n);
			} catch {}
		}
	}, ln = function(e) {
		dn(e);
		let t = g(e);
		if (t) {
			let e = [];
			_(t, (t) => {
				ae(e, t);
			}), _(e, (e) => {
				try {
					te(e);
				} catch {}
			});
		}
		let n = me(e);
		if (n) for (let t = n.length - 1; t >= 0; --t) {
			let r = n[t], i = r && r.name;
			typeof i == "string" && cn(e, r, i);
		}
	}, Q = function(e, n, r) {
		if (!r) try {
			r = n.getAttributeNode(e);
		} catch {
			r = null;
		}
		ae(t.removed, {
			attribute: r || null,
			from: n
		});
		try {
			r ? n.removeAttributeNode(r) : n.removeAttribute(e);
		} catch {
			try {
				n.removeAttribute(e);
			} catch {}
		}
		if (e === "is") {
			if (G || Dt) try {
				Z(n);
			} catch {}
			else try {
				n.setAttribute(e, "");
			} catch {}
		}
	}, un = function(e) {
		let t = me(e);
		if (t) for (let n = t.length - 1; n >= 0; --n) {
			let r = t[n], i = r && r.name;
			typeof i != "string" || z[X(i)] || cn(e, r, i);
		}
	}, dn = function(e) {
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop();
			he(e) === k.element && un(e);
			let n = g(e);
			if (n) for (let e = n.length - 1; e >= 0; --e) t.push(n[e]);
		}
	}, fn = function(e, t) {
		return U ? e === "patchsrc" || e === "for" && t !== "label" && t !== "output" : !1;
	}, pn = function(e) {
		if (!U) return;
		let t = [e];
		for (; t.length > 0;) {
			let e = t.pop(), n = he(e);
			if (n === k.processingInstruction || n === k.comment && C(Ve, e.data)) {
				try {
					te(e);
				} catch {}
				continue;
			}
			if (n === k.element) {
				let t = e, n = X(ge(e));
				try {
					t.hasAttribute && t.hasAttribute("patchsrc") && t.removeAttribute("patchsrc"), t.hasAttribute && t.hasAttribute("for") && fn("for", n) && t.removeAttribute("for");
				} catch {}
			}
			let r = g(e);
			if (r) for (let e = r.length - 1; e >= 0; --e) t.push(r[e]);
		}
	}, mn = function(e) {
		let t = null, r = null;
		if (Et) e = "<remove></remove>" + e;
		else {
			let t = le(e, /^[\r\n\t ]+/);
			r = t && t[0];
		}
		Yt === "application/xhtml+xml" && Y === J && (e = "<html xmlns=\"http://www.w3.org/1999/xhtml\"><head></head><body>" + e + "</body></html>");
		let i = A ? F(e) : e;
		if (Y === J) try {
			t = new u().parseFromString(i, Yt);
		} catch {}
		if (!t || !t.documentElement) {
			t = tt.createDocument(Y, "template", null);
			try {
				t.documentElement.innerHTML = Vt ? M : i;
			} catch {}
		}
		let a = t.body || t.documentElement;
		return e && r && a.insertBefore(n.createTextNode(r), a.childNodes[0] || null), Y === J ? it.call(t, W ? "html" : "body")[0] : W ? t.documentElement : a;
	}, hn = function(e) {
		let t = T ? T(e) : e.ownerDocument;
		return nt.call(t || e, e, c.SHOW_ELEMENT | c.SHOW_COMMENT | c.SHOW_TEXT | c.SHOW_PROCESSING_INSTRUCTION | c.SHOW_CDATA_SECTION, null);
	}, gn = function(e) {
		return e = ue(e, ot, " "), e = ue(e, st, " "), e = ue(e, ct, " "), e;
	}, _n = function(e) {
		e.normalize();
		let t = T ? T(e) : e.ownerDocument, n = nt.call(t || e, e, c.SHOW_TEXT | c.SHOW_COMMENT | c.SHOW_CDATA_SECTION | c.SHOW_PROCESSING_INSTRUCTION, null), r = n.nextNode();
		for (; r;) r.data = gn(r.data), r = n.nextNode();
		let i = e.querySelectorAll?.call(e, "template");
		i && _(i, (e) => {
			yn(e.content) && _n(e.content);
		});
	}, vn = function(e) {
		let t = S ? S(e) : null;
		return typeof t != "string" || X(t) !== "form" ? !1 : typeof e.nodeName != "string" || typeof e.textContent != "string" || typeof e.removeChild != "function" || e.attributes !== me(e) || typeof e.removeAttribute != "function" || typeof e.setAttribute != "function" || typeof e.namespaceURI != "string" || typeof e.insertBefore != "function" || typeof e.hasChildNodes != "function" || e.nodeType !== b(e) || e.childNodes !== g(e);
	}, yn = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return b(e) === k.documentFragment;
		} catch {
			return !1;
		}
	}, bn = function(e) {
		if (!b || typeof e != "object" || !e) return !1;
		try {
			return typeof b(e) == "number";
		} catch {
			return !1;
		}
	};
	function $(e, n, r) {
		e.length !== 0 && _(e, (e) => {
			e.call(t, n, r, Zt);
		});
	}
	let xn = function(e, t) {
		return !!(U && e.hasChildNodes() && !bn(e.firstElementChild) && C(Be, e.textContent) && C(Be, e.innerHTML) || U && e.namespaceURI === J && We[t] && (bn(e.firstElementChild) || typeof e.textContent == "string" && C(Ge[t], e.textContent)) || e.nodeType === k.processingInstruction || U && e.nodeType === k.comment && C(Ve, e.data));
	}, Sn = function(e, t) {
		return e instanceof RegExp ? C(e, t) : e instanceof Function && !!e(t, ...[...arguments].slice(2));
	}, Cn = function(e, t, n) {
		if (!_t[t] && kn(t) && Sn(B.tagNameCheck, t)) return !1;
		if (Mt && !q[t]) {
			let t = y(e), r = g(e);
			if (r && t) {
				let i = r.length;
				for (let a = i - 1; a >= 0; --a) {
					let i = e === n ? ee(r[a], !0) : r[a];
					t.insertBefore(i, ne(e));
				}
			}
		}
		return Z(e), !0;
	}, wn = function(e, t, n, r) {
		return e.length === 0 ? t : t === n || t === r ? D(t) : t;
	}, Tn = function(e, t) {
		return e === t || y(e) !== null ? !1 : (Nt && dn(e), !0);
	}, En = function(e, n) {
		if ($(L.beforeSanitizeElements, e, null), Tn(e, n)) return !0;
		if (vn(e)) return Z(e), !0;
		let r = X(ge(e));
		if (R = wn(L.uponSanitizeElement, R, ht, wt), $(L.uponSanitizeElement, e, {
			tagName: r,
			allowedTags: R
		}), Tn(e, n)) return !0;
		if (xn(e, r)) return Z(e), !0;
		if (_t[r] || !(V.tagCheck instanceof Function && V.tagCheck(r)) && !R[r]) {
			let t = Cn(e, r, n);
			return t === !1 && $(L.afterSanitizeElements, e, null), t;
		}
		if (he(e) === k.element && !sn(e) || (r === "noscript" || r === "noembed" || r === "noframes") && C(He, e.innerHTML)) return Z(e), !0;
		if (H && e.nodeType === k.text) {
			let n = gn(e.textContent);
			e.textContent !== n && (ae(t.removed, { element: e.cloneNode() }), e.textContent = n);
		}
		return $(L.afterSanitizeElements, e, null), !1;
	}, Dn = function(e, t, r) {
		if (vt[t] || fn(t, e) || kt && (t === "id" || t === "name") && (r in n || r in Qt)) return !1;
		let i = z[t] || V.attributeCheck instanceof Function && V.attributeCheck(t, e);
		return bt && C(lt, t) || yt && C(ut, t) ? !0 : i ? Lt[t] || C(mt, ue(r, ft, "")) || (t === "src" || t === "xlink:href" || t === "href") && e !== "script" && de(r, "data:") === 0 && Ft[e] || xt && !C(dt, ue(r, ft, "")) ? !0 : !r : kn(e) && Sn(B.tagNameCheck, e) && Sn(B.attributeNameCheck, t, e) || t === "is" && B.allowCustomizedBuiltInElements && Sn(B.tagNameCheck, r);
	}, On = E({}, [
		"annotation-xml",
		"color-profile",
		"font-face",
		"font-face-format",
		"font-face-name",
		"font-face-src",
		"font-face-uri",
		"missing-glyph"
	]), kn = function(e) {
		return !On[se(e)] && C(pt, e);
	}, An = function(e, t, n, r) {
		if (A && typeof d == "object" && typeof d.getAttributeType == "function" && !n) switch (d.getAttributeType(e, t)) {
			case "TrustedHTML": return F(r);
			case "TrustedScriptURL": return $e(r);
		}
		return r;
	}, jn = function(e, n, r, i) {
		try {
			r ? e.setAttributeNS(r, n, i) : e.setAttribute(n, i), vn(e) ? Z(e) : ie(t.removed);
		} catch {
			Q(n, e);
		}
	}, Mn = function(e) {
		$(L.beforeSanitizeAttributes, e, null);
		let t = e.attributes;
		if (!t || vn(e)) return;
		z = wn(L.uponSanitizeAttribute, z, gt, Tt);
		let n = {
			attrName: "",
			attrValue: "",
			keepAttr: !0,
			allowedAttributes: z,
			forceKeepAttr: void 0
		}, r = t.length, i = X(e.nodeName);
		for (; r--;) {
			let a = t[r], o = a.name, s = a.namespaceURI, c = a.value, l = X(o), u = c, d = o === "value" ? u : fe(u);
			if (n.attrName = l, n.attrValue = d, n.keepAttr = !0, n.forceKeepAttr = void 0, $(L.uponSanitizeAttribute, e, n), d = n.attrValue, At && (l === "id" || l === "name") && de(d, jt) !== 0 && (Q(o, e, a), d = jt + d), U && C(/((--!?|])>)|<\/(style|script|title|xmp|textarea|noscript|iframe|noembed|noframes)/i, d)) {
				Q(o, e, a);
				continue;
			}
			if (l === "attributename" && le(d, "href")) {
				Q(o, e, a);
				continue;
			}
			if (!n.forceKeepAttr) {
				if (!n.keepAttr) {
					Q(o, e, a);
					continue;
				}
				if (!St && C(Ue, d)) {
					Q(o, e, a);
					continue;
				}
				if (H && (d = gn(d)), !Dn(i, l, d)) {
					Q(o, e, a);
					continue;
				}
				d = An(i, l, s, d), d !== u && jn(e, o, s, d);
			}
		}
		$(L.afterSanitizeAttributes, e, null);
	}, Nn = function(e) {
		let t = null, n = hn(e);
		for ($(L.beforeSanitizeShadowDOM, e, null); t = n.nextNode();) if ($(L.uponSanitizeShadowNode, t, null), En(t, e), Mn(t), yn(t.content) && Nn(t.content), he(t) === k.element) {
			let e = pe(t);
			yn(e) && (Pn(e), Nn(e));
		}
		$(L.afterSanitizeShadowDOM, e, null);
	}, Pn = function(e) {
		let t = [{
			node: e,
			shadow: null
		}];
		for (; t.length > 0;) {
			let e = t.pop();
			if (e.shadow) {
				Nn(e.shadow);
				continue;
			}
			let n = e.node, r = he(n) === k.element, i = g(n);
			if (i) for (let e = i.length - 1; e >= 0; --e) t.push({
				node: i[e],
				shadow: null
			});
			if (r) {
				let e = S ? S(n) : null;
				if (typeof e == "string" && X(e) === "template") {
					let e = n.content;
					yn(e) && t.push({
						node: e,
						shadow: null
					});
				}
			}
			if (r) {
				let e = pe(n);
				yn(e) && t.push({
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
		if (Vt = !e, Vt && (e = "<!-->"), typeof e != "string" && !bn(e) && (e = _e(e), typeof e != "string")) throw w("dirty is not a string, aborting");
		if (!t.isSupported) return e;
		Ct ? (R = wt, z = Tt) : en(n), (L.uponSanitizeElement.length > 0 || L.uponSanitizeAttribute.length > 0) && (R = D(R)), L.uponSanitizeAttribute.length > 0 && (z = D(z)), t.removed = [];
		let c = Nt && typeof e != "string" && bn(e);
		if (c) {
			pn(e);
			let t = ge(e);
			if (typeof t == "string") {
				let n = X(t);
				if (!R[n] || _t[n]) throw ln(e), w("root node is forbidden and cannot be sanitized in-place");
			}
			if (vn(e)) throw ln(e), w("root node is clobbered and cannot be sanitized in-place");
			try {
				Pn(e);
			} catch (t) {
				throw ln(e), t;
			}
		} else if (bn(e)) i = mn("<!---->"), a = i.ownerDocument.importNode(e, !0), a.nodeType === k.element && a.nodeName === "BODY" || a.nodeName === "HTML" ? i = a : i.appendChild(a), Pn(a);
		else {
			if (!G && !H && !W && e.indexOf("<") === -1) return A && Ot ? F(e) : e;
			if (i = mn(e), !i) return G ? null : Ot ? M : "";
		}
		i && Et && Z(i.firstChild);
		let l = c ? e : i;
		try {
			let e = hn(l);
			for (; o = e.nextNode();) En(o, l), Mn(o), yn(o.content) && Nn(o.content);
		} catch (n) {
			throw c && (ln(e), _(t.removed, (e) => {
				e.element && dn(e.element);
			})), n;
		}
		if (c) return _(t.removed, (e) => {
			e.element && dn(e.element);
		}), H && _n(e), e;
		if (G) {
			if (H && _n(i), Dt) for (s = rt.call(i.ownerDocument); i.firstChild;) s.appendChild(i.firstChild);
			else s = i;
			return (z.shadowroot || z.shadowrootmode) && (s = at.call(r, s, !0)), s;
		}
		let u = W ? i.outerHTML : i.innerHTML;
		return W && R["!doctype"] && i.ownerDocument && i.ownerDocument.doctype && i.ownerDocument.doctype.name && C(Re, i.ownerDocument.doctype.name) && (u = "<!DOCTYPE " + i.ownerDocument.doctype.name + ">\n" + u), H && (u = gn(u)), A && Ot ? F(u) : u;
	}, t.setConfig = function() {
		let e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
		en(e), Ct = !0, wt = R, Tt = z;
	}, t.clearConfig = function() {
		Zt = null, Ct = !1, wt = null, Tt = null, A = Ze, M = "";
	}, t.isValidAttribute = function(e, t, n) {
		Zt || en({});
		let r = X(e), i = X(t);
		return Dn(r, i, n);
	}, t.addHook = function(e, t) {
		typeof t == "function" && x(L, e) && ae(L[e], t);
	}, t.removeHook = function(e, t) {
		if (x(L, e)) {
			if (t !== void 0) {
				let n = re(L[e], t);
				return n === -1 ? void 0 : oe(L[e], n, 1)[0];
			}
			return ie(L[e]);
		}
	}, t.removeHooks = function(e) {
		x(L, e) && (L[e] = []);
	}, t.removeAllHooks = function() {
		L = Je();
	}, t;
}
var M = Xe();
//#endregion
//#region src/render.ts
function Ze(e, t, n) {
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
async function Qe(t) {
	let { container: n, width: r, height: i } = t, a = M.sanitize(t.svg, {
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
	return t.format === "png" ? (l = await Ze(c, r, i), u = "png") : (l = c, u = "svg"), s.src = l, s.alt = "Handwritten signature", s.decoding = "async", s.style.display = "block", s.style.width = o.width, s.style.height = o.height, s.style.maxWidth = "100%", s.style.maxHeight = "100%", s.style.objectFit = o.objectFit, s.style.objectPosition = o.objectPosition, s.style.margin = "auto", s.style.position = "absolute", s.style.inset = "0", n.appendChild(s), {
		image: s,
		dataUrl: l,
		format: u
	};
}
function N(e, t) {
	e.classList.add("signdo-signature-field"), e.style.width = `${t.width}px`, e.style.height = `${t.height}px`, e.replaceChildren();
	let n = document.createElement("div");
	n.setAttribute("role", "group"), n.setAttribute("aria-label", "Sign with your phone"), Object.assign(n.style, {
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
	let r = document.createElement("div");
	r.innerHTML = M.sanitize(t.qrSvg, { USE_PROFILES: { svg: !0 } });
	let i = r.querySelector("svg");
	i && (i.style.width = `${Math.min(t.height - 16, 120)}px`, i.style.height = "auto", i.style.display = "block");
	let a = document.createElement("div"), o = document.createElement("strong");
	o.textContent = "Scan to sign";
	let s = document.createElement("div");
	s.textContent = "Point your phone camera at the code.", s.style.color = "var(--signdo-muted, #666)";
	let c = document.createElement("a");
	c.href = t.qrUrl, c.textContent = "Open signing link", c.rel = "noopener", c.target = "_blank", c.style.color = "var(--signdo-link, #0b57d0)";
	let l = document.createElement("div");
	l.textContent = `Code: ${t.pairingCode}`, l.style.cssText = "font-family:ui-monospace,monospace;letter-spacing:.05em;color:var(--signdo-muted, #666)", a.append(o, s, c, l), n.append(r, a), e.appendChild(n);
}
//#endregion
//#region src/index.ts
var P = "signdo:tx:", F = "";
function $e(e) {
	let t = typeof e == "string" ? document.querySelector(e) : e;
	if (!t) throw Error(`Signdo: element not found: ${String(e)}`);
	return t;
}
function et() {
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
		this.config = e, this.options = t, this.element = $e(t.element), this.currentWidth = t.width, this.currentHeight = t.height;
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
		if (this.destroyed) throw Error("Signdo: field has been destroyed");
		if (await this.tryRecover()) return;
		let e = await fetch(this.api("/v1/signature-transactions"), {
			method: "POST",
			headers: {
				"content-type": "application/json",
				authorization: `Bearer ${this.config.publicKey}`,
				"idempotency-key": `${et()}:${this.options.fieldId ?? this.options.element}`
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
				browserSessionId: et(),
				documentLabel: this.options.documentLabel
			})
		});
		if (!e.ok) {
			let t = await e.json().catch(() => ({}));
			throw this.emit("error", t), Error(`Signdo: could not start signing (${e.status})`);
		}
		let t = await e.json();
		if (!t.qrUrl || !t.pairingCode) {
			sessionStorage.removeItem(`${P}${this.recoveryKey()}`);
			let e = await fetch(this.api("/v1/signature-transactions"), {
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
					browserSessionId: et(),
					documentLabel: this.options.documentLabel
				})
			});
			if (!e.ok) throw this.emit("error", await e.json().catch(() => ({}))), Error(`Signdo: could not restart signing (${e.status})`);
			Object.assign(t, await e.json());
		}
		this.transactionId = t.id, this.channelToken = t.channelToken, sessionStorage.setItem(`${P}${this.recoveryKey()}`, JSON.stringify({
			id: t.id,
			channelToken: t.channelToken
		})), N(this.element, {
			qrSvg: t.qrSvg,
			qrUrl: t.qrUrl,
			pairingCode: t.pairingCode,
			width: this.options.width,
			height: this.options.height
		}), this.emit("ready", {
			transactionId: t.id,
			qrUrl: t.qrUrl,
			pairingCode: t.pairingCode
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
			return this.transactionId = t, this.channelToken = n, i.signature ? await this.applySignature(i) : N(this.element, {
				qrSvg: "",
				qrUrl: "",
				pairingCode: "",
				width: this.options.width,
				height: this.options.height
			}), this.listen(), !0;
		} catch {
			return sessionStorage.removeItem(`${P}${this.recoveryKey()}`), !1;
		}
	}
	listen() {
		!this.transactionId || !this.channelToken || (this.transport = new n({
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
		let n = await Qe({
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
		!this.transactionId || !this.channelToken || (await fetch(this.api(`/v1/signature-transactions/${this.transactionId}/cancel`), {
			method: "POST",
			headers: { "x-signdo-channel-token": this.channelToken }
		}).catch(() => {}), this.emit("cancelled", { transactionId: this.transactionId }), this.destroy());
	}
	destroy() {
		this.destroyed = !0, this.transport?.close(), this.transport = null, this.listeners.clear();
	}
}, tt = new class {
	config = null;
	init(e) {
		if (e.publicKey.startsWith("sk_")) throw Error("Signdo: never use a secret key (sk_) in browser code. Use your pk_ key.");
		let t = e.apiBase ?? F;
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
		return e.autoOpen !== !1 && t.open(), t;
	}
	createSignature(e) {
		let t = new I(this.requireConfig(), {
			...e,
			element: e.container ?? e.element
		}), n = new Promise((e, n) => {
			t.on("completed", e), t.on("error", n), t.on("expired", () => n(/* @__PURE__ */ Error("Signdo: signing session expired"))), t.on("cancelled", () => n(/* @__PURE__ */ Error("Signdo: signing session cancelled")));
		});
		return t.open(), Object.assign(n, { field: t });
	}
	createField = (e) => this.createSignatureField(e);
}();
//#endregion
export { I as SignatureField, tt as Signdo, tt as default };
typeof globalThis < "u" && (globalThis.Signdo = globalThis.Signdo.Signdo || globalThis.Signdo);

//# sourceMappingURL=signdo.esm.js.map