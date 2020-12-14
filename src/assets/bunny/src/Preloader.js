EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {

		//Bg
		//var bg=this.add.sprite(0,0,'storyBg');
		

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
		
		['portada', 'img/portada.jpg'],
		['storyBg', 'img/StoryBg.jpg'],
		['title', 'img/title.png'],
		['logo-enclave', 'img/logo-enclave.png'],
		['clickme', 'img/clickme.png'],
		['overlay', 'img/overlay.jpg'],
		['button-beer', 'img/button-beer.png'],
		['particle', 'img/particle.png'],		
		['tubo', 'img/tubo.jpg'],		
		['bg', 'img/bg.png'],
		['suerte', 'img/suerte.png'],
		["ground", "img/ground.png"],
		["sky", "img/cielo6.png"],
		["crate", "img/crate.png"],
		["avion", "img/avion.png"],
		["zepelin", "img/zepelin.png"],
		["bubble", "img/bubble.png"],
		["bubble2", "img/bubble2.png"],
		["ufo", "img/ufo.png"],
		["satelite", "img/satelite.png"],
		["zanahoria", "img/zanahoria.png"]        
		
	],
	'spritesheet': [
		['button-start', 'img/button-start.png', 180, 180],
		['button-continue', 'img/button-continue.png', 180, 180],
		['button-mainmenu', 'img/button-mainmenu.png', 180, 180],
		['button-restart', 'img/button-tryagain.png', 180, 180],
		['button-achievements', 'img/button-achievements.png', 110, 110],
		['button-pause', 'img/button-pause.png', 80, 80],
		['button-audio', 'img/button-sound.png', 80, 80],
		['button-back', 'img/button-back.png', 80, 80],
		['vadorrin','img/Volando.png', 175,113],
		["txita", "img/txita.png", 250,250],
		["buny", "img/buny6.png", 260,300]
	
	],
	'audio': [
		['audio-click', ['sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']],
		["jump","sfx/jump5.wav"],
		["fail", "sfx/fail.wav"],
		["laser", "sfx/rayo.wav"],
		["quejas", "sfx/quejas.ogg"],
		["derrape", "sfx/derrape.wav"]			
	]
};
