var menuState = {
    preload: function(){
        game.load.pack('GUIs', 'js/assets.json', null, this);
    },

    create: function(){
        
        game.add.sprite(0,0,'menu');
        
        var button = game.add.button(game.world.centerX - 100, 400, 'start', this.start, this, 0,1,0);        
        var label = game.add.text(game.world.centerX - 100,500,"Play",{font: '20px Times', fill: '#FFFFFF'});
        
        var button1 = game.add.button(game.world.centerX +50 , 400, 'start', this.tutorial, this, 0,1,0);
        var label1 = game.add.text(game.world.centerX + 50,500,"Tutorial",{font: '20px Times', fill: '#FFFFFF'});
        
    },
    
    start: function(){
        game.state.start("play");
    },
    
    tutorial: function(){
        game.state.start("tutorial1");
    
    }
    
}

