var vidas=1;
var nombre="Cubo";
var ranking=[
	{'usuario':'bunny', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= "../../assets/cubo/";


///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Boot			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


var cubo = {
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				cubo.Storage.initUnset('cubo-audio', true);
				cubo._audioStatus = cubo.Storage.get('cubo-audio');
				// cubo._soundClick = game.add.audio('audio-click');
				cubo._sound = [];
				cubo._sound['click'] = game.add.audio('audio-click');
				if(!cubo._soundMusic) {
					cubo._soundMusic = game.add.audio('audio-theme',1,true);
					cubo._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				cubo._audioStatus = true;
				break;
			}
			case 'off': {
				cubo._audioStatus = false;
				break;
			}
			case 'switch': {
				cubo._audioStatus =! cubo._audioStatus;
				break;
			}
			default: {}
		}
		if(cubo._audioStatus) {
			cubo._audioOffset = 0;
			if(cubo._soundMusic) {
				if(!cubo._soundMusic.isPlaying) {
					cubo._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			cubo._audioOffset = 4;
			if(cubo._soundMusic) {
				cubo._soundMusic.stop();
			}
		}
		cubo.Storage.set('cubo-audio',cubo._audioStatus);
		game.buttonAudio.setFrames(cubo._audioOffset+1, cubo._audioOffset+0, cubo._audioOffset+2);
	},
	_playAudio: function(sound) {
		if(cubo._audioStatus) {
			if(cubo._sound && cubo._sound[sound]) {
				cubo._sound[sound].play();
			}
		}
	}
};

//Creo un avariable para las vidas
//cubo._vidas=parseInt(vidas);
cubo._vidas=vidas;
cubo._totalScore=0;
cubo.ranking=ranking;
cubo._floor=[0,1,0,0,-1,-1,2,-2,-1,2,1,-1,-1,-1,1,1,0,0,-2,-1,3,-2,1,0,-1,2,-4,3,-3,1,1,1,2,-1];


cubo.Boot = function(game){};
cubo.Boot.prototype = {
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

cubo.Preloader = function(game) {};
cubo.Preloader.prototype = {
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
		var pack = cubo.Preloader.resources;
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
cubo.Preloader.resources = {	
	'image': [
		
		['portada', url+'img/portada.png'],
		['storyBg', url+'img/StoryBg.jpg'],			
		['overlay', url+'img/overlay.jpg'],		
		['particle', url+'img/particle.png'],		
		['tubo', url+'img/tubo.jpg'],		
		['bg', url+'img/bg.png'],		
		["ground", url+"img/ground.png"],
		["sky", url+"img/cielo.png"],
		["crate", url+"img/crate.png"],		
		["pinfloi", url+"img/pinfloi.svg"],
		//["titulo", url+"img/Cubo.svg"],
		['hero', url+'img/hero.png'],		     
        ["mad", url+"img/mad_2.png"], 
        ["ground", url+"img/ground.png"], 
        ["splash", url+"img/splash.png"],
        ["trigger", url+"img/trigger.png"],
                   
		
	],
	'spritesheet': [
		['button-start', url+'img/button-start.png', 180, 180],
		['button-continue', url+'img/button-continue.png', 180, 180],
		['button-mainmenu', url+'img/button-mainmenu.png', 180, 180],		
		['button-achievements', url+'img/button-achievements.png', 110, 110],
		['button-pause', url+'img/button-pause.png', 80, 80],
		['button-audio', url+'img/button-sound.png', 80, 80],
		['button-back', url+'img/button-back.png', 80, 80],		
		["txita", url+"img/txita.png", 250,250],		
		["vida", url+"img/vida.png", 80,80],
		["caras", url+"img/caras.png",80,80],
		["caras_die", url+"img/caras_die.png",200,200],  
		["caras_splash", url+"img/caras_splash.png",180,180],   
	
	],
	'audio': [
		['audio-click', [url+'sfx/audio-button.m4a','sfx/audio-button.mp3','sfx/audio-button.ogg']],
		['audio-theme', [url+'sfx/music-bitsnbites-liver.m4a','sfx/music-bitsnbites-liver.mp3','sfx/music-bitsnbites-liver.ogg']],
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

cubo.MainMenu = function(game) {};
cubo.MainMenu.prototype = {
	preload: function(){
		var font = { font: "100px Dosis", fill: "#fff" };
	},
	create: function() {		

		cubo.Storage = this.game.plugins.add(Phaser.Plugin.Storage);
		cubo.Storage.initUnset('cubo-highscore', 0);
		var highscore = cubo.Storage.get('cubo-highscore') || 0;

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

		/*var fontHighscore = { font: "40px Dosis", fill: "#fff" };
		var textHighscore = this.add.text(this.world.width*0.5, 50, 'Highscore: '+highscore, fontHighscore);
		textHighscore.anchor.set(0.5,1);*/

		cubo._manageAudio('init',this);
		// Turn the music off at the start:
		cubo._manageAudio('off',this);

		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);		
		buttonAchievements.y = this.world.height+buttonAchievements.height+20;
		this.add.tween(buttonAchievements).to({y: this.world.height-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		cubo._playAudio('click');
		cubo._manageAudio('switch',this);
	},	
	clickStart: function() {
		cubo._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		cubo._playAudio('click');
		this.game.state.start('Achievements');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Achievements	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

cubo.Achievements = function(game) {};
cubo.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: "32px Vareal Round", fill: "#000" };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(this.world.width-20, game.world.height-20, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.x = this.world.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		cubo._playAudio('click');
		this.game.state.start('MainMenu');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Story		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

cubo.Story = function(game) {};
cubo.Story.prototype = {
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
		
		for(var key in cubo.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#fff";

	        //Si encuentra al usuario
			if(key < 10 && cubo.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ cubo.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, cubo.ranking[key]['puntos'], { font: "40px Baloo Thambi", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 10){//Si no es el usuario y key es menor
				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ cubo.ranking[key]['usuario'], { font: "40px Baloo Thambi", fill: color });
        		this.add.text(game.world.width-200, sep, cubo.ranking[key]['puntos'], { font: "40px Baloo Thambi", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 10 && cubo.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/6, sep, "...", { font: "40px Baloo Thambi", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+"-"+ cubo.ranking[key]['usuario'], { font: "40px Baloo Thambi", fill: colorU });
        		this.add.text(game.world.width-200, sep, cubo.ranking[key]['puntos'], { font: "40px Baloo Thambi", fill: colorU });
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
		cubo._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function(){
			this.game.state.start('Game');
		}, this);
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			History		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

cubo.History = function(game) {};
cubo.History.prototype = {
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
		cubo._playAudio('click');
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

cubo.Game = function(game) {};
cubo.Game.prototype = {
    create: function() {

        this._score = cubo._totalScore;
        this._time = 10000;
        this.gamePaused = false;
        this.runOnce = false;        
        this.first=true;        
        this.min=0;
        this.max=0;        
        this.tembleque=false;
        this.intentos=2;
        
        // size of each square, in pixels
        this.squareSize = 80;
        // square where the hero will start to walk
        this.startingSquare = 2;  

        this.limMax=game.height+150
        this.LimMin=game.height-150;    

        // this is the time required to make a move, in milliseconds
        this.moveTime = 250;
        //velocidad a la suben y bajasn los enemigos 1000:rapido, 2000:lento
        this.velocity = 2000;
        //altura
        this.altura=game.height / 3 * 2;

        this.posAnt=this.altura;

        //Cambio de altura
        this.nextY=game.height / 3 * 2-this.squareSize;        

        //Bg
        this.bg=this.add.sprite(0,0,'bg');                
        this.bg.height = 3800;
        //this.bg.width = 300;
        this.bg.anchor.set(0,1);
        this.bg.inputEnabled = true;
        this.bg.input.priorityID = 0;


        this.grupo = game.add.group();
        this.canDrop = true;       
        
        this.grupo.add(this.bg);
        

        //Vidas
        this.vidas=this.add.group();

        for(var a=1;a<=cubo._vidas;a++){
            var vida = game.add.sprite(45*a,20,'vida');
            vida.scale.setTo(0.5,0.5);
            vida.frame=0;
            this.vidas.add(vida);

        }

        // adding a group which will contain all terrain squares
        this.terrainGroup = this.add.group();
          
        // adding a group which will contain all enemies
        this.enemyGroup = this.add.group();

        // filling the field with squares to create the terrain
          for(var i = 0; i < game.width / this.squareSize + 2; i++){
               
               // adding a terrain square
               var square = this.add.sprite(i * this.squareSize+40, this.altura, "ground");
               
               // settings its anchor on the center
               square.anchor.set(0.5);
               
               // giving the square a tint color
               //square.tint = squareColors[i % 2];
               
               // finally adding the square to the group
               this.terrainGroup.add(square);
          }


           
        this.area = game.add.sprite(this.startingSquare * this.squareSize-40,0, "trigger");
        this.area.anchor.set(0,0.5);
        this.area.scale.setTo(1,25);
        this.area.alpha = 0 ;


        // adding the hero
          this.hero = game.add.sprite(this.startingSquare * this.squareSize-40, game.height / 3 * 2 - (this.squareSize-3), "hero");
          
          // setting the anchor on its center
          this.hero.anchor.set(0.5);

          this.cara = this.add.sprite(this.startingSquare * this.squareSize-40, game.height / 3 * 2 - (this.squareSize-3), 'caras',7);
          this.cara.anchor.set(0.5);
          this.cara.scale.setTo(1.3);         
          
          // flag to see if the hero can move
          this.hero.canMove = true;
          this.cara.canMove = true;
          
          // enabling arcade physics on hero
          this.physics.enable(this.hero, Phaser.Physics.ARCADE);
          //Reduzco un poco el tamaño del body
          this.hero.body.setSize(60, 60);
          this.hero.body.offset.x = 10;
          this.hero.body.offset.y = 10;

          this.physics.enable(this.cara, Phaser.Physics.ARCADE);
          this.physics.enable(this.area, Phaser.Physics.ARCADE);
          this.physics.enable(this.terrainGroup, Phaser.Physics.ARCADE);
          
          // we will move the hero manually
          this.hero.body.moves = false;
          this.cara.body.moves = false;  

          
        // Inputs
        //Teclado
        
        //spaceKey.onDown.add(this.paraBloque, this);

        // input listener waiting for mouse or touch input, then calling moveSquare method
        var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        spaceKey.onDown.add(this.moveHero, this);

        game.input.onDown.add(this.moveHero, this);
        

        this.initUI();

    },
    initUI: function() {

        /*this.buttonPause = this.add.button(this.world.width-20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
        this.buttonPause.anchor.set(1,0);
        this.buttonPause.input.priorityID=1;
        this.buttonPause.y = -this.buttonPause.height-20;
        this.add.tween(this.buttonPause).to({y: 20}, 1000, Phaser.Easing.Exponential.Out, true);*/

        //Fuentes
        var fontScoreWhite =  { font: "100px Baloo Thambi", fill: "#fff" };
        var fontScore = { font: "100px Baloo", fill: "#fff" };
        var fontTitle = { font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 };

        //Texto
        this.textScore = game.add.text(100,100,'', fontScore);        
        this.textScore.text=this._score;        

        this.text = game.add.text(50,75,'', fontScore);
        
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

        this.buttonAudio.setFrames(cubo._audioOffset+1, cubo._audioOffset+0, cubo._audioOffset+2);

        this.screenDiedGroup = this.add.group();
        this.screenDiedSplash = this.add.sprite(game.width/2 , game.height/2 , 'splash');
        this.screenDiedSplash.width=game.width;
        this.screenDiedSplash.height=game.height;
        this.screenDiedSplash.anchor.set(0.5);
        this.screenDiedSplash.scale.setTo(0,0);

        this.screenDiedCaras = this.add.sprite(game.width/2, game.height/2, 'caras_splash',cubo._vidas);
        this.screenDiedCaras.width=game.width/3;
        this.screenDiedCaras.height=game.height/3;        
        this.screenDiedCaras.anchor.set(0.5);
        this.screenDiedCaras.scale.setTo(0,0);
        
        /*this.screenDiedText = this.add.text(this.world.width*0.5, 100, 'Ups..', fontScore);
        this.screenDiedText.anchor.set(0.5,0);        
        
        
        this.screenDiedScore = this.add.text(this.world.width*0.5, 300, 'Bloques: '+this._score, fontScoreWhite);
        this.screenDiedScore.anchor.set(0.5,0.5);
        this.screenDiedMaxScore = this.add.text(this.world.width*0.5, 450, '', fontScoreWhite);
        this.screenDiedMaxScore.anchor.set(0.5,0.5);
        this.screenDiedGroup.add(this.screenDiedSplash);
        this.screenDiedGroup.add(this.screenDiedCaras);
        this.screenDiedGroup.add(this.screenDiedText);       
        this.screenDiedGroup.add(this.screenDiedScore);
        this.screenDiedGroup.add(this.screenDiedMaxScore);*/
        this.screenDiedGroup.visible = false;

        this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
        this.screenGameoverBg.width=game.world.width;
        this.screenGameoverBg.height=game.world.height;
        this.screenGameoverText = this.add.text(this.world.width/2, 75, 'Fin', fontScore);
        this.screenGameoverText.anchor.set(0.5);        
        this.screenGameoverContinue = this.add.button(this.world.width/2, this.world.height-75, 'button-continue', this.tarea, this, 1, 0, 2);
        this.screenGameoverContinue.anchor.set(0.5,1);        
        this.screenGameoverGroup.add(this.screenGameoverBg);
        this.screenGameoverGroup.add(this.screenGameoverText);        
        this.screenGameoverGroup.add(this.screenGameoverContinue);        
        this.screenGameoverGroup.visible = false;

        //this.stateStatus='died';

        this.addEnemy(); 
    },   
    
     // this method will be called each  time the player tries to move the square
    moveHero: function(){      

     
          // can the hero move?
          if(this.hero.canMove){

                //Calculo cual es la posicion del siguiente terreno
                //envio a next, el terreno que esta en el area, justo en frente del heroe                
                game.physics.arcade.overlap(this.area, this.terrainGroup, this.next, null, this); 
          
                // the hero is about to be moved so we aren't considering more inputs
                this.hero.canMove = false;               
                this.cara.canMove = false;
               
                // according to current square angle, we have to change its position and registration point
                // in order to make it rotate along the required pivot point
                // this part needs to be optimized but at the moment it works
                switch(this.hero.angle){
                    case 0:
                         this.hero.x += this.squareSize / 2;
                         this.hero.y += this.squareSize / 2;
                         this.hero.pivot.x = this.squareSize / 2;
                         this.hero.pivot.y = this.squareSize / 2;
                         break;
                    case 90:
                         this.hero.x += this.squareSize;
                         this.hero.pivot.x = this.squareSize / 2;
                         this.hero.pivot.y = -this.squareSize / 2;
                         break;
                    case -180:
                         this.hero.x += this.squareSize;
                         this.hero.pivot.x = -this.squareSize / 2;
                         this.hero.pivot.y = -this.squareSize / 2;
                         break;
                    case -90:
                         this.hero.x += this.squareSize;
                         this.hero.pivot.x = -this.squareSize / 2;
                         this.hero.pivot.y = this.squareSize / 2;                         
                }
               
                // tween to scroll the terrain to the left by squareSize pixels
                var scrollTween = game.add.tween(this.terrainGroup).to({
                    x: this.terrainGroup.x - this.squareSize 
                },this.moveTime, Phaser.Easing.Linear.None, true);
               
                // tween to scroll the enemies to the left by squareSize pixels
                var enemyTween = game.add.tween(this.enemyGroup).to({
                    x: this.terrainGroup.x - this.squareSize 
                }, this.moveTime, Phaser.Easing.Linear.None, true);
               
                // tween to rotate and move the hero
                var moveTween = game.add.tween(this.hero).to({
                    angle: this.hero.angle + 90, 
                    x: this.hero.x - this.squareSize                   
                }, this.moveTime, Phaser.Easing.Linear.None, true);              

                
                //Elijo la animacion de la cara, si el hacia arriba o hacia abajo
                if(this.nextY<=this.hero.y){
                    salto= Phaser.Easing.Back.Out;
                }else{
                    salto= Phaser.Easing.Back.In;
                }


                //Animo el salto de la cara
                var jumpDownHead = game.add.tween(this.hero).to({                     
                    y: (this.nextY-37)
                }, this.moveTime, salto, true);

                var jumpDownCara = game.add.tween(this.cara).to({ 
                    y: (this.nextY-77)
                }, this.moveTime,salto, true);

                // Animo la rotacion de la cara
                var caraTween = game.add.tween(this.cara).to({
                    angle: this.cara.angle + 30,                    
               }, this.moveTime, Phaser.Easing.Circular.Out, true, 0,0, true);


               
               // once the tween has been completed...
               caraTween.onComplete.add(function(){                    
               
                    // the hero can move again
                    this.hero.canMove = true;                    
                    this.cara.canMove = true;
                    
                    // if hero's angle is zero, that is if we rotated by 360 degrees...
                    if(this.hero.angle == 0){
                    
                         // we restore hero original pivot point and position
                         this.hero.pivot.x = 0;
                         this.hero.pivot.y = 0;
                         this.hero.x += this.squareSize / 2;
                         this.hero.y -= this.squareSize / 2;
                    }
                    
                    // we order all terrain squares according to their x position
                    this.terrainGroup.sort("x", Phaser.Group.SORT_ASCENDING);
                    
                    // getting the leftmost enemy
                    this.enemyGroup.sort("x", Phaser.Group.SORT_ASCENDING);
                    
                    // if the leftmost enemy left the stage, just like the leftmost tile did...
                    if(this.enemyGroup.length > 0 && this.enemyGroup.getChildAt(0).x <0){
                    
                         // ... then destroy it                         
                         this.enemyGroup.getChildAt(0).destroy(); 
                                                 
                    }
                     
                    var a =this; 

                    //Si el heroe no tiene enimgos a la vista
                      this.enemyGroup.forEach(function(item) {
                        if(item.x < (a.terrainGroup.getChildAt(0).x+500)){                       
                         
                            a.cara.frame = 7;  
                        }

                     });

                    
                    //Si el heroe está ante un enemigo...              
                    //Si el heroe ha superado el enemigo...                    
                    this.enemyGroup.forEach(function(item) {
                        if(item.x < (a.terrainGroup.getChildAt(0).x+340) && item.x >(a.terrainGroup.getChildAt(0).x+260)){                     
                                                 
                            a.cara.frame = 5; 
                        }

                        if(item.x < (a.terrainGroup.getChildAt(0).x+180)&& item.x >(a.terrainGroup.getChildAt(0).x+120)){                     
                         
                            a.addPoints();                           
                        }

                     });                   

                    this.addTerrain();
                    
                                    
                                     
                    // since this is a new tile, let's see if we should add an enemy
                    if(game.rnd.integerInRange(0, 9) > 6){
                    
                         // let's add an enemy
                         this.addEnemy();
                    }              
               }, this);
          }
    },  
    addTerrain:function(){

        // we don't want to destroy assets to create new ones, we prefer to move the leftmost square
        // which is not visible anymore to the right.        
        this.terrainGroup.getChildAt(0).x += this.terrainGroup.length * this.squareSize;

        //Aplico la nueva posición en Y
        let newPos=80*this.nuevo();
        
        let def = this.posAnt+newPos;        
        this.posAnt+=newPos;
        this.terrainGroup.getChildAt(0).y = def;  

    } ,
    // function to add an enemy
    addEnemy: function(){
          
          // just a way to get the rightmost terrain tule
          this.terrainGroup.sort("x", Phaser.Group.SORT_DESCENDING);

          
          //coloco el nuevo enemigo al principio o al final
          if( Math.round(Math.random())){            
            
            var posY=20;
            var posTarget=this.terrainGroup.getChildAt(0).y-this.squareSize;            

          }else{
            
            var posY=this.terrainGroup.getChildAt(0).y-this.squareSize;
            var posTarget=20;
            
          }

          var enemy = game.add.sprite(this.terrainGroup.getChildAt(0).x, posY, "mad");

          //giving the enemy a yoyo tween to move it at a random speed
            game.add.tween(enemy).to({
                 y: posTarget,
            }, this.velocity + game.rnd.integerInRange(0, 250), Phaser.Easing.Linear.None, true, 0,-1, true);
          
          // adding the enemy over the rightmost tile
          
          enemy.anchor.set(0.5);
          //enemy.tint = 0xff0000;
          
          // enabling arcade physics on enemy
          game.physics.enable(enemy, Phaser.Physics.ARCADE);

          // we will move the enemy manually
          enemy.body.moves = false;

                    
          

          enemy.angle=0;

          game.add.tween(enemy).to({ angle: -  360 }, 500, 'Linear', true).loop(true);

          enemy.anchor.setTo(0.5);          
           
          this.enemyGroup.add(enemy);


          
    },       
    update: function() {

        // looking for collision between the hero and enemies
         game.physics.arcade.collide(this.hero, this.enemyGroup, this.tocado, null, this);            
        

        //Compruebo el estado del juego para mostrar una pnatalla u otras
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
                 break;
            }
            case 'restart':{
                
                this.stateRestart();
                 break;
            }
            default: {
            }
        }
    },
    next: function(area , nextTerrain){
        this.nextY=nextTerrain.y;        

        //Compruebo que no se pase de los límites
        /*if(this.terrainGroup.getChildAt(0).y>this.limMax){
            factor=1;
        }else if(this.terrainGroup.getChildAt(0).y<this.limMin){
            factor=-1;
        }*/       
        
    },

    nuevo:function(){

        //Tomo el primer elemento del array con shift(), y lo coloco al final con push()
        let el=cubo._floor.shift();
        //this.nextY=el;
        cubo._floor.push(el); 
           

        return el;

    },
    tocado: function() {
       
        

        this.hero.body.enable = false;
        this.hero.visible = false;
        this.cara.visible = false;

        this.vidas.children[this.vidas.children.length - 1].frame = 1;        
        cubo._vidas--;        
        this.stateStatus = 'died';
                    
    },
    render: function(){
        //game.debug.body(this.hero);
        //this.terrainGroup.forEach(this.renderGroup, this); 
        //game.debug.spriteInfo(this.terrainGroup.getChildAt(4), 250, 32,'black');



      
    },
    renderGroup:function(member) {   
             game.debug.body(member);
        },  
    managePause: function() {
        this.gamePaused =! this.gamePaused;
        cubo._playAudio('click');
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
        

    },
    statePaused: function() {
        this.screenPausedGroup.visible = true;      
        //this.crateTween.pause();
        game.tweens.pauseAll();       
        

    },
    stateDied: function() {  


        this.screenDiedGroup.visible = true;
        //Muestro la pantalla de died
        /*var scaleSplash = game.add.tween(this.screenDiedSplash).to({            
            y: this.screenDiedSplash.y + 50 
        }, 10000, Phaser.Easing.Linear.None, true);*/

        //Muestro la plasta
        var showSplash=game.add.tween(this.screenDiedSplash.scale).to({  x:1.2, y: 1.2}, 100, Phaser.Easing.Linear.None, true);
        showSplash.onComplete.addOnce(function(){
            //Escalo en y pra que parezca que se desparrama
            game.add.tween(this.screenDiedSplash.scale).to({   y: 2}, 10000, Phaser.Easing.Linear.None, true);
            game.add.tween(this.screenDiedSplash).to({   y: (game.height/2+50)}, 4000, Phaser.Easing.Linear.None, true);
                
        }, this);

        //Muestro el careto
        var showCaraSplash=game.add.tween(this.screenDiedCaras.scale).to({  x:1.3, y: 1.8}, 100, Phaser.Easing.Linear.None, true);

        var a = this;
        showCaraSplash.onComplete.addOnce(function(){
            //Escalo en y pra que parezca que se desparrama
            game.add.tween(this.screenDiedCaras.scale).to({   y: 2}, 8000, Phaser.Easing.Linear.None, true);
            let resbalaCara=game.add.tween(this.screenDiedCaras).to({   y: (game.height/2+50)}, 4000, Phaser.Easing.Linear.None, true);

            
            resbalaCara.onComplete.addOnce(function(){

                if(cubo._vidas==0){
                    a.stateGameover();            
                    

                }else{  

                    
                    a.restart();
                  
                }
            });
            
                
        }, this);


            

       
        //game.tweens.pauseAll();

        /*this.screenDiedScore.setText('Bloques: '+this._score);
        this.screenDiedMaxScore.setText('Máximo: '+cubo._totalScore);
        cubo.Storage.setHighscore('cubo-highscore', this._score);*/


        //this.screenDiedScore.setText('Puntos: '+this._score);
        //this.diedScoreTween();
        
        //this.buttonDummy.exists=false;
            
    },
    addPoints: function() {
        this.cara.frame = 10;
        this._score += 10;
        this.textScore.setText(this._score);
          
        cubo._totalScore += 10;     
    },
    stateGameover: function() { 
               
        game.tweens.pauseAll(); 
        this.screenDiedGroup.visible = true;        
        this.screenGameoverGroup.visible = true;        
        this.muestraRanking();
        //this.currentTimer.stop();
        
        //this.gameoverScoreTween();
        cubo.Storage.setHighscore('cubo-highscore',this._score);
                
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
        cubo._playAudio('click');
        cubo._manageAudio('switch',this);
    },
    restart: function() {        
        cubo._playAudio('click');
        if(this.screenGameoverGroup.visible==true){
            this.screenGameoverGroup.visible = false;
        }
        
        this.gamePaused = false;
        this.runOnce = false;       
        this.stateStatus = 'playing';
        this.state.restart(true);
    },
    stateBack: function() {
        cubo._playAudio('click');
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
        a.puntos = cubo._totalScore;
         
        //Ordeno por puntos
        for (var i in cubo.ranking) {
            let cont=0;
            //Si existe el usuariuo y ha obtenido mejor puntuacion, la cambio
            if(cubo.ranking[i]['usuario'] == a['usuario'] && cubo.ranking[i]['puntos'] < a['puntos']){
                 cubo.ranking[i]['puntos']=a['puntos'];              
                break;

            //Si existe pero ha obtenido menor puntiuación, no hago nada            
            }if(cubo.ranking[i]['usuario'] == a['usuario'] && cubo.ranking[i]['puntos'] >= a['puntos']){                          
                break;              
            }else {//Si no existe lo añado
                cubo.ranking.push(a);
                break;
            }
        }

        //Ordeno el ranking por puntos
        cubo.ranking.sort(function(a, b) {
            return parseFloat(b['puntos']) - parseFloat(a['puntos']);
        });       
        
        
        //Muestro los puntos del usuario
        for(var key in cubo.ranking){
            let encontrado=false;
            let color = "#1e79ff";
            //var color = "#1e79ff";
            //Color usuer
            let colorU = "#fff";

            //Si encuentra al usuario
            if(key < 3 && cubo.ranking[key]['usuario'] == nombre){

                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ cubo.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
                this.add.text(game.world.width-200, sep, cubo.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
                encontrado = true;
                sep+=50;

            }else if(key < 3){//Si no es el usuario y key es menor
                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ cubo.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
                this.add.text(game.world.width-200, sep, cubo.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
                sep+=50;

                //Si es el usuario y key es mayor q 8
            }else if(key > 3 && cubo.ranking[key]['usuario'] == nombre && encontrado == false){

                this.add.text(game.world.width/6, sep, "...", { font: "40px Varela Round", fill: colorU });
                sep+=50;
                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ cubo.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
                this.add.text(game.world.width-200, sep, cubo.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
                break;//Termino la búsqueda
            }                  
        }//Fin del for para mostrar el ranking

    },
    tarea: function() {
        game.destroy();
        document.getElementById("next").click();
    }
};


///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

// (function(){
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
		'Boot': cubo.Boot,
		'Preloader': cubo.Preloader,
		'MainMenu': cubo.MainMenu,
		'Achievements': cubo.Achievements,
		'Story': cubo.Story,
		'History': cubo.History,
		'Game': cubo.Game
	};

	
	for(var state in states)
		game.state.add(state, states[state]);
	
	game.state.start('Boot');
// })();

