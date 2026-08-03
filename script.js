// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Gallery Navigation - Center Image
const gallerySlider = document.getElementById('gallerySlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (prevBtn && nextBtn && gallerySlider) {
    let currentImageIndex = 0;
    const images = gallerySlider.querySelectorAll('.gallery-image');

    const scrollToCenter = (index) => {
        if (index < 0 || index >= images.length) return;

        const targetImage = images[index];
        const sliderWidth = gallerySlider.offsetWidth;
        const imageWidth = targetImage.offsetWidth;
        const computedStyle = window.getComputedStyle(gallerySlider);
        const gap = parseFloat(computedStyle.gap) || 24;

        // Calculate position to center the image
        let offsetLeft = 0;
        for (let i = 0; i < index; i++) {
            offsetLeft += images[i].offsetWidth + gap;
        }

        const scrollPosition = offsetLeft - (sliderWidth - imageWidth) / 2;

        gallerySlider.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });

        currentImageIndex = index;
    };

    prevBtn.addEventListener('click', () => {
        currentImageIndex = Math.max(0, currentImageIndex - 1);
        scrollToCenter(currentImageIndex);
    });

    nextBtn.addEventListener('click', () => {
        currentImageIndex = Math.min(images.length - 1, currentImageIndex + 1);
        scrollToCenter(currentImageIndex);
    });

    // Initialize to center first image
    scrollToCenter(0);
}

// Modal Functions
function showImpressum(e) {
    e.preventDefault();
    const modal = document.getElementById('impressumModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function showDatenschutz(e) {
    e.preventDefault();
    const modal = document.getElementById('datenschutzModal');
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Close modal when clicking outside the modal content
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('show');
    }
});

// Lightbox functionality
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryImages = document.querySelectorAll('.gallery-image');

if (galleryImages.length > 0) {
    galleryImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
            lightboxModal.classList.add('show');
        });
    });
}

if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('show');
    });
}

if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) {
            lightboxModal.classList.remove('show');
        }
    });
}

// Contact Form Handler - Formspree
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const button = contactForm.querySelector('.form-button');
        const originalText = button.textContent;

        button.textContent = 'Wird gesendet...';
        button.disabled = true;
    });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#impressum' && href !== '#datenschutz') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        }
    });
});