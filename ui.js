var setting_pos = false;
var listener;

var screen_slider_id ='sc_sc';
var _timer;


var state = false;

function add2List(i){
    var list = document.getElementById('planet_list');
    var planet = document.createElement('li');
    planet.appendChild(document.createTextNode(planets[i][0].name));
    planet.setAttribute('id', 'id_'+ i)
    planet.setAttribute("class", "pl_list_member")
    planet.onclick = function(event) { attach_camera(i) };
    list.appendChild(planet)

    if(planets[i][0].static){
        var label = document.createElement("label");
        label.setAttribute('id', 'static_id_'+ i)
        label.setAttribute("for", "id_"+i);
        label.setAttribute("class", "static_label")
        label.setAttribute("title", "This planet is static")
        label.innerText = "S"
        planet.appendChild(label)
    }
}

function attach_camera(id){
    fix_cam_icon(id, camera_fix.fix ? camera_fix.planet : -1);
    camera_fix.fix = true;
    camera_fix.planet = id;
    
}

function deletefromList(i){
    var planet = document.getElementById('id_' + i);
    var list = document.getElementById('planet_list');
    list.removeChild(planet);
}

var fr = new Vector2();
var V = new Vector2();
var vec_ren = false;
var line = new Vector2();

function orbitSpeedUI(){
	var x = parseFloat(document.getElementById("posx").value, 10) * diss_k
	var y = parseFloat(document.getElementById("posy").value, 10) * diss_k
    V = getVelocityForOrbit(0, x, y, false);
    var cos = V.x / V.getLen();
    var sin = V.y / V.getLen();

    document.getElementById("V").value = V.getLen();



    var quater;
    if(x > 0 && y <= 0)
        quater = 1;
    else if(x > 0 && y > 0)
        quater = 2
    else if(x <= 0 && y > 0)
        quater = 3
    else if(x <= 0 && y <= 0)
        quater = 4


    var ang;

    switch (quater){
        case 1: ang = Math.acos(cos) / Math.PI * 180 ;
        break;
        case 2: ang = Math.acos(cos) / Math.PI * 180;
        break;
        case 3: ang = 360 - Math.asin(sin) / Math.PI * 180;
        break;
        case 4: ang = 360 - Math.acos(cos) / Math.PI * 180;
        break;
    }
    document.getElementById("vel_ang").value = ang;
    
    console.log(ang);

    line.x = 10 * cos * screen_scale;
    line.y = 10 * sin * screen_scale;
    vec_ren = true;
    fr.x = x;
    fr.y = y
    vector_render(new Vector2(x/diss_k, y/diss_k), line, "red");
}

function AddPlanetUI(){
    var pos = new Vector2(parseFloat(document.getElementById("posx").value, 10), parseFloat(document.getElementById("posy").value, 10));
    var mass = parseFloat(document.getElementById("mass").value, 10);
    var name = document.getElementById("name").value;
    var is_static = document.getElementById("is_static").checked;
    var radius = parseInt(document.getElementById("radius").value, 10);
    var color = toRGB(document.getElementById("color").value);
    var i = AddPlanet(pos.x, pos.y, name, color, mass, radius, is_static);
    var _v = new Vector2(Math.cos( parseInt(document.getElementById("vel_ang").value, 10) / 180 * Math.PI) * V.getLen(), -Math.sin( parseInt(document.getElementById("vel_ang").value, 10) / 180 * Math.PI) * V.getLen())
    if(!is_static)
        planets[i][0].V = MultByScalar(_v, 1);
    else
        planets[i][0].V = new Vector2(0, 0);
}

function getCoords(){
    if(!setting_pos){
        setting_pos = true
        var mouse = new Vector2(0, 0);
        document.getElementById("posx").value = mouse.x;
        document.getElementById("posy").value = mouse.y;
        listener = function(e){

            mouse.x = (e.pageX - 280 - 13 - w/2)/screen_scale + camera_pos.x;
            mouse.y = (e.pageY - 11 - h/2)/screen_scale + camera_pos.y;

            document.getElementById("posx").value = mouse.x;
            document.getElementById("posy").value = mouse.y;
        }
        canvas.addEventListener("mousedown", listener);
    }
    else{
        canvas.removeEventListener("mousedown", listener)
        setting_pos = false
    }
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function Update_win(){
    screen_scale = document.getElementById(screen_slider_id).value / 10;
    
    Update();
}

function openForm() {
    document.getElementById("plForm").style.display = "block";
}
  
function closeForm() {
    document.getElementById("plForm").style.display = "none";
    vec_ren = false;
}

function toRGB(str){
    str = str.slice(1, 7)
    var r = str.slice(0, 2), g = str.slice(2, 4), b = str.slice(4, 6)
    return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
}

function Reset(){
    for(var i = 0; i < planets.length; i++)
        if(planets[i][1])
            DeletePlanet(i)
    planets = []; 
    camera_fix.fix = false;
    camera_fix.planet = 0;
    clearWindow()
    setSimpleConsts()
}

function start_stop(){
    state = !state

    if(state)
        stop()
    else
        start()
}

function fix_cam_icon(new_id, old_id){
    var list = document.getElementById('planet_list');
    var old_planet = document.getElementById("id_"+old_id)
    var new_planet = document.getElementById("id_"+new_id)

    planetInfo(new_id);

    if(old_id!=-1 && old_planet != undefined){
        
        var old_label = document.getElementById("label_id_" + old_id)
        old_planet.removeChild(old_label)
    }


    if(new_id!=-1 && new_planet!= undefined){
        
        var label = document.createElement("label");
        label.setAttribute('id', 'label_id_'+ new_id)
        label.setAttribute("for", "id_"+new_id);
        label.setAttribute("class", "focus_label")
        label.setAttribute("title", "Focused on "+ planets[new_id][0].name)
        label.innerText = "F"
        new_planet.appendChild(label)
    }

}

function planetInfo(id){
    document.getElementById("unfocused").style.display = "none"
    document.getElementById("info_name").innerText = planets[id][0].name;
    document.getElementById("info_mass").innerText = planets[id][0].m + ' Kg';
    document.getElementById("info_rad").innerText = planets[id][0].radius + "px";
    document.getElementById("info_v").innerText = Math.round(Math.sqrt( Math.pow(planets[id][0].V.x, 2) + Math.pow(planets[id][0].V.y, 2))) + ' m/s'
    document.getElementById("info_color").style.backgroundColor = "rgb(" + planets[id][0].color[0] + ',' + planets[id][0].color[1] + ',' + planets[id][0].color[2] + ')'
    document.getElementById("info_color").innerHTML = ''
}

function zoom(event){

    if(event.deltaY < 0)
        screen_scale += event.deltaY * -0.01/(screen_scale+0.5)
    else
        screen_scale += event.deltaY * -0.011/(screen_scale+0.5)
    

    if(screen_scale < 0.5)
        screen_scale = 0.5
    else if(screen_scale > 9)
        screen_scale = 9
}

canvas.onwheel = zoom;

