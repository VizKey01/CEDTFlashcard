
//import { addFlashcardsToPlay } from "./play.js";
const flashcardsplay = [
  { term: "ready??", definition: "go!!!" },
  

  // Add more flashcardsplay as needed
];


const tempflashcardsplay = [];
async function displayFlashcards() {
  try {
    // ดึงข้อมูล Flashcard จาก API Endpoint ที่สร้างใน index.js
    const response = await fetch('/flashcards');

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const flashcards = result.flashcards;

        // สร้าง Flashcard Content จากข้อมูลที่ได้มาจาก MongoDB
        const flashcardContainer = document.querySelector('.flashcard-container');

        flashcards.forEach((flashcard, index) => {
          const flashcardContent = document.createElement('div');
          flashcardContent.classList.add('flashcard-content');


          // เพิ่ม data attribute สำหรับ flashcardId
          flashcardContent.setAttribute('data-flashcard-id', flashcard._id);

          const h3 = document.createElement('h3');
          h3.textContent = flashcard.title;

          const p = document.createElement('p');
          p.textContent = flashcard.description;

          const descriptiontext = document.createElement('div');
          descriptiontext.classList.add('adjusts');
          descriptiontext.appendChild(p);


          let isEditing = false;
          const editButton = document.createElement('button');
          editButton.classList.add('edit-button');
          editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';
          editButton.onclick = function () {

            const flashcardId = flashcardContent.getAttribute('data-flashcard-id');
            isEditing = true;
            const editPopup = document.querySelector('.edit-popup');
            editPopup.classList.add('active');

            // ดึงข้อมูล flashcard และใส่ลงในฟอร์มสำหรับการแก้ไข
            document.querySelector('.edittodo-title').value = flashcard.title;
            document.querySelector('.edittodo-description').value = flashcard.description;

            // แสดงรายการ todo ลงใน todo list ด้วยการอ่าน flashcard.todos และใส่ในรายการใหม่
            const todoList = document.querySelector('.edittodo-list');
            clearTodoList(); // เพิ่มฟังก์ชันล้างรายการ todo ทั้งหมด
            flashcard.todos.forEach((todo) => {
              // สร้างรายการ todo ใน todo list ด้วยฟังก์ชัน addTodoForEdit()
              addTodoForEdit(todo.term, todo.definition);
            });
            document.querySelector('#editcard').addEventListener('click', async function () {
              // ดึงข้อมูลจากฟอร์มการ์ดแก้ไข
              const newTitle = document.querySelector('.edittodo-title').value;
              const newDescription = document.querySelector('.edittodo-description').value;
              const flashcardId = flashcard._id;
              // ดึงรายการ todos ที่ผู้ใช้แก้ไขเข้ามา
              const todoItems = document.querySelectorAll('.todo');
              const newTodos = [];

              todoItems.forEach((todoItem) => {
                const termElement = todoItem.querySelector('#getnameterm');
                const definitionElement = todoItem.querySelector('#getnamedefi');

                if (termElement && definitionElement) {
                  const term = termElement.innerHTML;
                  const definition = definitionElement.innerHTML;
                  newTodos.push({ term, definition });
                }
              });
              document.querySelector('.edit-popup').classList.remove('active')
              try {
                // ดึงค่า ID ของ Flashcard ที่ต้องการแก้ไข
                const flashcardId = flashcard._id; // ต้องมีการเก็บค่า flashcard ที่ต้องการแก้ไข

                // ส่งคำขอ PUT ไปยัง API Endpoint ที่เชื่อมต่อกับ MongoDB
                const updateResponse = await fetch(`/flashcards/${flashcardId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ todos: newTodos }),
                });

                if (updateResponse.ok) {
                  // ถ้าอัปเดตสำเร็จ
                  // ทำตามการแสดงผลหรือการจัดการข้อมูลเพิ่มเติมตามที่คุณต้องการ
                  console.log('อัปเดต Flashcard สำเร็จ');

                  // หลังจากอัปเดตข้อมูลใน Flashcard แล้วคุณสามารถล้างค่า input fields เหมือนเดิม
                  document.querySelector('.edittodo-title').value = '';
                  document.querySelector('.edittodo-description').value = '';
                  document.querySelector('.todo-list').innerHTML = '';

                  // หลังจากอัปเดต Flashcard แล้วคุณสามารถแสดงข้อมูล Flashcard ใหม่
                  clearFlashcardContainer();
                  displayFlashcards();
                } else {
                  console.error('Error updating flashcard:', updateResponse.statusText);
                  // จัดการข้อผิดพลาดที่เกิดขึ้นถ้าจำเป็น
                }
              } catch (error) {
                console.error('Error updating item:', error);
                // จัดการข้อผิดพลาดที่เกิดขึ้นถ้าจำเป็น
              }
            });

          };

          // เพิ่มฟังก์ชันล้างรายการ todo ทั้งหมด
          function clearTodoList() {
            const todoList = document.querySelector('.edittodo-list');
            while (todoList.firstChild) {
              todoList.firstChild.remove();
            }
          }

          // เพิ่มรายการ todo ใน edit popup
          function addTodoForEdit(term, definition) {
            // สร้างรายการ todo ใน todo list ด้วยฟังก์ชัน addTodo()
            document.querySelector('.edittodo-term').value = term;
            document.querySelector('.edittodo-definition').value = definition;
            editTodo();

          }


          // const playButton = document.createElement('button');
          // playButton.classList.add('play-button');
          // deleteButton.innerHTML = 'Play';



          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-button');
          deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';

          deleteButton.onclick = function () {
            showDeletePopup();

            // Handle the "No" button click
            document.querySelector('#delete-card-no').addEventListener('click', function () {
              // Hide the delete confirmation popup
              hideDeletePopup();
            });

            document.querySelector('#delete-card-yes').addEventListener('click', async function () {
              try {
                hideDeletePopup();

                // ดึงค่า ID ของ Flashcard ที่ต้องการลบ
                const flashcardId = flashcard._id; // ให้ flashcard มี property _id ตามข้อมูลที่มีใน MongoDB

                // ส่งคำขอ DELETE ไปยัง API Endpoint ที่เชื่อมต่อกับ MongoDB
                const deleteResponse = await fetch(`/flashcards/${flashcardId}`, {
                  method: 'DELETE',
                });

                if (deleteResponse.ok) {
                  // ถ้าลบสำเร็จ
                  // Remove the deleted flashcard-content from the DOM
                  flashcardContent.remove(); // Remove the deleted flashcard-content element
                } else {
                  console.error('Error deleting flashcard:', deleteResponse.statusText);
                  // Handle error if needed
                }
              } catch (error) {
                console.error('Error deleting item:', error);
                // Handle error if needed
              }
            });
          };
          async function playcard() {
            tempflashcardsplay.length = 0;
            const title = flashcardContent.querySelector('h3').textContent;
            const description = flashcardContent.querySelector('.adjusts p').textContent;
          
            const popupTitle = document.getElementById('nameti');
            const popupDescription = document.getElementById('namede');
            popupTitle.textContent = title;
            popupDescription.textContent = description;
          
            const playPopup = document.querySelector('.play-popup');
            playPopup.classList.add('active');
          
            // ดึงค่า title จาก flashcard
            const flashcardtitle = flashcard.title;
            console.log(flashcardtitle)
            
            // สร้างคำขอไปยัง API ในการค้นหา flashcard โดยใช้ title เป็นเงื่อนไข
            try {
              const response = await fetch(`/flashcards?title=${flashcardtitle}`);
              if (response.ok) {
                const result = await response.json();
            
                if (result.success) {
                  const foundFlashcard = result.flashcards.find(flashcard => flashcard.title === flashcardtitle);
            
                  if (foundFlashcard) {
                    const todos = foundFlashcard.todos;
            
                    // เพิ่ม todos ลงใน tempflashcardsplayy
                    todos.forEach((todo) => {
                      const term = todo.term;
                      const definition = todo.definition;
                      tempflashcardsplay.push({ term, definition });
                      console.log('เพิ่ม Flashcard ลงใน tempflashcardsplayy:', { term, definition });
                    });
                  } else {
                    console.error('ไม่พบ flashcard ที่ตรงกับเงื่อนไข');
                  }
                } else {
                  console.error('เกิดข้อผิดพลาดในการค้นหา flashcard:', result.message);
                }
              } else {
                console.error('เกิดข้อผิดพลาดในการค้นหา flashcard:', response.statusText);
              }
            } catch (error) {
              console.error('เกิดข้อผิดพลาดในการค้นหา flashcard:', error);
            }

            tempflashcardsplay.forEach((flashcard, index) => {
              console.log(`Flashcard ${index + 1}`);
              console.log(`Term: ${flashcard.term}`);
              console.log(`Definition: ${flashcard.definition}`);
              console.log('------------------------');
            });
            document.querySelector('#playsub').addEventListener('click', function () {
              //flashcardsplay = flashcardsplay.concat(tempflashcardsplayy);
              flashcardsplay = [
                { term: "ready??", definition: "go!!!" },
                
              
                
              ];
              // document.querySelector('.overlay').style.display = 'block';
              tempflashcardsplay.forEach(tempflashcard => {
                console.log(tempflashcard.term)
                console.log(tempflashcard.definition)
                flashcardsplay.push({ term: tempflashcard.term, definition: tempflashcard.definition });
              });
              document.querySelector('.play-popup').classList.remove('active');

              var timeout = 800;
              setTimeout(() => {
                document.querySelector('.header').style.display = 'none';
                document.querySelector('content').style.display = 'none';
                document.querySelector('footer').style.display = 'none';
                document.querySelector('.PLAYCARD').style.display = 'block';
                
              }, timeout);
              
              //กดกลับ ตอนเล่น
              // document.querySelector('.close-playingcard').addEventListener('click', function () {
              //   document.querySelector('.header').style.display = 'block';
              //   document.querySelector('.content').style.display = 'block';
              //   document.querySelector('.footer').style.display = 'block';
              //   document.querySelector('.PLAYCARD').style.display = 'none';
              // })  
                        
                
            })
          }

          const playButton = document.createElement('div');
          playButton.classList.add('play-button');
          playButton.innerHTML = '<p style=text-align:center;>Play</p>';
          playButton.onclick = function () {

            playcard()
            
          }

          flashcardContent.appendChild(h3);
          flashcardContent.appendChild(descriptiontext);
          flashcardContent.appendChild(editButton);
          flashcardContent.appendChild(deleteButton);
          flashcardContent.appendChild(playButton);


          flashcardContainer.appendChild(flashcardContent);
        });

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

// เรียกใช้งานฟังก์ชันเมื่อหน้าเว็บโหลดเสร็จ
window.addEventListener('DOMContentLoaded', () => {
  displayFlashcards();

});


document.querySelector('.create-flashcard-button').addEventListener('click', function () {
  // document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.createnew-popup').classList.add('active')
})

document.querySelector('.new-flashcard-button').addEventListener('click', function () {
  // document.querySelector('.overlay').style.display = 'block';
  document.querySelector('.createnew-popup').classList.add('active')
})
//กด กลับ
document.querySelector('.createnew-popup .back').addEventListener('click', function () {
  document.querySelector('.createnew-popup').classList.remove('active')
  document.querySelector('.overlay').style.display = 'none';

})
//กด submit
document.querySelector('#createnewcard').addEventListener('click', function () {
  document.querySelector('.createnew-popup').classList.remove('active')
})





//กด กลับ
document.querySelector('.edit-popup .back').addEventListener('click', function () {
  document.querySelector('.edit-popup').classList.remove('active')
  document.querySelector('.overlay').style.display = 'none';
})
//กด submit





const todoTerm = document.querySelector('.todo-term')
const todoDefinition = document.querySelector('.todo-definition')
const addTodoButton = document.querySelector('.add-todo')
const editTodoButton = document.querySelector('.edit-todo')
const todoList = document.querySelector('.todo-list')

function removeTodo(event) {
  event.target.parentNode.remove()
}


function editTodo() {
  // ตรวจสอบว่าคุณกำลังแก้ไข flashcard หรือไม่

  // ดึงข้อมูลรายการ todo จาก input fields และตรวจสอบความว่างเปล่า
  const termValue = document.querySelector('.edittodo-term').value;
  const definitionValue = document.querySelector('.edittodo-definition').value;

  if (termValue === '' || definitionValue === '') {
    alert('กรุณาใส่ Term และ Definition');
    return;
  }

  // สร้างรายการ todo จากข้อมูลใหม่
  const todo = document.createElement('div');
  todo.classList.add('todo');

  const todo_text = document.createElement('div');
  todo_text.classList.add('todo_text');

  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('remove-todo');
  button.innerHTML = '-';
  button.addEventListener('click', removeTodo);

  const termLabel = document.createElement('label');
  termLabel.innerHTML = 'Term';

  const term = document.createElement('p');
  term.id = 'getnameterm'; // เพิ่ม id สำหรับ term element
  term.innerHTML = termValue;

  const definitionLabel = document.createElement('label');
  definitionLabel.innerHTML = 'Definition';

  const definition = document.createElement('p');
  definition.id = 'getnamedefi'; // เพิ่ม id สำหรับ definition element
  definition.innerHTML = definitionValue;

  // label, p, button => todo_text
  todo_text.append(termLabel, term, definitionLabel, definition);

  todo.append(button, todo_text);

  // todo => todo list
  const todoList = document.querySelector('.edittodo-list'); // ใช้เลือก .edittodo-list
  todoList.appendChild(todo);

  // ล้าง input fields หลังจากการเพิ่มรายการ todo
  document.querySelector('.edittodo-term').value = '';
  document.querySelector('.edittodo-definition').value = '';

}




function addTodo() {
  if (todoTerm.value === '' || todoDefinition.value === '') {
    alert('กรุณาใส่อะไรบางอย่าง');
  } else {
    // todo
    const todo = document.createElement('div');
    todo.classList.add('todo');

    const todo_text = document.createElement('div');
    todo_text.classList.add('todo_text');

    // button
    const button = document.createElement('button');
    button.type = 'button';
    button.classList.add('remove-todo');
    button.innerHTML = '-';
    button.addEventListener('click', removeTodo);

    // label

    const termLabel = document.createElement('label');
    termLabel.innerHTML = 'Term';

    const term = document.createElement('p');
    term.id = 'getnameterm'; // เพิ่ม id สำหรับ term element
    term.innerHTML = todoTerm.value;

    const definitionLabel = document.createElement('label');
    definitionLabel.innerHTML = 'Definition';

    const definition = document.createElement('p');
    definition.id = 'getnamedefi'; // เพิ่ม id สำหรับ definition element
    definition.innerHTML = todoDefinition.value;

    // label, p, button => todo_text
    todo_text.append(termLabel, term, definitionLabel, definition);

    todo.append(button, todo_text);

    // todo => todo list
    todoList.prepend(todo);

    todoTerm.value = '';
    todoDefinition.value = '';
  }
}

addTodoButton.addEventListener('click', addTodo)
editTodoButton.addEventListener('click', editTodo)



function clearFlashcardContainer() {
  const flashcardContainer = document.querySelector('.flashcard-container');
  while (flashcardContainer.firstChild) {
    flashcardContainer.firstChild.remove();
  }
}

//---------------summit flashcard---------------
// ...
document.querySelector('#createnewcard').addEventListener('click', async function () {
  // ดึงข้อมูลจากฟอร์มการ์ด
  const title = document.querySelector('.todo-title').value;
  const description = document.querySelector('.todo-description').value;

  // ดึงรายการ todos ที่ผู้ใช้เพิ่มเข้ามา
  const todoItems = document.querySelectorAll('.todo');
  const todos = [];

  // ตรวจสอบว่ามีรายการ todos หรือไม่
  if (todoItems.length === 0) {
    alert('กรุณาเพิ่มรายการ Todo ก่อนที่จะบันทึก');
    return;
  }

  // สร้างรายการ todos
  todoItems.forEach((todoItem) => {
    const termElement = todoItem.querySelector('#getnameterm');
    const definitionElement = todoItem.querySelector('#getnamedefi');

    // ตรวจสอบความว่างเปล่าของ element ก่อนที่จะอ้างถึง value
    if (termElement && definitionElement) {
      const term = termElement.innerHTML;
      const definition = definitionElement.innerHTML;

      // เพิ่มรายการใน todos โดยตรง
      todos.push({ term, definition });

      // แสดงข้อมูลที่เพิ่มลงใน array ใน console.log
      console.log('เพิ่มลงใน array:', { term, definition });
    }
  });

  // ตรวจสอบค่า todos ใหม่
  console.log('todos:', todos);

  for (const [index, todo] of todos.entries()) {
    console.log(`รายการที่ ${index + 1}: Term: ${todo.term}, Definition: ${todo.definition}`);
  }



  try {
    // สร้างข้อมูล JSON สำหรับส่งไปยัง API
    const data = {
      title,
      description,
      todos, // ระบุรายการ todos ที่สร้างไว้ด้านบน
    };


    // ส่งข้อมูลไปยัง API
    const response = await fetch('/createFlashcard', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {

        // เมื่อบันทึกสำเร็จ, ทำตามการแสดงผลหรือการจัดการข้อมูลเพิ่มเติมตามที่คุณต้องการ
        console.log('บันทึก Flashcard สำเร็จ');
        clearFlashcardContainer();
        displayFlashcards();



        // หลังจากเพิ่มข้อมูลลงใน flashcard-content แล้วคุณสามารถล้างค่า input fields ได้เหมือนเดิม
        document.querySelector('.todo-title').value = '';
        document.querySelector('.todo-description').value = '';


        document.querySelector('.todo-term').value = '';
        document.querySelector('.todo-definition').value = '';

        // และให้รายการ todoList หายไป
        const todoList = document.querySelector('.todo-list');
        while (todoList.firstChild) {
          todoList.firstChild.remove();
        }
      } else {
        console.error(result.message);
      }
    } else {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
  }
});


///-----------------------------------ลบ-----------------------------------------
// เพิ่มการเชื่อมโยงปุ่ม Delete
// เพิ่มเหตุการณ์คลิกให้กับปุ่ม "Delete"
// Add this code to your JavaScript file

// Function to show the delete confirmation popup
function showDeletePopup() {
  const deletePopup = document.querySelector('.delete-popup');
  deletePopup.classList.add('active');
}

// Function to hide the delete confirmation popup
function hideDeletePopup() {
  const deletePopup = document.querySelector('.delete-popup');
  deletePopup.classList.remove('active');
}

// Attach click event handlers to all delete buttons
document.querySelectorAll('.delete-button').forEach((deleteButton, index) => {
  deleteButton.addEventListener('click', function () {
    // Show the delete confirmation popup
    showDeletePopup();

    // Handle the "No" button click
    document.querySelector('#delete-card-no').addEventListener('click', function () {
      // Hide the delete confirmation popup
      hideDeletePopup();
    });

    // Handle the "Yes" button click
    document.querySelector('#delete-card-yes').addEventListener('click', async function () {
      try {
        hideDeletePopup();

        // Remove the deleted flashcard-content from the DOM
        const flashcardContents = document.querySelectorAll('.flashcard-content');
        flashcardContents[index].remove(); // Remove the deleted flashcard-content element
      } catch (error) {
        console.error('Error deleting item:', error);
        // Handle error if needed
      }
    });
  });
});





















/*async function getFlashcardsFromMongoDB() {
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

async function updateFlashcardsFromMongoDB() {
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















































//กดกลับตอนจบ
var timeout2 = 1500;

setTimeout(() => {
  document.querySelector('#Home').addEventListener('click', function () {
                document.querySelector('.header').style.display = 'block';
                document.querySelector('content').style.display = 'block';
                document.querySelector('footer').style.display = 'block';
                document.querySelector('.PLAYCARD').style.display = 'none';
                document.querySelector('.popup_sum').classList.remove('active');
              })  
}, timeout2);
              


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

// document.querySelector('.header').style.display = 'none';
// document.querySelector('.content').style.display = 'none';
// document.querySelector('.footer').style.display = 'none';
// document.querySelector('.PLAYCARD').style.display = 'block';

//กด กลับ
document.querySelector('.close-popup').addEventListener('click', function () {
    document.querySelector('.play-popup').classList.remove('active');
})






const card = document.querySelector(".card__inner");
const skipButton = document.querySelector(".skip-button");
const correctButton = document.querySelector(".correct-button");

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







