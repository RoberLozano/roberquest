/**
 * Main Application Script
 * Initializes and coordinates all application modules
 */

// Global variables
let svgElement = null;
let characters = new Map();

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
