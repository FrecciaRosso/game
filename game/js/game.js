// Creating the game, creating the size of the game, and matching it to the div element ID
var game = new Phaser.Game(800, 560, Phaser.AUTO, 'game-container');

WebFontConfig = {

    //  The Google Fonts we want to load (specify as many as you like in the array)
    google: {
      families: ['Press Start 2P']
    }

};
//Adding states of the game
game.state.add('boot', bootState);
game.state.add('load', loadState);
game.state.add('menu', menuState);
game.state.add('firstLevel', firstLevelState);
game.state.add('secondLevel', secondLevelState);
game.state.add('thirdLevel', thirdLevelState);
//game.state.add('win', winState);
//game.state.add('leaderboard', leaderboardState);
game.state.start('boot');


