var vidas=1;
var nombre="volando";
var ranking=[
	{'usuario':'volando', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= "../../assets/volando/";


///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var volando = {
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				volando.Storage.initUnset('EPT-audio', true);
				volando._audioStatus = volando.Storage.get('EPT-audio');
				// volando._soundClick = game.add.audio('audio-click');
				volando._sound = [];
				volando._sound['click'] = game.add.audio('audio-click');
				if(!volando._soundMusic) {
					volando._soundMusic = game.add.audio('audio-theme',1,true);
					volando._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				volando._audioStatus = true;
				break;
			}
			case 'off': {
				volando._audioStatus = false;
				break;
			}
			case 'switch': {
				volando._audioStatus =! volando._audioStatus;
				break;
			}
			default: {}
		}
		if(volando._audioStatus) {
			volando._audioOffset = 0;
			if(volando._soundMusic) {
				if(!volando._soundMusic.isPlaying) {
					volando._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			volando._audioOffset = 4;
			if(volando._soundMusic) {
				volando._soundMusic.stop();
			}
		}
		volando.Storage.set('EPT-audio',volando._audioStatus);
		game.buttonAudio.setFrames(volando._audioOffset+1, volando._audioOffset+0, volando._audioOffset+2);
	},
	_playAudio: function(sound) {
		if(volando._audioStatus) {
			if(volando._sound && volando._sound[sound]) {
				volando._sound[sound].play();
			}
		}
	}
};
volando._vidas=parseInt(vidas);
volando._totalScore=0;
volando.ranking=ranking;

//volando.ranking=JSONObject;
volando.Boot = function(game){};
volando.Boot.prototype = {
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

volando.Preloader = function(game) {};
volando.Preloader.prototype = {
	preload: function() {
		var preloadBG = this.add.sprite((this.world.width-580)*0.5, (this.world.height+150)*0.5, 'loading-background');
		var preloadProgress = this.add.sprite((this.world.width-540)*0.5, (this.world.height+170)*0.5, 'loading-progress');
		 //  Load the Google WebFont Loader script
    	this.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
		this.load.setPreloadSprite(preloadProgress);

				
		this._preloadResources();
	},
	_preloadResources() {
		var pack = volando.Preloader.resources;
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
volando.Preloader.resources = {	
	'image': [
		
		['bosque', url+'img/Bosque.png'],
		['storyBg', url+'img/storyBg.jpg'],		
		['overlay', url+'img/overlay.jpg'],		
		['particle', url+'img/particle.png'],		
		['tubo', url+'img/tubo.jpg'],		
		['bg', url+'img/bg.png'],
		['portada', url+'img/Portada.png'],
		['suerte', url+'img/suerte.png'],
		['bosque', url+'img/bosque.png'],
		['boom', url+'img/boom.png'],
		['pinfloi', 'juegos/pompas/img/pinfloi.svg']

		
	],
	'spritesheet': [
		['button-start', url+'img/button-start.png', 180, 180],
		['button-continue', url+'img/button-continue.png', 180, 180],
		['button-mainmenu', url+'img/button-mainmenu.png', 180, 180],		
		['button-achievements', url+'img/button-achievements.png', 110, 110],
		['button-pause', url+'img/button-pause.png', 80, 80],
		['button-audio', url+'img/button-sound.png', 80, 80],
		['button-back', url+'img/button-back.png', 70, 70],
		['vadorrin',url+'img/Volando.png', 175,113],
		['vidas',url+'img/vidas.png', 100,69]
		

	],
	'audio': [
		['audio-click', [url+'sfx/audio-button.m4a',url+'sfx/audio-button.mp3',url+'sfx/audio-button.ogg']],
		['audio-theme', [url+'sfx/music-bitsnbites-liver.m4a',url+'sfx/music-bitsnbites-liver.mp3',url+'sfx/music-bitsnbites-liver.ogg']]
	]
};


///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Main Menú	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

volando.MainMenu = function(game) {};
volando.MainMenu.prototype = {
	create: function() {
		
        
		//this.add.sprite(0, 0, 'background');
		var title = this.add.sprite(0, 0, 'portada');
		

		volando.Storage = this.game.plugins.add(Phaser.Plugin.Storage);

		volando.Storage.initUnset('EPT-highscore', 0);
		var highscore = volando.Storage.get('EPT-highscore') || 0;

		//var buttonEnclave = this.add.button(20, 20, 'logo-enclave', this.clickEnclave, this);
		
		var buttonStart = this.add.button(this.world.width-20, this.world.height-20, 'button-start', this.clickStart, this, 1,0, 2);
		buttonStart.anchor.set(1);
		buttonStart.scale.setTo(0.7);

		this.buttonAudio = this.add.button(this.world.width-20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
		this.buttonAudio.anchor.set(1,0);

		/*var buttonAchievements = this.add.button(20, this.world.height-20, 'button-achievements', this.clickAchievements, this, 1, 0, 2);
		buttonAchievements.anchor.set(0,1);
		buttonAchievements.scale.setTo(0.7);*/

		var fontHighscore = { font: "32px Varela Round", fill: "#fff" };
		var textHighscore = this.add.text(this.world.width*0.5, this.world.height-25, 'Record: '+highscore, fontHighscore);
		textHighscore.anchor.set(0.5,1);

		volando._manageAudio('init',this);
		// Turn the music off at the start:
		volando._manageAudio('off',this);

		buttonStart.x = this.world.width+buttonStart.width+20;
		this.add.tween(buttonStart).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
		this.buttonAudio.y = -this.buttonAudio.height-20;
		this.add.tween(this.buttonAudio).to({y: 20}, 500, Phaser.Easing.Exponential.Out, true);
		//buttonEnclave.x = -buttonEnclave.width-20;
		//this.add.tween(buttonEnclave).to({x: 20}, 500, Phaser.Easing.Exponential.Out, true);
		
		
		//buttonAchievements.y = this.world.height+buttonAchievements.height+20;
		//this.add.tween(buttonAchievements).to({y: this.world.height-20}, 500, Phaser.Easing.Exponential.Out, true);

		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		volando._playAudio('click');
		volando._manageAudio('switch',this);
	},
	clickEnclave: function() {
		volando._playAudio('click');
		window.top.location.href = 'http://enclavegames.com/';
	},
	clickBeer: function() {
		volando._playAudio('click');
		window.top.location.href = 'https://www.paypal.me/end3r';
	},
	clickStart: function() {
		volando._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		volando._playAudio('click');
		this.game.state.start('Achievements');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Achievements	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

volando.Achievements = function(game) {};
volando.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: "32px Arial", fill: "#000" };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(this.world.width-20, game.world.height-20, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.x = this.world.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		volando._playAudio('click');
		this.game.state.start('MainMenu');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Story		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

volando.Story = function(game) {};
volando.Story.prototype = {
	create: function(){

		//Bg
		var bg=this.add.sprite(0,0,'storyBg');
		bg.width = game.width;
        bg.height = game.height;

        var marco=this.add.sprite(game.world.width/2,50,'crate');
        marco.width=800;
        marco.height=900;
        marco.anchor.setTo(0.5,0);
        marco.alpha=0.2;
        marco.tint="#6397cc";

        var fontTitle = { font: "48px Varela Round", fill: "#fff", stroke: "#2E2E2E", strokeThickness: 5 };
		var textStory = this.add.text(game.world.width/2, 85, 'Ranking', fontTitle);
		textStory.anchor.setTo(0.5);
		var buttonContinue = this.add.button(this.world.width-20, game.world.height-20, 'button-continue', this.clickContinue, this, 1, 0, 2);
		buttonContinue.scale.setTo(0.8);
		buttonContinue.anchor.set(1,1);
		buttonContinue.x = this.world.width+buttonContinue.width+20;		
		this.add.tween(buttonContinue).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		

        //Añado el ranking
		var sep=120;//Posicion vertical de la primera linea
		
		for(var key in volando.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#EE5F27";

	        //Si encuentra al usuario
			if(key < 9 && volando.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ volando.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, volando.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 9){//Si no es el usuario y key es menor
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ volando.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-300, sep, volando.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 9 && volando.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/4, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ volando.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, volando.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }
		this.camera.flash(0x000000, 500, false);
	},
	clickContinue: function() {
		volando._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.camera.onFadeComplete.add(function(){
			this.game.state.start('Game');
		}, this);
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Game		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

volando.Game = function(game) {};
volando.Game.prototype = {
    create: function() {
        this._score = 0;
        this._time = 10000;
        this.gamePaused = false;
        this.runOnce = false;
        this.chocado = false;
        //Bg
        this.bg = this.add.tileSprite(0, 0, 960, 640, 'bg');
        this.bosque = this.add.tileSprite(0, 0, 960, 640, 'bosque');
        this.bosque.anchor.set(0, 0);
        //var fontGameplay = { font: "32px Arial", fill: "#000" };
        //var textGameplay = this.add.text(100, 75, 'Gameplay screen', fontGameplay);
        //Player
        this.player = this.add.sprite(200, 200, 'vadorrin');
        this.player.anchor.setTo(0.5, 0.5);
        this.player.frame = 1;
        this.player.animations.add('vuelo', [0, 1, 2], 15, true);
        this.player.animations.play('vuelo');
        this.physics.startSystem(Phaser.Physics.ARCADE);
        this.physics.arcade.enable(this.player);
        this.player.body.gravity.y = 1200;
        this.player.body.collideWorldBounds = true;
        this.player.body.setSize(75, 75, 50, 20);
        //Tubos
        this.tubos = this.add.group();
        this.tubos.createMultiple(50, 'tubo');
        this.tubos.enableBody = true;
        this.physics.arcade.enable(this.tubos);
        //Vidas
        this.vidas = this.add.group();
        for (var a = 1; a <= volando._vidas; a++) {
            var vida = this.add.sprite(65 * a, 20, 'vidas');
            vida.scale.setTo(0.7, 0.7);
            vida.frame = 0;
            this.vidas.add(vida);
        }
        //Teclas
        this.salto = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.salto.onDown.add(this.saltar, this);
        //Raton
        this.bg.inputEnabled = true;
        this.bg.input.priorityID = 0;
        this.bg.events.onInputDown.add(this.saltar, this);
        //this.vidas.bringToTOp();
        this.currentTimer = this.time.create();
        this.currentTimer.loop(2000, function() {
            this.crearColumna();
            this.addPoints();
            this.vidas.forEach(function(item) {
                item.bringToTop();
            });
        }, this);
        this.currentTimer.start();
        this.initUI();
        this.camera.resetFX();
        this.camera.flash(0x000000, 500, false);
    },
    initUI: function() {
        this.buttonPause = this.add.button(this.world.width - 20, 20, 'button-pause', this.managePause, this, 1, 0, 2);
        this.buttonPause.anchor.set(1, 0);
        //var fontScore = { font: "32px Arial", fill: "#000" };
        var fontScore = {
            font: "50px  Varela Round",
            fill: "#FFF"
        };
        var fontScoreWhite = {
            font: "32px  Varela Round",
            fill: "#FFF"
        };
        //this.textScore = this.add.text(30, this.world.height-20, 'Puntos: '+this._score, fontScore);
        this.textScore = this.add.text(50, 150, 'Puntos: ' + this._score, fontScore);
        this.textScore.anchor.set(0, 1);
        this.textScore.setShadow(3, 3, 'rgba(0,0,0,0.5)', 5);
        //this.textTime = this.add.text(this.world.width-30, this.world.height-20, 'Time left: '+this._time, fontScore);
        //this.textTime.anchor.set(1,1);
        this.buttonPause.y = -this.buttonPause.height - 20;
        this.add.tween(this.buttonPause).to({
            y: 20
        }, 1000, Phaser.Easing.Exponential.Out, true);
        var fontTitle = {
            font: "48px  Varela Round",
            fill: "#000",
            stroke: "#FFF",
            strokeThickness: 10
        };
        this.screenPausedGroup = this.add.group();
        this.screenPausedBg = this.add.sprite(0, 0, 'overlay');
        this.screenPausedBg.width = game.world.width;
        this.screenPausedBg.height = game.world.height;
        this.screenPausedText = this.add.text(this.world.width * 0.5, 100, 'Paused', fontTitle);
        this.screenPausedText.anchor.set(0.5, 0);
        this.buttonAudio = this.add.button(this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
        this.buttonAudio.anchor.set(1, 0);
        this.screenPausedBack = this.add.button(150, this.world.height - 100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
        this.screenPausedBack.anchor.set(0, 1);
        this.screenPausedContinue = this.add.button(this.world.width - 150, this.world.height - 100, 'button-continue', this.managePause, this, 1, 0, 2);
        this.screenPausedContinue.anchor.set(1, 1);
        this.screenPausedGroup.add(this.screenPausedBg);
        this.screenPausedGroup.add(this.screenPausedText);
        this.screenPausedGroup.add(this.buttonAudio);
        this.screenPausedGroup.add(this.screenPausedBack);
        this.screenPausedGroup.add(this.screenPausedContinue);
        this.screenPausedGroup.visible = false;
        this.screenDiedGroup = this.add.group();
        this.screenDiedBg = this.add.sprite(0, 0, 'overlay');
        this.screenDiedBg.width = game.world.width;
        this.screenDiedBg.height = game.world.height;
        this.screenDiedText = this.add.text(this.world.width * 0.5, 100, 'Ups..', fontTitle);
        this.screenDiedText.anchor.set(0.5, 0);
        this.screenDiedScore = this.add.text(this.world.width * 0.5, 300, 'Puntos: ' + this._score, fontScoreWhite);
        this.screenDiedScore.anchor.set(0.5, 0.5);
        this.screenDiedTotalScore = this.add.text(this.world.width * 0.5, 400, 'Puntos totales: ' + volando._totalScore, fontScoreWhite);
        this.screenDiedTotalScore.anchor.set(0.5, 0.5);
        this.buttonAudio = this.add.button(this.world.width - 20, 20, 'button-audio', this.clickAudio, this, 1, 0, 2);
        this.buttonAudio.anchor.set(1, 0);
        this.screenDiedContinue = this.add.button(this.world.width / 2, this.world.height - 100, 'button-continue', this.stateRestart, this, 1, 0, 2);
        this.screenDiedContinue.anchor.set(0.5);
        this.screenDiedGroup.add(this.screenDiedBg);
        this.screenDiedGroup.add(this.screenDiedText);
        this.screenDiedGroup.add(this.screenDiedScore);
        this.screenDiedGroup.add(this.screenDiedTotalScore);
        this.screenDiedGroup.add(this.screenDiedContinue);
        this.screenDiedGroup.visible = false;
        this.buttonAudio.setFrames(volando._audioOffset + 1, volando._audioOffset + 0, volando._audioOffset + 2);
        this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'bg');
        this.screenGameoverBg.width = game.world.width;
        this.screenGameoverBg.height = game.world.height;
        this.screenGameoverText = this.add.text(this.world.width * 0.5, 50, 'Hasta la próxima.', fontTitle);
        this.screenGameoverText.anchor.set(0.5, 0);
        //this.screenGameoverBack = this.add.button(150, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
        //this.screenGameoverBack.anchor.set(0,1);
        this.screenGameoverRestart = this.add.button(this.world.width - 100, this.world.height - 75, 'button-continue', this.next, this, 1, 0, 2);
        this.screenGameoverRestart.anchor.set(0.5);
        this.screenGameoverScore = this.add.text(650, 350, this._score, fontScoreWhite);
        this.screenGameoverScore.anchor.set(0, 0);
        this.screenGameoverGroup.add(this.screenGameoverBg);
        this.screenGameoverGroup.add(this.screenGameoverText);
        //this.screenGameoverGroup.add(this.screenGameoverBack);
        this.screenGameoverGroup.add(this.screenGameoverRestart);
        this.screenGameoverGroup.add(this.screenGameoverScore);
        this.screenGameoverGroup.visible = false;
    },
    update: function() {
        if (this.player.angle < 20 && this.player.y < this.world.height - 100) {
            this.player.angle += 0.5;
        }
        if (this.player.y > 600 || this.player.y < 40) {
            //this.tocaTubo();
        }
        this.physics.arcade.overlap(this.player, this.tubos, this.tocaTubo, null, this);
        if (this.chocado != true) {
            this.bg.tilePosition.x -= 0.5;
            this.bosque.tilePosition.x -= 1;
        }
        switch (this.stateStatus) {
            case 'paused':
                {
                    if (!this.runOnce) {
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
            case 'gameover':
                {
                    if (!this.runOnce) {
                        this.stateGameover();
                        this.runOnce = true;
                    }
                    break;
                }
            case 'playing':
                {
                    this.statePlaying();
                }
            default:
                {}
        }
    },
    render: function() {
        //game.debug.body(this.player);
        //this.tubos.forEach(this.renderGroup, this);
    },
    renderGroup: function(member) {
        game.debug.body(member);
    },
    tocaTubo: function() {
        this.player.body.enable = false;
        this.vidas.children[this.vidas.children.length - 1].frame = 1;        
        volando._vidas--;
        this.currentTimer.pause();
        this.chocado = true;
        this.boom = this.add.sprite(this.player.x, this.player.y, 'boom');
        this.player.x = -200;
        this.boom.anchor.setTo(0.5);
        this.boom.scale.setTo(0);
        var boom = this.add.tween(this.boom.scale).to({
            x: 3,
            y: 3
        }, 500, "Linear", true);
        boom = this.add.tween(this.boom).to({
            alpha: 0
        }, 500, Phaser.Easing.Circular.In, true);
        this.tubos.forEachAlive(function(tubo) {
            tubo.body.enable = false;
        });
        var a = this;
        setTimeout(function() {
            a.boom.destroy();
            if (volando._vidas == 0) {
                a.stateStatus = 'gameover';
            } else {
                a.stateStatus = 'died';
            }
        }, 1000);
    },
    saltar: function() {
        this.player.body.velocity.y = -350;
        this.add.tween(this.player).to({
            angle: -20
        }, 100).start();
    },
    managePause: function() {
        this.gamePaused = !this.gamePaused;
        volando._playAudio('click');
        if (this.gamePaused) {
            this.stateStatus = 'paused';
        } else {
            this.stateStatus = 'playing';
            this.runOnce = false;
        }
    },
    statePlaying: function() {
        this.screenPausedGroup.visible = false;
        this.currentTimer.resume();
        //this.buttonDummy.exists=true;
        this.tubos.forEachAlive(function(tubo) {
            tubo.body.velocity.x = -180;
        });
        this.player.body.gravity.y = 1200;
    },
    statePaused: function() {
        this.screenPausedGroup.visible = true;
        this.currentTimer.pause();
        //this.buttonDummy.exists=false;
        this.tubos.forEachAlive(function(tubo) {
            tubo.body.velocity.x = 0;
        });
        this.player.body.gravity.y = 0;
        this.player.body.velocity.y = 0;
    },
    stateDied: function() {
        volando._totalScore += this._score;
        this.screenDiedGroup.visible = true;
        this.currentTimer.stop();
        //this.screenDiedScore.setText('Puntos: '+this._score);
        this.diedScoreTween();
        volando.Storage.setHighscore('EPT-highscore', this._score);
        //this.buttonDummy.exists=false;
    },
    stateGameover: function() {
        volando._totalScore += this._score;
        this.screenGameoverGroup.visible = true;
        this.currentTimer.stop();
        //this.gameoverScoreTween();
        //Muestro la posicion en el ranking
        this.muestraRanking();
        /*
        this.screenGameoverGroup.visible = true;
        this.currentTimer.stop();
        this.screenGameoverScore.setText('Puntos: '+this._score);
        this.gameoverScoreTween();*/
        volando.Storage.setHighscore('EPT-highscore', this._score);
        //this.buttonDummy.exists=false;
    },
    addPoints: function() {
        this._score += 10;
        this.textScore.setText('Puntos: ' + this._score);
        //var randX = this.rnd.integerInRange(200,this.world.width-200);
        //var randY = this.rnd.integerInRange(200,this.world.height-200);
        //var pointsAdded = this.add.text(randX, randY, '+10',
        //{ font: "48px Arial", fill: "#000", stroke: "#FFF", strokeThickness: 10 });
        //pointsAdded.anchor.set(0.5, 0.5);
        //this.add.tween(pointsAdded).to({ alpha: 0, y: randY-50 }, 1000, Phaser.Easing.Linear.None, true);
        //this.camera.shake(0.01, 100, true, Phaser.Camera.SHAKE_BOTH, true);
    },
    diedScoreTween: function() {
        console.log('Estor en diedScoreTween');
        var nuevoTotal = volando._totalScore + this._score;
        this.screenDiedScore.setText('Puntos:' + this._score);
        this.screenDiedTotalScore.setText('Puntos totales:' + (volando._totalScore - this._score));
        if (this._score) {
            this.tweenedPoints = volando._totalScore;
            var pointsTween = this.add.tween(this);
            pointsTween.to({
                tweenedPoints: nuevoTotal
            }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function() {
                this.screenDiedTotalScore.setText('Puntos totales: ' + Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function() {
                this.screenDiedTotalScore.setText('Puntos totales: ' + volando._totalScore);
                this.spawnEmitter(this.screenDiedTotalScore, 'particle', 20, 300);
            }, this);
            pointsTween.start();
        }
    },
    gameoverScoreTween: function(posy) {
        console.log('Estor en gameoverScoreTween');
        this.screenGameoverScore.y = posy;
        this.screenGameoverScore.setText('0');
        if (this._score) {
            this.tweenedPoints = 0;
            var pointsTween = this.add.tween(this);
            pointsTween.to({
                tweenedPoints: volando._totalScore
            }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function() {
                this.screenGameoverScore.setText(Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function() {
                this.screenGameoverScore.setText(volando._totalScore);
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
        var emitter = this.game.add.emitter(item.x + offsetX, item.y + offsetY, number);
        emitter.maxParticles = number;
        emitter.makeParticles(particle);
        emitter.setXSpeed(-500, 500);
        emitter.setYSpeed(-700, 300);
        emitter.setScale(4, 1, 4, 1, 500, Phaser.Easing.Linear.None);
        emitter.gravity = gravity || 250;
        emitter.start(false, lifespan, frequency, number);
    },
    clickAudio: function() {
        volando._playAudio('click');
        volando._manageAudio('switch', this);
    },
    stateRestart: function() {
        volando._playAudio('click');
        this.screenGameoverGroup.visible = false;
        this.gamePaused = false;
        this.runOnce = false;
        this.currentTimer.start();
        this.stateStatus = 'playing';
        this.state.restart(true);
    },
    stateBack: function() {
        volando._playAudio('click');
        this.screenGameoverGroup.visible = false;
        this.gamePaused = false;
        this.runOnce = false;
        this.currentTimer.start();
        this.stateStatus = 'playing';
        this.state.restart(true);
        this.state.start('MainMenu');
    },
    crearColumna: function() {
        var hueco = Math.floor(Math.random() * 4) + 1;
        for (var i = 0; i < 6; i++) {
            if (i != hueco && i != hueco + 1 && i != hueco + 2) {
                this.crearTubo(960, i * 107);
            }
        }
    },
    crearTubo: function(x, y) {
        this.tubo = this.tubos.getFirstDead();
        this.tubo.reset(x, y);
        //this.tubo.body.velocity.x=velocidad;
        this.tubo.body.velocity.x = -180;
        this.tubo.checkWorldBounds = true;
        this.tubo.outOfBoundsKill = true;
    },
    muestraRanking: function() {
        let sep = 150;
        var a = new Array();
        a.usuario = nombre;
        a.puntos = volando._totalScore;
         
        //Ordeno por puntos
        for (var i in volando.ranking) {
        	let cont=0;
        	//Si existe el usuariuo y ha obtenido mejor puntuacion, la cambio
        	if(volando.ranking[i]['usuario'] == a['usuario'] && volando.ranking[i]['puntos'] < a['puntos']){
        		 volando.ranking[i]['puntos']=a['puntos'];          	
            	break;

            //Si existe pero ha obtenido menor puntiuación, no hago nada          	
            }if(volando.ranking[i]['usuario'] == a['usuario'] && volando.ranking[i]['puntos'] >= a['puntos']){        		           	
            	break;          	
            }else {//Si no existe lo añado
            	volando.ranking.push(a);
            	break;
            }
        }

        //Ordeno el ranking por puntos
        volando.ranking.sort(function(a, b) {
		    return parseFloat(b['puntos']) - parseFloat(a['puntos']);
		});       
        
        
        //Muestro los puntos del usuario
        for(var key in volando.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#EE5F27";

	        //Si encuentra al usuario
			if(key < 3 && volando.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ volando.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, volando.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 3){//Si no es el usuario y key es menor
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ volando.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-300, sep, volando.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 3 && volando.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/4, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ volando.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, volando.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
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

// (function(){
	var game = new Phaser.Game(960, 640, Phaser.CANVAS);

	//  The Google WebFont Loader will look for this object, so create it before loading the script.
	WebFontConfig = {

	    //  'active' means all requested fonts have finished loading
	    //  We set a 1 second delay before calling 'createText'.
	    //  For some reason if we don't the browser cannot render the text the first time it's created.
	   

	    //  The Google Fonts we want to load (specify as many as you like in the array)
	    google: {
	      families: ['Revalia','Boogaloo','Varela Round']
	    }

	};
	
	var states = {
		'Boot': volando.Boot,
		'Preloader': volando.Preloader,
		'MainMenu': volando.MainMenu,
		'Achievements': volando.Achievements,
		'Story': volando.Story,
		'Game': volando.Game
	};

	
	for(var state in states)
		game.state.add(state, states[state]);
	
	game.state.start('Boot');
// })();


