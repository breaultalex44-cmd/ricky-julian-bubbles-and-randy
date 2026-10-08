import { x as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as shortDay, o as useLeague } from "./router-B4AT-FTg.mjs";
import { t as Shell } from "./shell-DB4Uh-Wv.mjs";
import { t as InfoBtn } from "./marks-741WmyKR.mjs";
import { t as addDays } from "./pull-BBUeCpIN.mjs";
import { t as GameRow } from "./game-row-D5UQvwIC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/schedule-BBxabLj5.js
var import_jsx_runtime = require_jsx_runtime();
function Schedule() {
	const { data } = useLeague();
	const days = [
		0,
		1,
		2,
		3
	].map((n) => addDays(data.asOf, n));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Shell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "section-head",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", { children: "Next 3 days" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InfoBtn, {
				id: "WIN",
				label: "win probability"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "legend",
			children: [
				"Today through ",
				shortDay(days[3], data.asOf),
				". The percent is the fair win chance after the book's cut is removed. Open a game for the projected lineup."
			]
		}),
		days.map((date) => {
			const games = data.games.filter((g) => g.date === date);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "picker-label",
				children: shortDay(date, data.asOf)
			}), games.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "muted-block",
				children: "No games."
			}) : games.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GameRow, { game: g }, g.id))] }, date);
		})
	] });
}
//#endregion
export { Schedule as component };
