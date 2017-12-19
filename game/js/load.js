var loadState = {
	preload: function() {
		var loadingLabel = game.add.text(80, 150, 'launching the shuttle...',
		{font: '30px Courier', fill: '#ffffff'});

		game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		game.load.image('background1', 'images/background1.jpg');
		game.load.image('background2', 'images/background2.jpg');
		game.load.image('background3', 'images/background3.jpg');
		game.load.image('player', 'images/player_ship.png');
		game.load.image('bullet', 'images/bullet.png');
		game.load.image('enemy', 'images/strangeThing.png');
		game.load.image('trail', 'images/fireball.png');
		game.load.audio('laser', 'sounds/laser.wav');
		game.load.audio('backgroundMusic', 'sounds/mainTheme.ogg');
		game.load.image('firstBoss', 'images/ufo.png');
		game.load.image('bossFire', 'images/enemy_fireball.png');
		game.load.image('spaceship', 'images/spaceship.png');
		game.load.image('secondBoss', 'images/Stinkfly.png');		
		game.load.audio('explosion', 'sounds/explosion.wav');
		game.load.image('explosion0', 'images/explosion0.png');
		game.load.image('explosion1', 'images/explosion1.png');
		game.load.image('explosion2', 'images/explosion2.png');
		game.load.image('firstaid', 'images/firstaid.png');
		game.load.audio('healthSound', 'sounds/healthUp.wav');
		game.load.audio('powerUpSound', 'sounds/powerUp.wav');
		game.load.audio('warning', 'sounds/warning.wav');
		game.load.image('powerup', 'images/powerUp.png');
		game.load.image('bigUFO', 'images/bigUFO.png');
		game.load.spritesheet('spaceFly', 'images/flySprite.png', 90, 113, 3);
		game.load.spritesheet('plates', 'images/plates.png', 48, 192, 3);
		game.load.spritesheet('meteors', 'images/meteors.gif', 58, 85, 3);
		game.load.spritesheet('asteroid', 'images/asteroid.png', 94, 55, 5);
		game.load.spritesheet('enemyShuttle', 'images/enemyShuttle.gif', 86, 172, 7);
		game.load.spritesheet('star', 'images/star.png', 210, 210, 2);
	},

	create: function() {
		game.state.start('menu');
	}
};

var text = null;
var finalText;
var bonusText;
var spaceship;
var laserFire = 0;
var stars;
var backgroundVelocity = 2;
var player;
var playerHealth = 100;
var playerHealthText;
var playerTrail;
var stage = 1;
var cursors;
var gunType = 0;
var bonus;
var warning;
var explosionSound;
var firstExplosion;
var secondExplosion;
var thirdExplosion;
var fourthExplosion;
var fifthExplosion;
var sixthExplosion;
var healthUp;
var healthNoise;
var powerUp;
var powerNoise;
var bullets;
var bulletTime = 0;
var fireballs;
var fireballTime = 0;
var fireButton;
var asteroids;
var enemySpeed = 1000;
var enemies;
var plates;
var meteors;
var secondEnemies;
var secondVelocityUp = true;
var secondVelocityDown = false;
var bossOne;
var bossTwo;
var bossThree;
var firstBoss;
var secondBoss;
var finalBoss;
var star;
var starGroup;
var shuttle;
var enemyShuttle;
var score = 0;
var scoreText;
var winText;
var stageTwoText;
var flag = 0;
var tempNameArray = [];
var tempScoreArray = [];
var firstBossHealth = 100;
var firstBossText;
var enemyShuttleHealth = 125;
var enemyShuttleText;
var secondBossHealth = 150;
var secondBossText;
var secondBossSpeed = 4;
var finalBossHealth = 250;
var finalBossText;
var playAgain;

function healCheck(player, firstaid) {
	playerHealth += 50;
	firstaid.kill();
	healthNoise.play();
	score += 100;
}

function powerCheck(player, powerup) {
	gunType += 1;
	powerup.kill();
	powerNoise.play();
	score += 100;
}

