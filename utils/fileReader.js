const fs = require('fs')

// https://bobbyhadz.com/blog/typescript-read-file-contents
function syncReadFile(filename) {
    const result = fs.readFileSync(filename, 'utf-8');
    return result;
}

module.exports = syncReadFile