EPT.Story = function(game) {};
EPT.Story.prototype = {
	create: function(){

		//Bg
		var bg=this.add.sprite(0,0,'storyBg');
		bg.width = game.width;
        bg.height = game.height;

        var marco=this.add.sprite(game.world.width/2,50,'crate');
        marco.width=550;
        marco.height=900;
        marco.anchor.setTo(0.5,0);
        marco.alpha=0.1;
        marco.tint="#6397cc";


		var textStory = this.add.text(game.width/3, 75, 'Ranking', { font: "45px Baloo Thambi", fill: "#fff" });
		
		//Añado el ranking
		var sep=150;//Posicion vertical de la primera linea
		
		for(var key in EPT.ranking){
			let encontrado=false;
			let color = "#1e79ff";
	        //var color = "#1e79ff";
	        //Color usuer
	        let colorU = "#fff";

	        //Si encuentra al usuario
			if(key < 10 && EPT.ranking[key]['usuario'] == nombre){

				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ EPT.ranking[key]['usuario'], { font: "40px Varela Round", fill: colorU });
        		this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: "40px Baloo Thambi", fill: colorU });
        		encontrado = true;
        		sep+=50;

			}else if(key < 10){//Si no es el usuario y key es menor
				this.add.text(game.world.width/6, sep, (parseInt(key)+1)+"-"+ EPT.ranking[key]['usuario'], { font: "40px Baloo Thambi", fill: color });
        		this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: "40px Baloo Thambi", fill: color });
        		sep+=50;

        		//Si es el usuario y key es mayor q 8
			}else if(key > 10 && EPT.ranking[key]['usuario'] == nombre && encontrado == false){

				this.add.text(game.world.width/6, sep, "...", { font: "40px Baloo Thambi", fill: colorU });
				sep+=50;
				this.add.text(game.world.width/4, sep, (parseInt(key)+1)+"-"+ EPT.ranking[key]['usuario'], { font: "40px Baloo Thambi", fill: colorU });
        		this.add.text(game.world.width-200, sep, EPT.ranking[key]['puntos'], { font: "40px Baloo Thambi", fill: colorU });
        		break;//Termino la búsqueda
			}			       
        }

		var buttonContinue = this.add.button(this.world.width-20, game.world.height-20, 'button-continue', this.clickContinue, this, 1, 0, 2);
		buttonContinue.scale.setTo(0.8);
		buttonContinue.anchor.set(1,1);
		buttonContinue.x = this.world.width+buttonContinue.width+20;
		
		this.add.tween(buttonContinue).to({x: this.world.width-20}, 500, Phaser.Easing.Exponential.Out, true);

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