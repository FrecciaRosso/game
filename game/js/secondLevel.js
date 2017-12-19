var secondLevelState = {

	create: function() {
		secondBossHealth = 125;
		stars = this.add.tileSprite(0, 0, 800, 600, 'background2');
		player = this.add.sprite(75, 250, 'player');
		player.anchor.setTo(0.5, 0.5);
		setTimeout(function(){
				player.body.setSize(56, 10, 1, 1);
		}, 500);
		this.physics.enable(player, Phaser.Physics.ARCADE);

		stageTwoText = this.add.text(this.world.centerX - 200, this.world.centerY - 50, 'Stage Two...GET READY', {fill : '#CCFF00'})
		stageTwoText.font = 'Press Start 2P';
		stageTwoText.fontSize = 20;

		healthUp = this.add.group();
		healthUp.enableBody = true;
		healthUp.physicsBodyType = Phaser.Physics.ARCADE;

		throwFirstAid();

		powerUp = this.add.group();
		powerUp.enableBody = true;
		powerUp.physicsBodyType = Phaser.Physics.ARCADE;

		throwPowerUp();

		firstExplosion = this.add.sprite(600, 130, 'explosion0');
		secondExplosion = this.add.sprite(590, 135, 'explosion1');
		thirdExplosion = this.add.sprite(595, 135, 'explosion2');

		firstExplosion.visible = false;
		secondExplosion.visible = false;
		thirdExplosion.visible = false;

		explosionSound = game.add.audio('explosion');

		addTrail();

		secondEnemies = this.add.group();
		secondEnemies.enableBody = true;
		secondEnemies.physicsBodyType = Phaser.Physics.ARCADE;
		createSecondEnemies();

		enemyShuttle = this.add.group();
		enemyShuttle.enableBody = true;
		enemyShuttle.physicsBodyType = Phaser.Physics.ARCADE;
		createEnemyShuttle();

		asteroids = this.add.group();
		asteroids.enableBody = true;
		asteroids.physicsBodyType = Phaser.Physics.ARCADE;
		createAsteroids(5);

		secondBoss = this.add.group();
		secondBoss.enableBody = true;
		secondBoss.physicsBodyType = Phaser.Physics.ARCADE;
		createSecondBoss();


		createBullets();
		fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		bonusText = this.add.text(this.world.centerX - 100, this.world.centerY - 100, 'Bonus Points!', {fill : '#CCFF00'});
		scoreText = this.add.text(0, 50, 'Score:', {fill : '#6600FF'});
		playerHealthText = this.add.text(0, 10, 'Health:', {fill : '#00CCCC'});
		loseText = this.add.text(this.world.centerX - 110, this.world.centerY - 50, 'GAME OVER', {fill : '#FF0066'});
		secondBossText = this.add.text(450, 10, 'Stinkfly Health:', {fill : '#FF0066'});
		enemyShuttleText = this.add.text(450, 10, 'Shuttle Health:', {fill : '#FF0066'});
		winText = this.add.text(this.world.centerX - 130, this.world.centerY - 50, 'Stage Two Clear!', {fill : '#CCFF00'});

		winText.visible = false;
		loseText.visible = false;
		enemyShuttleText.visible = false;
		secondBossText.visible = false;
		bonusText.visible = false;

		setTimeout(function(){
			stage = 2;
			bossBullets();
			stageTwoText.visible = false;
		}, 3500);

		playerHealthText.font = 'Press Start 2P';
		playerHealthText.fontSize = 20;
		scoreText.font = 'Press Start 2P';
		scoreText.fontSize = 20;
		enemyShuttleText.font = 'Press Start 2P';
		enemyShuttleText.fontSize = 20;
		secondBossText.font = 'Press Start 2P';
		secondBossText.fontSize = 20;
		winText.font = 'Press Start 2P';
		winText.fontSize = 20;
		loseText.font = 'Press Start 2P';
		loseText.fontSize = 20;
		bonusText.font = 'Press Start 2P';
		bonusText.fontSize = 20;

	},

	update: function() {

		this.physics.arcade.overlap(bullets, secondEnemies, collisionCheck, null, this);
		this.physics.arcade.overlap(bullets, enemyShuttle, collisionEnemyShuttle, null, this);
		this.physics.arcade.overlap(bullets, secondBoss, collisionSecondBoss, null, this);
		this.physics.arcade.overlap(fireballs, player, collisionFireball, null, this);
		this.physics.arcade.overlap(player, secondEnemies, deathCheck, null, this);
		this.physics.arcade.overlap(player, healthUp, healCheck, null, this);
		this.physics.arcade.overlap(player, powerUp, powerCheck, null, this);
		this.physics.arcade.overlap(asteroids, player, asteroidsDeathCheck, null, this);

		healthUp.x -= 4;
		healthUp.y += 1;
		powerUp.x -= 4;
		powerUp.y -= 0.5;

		if (stage === 2) {
			stars.tilePosition.x -= backgroundVelocity;
		}

		secondEnemies.x -= 7;

		if (secondVelocityUp === true) {
			secondEnemies.y += 7;
		}
		if (secondVelocityDown === true) {
			secondEnemies.y -= 7;
		}

		if (secondEnemies.x < -700) {
			secondEnemies.x = 800;
			secondEnemies.y = 560;
		}
		if (secondEnemies.y === 0) {
			secondVelocityDown = false;
			secondVelocityUp = true;
		}
		if (secondEnemies.y > 600) {
			secondVelocityUp = false;
			secondVelocityDown = true;
		}

		if ((secondEnemies.countDead() === 12) && (enemyShuttle.x !== 600)) {
			enemyShuttle.x -= 4;
			enemyShuttleText.visible = true;
		}

		if (enemyShuttle.x === 600) {
			enemyShuttle.x = enemyShuttle.x;
		}

		if (enemyShuttle.x < 780  && enemyShuttle.alive) {
			shootLaser();
		}

		if ((!shuttle.exists)) {
			
			enemyShuttleText.visible = false;
			for (var i = 0; i < asteroids.length; i++) {
				asteroids.children[i].body.gravity.y = randomInteger(400, 800);
				asteroids.children[i].body.gravity.y = randomInteger(400, 800);
        		//asteroid.body.velocity.setTo(300, game.world.randomY);
        		asteroids.children[i].checkWorldBounds = true;
        		asteroids.children[i].outOfBoundsKill = true;
			}
		}

		if ((asteroids.countDead() === 5) && (secondBoss.x !== 600)) {
			secondBoss.x -= 4;
			secondBossText.visible = true;
		}

		if (secondBoss.x === 600) {
			secondBoss.x = secondBoss.x;
		}

		if (secondBoss.x < 780  && secondBoss.alive) {
			fireFireball();
		}

		if (bossTwo.exists === false) {
			winText.visible = true;
			stars.tilePosition.x -= 10;
			secondLevelState.win();
		}

		createControls();
		scoreText.text = 'Score: ' + score;
		playerHealthText.text = 'Player Health: ' + playerHealth;
		enemyShuttleText.text = 'Shuttle Health: ' + enemyShuttleHealth;
		secondBossText.text = 'Stinkfly Health: ' + secondBossHealth;

		if (playerHealth < 1) {
			playerTrail.kill();
			player.kill();
			loseText.visible = true;
			playerHealthText.visible = false;
			setTimeout(function(){
				restartGame(true)			
			}, 3000);
		}

	},

	win: function() {
		setTimeout(function(){
			game.state.start("thirdLevel");	
		}, 3000);
	}
}

var collisionEnemyShuttle = function(bullet, shuttle) {
	bullet.kill();
	enemyShuttleHealth -= 1;
	score += 50;
	if (enemyShuttleHealth < 1) {
		fireballs.exists = false;
		shuttle.kill();
		explode({x: 500, y: 200});
		for (var i = 0; i < fireballs.children.length; i++) {
			fireballs.children[i].kill();
		}
		bonus = (playerHealth * 20);
		score += bonus;
		if (playerHealth > 150) {
			score += 2000;
			bonusText.visible = true;
		}
		enemyShuttle.alive = false;
		createBullets();
		bossBullets();
		throwFirstAid();
	}
}

var collisionSecondBoss = function(bullet, boss) {
	bullet.kill();
	secondBossHealth -= 1;
	score += 100;
	if (secondBossHealth < 1) {
		fireballs.exists = false;
		bossTwo.kill();
		explode(secondBoss.x, secondBoss.y);
		for (var i = 0; i < fireballs.children.length; i++) {
			fireballs.children[i].kill();
		}
		bonus = (playerHealth * 20);
		score += bonus;
		if (playerHealth > 150) {
			score += 2000;
			bonusText.visible = true;
		}
		secondBoss.alive = false;
	}
}
