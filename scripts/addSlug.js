const fs = require('fs');
const path = require('path');

// Percorso alla cartella 'docs'
const docsDir = path.join(__dirname, '..', 'docs');

// Funzione per generare lo slug dal nome del file senza l'estensione '.md'
function generateSlug(filename) {
  return filename.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

// Funzione per aggiungere lo slug al frontmatter del file Markdown
function addSlugToFrontmatter(filepath) {
  const content = fs.readFileSync(filepath, 'utf-8');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const frontmatterMatch = content.match(frontmatterRegex);

  if (frontmatterMatch) {
    // Il file ha un frontmatter
    const frontmatter = frontmatterMatch[1];

    // Verifica se lo slug esiste già nel frontmatter
    if (!/^slug:/m.test(frontmatter)) {
      const filename = path.basename(filepath, '.md'); // Rimuove l'estensione .md
      const slug = generateSlug(filename);

      // Aggiunge lo slug al frontmatter esistente
      const updatedFrontmatter = `slug: /${slug}\n` + frontmatter;
      const newContent = `---\n${updatedFrontmatter}\n---` + content.slice(frontmatterMatch[0].length);
      fs.writeFileSync(filepath, newContent, 'utf-8');
      console.log(`Slug aggiunto al frontmatter di: ${filepath}`);
    } else {
      console.log(`Slug già presente in: ${filepath}`);
    }
  } else {
    // Il file non ha un frontmatter, ne crea uno nuovo con lo slug
    const filename = path.basename(filepath, '.md'); // Rimuove l'estensione .md
    const slug = generateSlug(filename);

    const newContent = `---\nslug: /${slug}\n---\n` + content;
    fs.writeFileSync(filepath, newContent, 'utf-8');
    console.log(`Frontmatter con slug aggiunto a: ${filepath}`);
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
