//canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
canvas.width = 1500;
canvas.height = 680;
const cWidth = canvas.width;
const cHeight = canvas.height;
ctx.translate(0,cHeight);
ctx.scale(1,-1);

//world
var interval;
const dt = 8;

//html elements etc
var scoreDiv = document.getElementById("scoreDiv");
var instructions = document.getElementById("instructions");
// const ded = new Audio('Something.WAV');
// const coinSound = new Audio('Pickup_Coin2.WAV');

//functions
//misc
function drawPoly(poly, color = "black"){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(poly.vertices[0].x0, poly.vertices[0].x1);
    for(let i=1; i<poly.vertices.length; i++){
        ctx.lineTo(poly.vertices[i].x0, poly.vertices[i].x1);
    }
    ctx.lineTo(poly.vertices[0].x0, poly.vertices[0].x1);
    ctx.fill();
}

function resetVariables(){
    playerSize = 60;
    player = new polygon([new vec2d(cWidth/2-playerSize/2, cHeight/2-playerSize/2),
                        new vec2d(cWidth/2+playerSize/2, cHeight/2-playerSize/2),
                        new vec2d(cWidth/2-playerSize/2, cHeight/2+playerSize/2),
                        new vec2d(cWidth/2+playerSize/2, cHeight/2+playerSize/2)]);
    lastPos = player.center;
    playerSpeed = new vec2d(0,0);
    playerAcc = new vec2d(0,0);
    acceleration = 1000;
    deceleration = 5;
    wallFric = 0.6;
    playerTrail = [];
    canvas.style.background = "black";
    keys = {'65':false, '68': false, '83': false, '87':false};
    score = 0;

    astSpawn = 100; //0.001
    astList = [];

    foodSpawn = 0.0001;
    foodList = [];

    scoreDiv.innerText = "SCORE: 0";
    instructions.innerText = "";
}

function start(){
    resetVariables();
    clearListeners();
    setListeners();

    interval = setInterval(()=>{
        ctx.clearRect(0,0,cWidth, cHeight);
        updatePlayer();
        updateAsts();
        updateFood();
    }, 1)
}

function clearListeners(){
    clearInterval(interval);
    removeEventListener("keydown", downListener);
    removeEventListener("keyup", upListener);
}

function setListeners(){
    addEventListener("keydown", downListener);
    addEventListener("keyup", upListener);
}

function downListener(event){
    keys[event.keyCode] = true;
}

function upListener(event){
    keys[event.keyCode] = false;
}

function startListener(event){
    if(event.keyCode == '13' || event.keyCode == '32'){
        start();
    }
}

addEventListener('keydown', startListener);