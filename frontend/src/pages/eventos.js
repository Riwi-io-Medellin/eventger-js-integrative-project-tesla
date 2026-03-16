import Sidebar from "../components/sidebar.js";
import Navbar from "../components/navbar.js";

export default function Eventos() {

    return `
    <div class="flex">

        ${Sidebar()}

        <div class="flex-1">

            ${Navbar()}

            <div class="p-10">

                <h1 class="text-3xl font-bold">
                Eventos
                </h1>

            </div>

        </div>

    </div>
    `
}