let overalElements = document.querySelectorAll(".overallPlanes");
let specificElements = document.querySelectorAll(".specificPlane");
let planeTimers = document.querySelectorAll(".thePlaneTimer");
let planeIcon = document.querySelectorAll(".planeIcon");

export function changeToSpecific(planeData) {
	overalElements.forEach((overalElement) => {
		overalElement.style.display = "none";
	});
	specificElements.forEach((specificElement) => {
		specificElement.style.display = "block";
	});
	planeIcon.forEach((planeIcon) => {
		planeIcon.style.fontSize = "x-large";
	});
	planeTimers.forEach((planeTimer) => {
		planeTimer.style.display = "block";
	});
	document.getElementById("flightPicked").innerHTML = planeData[1];
}

export function changeToOverall() {
	specificElements.forEach((specificElement) => {
		specificElement.style.display = "none";
	});
	overalElements.forEach((overalElement) => {
		overalElement.style.display = "block";
	});
	planeTimers.forEach((planeTimer) => {
		planeTimer.style.display = "none";
	});
}

/**
 * Give user 2 minutes, and if they still zooming on the flight, auto update (They can reset the time if they still keen to stick on zooming on the flight)
 */
