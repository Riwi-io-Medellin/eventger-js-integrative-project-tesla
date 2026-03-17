import { getSession, getInitials, getRoleName, clearSession } from '../utils/session.js';

export default function Navbar() {
    const session  = getSession();
    const name     = session?.name || 'Usuario';
    const role     = session?.role || 'visualizer';
    const initials = getInitials(name);
    const roleName = getRoleName(role);
    const shortName = (() => {
        const parts = name.split(' ');
        return parts[0] + (parts[1] ? ' ' + parts[1][0] + '.' : '');
    })();

    setTimeout(() => {
        const search = document.getElementById('search');
        if (search) {
            search.addEventListener('input', (e) => {
                window.dispatchEvent(new CustomEvent('searchEvents', { detail: e.target.value.toLowerCase() }));
            });
        }
        document.getElementById('navbar-logout-btn')?.addEventListener('click', () => {
            clearSession();
            window.location.hash = '#/login';
        });
    }, 0);

    return `
    <nav class="flex pl-5 w-full h-16 justify-between items-center border-b border-gray-200 bg-white">

        <div class="relative w-full max-w-md">
            <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
                id="search"
                type="text"
                placeholder="Buscar eventos, espacios..."
                class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
        </div>

        <div class="flex items-center mr-6 gap-4">

            <button class="relative text-gray-500 hover:text-gray-700 transition-colors">
                <i class="fa-regular fa-bell text-lg"></i>
                <span class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
            </button>

            <div class="flex items-center gap-2.5">
                <!-- Avatar con iniciales -->
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                    ${initials || `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`}
                </div>

                <div class="flex flex-col leading-tight">
                    <h2 class="text-sm font-semibold text-gray-800">${shortName}</h2>
                    <p class="text-xs text-gray-500">${roleName}</p>
                </div>

                <!-- Logout -->
                <button id="navbar-logout-btn"
                    title="Cerrar sesión"
                    class="ml-1 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="17" height="17">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </button>
            </div>

        </div>
    </nav>
    `;
}
