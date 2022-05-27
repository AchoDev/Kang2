
const TokenType = require("../token.js").TokenType
const nodes = require("../nodes.js")
const { Token } = require("../token.js")
const settings = require("../settings/settings.js")
const { SymbolTable, Variable } = require("../variable.js")
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

    raiseSyntaxError(syntax) {
        console.log(`Syntax error: ${syntax} is missing`)
    }

    advance() {
        this.currentToken = this.tokens[this.index]
        this.index++
    }

    parse() {
        return this.statementSequence()
    }

    statementSequence() {

        let result = new nodes.StatementSequence()

        if(this.currentToken == null) {
            return null
        }
        
        
        while(this.currentToken && this.currentToken.type != TokenType.types.RCURBR) {
            if(!this.currentToken) break
            const statement = this.statement()
            if(statement) result.add(statement)
        }

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
        while(this.currentToken.type != TokenType.types.LINEBR) {
            // console.log("ITS Not null !")
            if(!this.currentToken) break
            if(this.currentToken.type == TokenType.types.VARKEY) {
                console.log("creating var")
                result = this.createVar()

                // console.log("creating var")
                return result
            } else if(this.currentToken.type == TokenType.types.FUNCKEY) {
                result = this.createFunc()
                this.advance()
                return result
            } else if(this.currentToken.type == TokenType.types.IDENT) {
                result = this.handleIdent()
                this.advance()
                return result
            } else {
                this.raiseError(this.currentToken.value)
                return null
            } 
            // else {
            //     result = this.expr()
            //     // console.log(JSON.stringify(result, null, 4) + " HELLO I AM MAn")
            //     this.advance()
            //     // console.log("EXPreSSION")
            // }
        } if(this.currentToken.type == TokenType.types.LINEBR) {
            this.advance()
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
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.types.FUNCCALL)) {
            // let args = []
            // while(this.currentToken != TokenType.types.RPAREN) {
            //     args.push 
            // }



            console.log("FUNCCALL NODE")
            let args = []

            result = new nodes.FuncCallNode(this.currentToken.value, null)
            this.advance()
            
            // check if left bracket after funccall node
            if(this.currentToken != TokenType.types.LPAREN) this.raiseError("left bracket is missing")
            this.advance()

            if(this.currentToken != TokenType.types.RPAREN) this.raiseError("right bracket missing (parameters are disabled due to maintenance)")

            // get all parameters inside brackets

            // while(this.currentToken != TokenType.types.RPAREN) {
            //     if(this.currentToken == ident) {
            //         args.push(this.currentToken.value)
            //     }
            //     this.advance()
            //     if(
            //         this.currentToken != TokenType.types.COMMA &&
            //         this.currentToken != TokenType.types.RPAREN
            //         ) this.raiseError("comma missing man")
            //     else this.advance()
            // }

            this.advance()
        }
        console.log("RESULT: " + result)
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

        let result // function as tree
        let args = [] // parameters (still working on that)
        let funcReturn // what the function returns
        // let varList = [] 

        this.advance() // current token -> func
        const ident = this.currentToken.value // getting identifier

        this.advance() // current token -> (
        if(this.currentToken.type == TokenType.types.LPAREN) { // checking if ()
            this.advance() 
            while(this.currentToken.type != TokenType.types.RPAREN) { // checking if ()
                if(this.currentToken.type == TokenType.types.IDENT) { // getting all arguments 
                    args.push(this.currentToken.value) // if arg is found push into args list
                    this.advance()
                    if(this.currentToken.type == TokenType.types.COMMA) { // check for comma
                        this.advance()
                    } else if(this.currentToken.type == TokenType.types.RPAREN) { // if right parenthesis break
                        break
                    } else {
                        this.raiseError("NO COMMA type: " + this.currentToken.type) // check for comma error
                    }
                } else if(this.currentToken.type == TokenType.types.COMMA) { // check for comma error
                    this.raiseError("WRONG COMMA")
                    break
                }
            }

            // for(let i; i < args.length; i++) {
            //     varList.push(new Variable("any", args[i], null, ident))
            // }

            // SymbolTable.newLocalTable(ident, varList)

            // current -> right parenthesis

            // const switchIdent = () => {  // manually changes all variables that are returned from ident to ref (very bad)
            //     let newIndex = this.index
            //     let newCurrent = this.tokens[newIndex]
            //     let i = 0
            //     // console.log("NEW CURRENT -> " + newCurrent)


            //     const newAdvance = () => {
            //         newIndex++
            //         newCurrent = this.tokens[newIndex]
            //         // console.log(newIndex)
            //         // console.log(`NEW CURRENT: ${JSON.stringify(newCurrent)} --- CURRENT ${JSON.stringify(this.tokens[newIndex])}`)
            //     }
                
            //     while(newCurrent != null) {
            //         // console.log(args.join("") + "SElAM THIS IS ARG JOIN !!" + newCurrent.value)
            //         // console.log("IS IN TRUE OR FALSe => " + isIn(newCurrent.value, args.join("")))
            //         if(newCurrent != null && isIn(newCurrent.value, args.join(""))) {
            //             this.tokens[newIndex].type = TokenType.types.REF
            //         } else if(newCurrent == null) {
            //             break
            //         }

            //         newAdvance()

            //         // console.log("INSIDE WHILE => " + JSON.stringify(newCurrent))
            //         i++
            //         if(i > 20) break
            //     }
            // }

            this.advance()

            if(this.currentToken != null && this.currentToken.type == TokenType.types.ARROW) { // check for return 
                this.advance()
                if(this.currentToken.type == TokenType.types.RETURN) { // check if return keyword is used
                    // switchIdent()
                    
                    this.advance()
                    // console.log(this.currentToken.type)
                    funcReturn = this.statement()
                    // console.log("FUNC RETURN -> " + this.funcReturn)
                    // console.log("HALLO")
                } else {
                    console.log("Type Error: 'return' expected")
                }
            }

            // console.log("args --> " + args)
        }

        // curr -> first statement token (var)

        const funcStatements = this.statementSequence();

        result = new nodes.FuncCreateNode(funcReturn, funcStatements, null, ident)
        // console.log("FUNCCREATENODE: " + JSON.stringify(result, null, 2))

        return result

    }

    handleIdent() {
        const string = this.currentToken.value
        let result

        this.advance()

        if(this.currentToken.type = TokenType.types.LPAREN) {
            this.advance()
            if(this.currentToken.type = TokenType.types.RPAREN) {
                result = new nodes.FuncCallNode(string, null)
                return result
            } else {
                this.raiseSyntaxError("left parenthesis")
            }
        } else {
            this.raiseSyntaxError("just stop")
        }
    }

}

module.exports = Parser