function toggleMenu() {
    const nav = document.getElementById('nav');
    const menuIcon = document.querySelector('.menu-icon');
    nav.classList.toggle('active');
    menuIcon.classList.toggle('active');
}

function openModal(modalId) {
    document.body.style.overflow = 'hidden'; // Desativa o scrollbar do body
    document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
    document.body.style.overflow = 'auto'; // Reativa o scrollbar do body
    document.getElementById(modalId).style.display = "none";
}

document.querySelectorAll('nav a, .projects .project').forEach(item => {
    item.addEventListener('mousemove', function(e) {
        for (let i = 0; i < 10; i++) {
            let particle = document.createElement('span');
            particle.classList.add('particle');
            let x = e.offsetX;
            let y = e.offsetY;
            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--x', `${(Math.random() - 0.5) * 100}px`);
            particle.style.setProperty('--y', `${(Math.random() - 0.5) * 100}px`);
            item.appendChild(particle);
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    });
});

function nextImage(carouselId) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('img');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.add('active');
    updatePreviews(carouselId, currentIndex);
}

function prevImage(carouselId) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('img');
    let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
    images[currentIndex].classList.remove('active');
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    images[currentIndex].classList.add('active');
    updatePreviews(carouselId, currentIndex);
}

function showImage(carouselId, index) {
    const carousel = document.getElementById(carouselId);
    const images = carousel.querySelectorAll('img');
    images.forEach(img => img.classList.remove('active'));
    images[index].classList.add('active');
    updatePreviews(carouselId, index);
}

function updatePreviews(carouselId, index) {
    const previewId = carouselId.replace('carousel', 'preview');
    const previews = document.getElementById(previewId).querySelectorAll('img');
    previews.forEach(preview => preview.classList.remove('active'));
    previews[index].classList.add('active');
}