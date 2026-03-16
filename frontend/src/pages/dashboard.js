import Sidebar from "../components/sidebar.js"
import Navbar from "../components/navbar.js"

export default function Dashboard(){

setTimeout(()=>{
renderCharts()
initFilters()
},0)

return`

<div class="flex w-full min-h-screen">

${Sidebar()}

<div class="flex flex-col flex-1">

${Navbar()}

<main class="flex-1 p-8 bg-gray-100 space-y-8 overflow-x-hidden">


<div class="flex justify-between items-center">

<div>

<h1 class="text-3xl font-bold">
Dashboard
</h1>

<p class="text-gray-500">
Seguimiento de cumplimiento de eventos deportivos
</p>

</div>

<select class="border rounded-lg px-3 py-2 bg-white">

<option>2026</option>
<option>2025</option>

</select>

</div>


<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

${metaCard()}
${completedCard()}
${pendingCard()}
${progressCard()}

</div>


<div class="grid grid-cols-1 xl:grid-cols-2 gap-6">

<div class="bg-white rounded-xl p-6 shadow">

<h2 class="font-semibold mb-2">
Progreso por Departamento
</h2>

<p class="text-sm text-gray-500 mb-5">
Comparación de eventos completados vs pendientes
</p>

<div class="h-[300px]">
<canvas id="departmentChart"></canvas>
</div>

</div>


<div class="bg-white rounded-xl p-6 shadow">

<h2 class="font-semibold mb-2">
Tendencia Mensual
</h2>

<p class="text-sm text-gray-500 mb-5">
Eventos completados por mes
</p>

<div class="h-[300px]">
<canvas id="trendChart"></canvas>
</div>

</div>

</div>



<div class="bg-white rounded-xl p-6 shadow">

<div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

<div>

<h2 class="font-semibold">
Análisis Detallado
</h2>

<p class="text-sm text-gray-500">
Explora el progreso por subgerencia y categoría
</p>

</div>


<div class="flex gap-3">

<select id="subgerenciaSelect" class="border rounded-lg px-3 py-2 bg-white">

<option value="deporte">Recreación y Deporte</option>
<option value="actividad">Actividad Física</option>
<option value="cultural">Eventos Culturales</option>

</select>


<select id="categoriaSelect" class="border rounded-lg px-3 py-2 bg-white">

<option>Fútbol</option>
<option>Baloncesto</option>
<option>Atletismo</option>

</select>

</div>

</div>



<div class="grid grid-cols-1 md:grid-cols-2 gap-6">


<div class="bg-gray-50 rounded-xl p-6">

<h3 class="font-semibold mb-4">
Deportes
</h3>

<div class="flex items-center gap-6">

<div class="w-[140px] h-[140px]">
<canvas id="sportsProgress"></canvas>
</div>

<div>

<p class="text-sm text-gray-500">
Meta
</p>

<p class="font-semibold">
35
</p>

<p class="text-sm text-gray-500 mt-2">
Completados
</p>

<p class="text-green-600 font-semibold">
28
</p>

<p class="text-sm text-gray-500 mt-2">
Pendientes
</p>

<p class="text-red-500 font-semibold">
7
</p>

</div>

</div>

</div>


<div class="bg-gray-50 rounded-xl p-6">

<h3 class="font-semibold mb-4">
Fútbol
</h3>

<div class="flex items-center gap-6">

<div class="w-[140px] h-[140px]">
<canvas id="footballProgress"></canvas>
</div>

<div>

<p class="text-sm text-gray-500">
Meta
</p>

<p class="font-semibold">
25
</p>

<p class="text-sm text-gray-500 mt-2">
Completados
</p>

<p class="text-green-600 font-semibold">
18
</p>

<p class="text-sm text-gray-500 mt-2">
Pendientes
</p>

<p class="text-red-500 font-semibold">
7
</p>

</div>

</div>

</div>


</div>

</div>


</main>

</div>

</div>

`
}



function metaCard(){

return`

<div class="bg-white p-6 rounded-xl shadow">

<div class="flex justify-between items-start">

<div class="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
<i class="fa-solid fa-bullseye text-gray-600"></i>
</div>

<span class="text-xs bg-gray-100 px-2 py-1 rounded">
Año 2026
</span>

</div>

<h2 class="text-3xl font-bold mt-4">
120
</h2>

<p class="text-gray-500 text-sm">
Eventos Meta
</p>

<div class="mt-4 bg-gray-200 h-2 rounded">

<div class="bg-gray-400 h-2 w-full rounded"></div>

</div>

</div>

`

}



