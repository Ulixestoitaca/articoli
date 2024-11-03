const fs = require('fs');
const path = require('path');

// Percorso alla cartella 'docs'
const docsDir = path.join(__dirname, '..', 'docs');

// Funzione per rimuovere lo slug, il frontmatter e tutti i trattini iniziali
function cleanFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf-8');

  // Rimuove tutto il blocco frontmatter (slug e delimitatori) se presente
  if (/^---\n(.*\n)*?---\n/m.test(content)) {
    content = content.replace(/^---\n(.*\n)*?---\n/m, '');
    console.log(`Frontmatter rimosso da: ${filepath}`);
  }

  // Rimuove tutti i trattini presenti all'inizio del file
  content = content.replace(/^\s*-{3,}\s*\n/gm, ''); // Rimuove blocchi di 3 o più trattini in modo ricorsivo
  fs.writeFileSync(filepath, content.trimStart(), 'utf-8');
  console.log(`Trattini rimossi da: ${filepath}`);
}

// Funzione ricorsiva per processare tutti i file markdown
function processDocs(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      processDocs(filepath); // Ricorsione per directory
    } else if (file.endsWith('.md')) {
      cleanFile(filepath);
    }
  });
}

processDocs(docsDir);
