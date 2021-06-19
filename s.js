var G = 1;
var EPS = .5;
var dt = 0.016;
var scale = 1;
var local_time = 1;
var mass_k = 1; 
var diss_k = 1;

var debug = false
var vec_k = 1;


class Planet{
    constructor(mass, x, y){
        this.m = mass*mass_k;
        this.Pos = new Vector2(x*diss_k, y*diss_k);

        this.Force = new Vector2(0, 0);
        this.A = new Vector2(0, 0);
        this.V = new Vector2(0, 0);
        
        this.static = false;
        
        this.trace = new Array(trace_len);
        for(var i = 0; i < trace_len; i++)
            this.trace[i] = this.Pos
        
    }

    Trace(){
        for(var i = trace_len; i > 0; i--)
            this.trace[i] = this.trace[i-1]
        this.trace[0] = this.Pos
    }

    GetTrace(i){
        return this.trace[i]
    }

    SetStatic(){ this.static = true }
    
    Decoration(name, color, radius){
        this.radius = radius;
        this.name = name;
        this.color = color;
    }

    AddForce(obj){
        if(!this.static){
            var x = obj.Pos.x;
            var y = obj.Pos.y;
            var m = obj.m;

            var dPos = new Vector2(x - this.Pos.x, y - this.Pos.y);   

            var Fr = (G * m * this.m) / Math.pow(dPos.getLen(), 2);

            var len = dPos.getLen();

            var t_x = Fr * (dPos.x / len);
            var t_y = Fr * (dPos.y / len);

            var f_temp = new Vector2(t_x, t_y);
            this.Force = Add(this.Force, f_temp);
        }
    }

    UpdatePos(dTime){
        var _dt = dTime * scale * local_time;

        // x = x0 + dx        ->
        // dx = v * dt       /\
        // v = v0 + a * dt   /\
        // a = f / m        ->

        if(!this.static){
            this.A = DivByScalar(this.Force, this.m);
            this.V = Add(this.V, MultByScalar(this.A, _dt));
            this.Pos = Add(this.Pos, MultByScalar(this.V, _dt));
        }
    }
}

var camera_fix = {fix : false, planet : 0};
var planets = [];
let timer;
var cur_win = 0;


var scale_mem = 0;
function start(){ if(scale_mem != 0){scale = scale_mem} else{timer = setInterval(Update, dt*1000);} }
function stop(){ scale_mem = scale; scale = 0;}
start()

var counter = 0;
function Update(){
    if(planets.length > 0 && camera_fix.fix){
        camera_pos = DivByScalar(planets[camera_fix.planet][0].Pos, diss_k);
    }
    var collision = false;
    if(cur_win < 2.5)
        cur_win += startWindow(.25);
    else{
        updateWindow();
        //render -> rewrite forces -> add forces -> update position

        for(var i = 0; i < planets.length; i++){
            if(planets[i][1] && !collision){
                render(planets[i][0].Pos.x, planets[i][0].Pos.y, planets[i][0].color, planets[i][0].radius, i);
                planets[i][0].Force = new Vector2(0, 0);
                for(var j = 0; j < planets.length; j++)
                    if(planets[j][1] && j != i && !collision){
                        planets[i][0].AddForce(planets[j][0])
                        collision = CheckCollision(i, j)
                        
                    }
                planets[i][0].UpdatePos(dt);
            }
        }
        if(vec_ren) {
            line.x = 10 * screen_scale * Math.cos( parseInt(document.getElementById("vel_ang").value, 10) / 180 * Math.PI)
            line.y = -10 * screen_scale * Math.sin( parseInt(document.getElementById("vel_ang").value, 10) / 180 * Math.PI)
            vector_render(new Vector2(fr.x/diss_k, fr.y/diss_k), line, "red");
        }
    }
    d_mouse = MultByScalar(_mouse, 1)
}

