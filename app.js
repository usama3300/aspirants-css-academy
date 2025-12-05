// app.js - Fully Refactored and Page-Specific
document.addEventListener('DOMContentLoaded', function() {

    /* ===================== CAROUSEL ===================== */
    const carouselInner = document.querySelector('#carouselExample .carousel-inner');
    const carouselIndicators = document.querySelector('#carouselExample .carousel-indicators');

    if (carouselInner && carouselIndicators) {
        let images = [];
        let currentIndex = 0;
        let autoplayInterval;

        // Load images dynamically
        for (let i = 1; i <= 20; i++) {
            const img = new Image();
            img.onload = function() {
                images.push(`./${i}.jpg`);
                if (images.length === 1) buildCarousel();
            };
            img.src = `./${i}.jpg`;
        }

        function buildCarousel() {
            carouselInner.innerHTML = '';
            carouselIndicators.innerHTML = '';
            images.forEach((src, index) => {
                const item = document.createElement('div');
                item.className = `carousel-item ${index === 0 ? 'active' : ''}`;
                item.innerHTML = `<img src="${src}" class="d-block w-100" style="height:300px;object-fit:cover;">`;
                carouselInner.appendChild(item);

                const indicator = document.createElement('button');
                indicator.type = 'button';
                indicator.setAttribute('data-bs-target', '#carouselExample');
                indicator.setAttribute('data-bs-slide-to', index);
                indicator.className = index === 0 ? 'active' : '';
                carouselIndicators.appendChild(indicator);
            });
            startAutoplay();
        }

        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % images.length;
                const carousel = new bootstrap.Carousel(document.querySelector('#carouselExample'));
                carousel.to(currentIndex);
            }, 3000);
        }

        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }

        const carouselEl = document.querySelector('#carouselExample');
        carouselEl.addEventListener('mouseenter', stopAutoplay);
        carouselEl.addEventListener('mouseleave', startAutoplay);
    }

    /* ===================== DICTIONARY ===================== */
    const container = document.getElementById("dictionary-container");
    const searchInput = document.getElementById("search");

    if (container && searchInput) {
        let dictionary = [];

        // Fetch JSON dictionary data
        fetch('./dictionary.json')
            .then(res => res.json())
            .then(data => {
                dictionary = data;
                displayWords(dictionary);
                createWordModal();
            })
            .catch(err => console.error("Error loading dictionary:", err));

        function displayWords(words) {
            container.innerHTML = '';
            if (words.length === 0) {
                container.innerHTML = '<p>No results found.</p>';
                return;
            }

            words.forEach(item => {
                const card = document.createElement("div");
                card.classList.add("word-card", "glow", "expandable");
                card.innerHTML = `<h3>${item.word}</h3>`;

                // Card click - open modal with details
                card.addEventListener('click', () => openWordModal(item));
                container.appendChild(card);
            });
        }

        searchInput.addEventListener("input", () => {
            const query = searchInput.value.toLowerCase();
            const filtered = dictionary.filter(entry => entry.word.toLowerCase().includes(query));
            displayWords(filtered);
        });

        /* ===================== WORD MODAL ===================== */
        function createWordModal() {
            const modal = document.createElement('div');
            modal.id = 'wordModal';
            modal.style.cssText = `
                position: fixed; top:0; left:0; right:0; bottom:0;
                background: rgba(0,0,0,0.85); display:none;
                justify-content: center; align-items: center; z-index:9999;
            `;
            modal.innerHTML = `
                <div id="modalContent" style="
                    background:#fff; color:#000; padding:30px;
                    border-radius:15px; max-width:600px; width:90%;
                    max-height:90%; overflow:auto; text-align:left;
                "></div>
            `;
            document.body.appendChild(modal);
        }

        function openWordModal(item) {
            const modal = document.getElementById('wordModal');
            const modalContent = document.getElementById('modalContent');
            modalContent.innerHTML = `
                <h2>${item.word}</h2>
                <p><strong>Meaning:</strong> ${item.meaning}</p>
                <p><strong>Synonyms:</strong> ${item.synonyms.join(", ")}</p>
                <p><strong>Antonyms:</strong> ${item.antonyms.join(", ")}</p>
                <p><strong>Examples:</strong><br>${item.examples.join("<br>")}</p>
                <button id="closeModal" style="margin-top:15px; padding:10px 20px; cursor:pointer;">Close</button>
            `;
            modal.style.display = 'flex';

            document.getElementById('closeModal').addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
    }

    /* ===================== EXPANDABLE CARDS ===================== */
    const expandableElements = document.querySelectorAll('.expandable');
    expandableElements.forEach(card => {
        card.addEventListener('click', function() {
            const content = this.nextElementSibling;
            if(content) content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });

    /* ===================== LOGIN/REGISTER MODALS ===================== */
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginModalEl = document.getElementById('loginModal');
    const registerModalEl = document.getElementById('registerModal');

    if (loginModalEl && registerModalEl) {
        const loginModal = new bootstrap.Modal(loginModalEl);
        const registerModal = new bootstrap.Modal(registerModalEl);

        document.querySelectorAll('[data-bs-target="#loginModal"]').forEach(btn => btn.addEventListener('click', () => loginModal.show()));
        document.querySelectorAll('[data-bs-target="#registerModal"]').forEach(btn => btn.addEventListener('click', () => registerModal.show()));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('loginUsername').value;
            const password = document.getElementById('loginPassword').value;

            if (!username || !password) return alert('Please fill in all fields.');

            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            if (storedUser.username === username && storedUser.password === password) {
                alert('Login successful!');
                bootstrap.Modal.getInstance(loginModalEl).hide();
            } else if(username === 'student' && password === 'student123@') {
                localStorage.setItem('user', JSON.stringify({username, password}));
                alert('Login successful!');
                bootstrap.Modal.getInstance(loginModalEl).hide();
            } else alert('Invalid credentials.');
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('registerUsername').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('registerConfirmPassword').value;

            if(!username || !password || !confirmPassword) return alert('Please fill all fields.');
            if(password !== confirmPassword) return alert('Passwords do not match.');

            localStorage.setItem('user', JSON.stringify({username, password}));
            alert('Registration successful!');
            bootstrap.Modal.getInstance(registerModalEl).hide();
        });
    }

    /* ===================== SETTINGS & DARK/LIGHT MODE ===================== */
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsModal = document.getElementById('settingsModal');
    const closeSettings = document.getElementById('closeSettings');
    const themeToggleModal = document.getElementById('themeToggleModal');

    if(settingsBtn && settingsModal && closeSettings && themeToggleModal) {
        settingsBtn.addEventListener('click', () => settingsModal.style.display = 'flex');
        closeSettings.addEventListener('click', () => settingsModal.style.display = 'none');

        themeToggleModal.addEventListener('change', () => {
            document.body.classList.toggle('light-mode');
        });
    }

});
