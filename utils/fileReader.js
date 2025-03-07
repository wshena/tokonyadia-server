const fs = require('fs');
const path = require('path');

const readJSONFile = (relativeFilePath) => {
  // Gunakan process.cwd() untuk memastikan path relatif ke root deployment
  const filePath = path.join(process.cwd(), relativeFilePath);
  console.log('Membaca file dari:', filePath, 'Ada?', fs.existsSync(filePath));
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error membaca file:', err);
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        resolve(jsonData);
      } catch (parseError) {
        console.error('Error parse JSON:', parseError);
        reject(parseError);
      }
    });
  });
};

module.exports = readJSONFile;
