import { resumeUpdate } from "./main";

let overalElements = document.querySelectorAll(".overall-planes");
let specificElements = document.querySelectorAll(".specific-plane");
let planeTimers = document.querySelectorAll(".the-plane-timer");
let planeTimes = document.querySelectorAll("#theTime ");

let countDownInterval;
export function changeToSpecific(planeData) {
	overalElements.forEach((overalElement) => {
		overalElement.style.display = "none";
	});
	specificElements.forEach((specificElement) => {
		specificElement.style.display = "block";
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
			//it implies the first minut is over
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
			document.getElementById("theTime").innerHTML =
				"0" + theMinute + ":0" + theSecond;
		} else {
			document.getElementById("theTime").innerHTML =
				"0" + theMinute + ":" + theSecond;
		}
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
