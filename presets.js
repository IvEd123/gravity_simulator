function defaultPlanets(){
    setRealConts();
    local_time = 100000;

    AddPlanet(0, 0, "Sun", [255, 255, 102], 332598, 5, true);
    AddPlanet(0, 58, "Mercury", [100, 100, 100], .055, .5, false);
    AddPlanet(-76, 76, "Venus", [255, 192, 203], .815, 1, false);
    AddPlanet(106, 106, "Earth", [0, 0, 255], 10, 1, false);
    AddPlanet(0, 249, "Mars", [255, 0, 0], .108, .7, false);
    AddPlanet(797, 0, "Jupiter", [255, 255, 0], 318, 3, false);
    AddPlanet(-1514, 0, "Saturn", [255, 209, 51], 95.2, 3, false);
    

    planets[1][0].V = getVelocityForOrbit(0, planets[1][0].Pos.x, planets[1][0].Pos.y, false);
    planets[2][0].V = getVelocityForOrbit(0, planets[2][0].Pos.x, planets[2][0].Pos.y, false);
    planets[3][0].V = getVelocityForOrbit(0, planets[3][0].Pos.x, planets[3][0].Pos.y, false);
    planets[4][0].V = getVelocityForOrbit(0, planets[4][0].Pos.x, planets[4][0].Pos.y, false);
    planets[5][0].V = getVelocityForOrbit(0, planets[5][0].Pos.x, planets[5][0].Pos.y, false);
    planets[6][0].V = getVelocityForOrbit(0, planets[6][0].Pos.x, planets[6][0].Pos.y, false);

}

function universe_bith(num){
    local_time = 1;
    setSimpleConsts();
    AddPlanet(0, 0, "Sun", [255, 255, 102], 10, 5, true);
    for(var i = 1; i < num; i++){
        AddPlanet(getRandomInt(700)-350, getRandomInt(700)-350, i + '', [200, 200, 200], .01, .5, false);
        planets[i][0].V = getVelocityForOrbit(0, planets[i][0].Pos.x, planets[i][0].Pos.y, false);
    }
}

function set_preset(){
    Reset()
    var mode = document.getElementById("selectpreset").value;
    switch (mode){
        case "0": defaultPlanets();
        break
        case "1": universe_bith(1000);
        break;
        case "none": alert("Chose preset")
    }
}

function setRealConts(){
    G = 6.7 * Math.pow(10, -11) ;
    EPS = .5;
    mass_k = 6 * Math.pow(10, 24); 
    diss_k = Math.pow(10, 6+3);
}

function setSimpleConsts(){
    G = 1 ;
    EPS = .5;
    mass_k = 1; 
    diss_k = 1;
    local_time = 1
}