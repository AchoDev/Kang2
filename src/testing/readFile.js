const fs = require('fs');

function getFileText() {

    const name = 'namespace'
        
    try {
        path = `testing/${name}.kg`
        rawdata = fs.readFileSync(path, "utf-8");
    } catch{
        path = `src/testing/${name}.kg`
        rawdata = fs.readFileSync(path, "utf-8");
    }

    return rawdata
}

module.exports = {getFileText}
