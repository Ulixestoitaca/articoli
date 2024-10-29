const fs = require('fs');
const path = require('path');

// Funzione per estrarre il contenuto pulito del testo dai file markdown
function getDocText(docPath) {
  try {
    const content = fs.readFileSync(docPath, 'utf-8');

    // Rimuovi le formattazioni Markdown
    const cleanedContent = content
      .replace(/#\s*/g, '') // Rimuove i titoli
      .replace(/\*\*(.*?)\*\*/g, '$1') // Rimuove il grassetto
      .replace(/\*(.*?)\*/g, '$1') // Rimuove il corsivo
      .replace(/!\[.*?\]\(.*?\)/g, '') // Rimuove le immagini
      .replace(/\[.*?\]\(.*?\)/g, '') // Rimuove i link
      .replace(/^\s*[-*]\s+/gm, '') // Rimuove gli elenchi puntati
      .replace(/^\s*\d+\.\s+/gm, '') // Rimuove gli elenchi numerati
      .replace(/<.*?>/g, '') // Rimuove i tag HTML
      .replace(/\n+/g, ' ') // Rimuove le righe vuote
      .replace(/^\s+|\s+$/g, '') // Rimuove spazi bianchi all'inizio e alla fine
      .trim(); // Rimuove eventuali spazi bianchi residui

    const words = cleanedContent.split(/\s+/);
    return words.slice(0, 15).join(' ') + '...'; // Prendi le prime 15 parole
  } catch (error) {
    console.error(`Errore nella lettura del file: ${docPath}`, error);
    return '';
  }
}

// Funzione ricorsiva per raccogliere tutti i file markdown
function collectMarkdownFiles(dir) {
  let filesList = [];

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const filePath = path.join(dir, file);
    if (fs.lstatSync(filePath).isDirectory()) {
      // Se è una directory, chiamala ricorsivamente
      filesList = filesList.concat(collectMarkdownFiles(filePath));
    } else if (file.endsWith('.md')) {
      // Se è un file markdown, aggiungilo alla lista
      filesList.push(filePath);
    }
  });

  return filesList;
}

// Funzione per generare i dati recenti
function generateRecentDocsData() {
  const docsPath = path.join(__dirname, '..', 'docs');
  const recentDocsData = [];

  // Raccogli tutti i file markdown
  const markdownFiles = collectMarkdownFiles(docsPath);

  // Ordina i file per data di modifica, in modo da ottenere i più recenti
  const sortedFiles = markdownFiles.sort((a, b) => {
    return fs.statSync(b).mtime - fs.statSync(a).mtime; // Ordina per data di modifica
  });

  // Limita ai primi 6 file e crea i record
  const filesToProcess = sortedFiles.slice(0, 6); // Ottieni solo i primi 6 file più recenti
  for (const filePath of filesToProcess) {
    const title = path.basename(filePath, path.extname(filePath))
      .replace(/[-_]/g, ' ') // Sostituisce "-" e "_" con spazi
      .trim(); // Rimuove eventuali spazi bianchi residui
    const text = getDocText(filePath);

    // Creazione del link: rimuovere l'estensione .md
    const link = `docs/${path.relative(docsPath, filePath).replace(/\\/g, '/').replace(/\.md$/, '')}`; // Correggi il percorso e rimuovi .md

    recentDocsData.push({ title, text, link });
  }

  // Verifica che la cartella di output esista, altrimenti la crea
  const outputDir = path.join(__dirname, '..', 'src', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Salva i dati in recentDocsData.json
  const outputPath = path.join(outputDir, 'recentDocsData.json');
  fs.writeFileSync(outputPath, JSON.stringify(recentDocsData, null, 2));
}

generateRecentDocsData();
