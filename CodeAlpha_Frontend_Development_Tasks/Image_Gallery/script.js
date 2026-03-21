// Image Data
const images = [
    { id: 1, src: "https://picsum.photos/id/1015/800/600", category: "nature", title: "Misty Mountains" },
    { id: 2, src: "https://picsum.photos/id/1040/800/600", category: "architecture", title: "Modern Castle" },
    { id: 3, src: "https://picsum.photos/id/1020/800/600", category: "animals", title: "Bear" },
    { id: 4, src: "https://picsum.photos/id/1018/800/600", category: "nature", title: "Mountain Peak" },
    { id: 5, src: "https://picsum.photos/id/1043/800/600", category: "architecture", title: "City Life" },
    { id: 6, src: "https://picsum.photos/id/1024/800/600", category: "animals", title: "Eagle" },
    { id: 7, src: "https://picsum.photos/id/1019/800/600", category: "nature", title: "Coastal View" },
    { id: 8, src: "https://picsum.photos/id/1044/800/600", category: "architecture", title: "Urban Structures" },
    { id: 9, src: "https://picsum.photos/id/1025/800/600", category: "animals", title: "Pug" }
];

// DOM Elements
const galleryContainer = document.getElementById('gallery');
const filterBtns = document.querySelectorAll('.filter-btn');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCaption = document.getElementById('lightboxCaption');
const closeLightboxBtn = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentDisplayedImages = [];
let currentImageIndex = 0;

// Initialize Gallery
function initGallery() {
    renderImages('all');
    setupEventListeners();
}

// Render Images Based on Filter
function renderImages(filter) {
    // Fade out
    galleryContainer.classList.add('fade-out');
    
    setTimeout(() => {
        galleryContainer.innerHTML = '';
        
        currentDisplayedImages = filter === 'all' 
            ? images 
            : images.filter(img => img.category === filter);
        
        currentDisplayedImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.dataset.index = index;
            
            item.innerHTML = `
                <img src="${img.src}" alt="${img.title}" loading="lazy">
                <div class="item-overlay">
                    <span class="item-title">${img.title}</span>
                    <span class="item-icon"><i class="fas fa-expand"></i></span>
                </div>
            `;
            
            // Add click event to open lightbox
            item.addEventListener('click', () => openLightbox(index));
            
            galleryContainer.appendChild(item);
        });
        
        // Fade in
        galleryContainer.classList.remove('fade-out');
    }, 300); // match transition time
}

// Set up Event Listeners
function setupEventListeners() {
    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active class
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter images
            renderImages(btn.dataset.filter);
        });
    });
    
    // Lightbox Close
    closeLightboxBtn.addEventListener('click', closeLightbox);
    
    // Lightbox Navigation
    prevBtn.addEventListener('click', navigatePrev);
    nextBtn.addEventListener('click', navigateNext);
    
    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigatePrev();
        if (e.key === 'ArrowRight') navigateNext();
    });
    
    // Close on overlay click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Lightbox Functions
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = ''; // Restore scrolling
}

function updateLightboxContent() {
    const imgData = currentDisplayedImages[currentImageIndex];
    
    // Simple fade effect for image change
    lightboxImg.style.opacity = '0';
    
    setTimeout(() => {
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.title;
        lightboxCaption.textContent = imgData.title;
        
        // Update nav buttons visibility based on position
        prevBtn.style.visibility = currentImageIndex === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = currentImageIndex === currentDisplayedImages.length - 1 ? 'hidden' : 'visible';
        
        lightboxImg.onload = () => {
            lightboxImg.style.opacity = '1';
        };
    }, 200);
}

function navigatePrev() {
    if (currentImageIndex > 0) {
        currentImageIndex--;
        updateLightboxContent();
    }
}

function navigateNext() {
    if (currentImageIndex < currentDisplayedImages.length - 1) {
        currentImageIndex++;
        updateLightboxContent();
    }
}

// Run Initialization
document.addEventListener('DOMContentLoaded', initGallery);
