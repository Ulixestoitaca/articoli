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
                  },
                },
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
