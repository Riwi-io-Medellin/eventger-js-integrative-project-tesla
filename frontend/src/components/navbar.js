import { getSession, getInitials, getRoleName, clearSession } from '../utils/session.js';
import { getNotifications } from '../services/api.js';

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

    setTimeout(async () => {
        document.getElementById('navbar-logout-btn')?.addEventListener('click', () => {
            clearSession();
            window.location.hash = '#/login';
        });

        if (session?.id) {
            try {
                const notifications = await getNotifications(session.id);
                const unread = (notifications || []).filter(n => !n.is_read).length;
                const badge = document.getElementById('notif-badge');
                if (badge) {
                    if (unread > 0) {
                        badge.textContent = unread > 9 ? '9+' : String(unread);
                        badge.style.display = 'flex';
                    } else {
                        badge.style.display = 'none';
                    }
                }
            } catch {
                const badge = document.getElementById('notif-badge');
                if (badge) badge.style.display = 'none';
            }
        }
    }, 0);

    return `
    <nav class="flex pl-5 w-full h-16 justify-between items-center border-b border-gray-200 bg-white">

        <div class="flex items-center mr-6 gap-4 ml-auto">

            <button class="relative text-gray-500 hover:text-gray-700 transition-colors" title="Notificaciones">
                <i class="fa-regular fa-bell text-lg"></i>
                <span id="notif-badge" class="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center" style="display:none;">0</span>
            </button>

            <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                    ${initials || `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`}
                </div>

                <div class="flex flex-col leading-tight">
                    <h2 class="text-sm font-semibold text-gray-800">${shortName}</h2>
                    <p class="text-xs text-gray-500">${roleName}</p>
                </div>

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
