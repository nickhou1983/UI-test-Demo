const fa = require("react-icons/fa");
const md = require("react-icons/md");
const bi = require("react-icons/bi");
const si = require("react-icons/si");
const hi = require("react-icons/hi");

const needed = {
  "fa.FaReact": fa.FaReact, "fa.FaGithub": fa.FaGithub, "fa.FaGlobe": fa.FaGlobe,
  "fa.FaLayerGroup": fa.FaLayerGroup, "fa.FaCheckCircle": fa.FaCheckCircle,
  "fa.FaCloud": fa.FaCloud, "fa.FaCode": fa.FaCode, "fa.FaShieldAlt": fa.FaShieldAlt,
  "fa.FaCogs": fa.FaCogs, "fa.FaSearch": fa.FaSearch, "fa.FaEye": fa.FaEye,
  "fa.FaRobot": fa.FaRobot, "fa.FaSitemap": fa.FaSitemap,
  "fa.FaProjectDiagram": fa.FaProjectDiagram, "fa.FaChartBar": fa.FaChartBar,
  "fa.FaRocket": fa.FaRocket, "fa.FaBrain": fa.FaBrain,
  "md.MdLanguage": md.MdLanguage, "md.MdDevices": md.MdDevices,
  "md.MdDashboard": md.MdDashboard, "md.MdTimeline": md.MdTimeline,
  "md.MdArchitecture": md.MdArchitecture, "md.MdAutoFixHigh": md.MdAutoFixHigh,
  "bi.BiTestTube": bi.BiTestTube,
  "si.SiTypescript": si.SiTypescript, "si.SiVite": si.SiVite, "si.SiTailwindcss": si.SiTailwindcss,
  "hi.HiOutlineEye": hi.HiOutlineEye,
};

const missing = Object.entries(needed).filter(([k, v]) => !v).map(([k]) => k);
if (missing.length) { console.log("MISSING:", missing.join(", ")); }
else { console.log("ALL OK"); }
