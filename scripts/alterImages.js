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

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Funzione per elaborare l'immagine con conversione, modifica e salvataggio
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

        // Esegui un crop fisso sui bordi
        const cropLeft = 20;
        const cropTop = 20;
        const cropWidth = image.bitmap.width - 40;
        const cropHeight = image.bitmap.height - 40;
        //image.crop(cropLeft, cropTop, cropWidth, cropHeight);

        // Modifica dei colori usando luminosità, contrasto e tonalità
        const brightnessAmount = -0.2; // Luminosità ridotta per evitare bianchi puri
        const contrastAmount = 0.1;    // Contrasto per rendere i colori più distinti
        const hueRotation = 90;        // Rotazione di tonalità per cambiare il colore di sfondo
		const saturationAmount = 0.5; // Saturazione

        image
            .brightness(brightnessAmount) // Luminosità fissa
            .contrast(contrastAmount)      // Contrasto fisso
            .color([{ apply: 'hue', params: [hueRotation] }]); // Modifica della tonalità

        image
            .contrast(contrastAmount)
            .color([{ apply: 'saturate', params: [saturationAmount * 100] }])
            .color([{ apply: 'hue', params: [hueRotation] }]);

        await image.writeAsync(outputPath);
        console.log(`Immagine modificata salvata in: ${outputPath}`);

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
