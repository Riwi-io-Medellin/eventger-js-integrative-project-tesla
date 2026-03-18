import { getSession } from "../utils/session.js";

const NAV_ITEMS = [
  {
    label: "Muro",
    href: "#/muro",
    icon: "fa-newspaper",
    roles: ["admin_gen", "admin_spa", "event_creator", "visualizer"],
  },
  {
    label: "Dashboard",
    href: "#/dashboard",
    icon: "fa-chart-line",
    roles: ["admin_gen", "admin_spa", "event_creator", "visualizer"],
  },
  {
    label: "Eventos",
    href: "#/eventos",
    icon: "fa-calendar-check",
    roles: ["admin_gen", "admin_spa", "event_creator"],
  },
  {
    label: "Espacios",
    href: "#/espacios",
    icon: "fa-location-dot",
    roles: ["admin_gen", "admin_spa"],
  },
  {
    label: "Escenarios",
    href: "#/escenarios",
    icon: "fa-building",
    roles: ["admin_gen", "admin_spa"],
  },
  {
    label: "Usuarios",
    href: "#/usuarios",
    icon: "fa-users",
    roles: ["admin_gen"],
  },
  {
    label: "Perfil",
    href: "#/perfil",
    icon: "fa-user",
    roles: ["admin_gen", "admin_spa", "event_creator", "visualizer"],
  },
];

export default function Sidebar() {
  const session = getSession();
  const role = session?.role || "visualizer";

  const visible =
    role === "admin_gen"
      ? NAV_ITEMS
      : NAV_ITEMS.filter((item) => item.roles.includes(role));

  const currentHash = window.location.hash || "#/";
  const links = visible
    .map((item) => {
      const isActive =
        item.href === "#/"
          ? currentHash === "#/" || currentHash === "#"
          : currentHash.startsWith(item.href);
      const activeClass = isActive ? "bg-secondary text-white" : "";
      return `
        <a href="${item.href}" data-link
           class="menu-item px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-3 ${activeClass}">
            <i class="fa-solid ${item.icon}"></i>
            <span class="menu-text">${item.label}</span>
        </a>`;
    })
    .join("");

  return `
    <div class="relative">
        <aside id="sidebar" class="w-64 h-full bg-primary text-white flex flex-col items-center transition-all duration-300">

            <div class="h-16 w-full flex items-center justify-center mb-5 mt-5">
                <img id="logoFull" src="./public/images/logo.png" class="mr-8 h-[8rem]">
                <img id="logoSmall" src="./public/images/RoundedLogo.png" class="h-12 hidden">
            </div>

            <nav class="flex flex-col p-4 gap-4 w-full">
                ${links}
            </nav>

        </aside>

        <button id="toggleSidebar"
            class="absolute top-6 -right-3 bg-white text-gray-700 rounded-full w-7 h-7 shadow flex items-center justify-center">
            <i class="fa-solid fa-angle-left"></i>
        </button>
    </div>
    `;
}
