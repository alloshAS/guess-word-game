// Game configuration
let gameName = "Guess The Word";
let gameData = null;
let currentLanguage = "en";
let currentCategory = "";
let wordToGuess = "";
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 4;
let activeDifficulty = "Easy";

// Initialize game
document.addEventListener('DOMContentLoaded', function() {
  loadGameData();
  setupEventListeners();
  updateGameTitle();
});

// Load game data from JSON
async function loadGameData() {
  try {
    const response = await fetch("words.json");
    gameData = await response.json();
    
    // Populate language selector
    populateLanguageSelector();
    
    // Set default language and category
    currentLanguage = document.getElementById('language-select').value;
    populateCategorySelector();
    
    // Set default category
    const categorySelect = document.getElementById('category-select');
    if (categorySelect.options.length > 0) {
      currentCategory = categorySelect.value;
    }
    
    // Load initial word
    selectRandomWord();
    
  } catch (error) {
    console.error("Error loading game data:", error);
    // Fallback to backup words
    gameData = {
      languages: {
        en: {
          name: "English",
          categories: {
            general: ["apple", "house", "water", "music", "happy", "world"]
          }
        }
      }
    };
    currentLanguage = "en";
    currentCategory = "general";
    selectRandomWord();
  }
}

// Populate language selector
function populateLanguageSelector() {
  const languageSelect = document.getElementById('language-select');
  languageSelect.innerHTML = '';
  
  for (const [langCode, langData] of Object.entries(gameData.languages)) {
    const option = document.createElement('option');
    option.value = langCode;
    option.textContent = langData.name;
    languageSelect.appendChild(option);
  }
}

// Populate category selector based on selected language
function populateCategorySelector() {
  const categorySelect = document.getElementById('category-select');
  categorySelect.innerHTML = '';
  
  if (gameData.languages[currentLanguage]) {
    const categories = gameData.languages[currentLanguage].categories;
    
    for (const [categoryKey, words] of Object.entries(categories)) {
      const option = document.createElement('option');
      option.value = categoryKey;
      option.textContent = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
      categorySelect.appendChild(option);
    }
    
    // Set first category as default
    if (categorySelect.options.length > 0) {
      currentCategory = categorySelect.options[0].value;
    }
  }
}

// Select random word from current language and category
function selectRandomWord() {
  if (gameData && gameData.languages[currentLanguage] && 
      gameData.languages[currentLanguage].categories[currentCategory]) {
    
    const words = gameData.languages[currentLanguage].categories[currentCategory];
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
    numbersOfLetters = wordToGuess.length;
    
    // Update UI with new word length
    document.querySelector(".Letter").innerHTML = `${numbersOfLetters}`;
    
    console.log("Word to guess:", wordToGuess);
  }
}

// Update game title and footer
function updateGameTitle() {
  document.title = gameName;
  document.querySelector("h1").innerText = gameName;
  document.querySelector(".title").innerText = gameName;
  document.querySelector("footer").innerText = 
    `${gameName} | Enhanced by AI | Original by Ali Alkasem | All Rights Reserved © 2025`;
}

// Setup event listeners
function setupEventListeners() {
  // Language selector
  document.getElementById('language-select').addEventListener('change', function() {
    currentLanguage = this.value;
    populateCategorySelector();
    currentCategory = document.getElementById('category-select').value;
    selectRandomWord();
    resetGame();
  });
  
  // Category selector
  document.getElementById('category-select').addEventListener('change', function() {
    currentCategory = this.value;
    selectRandomWord();
    resetGame();
  });
  
  // Difficulty buttons
  document.querySelectorAll(".difficulty-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document.querySelectorAll(".difficulty-btn")
        .forEach((btn) => btn.classList.remove("active"));

      this.classList.add("active");
      activeDifficulty = this.dataset.difficulty;

      updateDifficultySettings();
      resetGame();
    });
  });
  
  // Game control buttons
  document.querySelector(".start-game").addEventListener("click", startGame);
  document.querySelector(".show-words").addEventListener("click", showAllWords);
  document.querySelector(".close").addEventListener("click", closeWordsModal);
  document.querySelector(".check").addEventListener("click", handleGuesses);
  document.querySelector(".hint").addEventListener("click", getHint);
  document.querySelector(".reload").addEventListener("click", () => window.location.reload());
  document.querySelector(".shareBtn").addEventListener("click", shareGame);
  
  // Keyboard events
  document.addEventListener("keydown", handleBackspace);
}

