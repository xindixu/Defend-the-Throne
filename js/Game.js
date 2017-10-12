/*
 * Defend the Throne
 * Ian Mobbs, Jerry Lam, Xindi Xu
 * CS 329E Game Dev
 * Last completed - Sprint 1 hha
 */

// Global variables
var game = new Phaser.Game(1000, 600, Phaser.AUTO, ''), // Phaser game instances
    lives = 10, // Lives given to user
    coins = 290, // Starting coins for user
    currentWave = 1, // Current wave of monsters
    enemies = [], // List of enemies to update
    towers = [], // List of towers to update
    towerSprites, // Manage tower store
    builtTowers, // Manage user towers
    BGM, ele1, ele2, // BGM, sound effects
    monstersAlive=0,
    
    
    tween, logo,// TESTING
    
    gameText; // Show user game information

// Give user a coin every second
setInterval(function () {
    coins += 1
}, 1000)

// Distribute enemies in wave
enemyIndex = 0
setInterval(function () {
    if (enemyIndex < enemies.length) {
        let e = enemies[enemyIndex];
        enemyIndex += 1
        e.start();
    }
}, 1000)

// Towers fire every second
setInterval(function () {
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
                tower.fire(enemy);
                break
            } else {
                enemy.sprite.tint = 0xffffff
            }
        }
    }
}, 1000)

// Game state manager
var gameState = {
    preload: function () {
        
        
        // All image loading
        
        game.load.pack('images', 'js/assets.json', null, this);
        game.load.pack('audios', 'js/assets.json', null, this);
        
        game.load.tilemap('field1', 'assets/bg/dirtpathTS.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.json('field1JSON','assets/bg/dirtpathTS.json');
        game.load.image('grass', 'assets/bg/grass1.png');
        game.load.image('road', 'assets/bg/road2.png');

        // Map and sidebar for game functionality
        game.load.image('sidebar', 'assets/bg/sidebar.png');

        // Wave information
        game.load.json('waves', 'js/waves.json');

        // Tower and enemy sprite information
        game.load.json('towers', 'js/towers.json');
        game.load.json('enemies', 'js/enemies.json');
        
        
        
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Add game input
        game.input.mouse.capture = true;
        
        
        
        

        // Add game interface
        map = game.add.tilemap('field1');
        map.addTilesetImage('grass');
        map.addTilesetImage('road');
        grass = map.createLayer('bg');
        dirtPath = map.createLayer('path');
        game.add.sprite(800, 0, 'sidebar');
        
        
        // music
        
        BGM = game.add.audio("BGM");
        //BGM.play();
        
        
        // TESTING =======
        
        logo = game.add.sprite(0,0,'lightning');        
        tween = game.add.tween(logo).to({x:[0,500,500,0],y:[0,0,300,300]},4000,"Sine.easeInOut",true,-1,false);
                
    
        


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
            towerSprite.events.onDragStop.add(placeTower, this) // New Tower() objects are created in placeTower()

            // Add information about the tower to the sidebar
            towerStyle = {
                font: "20px Arial"
            }
            game.add.text(towerSprite.x + 75, towerSprite.y, tower.name.toProperCase(), towerStyle)
            game.add.text(towerSprite.x + 75, towerSprite.y + 25, "Cost: " + tower.cost.toString(), towerStyle)

            // Add sprite to group
            towerSprites.add(towerSprite);
        }



        // Add game information
        gameText = game.add.text(805, 510,
            'Wave: ' + currentWave.toString() + '\n' +
            'Coins: ' + coins.toString() + '\n' +
            'Lives: ' + lives.toString(), {
                font: '15px Arial',
            }
        )
        
        generatePath();
    },

    update: function () {
        // Update the tower store
        for (tIndex in towerSprites.children) {
            let tower = towerSprites.children[tIndex];
            // Can't afford this tower
            if (coins < tower.cost) {
                tower.inputEnabled = false;
                tower.tint = 0x32332
                // Can afford this tower
            } else {
                tower.inputEnabled = true;
                tower.tint = 0xffffff
            }
        }

        // Update enemy movement
        for (eIndex in enemies) {
            let enemy = enemies[eIndex]
            if (enemy.alive) {
                enemy.update()
            }
        }

        // Update game text
        gameText.text = 'Wave: ' + (currentWave-1).toString() + '\n' +
            'Coins: ' + coins.toString() + '\n' +
            'Lives: ' + lives.toString()
        
        
        if(monstersAlive==0)
        {
            var waves = game.cache.getJSON('waves'),
            waveObject = waves[currentWave - 1];
            for (eIndex in waveObject.enemies) 
            {
                let enemy = waveObject.enemies[eIndex];
                for (var enemyNum = 0; enemyNum < waveObject.enemies[eIndex].amount; enemyNum++) 
                {
                    monstersAlive +=1;
                    enemies.push(new Enemy(enemy.name));
                }
            }
            currentWave+=1;
        }
        
        
    }
}

// Enemy class
class Enemy {
    
    // Instantiate enemy with given type
    constructor(type) {
        // Get details of enemy type provided
        var enemies = game.cache.getJSON('enemies')
        enemies = enemies.filter(function (e) {
            return e.name == type;
        })
        var enemy = enemies[0];

        // Add information to object
        this.health = enemy.health;
        this.alive = false;
        this.value = enemy.coinsDropped

        // Add sprite to object
        this.sprite = game.add.sprite(0, 10, enemy.name);
        this.sprite.alpha = 0;
        this.sprite.anchor.set(0.5, 0.5);

        // Add physics to object
        game.physics.enable(this.sprite);
        this.sprite.body.immovable = false;
        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.setTo(1, 1);
        this.sprite.animations.add("left", [0, 1, 2, 3, 4, 5], 10, true);
        this.sprite.animations.add("right",[6,7,8,9,10,11],10,true);


    }

