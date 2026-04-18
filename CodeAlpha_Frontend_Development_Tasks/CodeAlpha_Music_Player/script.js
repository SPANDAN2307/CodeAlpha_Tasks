// =========================================================
//  Harmony Dashboard Player — script.js
// =========================================================

// ─── Expanded Master Song Library ─────────────────────────
const masterSongs = [
  {
    id: 0, title: 'Neon Drift', artist: 'Luna Synthetic',
    cover: '../Music_Player/covers/neon_drift.png', src: 'https://ccmixter.org/content/admiralbob99/admiralbob99_-_007_Bond_Style.mp3',
    color: '#8b5cf6', liked: false
  },
  {
    id: 1, title: 'Rainy Café', artist: 'Mellow Keys',
    cover: '../Music_Player/covers/rainy_cafe.png', src: 'https://ccmixter.org/content/texasradiofish/texasradiofish_-_Deep_in_the_Rain.mp3',
    color: '#f59e0b', liked: false
  },
  {
    id: 2, title: 'Golden Hour', artist: 'Solara',
    cover: '../Music_Player/covers/golden_hour.png', src: 'https://ccmixter.org/content/debbyz/debbyz_-_Golden_Hour.mp3',
    color: '#f97316', liked: false
  },
  {
    id: 3, title: 'Deep Space', artist: 'Orbital Drift',
    cover: '../Music_Player/covers/deep_space.png', src: 'https://ccmixter.org/content/nickleus/nickleus_-_my_lighthouse.mp3',
    color: '#0ea5e9', liked: false
  },
  {
    id: 4, title: 'Summer Wave', artist: 'Coastal Beats',
    cover: '../Music_Player/covers/summer_wave.png', src: 'https://ccmixter.org/content/Javolenus/Javolenus_-_Latitude_0.mp3',
    color: '#10b981', liked: false
  },
  {
    id: 5, title: 'City Lights', artist: 'Downtown Groove',
    cover: '../Music_Player/covers/neon_drift.png', src: 'https://ccmixter.org/content/TheDICE/TheDICE_-_Back_To_Tomorrow.mp3',
    color: '#e11d48', liked: false
  },
  {
    id: 6, title: 'Midnight Drive', artist: 'Synthboi',
    cover: '../Music_Player/covers/deep_space.png', src: 'https://ccmixter.org/content/Scomber/Scomber_-_Surrounded_By_Space.mp3',
    color: '#6366f1', liked: false
  },
  {
    id: 7, title: 'Acoustic Sunrise', artist: 'Woodlands',
    cover: '../Music_Player/covers/golden_hour.png', src: 'https://ccmixter.org/content/robwalkerpoet/robwalkerpoet_-_A_New_Day_1.mp3',
    color: '#ec4899', liked: false
  },
  {
    id: 8, title: 'Ocean Breeze', artist: 'Islanders',
    cover: '../Music_Player/covers/summer_wave.png', src: 'https://ccmixter.org/content/Apoxode/Apoxode_-_Ocean_Lights.mp3',
    color: '#06b6d4', liked: false
  },
  {
    id: 9, title: 'Jazz Lounge', artist: 'The Cats',
    cover: '../Music_Player/covers/rainy_cafe.png', src: 'https://ccmixter.org/content/jlbrock44/jlbrock44_-_Urbana-Metronica_(wooh-yeah_mix).mp3',
    color: '#d97706', liked: false
  },
  {
    id: 10, title: 'Electro Pulse', artist: 'DJ Flux',
    cover: '../Music_Player/covers/neon_drift.png', src: 'https://ccmixter.org/content/djlang59/djlang59_-_Drops_of_H2O_(_The_Filtered_Water_Treatment_).mp3',
    color: '#8b5cf6', liked: false
  },
  {
    id: 11, title: 'Quiet Study', artist: 'Lo-Fi Panda',
    cover: '../Music_Player/covers/rainy_cafe.png', src: 'https://ccmixter.org/content/RizKeyG/RizKeyG_-_LoFi.mp3',
    color: '#64748b', liked: false
  }
];

