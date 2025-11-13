# movieBuddy

Application React pour gérer et visualiser vos données de films.

## 🚀 Déploiement sur GitHub Pages

Ce projet est configuré pour être déployé sur GitHub Pages en utilisant [react-gh-pages](https://github.com/gitname/react-gh-pages).

### Prérequis

- Node.js et npm/yarn installés
- Un compte GitHub
- Git installé et configuré

### Configuration initiale

1. **Créer l'application React** (si pas encore fait) :

   Avec npm :

   ```bash
   npx create-react-app .
   ```

   Avec yarn :

   ```bash
   yarn create react-app .
   ```

2. **Installer les dépendances** :

   Avec npm :

   ```bash
   npm install
   ```

   Avec yarn :

   ```bash
   yarn install
   ```

### Déploiement

Pour déployer votre application sur GitHub Pages, suivez ces étapes :

1. **Vérifier la propriété `homepage` dans `package.json`** :

   - Assurez-vous que l'URL correspond à votre dépôt GitHub
   - Format : `https://{username}.github.io/{repo-name}`
   - Actuellement configuré pour : `https://oliviercalmels.github.io/movie-buddy`

2. **Créer le dépôt GitHub** (si pas encore fait) :

   - Créez un dépôt vide sur GitHub nommé `movie-buddy`
   - N'initialisez pas avec un README, .gitignore ou licence

3. **Ajouter le remote GitHub** (si pas encore fait) :

   ```bash
   git remote add origin https://github.com/oliviercalmels/movie-buddy.git
   ```

4. **Déployer l'application** :

   Avec npm :

   ```bash
   npm run deploy
   ```

   Avec yarn :

   ```bash
   yarn deploy
   ```

   Cette commande va :

   - Exécuter le build pour créer une version optimisée de production
   - Déployer automatiquement le contenu du dossier `build` sur la branche `gh-pages`

5. **Configurer GitHub Pages** :

   - Allez sur votre dépôt GitHub
   - Cliquez sur "Settings" > "Pages"
   - Dans "Build and deployment" :
     - Source : "Deploy from a branch"
     - Branch : `gh-pages` / `/ (root)`
   - Cliquez sur "Save"

6. **Accéder à votre application** :
   - Votre application sera accessible à : `https://oliviercalmels.github.io/movie-buddy`
   - Le déploiement peut prendre quelques minutes

### Scripts disponibles

Avec npm :

- `npm start` : Lance l'application en mode développement
- `npm run build` : Crée une version optimisée pour la production
- `npm test` : Lance les tests
- `npm run deploy` : Déploie l'application sur GitHub Pages

Avec yarn :

- `yarn start` : Lance l'application en mode développement
- `yarn build` : Crée une version optimisée pour la production
- `yarn test` : Lance les tests
- `yarn deploy` : Déploie l'application sur GitHub Pages

### Mise à jour de l'application

Pour mettre à jour votre application déployée :

1. Faites vos modifications dans le code
2. Committez vos changements :
   ```bash
   git add .
   git commit -m "Description de vos modifications"
   ```
3. Déployez à nouveau :

   Avec npm :

   ```bash
   npm run deploy
   ```

   Avec yarn :

   ```bash
   yarn deploy
   ```

4. (Optionnel) Poussez le code source sur la branche main :
   ```bash
   git push origin main
   ```

### Structure des branches

- `main` (ou `master`) : Code source de l'application React
- `gh-pages` : Version compilée de l'application (générée automatiquement)

### Personnalisation du message de commit de déploiement

Vous pouvez personnaliser le message de commit lors du déploiement :

Avec npm :

```bash
npm run deploy -- -m "Message de commit personnalisé"
```

Avec yarn :

```bash
yarn deploy -m "Message de commit personnalisé"
```

## 📁 Structure du projet

```
movieBuddy/
├── datasources/          # Données sources
│   ├── le_maitre_de_l_arbre/
│   └── le_pianiste/
├── public/              # Fichiers statiques
├── src/                 # Code source React
├── package.json         # Dépendances et configuration
└── README.md           # Ce fichier
```

## 📚 Ressources

- [Documentation officielle create-react-app](https://create-react-app.dev/)
- [Guide de déploiement react-gh-pages](https://github.com/gitname/react-gh-pages)
- [Documentation GitHub Pages](https://docs.github.com/pages)
