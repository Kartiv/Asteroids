class jn{
    static random(a,b){
        return a + Math.random()*(b-a);
    }
    
    static randint(a,b){
        return a+Math.floor(Math.random()*(b-a));
    }
    
    static randomize(arr){
        let newarr = [];
        let m = arr.length;
        for(let i=0; i<m; i++){
            let s = jn.randint(0,arr.length);
            newarr.push(arr.splice(s,1)[0]);
        }
        return newarr;
    }
}

class polygon{
    constructor(vertices){
        this.vertices = vertices;

        //calculate center
        this.updateCenter();
        this.order();
    }

    updateCenter(){
        let x = 0;
        let y = 0;
        for(let i=0; i<this.vertices.length; i++){
            x+=this.vertices[i].x0;
            y+=this.vertices[i].x1;
        }
        x /= this.vertices.length;
        y /= this.vertices.length;
        this.center = new vec2d(x,y);
    }

    edge(i){
        return this.vertices[i].sub(this.vertices[(i+1)%this.vertices.length]);
    }

    project(axis){
        let min = Number.MAX_VALUE;
        let max = -Number.MAX_VALUE;
        for(let i=0; i<this.vertices.length; i++){
            let proj = this.vertices[i].project(axis);
            min = Math.min(proj, min);
            max = Math.max(proj, max);
        }
        return([min, max]);
    }

    centralized(){
        let newVerts = [];
        for(let i=0; i<this.vertices.length; i++){
            newVerts[i] = this.vertices[i].sub(this.center);
        }
        return newVerts;
    }

     order(){
         let centralized = this.centralized();
         centralized.sort((a,b)=>{
            let anga = Math.atan2(a.x1, a.x0);
            let angb = Math.atan2(b.x1, b.x0);
            if(anga<0){
                anga+=2*Math.PI;
            }
            if(angb<0){
                angb+=2*Math.PI;
            }
            return anga-angb;
         })
         for(let i=0; i<this.vertices.length; i++){
            centralized[i] = centralized[i].add(this.center);
        }
        this.vertices = centralized;
     }

     moveTo(x,y){
         if(!y){
            var offset = x.sub(this.center);
         }
         else{
            var offset = new vec2d(x - this.center.x0, y - this.center.x1);
         }

         for(let i=0; i<this.vertices.length; i++){
             this.vertices[i] = this.vertices[i].add(offset);
         }
         this.updateCenter();
     }

    static generateConvex(N, bound){
        let X = [];
        let Y = [];
        for(let i=0; i<N; i++){
            X[i] = jn.randint(0,bound);
            Y[i] = jn.randint(0,bound);
        }
        X.sort((a,b)=>{
            return a-b;
        })
        Y.sort((a,b)=>{
            return a-b;
        })
        let xmin = X[0];
        let xmax = X[X.length-1];
        let ymin = Y[0];
        let ymax = Y[Y.length-1];
        let xGroups = [[xmin],[xmin]];
        let yGroups = [[ymin], [ymin]];
        for(let i=1; i<N-1; i++){
            let s1 = jn.randint(0,2);
            let s2 = jn.randint(0,2);
            if(s1){
                xGroups[0].push(X[i])
            }
            else{
                xGroups[1].push(X[i]);
            }
            if(s2){
                yGroups[0].push(Y[i])
            }
            else{
                yGroups[1].push(Y[i]);
            }
        }
        xGroups[0].push(xmax);
        xGroups[1].push(xmax);
        yGroups[0].push(ymax);
        yGroups[1].push(ymax);

        let xVec = [];
        let yVec = [];
        for(let i=0; i<xGroups[0].length-1; i++){
            xVec.push(xGroups[0][i+1]-xGroups[0][i]);
        }
        for(let i=0; i<xGroups[1].length-1; i++){
            xVec.push(xGroups[1][i]-xGroups[1][i+1]);
        }
        for(let i=0; i<yGroups[0].length-1; i++){
            yVec.push(yGroups[0][i+1]-yGroups[0][i]);
        }
        for(let i=0; i<yGroups[1].length-1; i++){
            yVec.push(yGroups[1][i]-yGroups[1][i+1]);
        }

        yVec = jn.randomize(yVec);
        
        let Vectors = [];
        for(let i=0; i<xVec.length; i++){
            Vectors.push(new vec2d(xVec[i], yVec[i]));
        }
        
        Vectors.sort((a,b)=>{
            let anga = Math.atan2(a.x1, a.x0);
            let angb = Math.atan2(b.x1, b.x0);
            if(anga<0){
                anga+=2*Math.PI;
            }
            if(angb<0){
                angb+=2*Math.PI;
            }
            return anga-angb;
        })

        let verts = [Vectors[0].add(new vec2d(xmax,ymax))];
        for(let i=1; i<Vectors.length; i++){
            verts.push(verts[i-1].add(Vectors[i]));
        }

        return new polygon(verts);
    }

