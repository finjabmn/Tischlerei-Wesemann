// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    const syncMenuState = () => {
        const isOpen = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    };

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        syncMenuState();
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            syncMenuState();
        });
    });
}

// Gallery Navigation - Infinite Loop Carousel
const galleryViewport = document.getElementById('galleryViewport');
const galleryTrack = document.getElementById('galleryTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const galleryCounter = document.getElementById('galleryCounter');

if (galleryViewport && galleryTrack && prevBtn && nextBtn) {
    const realSlides = Array.from(galleryTrack.children);
    const realCount = realSlides.length;
    const cloneCount = 3; // matches the max number of simultaneously visible images

    // Clone the last `cloneCount` images to the front and the first `cloneCount` to the back
    realSlides.slice(-cloneCount).forEach(img => {
        galleryTrack.insertBefore(img.cloneNode(true), galleryTrack.firstChild);
    });
    realSlides.slice(0, cloneCount).forEach(img => {
        galleryTrack.appendChild(img.cloneNode(true));
    });

    let currentIndex = cloneCount; // points at the first real slide
    let isAnimating = false;
    let itemWidth = 0; // image width + gap, in px

    const getVisibleCount = () => {
        const w = window.innerWidth;
        if (w <= 480) return 1;
        if (w <= 768) return 2;
        return 3;
    };

    const getGap = () => {
        const style = window.getComputedStyle(galleryTrack);
        return parseFloat(style.columnGap || style.gap) || 0;
    };

    const setPosition = (animate) => {
        galleryTrack.style.transition = animate ? 'transform 0.4s ease' : 'none';
        galleryTrack.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
    };

    // Klon-Position auf den echten Bildindex zurückrechnen
    const updateCounter = () => {
        if (!galleryCounter) return;
        const realIndex = ((currentIndex - cloneCount) % realCount + realCount) % realCount;
        galleryCounter.textContent = `${realIndex + 1} / ${realCount}`;
    };

    const updateSizes = () => {
        const visibleCount = getVisibleCount();
        const gap = getGap();
        const viewportWidth = galleryViewport.offsetWidth;
        const width = (viewportWidth - gap * (visibleCount - 1)) / visibleCount;
        itemWidth = width + gap;

        Array.from(galleryTrack.children).forEach(img => {
            img.style.width = `${width}px`;
        });

        setPosition(false);
    };

    const goTo = (index) => {
        if (isAnimating) return;
        isAnimating = true;
        currentIndex = index;
        setPosition(true);
        updateCounter();
    };

    galleryTrack.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'transform') return;

        if (currentIndex >= cloneCount + realCount) {
            currentIndex -= realCount;
            setPosition(false);
        } else if (currentIndex < cloneCount) {
            currentIndex += realCount;
            setPosition(false);
        }

        isAnimating = false;
    });

    nextBtn.addEventListener('click', () => goTo(currentIndex + 1));
    prevBtn.addEventListener('click', () => goTo(currentIndex - 1));

    // Touch swipe support
    let touchStartX = 0;
    let touchDeltaX = 0;
    let isTouching = false;

    galleryViewport.addEventListener('touchstart', (e) => {
        if (isAnimating) return;
        isTouching = true;
        touchStartX = e.touches[0].clientX;
        touchDeltaX = 0;
        galleryTrack.style.transition = 'none';
    }, { passive: true });

    galleryViewport.addEventListener('touchmove', (e) => {
        if (!isTouching) return;
        touchDeltaX = e.touches[0].clientX - touchStartX;
        galleryTrack.style.transform = `translateX(${-currentIndex * itemWidth + touchDeltaX}px)`;
    }, { passive: true });

    galleryViewport.addEventListener('touchend', () => {
        if (!isTouching) return;
        isTouching = false;

        const threshold = itemWidth * 0.2;
        if (touchDeltaX < -threshold) {
            goTo(currentIndex + 1);
        } else if (touchDeltaX > threshold) {
            goTo(currentIndex - 1);
        } else {
            isAnimating = true;
            setPosition(true);
        }
    });

    // Initial setup
    updateSizes();
    updateCounter();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateSizes, 150);
    });
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

// Contact Form Handler - Formspree (AJAX)
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

if (contactForm && formStatus) {
    const submitButton = contactForm.querySelector('.form-button');
    const originalButtonText = submitButton.textContent;
    let isSubmitting = false;

    const showStatus = (message, type) => {
        formStatus.textContent = message;
        formStatus.classList.remove('is-success', 'is-error');
        formStatus.classList.add('is-visible', type === 'success' ? 'is-success' : 'is-error');
    };

    const hideStatus = () => {
        formStatus.textContent = '';
        formStatus.classList.remove('is-visible', 'is-success', 'is-error');
    };

    const setBusy = (busy) => {
        isSubmitting = busy;
        submitButton.disabled = busy;
        submitButton.textContent = busy ? 'Wird gesendet …' : originalButtonText;
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Mehrfache Übermittlungen verhindern
        if (isSubmitting) return;

        // Alte Meldung ausblenden, bevor ein neuer Versuch startet
        hideStatus();
        setBusy(true);

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            });

            if (response.ok) {
                showStatus('Vielen Dank! Ihre Nachricht wurde erfolgreich versendet.', 'success');
                // Nur bei Erfolg leeren – bei Fehlern bleiben die Eingaben erhalten
                contactForm.reset();
            } else {
                showStatus('Die Nachricht konnte leider nicht versendet werden. Bitte versuchen Sie es erneut.', 'error');
            }
        } catch (error) {
            showStatus('Die Nachricht konnte leider nicht versendet werden. Bitte versuchen Sie es erneut.', 'error');
        } finally {
            setBusy(false);
        }
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