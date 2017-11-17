var loseState = {
    create: function(){
        var info = game.add.text(80,80,"You lose!",{font: "100px Arial", fill: '#FFFFFF'});
        
        var button = game.add.button(game.world.centerX - 30, 400, 'start', this.start, this, 0,1,0);
    },
    
    start: function(){
        // BUG: need to reload everything in playState
        restart();
        game.state.start("play");
    }

}