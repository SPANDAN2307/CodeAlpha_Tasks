# Event Registration System

A full-stack application built with Express.js, Sequelize, React, and Tailwind CSS. The app features a modern UI with glassmorphism and provides a robust registration system with role-based authentication.

## Features

- **Role-Based Authentication**: Secure login and registration using JWT and bcrypt.
- **Admin Dashboard**: Only administrators can create and manage events.
- **User Dashboard**: Users can browse events, register for them, and manage their tickets.
- **Dynamic UI**: Modern, responsive frontend built with React and styled with Tailwind CSS.

## Getting Started Locally

### The Easy Way (Windows only)
For a seamless startup experience on Windows, simply run the included batch script. It will automatically check for dependencies, install them if necessary, and launch both the backend and frontend servers:
1. Double-click on `run.bat` or run it from the command line:
   ```cmd
   run.bat
   ```

### Manual Setup
1. **Install dependencies:**
   In the root directory, run:
   ```bash
   npm run install-all
   ```

2. **Seed the database (Optional but recommended):**
   Run the seed script to populate events to test the app.
   ```bash
   cd backend
   node seed.js
   cd ..
   ```

3. **Start the development server:**
   In the root directory, run:
   ```bash
   npm run dev
   ```
   - The React frontend will start on port `5173`.
   - The Express backend will start on port `5000`.

## Deployment to Render

This project is configured to be deployed as a **Single Web Service** on Render.

1. Connect this repository to your Render account.
2. Select **Web Service** and choose this repository.
3. The `render.yaml` file in the root directory will automatically configure the build and start commands.
   - Build Command: `npm run install-all && npm run build:frontend`
   - Start Command: `npm start`
4. Deploy! Render will build the React app and serve it from the Express backend automatically.

### Production Database
By default, the app uses an SQLite database locally. To use PostgreSQL on Render, add an environment variable in the Render dashboard:
- `DATABASE_URL`: Add your PostgreSQL connection string here. The app will automatically connect using Postgres.
