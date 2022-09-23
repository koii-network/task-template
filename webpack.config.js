module.exports={
    entry:"./index.js",
    target: 'node',
    mode:"production",
    optimization: {
        usedExports: false, // <- no remove unused function
    }
}