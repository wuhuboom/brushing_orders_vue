module.exports = {
  publicPath: "./",
  assetsDir: "assets",
  productionSourceMap: false,
  lintOnSave: false,
  css: {
    loaderOptions: {
      css: { url: { filter: (url) => !url.startsWith("/") } },
    },
  },
};
