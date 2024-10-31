import Jimp from 'jimp';
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

    try {
        let image = await Jimp.read(filePath);

        // Se non è JPG, convertilo direttamente
        if (image.getMIME().toLowerCase() !== Jimp.MIME_JPEG) {
            image = await image.quality(85);
        }

        // Inversione dei colori
        image.invert();

        // Salva l'immagine invertita
        await image.writeAsync(outputPath);
        console.log(`Immagine invertita salvata in: ${outputPath}`);

    } catch (err) {
        console.error(`Errore durante l'elaborazione di ${filePath}:`, err);
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
