const fs = require('fs');

function getFileText() {
    try {
        path = 'testing/test.kg'
        rawdata = fs.readFileSync(path, "utf-8");
    } catch{
        path = 'src/testing/struct.kg'
        rawdata = fs.readFileSync(path, "utf-8");
    }

    return rawdata
}

module.exports = {getFileText}
