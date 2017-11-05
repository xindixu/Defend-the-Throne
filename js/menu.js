var menuState = {
    preload: function(){
        game.load.pack('GUIs', 'js/assets.json', null, this);
    },

    create: function(){
        
        var name = game.add.text(40,80,"Defend the Throne",{font: '80px Arial', fill: '#FFFFFF'});
        
        var button = game.add.button(game.world.centerX - 100, 400, 'start', this.start, this, 0,1,0);
        var label = game.add.text(game.world.centerX - 100,450,"Play",{font: '20px Arial', fill: '#FFFFFF'});
        
        var button1 = game.add.button(game.world.centerX +50 , 400, 'start', this.tutorial, this, 0,1,0);
        var label1 = game.add.text(game.world.centerX + 50,450,"Tutorial",{font: '20px Arial', fill: '#FFFFFF'});
        
    },
    
    start: function(){
        game.state.start("play");
    },
    
    tutorial: function(){
        //game.state.start("tutorial");
    
    }
    
}

