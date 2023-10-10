const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3221;

// Connect to MongoDB using your connection string
mongoose.connect('mongodb+srv://adminuser:admin1234@project01.7pvusnb.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create a MongoDB model for the login data
const Login = require('./backend/models/Login');
//สร้างโมเดลแฟฟช
const Flashcard = require('./backend/models/Flashcard');


// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve your frontend files (HTML, JS, CSS, etc.)
app.use(express.static(__dirname + '/frontend/public'));

// Handle the login and registration form submission
app.post('/login', async (req, res) => {
  try {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Check if the user exists in MongoDB
    const existingUser = await Login.findOne({ username });

    if (existingUser) {
      // If the user exists, check the password
      if (existingUser.password === password) {
        // Password matches, user is logged in
        const userData = { username, isLoggedIn: true };
        res.json({ success: true, message: 'เข้าสู่ระบบสำเร็จ', userData });
      } else {
        // Password does not match
        res.status(401).json({ success: false, message: 'รหัสผ่านไม่ถูกต้อง' });
      }
    } else {
      // User does not exist, create a new user
      const newLogin = new Login({ username, password });
      await newLogin.save();
      // Create userData for the new user
      const userData = { username, isLoggedIn: true };
      res.json({ success: true, message: 'ลงทะเบียนและเข้าสู่ระบบสำเร็จ', userData });
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการ login:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการ login' });
  }
});


//summit flashcard
app.post('/createFlashcard', async (req, res) => {
  try {
    // Extract data from the request body
    const { title, description, todos } = req.body;

    // Create a new Flashcard document
    const newFlashcard = new Flashcard({
      title,
      description,
      todos, // ใช้ todos ที่รับมาจาก req.body
    });

    // Save the new Flashcard document to MongoDB
    await newFlashcard.save();

    res.json({ success: true, message: 'เพิ่ม Flashcard สำเร็จ' });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการเพิ่ม Flashcard:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการเพิ่ม Flashcard' });
  }
});


// index.js
// ...

// API Endpoint สำหรับดึงข้อมูล Flashcard
app.get('/flashcards', async (req, res) => {
  try {
    // ดึงข้อมูล Flashcard จาก MongoDB
    const flashcards = await Flashcard.find();

    res.json({ success: true, flashcards });
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการดึงข้อมูล Flashcard:', error);
    res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล Flashcard' });
  }
});




app.delete('/flashcards/:id', async (req, res) => {
  const flashcardId = req.params.id;

  try {
    // ทำการลบข้อมูล Flashcard ในฐานข้อมูล MongoDB โดยใช้ flashcardId
    const result = await Flashcard.findByIdAndDelete(flashcardId);

    if (result) {
      res.json({ success: true, message: 'Flashcard deleted successfully' });
    } else {
      res.status(404).json({ success: false, message: 'Flashcard not found' });
    }
  } catch (error) {
    console.error('Error deleting flashcard:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});





// ...


//------------------------------------

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});


