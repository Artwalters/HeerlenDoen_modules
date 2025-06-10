# Webflow Vite Development Server

## 🚀 Installatie & Setup

1. **Open Terminal en navigeer naar de project folder:**
   ```bash
   cd /Users/arthur/Desktop/webflow-vite-server
   ```

2. **Installeer dependencies:**
   ```bash
   npm install
   ```

3. **Start de development server:**
   ```bash
   npm run dev
   ```

## 🔗 Integratie met Webflow

### Methode 1: Lokaal testen (aanbevolen voor development)

1. Start de Vite server met `npm run dev`
2. Je krijgt een URL zoals: `http://localhost:3000`
3. In Webflow, ga naar **Project Settings > Custom Code**
4. Voeg dit toe in de **Head Code**:
   ```html
   <script type="module" src="http://localhost:3000/src/main.js"></script>
   ```

### Methode 2: Network URL (voor testen op andere devices)

1. Vite geeft ook een network URL zoals: `http://192.168.1.100:3000`
2. Gebruik deze URL om vanaf andere devices te testen
3. In Webflow:
   ```html
   <script type="module" src="http://192.168.1.100:3000/src/main.js"></script>
   ```

### Methode 3: Production Build

1. Build je project:
   ```bash
   npm run build
   ```

2. Dit maakt een `dist/webflow-app.js` file
3. Upload deze naar een CDN of GitHub Pages
4. In Webflow:
   ```html
   <script src="https://jouw-cdn.com/webflow-app.js"></script>
   ```

## 📁 Project Structuur

```
webflow-vite-server/
├── src/
│   ├── modules/
│   │   ├── navigation.js    # Navigation functionaliteit
│   │   ├── animations.js    # Scroll animaties
│   │   └── forms.js         # Form validatie
│   └── main.js             # Hoofdbestand
├── index.html              # Test HTML voor lokaal
├── vite.config.js          # Vite configuratie
└── package.json            # Project dependencies
```

## ✨ Features

- **Hot Module Replacement**: Wijzigingen worden direct geladen
- **Module-based**: Code opgedeeld in logische modules
- **CORS enabled**: Werkt met Webflow's preview
- **Test indicator**: Groene popup toont verbinding

## 🛠️ Troubleshooting

### "CORS error" in Webflow
- Zorg dat `cors: true` in vite.config.js staat
- Gebruik HTTPS met ngrok voor production-like testing

### "Module not found"
- Check of alle imports de `.js` extensie hebben
- Controleer of de server draait

### Wijzigingen worden niet geladen
- Check de browser console voor errors
- Hard refresh (Cmd+Shift+R) in Webflow preview

## 💡 Tips

1. **VS Code Integration**: Installeer de "Live Server" extensie voor backup
2. **Browser DevTools**: Gebruik de Network tab om te checken of scripts laden
3. **Console Logs**: Alle modules loggen wanneer ze laden
4. **Test Div**: Een groene popup verschijnt rechtsonder als alles werkt

## 🔄 Workflow

1. Start Vite server lokaal
2. Ontwikkel in VS Code
3. Test live in Webflow preview
4. Build voor production wanneer klaar
5. Deploy naar CDN