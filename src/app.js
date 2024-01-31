const raiseError = require('./syntaxtree/error_handler.js');
const Interpreter = require('./syntaxtree/interpreter.js')
const Parser = require('./syntaxtree/parser.js')
const { SymbolTable } = require('./variable.js')
// const getText = require('./testing/readFile.js').getFileText

const fs = require('fs');

var seconds = new Date().getTime() / 1000;

console.clear()

console.log("\x1b[35m", "Kang-2 CONSOLE")
console.log("\x1b[32m", "Made by AchoDev")

console.log("\x1b[37m", "")

cLexer = require('./syntaxtree/lexer.js').Lexer

// console.log(process.cwd())
// console.log(process.cwd() + "/" + process.argv[2])
const basepath = process.cwd() + "/" + process.argv[2].split("/").slice(0, -1).join("/")
const basemodule = process.argv[2].split("/").slice(-1)[0].split(".")[0]

const modules = {}

function loadModule(path, native = false) {

    if(modules[path] != undefined) return

    modules[path] = {
        name: path,
        loaded: false,
        table: null,
        text: null,
        importedModules: [],
        native: native
    }

    modules[path].importedModules.push(modules["string"]);
    modules[path].importedModules.push(modules["array"]);
    modules[path].importedModules.push(modules["number"]);
    modules[path].importedModules.push(modules["boolean"]);


    let rawdata
    try {
        if(native) rawdata = fs.readFileSync(__dirname + "/../std/" + path + ".kg", "utf-8");
        else rawdata = fs.readFileSync(basepath + "/" + path + ".kg", "utf-8");
    } catch(e) {
        console.log("Error while loading module " + path + ": " + e.message)
        return false
    }

    modules[path].text = rawdata

    // console.log(rawdata)
    const lexer = new cLexer(rawdata)

    const tokens = lexer.createTokens()
    // console.log(tokens)

    // console.log(tree)
    const parser = new Parser(tokens, rawdata)
    parser.findModules().forEach(element => {
        const success = loadModule(element.ident)
        if(!success) raiseError(`Module "${element.ident}" not found`, parser.text, element.line, 0, parser.text[element.line].length)
        modules[path].importedModules.push(modules[element.ident])
    });

    const tree = parser.parse()
    if(process.argv[3] == "-t" && !native) console.log(`Syntax Tree for module "${path}":\n\n`, tree, "\n")


    const interpreter = new Interpreter()

    modules[path].table = interpreter.interpret(tree, parser.text, modules[path].importedModules, path)
    modules[path].loaded = true
    return path
}

loadModule('string', true)
loadModule('array', true)
loadModule('number', true)
loadModule('boolean', true)
loadModule(basemodule)


console.log(`\nruntime: ${((new Date().getTime() / 1000) - seconds).toFixed(3)}s`)
console.log("")

// while(true) {

//     const rls = require("readline-sync")
//     input = rls.question(">> ")

//     const lexer = new cLexer(input)
//     const tokens = lexer.createTokens()
//     if(tokens != null) {
//         const parser = new Parser(tokens)
//         const interpreter = new Interpreter()
//         tree = parser.parse()
//         sum = interpreter.interpret(tree)
//         if(sum != null) console.log(sum)
//     }
//     // let rString = ''
//     // tokens.forEach(element => {
//     //     rString += element.repr()
//     //     rString += '\n'
//     // }
// }

