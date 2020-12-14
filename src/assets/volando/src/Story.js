EPT.Story = function(game) {};
EPT.Story.prototype = {
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
		
		for(var key in EPT.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#EE5F27";

	        //Si encuentra al usuario
			if(key < 9 && EPT.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 9){//Si no es el usuario y key es menor
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: color });
        		this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 9 && EPT.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/4, sep, "...", { font: "40px Varela Round", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+".-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-300, sep, EPT.ranking[key]['puntos'], { font: "40px Varela Round", fill: colorU });
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