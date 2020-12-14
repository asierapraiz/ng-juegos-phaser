EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {
		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		 //  Load the Google WebFont Loader script
    	this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		this.load.setPreloadSprite(preloadProgress);

				
		this._preloadResources();
	},
	_preloadResources() {
		var pack = EPT.Preloader.resources;
		for(var method in pack) {
			pack[method].forEach(function(args) {
				var loader = this.load[method];
				loader && loader.apply(this.load, args);
			}, this);
		}
	},
	create: function() {
		this.state.start('MainMenu');
	}
};
EPT.Preloader.resources = {	
	'image': [
		
		['bosque', 'juegos/volando/img/bosque.png'],
		['storyBg', 'juegos/volando/img/storyBg.jpg'],		
		['overlay', 'juegos/volando/img/overlay.jpg'],		
		['particle', 'juegos/volando/img/particle.png'],		
		['tubo', 'juegos/volando/img/tubo.jpg'],		
		['bg', 'juegos/volando/img/bg.png'],
		['portada', 'juegos/volando/img/Portada.png'],
		['suerte', 'juegos/volando/img/suerte.png'],
		['bosque', 'juegos/volando/img/bosque.png'],
		['boom', 'juegos/volando/img/boom.png'],
		['pinfloi', 'juegos/pompas/img/pinfloi.svg']

		
	],
	'spritesheet': [
		['button-start', 'juegos/volando/img/button-start.png', 180, 180],
		['button-continue', 'juegos/volando/img/button-continue.png', 180, 180],
		['button-mainmenu', 'juegos/volando/img/button-mainmenu.png', 180, 180],		
		['button-achievements', 'juegos/volando/img/button-achievements.png', 110, 110],
		['button-pause', 'juegos/volando/img/button-pause.png', 80, 80],
		['button-audio', 'juegos/volando/img/button-sound.png', 80, 80],
		['button-back', 'juegos/volando/img/button-back.png', 70, 70],
		['vadorrin','juegos/volando/img/Volando.png', 175,113],
		['vidas','juegos/volando/img/vidas.png', 100,69]
		

	],
	'audio': [
		['audio-click', ['juegos/volando/sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['juegos/volando/sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']]
	]
};
