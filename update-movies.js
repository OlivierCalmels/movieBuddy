const fs = require('fs');
const path = require('path');

// Fonction pour trouver le fichier CSV le plus récent dans un dossier
function findLatestCSV(directory) {
  if (!fs.existsSync(directory)) {
    console.warn(`⚠️  Le dossier n'existe pas: ${directory}`);
    return null;
  }
  
  const files = fs.readdirSync(directory)
    .filter(file => file.endsWith('.csv'))
    .map(file => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      return {
        path: filePath,
        name: file,
        mtime: stats.mtime
      };
    })
    .sort((a, b) => b.mtime - a.mtime);

  return files.length > 0 ? files[0] : null;
}

// Configuration des sources
const sources = [
  {
    name: 'Olivier',
    sourceDir: path.join(__dirname, 'public', 'datasources', 'le_maitre_de_l_arbre'),
    targetFile: path.join(__dirname, 'public', 'movies-olivier.csv')
  },
  {
    name: 'Loïc',
    sourceDir: path.join(__dirname, 'public', 'datasources', 'le_pianiste'),
    targetFile: path.join(__dirname, 'public', 'movies-loic.csv')
  }
];

// Traiter chaque source
let success = false;
sources.forEach(source => {
  const latestFile = findLatestCSV(source.sourceDir);
  
  if (latestFile) {
    fs.copyFileSync(latestFile.path, source.targetFile);
    console.log(`✅ ${source.name}: ${latestFile.name} -> ${path.basename(source.targetFile)}`);
    console.log(`   📅 Date: ${latestFile.mtime.toLocaleString('fr-FR')}`);
    success = true;
  } else {
    console.log(`⚠️  ${source.name}: Aucun fichier CSV trouvé`);
  }
});

if (!success) {
  console.error('❌ Aucun fichier CSV trouvé dans aucune source');
  process.exit(1);
}

console.log('✨ Mise à jour terminée!');

