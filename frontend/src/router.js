import Home from "./pages/home.js";
import Dashboard from "./pages/dashboard.js";
import Eventos from "./pages/eventos.js";
import Usuarios from "./pages/usuarios.js";
import Perfil from "./pages/perfil.js";

const routes = {
    "/": Home,
    "/dashboard": Dashboard,
    "/eventos": Eventos,
    "/usuarios": Usuarios,
    "/perfil": Perfil
};

export function router() {

    const path = window.location.pathname;

    const page = routes[path] || Home;

    document.querySelector("#app").innerHTML = page();

}