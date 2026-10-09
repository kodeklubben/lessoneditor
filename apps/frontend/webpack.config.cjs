const { NxAppWebpackPlugin } = require("@nx/webpack/app-plugin");
const { resolve } = require("node:path");

module.exports = (_env, argv) => {
  const production = argv.mode === "production";
  return {
    output: { path: resolve(__dirname, "../../dist/apps/frontend"), publicPath: "/" },
    devServer: {
      host: "localhost",
      port: 4200,
      historyApiFallback: true,
      proxy: [{ context: ["/api"], target: "http://localhost:8080", changeOrigin: true }],
    },
    plugins: [
      new NxAppWebpackPlugin({
        target: "web",
        compiler: "babel",
        main: "./src/main.tsx",
        index: "./src/index.html",
        polyfills: "./src/polyfills.ts",
        tsConfig: "./tsconfig.app.json",
        assets: ["./src/favicon.ico", "./src/assets"],
        styles: ["./src/styles.scss"],
        outputHashing: production ? "all" : "none",
        optimization: production,
        sourceMap: !production,
        extractCss: true,
      }),
    ],
  };
};
