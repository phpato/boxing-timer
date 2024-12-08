const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Configura el publicPath si es necesario
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  
  // Configura la optimización
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  },
  
  // Otras configuraciones que desees agregar
});
