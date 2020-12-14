var vidas=1;
var nombre="123";
var ranking=[
	{'usuario':'volando', 'puntos' : '50'},
	{'usuario':'ane', 'puntos' : '60'},
	{'usuario':'xela', 'puntos' : '55'},
	{'usuario':'maite', 'puntos' : '40'}
];

var url= "../../assets/123/";

// the game itself
var game;

var gameOptions = {

	// maximum length of the sum
	maxSumLen: 5,

	// local storage name used to save high score
	localStorageName: "oneplustwo",

	// time allowed to answer a question, in milliseconds
	timeToAnswer: 3000,

	// score needed to increase difficulty
	nextLevel: 400
}

// once the window has been completely loaded...
window.onload = function() {

	// create a 500x500 pixels game using CANVAS rendering
	game = new Phaser.Game(500, 500, Phaser.CANVAS);

	// create "PlayGame" state and start it
	game.state.add("PlayGame", playGame, true);
}

// "PlayGame" state
var playGame = function(game){}
playGame.prototype = {

	// when the state preloads...
    preload: function(){

        // making the game cover the biggest window area possible while showing all content
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;

		// do not pause the game when it loses focus
		game.stage.disableVisibilityChange = true;

        // changing background color
        game.stage.backgroundColor = 0x444444;

		// preloading images
		game.load.image("timebar", url+"img/timebar.png");

		// preloading a spritesheet where each sprite is 400x50 pixels
		game.load.spritesheet("buttons", url+"img/buttons.png", 400, 50);

    },

	// when the state has been created...
    create: function(){

		// it's not game over yet...
		this.isGameOver = false;

		// current score is set to zero
		this.score = 0;

		// we'll also keep track of correct answers
		this.correctAnswers = 0;

		// topScore gets the previously saved value in local storage if any, zero otherwise
		this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);

		// sumsArray is the array with all possible questions
		this.sumsArray = [];

		// rather than tossing a random question each time, I found easier
		// to store all possible questions in an array then draw a random question
		// each time. I just need an algorithm to generate all possible questions.

		// let's start building all possible questions with this loop
		// ranging from 1 (only one operator, like 1+1) to maxSumLen
		// (in this case 5, like 1+1+1+1-1-1)
		for(var i = 1; i < gameOptions.maxSumLen; i++){

			// defining sumsArray[i] as an array of three empty arrays
			this.sumsArray[i]=[[], [], []];

			// looping from 1 to 3, which are the possible results of each sum
			for(var j = 1; j <= 3; j++){

				// buildTrees is the core of the script, see it explained
				// some lines below
				this.buildThrees(j, 1, i, j);
			}
		}

		// try this! You will see all possible combinations
		console.log(this.sumsArray);

		// questionText is the text object which will display the question
		this.questionText = game.add.text(250 , 160, "-", {
			font: "bold 72px Arial"
		});

		// setting questionText registration point
		this.questionText.anchor.set(0.5);

		// scoreText will keep the current score
		this.scoreText = game.add.text(10, 10, "-", {
			font: "bold 24px Arial"
		});

		// loop to create the three answer buttons
		for(i = 0;i < 3; i++){

			// creation of the answer button, set to frame "i".
			// Calls checkAnswer callback function once triggered
			var numberButton = game.add.button(50, 250 + i * 75, "buttons", this.checkAnswer, this).frame = i;
		}

		// adding the time bar
		var numberTimer =  game.add.sprite(50, 250, "timebar");

		// creation of a graphic mask covering the three answer buttons
		this.buttonMask = game.add.graphics(50, 250);
		this.buttonMask.beginFill(0xffffff);
		this.buttonMask.drawRect(0, 0, 400, 200);
		this.buttonMask.endFill();
		numberTimer.mask = this.buttonMask;

		// method to ask next question
		this.nextNumber();
	},

	// buildThrees method, it will find all possible sums
	// arguments:
	// initialNumber: the first number. Each question always start with a positive number
	// currentIndex: it's the amount of operands already placed in the sum
	// limit: the max amount of operands allowed in the question
	// currentString: the string generated so far
	buildThrees: function(initialNummber, currentIndex, limit, currentString){

		// the possible operands, from -3 to 3, excluding the zero
		var numbersArray = [-3, -2, -1, 1, 2, 3];

		// looping from 0 to numbersArray's length
		for(var i = 0; i < numbersArray.length; i++){

			// "sum" is the sum between the first number and current numberArray item
			var sum = initialNummber + numbersArray[i];

			// output string is generated by the concatenation of current string with
			// current numbersArray item. I am adding a "+" if the item is greater than zero,
			// otherwise it already has its "-"
			var outputString = currentString + (numbersArray[i] < 0 ? "" : "+") + numbersArray[i];

			// if sum is between 1 and 3 and we reached the limit of operands we want...
			if(sum > 0 && sum < 4 && currentIndex == limit){

				// then push the output string into sumsArray[amount of operands][result]
				this.sumsArray[limit][sum - 1].push(outputString);
			}

			// if the amount of operands is still below the amount we want...
			if(currentIndex < limit){

				// recursively calling buildThrees, passing as arguments:
				// the current sum
				// the new amount of operands
				// the amount of operands we want
				// the current output string
				this.buildThrees(sum, currentIndex + 1, limit, outputString);
			}
		}
	},

	// this method asks next question
	nextNumber: function(){

		// updating score text
		this.scoreText.text = "Score: " + this.score.toString() + "\nBest Score: " + this.topScore.toString();

		// if we already answered more than one question...
		if(this.correctAnswers > 1){

			// stopping time tween
			this.timeTween.stop();

			// resetting mask horizontal position
			this.buttonMask.x = 50;
		}

		// if we already answered at least one question...
		if(this.correctAnswers > 0){

			// tween to slide out the mask, unvealing what's behind it
			this.timeTween = game.add.tween(this.buttonMask).to({
				x: -350
			}, gameOptions.timeToAnswer, Phaser.Easing.Linear.None, true);

			// callback to be triggered when the tween ends
			this.timeTween.onComplete.add(function(){

				// calling "gameOver" method. "?" is the string to display
				this.gameOver("?");
			}, this);
		}

		// drawing a random result between 0 and 2 (it will be from 1 to 3)
		this.randomSum = game.rnd.between(0, 2);

		// choosing question length according to current score
		var questionLength = Math.min(Math.floor(this.score / gameOptions.nextLevel) + 1, 4)

		// updating question text
		this.questionText.text = this.sumsArray[questionLength][this.randomSum][game.rnd.between(0, this.sumsArray[questionLength][this.randomSum].length - 1)];
	},

	// method to check the answer, the argument is the button pressed
	checkAnswer: function(button){

		// we check the answer only if it's not game over yet
		if(!this.isGameOver){

			// button frame is equal to randomSum means the answer is correct
			if(button.frame == this.randomSum){

				// score is increased according to the time spent to answer
     			this.score += Math.floor((this.buttonMask.x + 350) / 4);

				// one more correct answer
				this.correctAnswers++;

				// moving on to next question
				this.nextNumber();
     		}

			// wrong answer
     		else{

				// if it's not the first question...
     			if(this.correctAnswers > 1) {

					// stop the tween
					this.timeTween.stop();
     			}

				// calling "gameOver" method. "button.frame + 1" is the string to display
     			this.gameOver(button.frame + 1);
			}
		}
	},

	// method to end the game. The argument is the string to write
	gameOver: function(gameOverString){

		// changing background color
		game.stage.backgroundColor = "#ff0000";

		// displaying game over text
		this.questionText.text = this.questionText.text + " = " + gameOverString;

		// now it's game over
		this.isGameOver = true;

		// updating top score in local storage
		localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));

		// restart the game after two seconds
		game.time.events.add(Phaser.Timer.SECOND * 2, function(){
			game.state.start("PlayGame");
		}, this);
	}
}
