const fs = require('fs');
const path = require('path');

// Percorso alla cartella con i tuoi file Markdown
const docsPath = path.join(__dirname, 'docs');

// Funzione per aggiungere titolo al file Markdown
function addTitleToMarkdownFiles(dir) {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Controlla se è una cartella
    if (stat.isDirectory()) {
      addTitleToMarkdownFiles(filePath); // Ricorsione per le sottocartelle
    } else if (path.extname(file) === '.md') {
      const fileName = path.basename(file, '.md');
      let content = fs.readFileSync(filePath, 'utf8');

      // Verifica se c'è già un titolo nel frontmatter
      if (!/^---\ntitle: .*\n---/.test(content)) {
        // Aggiungi il titolo basato sul nome del file
        const title = `title: "${fileName.replace(/-/g, ' ')}"`;
        content = `---\n${title}\n---\n\n${content}`;
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Titolo aggiunto a: ${filePath}`);
      }
    }
  });
}

addTitleToMarkdownFiles(docsPath);
