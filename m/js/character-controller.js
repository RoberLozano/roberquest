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
    // Mapa para almacenar las posiciones originales para cancelar movimientos
    originalPositions: new Map(),
    // Control de confirmación automática de movimientos
    autoConfirmMove: false,
    travelTime: 0,
    // Añadir a las propiedades existentes
    attackMode: false,
    attackingCharacter: null,

    /**
     * Initialize the character controller
     */
    init() {
        // Inicializar tooltip
        this.tooltip = document.createElement('div');
        this.tooltip.style.cssText = "position: fixed; display: none; background: rgba(0,0,0,0.8); color: white; padding: 5px; border-radius: 3px; z-index: 1100; font-size: 12px;";
        document.body.appendChild(this.tooltip);

        // Inicializar controladores para los botones de confirmación
        this.initMoveConfirmation();

        // Inicializar controlador para el checkbox de auto-confirmación
        this.initAutoConfirmMove();
    },

    /**
     * Initialize auto-confirm move checkbox
     */
    initAutoConfirmMove() {
        const autoConfirmCheckbox = document.getElementById('autoConfirmMove');

        // Establecer estado inicial
        autoConfirmCheckbox.checked = this.autoConfirmMove;

        // Añadir event listener para actualizar el estado
        autoConfirmCheckbox.addEventListener('change', () => {
            this.autoConfirmMove = autoConfirmCheckbox.checked;
            console.log(`Auto-confirmación de movimientos: ${this.autoConfirmMove ? 'Activada' : 'Desactivada'}`);
        });
    },

    /**
     * Initialize move confirmation buttons
     */
    initMoveConfirmation() {
        const confirmButton = document.getElementById('confirmMove');
        const timeButton = document.getElementById('confirmTime');
        const cancelButton = document.getElementById('cancelMove');
        const confirmationDiv = document.getElementById('moveConfirmation');

        // Confirmar movimiento
        confirmButton.addEventListener('click', () => {
            confirmationDiv.style.display = 'none';
            this.originalPositions.clear();

            // Si estamos online, guardar el estado
            if (SyncController.isOnline)
                this.saveDraggedCharactersState();

        });
        timeButton.addEventListener('click', () => {
            fechaMundo = fechaMundo.mod('hora', this.travelTime);
            fecha.value = fechaMundo.fechahora();
        });

        // Cancelar movimiento
        cancelButton.addEventListener('click', () => {
            this.undoCharacterMovement();
            confirmationDiv.style.display = 'none';
        });
    },

    /**
     * Save state of all dragged characters to Firebase
     */
    saveDraggedCharactersState() {
        if (!SyncController.isOnline) return;

        if (this.draggedCharacter) {
            SyncController.saveMapState(this.draggedCharacter);
        }

        this.selectedCharacters.forEach((char) => {
            if (char !== this.draggedCharacter) {
                SyncController.saveMapState(char);
            }
        });
    },

    /**
     * Undo character movement by restoring original positions
     */
    undoCharacterMovement() {
        this.originalPositions.forEach((originalPos, charElement) => {
            const img = charElement.querySelector('image');
            this.moveCharacter(img, originalPos.x, originalPos.y);

            // En lugar de eliminar el rastro completo, solo eliminamos la última ruta añadida
            // Esto mantiene el historial de rutas anteriores
            let caminos = svgElement.querySelectorAll('.character-route');
            console.log(caminos);
            let ultimoCamino = caminos[caminos.length - 1];
            if (ultimoCamino) ultimoCamino.remove();
        });

        this.originalPositions.clear();
    },

    // /**
    //  * Set the distance scale factor
    //  * @param {number} value - The scale value in meters per unit
    //  */
    // setDistanceScale(value) {
    //     console.log('setDISTANCE1');

    //     const scaleFactor = parseFloat(value);
    //     if (isNaN(scaleFactor) || scaleFactor <= 0) return;

    //     CONFIG.distanceScaleFactor = scaleFactor;
    //     console.log(`Escala establecida: ${scaleFactor} metros por unidad`);

    //     // Cerrar el menú contextual
    //     document.getElementById('mapContextMenu').style.display = 'none';
    // },

    /**
     * Selecciona el personaje
     * @param {*} charElement Elemento del personaje
     * @returns {void}
     */
    select(charElement) {
        const id = charElement.getAttribute('id');
        if (this.selectedCharacters.has(id)) {
            return;
        } else {
            this.selectedCharacters.set(id, charElement);
            charElement.classList.add('selected');
        }
        this.drawSelectionCircle(charElement.querySelector('image'));
    },

    selectAll() {
        this.characters.forEach((char) => {
            if (char.classList.contains('selected')) return;
            this.select(char);
        });
    },
    deselectAll() {
        this.selectedCharacters.forEach((char) => {
            // Eliminar el círculo de selección

            char.classList.remove('selected');
            this.drawSelectionCircle(char.querySelector('image'));
        });
        this.selectedCharacters.clear();

    },

    toggleSelection(charElement) {
        const id = charElement.getAttribute('id');
        if (this.selectedCharacters.has(id)) {
            this.selectedCharacters.delete(id);
            charElement.classList.remove('selected');
        } else {
            this.selectedCharacters.set(id, charElement);
            charElement.classList.add('selected');
        }
        this.drawSelectionCircle(charElement.querySelector('image'));
    },

    showStats(campo) {
        if (!this.activeCharacter) return;
        let personaje = this.activeCharacter.nombre;
        let pe = this.personajes.get(personaje);
        // document.getElementById('infoTitle').innerHTML = personaje;
        document.getElementById('infoTitle').innerHTML =
            `<h2 ><a href="../vue.html?pj=${pe.nombre}" target="_blank">${pe.nombre}</a> <FONT SIZE=4> ${pe.clase} ${pe.sexo}</FONT></h2> `;
        var ic;
        let info = document.getElementById('infoContent');
        info.innerHTML = '';
        if (!campo) {
            ic = new InputCustom(pe, null, true);
        }
        else {
            ic = new InputCustom(pe[campo], null, false);
        }
        info.appendChild(ic);
        const infoModal = document.getElementById('infoModal');
        infoModal.style.display = 'block';
    },

    /**
     * Set the speed for a character (km/h)
     * @param {number} speed - Speed in km/h
     */
    setCharacterSpeed(speed) {
        if (!this.activeCharacter) return;

        // Convert to number and validate
        speed = parseFloat(speed);
        if (isNaN(speed) || speed <= 0) speed = CONFIG.defaultSpeed;

        // Update DOM
        document.getElementById('speedValue').value = speed;

        // Update for selected characters or active character
        if (this.selectedCharacters.size > 0) {
            this.selectedCharacters.forEach((char) => {
                char.setAttribute('data-speed', speed);
            });
        } else {
            this.activeCharacter.setAttribute('data-speed', speed);
        }

        // Update CONFIG default for new characters
        CONFIG.defaultSpeed = speed;
    },

    /**
     * Set the distance scale factor (meters per map unit)
     * @param {number} scale - Scale factor in meters per map unit
     */
    setDistanceScale(scale) {
        // Convert to number and validate
        scale = parseFloat(scale);
        if (isNaN(scale) || scale <= 0) scale = 1;

        // Update DOM
        document.getElementById('mapScaleValue').value = scale;

        // Update CONFIG
        CONFIG.distanceScaleFactor = scale;

        // Refresh all routes to update distances
        //esto HACE ALGO DE VERDAD??
        this.characterRoutes.forEach((route, charElement) => {
            if (route.length > 1) {
                this.updateDistanceDisplay(charElement);
            }
        });
    },

    /**
     * Update distance display for a character's route
     * @param {SVGElement} charElement - Character element
     */
    updateDistanceDisplay(charElement) {
        if (!charElement) return;

        const route = this.characterRoutes.get(charElement) || [];
        if (route.length <= 1) return;

        // Calculate total distance
        let totalDistance = 0;
        for (let i = 1; i < route.length; i++) {
            const dx = route[i].x - route[i - 1].x;
            const dy = route[i].y - route[i - 1].y;
            totalDistance += Math.sqrt(dx * dx + dy * dy);
        }

        // Apply scale factor
        const scaledDistance = totalDistance * CONFIG.distanceScaleFactor;

        // Get character speed (km/h)
        const speed = parseFloat(charElement.getAttribute('data-speed')) || CONFIG.defaultSpeed;

        // Calculate time (h) = distance (m) / (speed (km/h) * 1000 (m/km))
        const timeHours = scaledDistance / (speed * 1000);
        this.travelTime = timeHours;

        // Format time in hours, minutes, seconds
        let timeString = '';
        if (timeHours >= 1) {
            timeString = Math.floor(timeHours) + 'h ';
        }

        const minutes = Math.floor((timeHours % 1) * 60);
        if (minutes > 0 || timeHours >= 1) {
            timeString += minutes + 'min ';
        }

        const seconds = Math.floor(((timeHours % 1) * 60 % 1) * 60);
        timeString += seconds + 's';

        // Display distance and time in tooltip
        const bbox = charElement.getBoundingClientRect();
        this.tooltip.style.display = 'block';
        this.tooltip.style.left = `${bbox.right + 10}px`;
        this.tooltip.style.top = `${bbox.top + 10}px`;

        // Format distance in m or km
        let distanceText = '';
        if (scaledDistance >= 1000) {
            distanceText = `${(scaledDistance / 1000).toFixed(2)} km`;
        } else {
            distanceText = `${scaledDistance.toFixed(1)} m`;
        }

        this.tooltip.innerHTML = `Dist: ${distanceText}<br>Tiempo: ${timeString}`;

        clearTimeout(this.tooltip.hideTimeout);
        this.tooltip.hideTimeout = setTimeout(() => {
            this.tooltip.style.display = 'none';
        }, CONFIG.tooltipDisplayTime);
    },

    /**
     * Add character to the map
     * @param {string} imageUrl - URL of the character image
     * @param {Object|string} position - Position or URL for character
     * @returns {SVGElement} - The created character element
     */
    addCharacterToMap(imageUrl, position) {
        if (!svgElement) return;
        // console.log('Adding character to map', { imageUrl, position });
        // Create character group
        const charGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        charGroup.setAttribute('class', 'character');

        //from url to normal text
         imageUrl = decodeURI(imageUrl);


        // Extract name from URL
        const fileName = typeof position === 'string' ?
            position.split('/').pop() :
            imageUrl.split('/').pop();
        console.log('Extracted name', { fileName });
        let nombre = fileName.substring(0, fileName.lastIndexOf('.')).replace(/%20/g, ' ');
       
        let baseName = fileName.substring(0, fileName.lastIndexOf('.'))
            .replace(/%20/g, '_').replaceAll(' ', '_')
            // .replace(/[^a-zA-Z0-9]/g, '_');
        console.log(baseName);


        let number = 1;
        while (this.characters.has(`${baseName}`)) {
            // console.log('Name already exists, incrementing', { baseName, number });
            number++;
            const match = baseName.match(/\d+$/);
            if (match) {
                number = parseInt(match[0], 10) + 1;
                baseName = baseName.substring(0, baseName.length - match[0].length);
                baseName += number;
                // console.log('New name', { baseName, number });
            }
            
        }
        if(number>1) nombre= baseName.replaceAll('_',' ');


        charGroup.id = baseName;
        charGroup.nombre=nombre;

        // Set default speed
        charGroup.setAttribute('data-speed', CONFIG.defaultSpeed);

        // Create character image
        const image = document.createElementNS("http://www.w3.org/2000/svg", "image");
        image.setAttribute('href', imageUrl);
        image.setAttribute('data-name', nombre);
        image.setAttribute('width', CONFIG.iconSize / MapController.scale);
        image.setAttribute('height', CONFIG.iconSize / MapController.scale);
        image.setAttribute('preserveAspectRatio', 'xMidYMid meet');

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
        const titleElement = document.createElementNS("http://www.w3.org/2000/svg", "title");
        titleElement.textContent = nombre;
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
        this.characters.set(nombre, charGroup);

        if (SyncController.isOnline) {
            console.log('cargo desde crear personaje:' + nombre);
            SyncController.cargarPersonaje(nombre);
        }

        //TODO: crear personaje si no existe
        let charCreado= new Humano();
        charCreado.sexo='♂'
        charCreado.nombre=nombre;
        charCreado.act();
        charCreado.setMaxPuntos();
        generadoresArmas.forEach((arma,nombreArma) => {
   
           if(nombre.toLowerCase().includes(nombreArma.toLowerCase())){
               console.log(nombreArma);
               let arma=generadoresArmas.get(nombreArma).generar();
               console.log(arma);         
               charCreado.inventario.add(arma);
               if (nombre.toLowerCase().includes('doble'))
                charCreado.inventario.add(generadoresArmas.get(nombreArma).generar());
           }
        //    console.log(nombreArma);
    
        });  
            

        this.personajes.set(nombre, charCreado);
        return charGroup;
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

        // Use updated method to display distance and time
        this.updateDistanceDisplay(charElement);
    },

    /**
     * Setup selection handling for a character
     * @param {SVGElement} charElement - Character element
     */
    setupSelection(charElement) {


        // Touch event handlers for selection
        charElement.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                e.stopPropagation();

                const id = charElement.getAttribute('id');

                console.log('Touch start', { id, selected: this.selectedCharacters.has(id) });

                if (e.touches.length === 1 && e.touches[0].force > 0.5) {
                    // Long press / force touch for multi-select             
                    this.toggleSelection(charElement);
                    console.log('Long press:' + e.touches[0].force);

                } else {
                    // Single tap for single selection
                    this.toggleSelection(charElement);
                }
            }
        });
        // Handle click events for selection
        charElement.addEventListener('click', (e) => {
            e.stopPropagation();

            // Check if we're in attack mode
            if (this.attackMode && this.attackingCharacter !== charElement) {
                this.performAttack(charElement);
                return;
            }

            const id = charElement.getAttribute('id');
            // if (this.isDragging) return;
            // console.log('Click', { id, selected: this.selectedCharacters.has(id) });

            if (e.ctrlKey || e.metaKey || e.shiftKey) {
                // Toggle selection with Ctrl/Cmd key
                this.toggleSelection(charElement);
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
                    this.drawSelectionCircle(char.querySelector('image'));
                });
                this.selectedCharacters.clear();
            }
        });

    },

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
            if (this.selectedCharacters.has(charElement.getAttribute('id'))) {
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

                // Guardar posición original para posible cancelación
                this.originalPositions.set(charElement, {
                    x: originalPos.x,
                    y: originalPos.y
                });

                // Initialize routes for selected characters
                this.selectedCharacters.forEach((char) => {
                    if (char !== charElement) {
                        const origPos = selectedOriginalPos.get(char);
                        this.characterRoutes.set(char, [{ x: origPos.x, y: origPos.y }]);
                        char.querySelector('image').style.opacity = '0.5';

                        // Guardar posición original para posible cancelación
                        this.originalPositions.set(char, {
                            x: origPos.x,
                            y: origPos.y
                        });
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
            }
        };

        const stopDragging = e => {
            if (!isDragging) return;
            isDragging = false;

            if (hasStartedDrag) {
                image().style.opacity = '1';
                // Ocultar cruz si no está configurada como visible
                CharacterUtils.portada(charElement);

                // Restore opacity for selected characters
                this.selectedCharacters.forEach((char) => {
                    if (char !== charElement) {
                        char.querySelector('image').style.opacity = '1';
                        // Ocultar cruz entera, con flecha, para caracteres seleccionados si no es portrait
                        CharacterUtils.portada(char);
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
                                    pathElem = document.createElementNS("http://www.w3.org/2000/svg", "path");
                                    pathElem.setAttribute('class', 'character-route');
                                    pathElem.setAttribute('fill', 'none');
                                    pathElem.setAttribute('stroke', 'red');
                                    // pathElem.setAttribute('stroke-width', 0.5);
                                    MapController.grosorCamino(3, pathElem)
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

                // Mostrar los botones de confirmación o confirmar automáticamente
                if (this.autoConfirmMove) {
                    // Si está activada la auto-confirmación, guardamos el estado directamente
                    this.originalPositions.clear();

                    // Si estamos online, guardar el estado
                    if (SyncController.isOnline) {
                        this.saveDraggedCharactersState();
                    }
                } else {
                    const confirmationDiv = document.getElementById('moveConfirmation');
                    const rect = charElement.getBoundingClientRect();
                    confirmationDiv.style.display = 'block';
                    confirmationDiv.style.left = `${rect.right - CONFIG.iconSize}px`;
                    confirmationDiv.style.top = `${rect.top - CONFIG.iconSize}px`;
                }

                //si estaba seleccionado antes de empezar a arrastar lo volvemos a seleccionar, porque el click largo lo ha deseleccionado
                if (wasSelected && wasSelected == charElement.getAttribute('id')) {
                    console.log('wasSelected', wasSelected);

                    this.selectedCharacters.set(wasSelected, charElement);
                    charElement.classList.add('selected');
                    this.drawSelectionCircle(charElement.querySelector('image'));
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
            const contextMenu = document.getElementById('characterContextMenu');
            contextMenu.style.display = 'block';
            contextMenu.style.left = `${e.pageX}px`;
            contextMenu.style.top = `${e.pageY}px`;

            // Update speed value
            const speedValue = document.getElementById('speedValue');
            speedValue.value = parseFloat(charElement.getAttribute('data-speed')) || CONFIG.defaultSpeed;
        });


        // Añadir handler para ataque
        document.getElementById('attackCharacter').addEventListener('click', () => {
            this.startAttackMode(this.activeCharacter);
            document.getElementById('characterContextMenu').style.display = 'none';
        });

        // Cerrar el menú contextual al hacer clic en cualquier parte fuera del menú
        document.addEventListener('click', (e) => {
            const contextMenu = document.getElementById('characterContextMenu');
            if (contextMenu.style.display === 'block' && !contextMenu.contains(e.target)) {
                contextMenu.style.display = 'none';
            }
        });

        // Prevenir que el menú se cierre al interactuar con inputs dentro del menú
        const contextMenu = document.getElementById('characterContextMenu');
        contextMenu.querySelectorAll('input').forEach(input => {
            input.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Añadir event listeners para cerrar el menú al hacer clic en opciones que no requieren inputs
        const closeOnClick = ['deleteRoute', 'deleteCharacter', 'showStats', 'inventario'];
        closeOnClick.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('click', () => {
                    contextMenu.style.display = 'none';
                });
            }
        });
    },

    startAttackMode(attacker) {
        this.attackMode = true;
        this.attackingCharacter = attacker;
        document.body.classList.add('attack-mode');

        // Añadir listener temporal para cancelar el ataque con clic derecho
        const cancelAttack = (e) => {
            if (e.button === 2) {
                this.cancelAttackMode();
                document.removeEventListener('mousedown', cancelAttack);
            }
        };
        document.addEventListener('mousedown', cancelAttack);
    },

    cancelAttackMode() {
        this.attackMode = false;
        this.attackingCharacter = null;
        document.body.classList.remove('attack-mode');
    },

    performAttack(targetCharacter) {
        if (!this.attackMode || !this.attackingCharacter) return;

        // Trigger attack animation
        targetCharacter.classList.add('attack-animation');

        // Obtener la posición del personaje atacado
        const img = targetCharacter.querySelector('image');
        const x = parseFloat(img.getAttribute('data-x'));
        const y = parseFloat(img.getAttribute('data-y'));

        // Crear efecto de onda (radio de 2 metros con degradado)
        MapController.createAreaEffect(x, y, 100 / MapController.scale, 0.7, true, 1000);

        setTimeout(() => {
            targetCharacter.classList.remove('attack-animation');
        }, 300);

        //TODO: La lógica del ataque
        console.log('Attack from', this.attackingCharacter.id, 'to', targetCharacter.id);
        alert('Attack from ' + this.attackingCharacter.id + ' to ' + targetCharacter.id);
        this.cancelAttackMode();
    },

    /**
     * Toggle path visibility
     */
    togglePath() {
        console.log('togglePath()');
        this.rastro = !this.rastro;
        svgElement.querySelectorAll('.character-route').forEach(el => {
            el.style.display = this.rastro ? 'block' : 'none';
        });

        // Update toggle path text in both menus
        const mapTogglePathItem = document.getElementById('mapTogglePath');
        if (mapTogglePathItem) {
            mapTogglePathItem.textContent = this.rastro ? 'Ocultar camino' : 'Mostrar camino';
        }
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
    /**
     * Borrar un personaje del mapa
     * @param {SVGElement} char - Personaje a eliminar
     */
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
    },

    /**
     * Create position cross marker for dragging
     * @returns {SVGElement} - The created cross element
     */
    createPositionCross() {
        const crossGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        crossGroup.setAttribute('class', 'position-cross');
        crossGroup.style.display = 'block';

        // Horizontal line
        const hLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hLine.setAttribute('stroke', 'white 0');
        hLine.setAttribute('stroke-width', '1');

        // Vertical line
        const vLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
        vLine.setAttribute('stroke', 'white 0');
        vLine.setAttribute('stroke-width', '1');

        crossGroup.appendChild(hLine);
        crossGroup.appendChild(vLine);

        return crossGroup;
    },

    drawSelectionCircle(char) {
        // Draw selection circle
        if (char.parentElement.classList.contains('selected')) {
            const size = parseFloat(char.getAttribute('width'));
            let x = parseFloat(char.getAttribute('data-x')) || parseFloat(char.getAttribute('x')) + size / 2;
            let y = parseFloat(char.getAttribute('data-y')) || parseFloat(char.getAttribute('y')) + size / 2;
            const circle = char.parentElement.querySelector('.selection-circle') ||
                document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute('class', 'selection-circle');
            circle.setAttribute('stroke', 'white');
            circle.setAttribute('fill', 'none');
            circle.setAttribute('stroke-width', 0.000001);
            circle.setAttribute('r', size / 2);
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            if (!char.parentElement.contains(circle)) {
                char.parentElement.appendChild(circle);
            }
        } else {
            const circle = char.parentElement.querySelector('.selection-circle');
            if (circle) circle.remove();
        }
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
        const strokeWidth = 2 / MapController.scale;

        // Update cross lines
        hLine.setAttribute('x1', x - halfCross);
        hLine.setAttribute('x2', x + halfCross);
        hLine.setAttribute('y1', y);
        hLine.setAttribute('y2', y);
        hLine.setAttribute('stroke-width', strokeWidth);
        hLine.setAttribute('stroke', 'white ');

        vLine.setAttribute('x1', x);
        vLine.setAttribute('x2', x);
        vLine.setAttribute('y1', y - halfCross);
        vLine.setAttribute('y2', y + halfCross);
        vLine.setAttribute('stroke-width', strokeWidth);
        vLine.setAttribute('stroke', 'white');

        // opacity 0.5
        vLine.setAttribute('opacity', '0.5');
        hLine.setAttribute('opacity', '0.5');


        // Update or create arrow
        let arrow = crossEl.querySelector('.cross-arrow');
        if (!arrow) {
            arrow = document.createElementNS("http://www.w3.org/2000/svg", "path");
            arrow.setAttribute('class', 'cross-arrow');
            crossEl.appendChild(arrow);
        }

        // Create chevron with scaled size
        const chevronPath = `M ${x - halfCross} ${y} L ${x} ${y + halfCross} L ${x + halfCross} ${y}`;
        arrow.setAttribute('d', chevronPath);
        arrow.setAttribute('stroke', 'red');
        arrow.setAttribute('stroke-width', strokeWidth);
        arrow.setAttribute('fill', 'none');
    },

    rotateCharacters(charElement, newRotation) {
        if (this.selectedCharacters.size > 0) {
            this.selectedCharacters.forEach((char) => {
                if (char == charElement) return;
                // CharacterUtils.rotate(char.querySelector('image'),newRotation);
                CharacterUtils.rotate(char, newRotation);
            });
        }
        // CharacterUtils.rotate(img, newRotation); //por si falla lo de abajo
        CharacterUtils.rotate(charElement, newRotation);
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

        this.drawSelectionCircle(image);

        // Save state if online
        if (SyncController.isOnline) {
            SyncController.saveMapState(image.parentElement);
        }
    },

    getActivePersonaje() {
        if (!this.activeCharacter) return null;
        const personaje = this.activeCharacter.nombre;
        return this.personajes.get(personaje);
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
        let grosor = MapController.grosorCamino(3);
        if (this.rastro)
            svgElement.querySelectorAll('.character-route').forEach(el => {
                //cambiar el grosor de la linea
                MapController.grosorCamino(3, el);
            });

        svgElement.querySelectorAll('.measure-line').forEach(el => {
            console.log('measureline encontrada');
            MapController.grosorCamino(3, el);
            //cambiar el grosor de la linea
            // el.setAttribute('stroke-width', grosor);
            // el.setAttribute('stroke-dasharray', `${2*grosor} ${grosor}`);
        });



        const characterEls = svgElement.querySelectorAll('.character');
        characterEls.forEach(char => {
            const img = char.querySelector('image');
            const cross = char.querySelector('.position-cross');
            //TODO: permitir valores personalizados de iconos            
            const size = CONFIG.iconSize / MapController.scale;

            // Update image size and position
            img.setAttribute('width', size);
            img.setAttribute('height', size);

            const x = parseFloat(img.getAttribute('data-x') || img.getAttribute('x'));
            const y = parseFloat(img.getAttribute('data-y') || img.getAttribute('y'));

            img.setAttribute('x', x - size / 2);
            img.setAttribute('y', y - size / 2);

            // Update cross and arrow if they exist
            if (cross) {
                this.updateCross(cross, x, y);
            }

            this.drawSelectionCircle(img);
        });
    },
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

        let p = img.parentElement;
        if (DOM.hasClass(p, 'portrait')) {
            // La imagen debe estar igual
            console.log('Portrait');

        }
        else {
            img.style.transformBox = 'fill-box';
            img.style.transformOrigin = 'center';
            img.setAttribute('data-rotation', angle);
            img.style.transform = `rotate(${angle}deg)`;
        }

        let arrow = img.parentElement.querySelector('.position-cross');
        if (arrow) {
            img.setAttribute('data-rotation', angle);
            arrow.style.transformBox = 'fill-box';
            arrow.style.transformOrigin = 'center';
            arrow.setAttribute('data-rotation', angle);
            arrow.style.transform = `rotate(${angle}deg)`;
            //se podría llamar a portada, pero acabaria ejecutando mas instrucciones
            CharacterUtils.portada(p);
            // arrow.querySelectorAll('line').forEach(line => {
            //     line.setAttribute('stroke', 'white 0');
            // });
            // //visible cross-arrow
            // arrow.querySelector('.cross-arrow').style.display = 'block';
        }

        if (SyncController.isOnline) {
            SyncController.saveMapState(img.parentElement);
        }
    }
    ,

    /**
     * Rotate a character image
     * @param {SVGImageElement|SVGElement} img - Imagen o grupo del personaje
     * @param {number} angle - Grados positivos o negativos a girar sobre el giro actual
     */
    rotateMore(img, angle) {
        if (!img) return;
        // If passed the character group instead of the image
        if (img.tagName === 'g') {
            img = img.querySelector('image');
            if (!img) return;
        }
        let grados = img.getAttribute('data-rotation') || 0;
        this.rotate(img, grados + angle)
    },
    /**
     * Set the visibility of the cross and arrow for a character if portrait or not
     * @param {SVGElement} char - Character element
     */
    portada(char) {
        if (!char) return;
        if (DOM.hasClass(char, 'portrait')) {
            //oculta las lineas pero no la flecha
            char.querySelector('.position-cross').style.display = 'block';
            char.querySelector('.position-cross').querySelectorAll('line').forEach(line => {
                line.setAttribute('stroke', 'white 0');
            });
        }
        else {
            char.querySelector('.position-cross').style.display = 'none';
        }
    }
};

