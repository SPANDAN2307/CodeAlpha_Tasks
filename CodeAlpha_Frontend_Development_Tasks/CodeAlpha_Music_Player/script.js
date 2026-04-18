// =========================================================
//  Harmony Music Player — script.js
//  Features: Play/Pause, Prev/Next, Progress Bar (seek),
//  Volume Control, Mute Toggle, Playlist, Autoplay,
//  Shuffle, Repeat, Heart/Like, Dynamic accent colors
// =========================================================

// ─── Song Library ─────────────────────────────────────────
// Using royalty-free audio from ccMixter / Free Music Archive
// Covers are our locally generated AI images.
const songs = [
  {
    title:  'Neon Drift',
    artist: 'Luna Synthetic',
    album:  'Neon Dreams',
    cover:  'covers/neon_drift.png',
    src:    'https://ccmixter.org/content/admiralbob99/admiralbob99_-_007_Bond_Style.mp3',
    accent: '#a78bfa',
    accentGlow: 'rgba(167,139,250,0.35)',
    blob1: '#7c3aed',
    blob2: '#c4b5fd',
    blob3: '#06b6d4',
    liked:  false,
  },
  {
    title:  'Rainy Café',
    artist: 'Mellow Keys',
    album:  'Late Nights',
    cover:  'covers/rainy_cafe.png',
    src:    'https://ccmixter.org/content/texasradiofish/texasradiofish_-_Deep_in_the_Rain.mp3',
    accent: '#f59e0b',
    accentGlow: 'rgba(245,158,11,0.35)',
    blob1: '#d97706',
    blob2: '#fbbf24',
    blob3: '#065f46',
    liked:  false,
  },
  {
    title:  'Golden Hour',
    artist: 'Solara',
    album:  'Horizon',
    cover:  'covers/golden_hour.png',
    src:    'https://ccmixter.org/content/debbyz/debbyz_-_Golden_Hour.mp3',
    accent: '#f97316',
    accentGlow: 'rgba(249,115,22,0.35)',
    blob1: '#ea580c',
    blob2: '#fb923c',
    blob3: '#a16207',
    liked:  false,
  },
  {
    title:  'Deep Space',
    artist: 'Orbital Drift',
    album:  'Cosmos EP',
    cover:  'covers/deep_space.png',
    src:    'https://ccmixter.org/content/nickleus/nickleus_-_my_lighthouse.mp3',
    accent: '#38bdf8',
    accentGlow: 'rgba(56,189,248,0.35)',
    blob1: '#0284c7',
    blob2: '#7dd3fc',
    blob3: '#6d28d9',
    liked:  false,
  },
  {
    title:  'Summer Wave',
    artist: 'Coastal Beats',
    album:  'Sun Sessions',
    cover:  'covers/summer_wave.png',
    src:    'https://ccmixter.org/content/Javolenus/Javolenus_-_Latitude_0.mp3',
    accent: '#10b981',
    accentGlow: 'rgba(16,185,129,0.35)',
    blob1: '#059669',
    blob2: '#34d399',
    blob3: '#0ea5e9',
    liked:  false,
  },
];

// ─── State ─────────────────────────────────────────────────
let currentIndex  = 0;
let isPlaying     = false;
let isShuffle     = false;
let repeatMode    = 0;   // 0 = off, 1 = repeat-all, 2 = repeat-one
let isMuted       = false;
let lastVolume    = 0.8;
let isDragging    = false;

// ─── DOM References ─────────────────────────────────────────
const audio          = document.getElementById('audioPlayer');
const albumArt       = document.getElementById('albumArt');
const albumArtWrapper= document.getElementById('albumArtWrapper');
const albumShadow    = albumArtWrapper.querySelector('.album-art-shadow');
const trackTitle     = document.getElementById('trackTitle');
const trackArtist    = document.getElementById('trackArtist');
const trackAlbum     = document.getElementById('trackAlbum');
const playBtn        = document.getElementById('playBtn');
const playIcon       = document.getElementById('playIcon');
const pauseIcon      = document.getElementById('pauseIcon');
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const progressFill   = document.getElementById('progressFill');
const progressThumb  = document.getElementById('progressThumb');
const progressCont   = document.getElementById('progressContainer');
const currentTimeEl  = document.getElementById('currentTime');
const durationEl     = document.getElementById('trackDuration');
const volumeSlider   = document.getElementById('volumeSlider');
const muteBtn        = document.getElementById('muteBtn');
const shuffleBtn     = document.getElementById('shuffleBtn');
const repeatBtn      = document.getElementById('repeatBtn');
const heartBtn       = document.getElementById('heartBtn');
const togglePlaylist = document.getElementById('togglePlaylist');
const sidebar        = document.getElementById('sidebar');
const playlistEl     = document.getElementById('playlist');
const trackCountEl   = document.getElementById('trackCount');
const blob1          = document.getElementById('blob1');
const blob2          = document.getElementById('blob2');
const blob3          = document.getElementById('blob3');

