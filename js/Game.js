/*
 * Defend the Throne
 * Ian Mobbs, Jerry Lam, Xindi Xu
 * CS 329E Game Dev
 */

var game = new Phaser.Game(1000, 600, Phaser.AUTO, ''), // Phaser game instances
    bounds,
    lives = 10, // Lives given to user
    coins = 195, // Starting coins for user
    currentWave = 1, // Current wave of monsters
    enemies = [], // List of enemies to update
    towerSprites, // Manage tower store
    grass,dirtPath, map,
    builtTowers, // Manage user towers
    bmd = null,
    gameText; // Show user game information

setInterval(function() {
    coins += 1
}, 1000)

setInterval(function() {
    if (enemies.length > 0) { 
        let e = enemies.pop();
        e.start();
    }
}, 1000)

// Game state manager
var gameState = {
    preload: function () {
        // All image loading
        game.load.pack('images', 'js/assets.json', null, this);

        // Map and sidebar for game functionality
        game.load.tilemap('field1','assets/bg/dirtpathTS.json',null,Phaser.Tilemap.TILED_JSON);
        game.load.image('grass','assets/bg/grass.png');
        game.load.image('road','assets/bg/road.png');
        game.load.image('sidebar', '../assets/sidebar.png');

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
        grass = map.createLayer('grass');
        dirtPath = map.createLayer('road');
        
        game.add.sprite(800, 0, 'sidebar');
        
        // Add game bound
        bounds = new Phaser.Rectangle(0,0,800,600);
        
        // load in towers in the store
        var towers = game.cache.getJSON('towers');
        towerSprites = game.add.group();

        for(tIndex in towers){
            let tower = towers[tIndex];
            var towerSprite = game.add.sprite(800, 40 + tIndex * 75, tower.name);
            towerSprite.cost = tower.cost
            towerStyle = {
                font: "20px Arial"
            }
            game.add.text(towerSprite.x + 75, towerSprite.y, tower.name.toProperCase(), towerStyle)
            game.add.text(towerSprite.x + 75, towerSprite.y + 25, "Cost: " + tower.cost.toString(), towerStyle)
        }
        
        
        
        t = new Tower("nest");
       
        
        
        /*
              
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
        */
        // path for enemy
        bmd = game.add.bitmapData(game.width,game.height);
        var points = {
            'x': [0, 200, 120, 456, 640],
            'y': [0, 300, 120, 156, 480]};
        
        for(var i = 0; i < 1; i += 1){
            var px = game.math.linearInterpolation(points.x,i);
            var py = game.math.linearInterpolation(points.y,i);
            bmd.rect(px,py,3,3,'rgba(245,0,0,1)');
        };
        
        
        
        
        
        
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
        // var t1 = game.add.sprite(0, 0, 'troll');

    },
    
    update: function () { 
        
       
        
        // Update all enemies

        // for (eIndex in enemies) {
        //     var enemy = enemies[eIndex];
        //     // console.log(enemy);
        //     enemy.update();
        // }
        
        /*
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
        */
        
      // gameText.text = 'Wave: ' + currentWave.toString() + '\n' + 'Coins: ' + coins.toString() + '\n' + 'Lives: ' + lives.toString()
        for(var i = 0; i < enemies.length; i ++){
            game.physics.arcade.collide(enemies[i],grass);
        }
        // test if mouse action is captured
        game.debug.text("Left Button: " + game.input.activePointer.leftButton.isDown, 300, 132);
        game.debug.text("Middle Button: " + game.input.activePointer.middleButton.isDown, 300, 196);
        game.debug.text("Right Button: " + game.input.activePointer.rightButton.isDown, 300, 260);
        
        var name = (game.input.activePointer.targetObject) ? game.input.activePointer.targetObject.sprite.key : 'none';
        game.debug.text("Pointer Target: " + name, 32,32);
        
        

    }
    
    

}

class Tower{
    constructor(type){
        this.tower = game.add.sprite(800,40,type);
        this.inputEnabled = true;
        this.tower.anchor.set(0.5, 0.5);
        this.tower.inputEnabled = true;
        this.tower.input.enableDrag();
        this.tower.input.boundsRect = bounds;
        
        
        
        // it should change as the type changes
        this.bullets = game.add.weapon(30,'rock');
        this.bullets.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS;
        this.bullets.bulletSpeed = 800;
        this.bullets.fireRate = 1000;
        this.bullets.trackSprite(this.tower, 0, 0);
        
    }
    
    fire(){
        this.bullets.fireAngle = game.math.angleBetween(this.tower.x,this.tower.y,enemy.x,enemy.y);
        this.bullets.fire();
        
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
        // this.enemy.alpha = 0;
        this.enemy.anchor.set(0.5, 0.5);
        
        game.physics.enable(this.enemy);
        this.enemy.body.immovable = false;
        this.enemy.body.collideWorldBounds = true;
        this.enemy.body.bounce.setTo(1,1);
        
        this.enemy.animations.add('idle',[0,1,2,3,4],15,true);
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