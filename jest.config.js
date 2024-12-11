export default {
    transform: { "^.+\\.tsx?$": "babel-jest" },
    transformIgnorePatterns: ["/node_modules/(?!@babel/runtime)"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
    testEnvironment: "node",
  };
  