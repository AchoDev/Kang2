
const WHITESPACE = ' '
const DIGITS = '0123456789'
const fToken = require('./token.js')
const settings = require('./settings/settings.js')


const isIn = (char, rawarr) => {
    arr = rawarr.split('')
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == char) {return true}
    }
    return false
}

module.exports = class Lexer {

    text = ''
    index = 0
    input
    constructor(inputText) {
        this.text = inputText.split('')
        this.input = inputText
        this.advance()
    }

    advance() {
        this.currentChar = this.text[this.index]
        this.index++
    }

    createTokens() {

        let tokens = []

        while(this.currentChar != null) {
            if(this.currentChar == WHITESPACE){
                this.advance()
            } else if(isIn(this.currentChar, DIGITS)) {
                tokens.push(this.generateNumber())
            } else if(this.currentChar == '+') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.PLUS))
            } else if(this.currentChar == '-') {
                this.advance()
                if(this.currentChar != 's') {
                    tokens.push(new fToken.Token(fToken.TokenType.types.MINUS))
                } else {
                    settings.changeSetting(this.input)
                    return null
                }
            } else if(this.currentChar == '*') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.MULTIPLY))
            } else if(this.currentChar == '/') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.DIVIDE))
            } else if(this.currentChar == '(') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.LPAREN))
            } else if(this.currentChar == ')') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.RPAREN))
            } 
            
            else {
                console.log(`big error man stop using ${this.currentChar} ok?`)
                break
            }
            
        }

        return tokens
    }

    generateNumber() {
        let decimalPointCount = 0
        let numberStr = this.currentChar
        this.advance()

        while(this.currentChar != null && (this.currentChar == '.' || isIn(this.currentChar, DIGITS))) {
            if(this.currentChar == '.') {
                decimalPointCount++
                if (decimalPointCount > 1) {break}
            }

            numberStr += this.currentChar
            this.advance()
        }

        return new fToken.Token(fToken.TokenType.types.NUMBER, parseFloat(numberStr))
    }
}