const fs = require('fs')
let rawdata = fs.readFileSync('settings.json');
let settings = JSON.parse(rawdata);

function showNode() {
    if(settings.node == 'hide') return false
    else return true
}

const processInput = (input) => {
    console.log(input.split(' '))
} 

function changeSetting(raw) {
    processInput()

    fs.writeFile('./settings.json', settings, err => {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

module.exports = {changeSetting}