# Event Registration System

A full-stack application built with Express.js, Sequelize, React, and Tailwind CSS. The app features a modern UI with glassmorphism and allows users to browse events, register, and manage their tickets.

## Getting Started Locally

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
