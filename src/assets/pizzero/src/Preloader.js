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
		['portada', 'img/portada.png'],
		['pizzero', 'img/pizzero_en_moto.svg'],
		['background', 'img/background.png'],
		['title', 'img/title.png'],					
		['particle', 'img/particle.png'],
		["bg", "img/cielo.png"],	
		["crate", "img/crate.png"],	
		["base", "img/base.png"],		
		["square", "img/square2.png"],
		["top", "img/top.png"],
       	["sky", "img/cielo.png"],
       	["boom", "img/humo.png"],
       	["humo", "img/humoP.png"],
		['pinfloi', 'img/pinfloi.svg'],
		['pizza', 'img/pizza.svg'],
		["tuerca", "img/tuerca.png"],
		["tornillo", "img/tornillo.png"],
		["ruedaDent", "img/ruedaDent.png"],
		["ruedaDent2", "img/ruedaDent2.png"],
		["rueda", "img/rueda.png"],
		["gorra", "img/gorra.png"],
		["zapato", "img/zapato.png"],
		["retrovisor", "img/retrovisor.png"],
		["faroTras", "img/faroTras.png"],
		["faroDel", "img/faroDel.png"]

	],
	'spritesheet': [
		['button-start', 'img/button-start.png', 180, 180],
		['button-continue', 'img/button-continue.png', 180, 180],		
		['button-pause', 'img/button-pause.png', 80, 80],
		['button-audio', 'img/button-sound.png', 80, 80],		
		["motoCae", "img/moteroCae.png",200,300],
		["motero", "img/motero.png",200,200],
		["motoCrash", "img/Crash.png",200,200]
		
	],
	'audio': [
		//['audio-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']],
		['audio-acierto', ['sfx/acierto.wav']],
		
	],
	'font':[
		["font", "fonts/font.png", "fonts/font.fnt"]

	]
};
