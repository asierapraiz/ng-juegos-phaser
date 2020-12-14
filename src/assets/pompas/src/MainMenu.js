EPT.MainMenu = function(game) {};
EPT.MainMenu.prototype = {
	create: function() {
		//this.add.sprite(0, 0, 'background');
		var title = this.add.sprite(this.world.width*0.5, (this.world.height-100)*0.5, 'title');
		title.anchor.set(0.5);

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
		buttonStart.anchor.set(1);

		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);		

		EPT._manageAudio('init',this);
		// Turn the music off at the start:
		EPT._manageAudio('off',this);

		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);	
		
		
		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		EPT._playAudio('click');
		EPT._manageAudio('switch',this);
	},
	clickPinfloi: function() {
		EPT._playAudio('click');
		//window.top.location.href = 'http://enclavegames.com/';
	},
	clickBeer: function() {
		EPT._playAudio('click');
		//window.top.location.href = 'https://www.paypal.me/end3r';
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