function AddPlanet(x, y, name, color, mass, radius, is_static){
    var i = planets.length;
    planets[i] = [];
    planets[i][1] = true;
    planets[i][0] = new Planet(mass, x || 0, y || 0);
    if(is_static) planets[i][0].SetStatic();
    planets[i][0].Decoration(name, color, radius);   
    render(planets[i][0].Pos.x, planets[i][0].Pos.y, planets[i][0].color, planets[i][0].radius, i);
    add2List(i)
    return i;
}

function DeletePlanet(planetid){
    deletefromList(planetid);
    planets[planetid][1] = false;
}

function getVelocityForOrbit(parent_id, x, y, clockwise){
    if(planets[0] != undefined){

        var mass_of_parent = planets[parent_id][0].m;
        var R = Sub(planets[parent_id][0].Pos, new Vector2(x, y));
        var V = Math.sqrt((G * mass_of_parent) / Abs(R).getLen());
        var vec = new Vector2(R.y, R.x);
        var k = R.getLen() / V;
        vec = Abs(DivByScalar(vec, k));

        var quater;
        if(x > 0 && y <= 0)
            quater = 1;
        else if(x > 0 && y > 0)
            quater = 2
        else if(x <= 0 && y > 0)
            quater = 3
        else if(x <= 0 && y <= 0)
            quater = 4

        switch (quater){
            case 1: vec = MultByScalar(vec, -1);
            break;
            case 2: vec.y *= -1;
            break;
            case 3: vec = MultByScalar(vec, 1);
            break;
            case 4: vec.x *= -1;
            break;
        }

        if(clockwise) vec = MultByScalar(vec, -1);

        return vec;
    }
    else{
        return new Vector2(1, 1)
    }
}

function CheckCollision(planet1id, planet2id){
    var dist = Sub(planets[planet1id][0].Pos, planets[planet2id][0].Pos);
    dist = Math.abs(dist.getLen()/diss_k);
    dist -= planets[planet1id][0].radius + planets[planet2id][0].radius;
    if (dist < EPS){
        Collision(planet1id, planet2id);
        return true
    }
    return false
}

function Collision(planet1id, planet2id){

    var more_massive;
    if(planets[planet1id][0].m >= planets[planet2id][0].m){
        more_massive = 1
    }
    else{
        more_massive = 2
    }

    if(more_massive == 1){
        var x = planets[planet1id][0].Pos.x;
        var y = planets[planet1id][0].Pos.y;
    }
    else{
        var x = planets[planet2id][0].Pos.x;
        var y = planets[planet2id][0].Pos.y;
    }

    
    var k = planets[planet1id][0].m / planets[planet2id][0].m;

    var m = planets[planet1id][0].m + planets[planet2id][0].m;
    var name = 'planet_' + planets.length
    var p1 = 3 * planets[planet1id][0].m / (Math.pow(planets[planet1id][0].radius, 3) * Math.PI * 4)
    var p2 = 3 * planets[planet2id][0].m / (Math.pow(planets[planet2id][0].radius, 3) * Math.PI * 4)
    var p = (p1 + p2)/2;
    var r = Math.cbrt(3 * m / (4 * Math.PI * p))

    if(more_massive == 1){
    var color = [
        planets[planet1id][0].color[0],
        planets[planet1id][0].color[1],
        planets[planet1id][0].color[2]]
    }
    else{
    var color = [
            planets[planet2id][0].color[0],
            planets[planet2id][0].color[1],
            planets[planet2id][0].color[2]
            ]
    }   
    
    var static;
    if(more_massive == 1)
        static = planets[planet1id][0].static;
    else
        static = planets[planet2id][0].static;

    var id = AddPlanet(x, y, name, color, m, r, static);

    var p1 = new Vector2(planets[planet1id][0].m * planets[planet1id][0].V.x, planets[planet1id][0].m * planets[planet1id][0].V.y);
    var p2 = new Vector2(planets[planet2id][0].m * planets[planet2id][0].V.x, planets[planet2id][0].m * planets[planet2id][0].V.y);

    var p = Add(p1, p2);

    planets[id][0].V = DivByScalar(p, m);
    DeletePlanet(planet1id);
    DeletePlanet(planet2id);
}