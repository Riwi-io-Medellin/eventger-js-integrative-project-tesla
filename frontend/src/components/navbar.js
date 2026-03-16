export default function Navbar () {

    setTimeout(() => {

        const search = document.getElementById("search")

        if(search){

            search.addEventListener("input", (e) => {

                const value = e.target.value.toLowerCase()

                window.dispatchEvent(
                    new CustomEvent("searchEvents", {
                        detail: value
                    })
                )

            })

        }

    },0)

    return `
        <nav class="flex pl-5 w-full h-16 justify-between items-center border-b border-gray-300">
        <div class="relative w-full max-w-md">

    <i class="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-700"></i>

    <input
        id="search"
        type="text"
        placeholder="Buscar eventos, espacios..."
        class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
    >

</div>

<div class="flex items-center mr-12 gap-3">

<i class="fa-regular fa-bell w-5"></i>

<div class="flex items-center gap-2">

<img 
class="rounded-full w-8 h-8 object-cover" 
src="/public/images/avatar.webp" 
alt="avatar">

<div class="flex flex-col leading-tight">

<h2 class="text-sm font-semibold">
Jhon C.
</h2>

<p class="text-xs text-gray-500">
Admin
</p>

</div>

</div>

</div>
</nav>
`
}