function deathCheck(player, enemy) {
	playerHealth -= 10;
	enemy.kill();
	if (playerHealth < 1) {explode(player);}
}

function addTrail() {
	playerTrail = game.add.emitter(player.x + 20, player.y, 200);
	playerTrail.width = 10;
	playerTrail.makeParticles('trail');
	playerTrail.setXSpeed(-200, -180);
	playerTrail.setYSpeed(-30, 30);
	playerTrail.setRotation(50, -50);
	playerTrail.setAlpha(1, 0.01, 800);
	playerTrail.setScale(0.05, 0.4, 0.05, 0.4, 2000, Phaser.Easing.Quintic.Out);
	playerTrail.start(false, 5000, 10);
}

function createBullets() {
	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;
	bullets.createMultiple(30, 'bullet');
	bullets.setAll('anchor.x', 2.5);
	bullets.setAll('anchor.y', 2.5);
	bullets.setAll('outOfBoundsKill', true);
	bullets.setAll('checkWorldBounds', true);
}

function bossBullets() {
	fireballs = game.add.group();
	fireballs.enableBody = true;
	fireballs.physicsBodyType = Phaser.Physics.ARCADE;
	if (stage === 1) {
		fireballs.createMultiple(4, 'bossFire');
	}

	if (stage === 2) {
		fireballs.createMultiple(6, 'bossFire');
	}

	if (stage === 3) {
		fireballs.createMultiple(10, 'bossFire');
	}
	fireballs.setAll('anchor.x', 1);
	fireballs.setAll('anchor.y', 1);
	fireballs.setAll('outOfBoundsKill', true);
	fireballs.setAll('checkWorldBounds', true);
}

function createControls() {

	player.body.velocity.x = 0;
	player.body.velocity.y = 0;

	playerTrail.y = player.y;
	playerTrail.x = player.x;
		
	if (player.x > game.width - 50) {
		player.x = game.width - 50;
		player.body.velocity.x = 0;
	}	
	if (player.x < 50) {
		player.x = 50;
		player.body.acceleration.x = 0;
	}
	if (player.y > game.width - 50) {
		player.y = game.width - 50;
		player.body.velocity.y = 0;
	} 
	if (player.y < 50) {
		player.y = 50;
		player.body.acceleration.y = 0;
	} 
	if (player.y > 500) {
		player.y = 500;
		player.body.acceleration.y = 0;
	}

	if(cursors.left.isDown) {
		player.body.velocity.x = -400;
	}

	if(cursors.right.isDown) {
		player.body.velocity.x = 400;
	}

	if(cursors.up.isDown) {
		player.body.velocity.y = -400;
	}

	if(cursors.down.isDown) {
		player.body.velocity.y = 400;
	}

	if (playerHealth > 0) {
		if(fireButton.isDown) {	
		for (var z = 0; z < 5; z++) {
			if (bullets.children[z].exists === false) {
				fireBullet();
				laser.play();
			}
		}
	}
	}
}

function fireBullet() {
	if(game.time.now > bulletTime) {
		var bullet = bullets.getFirstExists(false);
	}
	if(bullet){
		bullet.reset(player.x + 200, player.y + 30);
		bullet.body.velocity.x = 1200;
		bulletTime = game.time.now - 1;
		if (gunType === 1) {
			var bullet2 = bullets.getFirstExists(false);
			if(bullet2){
				bullet2.reset(player.x + 200, player.y + 30);
				bullet2.body.velocity.x = 1200;
				bullet2.body.velocity.y = 200;
				var bullet3 = bullets.getFirstExists(false);
				if(bullet3){
					bullet3.reset(player.x + 50, player.y + 30);
					bullet3.body.velocity.x = 1200;
					bullet3.body.velocity.y = -200;
				}
			}
		}
	}
}

function shootLaser() {
	if(game.time.now > fireballTime) {
		var fireball = fireballs.getFirstExists(false);
	}
	if (fireball) {
		fireball.reset(enemyShuttle.x + 10, enemyShuttle.y + 30);
		fireball.body.setSize(80, 49, 50, 25);
		fireball.body.velocity.x = -500;
		fireball.body.velocity.y = randomNumber(400);
		fireballTime = game.time.now - 10;
	}
}

