# CSV Data Visualizer

This is a desktop application built with Electron, React, and Tailwind CSS that allows you to visualize and search CSV data.

## Architecture

The application is composed of two main processes:

1.  **Main Process (`main.ts`):** This is the entry point of the Electron application. It creates the main browser window and handles all the interactions with the operating system.
2.  **Renderer Process (`App.tsx`):** This is the user interface of the application, built with React. It runs in the browser window created by the main process and is responsible for rendering the UI and handling user interactions.

The two processes communicate with each other through the `preload.ts` script, which securely exposes Node.js APIs to the renderer process.

## Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Build for Production

To create a distributable package for your application, run one of the following commands:

- For Windows:
  `npm run dist:win`
- For macOS:
  `npm run dist:mac`