// Play queue mapped to our current main context list
let currentQueue = [...masterSongs];
let currentTrackIndex = 0;

// Subsets for the UI sections
const recentSongs = masterSongs.slice(0, 6);
const madeForYouSongs = masterSongs.slice(6, 10);
const trendingSongs = masterSongs.slice(1, 5).concat(masterSongs.slice(10, 12));

// ─── Playback State ────────────────────────────────────────
let isPlaying  = false;
let isShuffle  = false;
let repeatMode = 0; // 0=off, 1=all, 2=one
let isDragging = false;

// ─── DOM References ────────────────────────────────────────
const audio         = document.getElementById('audioPlayer');
const playBtn       = document.getElementById('playBtn');
const playIcon      = document.getElementById('playIcon');
const pauseIcon     = document.getElementById('pauseIcon');
const prevBtn       = document.getElementById('prevBtn');
const nextBtn       = document.getElementById('nextBtn');
const shuffleBtn    = document.getElementById('shuffleBtn');
const repeatBtn     = document.getElementById('repeatBtn');
const heartBtn      = document.getElementById('heartBtn');
const muteBtn       = document.getElementById('muteBtn');
const volumeSlider  = document.getElementById('volumeSlider');
const progressCont  = document.getElementById('progressContainer');
const progressFill  = document.getElementById('progressFill');
const progressThumb = document.getElementById('progressThumb');
const currentTimeEl = document.getElementById('currentTime');
const durationEl    = document.getElementById('trackDuration');
const albumArt      = document.getElementById('albumArt');
const trackTitle    = document.getElementById('trackTitle');
const trackArtist   = document.getElementById('trackArtist');
const headerBg      = document.getElementById('headerBg');

// ─── UI Rendering ──────────────────────────────────────────
function renderRecentGrid() {
  const container = document.getElementById('recentGrid');
  container.innerHTML = recentSongs.map(song => `
    <div class="recent-card" data-id="${song.id}">
      <img src="${song.cover}" alt="cover" class="recent-cover" loading="lazy">
      <div class="recent-title">${song.title}</div>
      <button class="play-hover-btn" aria-label="Play">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </button>
    </div>
  `).join('');
}

function renderShelfGrid(containerId, songsArray) {
  const container = document.getElementById(containerId);
  container.innerHTML = songsArray.map(song => `
    <div class="album-card" data-id="${song.id}">
      <div class="album-cover-wrapper">
        <img src="${song.cover}" alt="cover" loading="lazy">
        <button class="play-hover-btn" aria-label="Play">
          <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>
      <div class="album-card-title">${song.title}</div>
      <div class="album-card-desc">${song.artist}</div>
    </div>
  `).join('');
}

// ─── Core Logic ────────────────────────────────────────────
function loadSongById(id, autoPlay = true) {
  const songIndex = currentQueue.findIndex(s => s.id === parseInt(id));
  if (songIndex === -1) return;
  loadSongByIndex(songIndex, autoPlay);
}

function loadSongByIndex(index, autoPlay = false) {
  currentTrackIndex = index;
  const song = currentQueue[currentTrackIndex];

  // Update Player UI
  albumArt.src = song.cover;
  trackTitle.textContent = song.title;
  trackArtist.textContent = song.artist;
  
  // Update Background gradient theme
  document.documentElement.style.setProperty('--dyn-color', song.color);

  // Sync heart state
  heartBtn.classList.toggle('liked', song.liked);

  // Load Audio
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
  if (repeatMode === 2 && fromEnded) {
    audio.currentTime = 0;
    audio.play(); return;
  }
  let idx = currentTrackIndex + 1;
  if(isShuffle) idx = Math.floor(Math.random() * currentQueue.length);
  if (idx >= currentQueue.length) idx = (repeatMode === 1) ? 0 : 0; // wrap around anyway
  loadSongByIndex(idx, true);
}

