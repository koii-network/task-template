module.exports={
    entry:"./index.js",
    target: 'node',
    mode: "development",
    devtool: 'source-map',
    optimization: {
        usedExports: false,
    },
    stats:{
      moduleTrace:false
    },
    node:{
      __dirname: true
    }
}