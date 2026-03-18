import { j as jsxRuntimeExports } from './jsx-runtime-DcKByZ1S.js';
import { r as reactExports } from './index-SSqDsBzL.js';

function Carousel({ items, autoPlayInterval = 4e3 }) {
  const [current, setCurrent] = reactExports.useState(0);
  const goTo = reactExports.useCallback((index) => {
    setCurrent((index % items.length + items.length) % items.length);
  }, [items.length]);
  reactExports.useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), autoPlayInterval);
    return () => clearInterval(timer);
  }, [current, autoPlayInterval, goTo]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex transition-transform duration-500 ease-in-out",
        style: { transform: `translateX(-${current * 100}%)` },
        children: items.map((item, i) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full flex-shrink-0 px-4", children: item }, i))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center mt-6 space-x-2", children: items.map((_, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: () => goTo(i),
        "aria-label": `Slide ${i + 1}`,
        className: `w-3 h-3 rounded-full transition ${i === current ? "bg-blue-800" : "bg-blue-300"}`
      },
      i
    )) })
  ] });
}

export { Carousel as default };
//# sourceMappingURL=Carousel-KILtoiAY.js.map
