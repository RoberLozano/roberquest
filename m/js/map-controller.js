/**
 * Map Controller Module
 * Handles map operations, transformations, and events
 */
const MapController = {
    // Map state
    scale: 1,
    pointX: 0,
    pointY: 0,
    panning: false,
    start: { x: 0, y: 0 },
    lastDist: null,
    
    /**
     * Initialize the map controller
     */
    init() {
        this.mapContainer = DOM.getElement("map-container");
        this.svgContainer = DOM.getElement("svg-container");
        this.setupEventListeners();
    },
    
    /**
     * Set up map event listeners
     */
    setupEventListeners() {
        // Touch events
        this.mapContainer.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.mapContainer.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.mapContainer.addEventListener('touchend', this.handleTouchEnd.bind(this));
        
        // Mouse events
        this.mapContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.mapContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.mapContainer.addEventListener('mouseup', () => this.panning = false);
        this.mapContainer.addEventListener('mouseleave', () => this.panning = false);
        this.mapContainer.addEventListener('wheel', this.handleWheelZoom.bind(this));
        
        // Button handlers
        DOM.getElement('zoomIn').addEventListener('click', this.zoomIn.bind(this));
        DOM.getElement('zoomOut').addEventListener('click', this.zoomOut.bind(this));
        DOM.getElement('resetView').addEventListener('click', this.resetView.bind(this));
        DOM.getElement('searchButton').addEventListener('click', this.handleSearch.bind(this));
    },
    
    /**
     * Handle touch start event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            this.panning = true;
            this.start = {
                x: e.touches[0].clientX - this.pointX,
                y: e.touches[0].clientY - this.pointY
            };
        }
    },
    
    /**
     * Handle touch move event
     * @param {TouchEvent} e - Touch event
     */
    handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length === 1 && this.panning) {
            this.pointX = e.touches[0].clientX - this.start.x;
            this.pointY = e.touches[0].clientY - this.start.y;
            this.setTransform();
        } else if (e.touches.length === 2) {
            this.panning = false;
            this.handlePinchZoom(e);
        }
    },
    
    /**
     * Handle pinch zoom with two fingers
     * @param {TouchEvent} e - Touch event
     */
    handlePinchZoom(e) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        
        // Calculate midpoint between two fingers
        const midX = (touch1.clientX + touch2.clientX) / 2;
        const midY = (touch1.clientY + touch2.clientY) / 2;
        
        // Calculate distance between two fingers
        const dist = Math.hypot(
            touch2.clientX - touch1.clientX,
            touch2.clientY - touch1.clientY
        );
        
        if (this.lastDist) {
            const svgPointBefore = SVGUtils.getPointInSVG(midX, midY);
            if (!svgPointBefore) return;
            
            // Calculate zoom delta based on finger distance difference
            const delta = dist - this.lastDist;
            this.scale += delta * 0.01;
            this.scale = Math.min(Math.max(CONFIG.minScale, this.scale), CONFIG.maxScale);
            
            // Apply initial transformation
            this.setTransform();
            
            // Adjust position to keep the point under the fingers
            const svgPointAfter = SVGUtils.getPointInSVG(midX, midY);
            if (!svgPointAfter) return;
            
            this.pointX += (svgPointAfter.x - svgPointBefore.x) * this.scale;
            this.pointY += (svgPointAfter.y - svgPointBefore.y) * this.scale;
            this.setTransform();
        }
        
        this.lastDist = dist;
    },
    
    /**
     * Handle touch end event
     */
    handleTouchEnd() {
        this.panning = false;
        this.lastDist = null;
    },
    
    /**
     * Handle mouse down event
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseDown(e) {
        if (e.button === 2) {
            this.panning = false;
            return;
        }
        
        this.panning = true;
        this.start = {
            x: e.clientX - this.pointX,
            y: e.clientY - this.pointY
        };
        
        // Log SVG coordinates for debugging
        const svgPoint = SVGUtils.getPointInSVG(e.clientX, e.clientY);
        if (svgPoint) {
            console.log('SVG Coordinates:', svgPoint.x, svgPoint.y);
        }
    },
    
    /**
     * Handle mouse move event
     * @param {MouseEvent} e - Mouse event
     */
    handleMouseMove(e) {
        if (this.panning) {
            this.pointX = e.clientX - this.start.x;
            this.pointY = e.clientY - this.start.y;
            this.setTransform();
        }
    },
    
    /**
     * Handle wheel zoom event
     * @param {WheelEvent} e - Wheel event
     */
    handleWheelZoom(e) {
        e.preventDefault();
        
        const zoomFactor = e.deltaY < 0 ? CONFIG.zoomInFactor : CONFIG.zoomOutFactor;
        this.zoomToPoint({ x: e.clientX, y: e.clientY }, zoomFactor);
    },
    
    /**
     * Zoom to a specific point
     * @param {Object} point - Point to zoom to {x, y}
     * @param {number} zoomFactor - Factor to zoom by
     */
    zoomToPoint(point, zoomFactor) {
        const svgPointBefore = SVGUtils.getPointInSVG(point.x, point.y);
        if (!svgPointBefore) return;
        
        const newScale = Math.min(Math.max(CONFIG.minScale, this.scale * zoomFactor), CONFIG.maxScale);
        this.scale = newScale;
        this.setTransform();
        
        const svgPointAfter = SVGUtils.getPointInSVG(point.x, point.y);
        if (!svgPointAfter) return;
        
        this.pointX += (svgPointAfter.x - svgPointBefore.x) * this.scale;
        this.pointY += (svgPointAfter.y - svgPointBefore.y) * this.scale;
        this.setTransform();
    },
    
    /**
     * Zoom in centered on the viewport
     */
    zoomIn() {
        this.zoomToPoint(
            { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 
            CONFIG.zoomInFactor
        );
    },
    
    /**
     * Zoom out centered on the viewport
     */
    zoomOut() {
        this.zoomToPoint(
            { x: window.innerWidth / 2, y: window.innerHeight / 2 }, 
            CONFIG.zoomOutFactor
        );
    },
    
    /**
     * Reset the view to default
     */
    resetView() {
        this.scale = 1;
        this.pointX = 0;
        this.pointY = 0;
        this.setTransform();
    },
    
    /**
     * Handle search button click
     */
    handleSearch() {
        const searchText = DOM.getElement('searchInput').value;
        this.zoomToText(searchText);
    },
    
    /**
     * Zoom to text element with specific content
     * @param {string} text - Text to find and zoom to
     */
    zoomToText(text) {
        if (!svgElement) return;
        
        this.scale = 1;
        this.setTransform();
        
        const transformedCenter = SVGUtils.findCoordinates(text);
        if (!transformedCenter) {
            console.warn('Element not found:', text);
            return;
        }
        
        console.log('Zooming to:', transformedCenter.x, transformedCenter.y);
        
        this.pointX = -transformedCenter.x * this.scale + this.mapContainer.clientWidth / 2;
        this.pointY = -transformedCenter.y * this.scale + this.mapContainer.clientHeight / 2;
        this.setTransform();
    },
    
    /**
     * Apply transform to SVG element
     */
    setTransform() {
        if (svgElement) {
            svgElement.style.transform = `translate(${this.pointX}px, ${this.pointY}px) scale(${this.scale})`;
            CharacterController.updateTransformCharacters();
        }
    },
    
    /**
     * Load map from URL
     * @param {string} url - URL of the SVG map file
     * @returns {Promise} - Promise that resolves when the map is loaded
     */
    async loadMapFromURL(url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.svgContainer.innerHTML = event.target.result;
                    svgElement = this.svgContainer.querySelector('svg');
                    this.adjustContainerToSVG();
                    resolve();
                };
                reader.onerror = reject;
                reader.readAsText(blob);
            });
        } catch (error) {
            console.error('Error loading map:', error);
            throw error;
        }
    },
    
    /**
     * Adjust container to SVG size and restore characters
     */
    adjustContainerToSVG() {
        if (svgElement) {
            // Store existing characters
            const existingCharacters = svgElement.querySelectorAll('.character');
            existingCharacters.forEach(char => {
                const image = char.querySelector('image');
                if (image) {
                    const x = image.getAttribute('x');
                    const y = image.getAttribute('y');
                    const href = image.getAttribute('href');
                    characters.set(char.id, { x, y, href });
                }
            });
            
            const bbox = svgElement.getBBox();
            this.svgContainer.style.width = `${bbox.width}px`;
            this.svgContainer.style.height = `${bbox.height}px`;
            this.svgContainer.style.overflow = 'visible';
            
            this.pointX = 0;
            this.pointY = 0;
            this.scale = 1;
            this.setTransform();
            
            LayerController.setupLayers();
            
            // Restore characters
            characters.forEach((data, id) => {
                if (typeof data === 'object' && data.href) {
                    CharacterController.addCharacterToMap(data.href, { x: data.x, y: data.y });
                }
            });
        }
    }
};
