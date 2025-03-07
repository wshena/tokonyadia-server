const fs = require('fs');
const path = require('path');

const readJSONFile = (relativeFilePath) => {
  // const filePath = path.join(__dirname, '..', relativeFilePath);
  return new Promise((resolve, reject) => {
    fs.readFile(relativeFilePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        reject(parseError);
      }
    });
  });
};

module.exports = readJSONFile;
