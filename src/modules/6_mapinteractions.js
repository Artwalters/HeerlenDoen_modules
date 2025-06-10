
//! ============= MAP INTERACTION HANDLERS =============

// Map load event
map.on("load", () => {
  // Wacht tot de map volledig geladen is
  map.once('idle', () => {
   // Controleer of de poi-label layer bestaat
   const firstSymbolLayerId = map.getStyle().layers.find(layer => 
     layer.type === 'symbol' && layer.id.includes('label')
   )?.id;

   // Voeg gebouwextrusies toe VÓÓR de eerste symboollaag
   // Dit zorgt ervoor dat alle labels (inclusief POI) bovenop de gebouwen komen
   map.addLayer({
     'id': 'heerlen-buildings',
     'type': 'fill-extrusion',
     'source': 'composite',
     'source-layer': 'building',
     'filter': ['!=', ['get', 'type'], 'underground'],
     'minzoom': 15,
     'paint': {
       'fill-extrusion-color': '#e8e0cc',
       'fill-extrusion-height': [
         'case',
         ['has', 'height'], ['get', 'height'],
         ['has', 'min_height'], ['get', 'min_height'],
         3
       ],
       'fill-extrusion-base': [
         'case',
         ['has', 'min_height'], ['get', 'min_height'],
         0
       ],
       'fill-extrusion-opacity': 1.0,
       'fill-extrusion-vertical-gradient': true
     }
   }, firstSymbolLayerId); // Belangrijk: plaats vóór de eerste symboollaag
   
 });


 loadFiltersAndUpdateMap();
 loadIcons();
 addCustomMarkers();
 setupLocationFilters();


// === Pas filters nogmaals toe na markers zeker zijn toegevoegd ===
 // Dit is een extra zekerheid, vooral als addCustomMarkers asynchroon is.
 if (markersAdded) {
   applyMapFilters();
} else {
   // Als markers nog niet klaar zijn, probeer het na een korte vertraging
   // of binnen addCustomMarkers zelf aan het einde.
   map.once('idle', applyMapFilters);
}
// === EINDE ===
 
 // Initial animation on load
 setTimeout(() => {
   const finalZoom = window.matchMedia("(max-width: 479px)").matches ? 17 : 18;
   
   map.jumpTo({
     center: CONFIG.MAP.center,
     zoom: 15,
     pitch: 0,
     bearing: 0
   });
   
   map.flyTo({
     center: CONFIG.MAP.center,
     zoom: finalZoom,
     pitch: 55,
     bearing: -17.6,
     duration: 6000,
     essential: true,
     easing: t => t * (2 - t) // Ease out quad
   });
 }, 5000);
});

// Close sidebar button
$(".close-block").on("click", () => {
 closeItem();
});

// Hide popups and sidebar on map interactions
["dragstart", "zoomstart", "rotatestart", "pitchstart"].forEach(eventType => {
 map.on(eventType, () => {
   // Hide sidebar if visible
   const visibleItem = $(".locations-map_item.is--show");
   if (visibleItem.length) {
     visibleItem.css({
       opacity: "0",
       transform: "translateY(40px) scale(0.6)",
       transition: "all 400ms cubic-bezier(0.68, -0.55, 0.265, 1.55)"
     });
     
     setTimeout(() => {
       visibleItem.removeClass("is--show");
     }, 400);
   }
   
   // Hide popup if visible
   if (activePopup) {
     const popupContent = activePopup.getElement().querySelector(".mapboxgl-popup-content");
     popupContent.style.transition = "all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
     popupContent.style.transform = "rotate(-5deg) translateY(40px) scale(0.6)";
     popupContent.style.opacity = "0";
     
     setTimeout(() => {
       activePopup.remove();
       activePopup = null;
     }, 400);
   }
 });
});


//! grens instellingen en teleport functie voor zoom en afstand. 
map.on('moveend', () => {
 // Skip deze check als we aan het terugvliegen zijn
 if (map.isEasing()) return;
 
 const currentCenter = map.getCenter();
 const boundaryCenter = { 
   lng: CONFIG.MAP.boundary.center[0], 
   lat: CONFIG.MAP.boundary.center[1] 
 };
 
 // Bereken afstand van huidige centrum tot Heerlen centrum
 const distance = calculateDistance(
   currentCenter.lat, currentCenter.lng,
   boundaryCenter.lat, boundaryCenter.lng
 );
 
 // Als we te ver weg zijn (meer dan 3 km), vlieg terug
 if (distance > 3) {
   // Maak blocker overlay
   const overlay = document.createElement('div');
   overlay.id = 'interaction-blocker';
   document.body.appendChild(overlay);

   // Vlieg terug naar centrum
   map.flyTo({
     center: CONFIG.MAP.center,
     zoom: 17,
     pitch: 45,
     bearing: -17.6,
     speed: 0.8,
     curve: 1.5,
     essential: true
   });

   // Vervaag overlay
   gsap.to(overlay, {
     duration: 2,
     backgroundColor: "rgba(255,255,255,0)",
     onComplete: () => {
       overlay.remove();
     }
   });
 }
});

//! Zorg ervoor dat de calculateDistance functie beschikbaar is op global niveau
// (hergebruik de functie uit geolocationManager)
function calculateDistance(lat1, lon1, lat2, lon2) {
 // Haversine formule
 const toRad = deg => deg * (Math.PI / 180);
 
 const dLat = toRad(lat2 - lat1);
 const dLon = toRad(lon2 - lon1);
 
 const a = 
   Math.sin(dLat / 2) * Math.sin(dLat / 2) +
   Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
   Math.sin(dLon / 2) * Math.sin(dLon / 2);
   
 const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
 return 6371 * c; // Aarde radius in km
}

