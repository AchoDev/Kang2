
const WHITESPACE = ' '
const DIGITS = '0123456789'
const LETTERS = `öabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"'`
const LETTERS_DIGITS = `abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_-`
const QUOTES = `"'`
const BRACKETS = "(){}[]<>"

const { TokenType, Token } = require('../token.js')


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

class Lexer {

    text = ''
    index = 0
    input

    currentLine = 0
    currentCharIndex = 0

    constructor(inputText) {
        this.text = inputText.split('')
        this.input = inputText
        this.advance()

        // console.log(this.text)
    }

    advance() {
        this.currentChar = this.text[this.index]
        this.index++
        this.currentCharIndex++

        Token.currentChar = this.currentCharIndex
        Token.currentLine = this.currentLine
    }

    retreat() {
        this.index--
        this.currentChar = this.text[this.index]
    }

    getCurrentToken() {
        let token

        if(this.currentChar == WHITESPACE){
            this.advance()
        } else if(isIn(this.currentChar, DIGITS)) {
            token = this.generateNumber()
        } else if(isIn(this.currentChar, LETTERS)) {
            token = this.handleString()
        } else if(this.currentChar == undefined) {
            
        }
        else {
            switch(this.currentChar) {
                case '+':
                    this.advance()

                    if(this.currentChar == '=') {
                        this.advance()
                        token = new Token(TokenType.PLUSEQ, "+=")
                        break
                    } else if(this.currentChar == '+') {
                        this.advance()
                        token = new Token(TokenType.INC, "++")
                        break
                    }

                    token = new Token(TokenType.PLUS, "+")
                    break

                case '-':
                    token = this.handleMinus()
                    break

                case '*':
                    this.advance()
                    if(this.currentChar == '=') {
                        this.advance()
                        token = new Token(TokenType.MULEQ, "*=")
                        break
                    }
                    token = new Token(TokenType.MULTIPLY, "*")
                    break

                case '/':
                    this.advance()

                    if (this.currentChar == '/') {
                        while ( !(this.currentChar == '\n' || this.currentChar == null) ) {
                            this.advance()
                        }
                        token = new Token(TokenType.LINEBR, "linebr")
                        this.currentCharIndex = 0
                        Token.currentChar = this.currentCharIndex
                        break
                    } else if(this.currentChar == '=') {
                        this.advance()
                        token = new Token(TokenType.DIVEQ, "/=")
                        break
                    }

                    token = new Token(TokenType.DIVIDE, "/")
                    break

                case '(':
                    this.advance()
                    token = new Token(TokenType.LPAREN, "(")
                    break

                case ')':
                    this.advance()
                    token = new Token(TokenType.RPAREN, ")")
                    break
                
                case '=':
                    this.advance()
                    if (this.currentChar == "=") {
                        token = new Token(TokenType.COMP, COMPARISON_TYPE.EQ)
                        this.advance()
                    }
                    else token = new Token(TokenType.EQ, "=")
                    break
                
                case ',':
                    this.advance()
                    token = new Token(TokenType.COMMA, ",")
                    break
                
                case '{':
                    this.advance()
                    token = new Token(TokenType.LCURBR, "{")
                    break

                case '}':
                    this.advance()
                    token = new Token(TokenType.RCURBR, "}")
                    break
                
                case '\r':
                    this.advance()
                    this.currentCharIndex -= 1
                case '\n':
                    this.advance()
                    token = new Token(TokenType.LINEBR, "linebr")
                    this.currentCharIndex = 0
                    this.currentLine++
                    Token.currentChar = this.currentCharIndex
                    break
                
                case '%':
                    this.advance()
                    token = new Token(TokenType.MOD, "%")
                    break

                case '&':
                    this.advance()
                    if (this.currentChar == "&")  {
                        this.advance()
                        token = new Token(TokenType.COMP, COMPARISON_TYPE.AND)
                    }
                    else token = new Token(TokenType.ACTIVEREFERENCE, "&")
                    break

                case ']':
                    this.advance()
                    token = new Token(TokenType.RSQRBR, "]")
                    break

                case '[':
                    this.advance()
                    token = new Token(TokenType.LSQRBR, "[")
                    break

                case '<':
                    this.advance()
                    token = new Token(TokenType.COMP, COMPARISON_TYPE.LESS)
                    if(this.currentChar == "=") token.value = COMPARISON_TYPE.LESSEQ
                    break

                case '>':
                    this.advance()
                    token = new Token(TokenType.COMP, COMPARISON_TYPE.GREATER)
                    if(this.currentChar == "=") token.value = COMPARISON_TYPE.GREATEREQ
                    break
                
                case "!":
                    this.advance()
                    token = new Token(TokenType.NOT, "!")

                    if(this.currentChar == "=") {
                        this.advance()
                        token = new Token(TokenType.COMP, COMPARISON_TYPE.EQNOT)
                    }
                    break

                case ".":
                    this.advance()
                    token = new Token(TokenType.DOT, ".")
                    break

                case "@":
                    this.advance()
                    token = new Token(TokenType.UNREFERENCED, "@")
                    break

                default:
                    console.log(`character: ${this.currentChar} is undefined`)
                    process.exit(0)
            }

        }

        return token
    }
    
