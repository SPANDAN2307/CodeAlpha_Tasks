# CodeAlpha Backend Development Task - Custom URL Shortener

This is a comprehensive, full-stack URL shortener application built using Node.js, Express, and SQLite3. It allows users to submit long URLs and generate compact, short links that seamlessly redirect to the original destinations. The project features an intuitive frontend interface and a robust backend API.

---

## 🌟 Key Features

- **Quick Link Generation:** Instantly convert long, unwieldy URLs into highly shareable short links.
- **Easy One-Click Setup:** Includes a `run_server.bat` script that handles everything—from initializing `package.json` to installing dependencies, starting the server, and opening your browser automatically.
- **Full-Stack Implementation:** A decoupled RESTful API backend serving a polished HTML/CSS/JS frontend interface.
- **Persistent Storage:** Utilizes an SQLite3 embedded database to safely store and retrieve your generated short links permanently.
- **Auto-Routing:** Fast and direct URL redirection from the short code to the original `long_url`.
- **Responsive UI:** A clean, modern, and accessible user interface handling both successes and error states gracefully.

---

## 🛠️ Technology Stack

- **Backend / API Engine:** Node.js, Express.js
- **Database:** SQLite3 (Serverless embedded SQL database engine)
- **Frontend / Client UI:** Vanilla HTML5, CSS3, JavaScript
- **Middleware / HTTP Support:** `cors` (Cross-Origin Resource Sharing middleware)
- **Environment Management:** Windows Batch Script (`.bat`) for setup automation

---

## 📂 Project Structure

```text
CodeAlpha_Backend_Development_Tasks/
│
├── public/                 # 🌐 Frontend UI Assets
│   ├── index.html          # Main application user interface
│   ├── style.css           # Styling for the application
│   └── script.js           # Client-side logic and API consumption
│
├── database.sqlite         # 🗄️ SQLite Database File (Created automatically on startup)
├── db.js                   # Database configuration and table initialization logic
├── server.js               # 🚀 Main backend application and API route controllers
├── run_server.bat          # ⚙️ Windows automation script to start the server easily
├── package.json            # Node.js project configuration (Generated automatically)
└── README.md               # 📖 Project documentation (This file)
```

---

## 📥 Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system. You can download and install the latest LTS version from [nodejs.org](https://nodejs.org/).

---

## 🚀 How to Start the Application

Follow these steps to set up and run the application from scratch:

### 1. Clone or Download the Project
If using Git, clone the repository to your local machine:
```bash
git clone <repository_url>
```
*(Replace `<repository_url>` with the actual repository link, or simply download and extract the project files as a ZIP archive.)*

### 2. Navigate to the Project Directory
Open your Command Prompt (cmd), PowerShell, or terminal, and navigate to the extracted project folder:
```bash
cd F:\Intership\CodeAlpha_Tasks\CodeAlpha_Backend_Development_Tasks
```
*(Adjust the file path if you saved the project in a different location.)*

### 3. Run the setup and server using the Batch File (`run_server.bat`)
The absolute easiest way to start the server is to use the provided `run_server.bat` file. It completely automates the installation of all necessary dependencies and launches the application.

You can run it using **two methods**:
- **Method A (GUI):** Navigate to the project folder via Windows File Explorer and **double-click** the `run_server.bat` file.
- **Method B (Terminal):** Within your command-line interface, type:
  ```cmd
  .\run_server.bat
  ```

**What exactly does the `run_server.bat` script do in the background?**
1. **Checks for node_modules:** It verifies if the application's dependencies are already installed.
2. **Auto-Initialization:** If dependencies are missing, it securely initializes the project (`npm init -y`) and safely installs `express`, `cors`, and `sqlite3` using npm.
3. **Skips redundant downloads:** If dependencies are already present, it intelligent skips the installation phase.
4. **Starts the Application:** It boots up the Node.js backend (`node server.js`).
5. **Opens the UI:** It automatically launches your default web browser and securely navigates directly to `http://localhost:3000`.

---

## 🏗️ Database Schema

The application uses an SQLite3 database. The data is stored in a locally generated file named `database.sqlite` and contains a single table: `urls`.

| Column        | Data Type | Description                              | Characteristics                           |
|---------------|-----------|------------------------------------------|-------------------------------------------|
| `id`          | INTEGER   | Unique Internal identifier.              | PRIMARY KEY, AUTOINCREMENT                |
| `long_url`    | TEXT      | The original destination URL.            | NOT NULL                                  |
| `short_code`  | TEXT      | A randomly generated 6-character string. | NOT NULL, UNIQUE                          |
| `created_at`  | DATETIME  | Timestamp of when the link was shortened.| DEFAULT CURRENT_TIMESTAMP                 |

---

## 🔌 API Documentation

If you wish to integrate this URL shortener into another application, you can easily interface with the REST API.

### 1. Generate a Short Link

- **Endpoint:** `POST /api/shorten`
- **Description:** Submits a valid, long URL and securely generates a unique 6-character short link.
- **Pre-Processing Logic:** The system automatically prefixes `http://` if a protocol prefix is missing from the submitted URL.

**Request Body (JSON):**
```json
{
  "url": "https://www.google.com/search?q=codealpha+internship"
}
```

**Success Response (200 OK):**
```json
{
  "original_url": "https://www.google.com/search?q=codealpha+internship",
  "short_code": "aB3x9Y",
  "short_url": "http://localhost:3000/aB3x9Y"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "URL is required"
}
```

### 2. Access/Redirect a Short Link

- **Endpoint:** `GET /:code`
- **Description:** Dynamically matches the short code parameter against the database and instantly HTTP-redirects the browser to the connected `long_url`.

**Example Request:**
```http
GET http://localhost:3000/aB3x9Y
```

**Response Handling:**
- **Success:** Application redirects HTTP traffic automatically (HTTP Status 302 Found) to the mapped `long_url` sequence.
- **Error (404 Not Found):** Returns standard HTML text `"URL not found"` if the link code explicitly does not exist in the SQLite registry.

---

## 💡 How to Use the UI Interface

1. **Start the server** (See step 3 above).
2. Look at the application inside your open browser window.
3. **Locate the input form field** on the screen.
4. **Paste your massive, long web link** into the input box.
5. **Click the "Shorten URL" button.**
6. The application will compute the route and display a freshly generated, clickable, shortened URL string immediately beneath the button. Make sure to click the new short URL to test out the seamless database redirection!

---
*Developed for CodeAlpha Internship Tasks*
