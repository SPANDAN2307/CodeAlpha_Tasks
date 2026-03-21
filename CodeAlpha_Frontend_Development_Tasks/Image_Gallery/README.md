# Gallery ✨

A premium, dynamic image gallery built with pure HTML, CSS, and Vanilla JavaScript.

Gallery was designed to be beautiful, interactive, and functional. It utilizes modern CSS techniques (like CSS columns for Pinterest-style Masonry layouts and deep CSS Variables architecture) paired with lightweight Vanilla JavaScript to deliver a "fake-backend" experience that looks and feels like a professional full-stack application.

## 💡 Project Idea

The core idea of this project was to construct a robust, production-quality frontend application—such as a modern photography portfolio or asset library—relying entirely on foundational web technologies (Vanilla HTML, CSS, JS) without the overhead of heavy frameworks like React or a complex backend server. The project challenges developers to utilize advanced vanilla concepts such as:
* Custom CSS variables for complex theming (e.g. Light/Dark mode).
* CSS Column structures for elegant Pinterest-style Masonry layouts that accommodate varied image dimensions.
* Client-side JavaScript DOM manipulation for immediate live-search debouncing.
* Generating secure local Blob URLs to simulate file uploads and preview them instantly on the frontend.

## 🚀 Features

* **Masonry Grid Layout:** Images dynamically nest within a fluid column layout, supporting both portrait and landscape photography elegantly without brutal cropping.
* **Persistent Dark Mode:** A toggleable Dark and Light theme engine utilizing `localStorage`. The application stays the way you like it.
* **Live Search & Category Filtering:** Search images instantly by title using the debounced top navigation bar, or filter them by curated categories like *Nature*, *Architecture*, *People*, and *Abstract*.
* **Advanced Upload Modal:** A sleek, glassmorphic floating action interface allows you to "upload" images (via local Object URLs). It includes drag-and-drop file support, title specification, and live CSS visual filters (e.g. Noir, Vintage, Dreamy).
* **Pro Lightbox Viewer:** Click any image to view it in full screen, featuring a navigation carousel, category badge, dynamic image titles, and a dedicated **Download Button**.
* **Beautiful Micro-Interactions:** Custom load spinners, staggered fade-up load animations, and sophisticated box-shadows on hover events.

## 🛠️ Technology Stack

* **HTML5:** Semantic architecture with modern inputs and input form properties.
* **CSS3:** Built completely from scratch without external frameworks. Features heavy use of CSS Custom Properties for theme switching, Flexbox/Columns for layout, and modern `backdrop-filter` attributes for glass effects.
* **JavaScript (ES6):** No dependencies! Manages the DOM state, debounces key inputs, handles `localStorage` integrations, and generates `URL.createObjectURL` components for immediate, safe rendering of local user file uploads.

## 📥 Installation & Usage

Because this project is built entirely on client-side web technologies, there are zero build steps or server configurations required!

### Method 1: Download as ZIP (Easiest)
1. Click the green **Code** button on the GitHub repository page.
2. Select **Download ZIP**.
3. Extract the downloaded ZIP file to a folder on your computer.
4. Double-click the `index.html` file to automatically open the gallery in your default web browser.

### Method 2: Clone via Git
If you have Git installed, you can clone this repository to your computer by running the following command in your terminal:
```bash
git clone https://github.com/your-username/Image_Gallery.git
```
Then, navigate into the project folder (`cd Image_Gallery`) and open the `index.html` file in any modern web browser.

## 🖼️ Uploading Images

Gallery simulates an image upload sequence. By clicking the floating `+` button in the corner, you can select files directly from your computer. These files aren't sent to any server; instead, the browser creates a temporary, high-speed secure URL and dynamically renders your picture into the frontend immediately! 

When you refresh the page, the default placeholder Unsplash/Picsum gallery resets, as intended for this frontend showcase.
