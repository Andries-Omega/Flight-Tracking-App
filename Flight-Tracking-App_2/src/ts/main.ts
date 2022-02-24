// Get in tailwind
import "tailwindcss/tailwind.css";

import { fromEvent, Subject } from "rxjs";
// The CSS being used
import "../css/style.css";

//the map
import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { flightPickedOnList, listCheck, setPlaneList } from "./flightList";
import { changeToOverall, changeToSpecific } from "./tracking";
import { Flights } from "../model/flights";

/***
 * Set and create variables
 */
let activateHover = true;
let zoomedInPlane: any = null; //to keep track of the plane that is been zoomed in (html and css properties)
let zoomedInPlaneData: any = null;

let map = L.map("map").setView([25.505, 10.09], 1.7);

let planesOverall = document.getElementById("PlanesOverall");
let allPlanesList = document.getElementById("ListOfFlights");
let listOfDisplayedPlanes: any = [];
let listOfDisplayedPlanesData: any = [];
let planeUpdateInterval: any = null;
let resumeUpdateBtn: any = document.getElementById("resumeUpdates");

//for time to display the flights observable
let subject = new Subject();

//subscribe the functions
subject.subscribe({
	next: removePlanes,
});
subject.subscribe({
	next: (listOfFlights: any) => {
		setPlaneOnMap(listOfFlights);
	},
});
subject.subscribe({
	next: setPlaneList,
});
subject.subscribe({
	next: listCheck,
});
subject.subscribe({
	next: planeHoveredOrUnhovered,
});

L.tileLayer(
	"https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
	{
		maxZoom: 20,
		attribution:
			'&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
	}
).addTo(map);

/**
 * Events
 */

fromEvent(resumeUpdateBtn, "click").subscribe(resumeUpdate);
/***
 * Call Functions
 */

//get the first 100 planes
retrieveListOfPlanes();

//every 25 seconds, update the planes
keepUpdatingPlanes();

/**
 * Get in external event listeners
 */

/***
 * Define the funcions
 */

// Get List Of all planes from open sky
function retrieveListOfPlanes() {
	if (!planesOverall) return;
	planesOverall.innerHTML = 'Updating<span style="color:lime;">...</span>';
	fetch("https://opensky-network.org/api/states/all")
		.then((response) => response.json())
		.then((listOfFlights) => {
			subject.next(listOfFlights);
		})
		//incase there's an error retrieving list of planes
		.catch((err) => {
			console.error(err);
		});
}

//Set List of first 100 planes on the map
function setPlaneOnMap(listOfFlights: Flights) {
	for (let flight of listOfFlights.states) {
		let planeLongitude = flight[5];
		let planeLatitude = flight[6];
		let planeDirection = flight[10] || 0;

		const planeIcon = L.divIcon({
			html:
				'<span><i style="transform: rotate(' +
				planeDirection +
				'deg); " id="' +
				flight[0] +
				'" class="fa-solid fa-plane plane-icon-no-zoom"></i></span>',
			iconSize: [0.5, 0.5],
		});
		if (planeLongitude && planeLatitude) {
			listOfDisplayedPlanes.push(
				L.marker([planeLatitude, planeLongitude], { icon: planeIcon })
					.addTo(map)
					.bindPopup("Flight: " + flight[1])
			);

			listOfDisplayedPlanesData.push(flight);
		}
		if (listOfDisplayedPlanesData.length >= 100) {
			break;
		}
	}

	sessionStorage.setItem(
		"Plane_Data",
		JSON.stringify(listOfDisplayedPlanesData)
	);

	if (!planesOverall) return;
	planesOverall.innerHTML = `<span style="color: lime">${listOfDisplayedPlanesData.length}</span> Planes`;
}
//To avoid double adding planes we have to remove before updating
function removePlanes() {
	listOfDisplayedPlanes.forEach((lodp: any) => {
		map.removeLayer(lodp);
	});
	listOfDisplayedPlanesData = [];
	sessionStorage.removeItem("Plane_Data");
	if (!allPlanesList) return;
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
	listOfDisplayedPlanes.forEach((lodp: any, index: number) => {
		fromEvent(lodp, "mouseover").subscribe(() => {
			if (activateHover) {
				zoomedInPlane = lodp;
				lodp.openPopup();
				flightPickedOnList(listOfDisplayedPlanesData[index], index);
				changeToSpecific(listOfDisplayedPlanesData[index]);
				pauseUpdatingPlanes(); // pause the timer once the user views details of the flight, since refreshing risks loosing the planes data
			}
		});
	});
}

//because i will use it more than once
export function zoomToPlane(
	flightID: string,
	latitude: number,
	longitude: number,
	index: number
) {
	if (!zoomedInPlane) {
		zoomedInPlane = listOfDisplayedPlanes[index];
	}
	zoomedInPlane.openPopup();
	$("#" + flightID)
		.removeClass("plane-icon-no-zoom")
		.addClass("plane-icon-zoom");
	map.flyTo([latitude, longitude], 7);
	activateHover = false;
}

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

export function resumeUpdate() {
	activateHover = true;
	$("#" + zoomedInPlaneData[0])
		.removeClass("plane-icon-zoom")
		.addClass("plane-icon-no-zoom");
	if (zoomedInPlane) {
		zoomedInPlane.closePopup();
	}
	keepUpdatingPlanes();
	resetMap();
	changeToOverall();
}

export function setFlightZoomed(flightZ: any) {
	zoomedInPlaneData = flightZ;
}
