const Promise = require('promise');
const readFile = Promise.denodeify(require('fs').readFile);

console.log('We will resolve all promises at once.');

const promises = [readFile('file1.txt'), readFile('file2.txt'), readFile('file3.txt')];
Promise.all(promises).then(files => {
  console.log('Result: ', files);
  console.log('All files have been read.');
});