// ─── Helpers ───────────────────────────────────────────────
function formatTime(secs) {
  if (isNaN(secs) || secs < 0) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function setFillPercent(el, pct) {
  el.style.setProperty('--fill-pct', pct + '%');
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

// ─── Theme updater ─────────────────────────────────────────
function applyTheme(song) {
  const root = document.documentElement;
  root.style.setProperty('--accent',      song.accent);
  root.style.setProperty('--accent-glow', song.accentGlow);
  root.style.setProperty('--accent-soft', song.accentGlow.replace('0.35', '0.15'));
  albumShadow.style.background = song.accent;
  blob1.style.background = `radial-gradient(circle, ${song.blob1}, ${song.blob2})`;
  blob2.style.background = `radial-gradient(circle, ${song.blob2}, ${song.blob3})`;
  blob3.style.background = `radial-gradient(circle, ${song.blob3}, ${song.blob1})`;
}

// ─── Load a Song ───────────────────────────────────────────
function loadSong(index, autoPlay = false) {
  currentIndex = clamp(index, 0, songs.length - 1);
  const song = songs[currentIndex];

  // Animate album art out
  albumArt.classList.add('switching');

  setTimeout(() => {
    albumArt.src       = song.cover;
    trackTitle.textContent  = song.title;
    trackArtist.textContent = song.artist;
    trackAlbum.textContent  = song.album;

    // Sync heart state
    if (song.liked) {
      heartBtn.classList.add('liked');
    } else {
      heartBtn.classList.remove('liked');
    }

    applyTheme(song);
    updatePlaylistUI();

    albumArt.onload = () => {
      albumArt.classList.remove('switching');
    };
    // Fallback if already cached
    if (albumArt.complete) albumArt.classList.remove('switching');
  }, 200);

  audio.src = song.src;
  progressFill.style.width = '0%';
  progressThumb.style.left  = '0%';
  currentTimeEl.textContent = '0:00';
  durationEl.textContent    = '0:00';

  if (autoPlay) {
    audio.play().then(() => {
      setPlayingState(true);
    }).catch(() => setPlayingState(false));
  } else {
    setPlayingState(false);
  }
}

// ─── Play / Pause ──────────────────────────────────────────
function setPlayingState(playing) {
  isPlaying = playing;
  if (playing) {
    playIcon.style.display  = 'none';
    pauseIcon.style.display = '';
    albumArt.classList.add('playing');
  } else {
    playIcon.style.display  = '';
    pauseIcon.style.display = 'none';
    albumArt.classList.remove('playing');
  }
  updatePlaylistActiveClass();
}

function togglePlay() {
  if (isPlaying) {
    audio.pause();
    setPlayingState(false);
  } else {
    audio.play().then(() => setPlayingState(true)).catch(() => {});
  }
}

// ─── Prev / Next ───────────────────────────────────────────
function playPrev() {
  // If more than 3 seconds in, restart; else go back
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  let idx = currentIndex - 1;
  if (isShuffle) idx = randomIndex();
  if (idx < 0) idx = songs.length - 1;
  loadSong(idx, true);
}

function playNext(fromEnded = false) {
  if (repeatMode === 2 && fromEnded) {
    // Repeat one
    audio.currentTime = 0;
    audio.play().then(() => setPlayingState(true)).catch(() => {});
    return;
  }
  let idx;
  if (isShuffle) {
    idx = randomIndex();
  } else {
    idx = currentIndex + 1;
    if (idx >= songs.length) {
      if (repeatMode === 1) {
        idx = 0;
      } else {
        idx = 0;
        loadSong(0, false);
        return;
      }
    }
  }
  loadSong(idx, true);
}

function randomIndex() {
  let idx;
  do { idx = Math.floor(Math.random() * songs.length); }
  while (idx === currentIndex && songs.length > 1);
  return idx;
}

// ─── Progress Bar ──────────────────────────────────────────
audio.addEventListener('timeupdate', () => {
  if (isDragging) return;
  const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  progressFill.style.width  = pct + '%';
  progressThumb.style.left  = pct + '%';
  currentTimeEl.textContent = formatTime(audio.currentTime);
  setFillPercent(volumeSlider, volumeSlider.value * 100);
});

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
  updatePlaylistDurations();
});

