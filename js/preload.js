var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		this.game.load.image('tile', 'assets/tile.png');
		this.game.load.image('box', 'assets/box.png');
		
		this.game.load.image('player', 'assets/rolling-case.png');
		
	},

	create: function(){

		this.game.state.start("Main");

	}
}