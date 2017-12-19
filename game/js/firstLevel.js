var firstLevelState = {
	create: function() {
		stage = 1;
		score = 0;
		gunType = 0;
		playerHealth = 100;
		firstBossHealth = 100;
		laser = game.add.audio('laser');
		laser.volume = 0.2;
		laser.allowMultiple = true;

		stars = this.add.tileSprite(0, 0, 800, 600, 'background1');

		healthUp = this.add.group();
		healthUp.enableBody = true;
		healthUp.physicsBodyType = Phaser.Physics.ARCADE;

		throwFirstAid();

		explosionSound = game.add.audio('explosion');
		healthNoise = game.add.audio('healthSound');
		powerNoise = game.add.audio('powerUpSound');

		player = this.add.sprite(75, 250, 'player');
		player.anchor.setTo(0.5, 0.5);
		setTimeout(function(){
				player.body.setSize(56, 10, 1, 1);
		}, 500);

		this.physics.enable(player, Phaser.Physics.ARCADE);
		addTrail();

		cursors = game.input.keyboard.createCursorKeys();

		createBullets();
		bossBullets();
		fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		enemies = this.add.group();
		enemies.enableBody = true;
		enemies.physicsBodyType = Phaser.Physics.ARCADE;

		firstBoss = this.add.group();
		firstBoss.enableBody = true;
		firstBoss.physicsBodyType = Phaser.Physics.ARCADE;

		asteroids = this.add.group();
		asteroids.enableBody = true;
		asteroids.physicsBodyType = Phaser.Physics.ARCADE;

		createFirstEnemies();
		createAsteroids(5);
		createFirstBoss();

		bonusText = this.add.text(this.world.centerX - 100, this.world.centerY - 100, 'Bonus Points!', {fill : '#CCFF00'});
		playerHealthText = this.add.text(0, 10, 'Player Health:', {fill : '#00CCCC'});
		firstBossText = this.add.text(470, 10, 'UFO Health:', {fill : '#FF0066'});
		scoreText = this.add.text(0, 50, 'Score:', {fill : '#6600FF'});
		winText = this.add.text(this.world.centerX - 130, this.world.centerY - 50, 'Stage One Clear!', {fill : '#CCFF00'});
		loseText = this.add.text(this.world.centerX - 110, this.world.centerY - 50, 'GAME OVER', {fill : '#FF0066'});
		winText.visible = false;
		loseText.visible = false;
		firstBossText.visible = false;
		bonusText.visible = false;

		playerHealthText.font = 'Press Start 2P';
		playerHealthText.fontSize = 20;
		scoreText.font = 'Press Start 2P';
		scoreText.fontSize = 20;
		firstBossText.font = 'Press Start 2P';
		firstBossText.fontSize = 20;
		winText.font = 'Press Start 2P';
		winText.fontSize = 20;
		loseText.font = 'Press Start 2P';
		loseText.fontSize = 20;
		bonusText.font = 'Press Start 2P';
		bonusText.fontSize = 20;
	},

	update: function() {

		this.physics.arcade.overlap(bullets, enemies, collisionCheck, null, this);
		this.physics.arcade.overlap(bullets, firstBoss, collisionFirstBoss, null, this);
		this.physics.arcade.overlap(fireballs, player, collisionFireball, null, this);
		this.physics.arcade.overlap(player, enemies, deathCheck, null, this);
		this.physics.arcade.overlap(player, healthUp, healCheck, null, this);
		this.physics.arcade.overlap(asteroids, player, asteroidsDeathCheck, null, this);
		stars.tilePosition.x -= backgroundVelocity;

		createControls();
		scoreText.text = 'Score: ' + score;
		firstBossText.text = 'UFO Health: ' + firstBossHealth;
		playerHealthText.text = 'Player Health: ' + playerHealth;

		healthUp.x -= 2;
		healthUp.y += 0.5;

		if (enemies.x === -1000) {
			enemies.x = 600;
		}
	
		if ((enemies.countDead() === 100)) {
			asteroids.forEach(function(asteroid) {
        		asteroid.body.velocity.setTo(300, game.world.randomY);
        		asteroid.checkWorldBounds = true;
        		asteroid.outOfBoundsKill = true;
			});
		}

		if ((asteroids.countDead() === 5) && (firstBoss.x !== 500)) {
			firstBoss.x -= 2;
			firstBossText.visible = true;
		}
		
		if (firstBoss.x === 500) {
			firstBoss.x = firstBoss.x;
		}

		if (firstBoss.x < 780 && firstBoss.alive) {
			fireFireball();
		}

		if (playerHealth < 1) {
			playerTrail.kill();
			player.kill();
			loseText.visible = true;
			playerHealthText.visible = false;
			setTimeout(function(){
				restartGame(true)
			}, 2000);
		}

		if(bossOne.exists === false) {
			winText.visible = true;
			stars.tilePosition.x -= 10;
			firstLevelState.win();					
		}
	},

	win: function() {
		setTimeout(function(){
			game.state.start("secondLevel");		
		}, 3500);
	}
};

var collisionCheck = function(bullet, enemy) {
	bullet.kill();
	enemy.kill();
	score += 100;
}

var asteroidsDeathCheck = function(asteroid, player) {
	playerHealth = 0;
	explode(player);
	asteroid.kill();
}

var collisionFireball = function(player, fireball) {
	playerHealth -= 10;
	fireball.kill();
}

var collisionFirstBoss = function(bullet, boss) {
	bullet.kill();
	firstBossHealth -= 1;
	score += 100;
	if (firstBossHealth < 1) {
		fireballs.exists = false;
		firstBoss.children[0].kill();
		explode({x: 500, y: 200});

		for (var i = 0; i < fireballs.children.length; i++) {
			fireballs.children[i].kill();
		}

		bonus = (playerHealth * 20);
		score += bonus;
		if (playerHealth > 130) {
			score += 2000;
			bonusText.visible = true;
		}
		firstBoss.alive = false;
	}
}
