const game = document.querySelector("#game");
const grid = document.createElement("section");
const span = document.querySelector("span");
const button = document.querySelector("button");

grid.setAttribute("class", "grid");

game.appendChild(grid);

let count = 0;
let firstGuess = "";
let secondGuess = "";

let previousTarget = null;
let delay = 1000;

let moveCount = 0;
let countCardFlipped = 0;

// Card data
const cardsArray = [
    {
      name: 'alakazam',
      img: 'image/alakazam.jpg',
    },
    {
      name: 'dragonair',
      img: 'image/dragonair.jpg',
    },
    {
      name: 'eevee',
      img: 'image/eevee.jpg',
    },
    {
      name: 'lapras',
      img: 'image/lapras.jpg',
    },
    {
      name: 'lickitung',
      img: 'image/lickitung.jpg',
    },
    {
      name: 'machamp',
      img: 'image/machamp.jpg',
    },
    {
      name: 'magikarp',
      img: 'image/magikarp.jpg',
    },
    {
      name: 'meowth',
      img: 'image/meowth.jpg',
    },
    {
      name: 'mew',
      img: 'image/mew.jpg',
    },
    {
      name: 'moltres',
      img: 'image/moltres.jpg',
    },
    {
      name: 'onix',
      img: 'image/onix.jpg',
    },
    {
      name: 'pikachu',
      img: 'image/pikachu.jpg',
    },
  ]

let gameGrid = cardsArray.concat(cardsArray);

// Randomize game grid on each load
gameGrid.sort(() => 0.5 - Math.random());

gameGrid.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.name = item.name;

    const front = document.createElement("div");
    front.classList.add("front");

    const back = document.createElement("div");
    back.classList.add("back");
    back.style.backgroundImage = `url(${item.img})`;

    grid.appendChild(card);
    card.appendChild(front);
    card.appendChild(back);
});

// Add event listener to grid
grid.addEventListener('click', function(event) {
    // The event target is our clicked item
    let clicked = event.target;
  
    // Do not allow the grid section itself to be selected; only select divs inside the grid
    if (clicked.tagName === 'SECTION' || clicked === previousTarget || 
        clicked.parentElement.classList.contains("selected")) {
        return;
    }
  
    if (count < 2) {
        count++;
        if (count === 1) {
            // Assign first guess
            firstGuess = clicked.parentElement.dataset.name;
            clicked.parentElement.classList.add('selected');
        } else {
            // Assign second guess
            secondGuess = clicked.parentElement.dataset.name;
            clicked.parentElement.classList.add('selected');
        }
        // If both guesses are not empty...
        if (firstGuess !== '' && secondGuess !== '') {
            // and the first guess matches the second match...
            if (firstGuess === secondGuess) {
                countCardFlipped++;
                const img = "image/" + clicked.parentElement.dataset.name + ".jpg";
                setTimeout(match(img), delay);
                setTimeout(resetGuesses, delay);
            }
            else {
                setTimeout(resetGuesses, delay);
            }
        }
        previousTarget = clicked;
    }


    moveCount++;
    span.innerText = moveCount;

    if(countCardFlipped === 12) {
      setTimeout(finishMessage, 1000);
      countCardFlipped = 0;
    }
});

// Add match CSS
const match = (img) => {
    let selected = document.querySelectorAll('.selected')
    selected.forEach(card => {
      card.classList.add('match');
      card.style.backgroundImage = `url(${img})`;
    });
}

const resetGuesses = () => {
    firstGuess = "";
    secondGuess = "";
    count = 0;
    previousTarget = null;
  
    var selected = document.querySelectorAll('.selected');
    selected.forEach(card => {
      card.classList.remove('selected');
    });
}

const saveScoreToStorage = (score) => {
  const lowestScore = JSON.parse(localStorage.getItem("SCORE"));
  // console.log("lowestScore.score", lowestScore[0]);
  const playerScore = [{bestScore: score}];

  if(lowestScore) {
    if(lowestScore[0].bestScore <= playerScore[0].bestScore) {
      return lowestScore[0].bestScore;
    }
    else {
      localStorage.removeItem("SCORE");
      localStorage.setItem("SCORE", JSON.stringify(playerScore));
      return playerScore[0].bestScore;
    }
  }
  else {
    localStorage.setItem("SCORE", JSON.stringify(playerScore));
    const score = JSON.parse(localStorage.getItem("SCORE"))
    return score[0].bestScore;
  }
}

const finishMessage = () => {
  alert(`Your lowest score: ${saveScoreToStorage(moveCount)}`);
}

const resetGame = () => {
  window.location.reload();
}

button.addEventListener("click", resetGame);
