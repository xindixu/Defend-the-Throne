/*
 * Defend the Throne
 * Ian Mobbs, Jerry Lam, Xindi Xu
 * CS 329E Game Dev
 * Last completed - Sprint 1 hha
 */

// Global variables
var game = new Phaser.Game(1000, 600, Phaser.AUTO, '') // Phaser game instances


game.state.add('menu', menuState);
game.state.add('play', playState);
game.state.add('win', winState);

game.state.start('menu');


