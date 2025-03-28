/**
 * Main Application Script
 * Initializes and coordinates all application modules
 */

// Global variables
let svgElement = null;
let characters = new Map();
let npcTokens = []; // Array to store available NPC tokens

// Document ready function
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize tooltip for distance display
        CharacterController.initTooltip();
        
        // Initialize controllers
        MapController.init();
        LayerController.init();
        SyncController.init();
        
        // Setup side panel toggle
        const togglePanelBtn = DOM.getElement('togglePanel');
        const sidePanel = DOM.getElement('sidePanel');
        
        togglePanelBtn.addEventListener('click', () => {
            sidePanel.classList.toggle('open');
        });
        
        // Setup file input for loading SVG maps
        const fileInput = DOM.getElement('fileInput');
        fileInput.addEventListener('change', async (e) => {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                await MapController.loadMapFromURL(url);
            }
        });
        
        // Setup character input for adding characters
        const characterInput = DOM.getElement('characterInput');
        characterInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                Array.from(e.target.files).forEach(file => {
                    const url = URL.createObjectURL(file);
                    CharacterController.addCharacterToMap(url);
                });
            }
        });
        
        // Setup NPC modal
        setupNpcModal();
        
        // Close context menu on document click
        // document.addEventListener('click', () => {
        //     DOM.getElement('characterContextMenu').style.display = 'none';
        // });
        
        // Prevent context menu on SVG container
        const svgContainer = DOM.getElement('svg-container');
        svgContainer.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Setup context menu item handlers
        DOM.getElement('togglePath').addEventListener('click', () => {
            CharacterController.togglePath();
        });
        
        DOM.getElement('deleteRoute').addEventListener('click', () => {
            CharacterController.deleteRoute();
            DOM.getElement('characterContextMenu').style.display = 'none';
        });
        
        DOM.getElement('deleteCharacter').addEventListener('click', () => {
            CharacterController.deleteCharacter();
            DOM.getElement('characterContextMenu').style.display = 'none';
        });

        DOM.getElement('showStats').addEventListener('click', () => {
            CharacterController.showStats();
            DOM.getElement('characterContextMenu').style.display = 'none';
        });
        
        
        // Load default map
        try {
            await MapController.loadMapFromURL(CONFIG.defaultMapUrl);
            console.log('Default map loaded successfully');
            
            // Add default characters
            CONFIG.defaultCharacters.forEach(charUrl => {
                CharacterController.addCharacterToMap(charUrl);
            });
        } catch (error) {
            console.error('Error loading default map:', error);
        }
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

/**
 * Setup NPC modal functionality
 */
function setupNpcModal() {
    const modal = DOM.getElement('npcModal');
    const closeBtn = modal.querySelector('.close-modal');
    const npcGrid = DOM.getElement('npcGrid');
    const npcSearch = DOM.getElement('npcSearch');
    const ctd = DOM.getElement('ctd');
    const addNpcBtn = DOM.getElement('addNpcBtn');
    
    // Open modal when Add NPC button is clicked
    addNpcBtn.addEventListener('click', () => {
        modal.style.display = 'block';
        
        // Load NPC tokens if not already loaded
        if (npcTokens.length === 0) {
            loadNpcTokens();
        }
    });
    
    // Close modal when X is clicked
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Close modal when clicking outside the content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Filter NPCs when searching
    npcSearch.addEventListener('input', filterNpcs);
}

/**
 * Load NPC tokens from img/token directory
 */
async function loadNpcTokens() {
    const npcGrid = DOM.getElement('npcGrid');
    npcGrid.innerHTML = '<div class="loading">Loading NPCs...</div>';
    
    try {
        // Fetch list of token files
        const response = await fetch('../img/tokens/');
       
        // If direct directory listing is not allowed, use the default characters
        // and some other common tokens that we know are available
        if (!response.ok) {
            console.log('Direct directory listing not allowed');
        } else {
            const html = await response.text();
            
            // Extract image paths using regex
            const regex = /href="([^"]+\.(png|jpg|gif|jpeg|webp))"/gi;
            const matches = [...html.matchAll(regex)];
            console.log('Matches:', matches);
            
            // Ensure we don't duplicate the path
            npcTokens = matches.map(match => {
                const path = match[1];
                // Check if the path already includes img/tokens/
                if (path.startsWith('/img/tokens/')) {
                    return `..${path}`;
                }
            });
        }
        // console.log('NPC Tokens:', npcTokens);
        displayNpcTokens();
    } catch (error) {
        console.error('Error loading NPC tokens:', error);
        npcGrid.innerHTML = '<div class="error">Error loading NPCs. Using default list.</div>';
        
        // Use default list as fallback
        npcTokens = CONFIG.defaultCharacters;
        displayNpcTokens();
    }
}

/**
 * Display NPC tokens in the grid
 */
function displayNpcTokens() {
    const npcGrid = DOM.getElement('npcGrid');
    npcGrid.innerHTML = '';
    
    if (npcTokens.length === 0) {
        npcGrid.innerHTML = '<div class="error">No NPCs found</div>';
        return;
    }
    
    npcTokens.forEach(tokenPath => {
        // Extract filename to use as NPC name
        const fileName = tokenPath.split('/').pop();
        const npcName = fileName.substring(0, fileName.lastIndexOf('.'))
                       .replace(/[_-]/g, ' ').replace(/[%20]/g, ' ');
        
        // Create NPC item element
        const npcItem = DOM.createElement('div', { class: 'npc-item', 'data-path': tokenPath });
        
        // Create image and name elements
        const img = DOM.createElement('img', { src: tokenPath, alt: npcName, loading: 'lazy' });
        const span = DOM.createElement('span', {}, npcName);
        
        // Add click event to add NPC to map
        npcItem.addEventListener('click', () => {
            let n=ctd.value;
            for (let i=0; i<n; i++){
                // decidir que distancia habrá entre NPCs al aparecer
                CharacterController.addCharacterToMap(tokenPath, {x: 0+i*50, y:  100});
            }       
            // CharacterController.addCharacterToMap(tokenPath);
            DOM.getElement('npcModal').style.display = 'none';
        });
        
        // Append elements to NPC item
        npcItem.appendChild(img);
        npcItem.appendChild(span);
        
        // Append to grid
        npcGrid.appendChild(npcItem);
    });
}

/**
 * Filter NPCs based on search input
 */
function filterNpcs() {
    const searchText = DOM.getElement('npcSearch').value.toLowerCase();
    const npcItems = DOM.getElement('npcGrid').querySelectorAll('.npc-item');
    
    npcItems.forEach(item => {
        const npcName = item.querySelector('span').textContent.toLowerCase();
        
        if (npcName.includes(searchText)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}
