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
		['portada', 'juegos/pompas/img/portada.jpg'],
		['storyBg', 'juegos/pompas/img/storyBg.jpg'],
		['background', 'juegos/pompas/img/background.png'],
		['bg','juegos/pompas/img/cielo.png'],		
		['title', 'juegos/pompas/img/title.png'],				
		['overlay', 'juegos/pompas/img/overlay.jpg'],		
		['particle', 'juegos/pompas/img/particle.png'],
		['bubble', 'juegos/pompas/img/bubble.png'],		
		['marAlto', 'juegos/pompas/img/marAlto.png'],
		['marMedio', 'juegos/pompas/img/marMedio.png'],
		['marBajo', 'juegos/pompas/img/marBajo.png'],
		['vida', 'juegos/pompas/img/vida.png'],
		['pinfloi', 'juegos/pompas/img/pinfloi.svg']	

	],
	'spritesheet': [
		['button-start', 'juegos/pompas/img/button-start.png', 180, 180],
		['button-continue', 'juegos/pompas/img/button-continue.png', 180, 180],
		['button-mainmenu', 'juegos/pompas/img/button-mainmenu.png', 180, 180],		
		['button-achievements', 'juegos/pompas/img/button-achievements.png', 110, 110],
		['button-pause', 'juegos/pompas/img/button-pause.png', 80, 80],
		['button-audio', 'juegos/pompas/img/button-sound.png', 80, 80],
		['button-back', 'juegos/pompas/img/button-back.png', 70, 70],
		['player','juegos/pompas/img/player3.png', 100, 100],
		['diez','juegos/pompas/img/10.png', 100, 100]
		
		
	],
	'audio': [
		['audio-click', ['juegos/pompas/sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['juegos/pompas/sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']],
		['weep','juegos/pompas/sfx/weep.wav'],
		['acertar','juegos/pompas/sfx/acertar.wav'],
		['fail','juegos/pompas/sfx/fail.wav'],
		['burbujas', 'juegos/pompas/sfx/Bubbles.mp3'],
		['super-acierto', 'juegos/pompas/sfx/super-acierto.wav'],
		['ok', 'juegos/pompas/sfx/acertar.wav']
	]
};