    createTokens() {

        let tokens = []

        while(this.currentChar != null) {
            const token = this.getCurrentToken()
            // console.log(this.currentChar)
            if(token) tokens.push(token)
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

        return new Token(TokenType.NUMBER, parseFloat(numberStr))
    }

    handleString() {
        let string = ""
        let result

        let i = 0

        // todo this is so messy i need to clean this shit up asap

        while(this.currentChar != null && (isIn(this.currentChar, LETTERS_DIGITS) || isIn(this.currentChar, QUOTES))) {
            if(!isIn(this.currentChar, BRACKETS)) {
                // if(isIn(this.currentChar, QUOTES)) console.log("hey ich habe keinen vater")
                if(isIn(this.currentChar, QUOTES)) {
                    const startQuote = this.currentChar;
                    string += this.currentChar
                    this.advance()
                    while(this.currentChar != null) {
                        // if(!isIn(this.currentChar, QUOTES)) {
                        if(!this.currentChar === startQuote) {
                            // console.log(isIn(this.currentChar, QUOTES))
                            string += this.currentChar
                            this.advance()
                            // i++
                            // if(i > 25) break
                        } else {
                            string += this.currentChar
                            this.advance()
                            break
                        }
                    }
                    break
                }
                // console.log(this.currentChar)
                if(this.currentChar != "," && this.currentChar != "\n" && this.currentChar != "\r" && this.currentChar != "\t" && this.currentChar != ".") {
                    string += this.currentChar
                } else {
                    break
                }

                this.advance()
            } else {
                break
            }  
        }

        // console.log("string: " + string)

        if(string == "var") {
            result = new Token(TokenType.VARKEY, string)
        } 
        // else if(isInList(string, SymbolTable.table)) {
        //     result = new Token(TokenType.REF, string)
        //     if(this.currentChar == "(") {
        //         result = new Token(TokenType.FUNCCALL, string)
        //     } else {
        //         // console.log("NOT FUNC --> " + this.text[this.index] + " " + this.index)
        //     }
            // console.log("var has been found inside table")
        // }

        
         else if(string.split('')[0] == "'" || string.split('')[0] == '"') {
            if(string.slice(-1) == "'" || string.slice(-1) == '"') {
                result = new Token(TokenType.STRING, string.slice(1, -1))
            }
        } else {
            switch(string) {
                case 'func':
                    result = new Token(TokenType.FUNCKEY, string)
                    break
                
                case 'return':
                    result = new Token(TokenType.RETURN, string)
                    break
                
                case 'log':
                    result = new Token(TokenType.LOG, string)
                    break
            
                case 'loop':
                    result = new Token(TokenType.LOOPKEY, string)
                    break

                case 'if':
                    result = new Token(TokenType.CONDKEY, string)
                    break

                case 'true':
                    result = new Token(TokenType.TRUE, string)
                    break

                case 'false':
                    result = new Token(TokenType.FALSE, string)
                    break

                case 'elseif':
                    result = new Token(TokenType.ELSEIF, string)
                    break
                
                case 'else':
                    result = new Token(TokenType.ELSE, string)
                    break

                case 'prompt':
                    result = new Token(TokenType.INPUT, string)
                    break

                case 'struct':
                    result = new Token(TokenType.STRUCTKEY, string)
                    break
                
                case 'static':
                    result = new Token(TokenType.STATIC, string)
                    break

                case 'import':
                    result = new Token(TokenType.IMPORT, string)
                    break

                
                
                // case 'namespace':
                //     result = new Token(TokenType.NAMESPACE, string)
                //     break

                default:
                    result = new Token(TokenType.IDENT, string)
            }
        }
        return result
    }

    handleMinus() {
        this.advance()
        let result
        if(this.currentChar == '>') {
            result = new Token(TokenType.ARROW, "->")
            this.advance()
        } else if(this.currentChar == '=') {
            result = new Token(TokenType.MINUSEQ, "-=")
            this.advance()
        } else if(this.currentChar == '-') {
            result = new Token(TokenType.DEC, "--")
            this.advance()
        }
        else {
            result = new Token(TokenType.MINUS, "-")
        }

        return result
    }
}

const COMPARISON_TYPE = Object.freeze({
    EQ: 1,
    EQNOT: 2,
    GREATER: 3,
    LESS: 4,
    GREATEREQ: 5,
    LESSEQ: 6,
    AND: 7
})

module.exports = {isIn, Lexer, COMPARISON_TYPE}