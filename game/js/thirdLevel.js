var thirdLevelState = {

	create: function() {
		finalBossHealth = 300;
		stars = this.add.tileSprite(0, 0, 800, 600, 'background3');
		player = this.add.sprite(75, 250, 'player');
		player.anchor.setTo(0.5, 0.5);
		setTimeout(function(){
			player.body.setSize(56, 10, 1, 1);
		}, 500);
		this.physics.enable(player, Phaser.Physics.ARCADE);
		addTrail();
		createBullets();
		fireButton = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

		plates = this.add.group();
		plates.enableBody = true;
		plates.physicsBodyType = Phaser.Physics.ARCADE;

		meteors = this.add.group();
		meteors.enableBody = true;
		meteors.physicsBodyType = Phaser.Physics.ARCADE;

		finalBoss = this.add.group();
		finalBoss.enableBody = true;
		finalBoss.physicsBodyType = Phaser.Physics.ARCADE;

		starGroup = this.add.group();
		starGroup.enableBody = true;
		starGroup.physicsBodyType = Phaser.Physics.ARCADE;

		healthUp = this.add.group();
		healthUp.enableBody = true;
		healthUp.physicsBodyType = Phaser.Physics.ARCADE;

		warning = game.add.audio('warning');

		throwFirstAid();

		firstExplosion = this.add.sprite(450, 100, 'explosion0');
		secondExplosion = this.add.sprite(500, 150, 'explosion1');
		thirdExplosion = this.add.sprite(550, 200, 'explosion2');
		fourthExplosion = this.add.sprite(450, 200, 'explosion0');
		fifthExplosion = this.add.sprite(550, 125, 'explosion1');
		sixthExplosion = this.add.sprite(450, 200, 'explosion2');

		firstExplosion.visible = false;
		secondExplosion.visible = false;
		thirdExplosion.visible = false;
		fourthExplosion.visible = false;
		fifthExplosion.visible = false;
		sixthExplosion.visible = false;

		createTinyPlates();
		createMeteors();
		createFinalBoss();
		createStar();

		bonusText = this.add.text(this.world.centerX - 100, this.world.centerY - 100, 'Bonus Points!', {fill : '#CCFF00'});
		finalText = this.add.text(this.world.centerX - 200, this.world.centerY - 50, 'Final Stage...GET READY', {fill : '#CCFF00'});
		scoreText = this.add.text(0, 50, 'Score:', {font: '32px Arial', fill : '#6600FF'});
		playerHealthText = this.add.text(0, 10, 'Player Health:', {font: '32px Arial', fill : '#00CCCC'});
		loseText = this.add.text(this.world.centerX - 110, this.world.centerY - 50, 'GAME OVER', {font: '32px Arial', fill : '#FF0066'});
		winText = this.add.text(this.world.centerX - 200, this.world.centerY - 50, 'CONGRATULATIONS!', {font: '32px Arial', fill : '#CCFF00'});
		finalBossText = this.add.text(470, 10, 'Station Health:', {font: '32px Arial', fill : '#FF0066'});
		
		setTimeout(function(){
			stage = 3;
			finalText.visible = false;
			bossBullets();
		}, 3000);

		loseText.visible = false;
		winText.visible = false;
		finalBossText.visible = false;
		bonusText.visible = false;

		playerHealthText.font = 'Press Start 2P';
		playerHealthText.fontSize = 20;
		finalText.font = 'Press Start 2P';
		finalText.fontSize = 20;
		scoreText.font = 'Press Start 2P';
		scoreText.fontSize = 20;
		finalBossText.font = 'Press Start 2P';
		finalBossText.fontSize = 20;
		winText.font = 'Press Start 2P';
		winText.fontSize = 20;
		loseText.font = 'Press Start 2P';
		loseText.fontSize = 20;
		bonusText.font = 'Press Start 2P';
		bonusText.fontSize = 20;

	},

	update: function() {

		this.physics.arcade.overlap(bullets, finalBoss, collisionFinalBoss, null, this);
		this.physics.arcade.overlap(bullets, plates, collisionCheck, null, this);
		this.physics.arcade.overlap(player, plates, deathCheck, null, this);
		this.physics.arcade.overlap(player, starGroup, collectStar, null, this);
		this.physics.arcade.overlap(meteors, player, meteorsDeathCheck, null, this);
		this.physics.arcade.overlap(fireballs, player, collisionFireball, null, this);
		this.physics.arcade.overlap(player, healthUp, healCheck, null, this);

		healthUp.x -= 6;
		createControls();
		if (stage === 3) {
			stars.tilePosition.x -= backgroundVelocity;
		}

		if (plates.x === -1000) {
			plates.x = 600;
		}

		if ((plates.countDead() === 20)) {
			meteors.forEach(function(meteor) {
				meteor.body.gravity.y = 400;
        		//asteroid.body.velocity.setTo(300, game.world.randomY);
        		meteor.checkWorldBounds = true;
        		meteor.outOfBoundsKill = true;
			});
		}

		if ((meteors.countDead() === 5) && finalBoss.x > 550) {
			finalBoss.x -= 1;
			finalBossText.visible = true;
		}

		if (finalBoss.x === 850) {
			warning.play();
		}

		if (finalBoss.x === 800) {
			warning.play();
		}

		if (finalBoss.x === 750) {
			warning.play();
		}

		if (finalBoss.x < 780) {
			fireFireball();
		}

		if (finalBossHealth < 1) {
			finalBossText.visible = false;
			starGroup.x -= 2;
		}

		if (playerHealth < 1) {
			playerTrail.kill();
			player.kill();
			loseText.visible = true;
			playerHealthText.visible = false;
			setTimeout(function(){
				restartGame(true)			
			}, 3000);
		}
		
		scoreText.text = 'Score: ' + score;
		playerHealthText.text = 'Player Health: ' + playerHealth;
		finalBossText.text = 'Station Health: ' + finalBossHealth;
	}
}

var meteorsDeathCheck = function(meteor, player) {
	playerHealth = 0;
	explode(player);
	meteor.kill();
}

var collisionFinalBoss = function(bullet, boss) {
	bullet.kill();
	finalBossHealth -= 1;
	score += 100;
	if (finalBossHealth < 1) {
		fireballs.exists = false;
		bossThree.kill();
		explode(finalBoss);
		initMoreExplosion();
		for (var i = 0; i < fireballs.children.length; i++) {
			fireballs.children[i].kill();
		}
		bossThree.alive = false;
		finalBoss.alive = false;
		boss.alive = false;
		bonus = (playerHealth * 20);
		score += bonus;
		if (playerHealth > 150) {
				score += 2000;
				bonusText.visible = true;
		}
	}
}

var collectStar = function(player, star) {
		star.kill();
		setTimeout(function(){
			restartGame(true)			
		}, 5000);
		bonus = (playerHealth * 20);
		score += bonus;
		winText.visible = true;
}