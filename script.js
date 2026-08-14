// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger) {
    const syncMenuState = () => {
        const isOpen = navMenu.classList.contains('active');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        hamburger.setAttribute('aria-label', isOpen ? 'Menü schließen' : 'Menü öffnen');
    };

    const closeMenu = () => {
        navMenu.classList.remove('active');
        syncMenuState();
    };

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        syncMenuState();
    });

    // Close menu when a link is clicked
    const navLinks = navMenu.querySelectorAll('a');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu with the Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
            hamburger.focus();
        }
    });

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
        if (!navMenu.classList.contains('active')) return;
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            closeMenu();
        }
    });
}

// Masonry-Galerie: Klick auf ein Bild öffnet die Lightbox
const lightboxModal = document.getElementById('lightboxModal');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');
const galleryItems = document.querySelectorAll('.gallery-item');

if (galleryItems.length > 0 && lightboxModal && lightboxImage) {
    let lastFocusedItem = null;

    const openLightbox = (item) => {
        const img = item.querySelector('img');
        lightboxImage.src = img.src;
        lightboxImage.alt = img.alt;
        lastFocusedItem = item;
        lightboxModal.classList.add('show');
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('show');
        // Fokus zurück auf das Bild geben, das die Lightbox geöffnet hat
        if (lastFocusedItem) lastFocusedItem.focus();
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => openLightbox(item));
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }

    // Schließen bei Klick auf den abgedunkelten Hintergrund
    lightboxModal.addEventListener('click', (e) => {
        if (e.target === lightboxModal) closeLightbox();
    });

    // Schließen mit Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxModal.classList.contains('show')) {
            closeLightbox();
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

// Smooth scroll for in-page anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});