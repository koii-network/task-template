import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export default {
  entry: "./src/index.js",
  target: "node",
  // When uploading to arweave use the production mode
  // mode:"production",
  mode: "development",
  devtool: "source-map",
  resolve: {
    alias: {
      '@_koii/namespace-wrapper': path.resolve(__dirname, 'node_modules/@_koii/namespace-wrapper')
    }
  },
  optimization: {
    usedExports: false,
  },
  stats: {
    moduleTrace: false,
  },
  node: {
    __dirname: true,
  },
};
