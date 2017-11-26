var lives = 1, // Lives given to user
    coins = 400.0, // Starting coins for user
    currentWave = 1, // Current wave of monsters
    waves,currentLevel = 1,
    enemies = [], // List of enemies to update
    towers = [], // List of towers to update
    towerSprites, // Manage tower store
    builtTowers, // Manage user towers
    BGM, ele1, ele2, // BGM, sound effects
    monstersAlive = 0,
    gameText, // Show user game information
    tutorialPage = 1,
    paused = true,
    scroll,
    label,
    button;

function restart(){
    lives = 1;
    coins = 400.0;
    currentWave = 1;
    enemies = [];
    towers = [];
    monstersAlive = 0;
    towerSprites = game.add.group();
    enemyIndex = 0;
}

var enemyIndex = 0;

setInterval(function () {
    // Give user a coin every second
    coins += 1;
    
    // Distribute enemies in wave
    if (enemyIndex < enemies.length) {
        let e = enemies[enemyIndex];
        enemyIndex += 1
        e.start();
    }
    
    // Check to see if enemy in tower range
    for (tIndex in towers) {
        // Check all towers
        let tower = towers[tIndex];
        for (eIndex in enemies) {
            // Check all enemies
            let enemy = enemies[eIndex];
            
            if(tower.name != 'Bank'){
            // Change tint of enemy for distance visualization
                if (tower.checkEnemy(enemy)) {
                    enemy.sprite.tint = 0xd32f2f;
                    tower.fire(enemy);
                    break;
                } 
                else {
                enemy.sprite.tint = 0xffffff;
                }
            }
            else{
                coins += 0.05
            }
        }
    }
}, 1000)


