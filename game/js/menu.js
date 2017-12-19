var menuState = {
	create: function () {
		game.backgroundMusic = this.game.add.audio('backgroundMusic');
        game.backgroundMusic.volume = 1;
        game.backgroundMusic.loop = true;
        game.backgroundMusic.play();

		var title = game.add.text(150, 80, "Per Aspera Ad Astra",
			{fill: '#CCFF00' });
		title.font = 'Press Start 2P';
		title.fontSize = 25;

		spaceship = this.add.sprite(250, 150, 'spaceship');

		var startText = game.add.text(225, game.world.height-80,
			'Push "SPACEBAR" to start',
			{fill: '#CCFF00' });
		startText.font = 'Press Start 2P';
		startText.fontSize = 15;

		var shootKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		shootKey.onDown.addOnce(this.start, this);
	},

	start: function() {
		game.state.start('firstLevel');
	}
};
