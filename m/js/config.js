/**
 * Application configuration constants
 */
const CONFIG = {
    // App settings
    iconSize: 50,
    defaultMapUrl: '../mapas/Elahiun.svg',
    defaultCharacters: [
        '../img/tokens/Rosssel.png',
        '../img/tokens/Bandit Archer 01.png',
        '../img/tokens/Guard Spear 01.png'
    ],
    
    // Zoom settings
    minScale: 0.1,
    maxScale: 100,
    zoomInFactor: 1.2,
    zoomOutFactor: 0.8,
    
    // Movement thresholds
    dragThreshold: 2,
    moveThreshold: 0.3,
    
    // Animation timings
    tooltipDisplayTime: 2000,
    
    // Distance and time settings
    distanceScaleFactor: 1, // Metros por unidad de mapa
    defaultSpeed: 5, // Velocidad por defecto en km/h
    
    // App version
    version: '0.009'
};
