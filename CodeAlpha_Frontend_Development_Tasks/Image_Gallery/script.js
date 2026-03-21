// ==========================================================================
// Initial Image Data
// ==========================================================================
let images = [
    { id: 2, src: "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=600&auto=format&fit=crop", category: "architecture", title: "Modern Castle", filterClass: "none" },
    { id: 3, src: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=500&auto=format&fit=crop", category: "animals", title: "Red Fox", filterClass: "none" },
    { id: 4, src: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=900&auto=format&fit=crop", category: "nature", title: "Mountain Peak", filterClass: "none" },
    { id: 5, src: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=750&auto=format&fit=crop", category: "architecture", title: "City Life", filterClass: "none" },
    { id: 7, src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&auto=format&fit=crop", category: "nature", title: "Coastal View", filterClass: "none" },
    { id: 8, src: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=600&h=800&auto=format&fit=crop", category: "architecture", title: "Urban Structures", filterClass: "none" },
    { id: 9, src: "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop", category: "animals", title: "Lion Portrait", filterClass: "none" },
    { id: 10, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&auto=format&fit=crop", category: "people", title: "Portrait in Light", filterClass: "none" },
    { id: 11, src: "https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=800&auto=format&fit=crop", category: "travel", title: "Quiet Beach", filterClass: "none" },
    { id: 12, src: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&h=600&auto=format&fit=crop", category: "abstract", title: "Neon Flow", filterClass: "none" }
];

// ==========================================================================
// DOM Elements
// ==========================================================================
const galleryContainer = document.getElementById('gallery');
const filterBtns = document.querySelectorAll('.filter-btn');
const loader = document.getElementById('loader');
const emptyState = document.getElementById('emptyState');
const searchInput = document.getElementById('searchInput');

// Theme
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

// Lightbox
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxCatBadge = document.getElementById('lightboxCatBadge');
const closeLightboxBtn = document.getElementById('closeLightbox');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const downloadBtn = document.getElementById('downloadBtn');

// Upload Modal
const openUploadBtn = document.getElementById('openUploadBtn');
const uploadModal = document.getElementById('uploadModal');
const closeUploadBtn = document.getElementById('closeUploadBtn');
const uploadForm = document.getElementById('uploadForm');
const imageUpload = document.getElementById('imageUpload');
const dropzoneLabel = document.getElementById('dropzoneLabel');
const dropzoneText = document.getElementById('dropzoneText');

let currentDisplayedImages = [];
let currentImageIndex = 0;
let currentFilter = 'all';

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    renderImages('all');
    setupEventListeners();
});

// ==========================================================================
// Theme Management (Dark/Light Mode)
// ==========================================================================
function initTheme() {
    const savedTheme = localStorage.getItem('lumina-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        const isDark = document.documentElement.classList.contains('dark-mode');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
        localStorage.setItem('lumina-theme', isDark ? 'dark' : 'light');
    });
}

// ==========================================================================
// Gallery Rendering & Search
// ==========================================================================
function renderImages(categoryFilter = currentFilter, searchQuery = searchInput.value.toLowerCase()) {
    currentFilter = categoryFilter;
    
    // Show Loader
    galleryContainer.style.display = 'none';
    emptyState.style.display = 'none';
    loader.style.display = 'block';
    
    setTimeout(() => {
        galleryContainer.innerHTML = '';
        
        // Filter logic
        currentDisplayedImages = images.filter(img => {
            const matchesCategory = categoryFilter === 'all' || img.category === categoryFilter;
            const matchesSearch = img.title.toLowerCase().includes(searchQuery);
            return matchesCategory && matchesSearch;
        });
        
        if (currentDisplayedImages.length === 0) {
            loader.style.display = 'none';
            emptyState.style.display = 'block';
            return;
        }

        currentDisplayedImages.forEach((img, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            
            // Stagger animation delay
            item.style.animationDelay = `${index * 0.05}s`;
            
            const filterClass = img.filterClass !== 'none' ? `css-filter-${img.filterClass}` : '';
            
            item.innerHTML = `
                <img src="${img.src}" alt="${img.title}" loading="lazy" class="${filterClass}">
                <div class="item-overlay">
                    <div class="item-content">
                        <span class="item-badge">${img.category}</span>
                        <h3 class="item-title">${img.title}</h3>
                    </div>
                </div>
            `;
            
            item.addEventListener('click', () => openLightbox(index));
            galleryContainer.appendChild(item);
        });
        
        loader.style.display = 'none';
        galleryContainer.style.display = 'block'; // Fallback to column/block for masonry
    }, 400); // Simulate network load for visual polish
}

// ==========================================================================
// Event Listeners
// ==========================================================================
function setupEventListeners() {
    // Filter Buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderImages(btn.dataset.filter);
        });
    });
    
    // Search Bar
    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            renderImages(currentFilter);
        }, 300); // debounce
    });
    
    // Lightbox Controls
    closeLightboxBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', navigatePrev);
    nextBtn.addEventListener('click', navigateNext);
    
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigatePrev();
            if (e.key === 'ArrowRight') navigateNext();
        }
        if (uploadModal.classList.contains('active') && e.key === 'Escape') {
            closeUploadModal();
        }
    });

    // Upload Modal Handling
    openUploadBtn.addEventListener('click', () => uploadModal.classList.add('active'));
    closeUploadBtn.addEventListener('click', closeUploadModal);
    
    // Drag & Drop
    dropzoneLabel.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzoneLabel.classList.add('active');
    });
    dropzoneLabel.addEventListener('dragleave', () => dropzoneLabel.classList.remove('active'));
    dropzoneLabel.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzoneLabel.classList.remove('active');
        if (e.dataTransfer.files.length) {
            imageUpload.files = e.dataTransfer.files;
            handleFileSelect();
        }
    });
    imageUpload.addEventListener('change', handleFileSelect);
    uploadForm.addEventListener('submit', handleImageUploadSubmit);
}

