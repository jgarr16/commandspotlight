# CommandSpotlight (and Tiny Web API)

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

## Project 2: CommandSpotlight (Electron App)

Located in the `commandspotlight/` directory, this is a cross-platform (macOS/Windows) desktop application built with Electron. It functions as a lightweight, Spotlight-like utility for discovering and memorizing keyboard shortcuts.

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
   cd commandspotlight
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
cd commandspotlight
npm run build:mac
```
The output file will be generated in `commandspotlight/dist/`.

### How to Build (Windows)
To compile the application into a standalone Windows `.exe` installer and portable executable, you must run the build command **on a Windows machine**:
1. Copy this repository to a Windows computer.
2. Open a terminal (e.g., PowerShell or Command Prompt).
3. Navigate to the app directory and install dependencies:
   ```bash
   cd commandspotlight
   npm install
   ```
4. Run the Windows build command:
   ```bash
   npm run build:win
   ```
The output files (`.exe`) will be generated in `commandspotlight/dist/`.