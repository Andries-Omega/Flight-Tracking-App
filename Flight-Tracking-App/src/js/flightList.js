import { pauseUpdatingPlanes, zoomToPlane } from "./main";
import { changeToSpecific } from "./tracking";

var allPlanesList = document.getElementById("ListOfFlights");
var allPlanesListArr = [];
var flightPickedInfo = document.getElementById("FlightInformation");

function climbinOrDesc(VerticalRate, Velocity) {
	let cOrD = "";
	if (VerticalRate == null || VerticalRate == undefined) {
		cOrD = "Unknown";
	} else if (VerticalRate > 0) {
		cOrD = "Climbing At Rate: " + VerticalRate + "m/s";
	} else if (VerticalRate < 0) {
		VerticalRate *= -1; //to avoid displaying it as a negative
		cOrD = "Descending At Rate: " + VerticalRate + "m/s";
	} else if (VerticalRate == 0.0 && Velocity == "Unknown") {
		cOrD = "Unknown";
	} else if (VerticalRate == 0.0 && Velocity > 0) {
		cOrD = "Flying";
	} else if (VerticalRate == 0.0 && Velocity <= 0.0) {
		cOrD = "Landed";
	} else {
		cOrD = "Unknown";
	}

	return cOrD;
}

//adding list of planes and their data
export function setPlaneList(theFlight, currentIndex) {
	let flightID = theFlight[currentIndex][1] || theFlight[currentIndex][0];
	let flightOrigin = theFlight[currentIndex][2] || "Unknown";
	let flightVelocity = theFlight[currentIndex][9] || "Unknown";
	let climbingOrDescending = "";

	climbingOrDescending = climbinOrDesc(
		theFlight[currentIndex][11],
		flightVelocity
	);

	allPlanesList.innerHTML += `<div class="card" id="${theFlight[currentIndex][0]}" title="Click To View Plane">
                                    <h3>Flight ${flightID} </h3>
                                    <p>Origin: ${flightOrigin}</p>
                                    <p>Velocity: ${flightVelocity} m/s</p>
                                    <p>Position: ${climbingOrDescending}</p>
                                </div>`;
	allPlanesListArr.push(theFlight[currentIndex]); //store list of flights data so we can view them when they click
}

//function to container an event lister for cards
export function listCheck() {
	allPlanesListArr.forEach((pla) => {
		if (pla[0]) {
			document.getElementById(pla[0]).addEventListener("click", (e) => {
				flightPickedOnList(pla);
				changeToSpecific(pla);
			});
		}
	});
}

export function flightPickedOnList(flightPicked) {
	if (flightPicked != null) {
		pauseUpdatingPlanes();
		flightPickedInfo.innerHTML = `<ul>
                                        <li>Origin Country: ${
																					flightPicked[2]
																				}</li>
                                        <br/>   
                                        <li>Last Position Update: ${
																					flightPicked[3]
																				} seconds</li> 
                                        <br/> 
                                        <li>Last Update: ${
																					flightPicked[4]
																				} seconds</li>
                                        <br/> 
                                        <li>Longitude: ${
																					flightPicked[5]
																				}deg</li>
                                        <br/> 
                                        <li>Latitude: ${flightPicked[6]}deg</li>
                                        <br/> 
                                        <li>Velocity: ${
																					flightPicked[9]
																				} m/s</li>
                                        <br/> 
                                        <li>Direction (North = 0deg, clockwise): ${
																					flightPicked[10]
																				} deg</li>
                                        <br/>
                                        <li>${climbinOrDesc(
																					flightPicked[11],
																					flightPicked[9]
																				)}</li>
                                        <br/>
                                        <li>Geometric Altitude: ${
																					flightPicked[13]
																				}</li>
                                      </ul>`;
		zoomToPlane(flightPicked[6], flightPicked[5]);
	} else {
		flightPickedInfo.innerHTML = `<h1 style="color:red;">Flight Info Not Found</h1>`;
	}
}

export function clearAllFlightsArr() {
	if (allPlanesListArr) {
		allPlanesListArr = [];
	}
}
