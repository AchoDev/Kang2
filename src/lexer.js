
const WHITESPACE = ' '
const DIGITS = '0123456789'
const LETTERS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
const LETTERS_DIGITS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const fToken = require('./token.js')
const settings = require('./settings/settings.js')
const keywords = require('./enum.js').KeyWord
const SymbolTable = require('./variable.js').SymbolTable


const isIn = (char, rawarr) => {
    arr = rawarr.split('')
    for(let i = 0; i < arr.length; i++) {
        if(arr[i] == char) {return true}
    }
    return false
}

const isInList = (key, list) => {
    for(let i = 0; i < list.length; i++) {
        if(list[i].identifier == key) return true
        // console.log(`key: ${key} -- list: ${JSON.stringify(list[0], null, 4)}`)
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
            } else if(isIn(this.currentChar, LETTERS)) {
                tokens.push(this.handleString())
            } else if(this.currentChar == '+') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.PLUS))
            } else if(this.currentChar == '-') {
                const res = this.handleMinus()
                if(res == 1) return null
                else tokens.push(res)
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
            } else if(this.currentChar == '=') {
                this.advance()
                tokens.push(new fToken.Token(fToken.TokenType.types.EQ))
            }
            
            else {
                console.log(`big error man stop using ${this.currentChar} ok?`)
                return null
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

    handleString() {
        let string = ""
        let result

        let i = 0

        while(this.currentChar != null && (isIn(this.currentChar, LETTERS_DIGITS) || this.currentChar != WHITESPACE)) {
            string += this.currentChar
            this.advance()
            // console.log(this.currentChar)
            i++
            if(i == 20) break
        }

        if(string == "var") {
            result = new fToken.Token(fToken.TokenType.types.VARKEY)
        } else if(isInList(string, SymbolTable.table)) {
            result = new fToken.Token(fToken.TokenType.types.REF, string)
            // console.log("var has been found inside table")
        } else {
            result = new fToken.Token(fToken.TokenType.types.IDENT, string)
            // console.log("think its an identifier thats the string ----->" + string)
        }

        return result
    }

    handleMinus() {
        this.advance()
        let result
        if(this.currentChar == 's') {
            settings.changeSetting(this.input)
            return 1
        } else if(this.currentChar == '>') {
            result = new fToken.Token(fToken.TokenType.types.ARROW)
        }
        else {
            result = new fToken.Token(fToken.TokenType.types.MINUS)
        }

        return result
    }
}