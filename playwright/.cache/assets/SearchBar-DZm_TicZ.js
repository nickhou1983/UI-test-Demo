import { j as jsxRuntimeExports } from './jsx-runtime-DcKByZ1S.js';
import { u as useTranslation } from './index-SSqDsBzL.js';

function SearchBar({ value, onChange, placeholder }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "svg",
      {
        className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400",
        fill: "none",
        stroke: "currentColor",
        viewBox: "0 0 24 24",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "text",
        value,
        onChange: (e) => onChange(e.target.value),
        placeholder: placeholder ?? t("hero.search"),
        className: "search-input w-full pl-10 pr-4 py-3 rounded-full border border-slate-200 focus:border-blue-500 focus:outline-none text-slate-700 bg-white"
      }
    )
  ] });
}

export { SearchBar as default };
//# sourceMappingURL=SearchBar-DZm_TicZ.js.map
