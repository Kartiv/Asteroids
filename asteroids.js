var astList;;
var astSpawn;

function updateAsts(){
    //generate
    let s = Math.random();
    if(s<0.01){
        let xpos = jn.randint(0,cWidth);
        let xpos2 = jn.randint(0,cWidth);
        let ypos = jn.randint(0,cHeight);
        let ypos2 = jn.randint(0,cHeight);
        let n = jn.randint(4, 15);
        let size = jn.randint(80, 200);
        let s2 = jn.randint(0,4);
        if(s2==0){
            xpos = -size;
        }
        else if(s2==1){
            ypos = -size;
        }
        else if(s2==2){
            xpos = cWidth+size;
        }
        else{
            ypos = cHeight+size;
        }
        astList.push(new asteroid(polygon.generateConvex(n, size).vertices, xpos, ypos, size,
            new vec2d(xpos2-xpos, ypos2-ypos), 0.3));
    }

    //update
    for(let i=0; i<astList.length; i++){
        astList[i].update(i);
    }
}