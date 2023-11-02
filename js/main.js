var Main = function(game){

};

var score = 0;

Main.prototype = {

	create: function() {

		this.tileVelocity = -250;
		this.rate = 1500;
		score = 0;

		this.tileWidth = this.game.cache.getImage('tile').width;
		this.tileHeight = this.game.cache.getImage('tile').height;
		this.boxHeight = this.game.cache.getImage('box').height;

		this.game.stage.backgroundColor = '45393c';


		this.game.physics.startSystem(Phaser.Physics.ARCADE);

		this.floor = this.game.add.group();
		this.floor.enableBody = true;
		this.floor.createMultiple(Math.ceil(this.game.world.width / this.tileWidth), 'tile');

		this.boxes = this.game.add.group();
		this.boxes.enableBody = true;
		this.boxes.createMultiple(20, 'box');
		this.game.world.bringToTop(this.floor);

		this.jumping = false;

		this.addBase();
		this.createScore();
		this.createPlayer();
		this.cursors = this.game.input.keyboard.createCursorKeys();

		this.timer = game.time.events.loop(this.rate, this.addObstacles, this);
		this.Scoretimer = game.time.events.loop(100, this.incrementScore, this);

	},

	update: function() {

		this.game.physics.arcade.collide(this.player, this.floor);
		this.game.physics.arcade.collide(this.player, this.boxes, this.gameOver, null, this);
		this.player.angle += 4;

		var onTheGround = this.player.body.touching.down;

		// If the player just landed on the ground, start shaking the screen
		if (!this.wasOnTheGround && onTheGround) {
			this.shakeWorld(1000);
			// Start the shaking effect
			document.body.classList.add('shake');

			// Stop the shaking effect after 1 second
			setTimeout(function() {
				document.body.classList.remove('shake');
			}, 300);
		}
	
	
		// Remember if the player was on the ground for the next frame
		this.wasOnTheGround = onTheGround;  

		// Jump a little bit when the up key, space key, or click is pressed
		if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP) || 
			this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || 
			this.game.input.activePointer.isDown) {
			this.player.body.velocity.y = -180 ; // adjust as needed
		}



	},

	shakeWorld: function(duration, intensity) {
		this.shakeWorldTime = duration || 500;
		this.shakeWorldMax = intensity || 20;
		this.shakeWorldTime = Math.max(100, this.shakeWorldTime);
		this.shakeWorldMax = Math.max(5, this.shakeWorldMax);
 	},


	addBox: function (x, y) {

		var tile = this.boxes.getFirstDead();

		tile.reset(x, y);
		tile.body.velocity.x = this.tileVelocity;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		// tile.body.friction.x = 1000;
	},

	addObstacles: function () {
		var tilesNeeded = Math.floor( Math.random() * (3  - 0));
		// var gap = Math.floor( Math.random() * (tilesNeeded - 0));
		if (this.rate > 100) {
			this.rate -= 10;
			this.tileVelocity = -(505000 / this.rate);

		}

		for (var i = 0; i < tilesNeeded; i++) {

			this.addBox(this.game.world.width , this.game.world.height -
				this.tileHeight - ((i + 1)* this.boxHeight ));

		}
	},

	addTile: function (x, y) {

		var tile = this.floor.getFirstDead();

		tile.reset(x, y);
		// tile.body.velocity.y = me.vel;
		tile.body.immovable = true;
		tile.checkWorldBounds = true;
		tile.outOfBoundsKill = true;
		// tile.body.friction.x = 1000;
	},

	addBase: function () {
		var tilesNeeded = Math.ceil(this.game.world.width / this.tileWidth);
		var y = (this.game.world.height - this.tileHeight);

		for (var i = 0; i < tilesNeeded; i++) {

			this.addTile(i * this.tileWidth, y);

		}
	},


	createPlayer: function () {

		this.player = this.game.add.sprite(this.game.world.width/5, this.game.world.height -
			(this.tileHeight*3), 'player');
		this.player.scale.setTo(0.5, 0.5);
		this.player.anchor.setTo(0.5, 0.5);
		this.game.physics.arcade.enable(this.player);
		this.player.body.gravity.y = 2200;
		this.player.body.collideWorldBounds = true;
		this.player.body.bounce.y = 0;
		this.player.body.drag.x = 150;
		var walk = this.player.animations.add('walk');
		this.player.animations.play('walk', 20, true);

 
		// Make the camera follow the player
		this.game.camera.follow(this.player);
	},

	createScore: function () {

		var scoreFont = "70px Arial";

		this.scoreLabel = this.game.add.text(this.game.world.centerX, 70, "0", { font: scoreFont, fill: "#fff" });
		this.scoreLabel.anchor.setTo(0.5, 0.5);
		this.scoreLabel.align = 'center';
		this.game.world.bringToTop(this.scoreLabel);

		this.highScore = this.game.add.text(this.game.world.centerX * 1.6, 70, "0", { font: scoreFont, fill: "#fff" });
		this.highScore.anchor.setTo(0.5, 0.5);
		this.highScore.align = 'right';
		this.game.world.bringToTop(this.highScore);

		if (window.localStorage.getItem('HighScore') == null) {
			this.highScore.setText(0);
			window.localStorage.setItem('HighScore', 0);
		}
		else {
			this.highScore.setText(window.localStorage.getItem('HighScore'));
		}
		// this.scoreLabel.bringToTop()

	},

	incrementScore: function () {
		// Only increment the score if the player is touching the ground
		if (this.player.body.touching.down) {
			score += 1;
			this.scoreLabel.setText(score);
			this.game.world.bringToTop(this.scoreLabel);
			this.highScore.setText("HS: " + window.localStorage.getItem('HighScore'));
			this.game.world.bringToTop(this.highScore);
		}
	},

	gameOver: function(){
		this.game.state.start('GameOver');
	}

};
