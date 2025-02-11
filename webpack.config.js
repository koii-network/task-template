import path from "path";
import { fileURLToPath } from "url";
import DotenvWebpack from "dotenv-webpack";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  mode: "development",
  entry: "./src/index.ts",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    libraryTarget: "commonjs2",
    clean: true
  },
  target: "node",
  
  resolve: {
    extensions: [".ts", ".js"]
  },
  
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  
  plugins: [
    new DotenvWebpack()
  ],
  devtool: "source-map",
};
