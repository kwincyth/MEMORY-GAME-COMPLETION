const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");
const highScoreElement = document.getElementById("high-score"); // Element to display high score
const resetHighScoreButton = document.getElementById("reset-high-score"); // Button to reset high score
const timeHighScoreElement = document.getElementById("time-high-score"); // Element to display time high score

let cards;
let interval;
let firstCard = false;
let secondCard = false;

// High score from localStorage for moves
let highScore = localStorage.getItem("highScore") || Infinity; // Set to Infinity to easily compare with lower scores
// High score from localStorage for time
let timeHighScore = localStorage.getItem("timeHighScore") || Infinity; // Set to Infinity to easily compare times

//Items array
const items = [
  { name: "bee", image: "bee.png" },
  { name: "crocodile", image: "crocodile.png" },
  { name: "macaw", image: "macaw.png" },
  { name: "gorilla", image: "gorilla.png" },
  { name: "tiger", image: "tiger.png" },
  { name: "monkey", image: "monkey.png" },
  { name: "chameleon", image: "chameleon.png" },
  { name: "piranha", image: "piranha.png" },
  { name: "anaconda", image: "anaconda.png" },
  { name: "sloth", image: "sloth.png" },
  { name: "cockatoo", image: "cockatoo.png" },
  { name: "toucan", image: "toucan.png" },
];

//Initial Time
let seconds = 0, minutes = 0;
let movesCount = 0, winCount = 0;

// Display initial high scores
if (highScore !== Infinity) {
  highScoreElement.innerHTML = `<span>High Score:</span> ${highScore} moves`;
} else {
  highScoreElement.innerHTML = `<span>High Score:</span> N/A`;
}

if (timeHighScore !== Infinity) {
  let minutesValue = Math.floor(timeHighScore / 60);
  let secondsValue = timeHighScore % 60;
  timeHighScoreElement.innerHTML = `<span>Best Time:</span> ${minutesValue}:${secondsValue < 10 ? '0' + secondsValue : secondsValue}`;
} else {
  timeHighScoreElement.innerHTML = `<span>Best Time:</span> N/A`;
}

// For timer
const timeGenerator = () => {
  seconds += 1;
  if (seconds >= 60) {
    minutes += 1;
    seconds = 0;
  }
  let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
  let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
  timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
};

// For calculating moves
const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

// Update high score if current moves count is lower
const updateHighScore = () => {
  if (movesCount < highScore) {
    highScore = movesCount;
    localStorage.setItem("highScore", highScore); // Store new high score in localStorage
    highScoreElement.innerHTML = `<span>High Score:</span> ${highScore} moves`;
  }
};

// Update time high score if current time is lower
const updateTimeHighScore = () => {
  let totalTimeInSeconds = minutes * 60 + seconds;
  if (totalTimeInSeconds < timeHighScore) {
    timeHighScore = totalTimeInSeconds;
    localStorage.setItem("timeHighScore", timeHighScore); // Store new time high score in localStorage
    let minutesValue = Math.floor(timeHighScore / 60);
    let secondsValue = timeHighScore % 60;
    timeHighScoreElement.innerHTML = `<span>Best Time:</span> ${minutesValue}:${secondsValue < 10 ? '0' + secondsValue : secondsValue}`;
  }
};

// Reset the high scores
resetHighScoreButton.addEventListener("click", () => {
  localStorage.removeItem("highScore");
  localStorage.removeItem("timeHighScore");
  highScore = Infinity;
  timeHighScore = Infinity;
  highScoreElement.innerHTML = `<span>High Score:</span> N/A`;
  timeHighScoreElement.innerHTML = `<span>Best Time:</span> N/A`;
});

// Pick random objects from the items array
const generateRandom = (size = 4) => {
  let tempArray = [...items];
  let cardValues = [];
  size = (size * size) / 2;
  for (let i = 0; i < size; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    cardValues.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1);
  }
  return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
  gameContainer.innerHTML = "";
  cardValues = [...cardValues, ...cardValues];
  cardValues.sort(() => Math.random() - 0.5);
  for (let i = 0; i < size * size; i++) {
    gameContainer.innerHTML += `
     <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
     </div>
     `;
  }
  gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;

  cards = document.querySelectorAll(".card-container");
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.classList.contains("matched")) {
        card.classList.add("flipped");
        if (!firstCard) {
          firstCard = card;
          firstCardValue = card.getAttribute("data-card-value");
        } else {
          movesCounter();
          secondCard = card;
          let secondCardValue = card.getAttribute("data-card-value");
          if (firstCardValue == secondCardValue) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            firstCard = false;
            winCount += 1;
            if (winCount == Math.floor(cardValues.length / 2)) {
              result.innerHTML = `<h2>You Won</h2>
            <h4>Moves: ${movesCount}</h4>`;
              updateHighScore(); // Update high score for moves
              updateTimeHighScore(); // Update high score for time
              stopGame();
            }
          } else {
            let [tempFirst, tempSecond] = [firstCard, secondCard];
            firstCard = false;
            secondCard = false;
            let delay = setTimeout(() => {
              tempFirst.classList.remove("flipped");
              tempSecond.classList.remove("flipped");
            }, 900);
          }
        }
      }
    });
  });
};

// Start game
startButton.addEventListener("click", () => {
  movesCount = 0;
  seconds = 0;
  minutes = 0;
  controls.classList.add("hide");
  stopButton.classList.remove("hide");
  startButton.classList.add("hide");
  interval = setInterval(timeGenerator, 1000);
  moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
  initializer();
});

// Stop game
stopButton.addEventListener(
  "click",
  (stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
  })
);

// Initialize values and func calls
const initializer = () => {
  result.innerText = "";
  winCount = 0;
  let cardValues = generateRandom();
  matrixGenerator(cardValues);
};
