const fs = require('fs');

const content = fs.readFileSync('../keyboard_shortcuts.md', 'utf-8');
const lines = content.split('\n');

const shortcuts = [];
let currentCategory = 'General';
let currentShortcut = null;

for (let line of lines) {
    if (line.startsWith('### ')) {
        currentCategory = line.replace('### ', '').trim();
    } else if (line.trim().startsWith('*   **')) {
        const match = line.match(/\*   \*\*(.*?):\*\* (.*)/);
        if (match) {
            const action = match[1].trim();
            const keysRaw = match[2].trim();
            
            const keyMatches = [...keysRaw.matchAll(/`(.*?)`/g)].map(m => m[1]);
            let winKey = keysRaw.replace(/`/g, '');
            let macKey = keysRaw.replace(/`/g, '');
            
            if (keyMatches.length === 2) {
                winKey = keyMatches[0];
                macKey = keyMatches[1];
            } else if (keyMatches.length === 1) {
                winKey = keyMatches[0];
                macKey = keyMatches[0];
            } else if (keyMatches.length > 2) {
                 winKey = keyMatches[0];
                 macKey = keyMatches[keyMatches.length - 1];
            }

            currentShortcut = {
                category: currentCategory,
                action: action,
                keysRaw: keysRaw.replace(/`/g, ''),
                win: winKey,
                mac: macKey,
                description: ''
            };
            shortcuts.push(currentShortcut);
        }
    } else if (line.trim().startsWith('*   ') && currentShortcut) {
        currentShortcut.description = line.trim().replace(/^\*\s*/, '');
        currentShortcut = null;
    }
}

fs.writeFileSync('shortcuts.json', JSON.stringify(shortcuts, null, 2));
console.log('Parsed markdown into shortcuts.json');