const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

let shortcuts = [];
let selectedIndex = 0;

// Determine platform
const isMac = process.platform === 'darwin';
const shortcutsPath = path.join(__dirname, 'shortcuts.json');

// Load the shortcuts database
try {
    const data = fs.readFileSync(shortcutsPath, 'utf8');
    shortcuts = JSON.parse(data);
} catch (err) {
    console.error("Error reading shortcuts.json:", err);
}

const searchInput = document.getElementById('search-input');
const resultsDiv = document.getElementById('results');

// Add view elements
const mainView = document.getElementById('main-view');
const addView = document.getElementById('add-view');
const showAddBtn = document.getElementById('show-add-btn');
const cancelAddBtn = document.getElementById('cancel-add-btn');
const saveAddBtn = document.getElementById('save-add-btn');

const addAction = document.getElementById('add-action');
const addMac = document.getElementById('add-mac');
const addWin = document.getElementById('add-win');
const addCategory = document.getElementById('add-category');
const addDesc = document.getElementById('add-desc');

function renderResults(query) {
    resultsDiv.innerHTML = '';
    
    if (!query.trim()) {
        return; // Start with a completely blank canvas underneath the search bar
    }

    const lowerQuery = query.toLowerCase();
    
    // Normalize user input to make searching for "Command-C" or "Cmd+C" identical
    const normalizedQueryForKeys = lowerQuery.replace('command', 'cmd')
                                             .replace('control', 'ctrl')
                                             .replace('option', 'opt')
                                             .replace(/[^a-z0-9]/g, '');

    // Filter matching shortcuts (Primary matches)
    const primaryMatches = shortcuts.filter(s => {
        const platformKey = (isMac ? s.mac : s.win).toLowerCase().replace(/[^a-z0-9]/g, '');
        const actionMatches = s.action.toLowerCase().includes(lowerQuery);
        const keyMatches = normalizedQueryForKeys.length > 0 && platformKey.includes(normalizedQueryForKeys);
        return actionMatches || keyMatches;
    });

    let displayList = [...primaryMatches];

    // Add related items based on category
    if (primaryMatches.length > 0) {
        const primaryCategory = primaryMatches[0].category;
        const related = shortcuts.filter(s => s.category === primaryCategory && !primaryMatches.includes(s));
        
        // Take up to 2 related items
        const additional = related.slice(0, 2);
        if (additional.length > 0) {
            displayList = displayList.concat(additional);
        }
    }

    if (displayList.length === 0) {
        resultsDiv.innerHTML = '<div style="padding: 20px; color: #888; text-align: center;">No shortcuts found.</div>';
        return;
    }

    // Adjust selected index if it goes out of bounds
    if (selectedIndex >= displayList.length) selectedIndex = 0;

    displayList.forEach((shortcut, index) => {
        const isPrimary = primaryMatches.includes(shortcut);
        const platformKey = isMac ? shortcut.mac : shortcut.win;
        const item = document.createElement('div');
        item.className = `result-item ${index === selectedIndex ? 'selected' : ''}`;
        
        item.innerHTML = `
            <div class="result-header">
                <span class="action-name">
                    ${shortcut.action} 
                    ${!isPrimary ? '<span style="font-size: 11px; color: rgba(255,255,255,0.4); font-weight: normal; margin-left: 8px;">(Related)</span>' : ''}
                </span>
                <span class="keys">${platformKey}</span>
            </div>
            <div class="description">${shortcut.description}</div>
        `;

        resultsDiv.appendChild(item);
    });
}

// Clear on focus so it's fresh every time you invoke the shortcut
window.addEventListener('focus', () => {
    if (!mainView.classList.contains('hidden')) {
        searchInput.value = '';
        renderResults('');
        searchInput.focus();
    }
});

// Initial render
renderResults('');

// Input event for searching
searchInput.addEventListener('input', (e) => {
    selectedIndex = 0;
    renderResults(e.target.value);
});

// Keyboard navigation (Arrow keys, Enter, Escape)
window.addEventListener('keydown', (e) => {
    // If add view is open, only handle escape to close it
    if (!addView.classList.contains('hidden')) {
        if (e.key === 'Escape') {
            closeAddView();
        }
        return;
    }

    if (e.key === 'Escape') {
        ipcRenderer.send('hide-window');
        return;
    }

    const resultItems = document.querySelectorAll('.result-item');
    if (resultItems.length === 0) return;

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % resultItems.length;
        renderResults(searchInput.value);
        document.querySelectorAll('.result-item')[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + resultItems.length) % resultItems.length;
        renderResults(searchInput.value);
        document.querySelectorAll('.result-item')[selectedIndex].scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter') {
        ipcRenderer.send('hide-window');
    }
});

showAddBtn.addEventListener('click', () => {
    mainView.classList.add('hidden');
    addView.classList.remove('hidden');
    addAction.focus();
});

function closeAddView() {
    addView.classList.add('hidden');
    mainView.classList.remove('hidden');
    
    // Clear form
    addAction.value = '';
    addMac.value = '';
    addWin.value = '';
    addCategory.value = '';
    addDesc.value = '';
    
    searchInput.focus();
}

cancelAddBtn.addEventListener('click', closeAddView);

saveAddBtn.addEventListener('click', () => {
    const action = addAction.value.trim();
    if (!action) return;

    const newShortcut = {
        category: addCategory.value.trim() || 'Custom',
        action: action,
        keysRaw: addMac.value.trim() || addWin.value.trim(),
        win: addWin.value.trim() || addMac.value.trim(),
        mac: addMac.value.trim() || addWin.value.trim(),
        description: addDesc.value.trim()
    };

    shortcuts.push(newShortcut);
    
    try {
        fs.writeFileSync(shortcutsPath, JSON.stringify(shortcuts, null, 2));
    } catch (err) {
        console.error("Error saving shortcut:", err);
    }
    
    closeAddView();
    // Render the new item by showing it in search
    searchInput.value = action;
    renderResults(action);
});