// Update difficulty settings
function updateDifficultySettings() {
  switch (activeDifficulty) {
    case "Easy":
      numbersOfTries = 6;
      numberOfHints = 4;
      break;
    case "Medium":
      numbersOfTries = 5;
      numberOfHints = 3;
      break;
    case "Hard":
      numbersOfTries = 4;
      numberOfHints = 2;
      break;
    case "Extreme":
      numbersOfTries = 4;
      numberOfHints = 1;
      break;
    default:
      numbersOfTries = 6;
      numberOfHints = 4;
  }
  
  // Update UI
  document.querySelector(".dif .try").innerHTML = `${numbersOfTries}`;
  document.querySelector(".dif .hinT").innerHTML = `${numberOfHints}`;
  document.querySelector(".Letter").innerHTML = `${numbersOfLetters}`;
  
  // Update info display
  updateInfoDisplay();
}

// Update info display
function updateInfoDisplay() {
  const difficultyDisplay = document.querySelector(".info .difficulty");
  const triesDisplay = document.querySelector(".info .tries");
  const hintDisplay = document.querySelector(".info .hinT");
  
  if (difficultyDisplay) {
    difficultyDisplay.innerHTML = `Difficulty: ${activeDifficulty}`;
  }
  if (triesDisplay) {
    triesDisplay.innerHTML = `Tries: ${numbersOfTries}`;
  }
  if (hintDisplay) {
    hintDisplay.innerHTML = `Hints: ${numberOfHints}`;
  }
}

// Start game
function startGame() {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".guess-game").style.display = "flex";
  generateInput();
  updateInfoDisplay();
}

// Show all words modal
function showAllWords() {
  const showWordContainer = document.querySelector(".showWord");
  showWordContainer.innerHTML = "";
  
  if (gameData && gameData.languages[currentLanguage] && 
      gameData.languages[currentLanguage].categories[currentCategory]) {
    
    const words = gameData.languages[currentLanguage].categories[currentCategory];
    words.forEach(word => {
      const span = document.createElement("span");
      span.textContent = word;
      showWordContainer.appendChild(span);
    });
  }
  
  document.querySelector(".showContainer").style.display = "flex";
}

// Close words modal
function closeWordsModal() {
  document.querySelector(".showContainer").style.display = "none";
}

// Reset game
function resetGame() {
  currentTry = 1;
  document.querySelector(".inputs").innerHTML = "";
  document.querySelector(".message").style.display = "none";
  document.querySelector(".check").disabled = false;
  document.querySelector(".hint").disabled = false;
  document.querySelector(".hint span").innerHTML = numberOfHints;
  
  if (document.querySelector(".guess-game").style.display === "flex") {
    generateInput();
  }
}

