const fsPromise = require("fs/promises");

module.exports = async (path) => {
  //if (!fs.existsSync('userIndex')) fs.mkdirSync('userIndex');

  await fsPromise.unlink(path, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
