// Add this code to your frontend JavaScript file (index.html)
async function displayFlashcards() {
  try {
    // ดึงข้อมูล Flashcard จาก API Endpoint ที่คุณสร้างใน index.js
    const response = await fetch('/flashcards');

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const flashcards = result.flashcards;

        // สร้าง Flashcard Content จากข้อมูลที่ได้มาจาก MongoDB
        const flashcardContainer = document.querySelector('.flashcard-container');

        flashcards.forEach((flashcard) => {
          const flashcardContent = document.createElement('div');
          flashcardContent.classList.add('flashcard-content');

          const h3 = document.createElement('h3');
          h3.textContent = flashcard.title;

          const p = document.createElement('p');
          p.textContent = flashcard.description;

          const editButton = document.createElement('button');
          editButton.classList.add('edit-button');
          editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';

          const deleteButton = document.createElement('button');
          deleteButton.classList.add('delete-button');
          deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';

          flashcardContent.appendChild(h3);
          flashcardContent.appendChild(p);
          flashcardContent.appendChild(editButton);
          flashcardContent.appendChild(deleteButton);

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


const todoTerm = document.querySelector('.todo-term')
const todoDefinition = document.querySelector('.todo-definition')
const addTodoButton = document.querySelector('.add-todo')
const todoList = document.querySelector('.todo-list')

function removeTodo(event) {
  event.target.parentNode.remove()
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

        // หากคุณต้องการเพิ่มข้อมูลลงใน flashcard-content
        const flashcardContainer = document.querySelector('.flashcard-container');

        // สร้าง div ใหม่สำหรับ flashcard-content
        const flashcardContent = document.createElement('div');
        flashcardContent.classList.add('flashcard-content');

        // สร้าง h3 สำหรับ Flashcard Title
        const h3 = document.createElement('h3');
        h3.textContent = title;

        // สร้าง p สำหรับ Flashcard Description
        const p = document.createElement('p');
        p.textContent = description;

        // สร้าง button สำหรับ Edit
        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.innerHTML = '<i class="fas fa-edit"></i> Edit';

        // สร้าง button สำหรับ Delete
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i> Delete';

        // เพิ่ม elements ลงใน flashcardContent
        flashcardContent.appendChild(h3);
        flashcardContent.appendChild(p);
        flashcardContent.appendChild(editButton);
        flashcardContent.appendChild(deleteButton);

        // เพิ่ม flashcardContent ลงใน flashcardContainer
        flashcardContainer.appendChild(flashcardContent);

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







//---------------summit flashcard---------------


