const fs = require('fs');

fs.readFile('file1.txt', (err, file) => {
    console.log(1);
});

fs.readFile('file2.txt', (err, file) => {
    console.log(2);
});

fs.readFile('file3.txt', (err, file) => {
    console.log(3);
});
