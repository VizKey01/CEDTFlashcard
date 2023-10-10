

window.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    if (window.scrollY > 0) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});


// login section
document.querySelector('#show-login1').addEventListener('click', function () {
    document.querySelector('.overlay').style.display = 'block'; // Show the overlay
    document.querySelector('.popup').classList.add('active');
});

document.querySelector('#show-login2').addEventListener('click', function () {
    document.querySelector('.overlay').style.display = 'block'; // Show the overlay
    document.querySelector('.popup').classList.add('active');
});

document.querySelector('.profile-icon').addEventListener('click', function () {
    document.querySelector('.overlay').style.display = 'block'; // Show the overlay
    document.querySelector('.popup').classList.add('active');
});

document
    .querySelector('.close-btn')
    .addEventListener('click', function () {
        document.querySelector('.overlay').style.display = 'none'; // Hide the overlay
        document.querySelector('.popup').classList.remove('active');
        // document.querySelector('.delete-popup').classList.remove('active');
});

document.querySelector('.overlay').addEventListener('click', function () {
    document.querySelector('.overlay').style.display = 'none'; // Hide the overlay
    document.querySelector('.popup').classList.remove('active');
    // document.querySelector('#menu-toggle').classList.remove('active');
});

let headbar = document.querySelector('.menu');

document.querySelector('#menu-toggle').onclick = () =>{
    // document.querySelector('.overlay').style.display = 'block';
    headbar.classList.toggle('active');
}


// delete card section

document.querySelector('.delete-button').addEventListener('click', function () {
    // document.querySelector('.overlay').style.display = 'block'; // Show the overlay
    document.querySelector('.delete-popup').classList.add('active');
});

document.querySelector('.close-delete').addEventListener('click', function () {
    // document.querySelector('.overlay').style.display = 'none'; // Show the overlay
    document.querySelector('.delete-popup').classList.remove('active');
});

