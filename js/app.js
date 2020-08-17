// Global variables
const overlay = document.getElementById("overlay");
const overlayTitle = overlay.querySelector(".title");
const overlayButton = overlay.querySelector(".btn__reset");
const qwerty = document.getElementById("qwerty");
const phrase = document.getElementById("phrase");
const scoreboard = document.getElementById("scoreboard");
const hearts = scoreboard.querySelectorAll(".tries");
const phrases = ["A pair of pajamas", "Six little ducks", "Spaghetti marinara", "My dad is stronger", "A dime a dozen"];
let currentPhraseNumber = "";
let missed = 0;

//Functions
function getRandomNumber(maxValue) {
    const number = Math.floor(Math.random() * maxValue) + 1;
    return number;
}

function splitPhrase(phrase) {
    const phraseLetters = phrase.split('');
    return phraseLetters;
}

function getRandomPhraseAsArray(arr) {
    const arrayMaxIndex = arr.length - 1;
    let phraseNumber = getRandomNumber(arrayMaxIndex);
    // If the same phrase as last game was selected, increment phrase index to get new phrase
    if ( phraseNumber === currentPhraseNumber ) {
        // If there's room to increment the array index, do so
        if ( currentPhraseNumber < arrayMaxIndex ) {
            phraseNumber++;
        // Otherwise, start back at 0
        } else {
            phraseNumber = 0;
        }
    }
    currentPhraseNumber = phraseNumber;
    const phrase = phrases[phraseNumber];
    const arrayOfLetters = splitPhrase(phrase);
    return arrayOfLetters;
}

function addPhraseToDisplay(arr) {
    const ul = phrase.querySelector('ul');
    arr.forEach( char => {
        const li = document.createElement('li');
        li.textContent = char.toUpperCase();
        if ( li.textContent === " " ) {
            li.className = "space";
        } else {
            li.className = "letter";    
        }
        ul.appendChild(li);
    });
}

function checkQwertyLetter(clickedButton) {
    const letters = phrase.querySelectorAll(".letter");
    let letterReturn = null;
    letters.forEach( letter => {
        let letterText = letter.textContent.toLowerCase();
        if ( letterText === clickedButton ) {
            letter.classList.add("show");
            letterReturn = letterText;
        }
    });
    return letterReturn;
}

function chooseQwertyLetter(qwertyLetter) {
    qwertyLetter.classList.add("chosen");
    qwertyLetter.disabled = true;
    return qwertyLetter.textContent;
}

// :'(
function subtractHeart() {
    const numberOfHearts = hearts.length;
    let hiddenHeartCounter = 0;
    hearts.forEach( heart => {
        if ( heart.style.visibility === "hidden" ) {
            hiddenHeartCounter++;
        }
    });
    const numberOfVisibleHearts = numberOfHearts - hiddenHeartCounter;
    const lastVisibleHeartIndex = numberOfVisibleHearts - 1;
    hearts[lastVisibleHeartIndex].style.visibility = "hidden";
}

function showOverlay(className, msg) {
    overlay.className = className;
    overlayTitle.textContent = msg;
    overlayButton.textContent = "Reset game";
    // Allow player to see #phrase li transition before displaying screen
    setTimeout(() => {
        overlay.style.display = 'flex';
    }, 1000);
}

function checkWin() {
    const lettersInPhrase = phrase.querySelectorAll(".letter").length;
    const revealedLetters = phrase.querySelectorAll(".show").length;  
    if ( lettersInPhrase === revealedLetters ) {
        showOverlay("win", "Congratulations! You win.");
    } else if ( missed >= 5 ) {
        showOverlay("lose", "Sorry, you lost. Better luck next time!")
    }
}

function resetGame() {
    clearPhrase();
    resetQwerty();
    replenishHearts();
    runGame();
    missed = 0;
}

function clearPhrase() {
    const ul = phrase.querySelector("ul");
    const letters = phrase.querySelectorAll("li");
    letters.forEach(letter => {
        ul.removeChild(letter);
    });
}

function resetQwerty() {
    const buttons = qwerty.querySelectorAll("button");
    buttons.forEach( button => {
        button.className = "";
        button.disabled = false;
    });
}

function replenishHearts() {
    hearts.forEach( heart => {
        heart.style.visibility = 'visible';
    });
}

function runGame() {
    const newPhrase = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(newPhrase);
}

// Event listeners
overlay.addEventListener( "click", (e) => {
    const target = e.target;
    if  ( target.tagName === "A" ) {
        buttonText = target.textContent.toLowerCase();
        if ( buttonText === "start game") {
            runGame();
        }
        if ( buttonText === "reset game") {
            resetGame();
        }
        overlay.style.display = "none"
    }
});

qwerty.addEventListener("click", (e) => {
    const target = e.target;
    if ( target.tagName === "BUTTON" ) {
        let buttonText = chooseQwertyLetter(target);
        let buttonMatch = checkQwertyLetter(buttonText);
        if ( buttonMatch === null ) {
            subtractHeart();
            missed++;
        }
        checkWin();
    }
});