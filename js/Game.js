/*
 * Defend the Throne
 * Ian Mobbs, Jerry Lam, Xindi Xu
 * CS 329E Game Dev
 */

var game = new Phaser.Game(1000, 600, Phaser.AUTO, ''), // Phaser game instances
    lives = 10, // Lives given to user
    coins = 195, // Starting coins for user
    currentWave = 1, // Current wave of monsters
    enemies = [], // List of enemies to update
    towerSprites, // Manage tower store
    builtTowers, // Manage user towers
    gameText; // Show user game information

setInterval(function() {
    coins += 1
}, 1000)

// Game state manager
var gameState = {
    preload: function () {
        // All image loading
        game.load.pack('images', 'js/assets.json', null, this);

        // Map and sidebar for game functionality
        game.load.image('map', '../assets/map.jpg');
        game.load.image('sidebar', '../assets/sidebar.png');

        // Wave information
        game.load.json('waves', 'js/waves.json');

        // Tower and enemy sprite information
        game.load.json('towers', 'js/towers.json');
        game.load.json('enemies', 'js/enemies.json');
    },
    create: function () {
        // Add game interface
        game.add.sprite(0, 0, 'map')
        game.add.sprite(800, 0, 'sidebar')

        // Tower sprites
        var towers = game.cache.getJSON('towers');
        towerSprites = game.add.group();
        for (tIndex in towers) {
            // Load the tower and the game image
            let tower = towers[tIndex];

            // Create the sprite for the towers
            var towerSprite = game.add.sprite(800, 40 + tIndex * 75, tower.name);

            // Add tower cost to the sprite object
            towerSprite.cost = tower.cost

            // Enable drag and drop on the towers
            towerSprite.inputEnabled = true;
            towerSprite.input.enableDrag();
            towerSprite.input.enableSnap(32, 32, true, true);

            // Add information about the tower to the sidebar
            towerStyle = {
                font: "20px Arial"
            }
            game.add.text(towerSprite.x + 75, towerSprite.y, tower.name.toProperCase(), towerStyle)
            game.add.text(towerSprite.x + 75, towerSprite.y + 25, "Cost: " + tower.cost.toString(), towerStyle)

            // Add sprite to group
            towerSprites.add(towerSprite);
            // console.log(towerSprites);
        }

        var waves = game.cache.getJSON('waves'),
            waveObject = waves[currentWave - 1];
        console.log("WAVE:",waveObject);        
        for (enemy in waveObject.enemies) {
            for (var enemyNum = 0; enemyNum < waveObject.enemies[enemy].amount; enemyNum++) {
                enemies.push(new Enemy(enemy.name));
            }
        }

        // Add game information
        gameText = game.add.text(805, 510,
            'Wave: ' + currentWave.toString() + '\n' +
            'Coins: ' + coins.toString() + '\n' +
            'Lives: ' + lives.toString(), {
                font: '15px Arial',
            }
        )

        // Add in one monster to test enemy sprite creation
        var t1 = game.add.sprite(0, 0, 'troll');

    },
    update: function () {
        // Update all enemies

        for (eIndex in enemies) {
            var enemy = enemies[eIndex];
            // console.log(enemy);
            enemy.update();
        }

        // Update the tower store
        for (tIndex in towerSprites.children) {
            let tower = towerSprites.children[tIndex];
            if (coins < tower.cost) {
                // console.log('can\'t afford', tower.name)
                tower.inputEnabled = false;
                tower.tint = 0x32332
            } else {
                // console.log('can afford', tower.name)
                tower.inputEnabled = true;
                tower.tint = 16777215
            }
        }
        gameText.text = 'Wave: ' + currentWave.toString() + '\n' +
        'Coins: ' + coins.toString() + '\n' +
        'Lives: ' + lives.toString()
    }
}

// Enemy class
class Enemy {
    constructor(type) {

        var enemies = game.cache.getJSON('enemies')
        enemies.filter(function(e) {
            e.name == type;
        })
        var enemy = enemies[0];

        this.health = enemy.health;
        this.alive = true;
        
        this.enemy = game.add.sprite(0, 0, enemy.name);
        this.enemy.anchor.set(0.5, 0.5);
        
        game.physics.enable(this.enemy);
        this.enemy.body.immovable = false;
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.bounce.setTo(1,1);
        
        // this.enemy.animations.add('idle',[0,1,2,3],10,true);
    }
    damage(damageAmount) {
        this.health -= damageAmount;
        
        if (this.health <= 0) {
            this.alive = false;
            this.tank.kill();
            return true;
        }
        return false;
    }

    update() {
        this.enemy.body.velocity.x = 100;
        this.enemy.animations.play('idle');    
    }
}

// Tower creation utility
// When creating a tower.....
// Create a new tower and select it
// When drag has stopped, place the tower
// Decrement coins
// Start attacking enemies (implement radius?)

// String utility for proper formatting 
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


// Add and start the game
game.state.add('gameState', gameState)
game.state.start('gameState')