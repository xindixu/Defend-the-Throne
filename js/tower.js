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
        this.name = type

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
        
        // Call upgrade function on clicking tower by enabling input, adding a click event, and
        // calling the upgrade method
        this.sprite.inputEnabled = true;        
        this.sprite.events.onInputDown.add(this.upgrade, this)
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
    
    upgrade() {
        console.log("Upgrade!")
        // Get current towers
        let name = this.name
        var towers = game.cache.getJSON('towers')
        towers = towers.filter(function (t) {
            return t.name == name;
        })

        // If the current tower is an upgrade, return
        var tower;
        if (towers.length == 0) {
            console.log("No Upgrades Available")
            return
        } else {
            tower = towers[0];
        }

        // Get upgrades from tower object
        let upgrades = tower.upgrades
        if (upgrades == undefined) {
            return
        }

        // Draw menu object
        var menu = game.add.graphics(this.sprite.x, this.sprite.y);
        menu.lineStyle(2, 0xFEC221, 0.8);
        menu.beginFill(0x7C4610, 1);
        menu.drawRect(75, 25, 150, 25 + (upgrades.length * 25));

        // Add text to menu
        game.add.text(this.sprite.x + 80, this.sprite.y + 30, "Upgrades", {font: "14px Arial", fill: "#ffffff"})
        for (var uIndex = 0; uIndex < upgrades.length; uIndex++) {
            let upgrade = upgrades[uIndex]
            game.add.text(this.sprite.x + 80, this.sprite.y + 30 + ((uIndex + 1) * 25), upgrade.name + " (" + upgrade.cost + ")", {font: "14px Arial", fill: "#ffffff"})
        }

        // https://phaser.io/examples/v2/misc/pause-menu
    }
}
