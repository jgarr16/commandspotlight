# Gemini CLI Test Project

This repository contains two distinct projects created interactively using the Gemini CLI. It serves as a demonstration of scaffolding back-end APIs and building cross-platform desktop applications using AI assistance directly from the terminal.

## Project 1: Tiny Web API

Located in the root directory, this is a lightweight Node.js/Express API that demonstrates routing, dynamic parameters, and integration with the Google Gen AI SDK.

### Features
*   **Math Endpoints:** Add or multiply numbers directly via the URL (`/add/:a/:b` and `/multiply/:a/:b`).
*   **Echo Endpoint:** A `POST` endpoint (`/echo`) that returns the exact data you send it.
*   **Ask Gemini:** A `POST` endpoint (`/ask`) that accepts a JSON body with a `question`, forwards it to the `gemini-2.5-flash` model, and returns the response as readable plain text.

### How to Run
1. Ensure you have Node.js installed.
2. From the root directory, install dependencies:
   ```bash
   npm install
   ```
3. Set your Gemini API key in your environment:
   ```bash
   export GEMINI_API_KEY="your-api-key"
   ```
4. Start the server:
   ```bash
   node index.js
   ```
   The API will run on `http://localhost:3000`.

---

## Project 2: Shortcut Finder (Electron App)

Located in the `shortcut-app/` directory, this is a cross-platform (macOS/Windows) desktop application built with Electron. It functions as a lightweight, Spotlight-like utility for discovering and memorizing keyboard shortcuts.

### Features
*   **Global Hotkey Invocation:** Summon the app over any window using `Cmd + Ctrl + K`.
*   **Frameless Design:** A minimalist, dark-mode overlay that hides itself when you click away or press `Escape`.
*   **Intelligent Search:** Start typing instantly to filter your shortcuts by action (e.g., "Copy") or exact key combination (e.g., "Cmd+C").
*   **Cross-Platform Keys:** Automatically detects if you are on macOS or Windows and displays the appropriate modifiers (Cmd vs. Ctrl, Option vs. Alt).
*   **Dynamic Database:** Includes a built-in form to add custom shortcuts on the fly. New entries are instantly saved to the local `shortcuts.json` database and become searchable.
*   **Related Suggestions:** When viewing a specific shortcut, the app suggests related shortcuts from the same category.

### How to Run
1. Navigate to the app directory:
   ```bash
   cd shortcut-app
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application in development mode:
   ```bash
   npm start
   ```

### How to Build (macOS)
To compile the application into a standalone, distributable macOS `.dmg` file:
```bash
cd shortcut-app
npm run build:mac
```
The output file will be generated in `shortcut-app/dist/`.