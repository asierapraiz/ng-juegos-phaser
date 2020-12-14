EPT.History = function(game) {};
EPT.History.prototype = {
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
		EPT._playAudio('click');
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