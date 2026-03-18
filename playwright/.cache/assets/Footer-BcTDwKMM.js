import { j as jsxRuntimeExports } from './jsx-runtime-DcKByZ1S.js';
import { L as Link } from './index-ZrgOVYMs.js';
import { u as useTranslation } from './index-SSqDsBzL.js';

function Footer() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("footer", { className: "bg-blue-900 text-blue-100 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-xl font-bold text-white mb-3", children: t("footer.brand") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-blue-300 text-sm", children: t("footer.desc") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-white mb-3", children: t("footer.links") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "hover:text-emerald-300 transition", children: t("nav.home") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/destinations", className: "hover:text-emerald-300 transition", children: t("nav.destinations") }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/about", className: "hover:text-emerald-300 transition", children: t("nav.about") }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h4", { className: "font-semibold text-white mb-3", children: t("footer.social") }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-6 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-emerald-300 cursor-pointer transition", children: t("footer.social.weibo") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-emerald-300 cursor-pointer transition", children: t("footer.social.wechat") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hover:text-emerald-300 cursor-pointer transition", children: t("footer.social.instagram") })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-blue-800 text-center text-blue-400 text-sm", children: t("footer.copyright") })
  ] });
}

export { Footer as default };
//# sourceMappingURL=Footer-BcTDwKMM.js.map
