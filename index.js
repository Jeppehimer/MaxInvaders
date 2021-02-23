document.addEventListener("DOMContentLoaded", () => {
    const squares = document.querySelectorAll(".grid div");
    const resultDisplay = document.querySelector("#result");
    let width = 15;
    let currentShooterIndex = 202; //modify
    let currentInvaderIndex = 0;
    let alienInvadersTakenDown = [];
    let result = 0;
    let direction = 1;
    let invaderId;

    // define alien invaders
    const alienInvaders = [
         0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        15,16,17,18,19,20,21,22,23,24,
        30,31,32,33,34,35,36,37,38,39
    ];

    // draw the alien invaders
    alienInvaders
        .forEach( 
            invader => squares[currentInvaderIndex + invader]
                .classList.add("invader")
        );

    // draw the player ship
    squares[currentShooterIndex]
        .classList.add("shooter");

    // move the player ship left and right (preventing up and down)
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove("shooter");
        switch(e.code) {
            case "ArrowLeft":
                if (currentShooterIndex % width !== 0) {
                    currentShooterIndex--;                    
                } 
                break;
            case "ArrowRight":
                if (currentShooterIndex % width < width - 1) {
                    currentShooterIndex++;                    
                } 
                break;
            default: break;
        }
        squares[currentShooterIndex].classList.add("shooter");
    }
    // listener for player ship movement
    document.addEventListener("keydown", moveShooter);

    // move alien invaders across and down the screen on a time loop
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length-1] % width === width-1;

        if( (leftEdge && direction === -1) || (rightEdge && direction === 1) ) {
            direction = width;
        } else if (direction === width) {
            leftEdge ? 
                direction = 1 : 
                direction = -1;
        }
        for (let i=0; i < alienInvaders.length; i++) {
            squares[alienInvaders[i]].classList.remove("invader");
        }
        for (let i=0; i < alienInvaders.length; i++) {
            alienInvaders[i] += direction;
        }
        // don't include invaders that were shot
        for (let i=0; i < alienInvaders.length; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add("invader");
            }
        }

        // trigger GAME OVER if invaders reach player ship or reach the bottom of the screen.
        if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
            resultDisplay.textContent = "GAME OVER INSERT BITCOINS TO CONTINUE";
            squares[currentShooterIndex].classList.add("boom");
            clearInterval(invaderId);
        }
        for (let i=0; i < alienInvaders.length; i++) {
            if (alienInvaders[i] >= (squares.length - width)) {
                resultDisplay.textContent = "GAME OVER INSERT BITCOINS TO CONTINUE";
                clearInterval(invaderId);
            }
        }

        // trigger YOU WON
        if (alienInvadersTakenDown.length === alienInvaders.length){
            resultDisplay.textContent = "YOU WIN";
            clearInterval(invaderId);
        }
    }
    invaderId = setInterval(moveInvaders, 500);

    // shoot lasers at invaders
    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        // move the laser from the player ship up the screen
        function moveLaser() {
            squares[currentLaserIndex].classList.remove("laser");
            currentLaserIndex -= width;
            squares[currentLaserIndex].classList.add("laser");
            // laser hits and kills alien
            if (squares[currentLaserIndex].classList.contains("invader")) {
                squares[currentLaserIndex].classList.remove("laser");
                squares[currentLaserIndex].classList.remove("invader");
                squares[currentLaserIndex].classList.add("boom");

                setTimeout( () => squares[currentLaserIndex].classList.remove("boom"), 100);
                clearInterval(laserId);

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result++;
                resultDisplay.textContent = result;
            }
            // laser reaches top of screen
            if (currentLaserIndex < width) {
                clearInterval(laserId)
                setTimeout( () => squares[currentLaserIndex].classList.remove("laser"), 100);
            }
        }

        switch(e.code) {
            case "Space":
                laserId = setInterval(moveLaser, 100);
                break;
            default:
                break;
        }
    }

document.addEventListener("keyup", shoot)


});