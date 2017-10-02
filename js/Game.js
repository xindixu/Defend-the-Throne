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
    towers = [], // List of towers to update
    towerSprites, // Manage tower store
    builtTowers, // Manage user towers
    gameText; // Show user game information

setInterval(function() {
    coins += 1
}, 1000)

enemyIndex = 0
setInterval(function() {
    if (enemyIndex < enemies.length) { 
        let e = enemies[enemyIndex];
        e.start();
        enemyIndex += 1
    }
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
            towerSprite.defaultX = 800
            towerSprite.defaultY = 40 + tIndex * 75
            
            // Add tower cost to the sprite object
            towerSprite.cost = tower.cost

            // Enable drag and drop on the towers
            towerSprite.inputEnabled = true;
            towerSprite.input.enableDrag();
            towerSprite.input.enableSnap(32, 32, true, true);
            towerSprite.events.onDragStop.add(placeTower, this)

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
        for (eIndex in waveObject.enemies) {
            let enemy = waveObject.enemies[eIndex];
            for (var enemyNum = 0; enemyNum < waveObject.enemies[eIndex].amount; enemyNum++) {
                console.log("EEEEE", enemy)
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
        // var t1 = game.add.sprite(0, 0, 'troll');

    },
    update: function () {
        // Check to see if enemy in tower range
        for (tIndex in towers) {
            // Check all towers
            let tower = towers[tIndex];
            for (eIndex in enemies) {
                // Check all enemies
                let enemy = enemies[eIndex];

                // Change tint of enemy for distance visualization
                if (tower.checkEnemy(enemy)) {
                    enemy.sprite.tint = 0xd32f2f
                } else {
                    enemy.sprite.tint = 0xffffff
                }
            }
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
        enemies = enemies.filter(function(e) {
            return e.name == type;
        })
        var enemy = enemies[0];
        console.log("TYPE", type)
        console.log("ENEMIES", enemies)

        this.health = enemy.health;
        this.alive = true;
        
        this.sprite = game.add.sprite(0, 0, enemy.name);
        // this.enemy.alpha = 0;
        this.sprite.anchor.set(0.5, 0.5);
        
        game.physics.enable(this.sprite);
        this.sprite.body.immovable = false;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.setTo(1,1);
        
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

    start() {
        // this.enemy.alpha = 1000000;
        this.sprite.body.velocity.x = 100;
        this.sprite.animations.play('idle');
    }
}

class Tower {
    constructor(type, x, y) {
        var towers = game.cache.getJSON('towers')
        towers = towers.filter(function(t) {
            return t.name == type;
        })
        console.log("TYPE", type)
        console.log("TOWERS", towers)
        var tower = towers[0];

        this.damage = tower.damage;
        this.sprite = game.add.sprite(x, y, tower.name);
    }

    checkEnemy(enemy) {
        let eX = enemy.sprite.x,
            eY = enemy.sprite.y,
            distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, eX, eY);
        if (distance <= 200) {
            return true;
        } else {
            return false;
        }
    }
}

function placeTower(towerSprite) {
    // Place tower
    var newTower = new Tower(towerSprite.key, towerSprite.x, towerSprite.y);
    towers.push(newTower)
    
    // Reset store sprite location
    towerSprite.x = towerSprite.defaultX,
    towerSprite.y = towerSprite.defaultY
    
    // Decrement coins
    coins -= towerSprite.cost
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