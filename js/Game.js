String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

var game = new Phaser.Game(1000, 600, Phaser.AUTO, ''),
    lives = 100,
    coins = 150,
    wave = 1;

var towerSprites;

var gameState = {
    preload: function() {

        // All image loading
        game.load.pack('images', 'js/assets.json', null, this);

        // Map and sidebar for game functionality
        game.load.image('map','../assets/map.jpg');
        game.load.image('sidebar', '../assets/sidebar.png');
        

        // Tower and enemy sprite information
        game.load.json('towers', 'js/towers.json');
        game.load.json('enemies', 'js/enemies.json');
    },
    create: function() {
        // Add game interface
        game.add.sprite(0, 0, 'map')
        game.add.sprite(800, 0, 'sidebar')
        
        // Tower sprites
        var towers = game.cache.getJSON('towers');
        towerSprites = game.add.group();
        for (tIndex in towers) {
            // Load the tower and the game image
            let tower = towers[tIndex];
            // game.load.image(tower.name, tower.sprite)

            // Create the sprite for the towers and enable drag and drop
            var towerSprite = game.add.sprite(800, 40 + tIndex * 75, tower.name);
            towerSprite.cost = tower.cost
            towerSprite.inputEnabled = true;
            towerSprite.input.enableDrag();
            towerSprite.input.enableSnap(32, 32, true, true);
            towerSprites.add(towerSprite);

            // Add information about the tower
            towerStyle = {
                font: "20px Arial"
            }
            game.add.text(towerSprite.x + 75, towerSprite.y, tower.name.toProperCase(), towerStyle)
            game.add.text(towerSprite.x + 75, towerSprite.y + 25, "Cost: " + tower.cost.toString(), towerStyle)
        }

        // Add game information
        game.add.text(805, 510,
            'Wave: ' + wave.toString() + '\n' +
            'Coins: ' + coins.toString() + '\n' +
            'Lives: ' + lives.toString(),
            {
                font: '15px Arial',
            }
        )
        
        // Add in one monster to test enemy sprite creation
        var t1 = game.add.sprite(0, 0, 'troll');

    },
    update: function() {
        console.log(towerSprites.children)
        for (tIndex in towerSprites.children) {
            let tower = towerSprites.children[tIndex];
            if (coins > tower.cost) {
                // console.log('can\'t afford', tower.name)
                tower.inputEnabled = false;
                tower.tint = 0x32332
            } else {
                // console.log('can afford', tower.name)
                tower.inputenabled = true,
                tower.tint = null
            }
        }
    },
}

game.state.add('gameState', gameState)
game.state.start('gameState')