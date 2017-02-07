//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = STAGE_WIDTH;
stage.height = STAGE_HEIGHT;
stage.onclick = mouseClicked;

var ctx = stage.getContext("2d");
ctx.fillStyle = "white";
ctx.font = GAME_FONTS;
var preGame = true;

//---------------
//Preloading ...
//---------------
//Preload Art Assets
// - Sprite Sheet: Image API:
// http://www.html5canvastutorials.com/tutorials/html5-canvas-images/
var charImage = new Image();
charImage.ready = false;
charImage.onload = setAssetReady;
charImage.src = PATH_JUSTIN;  // source image location set in constants.js

var diplomaPositions = [{x: 300, y: 0}, {x: 450, y:250}, {x:600, y:150}];
var diploma1 = new Image();
diploma1.src = PATH_DIPLOMA;
var diploma2 = new Image();
diploma2.src = PATH_DIPLOMA;
var diploma3 = new Image();
diploma3.src = PATH_DIPLOMA;

var score = 0;

function setAssetReady()
{
	this.ready = true;
}

//Display Preloading
ctx.fillRect(0,0,stage.width,stage.height);
ctx.fillStyle = "#000";
ctx.fillText(TEXT_PRELOADING, TEXT_PRELOADING_X, TEXT_PRELOADING_Y);
var preloader = setInterval(preloading, TIME_PER_FRAME);
var gameloop;
var spriteLoop;

function preloading()
{
	if (charImage.ready)
	{
		clearInterval(preloader);
		spriteLoop = setInterval(updateSprites, TIME_PER_FRAME);
		gameloop = setInterval(update, 10);
		scoreloop = setInterval(UpdateScore, 2000);
	}
}

function mouseClicked() {
		if(preGame) { // Start game, set initial game conditions
			preGame = false;
			xPosition = 0;
		} else if (yPosition > 0) { // Click to make flappy justin jump if he's not at the top
			yPosition -= 30;
		}
}

//------------
//Game Loop
//------------
var spriteX = IMAGE_START_X;
var spriteY = IMAGE_START_Y;

var xPosition = CHAR_START_X;
var yPosition = CHAR_START_Y;

// Show the beginning screen and reset starting variables
function PreGame() {
	xPosition = CHAR_START_X;
	yPosition = CHAR_START_Y;
	ctx.font = "30px Lucida Console";
	ctx.fillStyle = "white";
	ctx.fillText("FLAPPY JUSTIN",35,100);
	score = 0;

	if(spriteX < 100 || spriteX > 200) { // alternate displaying the click to play text
		ctx.font = "20px Lucida Console";
		ctx.fillText("CLICK TO PLAY",75,250);
	}
}

function animateJustin() {
	if(spriteX < 300) {
		spriteX += SPRITE_WIDTH;
	} else {
		spriteX = 0;
	}

}

function updateSprites() {
		this.animateJustin();
}

function update()
{
	//Clear Canvas
	ctx.fillStyle = "lightblue";
	ctx.fillRect(0, 0, stage.width, stage.height);
	// Draw flappy justin
	ctx.drawImage(charImage,
					spriteX, spriteY,            // sprite upper left positino
					CHAR_WIDTH,CHAR_HEIGHT, // size of a sprite 72 x 96
					xPosition, yPosition,  // canvas position
					1*CHAR_WIDTH,1*CHAR_HEIGHT      // sprite size shrinkage
					);
	if(preGame) {
		this.PreGame();
	} else {
		yPosition += 1;
		this.CheckFall();
		this.AdjustDiplomas();
		this.CheckCollision();
		ctx.font = "20px Lucida Console";
		ctx.fillStyle = "green";
		ctx.fillText("SCORE: " + score, 185, 290);
	}
}

// We can't let flappy Justin fall to the ground
function CheckFall() {
	if(yPosition > 300) {
		preGame = true;
	}
}

// Move the diplomas left continuously, and give them random Y's when they restart
function AdjustDiplomas() {
	for (var i = 0; i < 3; i++) {
		var diplomaPosition = diplomaPositions[i];
		if(diplomaPosition.x < -50) {
			diplomaPosition.x = 450;
			var randomY = Math.random() * 300;
			diplomaPosition.y = randomY;
		} else {
			diplomaPosition.x -= 1;
		}
	}
	ctx.drawImage(diploma1,
					0, 0,            // sprite upper left positino
					DIPLOMA_WIDTH, DIPLOMA_HEIGHT, // size of a sprite 72 x 96
					diplomaPositions[0].x, diplomaPositions[0].y,  // canvas position
					1*DIPLOMA_WIDTH,1*DIPLOMA_HEIGHT      // sprite size shrinkage
					);

	ctx.drawImage(diploma2,
					0, 0,            // sprite upper left positino
					DIPLOMA_WIDTH, DIPLOMA_HEIGHT, // size of a sprite 72 x 96
					diplomaPositions[1].x, diplomaPositions[1].y,  // canvas position
					1*DIPLOMA_WIDTH,1*DIPLOMA_HEIGHT      // sprite size shrinkage
					);

	ctx.drawImage(diploma3,
					0, 0,            // sprite upper left positino
					DIPLOMA_WIDTH, DIPLOMA_HEIGHT, // size of a sprite 72 x 96
					diplomaPositions[2].x, diplomaPositions[2].y,  // canvas position
					1*DIPLOMA_WIDTH,1*DIPLOMA_HEIGHT      // sprite size shrinkage
					);
}

// Check if flappy Justin collides with a diploma
function CheckCollision() {
	for (var i = 0; i < 3; i++) { // loop through diploma positions
		var diplomaPosition = diplomaPositions[i];
		var spriteX = xPosition + CHAR_WIDTH - 40;
		var collisionX = spriteX >= diplomaPosition.x && spriteX <= diplomaPosition.x + DIPLOMA_WIDTH;
		var freeY = yPosition + 25 > diplomaPosition.y + 192 || yPosition + 75 < diplomaPosition.y;
		if (collisionX && !freeY) {
			this.GameOver();
		}
	}
}

// IF he collides, it's game over
	function GameOver() {
		alert("GAME OVER");
		diplomaPositions = [{x: 300, y: 0}, {x: 450, y:250}, {x:600, y:150}];
		preGame = true;
		score = 0;
	}

	function UpdateScore() {
		if (!preGame){
			score++;
		}
	}