audio.addEventListener('ended', () => {
  setPlayingState(false);
  playNext(true);
});

// Progress bar interaction
function seekFromEvent(e) {
  const rect = progressCont.querySelector('.progress-track').getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
  if (!isNaN(audio.duration) && audio.duration > 0) {
    audio.currentTime = pct * audio.duration;
  }
  progressFill.style.width = (pct * 100) + '%';
  progressThumb.style.left = (pct * 100) + '%';
  currentTimeEl.textContent = formatTime(pct * (audio.duration || 0));
}

progressCont.addEventListener('mousedown', (e) => {
  isDragging = true;
  seekFromEvent(e);
});

window.addEventListener('mousemove', (e) => {
  if (isDragging) seekFromEvent(e);
});

window.addEventListener('mouseup', () => {
  isDragging = false;
});

progressCont.addEventListener('touchstart', (e) => {
  isDragging = true;
  seekFromEvent(e);
}, { passive: true });

window.addEventListener('touchmove', (e) => {
  if (isDragging) seekFromEvent(e);
}, { passive: true });

window.addEventListener('touchend', () => {
  isDragging = false;
});

// ─── Volume ────────────────────────────────────────────────
volumeSlider.addEventListener('input', () => {
  const vol = parseFloat(volumeSlider.value);
  audio.volume = vol;
  lastVolume   = vol;
  isMuted      = vol === 0;
  updateVolumeIcon();
  setFillPercent(volumeSlider, vol * 100);
});

function toggleMute() {
  if (isMuted) {
    audio.volume = lastVolume || 0.8;
    volumeSlider.value = lastVolume || 0.8;
    isMuted = false;
  } else {
    lastVolume = audio.volume;
    audio.volume = 0;
    volumeSlider.value = 0;
    isMuted = true;
  }
  updateVolumeIcon();
  setFillPercent(volumeSlider, volumeSlider.value * 100);
}

function updateVolumeIcon() {
  const high = muteBtn.querySelector('.vol-high');
  const mute = muteBtn.querySelector('.vol-mute');
  if (isMuted || audio.volume === 0) {
    high.style.display = 'none';
    mute.style.display = '';
  } else {
    high.style.display = '';
    mute.style.display = 'none';
  }
}

// ─── Shuffle ───────────────────────────────────────────────
shuffleBtn.addEventListener('click', () => {
  isShuffle = !isShuffle;
  shuffleBtn.classList.toggle('active', isShuffle);
});

