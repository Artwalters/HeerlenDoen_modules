# HeerlenDoen Modules

Sequential module loading system voor Webflow met Mapbox interactieve kaart functionaliteit.

## 🚀 Live Links (Gebruik deze in Webflow!)

### JavaScript (Hoofd module)
```html
<script type="module" src="https://artwalters.github.io/HeerlenDoen_modules/main.js"></script>
```

### CSS (Styling)
```html
<link rel="stylesheet" href="https://artwalters.github.io/HeerlenDoen_modules/main.css">
```

#### Alternatief (als er CORS problemen zijn):
```html
<script type="module" crossorigin src="https://artwalters.github.io/HeerlenDoen_modules/main.js"></script>
```

## 🔧 Development Setup

Voor lokale development:

1. Clone dit repository
2. Run `npm install`
3. Run `npm run dev`
4. De server start op `http://localhost:3000`

### Development links (lokaal testen)
```html
<script type="module" crossorigin src="http://localhost:3000/src/main.js"></script>
<link rel="stylesheet" href="http://localhost:3000/src/main.css">
```

## 📋 Module Overzicht

De modules worden sequentieel geladen in deze volgorde:

1. **1_INITIALIZATION.js** - Mapbox setup en globale configuratie
2. **2_GEOLOCATION.js** - Gebruiker locatie en boundary management
3. **3_Dataloading.js** - CMS data laden (locaties + AR items)
4. **4_marker.js** - Kaart markers en filtering
5. **5_POPUP.js** - Popup functionaliteit en animaties
6. **6_mapinteractions.js** - Kaart interacties en controls
7. **7_threejs.js** - 3D functionaliteit
8. **8_poi.js** - Points of Interest management
9. **9_walkthrough.js** - Tour functionaliteit
10. **10_toggle3d.js** - 3D toggle controls

## ✨ Features

- **Sequential Loading**: Modules laden in de juiste volgorde
- **DOM Waiting**: Wacht op Webflow DOM initialisatie
- **Error Handling**: Robuuste error afhandeling
- **Hot Reload**: Automatische updates tijdens development
- **Mobile Responsive**: Werkt op alle apparaten
- **Performance Optimized**: Geoptimaliseerd voor snelheid

## 🔄 Auto Deployment

Elke push naar `main` branch wordt automatisch deployed naar GitHub Pages via GitHub Actions.

## 📁 Project Structuur

```
src/
├── main.js              # Entry point met sequential loading
├── main.css             # Hoofd stylesheet
└── modules/
    ├── 1_initialization.js    # Map setup
    ├── 2_geolocation.js       # GPS functionaliteit  
    ├── 3_dataloading.js       # Data management
    ├── 4_marker.js            # Markers & filters
    ├── 5_popup.js             # Popup systeem
    ├── 6_mapinteractions.js   # Map controls
    ├── 7_threejs.js           # 3D rendering
    ├── 8_poi.js               # Points of Interest
    ├── 9_walkthrough.js       # Tour guide
    └── 10_toggle3d.js         # 3D toggle
```

## 🤝 Contributing

1. Fork het project
2. Maak je feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit je changes (`git commit -m 'Add some AmazingFeature'`)
4. Push naar de branch (`git push origin feature/AmazingFeature`)
5. Open een Pull Request