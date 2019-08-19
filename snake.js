// Yejee Lee

(function() {
	const cvs = document.getElementById("snake");

	const ctx = cvs.getContext("2d");

	// create the unit
	const box = 32;

	// start of the y-axis for game canvas
	let y1 = box * 2;
	
	// x-axis length: 608
	let width = box * 18;

	// y-axis length: 608
	let height = box * 18;

	// call update frunction every 100 ms
	let game = setInterval(update, 100);

	// load background image
	const ground = new Image();
	ground.src = "img/ground.png";

	// load apple food image
	const foodImg = new Image();
	foodImg.src = "img/food.png";

	// load audio files
	let dead = new Audio();
	let eat = new Audio();
	let playingMusic = new Audio();
	dead.src = "audio/dead.mp3";
	eat.src = "audio/eat.mp3";
	playingMusic.src = "audio/game_song.mp3";

	// initialize score variable
	let score = 0;

	// create the placeholder for the position of snake's body
	let snake = [];

	// Initialize the snake's position
	snake[0] = {
		x : 9 * box,
		y : 10 * box
	}

	// create direction placeholder
	let d;

	// create the food placeholder
	let food;


	// Initial conditions to make the starter food
	addFood();


	// Adds keyboard functionality by checking if any key is pressed
	document.addEventListener("keydown", direction);

	// snake old head position
	let snakeX = snake[0].x;
	let snakeY = snake[0].y;

	/**
	 * Adds a food object at a random position inside the canvas
	 */
	function addFood() {
		food = {
			x : Math.floor(Math.random()*18) * box,
			y : Math.floor(Math.random()*16+2) * box
		}
	}

	/**
	 * Adds 'up', 'right', 'down', and 'left' arrow 
	 * key functionalities to the snake game
	 * @param {Object} event - keyboard event object
	 */
	function direction(event) {
		let key = event.keyCode;
		if(key == 37 && d != "RIGHT") {
			d = "LEFT";
		} else if(key == 38 && d != "DOWN") {
			d = "UP";
		} else if(key == 39 && d != "LEFT") {
			d = "RIGHT";
		} else if(key == 40 && d != "UP") {
			d = "DOWN";
		}
	}

	/**
	 * Draws out a rectangular snake based in the snake array
	 * Head of snake is blue color with black stroke.
	 * Body part is all sky-blue
	 */
	function drawSnake() {
		for(let i = 0; i < snake.length; i++) {
			ctx.fillStyle = (i == 0)? "blue" : "skyblue";
			ctx.fillRect(snake[i].x, snake[i].y, box, box);
			ctx.strokeStyle = "black";
			ctx.strokeRect(snake[i].x, snake[i].y, box, box);
		}
	}


	/**
	 * Change the direction of the snake "LEFT", "RIGHT",
	 *  "UP", and "DOWN". 
	 */
	function changeSnakeDirection() {
		if (d == "RIGHT") {
			// if the snake reaches the right-most edge of the canvas
			if (snake[0].x == width) {
				snakeX = 0;
			} else {
				snakeX += box;
			}
		} else if (d == "LEFT") {
			// if the snake reaches the left-most edge of the canvas
		 	if (snake[0].x == 0) {
				snakeX = width;
			} else {
				snakeX -= box;
			}
		} else if (d == "UP") {
			// if the snake reaches the top edge of the canvas
			if (snake[0].y == y1) {
				snakeY = height;
			} else {
				snakeY -= box;
			}
		} else if (d == "DOWN") {
			// if the snake reaches the bottom edge of the canvas
			if (snake[0].y == height) {
				snakeY = y1;
			} else {
				snakeY += box;
			}
		}

		// add new snake head
		let newHead = {
			x : snakeX,
			y : snakeY
		}

		snake.unshift(newHead);
	}
	
	/**
	 * Check if the snake head eat the food
	 * @returns {boolean} true if snake ate the food and false otherwise
	 */
	function snakeEatFood() {
		let eat = false;
		if(snakeX == food.x && snakeY == food.y) {
			eat = true;
			//eat.play();
		}
		return eat;
	}

	/**
	 * Check if the snake's head hits itself
	 * @returns {boolean} true if snake collide itself and false otherwise
	 */
	function snakeSelfCollide() {
		let collision = false;
		for(let i = 1; i < snake.length; i++) {
			if(snake[i].x == snakeX && snake[i].y == snakeY) {
				collision = true;
			}
		}
		return collision;
	}

	/**
	 * Update Score on canvas
	 */
	function updateScore() {
		ctx.fillStyle = "white";
		ctx.font = "45px Changa one"; 
		ctx.fillText(score, 2 * box, 1.6 * box);
	}

	/**
	 * Update snake and its move to canvas
	 */
	function update() {
		playingMusic.play();
		ctx.drawImage(ground,0,0);
		
		drawSnake();

		ctx.drawImage(foodImg, food.x, food.y);

		changeSnakeDirection();

		// situation when the snake eats the food
		if (snakeEatFood()) {
			eat.play();
			score++;
			addFood();
		} else {
			snake.pop();
		}

		// situation when the snake collide with itself
		if(snakeSelfCollide()) {
			dead.play();
			alert("YOU LOST! GAME OVER");
			clearInterval(game);
		}

		// showing scores on top of game screen
		updateScore();
	}

})();