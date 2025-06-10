

//! Complete POI filter and interaction code /////////////////////////

// Filter out unwanted POI labels
const excludedNames = [
  'Brasserie Mijn Streek',
  'De Twee Gezusters',
  'SCHUNCK Bibliotheek Heerlen Glaspaleis',
  'Glaspaleis Schunck',
  'Bagels & Beans',
  'Terras Bagels & Beans',
  'Brunch Bar',
  'Berden',
  'Aroma',
  'Brasserie Goya',
  'Poppodium Nieuwe Nor',
  'Nederlands Mijnmuseum',
  'Smaak & Vermaak',
  'Café ',
  'De Kromme Toeter',
  'Café Pelt',
  'Het Romeins Museum',
  "Pat's Tosti Bar",
  "Sint-Pancratiuskerk",
  "Cafe Bluff",
  // Voeg hier eventueel meer bedrijven toe
];

// Build comprehensive filter
map.on('idle', () => {
  // Check if the map is fully loaded
  if (!map.loaded()) return;
  
  // Maak een filter dat BEIDE properties controleert
  let filter = ['all'];
  
  // Voor elke naam, maak een NOT-conditie die beide properties checkt
  excludedNames.forEach(name => {
    // Voeg een conditie toe die BEIDE properties checkt
    // Als een van beide overeenkomt, moet de POI worden verborgen
    filter.push(
      ['all',
        ['!=', ['get', 'brand'], name],  // Check op brand
        ['!=', ['get', 'name'], name]    // Check op name
      ]
    );
  });
  
  // Toon alleen POIs met een naam
  filter.push(['has', 'name']);
  
  // Pas het filter toe op alle POI lagen
  const poiLayers = ['poi-label', 'poi-scalerank1', 'poi-scalerank2', 'poi-scalerank3', 'poi-scalerank4'];
  poiLayers.forEach(layerId => {
    if (map.getLayer(layerId)) {
      map.setFilter(layerId, filter);
    }
  });
});