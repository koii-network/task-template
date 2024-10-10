export default {
  transform: { "^.+\\.jsx?$": "babel-jest" },
  transformIgnorePatterns: ["/node_modules/(?!@babel/runtime)"],
};
