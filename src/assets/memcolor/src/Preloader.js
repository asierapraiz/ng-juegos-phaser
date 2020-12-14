EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {
		 //  Load the Google WebFont Loader script
    	game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
    	var preloadGroup=game.add.group();
		var preloadProgress = this.add.sprite((this.world.width)*0.5, (this.world.height+570)*0.5, 'loading-progress');
		preloadGroup.add(preloadProgress);
		preloadProgress.angle=-90;
		
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
		['background', 'juegos/memcolor/img/background.png'],
		['title', 'juegos/memcolor/img/title.png'],					
		['particle', 'juegos/memcolor/img/particle.png'],
		["bg", "juegos/memcolor/img/cielo.png"],		
		["guino", "juegos/memcolor/img/Guino.png"],		
		["cielo", "juegos/memcolor/img/cielo.png"],
		["brain", "juegos/memcolor/img/brain.png"],
       	["acierto", "juegos/memcolor/img/acierto.png"],
       	["triste", "juegos/memcolor/img/triste.png"],
       	["lo", "juegos/memcolor/img/lo.png"],
		['pinfloi', 'juegos/pompas/img/pinfloi.svg']

	],
	'spritesheet': [
		['button-start', 'juegos/memcolor/img/button-start.png', 180, 180],
		['button-continue', 'juegos/memcolor/img/button-continue.png', 180, 180],		
		['button-pause', 'juegos/memcolor/img/button-pause.png', 80, 80],
		['button-audio', 'juegos/memcolor/img/button-sound.png', 80, 80],		
		["circles", "juegos/memcolor/img/circles.png", 40, 40],
		["bombilla", "juegos/memcolor/img/bombilla.png", 250, 250],
		["timer", "juegos/memcolor/img/timer.png", 16, 16]
		
	],
	'audio': [
		['audio-click', ['juegos/memcolor/sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['juegos/memcolor/sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']],
		['audio-acierto', ['juegos/memcolor/sfx/acierto.wav']],
		['audio-error', ['juegos/memcolor/sfx/error.wav']],
		['audio-completo', ['juegos/memcolor/sfx/completo.wav']],
	]
};
