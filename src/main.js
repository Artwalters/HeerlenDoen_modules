// Hoofdbestand dat alle modules sequentieel importeert
import './main.css'; // Importeer CSS

let modulesLoaded = 0;
const totalModules = 9;

// Functie om modules sequentieel te laden
async function loadModulesSequentially() {
  console.log('🔄 Loading modules sequentially...');
  
  // Wacht tot map container beschikbaar is
  await waitForMapContainer();
  
  try {
    // Module 1: Initialization (basis configuratie en map)
    await import('./modules/1_initialization.js');
    console.log('✅ Module 1 loaded: Initialization');
    modulesLoaded++;
    
    // Wacht tot map geladen is voordat we verder gaan
    await waitForMapLoad();
    
    // Module 2: Geolocation
    await import('./modules/2_geolocation.js');
    console.log('✅ Module 2 loaded: Geolocation');
    modulesLoaded++;
    
    // Module 3: Data loading
    await import('./modules/3_dataloading.js');
    console.log('✅ Module 3 loaded: Data loading');
    modulesLoaded++;
    
    // Module 4: Markers
    await import('./modules/4_marker.js');
    console.log('✅ Module 4 loaded: Markers');
    modulesLoaded++;
    
    // Module 5: Popups
    await import('./modules/5_POPUP.js');
    console.log('✅ Module 5 loaded: Popups');
    modulesLoaded++;
    
    // Module 6: Map interactions
    await import('./modules/6_mapinteractions.js');
    console.log('✅ Module 6 loaded: Map interactions');
    modulesLoaded++;
    
    // Module 7: Three.js
    await import('./modules/7_threejs.js');
    console.log('✅ Module 7 loaded: Three.js');
    modulesLoaded++;
    
    // Module 8: POI
    await import('./modules/8_poi.js');
    console.log('✅ Module 8 loaded: POI');
    modulesLoaded++;

     // Module 9: Toggle 3D
     await import('./modules/9_walkthrough.js');
     console.log('✅ Module 9 loaded: Toggle 3D');
     modulesLoaded++;
    
    // Module 9: Toggle 3D
    await import('./modules/10_toggle3d.js');
    console.log('✅ Module 9 loaded: Toggle 3D');
    modulesLoaded++;
    
    console.log('🎉 All modules loaded successfully!');
    
  } catch (error) {
    console.error('❌ Error loading modules:', error);
  }
}

// Helper functie om te wachten tot map container beschikbaar is
function waitForMapContainer() {
  return new Promise((resolve) => {
    const checkContainer = () => {
      const mapContainer = document.getElementById('map');
      if (mapContainer) {
        console.log('✅ Map container found');
        resolve();
      } else {
        console.log('⏳ Waiting for map container...');
        setTimeout(checkContainer, 100);
      }
    };
    checkContainer();
  });
}

// Helper functie om te wachten tot map geladen is
function waitForMapLoad() {
  return new Promise((resolve) => {
    if (window.map && window.map.loaded()) {
      resolve();
    } else if (window.map) {
      window.map.on('load', resolve);
    } else {
      // Fallback: wacht kort en probeer opnieuw
      setTimeout(() => {
        if (window.map) {
          if (window.map.loaded()) {
            resolve();
          } else {
            window.map.on('load', resolve);
          }
        } else {
          resolve(); // Ga door ook al is map nog niet beschikbaar
        }
      }, 100);
    }
  });
}

// Wacht tot de DOM geladen is
async function init() {
  console.log('🎯 Webflow Vite App gestart!');
  console.log('📍 Environment:', import.meta.env.MODE);
  
  // Wacht extra tijd voor Webflow DOM om volledig klaar te zijn
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Laad alle modules sequentieel
  await loadModulesSequentially();
  
  // Test: voeg een div toe aan de body
  const testDiv = document.createElement('div');
  testDiv.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #4CAF50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    z-index: 9999;
  `;
  testDiv.textContent = '✅ Vite Server Connected!';
  document.body.appendChild(testDiv);
  
  // Verwijder de test div na 3 seconden
  setTimeout(() => {
    testDiv.style.transition = 'opacity 0.5s';
    testDiv.style.opacity = '0';
    setTimeout(() => testDiv.remove(), 500);
  }, 3000);
}

// Start de app met betere timing voor Webflow
function startApp() {
  // In Webflow kan de DOM al geladen zijn, maar elementen kunnen nog toegevoegd worden
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Extra wachttijd voor Webflow om elementen te initialiseren
      setTimeout(init, 100);
    });
  } else {
    // Document is al geladen, maar wacht kort voor Webflow initialisatie
    setTimeout(init, 100);
  }
}

startApp();

// Hot Module Replacement voor development
if (import.meta.hot) {
  import.meta.hot.accept();
  console.log('🔥 HMR actief - wijzigingen worden automatisch geladen!');
}