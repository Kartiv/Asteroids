var playerSize;
var player;
var lastPos;
var playerSpeed;
var playerAcc;
var acceleration;
var deceleration;
var wallFric;
var playerTrail;
var score;
const damageSpeed = 0;

var keys;

function updatePlayer(){

    //move
    playerAcc = new vec2d(0,0);
    let accMod = new vec2d(keys['68']-keys['65'], keys['87']-keys['83']);
    accMod = accMod.normalize();
    playerAcc = playerAcc.add(accMod.scale(dt/1000 * acceleration));
    playerAcc = playerAcc.add(playerSpeed.normalize().scale(-deceleration));
    playerSpeed = playerSpeed.add(playerAcc.scale(dt/1000));
    let pos = player.center.add(playerSpeed);
    if(pos.x0<playerSize/2){
        pos.x0 = playerSize/2;
        playerSpeed.x0 *=-wallFric;
    }
    else if(pos.x0>cWidth-playerSize/2){
        pos.x0 = cWidth-playerSize/2;
        playerSpeed.x0 *=-wallFric;
    }
    if(pos.x1<playerSize/2){
        pos.x1 = playerSize/2;
        playerSpeed.x1 *=-wallFric;
    }
    else if(pos.x1>cHeight-playerSize/2){
        pos.x1 = cHeight-playerSize/2;
        playerSpeed.x1 *=-wallFric;
    }
    player.moveTo(pos);

    //draw
    lastPos = player.center;
    if(playerTrail.length>=40){
        playerTrail.shift();
    }
    playerTrail.push(lastPos);
    ctx.fillStyle = "red";
    for(let i=0; i<playerTrail.length; i++){
        ctx.beginPath();
        ctx.arc(playerTrail[i].x0, playerTrail[i].x1, playerSize/Math.sqrt(2), 0, 2*Math.PI);
        ctx.fill();
        ctx.closePath();
    }
    drawPoly(player);
}