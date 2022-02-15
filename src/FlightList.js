var allPlanesList = document.getElementById('ListOfFlights');
var allPlanesListArr = [];
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

    if(theFlight[currentIndex][11] == null || theFlight[currentIndex][11] == undefined){
        ClimbingOrDescending = 'Unknown';
    }else if(theFlight[currentIndex][11] > 0){
        ClimbingOrDescending = 'Climbing';
    }else if(theFlight[currentIndex][11] < 0){
        ClimbingOrDescending = 'Descending';
    }else if(theFlight[currentIndex][11] == 0.0 && flightVelocity == 'Unknown'){
        ClimbingOrDescending = 'Unknown';
    }else if(theFlight[currentIndex][11] == 0.0 && flightVelocity > 0){
        ClimbingOrDescending = 'Flying';
    }else if(theFlight[currentIndex][11] == 0.0 && flightVelocity <= 0.0){
        ClimbingOrDescending = 'Landed';
    }else{
        ClimbingOrDescending = 'Unknown';
    }
    
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
        document.getElementById(allPlanesListArr[i][0]).addEventListener('click', e =>{
            
        });
    }
}

function flightPickedOnList(){

}