var tutorial1State = {
    preload: function () {
        // All image loading
        
        game.load.pack('images', 'js/assets.json', null, this);
        game.load.pack('audios', 'js/assets.json', null, this);
        game.load.pack('maps','js/assets.json',null, this);
        
        /*
        game.load.tilemap('field1', 'assets/bg/dirtpathTS.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.json('field1JSON','assets/bg/dirtpathTS.json');
        game.load.image('grass', 'assets/bg/grass1.png');
        game.load.image('road', 'assets/bg/zroad2.png');
        */

        // Map and sidebar for game functionality
        game.load.image('bar', 'assets/bg/bar.png');

        // Wave information
        game.load.json('waves', 'js/tutorialwaves.json');

        // Tower, enemy sprite, level information
        game.load.json('towers', 'js/towers.json');
        game.load.json('enemies', 'js/enemies.json');
        game.load.json('levels','js/levels.json');
        
        game.load.image('health', 'assets/Etc/healthBar.png');
        game.load.image('progress1', 'assets/bg/ProgressBarRed.png');
        game.load.image('progress2', 'assets/bg/ProgressBarYellow.png');
        game.load.image('scroll', 'assets/Etc/scroll.png');
        game.load.pack('GUIs', 'js/assets.json', null, this);
        
    },

    create: function () {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        // Add game input
        game.input.mouse.capture = true;
        
        gameLevel = new Level(currentLevel);
        gameLevel.generatePath();
        
        game.add.sprite(0,600, 'bar');
        
        
        //game.add.sprite(800, 400, 'progress1');
        game.add.sprite(15*64,7*64-32,'throne');  
        // music
        
        BGM = game.add.audio("BGM");
        BGM.play();      

        // Tower sprites
        var towers = game.cache.getJSON('towers');
        towerSprites = game.add.group();
        for (tIndex in towers) {
            // Load the tower and the game image
            let tower = towers[tIndex];

            // Create the sprite for the towers
            var towerSprite = game.add.sprite(80 + tIndex * 120, 640, tower.name);
            towerSprite.defaultX = 80 + tIndex * 120
            towerSprite.defaultY = 640
            towerSprite.anchor.set(0.5,0.5);
            towerSprite.bulletRange = game.add.sprite(towerSprite.x, towerSprite.y,'range');
            towerSprite.bulletRange.alpha = 0;
            towerSprite.bulletRange.anchor.set(0.5, 0.5);

            // Add default properties to sprites
            towerSprite.cost = tower.cost

            // Enable drag and drop on the towers
            towerSprite.inputEnabled = true;
            towerSprite.input.enableDrag();
            towerSprite.input.enableSnap(32, 32, true, true);
            towerSprite.events.onDragStop.add(placeTower, this); // New Tower() objects are created in placeTower()
            
            towerSprite.events.onDragStart.add(drawCircle,this);
            towerSprite.events.onDragUpdate.add(updateCircle,this);
            towerSprite.events.onDragStop.add(destoryCircle,this);
            
            // Add information about the tower to the sidebar
            towerStyle = {
                font: "15px Arial"
            }
            game.add.text(towerSprite.x-30, towerSprite.y + 25, tower.name.toProperCase(), towerStyle)
            game.add.text(towerSprite.x-30, towerSprite.y + 40, "Cost: " + tower.cost.toString(), towerStyle)

            // Add sprite to group
            towerSprites.add(towerSprite);
        }


        waves = game.cache.getJSON('waves');


        // Add game information
        gameText = game.add.text(10, 500,
            'Wave: ' + currentWave.toString() + '\n' +
            'Coins: ' + coins.toString() + '\n' +
            'Lives: ' + lives.toString(), {
                font: '15px Arial',
            }
        )
           scroll =game.add.sprite(350,100,'scroll');
        label = game.add.text(game.world.centerX - 100,175,"Welcome To The Tutorial \nThe objective this game \nis to prevent enemies \nfrom reaching the throne.",{font: '20px Arial', fill: '#000000'});
        button = game.add.button(game.world.centerX +70 , 400, 'start', this.next, this, 0,1,0);
        button1=game.add.button(100000000,1000000,'back',this.next,this,0,1,0);
        
    },
    previous:function(){
        tutorialPage -=2;
        this.next()
    },
    next:function(){
        tutorialPage +=1;

        if (tutorialPage ==1){
            button1.destroy();
            label.destroy();
            label = game.add.text(game.world.centerX - 100,175,"Welcome To The Tutorial \nThe objective this game \nis to prevent enemies \n from reaching the throne.",{font: '20px Arial', fill: '#000000'});
            button1.destroy();
        }
        if (tutorialPage ==2){
            button1.destroy();
            label.destroy();
            label = game.add.text(game.world.centerX - 100,175,"The enemies will come\nwill walk along this path.\n\nYou must defend the throne\nwith towers!",{font: '20px Arial', fill: '#000000'});
            button1 = game.add.button(game.world.centerX, 400, 'back', this.previous, this, 0,1,0);
        }
        if(tutorialPage ==3){
            button1.destroy();
            label.destroy();
            label = game.add.text(game.world.centerX - 100,175,"Your towers are located at \nthe bottom of the screen.\n\n Click and drag one onto the \nfield!",{font: '20px Arial', fill: '#000000'});
            button1 = game.add.button(game.world.centerX, 400, 'back', this.previous, this, 0,1,0);
        }
        if(tutorialPage ==4){
            button1.destroy();
            label.destroy();
            label = game.add.text(game.world.centerX - 100,175,"Your towers will automatically\nfire at the enemy!\n",{font: '20px Arial', fill: '#000000'});
            button1 = game.add.button(game.world.centerX, 400, 'back', this.previous, this, 0,1,0);
        }
        if(tutorialPage==5){
            label.destroy();
            button.destroy();
            button1.destroy();
            scroll.destroy();
            paused = false;
        }
    },

    update: function () {
        
        
        if(!paused){        // Update the tower store
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
                enemy.update(gameLevel.turning)
            }
        }
        
        

        // Update game text
        gameText.text = 'Wave: ' + (currentWave-1).toString() + '\n' +
            'Coins: ' + Phaser.Math.floorTo(coins,0).toString() + '\n' +
            'Lives: ' + lives.toString();
        
        if(lives < 1){
            game.state.start('lose');
        }
        else if(monstersAlive == 0){
            if(currentWave ==1){
                //console.log(currentWave);
                var waveObject = waves[currentWave-1];
                for (eIndex in waveObject.enemies) 
                {
                    let enemy = waveObject.enemies[eIndex];
                    for (var enemyNum = 0; enemyNum < waveObject.enemies[eIndex].amount; enemyNum++) 
                    {
                        monstersAlive +=1;
                        enemies.push(new Enemy(enemy.name));
                    }
                }
            currentWave +=1;
            }
            else if (currentWave >= 2){
                this.win()
            }
        }
        }

        
        
    },
    win:function(){
        scroll =game.add.sprite(350,100,'scroll');
        label = game.add.text(game.world.centerX - 100,175,"Congratulations!\nPress next to return to\nthe menu!",{font: '20px Arial', fill: '#000000'});
        button = game.add.button(game.world.centerX +70 , 400, 'start', this.finish, this, 0,1,0);
        
    },
    finish:function(){
        game.state.start("menu");
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

 
function drawCircle(towerSprite){
    towerSprite.bulletRange.alpha = 1; 
}

function updateCircle(towerSprite){
    //console.log(towerSprite.x, towerSprite.y);
    
    //console.log(towerSprite.bulletRange.x, towerSprite.bulletRange.y);
    
    towerSprite.bulletRange.x = towerSprite.x;
    towerSprite.bulletRange.y = towerSprite.y;
}

function destoryCircle(towerSprite){
    towerSprite.bulletRange.alpha = 0;
}


// String utility for proper formatting 
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};


