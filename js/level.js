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
    }
    
    
    // pass in json file for the tilemap 
    generatePath(){
        this.path = {
            //!!!!! fix it! how to initialize two arrays??? it works this way, but..
            'x':[],
            'y':[]
        };

        var array = this.levelJson.layers[1].data;
        var index = 0;
        for(var j = 0; j < 10; j ++ ){
            for(var i = 0; i < 16; i ++){
                if(array[index] != 0){
                    game.add.sprite(i*64,j*64,'coin');
                    this.path.x.push(i*64);
                    this.path.y.push(j*64); 
                }
                index += 1;
            }
        }
        
        console.log(this.path)
    }
    
}