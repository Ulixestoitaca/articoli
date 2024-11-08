const TerserWebpackPlugin = require('terser-webpack-plugin');

function terserWebpackPlugin(context, options) {
  return {
    name: 'terser-webpack-plugin',
    configureWebpack(config, isServer) {
      if (!isServer) {
        return {
          optimization: {
            minimize: true,
            minimizer: [
              new TerserWebpackPlugin({
                terserOptions: {
                  compress: {
                    drop_console: true, // Rimuove i console.log per ridurre la dimensione del bundle
                    drop_debugger: true, // Rimuove i debugger
                    ecma: 2015, // Target ECMAScript 2015 per una compressione più moderna
                    passes: 3, // Aumenta il numero di passate per una compressione più aggressiva
                    keep_fargs: false, // Rimuove gli argomenti inutilizzati dalle funzioni
                    keep_classnames: false, // Rimuove i nomi delle classi inutilizzati
                    keep_fnames: false, // Rimuove i nomi delle funzioni inutilizzati
                    reduce_vars: true, // Collassa le variabili usate solo una volta
                  },
                  output: {
                    comments: false, // Rimuove i commenti
                  },
                  mangle: {
                    properties: {
                      regex: /^_/, // Mangla solo le proprietà con un underscore iniziale
                    },
                  },
                },
                extractComments: false, // Impedisce l'estrazione dei commenti in un file separato
              }),
            ],
          },
        };
      }
      return {};
    },
  };
}

module.exports = terserWebpackPlugin;
