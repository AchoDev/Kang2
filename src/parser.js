
const TokenType = require("./token.js").TokenType
const nodes = require("./nodes.js")
const { Token } = require("./token.js")
const settings = require("./settings/settings.js")
const { SymbolTable, Variable } = require("./variable.js")
const { isIn } = require("./lexer.js")

class Parser {

    index = 0
    tokens
    currentToken

    constructor(lxTokens) {
        this.tokens = lxTokens
        this.advance()
    }

    raiseError(error) {
        console.log(`Type error: "${error}" was not understood`)
    }

    advance() {
        this.currentToken = this.tokens[this.index]
        this.index++
    }

    parse() {

        if(this.currentToken == null) {
            console.log("penosAAAAAAAAAAAAAA")
            return null
        }
        let result = this.statement()

        if(this.tokens[this.index] != null) {
            this.raiseError()
            console.log(`Internal Token error [${JSON.stringify(this.currentToken, null, 4)}]`)
        }
        if(settings.showNode()) {
            console.log(result)
        }
        return result
    }

    statement() {
        let result
        while(this.currentToken != null) {
            console.log("ITS Not null !")
            if(this.currentToken.type == TokenType.types.VARKEY) {
                result = this.createVar()
                // console.log("creating var")
                this.advance()
            } else if(this.currentToken.type == TokenType.types.FUNCKEY) {
                result = this.createFunc()
                this.advance()
            } else {
                result = this.expr()
                console.log(JSON.stringify(result, null, 4) + " HELLO I AM MAn")
                this.advance()
                console.log("EXPreSSION")
            }
        }

        return result
    }
    
    expr() {
        let result = this.term()

        while(this.currentToken != null && (this.currentToken.type == TokenType.types.PLUS || this.currentToken.type == TokenType.types.MINUS)) {
            if(this.currentToken.type == TokenType.types.PLUS) {
                this.advance()
                result = new nodes.AddNode(result, this.term())
            } else if(this.currentToken.type == TokenType.types.MINUS) {
                this.advance()
                result = new nodes.SubtractNode(result, this.term())
            }
        }

        return result
    }

    term() {
        let result = this.factor()

        while(this.currentToken != null && (this.currentToken.type == TokenType.types.MULTIPLY || this.currentToken.type == TokenType.types.DIVIDE)) {
            if(this.currentToken.type == TokenType.types.MULTIPLY) {
                this.advance()
                result = new nodes.MultiplyNode(result, this.term())
            } else if(this.currentToken.type == TokenType.types.DIVIDE) {
                this.advance()
                result = new nodes.DivideNode(result, this.term())
            }
        }

        return result
    }

    factor() {
        let result

        if(this.currentToken != null && this.currentToken.type == TokenType.types.LPAREN) {
            this.advance()
            result = this.expr()
            this.advance()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.types.NUMBER) {
            result = new nodes.PlusNode(this.currentToken.value)
            this.advance()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.types.MINUS) {
            this.advance()
            result = new nodes.MinusNode(-this.currentToken.value)
            this.advance()
        } else if (this.currentToken != null && this.currentToken.type == TokenType.types.REF) {
            // console.log("hehehhaw " + JSON.stringify(this.currentToken, null, 4))
            result = new nodes.ReferenceNode(this.currentToken.value)
            this.advance()
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.types.EQ)) {
            this.advance()
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.types.STRING)) {
            result = new nodes.StringNode(this.currentToken.value)
            this.advance()   
        }
        return result
    }

    createVar() {
        let result
        this.advance()
        const ident = this.currentToken.value
        this.advance()


        if(this.currentToken.type != TokenType.types.EQ) {
            console.log('\x1b[31m', `TypeError: '=' expected but ${this.currentToken.value} found instead`)
            return null
        }
        
        // console.log("")
        this.advance()
        // if(this.currentToken.type == TokenType.types.STRING) { <-- i don't know why this exists. it cost me 1 hour of my life
        //     result = new nodes.VarAssignNode(ident, new nodes.StringNode(this.currentToken.value))
            
        // } else {
            // console.log("type: " + this.currentToken.type)
            result = new nodes.VarAssignNode(ident, this.expr())
        // }

        // console.log(this.currentToken + " fjskfjsklföejdkaslöfj")
        this.advance()

        return result
    }

    createFunc() {
        let result
        let args = []
        let funcReturn
        let varList = []

        this.advance()
        const ident = this.currentToken
        this.advance()
        console.log(JSON.stringify(this.currentToken, null, 4) + " AHAHAHHH")
        if(this.currentToken.type == TokenType.types.LPAREN) {
            console.log("yeas")
            this.advance()
            while(this.currentToken.type != TokenType.types.RPAREN) {
                if(this.currentToken.type == TokenType.types.IDENT) {
                    args.push(this.currentToken.value)
                    this.advance()
                    console.log("pushing --> " + this.currentToken.value)
                    if(this.currentToken.type == TokenType.types.COMMA) {
                        this.advance()
                        console.log("there is a comma inside")
                    } else if(this.currentToken.type == TokenType.types.RPAREN) {
                        break
                    } else {
                        this.raiseError("NO COMMA type: " + this.currentToken.type)
                    }
                } else if(this.currentToken.type == TokenType.types.COMMA) {
                    this.raiseError("WRONG COMMA")
                    break
                }
            }

            // for(let i; i < args.length; i++) {
            //     varList.push(new Variable("any", args[i], null, ident))
            // }

            // SymbolTable.newLocalTable(ident, varList)

            const switchIdent = () => {
                let newIndex = this.index
                let newCurrent = this.tokens[newIndex]
                let i = 0
                console.log("NEW CURRENT -> " + newCurrent)


                const newAdvance = () => {
                    newIndex++
                    newCurrent = this.tokens[newIndex]
                    // console.log(newIndex)
                    console.log(`NEW CURRENT: ${JSON.stringify(newCurrent)} --- CURRENT ${JSON.stringify(this.tokens[newIndex])}`)
                }
                
                while(newCurrent != null) {
                    console.log(args.join("") + "SElAM THIS IS ARG JOIN !!" + newCurrent.value)
                    console.log("IS IN TRUE OR FALSe => " + isIn(newCurrent.value, args.join("")))
                    if(newCurrent != null && isIn(newCurrent.value, args.join(""))) {
                        this.tokens[newIndex].type = TokenType.types.REF
                    } else if(newCurrent == null) {
                        break
                    }

                    newAdvance()

                    console.log("INSIDE WHILE => " + JSON.stringify(newCurrent))
                    i++
                    if(i > 20) break
                }
            }

            this.advance()

            if(this.currentToken != null && this.currentToken.type == TokenType.types.ARROW) {
                this.advance()
                if(this.currentToken.type == TokenType.types.RETURN) {
                    switchIdent()
                    
                    this.advance()
                    console.log(this.currentToken.type)
                    funcReturn = this.statement()
                    console.log("FUNC RETURN -> " + this.funcReturn)
                    // console.log("HALLO")
                } else {
                    console.log("Type Error: 'return' expected")
                }
            }

            console.log("args --> " + args)
        }

        result = new nodes.FuncCreateNode(funcReturn, null, args)
        console.log("FUNCCREATENODE: " + JSON.stringify(result, null, 2))

        return result

    }

}

module.exports = Parser