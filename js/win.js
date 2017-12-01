var winState = {
    create: function(){
        
        game.add.sprite(0,0,'win');
        var button = game.add.button(game.world.centerX - 30, 400, 'start', this.start, this, 0,1,0);
        var label = game.add.text(game.world.centerX - 30,500,"Next Level",{font: '20px Times', fill: '#FFFFFF'});
    },
    
    start: function(){
        // BUG: need to reload everything in playState
        restart();
        game.state.start("play");
        
    }

}