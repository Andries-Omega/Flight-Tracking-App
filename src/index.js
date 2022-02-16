/***
 * Imports
 */
import L from "leaflet"
import "leaflet/dist/leaflet.css";
import { changeToSpecific, changeToOverall } from "./tracking";
import { flightPickedOnList, listCheck, setPlaneList, clearAllFlightsArr } from "./FlightList";

/**
 * Importing the local css files
 */
import "./tracking.css"
import "./flight.css"
import "./FlightList.css"

/***
 * Set and create variables
 */
var activateHover = true;
var zoomedInPlane; //to keep track of the plane that is been zoomed in

var map = L.map('map').setView([25.505, 10.09], 1.7); 
var planesOverall = document.getElementById('PlanesOverall');
var allPlanesList = document.getElementById('ListOfFlights');

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
	maxZoom: 20,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
}).addTo(map);


let listOfDisplayedPlanes = []; //might need it in another
let listOfDisplayedPlanesData = [];
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
        clearAllFlightsArr();
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
            listOfDisplayedPlanes.push(L.marker([planeLatitude, planeLongitude],{ icon:  planeIcon}).addTo(map)
            .bindPopup('Flight: ' + ListOfFlights.states[actualLoopCount][1]));   
            
            listOfDisplayedPlanesData.push(ListOfFlights.states[actualLoopCount]);
            ensureNumberOfPlanes++;
            
            setPlaneList(ListOfFlights.states, actualLoopCount);//function that will populate list of planes

        }
            
        actualLoopCount++;

    }
    listCheck();
    planesOverall.innerHTML = ensureNumberOfPlanes+ ' planes'
    planeHoveredOrUnhovered();
}   
//To avoid double adding planes we have to remove before updating
function removePlanesOnMap(){
    for(let i = 0; i < listOfDisplayedPlanes.length; i++){
        map.removeLayer(listOfDisplayedPlanes[i]);
    }
    allPlanesList.innerHTML = ``
}

// So that every 25 seconds, we update  plane positions on the map
function keepUpdatingPlanes(){
    planeUpdateInterval = setInterval(() => {
        retrieveListOfPlanes();        
    }, 25000);
}

// There will be instances where i would want to pause the plane counter
export function pauseUpdatingPlanes(){
    clearInterval(planeUpdateInterval);
}

//add functionality on the planes
function planeHoveredOrUnhovered(){
   
    for(let i =0; i < listOfDisplayedPlanes.length; i++){
        
        listOfDisplayedPlanes[i].on('mouseover', function(ev){
            if(activateHover){
                zoomedInPlane = listOfDisplayedPlanes[i];
                zoomedInPlane.openPopup();
               // zoomInPlane(ListOfDisplayedPlanes[i].getLatLng().lat, ListOfDisplayedPlanes[i].getLatLng().lng);
                map.flyTo([listOfDisplayedPlanes[i].getLatLng().lat, listOfDisplayedPlanes[i].getLatLng().lng], 7);
                activateHover = false;
                flightPickedOnList(listOfDisplayedPlanesData[i])
                changeToSpecific(listOfDisplayedPlanesData[i]);
                pauseUpdatingPlanes(); // pause the timer once the user views details of the flight, since refreshing risks loosing the planes data
                
            }

        });
    }
}

//because i will use it more than once
export function zoomToPlane(latitude, longitude){
    map.flyTo([latitude, longitude], 7);
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
        
        activateHover = false
        changeToOverall();
        setTimeout(() =>{
            activateHover = true;
            zoomedInPlane = null;
        }, 2000)
    }
}

document.getElementById("resumeUpdates").addEventListener('click', resumeUpdate)


function resumeUpdate(){
    activateHover = true;
    if(zoomedInPlane != null){
        zoomedInPlane.closePopup()
    }
    keepUpdatingPlanes();
    resetMap();
    changeToOverall();
}

