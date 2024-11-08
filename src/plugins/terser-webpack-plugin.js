const TerserWebpackPlugin = require('terser-webpack-plugin');

function terserWebpackPlugin(context, options) {
  return {
    name: 'terser-webpack-plugin',
    configureWebpack(config, isServer) {
      if (!isServer) {
        return {
          optimization: {
            minimize: true,
            splitChunks: {
              chunks: 'all', // Dividi tutti i tipi di chunk per migliorare la suddivisione del codice
            },
            minimizer: [
              new TerserWebpackPlugin({
                terserOptions: {
                  compress: {
                    drop_console: true, // Rimuove i console.log per ridurre la dimensione del bundle
                    drop_debugger: true, // Rimuove i debugger
                    ecma: 2015, // Target ECMAScript 2015 per una compressione più moderna
                    passes: 3, // Aumenta il numero di passate per una compressione più aggressiva
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
                extractComments: false, // Evita l'estrazione dei commenti
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
