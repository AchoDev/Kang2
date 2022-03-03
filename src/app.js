const Interpreter = require('./interpreter.js')
const Parser = require('./parser.js')

console.clear()

console.log("\x1b[35m", "Kang-2 CONSOLE")
console.log("\x1b[32m", "Made by Acho Dev")

console.log("\x1b[37m", "")

cLexer = require('./lexer.js')

while(true) {

    const rls = require("readline-sync")
    input = rls.question(">> ")

    const lexer = new cLexer(input)
    const tokens = lexer.createTokens()
    if(tokens != null) {
        const parser = new Parser(tokens)
        const interpreter = new Interpreter()
        tree = parser.parse()
        sum = interpreter.interpret(tree)
        console.log(sum)
    }
    // let rString = ''
    // tokens.forEach(element => {
    //     rString += element.repr()
    //     rString += '\n'
    // })
}

