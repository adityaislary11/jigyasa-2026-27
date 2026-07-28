/* ===========================================================
   SentinelLink
   map.js
   Part 1/4
   Map Initialization & Marker Management
=========================================================== */

"use strict";

/* ===========================================================
   MAP CONFIGURATION
=========================================================== */

const MapManager={

    map:null,

    markers:[],

    selectedMarker:null,

    defaultCenter:[26.1445,91.7362],

    defaultZoom:12,

    initialized:false

};

/* ===========================================================
   INCIDENT TYPES
=========================================================== */

const IncidentTypes={

    railway:"Railway",

    flood:"Flood",

    fire:"Fire",

    landslide:"Landslide",

    medical:"Medical",

    accident:"Road Accident",

    shelter:"Shelter"

};

/* ===========================================================
   SAMPLE DATA
=========================================================== */

const DemoMarkers=[

{

id:"MK001",

title:"Railway Crossing",

type:"railway",

lat:26.147,

lng:91.742,

status:"Active"

},

{

id:"MK002",

title:"Flood Alert",

type:"flood",

lat:26.151,

lng:91.731,

status:"Warning"

},

{

id:"MK003",

title:"Emergency Shelter",

type:"shelter",

lat:26.139,

lng:91.726,

status:"Available"

}

];

/* ===========================================================
   INITIALIZE MAP
=========================================================== */

function initializeMap(){

    const container=

    document.getElementById("map");

    if(!container){

        return;

    }

    MapManager.initialized=true;

    container.innerHTML=`
        <div style="
        width:100%;
        height:100%;
        display:flex;
        align-items:center;
        justify-content:center;
        color:#94a3b8;
        font-size:18px;">
        Interactive Map Ready
        </div>
    `;

    console.log("Map initialized.");

}

/* ===========================================================
   MARKER FUNCTIONS
=========================================================== */

function addMarker(marker){

    MapManager.markers.push(marker);

}

function removeMarker(id){

    MapManager.markers=

    MapManager.markers.filter(

    marker=>marker.id!==id

    );

}

function getMarker(id){

    return MapManager.markers.find(

    marker=>marker.id===id

    );

}

function clearMarkers(){

    MapManager.markers=[];

}

function loadDemoMarkers(){

    clearMarkers();

    DemoMarkers.forEach(

    marker=>addMarker(marker)

    );

}

/* ===========================================================
   END PART 1
=========================================================== */
/* ===========================================================
   SentinelLink
   map.js
   Part 2/4
   Marker Rendering & Filtering
=========================================================== */

/* ===========================================================
   MARKER RENDERING
=========================================================== */

function renderMarkers(){

    const list=

    document.getElementById("markerList");

    if(!list)return;

    list.innerHTML="";

    if(MapManager.markers.length===0){

        list.innerHTML=`
        <p>No active incidents.</p>
        `;

        return;

    }

    MapManager.markers.forEach(marker=>{

        const item=document.createElement("div");

        item.className="report-item";

        item.innerHTML=`

        <h3>${marker.title}</h3>

        <p><strong>Type:</strong> ${marker.type}</p>

        <p><strong>Status:</strong> ${marker.status}</p>

        <button
        class="small primary"
        onclick="selectMarker('${marker.id}')">

        View

        </button>

        `;

        list.appendChild(item);

    });

}

/* ===========================================================
   MARKER SELECTION
=========================================================== */

function selectMarker(id){

    const marker=getMarker(id);

    if(!marker){

        showToast(

            "Marker not found.",

            "error"

        );

        return;

    }

    MapManager.selectedMarker=marker;

    showMarkerDetails(marker);

}

/* ===========================================================
   MARKER DETAILS
=========================================================== */

function showMarkerDetails(marker){

    openModal(

        marker.title,

        `

        <p><strong>ID:</strong> ${marker.id}</p>

        <p><strong>Category:</strong> ${marker.type}</p>

        <p><strong>Status:</strong> ${marker.status}</p>

        <p><strong>Latitude:</strong> ${marker.lat}</p>

        <p><strong>Longitude:</strong> ${marker.lng}</p>

        `

    );

}

/* ===========================================================
   FILTER MARKERS
=========================================================== */

