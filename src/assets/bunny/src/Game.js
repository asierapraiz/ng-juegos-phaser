EPT.Game = function(game) {};
EPT.Game.prototype = {
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
		var fontScoreWhite =  { font: "32px Arial", fill: "#FFF" };
		var fontScore = { font: "100px Boogaloo", fill: "#000" };
		var fontTitle = { font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 };

		//Texto
        this.textScore = game.add.text(100,100,'', fontScore);
        this.textScore.tint="#000";
        this.textScore.text=this._score;
        //this.textScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);

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
		//this.screenPausedGroup.add(this.screenPausedBg);
		this.screenPausedGroup.add(this.screenPausedText);
		this.screenPausedGroup.add(this.buttonAudio);
		this.screenPausedGroup.add(this.screenPausedBack);
		this.screenPausedGroup.add(this.screenPausedContinue);
		this.screenPausedGroup.visible = false;

		this.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

		this.screenGameoverGroup = this.add.group();
		this.screenGameoverBg = this.add.sprite(0, 0, 'overlay');
        this.screenGameoverBg.width=game.world.width;
        this.screenGameoverBg.height=game.world.height;
		this.screenGameoverText = this.add.text(this.world.width*0.5, 100, 'Game over', fontTitle);
		this.screenGameoverText.anchor.set(0.5,0);
		this.screenGameoverBack = this.add.button(150, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
		this.screenGameoverBack.anchor.set(0,1);
		this.screenGameoverRestart = this.add.button(this.world.width-150, this.world.height-100, 'button-restart', this.stateRestart, this, 1, 0, 2);
		this.screenGameoverRestart.anchor.set(1,1);
		this.screenGameoverScore = this.add.text(this.world.width*0.5, 300, 'Puntos: '+this._score, fontScoreWhite);
		this.screenGameoverScore.anchor.set(0.5,0.5);
		this.screenGameoverGroup.add(this.screenGameoverBg);
		this.screenGameoverGroup.add(this.screenGameoverText);
		this.screenGameoverGroup.add(this.screenGameoverBack);
		this.screenGameoverGroup.add(this.screenGameoverRestart);
		this.screenGameoverGroup.add(this.screenGameoverScore);
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
            
            this.stateRestart();
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

        this.bubbleText = game.add.bitmapText(0, 0, "font", (this._score).toString(), 150);
        this.bubbleText.anchor.set(0.5);
        this.bubbleText.tint = "#000000";
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
		EPT._playAudio('click');
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
	stateGameover: function() {		
		
		this.screenGameoverGroup.visible = true;
		//this.currentTimer.stop();
		this.screenGameoverScore.setText('Bloques: '+this._score);
		this.gameoverScoreTween();
		EPT.Storage.setHighscore('EPT-highscore',this._score);
				
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
		EPT._playAudio('click');
		EPT._manageAudio('switch',this);
	},
	stateRestart: function() {
		EPT._playAudio('click');
		if(this.screenGameoverGroup.visible==true){
			this.screenGameoverGroup.visible = false;
		}
		
		this.gamePaused = false;
		this.runOnce = false;		
		this.stateStatus = 'playing';
		this.state.restart(true);
	},
	stateBack: function() {
		EPT._playAudio('click');
		this.screenGameoverGroup.visible = false;
		this.gamePaused = false;
		this.runOnce = false;
		//this.currentTimer.start();
		this.stateStatus = 'playing';
		this.state.restart(true);
		this.state.start('MainMenu');
	}
};
