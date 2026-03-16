export default function Sidebar() {

    const path = window.location.pathname;
    const active = "bg-secondary text-white";

    return `
    <div class="relative">

        <aside id="sidebar" class="w-64 h-full bg-primary text-white flex flex-col items-center transition-all duration-300">

            <div class="h-16 w-full flex items-center justify-center mb-5 mt-5">

                <img id="logoFull" src="/public/images/logo.png" class="mr-8 h-[8rem]">

                <img id="logoSmall" src="/public/images/RoundedLogo.png" class="h-12 hidden">

            </div>

            <nav class="flex flex-col p-4 gap-4 w-full">

                <a href="/" data-link
                class="menu-item px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-3 ${path === "/" ? active : ""}">
                    <i class="fa-solid fa-newspaper"></i>
                    <span class="menu-text">Muro</span>
                </a>

                <a href="/dashboard" data-link
                class="menu-item px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-3 ${path === "/dashboard" ? active : ""}">
                    <i class="fa-solid fa-chart-line"></i>
                    <span class="menu-text">Dashboard</span>
                </a>

                <a href="/eventos" data-link
                class="menu-item px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-3 ${path === "/eventos" ? active : ""}">
                    <i class="fa-solid fa-calendar-check"></i>
                    <span class="menu-text">Eventos</span>
                </a>

                <a href="/usuarios" data-link
                class="menu-item px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-3 ${path === "/usuarios" ? active : ""}">
                    <i class="fa-solid fa-users"></i>
                    <span class="menu-text">Usuarios</span>
                </a>

                <a href="/perfil" data-link
                class="menu-item px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-3 ${path === "/perfil" ? active : ""}">
                    <i class="fa-solid fa-user"></i>
                    <span class="menu-text">Perfil</span>
                </a>

            </nav>

        </aside>

        <button id="toggleSidebar"
        class="absolute top-6 -right-3 bg-white text-gray-700 rounded-full w-7 h-7 shadow flex items-center justify-center">
            <i class="fa-solid fa-angle-left"></i>
        </button>

    </div>
    `
}