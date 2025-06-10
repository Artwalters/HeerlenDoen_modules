# GitHub Pages Deployment voor Webflow

## 🚀 Stappen om je code op GitHub Pages te krijgen:

### 1. **Pas vite.config.js aan voor GitHub Pages:**

```javascript
import { defineConfig } from 'vite'

export default defineConfig({
  // Voeg base URL toe (vervang 'REPO-NAAM' met je repository naam)
  base: '/REPO-NAAM/',
  
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './src/main.js',
      output: {
        entryFileNames: 'webflow-app.js',
        format: 'iife'
      }
    }
  }
})
```

### 2. **GitHub Actions workflow (.github/workflows/deploy.yml):**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Build project
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

### 3. **Build commando voor production:**

In package.json, voeg toe:
```json
"scripts": {
  "build:gh": "vite build --base=/REPO-NAAM/"
}
```

### 4. **In Webflow gebruiken:**

Na deployment gebruik je deze URL in Webflow:
```html
<script src="https://JOUW-GEBRUIKERSNAAM.github.io/REPO-NAAM/webflow-app.js"></script>
```

## 📝 Volledige stappen:

1. **Maak repository op GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/GEBRUIKERSNAAM/REPO-NAAM.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Ga naar repository Settings
   - Scroll naar "Pages"
   - Source: "Deploy from a branch"
   - Branch: "gh-pages" (wordt automatisch gemaakt)

3. **Wacht op deployment**
   - Check Actions tab voor build status
   - Na ~2 minuten is je site live

## 🔄 Alternatief: Gebruik een CDN service

### jsDelivr (automatisch van GitHub):
```html
<script src="https://cdn.jsdelivr.net/gh/GEBRUIKERSNAAM/REPO-NAAM@main/dist/webflow-app.js"></script>
```

### Unpkg:
Als je naar NPM publiceert:
```html
<script src="https://unpkg.com/jouw-package@latest/dist/webflow-app.js"></script>
```

## 💡 Tips:

1. **Caching**: Voeg versie toe voor cache busting:
   ```html
   <script src="https://....js?v=1.0.1"></script>
   ```

2. **Development vs Production**:
   - Development: `http://localhost:3000/src/main.js`
   - Production: `https://username.github.io/repo/webflow-app.js`

3. **Automatische updates**: 
   - Elke push naar `main` update automatisch je live versie

## 🛠️ Troubleshooting:

- **404 error**: Check of de base URL correct is in vite.config.js
- **CORS issues**: GitHub Pages heeft CORS enabled, dus geen probleem
- **Oude versie**: Hard refresh (Ctrl+F5) of voeg versienummer toe