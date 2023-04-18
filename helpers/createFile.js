const fsPromise = require('fs/promises');

module.exports = async (path, data) => {
  //if (!fs.existsSync('userIndex')) fs.mkdirSync('userIndex');

  await fsPromise.writeFile(path, JSON.stringify(data), (err) => {
    if (err) {
      console.error(err);
    }
  });
};
