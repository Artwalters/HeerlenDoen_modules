

//! ============= MARKER MANAGEMENT =============
/**
 * Load marker icons
 */
function loadIcons() {
  // Get unique icons
  const uniqueIcons = [...new Set(mapLocations.features.map(feature => feature.properties.icon))];
  
  // Load each icon
  uniqueIcons.forEach(iconUrl => {
    map.loadImage(iconUrl, (error, image) => {
      if (error) throw error;
      map.addImage(iconUrl, image);
    });
  });
}

/**
 * Add custom markers to map
 */
function addCustomMarkers() {
  if (markersAdded) return;
  
  // Add source
  map.addSource("locations", { 
    type: "geojson", 
    data: mapLocations 
  });
  
  // Add layers
  const layers = [
    // Circle marker layer
    {
      id: "location-markers",
  type: "circle",
  paint: {
    "circle-color": [
      "case",
      ["==", ["get", "type"], "ar"],
      ["get", "arkleur"], // Gebruik de arkleur property voor AR markers
      ["get", "color"]    // Gebruik de normale color property voor andere markers
    ],
    "circle-radius": [
      "interpolate",
      ["linear"],
      ["zoom"],
      CONFIG.MARKER_ZOOM.min, 2,
      CONFIG.MARKER_ZOOM.small, 5,
      CONFIG.MARKER_ZOOM.medium, 8,
      CONFIG.MARKER_ZOOM.large, 10
    ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
        "circle-opacity": 0
      }
    },
    // Icon layer
    {
      id: "location-icons",
      type: "symbol",
      layout: {
        "icon-image": ["get", "icon"],
        "icon-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          CONFIG.MARKER_ZOOM.min, 0.05,
          CONFIG.MARKER_ZOOM.small, 0.08,
          CONFIG.MARKER_ZOOM.medium, 0.12,
          CONFIG.MARKER_ZOOM.large, 0.15
        ],
        "icon-allow-overlap": true,
        "icon-anchor": "center"
      },
      paint: { 
        "icon-opacity": 0 
      }
    },
    // Label layer
    {
      id: "location-labels",
      type: "symbol",
      layout: {
        "text-field": ["get", "name"],
        "text-size": [
          "interpolate",
          ["linear"],
          ["zoom"],
          CONFIG.MARKER_ZOOM.min, 8,
          CONFIG.MARKER_ZOOM.small, 10,
          CONFIG.MARKER_ZOOM.medium, 11,
          CONFIG.MARKER_ZOOM.large, 12
        ],
        "text-offset": [0, 1],
        "text-anchor": "top",
        "text-allow-overlap": false
      },
      paint: {
        "text-color": ["get", "color"],
        "text-halo-color": "#ffffff",
        "text-halo-width": 2,
        "text-opacity": 0
      }
    }
  ];
  
  // Add each layer
  layers.forEach(layer => map.addLayer({ ...layer, source: "locations" }));
  
  // Animate marker appearance
  let opacity = 0;
  const animateMarkers = () => {
    opacity += 0.1;
    map.setPaintProperty("location-markers", "circle-opacity", opacity);
    map.setPaintProperty("location-icons", "icon-opacity", opacity);
    map.setPaintProperty("location-labels", "text-opacity", opacity);
    
    if (opacity < 1) {
      requestAnimationFrame(animateMarkers);
    }
  };
  
  setTimeout(animateMarkers, 100);
  markersAdded = true;
}

// Setup marker hover effects
map.on("mouseenter", "location-markers", () => {
  map.getCanvas().style.cursor = "pointer";
});

map.on("mouseleave", "location-markers", () => {
  map.getCanvas().style.cursor = "";
});

//! ============= MARKER FILTERING =============

/**
 * Setup location filter buttons
 */
function setupLocationFilters() {
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.addEventListener("click", () => {
      const category = button.dataset.category; // HOOFDLETTERS verwacht
      if (!category) return; // Sla knoppen zonder categorie over

      // Update de Set (dit blijft hetzelfde)
      if (activeFilters.has(category)) {
        activeFilters.delete(category);
        button.classList.remove("is--active"); // Expliciet verwijderen/toevoegen
      } else {
        activeFilters.add(category);
        button.classList.add("is--active"); // Expliciet toevoegen
      }

      applyMapFilters(); // Pas de kaartfilters toe

      // === NIEUW: Sla de wijziging op ===
      saveMapFiltersToLocalStorage();
      // === EINDE ===
    });
  });
}

/**
 * Apply active filters to map markers
 */
function applyMapFilters() {
  const filterExpression = activeFilters.size === 0
    ? null // Geen filter als Set leeg is
    : ["in", ["get", "category"], ["literal", Array.from(activeFilters)]]; // HOOFDLETTERS in 'category' property verwacht

  // Pas filter toe op alle marker-gerelateerde lagen (indien geladen)
  const layersToFilter = ["location-markers", "location-icons", "location-labels"];
  layersToFilter.forEach(layerId => {
    if (map.getLayer(layerId)) {
        try {
            map.setFilter(layerId, filterExpression);
        } catch (e) {
            console.warn(`Kon filter niet toepassen op laag ${layerId}:`, e);
            // Kan gebeuren als laag nog niet volledig klaar is.
        }
    }
  });
}
