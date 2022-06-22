var foodList;
const foodSize = 10;
const minDist = 200;

function updateFood(){
    if(foodList.length == 0){
        let x = jn.randint(foodSize+minDist, cWidth-foodSize-minDist);
        let y = jn.randint(foodSize+minDist,cHeight-foodSize-minDist);
        foodList.push(new food([new vec2d(x-foodSize/2,y-foodSize/2), new vec2d(x-foodSize/2, y+foodSize/2), 
            new vec2d(x+foodSize/2, y-foodSize/2), new vec2d(x+foodSize/2, y+foodSize/2)], x, y));
    }
    for(let i=0; i<foodList.length; i++){
        foodList[i].update(i);
    }
}