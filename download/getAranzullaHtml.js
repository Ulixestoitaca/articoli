const UrlFetcher = require('./UrlFetcher');

async function main() {
  const url = "https://www.aranzulla.it/computer/audio-e-musica/convertire-audio";
  const fetcher = new UrlFetcher(url);
  
  const urls = await fetcher.fetchUrls();
  if (urls.length > 0) {
    await fetcher.saveArticles(urls);
  } else {
    console.log("Nessun URL trovato.");
  }
}

main();
