
var vidas=3;
var nombre='pompas';
var ranking=[
	{'usuario':'bunny', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= '../../assets/pizzero/';

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Boot			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

var EPT = {
	_manageAudio: function(mode, game) {
		switch(mode) {
			case 'init': {
				EPT.Storage.initUnset('EPT-audio', true);
				EPT._audioStatus = EPT.Storage.get('EPT-audio');
				EPT._soundClick = game.add.audio('audio-click');
				EPT._sound = [];
				EPT._sound['click'] = game.add.audio('audio-click');
				EPT._sound['acierto'] = game.add.audio('audio-acierto');
				EPT._sound['error'] = game.add.audio('audio-error');
				if(!EPT._soundMusic) {
					EPT._soundMusic = game.add.audio('audio-theme',1,true);
					EPT._soundMusic.volume = 0.5;
				}
				break;
			}
			case 'on': {
				EPT._audioStatus = true;
				break;
			}
			case 'off': {
				EPT._audioStatus = false;
				break;
			}
			case 'switch': {
				EPT._audioStatus =! EPT._audioStatus;
				break;
			}
			default: {}
		}
		if(EPT._audioStatus) {
			EPT._audioOffset = 0;
			if(EPT._soundMusic) {
				if(!EPT._soundMusic.isPlaying) {
					//EPT._soundMusic.play('',0,1,true);
				}
			}
		}
		else {
			EPT._audioOffset = 4;
			if(EPT._soundMusic) {
				//EPT._soundMusic.stop();
			}
		}
		EPT.Storage.set('EPT-audio',EPT._audioStatus);
		game.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

	},
	_playAudio: function(sound) {
		if(EPT._audioStatus) {
			if(EPT._sound && EPT._sound[sound]) {
				EPT._sound[sound].play();
			}
		}
	}
};

//Variables super globales
EPT._vidas=parseInt(vidas);
EPT._totalScore=0;
EPT.ranking=ranking;
EPT._level=1;

EPT.Boot = function(game){};
EPT.Boot.prototype = {
	preload: function(){
		
		this.stage.backgroundColor = '#ffffff';
		this.load.image('cielo', url +'img/cielo.png');		
		this.load.image('loading-progress', url +'img/loading-progress.png');
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
		['portada', url +'img/portada.png'],
		['pizzero', url +'img/pizzero_en_moto.svg'],
		//['background', url +'img/background.png'],
		['title', url +'img/title.png'],					
		//['particle', url +'img/particle.png'],
		['bg', url +'img/cielo.png'],	
		['crate', url +'img/crate.png'],	
		['base', url +'img/base.png'],		
		['square', url +'img/square2.png'],
		['top', url +'img/top.png'],
       	['sky', url +'img/cielo.png'],
       	['boom', url +'img/humo.png'],
       	['humo', url +'img/humoP.png'],
		['pinfloi', url +'img/Pinfloi.svg'],
		['pizza', url +'img/pizza.svg'],
		['tuerca', url +'img/tuerca.png'],
		['tornillo', url +'img/tornillo.png'],
		['ruedaDent', url +'img/ruedaDent.png'],
		['ruedaDent2', url +'img/ruedaDent2.png'],
		['rueda', url +'img/rueda.png'],
		['gorra', url +'img/gorra.png'],
		['zapato', url +'img/zapato.png'],
		['retrovisor', url +'img/retrovisor.png'],
		['faroTras', url +'img/faroTras.png'],
		['faroDel', url +'img/faroDel.png']

	],
	'spritesheet': [
		['button-start', url +'img/button-start.png', 180, 180],
		['button-continue', url +'img/button-continue.png', 180, 180],		
		['button-pause', url +'img/button-pause.png', 80, 80],
		['button-audio', url +'img/button-sound.png', 80, 80],		
		['motoCae', url +'img/moteroCae.png',200,300],
		['motero', url +'img/motero.png',200,200],
		['motoCrash', url +'img/Crash.png',200,200]
		
	],
	'audio': [
		//['audio-click', [url+'sfx/audio-button.m4a',url+'sfx/audio-button.mp3',url+'sfx/audio-button.ogg']],
		['audio-theme', [url+'sfx/music-bitsnbites-liver.m4a',url+'sfx/music-bitsnbites-liver.mp3',url+'sfx/music-bitsnbites-liver.ogg']],
		['audio-acierto', [url+'sfx/acierto.wav']],
		
	],
	'font':[
		['font', 'fonts/font.png', 'fonts/font.fnt']

	]
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Main Menú		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

EPT.MainMenu = function(game) {};
EPT.MainMenu.prototype = {
	
	create: function() {
		
		
		this.bg=this.add.sprite(0, 0, 'bg');
		this.bg.width=game.world.width;
		this.bg.height=game.world.height;

		this.bg=this.add.sprite(0, game.world.height/4, 'pizzero');
		this.bg.width=game.world.width;
		this.bg.height=game.world.height/1.5;
		
		
		EPT.Storage = this.game.plugins.add(Phaser.Plugin.Storage);

		EPT.Storage.initUnset('EPT-highscore', 0);
		var highscore = EPT.Storage.get('EPT-highscore') || 0;

		//var buttonEnclave = this.add.button(20, 20, 'logo-enclave', this.clickEnclave, this);
		//var buttonBeer = this.add.button(25, 130, 'button-beer', this.clickBeer, this);
		var fontTitle = { font: '100px Amatic SC', fill: '#000', stroke: '#FFF', strokeThickness: 4 };

		this.title = this.add.text(this.world.width*0.5, 75, 'Pizza', fontTitle);
        this.title.anchor.set(0.5,0);
        this.title.scale.setTo(2);

        var buttonPinfloi = this.add.button(40, this.world.height-150, 'pinfloi', this.clickPinfloi, this);
		buttonPinfloi.scale.setTo(0.7,0.7);

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


		EPT._manageAudio('init',this);
		// Turn the music off at the start:
		EPT._manageAudio('on',this);	
		
		
		this.camera.flash(0x000000, 500, false);
	},
	clickAudio: function() {
		EPT._playAudio('click');
		EPT._manageAudio('switch',this);
	},
	clickEnclave: function() {
		EPT._playAudio('click');
		window.top.location.href = 'http://enclavegames.com/';
	},
	clickBeer: function() {
		EPT._playAudio('click');
		window.top.location.href = 'https://www.paypal.me/end3r';
	},
	clickStart: function() {
		EPT._playAudio('click');
		this.camera.fade(0x000000, 200, false);
		this.time.events.add(200, function() {
			//this.game.state.start('Story');Game
			this.game.state.start('Story');
		}, this);
	},
	clickAchievements: function() {
		EPT._playAudio('click');
		this.game.state.start('Achievements');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Achievements	///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


EPT.Achievements = function(game) {};
EPT.Achievements.prototype = {
	create: function(){
		var fontAchievements = { font: '32px Arial', fill: '#000' };
		var textAchievements = this.add.text(100, 75, 'Achievements screen', fontAchievements);

		var buttonBack = this.add.button(this.world.width-40, game.world.height-40, 'button-back', this.clickBack, this, 1, 0, 2);
		buttonBack.anchor.set(1,1);
		buttonBack.scale.setTo(1.5);
		buttonBack.x = this.world.width+buttonBack.width+20;
		this.add.tween(buttonBack).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);
	},
	clickBack: function() {
		EPT._playAudio('click');
		this.game.state.start('MainMenu');
	}
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////			Story		///////////////////////////////
///////////////////////////////////////////////////////////////////////////////

EPT.Story = function(game) {};
EPT.Story.prototype = {
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
        marco.tint='#6397cc';

		var textStory = this.add.text(game.world.width/2, 75, 'Ranking', { font: '50px Baloo Thambi', fill: '#fff' });
		textStory.anchor.setTo(0.5);

		var buttonContinue = this.add.button(this.world.width-20, game.world.height-20, 'button-continue', this.clickContinue, this, 1, 0, 2);
		buttonContinue.anchor.set(1,1);
		buttonContinue.scale.setTo(0.7,0.7);
		buttonContinue.x = this.world.width+buttonContinue.width+20;
		
		this.add.tween(buttonContinue).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

		//Añado el ranking
		var sep=150;//Posicion vertical de la primera linea
		
		for(var key in EPT.ranking){
			let encontrado=false;
			let color = '#1e79ff';
	        //var color = '#1e79ff';
	        //Color usuer
	        let colorU = '#fff';

	        //Si encuentra al usuario
			if(key < 10 && EPT.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+'-'+ EPT.ranking[key]['usuario'], { font: '40px Varela Round', fill: colorU });
        		this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: '40px Varela Round', fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 10){//Si no es el usuario y key es menor
				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+'-'+ EPT.ranking[key]['usuario'], { font: '40px Varela Round', fill: color });
        		this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: '40px Varela Round', fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 10 && EPT.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/6, sep, '...', { font: '40px Varela Round', fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+'-'+ EPT.ranking[key]['usuario'], { font: '40px Varela Round', fill: colorU });
        		this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: '40px Varela Round', fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }
        
		this.camera.flash(0x000000, 500, false);
	},
	clickContinue: function() {
		EPT._playAudio('click');
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

EPT.Game = function(game) {};
EPT.Game.prototype = {
    create: function() {
        this.level = 1;
        this._score = 0;        
        this.bg = this.add.image(0, 0, 'bg');
        this.bg.height = game.height;
        this.bg.width = game.width;

        //Gestion inputs
        this.bg.inputEnabled = true;             
        
        this.holeWidthRange = [40, 240];
        this.wallRange = [10, 70];       
        this.escalaBase = 1.2;       
        
        //Añado las suelos
        this.leftSquare = this.add.sprite(0, this.world.height, 'base');
        this.leftSquare.anchor.set(1, 1);
        this.leftSquare.scale.setTo(this.escalaBase);
        this.rightSquare = this.add.sprite(this.world.width, this.world.height, 'base');
        this.rightSquare.anchor.set(0, 1);
        this.rightSquare.scale.setTo(this.escalaBase);
        this.leftWall = this.add.sprite(0, this.world.height - this.leftSquare.height, 'top');
        this.leftWall.anchor.set(1, 1);
        this.leftWall.scale.setTo(this.escalaBase);
        this.rightWall = this.add.sprite(this.world.width, this.world.height - this.rightSquare.height, 'top');
        this.rightWall.anchor.set(0, 1);
        this.rightWall.scale.setTo(this.escalaBase);
        this.square = this.add.sprite(this.world.width / 2, -250, 'square');
        this.square.anchor.set(0.5);
        this.square.successful = 0;
        this.square.scale.setTo(this.escalaBase);

        this.levelText = this.add.text(game.width / 2, 40, 'Nivel ' + this.level, {
            font: 'bold 100px Baloo Thambi',
            fill: '#3582ff'
        });
        this.levelText.anchor.set(0.5, 0);
        //Motero
        this.motero = game.add.sprite(game.world.width + 150, this.leftWall.y - this.leftWall.height - 120, 'motero');
        this.motero.scale.setTo(this.escalaBase);
        this.motero.anchor.setTo(0.5, 0.5);
        this.motero.animations.add('pasa', [0, 1, 2, 3], 10, true);
        this.motero.animations.play('pasa');
        //MoteroCae
        this.moteroCae = game.add.sprite(game.world.width + 150, this.leftWall.y - this.leftWall.height - 70, 'motoCae');
        this.moteroCae.scale.setTo(this.escalaBase);
        this.moteroCae.anchor.setTo(0.5, 0.5);
        //Motero Crash
        this.motoCrash = game.add.sprite(game.world.width + 150, this.leftWall.y - this.leftWall.height - 70, 'motoCrash');
        this.motoCrash.scale.setTo(this.escalaBase);
        this.motoCrash.anchor.setTo(0.5, 0.5);
        //Inicio pnatallas
        this.updateLevel();
        this.initUI();
    },
    initUI: function() {
        //Fuentes
        var fontTitle = {
            font: '100px Baloo Thambi',
            fill: '#fff'
        };
        var fontScore = {
            font: '30px Baloo Thambi',
            fill: '#fff'
        };
        
        //GameOver
        this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'bg');
        this.screenGameoverBg.width = game.world.width;
        this.screenGameoverBg.height = game.world.height;
        this.screenGameoverTitle = this.add.text(this.world.width * 0.5, 30, 'Game over', fontTitle);
        this.screenGameoverTitle.anchor.set(0.5, 0);        
        this.screenGameoverMarco=this.add.sprite(game.world.width/2,20,'crate');
        this.screenGameoverMarco.width=550;
        this.screenGameoverMarco.height=900;
        this.screenGameoverMarco.anchor.setTo(0.5,0);
        this.screenGameoverMarco.alpha=0.1;
        this.screenGameoverMarco.tint='#6397cc';        
        this.screenGameoverContinue = this.add.button(this.world.width / 2, this.world.height - 20, 'button-continue', this.next, this, 1, 0, 2);
        this.screenGameoverContinue.anchor.set(0.5,1);
        this.screenGameoverContinue.scale.setTo(0.7);
        this.screenGameoverScore = this.add.text(this.world.width * 0.5, 500, this.topScore, fontTitle);
        this.screenGameoverScore.anchor.set(0.5, 0.5);
        this.screenGameoverGroup.add(this.screenGameoverBg);
        this.screenGameoverGroup.add(this.screenGameoverMarco);
        this.screenGameoverGroup.add(this.screenGameoverTitle);
        
        this.screenGameoverGroup.add(this.screenGameoverContinue);
        this.screenGameoverGroup.add(this.screenGameoverScore);
        this.screenGameoverGroup.visible = false;
    },
    //Cada vez que quiero que empiece de nuevo
    updateLevel: function() {

        console.log('vidas:'+EPT._vidas);
        //vidas
        if(this.vidas){
            this.vidas.destroy();
        }
        this.vidas = this.add.group();
        for(var a=1;a<=EPT._vidas;a++){
            let vida=this.add.image(50*a, 60, 'pizza');
            vida.scale.setTo(0.2,0.2);
            vida.anchor.set(0, 1);
            this.vidas.add(vida);
        }
        

        this.levelText.text = 'NIVEL '+this.level ;
        var holeWidth = game.rnd.between(this.holeWidthRange[0], this.holeWidthRange[1]);
        var wallWidth = game.rnd.between(this.wallRange[0], this.wallRange[1]);
        var leftSquareTween = game.add.tween(this.leftSquare).to({
            x: (game.width - holeWidth) / 2
        }, 500, Phaser.Easing.Cubic.Out, true);
        var rightSquareTween = game.add.tween(this.rightSquare).to({
            x: (game.width + holeWidth) / 2
        }, 500, Phaser.Easing.Cubic.Out, true);
        var leftWalltween = game.add.tween(this.leftWall).to({
            x: (game.width - holeWidth) / 2 - wallWidth
        }, 500, Phaser.Easing.Cubic.Out, true);
        var rightWallTween = game.add.tween(this.rightWall).to({
            x: (game.width + holeWidth) / 2 + wallWidth
        }, 500, Phaser.Easing.Cubic.Out, true);
        var squareTween = game.add.tween(this.square).to({
            y: 200,
            angle: 50
        }, 500, Phaser.Easing.Cubic.Out, true);
        squareTween.onComplete.add(function() {
            game.input.onDown.add(this.clica, this);
            this.rotateTween = game.add.tween(this.square).to({
                angle: 40
            }, 300, Phaser.Easing.Linear.None, true, 0, -1, true)
        }, this);
        var growTween = game.add.tween(this.square.scale).to({
            x: 0.24,
            y: 0.24
        }, 500, Phaser.Easing.Linear.None, true);
    },
    muestraRanking: function() {
        let sep = 150;
        var a = new Array();
        a.usuario = nombre;
        a.puntos = this.level;
         
        //Ordeno por puntos
        for (var i in EPT.ranking) {
            let cont=0;
            //Si existe el usuariuo y ha obtenido mejor puntuacion, la cambio
            if(EPT.ranking[i]['usuario'] == a['usuario'] && EPT.ranking[i]['puntos'] < a['puntos']){
                 EPT.ranking[i]['puntos']=a['puntos'];              
                break;

            //Si existe pero ha obtenido menor puntiuación, no hago nada            
            }if(EPT.ranking[i]['usuario'] == a['usuario'] && EPT.ranking[i]['puntos'] >= a['puntos']){                          
                break;              
            }else {//Si no existe lo añado
                EPT.ranking.push(a);
                break;
            }
        }

        //Ordeno el ranking por puntos
        EPT.ranking.sort(function(a, b) {
            return parseFloat(b['puntos']) - parseFloat(a['puntos']);
        });       
        
        
        //Muestro los puntos del usuario
        for(var key in EPT.ranking){
            let encontrado=false;
            let color = '#1e79ff';
            //var color = '#1e79ff';
            //Color usuer
            let colorU = '#EE5F27';

            //Si encuentra al usuario
            if(key < 3 && EPT.ranking[key]['usuario'] == nombre){

                this.add.text(game.world.width/4, sep, (parseInt(key)+1)+'.-'+ EPT.ranking[key]['usuario'], { font: '40px Varela Round', fill: colorU });
                this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: '40px Varela Round', fill: colorU });
                encontrado = true;
                sep+=50;

            }else if(key < 3){//Si no es el usuario y key es menor
                this.add.text(game.world.width/4, sep, (parseInt(key)+1)+'.-'+ EPT.ranking[key]['usuario'], { font: '40px Varela Round', fill: color });
                this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: '40px Varela Round', fill: color });
                sep+=50;

                //Si es el usuario y key es mayor q 8
            }else if(key > 3 && EPT.ranking[key]['usuario'] == nombre && encontrado == false){

                this.add.text(game.world.width/4, sep, '...', { font: '40px Varela Round', fill: colorU });
                sep+=50;
                this.add.text(game.world.width/4, sep, (parseInt(key)+1)+'.-'+ EPT.ranking[key]['usuario'], { font: '40px Varela Round', fill: colorU });
                this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: '40px Varela Round', fill: colorU });
                break;//Termino la búsqueda
            }                  
        }//Fin del for para mostrar el ranking

    },
    next: function() {
        game.destroy();
        document.getElementById("next").click();
    },
    //Cuando el usuario clica se llama a esta funcion
    //Mientras este el botón presionado la escla en x aumentará
    //Se auto llama hasta que deja de presionar
    clica: function() {
        game.input.onDown.remove(this.clica, this);
        game.input.onUp.add(this.deajaDeClicar, this);
        this.growTween = game.add.tween(this.square.scale).to({
            x: 1
        }, 1000, Phaser.Easing.Linear.None, true);
    },
    //Se llama a esta funcion desde clica cuando deja de clicar
    deajaDeClicar: function() {        

        //Le doy 4 segundos y reinicio o muestro la pantalla GameOver
        game.time.events.add(Phaser.Timer.SECOND *4 , function() {
            this.updateLevel();  
            if(EPT._vidas==0){
                this.muestraRanking();
                this.screenGameoverGroup.visible = true;
            }         
        }, this);

        //Para que no siga ejecutandose la funcion
        this.input.onUp.remove(this.deajaDeClicar, this);
        this.growTween.stop();
        this.rotateTween.stop();
        this.rotateTween = game.add.tween(this.square).to({
            angle: 0
        }, 300, Phaser.Easing.Cubic.Out, true);

        //Cae por el agujero
        if (this.square.width <= this.rightSquare.x - this.leftSquare.x) {
            EPT._vidas--;
            message = 'Oh no!!';
            this.rotateTween.onComplete.add(function() {
                this.fallTween = game.add.tween(this.square).to({
                    y: game.height + this.square.height
                }, 600, Phaser.Easing.Cubic.Out, true);
            }, this);
            this.motoTween = game.add.tween(this.motero).to({
                x: game.world.width / 2
            }, 1500, Phaser.Easing.Linear.Out, true);
            this.motoTween.onComplete.add(function() {
                //humo  
                var humo = game.add.sprite(this.motero.x, this.motero.y, 'humo');
                humo.scale.setTo(0.5);
                humo.anchor.set(0.5, 0.5);
                game.world.bringToTop(humo);
                this.add.tween(humo).to({
                    alpha: 0
                }, 1000, Phaser.Easing.Linear.None, true);
                this.motero.x = game.world.width + 150;
                this.moteroCae.x = game.world.width / 2;
                this.moteroCae.animations.add('cae', [0, 1, 2, 3], 10, false);
                this.moteroCae.animations.play('cae');
                this.fallMotoTween = game.add.tween(this.moteroCae).to({
                    y: game.height + this.moteroCae.height,
                    angle: -45
                }, 1000, Phaser.Easing.Cubic.Out, true);
                this.fallMotoTween.onComplete.add(function() {
                    this.emitter = game.add.emitter(game.world.width / 2, game.world.height - 10, 10);
                    this.emitter.makeParticles(['tuerca', 'tornillo', 'ruedaDent', 'ruedaDent2', 'rueda', 'gorra', 'zapato', 'retrovisor', 'faroTras', 'faroDel']);
                    this.emitter.explode(false, 5000, 500, 500);
                    
                });
            }, this);
        } else { //NO cae pero
            //Si cabe
            if (this.square.width <= this.rightWall.x - this.leftWall.x) {
                var destY = game.height - this.leftSquare.height - this.square.height / 2;
                this.square.successful++;
                this.level++;
                this.motoTween = game.add.tween(this.motero).to({
                    x: -70
                }, 3000, Phaser.Easing.Linear.Out, true);
                this.motoTween.onComplete.add(function() {
                    this.motero.x = game.world.width + 150;
                    //Muestro la pantalla de ok  
                                     
                }, this);
            //No entra
            } else { 
                EPT._vidas--;
                game.time.events.add(500, function() {
                    this.motoTween = game.add.tween(this.motero).to({
                        x: game.world.width / 2 + this.square.width / 2 + 60
                    }, 500, Phaser.Easing.Linear.Out, true);
                    this.motoTween.onComplete.add(function() {
                        let crash = this.motoCrash.animations.add('crash', [0, 1, 2, 3], 25, false);
                        this.motoCrash.animations.play('crash');
                        this.motoCrash.x = game.world.width + 100;
                        //boom  
                        var boom = game.add.sprite(this.motero.x - 50, this.motero.y, 'boom');
                        boom.anchor.set(0.5, 0.5);
                        game.world.bringToTop(boom);
                        this.motero.x = game.world.width + 150;
                        this.add.tween(boom).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Cubic.None, true);
                    }, this);
                }, this);
                var destY = game.height - this.leftSquare.height - this.leftWall.height - this.square.height / 2;
                message = 'Oh no!!';                
            }
            var noEntra = game.add.tween(this.square).to({
                y: destY
            }, 600, Phaser.Easing.Bounce.Out, true);
            noEntra.onComplete.add(function() {
                 
             },this);
        }
    }
};

///////////////////////////////////////////////////////////////////////////////
//////////////////////////		Start			///////////////////////////////
///////////////////////////////////////////////////////////////////////////////


	var game = new Phaser.Game(640, 960, Phaser.CANVAS);
	var states = {
		'Boot': EPT.Boot,
		'Preloader': EPT.Preloader,
		'MainMenu': EPT.MainMenu,
		'Achievements': EPT.Achievements,
		'Story': EPT.Story,
		'Game':EPT.Game	
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






