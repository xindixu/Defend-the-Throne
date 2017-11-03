// Tower class
class Tower {
    // Instantiate tower using given type and location drop
    constructor(type, x, y) {
        // Get details of tower type provided
        var towers = game.cache.getJSON('towers')
    
        towers = towers.filter(function (t) {
            return t.name == type;
        })
        
        this.name = type
        
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