function filterMarkers(type){

    if(type==="All"){

        renderFilteredMarkers(

            MapManager.markers

        );

        return;

    }

    const filtered=

    MapManager.markers.filter(

        marker=>marker.type===type

    );

    renderFilteredMarkers(filtered);

}

function renderFilteredMarkers(markers){

    const list=

    document.getElementById("markerList");

    if(!list)return;

    list.innerHTML="";

    markers.forEach(marker=>{

        const item=document.createElement("div");

        item.className="report-item";

        item.innerHTML=`

        <h3>${marker.title}</h3>

        <p>${marker.type}</p>

        <p>${marker.status}</p>

        `;

        list.appendChild(item);

    });

}

/* ===========================================================
   SEARCH
=========================================================== */

function searchMarkers(keyword){

    keyword=

    keyword.toLowerCase();

    const results=

    MapManager.markers.filter(

        marker=>

        marker.title

        .toLowerCase()

        .includes(keyword)

        ||

        marker.type

        .toLowerCase()

        .includes(keyword)

    );

    renderFilteredMarkers(results);

}

/* ===========================================================
   LEGEND
=========================================================== */

function generateLegend(){

    return [

        {

        colour:"Blue",

        label:"Railway"

        },

        {

        colour:"Green",

        label:"Shelter"

        },

        {

        colour:"Orange",

        label:"Flood"

        },

        {

        colour:"Red",

        label:"Fire"

        },

        {

        colour:"Purple",

        label:"Medical"

        }

    ];

}

/* ===========================================================
   COUNTS
=========================================================== */

function markerCount(){

    return MapManager.markers.length;

}

function countByType(type){

    return MapManager.markers.filter(

        marker=>marker.type===type

    ).length;

}

/* ===========================================================
   END PART 2
=========================================================== */
/* ===========================================================
   SentinelLink
   map.js
   Part 3/4
   Live Updates & Map Controls
=========================================================== */

/* ===========================================================
   USER LOCATION
=========================================================== */

function getUserLocation(){

    if(!navigator.geolocation){

        showToast(

            "Geolocation is not supported.",

            "warning"

        );

        return;

    }

    navigator.geolocation.getCurrentPosition(

        function(position){

            const location={

                lat:position.coords.latitude,

                lng:position.coords.longitude

            };

            MapManager.userLocation=location;

            showToast(

                "Location acquired.",

                "success"

            );

            console.log(location);

        },

        function(){

            showToast(

                "Unable to retrieve location.",

                "error"

            );

        }

    );

}

/* ===========================================================
   LIVE INCIDENT SIMULATION
=========================================================== */

function simulateIncident(){

    const types=[

        "Railway",

        "Flood",

        "Fire",

        "Medical",

        "Road Accident"

    ];

    const incident={

        id:generateID("MK"),

        title:"New Incident",

        type:types[Math.floor(Math.random()*types.length)],

        lat:26.140+Math.random()/100,

        lng:91.730+Math.random()/100,

        status:"Active"

    };

    addMarker(incident);

    renderMarkers();

    showToast(

        "New incident detected.",

        "info"

    );

}

function startSimulation(){

    MapManager.simulation=

    setInterval(

        simulateIncident,

        15000

    );

}

function stopSimulation(){

    clearInterval(

        MapManager.simulation

    );

}

/* ===========================================================
   EMERGENCY ZONES
=========================================================== */

function getEmergencyZones(){

    return [

        {

            name:"Flood Risk Zone",

            level:"High"

        },

        {

            name:"Railway Corridor",

            level:"Medium"

        },

        {

            name:"Hospital Zone",

            level:"Safe"

        }

    ];

}

function displayEmergencyZones(){

    console.table(

        getEmergencyZones()

    );

}

/* ===========================================================
   NEAREST SHELTER
=========================================================== */

function nearestShelter(){

    return MapManager.markers.find(

        marker=>marker.type==="Shelter"

    );

}

function showNearestShelter(){

    const shelter=

    nearestShelter();

    if(!shelter){

        showToast(

            "No shelter found.",

            "warning"

        );

        return;

    }

    openModal(

        "Nearest Shelter",

        `

        <p><strong>${shelter.title}</strong></p>

        <p>Status: ${shelter.status}</p>

        <p>Latitude: ${shelter.lat}</p>

        <p>Longitude: ${shelter.lng}</p>

        `

    );

}

