// Get in tailwind
import "tailwindcss/tailwind.css";

// The CSS being used
import "../css/style.css";
import "../css/flightList.css";
import "../css/tracking.css";
//the map
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//the java script
import { changeToSpecific, changeToOverall } from "./tracking";
import {
	flightPickedOnList,
	listCheck,
	setPlaneList,
	clearAllFlightsArr,
} from "./FlightList";

/***
 * Set and create variables
 */
let activateHover = true;
let zoomedInPlane; //to keep track of the plane that is been zoomed in (html and css properties)
let zoomedInPlaneData;

let map = L.map("map").setView([25.505, 10.09], 1.7);

let planesOverall = document.getElementById("PlanesOverall");
let allPlanesList = document.getElementById("ListOfFlights");

L.tileLayer(
	"https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
	{
		maxZoom: 20,
		attribution:
			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	}
).addTo(map);

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
function retrieveListOfPlanes() {
	planesOverall.innerHTML = 'Updating<span style="color:lime;">...</span>';
	fetch("https://opensky-network.org/api/states/all")
		.then((response) => response.json())
		.then((listOfFlights) => {
			removePlanesOnMap();
			clearAllFlightsArr();
			setPlaneOnMap(listOfFlights);
		})
		//incase there's an error retrieving list of planes
		.catch((err) => {
			console.error(err);
		});
}

//Set List of first 100 planes on the map
function setPlaneOnMap(listOfFlights) {
	var ensureNumberOfPlanes = 0; //variable to make sure we're getting 100 planes on the map
	var actualLoopCount = 0;

	while (ensureNumberOfPlanes < 100) {
		var planeLongitude = listOfFlights.states[actualLoopCount][5];
		var planeLatitude = listOfFlights.states[actualLoopCount][6];

		const planeIcon = L.divIcon({
			html:
				'<span><i style="transform: rotate(' +
				listOfFlights.states[actualLoopCount][10] +
				'deg); " id="' +
				listOfFlights.states[actualLoopCount][0] +
				'" class="fa-solid fa-plane planeIconNoZoom"></i></span>',
			iconSize: [0.5, 0.5],
		});
		if (planeLongitude && planeLatitude) {
			listOfDisplayedPlanes.push(
				L.marker([planeLatitude, planeLongitude], { icon: planeIcon })
					.addTo(map)
					.bindPopup("Flight: " + listOfFlights.states[actualLoopCount][1])
			);

			listOfDisplayedPlanesData.push(listOfFlights.states[actualLoopCount]);
			ensureNumberOfPlanes++;

			setPlaneList(listOfFlights.states, actualLoopCount); //function that will populate list of planes
		}

		actualLoopCount++;
	}
	listCheck();
	planesOverall.innerHTML = `<span style="color: lime">${ensureNumberOfPlanes}</span> Planes`;
	planeHoveredOrUnhovered();
}
//To avoid double adding planes we have to remove before updating
function removePlanesOnMap() {
	listOfDisplayedPlanes.forEach((lodp) => {
		map.removeLayer(lodp);
	});
	allPlanesList.innerHTML = ``;
}

// So that every 25 seconds, we update  plane positions on the map
function keepUpdatingPlanes() {
	planeUpdateInterval = setInterval(() => {
		retrieveListOfPlanes();
	}, 25000);
}

// There will be instances where i would want to pause the plane counter
export function pauseUpdatingPlanes() {
	clearInterval(planeUpdateInterval);
}

//add functionality on the planes
function planeHoveredOrUnhovered() {
	listOfDisplayedPlanes.forEach((lodp, index) => {
		lodp.on("mouseover", () => {
			if (activateHover) {
				zoomedInPlane = lodp;
				lodp.openPopup();
				flightPickedOnList(listOfDisplayedPlanesData[index]);
				changeToSpecific(listOfDisplayedPlanesData[index]);
				pauseUpdatingPlanes(); // pause the timer once the user views details of the flight, since refreshing risks loosing the planes data
			}
		});
	});
}

//because i will use it more than once
export function zoomToPlane(flightID, latitude, longitude, index) {
	if (!zoomedInPlane) {
		zoomedInPlane = listOfDisplayedPlanes[index];
	}
	zoomedInPlane.openPopup();
	$("#" + flightID)
		.removeClass("planeIconNoZoom")
		.addClass("planeIconZoom");
	map.flyTo([latitude, longitude], 7);
	activateHover = false;
}
//incase mouse is hovered in, then moved out of hover before hove mouse out is activated
map.addEventListener("mousemove", (e) => {
	console.log(activateHover);
	if (activateHover && zoomedInPlane) {
		if (
			e.latlng.lat != zoomedInPlane.getLatLng().lat ||
			e.latlng.lng != zoomedInPlane.getLatLng().lng
		) {
			resetMap();
		}
	}
});
//zoom out map to original position
function resetMap() {
	if (activateHover) {
		map.flyTo([25.505, 10.09], 1.7);
		activateHover = false;
		changeToOverall();
		setTimeout(() => {
			activateHover = true;
			zoomedInPlane = null;
		}, 2000);
	}
}

document
	.getElementById("resumeUpdates")
	.addEventListener("click", resumeUpdate);

export function resumeUpdate() {
	activateHover = true;
	$("#" + zoomedInPlaneData[0])
		.removeClass("planeIconZoom")
		.addClass("planeIconNoZoom");
	if (zoomedInPlane) {
		zoomedInPlane.closePopup();
	}
	keepUpdatingPlanes();
	resetMap();
	changeToOverall();
}

export function setFlightZoomed(flightZ) {
	zoomedInPlaneData = flightZ;
}
