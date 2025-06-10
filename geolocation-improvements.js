// GEOLOCATION IMPROVEMENTS SUGGESTIONS

// 1. Fix global variable reference
// Regel 750: Vervang 'map' door 'self.map'
self.map.flyTo({
  center: window.CONFIG.MAP.center, // Ook CONFIG global maken
  zoom: finalZoom,
  pitch: 55,
  bearing: -17.6,
  duration: 3000,
  essential: true,
  easing: t => t * (2 - t)
});

// 2. Add safety check for mapLocations
updateDistanceMarkers(userPosition) {
  // Clear existing markers
  if (this.distanceMarkers) {
    this.distanceMarkers.forEach(marker => marker.remove());
    this.distanceMarkers = [];
  }

  // SAFETY CHECK: Ensure mapLocations exists and has features
  if (!window.mapLocations || !window.mapLocations.features) {
    console.warn("[DEBUG] mapLocations not available yet, skipping distance markers");
    return;
  }

  // Add new markers for features within radius
  window.mapLocations.features.forEach(feature => {
    // ... rest of code
  });
}

// 3. Better event listener management
setupGeolocateControl() {
  // ... existing code ...

  // Use a more robust way to attach click handler
  this.map.once("idle", () => {
    // Wait a bit more for Mapbox to fully initialize
    setTimeout(() => {
      const geolocateButton = document.querySelector(".mapboxgl-ctrl-geolocate");
      if (geolocateButton) {
        // Remove any existing listeners first
        geolocateButton.removeEventListener("click", this.handleGeolocateClick);
        
        // Create bound method for easier cleanup
        this.handleGeolocateClick = this.handleGeolocateClick.bind(this);
        geolocateButton.addEventListener("click", this.handleGeolocateClick, { capture: true });
      }
    }, 500);
  });
}

// 4. Separate click handler method
handleGeolocateClick(event) {
  console.log("[DEBUG] Geolocate button CLICKED. Setting userInitiatedGeolocation = true.");
  this.userInitiatedGeolocation = true;
  this.showBoundaryLayers();
}

// 5. Add cleanup method
cleanup() {
  // Clean up markers
  if (this.distanceMarkers) {
    this.distanceMarkers.forEach(marker => marker.remove());
    this.distanceMarkers = [];
  }
  
  // Clean up event listeners
  const geolocateButton = document.querySelector(".mapboxgl-ctrl-geolocate");
  if (geolocateButton && this.handleGeolocateClick) {
    geolocateButton.removeEventListener("click", this.handleGeolocateClick);
  }
  
  // Clear any active timeouts
  if (this.popupTimeout) {
    clearTimeout(this.popupTimeout);
  }
}

// 6. Better state management
constructor(map) {
  this.map = map;
  this.state = {
    isFirstLocation: true,
    isTracking: false,
    userInitiatedGeolocation: false,
    isPopupOpen: false,
    wasTracking: false
  };
  // ... rest of constructor
}

// 7. Add retry mechanism for geolocation
requestLocationWithRetry(maxRetries = 3) {
  let retryCount = 0;
  
  const attemptGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => this.handleUserLocation(position),
        error => {
          retryCount++;
          console.warn(`[DEBUG] Geolocation attempt ${retryCount} failed:`, error);
          
          if (retryCount < maxRetries) {
            console.log(`[DEBUG] Retrying geolocation in 2 seconds... (${retryCount}/${maxRetries})`);
            setTimeout(attemptGeolocation, 2000);
          } else {
            this.handleGeolocationError(error);
          }
        },
        this.positionOptions
      );
    }
  };
  
  attemptGeolocation();
}