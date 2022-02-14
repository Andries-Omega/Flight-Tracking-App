/***
 * Imports
 */
import L from "leaflet"
import "leaflet/dist/leaflet.css";

/***
 * Set and create variables
 */
var map = L.map('map').setView([25.505, 10.09],1.7); 

var mapLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);

const planeIcon = L.divIcon({
    html: '<span class="planeIcon"><i class="fa-solid fa-plane"></i></span>',
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
        removePlanesOnMap();
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
        retrieveListOfPlanes();        
    }, 20000);
}

// There will be instances where i would want to pause the plane counter
function pauseUpdatingPlanes(){
    clearInterval(planeUpdateInterval);
}

btnRemove.addEventListener('click', removePlanesOnMap);
