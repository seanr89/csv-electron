// Preload script for Electron.
// Runs in a privileged context before the renderer process is loaded.
// It is used to securely expose Node.js APIs to the renderer process
// via the contextBridge API.
export {};
// For this application, the FileReader API is used for CSV parsing, which
// is available in the browser/renderer environment. Therefore, no Node.js
// modules need to be exposed for the current functionality. This file is
// included to follow Electron's security best practices and to provide a
// place for future Node.js integrations.
