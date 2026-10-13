// common.js - Shared UI loader and interactivity for Shri Durga Ji Mahinathpur

function initSharedUI() {
    // 1. Navigation loader with graceful local fallback
    const navContainer = document.getElementById("nav");
    if (navContainer) {
        if (!navContainer.children.length || navContainer.children.length === 0) {
            fetch("nav.html")
                .then(r => r.text())
                .then(d => {
                    navContainer.innerHTML = d;
                    setupMobileMenu();
                    highlightActiveNav();
                })
                .catch(e => {
                    console.log("Local fetch fallback active for nav.");
                    setupMobileMenu();
                    highlightActiveNav();
                });
        } else {
            setupMobileMenu();
            highlightActiveNav();
        }
    }

    // 2. Footer loader with graceful local fallback
    const footerContainer = document.getElementById("footer");
    if (footerContainer && (!footerContainer.children.length || footerContainer.children.length === 0)) {
        fetch("footer.html")
            .then(r => r.text())
            .then(d => {
                footerContainer.innerHTML = d;
            })
            .catch(e => console.log("Local fetch fallback active for footer."));
    }

    // 3. Components
    loadComponent("navigation-cards", "navigation-cards.html");
    loadComponent("ads-right", "ads-right.html");
    loadComponent("ads-bottom", "ads-bottom.html");

    // 4. Modals & Lightbox Setup
    setupDonationModal();
    setupGalleryLightbox();
}

function loadComponent(id, file) {
    const el = document.getElementById(id);
    if (el && (!el.children.length || el.children.length === 0)) {
        fetch(file)
            .then(r => r.text())
            .then(d => { el.innerHTML = d; })
            .catch(e => console.log("Local fetch fallback for " + id));
    }
}

function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.onclick = (e) => {
            e.stopPropagation();
            mobileMenu.classList.toggle('hidden');
        };
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '#donation-modal' || targetId === '#donation-widget') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                if (mobileMenu) mobileMenu.classList.add('hidden');
            }
        });
    });
}

function highlightActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const allLinks = document.querySelectorAll('#nav a');

    allLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('nav-link-active');
            link.classList.remove('text-accent-100');
        }
    });
}

function setupDonationModal() {
    document.addEventListener('click', function (e) {
        const trigger = e.target.closest('[data-donation-trigger], a[href="#donation-widget"], a[href="#donation-modal"]');
        if (trigger) {
            e.preventDefault();
            openDonationModal();
        }
    });
}

function openDonationModal() {
    let modal = document.getElementById('global-donation-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'global-donation-modal';
        modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm';
        modal.innerHTML = `
            <div class="relative w-full max-w-md bg-primary-900 border border-accent-400/40 rounded-2xl p-6 text-center text-white shadow-2xl">
                <button id="close-donation-modal" class="absolute top-3 right-4 text-accent-200 hover:text-white text-3xl font-bold">&times;</button>
                <div class="inline-flex items-center space-x-2 bg-accent-500/20 px-3 py-1 rounded-full mb-3 border border-accent-400/30">
                    <span class="text-accent-400 text-xs font-semibold">श्री दुर्गा जी महीनाथपुर</span>
                </div>
                <h3 class="text-2xl font-headline text-accent-400 font-semibold mb-2">पावन योगदान एवं दान</h3>
                <p class="text-xs text-accent-100 mb-4">माँ दुर्गाक सेवा एवं मंदिर विकास हेतु अपन श्रद्धा समर्पित करू।</p>
                <div class="bg-primary-950 border border-accent-400/30 p-4 rounded-xl mb-4 text-left space-y-1.5 text-xs md:text-sm text-accent-100">
                    <p><strong class="text-accent-400">खाताधारी:</strong> सतीश कुमार झा</p>
                    <p><strong class="text-accent-400">ईमेल:</strong> durgajimahinathpur@gmail.com</p>
                    <p><strong class="text-accent-400">वेबसाइट:</strong> durgajimahinathpur.com</p>
                </div>
                <div class="flex justify-center mb-4">
                    <div class="bg-white p-3 rounded-xl shadow-lg border-2 border-accent-400/50">
                        <img src="assets/images/qr-donation.png" alt="दान हेतु QR कोड" class="w-48 h-48 object-contain">
                    </div>
                </div>
                <p class="text-xs text-accent-200">स्कैन कऽ direct UPI (Google Pay, PhonePe, Paytm) सँ अपन दान समर्पित करू।</p>
            </div>
        `;
        document.body.appendChild(modal);
        modal.querySelector('#close-donation-modal').onclick = () => modal.classList.add('hidden');
        modal.onclick = (e) => { if (e.target === modal) modal.classList.add('hidden'); };
    } else {
        modal.classList.remove('hidden');
    }
}

function setupGalleryLightbox() {
    document.addEventListener('click', function(e) {
        const img = e.target.closest('[data-lightbox]');
        if (img) {
            const src = img.getAttribute('src') || img.getAttribute('data-lightbox');
            const alt = img.getAttribute('alt') || 'श्री दुर्गा जी महीनाथपुर';
            openLightbox(src, alt);
        }
    });
}

function openLightbox(src, alt) {
    let lb = document.getElementById('global-lightbox');
    if (!lb) {
        lb = document.createElement('div');
        lb.id = 'global-lightbox';
        lb.className = 'fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md';
        lb.innerHTML = `
            <button id="close-lightbox" class="absolute top-4 right-4 text-white text-3xl font-bold p-2 hover:text-accent-400">&times;</button>
            <img id="lightbox-img" src="${src}" alt="${alt}" class="max-w-full max-h-[80vh] rounded-lg shadow-2xl object-contain mb-3 border border-accent-400/30">
            <p id="lightbox-caption" class="text-accent-200 text-sm font-headline text-center max-w-xl px-4">${alt}</p>
        `;
        document.body.appendChild(lb);
        lb.querySelector('#close-lightbox').onclick = () => lb.classList.add('hidden');
        lb.onclick = (e) => { if (e.target === lb) lb.classList.add('hidden'); };
    } else {
        document.getElementById('lightbox-img').src = src;
        document.getElementById('lightbox-caption').innerText = alt;
        lb.classList.remove('hidden');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSharedUI);
} else {
    initSharedUI();
}