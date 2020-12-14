EPT.Game = function(game) {};
EPT.Game.prototype = {
    create: function() {
        this.level = 1;
        this._score = 0;        
        this.bg = this.add.image(0, 0, "bg");
        this.bg.height = game.height;
        this.bg.width = game.width;

        //Gestion inputs
        this.bg.inputEnabled = true;             
        
        this.holeWidthRange = [40, 240];
        this.wallRange = [10, 70];       
        this.escalaBase = 1.2;       
        
        //Añado las suelos
        this.leftSquare = this.add.sprite(0, this.world.height, "base");
        this.leftSquare.anchor.set(1, 1);
        this.leftSquare.scale.setTo(this.escalaBase);
        this.rightSquare = this.add.sprite(this.world.width, this.world.height, "base");
        this.rightSquare.anchor.set(0, 1);
        this.rightSquare.scale.setTo(this.escalaBase);
        this.leftWall = this.add.sprite(0, this.world.height - this.leftSquare.height, "top");
        this.leftWall.anchor.set(1, 1);
        this.leftWall.scale.setTo(this.escalaBase);
        this.rightWall = this.add.sprite(this.world.width, this.world.height - this.rightSquare.height, "top");
        this.rightWall.anchor.set(0, 1);
        this.rightWall.scale.setTo(this.escalaBase);
        this.square = this.add.sprite(this.world.width / 2, -250, "square");
        this.square.anchor.set(0.5);
        this.square.successful = 0;
        this.square.scale.setTo(this.escalaBase);

        this.levelText = this.add.text(game.width / 2, 40, "Nivel " + this.level, {
            font: "bold 100px Baloo Thambi",
            fill: "#3582ff"
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
            font: "100px Baloo Thambi",
            fill: "#fff"
        };
        var fontScore = {
            font: "30px Baloo Thambi",
            fill: "#fff"
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
        this.screenGameoverMarco.tint="#6397cc";        
        this.screenGameoverContinue = this.add.button(this.world.width / 2, this.world.height - 20, 'button-continue', this.tarea, this, 1, 0, 2);
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

        console.log("vidas:"+EPT._vidas);
        //vidas
        if(this.vidas){
            this.vidas.destroy();
        }
        this.vidas = this.add.group();
        for(var a=1;a<=EPT._vidas;a++){
            let vida=this.add.image(50*a, 60, "pizza");
            vida.scale.setTo(0.2,0.2);
            vida.anchor.set(0, 1);
            this.vidas.add(vida);
        }
        

        this.levelText.text = "NIVEL "+this.level ;
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
        document.getElementById("puntos").value = EPT._totalScore;
        document.getElementById("formulario").submit();
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
            message = "Oh no!!";
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
                var humo = game.add.sprite(this.motero.x, this.motero.y, "humo");
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
                        var boom = game.add.sprite(this.motero.x - 50, this.motero.y, "boom");
                        boom.anchor.set(0.5, 0.5);
                        game.world.bringToTop(boom);
                        this.motero.x = game.world.width + 150;
                        this.add.tween(boom).to({
                            alpha: 0
                        }, 1000, Phaser.Easing.Cubic.None, true);
                    }, this);
                }, this);
                var destY = game.height - this.leftSquare.height - this.leftWall.height - this.square.height / 2;
                message = "Oh no!!";                
            }
            var noEntra = game.add.tween(this.square).to({
                y: destY
            }, 600, Phaser.Easing.Bounce.Out, true);
            noEntra.onComplete.add(function() {
                 
             },this);
        }
    }
};