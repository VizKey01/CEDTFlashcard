// backend/models/Login.js
const mongoose = require('mongoose');

const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const Login = mongoose.model('Login', loginSchema);

// ใช้รูปแบบการนำออก (export) ของ CommonJS
module.exports = Login;

