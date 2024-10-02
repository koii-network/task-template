import Dotenv from "dotenv-webpack";

export default {
  entry: "./src/index.js",
  target: "node",
  // When uploading to arweave use the production mode
  // mode:"production",
  mode: "development",
  devtool: "source-map",
  optimization: {
    usedExports: false,
  },
  stats: {
    moduleTrace: false,
  },
  node: {
    __dirname: true,
  },
  plugins: [new Dotenv()],
};
