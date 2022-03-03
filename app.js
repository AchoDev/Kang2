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
    const parser = new Parser(tokens)
    tree = parser.parse()
    
    const interpreter = new Interpreter()
    sum = interpreter.interpret(tree)
    
    let rString = ''
    tokens.forEach(element => {
        rString += element.repr()
        rString += '\n'
    })

    console.log(sum)
}