// ─── Progress Bar & Time ───────────────────────────────────
function formatTime(secs) {
  if(isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return \`\${m}:\${s}\`;
}

audio.addEventListener('timeupdate', () => {
  if(isDragging) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width = pct + '%';
  progressThumb.style.left = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
  setPlayingState(false);
  playNext(true);
});

function seekFromEvent(e) {
  const rect = progressCont.querySelector('.progress-track').getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
  if(audio.duration) audio.currentTime = pct * audio.duration;
  progressFill.style.width = (pct * 100) + '%';
  progressThumb.style.left = (pct * 100) + '%';
  currentTimeEl.textContent = formatTime(pct * (audio.duration || 0));
}

// Mouse/Touch events for seek
progressCont.addEventListener('mousedown', e => { isDragging = true; seekFromEvent(e); });
window.addEventListener('mousemove', e => { if(isDragging) seekFromEvent(e); });
window.addEventListener('mouseup', () => isDragging = false);

progressCont.addEventListener('touchstart', e => { isDragging = true; seekFromEvent(e); }, {passive:true});
window.addEventListener('touchmove', e => { if(isDragging) seekFromEvent(e); }, {passive:true});
window.addEventListener('touchend', () => isDragging = false);

// ─── Volume ────────────────────────────────────────────────
volumeSlider.addEventListener('input', () => {
  const vol = parseFloat(volumeSlider.value);
  audio.volume = vol;
  volumeSlider.style.setProperty('--fill-pct', (vol * 100) + '%');
  updateVolumeIcon();
});

let lastVol = 0.8;
function toggleMute() {
  if(audio.volume === 0) {
    audio.volume = lastVol || 0.8;
    volumeSlider.value = audio.volume;
  } else {
    lastVol = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
  }
  volumeSlider.style.setProperty('--fill-pct', (volumeSlider.value * 100) + '%');
  updateVolumeIcon();
}

function updateVolumeIcon() {
  const high = muteBtn.querySelector('.vol-high');
  const mute = muteBtn.querySelector('.vol-mute');
  if(audio.volume === 0) { high.style.display='none'; mute.style.display=''; }
  else { high.style.display=''; mute.style.display='none'; }
}

// ─── Event Listeners ───────────────────────────────────────
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', () => playNext(false));
muteBtn.addEventListener('click', toggleMute);

shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  // Simplistic repeat icon update (1 = active green, 2 = could show a '1' badge if we had one)
  repeatBtn.classList.toggle('active', repeatMode > 0);
  // Optionally update icon path here if we want a distinct "repeat-one" look
});

heartBtn.addEventListener('click', () => {
  const song = currentQueue[currentTrackIndex];
  song.liked = !song.liked;
  heartBtn.classList.toggle('liked', song.liked);
});

// Dynamic Card Clicks
document.querySelector('.content-scrollable').addEventListener('click', (e) => {
  const card = e.target.closest('.recent-card, .album-card');
  if (card) {
    const id = card.getAttribute('data-id');
    // For now, playing from any section just searches the main queue
    loadSongById(id, true);
  }
});

// Keyboard
document.addEventListener('keydown', e => {
  if(e.target.tagName === 'INPUT') return;
  if(e.code === 'Space') { e.preventDefault(); togglePlay(); }
});

// ─── Init ──────────────────────────────────────────────────
(function init() {
  renderRecentGrid();
  renderShelfGrid('madeForYouGrid', madeForYouSongs);
  renderShelfGrid('trendingGrid', trendingSongs);
  
  // Set initial volume tracking
  volumeSlider.style.setProperty('--fill-pct', (volumeSlider.value * 100) + '%');
  audio.volume = parseFloat(volumeSlider.value);
  
  // Load first track but dont play
  loadSongByIndex(0, false);
})();
