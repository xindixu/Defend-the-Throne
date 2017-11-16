class Level {
    
    constructor(level){
        
        var levels = game.cache.getJSON('levels');
        levels = levels.filter(function (l) {
            return l.level == level;
        })
        
        var level = levels[0];
        
        this.map = game.add.tilemap(level.mapName);
        this.map.addTilesetImage(level.bottomImage);
        this.map.addTilesetImage(level.topImage);
        
        this.bottomLayer = this.map.createLayer('bg');
        this.topLayer = this.map.createLayer('path');
    }
}