import { pauseUpdatingPlanes, setFlightZoomed, zoomToPlane } from "./main";
import { changeToSpecific } from "./tracking";

var allPlanesList = document.getElementById("ListOfFlights");
var flightPickedInfo = document.getElementById("FlightInformation");

function climbinOrDesc(VerticalRate: any, Velocity: any) {
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
export function setPlaneList() {
	let theFlights = JSON.parse(sessionStorage.getItem("Plane_Data") || "");
	if (theFlights)
		theFlights.forEach((theFlight: any) => {
			let flightID = theFlight[1] || theFlight[0];
			let flightOrigin = theFlight[2] || "Unknown";
			let flightVelocity = theFlight[9] || "Unknown";
			let climbingOrDescending = "";

			climbingOrDescending = climbinOrDesc(theFlight[11], flightVelocity);
			if (!allPlanesList) return; //there's no need to add flight data in an array of flights if it is not on the card
			allPlanesList.innerHTML += `<div class="card" 
											id="Card-${theFlight[0]}" title="Click To View Plane">
											<h3>Flight ${flightID} </h3>
											<p>Origin: ${flightOrigin}</p>
											<p>Velocity: ${flightVelocity} m/s</p>
											<p>Position: ${climbingOrDescending}</p>
										</div>`;
		});
}

//function to container an event lister for cards
export function listCheck() {
	let theFlights = JSON.parse(sessionStorage.getItem("Plane_Data") || "");
	theFlights.forEach((pla: any, index: number) => {
		if (pla[0]) {
			let theCard = document.getElementById("Card-" + pla[0]);
			if (theCard)
				theCard.addEventListener("click", () => {
					flightPickedOnList(pla, index);
					changeToSpecific(pla);
				});
		}
	});
}

export function flightPickedOnList(flightPicked: any, index: number) {
	if (flightPicked != null) {
		setFlightZoomed(flightPicked);
		pauseUpdatingPlanes();
		if (flightPickedInfo)
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
                                            <li>Latitude: ${
																							flightPicked[6]
																						}deg</li>
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
		// make sure latitude and longitude are defined
		if (flightPicked[6] && flightPicked[5]) {
			zoomToPlane(flightPicked[0], flightPicked[6], flightPicked[5], index);
		}
	} else {
		if (!flightPickedInfo) return;
		flightPickedInfo.innerHTML = `<h1 style="color:red;">Flight Info Not Found</h1>`;
	}
}
