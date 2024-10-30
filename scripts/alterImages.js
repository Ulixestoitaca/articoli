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

// Converte l'immagine se è in formato diverso da JPG
async function ensureJpgFormat(filePath) {
    const image = await Jimp.read(filePath);
    const mime = image.getMIME().toLowerCase();

    if (mime !== Jimp.MIME_JPEG) {
        const newFilePath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.jpg');
        await image.quality(85).writeAsync(newFilePath);
        console.log(`Convertito ${filePath} in ${newFilePath}`);
        return newFilePath;
    }
    return filePath;
}

// Funzione per applicare filtri di colore e altre modifiche di hash visivo
async function processImage(imagePath, outputPath) {
    try {
        // Controllo se il file esiste già
        try {
            await fs.access(outputPath);
            console.log(`File già esistente, saltato: ${outputPath}`);
            return; // Esce dalla funzione se l'immagine esiste già
        } catch {
            // Il file non esiste, continua con l'elaborazione
        }

        let image = await Jimp.read(imagePath);

        // Modifica dei colori usando luminosità e contrasto
        const brightnessAmount = -0.2; // Luminosità ridotta per evitare bianchi puri
        const contrastAmount = 0.1;    // Contrasto per rendere i colori più distinti
        const hueRotation = 90;        // Rotazione di tonalità per cambiare il colore di sfondo

        image
            .brightness(brightnessAmount) // Luminosità fissa
            .contrast(contrastAmount)      // Contrasto fisso
            .color([{ apply: 'hue', params: [hueRotation] }]); // Modifica della tonalità

        await image.writeAsync(outputPath);
        console.log(`Immagine salvata in: ${outputPath}`);
    } catch (err) {
        console.error(`Errore durante l'elaborazione di ${imagePath}:`, err);
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
            const outputPath = path.join(outputDir, file);

            if (file !== "output") {
                const convertedPath = await ensureJpgFormat(filePath);
                await processImage(convertedPath, outputPath);
            } else {
                console.log(`File ignorato (è una cartella): ${file}`);
            }
        }
    } catch (err) {
        console.error('Errore durante la lettura della directory:', err);
    }
}

processAllImages();
