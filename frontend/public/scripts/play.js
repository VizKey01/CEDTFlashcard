// // flashcard
// document.querySelector('.flashcardcontent').addEventListener('click', function () {
//     document.querySelector('.edit-popup').classList.add('active')
//     document.querySelector('.overlay').style.display = 'none';
// })
// //กด กลับ
// document.querySelector('.close-btn').addEventListener('click', function () {
//     document.querySelector('.edit-popup').classList.remove('active')
//     document.querySelector('.overlay').style.display = 'none';
// })



const card = document.querySelector(".card__inner");
const skipButton = document.querySelector(".skip-button");
const correctButton = document.querySelector(".correct-button");

const flashcards = [
  { term: "Boss", definition: "Kwin Jetasanond" },
  { term: "Animal", definition: "Dog" },
  { term: "Band", definition: "The 1975" },
  { term: "Food", definition: "steak" },
  { term: "Sport", definition: "Football" },
  { term: "Subject", definition: "Physics" },

  // Add more flashcards as needed
];

let currentFlashcardIndex = 0;
let skipCount = 0;
let correctCount = 0;

// Function to display the current flashcard
function displayFlashcard() {
  const termElement = document.querySelector(".card__face--front h2");
  const definitionElement = document.querySelector(".card__body h3");

  const currentFlashcard = flashcards[currentFlashcardIndex];
  termElement.textContent = currentFlashcard.term;
  definitionElement.textContent = currentFlashcard.definition;

  const indexCountElement = document.querySelector(".index-count");
  const totalCountElement = document.querySelector(".total-count");

  indexCountElement.textContent = currentFlashcardIndex + 1; // Add 1 to start from 1-based index
  totalCountElement.textContent = flashcards.length;
}

// Function to navigate to the next flashcard
function goToNextFlashcard(isSkipped) {
  const termElement = document.querySelector(".card__face--front h2");
  termElement.textContent = ''; // Clear the term content immediately

  // Check if the current card is already flipped
  const isFlipped = card.classList.contains('is-flipped');
  card.addEventListener("transitionend", function handleTransition() {
    card.removeEventListener("transitionend", handleTransition);
    currentFlashcardIndex++;

    if (currentFlashcardIndex < flashcards.length) {
      if (isFlipped) {
        if (isSkipped) {
          skipCount++;
          document.querySelector(".skip-count").textContent = skipCount;
        }
      }
      if (card.classList.contains('is-flipped')) {
        // If the card is still flipped, it means it was skipped, not clicked "Correct."
        card.classList.remove('is-flipped');
      } else {
        displayFlashcard();
      }
    } 
    else { // ****************Ending****************************** 
      console.log('Ending Flashcard');
      document.querySelector('.popup_sum').classList.add('active')
    }
  });
  
  card.classList.toggle('is-flipped'); // Flip the card to the back immediately

  // Shorten the delay (e.g., 100 milliseconds) for smoother transition
  setTimeout(function () {
    if (card.classList.contains('is-flipped')) {
      card.classList.remove('is-flipped');
    } else {
      displayFlashcard();
    }
  }, 1);
}

// Initial display of the first flashcard
displayFlashcard();

// Add a click event listener to flip the card
card.addEventListener("click", function (e) {
  card.classList.toggle('is-flipped');
});

// Add a keydown event listener to flip the card when the space bar is pressed and prevent the default action
document.addEventListener("keydown", function (e) {
  if (e.keyCode === 32) {
    card.classList.toggle('is-flipped');
    e.preventDefault();
  }
});

// Add event listeners to "Skip" and "Correct" buttons
skipButton.addEventListener("click", function (e) {
  goToNextFlashcard(true); // Pass true to indicate the card was skipped
});

correctButton.addEventListener("click", function (e) {
  goToNextFlashcard(false); // Pass false to indicate the card was not skipped
  correctCount++;
  document.querySelector(".correct-count").textContent = correctCount;
});
