class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        
    }
    getLen() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    };
}


function Add(v1, v2){
    return new Vector2(v1.x + v2.x, v1.y + v2.y)
}

function Sub(v1, v2){
    return new Vector2(v1.x - v2.x, v1.y - v2.y)
}

function Dot(v1, v2){
    return v1.getLen * v2.getLen * GetCos(v1, v2)
}

function MultByScalar(vec, num){
    return new Vector2(vec.x * num, vec.y * num)
}

function DivByScalar(vec, num){
    return new Vector2(vec.x / num, vec.y / num)
}

function GetCos(v1, v2){
    return (v1.x * v2.x + v1.y * v2.y) / (v1.getLen() * v2.getLen())
}

function GetSin(v1, v2){
    return (v1.x * v2.x - v1.y * v2.y) / (v1.getLen() * v2.getLen())
}

function Abs(vec){
    return new Vector2(Math.abs(vec.x), Math.abs(vec.y))
}