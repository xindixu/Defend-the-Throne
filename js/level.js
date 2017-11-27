class Level {
    
    constructor(level){
        
        var levels = game.cache.getJSON('levels');
        levels = levels.filter(function (l) {
            return l.level == level;
        })
        
        var level = levels[0];
        this.levelJson = game.cache.getJSON(level.mapJson);
        
        this.map = game.add.tilemap(level.mapName);
        this.map.addTilesetImage(level.bottomImage);
        this.map.addTilesetImage(level.topImage);
        
        this.bottomLayer = this.map.createLayer('bg');
        this.topLayer = this.map.createLayer('path');
        
        // use this array to guide the enemies
        this.array = this.levelJson.layers[1].data;
    }
    
    getNextPoint(point,direction){
        if(direction == "right") {
            return [point[0]+1,point[1]];
        }
        else if(direction == "left"){
            return [point[0]-1,point[1]];
        }
        else if(direction == "up"){
            return [point[0],point[1]-1];
        }
        else{
            return [point[0],point[1]+1];
        }
    }
    
    testIsValid(point){
        var index = point[1]*16 + point[0];
        if(this.array[index] != 0){
            return true;
        }
        else{
            return false;
        }
    }
    
    // pass in json file for the tilemap 
    generatePath(){
        //this.testSprite = game.add.sprite(0,0,'throne');
        //this.testSprite.anchor.set(0.5,0.5);
        
        var point = [0,1];
        var direction = "right";
        // "right","left","up","down"
        this.path = [[0,1]];
        
        this.turning = {
            path:[[0,1]],
            direction:["right"]
        }
        var index = 0;
        
        while(true){ 
            // calculate next point base on current one & direction
            var nextPoint = this.getNextPoint(point,direction);
            if(point[0] == 15 && point[1] == 7){
                break;
            }
            // test if the nextPoint is valid, there is an actual path
            index = nextPoint[1]*16 + nextPoint[0];
            
            if(this.testIsValid(nextPoint)){
                point = nextPoint;
            }
            else{
                // change the direction
                var possibleDirection = [];
                if(direction == "right" || direction == "left"){
                    possibleDirection = ["up","down"];
                }
                else if(direction == "up" || direction == "down"){
                    possibleDirection = ["right","left"];
                }
                
                var testPoint = this.getNextPoint(point,possibleDirection[0]);
                if(this.testIsValid(testPoint)){
                    direction = possibleDirection[0];
                } 
                else{
                    direction = possibleDirection[1];
                }    
                // store information 
                this.turning.path.push(point);
                this.turning.direction.push(direction);
            }
        }
        //console.log(this.turning);
        
        
        /*
        this.path1 = {
            x:[],
            y:[]
        };
        this.path2 = [];

        this.turnningPoints = {
            position: [],
            turnTo:""
        }
        
        var index = 0;
        
        var direction = "right";
        
        for(var j = 0; j < 10; j ++ ){
            for(var i = 0; i < 16; i ++){
                // mark positions of path
                if(array[index] != 0){
                    game.add.sprite(i,j,'coin');
                    this.path2.push([i,j])
                    this.path1.x.push(i);
                    this.path1.y.push(j);
                }
                index += 1;
            }
            
        }
        
        console.log(this.path1);
        console.log(this.path2);
        
       
        
        var x = 0;
        var y = 0;
        var currentPos = [x,y];
        while true {
            if direction == "right" {
                
            }
        }
        
        
        
        
        
        
        var direction = "right"
        for(var point in this.path2) {
            // find the next point based on the current point & direction
            var nextPoint = [];
            if(direction == "right"){
                nextPoint = [point.x+1,point.y];
            }
            else if(direction == "left"){
                nextPoint = [point.x-1,point.y];
            }
            else if(direction == "up"){
                nextPoint = [point.x,point.y-1];
            }
            else{
                nextPoint = [point.x,point.y+1]
            }
            
            
            
        }
        */
        
    }
    
}