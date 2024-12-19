const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Funzione per estrarre il contenuto pulito del testo dai file markdown, escludendo il frontmatter
function getDocText(docPath) {
  try {
    let content = fs.readFileSync(docPath, 'utf-8');

    // Rimuovi il frontmatter (ad esempio, slug e altre metainformazioni)
    if (content.startsWith('---')) {
      content = content.slice(content.indexOf('---', 3) + 3); // Taglia tutto fino al secondo '---'
    }

    // Rimuovi le formattazioni Markdown
    const cleanedContent = content
      .replace(/#\s*/g, '') // Rimuove i titoli
      .replace(/\*\*(.*?)\*\*/g, '$1') // Rimuove il grassetto
      .replace(/\*(.*?)\*/g, '$1') // Rimuove il corsivo
      .replace(/!\[.*?\]\((.*?)\)/g, '') // Rimuove le immagini
      .replace(/\[.*?\]\(.*?\)/g, '') // Rimuove i link
      .replace(/^\s*[-*]\s+/gm, '') // Rimuove gli elenchi puntati
      .replace(/^\s*\d+\.\s+/gm, '') // Rimuove gli elenchi numerati
      .replace(/<.*?>/g, '') // Rimuove i tag HTML
      .replace(/\n+/g, ' ') // Rimuove le righe vuote
      .replace(/^\s+|\s+$/g, '') // Rimuove spazi bianchi all'inizio e alla fine
      .trim(); // Rimuove eventuali spazi bianchi residui

    const words = cleanedContent.split(/\s+/);
    return words.slice(0, 50).join(' ') + '...'; // Prendi le prime 50 parole
  } catch (error) {
    console.error(`Errore nella lettura del file: ${docPath}`, error);
    return '';
  }
}

// Funzione per individuare il nome della prima immagine in un documento markdown
function getFirstImage(docPath) {
  try {
    const content = fs.readFileSync(docPath, 'utf-8');
    const match = content.match(/!\[.*?\]\((.*?)\)/);
    if (match) {
      const imageName = path.basename(match[1]); // Restituisce solo il nome del file immagine
      console.log(`Nome immagine trovata: ${imageName}`);
      return imageName;
    }
    return null; // Nessuna immagine trovata
  } catch (error) {
    console.error(`Errore nell'estrazione dell'immagine dal file: ${docPath}`, error);
    return null;
  }
}

// Funzione per copiare e rinominare un'immagine
function copyAndRenameImage(imagePath, outputDir, newFileName) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outputFilePath = path.join(outputDir, newFileName);

  // Controlla se il file rinominato esiste già
  if (fs.existsSync(outputFilePath)) {
    console.log(`Il file rinominato esiste già: ${outputFilePath}`);
    return outputFilePath;
  }

  // Controlla se il file originale esiste
  if (!fs.existsSync(imagePath)) {
    console.error(`Il file immagine originale non esiste: ${imagePath}`);
    return null;
  }

  // Copia l'immagine
  try {
    sharp(imagePath).toFile(outputFilePath);
    return outputFilePath;
  } catch (err) {
    console.error(`Errore nella copia dell'immagine: ${imagePath}`, err);
    return null;
  }
}

// Funzione per generare i dati recenti
function generateRecentDocsData() {
  const docsPath = path.join(__dirname, '..', 'docs');
  const recentDocsData = [];
  const baseImageDir = path.join(__dirname, '..', 'static', 'guide-img');

  // Raccogli tutti i file markdown
  const markdownFiles = collectMarkdownFiles(docsPath);

  // Ordina i file per data di modifica, in modo da ottenere i più recenti
  const sortedFiles = markdownFiles.sort((a, b) => {
    return fs.statSync(b).mtime - fs.statSync(a).mtime; // Ordina per data di modifica
  });

  // Limita ai primi 30 file e crea i record
  const filesToProcess = sortedFiles.slice(0, 36);
  for (const filePath of filesToProcess) {
    const title = path.basename(filePath, path.extname(filePath))
      .replace(/[-_]/g, ' ') // Sostituisce "-" e "_" con spazi
      .trim(); // Rimuove eventuali spazi bianchi residui
    const text = getDocText(filePath);

    // Creazione del link usando solo il nome del file
    const fileName = path.basename(filePath, '.md'); // Ottieni solo il nome del file senza estensione
    const link = `/articoli/${fileName}/`; // Usa solo 'articoli' e il nome del file

    // Individua il nome della prima immagine
    const firstImageName = getFirstImage(filePath);
    let imgPath = null;

    if (firstImageName) {
      const originalImagePath = path.join(baseImageDir, firstImageName);
      const newImageName = `hp-${firstImageName}`;

      // Prova a copiare e rinominare l'immagine
      const copiedImagePath = copyAndRenameImage(originalImagePath, baseImageDir, newImageName);
      imgPath = copiedImagePath ? `https://www.impresaitalia.info/articoli/static/guide-img/output/${newImageName}` : null;
    } else {
      console.error(`Immagine non trovata o percorso errato: ${firstImageName}`);
    }

    recentDocsData.push({ title, text, link, img: imgPath });
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

generateRecentDocsData();
