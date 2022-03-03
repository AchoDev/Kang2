const fs = require('fs');
const path = './src/settings/settings.json'
let rawdata = fs.readFileSync(path);
let settings = JSON.parse(rawdata);

function showNode() {
    if(settings['nodes'] == 'hide') return false
    else return true
}

const processInput = (input) => {
    return input.split(' ')
} 

function changeSetting(raw) {
    input = processInput(raw)
    if(settings[input[1]] != null){
        if(input[2] == "show" || input[2] == "hide"){
            settings[input[1]] = input[2]
            console.log(`All nodes will now '${input[2]}'`)
        } else {
            console.log("The 'nodes' setting can only be 'show' or 'hide'")
        }
    } else {
        console.log(`The '${input[1]}' command does not exist`)
    }

    fs.writeFileSync(path, JSON.stringify(settings), function(err) {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

module.exports = {changeSetting, showNode}