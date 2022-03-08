
const WHITESPACE = ' '
const DIGITS = '0123456789'
const LETTERS = `öabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"'`
const LETTERS_DIGITS = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789`
const QUOTES = `"'`

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
        if(settings.showToken()) console.log(tokens)
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
        let valStr = false

        let i = 0

        while(this.currentChar != null && (isIn(this.currentChar, LETTERS_DIGITS) || this.currentChar != WHITESPACE)) {
            // console.log(this.currentChar + " hehehhehaw")
            if(isIn(this.currentChar, QUOTES)) {
                while(this.currentChar != undefined) {
                    string += this.currentChar
                    this.advance()
                }
                break
            }
            // console.log(this.currentChar)
            // console.log(this.currentChar)
            i++
            string += this.currentChar
            // if(i == 10) break
            this.advance()
        }

        // console.log("string: " + string)

        if(string == "var") {
            result = new fToken.Token(fToken.TokenType.types.VARKEY)
        } else if(isInList(string, SymbolTable.table)) {
            result = new fToken.Token(fToken.TokenType.types.REF, string)
            // console.log("var has been found inside table")
        } else if(string.split('')[0] == "'" || string.split('')[0] == '"') {
            if(string.slice(-1) == "'" || string.slice(-1) == '"') {
                result = new fToken.Token(fToken.TokenType.types.STRING, string.slice(1, -1))
            }
        } else {
            result = new fToken.Token(fToken.TokenType.types.IDENT, string)
            // console.log("think its an identifier thats the string ----->" + string)
        }
        // console.log("ich bin ein " + JSON.stringify(result))
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