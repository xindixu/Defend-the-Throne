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
        console.log(this.turning);
        
    }
    
}