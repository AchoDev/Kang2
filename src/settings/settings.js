const fs = require('fs');
const { SymbolTable } = require('../variable');
let path
let rawdata 

// try {
//     path = 'settings/settings.json'
//     rawdata = fs.readFileSync(path);
// } catch {
//     path = 'src/settings/settings.json'
//     rawdata = fs.readFileSync(path);
// }
let settings = JSON.parse(rawdata);

function showNode() {
    if(settings['nodes'] == 'hide') return false
    else return true
}

function showToken() {
    if(settings['tokens'] == 'hide') return false
    else return true
}

const processInput = (input) => {
    return input.split(' ')
} 

function changeSetting(raw) {
    input = processInput(raw)
    if(settings[input[1]] != null || input[1] == 'exit' || input[1] == 'table'){
        switch(input[1]) {
            case 'nodes':
                if(input[2] == "show" || input[2] == "hide"){
                    settings[input[1]] = input[2]
                    console.log(`All nodes will now '${input[2]}'`)
                } else {
                    console.log("The 'nodes' setting can only be 'show' or 'hide'")
                }
                break
            case 'tokens':
                if(input[2] == "show" || input[2] == "hide"){
                    settings[input[1]] = input[2]
                    console.log(`All tokens will now '${input[2]}'`)
                } else {
                    console.log("The 'tokens' setting can only be 'show' or 'hide'")
                }
                break
            case 'exit':
                console.log("Existing program....")
                process.exit(1)
                break
            case 'table':
                console.log(SymbolTable.table)
                break
        }
    } else {
        console.log(`The '${input[1]}' command does not exist`)
    }

    fs.writeFileSync(path, JSON.stringify(settings, null, 4), function(err) {
        if (err) {
            console.log('Error writing file', err)
        } else {
            console.log('Successfully wrote file')
        }
    })
}

module.exports = {changeSetting, showNode, showToken}