// Generate input fields
function generateInput() {
  const inputsContainer = document.querySelector(".inputs");
  inputsContainer.innerHTML = "";

  for (let i = 1; i <= numbersOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}</span>`;

    if (i !== 1) {
      tryDiv.classList.add("disabled-inputs");
    }

    for (let j = 1; j <= numbersOfLetters; j++) {
      const input = document.createElement("input");
      input.setAttribute("type", "text");
      input.id = `guess-${i}-letter${j}`;
      input.setAttribute("maxlength", "1");
      tryDiv.appendChild(input);
    }

    inputsContainer.appendChild(tryDiv);
  }

  // Focus on first input
  if (inputsContainer.children[0]) {
    inputsContainer.children[0].children[1].focus();
  }

  // Disable inputs for non-current tries
  const inputsInDisabledDiv = document.querySelectorAll(".disabled-inputs input");
  inputsInDisabledDiv.forEach((input) => {
    input.setAttribute("disabled", "true");
  });

  // Add input event listeners
  const inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase();
      const nextInput = inputs[index + 1];
      if (nextInput && this.value) {
        nextInput.focus();
      }
    });

    input.addEventListener("keydown", function (event) {
      const currentIndex = Array.from(inputs).indexOf(event.target);
      if (event.key === "ArrowRight") {
        const nextInput = currentIndex + 1;
        if (nextInput < inputs.length) {
          inputs[nextInput].focus();
        }
      }
      if (event.key === "ArrowLeft") {
        const prevInput = currentIndex - 1;
        if (prevInput >= 0) {
          inputs[prevInput].focus();
        }
      }
      if (event.key === "Enter") {
        handleGuesses();
      }
    });
  });
}

// Handle guesses
function handleGuesses() {
  let successGuess = true;

  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.getElementById(`guess-${currentTry}-letter${i}`);
    if (!inputField) continue;

    const letter = inputField.value.toLowerCase();
    const actualLetter = wordToGuess[i - 1];

    // Game Logic
    if (letter === actualLetter) {
      inputField.classList.add("yes-in-place");
    } else if (wordToGuess.includes(letter) && letter !== "") {
      inputField.classList.add("not-in-place");
      successGuess = false;
    } else {
      inputField.classList.add("no");
      successGuess = false;
    }
  }

  if (successGuess) {
    showWinMessage();
  } else {
    handleNextTry();
  }
}

// Show win message
function showWinMessage() {
  const messageArea = document.querySelector(".message");
  messageArea.style.display = "flex";
  messageArea.style.background = "rgba(78, 205, 196, 0.95)";

  // Play success sound
  const audio = document.querySelector("audio");
  audio.src = "audio/success.mp3";
  audio.play().catch(() => {}); // Ignore audio errors

  // Show stats
  messageArea.innerHTML = `
    <p>Difficulty: <span>${activeDifficulty}</span></p>
    <p>You Win! The word is <span>${wordToGuess.toUpperCase()}</span></p>
    <p>You guessed the word in ${currentTry} ${currentTry === 1 ? "try" : "tries"}!</p>
  `;

  messageArea.appendChild(document.querySelector(".shareBtn"));
  messageArea.appendChild(document.querySelector(".reload"));

  // Disable all inputs and buttons
  document.querySelectorAll(".inputs > div").forEach((tryDiv) => 
    tryDiv.classList.add("disabled-inputs"));
  document.querySelector(".check").disabled = true;
  document.querySelector(".hint").disabled = true;
}

// Handle next try
function handleNextTry() {
  // Disable current try
  const currentTryDiv = document.querySelector(`.try-${currentTry}`);
  if (currentTryDiv) {
    currentTryDiv.classList.add("disabled-inputs");
    const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    currentTryInputs.forEach((input) => (input.disabled = true));
  }

  currentTry++;

  // Enable next try or show lose message
  const nextTryDiv = document.querySelector(`.try-${currentTry}`);
  if (nextTryDiv) {
    nextTryDiv.classList.remove("disabled-inputs");
    const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
    nextTryInputs.forEach((input) => (input.disabled = false));
    nextTryDiv.children[1].focus();
  } else {
    showLoseMessage();
  }
}

// Show lose message
function showLoseMessage() {
  const messageArea = document.querySelector(".message");
  messageArea.style.display = "flex";
  messageArea.style.background = "rgba(255, 107, 107, 0.95)";

  // Play fail sound
  const audio = document.querySelector("audio");
  audio.src = "audio/fail.mp3";
  audio.play().catch(() => {}); // Ignore audio errors

  document.querySelector(".check").disabled = true;
  document.querySelector(".hint").disabled = true;

  messageArea.innerHTML = `
    <p>Difficulty: <span>${activeDifficulty}</span></p>
    <p>You Lose! The word is <span>${wordToGuess.toUpperCase()}</span></p>
  `;

  messageArea.appendChild(document.querySelector(".shareBtn"));
  messageArea.appendChild(document.querySelector(".reload"));
}

// Get hint
function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    document.querySelector(".hint").disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

// Share game
function shareGame() {
  const result = `🎯 I played Guess Word Game!\n🌍 Language: ${gameData.languages[currentLanguage].name}\n📂 Category: ${currentCategory}\n⭐ Difficulty: ${activeDifficulty}\nTry it: https://alloshas.github.io/guess-word-game/`;

  if (navigator.share) {
    navigator.share({
      title: "Guess Word Game",
      text: result,
      url: "https://alloshas.github.io/guess-word-game/",
    });
  } else {
    navigator.clipboard.writeText(result).then(() => {
      alert("Result copied! Paste it anywhere 🚀");
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = result;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert("Result copied! Paste it anywhere 🚀");
    });
  }
}

// Handle backspace
function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);

    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInput = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInput.value = "";
      prevInput.focus();
    }
  }
}

// Initialize game on window load
window.onload = function () {
  updateDifficultySettings();
  document.querySelector(".hint span").innerHTML = numberOfHints;
};

