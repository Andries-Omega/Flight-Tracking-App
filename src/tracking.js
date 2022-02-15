let overalElements = document.querySelectorAll(".overallPlanes");
let specificElements = document.querySelectorAll(".specificPlane");
let planeIcon = document.querySelectorAll(".planeIcon");

export function changeToSpecific(planeData){
    overalElements.forEach(overalElement =>{
        overalElement.style.display = "none";
    });
    specificElements.forEach(specificElement =>{
        specificElement.style.display = "block";
    });
    planeIcon.forEach(planeIcon =>{
        planeIcon.style.fontSize = "x-large";
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

