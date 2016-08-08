const Promise = require('promise');
const readFile = Promise.denodeify(require('fs').readFile);

console.log('We will try to read a file that doesn\'t exist');

readFile('file1.txt').then(file => {
  console.log('then 1');
  console.log('File 1 has been read.');
  return readFile('file2.txt');
  // return readFile('something.txt');
}).catch(error => {
  console.log('catch 1');
  console.log(error);
  return 'error';
}).then(file => {
  console.log('then 2');
  console.log(file);
  return readFile('something.txt');
}).then(file => {
  console.log('then 3');
  console.log(file);
}).catch(error => {
  console.log('catch 2');
  console.log(error);
});