function fireFireball() {
	if(game.time.now > fireballTime) {
		var fireball = fireballs.getFirstExists(false);
	}

	if(fireball && (stage === 1)) {
		fireball.reset(firstBoss.x + 10, firstBoss.y + 30);
		fireball.body.setSize(80, 49, 50, 25);
		fireball.body.velocity.x = -400;
		fireball.body.velocity.y = randomNumber(400);
		fireballTime = game.time.now - 10;
	}

	if (fireball && (stage === 2)) {
		fireball.reset(secondBoss.x + 10, secondBoss.y + 30);
		fireball.body.setSize(80, 49, 50, 25);
		fireball.body.velocity.x = -500;
		fireball.body.velocity.y = randomNumber(400);
		fireballTime = game.time.now - 10;
	}

	if (fireball && (stage === 3)) {
		fireball.reset(finalBoss.x + 10, finalBoss.y + 30);
		fireball.body.setSize(80, 49, 50, 25);
		fireball.body.velocity.x = -600;
		fireball.body.velocity.y = randomNumber(500);
		fireballTime = game.time.now - 10;
	}
}

function randomNumber(num) {
	var random = Math.floor(Math.random() * num);
	var flip = Math.floor(Math.random() * 10);
	if (flip > 5) {
		random = -random;
	}
		return random;
};

function randomInteger(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    rand = Math.floor(rand);
    return rand;
};

function createFirstEnemies() {
	for(var i = 0; i < 5; i++) {
		for(var x = 0; x < 20; x++) {
			var enemy = enemies.create(x*50,i*60,'enemy');
			enemy.anchor.setTo(0.5, 0.7);
		}
	}

	enemies.x = 600;
	enemies.y = 50;

	var tween = game.add.tween(enemies).to({y:500}, enemySpeed, Phaser.Easing.Linear.None, true, 0, 1000, true);
	tween.onLoop.add(approachPlayer, this);

	function approachPlayer(){
		enemies.x -= 30;
	}
}

function createAsteroids(i) {
	for(var x = 0; x < i; x++) {
		var asteroid = asteroids.create(game.world.randomX, 0,'asteroid');
		asteroid.animations.add("fly", [0, 1, 2, 3, 4]);
		asteroid.play("fly", 10, true);
	}
	asteroids.y = -50;
}

function createMeteors() {
	for(var x = 0; x < 5; x++) {
		var meteor = meteors.create(game.world.randomX, 0,'meteors');
		meteor.animations.add("fly", [0, 1, 2, 3, 4, 5, 6, 7, 8]);
		meteor.play("fly", 10, true);
	}
	meteors.y = -85;
}

function throwFirstAid() {
	var healthItem = healthUp.create(0, 1, 'firstaid');
	healthUp.x = 1100;
	healthUp.y = 100;
}

function throwPowerUp() {
	var powerItem = powerUp.create(0, 1, 'powerup');
	powerUp.x = 1300;
	powerUp.y = 500;
}

function createSecondEnemies() {
	for(var i = 0; i < 4; i++) {
		for(var x = 0; x < 10; x+=4) {
			var secondEnemy = secondEnemies.create(x*70,i*60,'spaceFly');
			secondEnemy.animations.add("fly", [0, 1, 2]);
			secondEnemy.play("fly", 8, true);
			secondEnemy.anchor.setTo(0.5, 0.7);
		}
		x = i + 1;
	}

	secondEnemies.x = 900;
	secondEnemies.y = 0;
}

function createTinyPlates() {
	for (var i = 0; i < 2; i++) {
		for(var x = 0; x < 10; x++) {
			var plateColumn = plates.create(x*60, i*190, 'plates');
			plateColumn.animations.add("fly", [0, 1, 2]);
			plateColumn.play("fly", 8, true);
			plateColumn.anchor.setTo(0.5, 0.7);
		}
	}

	plates.x = 600;
	plates.y = 50;

	var tween = game.add.tween(plates).to({y:500}, enemySpeed, Phaser.Easing.Linear.None, true, 0, 1000, true);
	tween.onLoop.add(approachPlayer, this);

	function approachPlayer(){
		plates.x -= 30;
	}
}

