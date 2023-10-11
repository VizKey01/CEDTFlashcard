
/*export async function getFlashcardsplayFromMongoDB() {
  try {
    const response = await fetch('/flashcards'); // เปลี่ยนเส้นทาง URL ตาม API Endpoint ของคุณ
    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        return result.flashcards; // ส่งรายการ flashcards ที่ได้มากลับ
      } else {
        console.error(result.message);
      }
    } else {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
  }
}

export async function updateFlashcardsFromMongoDB() {
  const flashcards = await getFlashcardsFromMongoDB();
  if (flashcards && flashcards.length > 0) {
    // อัปเดตรายการ flashcards ในไฟล์ play.js
    // เปลี่ยนตำแหน่งเริ่มต้นของ currentFlashcardIndex และอัปเดต flashcards ด้วยข้อมูลใหม่
    currentFlashcardIndex = 0;
    flashcards.forEach((flashcard, index) => {
      flashcards[index] = { term: flashcard.title, definition: flashcard.description };
    });
    return flashcards;
  }
  return null;
}*/






const Playbutt = document.querySelectorAll('.play-button');

// ลูปผ่านทุกองค์ประกอบแล้วให้เพิ่มเหตุการณ์คลิกที่ทุกองค์ประกอบ
Playbutt.forEach((playpop) => {
  console.log(playpop);
  playpop.addEventListener('click', playcard);
});

// flashcard
function playcard() {
  document.querySelector('.play-popup').classList.add('active');
}

//กด กลับ
document.querySelector('.close-popup').addEventListener('click', function () {
  document.querySelector('.play-popup').classList.remove('active');
})





//หลังกด play ให้แสดงการ์ดขึ้นมา
const playing = document.querySelector(".play-submit");




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


export async function addFlashcardToPlay(flashcardId) {
  try {
    // ดึงข้อมูลจาก MongoDB โดยใช้ flashcardId
    console.log(flashcardId);
    console.log('URL ที่ใช้ในคำขอ fetch:', `/flashcards/${flashcardId}`);
    const response = await fetch(`/flashcards/${flashcardId}`);
    console.log('ผ่าน');
    if (response.ok) {
      const result = await response.json();
      console.log('ข้อมูลที่ได้จาก API:', result); // ย้ายการใช้งาน result ไปตรงนี้
      if (result.success) {
        if (result.todos && Array.isArray(result.todos)) {
          result.todos.forEach((todo) => {
            const term = todo.term;
            const definition = todo.definition;
            flashcardsplay.push({ term, definition });
            console.log('เพิ่ม Flashcard ลงใน flashcardsplay:', { term, definition });
          });
        }
      } else {
        console.error(result.message);
      }
    } else {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
  }
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
      document.getElementById('Text').innerHTML = 'ครั้งหน้าเอาใหม่'
        }
      else if(progressEndValue <= 40){
        document.getElementById('Text').innerHTML = 'เกือบละอีกนิดเดียว'
      }
      else if(progressEndValue <= 60){
        document.getElementById('Text').innerHTML = 'เก่งละ'
      }
      else if(progressEndValue <= 80){
        document.getElementById('Text').innerHTML = 'เก่งมากๆ'
      }
      else if(progressEndValue <= 100){
        document.getElementById('Text').innerHTML = 'ไอ้เหี้ยเก่งชิบหา'
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



