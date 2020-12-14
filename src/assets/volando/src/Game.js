EPT.Game = function(game) {};
EPT.Game.prototype = {
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
        for (var a = 1; a <= EPT._vidas; a++) {
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
        this.screenDiedTotalScore = this.add.text(this.world.width * 0.5, 400, 'Puntos totales: ' + EPT._totalScore, fontScoreWhite);
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
        this.buttonAudio.setFrames(EPT._audioOffset + 1, EPT._audioOffset + 0, EPT._audioOffset + 2);
        this.screenGameoverGroup = this.add.group();
        this.screenGameoverBg = this.add.sprite(0, 0, 'bg');
        this.screenGameoverBg.width = game.world.width;
        this.screenGameoverBg.height = game.world.height;
        this.screenGameoverText = this.add.text(this.world.width * 0.5, 50, 'Hasta la próxima.', fontTitle);
        this.screenGameoverText.anchor.set(0.5, 0);
        //this.screenGameoverBack = this.add.button(150, this.world.height-100, 'button-mainmenu', this.stateBack, this, 1, 0, 2);
        //this.screenGameoverBack.anchor.set(0,1);
        this.screenGameoverRestart = this.add.button(this.world.width - 100, this.world.height - 75, 'button-continue', this.tarea, this, 1, 0, 2);
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
        EPT._vidas--;
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
            if (EPT._vidas == 0) {
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
        EPT._playAudio('click');
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
        EPT._totalScore += this._score;
        this.screenDiedGroup.visible = true;
        this.currentTimer.stop();
        //this.screenDiedScore.setText('Puntos: '+this._score);
        this.diedScoreTween();
        EPT.Storage.setHighscore('EPT-highscore', this._score);
        //this.buttonDummy.exists=false;
    },
    stateGameover: function() {
        EPT._totalScore += this._score;
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
        EPT.Storage.setHighscore('EPT-highscore', this._score);
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
        var nuevoTotal = EPT._totalScore + this._score;
        this.screenDiedScore.setText('Puntos:' + this._score);
        this.screenDiedTotalScore.setText('Puntos totales:' + (EPT._totalScore - this._score));
        if (this._score) {
            this.tweenedPoints = EPT._totalScore;
            var pointsTween = this.add.tween(this);
            pointsTween.to({
                tweenedPoints: nuevoTotal
            }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function() {
                this.screenDiedTotalScore.setText('Puntos totales: ' + Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function() {
                this.screenDiedTotalScore.setText('Puntos totales: ' + EPT._totalScore);
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
                tweenedPoints: EPT._totalScore
            }, 1000, Phaser.Easing.Linear.None, true, 500);
            pointsTween.onUpdateCallback(function() {
                this.screenGameoverScore.setText(Math.floor(this.tweenedPoints));
            }, this);
            pointsTween.onComplete.addOnce(function() {
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
        EPT._playAudio('click');
        EPT._manageAudio('switch', this);
    },
    stateRestart: function() {
        EPT._playAudio('click');
        this.screenGameoverGroup.visible = false;
        this.gamePaused = false;
        this.runOnce = false;
        this.currentTimer.start();
        this.stateStatus = 'playing';
        this.state.restart(true);
    },
    stateBack: function() {
        EPT._playAudio('click');
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
        a.puntos = EPT._totalScore;
         
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
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#EE5F27";

	        //Si encuentra al usuario
			if(key < 3 && EPT.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 3){//Si no es el usuario y key es menor
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 3 && EPT.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/4, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }//Fin del for para mostrar el ranking

    },
    tarea: function() {
        //console.log('En tarea'+EPT._totalScore);
        //Tengo que enviar los puntos obtenidos.
        document.getElementById("puntos").value = EPT._totalScore;
        document.getElementById("formulario").submit();
    }
};