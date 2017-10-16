var menuState = {
    
    create: function(){
        
        var name = game.add.text(80,80,"Defend the Throne",{font: '50 px Arial', fill: '#FFFFFF'});
        
        var start = game.add.text(80,500,"press S to start",{font: '25 px Arial', fill: '#FFFFFF'});
        
        
        var sKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
        
        sKey.onDown.addOnce(this.start, this);
    },
    
    start: function(){
        game.state.start("play");
    }
    
}
