import { router } from "./router.js";

// Interceptar clicks en [data-link] → navegar con hash
document.addEventListener("click", (e) => {

    const link = e.target.closest("[data-link]");

    if (link) {
        e.preventDefault();
        const href = link.getAttribute("href");
        // Convertir pathname a hash: "/dashboard" → "#/dashboard", "/" → "#/"
        const hash = href.startsWith("#") ? href : (href === "/" ? "#/" : "#" + href);
        window.location.hash = hash;
    }

});

// El router escucha cambios de hash
window.addEventListener("hashchange", router);

// Cargar la ruta inicial al arrancar
router();

// Toggle sidebar collapse/expand
document.addEventListener("click", (e) => {

    if (e.target.closest("#toggleSidebar")) {

        const sidebar    = document.querySelector("#sidebar");
        const texts      = document.querySelectorAll(".menu-text");
        const logoFull   = document.querySelector("#logoFull");
        const logoSmall  = document.querySelector("#logoSmall");
        const buttonIcon = document.querySelector("#toggleSidebar i");

        sidebar.classList.toggle("w-64");
        sidebar.classList.toggle("w-20");

        texts.forEach(t => t.classList.toggle("hidden"));

        logoFull?.classList.toggle("hidden");
        logoSmall?.classList.toggle("hidden");

        buttonIcon.classList.toggle("fa-angle-left");
        buttonIcon.classList.toggle("fa-angle-right");

    }

});