// ==========================================================================
// Lightbox Logic
// ==========================================================================
function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    body.style.overflow = '';
}

function updateLightboxContent() {
    const imgData = currentDisplayedImages[currentImageIndex];
    const filterClass = imgData.filterClass !== 'none' ? `css-filter-${imgData.filterClass}` : '';
    
    lightboxImg.classList.remove('loaded');
    
    // Reset image to trigger load event cleanly
    setTimeout(() => {
        lightboxImg.src = imgData.src;
        lightboxImg.alt = imgData.title;
        lightboxImg.className = `lightbox-img ${filterClass}`;
        
        lightboxTitle.textContent = imgData.title;
        lightboxCatBadge.textContent = imgData.category;
        downloadBtn.href = imgData.src;
        downloadBtn.download = `${imgData.title.replace(/\s+/g, '-').toLowerCase()}.jpg`;
        
        prevBtn.style.visibility = currentImageIndex === 0 ? 'hidden' : 'visible';
        nextBtn.style.visibility = currentImageIndex === currentDisplayedImages.length - 1 ? 'hidden' : 'visible';
        
        lightboxImg.onload = () => lightboxImg.classList.add('loaded');
    }, 50);
}

function navigatePrev() { if (currentImageIndex > 0) { currentImageIndex--; updateLightboxContent(); } }
function navigateNext() { if (currentImageIndex < currentDisplayedImages.length - 1) { currentImageIndex++; updateLightboxContent(); } }

// ==========================================================================
// Upload Logic
// ==========================================================================
function handleFileSelect() {
    if (imageUpload.files.length > 0) {
        dropzoneText.textContent = imageUpload.files[0].name;
    } else {
        dropzoneText.textContent = 'Click to browse or drag image here';
    }
}

function closeUploadModal() {
    uploadModal.classList.remove('active');
    uploadForm.reset();
    handleFileSelect();
}

function handleImageUploadSubmit(e) {
    e.preventDefault();
    const file = imageUpload.files[0];
    if (!file) return;

    const tempUrl = URL.createObjectURL(file);
    const title = document.getElementById('imageTitle').value;
    const category = document.getElementById('imageCategory').value;
    const filterSelected = document.getElementById('imageFilter').value;

    const newImage = {
        id: Date.now(),
        src: tempUrl,
        category: category,
        title: title || "User Upload",
        filterClass: filterSelected
    };

    images.unshift(newImage);
    closeUploadModal();
    
    // Switch to uploaded category to show the image immediately
    filterBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.filter === category);
    });
    renderImages(category);
}
