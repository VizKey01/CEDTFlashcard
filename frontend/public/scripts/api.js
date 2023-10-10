// api.js

// import { BACKEND_URL } from "./config.js";
const { BACKEND_URL } = require('./config.js');

export async function login(data) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    throw error;
  }
}

// api.js

export async function login(data) {
  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    throw error;
  }
}

