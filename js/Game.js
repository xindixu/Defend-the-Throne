var game = new Phaser.Game(1000, 600, Phaser.AUTO, '');

let grid = {}
var gameState = {
    preload: function() {
        // Map and sidebar for game functionality
        game.load.image('map','../assets/map.jpg')
        game.load.image('sidebar', '../assets/sidebar.png')
        
        //Tower sprites
        game.load.image('nest', '../assets/nest.png')

        // Enemy sprites
        game.load.image('troll', '../assets/troll.png')
    },
    create: function() {
        // Add game interface
        game.add.sprite(0, 0, 'map')
        game.add.sprite(800, 0, 'sidebar')

        // Load in towers and enable drag and drop interactivity
        var towers = [
            game.add.sprite(800, 40, 'nest')
        ];
        for (var tIndex = 0; tIndex < towers.length; tIndex++) {
            // https://phaser.io/examples/v2/input/snap-on-drag
            var tower = towers[tIndex];
            tower.inputEnabled = true;
            tower.input.enableDrag();
            tower.input.enableSnap(32, 32, true, true);
        }
        // Add in one monster
        var t1 = game.add.sprite(0, 0, 'troll');

    },
    update: function() {

    }
}

game.state.add('gameState', gameState)
game.state.start('gameState')