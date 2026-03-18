import { j as jsxRuntimeExports } from './jsx-runtime-DcKByZ1S.js';
import { r as reactExports, u as useTranslation } from './index-SSqDsBzL.js';
import { u as useLocation, L as Link } from './index-ZrgOVYMs.js';

function Navbar() {
  const [menuOpen, setMenuOpen] = reactExports.useState(false);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "zh" ? "en" : "zh");
  };
  const navLinks = [
    { to: "/", label: t("nav.home") },
    { to: "/destinations", label: t("nav.destinations") },
    { to: "/about", label: t("nav.about") }
  ];
  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "bg-blue-800 text-white sticky top-0 z-50 shadow-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-7xl mx-auto px-4 py-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/", className: "text-xl font-bold tracking-wide", children: "TravelVista" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center space-x-8", children: [
        navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          Link,
          {
            to: link.to,
            className: `hover:text-emerald-300 transition ${isActive(link.to) ? "text-emerald-300 font-semibold" : ""}`,
            children: link.label
          },
          link.to
        )),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: toggleLanguage,
            className: "bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-sm transition",
            children: t("nav.lang")
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          className: "md:hidden focus:outline-none",
          onClick: () => setMenuOpen(!menuOpen),
          "aria-label": "Toggle menu",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: menuOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-4 space-y-2", children: [
          navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            Link,
            {
              to: link.to,
              onClick: () => setMenuOpen(false),
              className: `block py-2 hover:text-emerald-300 transition ${isActive(link.to) ? "text-emerald-300 font-semibold" : ""}`,
              children: link.label
            },
            link.to
          )),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => {
                toggleLanguage();
                setMenuOpen(false);
              },
              className: "bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded text-sm transition",
              children: t("nav.lang")
            }
          )
        ] })
      }
    )
  ] });
}

export { Navbar as default };
//# sourceMappingURL=Navbar-DcLJ7ACP.js.map
