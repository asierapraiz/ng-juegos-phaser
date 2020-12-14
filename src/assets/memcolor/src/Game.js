
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





EPT.Game = function(game){}

EPT.Game.prototype = {
    
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
                    EPT._playAudio('acierto');                    
                    this.addPoints(b);          
                   
               }
               else{
                    // si no acierto, muestro el acual color del círculo
                    //this.nuevosErrores, son los fallos de este intento
                    EPT._playAudio('error');
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
          EPT._playAudio('click');
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
          EPT._playAudio('click');
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

          EPT._playAudio('audio-acierto');
          //this.add.tween(this.screenPausedBombilla.scale).to({x: 0.7, y:0.7}, 1000, Phaser.Easing.Exponential.Out, true);
          
          //this.screenPausedBombilla.animations.add('enciende',[0,1,2],25, false);  
          //this.screenPausedBombilla.animations.play('enciende');
          this.screenPausedGroup.visible = true;
          this.pausedScoreTween(); 

          
     },
     stateRestart: function() {
          EPT._playAudio('click');
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
          EPT.Storage.setHighscore('EPT-highscore',puntos);
          
     },
     statePlaying: function() {
          this.screenPausedGroup.visible = false;         
          
     },
     stateBack: function() {
          //EPT._playAudio('click');
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