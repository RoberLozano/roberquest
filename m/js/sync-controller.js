/**
 * Sync Controller Module
 * Handles Firebase synchronization and data persistence
 */
const SyncController = {
    // Firebase connection state
    isOnline: false,
    database: null,
    syncButton: null,
    mapStateRef: null,
    mapDateRef: null,
    personajesRef:null,
    
    /**
     * Initialize Firebase connection
     */
    init() {
        try {
            this.syncButton = DOM.getElement('syncButton');
            
            // Initialize Firebase if API is available
            if (typeof firebase !== 'undefined') {
                // Firebase configuration de rol.js
                this.database = database
                
                // Setup sync button event
                this.syncButton.addEventListener('click', this.toggleSync.bind(this));
                this.syncButton.title = "Conectar para sincronizar";
                
                // Setup connection state listener
                const connectedRef = this.database.ref(".info/connected");
                connectedRef.on("value", (snap) => {
                    if (snap.val() === true) {
                        this.setupFirebaseListeners();
                    }
                });
            } else {
                console.error('Firebase is not defined. Make sure to include the Firebase SDK.');
                this.syncButton.style.display = 'none';
            }
        } catch (e) {
            console.error('Error initializing Firebase:', e);
            this.syncButton.style.display = 'none';
        }
    },
    
    /**
     * Toggle online/offline sync mode
     */
    toggleSync() {
        this.isOnline = !this.isOnline;
        
        if (this.isOnline) {
            this.syncButton.classList.add('online');
            this.syncButton.title = "Modo online (click para desconectar)";
            
            // Setup Firebase map state
            this.setupFirebaseListeners();
            
            // Load current state from Firebase instead of saving local state
            this.loadMapStateFromFirebase();
        } else {
            this.syncButton.classList.remove('online');
            this.syncButton.title = "Modo offline (click para conectar)";
            
            // Detach listeners
            if (this.mapStateRef) {
                this.mapStateRef.off();
            }
            if (this.personajesRef) {
                this.personajesRef.off();
            }
        }
    },
    
    /**
     * Setup Firebase database listeners
     */
    setupFirebaseListeners() {
        if (!this.database || !this.isOnline) return;
        
        try {
            // Reference to the map state in Firebase
            this.mapStateRef = this.database.ref('mapState/personajes');
            this.mapDateRef=this.database.ref('mapState/fecha');
            
            // Listen for character updates
            this.mapStateRef.on('child_added', this.handleSyncCharacterAdded.bind(this));
            this.mapStateRef.on('child_changed', this.handleSyncCharacterChanged.bind(this));
            this.mapStateRef.on('child_removed', this.handleSyncCharacterRemoved.bind(this));
        
            //si quiero que mire todos los personajes guardados
            this.personajesRef = this.database.ref('personajes');
            this.personajesRef.on('child_changed', this.handleSyncPersonajeChanged.bind(this));

            //si quiero que mire solo los personajes de CharacterController.personajes
            CharacterController.personajes.forEach((personaje) => {
                this.personajesRef.child(personaje.nombre)
                .on('value', this.handleSyncPersonajeChanged.bind(this));
            });

            // Listen for date updates
            this.mapDateRef.on('value', this.handleSyncDateChanged.bind(this));
            
        } catch (e) {
            console.error('Error setting up Firebase listeners:', e);
        }
    },
    
    /**
     * Handle character added from sync
     * @param {Object} snapshot - Firebase snapshot
     */
    handleSyncCharacterAdded(snapshot) {
        const charData = snapshot.val();
        if (!charData || !charData.id) return;
        
        // Skip if we already have this character
        if (CharacterController.characters.has(charData.id)) {
            return;
        }
        
        try {
            // Add the new character from sync
            const charEl = CharacterController.addCharacterToMap(charData.href, {
                x: charData.x,
                y: charData.y
            });
            
            // Apply rotation if available
            const img = charEl.querySelector('image');
            if (img && charData.rotation) {
                CharacterUtils.rotate(img, charData.rotation);
            }
        } catch (e) {
            console.error('Error adding synced character:', e);
        }
    },
    
    /**
     * Handle character changed from sync
     * @param {Object} snapshot - Firebase snapshot
     */
    handleSyncCharacterChanged(snapshot) {
        const charData = snapshot.val();
        if (!charData || !charData.id) return;
        
        try {
            // Get existing character
            const charEl = CharacterController.characters.get(charData.id);
            if (!charEl) {
                // If character doesn't exist, add it
                this.handleSyncCharacterAdded(snapshot);
                return;
            }
            
            // Update position
            const img = charEl.querySelector('image');
            if (img) {
                CharacterController.moveCharacter(img, charData.x, charData.y);
                
                // Update rotation if available
                if (charData.rotation !== undefined) {
                    CharacterUtils.rotate(img, charData.rotation);
                }
            }
        } catch (e) {
            console.error('Error updating synced character:', e);
        }
    },

    /**
     * Handle character changed from sync (for personajes)
     * @param {Object} snapshot - Firebase snapshot
     */ 
    handleSyncPersonajeChanged(snapshot) {      
        try {
            let personaje=null;
                const data = snapshot.val();
                if (data) {
                    console.log("Personaje cargado:", data);
                    // Convertir los datos a un objeto de personaje
                    if (data.clase) {
                        personaje = Clase.convertir(data);
                    } else {
                        personaje = new Humanoide({});
                    }
                    personaje.setAll(data);
                    personaje.act();
                    CharacterController.personajes.set(personaje.nombre, personaje);
                    console.log("Personaje actualizado en personajes", personaje);
                }
           
        } catch (e) {
            console.error('Error updating synced character:', e);
        }
    },

    handleSyncDateChanged(snapshot) {
        console.log("Date:", snapshot.val());
        if (snapshot.val() === fechaMundo.fechahora()) {
            return;
        } else {
            console.log("Fecha actualizada:", fechaMundo.fechahora());
            fechaMundo=  new Date(snapshot.val());
            fecha.value= fechaMundo.fechahora();
        }
    }, 

    cambiarFecha(fecha) {
        if (!this.isOnline) return;
        if(!fecha) fecha= fechaMundo;
        if (fecha instanceof Date) {
            fecha=fecha.fechahora();
        }

        this.mapDateRef.set(fecha);
    },

    
    /**
     * Handle character removed from sync
     * @param {Object} snapshot - Firebase snapshot
     */
    handleSyncCharacterRemoved(snapshot) {
        const charData = snapshot.val();
        if (!charData || !charData.id) return;
        
        try {
            // Get existing character
            const charEl = CharacterController.characters.get(charData.id);
            if (charEl) {
                // Set as active and delete
                CharacterController.activeCharacter = charEl;
                CharacterController.deleteCharacter();
            }
        } catch (e) {
            console.error('Error removing synced character:', e);
        }
    },


/**
 * Carga una vez un personaje y lo guarda en @link{CharacterController.personajes}
 * 
 * @param {string} nombre 
 */
    cargarPersonaje(nombre){
        // Cargar personaje de forma asíncrona
        let ruta = `personajes/${nombre}/`;
        let personaje=null;
        this.database.ref(ruta).once('value', (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("Personaje cargado:", data);
                // Convertir los datos a un objeto de personaje
                if (data.clase) {
                    personaje = Clase.convertir(data);
                } else {
                    personaje = new Humanoide({});
                }
                personaje.setAll(data);
                personaje.act();
                CharacterController.personajes.set(personaje.nombre, personaje);
                console.log("Personaje guardado en personajes", personaje);
            }
        });
    },
    
    /**
     * Load the map state from Firebase
     */
    loadMapStateFromFirebase() {
        if (!this.database || !this.isOnline) return;
        
        try {
            // Get the current state from Firebase
            this.mapStateRef.once('value', (snapshot) => {
                const remoteState = snapshot.val();
                if (!remoteState) return;
                
                // Clear local characters first
                CharacterController.characters.forEach(charEl => {
                    CharacterController.activeCharacter = charEl;
                    CharacterController.deleteCharacter();
                });
                
                // Add each character from Firebase
                Object.values(remoteState).forEach(charData => {
                    if (!charData || !charData.href) return;
                    
                    const charEl = CharacterController.addCharacterToMap(charData.href, {
                        x: charData.x,
                        y: charData.y
                    });
                    
                    // Apply rotation if available
                    const img = charEl.querySelector('image');
                    if (img && charData.rotation) {
                        CharacterUtils.rotate(img, charData.rotation);
                    }
                });
            });
        } catch (e) {
            console.error('Error loading map state from Firebase:', e);
        }
    },
    
    /**
     * Save character state to Firebase if online
     * @param {SVGElement} charElement - Character element to save
     */
    saveMapState(charElement) {
        if (!this.isOnline || !this.database || !charElement) return;
        
        try {
            const id = charElement.id;
            const img = charElement.querySelector('image');
            if (!img) return;
            
            const href = img.getAttribute('href');
            const x = parseFloat(img.getAttribute('data-x'));
            const y = parseFloat(img.getAttribute('data-y'));
            const rotation = parseFloat(img.getAttribute('data-rotation') || 0);
            
            const charData = { id, href, x, y, rotation };
            console.log(charData);
            
           this.database.ref('mapState/personajes/' + id).set(charData);

            // this.mapStateRef.child(id).set(charData);
           

        } catch (e) {
            console.error('Error saving map state:', e);
        }
    },
    
    /**
     * Save all characters state to Firebase if online
     */
    saveAllMapState() {
        if ( !this.isOnline || !this.database ) return;
        
        try {
            CharacterController.characters.forEach((charEl) => {
                this.saveMapState(charEl);
            });
        } catch (e) {
            console.error('Error saving all map state:', e);
        }
    }
};
