/***
 * Imports
 */
import L from "leaflet"
import "leaflet/dist/leaflet.css";

/***
 * Set and create variables
 */
var map = L.map('map').setView([25.505, 10.09],1.7); 

var mapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
}).addTo(map);

const planeIcon = L.divIcon({
    html: '<i class="fa-solid fa-plane"></i>',
    iconSize: [0.5, 0.5]
});

let ListOfDisplayedPlanes = [];
var planeUpdateInterval;

const btnRemove = document.getElementById('refresh')

/***
 * Call Functions
 */

//get the first 100 planes
retrieveListOfPlanes();

//every 25 seconds, update the planes
keepUpdatingPlanes();

/***
 * Define the funcions
 */

// Get List Of all planes from open sky 
function retrieveListOfPlanes(){
    fetch('https://opensky-network.org/api/states/all')
    .then((response) => response.json())
    .then((ListOfFlights) =>{
        console.log(ListOfFlights);
        setPlaneOnMap(ListOfFlights);
    })
    //incase there's an error retrieving list of planes
    .catch((err) => {
        console.error(err);
    })
}

//Set List of first 100 planes on the map
function setPlaneOnMap(ListOfFlights){
    var ensureNumberOfPlanes = 0; //variable to make sure we're getting 100 planes on the map
    var actualLoopCount = 0;

    while(ensureNumberOfPlanes < 100){

        var planeLongitude = ListOfFlights.states[actualLoopCount][5];
        var planeLatitude = ListOfFlights.states[actualLoopCount][6];

        if(planeLongitude != null && planeLatitude != null){
            ListOfDisplayedPlanes.push(L.marker([planeLatitude, planeLongitude],{ icon:  planeIcon}).addTo(map)
            .bindPopup('A pretty CSS3 popup.<br> Easily customizable.'));

            ensureNumberOfPlanes++;
        }
            
        actualLoopCount++;
    }
    console.log(ListOfDisplayedPlanes[0])
    document.getElementById('numberOfPlanes').innerHTML = ensureNumberOfPlanes;
}   
//To avoid double adding planes we have to remove before updating
function removePlanesOnMap(){
    for(let i = 0; i < ListOfDisplayedPlanes.length; i++){
        map.removeLayer(ListOfDisplayedPlanes[i]);
    }
}

// So that every 25 seconds, we update plane positions on the map
function keepUpdatingPlanes(){
    planeUpdateInterval = setInterval(() => {
        removePlanesOnMap();
        retrieveListOfPlanes();        
    }, 25000);
}

// There will be instances where i would want to pause the plane counter
function pauseUpdatingPlanes(){
    clearInterval(planeUpdateInterval);
}

btnRemove.addEventListener('click', removePlanesOnMap);
