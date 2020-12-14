// (function(){
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
// })();
