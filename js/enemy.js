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
        this.maxhealth = enemy.health;
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
        
        
        var health = game.add.sprite(-20,30,"health");
        health.cropEnabled = true;
        this.sprite.addChild(health);

    }

    // Damage enemy
    damage(damageAmount) {
        this.health -= damageAmount
        
        //When Damaged, crop the health bar.
        var remain = (this.health/this.maxhealth)*40; // This 40 is the length of the health bar!!
        this.lifeRemaining = new Phaser.Rectangle(0, 0, remain, this.sprite.children[0].height);
        this.sprite.children[0].crop(this.lifeRemaining);
        this.sprite.children[0].updateCrop();
        if (this.health <= 0) {
            monstersAlive-=1;
            this.alive = false;
            var sprite = this.sprite.game.add.sprite(this.sprite.x-30,this.sprite.y-30,this.sprite.key);
            sprite.frame =1;
            game.add.tween(sprite).to( { alpha: 0 }, 2000, Phaser.Easing.Linear.None, true, 0, 0, false);
            this.sprite.destroy();
            coins += this.value;
        }
    }

    // Start moving enemy
    start() {
        this.alive = true;
        this.sprite.alpha =1;
        this.sprite.animations.play('left');
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

//Health Bar class, child class of enemy
class healthBar extends Enemy{
    constructor(){
        game.load.image("health", "assets/Etc/healthBar.png");
        game.add.sprite(0,0,"health");
        
    }
}