function createEnemyShuttle() {
	shuttle = enemyShuttle.create(50,50, 'enemyShuttle');
	shuttle.animations.add("fly", [0, 1, 2, 3, 4, 5, 6]);
	shuttle.play("fly", 3, true);
	shuttle.anchor.setTo(0.5, 0.7);
	enemyShuttle.x = 900;
	enemyShuttle.y = 200;
}

function createFirstBoss() {
	bossOne = firstBoss.create(50,50, 'firstBoss');
	bossOne.anchor.setTo(0.5, 0.7);
	firstBoss.x = 900;
	firstBoss.y = 200;
}

function createSecondBoss() {
	bossTwo = secondBoss.create(50,50, 'secondBoss');
	bossTwo.anchor.setTo(0.5, 0.7);
	secondBoss.x = 900;
	secondBoss.y = 200;
}

function createFinalBoss() {
	bossThree = finalBoss.create(50,50, 'bigUFO');
	bossThree.anchor.setTo(0.5, 0.7);
	finalBoss.x = 1100;
	finalBoss.y = 250;
}

function createStar() {
	star = starGroup.create(50,50, 'star');
	star.animations.add("fly", [0, 1]);
	star.play("fly", 2, true);
	star.anchor.setTo(0.5, 0.7);
	starGroup.x = 900;
	starGroup.y = 250;
}

function explode(obj) {
	firstExplosion = game.add.sprite(obj.x, obj.y, 'explosion0');
	secondExplosion = game.add.sprite(obj.x, obj.y, 'explosion1');
	thirdExplosion = game.add.sprite(obj.x, obj.y, 'explosion2');
	firstExplosion.visible = true;
	explosionSound.play();
	setTimeout(function(){
		secondExplosion.visible = true;
		firstExplosion.visible = false;
		explosionSound.play();		
	}, 100);
	setTimeout(function(){
		thirdExplosion.visible = true;
		secondExplosion.visible = false;
		explosionSound.play();	
	}, 200);
	setTimeout(function(){
		thirdExplosion.visible = false;	
		explosionSound.play();
		firstExplosion.visible = true;
	}, 300);
	setTimeout(function(){
		secondExplosion.visible = true;
		firstExplosion.visible = false;
		explosionSound.play();		
	}, 400);
	setTimeout(function(){
		thirdExplosion.visible = true;
		secondExplosion.visible = false;
		explosionSound.play();	
	}, 500);
	setTimeout(function(){
		thirdExplosion.visible = false;	
		explosionSound.play();
	}, 600);
	for (var i = 0; i < fireballs.children.length; i++) {
			fireballs.children[i].kill();
	}
};

function initMoreExplosion() {
	fourthExplosion.visible = true;
	explosionSound.play();
	setTimeout(function(){
		fifthExplosion.visible = true;
		fourthExplosion.visible = false;
		explosionSound.play();		
	}, 100);
	setTimeout(function(){
		sixthExplosion.visible = true;
		fifthExplosion.visible = false;
		explosionSound.play();	
	}, 200);
	setTimeout(function(){
		sixthExplosion.visible = false;	
		explosionSound.play();
		fourthExplosion.visible = true;
	}, 300);
	setTimeout(function(){
		fifthExplosion.visible = true;
		fourthExplosion.visible = false;
		explosionSound.play();		
	}, 400);
	setTimeout(function(){
		sixthExplosion.visible = true;
		fifthExplosion.visible = false;
		explosionSound.play();	
	}, 500);
	setTimeout(function(){
		sixthExplosion.visible = false;	
		explosionSound.play();
	}, 600);
};

function restartGame(canRestart) {
	playAgain = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
	if(playAgain.isDown) {
		if(canRestart) {
			game.backgroundMusic.stop();
			game.state.start("menu");
		}
	}	
}
