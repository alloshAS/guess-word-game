// setting game name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerText = gameName;
document.querySelector(".title").innerText = gameName;
document.querySelector(
  "footer"
).innerText = `${gameName} | The Game Created by Ali Alkasem | All Rights Reserved © 2025`;

// setting the game options
let numbersOfTries = 6;
let numbersOfLetters = 6;
let currentTry = 1;
let numberOfHints = 4;
let activeDifficulty = "Easy";

document.querySelectorAll(".difficulty-btn").forEach((button) => {
  button.addEventListener("click", function () {
    document
      .querySelectorAll(".difficulty-btn")
      .forEach((button) => button.classList.remove("active"));

    this.classList.add("active");
    activeDifficulty = this.dataset.difficulty;

    if (activeDifficulty === "Easy") {
      numbersOfTries = 6;
      numberOfHints = 4;
    } else if (activeDifficulty === "Medium") {
      numbersOfTries = 5;
      numberOfHints = 3;
    } else if (activeDifficulty === "Hard") {
      numbersOfTries = 4;
      numberOfHints = 2;
    } else if (activeDifficulty === "Extreme") {
      numbersOfTries = 4;
      numberOfHints = 1;
    } else {
      numbersOfTries = 6;
      numberOfHints = 4;
    }
    // console.log(`Difficulty: ${activeDifficulty}, Tries: ${numbersOfTries}, Letters: ${numbersOfLetters}, Hints: ${numberOfHints}`);
    document.querySelector(".dif .try").innerHTML = `${numbersOfTries}`;
    document.querySelector(".dif .hinT").innerHTML = `${numberOfHints}`;
    document.querySelector(".Letter").innerHTML = `${numbersOfLetters}`;

    // Update the difficulty display
    const difficultyDisplay = document.querySelector(".info .difficulty");
    if (difficultyDisplay) {
      difficultyDisplay.innerHTML = `<p>Difficulty: ${activeDifficulty}</p>`;
    }

    //Update the tries display
    const triesDisplay = document.querySelector(".info .tries");
    if (triesDisplay) {
      triesDisplay.innerHTML = `<p>Tries: ${numbersOfTries}</p>`;
    }

    //Update the hints display
    const hintDisplay = document.querySelector(".info .hinT");
    if (hintDisplay) {
      hintDisplay.innerHTML = `<p>Hint: ${numberOfHints} </p>`;
    }

    // Reset current try
    currentTry = 1;
    // Clear previous inputs if any
    document.querySelector(".inputs").innerHTML = "";
    generateInput();
    document.querySelector(".message").style.display = "none";
    document.querySelector(".check").disabled = false;
    document.querySelector(".hint").disabled = false;
    document.querySelector(".hint span").innerHTML = numberOfHints;

    // Focus on the first input box of the first try
    const firstInput = document.querySelector(".inputs .try-1 input");
    if (firstInput) firstInput.focus();
  });
});

const stsrtGameButton = document.querySelector(".start-game");
stsrtGameButton.addEventListener("click", function () {
  document.querySelector(".start-screen").style.display = "none";
  document.querySelector(".guess-game").style.display = "flex";
});

const showContainerButton = document.querySelector(".show-words");
showContainerButton.addEventListener("click", function () {
  document.querySelector(".showContainer").style.display = "flex";
});

const closeButton = document.querySelector(".close");
closeButton.addEventListener("click", function () {
  document.querySelector(".showContainer").style.display = "none";
});

// Manage Words
let wordToGuess = "";

// دالة لتحميل الكلمات من ملف JSON
async function loadWordsFromJSON() {
  try {
    const response = await fetch("words.json");
    const data = await response.json();
    const words = data.words;

    // اختيار كلمة عشوائية
    wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
    console.log("Word to guess:", wordToGuess);

    // هنا يمكنك استدعاء الدوال الأخرى التي تعتمد على wordToGuess
    // startGame(); // مثلاً
  } catch (error) {
    console.error("خطأ في تحميل ملف الكلمات:", error);
    // في حالة الخطأ، نستخدم مصفوفة احتياطية
    const backupWords = [
      "butter",
      "cheese",
      "pickle",
      "tomato",
      "banana",
      "pepper",
      "walnut",
      "cashew",
      "shrimp",
      "salmon",
    ];
    wordToGuess =
      backupWords[Math.floor(Math.random() * backupWords.length)].toLowerCase();
    console.log("Word to guess (backup):", wordToGuess);
  }
}

// استدعاء الدالة لتحميل الكلمات
loadWordsFromJSON();

let messageArea = document.querySelector(".message");
let reloadButton = document.querySelector(".reload");
let shareBtn = document.querySelector(".shareBtn");
//manage hints
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintButton = document.querySelector(".hint");
getHintButton.addEventListener("click", getHint);

