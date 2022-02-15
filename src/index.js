/***
 * Imports
 */
import L from "leaflet"
import "leaflet/dist/leaflet.css";
import { changeToSpecific, changeToOverall } from "./tracking";
import { setPlaneList } from "./FlightList";

/***
 * Set and create variables
 */
var activateHover = true;
var zoomedInPlane; //to keep track of the plane that is been zoomed in
var map = L.map('map').setView([25.505, 10.09], 1.7); 
var planesOverall = document.getElementById('PlanesOverall');
var allPlanesList = document.getElementById('ListOfFlights');

var mapLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);


let ListOfDisplayedPlanes = [];
let ListOfDisplayedPlanesData = [];
var planeUpdateInterval;
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
    planesOverall.innerHTML = 'Updating<span style="color:lime;">....</span>'
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
        
        const planeIcon = L.divIcon({
            html: '<span class="planeIcon" ><i style="transform: rotate('+ListOfFlights.states[actualLoopCount][10] +'deg);" class="fa-solid fa-plane"></i></span>',
            iconSize: [0.5, 0.5]
        });
        if(planeLongitude != null && planeLatitude != null){
            ListOfDisplayedPlanes.push(L.marker([planeLatitude, planeLongitude],{ icon:  planeIcon}).addTo(map)
            .bindPopup('Flight: ' + ListOfFlights.states[actualLoopCount][1]));   
            
            ListOfDisplayedPlanesData.push(ListOfFlights.states[actualLoopCount]);
            ensureNumberOfPlanes++;
            
            setPlaneList(ListOfFlights.states, actualLoopCount);//function that will populate list of planes

        }
            
        actualLoopCount++;

    }

    planesOverall.innerHTML = ensureNumberOfPlanes+ ' planes'
    planeHoveredOrUnhovered();
   
}   
//To avoid double adding planes we have to remove before updating
function removePlanesOnMap(){
    for(let i = 0; i < ListOfDisplayedPlanes.length; i++){
        map.removeLayer(ListOfDisplayedPlanes[i]);
    }
    allPlanesList.innerHTML = ``
}

// So that every 25 seconds, we update  plane positions on the map
function keepUpdatingPlanes(){
    planeUpdateInterval = setInterval(() => {
        retrieveListOfPlanes();        
    }, 20000);
}

// There will be instances where i would want to pause the plane counter
function pauseUpdatingPlanes(){
    clearInterval(planeUpdateInterval);
}

//add functionality on the planes
function planeHoveredOrUnhovered(){
   
    for(let i =0; i < ListOfDisplayedPlanes.length; i++){
        
        ListOfDisplayedPlanes[i].on('mouseover', function(ev){
            if(activateHover){
                zoomedInPlane = ListOfDisplayedPlanes[i];
                map.flyTo([ListOfDisplayedPlanes[i].getLatLng().lat, ListOfDisplayedPlanes[i].getLatLng().lng], 5);
                activateHover = false;
                zoomedInPlane.openPopup();
                changeToSpecific(ListOfDisplayedPlanesData[i]);
                setTimeout(()=>{
                    console.log('online again')
                    activateHover = true;
                    resetMap(); //after 7 seconds, and they still haven't placed the plane on the map. We reload
                },5000);
            }
            ListOfDisplayedPlanes[i].openPopup();
            console.log(ListOfDisplayedPlanes[i].getLatLng());
        });
    }
}

//incase mouse is hovered in, then moved out of hover before hove mouse out is activated
map.addEventListener('mousemove', e => {
    if(activateHover && zoomedInPlane !=null){
        if(e.latlng.lat != zoomedInPlane.getLatLng().lat || e.latlng.lng != zoomedInPlane.getLatLng().lng){
            resetMap();
        }
    }
});
//zoom out map to original position
function resetMap(){
    if(activateHover){
        map.flyTo([25.505, 10.09], 1.7);
        zoomedInPlane.closePopup();
        activateHover = false
        changeToOverall();
        setTimeout(() =>{
            activateHover = true;
            zoomedInPlane = null;
        }, 3500)
    }
}


