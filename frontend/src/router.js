import Home      from "./pages/home.js";
import Dashboard from "./pages/dashboard.js";
import Eventos   from "./pages/event.js";
import { initUsuarios } from "./pages/usuarios.js";
import Perfil    from "./pages/profile.js";
import { initSpaces } from "./pages/spaces.js";
import { initEscenarios } from "./pages/escenarios.js";
import { initLogin }    from "./pages/login.js";
import { initRegister } from "./pages/register.js";
import { initNotFound } from "./pages/notFound.js";
import { getSession, clearSession } from "./utils/session.js";

// null = pública | array = roles permitidos (admin_gen siempre pasa)
const ROUTES = {
    "/muro":           { handler: Home,          roles: null },
    "/dashboard":  { handler: Dashboard,     roles: ['admin_gen','admin_spa','event_creator','visualizer'] },
    "/eventos":    { handler: Eventos,       roles: ['admin_gen','admin_spa','event_creator'] },
    "/usuarios":   { handler: initUsuarios,  roles: ['admin_gen'] },
    "/perfil":     { handler: Perfil,        roles: ['admin_gen','admin_spa','event_creator','visualizer'] },
    "/espacios":   { handler: initSpaces,    roles: ['admin_gen','admin_spa'] },
    "/escenarios": { handler: initEscenarios, roles: ['admin_gen','admin_spa'] },
    "/login":      { handler: initLogin,     roles: null },
    "/register":   { handler: initRegister,  roles: null },
};

// Extrae la ruta del hash: "#/dashboard" → "/dashboard", "" o "#/" → "/"
function getPath() {
    const hash = window.location.hash;
    if (!hash || hash === "#" || hash === "#/") return "/";
    return hash.slice(1); // quita el "#"
}

export function navigate(path) {
    window.location.hash = path === "/" ? "#/" : "#" + path;
}

export async function router() {
    const path    = getPath();
    const session = getSession();
    const role    = session?.role || null;

    // Ruta raíz → redirigir según sesión
    if (path === "/") {
        navigate(session ? "/dashboard" : "/login");
        return;
    }

    const route = ROUTES[path];

    // Ruta no encontrada → 404
    if (!route) {
        initNotFound();
        return;
    }

    // Usuario ya logueado intenta ir a login/register → dashboard
    if (session && (path === "/login" || path === "/register")) {
        navigate("/dashboard");
        return;
    }

    // Ruta protegida sin sesión → login
    if (route.roles !== null && !session) {
        navigate("/login");
        return;
    }

    // Ruta protegida sin permiso → si el rol no existe o no está permitido, limpiamos la sesión
    // y mandamos al login. Esto evita el bucle infinito cuando la sesión tiene datos incorrectos.
    if (route.roles !== null && role !== 'admin_gen' && !route.roles.includes(role)) {
        clearSession(); // borramos los datos corruptos del localStorage
        navigate("/login");
        return;
    }

    // Ejecutar página
    const result = await route.handler();

    // Si devuelve HTML → el router lo inyecta; si es void → la página lo gestiona sola
    if (typeof result === "string") {
        document.querySelector("#app").innerHTML = result;
    }
}