function completedCard(){

return`

<div class="bg-white p-6 rounded-xl shadow">

<div class="flex justify-between">

<div class="w-10 h-10 bg-green-100 flex items-center justify-center rounded-lg">
<i class="fa-solid fa-check text-green-600"></i>
</div>

<span class="text-green-600 text-sm font-semibold">
↗ 71%
</span>

</div>

<h2 class="text-3xl font-bold text-green-600 mt-4">
85
</h2>

<p class="text-gray-500 text-sm">
Completados
</p>

<div class="mt-4 bg-gray-200 h-2 rounded">

<div class="bg-green-600 h-2 w-[71%] rounded"></div>

</div>

</div>

`

}



function pendingCard(){

return`

<div class="bg-white p-6 rounded-xl shadow">

<div class="flex justify-between">

<div class="w-10 h-10 bg-red-100 flex items-center justify-center rounded-lg">
<i class="fa-solid fa-clock text-red-500"></i>
</div>

<span class="text-red-500 text-sm font-semibold flex items-center gap-1">
<i class="fa-solid fa-triangle-exclamation"></i>
29%
</span>

</div>

<h2 class="text-3xl font-bold text-red-500 mt-4">
35
</h2>

<p class="text-gray-500 text-sm">
Pendientes
</p>

<div class="mt-4 bg-gray-200 h-2 rounded">

<div class="bg-red-500 h-2 w-[29%] rounded"></div>

</div>

</div>

`

}



function progressCard(){

return`

<div class="bg-white p-6 rounded-xl shadow flex flex-col items-center justify-center">

<div class="w-[120px] h-[120px]">
<canvas id="progressChart"></canvas>
</div>

<p class="text-gray-500 mt-3">
Cumplimiento General
</p>

</div>

`

}



function renderCharts(){

new Chart(document.getElementById("progressChart"),{

type:"doughnut",

data:{
datasets:[{
data:[71,29],
backgroundColor:["#2563eb","#e5e7eb"]
}]
},

options:{
responsive:true,
maintainAspectRatio:false,
cutout:"75%",
plugins:{legend:{display:false}}
}

})


new Chart(document.getElementById("departmentChart"),{

type:"bar",

data:{
labels:["Deportes","Juventud","Turismo","Salud","Educación","Comunidad"],

datasets:[

{
label:"Completados",
data:[28,18,12,10,9,8],
backgroundColor:"#166534"
},

{
label:"Pendientes",
data:[8,6,6,5,5,4],
backgroundColor:"#d1d5db"
}

]

},

options:{
responsive:true,
maintainAspectRatio:false
}

})


new Chart(document.getElementById("trendChart"),{

type:"line",

data:{
labels:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],

datasets:[{

label:"Completados",
data:[8,9,10,8,9,10,8,7,6,5,3,2],
borderColor:"#2563eb",
backgroundColor:"rgba(37,99,235,0.2)",
fill:true,
tension:0.4

}]

},

options:{
responsive:true,
maintainAspectRatio:false
}

})


new Chart(document.getElementById("sportsProgress"),{

type:"doughnut",

data:{
datasets:[{
data:[80,20],
backgroundColor:["#166534","#e5e7eb"]
}]
},

options:{
responsive:true,
maintainAspectRatio:false,
cutout:"70%",
plugins:{legend:{display:false}}
}

})


new Chart(document.getElementById("footballProgress"),{

type:"doughnut",

data:{
datasets:[{
data:[72,28],
backgroundColor:["#2563eb","#e5e7eb"]
}]
},

options:{
responsive:true,
maintainAspectRatio:false,
cutout:"70%",
plugins:{legend:{display:false}}
}

})

}



function initFilters(){

const categorias={

deporte:["Fútbol","Baloncesto","Atletismo","Natación"],

actividad:["Aeróbicos","Yoga","Gimnasia","Crossfit"],

cultural:["Teatro","Música","Danza","Exposiciones"]

}

const sub=document.getElementById("subgerenciaSelect")
const cat=document.getElementById("categoriaSelect")

sub.addEventListener("change",()=>{

const lista=categorias[sub.value]

cat.innerHTML=""

lista.forEach(c=>{

const option=document.createElement("option")
option.textContent=c

cat.appendChild(option)

})

})

}