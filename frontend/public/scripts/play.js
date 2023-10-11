






const Playbutt = document.querySelectorAll('.play-button');

// ลูปผ่านทุกองค์ประกอบแล้วให้เพิ่มเหตุการณ์คลิกที่ทุกองค์ประกอบ
// Playbutt.forEach((playpop) => {
//   console.log(playpop);
//   playpop.addEventListener('click', playcard);
// });

// // flashcard
// function playcard() {
//   document.querySelector('.play-popup').classList.add('active');
// }

//กด กลับ
document.querySelector('.close-popup').addEventListener('click', function () {
  document.querySelector('.play-popup').classList.remove('active');
})





//หลังกด play ให้แสดงการ์ดขึ้นมา
const playing = document.querySelector(".play-submit");

document.querySelector('.header').style.display = 'none';
document.querySelector('.content').style.display = 'none';
document.querySelector('.footer').style.display = 'none';
document.querySelector('.PLAYCARD').style.display = 'block';

//กด กลับ
document.querySelector('.close-popup').addEventListener('click', function () {
    document.querySelector('.play-popup').classList.remove('active');
})


const card = document.querySelector(".card__inner");
const skipButton = document.querySelector(".skip-button");
const correctButton = document.querySelector(".correct-button");

const flashcardsplay = [
  { term: "Boss", definition: "Kwin Jetasanond" },
  { term: "Animal", definition: "Dog" },
  { term: "Band", definition: "The 1975" },
  { term: "Food", definition: "steak" },
  { term: "Sport", definition: "Football" },
  { term: "Subject", definition: "Physics" },

  // Add more flashcardsplay as needed
];


export async function addFlashcardsToPlay(flashcardsplay) {
  // ทำการเพิ่ม flashcardsplay ที่รับเข้ามาใน flashcard.js
  flashcard.flashcards = flashcardsplay;
}



let currentFlashcardIndex = 0;
let skipCount = 0;
let correctCount = 0;

// Function to display the current flashcard
function displayFlashcard() {
  const termElement = document.querySelector(".card__face--front h2");
  const definitionElement = document.querySelector(".card__body h3");

  const currentFlashcard = flashcardsplay[currentFlashcardIndex];
  termElement.textContent = currentFlashcard.term;
  definitionElement.textContent = currentFlashcard.definition;

  const indexCountElement = document.querySelector(".index-count");
  const totalCountElement = document.querySelector(".total-count");

  indexCountElement.textContent = currentFlashcardIndex + 1; // Add 1 to start from 1-based index
  totalCountElement.textContent = flashcardsplay.length;
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

    if (currentFlashcardIndex < flashcardsplay.length) {
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
      
      let circularProgress = document.querySelector('.circular-progress'),
      progressValue = document.querySelector('.progress-value')

      let newskip = flashcardsplay.length-correctCount
      let endcount = (correctCount/flashcardsplay.length)

      let progressStartValue = 0,
      progressEndValue = (correctCount/flashcardsplay.length)*100,
      speed = 20

      document.getElementById('correct').innerHTML = 'Correct : '+correctCount
      document.getElementById('skip').innerHTML = 'Skip : '+newskip
      if(progressEndValue <= 20){
      document.getElementById('Text').innerHTML = 'ผิดหวังอ่ะ'
        }
      else if(progressEndValue <= 40){
        document.getElementById('Text').innerHTML = 'ได้แค่นี้อ่อ'
      }
      else if(progressEndValue <= 60){
        document.getElementById('Text').innerHTML = 'ดีอยู่ ='
      }
      else if(progressEndValue <= 80){
        document.getElementById('Text').innerHTML = 'ว้าวววววววว สุดยอดไปเลย ว้าวๆๆๆ'
      }
      else if(progressEndValue <= 100){
        document.getElementById('Text').innerHTML = 'เก่งอยู่นะ แต่เก่งแค่ไหนก็ไปอยู่ในใจเค้าไม่ได้หรอก'
      }
      

let progress = setInterval(() => {
  progressStartValue++

  //progressValue.textContent = `${progressStartValue}%`
  circularProgress.style.background = `conic-gradient(#7d2 ${progressStartValue * 3.6
    }deg, #ededed 0deg)`

  if (progressStartValue >= progressEndValue) {
    clearInterval(progress)
  }
  console.log(progressStartValue)
}, speed)
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







