
import { pauseUpdatingPlanes, zoomToPlane } from ".";
import { changeToSpecific } from "./tracking";

var allPlanesList = document.getElementById('ListOfFlights');
var allPlanesListArr = [];
var flightPickedInfo = document.getElementById('FlightInformation');

function climbinOrDesc(VerticalRate, Velocity){
    var cOrD = '';
    if(VerticalRate == null || VerticalRate== undefined){
        cOrD = 'Unknown';
    }else if(VerticalRate > 0){
        cOrD = 'Climbing At Rate: '+ VerticalRate + 'm/s';
    }else if(VerticalRate < 0){
        VerticalRate *= -1; //to avoid displaying it as a negative
        cOrD = 'Descending At Rate: ' + VerticalRate + 'm/s';
    }else if(VerticalRate == 0.0 && Velocity == 'Unknown'){
        cOrD = 'Unknown';
    }else if(VerticalRate == 0.0 && Velocity > 0){
        cOrD = 'Flying';
    }else if(VerticalRate == 0.0 && Velocity <= 0.0){
        cOrD = 'Landed';
    }else{
        cOrD = 'Unknown';
    }

    return cOrD;
}

//adding list of planes and their data
export function setPlaneList(theFlight, currentIndex){
    var flightID = theFlight[currentIndex][1];
    var flightOrigin = theFlight[currentIndex][2];
    var flightVelocity = theFlight[currentIndex][9];
    var ClimbingOrDescending = '';
    if(flightID == null || flightID == undefined || flightID == ''){
        flightID = theFlight[currentIndex][0];
    }

    if(flightOrigin == null || flightOrigin == undefined || flightOrigin == ''){
        flightOrigin = 'Unknown';
    }

    if(flightVelocity == null || flightVelocity == undefined || flightVelocity == 0.0){
        flightVelocity = 'Unknown';
    }
    ClimbingOrDescending = climbinOrDesc(theFlight[currentIndex][11], flightVelocity);
    allPlanesList.innerHTML += `<div class="card" id="${theFlight[currentIndex][0]}" title="Click To View Plane">
                                    <h3>Flight ${flightID} </h3>
                                    <p>Origin: ${flightOrigin}</p>
                                    <p>Velocity: ${flightVelocity} m/s</p>
                                    <p>Position: ${ClimbingOrDescending}</p>
                                    <br/>
                                </div>`
    allPlanesListArr.push(theFlight[currentIndex]);//store list of flights data so we can view them when they click
}


//function to container an event lister for cards
export function ListCheck() {
    for(let i = 0; i < allPlanesListArr.length; i++){
        if(allPlanesListArr[i][0] != null && allPlanesListArr[i][0] != undefined){
            document.getElementById(allPlanesListArr[i][0]).addEventListener('click', e =>{
                flightPickedOnList(allPlanesListArr[i]);
                changeToSpecific(allPlanesListArr[i]);
            });
        }
    }
}

export function flightPickedOnList(flightPicked){
    if(flightPicked != null){
        pauseUpdatingPlanes();
        flightPickedInfo.innerHTML = `<ul>
                                        <li>Origin Country: ${flightPicked[2]}</li>
                                        <br/>   
                                        <li>Last Position Update: ${flightPicked[3]} seconds</li> 
                                        <br/> 
                                        <li>Last Update: ${flightPicked[4]} seconds</li>
                                        <br/> 
                                        <li>Longitude: ${flightPicked[5]}deg</li>
                                        <br/> 
                                        <li>Latitude: ${flightPicked[6]}deg</li>
                                        <br/> 
                                        <li>Velocity: ${flightPicked[9]} m/s</li>
                                        <br/> 
                                        <li>Direction (North = 0deg, clockwise): ${flightPicked[10]} deg</li>
                                        <br/>
                                        <li>${climbinOrDesc(flightPicked[11], flightPicked[9])}</li>
                                        <br/>
                                        <li>Geometric Altitude: ${flightPicked[13]}</li>
                                      </ul>`;
        zoomToPlane(flightPicked[6], flightPicked[5])
    }else{
        flightPickedInfo.innerHTML = `<h1 style="color:red;">Flight Info Not Found</h1>`;
    }

}

export function clearAllFlightsArr(){
    this.allPlanesListArr = [];
}
