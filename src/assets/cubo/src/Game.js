EPT.Game = function(game) {};
EPT.Game.prototype = {
    create: function() {

        this._score = EPT._totalScore;
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

        for(var a=1;a<=EPT._vidas;a++){
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

        this.buttonAudio.setFrames(EPT._audioOffset+1, EPT._audioOffset+0, EPT._audioOffset+2);

        this.screenDiedGroup = this.add.group();
        this.screenDiedSplash = this.add.sprite(game.width/2 , game.height/2 , 'splash');
        this.screenDiedSplash.width=game.width;
        this.screenDiedSplash.height=game.height;
        this.screenDiedSplash.anchor.set(0.5);
        this.screenDiedSplash.scale.setTo(0,0);

        this.screenDiedCaras = this.add.sprite(game.width/2, game.height/2, 'caras_splash',EPT._vidas);
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
        let el=EPT._floor.shift();
        //this.nextY=el;
        EPT._floor.push(el); 
           

        return el;

    },
    tocado: function() {
       
        

        this.hero.body.enable = false;
        this.hero.visible = false;
        this.cara.visible = false;

        this.vidas.children[this.vidas.children.length - 1].frame = 1;        
        EPT._vidas--;        
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

                if(EPT._vidas==0){
                    a.stateGameover();            
                    

                }else{  

                    
                    a.restart();
                  
                }
            });
            
                
        }, this);


            

       
        //game.tweens.pauseAll();

        /*this.screenDiedScore.setText('Bloques: '+this._score);
        this.screenDiedMaxScore.setText('Máximo: '+EPT._totalScore);
        EPT.Storage.setHighscore('EPT-highscore', this._score);*/


        //this.screenDiedScore.setText('Puntos: '+this._score);
        //this.diedScoreTween();
        
        //this.buttonDummy.exists=false;
            
    },
    addPoints: function() {
        this.cara.frame = 10;
        this._score += 10;
        this.textScore.setText(this._score);
          
        EPT._totalScore += 10;     
    },
    stateGameover: function() { 
               
        game.tweens.pauseAll(); 
        this.screenDiedGroup.visible = true;        
        this.screenGameoverGroup.visible = true;        
        this.muestraRanking();
        //this.currentTimer.stop();
        
        //this.gameoverScoreTween();
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
    restart: function() {        
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
    },
    muestraRanking: function() {
        let sep = 200;
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
            let colorU = "#fff";

            //Si encuentra al usuario
            if(key < 3 && EPT.ranking[key]['usuario'] == nombre){

                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
                this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
                encontrado = true;
                sep+=50;

            }else if(key < 3){//Si no es el usuario y key es menor
                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
                this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
                sep+=50;

                //Si es el usuario y key es mayor q 8
            }else if(key > 3 && EPT.ranking[key]['usuario'] == nombre && encontrado == false){

                this.add.text(game.world.width/6, sep, "...", { font: "40px Varela Round", fill: colorU });
                sep+=50;
                this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
                this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
                break;//Termino la búsqueda
            }                  
        }//Fin del for para mostrar el ranking

    },
    tarea: function() {
        //Tengo que enviar los puntos obtenidos.
        document.getElementById("puntos").value=EPT._totalScore;            
        document.getElementById("formulario").submit();
    }
};
