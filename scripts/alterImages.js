import Jimp from 'jimp';
import path from 'path';
import fs from 'fs/promises';
import chokidar from 'chokidar';
import webp from 'webp-converter';

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

// Converte l'immagine se è in formato diverso da JPG o se è un WebP camuffato
async function ensureJpgFormat(filePath) {
    let newFilePath = filePath;

    try {
        const image = await Jimp.read(filePath);
        const mime = image.getMIME().toLowerCase();

        if (mime !== Jimp.MIME_JPEG) {
            newFilePath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.jpg');
            await image.quality(85).writeAsync(newFilePath);
            console.log(`Convertito ${filePath} in ${newFilePath}`);
        }
    } catch (err) {
        if (filePath.endsWith('.jpg')) {
            console.log(`Il file ${filePath} è un WebP camuffato. Conversione in JPG.`);
            newFilePath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.jpg');
            await webp.dwebp(filePath, newFilePath, "-o");
        } else {
            console.error(`Errore durante la lettura/conversione di ${filePath}:`, err);
        }
    }
    return newFilePath;
}

// Elabora l'immagine invertendo i colori e la salva in output
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

        image.invert();  // Esempio di trasformazione

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
                const convertedPath = await ensureJpgFormat(filePath);
                await processImage(convertedPath);
            } else {
                console.log(`File ignorato (è una cartella): ${file}`);
            }
        }
    } catch (err) {
        console.error('Errore durante la lettura della directory:', err);
    }
}

// Esegue il controllo su tutte le immagini esistenti
processAllImages();

// Monitoraggio dei nuovi file con Chokidar
chokidar.watch(inputDir, { ignoreInitial: true }).on('add', (filePath) => {
    console.log(`Nuova immagine rilevata: ${filePath}`);
    processImage(filePath); // Processa la nuova immagine aggiunta
});
