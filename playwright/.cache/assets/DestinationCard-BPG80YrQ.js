import { j as jsxRuntimeExports } from './jsx-runtime-DcKByZ1S.js';
import { L as Link } from './index-ZrgOVYMs.js';
import { u as useTranslation } from './index-SSqDsBzL.js';

function DestinationCard({ destination }) {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to: `/destinations/${destination.id}`,
      className: "card-hover bg-white rounded-lg shadow-md overflow-hidden block",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-16-10 overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "img",
          {
            src: destination.image,
            alt: t(destination.nameKey),
            className: "w-full h-full object-cover",
            loading: "lazy"
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full", children: t(`filter.${destination.type}`) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg text-blue-800 mt-2", children: t(destination.nameKey) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-emerald-600 mb-1", children: t(destination.countryKey) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-slate-500 text-sm line-clamp-2", children: t(destination.descKey) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center space-x-1 text-sm", children: [
            Array.from({ length: 5 }, (_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: i < destination.stars ? "star-filled" : "star-empty", children: "★" }, i)),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-slate-400 ml-1", children: destination.rating })
          ] })
        ] })
      ]
    }
  );
}

export { DestinationCard as default };
//# sourceMappingURL=DestinationCard-BPG80YrQ.js.map
