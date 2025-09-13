const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

// Créer le dossier scripts s'il n'existe pas
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

const sizes = [
  { name: 'small', width: 85, height: 75 },
  { name: 'medium', width: 170, height: 150 },
  { name: 'large', width: 255, height: 225 }
];

const inputPath = 'src/assets/header/logo.webp';

console.log('🚀 Début de l\'optimisation des images...');

Promise.all(
  sizes.map(size => {
    const outputPath = `src/assets/header/logo-${size.name}.webp`;
    
    return sharp(inputPath)
      .resize(size.width, size.height, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .webp({ 
        quality: 85, 
        effort: 6,
        lossless: false
      })
      .toFile(outputPath)
      .then(() => {
        console.log(`✅ Créé: ${outputPath} (${size.width}x${size.height})`);
        return outputPath;
      })
      .catch(err => {
        console.error(`❌ Erreur pour ${outputPath}:`, err.message);
        throw err;
      });
  })
).then(results => {
  console.log('\n🎉 Optimisation terminée avec succès!');
  console.log(`📁 ${results.length} fichiers créés dans src/assets/header/`);
  
  // Afficher les tailles des fichiers
  results.forEach(filePath => {
    try {
      const stats = fs.statSync(filePath);
      const sizeKB = (stats.size / 1024).toFixed(1);
      console.log(`📊 ${path.basename(filePath)}: ${sizeKB} KB`);
    } catch (err) {
      console.log(`📊 ${path.basename(filePath)}: Taille non disponible`);
    }
  });
}).catch(err => {
  console.error('💥 Erreur lors de l\'optimisation:', err.message);
  process.exit(1);
});