import { resumeUpdate } from "./main";

let overalElements = document.querySelectorAll(".overallPlanes");
let specificElements = document.querySelectorAll(".specificPlane");
let planeTimers = document.querySelectorAll(".thePlaneTimer");
let planeIcon = document.querySelectorAll(".planeIcon");

let countDownInterval;
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
	startCountDown();
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
	stopCountDown();
}

/**
 * Give user 2 minutes, and if they still zooming on the flight, auto update (They can reset the time if they still keen to stick on zooming on the flight)
 */
function startCountDown() {
	let theMinute = 1;
	let theSecond = 60;
	countDownInterval = setInterval(() => {
		theSecond--;
		if (!theSecond && !theMinute) {
			//it implies the countdown is over
			stopCountDown();
			resumeUpdate();
		} else if (!theSecond && theMinute) {
			//it implies the first minut is over
			theMinute--;
			theSecond = 60;
		}
		document.getElementById("theTime").innerHTML =
			"0" + theMinute + ":" + theSecond;
	}, 1000);
}

function stopCountDown() {
	clearInterval(countDownInterval);
}
document.querySelector("#btnResetTimer").addEventListener("click", resetTimer);
function resetTimer() {
	stopCountDown();
	startCountDown();
}
