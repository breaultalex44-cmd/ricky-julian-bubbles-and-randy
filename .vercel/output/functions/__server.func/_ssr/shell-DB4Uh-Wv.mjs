import { x as require_jsx_runtime, y as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as ListOrdered, n as Stethoscope, o as House, r as RefreshCw, s as CalendarDays } from "../_libs/lucide-react.mjs";
import { o as useLeague } from "./router-B4AT-FTg.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shell-DB4Uh-Wv.js
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		to: "/",
		label: "Home",
		icon: House,
		exact: true
	},
	{
		to: "/ranks",
		label: "Ranks",
		icon: ListOrdered,
		exact: false
	},
	{
		to: "/schedule",
		label: "Slate",
		icon: CalendarDays,
		exact: false
	},
	{
		to: "/injuries",
		label: "Injuries",
		icon: Stethoscope,
		exact: false
	}
];
function Shell({ children }) {
	const { status, refresh, data } = useLeague();
	const stamp = status === "updating" ? "Updating" : status === "live" ? "Live" : status === "offline" ? "Saved" : "Opening";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "phone",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "topbar",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "wordmark",
					children: ["Rinkboard ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "32" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "topbar-sub",
					children: [
						data.season,
						" · lock ",
						data.cycleLock.slice(5),
						" · next ",
						data.nextLock.slice(5)
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					className: "pill",
					onClick: () => refresh(),
					disabled: status === "updating",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: status === "updating" ? "spin" : "" }), stamp]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "deck",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "tabbar",
				"aria-label": "Primary",
				children: TABS.map((tab) => {
					const Icon = tab.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: tab.to,
						activeOptions: { exact: tab.exact },
						className: "tab",
						activeProps: { className: "tab is-active" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { strokeWidth: 2 }), tab.label]
					}, tab.to);
				})
			})
		]
	});
}
//#endregion
export { Shell as t };
