var vidas=1;
var nombre="memcolor";
var ranking=[
	{'usuario':'bunny', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= "../../assets/memcolor/";


///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var memColor = {
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				memColor.Storage.initUnset('memColor-audio', true);
				memColor._audioStatus = memColor.Storage.get('memColor-audio');
				memColor._soundClick = game.add.audio('audio-click');
				memColor._sound = [];
				memColor._sound['click'] = game.add.audio('audio-click');
				memColor._sound['acierto'] = game.add.audio('audio-acierto');
				memColor._sound['error'] = game.add.audio('audio-error');
				if(!memColor._soundMusic) {
					memColor._soundMusic = game.add.audio('audio-theme',1,true);
					memColor._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				memColor._audioStatus = true;
				break;
			}
			case 'off': {
				memColor._audioStatus = false;
				break;
			}
			case 'switch': {
				memColor._audioStatus =! memColor._audioStatus;
				break;
			}
			default: {}
		}
		if(memColor._audioStatus) {
			memColor._audioOffset = 0;
			if(memColor._soundMusic) {
				if(!memColor._soundMusic.isPlaying) {
					//memColor._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			memColor._audioOffset = 4;
			if(memColor._soundMusic) {
				//memColor._soundMusic.stop();
			}
		}
		memColor.Storage.set('memColor-audio',memColor._audioStatus);
		game.buttonAudio.setFrames(memColor._audioOffset+1, memColor._audioOffset+0, memColor._audioOffset+2);

	},
	_playAudio: function(sound) {
		if(memColor._audioStatus) {
			if(memColor._sound && memColor._sound[sound]) {
				memColor._sound[sound].play();
			}
		}
	}
};

//Variables super globales
memColor._vidas=parseInt(vidas);
memColor._totalScore=0;
memColor.ranking=ranking;

memColor.Boot = function(game){};
memColor.Boot.prototype = {
	preload: function(){
		
		this.stage.backgroundColor = '#ffffff';
		this.load.image('cielo', url+'img/cielo.png');		
		this.load.image('loading-progress', url+'img/loading-progress2.png');
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

memColor.Preloader = function(game) {};
memColor.Preloader.prototype = {
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
		var pack = memColor.Preloader.resources;
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
memColor.Preloader.resources = {
	'image': [
		['background', url+'img/background.png'],
		['title', url+'img/title.png'],					
		['particle', url+'img/particle.png'],
		["bg", url+"img/cielo.png"],		
		["guino", url+"img/Guino.png"],		
		["cielo", url+"img/cielo.png"],
		["brain", url+"img/brain.png"],
       	["acierto", url+"img/acierto.png"],
       	["triste", url+"img/triste.png"],
       	["lo", url+"img/lo.png"],
		['pinfloi', 'juegos/pompas/img/pinfloi.svg']

	],
	'spritesheet': [
		['button-start', url+'img/button-start.png', 180, 180],
		['button-continue', url+'img/button-continue.png', 180, 180],		
		['button-pause', url+'img/button-pause.png', 80, 80],
		['button-audio', url+'img/button-sound.png', 80, 80],		
		["circles", url+"img/circles.png", 40, 40],
		["bombilla", url+"img/bombilla.png", 250, 250],
		["timer", url+"img/timer.png", 16, 16]
		
	],
	'audio': [
		['audio-click', [url+'sfx/audio-button.m4a',url+'sfx/audio-button.mp3',url+'sfx/audio-button.ogg']],
		['audio-theme', [url+'sfx/music-bitsnbites-liver.m4a',url+'sfx/music-bitsnbites-liver.mp3',url+'sfx/music-bitsnbites-liver.ogg']],
		['audio-acierto', [url+'sfx/acierto.wav']],
		['audio-error', [url+'sfx/error.wav']],
		['audio-completo', [url+'sfx/completo.wav']],
	]
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Main Menú	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

memColor.MainMenu = function(game) {};
memColor.MainMenu.prototype = {
	
	create: function() {
		
		
		this.bg=this.add.sprite(0, 0, 'cielo');
		this.bg.width=game.world.width;
		this.bg.height=game.world.height;

		var cerebro = this.add.sprite(this.world.width*0.5, this.world.height-350, 'brain');
		cerebro.anchor.set(0.5);
		cerebro.scale.setTo(0.6);
		
		memColor.Storage = this.game.plugins.add(Phaser.Plugin.Storage);

		memColor.Storage.initUnset('memColor-highscore', 0);
		var highscore = memColor.Storage.get('memColor-highscore') || 0;

		//var buttonEnclave = this.add.button(20, 20, 'logo-enclave', this.clickEnclave, this);
		//var buttonBeer = this.add.button(25, 130, 'button-beer', this.clickBeer, this);
		var fontTitle = { font: "100px Amatic SC", fill: "#000", stroke: "#FFF", strokeThickness: 4 };

		this.title = this.add.text(this.world.width*0.5, 75, 'Circles', fontTitle);
        this.title.anchor.set(0.5,0);
        this.title.scale.setTo(2);

        var buttonPinfloi = this.add.button(20, 20, 'pinfloi', this.clickPinfloi, this);
		buttonPinfloi.scale.setTo(0.5,0.5);

		var buttonStart = this.add.button(this.world.width-20, this.world.height-20, 'button-start', this.clickStart, this, 1, 0, 2);
		buttonStart.anchor.set(1);
		buttonStart.scale.setTo(0.7,0.7);
		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);
		this.buttonAudio.scale.setTo(1,1);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);	


		memColor._manageAudio('init',this);
		// Turn the music off at the start:
		memColor._manageAudio('on',this);	
		
		
		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		memColor._playAudio('click');
		memColor._manageAudio('switch',this);
	},
	clickEnclave: function() {
		memColor._playAudio('click');
		window.top.location.href = 'http://enclavegames.com/';
	},
	clickBeer: function() {
		memColor._playAudio('click');
		window.top.location.href = 'https://www.paypal.me/end3r';
	},
	clickStart: function() {
		memColor._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			//this.game.state.start('Story');Game
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		memColor._playAudio('click');
		this.game.state.start('Achievements');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Achievements	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

memColor.Achievements = function(game) {};
memColor.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: "32px Arial", fill: "#000" };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(this.world.width-40, game.world.height-40, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.scale.setTo(1.5);
		buttonBack.x = this.world.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		memColor._playAudio('click');
		this.game.state.start('MainMenu');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Story		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

memColor.Story = function(game) {};
memColor.Story.prototype = {
	create: function(){

		//Bg
		var bg=this.add.sprite(0,0,'bg');
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
		buttonContinue.anchor.set(1,1);
		buttonContinue.scale.setTo(0.7,0.7);
		buttonContinue.x = this.world.width+buttonContinue.width+20;
		
		this.add.tween(buttonContinue).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		//Añado el ranking
		var sep=150;//Posicion vertical de la primera linea
		
		for(var key in memColor.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#fff";

	        //Si encuentra al usuario
			if(key < 10 && memColor.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ memColor.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, memColor.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 10){//Si no es el usuario y key es menor
				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ memColor.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-200, sep, memColor.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 10 && memColor.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/6, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+"-"+ memColor.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, memColor.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }
        
		this.camera.flash(0x000000, 500, false);
	},
	clickContinue: function() {
		memColor._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function(){
			this.game.state.start('Game');
		}, this);
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Game		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


// size of each tile, in pixels
var gridSize =80;

// colors to be used in game
var colorsInGame=[0xf6e58d,0xffbe76, 0xff7979,0xbadc58
,0x7ed6df, 0xe056fd, 0x686de0, 0x30336b];

// how many circles in game?
var circlesInGame = 2;
var errores=0;
var vidas=6;
var puntos=0;





memColor.Game = function(game){}

memColor.Game.prototype = {
    
     create: function(){

          this.gamePaused = false;
          this.runOnce = false;
          this.shadow;
          this._score=0;
          this.velocidad=2;//1=lento, 3=medio, 5=superRapido
          this.nuevosErrores=0;

          
          // set background color to white                                                                                     
          game.stage.backgroundColor = "#ffffff";
          
          // adding a group containing all circles
          this.circleGroup = game.add.group();
          
          // possibleColors will contain the same items as colorsInGame array,
          // just repeated (circlesInGame - 1) times.
          // we want to have more circles with the same color, but not ALL circle with the same color
           this.possibleColors = [];
          for(var i = 0; i < colorsInGame.length; i++){
               for(var j = 0; j < circlesInGame - 1; j++){
                    this.possibleColors.push(colorsInGame[i])     
               } 
          }
          
          // boardWidth and boardHeight will determine the width and height of the game board,
          // according to game size and grid size.
          // we subtract 2 from both boardWidth and boardHeight because we don't want
          // tiles to be at the very edge of the canvas
          this.boardWidth = game.width / gridSize-1;
          this.boardHeight = game.height / gridSize-1;
          
          // creation of an array with all possible grid positions
          this.positionsArray = [];
          for(var i = 0; i < (this.boardWidth) * (this.boardHeight); i++){
               this.positionsArray.push(i);     
          }
         
          
          if(puntos>100){
               circlesInGame=6;
          }else if(puntos>60){
               circlesInGame=5;
          }else if(puntos>50){
               circlesInGame=4;
          }else if(puntos>30){
               circlesInGame=3;
          }

          //circlesInGame=this.positionsArray.length;
          
           

          // adding a group containing all timers
          this.timerGroup = game.add.group();
                    
          // adding 10 circle timers to timerGroup group
          for(var i = 0; i < 10; i++){
               var timeCircle = game.add.sprite(i * 30, game.height - 40, "timer");
               timeCircle.scale.setTo(2,2);
               this.timerGroup.add(timeCircle);
          }
          
          // horizontal centering timerGroup
          this.timerGroup.x = (game.width - this.timerGroup.width) / 2;
          
          // pickedColors is the array which will contain all colors actually used in this game
          this.pickedColors = [];
          this.initUI();
          this.creaCirculos();
          
        
          
          // after two seconds, let's cover the screen
          game.time.events.add(Phaser.Timer.SECOND * 2, this.fadeOut, this);
          
            
     },
     update:function(){
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
     creaCirculos(){
            // repeating this loop circlesInGame times
          for(var i = 0; i < circlesInGame; i++){
               
               // choosing a random position for the circle.
               // this position won't be available anymore as we remove it from positionsArray 
               var randomPosition = Phaser.ArrayUtils.removeRandomItem(this.positionsArray);              
               
               // determining circle x and y position in pixels
               var posX = (0.5+randomPosition % (this.boardWidth)) * gridSize;
               var posY = (0.5+Math.floor(randomPosition / this.boardWidth)) * gridSize;
               
               // creating the circle as a button which calls circleSelected function
               var circle = game.add.button(posX, posY, "circles", this.circleSelected, this);               
               circle.scale.setTo(2.2,2.2);
               
               
               // adding the circle to circleGroup group 
               this.circleGroup.add(circle);
               
               // tinting the circle with a possible color and removing the color
               // from the array of possible colors.
               // we also save its tint color in a property called tintColor
               circle.tintColor = Phaser.ArrayUtils.removeRandomItem(this.possibleColors)
               circle.tint = circle.tintColor;

               
               // adding the tint color to pickedColors array, if not already in the array
               if(this.pickedColors.indexOf(circle.tint) == -1){
                    this.pickedColors.push(circle.tint);     
               }
               
               // choosima a random direction: 1 = left, 2 = up, 3 = right, 4 = down
               var randomDirection = game.rnd.integerInRange(1, 4);
               
               // a temporary object which will be used to handle circle tween
               var tweenObject = {};
               
               // according to random direction...
               switch(randomDirection){
                    case 1:
                         // left: circle is placed just outside left border and the tween
                         // will bring it to its initial x position
                         circle.x = - gridSize;
                         tweenObject.x = posX;
                         break;
                    case 2:
                         // up: circle is placed just outside upper border and the tween
                         // will bring it to its initial y position
                         circle.y = - gridSize;
                         tweenObject.y = posY;
                         break;
                    case 3:
                         // left: circle is placed just outside right border and the tween
                         // will bring it to its initial x position
                         circle.x = game.width + gridSize;
                         tweenObject.x = posX;
                         break;
                    case 4:
                         // left: circle is placed just outside bottom border and the tween
                         // will bring it to its initial y position
                         circle.y = game.height + gridSize;
                         tweenObject.y = posY;
                         break;
               }
               
               // adding the tween to circle. This will create the "enter in the stage" effect
               game.add.tween(circle).to(tweenObject, 500, Phaser.Easing.Cubic.Out, true);

          }
     },
     
     // this function will cover the screen with a random color
     fadeOut: function(){

           // this variable will count the ticks
          this.timePassed = 1;

           // setting all time circles to frame zero
          this.timerGroup.forEach(function(item){
               item.frame = 0;
          }, this)
     
          // filling the entire canvas with a tile sprite
          this.cover = Phaser.ArrayUtils.getRandomItem(this.pickedColors);          
          
          
               // bring to top circleGroup as it was hidden by the cover
               //game.world.bringToTop(this.circleGroup);
                game.stage.backgroundColor = this.cover;
               
               // for each circle in circleGroup group...
               this.circleGroup.forEach(function(item){
               
                    // tinting it white
                    item.tint = 0xffffff;                    
                    // setting it to frame 1 to show just a white ring
                    item.frame = 1;
                   
               })

                // startig the countdown
               this.countDown = game.time.events.repeat(Phaser.Timer.SECOND / this.velocidad, 11, this.tick, this); 
               
     },
     
     // function to be executed by countDown timer event
     tick: function(e){
     
          // if timePassed is less or equal to 10, that is if there still is time left...
          if(this.timePassed <= 10){
          
               // turn off a timer circle
               this.timerGroup.getChildAt(10 - this.timePassed).frame = 1;
               
               // increase time passed
               this.timePassed ++;
          }
          
          // else, it's game over
          else{      

               this.stateStatus = 'gameover';
          }          
     },
     
     // Esta función es llamada cada vez que un circulo es seleccionado
     // b es el círculo
     circleSelected: function(b){
     
          // Si el fondo ya está cuvierto
          if(this.cover != undefined ){
               
               // si el curculo es del mismo color que el fondo
               // (uso la propiedad  tintColor, porque el círculo ahora es  blanco)
               if(b.tintColor == this.cover){
                    // lo destruyo
                    memColor._playAudio('acierto');                    
                    this.addPoints(b);          
                   
               }
               else{
                    // si no acierto, muestro el acual color del círculo
                    //this.nuevosErrores, son los fallos de este intento
                    memColor._playAudio('error');
                    b.tint = b.tintColor
                    b.frame = 0;                   
                    errores=errores+1;
                    vidas--;
                    this.nuevosErrores=1;
                    this.screenPausedText.setText('Mmm....');
                    this.screenGameoverErrores.setText('Errores: '+errores);                    
                    this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);
                    
                    if(vidas==0){//Si ya  no me quedan vidas
                         this.manageErrors();
                    }
                    // placing new circles
                    //game.time.events.add(1000, function() {  this.manageHit();}, this);
                    
               }
          }
     },

     //Cunado he acertado
     //b es el círculo
     addPoints: function(b) {
          if(this.nuevosErrores>0){//Si no ha acertado a la primera
               puntos += 5;
               var pointsAdded = this.add.text(b.x, b.y, '+5',
               { font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
          pointsAdded.anchor.set(0.5, 0.5);
          }else{//Si acierta a la primera
               puntos += 10;
               var pointsAdded = this.add.text(b.x, b.y, '+10',
               { font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
          pointsAdded.anchor.set(0.5, 0.5);
          }
          
           b.destroy();
          this.screenPausedScore.setText('Puntos: '+puntos);
          this.screenPausedErrores.setText('Errores: '+errores);
          //this.screenGameoverScore.setText('Score: '+puntos);
          var randX = this.rnd.integerInRange(200,this.world.width-200);
          var randY = this.rnd.integerInRange(200,this.world.height-200);
          
          this.add.tween(pointsAdded).to({ alpha: 0, y: randY-50 }, 1000, Phaser.Easing.Linear.None, true);

          // checking if the level is completed, that is there aren't circles with
          // cover color still on the stage
          var levelCompleted = true;
          this.circleGroup.forEach(function(item){
               if(item.tintColor == this.cover){
                    levelCompleted = false;
               }
          }, this);

          // if level is completed, advance to next level
          if(levelCompleted){
                         
               // stop the timer
               game.time.events.remove(this.countDown);
                         
               // turning the cover invisible
               //this.cover.alpha = 0;
                         
               // placing new circles
               game.time.events.add(2000, function() {  this.manageHit();}, this);        
          }
          
          
     },
     initUI: function() {
          

          var fontScore = { font: "40px Amatic SC", fill: "#000" };
          var fontScoreWhite =  { font: "40px Amatic SC",fill: "#FFF",fontWeight: 'bold' };
          
         
          var fontTitle = { font: "80px Amatic SC", fill: "#000", stroke: "#FFF", strokeThickness: 2 };
          this.screenPausedGroup = this.add.group();
          this.screenPausedBg = this.add.sprite(0, 0, 'cielo');
          this.screenPausedBg.width=game.world.width;
          this.screenPausedBg.height=game.world.height;
          this.screenPausedText = this.add.text(this.world.width*0.5, 100, 'Muy bien', fontTitle);
          this.screenPausedText.anchor.set(0.5,0);
          this.screenPausedText.scale.setTo(2);
          this.screenPausedScore = this.add.text(this.world.width*0.5, 250, 'Puntos: '+puntos, fontScoreWhite);
          this.screenPausedScore.anchor.set(0.5,0);
          this.screenPausedScore.scale.setTo(2);
          this.screenPausedErrores = this.add.text(this.world.width*0.5, 85, 'Errores: '+errores, fontScoreWhite);
          this.screenPausedErrores.anchor.set(0.5,0);           
          this.screenPausedContinue = this.add.button(this.world.width-30, this.world.height-30, 'button-continue', this.stateRestart, this, 1, 0, 2);
          this.screenPausedContinue.anchor.set(1,1);
          this.screenPausedContinue.scale.setTo(0.7);
          this.screenPausedBrain = this.add.sprite(this.world.width*0.5, this.world.height-350, 'acierto');
          this.screenPausedBrain.anchor.set(0.5);
          this.screenPausedBrain.scale.setTo(0.6);
          //this.screenPausedBombilla = this.add.sprite(this.world.width*0.5, this.world.height-325, 'bombilla');
          //this.screenPausedBombilla.anchor.set(0.5,0.5);
          //this.screenPausedBombilla.scale.setTo(0,0);
          this.screenPausedGroup.add(this.screenPausedBg);
          this.screenPausedGroup.add(this.screenPausedText);
          this.screenPausedGroup.add(this.screenPausedScore);          
          this.screenPausedGroup.add(this.screenPausedErrores);
          this.screenPausedGroup.add(this.screenPausedBrain);          
          this.screenPausedGroup.add(this.screenPausedContinue);
          this.screenPausedGroup.visible = false;

          

          this.screenGameoverGroup = this.add.group();
          this.screenGameoverBg = this.add.sprite(0, 0, 'cielo');
          this.screenGameoverBg.width=game.world.width;
          this.screenGameoverBg.height=game.world.height;
          this.screenGameoverText = this.add.text(this.world.width*0.5, 100, 'Time out', fontTitle);
          this.screenGameoverText.anchor.set(0.5,0);
          this.screenGameoverText.scale.setTo(2);
          this.screenGameoverScore = this.add.text(this.world.width*0.5, 250, 'Puntos: '+puntos, fontScoreWhite);
          this.screenGameoverScore.anchor.set(0.5,0);
          this.screenGameoverScore.scale.setTo(2);
          this.screenGameoverErrores = this.add.text(this.world.width*0.5, 85, 'Errores: '+errores, fontScoreWhite);
          this.screenGameoverErrores.anchor.set(0.5,0);
          this.screenGameoverBrain = this.add.sprite(this.world.width*0.5, this.world.height-350, 'lo');
          this.screenGameoverBrain.anchor.set(0.5);
          this.screenGameoverBrain.scale.setTo(0.6);          
          this.screenGameoverRestart = this.add.button(this.world.width-30, this.world.height-30, 'button-continue', this.stateRestart, this, 1, 0, 2);
          this.screenGameoverRestart.anchor.set(1,1);
          this.screenGameoverRestart.scale.setTo(0.7);
         
          this.screenGameoverGroup.add(this.screenGameoverBg);
          this.screenGameoverGroup.add(this.screenGameoverText);
          this.screenGameoverGroup.add(this.screenGameoverBrain);
          this.screenGameoverGroup.add(this.screenGameoverErrores);          
          this.screenGameoverGroup.add(this.screenGameoverRestart);
          this.screenGameoverGroup.add(this.screenGameoverScore);
          this.screenGameoverGroup.visible = false;
     },
     manageErrors: function(){
          this.gamePaused =! this.gamePaused;
          memColor._playAudio('click');
          if(this.gamePaused) {
                // then stop the timer
               game.time.events.remove(this.countDown);
               this.stateStatus = 'gameover';
          }
          else {
               this.stateStatus = 'playing';
               this.runOnce = false;
          }
     },
     manageHit: function(){
          this.stateStatus = 'paused';
     },
     managePause: function() {
          this.gamePaused =! this.gamePaused;
          memColor._playAudio('click');
          if(this.gamePaused) {
                // then stop the timer
               game.time.events.remove(this.countDown);
               this.stateStatus = 'paused';
          }
          else {
               this.stateStatus = 'playing';
               this.runOnce = false;
          }
     },
     statePaused: function() {

          memColor._playAudio('audio-acierto');
          //this.add.tween(this.screenPausedBombilla.scale).to({x: 0.7, y:0.7}, 1000, Phaser.Easing.Exponential.Out, true);
          
          //this.screenPausedBombilla.animations.add('enciende',[0,1,2],25, false);  
          //this.screenPausedBombilla.animations.play('enciende');
          this.screenPausedGroup.visible = true;
          this.pausedScoreTween(); 

          
     },
     stateRestart: function() {
          memColor._playAudio('click');
          this.screenPausedGroup.visible = false;
          this.gamePaused = false;
          this.runOnce = false;          
          this.stateStatus = 'playing';
          this.state.restart(true);
     },
     stateGameover: function() {
          if(vidas==0){
               this.screenGameoverText.setText('6 fallos');
               this.screenGameoverScore.setText('5');
               this.gameOverTitle='5 fallos';
               this.screenGameoverBrain.loadTexture('triste');
          }else{
               errores=errores+1;
               this.screenGameoverErrores.setText('Errores: '+errores);
               this.screenGameoverText.setText('No dormir');               
          }
          this.screenGameoverGroup.visible = true;
        
          this.screenGameoverScore.setText('Puntos: '+puntos);
          //this.gameoverScoreTween();
          memColor.Storage.setHighscore('memColor-highscore',puntos);
          
     },
     statePlaying: function() {
          this.screenPausedGroup.visible = false;         
          
     },
     stateBack: function() {
          //memColor._playAudio('click');
          this.screenGameoverGroup.visible = false;
          this.gamePaused = false;
          this.runOnce = false;          
          this.stateStatus = 'playing';          
          this.state.start('MainMenu');
     },
     gameoverScoreTween: function() {
          this.screenGameoverScore.setText('Puntos:'+(puntos-10));
          if(puntos) {
               this.tweenedPoints = (puntos-10);
               var pointsTween = this.add.tween(this);
               pointsTween.to({ tweenedPoints: puntos }, 1000, Phaser.Easing.Linear.None, true, 500);
               pointsTween.onUpdateCallback(function(){
                    this.screenGameoverScore.setText('Puntos: '+Math.floor(this.tweenedPoints));
               }, this);
               pointsTween.onComplete.addOnce(function(){
                    this.screenGameoverScore.setText('Puntos: '+puntos);
                    this.spawnEmitter(this.screenGameoverScore, 'particle', 20, 300);
               }, this);
               pointsTween.start();
          }
     },
     pausedScoreTween: function() {
          if(this.nuevosErrores>0){
               this.screenPausedScore.setText('Puntos:'+(puntos-5));
               this.tweenedPoints = (puntos-5);
          }else{
               this.screenPausedScore.setText('Puntos:'+(puntos-10));
               this.tweenedPoints = (puntos-10);
          }
          
          if(puntos) {
               
               var pointsTween = this.add.tween(this);
               pointsTween.to({ tweenedPoints: puntos }, 1000, Phaser.Easing.Linear.None, true, 500);
               pointsTween.onUpdateCallback(function(){
                    this.screenPausedScore.setText('Puntos: '+Math.floor(this.tweenedPoints));
               }, this);
               pointsTween.onComplete.addOnce(function(){
                    this.screenPausedScore.setText('Puntos: '+puntos);
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
     }
}    

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


	var game = new Phaser.Game(640, 960, Phaser.CANVAS);
	var states = {
		'Boot': memColor.Boot,
		'Preloader': memColor.Preloader,
		'MainMenu': memColor.MainMenu,
		'Achievements': memColor.Achievements,
		'Story': memColor.Story,
		'Game':memColor.Game	
	};
	for(var state in states)
		game.state.add(state, states[state]);


		//  The Google WebFont Loader will look for this object, so create it before loading the script.
		WebFontConfig = {

		    //  'active' means all requested fonts have finished loading
		    //  We set a 1 second delay before calling 'createText'.
		    //  For some reason if we don't the browser cannot render the text the first time it's created.
		    //active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

		    //  The Google Fonts we want to load (specify as many as you like in the array)
		    google: {
		      families: ['Boogaloo','Amatic SC','Baloo Thambi','Varela Round']		      
		    }

		};

	
	
	game.state.start('Boot');
