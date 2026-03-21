# CodeAlpha Backend Development Task - URL Shortener

This is a simple URL shortener application built using Node.js, Express, and SQLite3. It allows users to submit long URLs and receive a shortened version, which redirects to the original URL when accessed.

## Prerequisites

- **Node.js**: Ensure you have Node.js installed on your system. You can download it from [nodejs.org](https://nodejs.org/).

## How to Start the Server

Follow these steps to set up and run the application from scratch:

### 1. Clone or Download the Project
If using Git, clone the repository to your local machine:
```bash
git clone <repository_url>
```
*(Replace `<repository_url>` with the actual repository link, or simply download and extract the project files.)*

### 2. Navigate to the Project Directory
Open your Command Prompt (cmd), PowerShell, or terminal, and navigate to the project folder:
```bash
cd F:\Intership\CodeAlpha_Tasks\CodeAlpha_Backend_Development_Tasks
```
*(Adjust the path if you saved the project elsewhere.)*

### 3. Run the setup and server using the Batch File (`run_server.bat`)
The easiest way to start the server is to use the provided `run_server.bat` file. It automates the installation of dependencies and starts the server.

You can run it in two ways:
- **Option A:** Simply **double-click** the `run_server.bat` file in your File Explorer.
- **Option B:** From your command-line interface (within the project directory), type:
  ```cmd
  .\run_server.bat
  ```

**What the `run_server.bat` script does:**
1. Checks if the `node_modules` folder exists.
2. If it doesn't exist, it automatically creates a `package.json` (`npm init -y`) and installs the required dependencies (`express`, `cors`, `sqlite3`).
3. If dependencies are already installed, it skips the installation process.
4. Starts the Node.js server (`node server.js`).
5. Automatically opens your default web browser and navigates to `http://localhost:3000`.

## Application Structure

- `server.js`: The main Express server application handling routing and API endpoints.
- `db.js`: Handles the SQLite3 database connection and initialization.
- `run_server.bat`: A Windows batch script to automate dependency installation and server startup.
- `public/`: Directory containing static frontend files (HTML, CSS, JS) served by the application.

## API Endpoints

- `POST /api/shorten`: 
  - Generates a short code for a given long URL.
  - **Payload:** `{ "url": "https://example.com" }`
  - **Response:** JSON object containing the original URL, short code, and the new short URL.

- `GET /:code`: 
  - Redirects the user to the original long URL associated with the provided short code.
