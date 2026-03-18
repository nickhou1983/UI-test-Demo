import { j as jsxRuntimeExports } from './jsx-runtime-DcKByZ1S.js';
import { u as useTranslation } from './index-SSqDsBzL.js';
import SearchBar from './SearchBar-DZm_TicZ.js';

const regions = ["asia", "europe", "north-america", "south-america", "africa", "oceania"];
const types = ["beach", "mountain", "city", "culture"];
function FilterBar({ keyword, region, type, onKeywordChange, onRegionChange, onTypeChange }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SearchBar, { value: keyword, onChange: onKeywordChange, placeholder: t("destinations.search") }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        value: region,
        onChange: (e) => onRegionChange(e.target.value),
        "aria-label": t("destinations.region"),
        className: "px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("destinations.region") }),
          regions.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: r, children: t(`filter.${r}`) }, r))
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "select",
      {
        value: type,
        onChange: (e) => onTypeChange(e.target.value),
        "aria-label": t("destinations.type"),
        className: "px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-700 focus:border-blue-500 focus:outline-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: t("destinations.type") }),
          types.map((tp) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: tp, children: t(`filter.${tp}`) }, tp))
        ]
      }
    )
  ] });
}

export { FilterBar as default };
//# sourceMappingURL=FilterBar-YMeVGf3B.js.map
