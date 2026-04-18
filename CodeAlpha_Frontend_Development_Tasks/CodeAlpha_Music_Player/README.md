# Bommbash Music Dashboard 🎵 

A premium, fully responsive, Apple Music-inspired web media player built with modern web development practices. This project was developed as part of the CodeAlpha Internship Frontend Development Tasks.

## 🚀 Features

* **Apple Music Inspired UI:** A sleek, glassmorphic dark theme featuring translucent sidebars (`backdrop-filter`) and the signature Apple pure black/red contrast layout.
* **Dynamic Global Player Bar:** A persistent top-bar LCD-style audio player with transport controls (Play, Pause, Next, Previous), shuffle, repeat functions, and an ergonomic volume slider.
* **Instant Card Action:** Click any album card to start playing immediately. Clicking an active playing card will seamlessly toggle play/pause functionality without reloading the song.
* **Live Audio Streaming:** Integrates direct high-fidelity open-source tracks (via SoundHelix and ccMixter).
* **Responsive HTML5 Audio API:** Fast, hardware-accelerated time progression scrubs and metadata loading using pure JavaScript.

---

## 🛠️ How to Use

### 1. Installation 
This project relies purely on vanilla web technologies, so no complex backend set up or dependency installation is required!
* Open the `CodeAlpha_Music_Player` directory on your system.
* Double click on `index.html` to open the app directly in Google Chrome, Microsoft Edge, Safari, or Firefox. 

### 2. Playback Controls
* **Play any Song:** Browse the main library feed and hover over any card. Click it to start playback instantly.
* **Pause / Unpause:** Either click the active album card again, press the main **Play/Pause** button located in the top player bar, or press your **Spacebar** on your keyboard!
* **Scrubbing:** Click anywhere inside the tracker bar (next to the LCD album display at the top) to seek to a specific time within the current track.
* **Volume Tuning:** Drag the volume slider located in the top-right corner to adjust the gain, or click the speaker icon next to it to instantly Mute/Unmute.
* **Queue Options:** Enable **Shuffle** or **Repeat** mode directly from the player control bar using the smaller icon buttons beside the transport controls.

### 3. Modifying the Music Library
You can easily add your own music by modifying the `script.js` file:
1. Open `script.js` in your code editor.
2. Locate the `masterSongs` array near the top of the file.
3. Adding a new song format is simple:
   ```javascript
   { 
     id: 11,                               // Unique ID number
     title: 'Song Name',                   // Display title
     artist: 'Artist Name',                // Display artist
     cover: 'path/to/image.jpg',           // Link to local or online image
     src: 'path/to/music_file.mp3',        // Link to local or online .mp3
     liked: false, 
     isFeature: false,                     // Set to true to list in the Top Banner
     subtitle: 'NEW' 
   }
   ```

---

## ⚙️ Tech Stack
* **HTML5:** Semantic architecture ensuring a modern web layout.
* **CSS3:** Custom CSS variables, flexbox/grid alignments, complex glassmorphic `.backdrop-filter` effects, and SVG styling without any heavy frameworks (No Bootstrap/Tailwind).
* **JavaScript (ES6):** Complete DOM manipulation, state management, event delegation, and HTML5 Audio object control dynamically handled natively in the browser. 

---

*Designed and completed for the CodeAlpha Internship Frontend Development Track.*
