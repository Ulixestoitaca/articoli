const axios = require('axios');
const cheerio = require('cheerio');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class UrlFetcher {
  constructor(url) {
    this.url = url;
  }

  async fetchUrls() {
    try {
      const { data } = await axios.get(this.url);
      const $ = cheerio.load(data);

      const urls = [];
      $('div.contentList a').each((i, element) => {
        const link = $(element).attr('href');
        if (link) {
          urls.push(link);
        }
      });

      console.log("URL trovati:", urls);
      return urls;
    } catch (error) {
      console.error("Errore nel recupero della pagina:", error);
      return [];
    }
  }

  async saveArticles(urls) {
    // Creare le cartelle se non esistono
    const articleDir = path.join(__dirname, 'files');
    const imageDir = path.join(__dirname, '../static/guide-img/');
    if (!fs.existsSync(articleDir)) fs.mkdirSync(articleDir);
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (const url of urls) {
      try {
        await page.goto(url, { waitUntil: 'networkidle2' }); // Attende il caricamento completo
        
        // Estrai il contenuto dell'articolo
        const articleContent = await page.$eval('#page #pageContent > article', element => element.innerHTML);
        
        if (articleContent) {
          const fileName = path.basename(url) + '.html';
          const filePath = path.join(articleDir, fileName);
          fs.writeFileSync(filePath, articleContent, 'utf8');
          console.log(`Articolo salvato in: ${filePath}`);

          // Carica l'articolo con Cheerio per estrarre le immagini
          const $ = cheerio.load(articleContent);
          $('img[width="610"]').each((i, img) => {
            let imgUrl = $(img).attr('src');
            if (imgUrl) {
              // Converti URL relativi in assoluti e stampa l'URL per il debug
              if (!imgUrl.startsWith('http')) {
                imgUrl = new URL(imgUrl, url).href;
              }
              console.log(`URL immagine trovato: ${imgUrl}`); // Debug: stampa l'URL dell'immagine

              const imgName = path.basename(imgUrl, path.extname(imgUrl)) + '.jpg';
              const imgPath = path.join(imageDir, imgName);
              this.downloadImage(imgUrl, imgPath).then(() => {
                console.log(`Immagine salvata in: ${imgPath}`);
              }).catch(err => {
                console.error(`Errore nel salvataggio dell'immagine: ${err}`);
              });
            }
          });
        } else {
          console.log(`Elemento <article> non trovato in: ${url}`);
        }
      } catch (error) {
        console.error(`Errore nel recupero dell'articolo da ${url}:`, error);
      }
    }

    await browser.close();
  }

  async downloadImage(url, filePath) {
    try {
      const response = await axios({
        url,
        responseType: 'stream',
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });
    } catch (error) {
      console.error(`Errore nel download dell'immagine da ${url}:`, error);
    }
  }
}

module.exports = UrlFetcher;