// ─── Repeat ────────────────────────────────────────────────
const repeatIcons = [
  // repeat-off
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>`,
  // repeat-all
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>`,
  // repeat-one
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    <text x="10" y="14" font-size="7" font-weight="bold" fill="currentColor" stroke="none">1</text>
  </svg>`,
];

repeatBtn.addEventListener('click', () => {
  repeatMode = (repeatMode + 1) % 3;
  repeatBtn.innerHTML = repeatIcons[repeatMode];
  repeatBtn.classList.toggle('active', repeatMode > 0);
});

// ─── Heart (Like) ──────────────────────────────────────────
heartBtn.addEventListener('click', () => {
  songs[currentIndex].liked = !songs[currentIndex].liked;
  heartBtn.classList.toggle('liked', songs[currentIndex].liked);
});

// ─── Toggle Playlist Sidebar ───────────────────────────────
let isMobile = window.innerWidth <= 600;

togglePlaylist.addEventListener('click', () => {
  if (isMobile) {
    sidebar.classList.toggle('mobile-open');
    sidebar.classList.remove('collapsed');
  } else {
    sidebar.classList.toggle('collapsed');
  }
});

window.addEventListener('resize', () => {
  isMobile = window.innerWidth <= 600;
});

// ─── Build Playlist ────────────────────────────────────────
let cachedDurations = {};

function buildPlaylist() {
  playlistEl.innerHTML = '';
  trackCountEl.textContent = `${songs.length} songs`;

  songs.forEach((song, i) => {
    const li = document.createElement('li');
    li.className = 'playlist-item';
    li.setAttribute('role', 'listitem');
    li.dataset.index = i;
    li.setAttribute('aria-label', `${song.title} by ${song.artist}`);

    li.innerHTML = `
      <img class="playlist-thumb" src="${song.cover}" alt="${song.title} cover" loading="lazy" />
      <div class="playlist-info">
        <div class="playlist-name">${song.title}</div>
        <div class="playlist-artist">${song.artist}</div>
      </div>
      <span class="playlist-duration" id="pl-dur-${i}">${cachedDurations[i] || '–:––'}</span>
      <div class="now-playing-bars" aria-hidden="true">
        <span></span><span></span><span></span>
      </div>
    `;

    li.addEventListener('click', () => {
      if (i === currentIndex) {
        togglePlay();
      } else {
        loadSong(i, true);
      }
    });

    playlistEl.appendChild(li);
  });
}

function updatePlaylistUI() {
  const items = playlistEl.querySelectorAll('.playlist-item');
  items.forEach((item, i) => {
    const isActive = i === currentIndex;
    item.classList.toggle('active', isActive);
    item.classList.toggle('is-playing', isActive && isPlaying);
  });
}

function updatePlaylistActiveClass() {
  const items = playlistEl.querySelectorAll('.playlist-item');
  items.forEach((item, i) => {
    item.classList.toggle('is-playing', i === currentIndex && isPlaying);
  });
}

function updatePlaylistDurations() {
  // Cache and display duration for the current track
  const durStr = formatTime(audio.duration);
  cachedDurations[currentIndex] = durStr;
  const el = document.getElementById(`pl-dur-${currentIndex}`);
  if (el) el.textContent = durStr;
}

// Pre-fetch durations for all tracks using hidden Audio objects
function prefetchDurations() {
  songs.forEach((song, i) => {
    if (i === currentIndex) return; // already loaded
    const a = new Audio();
    a.preload = 'metadata';
    a.src = song.src;
    a.addEventListener('loadedmetadata', () => {
      const dur = formatTime(a.duration);
      cachedDurations[i] = dur;
      const el = document.getElementById(`pl-dur-${i}`);
      if (el) el.textContent = dur;
    });
  });
}

// ─── Button Event Listeners ────────────────────────────────
playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', playPrev);
nextBtn.addEventListener('click', () => playNext(false));
muteBtn.addEventListener('click', toggleMute);

// ─── Keyboard Shortcuts ────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // Don't fire when typing in an input
  if (e.target.tagName === 'INPUT') return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      break;
    case 'ArrowRight':
      e.preventDefault();
      if (audio.duration) audio.currentTime = Math.min(audio.currentTime + 5, audio.duration);
      break;
    case 'ArrowLeft':
      e.preventDefault();
      audio.currentTime = Math.max(audio.currentTime - 5, 0);
      break;
    case 'ArrowUp':
      e.preventDefault();
      volumeSlider.value = Math.min(parseFloat(volumeSlider.value) + 0.1, 1);
      volumeSlider.dispatchEvent(new Event('input'));
      break;
    case 'ArrowDown':
      e.preventDefault();
      volumeSlider.value = Math.max(parseFloat(volumeSlider.value) - 0.1, 0);
      volumeSlider.dispatchEvent(new Event('input'));
      break;
    case 'KeyN':
      playNext(false);
      break;
    case 'KeyP':
      playPrev();
      break;
    case 'KeyM':
      toggleMute();
      break;
  }
});

// ─── Init ──────────────────────────────────────────────────
(function init() {
  buildPlaylist();
  loadSong(0, false);
  audio.volume = parseFloat(volumeSlider.value);
  setFillPercent(volumeSlider, parseFloat(volumeSlider.value) * 100);
  // Start pre-fetching other tracks' durations after a short delay
  setTimeout(prefetchDurations, 1500);
})();
