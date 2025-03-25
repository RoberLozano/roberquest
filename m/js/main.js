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
        document.addEventListener('click', () => {
            DOM.getElement('characterContextMenu').style.display = 'none';
        });
        
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
            console.log('Direct directory listing not allowed, using default list');
            npcTokens = CONFIG.defaultCharacters.concat([
                '../img/tokens/Bandit Archer 01.png',
                '../img/tokens/Bandit Brawler Unarmed 01.png',
                '../img/tokens/Bandit Brute Club 01.png',
                '../img/tokens/Bandit Brute Shovel 01.png',
                '../img/tokens/Bandit Bully Club 01.png',
                '../img/tokens/Bandit Bully Mace 01.png',
                '../img/tokens/Bandit Captain Sword Dagger A 01.png',
                '../img/tokens/Bandit Captain Sword Dagger B 01.png',
                '../img/tokens/Bandit Crossbow A 01.png',
                '../img/tokens/Bandit Crossbow B 01.png',
                '../img/tokens/Bandit Dual Wield Axes 01.png',
                '../img/tokens/Bandit Dual Wield Swords 01.png',
                '../img/tokens/Bandit Peasant Pitchfork 01.png',
                '../img/tokens/Bandit Rogue Knife 01.png',
                '../img/tokens/Bandit Rogue Torch 01.png',
                '../img/tokens/Bandit Sling 01.png',
                '../img/tokens/Bandit Spear 01.png',
                '../img/tokens/Bandit Sword and Shield 01.png',
                '../img/tokens/Desert Cavalry Archer 01.png',
                '../img/tokens/Desert Cavalry Banner 01.png',
                '../img/tokens/Desert Cavalry Spear 01.png',
                '../img/tokens/Desert Cavalry Sword 01.png',
                '../img/tokens/Desert Cavalry Sword Shield 01.png',
                '../img/tokens/Desert Guard Archer 01.png',
                '../img/tokens/Desert Guard Archer At-Ease 01.png',
                '../img/tokens/Desert Guard Banner 01.png',
                '../img/tokens/Desert Guard Club 01.png',
                '../img/tokens/Desert Guard Club At-Ease 01.png',
                '../img/tokens/Desert Guard Crossbow 01.png',
                '../img/tokens/Desert Guard Crossbow At-Ease 01.png',
                '../img/tokens/Desert Guard Spear 01.png',
                '../img/tokens/Desert Guard Spear At-Ease 01.png',
                '../img/tokens/Desert Guard Sword Shield 01.png',
                '../img/tokens/Desert Guard Sword Shield At-Ease 01.png',
                '../img/tokens/Goblin Archer Bow 01.png',
                '../img/tokens/Goblin Barbarian Axe 01.png',
                '../img/tokens/Goblin Bomber 01.png',
                '../img/tokens/Goblin Druid 01.png',
                '../img/tokens/Goblin Druid Magic 01.png',
                '../img/tokens/Goblin Fighter Dual Swords 01.png',
                '../img/tokens/Goblin Fighter Greatsword 01.png',
                '../img/tokens/Goblin Fighter Spear 01.png',
                '../img/tokens/Goblin Fighter Sword 01.png',
                '../img/tokens/Goblin Fighter Sword Shield 01.png',
                '../img/tokens/Goblin Ranger Shortsword 01.png',
                '../img/tokens/Goblin Rogue Dagger Crossbow 01.png',
                '../img/tokens/Goblin Spellcaster 01.png',
                '../img/tokens/Goblin Spellcaster Magic 01.png',
                '../img/tokens/Guard Archer 01.png',
                '../img/tokens/Guard Archer At-Ease 01.png',
                '../img/tokens/Guard Banner 01.png',
                '../img/tokens/Guard Club 01.png',
                '../img/tokens/Guard Club At-Ease 01.png',
                '../img/tokens/Guard Crossbow 01.png',
                '../img/tokens/Guard Crossbow At-Ease 01.png',
                '../img/tokens/Guard Spear 01.png',
                '../img/tokens/Guard Spear At-Ease 01.png',
                '../img/tokens/Guard Sword Shield 01.png',
                '../img/tokens/Guard Sword Shield At-Ease 01.png',
                '../img/tokens/Rosssel.png'
            ]);
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
                       .replace(/[_-]/g, ' ');
        
        // Create NPC item element
        const npcItem = DOM.createElement('div', { class: 'npc-item', 'data-path': tokenPath });
        
        // Create image and name elements
        const img = DOM.createElement('img', { src: tokenPath, alt: npcName, loading: 'lazy' });
        const span = DOM.createElement('span', {}, npcName.replace(/[%20]/g, ' '));
        
        // Add click event to add NPC to map
        npcItem.addEventListener('click', () => {
            CharacterController.addCharacterToMap(tokenPath);
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
