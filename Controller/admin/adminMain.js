

// Menu Button Overlay
const openMenuBtn = document.getElementById('openMenuBtn');
const closeMenuBtn = document.getElementById('closeMenuBtn');
const overlayMenu = document.getElementById('overlayMenu');

openMenuBtn.addEventListener('click', () => {
    overlayMenu.classList.add('active');
});

closeMenuBtn.addEventListener('click', () => {
    overlayMenu.classList.remove('active');
});

const menuLinks = document.querySelectorAll('.menu-links a');
menuLinks.forEach(link => {
    link.addEventListener('click', () => {
        overlayMenu.classList.remove('active');
    });
});