function generateInput() {
  const inputsContainer = document.querySelector(".inputs");

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

  // Focus on the first input box of the first try
  inputsContainer.children[0].children[1].focus();

  // disable all input boxes except the first try
  const inputsInDisabledDiv = document.querySelectorAll(
    ".disabled-inputs input"
  );
  inputsInDisabledDiv.forEach((input) => {
    input.setAttribute("disabled", "true");
  });

  const inputs = document.querySelectorAll(".inputs input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      this.value = this.value.toUpperCase(); // Convert to uppercase
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

const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

reloadButton.addEventListener("click", function () {
  window.location.reload();
});

shareBtn.addEventListener("click", function () {
  const result =
    "🎯 I played Guess Word Game!\n✅✅⬜️⬜️⬜️\nTry it: https://guess-word-game-b-3lloush.netlify.app/";

  if (navigator.share) {
    navigator.share({
      title: "Guess Word Game",
      text: result,
      url: "https://guess-word-game-b-3lloush.netlify.app/",
    });
  } else {
    navigator.clipboard.writeText(result);
    alert("Result copied! Paste it anywhere 🚀");
  }
});

function handleGuesses() {
  let successGuess = true;

  for (let i = 1; i <= numbersOfLetters; i++) {
    const inputField = document.getElementById(
      `guess-${currentTry}-letter${i}`
    );
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
    document.querySelector(".message").style.display = "flex";

    messageArea.style.background = "linear-gradient(90deg, #1b765b, #00c853)";

    // Play success sound
    document.querySelector("audio").src = "audio/success.mp3";
    document.querySelector("audio").play();

    //show stats
    messageArea.innerHTML = `<p>Difficulty: <span>${activeDifficulty}</span></p>`;
    messageArea.innerHTML += `<br> You Win! The word is <span>${wordToGuess.toUpperCase()}</span>`;

    if (numberOfHints === numberOfHints) {
      messageArea.innerHTML += `<p> You didn't use any hints! </p>`;
    }
    // numberOftries = currentTry
    messageArea.innerHTML += `<p> You guessed the word in ${currentTry} ${
      currentTry === 1 ? "try" : "tries"
    }! </p>`;

    messageArea.appendChild(shareBtn);
    messageArea.appendChild(reloadButton);

    let alltries = document.querySelectorAll(".inputs > div");
    alltries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
    guessButton.disabled = true;
    getHintButton.disabled = true;
  } else {
    let currentTryDiv = document.querySelector(`.try-${currentTry}`);
    if (currentTryDiv) {
      currentTryDiv.classList.add("disabled-inputs");
      const currentTryInputs = document.querySelectorAll(
        `.try-${currentTry} input`
      );
      currentTryInputs.forEach((input) => (input.disabled = true));
    }

    currentTry++;

    let nextTryDiv = document.querySelector(`.try-${currentTry}`);
    if (nextTryDiv) {
      nextTryDiv.classList.remove("disabled-inputs");
      const nextTryInputs = document.querySelectorAll(
        `.try-${currentTry} input`
      );
      nextTryInputs.forEach((input) => (input.disabled = false));
      nextTryDiv.children[1].focus();
    } else {
      document.querySelector(".message").style.display = "flex";
      messageArea.style.background = "linear-gradient(90deg, #c62828, #ff3d00)";

      // Play fail sound
      document.querySelector("audio").src = "audio/fail.mp3";
      document.querySelector("audio").play();

      guessButton.setAttribute("disabled", "true");
      getHintButton.setAttribute("disabled", "true");

      messageArea.innerHTML = `<p>Difficulty: <span>${activeDifficulty}</span> </p>`;

      messageArea.innerHTML += ` <br> You Lose! The word is <span>${wordToGuess.toUpperCase()}</span>`;
      messageArea.appendChild(shareBtn);
      messageArea.appendChild(reloadButton);
    }
  }
}

function getHint() {
  if (numberOfHints > 0) {
    numberOfHints--;
    document.querySelector(".hint span").innerHTML = numberOfHints;
  }
  if (numberOfHints === 0) {
    getHintButton.disabled = true;
  }

  const enabledInputs = document.querySelectorAll("input:not([disabled])");
  //console.log(enabledInputs);

  const emptyEnabledInputs = Array.from(enabledInputs).filter(
    (input) => input.value === ""
  );
  // console.log(emptyEnabledInputs);

  if (emptyEnabledInputs.length > 0) {
    const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
    const randomInput = emptyEnabledInputs[randomIndex];
    const indexToFill = Array.from(enabledInputs).indexOf(randomInput);
    // console.log(randomIndex);
    // console.log(randomInput);
    // console.log(indexToFill);

    if (indexToFill !== -1) {
      randomInput.value = wordToGuess[indexToFill].toUpperCase();
    }
  }
}

function handleBackspace(event) {
  if (event.key === "Backspace") {
    const inputs = document.querySelectorAll("input:not([disabled])");
    const currentIndex = Array.from(inputs).indexOf(document.activeElement);
    // console.log(currentIndex);

    if (currentIndex > 0) {
      const currentInput = inputs[currentIndex];
      const prevInputs = inputs[currentIndex - 1];
      currentInput.value = "";
      prevInputs.value = "";
      prevInputs.focus();
    }
  }
}

document.addEventListener("keydown", handleBackspace);

window.onload = function () {
  generateInput();
};
