const fs = require('fs');
const path = require('path');

const ALLOWED_FILE_EXTENSIONS = ['.wav', '.aiff'];

function readFile(event, importId, filePath) {
  fs.stat(filePath, function(err, stats) {
    if (err) {
      event.sender.send('import-read-file-error', importId, filePath);
    } else if (stats.isFile()) {
      // read the file here
      const extension = path.extname(filePath).toLowerCase();

      if (ALLOWED_FILE_EXTENSIONS.indexOf(extension) !== -1) {
        fs.readFile(filePath, function(err, data) {
          if (err) {
            event.sender.send('import-read-file-error', importId, filePath);
          } else {
            event.sender.send('import-read-file-data', importId, filePath, data);
          }
        });
      }
    } else if (stats.isDirectory()) {
      const dirPath = filePath;
      fs.readdir(dirPath, function(err, files) {
        const absPaths = files.map(function(filePath) {
          return path.join(dirPath, filePath);
        });
        absPaths.forEach(function(filePath) {
          readFile(event, importId, filePath);
        });
      });
    }
  });
}

function readImportFiles(event, importId, filePaths) {
  filePaths.forEach(function(filePath) {
    readFile(event, importId, filePath);
  });
}

module.exports = {
  readImportFiles: readImportFiles
};