    // Damage enemy
    damage(damageAmount) {
        this.health -= damageAmount
        if (this.health <= 0) {
            monstersAlive-=1;
            this.alive = false;
            this.sprite.destroy();
            coins += this.value;
            
        }
    }

    // Start moving enemy
    start() {
        this.alive = true;
        this.sprite.alpha =1;
        this.sprite.animations.play('left');
        game.load.image("health", "assets/Etc/healthBar.png");
        var health = game.add.sprite(-20,30,"health");
        this.sprite.addChild(health);
        
    }

    // Updates enemy velocity based on location
    update() {
        // Checks to see if in top path
        if (this.sprite.x < 575 && this.sprite.y > 50) {
            this.sprite.body.velocity.x = 100;
            this.sprite.body.velocity.y = 0;
        // Checks to see if in right path
        } else if (this.sprite.y < 475 && this.sprite.x>=575) {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 100;
            this.sprite.animations.play('right');
        // Checks to see if in bottom path
        } else if (this.sprite.x < 800) {
            this.sprite.body.velocity.x = 100;
            this.sprite.body.velocity.y = 0;
            this.sprite.animations.play('left');
        // Enemy reached the throne
        } else {
            this.damage(this.health)
            lives -= 1
        }
    }
}
class healthBar extends Enemy{
    constructor(){
        game.load.image("health", "assets/Etc/healthBar.png");
        game.add.sprite(0,0,"health");
        
    }
}

// Tower class
class Tower {
    // Instantiate tower using given type and location drop
    constructor(type, x, y) {
        // Get details of tower type provided
        var towers = game.cache.getJSON('towers')
        towers = towers.filter(function (t) {
            return t.name == type;
        })
        var tower = towers[0];

        // Load details from tower information and create sprite
        this.damage = tower.damage;
        this.sprite = game.add.sprite(x, y, tower.name);

        // Add weapon to Tower
        this.bullets = game.add.weapon(100, tower.weapon);
        // Scale weapon to be smaller
        this.bullets.bullets.forEach(function (bullet) {
            bullet.scale.setTo(0.25, 0.25);
        }, this);

        // Remove bullet after it's moved 500px
        // this.bullets.bulletDistance = 150
        // this.bullets.bulletKillType = Phaser.Weapon.KILL_DISTANCE
        this.bullets.bulletKillType = Phaser.Weapon.KILL_NEVER

        // Speed at which bullet is fire
        this.bullets.bulletSpeed = 500;

        // Bullets come from tower
        this.bullets.trackSprite(this.sprite);
        this.soundEffect = game.add.audio(tower.soundEffect);
    }

    // Create bullet animation to send at enemy
    fire(enemy) {
        // Get angle of enemy
        let eX = enemy.sprite.x,
            eY = enemy.sprite.y,
            angle = Math.atan2(eY - this.sprite.y, eX - this.sprite.x) * 180 / Math.PI;
        // Fires bullet
        this.bullets.fireAngle = angle
        this.bullets.fire();
        enemy.damage(this.damage);
        this.soundEffect.play();
    }

    // Checks if enemy is in shooting radius
    checkEnemy(enemy) {
        // Could be code golfed as
        // return Phaser.Math.distance(this.sprite.x, this.sprite.y, enemy.sprite.x, enemy.sprite.y) <= 150 && enemy.alive;
        if (!enemy.alive) {
            return false;
        }
        // Get distance to enemy
        let eX = enemy.sprite.x,
            eY = enemy.sprite.y,
            distance = Phaser.Math.distance(this.sprite.x, this.sprite.y, eX, eY);

        // Return if distance in radius
        if (distance <= 150) {
            return true;
        } else {
            return false;
        }
    }
}

// Places tower and resets store
function placeTower(towerSprite) {
    // Place tower
    var newTower = new Tower(towerSprite.key, towerSprite.x, towerSprite.y);
    towers.push(newTower)

    // Reset store sprite location
    towerSprite.x = towerSprite.defaultX
    towerSprite.y = towerSprite.defaultY

    // Decrement coins
    coins -= towerSprite.cost
}

// String utility for proper formatting 
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


// pass in json file for the tilemap
function generatePath(){
    var path = {
        //!!!!! fix it! how to initialize two arrays??? it works this way, but..
        'x':[0,0],
        'y':[0,0]
    };
    var result = {
        'x':[0,0],
        'y':[0,0]
    }
    
    var json = game.cache.getJSON('field1JSON');
    var array = json.layers[0].data;
    var index = 0;
    for(var j = 0; j < 19; j ++ ){
        for(var i = 0; i < 25; i ++){
        
            if(array[index] == 0){
                game.add.sprite(i*32,j*32,'coin');
                path.x.push(i*32);
                path.y.push(j*32); 
            }
            index += 1;
        }
    }
    
    console.log(path);
    for(var k = 0; k < path.x.length; k++){
        var px = path.x.get(k);
        var py = path.y.get(k);
    }
    
}



// Add and start the game
game.state.add('gameState', gameState)
game.state.start('gameState')