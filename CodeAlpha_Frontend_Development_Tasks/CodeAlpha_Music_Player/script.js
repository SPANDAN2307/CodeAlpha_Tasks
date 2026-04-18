// =========================================================
//  Bommbash Dashboard Player — Apple Music style script.js
// =========================================================

// File paths to our AI-generated "Nano Banana" covers
const bananaPop = 'file:///C:/Users/Spandan/.gemini/antigravity/brain/3491601c-6b2b-4654-8e0b-24d7da146d16/cover_banana_pop_1776552305113.png';
const bananaNano = 'file:///C:/Users/Spandan/.gemini/antigravity/brain/3491601c-6b2b-4654-8e0b-24d7da146d16/cover_nano_banana_1776552321854.png';
const bananaVintage = 'file:///C:/Users/Spandan/.gemini/antigravity/brain/3491601c-6b2b-4654-8e0b-24d7da146d16/cover_vintage_banana_1776552338870.png';

// Fallbacks are our local covers in case the absolute C: path is blocked by the browser.
// Note: If images don't load, copy them to your project folder!

const masterSongs = [
  { id: 0, title: 'Nano Groove', artist: 'Banana Pop Syndicate', cover: bananaPop, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', liked: false, isFeature: true, subtitle: 'NEW RELEASE' },
  { id: 1, title: 'Robo Peel', artist: 'Nano Banana', cover: bananaNano, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', liked: false, isFeature: true, subtitle: 'EXCLUSIVE' },
  { id: 2, title: 'Vintage Split', artist: 'Synthwave Fruit', cover: bananaVintage, src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', liked: false, isFeature: true, subtitle: 'CURATED' },
  
  // Standard Albums
  { id: 3, title: 'Rainy Café', artist: 'Mellow Keys', cover: 'https://picsum.photos/id/11/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', liked: false, isFeature: false },
  { id: 4, title: 'Summer Wave', artist: 'Coastal Beats', cover: 'https://picsum.photos/id/16/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', liked: false, isFeature: false },
  { id: 5, title: 'Deep Space', artist: 'Orbital Drift', cover: 'https://picsum.photos/id/29/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', liked: false, isFeature: false },
  { id: 6, title: 'Neon Dreams', artist: 'Luna Synthetic', cover: 'https://picsum.photos/id/36/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', liked: false, isFeature: false },
  { id: 7, title: 'Acoustic Sunrise', artist: 'Woodlands', cover: 'https://picsum.photos/id/42/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', liked: false, isFeature: false },
  { id: 8, title: 'Ocean Breeze', artist: 'Islanders', cover: 'https://picsum.photos/id/49/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', liked: false, isFeature: false },
  { id: 9, title: 'Jazz Lounge', artist: 'The Cats', cover: 'https://picsum.photos/id/55/400/400', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', liked: false, isFeature: false }
];

let currentQueue = [...masterSongs];
let currentTrackIndex = 0;

let isPlaying  = false;
let isShuffle  = false;
let repeatMode = 0; // 0=off, 1=all, 2=one
let isDragging = false;

// DOM References
const audio = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const heartBtn = document.getElementById('heartBtn');
const muteBtn = document.getElementById('muteBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressCont = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('trackDuration');
const topCover = document.getElementById('topCover');
const trackTitle = document.getElementById('trackTitle');
const trackArtist = document.getElementById('trackArtist');

// UI Rendering
function renderUI() {
  const nanoGrid = document.getElementById('nanoGrid');
  const newRelGrid = document.getElementById('newRelGrid');
  const topGrid = document.getElementById('topGrid');
  
  const featureSongs = masterSongs.filter(s => s.isFeature);
  const regularSongs = masterSongs.filter(s => !s.isFeature);

  nanoGrid.innerHTML = featureSongs.map(song => `
    <div class="feature-card" data-id="${song.id}">
      <img src="${song.cover}" alt="cover" class="feature-img" loading="lazy">
      <div class="feature-info">
        <div class="feature-subtitle">${song.subtitle}</div>
        <div class="feature-title">${song.title}</div>
      </div>
    </div>
  `).join('');

  newRelGrid.innerHTML = regularSongs.slice(0, 4).map(song => `
    <div class="album-card" data-id="${song.id}">
      <img class="album-cover" src="${song.cover}" alt="cover" loading="lazy">
      <div class="album-title">${song.title}</div>
      <div class="album-artist">${song.artist}</div>
    </div>
  `).join('');

  topGrid.innerHTML = regularSongs.slice(4).map(song => `
    <div class="album-card" data-id="${song.id}">
      <img class="album-cover" src="${song.cover}" alt="cover" loading="lazy">
      <div class="album-title">${song.title}</div>
      <div class="album-artist">${song.artist}</div>
    </div>
  `).join('');
}

// Logic
function loadSongById(id) {
  const index = currentQueue.findIndex(s => s.id === parseInt(id));
  if (index !== -1) loadSongByIndex(index, true);
}

function loadSongByIndex(index, autoPlay = false) {
  currentTrackIndex = index;
  const song = currentQueue[currentTrackIndex];

  topCover.src = song.cover;
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;
  heartBtn.classList.toggle('liked', song.liked);

  audio.src = song.src;
  
  if (autoPlay) {
    audio.play().then(() => setPlayingState(true)).catch(console.error);
  } else {
    setPlayingState(false);
  }
}

function setPlayingState(playing) {
  isPlaying = playing;
  if(playing) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = '';
  } else {
    playIcon.style.display = '';
    pauseIcon.style.display = 'none';
  }
}

function togglePlay() {
  if (isPlaying) { audio.pause(); setPlayingState(false); }
  else { audio.play().then(() => setPlayingState(true)).catch(()=>{}); }
}

function playPrev() {
  if (audio.currentTime > 3) { audio.currentTime = 0; return; }
  let idx = currentTrackIndex - 1;
  if(isShuffle) idx = Math.floor(Math.random() * currentQueue.length);
  if (idx < 0) idx = currentQueue.length - 1;
  loadSongByIndex(idx, true);
}

function playNext(fromEnded = false) {
  if (repeatMode === 2 && fromEnded) { audio.currentTime = 0; audio.play(); return; }
  let idx = currentTrackIndex + 1;
  if(isShuffle) idx = Math.floor(Math.random() * currentQueue.length);
  if (idx >= currentQueue.length) idx = (repeatMode === 1) ? 0 : 0;
  loadSongByIndex(idx, true);
}

// Progress
function formatTime(secs) {
  if(isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

audio.addEventListener('timeupdate', () => {
  if(isDragging) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => { durationEl.textContent = formatTime(audio.duration); });
audio.addEventListener('ended', () => { setPlayingState(false); playNext(true); });

function seekFromEvent(e) {
  const rect = progressCont.querySelector('.progress-track').getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  if(audio.duration) audio.currentTime = pct * audio.duration;
  progressFill.style.width = (pct * 100) + '%';
  currentTimeEl.textContent = formatTime(pct * (audio.duration || 0));
}

progressCont.addEventListener('mousedown', e => { isDragging = true; seekFromEvent(e); });
window.addEventListener('mousemove', e => { if(isDragging) seekFromEvent(e); });
window.addEventListener('mouseup', () => isDragging = false);

// Volume
volumeSlider.addEventListener('input', () => {
  audio.volume = volumeSlider.value;
  volumeSlider.style.setProperty('--fill-pct', (volumeSlider.value * 100) + '%');
  updateVolIcon();
});

let lastVol = 0.8;
muteBtn.addEventListener('click', () => {
  if(audio.volume === 0) { audio.volume = lastVol || 0.8; volumeSlider.value = audio.volume; }
  else { lastVol = audio.volume; audio.volume = 0; volumeSlider.value = 0; }
  volumeSlider.style.setProperty('--fill-pct', (volumeSlider.value * 100) + '%');
  updateVolIcon();
});

function updateVolIcon() {
  if(audio.volume === 0) { muteBtn.children[0].style.display='none'; muteBtn.children[1].style.display=''; }
  else { muteBtn.children[0].style.display=''; muteBtn.children[1].style.display='none'; }
}

// UI Triggers
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', () => playNext(false));
shuffleBtn.addEventListener('click', () => { isShuffle = !isShuffle; shuffleBtn.classList.toggle('active', isShuffle); });
repeatBtn.addEventListener('click', () => { repeatMode = (repeatMode + 1) % 3; repeatBtn.classList.toggle('active', repeatMode > 0); });
heartBtn.addEventListener('click', () => {
  const s = currentQueue[currentTrackIndex]; s.liked = !s.liked; heartBtn.classList.toggle('liked', s.liked);
});

// Click event delegation for cards
document.querySelector('.main-content').addEventListener('click', e => {
  const card = e.target.closest('.feature-card, .album-card');
  if (card) {
    const songId = parseInt(card.dataset.id);
    if (currentQueue[currentTrackIndex] && currentQueue[currentTrackIndex].id === songId) {
      // Toggle play/pause if user clicks the currently active card
      togglePlay();
    } else {
      loadSongById(songId);
    }
  }
});

// Init
renderUI();
volumeSlider.style.setProperty('--fill-pct', (volumeSlider.value * 100) + '%');
audio.volume = parseFloat(volumeSlider.value);
loadSongByIndex(0, false);
