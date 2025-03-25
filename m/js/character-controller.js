/**
 * Character Controller Module
 * Handles character creation, movement, and interactions
 */
const CharacterController = {
    // Character tracking
    characters: new Map(),
    selectedCharacters: new Map(),
    personajes: new Map(),
    characterRoutes: new Map(),
    draggedCharacter: null,
    activeCharacter: null,
    rastro: true,

    /**
     * Initialize the tooltip for distance display
     */
    initTooltip() {
        this.tooltip = document.createElement('div');
        this.tooltip.style.cssText = "position: fixed; display: none; background: rgba(0,0,0,0.8); color: white; padding: 5px; border-radius: 3px; z-index: 1100; font-size: 12px;";
        document.body.appendChild(this.tooltip);
    },

    /**
     * Add character to the map
     * @param {string} imageUrl - URL of the character image
     * @param {Object|string} position - Position or URL for character
     * @returns {SVGElement} - The created character element
     */
    addCharacterToMap(imageUrl, position) {
        if (!svgElement) return;
        console.log('Adding character to map', { imageUrl, position });
        // Create character group
        const charGroup = DOM.createSVGElement("g", { 'class': 'character' });

        // Extract name from URL
        const fileName = typeof position === 'string' ?
            position.split('/').pop() :
            imageUrl.split('/').pop();
        let baseName = fileName.substring(0, fileName.lastIndexOf('.'))
            .replace(/%20/g, '_')
            .replace(/[^a-zA-Z0-9]/g, '_');

        let number = 1;
        while (this.characters.has(`${baseName}`)) {
            console.log('Name already exists, incrementing', { baseName, number });
            number++;
            const match = baseName.match(/\d+$/);
            if (match) {
                number = parseInt(match[0], 10) + 1;
                baseName = baseName.substring(0, baseName.length - match[0].length);
                baseName += number;
                console.log('New name', { baseName, number });
            }
        }


        charGroup.id = baseName;

        // Create character image
        const image = DOM.createSVGElement("image", {
            'href': imageUrl,
            'data-name': baseName,
            'width': CONFIG.iconSize / MapController.scale,
            'height': CONFIG.iconSize / MapController.scale,
            'preserveAspectRatio': 'xMidYMid meet'
        });

        // Position the character
        let x, y;
        if (typeof position === 'object' && position.x && position.y) {
            x = parseFloat(position.x);
            y = parseFloat(position.y);
        } else {
            const point = SVGUtils.getPointInSVG(window.innerWidth / 2, window.innerHeight / 2);
            x = point.x;
            y = point.y;
        }

        image.setAttribute('data-x', x);
        image.setAttribute('data-y', y);

        // Add title for hover information
        const titleElement = DOM.createSVGElement("title", {});
        titleElement.textContent = baseName;
        charGroup.insertBefore(titleElement, charGroup.firstChild);

        // Size and position with proper centering
        const size = CONFIG.iconSize / MapController.scale;
        image.setAttribute('x', x - size / 2);
        image.setAttribute('y', y - size / 2);

        // Add position cross reference (initially hidden)
        const crossGroup = this.createPositionCross();
        charGroup.appendChild(image);
        charGroup.appendChild(crossGroup);

        svgElement.appendChild(charGroup);

        // Set up event handlers
        this.setupCharacterDrag(charGroup);
        this.setupRotationHandlers(charGroup);
        this.setupContextMenu(charGroup);
        this.setupSelection(charGroup);

        // Store character reference
        this.characters.set(baseName, charGroup);
        return charGroup;
    },

    /**
     * Create position cross marker for dragging
     * @returns {SVGElement} - The created cross element
     */
    createPositionCross() {
        const crossGroup = DOM.createSVGElement("g", { 'class': 'position-cross' });
        crossGroup.style.display = 'none';

        // Horizontal line
        const hLine = DOM.createSVGElement("line", {
            'stroke': 'white',
            'stroke-width': '1'
        });

        // Vertical line
        const vLine = DOM.createSVGElement("line", {
            'stroke': 'white',
            'stroke-width': '1'
        });

        crossGroup.appendChild(hLine);
        crossGroup.appendChild(vLine);

        return crossGroup;
    },

    /**
     * Update position cross during character drag
     * @param {SVGElement} crossEl - The cross element
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     */
    updateCross(crossEl, x, y) {
        if (!crossEl) return;

        const [hLine, vLine] = crossEl.children;
        const halfCross = (CONFIG.iconSize / 2) / MapController.scale;

        hLine.setAttribute('x1', x - halfCross);
        hLine.setAttribute('x2', x + halfCross);
        hLine.setAttribute('y1', y);
        hLine.setAttribute('y2', y);

        vLine.setAttribute('x1', x);
        vLine.setAttribute('x2', x);
        vLine.setAttribute('y1', y - halfCross);
        vLine.setAttribute('y2', y + halfCross);

        const strokeWidth = 2 / MapController.scale;
        hLine.setAttribute('stroke-width', strokeWidth);
        vLine.setAttribute('stroke-width', strokeWidth);
    },

    rotateCharacters(charElement, newRotation) {
        if (this.selectedCharacters.size > 0) {
            this.selectedCharacters.forEach((char) => {
                if (char == charElement) return;
                CharacterUtils.rotate(char.querySelector('image'),
                 newRotation);
                 if (SyncController.isOnline) {
                    SyncController.saveMapState(char);
                }

            });
        }
        let img = charElement.querySelector('image');
        CharacterUtils.rotate(img, newRotation);

        if (SyncController.isOnline) {
            SyncController.saveMapState(charElement);
        }
    },

    /**
     * Move character to position
     * @param {SVGImageElement} image - Character image element
     * @param {number|Object} newX - X coordinate or position object
     * @param {number} newY - Y coordinate (if newX is not an object)
     */
    moveCharacter(image, newX, newY) {
        let x, y;

        // Handle both coordinate formats
        ({ x, y } = newX.x !== undefined && newX.y !== undefined ?
            { x: newX.x, y: newX.y } :
            { x: newX, y: newY });

        // Store coordinates
        image.setAttribute('data-x', x);
        image.setAttribute('data-y', y);

        // Set position considering icon size
        const size = parseFloat(image.getAttribute('width'));
        image.setAttribute('x', x - size / 2);
        image.setAttribute('y', y - size / 2);
    },

    /**
     * Move character by name to a location
     * @param {string} personaje - Character name
     * @param {string|Object} lugar - Target location name or coordinates
     */
    moveCharacterToLocation(personaje, lugar) {
        let coords = typeof lugar === 'string' ?
            SVGUtils.findCoordinates(lugar) :
            lugar;

        let img = this.getCharacterImage(personaje);

        // Only move if valid target and character
        if (!coords || !img) return;

        this.moveCharacter(img, coords);

        // Save state if online
        if (SyncController.isOnline) {
            SyncController.saveMapState(this.characters.get(personaje));
        }
    },

    /**
     * Get character position
     * @param {string} personaje - Character name
     * @returns {Object} - Character position {x, y}
     */
    getCharacterLocation(personaje) {
        const img = this.getCharacterImage(personaje);
        if (!img) return null;

        const x = img.getAttribute('data-x');
        const y = img.getAttribute('data-y');
        return { x: parseFloat(x), y: parseFloat(y) };
    },

    /**
     * Get character screen position
     * @param {string} personaje - Character name
     * @returns {Object} - Character screen position {x, y}
     */
    getCharacterScreenLocation(personaje) {
        const img = this.getCharacterImage(personaje);
        if (!img) return null;

        const x = img.getAttribute('x');
        const y = img.getAttribute('y');
        return { x: parseFloat(x), y: parseFloat(y) };
    },

    /**
     * Find nearest location name to a character
     * @param {string} personaje - Character name
     * @returns {string|null} - Name of nearest location
     */
    findNearestLocation(personaje) {
        const loc = this.getCharacterLocation(personaje);
        if (!loc || !svgElement) return null;

        return SVGUtils.findNearestText(loc);
    },

    /**
     * Get character image element by name
     * @param {string} personaje - Character name
     * @returns {SVGImageElement|null} - Character image element
     */
    getCharacterImage(personaje) {
        return this.characters.get(personaje)?.querySelector('image') || null;
    },

    /**
     * Update characters' transform on zoom
     */
    updateTransformCharacters() {
        if (!svgElement) return;

        const characterEls = svgElement.querySelectorAll('.character image');
        characterEls.forEach(char => {
            const size = CONFIG.iconSize / MapController.scale;
            char.setAttribute('width', size);
            char.setAttribute('height', size);

            const x = parseFloat(char.getAttribute('data-x') || char.getAttribute('x'));
            const y = parseFloat(char.getAttribute('data-y') || char.getAttribute('y'));

            char.setAttribute('x', x - size / 2);
            char.setAttribute('y', y - size / 2);
        });
    },

    /**
     * Update character route during movement
     * @param {SVGElement} charElement - Character element
     * @param {number} newX - X coordinate
     * @param {number} newY - Y coordinate
     */
    updateCharacterRoute(charElement, newX, newY) {
        let route = this.characterRoutes.get(charElement) || [];

        if (route.length === 0) {
            route.push({ x: newX, y: newY });
        } else {
            const lastPoint = route[route.length - 1];
            const dx = newX - lastPoint.x, dy = newY - lastPoint.y;

            // Add point only if moved enough
            if (Math.sqrt(dx * dx + dy * dy) >= CONFIG.moveThreshold) {
                route.push({ x: newX, y: newY });
            }
        }

        this.characterRoutes.set(charElement, route);

        // Calculate total distance
        let totalDistance = 0;
        for (let i = 1; i < route.length; i++) {
            const dx = route[i].x - route[i - 1].x;
            const dy = route[i].y - route[i - 1].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        // Display distance tooltip
        const bbox = charElement.getBoundingClientRect();
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${bbox.right + 10}px`;
        this.tooltip.style.top = `${bbox.top + 10}px`;
        this.tooltip.innerText = `Dist: ${totalDistance.toFixed(2)}`;

        clearTimeout(this.tooltip.hideTimeout);
        this.tooltip.hideTimeout = setTimeout(() => {
            this.tooltip.style.display = 'none';
        }, CONFIG.tooltipDisplayTime);
    },

    /**
     * Setup selection handling for a character
     * @param {SVGElement} charElement - Character element
     */
    setupSelection(charElement) {

        const toggleSelection = (charElement) => {
            const id = charElement.getAttribute('id');
            if (this.selectedCharacters.has(id)) {
                this.selectedCharacters.delete(id);
                charElement.classList.remove('selected');
            } else {
                this.selectedCharacters.set(id, charElement);
                charElement.classList.add('selected');
            }
        };

        // Touch event handlers for selection
        charElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.stopPropagation();
                
                const id = charElement.getAttribute('id');

                console.log('Touch start', { id, selected: this.selectedCharacters.has(id) });

                if (e.touches.length === 1 && e.touches[0].force > 0.5) {
                    // Long press / force touch for multi-select             
                    toggleSelection(charElement);
                    console.log('Long press:'+ e.touches[0].force);
                    
                } else {
                    // Single tap for single selection
                    toggleSelection(charElement);
                }
            }
        });
        // Handle click events for selection
        charElement.addEventListener('click', (e) => {
            e.stopPropagation();
         
            const id = charElement.getAttribute('id');
            // if (this.isDragging) return;
            console.log('Click', { id, selected: this.selectedCharacters.has(id) });

            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                // Toggle selection with Ctrl/Cmd key
                toggleSelection(charElement);
            } else {
                // Single selection without Ctrl/Cmd
                // toggleSelection(charElement);
            }
        });

        // Clear selection when clicking outside
        document.addEventListener('click', (e) => {
            // Ignorar si estamos acabando de arrastrar
            if (!e.target.closest('.character') && !this.draggedCharacter) {
                this.selectedCharacters.forEach((char) => {
                    char.classList.remove('selected');
                });
                this.selectedCharacters.clear();
            }
        });

    }
    ,

    /**
     * Setup character drag behavior
     * @param {SVGElement} charElement - Character element
     */
    setupCharacterDrag(charElement) {
        let startX, startY, originalPos;
        let isDragging = false;
        let hasStartedDrag = false;
        let wasSelected = false;

        const image = () => charElement.querySelector('image');
        const cross = () => charElement.querySelector('.position-cross');

        // Store original positions of all selected characters
        let selectedOriginalPos = new Map();

        const startDragging = e => {
            if(this.selectedCharacters.has(charElement.getAttribute('id'))){
                wasSelected = charElement.getAttribute('id');
            }
            if (e.button === 2) return;
            e.stopPropagation();

            const evt = e.touches ? e.touches[0] : e;
            const point = SVGUtils.getPointInSVG(evt.clientX, evt.clientY);
            if (!point) return;

            startX = point.x;
            startY = point.y;
            isDragging = true;
            hasStartedDrag = false;

            // Store original position of dragged character
            originalPos = {
                x: parseFloat(image().getAttribute('data-x')) ||
                    (parseFloat(image().getAttribute('x')) + parseFloat(image().getAttribute('width')) / 2),
                y: parseFloat(image().getAttribute('data-y')) ||
                    (parseFloat(image().getAttribute('y')) + parseFloat(image().getAttribute('height')) / 2)
            };

            // Store original positions of all selected characters
            selectedOriginalPos.clear();
            this.selectedCharacters.forEach((char) => {
                const img = char.querySelector('image');
                selectedOriginalPos.set(char, {
                    x: parseFloat(img.getAttribute('data-x')) ||
                        (parseFloat(img.getAttribute('x')) + parseFloat(img.getAttribute('width')) / 2),
                    y: parseFloat(img.getAttribute('data-y')) ||
                        (parseFloat(img.getAttribute('y')) + parseFloat(img.getAttribute('height')) / 2)
                });
            });

            document.addEventListener('mousemove', drag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('mouseup', stopDragging);
            document.addEventListener('touchend', stopDragging);
        };

        const drag = e => {
            if (!isDragging) return;
            e.preventDefault();

            const evt = e.touches ? e.touches[0] : e;
            const point = SVGUtils.getPointInSVG(evt.clientX, evt.clientY);
            if (!point) return;

            const dx = point.x - startX;
            const dy = point.y - startY;

            // Only start real dragging if movement exceeds threshold
            if (!hasStartedDrag) {
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < CONFIG.dragThreshold) return;

                hasStartedDrag = true;
                this.draggedCharacter = charElement;
                cross().style.display = 'block';
                image().style.opacity = '0.5';
                this.characterRoutes.set(charElement, [{ x: originalPos.x, y: originalPos.y }]);

                // Initialize routes for selected characters
                this.selectedCharacters.forEach((char) => {
                    if (char !== charElement) {
                        const origPos = selectedOriginalPos.get(char);
                        this.characterRoutes.set(char, [{ x: origPos.x, y: origPos.y }]);
                        char.querySelector('image').style.opacity = '0.5';
                    }
                });
            }

            if (hasStartedDrag) {
                // Move the dragged character
                const newX = originalPos.x + dx;
                const newY = originalPos.y + dy;

                this.moveCharacter(image(), newX, newY);
                this.updateCross(cross(), newX, newY);
                this.updateCharacterRoute(charElement, newX, newY);

                // Move all selected characters
                this.selectedCharacters.forEach((char) => {
                    if (char !== charElement) {
                        const origPos = selectedOriginalPos.get(char);
                        const newSelectedX = origPos.x + dx;
                        const newSelectedY = origPos.y + dy;

                        this.moveCharacter(char.querySelector('image'), newSelectedX, newSelectedY);
                        this.updateCharacterRoute(char, newSelectedX, newSelectedY);
                    }
                });

                if (SyncController.isOnline) {
                    SyncController.saveMapState(this.draggedCharacter);
                    this.selectedCharacters.forEach((char) => {
                        if (char !== charElement) {
                            SyncController.saveMapState(char);
                        }
                    });
                }
            }
        };

        const stopDragging = e => {
            if (!isDragging) return;
            isDragging = false;

            if (hasStartedDrag) {
                image().style.opacity = '1';
                cross().style.display = 'none';

                // Restore opacity for selected characters
                this.selectedCharacters.forEach((char) => {
                    if (char !== charElement) {
                        char.querySelector('image').style.opacity = '1';
                    }
                });

                if (this.rastro) {
                    // Draw paths for all moved characters
                    const drawPath = (char) => {
                        const ruta = this.characterRoutes.get(char);
                        if (ruta && ruta.length >= 2) {
                            try {
                                const path = SVGUtils.generateSmoothPath(ruta);
                                let pathElem = char.querySelector('.character-route');

                                if (!pathElem) {
                                    pathElem = DOM.createSVGElement("path", {
                                        'class': 'character-route',
                                        'fill': 'none',
                                        'stroke': 'red',
                                        'stroke-width': 0.5,
                                        'stroke-dasharray': '1 1'
                                    });
                                    pathElem.classList.add(`${char.id}-route`);
                                    svgElement.appendChild(pathElem);
                                }

                                pathElem.setAttribute('d', path);
                            } catch (error) {
                                console.error('Error creating path:', error);
                            }
                        }
                    };

                    drawPath(charElement);
                    this.selectedCharacters.forEach((char) => {
                        if (char !== charElement) {
                            drawPath(char);
                        }
                    });
                }
                //si estaba seleccionado antes de empezar a arrastar lo volvemos a seleccionar, porque el click largo lo ha deseleccionado
                if(wasSelected && wasSelected == charElement.getAttribute('id')){
                    console.log('wasSelected', wasSelected);
                    
                    this.selectedCharacters.set(wasSelected, charElement);
                    charElement.classList.add('selected');
                    wasSelected = false;
                }
            } else {
                this.activeCharacter = charElement;
            }


            this.draggedCharacter = null;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('touchend', stopDragging);
        };

        charElement.addEventListener('mousedown', startDragging);
        charElement.addEventListener('touchstart', startDragging);
    },

    /**
     * Setup rotation handlers for a character
     * @param {SVGElement} charElement - Character element
     */
    setupRotationHandlers(charElement) {
        // Set up mouse wheel with shift key for rotation
        charElement.addEventListener('wheel', (e) => {
            if (e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();
                let img = charElement.querySelector('image');
                let currentRotation = parseFloat(img.getAttribute('data-rotation')) || 0;
                let delta = e.deltaY > 0 ? 15 : -15;
                let newRotation = (currentRotation + delta) % 360;

                this.rotateCharacters(charElement, newRotation);
            }
        });

        // Touch rotation variables
        let startAngle = null;
        let startRotation = 0;

        // Calculate angle between two touch points
        const getAngle = (touch1, touch2) => {
            return Math.atan2(
                touch2.clientY - touch1.clientY,
                touch2.clientX - touch1.clientX
            ) * 180 / Math.PI;
        };

        // Touch rotation start
        charElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                MapController.panning = false;
                e.preventDefault();

                let img = charElement.querySelector('image');
                startRotation = parseFloat(img.getAttribute('data-rotation')) || 0;
                startAngle = getAngle(e.touches[0], e.touches[1]);
            }
        });

        // Touch rotation move
        charElement.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2 && startAngle !== null) {
                MapController.panning = false;
                e.preventDefault();
                e.stopPropagation();

                let currentAngle = getAngle(e.touches[0], e.touches[1]);
                let angleDelta = currentAngle - startAngle;

                let newRotation = (startRotation + angleDelta) % 360;
                if (newRotation < 0) newRotation += 360;
                this.rotateCharacters(charElement, newRotation);
            }
        });

        // Touch rotation end
        charElement.addEventListener('touchend', (e) => {
            if (startAngle !== null && e.touches.length < 2) {
                startAngle = null;

                // if (SyncController.isOnline) {
                //     if (this.selectedCharacters.size > 0) {
                //         this.selectedCharacters.forEach((char) => {
                //             if (char == charElement) return;
                //             SyncController.saveMapState(char);
                //         });
                //         SyncController.saveMapState(charElement);
                //     }
                // }
            }
        });

        // Touch cancel
        charElement.addEventListener('touchcancel', () => {
            startAngle = null;
        });
    },

    /**
     * Setup context menu for a character
     * @param {SVGElement} charElement - Character element
     */
    setupContextMenu(charElement) {
        charElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();

            this.activeCharacter = charElement;
            const contextMenu = DOM.getElement('characterContextMenu');
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;

            // Update toggle path text
            const togglePathItem = DOM.getElement('togglePath');
            togglePathItem.textContent = this.rastro ? 'Ocultar camino' : 'Mostrar camino';
        });
    },

    /**
     * Toggle path visibility
     */
    togglePath() {
        this.rastro = !this.rastro;
        svgElement.querySelectorAll('.character-route').forEach(el => {
            el.style.display = this.rastro ? 'block' : 'none';
        });

        // Update toggle path text
        const togglePathItem = DOM.getElement('togglePath');
        togglePathItem.textContent = this.rastro ? 'Ocultar camino' : 'Mostrar camino';
    },

    /**
     * Delete the route for the active character
     */
    deleteRoute() {
        if (!this.activeCharacter) return;
        if (this.selectedCharacters.size > 0) {
            this.selectedCharacters.forEach((char) => {
                svgElement.querySelectorAll(`.${char.id}-route`).forEach(el => {
                    el.remove();
                });
            });
        } else
            svgElement.querySelectorAll(`.${this.activeCharacter.id}-route`).forEach(el => {
                el.remove();
            });
    },

    /**
     * Delete the active character
     */
    deleteCharacter() {
        if (!this.activeCharacter) return;
        if (this.selectedCharacters.size > 0) {
            this.selectedCharacters.forEach((char) => {
                this.borrarP(char);
            });
        } else
            this.borrarP(this.activeCharacter);

    }
    ,
    borrarP(char) {
        if (!char) return;

        const id = char.getAttribute('id');
        // Clean up
        this.characterRoutes.delete(char);
        svgElement.querySelectorAll(`.${id}-route`).forEach(el => {
            el.remove();
        });

        char.remove();
        this.characters.delete(id);
        this.activeCharacter = null;
    }
};

/**
 * Character utility functions
 */
const CharacterUtils = {
    /**
     * Rotate a character image
     * @param {SVGImageElement|SVGElement} img - Character image or element
     * @param {number} angle - Rotation angle in degrees
     */
    rotate(img, angle) {
        if (!img) return;

        // If passed the character group instead of the image
        if (img.tagName === 'g') {
            img = img.querySelector('image');
            if (!img) return;
        }

        img.style.transformBox = 'fill-box';
        img.style.transformOrigin = 'center';
        img.setAttribute('data-rotation', angle);
        img.style.transform = `rotate(${angle}deg)`;
    }
};
