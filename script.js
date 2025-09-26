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

// Enhanced game features
let gameScore = 0;
let gameTimer = 0;
let timerInterval = null;
let gameStartTime = null;
let soundEnabled = true;

// Statistics and achievements
let gameStats = {
  totalGames: 0,
  totalWins: 0,
  totalScore: 0,
  bestTime: null,
  currentStreak: 0,
  bestStreak: 0,
  wordsGuessed: 0,
  hintsUsed: 0,
  achievements: {}
};

// Achievements definitions
const achievements = {
  firstWin: {
    id: 'firstWin',
    title: 'First Victory!',
    description: 'Win your first game',
    icon: '🏆',
    unlocked: false
  },
  speedster: {
    id: 'speedster',
    title: 'Speed Demon',
    description: 'Guess a word in under 30 seconds',
    icon: '⚡',
    unlocked: false
  },
  streakMaster: {
    id: 'streakMaster',
    title: 'Streak Master',
    description: 'Win 5 games in a row',
    icon: '🔥',
    unlocked: false
  },
  wordsmith: {
    id: 'wordsmith',
    title: 'Wordsmith',
    description: 'Guess 50 words correctly',
    icon: '📚',
    unlocked: false
  },
  perfectionist: {
    id: 'perfectionist',
    title: 'Perfectionist',
    description: 'Win a game without using hints',
    icon: '💎',
    unlocked: false
  },
  multilingual: {
    id: 'multilingual',
    title: 'Multilingual',
    description: 'Play in both English and Arabic',
    icon: '🌍',
    unlocked: false
  },
  explorer: {
    id: 'explorer',
    title: 'Category Explorer',
    description: 'Play in all available categories',
    icon: '🗺️',
    unlocked: false
  }
};

// Initialize game
document.addEventListener("DOMContentLoaded", function () {
  loadGameStats();
  loadGameData();
  setupEventListeners();
  updateGameTitle();
});

// Load game statistics from localStorage
function loadGameStats() {
  const savedStats = localStorage.getItem('guessWordGameStats');
  if (savedStats) {
    gameStats = { ...gameStats, ...JSON.parse(savedStats) };
  }
  
  // Initialize achievements if not present
  if (!gameStats.achievements) {
    gameStats.achievements = {};
  }
  
  // Update achievements object with saved data
  Object.keys(achievements).forEach(key => {
    if (gameStats.achievements[key]) {
      achievements[key].unlocked = gameStats.achievements[key].unlocked || false;
    }
  });
}

// Save game statistics to localStorage
function saveGameStats() {
  // Update achievements in gameStats
  gameStats.achievements = {};
  Object.keys(achievements).forEach(key => {
    gameStats.achievements[key] = {
      unlocked: achievements[key].unlocked
    };
  });
  
  localStorage.setItem('guessWordGameStats', JSON.stringify(gameStats));
}

// Load game data from JSON
async function loadGameData() {
  try {
    const response = await fetch("words.json");
    gameData = await response.json();

    // Populate language selector
    populateLanguageSelector();

    // Set default language and category
    currentLanguage = document.getElementById("language-select").value;
    populateCategorySelector();

    // Set default category
    const categorySelect = document.getElementById("category-select");
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
            general: ["apple", "house", "water", "music", "happy", "world"],
          },
        },
      },
    };
    currentLanguage = "en";
    currentCategory = "general";
    selectRandomWord();
  }
}

// Populate language selector
function populateLanguageSelector() {
  const languageSelect = document.getElementById("language-select");
  languageSelect.innerHTML = "";

  for (const [langCode, langData] of Object.entries(gameData.languages)) {
    const option = document.createElement("option");
    option.value = langCode;
    option.textContent = langData.name;
    languageSelect.appendChild(option);
  }
}

