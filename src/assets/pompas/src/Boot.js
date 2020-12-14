var vidas=1;
var nombre="pompas";
var ranking=[
	{'usuario':'bunny', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= "../../assets/pompas/";

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Boot			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var Pompas = {
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				Pompas.Storage.initUnset('Pompas-audio', true);
				Pompas._audioStatus = Pompas.Storage.get('Pompas-audio');
				// Pompas._soundClick = game.add.audio('audio-click');
				Pompas._sound = [];
				Pompas._sound['click'] = game.add.audio('audio-click');
				if(!Pompas._soundMusic) {
					Pompas._soundMusic = game.add.audio('audio-theme',1,true);
					Pompas._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				Pompas._audioStatus = true;
				break;
			}
			case 'off': {
				Pompas._audioStatus = false;
				break;
			}
			case 'switch': {
				Pompas._audioStatus =! Pompas._audioStatus;
				break;
			}
			default: {}
		}
		if(Pompas._audioStatus) {
			Pompas._audioOffset = 0;
			if(Pompas._soundMusic) {
				if(!Pompas._soundMusic.isPlaying) {
					Pompas._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			Pompas._audioOffset = 4;
			if(Pompas._soundMusic) {
				Pompas._soundMusic.stop();
			}
		}
		Pompas.Storage.set('Pompas-audio',Pompas._audioStatus);
		game.buttonAudio.setFrames(Pompas._audioOffset+1, Pompas._audioOffset+0, Pompas._audioOffset+2);
	},
	_playAudio: function(sound) {
		if(Pompas._audioStatus) {
			if(Pompas._sound && Pompas._sound[sound]) {
				Pompas._sound[sound].play();
			}
		}
	}
};

//Creo un avariable para las vidas
Pompas._vidas=parseInt(vidas);
Pompas._totalScore=0;
Pompas.ranking=ranking;

Pompas.Boot = function(game){};
Pompas.Boot.prototype = {
	preload: function(){
		this.stage.backgroundColor = '#7accf0';
		this.load.image('loading-background', url + 'img/loading-background.png');
		this.load.image('loading-progress', url + 'img/loading-progress.png');
	},
	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		this.state.start('Preloader');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Preloader		//////////////////////////
///////////////////////////////////////////////////////////////////////////////

Pompas.Preloader = function(game) {};
Pompas.Preloader.prototype = {
	preload: function() {
		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		//  Load the Google WebFont Loader script
    	this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		this.load.setPreloadSprite(preloadProgress);
		
		this._preloadResources();
	},
	_preloadResources() {
		var pack = Pompas.Preloader.resources;
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
Pompas.Preloader.resources = {
	'image': [
		['portada', url + 'img/portada.jpg'],
		['storyBg', url + 'img/storyBg.jpg'],
		['background', url + 'img/background.png'],
		['bg',url + 'img/cielo.png'],		
		['title', url + 'img/title.png'],				
		['overlay', url + 'img/overlay.jpg'],		
		['particle', url + 'img/particle.png'],
		['bubble', url + 'img/bubble.png'],		
		['marAlto', url + 'img/MarAlto.png'],
		['marMedio', url + 'img/MarMedio.png'],
		['marBajo', url + 'img/MarBajo.png'],
		['vida', url + 'img/vida.png'],
		['pinfloi', url + 'img/Pinfloi.svg']	

	],
	'spritesheet': [
		['button-start', url + 'img/button-start.png', 180, 180],
		['button-continue', url + 'img/button-continue.png', 180, 180],
		['button-mainmenu', url + 'img/button-mainmenu.png', 180, 180],		
		['button-achievements', url + 'img/button-achievements.png', 110, 110],
		['button-pause', url + 'img/button-pause.png', 80, 80],
		['button-audio', url + 'img/button-sound.png', 80, 80],
		['button-back', url + 'img/button-back.png', 70, 70],
		['player',url + 'img/player3.png', 100, 100],
		['diez',url + 'img/10.png', 100, 100]
		
		
	],
	'audio': [
		['audio-click', [url + url + 'sfx/audio-button.m4a',url + 'sfx/audio-button.mp3',url + 'sfx/audio-button.ogg']],
		['audio-theme', [url + url + 'sfx/music-bitsnbites-liver.m4a',url + 'sfx/music-bitsnbites-liver.mp3',url + 'sfx/music-bitsnbites-liver.ogg']],
		['weep',url + 'sfx/weep.wav'],
		['acertar', url + 'sfx/acertar.wav'],
		['fail',url +  'sfx/fail.wav'],
		['burbujas', url +  'sfx/Bubbles.mp3'],
		['super-acierto',  url + 'sfx/super-acierto.wav'],
		['ok', url +  'sfx/acertar.wav']
	]
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Main Menú	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Pompas.MainMenu = function(game) {};
Pompas.MainMenu.prototype = {
	create: function() {
		//this.add.sprite(0, 0, 'background');
		var title = this.add.sprite(this.world.width*0.5, (this.world.height-100)*0.5, 'title');
		title.anchor.set(0.5);

		Pompas.Storage = this.game.plugins.add(Phaser.Plugin.Storage);

		Pompas.Storage.initUnset('Pompas-highscore', 0);
		var highscore = Pompas.Storage.get('Pompas-highscore') || 0;

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

		Pompas._manageAudio('init',this);
		// Turn the music off at the start:
		Pompas._manageAudio('off',this);

		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);	
		
		
		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		Pompas._playAudio('click');
		Pompas._manageAudio('switch',this);
	},
	clickPinfloi: function() {
		Pompas._playAudio('click');
		//window.top.location.href = 'http://enclavegames.com/';
	},
	clickBeer: function() {
		Pompas._playAudio('click');
		//window.top.location.href = 'https://www.paypal.me/end3r';
	},
	clickStart: function() {
		Pompas._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		Pompas._playAudio('click');
		this.game.state.start('Achievements');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Achievements	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Pompas.Achievements = function(game) {};
Pompas.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: "32px Arial", fill: "#000" };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(this.world.width-20, game.world.height-20, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.x = this.world.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		Pompas._playAudio('click');
		this.game.state.start('MainMenu');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Story		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Pompas.Story = function(game) {};
Pompas.Story.prototype = {
	create: function(){

		//Bg
		var bg=this.add.sprite(0,0,'storyBg');
		bg.width = game.width;
        bg.height = game.height;

        var marco=this.add.sprite(game.world.width/2,50,'crate');
        marco.width=550;
        marco.height=900;
        marco.anchor.setTo(0.5,0);
        marco.alpha=0.2;
        marco.tint="#6397cc";


		var textStory = this.add.text(game.world.width/2, 75, 'Ranking', { font: "50px Baloo Thambi", fill: "#fff" });
		textStory.anchor.setTo(0.5);
		var buttonContinue = this.add.button(this.world.width-20, game.world.height-20, 'button-continue', this.clickContinue, this, 1, 0, 2);
		buttonContinue.scale.setTo(0.8);
		buttonContinue.anchor.set(1,1);
		buttonContinue.x = this.world.width+buttonContinue.width+20;		
		this.add.tween(buttonContinue).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		//Añado el ranking
		var sep=150;//Posicion vertical de la primera linea
		
		for(var key in Pompas.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#fff";

	        //Si encuentra al usuario
			if(key < 10 && Pompas.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ Pompas.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, Pompas.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 10){//Si no es el usuario y key es menor
				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ Pompas.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-200, sep, Pompas.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 10 && Pompas.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/6, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+"-"+ Pompas.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, Pompas.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }

		this.camera.flash(0x000000, 500, false);
	},
	clickContinue: function() {
		Pompas._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function(){
			this.game.state.start('Game');
		}, this);
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			History		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Game		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

Pompas.Game = function(game) {};
Pompas.Game.prototype = {
	create: function() {

		this.tamaño=0.2;
		//La maxTiempo pes el tiempo que tarda el enemigo en ir de un lado de la pantalla al otro
		this.maxTiempo=100;		
        this._score = 0;
		this._time = 10;
		this.gamePaused = false;
		this.runOnce = false;

		this.bg = this.add.image(0, 0, "bg");
		this.bg.height = game.height;
    	this.bg.width = game.width;
    	//Gestion inputs
    	this.bg.inputEnabled = true;
        this.bg.input.priorityID = 0;


        // set top score to local storage saved score, if any, or zero.
        if(localStorage.getItem("topboomdots") == null){
        	this.topScore = 0;
        }else{
        	this.topScore =localStorage.getItem("topboomdots");
        }

        // adding a text object which will display the score
        this._scoreText = game.add.text(20, 40, "-", {
            font:"bold 30px Varela Round",
            fill: "#3582ff"
		});

        
        // we'll call this method each time we need to update the score
        this.updateScore();        

        //Mares        
        this.marAlto=this.add.image(game.width/2, game.height, 'marAlto');
        this.marAlto.anchor.setTo(0.5,1);
        this.marAlto.scale.setTo(2.5,1.5);
        
        this.marMedio=this.add.image(game.width/2, game.height, 'marMedio');
        this.marMedio.anchor.setTo(0.5,1);
        this.marMedio.scale.setTo(2.5,1.5); 
        
        this.marBajo=this.add.image(game.width/2, game.height, 'marBajo');
        this.marBajo.anchor.setTo(0.5,1);
        this.marBajo.scale.setTo(2.5,1.5);     


        game.add.tween(this.marAlto).to({
			x: this.marAlto.width / 2
		}, 3000 , Phaser.Easing.Cubic.InOut, true, 0, -1, true);

		game.add.tween(this.marMedio).to({
			x: this.marMedio.width / 2
		}, 2000 , Phaser.Easing.Cubic.InOut, true, 0, -1, true);

		game.add.tween(this.marBajo).to({
			x: this.marMedio.x-(this.marMedio.width / 8)
		}, 2000 , Phaser.Easing.Cubic.InOut, true, 0, -1, true);
        /*
		this.water = this.add.tileSprite(0, (game.height-100), 128 * 16, 24 * 16, 'waters');         
        this.water.animations.add('waves', [28, 29, 30, 31, 30, 29]);        
        this.water.animations.play('waves', 6, true);*/

		//Rango
        this.rango=[3, 3.5, 4, 4.5, 5, 5.5 , 6 , 6.5, 7];

        this.one=game.rnd.integerInRange(0, 4);
        // ladies and gentlemen, the enemy :)
        this.enemy = game.add.sprite(game.width, 0, "player");
        this.enemy.scale.setTo((this.tamaño*(this.rango[this.one])),(this.tamaño*(this.rango[this.one])));

        // set enemy registration point to its center
        this.enemy.anchor.set(0.5);        
        this.enemy.frame=this.one;
        this.two=(8-this.one);

        // ladies and gentlemen, the player
        this.player = game.add.sprite(game.width / 2, (game.height / 5 * 4)+25, "player");
        /*
        this.txalupa = game.add.sprite(game.width / 2, (game.height / 5 * 4)+70, "txalupa");
        this.txalupa.scale.setTo(2,2);
        this.txalupa.anchor.setTo(0.5);*/

        // set player registration point to its center
        this.player.anchor.setTo(0.5);
        this.player.frame=this.two;
        this.player.scale.setTo((this.tamaño*(this.rango[this.two])),(this.tamaño*(this.rango[this.two])));
        

        //  method to place the player
        this.placePlayer();
        
        // method to place the enemy
		this.placeEnemy(  );
		
		
		

		this.initUI();

		this.camera.resetFX();
		this.camera.flash(0x000000, 500, false);
	},
	initUI: function() {
		/*
		this.buttonPause = this.add.button(this.world.width-20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
		this.buttonPause.anchor.set(1,0);
		this.buttonPause.input.priorityID=1;*/

		//Fuentes
        var fontTitle =  { font: "100px Baloo Thambi", fill: "#fff" };
        var fontScore = { font: "60px Baloo Thambi", fill: "#fff" };

		//this.buttonPause.y = -this.buttonPause.height-20;
		//this.add.tween(this.buttonPause).to({y: 20}, 1000, Phaser.Easing.Exponential.Out, true);

		

		this.screenPausedGroup = this.add.group();
		this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
		this.screenPausedBg.width=game.world.width;
        this.screenPausedBg.height=game.world.height;
		this.screenPausedText = this.add.text(this.world.width*0.5, 100, 'Paused', fontTitle);
		this.screenPausedText.anchor.set(0.5,0);
		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);
		this.screenPausedBack = this.add.button(100, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		this.screenPausedBack.anchor.set(0,1);
		this.screenPausedContinue = this.add.button(this.world.width-100, this.world.height-100, 'button-continue', this.managePause, this, 1, 0, 2);
		this.screenPausedContinue.anchor.set(1,1);
		this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.buttonAudio);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
		this.screenPausedGroup.visible = false;

		this.buttonAudio.setFrames(Pompas._audioOffset+1, Pompas._audioOffset+0, Pompas._audioOffset+2);

		this.screenDiedGroup = this.add.group();
        this.screenDiedBg = this.add.sprite(0, 0, 'overlay');
        this.screenDiedBg.width=game.world.width;
        this.screenDiedBg.height=game.world.height;
        this.screenDiedText = this.add.text(this.world.width*0.5, 100, 'Ups..', fontTitle);
        this.screenDiedText.anchor.set(0.5,0);        
        this.screenDiedContinue = this.add.button(this.world.width/2, this.world.height-200, 'button-start', this.stateRestart, this, 1, 0, 2);
        this.screenDiedContinue.anchor.set(0.5);
        this.screenDiedScore = this.add.text(this.world.width*0.5, 300, '', fontScore);
        this.screenDiedScore.anchor.set(0.5,0.5);
        this.screenDiedMaxScore = this.add.text(this.world.width*0.5, 450, '', fontScore);
        this.screenDiedMaxScore.anchor.set(0.5,0.5);
        this.screenDiedGroup.add(this.screenDiedBg);
        this.screenDiedGroup.add(this.screenDiedText);        
        this.screenDiedGroup.add(this.screenDiedContinue);
        this.screenDiedGroup.add(this.screenDiedScore);
        this.screenDiedGroup.add(this.screenDiedMaxScore);
        this.screenDiedGroup.visible = false;

        this.screenGameoverGroup = this.add.group();
		this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
		this.screenGameoverBg.width=game.world.width;
        this.screenGameoverBg.height=game.world.height;
		this.screenGameoverText = this.add.text(this.world.width*0.5, 100, 'Game over', fontTitle);
		this.screenGameoverText.anchor.set(0.5,0);
		//this.screenGameoverBack = this.add.button(100, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		//this.screenGameoverBack.anchor.set(0,1);
		this.screenGameoverRestart = this.add.button(this.world.width/2, this.world.height-100, 'button-continue', this.tarea, this, 1, 0, 2);
		this.screenGameoverRestart.anchor.set(0.5);
		this.screenGameoverScore = this.add.text(this.world.width*0.5, 500, this.topScore, fontTitle);
		this.screenGameoverScore.anchor.set(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		//this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
		this.screenGameoverGroup.visible = false;
	},
	update: function() {
		switch(this.stateStatus) {
			case 'paused': {
				if(!this.runOnce) {
					this.statePaused();
					this.runOnce = true;
				}
				break;
			}
			case 'died':
                {
                    if (!this.runOnce) {
                        this.stateDied();
                        this.runOnce = true;
                    }
                    break;
                }
			case 'gameover': {
				if(!this.runOnce) {
					this.stateGameover();
					this.runOnce = true;
				}
				break;
			}
			case 'playing': {
				this.statePlaying();
			}
			default: {
			}
		}

		// Acierta
		if(Phaser.Math.distance(this.player.x, this.player.y, this.enemy.x, this.enemy.y) < this.player.width / 2 + this.enemy.width / 2){

            
            // stop enemy tween
            this.enemyTween.stop();
            if(Pompas._vidas<7){
            	//Pompas._vidas++;
            }


            if(this._score==5  || this._score==12 || this._score==25){
            	Pompas._vidas+=1;
            	game.sound.play('super-acierto');
            }else{
            	game.sound.play('ok');
            }
            

            // stop player tween
			this.playerTween.stop();

                        
                
            var pointsAdded = this.add.sprite(this.enemy.x, this.enemy.y, "diez");
            pointsAdded.frame=this.one; 
            pointsAdded.scale.setTo(3,3);
            pointsAdded.anchor.set(0.5, 0.5);

            this._score++;
            
			
            var randX = this.rnd.integerInRange(200,this.world.width-200);
            var randY = this.rnd.integerInRange(200,this.world.height-200);
            this.add.tween(pointsAdded).to({ alpha: 0, y: randY-50 }, 1000, Phaser.Easing.Linear.None, true);

            this.one=game.rnd.integerInRange(0, 8);
            this.two=(8-this.one);
            this.enemy.frame=this.one;
            this.player.scale.setTo((this.tamaño*(this.rango[this.two])),(this.tamaño*(this.rango[this.two])));
            // place the enemy again
            this.placeEnemy();
            this.player.frame=this.two;
            this.enemy.scale.setTo((this.tamaño*(this.rango[this.one])),(this.tamaño*(this.rango[this.one])));
            // place the player again
            this.placePlayer();

            // update score text
            this.updateScore();
		}else if(this.player.y<10){

        }
	},
	managePause: function() {
		this.gamePaused =! this.gamePaused;
		Pompas._playAudio('click');
		if(this.gamePaused) {
			this.stateStatus = 'paused';
		}
		else {
			this.stateStatus = 'playing';
			this.runOnce = false;
		}
	},
	statePlaying: function() {
		this.screenPausedGroup.visible = false;

		//Reactivo los tweens
		game.tweens.resumeAll();
        	
		
	},
	statePaused: function() {
		this.screenPausedGroup.visible = true;
		//Evitar disparo
		//Paro todos los tweens
		game.tweens.pauseAll();

		
		
	},
	stateDied: function() {               
        this.screenDiedGroup.visible = true;
        game.tweens.pauseAll();
        this.screenDiedScore.setText('Aciertos: '+this._score);
        this.screenDiedMaxScore.setText('Tu máximo: '+Pompas._totalScore);
        //this.screenDiedScore.setText('Puntos: '+this._score);
        //this.diedScoreTween();
        Pompas.Storage.setHighscore('Pompas-highscore', this._score);
        //this.buttonDummy.exists=false;
    },
	stateGameover: function() {
		this.screenGameoverGroup.visible = true;
		game.world.bringToTop(this.screenGameoverGroup);
		
		this.screenGameoverScore.setText('Tu record: '+Pompas._totalScore);
		this.gameoverScoreTween();
		
	},
	addPoints: function() {
		this._score += 10;
		this.textScore.setText(this._score);
		var randX = this.rnd.integerInRange(200,this.world.width-200);
		var randY = this.rnd.integerInRange(200,this.world.height-200);
		var pointsAdded = this.add.text(randX, randY, '+10',
			{ font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
		pointsAdded.anchor.set(0.5, 0.5);
		this.add.tween(pointsAdded).to({ alpha: 0, y: randY-50 }, 1000, Phaser.Easing.Linear.None, true);

		this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);
	},
	gameoverScoreTween: function() {
		this.screenGameoverScore.setText('0');
		if(this.topScore) {
			this.tweenedPoints = 0;
			var pointsTween = this.add.tween(this);
			pointsTween.to({ tweenedPoints: Pompas._totalScore }, 1000, Phaser.Easing.Linear.None, true, 500);
			pointsTween.onUpdateCallback(function(){
				this.screenGameoverScore.setText(Math.floor(this.tweenedPoints));
			}, this);
			pointsTween.onComplete.addOnce(function(){
				this.screenGameoverScore.setText(Pompas._totalScore);
				this.spawnEmitter(this.screenGameoverScore, 'particle', 20, 300);
			}, this);
			pointsTween.start();
		}
	},
	spawnEmitter: function(item, particle, number, lifespan, frequency, offsetX, offsetY, gravity) {
		offsetX = offsetX || 0;
		offsetY = offsetY || 0;
		lifespan = lifespan || 2000;
		frequency = frequency || 0;
		var emitter = this.game.add.emitter(item.x+offsetX, item.y+offsetY, number);
		emitter.maxParticles = number;
		emitter.makeParticles(particle);
		emitter.setXSpeed(-500, 500);
		emitter.setYSpeed(-700, 300);
		emitter.setScale(4, 1, 4, 1, 500, Phaser.Easing.Linear.None);		
		emitter.gravity = gravity || 250;
		emitter.start(false, lifespan, frequency, number);
	},
	clickAudio: function() {
		Pompas._playAudio('click');
		Pompas._manageAudio('switch',this);
	},
	stateRestart: function() {
		Pompas._playAudio('click');
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		
		this.stateStatus = 'playing';
		this.state.restart(true);
	},
	stateBack: function() {
		Pompas._playAudio('click');
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		
		this.stateStatus = 'playing';
		// this.state.restart(true);
		this.state.start('MainMenu');
		
	},
    // method to update the score
    updateScore: function(){
    	
		this._scoreText.text = "Puntos: " + this._score + " - Tu record: " + Pompas._totalScore;
	},

    // method to place the player
    placePlayer: function(){

    	this.updateVidas();

    	this.grupoPlayer = game.add.group();
    	this.grupoPlayer.add(this.player);
        
        // set player horizontal position
        this.player.x = game.width / 2;

        // set player vertical position
        this.player.y = game.height-120;

        //Pongo dos capas de mar por delante del player
        game.world.bringToTop(this.marMedio);
        game.world.bringToTop(this.marBajo);
        
        // player tween to move the player to the bottom of the screen. 
        //The higher the score, the faster the tween
        
        this.seUndeTween = game.add.tween(this.player).to({
			y: game.height-30
		}, 10000 , Phaser.Easing.Linear.None, true);

		this.player.angle=15;
		this.balanceo=game.add.tween(this.player).to({            
                angle: '-30'
            }, 3000, Phaser.Easing.Cubic.InOut , true, 0, -1, true);
		
		this.balanceo2=game.add.tween(this.grupoPlayer).to({            
                y: this.grupoPlayer.y+10
            }, 800, Phaser.Easing.Cubic.InOut , true, 0, -1, true);

		



		//- this._score * 10
        // if the tween completes, it's game over and we call die method
        this.seUndeTween.onComplete.add(this.seUnde, this);
        //game.world.bringToTop(this.water);
        // waiting for player input to call fire method        
        this.bg.events.onInputDown.add(this.fire, this);
	},
    falla: function(){
    	
        game.sound.play('fail');        
        this.die();
    },
    seUnde: function(){

        game.sound.play('burbujas');
        //(item,image,numbre,lifespam)
        this.spawnEmitter(this.player, 'bubble', 30, 200);
        game.world.bringToTop(this.marMedio);
    	game.world.bringToTop(this.marBajo);
    	var juego=this;
    	setTimeout(function(){
    		juego.die();
    	},2000);
        
    },

    //Falla
	die: function(){       

		//Apunto los puntos
            if(Pompas._totalScore < this._score){
                Pompas._totalScore = this._score;
            } 
        
        if(Pompas._vidas>=1){
                    Pompas._vidas--;
                    this.stateStatus='died';
                }else{
                    this.stateStatus='gameover'
                }   

        // start the game again
        /*       
        game.time.events.add(2000, function() {  
             game.state.start("Game");
        }, this);*/
	},

    // method to place the enemmy
    placeEnemy: function(){
    	
        
        // set enemy x position
        this.enemy.x = game.width - this.enemy.width / 2;

        // set enemy y position
		this.enemy.y = -this.enemy.width / 2;

        // tween to make the enemy enter on the stage
        var enemyEnterTween = game.add.tween(this.enemy).to({
			y: game.rnd.between(this.enemy.width * 2, game.height / 4 * 3 - this.player.width / 2)
		}, 200, Phaser.Easing.Linear.None, true);

        // once the tween is completed, move the enemy horizontally
        enemyEnterTween.onComplete.add(this.moveEnemy, this);
	},

    // method to move the enemy
    moveEnemy: function(){

        // yoyo tween to move the enemy left and right
        this.enemyTween = game.add.tween(this.enemy).to({
			x: this.enemy.width / 2
		}, 1000 + game.rnd.between(0, this.maxTiempo), Phaser.Easing.Cubic.InOut, true, 0, -1, true);
	},

    // method to fire
    fire: function(){
        game.sound.play('weep');
        // removing input listener
        game.input.onDown.remove(this.fire, this);

        // stop current player tween        
        this.seUndeTween.stop();
        this.balanceo.stop();

        // tween to fire the player to the top of the stage
        this.playerTween = game.add.tween(this.player).to({
			y: -this.player.width
		}, 500, Phaser.Easing.Linear.None, true);

        // if the tween completes, that is the player missed the enemy, then it's game over
        this.playerTween.onComplete.add(this.falla, this);
	},
	tarea: function() {
		game.destroy();    
        document.getElementById("next").click();
        
    },
    updateVidas: function(){
    	for(var a=0; a<Pompas._vidas;a++){
        	this.vidas=this.game.add.image((a*30)+30, 10, 'vida');
        }
    }
};


///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


	var game = new Phaser.Game(640, 960, Phaser.CANVAS);

	//  The Google WebFont Loader will look for this object, so create it before loading the script.
	WebFontConfig = {

	    //  'active' means all requested fonts have finished loading
	    //  We set a 1 second delay before calling 'createText'.
	    //  For some reason if we don't the browser cannot render the text the first time it's created.
	   

	    //  The Google Fonts we want to load (specify as many as you like in the array)
	    google: {
	      families: ['Baloo Thambi','Varela Round']
	    }

	};
	
	var states = {
		'Boot': Pompas.Boot,
		'Preloader': Pompas.Preloader,
		'MainMenu': Pompas.MainMenu,
		'Achievements': Pompas.Achievements,
		'Story': Pompas.Story,
		'Game': Pompas.Game
	};
	for(var state in states)
		game.state.add(state, states[state]);
	
	game.state.start('Boot');

