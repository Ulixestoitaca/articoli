import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';

// Percorsi delle cartelle
const inputDir = 'C:/articoli/static/guide-img';
const outputDir = 'C:/articoli/static/guide-img/output';

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

// Funzione per elaborare l'immagine con ridimensionamento, inversione dei colori e salvataggio
async function processImage(filePath) {
    const outputPath = path.join(outputDir, path.basename(filePath, path.extname(filePath)) + '.jpg');

    // Controllo esistenza output finale
    try {
        await fs.access(outputPath);
        return; // Il file esiste già, salta l'elaborazione
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
        const image = sharp(processedFilePath);
        const metadata = await image.metadata();
        console.log(`Dimensioni originali per ${filePath}:`, metadata.width, 'x', metadata.height);

        // Determina la larghezza in base al prefisso del nome file
        const baseName = path.basename(filePath);
        let width = 610;
        if (baseName.startsWith('hp-')) {
            width = 200; // Se inizia con "hp-", ridimensiona a 200px di larghezza
            console.log(`Immagine con prefisso "hp-": ridimensionamento a ${width}px.`);
        }

        // Ridimensiona l'immagine solo se necessario
        if (metadata.width !== width) {
            image.resize({ width });
            console.log(`Immagine ridimensionata a ${width}px di larghezza per: ${filePath}`);
        }

        // Salva l'immagine finale con inversione dei colori
        await image
            .negate()  // Inversione dei colori
            .jpeg({ quality: 85 })
            .toFile(outputPath);

        // Verifica le dimensioni dopo il ridimensionamento
        const finalMetadata = await sharp(outputPath).metadata();
        console.log(`Dimensioni finali per ${outputPath}:`, finalMetadata.width, 'x', finalMetadata.height);

        console.log(`Immagine elaborata e salvata in: ${outputPath}`);
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
