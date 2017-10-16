var loseState = {
    create: function(){
        var info = game.add.text(80,80,"You lose!",{font: '50 px Arial', fill: '#FFFFFF'});
        
        var restart = game.add.text(80,500,"press R to restart",{font: '25 px Arial', fill: '#FFFFFF'});
        
        var rKey = game.input.keyboard.addKey(Phaser.Keyboard.R);
        
        rKey.onDown.addOnce(this.restart, this);
    },
    
    restart: function(){
        // BUG: need to reload everything in playState
        
        restart();
        game.state.start("play");
    }

}