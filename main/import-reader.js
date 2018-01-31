const fs = require('fs');
const path = require('path');

const ALLOWED_FILE_EXTENSIONS = ['.wav', '.aiff'];

function readFile(event, importId, filePath) {
  fs.readFile(filePath, function(err, data) {
    if (err) {
      event.sender.send('import-read-file-error', importId, filePath);
    } else {
      event.sender.send('import-read-file-data', importId, filePath, data);
    }
  });
}

function flattenPaths(filePaths) {
  return new Promise(function(resolve, reject) {
    const promises = filePaths.map(function(filePath) {
      return new Promise(function(resolve, reject) {
        fs.stat(filePath, function(err, stats) {
          if (err) {
            resolve({error: filePath});
          } else if (stats.isFile()) {
            resolve({file: filePath});
          } else if (stats.isDirectory()) {
            const dirPath = filePath;
            fs.readdir(dirPath, function(err, files) {
              if (err) {
                resolve({error: dirPath});
              } else {
                const absPaths = files.map(function(filePath) {
                  return path.join(dirPath, filePath);
                });
                flattenPaths(absPaths).then(function(result) {
                  resolve({
                    files: result.files,
                    errors: result.errors
                  });
                });
              }
            });
          }
        });
      });
    });

    Promise.all(promises).then(function(values) {
      const files = [];
      const errors = [];

      values.forEach(function(value) {
        if (value.error) {
          errors.push(value.error);
        } else if (value.file) {
          files.push(value.file);
        } else {
          files.push.apply(files, value.files);
          errors.push.apply(errors, value.errors);
        }
      });

      resolve({
        files: files,
        errors: errors
      });
    });
  });
}

function filterFilenames(filePaths) {
  return filePaths.filter(function(filePath) {
    const extension = path.extname(filePath).toLowerCase();
    return ALLOWED_FILE_EXTENSIONS.indexOf(extension) !== -1;
  });
}

function readImportFiles(event, importId, filePaths) {
  flattenPaths(filePaths).then(function(results) {
    const files = filterFilenames(results.files);
    const errors = results.errors;

    event.sender.send('import-read-files-stats', importId, files, errors);
    files.forEach(function(filePath) {
      readFile(event, importId, filePath);
    });
  });
}

module.exports = {
  readImportFiles: readImportFiles
};
