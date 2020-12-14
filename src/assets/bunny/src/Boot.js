var vidas=1;
var nombre="Bunny";
var ranking=[
	{'usuario':'bunny', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= "../../assets/bunny/";


///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////
var bunny = {
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				bunny.Storage.initUnset('EPT-audio', true);
				bunny._audioStatus = bunny.Storage.get('EPT-audio');
				// bunny._soundClick = game.add.audio('audio-click');
				bunny._sound = [];
				bunny._sound['click'] = game.add.audio('audio-click');
				if(!bunny._soundMusic) {
					bunny._soundMusic = game.add.audio('audio-theme',1,true);
					bunny._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				bunny._audioStatus = true;
				break;
			}
			case 'off': {
				bunny._audioStatus = false;
				break;
			}
			case 'switch': {
				bunny._audioStatus =! bunny._audioStatus;
				break;
			}
			default: {}
		}
		if(bunny._audioStatus) {
			bunny._audioOffset = 0;
			if(bunny._soundMusic) {
				if(!bunny._soundMusic.isPlaying) {
					bunny._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			bunny._audioOffset = 4;
			if(bunny._soundMusic) {
				bunny._soundMusic.stop();
			}
		}
		bunny.Storage.set('EPT-audio',bunny._audioStatus);
		game.buttonAudio.setFrames(bunny._audioOffset+1, bunny._audioOffset+0, bunny._audioOffset+2);
	},
	_playAudio: function(sound) {
		if(bunny._audioStatus) {
			if(bunny._sound && bunny._sound[sound]) {
				bunny._sound[sound].play();
			}
		}
	}
};

//Creo un avariable para las vidas
bunny._vidas=vidas;
bunny._totalScore=0;
bunny.ranking=ranking;

bunny.Boot = function(game){};
bunny.Boot.prototype = {
	preload: function(){
		this.stage.backgroundColor = '#7accf0';		
		this.load.image('loading-background', url+'img/loading-background.png');
		this.load.image('loading-progress', url+'img/loading-progress.png');
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

bunny.Preloader = function(game) {};
bunny.Preloader.prototype = {
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
		var pack = bunny.Preloader.resources;
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
bunny.Preloader.resources = {	
	'image': [
		
		['portada', url+'img/portada.png'],
		['storyBg', url+'img/StoryBg.jpg'],
		['title', url+'img/title.png'],		
		['overlay', url+'img/overlay.jpg'],		
		['particle', url+'img/particle.png'],		
		['tubo', url+'img/tubo.jpg'],		
		['bg', url+'img/bg.png'],
		['suerte', url+'img/suerte.png'],
		["ground", url+"img/ground.png"],
		["sky", url+"img/cielo6.png"],
		["crate", url+"img/crate.png"],
		["avion", url+"img/avion.png"],
		["zepelin", url+"img/zepelin.png"],
		["bubble", url+"img/bubble.png"],
		["bubble2", url+"img/bubble2.png"],
		["ufo", url+"img/ufo.png"],
		["satelite", url+"img/satelite.png"],
		["zanahoria", url+"img/zanahoria.png"],
		["pinfloi", url+"img/pinfloi.svg"],
		["titulo", url+"img/Bunny.svg"]             
		
	],
	'spritesheet': [
		['button-start', url+'img/button-start.png', 180, 180],
		['button-continue', url+'img/button-continue.png', 180, 180],
		['button-mainmenu', url+'img/button-mainmenu.png', 180, 180],
		//['button-restart', url+'img/button-tryagain.png', 180, 180],
		['button-achievements', url+'img/button-achievements.png', 110, 110],
		['button-pause', url+'img/button-pause.png', 80, 80],
		['button-audio', url+'img/button-sound.png', 80, 80],
		['button-back', url+'img/button-back.png', 80, 80],		
		["txita", url+"img/txita.png", 250,250],
		["buny", url+"img/buny6.png", 260,300],
		["vida", url+"img/vida.png", 75,113] 
	
	],
	'audio': [
		['audio-click', [url+'sfx/audio-button.m4a',url+'sfx/audio-button.mp3',url+'sfx/audio-button.ogg']],
		['audio-theme', [url+'sfx/music-bitsnbites-liver.m4a',url+'sfx/music-bitsnbites-liver.mp3',url+'sfx/music-bitsnbites-liver.ogg']],
		["jump",url+"sfx/jump5.wav"],
		["fail", url+"sfx/fail.wav"],
		["laser", url+"sfx/rayo.wav"],
		["quejas", url+"sfx/quejas.ogg"],
		["derrape", url+"sfx/derrape.wav"]			
	]
};



///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Main Menú	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

bunny.MainMenu = function(game) {};
bunny.MainMenu.prototype = {
	preload: function(){
		game.load.bitmapFont("font", url+"fonts/font.png", url+"fonts/font.fnt");
		

	},
	create: function() {
		//this.add.sprite(0, 0, 'background');
		var title = this.add.sprite(this.world.width*0.5, (this.world.height-100)*0.5, 'title');
		title.anchor.set(0.5);



		bunny.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
        
		bunny.Storage.initUnset('bunny-points', 0);
		var highscore = bunny.Storage.get('bunny-points') || 0;

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

		var fontHighscore = { font: "40px Varela Round", fill: "#fff" };
		var textHighscore = this.add.text(this.world.width*0.5, this.world.height-50, 'Highscore: '+highscore, fontHighscore);
		textHighscore.anchor.set(0.5,1);

		bunny._manageAudio('init',this);
		// Turn the music off at the start:
		bunny._manageAudio('off',this);

		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);		
		buttonAchievements.y = this.world.height+buttonAchievements.height+20;
		this.add.tween(buttonAchievements).to({y: this.world.height-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		bunny._playAudio('click');
		bunny._manageAudio('switch',this);
	},	
	clickStart: function() {
		bunny._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		bunny._playAudio('click');
		this.game.state.start('Achievements');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Achievements	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

bunny.Achievements = function(game) {};
bunny.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: "32px Vareal Round", fill: "#000" };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(this.world.width-20, game.world.height-20, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.x = this.world.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		bunny._playAudio('click');
		this.game.state.start('MainMenu');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Story		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

bunny.Story = function(game) {};
bunny.Story.prototype = {
	create: function(){

		//Bg
		var bg=this.add.sprite(0,0,'storyBg');
		bg.width = game.width;
        bg.height = game.height;

        var marco=this.add.sprite(game.world.width/2,50,'crate');
        marco.width=550;
        marco.height=900;
        marco.anchor.setTo(0.5,0);
        marco.alpha=0.1;
        marco.tint="#6397cc";


		var textStory = this.add.text(game.width/3, 75, 'Ranking', { font: "45px Baloo Thambi", fill: "#fff" });
		
		//Añado el ranking
		var sep=150;//Posicion vertical de la primera linea
		
		for(var key in bunny.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#fff";

	        //Si encuentra al usuario
			if(key < 10 && bunny.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ bunny.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, bunny.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 10){//Si no es el usuario y key es menor
				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ bunny.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-200, sep, bunny.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 10 && bunny.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/6, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+"-"+ bunny.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, bunny.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }

		var buttonContinue = this.add.button(this.world.width-20, game.world.height-20, 'button-continue', this.clickContinue, this, 1, 0, 2);
		buttonContinue.scale.setTo(0.8);
		buttonContinue.anchor.set(1,1);
		buttonContinue.x = this.world.width+buttonContinue.width+20;
		
		this.add.tween(buttonContinue).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.camera.flash(0x000000, 500, false);
	},
	clickContinue: function() {
		bunny._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function(){
			this.game.state.start('History');
		}, this);
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			History		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


bunny.History = function(game) {};
bunny.History.prototype = {
	create: function() {
		
		//Añado los elementos a la escena

		//Bg
		this.bg=this.add.sprite(0,game.world.height,'sky');
		this.bg.width = game.width;
        this.bg.height = 3800;
        this.bg.anchor.set(0,1);

        //Ground
        this.ground = game.add.sprite(game.width/2, game.height, "ground");              
        this.ground.anchor.set(0.5,1);

        //UFO
        this.ufo = game.add.sprite(game.width+175, game.height/3, "ufo");              
        this.ufo.anchor.set(0.5,1);

        //Zanahoria
        this.zanahoria = game.add.sprite(game.width+500, game.height/2, "zanahoria");              
        this.zanahoria.anchor.set(0.5,1);       

        //Buny
        this.buny = game.add.sprite(game.width / 2,game.height-120,'buny');
        this.buny.scale.setTo(0.8,0.8);
        this.buny.anchor.setTo(0.4,1);        
        this.buny.frame=0;
        this.buny.animations.add('come',[10,11],2, true);
        this.buny.animations.add('sinZana',[12,13,14],1, false);
        this.buny.animations.add('grita',[14,15],6, true);

        var buttonStart = this.add.button(this.world.width-20, this.world.height-20, 'button-continue', this.clickStart, this, 1, 0, 2);
		buttonStart.scale.setTo(0.5,0.5);
		buttonStart.anchor.set(1);
        

		this.come();		
		
	},
	clickStart: function() {
		bunny._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Game');
		}, this);
	},
	come: function(){
		this.buny.animations.play('come');
		this.saleUfo();	
	},
	saleUfo: function(){
		this.ufo.angle=5;
		
		 game.add.tween(this.ufo).to({            
                angle: '-10'
            }, 2000, Phaser.Easing.Elastic.Out , true, 0, -1, true);
		

		game.time.events.add(Phaser.Timer.SECOND * 1.5, function(){
			var derrape=game.sound.play('derrape');
			derrape.volume=0.3;
		}, this);
		
		var anim=game.add.tween(this.ufo).to({
        x: game.width/2
        }, 3500, Phaser.Easing.Elastic.InOut  , true );
			
		anim.onComplete.add(function(){

			this.abduce();
        
        
        }, this);

	},
	abduce: function(){			
			      
		    this.rayo=game.add.sprite(game.width/2, game.height/3, 'crate');
		    this.rayo.alpha=0.3;
		    this.rayo.width=0;
		    this.rayo.height=0;	   
		    this.rayo.anchor.setTo(0.5,0);
		    var laser=game.sound.play('laser');
		    laser.volume=0.2;
		    var extiende=game.add.tween(this.rayo).to({
		    	width: 100,        	
	        	height: 500
	        }, 2000, Phaser.Easing.Linear.None, true );	

	        extiende.onComplete.add(function(){
	        	this.recoge();
	        },this);    
	 
	},
	recoge: function(){

		this.zanahoria.x=(game.world.width/2)+10;
		this.zanahoria.y=game.world.height-140;
		this.zanahoria.bringToTop();
		this.buny.animations.play('sinZana');


		var sube=game.add.tween(this.rayo).to({
		    	width: 0,        	
	        	height: 0
	        }, 2000, Phaser.Easing.Linear.None, true );

		game.add.tween(this.zanahoria).to({
			y: this.ufo.y
		}, 2000, Phaser.Easing.Linear.None, true );
		this.ufo.bringToTop();
	    	

	        sube.onComplete.add(function(){
	        	game.sound.play('quejas');
	        	
	        	this.seva();
	        },this); 

	},
	seva: function(){
		this.zanahoria.destroy();
		this.buny.animations.play('grita');
		var anim=game.add.tween(this.ufo).to({
        y: -150
        }, 3500, Phaser.Easing.Linear.None, true );
			
		anim.onComplete.add(function(){

			game.state.start('Game');        
        
        }, this);
		
	}
}

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Game		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

bunny.Game = function(game) {};
bunny.Game.prototype = {
    create: function() {

        this._score = 0;
        this._time = 10000;
        this.gamePaused = false;
        this.runOnce = false;
        this.caida=1000;
        this.first=true;
        this.velocidad=1200;
        this.min=0;
        this.max=0;
        this.ancho=3;
        this.posy=game.height-200;
        this.intervalo=500000;
        this.bunyPosx;
        this.tembleque=false;
        this.intentos=2;
        

        //Bg
        this.bg=this.add.sprite(0,game.world.height,'sky');
        this.bg.width = game.width;
        this.bg.height = 3800;
        this.bg.anchor.set(0,1);
        this.bg.inputEnabled = true;
        this.bg.input.priorityID = 0;
        this.bg.events.onInputDown.add(this.paraBloque, this);
        this.grupo = game.add.group();
        this.canDrop = true;
        this.movingCrate = game.add.sprite(50, this.posy, "crate");
        this.color=Math.random() * 0xffffff;
        this.movingCrate.tint = this.color;
        this.movingCrate.scale.setTo(this.ancho,1);
        this.grupo.add(this.bg);
        this.grupo.add(this.movingCrate);

        //Vidas
        this.vidas=this.add.group();

        for(var a=1;a<=bunny._vidas;a++){
            var vida = game.add.sprite(45*a,20,'vida');
            vida.scale.setTo(0.5,0.5);
            vida.frame=0;
            this.vidas.add(vida);

        }

        //Avion
        this.avion = game.add.sprite(-200,100,'avion');
        this.avion.scale.setTo(0.8,0.8);
        //Zepelin
        this.zepelin = game.add.sprite(game.world.width+50,100,'zepelin');
        this.zepelin.scale.setTo(0.8,0.8);

        //Satelite
        this.satelite = game.add.sprite(75,-1600,'satelite');
        this.satelite.scale.setTo(0.8,0.8);
        this.grupo.add(this.satelite);   

        //Txita
        this.txita = game.add.sprite(-50,-50,'txita');
        this.txita.scale.setTo(0.5,0.5);
        this.txita.anchor.setTo(0.5,0.5);
        this.txita.frame=1;
        this.txita.animations.add('vuelo',[0,1,2,3],15, true);

        //Ground
        this.ground = game.add.sprite(game.width / 2, game.height, "ground");
        this.grupo.add(this.ground);       
        this.ground.anchor.set(0.5,1);


        //Buny
        this.buny = game.add.sprite(game.width / 2,game.height-120,'buny');
        this.buny.scale.setTo(0.8,0.8);
        this.buny.anchor.setTo(0.4,1);
        this.grupo.add(this.buny);
        this.buny.frame=0;
        this.buny.animations.add('salto',[0,1,2,1,3,4,5,6,7,0],10, false);
        this.buny.animations.add('salto2',[0,1,2,1,3,4,5,6,7,8],10, false);
        this.buny.animations.add('triste',[0,9],1, false);
        //this.buny.animations.add('salto',[0,4],1, true);
        

        //Marca el ancho        
        this.marca=game.add.sprite(game.width/2, 0, 'crate');
        this.marca.alpha=0;
        this.marca.height=game.world.height;
        this.marca.width=2
        this.marca.anchor.setTo(0.5,0);
        
         
        //Movimiento del bloque
        this.crateTween = game.add.tween(this.movingCrate).to({
            x: game.width - 75
        }, this.velocidad, Phaser.Easing.Linear.None, true, 0, -1, true);

        // Inputs
        //Teclado
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.paraBloque, this);
        

        this.initUI();

    },
    initUI: function() {
        this.buttonPause = this.add.button(this.world.width-20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
        this.buttonPause.anchor.set(1,0);
        this.buttonPause.input.priorityID=1;

        //Fuentes
        var fontScoreWhite =  { font: "100px Baloo Thambi", fill: "#fff" };
        var fontScore = { font: "100px Baloo Thambi", fill: "#fff" };
        var fontTitle = { font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 };

        //Texto
        this.textScore = game.add.text(100,100,'', fontScore);        
        this.textScore.text=this._score;
        

        this.text = game.add.text(50,75,'', fontScore);
                

        this.buttonPause.y = -this.buttonPause.height-20;
        this.add.tween(this.buttonPause).to({y: 20}, 1000, Phaser.Easing.Exponential.Out, true);


        this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedBg.width=game.world.width;
        this.screenPausedBg.height=game.world.height;
        this.screenPausedText = this.add.text(this.world.width*0.5, 100, 'Paused', fontTitle);
        this.screenPausedText.anchor.set(0.5,0);
        this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
        this.buttonAudio.anchor.set(1,0);
        this.screenPausedBack = this.add.button(150, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
        this.screenPausedBack.anchor.set(0,1);
        this.screenPausedContinue = this.add.button(this.world.width-150, this.world.height-100, 'button-continue', this.managePause, this, 1, 0, 2);
        this.screenPausedContinue.anchor.set(1,1);
        this.screenPausedGroup.add(this.screenPausedBg);
        this.screenPausedGroup.add(this.screenPausedText);
        this.screenPausedGroup.add(this.buttonAudio);
        this.screenPausedGroup.add(this.screenPausedBack);
        this.screenPausedGroup.add(this.screenPausedContinue);
        this.screenPausedGroup.visible = false;

        this.buttonAudio.setFrames(bunny._audioOffset+1, bunny._audioOffset+0, bunny._audioOffset+2);

        this.screenDiedGroup = this.add.group();
        this.screenDiedBg = this.add.sprite(0, 0, 'overlay');
        this.screenDiedBg.width=game.world.width;
        this.screenDiedBg.height=game.world.height;
        this.screenDiedText = this.add.text(this.world.width*0.5, 100, 'Ups..', fontScore);
        this.screenDiedText.anchor.set(0.5,0);        
        this.screenDiedContinue = this.add.button(this.world.width/2, this.world.height-200, 'button-start', this.stateRestart, this, 1, 0, 2);
        this.screenDiedContinue.anchor.set(0.5);
        this.screenDiedScore = this.add.text(this.world.width*0.5, 300, 'Bloques: '+this._score, fontScoreWhite);
        this.screenDiedScore.anchor.set(0.5,0.5);
        this.screenDiedMaxScore = this.add.text(this.world.width*0.5, 450, '', fontScoreWhite);
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
        this.screenGameoverText = this.add.text(this.world.width/2, 75, 'Fin', fontScore);
        this.screenGameoverText.anchor.set(0.5);        
        this.screenGameoverContinue = this.add.button(this.world.width/2, this.world.height-75, 'button-continue', this.next, this, 1, 0, 2);
        this.screenGameoverContinue.anchor.set(0.5,1);        
        this.screenGameoverGroup.add(this.screenGameoverBg);
        this.screenGameoverGroup.add(this.screenGameoverText);        
        this.screenGameoverGroup.add(this.screenGameoverContinue);        
        this.screenGameoverGroup.visible = false;

        this.pasaTxita(); 
    },
    pasaTxita:function(){      
        game.time.events.add(Phaser.Timer.SECOND * 4, function(){

            this.txita.y=100;
            this.txita.animations.play('vuelo');

            var anim=game.add.tween(this.txita).to({
                x: game.width+100
            }, 4000, Phaser.Easing.Quadratic.InOu, true );

            this.pasaZepelin();
            this.pasaAvion();           
        }, this);
    
    },
    pasa:function(){      
        game.time.events.add(Phaser.Timer.SECOND * 4, function(){

            this.txita.y=100;
            this.txita.animations.play('vuelo');

            var anim=game.add.tween(this.txita).to({
                x: game.width+100
            }, 4000, Phaser.Easing.Quadratic.InOu, true );

            this.pasaZepelin();
            this.pasaAvion();           
        }, this);
    
    },
    pasaZepelin: function(){
        game.time.events.add(Phaser.Timer.SECOND * 12, function(){
            
            this.zepelin.y=25;
            this.grupo.add(this.zepelin);
            var anim2=game.add.tween(this.zepelin).to({
            x: -300
            }, 8000, Phaser.Easing.Quadratic.InOu, true );
            
        }, this);
    },
    pasaAvion: function(){
        game.time.events.add(Phaser.Timer.SECOND * 23, function(){            
            this.avion.y=-1200;
            this.grupo.add(this.avion);
            this.avion.bringToTop();
            game.add.tween(this.avion).to({
            x: game.world.width+100
            }, 4000, Phaser.Easing.Quadratic.InOu, true ); 

        }, this);
        

    },
    saltaBuny: function(){
        this.buny.bringToTop();
        //Salta buny
        if(this.marca.width>70){
            this.buny.animations.play('salto');
        }else if(this.tembleque==false){            
            this.buny.animations.play('salto2');
            this.tembleque=game.add.tween(this.buny).to({            
                angle: '-15'
            }, 1000, Phaser.Easing.Bounce.InOut , true, 0, -1, true);
            this.tembleque=true;
        }else{
             this.buny.animations.play('salto2');
        }
        
        var salto=game.add.tween(this.buny).to({
            
            y: this.buny.y-75
        }, 300, Phaser.Easing.Quartic.InOut , true );


    },
    paraBloque: function(){
    if(this.gamePaused==false){


        
        this._score+=1;       
            
        //Escondo el bloque que se mueve
        this.movingCrate.alpha = 0;
        //Si es la primea vuelta...
        if(this.first==true || (this.movingCrate.x+this.movingCrate.width/2)==this.min ){
            
            
            game.sound.play('jump');
            //Creo el bloque que se queda
            var stopingCrate = game.add.sprite(this.movingCrate.x, this.movingCrate.y, "crate");
            stopingCrate.tint=this.color;
            stopingCrate.width=this.movingCrate.width;
            
            this.marca.width=stopingCrate.width;
            this.marca.x=stopingCrate.x+(stopingCrate.width/2);
            this.buny.x=stopingCrate.x+(stopingCrate.width/2);
            this.saltaBuny();
            //Ya no será la primera vuelta
            this.first=false;

        //Si se para antes y queda en el aire
        }else if(this.movingCrate.x<(this.min-this.movingCrate.width) || this.movingCrate.x>this.max){
            game.sound.play('fail');
            //Apunto los puntos
            if(bunny._totalScore < this._score){
                bunny._totalScore = this._score;
            } 
            //Creo que bloque entero
            var fallingCrate = game.add.sprite(this.movingCrate.x, this.movingCrate.y+this.grupo.y, "crate");               
            //Le doy tamaño
            fallingCrate.width=this.movingCrate.width;
             //Le doy color
            fallingCrate.tint=Math.random() * 0xffffff;
            this.buny.animations.play('triste');
            //Hago caer el bloque sobrante
            var anim=game.add.tween(fallingCrate).to({
                y: game.height+2600
            }, 3500, Phaser.Easing.Linear.None, true );
            //No quiero basura
            anim.onComplete.add(function(target){
                target.destroy();
                if(bunny._vidas>1){
                        bunny._vidas--;
                        console.log('Bloques'+this._score);
                        this.stateStatus = 'died';
                       
                }else{
                     console.log('Estas mueto');
                     this.stateStatus = 'gameover';
                    //this.stateGameover();
                }            
            }, this);            

            //Si se para antes
        }else if(this.movingCrate.x<this.min & this.movingCrate.x<this.max ){
            game.sound.play('jump');
            //El bloque que sobre
            var fallingCrate = game.add.sprite(this.movingCrate.x, this.movingCrate.y+this.grupo.y, "crate");                
            //Le doy tamaño
            fallingCrate.width=this.min-this.movingCrate.x;
            //Le doy color al azar
            fallingCrate.tint=Math.random() * 0xffffff;                
            //Hago caer el sobrante
            var anim=game.add.tween(fallingCrate).to({
                y: game.height+100
            }, this.caida, Phaser.Easing.Linear.None, true );
            //No quiero basura
            anim.onComplete.add(function(target){
                target.destroy();                 

            }, this);
            //Creo el bloque que se queda
            var stopingCrate = game.add.sprite(this.movingCrate.x+fallingCrate.width, this.movingCrate.y, "crate");
            //Lo pinto
            stopingCrate.tint=this.movingCrate.tint;
            //Le doy tamaño
            stopingCrate.width=this.movingCrate.width-fallingCrate.width;          
                
                
            //Si para después
        }else if(this.movingCrate.x>this.min & this.movingCrate.x<this.max ){
            game.sound.play('jump');
            //Creo el bloque que cae
            var fallingCrate = game.add.sprite(this.max, this.movingCrate.y+this.grupo.y, "crate");
            //Le doy tamaño
            fallingCrate.width=this.movingCrate.x-this.min;
            //Le doy color
            fallingCrate.tint=Math.random() * 0xffffff; 
            //Lo hago caer  
            var anim=game.add.tween(fallingCrate).to({
                y: game.height+100
            }, this.caida, Phaser.Easing.Linear.None, true );
            //No quiero basura
            anim.onComplete.add(function(target){
            target.destroy();
            }, this);
            //Creo el bloque que se queda
            var stopingCrate = game.add.sprite(this.movingCrate.x, this.movingCrate.y, "crate");
            //Lo pinto
            stopingCrate.tint=this.movingCrate.tint;
            //Le doy tamaño
            stopingCrate.width=this.max-this.movingCrate.x;
            
                
            //En el caso raro
        }else{
            
            game.sound.play('jump');
            var stopingCrate = game.add.sprite(this.movingCrate.x, this.movingCrate.y, "crate");
            stopingCrate.tint=this.color;
            stopingCrate.width=this.movingCrate.width;            
                
        }

        this.min=stopingCrate.x;
        this.max=stopingCrate.x+stopingCrate.width; 
        //this.marca.width=this.max-this.min;
        //this.marca.x=stopingCrate.x+(stopingCrate.width/2);
            
        this.grupo.add(stopingCrate);
        this.textScore.text=this._score;

        this.marca.width=stopingCrate.width;
        this.marca.x=stopingCrate.x+(stopingCrate.width/2);
        this.buny.x=stopingCrate.x+(stopingCrate.width/2);
        this.saltaBuny();
            
        this.movingCrate.y=this.movingCrate.y-75;
        this.movingCrate.width=stopingCrate.width;
        this.newColor=Math.random() * 0xffffff;
        this.movingCrate.tint=this.newColor;
        this.movingCrate.alpha = 1;

        //Muestro bubble
        this.bubble = this.add.sprite(stopingCrate.x, stopingCrate.y, "bubble2");
        this.bubble.scale.setTo(0.5,0.5); 
        this.bubble.anchor.set(0.5, 0.5);
        this.bubble.tint=stopingCrate.tint;
        this.grupo.add(this.bubble);

        this.bubbleText = this.add.bitmapText(0, 0, "font", (this._score).toString(), 150);
        this.bubbleText.anchor.set(0.5);
        this.bubbleText.tint = "#fff";
        this.bubble.addChild(this.bubbleText);       

        
        game.add.tween(this.bubble).to({
         alpha: 0, 
         x: this.textScore.x,
         y: this.textScore.y-this.grupo.y
          }, 1000, Phaser.Easing.Linear.None, true);

            
        if(this.movingCrate.y<150){
            game.add.tween(this.grupo).to({
                y: this.grupo.y + 100
            },500, Phaser.Easing.Linear.None, true);            
        } 
         
      }  
    },
    getAngle: function(obj1, obj2) {
        
        // angle in degrees
        var angleDeg = (Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x) * 180 / Math.PI);
        return (angleDeg-45);
    },
    update: function() {

        //Pongo el satelite mirando a bunny
        this.satelite.angle = this.getAngle(this.satelite,this.buny);

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
    },
    render: function(){
        //game.debug.body(this.player);
        //this.tubos.forEach(this.renderGroup, this);
                
            
    },
    renderGroup:function(member) {   
             game.debug.body(member);
        },  
    managePause: function() {
        this.gamePaused =! this.gamePaused;
        bunny._playAudio('click');
        if(this.gamePaused) {
            this.stateStatus = 'paused';
        }
        else {
            this.stateStatus = 'playing';
            this.runOnce = false;
        }
    },
    statePlaying: function() {
          if(this.screenPausedGroup.visible==true){
               this.screenPausedGroup.visible = false;
          }
        game.tweens.resumeAll();
        
        
        
        //this.currentTimer.resume();
        //this.buttonDummy.exists=true;
        

    },
    statePaused: function() {
        this.screenPausedGroup.visible = true;      
        //this.crateTween.pause();
        game.tweens.pauseAll();
        
        

    },
    stateDied: function() {               
        this.screenDiedGroup.visible = true;
        game.tweens.pauseAll();
        this.screenDiedScore.setText('Bloques: '+this._score);
         this.screenDiedMaxScore.setText('Máximo: '+bunny._totalScore);
        //this.screenDiedScore.setText('Puntos: '+this._score);
        //this.diedScoreTween();
        bunny.Storage.setHighscore('bunny-points', this._score);
        //this.buttonDummy.exists=false;
    },
    stateGameover: function() {          
        game.tweens.pauseAll();        
        this.screenGameoverGroup.visible = true;        
        this.muestraRanking();
        //this.currentTimer.stop();
        
        //this.gameoverScoreTween();
        bunny.Storage.setHighscore('bunny-points',this._score);
        
                
        //this.buttonDummy.exists=false;
        
    },
    gameoverScoreTween: function() {

        this.screenGameoverScore.setText('Puntos: 0');
        if(this._score) {
            this.tweenedPoints = 0;
            var pointsTween = this.add.tween(this);
            pointsTween.to({ tweenedPoints: this._score }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function(){
                this.screenGameoverScore.setText('Puntos: '+Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function(){
                this.screenGameoverScore.setText('Puntos: '+this._score);
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
        bunny._playAudio('click');
        bunny._manageAudio('switch',this);
    },
    stateRestart: function() {
        bunny._playAudio('click');
        if(this.screenGameoverGroup.visible==true){
            this.screenGameoverGroup.visible = false;
        }
        
        this.gamePaused = false;
        this.runOnce = false;       
        this.stateStatus = 'playing';
        this.state.restart(true);
    },
    stateBack: function() {
        bunny._playAudio('click');
        this.screenGameoverGroup.visible = false;
        this.gamePaused = false;
        this.runOnce = false;
        //this.currentTimer.start();
        this.stateStatus = 'playing';
        this.state.restart(true);
        this.state.start('MainMenu');
    },
    muestraRanking: function() {
        let sep = 200;
        var a = new Array();
        a.usuario = nombre;
        a.puntos = bunny._totalScore;
         
        //Ordeno por puntos
        for (var i in bunny.ranking) {
            let cont=0;
            //Si existe el usuariuo y ha obtenido mejor puntuacion, la cambio
            if(bunny.ranking[i]['usuario'] == a['usuario'] && bunny.ranking[i]['puntos'] < a['puntos']){
                 bunny.ranking[i]['puntos']=a['puntos'];              
                break;

            //Si existe pero ha obtenido menor puntiuación, no hago nada            
            }if(bunny.ranking[i]['usuario'] == a['usuario'] && bunny.ranking[i]['puntos'] >= a['puntos']){                          
                break;              
            }else {//Si no existe lo añado
                bunny.ranking.push(a);
                break;
            }
        }

        //Ordeno el ranking por puntos
        bunny.ranking.sort(function(a, b) {
            return parseFloat(b['puntos']) - parseFloat(a['puntos']);
        });       
        
        
        //Muestro los puntos del usuario
        for(var key in bunny.ranking){
            let encontrado=false;
            let color = "#1e79ff";
            //var color = "#1e79ff";
            //Color usuer
            let colorU = "#fff";

            //Si encuentra al usuario
            if(key < 3 && bunny.ranking[key]['usuario'] == nombre){

                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ bunny.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
                this.add.text(game.world.width-200, sep, bunny.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
                encontrado = true;
                sep+=50;

            }else if(key < 3){//Si no es el usuario y key es menor
                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ bunny.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
                this.add.text(game.world.width-200, sep, bunny.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
                sep+=50;

                //Si es el usuario y key es mayor q 8
            }else if(key > 3 && bunny.ranking[key]['usuario'] == nombre && encontrado == false){

                this.add.text(game.world.width/6, sep, "...", { font: "40px Varela Round", fill: colorU });
                sep+=50;
                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ bunny.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
                this.add.text(game.world.width-200, sep, bunny.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
                break;//Termino la búsqueda
            }                  
        }//Fin del for para mostrar el ranking

    },
    next: function() {        
        game.destroy();
        document.getElementById("next").click();
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
		'Boot': bunny.Boot,
		'Preloader': bunny.Preloader,
		'MainMenu': bunny.MainMenu,
		'Achievements': bunny.Achievements,
		'Story': bunny.Story,
		'History': bunny.History,
		'Game': bunny.Game
	};

	
	for(var state in states)
		game.state.add(state, states[state]);
	
	game.state.start('Boot');






