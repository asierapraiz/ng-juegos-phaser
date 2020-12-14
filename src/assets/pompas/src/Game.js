EPT.Game = function(game) {};
EPT.Game.prototype = {
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

		this.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

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
            if(EPT._vidas<7){
            	//EPT._vidas++;
            }


            if(this._score==5  || this._score==12 || this._score==25){
            	EPT._vidas+=1;
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
        this.screenDiedMaxScore.setText('Tu máximo: '+EPT._totalScore);
        //this.screenDiedScore.setText('Puntos: '+this._score);
        //this.diedScoreTween();
        EPT.Storage.setHighscore('EPT-highscore', this._score);
        //this.buttonDummy.exists=false;
    },
	stateGameover: function() {
		this.screenGameoverGroup.visible = true;
		game.world.bringToTop(this.screenGameoverGroup);
		
		this.screenGameoverScore.setText('Tu record: '+EPT._totalScore);
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
			pointsTween.to({ tweenedPoints: EPT._totalScore }, 1000, Phaser.Easing.Linear.None, true, 500);
			pointsTween.onUpdateCallback(function(){
				this.screenGameoverScore.setText(Math.floor(this.tweenedPoints));
			}, this);
			pointsTween.onComplete.addOnce(function(){
				this.screenGameoverScore.setText(EPT._totalScore);
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
		this.screenGameoverGroup.visible = false;
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
		
		this.stateStatus = 'playing';
		// this.state.restart(true);
		this.state.start('MainMenu');
		
	},
    // method to update the score
    updateScore: function(){
    	
		this._scoreText.text = "Puntos: " + this._score + " - Tu record: " + EPT._totalScore;
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
            if(EPT._totalScore < this._score){
                EPT._totalScore = this._score;
            } 
        
        if(EPT._vidas>=1){
                    EPT._vidas--;
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
        document.getElementById("puntos").value=EPT._totalScore;            
        document.getElementById("formulario").submit();
    },
    updateVidas: function(){
    	for(var a=0; a<EPT._vidas;a++){
        	this.vidas=this.game.add.image((a*30)+30, 10, 'vida');
        }
    }
};
