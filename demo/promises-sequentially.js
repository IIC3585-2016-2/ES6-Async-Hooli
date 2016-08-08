const Promise = require('promise');
const readFile = Promise.denodeify(require('fs').readFile);

console.log('We will read all files sequentially.');

readFile('file1.txt').then(file1 => {
  console.log('File 1 has been read.');
  return readFile('file2.txt');
}).then(file2 => {
  console.log('File 2 has been read.');
  return readFile('file3.txt');
}).then(file3 => {
  console.log('File 3 has been read.');
}).catch(error => {
  console.log(error);
});
