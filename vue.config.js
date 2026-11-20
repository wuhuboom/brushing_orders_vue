const path = require("path");

module.exports = {
  publicPath: "./",
  assetsDir: "assets",
  productionSourceMap: false,
  lintOnSave: false,
  chainWebpack(config) {
    if (process.env.NODE_ENV === "production") {
      config.plugin("copy").tap((args) => {
        args[0].patterns[0].globOptions.ignore.push(
          path.resolve(__dirname, "public/config.js").replace(/\\/g, "/"),
        );
        return args;
      });
    }
  },
};
