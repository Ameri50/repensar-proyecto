// toggleMenu.js

document.addEventListener("DOMContentLoaded", function() {
    const toggleButton = document.getElementById('toggle-button');
    const navMenu = document.getElementById('nav-menu');

    toggleButton.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
});
