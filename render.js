var canvas = document.getElementById('canv');


var h = document.body.clientHeight - 50;
var w = document.body.clientWidth - 350;
var panel = document.getElementById("control_panel")
panel.style.left =  w/2 + 151
panel.style.top =  h - 25

var screen_scale = 2;
var camera_pos = new Vector2(0, 0)

canvas.width  = w;
canvas.height = h;

var trace_len = 0;

var ctx = canvas.getContext('2d');
function updateWindow(){

    _h = canvas.offsetHeight;
    _w = canvas.offsetWidth;

    if(_h != h || _w != w)
        clearWindow()

    h = _h;
    w = _w;

    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, w, h);
}

function render(x, y, color, r, id){
    var tx =  w / 2 + screen_scale * (x / diss_k) - camera_pos.x * screen_scale, ty = h/2 + screen_scale * (y / diss_k) - camera_pos.y * screen_scale;
    if(tx <= w && tx > 0 && ty <= h && ty > 0){        
        ctx.beginPath();
        ctx.arc(tx, ty, (r+1) * screen_scale, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgb('+ color[0] + ',' + color[1] + ',' + color[2] +  ')';
        ctx.fill();
        
    }
}

function clearWindow(){
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, w, h);
}

function startWindow(step){
    ctx.fillStyle = 'rgba(0, 0, 0, '+ step + ')';
    ctx.fillRect(0, 0, w, h);
    return step;
}

function vector_render(from, vec, clr){
    ctx.beginPath();
    var fr =  new Vector2();

    ctx.moveTo(w / 2 + screen_scale * (from.x ) - camera_pos.x * screen_scale, h/2 + screen_scale * (from.y ) - camera_pos.y * screen_scale);
    ctx.lineTo(w / 2 + screen_scale * (from.x + vec.x/vec_k) - camera_pos.x * screen_scale, h/2 + screen_scale * (from.y + vec.y/vec_k ) - camera_pos.y * screen_scale)
    ctx.strokeStyle = clr
    ctx.lineWidth = 3
    ctx.stroke();
}

var _mouse = new Vector2(0, 0);
var mooving = false
