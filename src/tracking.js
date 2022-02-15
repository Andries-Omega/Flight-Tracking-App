let overalElements = document.querySelectorAll(".overallPlanes");
let specificElements = document.querySelectorAll(".specificPlane");

export function changeToSpecific(planeData){
    overalElements.forEach(overalElement =>{
        overalElement.style.display = "none";
    });
    specificElements.forEach(specificElement =>{
        specificElement.style.display = "block";
    });
    document.getElementById('flightPicked').innerHTML = planeData[1];
    console.log(planeData);
}

export function changeToOverall(){
    specificElements.forEach(specificElement =>{
        specificElement.style.display = "none";
    })
    overalElements.forEach(overalElement =>{
        overalElement.style.display = "block";
    })

}
