var game = new Phaser.Game(1000, 600, Phaser.AUTO, ''),
    lives = 100,
    coins = 1000;


var gameState = {
    preload: function() {

        // All image loading
        game.load.pack('images', 'assetpack.json', null, this);

        // Map and sidebar for game functionality
        game.load.image('map','../assets/map.jpg');
        game.load.image('sidebar', '../assets/sidebar.png');
        

        // Tower sprite information
        game.load.json('towers', 'js/towers.json');

        // Enemy sprite information
        game.load.json('enemies', 'js/enemies.json');
    },
    create: function() {
        // Add game interface
        game.add.sprite(0, 0, 'map')
        game.add.sprite(800, 0, 'sidebar')
        
        // Tower sprites
        var towers = game.cache.getJSON('towers');
        for (tIndex in towers) {
            // Load the tower and the game image
            let tower = towers[tIndex];
            // game.load.image(tower.name, tower.sprite)

            // Create the sprite for the towers and enable drag and drop
            var towerSprite = game.add.sprite(800, 40 + tIndex * 75, tower.name);
            towerSprite.inputEnabled = true;
            towerSprite.input.enableDrag();
            towerSprite.input.enableSnap(32, 32, true, true);
        }

        // Enemy sprites
        var enemies = game.cache.getJSON('enemies');
        for (eIndex in enemies) {
            // Include enemy and sprite in animation
            let enemy = enemies[eIndex];
            // game.load.image(enemy.name, enemy.sprite)
        }

        // Add game information
        game.add.text(805, 510,
            'Coins: ' + coins.toString() + '\n' +
            'Lives: ' + lives.toString(),
            {
                font: '15px Arial',
            }
        )
        
        // Add in one monster to test enemy sprite creation
        var t1 = game.add.sprite(0, 0, 'troll');

    },
    update: function() {},
}

game.state.add('gameState', gameState)
game.state.start('gameState')