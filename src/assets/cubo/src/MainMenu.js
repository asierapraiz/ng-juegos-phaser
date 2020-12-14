EPT.MainMenu = function(game) {};
EPT.MainMenu.prototype = {
	preload: function(){
		//game.load.bitmapFont("font", "juegos/bunny/fonts/font.png", "juegos/bunny/fonts/font.fnt");

		var font = { font: "100px Dosis", fill: "#fff" };


	},
	create: function() {
		

		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);

		EPT.Storage.initUnset('EPT-highscore', 0);
		var highscore = EPT.Storage.get('EPT-highscore') || 0;

		//Bg
		var bg=this.add.sprite(0,0,'portada');
		bg.width = game.width;
        bg.height = game.height;
        
        var buttonPinfloi = this.add.button(20, 20, 'pinfloi', this.clickPinfloi, this);
		buttonPinfloi.scale.setTo(0.5,0.5);

		
		var buttonStart = this.add.button(this.world.width-20, this.world.height-20, 'button-start', this.clickStart, this, 1, 0, 2);
		buttonStart.scale.setTo(0.8,0.8);
		buttonStart.anchor.set(1);

		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);

		var buttonAchievements = this.add.button(20, this.world.height-20, 'button-achievements', this.clickAchievements, this, 1, 0, 2);
		buttonAchievements.anchor.set(0,1);

		/*var fontHighscore = { font: "40px Dosis", fill: "#fff" };
		var textHighscore = this.add.text(this.world.width*0.5, 50, 'Highscore: '+highscore, fontHighscore);
		textHighscore.anchor.set(0.5,1);*/

		EPT._manageAudio('init',this);
		// Turn the music off at the start:
		EPT._manageAudio('off',this);

		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);		
		buttonAchievements.y = this.world.height+buttonAchievements.height+20;
		this.add.tween(buttonAchievements).to({y: this.world.height-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		EPT._playAudio('click');
		EPT._manageAudio('switch',this);
	},	
	clickStart: function() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		EPT._playAudio('click');
		this.game.state.start('Achievements');
	}
};