// Populate category selector based on selected language
function populateCategorySelector() {
  const categorySelect = document.getElementById("category-select");
  categorySelect.innerHTML = "";

  if (gameData.languages[currentLanguage]) {
    const categories = gameData.languages[currentLanguage].categories;

    for (const [categoryKey, words] of Object.entries(categories)) {
      const option = document.createElement("option");
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
  if (
    gameData &&
    gameData.languages[currentLanguage] &&
    gameData.languages[currentLanguage].categories[currentCategory]
  ) {
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
  document.querySelector("footer").innerText = `${gameName} | Created by Ali Alkasem | All Rights Reserved © 2025`;
}

// Setup event listeners
function setupEventListeners() {
  // Language selector
  document
    .getElementById("language-select")
    .addEventListener("change", function () {
      currentLanguage = this.value;
      populateCategorySelector();
      currentCategory = document.getElementById("category-select").value;
      selectRandomWord();
      resetGame();
    });

  // Category selector
  document
    .getElementById("category-select")
    .addEventListener("change", function () {
      currentCategory = this.value;
      selectRandomWord();
      resetGame();
    });

  // Difficulty buttons
  document.querySelectorAll(".difficulty-btn").forEach((button) => {
    button.addEventListener("click", function () {
      document
        .querySelectorAll(".difficulty-btn")
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
  document.querySelector(".reload").addEventListener("click", replayGame);
  document.querySelector(".shareBtn").addEventListener("click", shareGame);
  document.querySelector(".home-btn").addEventListener("click", goHome);
  document.querySelector(".settings-btn").addEventListener("click", showSettings);
  document.querySelector(".achievements-btn").addEventListener("click", showAchievements);
  
  // Modal event listeners
  document.querySelector(".close-settings").addEventListener("click", closeSettings);
  document.querySelector(".close-achievements").addEventListener("click", closeAchievements);
  document.querySelector("#sound-toggle").addEventListener("change", toggleSound);
  document.querySelector(".share-game-btn").addEventListener("click", shareGame);
  document.querySelector(".rate-game-btn").addEventListener("click", rateGame);
  document.querySelector(".reset-stats-btn").addEventListener("click", resetStats);

  // Keyboard events
  document.addEventListener("keydown", handleBackspace);
}

// Timer functions
function startTimer() {
  gameStartTime = Date.now();
  gameTimer = 0;
  timerInterval = setInterval(() => {
    gameTimer = Math.floor((Date.now() - gameStartTime) / 1000);
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(gameTimer / 60);
  const seconds = gameTimer % 60;
  document.getElementById('timer-value').textContent = 
    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Score functions
function updateScore(points) {
  gameScore += points;
  document.getElementById('score-value').textContent = gameScore;
  
  // Add animation
  const scoreElement = document.getElementById('score-value');
  scoreElement.classList.add('score-animation');
  setTimeout(() => {
    scoreElement.classList.remove('score-animation');
  }, 500);
}

function calculateScore() {
  let baseScore = 100;
  
  // Difficulty multiplier
  const difficultyMultipliers = {
    'Easy': 1,
    'Medium': 1.5,
    'Hard': 2,
    'Extreme': 3
  };
  
  baseScore *= difficultyMultipliers[activeDifficulty];
  
  // Time bonus (faster = more points)
  if (gameTimer < 30) baseScore += 50;
  else if (gameTimer < 60) baseScore += 25;
  
  // Hints penalty
  const hintsUsedThisRound = (numberOfHints === 4 ? 0 : 4 - numberOfHints);
  baseScore -= hintsUsedThisRound * 10;
  
  // Try bonus (fewer tries = more points)
  baseScore += (numbersOfTries - currentTry + 1) * 10;
  
  return Math.max(baseScore, 10); // Minimum 10 points
}

// Achievement functions
function checkAchievements() {
  // First Win
  if (!achievements.firstWin.unlocked && gameStats.totalWins === 1) {
    unlockAchievement('firstWin');
  }
  
  // Speed Demon
  if (!achievements.speedster.unlocked && gameTimer < 30) {
    unlockAchievement('speedster');
  }
  
  // Streak Master
  if (!achievements.streakMaster.unlocked && gameStats.currentStreak >= 5) {
    unlockAchievement('streakMaster');
  }
  
  // Wordsmith
  if (!achievements.wordsmith.unlocked && gameStats.wordsGuessed >= 50) {
    unlockAchievement('wordsmith');
  }
  
  // Perfectionist (no hints used this game)
  const hintsUsedThisRound = (numberOfHints === 4 ? 0 : 4 - numberOfHints);
  if (!achievements.perfectionist.unlocked && hintsUsedThisRound === 0) {
    unlockAchievement('perfectionist');
  }
  
  // Check multilingual and explorer achievements
  checkLanguageAndCategoryAchievements();
}

function checkLanguageAndCategoryAchievements() {
  // Track languages and categories played
  if (!gameStats.languagesPlayed) gameStats.languagesPlayed = new Set();
  if (!gameStats.categoriesPlayed) gameStats.categoriesPlayed = new Set();
  
  gameStats.languagesPlayed.add(currentLanguage);
  gameStats.categoriesPlayed.add(currentCategory);
  
  // Multilingual achievement
  if (!achievements.multilingual.unlocked && gameStats.languagesPlayed.size >= 2) {
    unlockAchievement('multilingual');
  }
  
  // Explorer achievement (need to check total categories available)
  const totalCategories = Object.keys(gameData.languages.en.categories).length + 
                         Object.keys(gameData.languages.ar.categories).length;
  if (!achievements.explorer.unlocked && gameStats.categoriesPlayed.size >= totalCategories) {
    unlockAchievement('explorer');
  }
}

function unlockAchievement(achievementId) {
  achievements[achievementId].unlocked = true;
  showAchievementNotification(achievements[achievementId]);
  saveGameStats();
}

function showAchievementNotification(achievement) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification-content">
      <span class="achievement-notification-icon">${achievement.icon}</span>
      <div>
        <div class="achievement-notification-title">Achievement Unlocked!</div>
        <div class="achievement-notification-desc">${achievement.title}</div>
      </div>
    </div>
  `;
  
  // Add styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #4ecdc4, #44a08d);
    color: white;
    padding: 15px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    z-index: 3000;
    animation: slideInRight 0.5s ease-out;
    max-width: 300px;
  `;
  
  document.body.appendChild(notification);
  
  // Remove after 4 seconds
  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.5s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 500);
  }, 4000);
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
  
  // Update score and timer
  document.getElementById('score-value').textContent = gameScore;
  updateTimerDisplay();
}

// Start game
function startGame() {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".guess-game").style.display = "flex";
  generateInput();
  updateInfoDisplay();
  startTimer();
}

// Go home
function goHome() {
  stopTimer();
  document.querySelector(".start-screen").style.display = "flex";
  document.querySelector(".guess-game").style.display = "none";
  resetGame();
}

// Show settings modal
function showSettings() {
  document.querySelector(".settings-modal").style.display = "flex";
  document.getElementById("sound-toggle").checked = soundEnabled;
}

// Close settings modal
function closeSettings() {
  document.querySelector(".settings-modal").style.display = "none";
}

// Show achievements modal
function showAchievements() {
  const achievementsList = document.querySelector(".achievements-list");
  achievementsList.innerHTML = "";
  
  Object.values(achievements).forEach(achievement => {
    const achievementElement = document.createElement("div");
    achievementElement.className = `achievement-item ${achievement.unlocked ? 'unlocked' : 'locked'}`;
    
    let progressText = '';
    if (!achievement.unlocked) {
      // Add progress for specific achievements
      switch (achievement.id) {
        case 'streakMaster':
          progressText = `<div class="achievement-progress">Current streak: ${gameStats.currentStreak}/5</div>`;
          break;
        case 'wordsmith':
          progressText = `<div class="achievement-progress">Words guessed: ${gameStats.wordsGuessed}/50</div>`;
          break;
      }
    }
    
    achievementElement.innerHTML = `
      <div class="achievement-icon">${achievement.unlocked ? achievement.icon : '🔒'}</div>
      <div class="achievement-info">
        <div class="achievement-title">${achievement.title}</div>
        <div class="achievement-description">${achievement.description}</div>
        ${progressText}
      </div>
    `;
    
    achievementsList.appendChild(achievementElement);
  });
  
  document.querySelector(".achievements-modal").style.display = "flex";
}

// Close achievements modal
function closeAchievements() {
  document.querySelector(".achievements-modal").style.display = "none";
}

// Toggle sound
function toggleSound() {
  soundEnabled = document.getElementById("sound-toggle").checked;
  localStorage.setItem('soundEnabled', soundEnabled);
}

// Rate game
function rateGame() {
  alert("Thank you for your interest! Please rate us on the app store or share your feedback.");
}

// Reset statistics
function resetStats() {
  if (confirm("Are you sure you want to reset all statistics and achievements? This action cannot be undone.")) {
    gameStats = {
      totalGames: 0,
      totalWins: 0,
      totalScore: 0,
      bestTime: null,
      currentStreak: 0,
      bestStreak: 0,
      wordsGuessed: 0,
      hintsUsed: 0,
      achievements: {}
    };
    
    Object.keys(achievements).forEach(key => {
      achievements[key].unlocked = false;
    });
    
    saveGameStats();
    alert("Statistics have been reset!");
    closeSettings();
  }
}

// Show all words modal
function showAllWords() {
  const showWordContainer = document.querySelector(".showWord");
  showWordContainer.innerHTML = "";

  if (
    gameData &&
    gameData.languages[currentLanguage] &&
    gameData.languages[currentLanguage].categories[currentCategory]
  ) {
    const words = gameData.languages[currentLanguage].categories[currentCategory];
    words.forEach((word) => {
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
  
  // Reset hints to original value based on difficulty
  updateDifficultySettings();
  document.querySelector(".hint span").innerHTML = numberOfHints;
  
  stopTimer();
  gameTimer = 0;
  updateTimerDisplay();

  if (document.querySelector(".guess-game").style.display === "flex") {
    generateInput();
    startTimer();
  }
}

// Replay game (enhanced version)
function replayGame() {
  // Select new word
  selectRandomWord();
  
  // Reset game state
  resetGame();
  
  // Hide message area
  document.querySelector(".message").style.display = "none";
  
  // Start new game
  generateInput();
  startTimer();
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
  stopTimer();
  
  // Update statistics
  gameStats.totalGames++;
  gameStats.totalWins++;
  gameStats.currentStreak++;
  gameStats.wordsGuessed++;
  
  if (gameStats.currentStreak > gameStats.bestStreak) {
    gameStats.bestStreak = gameStats.currentStreak;
  }
  
  if (!gameStats.bestTime || gameTimer < gameStats.bestTime) {
    gameStats.bestTime = gameTimer;
  }
  
  // Calculate and add score
  const roundScore = calculateScore();
  updateScore(roundScore);
  gameStats.totalScore += roundScore;
  
  // Check achievements
  checkAchievements();
  
  // Save statistics
  saveGameStats();

  const messageArea = document.querySelector(".message");
  messageArea.style.display = "flex";
  messageArea.style.background = "rgba(78, 205, 196, 0.95)";

  // Play success sound
  if (soundEnabled) {
    const audio = document.querySelector("audio");
    audio.src = "audio/success.mp3";
    audio.play().catch(() => {}); // Ignore audio errors
  }

  // Show stats
  messageArea.innerHTML = `
    <p>🎉 Congratulations! 🎉</p>
    <p>Difficulty: <span>${activeDifficulty}</span></p>
    <p>You Win! The word is <span>${wordToGuess.toUpperCase()}</span></p>
    <p>You guessed the word in ${currentTry} ${currentTry === 1 ? "try" : "tries"}!</p>
    <p>Time: ${Math.floor(gameTimer / 60)}:${(gameTimer % 60).toString().padStart(2, '0')}</p>
    <p>Score: +${roundScore} points</p>
  `;

  // Add buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'win-buttons';
  buttonContainer.innerHTML = `
    <button class="reload">Play Again</button>
    <button class="shareBtn">Share</button>
    <button class="achievements-btn">Achievements</button>
  `;
  messageArea.appendChild(buttonContainer);

  // Re-attach event listeners for dynamically created buttons
  messageArea.querySelector('.reload').addEventListener('click', replayGame);
  messageArea.querySelector('.shareBtn').addEventListener('click', shareGame);
  messageArea.querySelector('.achievements-btn').addEventListener('click', showAchievements);

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
  stopTimer();
  
  // Update statistics
  gameStats.totalGames++;
  gameStats.currentStreak = 0; // Reset streak on loss
  
  // Save statistics
  saveGameStats();

  const messageArea = document.querySelector(".message");
  messageArea.style.display = "flex";
  messageArea.style.background = "rgba(255, 107, 107, 0.95)";

  // Play fail sound
  if (soundEnabled) {
    const audio = document.querySelector("audio");
    audio.src = "audio/fail.mp3";
    audio.play().catch(() => {}); // Ignore audio errors
  }

  document.querySelector(".check").disabled = true;
  document.querySelector(".hint").disabled = true;

  messageArea.innerHTML = `
    <p>😔 Game Over 😔</p>
    <p>Difficulty: <span>${activeDifficulty}</span></p>
    <p>You Lose! The word was <span>${wordToGuess.toUpperCase()}</span></p>
    <p>Time: ${Math.floor(gameTimer / 60)}:${(gameTimer % 60).toString().padStart(2, '0')}</p>
    <p>Better luck next time!</p>
  `;

  // Add buttons
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'lose-buttons';
  buttonContainer.innerHTML = `
    <button class="reload">Try Again</button>
    <button class="shareBtn">Share</button>
  `;
  messageArea.appendChild(buttonContainer);

  // Re-attach event listeners for dynamically created buttons
  messageArea.querySelector('.reload').addEventListener('click', replayGame);
  messageArea.querySelector('.shareBtn').addEventListener('click', shareGame);
}

// Get hint
function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    gameStats.hintsUsed++;
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
  const winRate = gameStats.totalGames > 0 ? Math.round((gameStats.totalWins / gameStats.totalGames) * 100) : 0;
  const result = `🎯 I'm playing Guess The Word Game!
🌍 Language: ${gameData.languages[currentLanguage].name}
📂 Category: ${currentCategory}
⭐ Difficulty: ${activeDifficulty}
🏆 Score: ${gameStats.totalScore}
📊 Win Rate: ${winRate}%
🔥 Best Streak: ${gameStats.bestStreak}

Try it: https://alloshas.github.io/guess-word-game/`;

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
      document.execCommand("copy");
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
  
  // Load sound setting
  const savedSoundSetting = localStorage.getItem('soundEnabled');
  if (savedSoundSetting !== null) {
    soundEnabled = savedSoundSetting === 'true';
  }
  
  // Add achievement notification styles
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
    
    .achievement-notification-content {
      display: flex;
      align-items: center;
      gap: 15px;
    }
    
    .achievement-notification-icon {
      font-size: 2rem;
    }
    
    .achievement-notification-title {
      font-weight: 700;
      font-size: 1.1rem;
    }
    
    .achievement-notification-desc {
      font-size: 0.9rem;
      opacity: 0.9;
    }
  `;
  document.head.appendChild(style);
};


