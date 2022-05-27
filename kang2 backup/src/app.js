const Interpreter = require('./syntaxtree/interpreter.js')
const Parser = require('./syntaxtree/parser.js')
const getText = require('./testing/readFile.js').getFileText

console.clear()

console.log("\x1b[35m", "Kang-2 CONSOLE")
console.log("\x1b[32m", "Made by Acho Dev")

console.log("\x1b[37m", "")

cLexer = require('./syntaxtree/lexer.js').Lexer

const rawdata = getText()

console.log(rawdata)
const lexer = new cLexer(rawdata) 

const tokens = lexer.createTokens()
console.log(tokens)

const parser = new Parser(tokens)
const tree = parser.parse()

console.log(tree)

console.log("end")

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

