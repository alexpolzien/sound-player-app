import {remote} from 'electron';
const fs = remote.require('fs');
const path = remote.require('path');

export function flattenPaths(filePaths) {
  // takes an array of file paths and flattens them by walking directories
  return new Promise(
    (resolve, reject) => {
      const promises = filePaths.map(
        filePath => new Promise(
          (resolve, reject) => {
            fs.stat(filePath, (err, stats) => {
              if (err) {
                resolve({error: filePath});
              } else if (stats.isFile()) {
                resolve({file: filePath});
              } else if (stats.isDirectory()) {
                const dirPath = filePath;
                fs.readdir(dirPath, (err, files) => {
                  if (err) {
                    resolve({error: dirPath});
                  } else {
                    const absPaths = files.map(file => path.join(dirPath, file));
                    flattenPaths(absPaths).then(({files, errors}) => {
                      resolve({errors, files});
                    });
                  }
                });
              }
            });
          }
        )
      );

      Promise.all(promises).then(values => {
        const results = [];
        const errors = [];

        for (const value of values) {
          if (value.error) {
            errors.push(value.error);
          } else if (value.file) {
            results.push(value.file);
          } else {
            results.push.apply(results, value.files);
            errors.push.apply(results, value.errors);
          }
        }

        resolve({files: results, errors});
      });
    }
  );
}
