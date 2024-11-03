import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Percorsi delle cartelle
const inputDir = 'static/guide-img';
const outputDir = 'static/guide-img/output';

// Crea la cartella di output, se non esiste
async function ensureOutputDir() {
    try {
        await fs.mkdir(outputDir, { recursive: true });
        console.log(`Cartella di output ${outputDir} creata.`);
    } catch (err) {
        console.error('Errore nella creazione della cartella di output:', err);
    }
}

// Converte un'immagine WebP in JPG e ritorna il nuovo percorso
async function convertWebPToJpg(filePath) {
    const newFilePath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.jpg');
    try {
        await sharp(filePath)
            .toFormat('jpeg')
            .toFile(newFilePath);
        console.log(`Convertito ${filePath} in JPG: ${newFilePath}`);
        return newFilePath;
    } catch (error) {
        console.error(`Errore nella conversione WebP -> JPG per ${filePath}:`, error);
        throw error;
    }
}

// Funzione per elaborare l'immagine con inversione dei colori e salvataggio
async function processImage(filePath) {
    const outputPath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.jpg');

    // Controllo esistenza output finale
    try {
        await fs.access(outputPath);
        console.log(`File già esistente, saltato: ${outputPath}`);
        return;
    } catch {
        // Il file non esiste, procediamo con l'elaborazione
    }

    let processedFilePath = filePath;

    // Se il file è WebP, convertilo in JPG e aggiorna il percorso
    if (filePath.endsWith('.webp')) {
        try {
            processedFilePath = await convertWebPToJpg(filePath);
        } catch (err) {
            console.error(`Errore durante la conversione di ${filePath}:`, err);
            return;
        }
    }

    try {
        await sharp(processedFilePath)
            .negate()  // Inversione dei colori
            .jpeg({ quality: 85 })
            .toFile(outputPath);
        console.log(`Immagine invertita salvata in: ${outputPath}`);
    } catch (err) {
        console.error(`Errore durante l'elaborazione di ${processedFilePath}:`, err);
    }
}

// Elabora tutte le immagini nella directory
async function processAllImages() {
    await ensureOutputDir();
    try {
        const files = await fs.readdir(inputDir);
        console.log(`Trovati ${files.length} file nella directory ${inputDir}.`);

        for (const file of files) {
            const filePath = path.join(inputDir, file);

            if (file !== "output") {
                await processImage(filePath); // Elaborazione diretta
            } else {
                console.log(`File ignorato (è una cartella): ${file}`);
            }
        }
    } catch (err) {
        console.error('Errore durante la lettura della directory:', err);
    }
}

processAllImages();
