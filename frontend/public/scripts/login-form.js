document.addEventListener('DOMContentLoaded', function () {
  var loginButtonInsidePopup = document.querySelector('.popup button');

  loginButtonInsidePopup.addEventListener('click', async function () {
    var usernameInput = document.querySelector('.popup #username');
    var passwordInput = document.querySelector('.popup #password');
    var enteredUsername = usernameInput.value;
    var enteredPassword = passwordInput.value;

    console.log('username is ' + enteredUsername);

    var highlightElements = document.querySelectorAll('.highlight');
    var welcomeUsername = document.querySelector('#usernameee');

    highlightElements[0].textContent = enteredUsername;
    welcomeUsername.textContent = enteredUsername;

    // ส่งข้อมูลการเข้าสู่ระบบไปยัง API
    try {
      const response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: enteredUsername, password: enteredPassword }),
      });

      const responseData = await response.json();

      if (response.ok) {
        if (responseData.success) {
          console.log(responseData.message);
          // Handle successful login or registration here
          // You can update the UI or redirect the user to another page
          if (responseData.userData.isLoggedIn) {
            // User is logged in, you can handle this case here
          } else {
            // User is registered, you can handle this case here
          }
        } else {
          console.error(responseData.message);
          // Handle login or registration failure here
          // Display an error message to the user
        }
      } else {
        console.error('การส่งข้อมูลล้มเหลว');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการส่งข้อมูล:', error);
    }

    /* close login form*/
    document.querySelector('.overlay').style.display = 'none';
    document.querySelector('.login-button button').style.display = 'none';
    document.querySelector('.profile-icon').style.display = 'block';
    document.querySelector('.popup').classList.remove('active');
  });
});
