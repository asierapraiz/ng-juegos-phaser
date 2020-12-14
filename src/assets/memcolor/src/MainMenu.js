EPT.MainMenu = function(game) {};
EPT.MainMenu.prototype = {
	
	create: function() {
		
		
		this.bg=this.add.sprite(0, 0, 'cielo');
		this.bg.width=game.world.width;
		this.bg.height=game.world.height;

		var cerebro = this.add.sprite(this.world.width*0.5, this.world.height-350, 'brain');
		cerebro.anchor.set(0.5);
		cerebro.scale.setTo(0.6);
		
		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);

		EPT.Storage.initUnset('EPT-highscore', 0);
		var highscore = EPT.Storage.get('EPT-highscore') || 0;

		//var buttonEnclave = this.add.button(20, 20, 'logo-enclave', this.clickEnclave, this);
		//var buttonBeer = this.add.button(25, 130, 'button-beer', this.clickBeer, this);
		var fontTitle = { font: "100px Amatic SC", fill: "#000", stroke: "#FFF", strokeThickness: 4 };

		this.title = this.add.text(this.world.width*0.5, 75, 'Circles', fontTitle);
        this.title.anchor.set(0.5,0);
        this.title.scale.setTo(2);

        var buttonPinfloi = this.add.button(20, 20, 'pinfloi', this.clickPinfloi, this);
		buttonPinfloi.scale.setTo(0.5,0.5);

		var buttonStart = this.add.button(this.world.width-20, this.world.height-20, 'button-start', this.clickStart, this, 1, 0, 2);
		buttonStart.anchor.set(1);
		buttonStart.scale.setTo(0.7,0.7);
		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);
		this.buttonAudio.scale.setTo(1,1);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);	


		EPT._manageAudio('init',this);
		// Turn the music off at the start:
		EPT._manageAudio('on',this);	
		
		
		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		EPT._playAudio('click');
		EPT._manageAudio('switch',this);
	},
	clickEnclave: function() {
		EPT._playAudio('click');
		window.top.location.href = 'http://enclavegames.com/';
	},
	clickBeer: function() {
		EPT._playAudio('click');
		window.top.location.href = 'https://www.paypal.me/end3r';
	},
	clickStart: function() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			//this.game.state.start('Story');Game
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		EPT._playAudio('click');
		this.game.state.start('Achievements');
	}
};