    static SAT(poly1, poly2){
        for(let i=0; i<poly1.vertices.length; i++){
            let axis = poly1.edge(i).normal();
            let p1 = poly1.project(axis);
            let p2 = poly2.project(axis);
            if(p1[0]>p2[1] || p2[0]>p1[1]){
                return false;
            }
        }
        for(let i=0; i<poly2.vertices.length; i++){
            let axis = poly2.edge(i).normal();
            let p1 = poly1.project(axis);
            let p2 = poly2.project(axis);
            if(p1[0]>p2[1] || p2[0]>p1[1]){
                return false;
            }
        }
        return true;
    }
}

class vec2d{
    constructor(x0,x1){
        this.x0 = x0;
        this.x1 = x1;
    }

    add(v){
        return new vec2d(this.x0+v.x0, this.x1+v.x1);
    }

    sub(v){
        return new vec2d(this.x0-v.x0, this.x1-v.x1);
    }

    scale(scalar){
        return new vec2d(this.x0 * scalar, this.x1 * scalar);
    }

    dot(vec){
        return this.x0*vec.x0+this.x1*vec.x1;
    }

    norm(){
        return Math.sqrt((this.x0)**2+(this.x1)**2);
    }

    normalize(){
        if(this.norm()==0){
            return new vec2d(0,0);
        }
        return new vec2d(this.x0/this.norm(), this.x1/this.norm());
    }

    normal(){
        return (new vec2d(-this.x1, this.x0)).normalize();
    }

    project(axis){
        return this.dot(axis)/axis.norm();
    }
}

class asteroid extends polygon{

    constructor(vertices, xpos, ypos, size, dir, speed){
        super(vertices);
        this.size = size;
        this.dir = dir.normalize();
        this.speed = speed;
        this.moveTo(xpos,ypos);
        this.lastPos = new vec2d(xpos,ypos);
    }

    update(i){
        //check for collision
        if(polygon.SAT(player, this)){
            if(playerSpeed.norm() >= damageSpeed){
                if(this.size>10){
                    let n = jn.randint(10,20);
                    for(let j=0; j<n; j++){
                        var sizeMult = 5;
                        astList.push(new asteroid(polygon.generateConvex(jn.randint(4,7), sizeMult*this.size/(n)).vertices, this.center.x0+(-1)**n*20, 
                        this.center.x1+(-1)**n*20, sizeMult*this.size/(n), new vec2d(jn.randint(0, cWidth), jn.randint(0, cHeight)), this.speed*(-1)**n));
                    }
                    astList.splice(i,1);
                }
            }

            else
            {
                this.draw();
                clearListeners();
            }
            //ded.play(); SOUND HERE
        }
        else{
            this.lastPos = this.center;
            this.moveTo(this.center.add(this.dir.scale(dt*this.speed)));
            if(this.center.x0<-this.size || this.center.x0>cWidth+this.size || this.center.x1<-this.size
                || this.center.x1>cHeight+this.size){
                astList.splice(i,1);
            }
            this.draw();
        }
    }

    draw(){
        drawPoly(this, "blue");
    }
}

class food extends polygon{
    constructor(vertices, xpos, ypos){
        super(vertices)
        this.moveTo(xpos,ypos);
    }

    update(i){
        //draw
        this.draw();

        //check for collision
        if(polygon.SAT(player, this)){
            foodList.splice(i,1);
            score++;
            astSpawn += 0.0001 * 1/(1+Math.exp(-score+10));
            scoreDiv.innerText = "SCORE: " + score.toString();
            //coinSound.play(); SOUND HERE
        }
    }

    draw(){
        drawPoly(this, "gold");
    }
}