var menuState = {
    preload: function(){
        game.load.pack('GUIs', 'js/assets.json', null, this);
    },

    create: function(){
        
        var name = game.add.text(80,80,"Defend the Throne",{font: '100px Arial', fill: '#FFFFFF'});
        
        var button = game.add.button(game.world.centerX - 30, 400, 'start', this.start, this, 0,1,0);
        
    },
    
    start: function(){
        game.state.start("play");
    }
    
}

