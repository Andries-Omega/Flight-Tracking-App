import { resumeUpdate } from "./main";

/**
 * Variables declaration
 */
let overalElements = document.querySelectorAll<HTMLElement>(".overall-planes");
let specificElements =
	document.querySelectorAll<HTMLElement>(".specific-plane");
let theTime = document.getElementById("theTime");
let btnResetTimer = document.querySelector("#btnResetTimer");
let planeTimers = document.querySelectorAll<HTMLElement>(".the-plane-timer");
let planeTimes = document.querySelectorAll<HTMLElement>("#theTime ");

let countDownInterval: any = null;

/**
 *
 * Event listeners
 */
btnResetTimer?.addEventListener("click", resetTimer);

/**
 *
 * Functions
 */
export function changeToSpecific(planeData: any) {
	overalElements.forEach((overalElement) => {
		if (overalElement.style) overalElement.style.display = "none";
	});
	specificElements.forEach((specificElement) => {
		specificElement.style.display = "block";
	});

	planeTimers.forEach((planeTimer) => {
		if (planeTimer.style) planeTimer.style.display = "block";
	});
	let fP = document.getElementById("flightPicked");
	if (fP) fP.innerHTML = planeData[1];
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
	planeTimes.forEach((pTime) => {
		pTime.style.color = "lime";
	});
	countDownInterval = setInterval(() => {
		theSecond--;
		if (!theSecond && !theMinute) {
			//it implies the countdown is over
			stopCountDown();
			resumeUpdate();
		} else if (!theSecond && theMinute) {
			//it implies the first minute is over
			theMinute--;
			theSecond = 59;
			planeTimes.forEach((pTime) => {
				pTime.style.color = "yellow";
			});
		}

		if (!theMinute && theSecond == 30) {
			planeTimes.forEach((pTime) => {
				pTime.style.color = "red";
			});
		}

		if (theSecond < 10) {
			if (theTime) theTime.innerHTML = "0" + theMinute + ":0" + theSecond;
		} else {
			if (theTime) theTime.innerHTML = "0" + theMinute + ":" + theSecond;
		}
	}, 1000);
}

function stopCountDown() {
	clearInterval(countDownInterval);
}

function resetTimer() {
	stopCountDown();
	startCountDown();
}
