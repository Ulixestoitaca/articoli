// src/plugins/webpack-bundle-analyzer.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

function webpackBundleAnalyzerPlugin(context, options) {
  return {
    name: 'webpack-bundle-analyzer',
    configureWebpack(config, isServer) {
      if (!isServer) {
        return {
          plugins: [
            new BundleAnalyzerPlugin({
              analyzerMode: 'static', // Genera un file HTML statico
              reportFilename: 'bundle-report.html', // Nome del file del report
              openAnalyzer: false, // Imposta su true per aprire automaticamente il report
            }),
          ],
        };
      }
      return {};
    },
  };
}

module.exports = webpackBundleAnalyzerPlugin;
