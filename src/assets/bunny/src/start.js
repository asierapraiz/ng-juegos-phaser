// (function(){
	var game = new Phaser.Game(640, 960, Phaser.CANVAS);

	//  The Google WebFont Loader will look for this object, so create it before loading the script.
	WebFontConfig = {

	    //  'active' means all requested fonts have finished loading
	    //  We set a 1 second delay before calling 'createText'.
	    //  For some reason if we don't the browser cannot render the text the first time it's created.
	   

	    //  The Google Fonts we want to load (specify as many as you like in the array)
	    google: {
	      families: ['Revalia','Boogaloo']
	    }

	};
	
	var states = {
		'Boot': EPT.Boot,
		'Preloader': EPT.Preloader,
		'MainMenu': EPT.MainMenu,
		'Achievements': EPT.Achievements,
		'Story': EPT.Story,
		'History': EPT.History,
		'Game': EPT.Game
	};

	
	for(var state in states)
		game.state.add(state, states[state]);
	
	game.state.start('Boot');
// })();