/* ===========================================================
   ROUTE
=========================================================== */

function calculateRoute(destination){

    console.log(

        "Calculating route:",

        destination

    );

    showToast(

        "Route generated.",

        "success"

    );

}

/* ===========================================================
   MAP CONTROLS
=========================================================== */

function zoomIn(){

    MapManager.defaultZoom++;

    console.log(

        "Zoom:",

        MapManager.defaultZoom

    );

}

function zoomOut(){

    MapManager.defaultZoom--;

    console.log(

        "Zoom:",

        MapManager.defaultZoom

    );

}

function resetMap(){

    MapManager.defaultZoom=12;

    loadDemoMarkers();

    renderMarkers();

    showToast(

        "Map reset.",

        "success"

    );

}

function refreshMap(){

    renderMarkers();

    showToast(

        "Map refreshed.",

        "info"

    );

}

/* ===========================================================
   INCIDENT STATISTICS
=========================================================== */

function mapStatistics(){

    return{

        total:markerCount(),

        railway:countByType("Railway"),

        flood:countByType("Flood"),

        fire:countByType("Fire"),

        medical:countByType("Medical"),

        shelter:countByType("Shelter")

    };

}

/* ===========================================================
   END PART 3
=========================================================== */
/* ===========================================================
   SentinelLink
   map.js
   Part 4/4
   Initialization & Utilities
=========================================================== */

/* ===========================================================
   EXPORT MARKERS
=========================================================== */

function exportMarkers(){

    const data=JSON.stringify(

        MapManager.markers,

        null,

        2

    );

    const blob=new Blob(

        [data],

        {

            type:"application/json"

        }

    );

    const url=

    URL.createObjectURL(blob);

    const link=

    document.createElement("a");

    link.href=url;

    link.download="sentinellink_markers.json";

    link.click();

    URL.revokeObjectURL(url);

    showToast(

        "Markers exported.",

        "success"

    );

}

/* ===========================================================
   IMPORT MARKERS
=========================================================== */

function importMarkers(file){

    const reader=

    new FileReader();

    reader.onload=function(){

        try{

            const data=

            JSON.parse(

                reader.result

            );

            clearMarkers();

            data.forEach(

                marker=>addMarker(marker)

            );

            renderMarkers();

            showToast(

                "Markers imported.",

                "success"

            );

        }

        catch{

            showToast(

                "Invalid marker file.",

                "error"

            );

        }

    };

    reader.readAsText(file);

}

/* ===========================================================
   MAP REFRESH
=========================================================== */

function refreshIncidentData(){

    loadDemoMarkers();

    renderMarkers();

    console.log(

        "Incident data refreshed."

    );

}

/* ===========================================================
   MAP STARTUP
=========================================================== */

function initializeMapModule(){

    initializeMap();

    loadDemoMarkers();

    renderMarkers();

    displayEmergencyZones();

    console.log(

        "Map module initialized."

    );

}

/* ===========================================================
   EVENT LISTENERS
=========================================================== */

document.addEventListener(

    "DOMContentLoaded",

    function(){

        const mapContainer=

        document.getElementById("map");

        if(!mapContainer){

            return;

        }

        initializeMapModule();

    }

);

/* ===========================================================
   CLEANUP
=========================================================== */

function destroyMap(){

    stopSimulation();

    clearMarkers();

    MapManager.map=null;

    MapManager.selectedMarker=null;

    MapManager.initialized=false;

    console.log(

        "Map module destroyed."

    );

}

/* ===========================================================
   GLOBAL EXPORTS
=========================================================== */

window.initializeMap=initializeMap;

window.refreshMap=refreshMap;

window.resetMap=resetMap;

window.zoomIn=zoomIn;

window.zoomOut=zoomOut;

window.searchMarkers=searchMarkers;

window.filterMarkers=filterMarkers;

window.selectMarker=selectMarker;

window.showNearestShelter=showNearestShelter;

window.calculateRoute=calculateRoute;

window.getUserLocation=getUserLocation;

window.exportMarkers=exportMarkers;

window.importMarkers=importMarkers;

/* ===========================================================
   END OF FILE

   SentinelLink
   map.js
   Version 1.0

   National-Level Prototype
=========================================================== */