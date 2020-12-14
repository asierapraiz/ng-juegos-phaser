EPT.Preloader = function(game) {};
EPT.Preloader.prototype = {
	preload: function() {

		//Bg
		//var bg=this.add.sprite(0,0,'storyBg');
		

		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-560)*0.5, (this.world.height+170)*0.5, 'loading-progress');

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
		
		['portada', 'juegos/cubo/img/portada.png'],
		['storyBg', 'juegos/cubo/img/StoryBg.jpg'],			
		['overlay', 'juegos/cubo/img/overlay.jpg'],		
		['particle', 'juegos/cubo/img/particle.png'],		
		['tubo', 'juegos/cubo/img/tubo.jpg'],		
		['bg', 'juegos/cubo/img/bg.png'],		
		["ground", "juegos/cubo/img/ground.png"],
		["sky", "juegos/cubo/img/cielo.png"],
		["crate", "juegos/cubo/img/crate.png"],		
		["pinfloi", "juegos/cubo/img/pinfloi.svg"],
		//["titulo", "juegos/cubo/img/Cubo.svg"],
		['hero', 'juegos/cubo/img/hero.png'],		     
        ["mad", "juegos/cubo/img/mad_2.png"], 
        ["ground", "juegos/cubo/img/ground.png"], 
        ["splash", "juegos/cubo/img/splash.png"],
        ["trigger", "juegos/cubo/img/trigger.png"],
                   
		
	],
	'spritesheet': [
		['button-start', 'juegos/cubo/img/button-start.png', 180, 180],
		['button-continue', 'juegos/cubo/img/button-continue.png', 180, 180],
		['button-mainmenu', 'juegos/cubo/img/button-mainmenu.png', 180, 180],
		//['button-restart', 'juegos/bunny/img/button-tryagain.png', 180, 180],
		['button-achievements', 'juegos/cubo/img/button-achievements.png', 110, 110],
		['button-pause', 'juegos/cubo/img/button-pause.png', 80, 80],
		['button-audio', 'juegos/cubo/img/button-sound.png', 80, 80],
		['button-back', 'juegos/cubo/img/button-back.png', 80, 80],		
		["txita", "juegos/cubo/img/txita.png", 250,250],		
		["vida", "juegos/cubo/img/vida.png", 80,80],
		["caras", "juegos/cubo/img/caras.png",80,80],
		["caras_die", "juegos/cubo/img/caras_die.png",200,200],  
		["caras_splash", "juegos/cubo/img/caras_splash.png",180,180],   
	
	],
	'audio': [
		['audio-click', ['juegos/cubo/sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', ['juegos/cubo/sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']],
		["jump","juegos/cubo/sfx/jump5.wav"],
		["fail", "juegos/cubo/sfx/fail.wav"],
		["laser", "juegos/cubo/sfx/rayo.wav"],
		["quejas", "juegos/cubo/sfx/quejas.ogg"],
		["derrape", "juegos/cubo/sfx/derrape.wav"]			
	]
};
