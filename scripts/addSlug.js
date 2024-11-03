const fs = require('fs');
const path = require('path');

// Percorso alla cartella 'docs'
const docsDir = path.join(__dirname, '..', 'docs');

// Funzione per generare lo slug dal nome del file senza l'estensione '.md'
function generateSlug(filename) {
  return filename.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

// Funzione per aggiungere lo slug come frontmatter all'inizio del file Markdown
function addSlugToFrontmatter(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  if (!/^---\nslug:/m.test(content)) { // Controlla se lo slug esiste già nel frontmatter
    const filename = path.basename(filepath, '.md'); // Rimuove l'estensione .md
    const slug = generateSlug(filename);
    const newContent = `---\nslug: /${slug}\n---\n` + content;
    fs.writeFileSync(filepath, newContent, 'utf-8');
    console.log(`Slug aggiunto all'inizio di: ${filepath}`);
  }
}

// Scorre i file nella cartella docs e aggiunge slug
function processDocs(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filepath = path.join(dir, file);
    const stats = fs.statSync(filepath);
    if (stats.isDirectory()) {
      processDocs(filepath);
    } else if (file.endsWith('.md')) {
      addSlugToFrontmatter(filepath);
    }
  });
}

processDocs(docsDir);
