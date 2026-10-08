import { i as __toESM } from "../_runtime.mjs";
import { J as require_react, x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Info } from "../_libs/lucide-react.mjs";
import { a as useInfo } from "./router-B4AT-FTg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marks-741WmyKR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TeamMark({ abbrev, logo, size = "md" }) {
	const [bad, setBad] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: size === "lg" ? "mark mark-lg" : size === "sm" ? "mark mark-sm" : "mark",
		"aria-hidden": "true",
		children: !bad && logo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: logo,
			alt: "",
			width: 64,
			height: 64,
			onError: () => setBad(true)
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mark-fallback",
			children: abbrev
		})
	});
}
function Move({ n }) {
	if (n == null || n === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "move flat",
		children: "–"
	});
	if (n > 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "move up",
		children: ["+", n]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "move down",
		children: n
	});
}
function InfoBtn({ id, label }) {
	const open = useInfo();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "info-btn",
		"aria-label": `What ${label ?? id} means`,
		onClick: () => open(id),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { strokeWidth: 2.5 })
	});
}
//#endregion
export { Move as n, TeamMark as r, InfoBtn as t };
