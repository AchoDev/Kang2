
const TokenType = require("../token.js").TokenType
const nodes = require("../nodes.js")
const { Token } = require("../token.js")
const settings = require("../settings/settings.js")
const { SymbolTable, Variable } = require("../variable.js")
const { isIn, COMPARISON_TYPE } = require("./lexer.js")
const raiseError = require("./error_handler.js")

class Parser {

    index = 0
    tokens
    currentToken

    text = []

    constructor(lxTokens, rawText) {
        this.tokens = lxTokens
        
        // split the raw text into lines
        this.text = rawText.split(/\r\n|\r|\n/)

        this.advance()
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
        
        
        while(this.currentToken && this.currentToken.type != TokenType.RCURBR) {
            if(!this.currentToken) break
            const statement = this.statement()
            if(statement) result.add(statement)
        }

        // if(this.tokens[this.index] != null) {
        //     this.raiseError()
        //     console.log(`Internal Token error [${JSON.stringify(this.currentToken, null, 4)}]`)
        // }

        if(settings.showNode()) {
            console.log(result)
        }

        return result
    }

    statement() {

        let result
        while(this.currentToken.type != TokenType.LINEBR) {
            // console.log("ITS Not null !")
            if(!this.currentToken) break
            if(this.currentToken.type == TokenType.VARKEY) {
                result = this.createVar()

                // console.log("creating var")
            } else if(this.currentToken.type == TokenType.FUNCKEY) {
                result = this.createFunc()
                this.advance()
            } else if(this.currentToken.type == TokenType.IDENT) {
                const value = this.currentToken.value
                result = this.handleIdent()

                if(result instanceof nodes.ReferenceNode) {
                    raiseError(`"${value}" is not a statement`, this.text, result.line, 0, result.char)
                }
                this.advance()
            } else if(this.currentToken.type == TokenType.LOG) {
                this.advance()
                result = new nodes.LogNode(this.expr())

            } else if(this.currentToken.type == TokenType.RETURN) {
                this.advance()
                result = new nodes.ReturnNode(this.expr())
                this.advance()

            } else if(this.currentToken.type == TokenType.INPUT) {
                this.advance()

                let question

                if(this.currentToken.type == TokenType.STRING) {
                    question = this.currentToken.value
                    this.advance()
                }

                if(this.currentToken.type == TokenType.ARROW) {
                    this.advance()
                    result = new nodes.InputNode(this.factor(), question)
                    this.advance()
                }

                this.advance()

            } else if(this.currentToken.type == TokenType.LOOPKEY) {
                result = this.handleLoop()
            } else if(this.currentToken.type == TokenType.CONDKEY) {
                result = this.handleCondition()
            } else if(this.currentToken.type == TokenType.STRUCTKEY) {
                result = this.createStruct()
                this.advance()
            } else {
                raiseError(`"${this.currentToken.value}" is not a statement`, this.text, this.currentToken.line, 0, this.currentToken.char)
                return null
            } 
            // else {
            //     result = this.expr()
            //     // console.log(JSON.stringify(result, null, 4) + " HELLO I AM MAn")
            //     this.advance()
            //     // console.log("EXPreSSION")
            // }


            return result

        } if(this.currentToken.type == TokenType.LINEBR) {
            this.advance()
        }



        return result
    }
    
    expr() {
        let result = this.term()

        while(this.currentToken != null &&
            (this.currentToken.type == TokenType.PLUS || 
                this.currentToken.type == TokenType.MINUS || 
                this.currentToken.type == TokenType.COMP)) {

            if(this.currentToken.type == TokenType.COMP) {
                let value
                const op = this.currentToken.value
                this.advance()
                if(op == COMPARISON_TYPE.AND) {
                    value = this.expr()
                } else value = this.term()
                result = new nodes.CompareNode(result, value, op)
            } else if(this.currentToken.type == TokenType.PLUS) {
                this.advance()
                result = new nodes.AddNode(result, this.term())
            } else if(this.currentToken.type == TokenType.MINUS) {
                this.advance()
                result = new nodes.SubtractNode(result, this.term())
            }
        }

        return result
    }

    term() {
        let result = this.factor()

        while(this.currentToken != null && (this.currentToken.type == TokenType.MULTIPLY || this.currentToken.type == TokenType.DIVIDE || this.currentToken.type == TokenType.MOD)) {
            if(this.currentToken.type == TokenType.MULTIPLY) {
                this.advance()
                result = new nodes.MultiplyNode(result, this.term())
            } else if(this.currentToken.type == TokenType.DIVIDE) {
                this.advance()
                result = new nodes.DivideNode(result, this.term())
            } else if(this.currentToken.type == TokenType.MOD) {
                this.advance()
                result = new nodes.ModuloNode(result, this.term())
            }
        }

        return result
    }

    factor() {
        let result

        if(this.currentToken != null && this.currentToken.type == TokenType.LPAREN) {
            this.advance()
            result = this.expr()
            this.advance()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.NUMBER) {
            result = new nodes.PlusNode(this.currentToken.value)
            this.advance()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.MINUS) {
            this.advance()
            result = new nodes.MinusNode(-this.currentToken.value)
            this.advance()
        } else if (this.currentToken != null && this.currentToken.type == TokenType.REF) {
            // console.log("hehehhaw " + JSON.stringify(this.currentToken, null, 4))
            result = new nodes.ReferenceNode(this.currentToken.value)
            this.advance()
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.EQ)) {
            this.advance()
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.STRING)) {
            result = new nodes.StringNode(this.currentToken.value)
            this.advance()   
        } else if (this.currentToken != null && this.currentToken.type == TokenType.IDENT) {
            result = this.handleIdent()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.TRUE) {
            result = new nodes.BooleanNode(true)
            this.advance()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.FALSE) {
            result = new nodes.BooleanNode(false)
            this.advance()
        }

        else if(this.currentToken != null && this.currentToken.type == TokenType.LSQRBR) {
            result = this.handleArray()
            this.advance()
        }

        return result
    }

    createVar() {
        let result
        this.advance()
        const ident = this.currentToken.value
        this.advance()

        let value

        if(this.currentToken.type == TokenType.EQ) {
            this.advance()
            value = this.expr()
            this.advance()
        }

        result = new nodes.VarAssignNode(ident, value)
        

        return result
    }

    createStruct() {
        const structLine = this.currentToken.line
        const structEnd = this.currentToken.char

        this.advance()

        if(this.currentToken == null) {
            raiseError("Unexpected struct end", this.text, structLine, 0, structEnd)
        } else if(this.currentToken.type != TokenType.IDENT) {
            raiseError(`"${this.currentToken.value}" is not a valid struct identifier`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
        }

        const structName = this.currentToken.value
        this.advance()
        
        if(this.currentToken.type != TokenType.LCURBR) {
            raiseError("Expected left curly bracket", this.text, this.currentToken.line, this.currentToken.char, this.currentToken.char)
        }

        this.advance()
        
        return new nodes.StructCreateNode(structName, this.statementSequence())
    }

    createFunc() {

        let result // function as tree
        let args = [] // parameters (still working on that)
        let funcReturn // what the function returns
        // let varList = [] 

        this.advance() // current token -> func
        const ident = this.currentToken.value // getting identifier

        this.advance() // current token -> (
        if(this.currentToken.type == TokenType.LPAREN) { // checking if ()
            this.advance() 
            while(this.currentToken.type != TokenType.RPAREN) { // checking if ()
                if(this.currentToken.type == TokenType.IDENT) { // getting all arguments 
                    args.push(this.currentToken.value) // if arg is found push into args list
                    this.advance()
                    if(this.currentToken.type == TokenType.COMMA) { // check for comma
                        this.advance()
                    } else if(this.currentToken.type == TokenType.RPAREN) { // if right parenthesis break
                        break
                    } else {
                        this.raiseError("NO COMMA type: " + this.currentToken.type) // check for comma error
                    }
                } else if(this.currentToken.type == TokenType.COMMA) { // check for comma error
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
            //             this.tokens[newIndex].type = TokenType.REF
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

            if(this.currentToken != null) {
                if(this.currentToken.type == TokenType.ARROW) { // check for return 
                    this.advance()

                    if(this.currentToken.type == TokenType.VARKEY) {
                        this.advance()
                        funcReturn = new nodes.VarAssignNode(this.currentToken.value)
                        this.advance()
                    } else {
                        funcReturn = this.expr()
                    }

                }
                if (this.currentToken.type == TokenType.LCURBR) {
                    this.advance()
                }
            } 

            // console.log("args --> " + args)
        }

        // curr -> first statement token (var)

        const funcStatements = this.statementSequence();

        result = new nodes.FuncCreateNode(funcReturn, funcStatements, args, ident)
        // console.log("FUNCCREATENODE: " + JSON.stringify(result, null, 2))

        return result

    }

    skipLineBreaks() {
        while(this.currentToken != null && this.currentToken.type == TokenType.LINEBR) {
            this.advance()
        }
    }

    handleIdent() {
        const string = this.currentToken.value
        const startChar = this.currentToken.char
        const startLine = this.currentToken.line
        let result

        this.advance()
        
        if(this.currentToken == null) return new nodes.ReferenceNode(string, startLine, startChar) 

        switch(this.currentToken.type) {
            case TokenType.LPAREN:
                this.advance()

                let args = []

                while(this.currentToken.type != TokenType.RPAREN) {
                    args.push(this.expr())
                    if(this.currentToken != null && this.currentToken.type == TokenType.COMMA) {
                        this.advance()
                    }
                }

                if(this.currentToken.type == TokenType.RPAREN) {
                    result = new nodes.FuncCallNode(string, args)
                    return result
                } else {
                    this.raiseSyntaxError("right parenthesis")
                }

                break
            
            case TokenType.EQ:
                this.advance()
                result = new nodes.MutateNode(string, this.expr())
                return result

            case TokenType.LSQRBR:
                this.advance()

                this.skipLineBreaks()

                result = new nodes.ArrayReferenceNode(string, this.expr())

                this.skipLineBreaks()

                if(this.currentToken.type != TokenType.RSQRBR) {
                    console.log("right square bracket missing")
                }

                this.advance()

                if(this.currentToken.type == TokenType.EQ) {
                    this.advance()
                    result = new nodes.MutateArrayNode(result, this.expr())
                }

                return result

            case TokenType.DOT:
                this.advance()
                const prop = this.handleIdent()

                result = new nodes.PropertyNode(string, prop)

                return result

            case TokenType.PLUSEQ:
                this.advance()
                result = new nodes.MutateNode(
                    string, 
                    new nodes.AddNode(new nodes.ReferenceNode(string, startLine, startChar), this.expr())
                )

                // this.advance()
                return result

            case TokenType.MINUSEQ:
                this.advance()
                result = new nodes.MutateNode(
                    string, 
                    new nodes.SubtractNode(new nodes.ReferenceNode(string, startLine, startChar), this.expr())
                )
                return result

            case TokenType.MULEQ:
                this.advance()
                result = new nodes.MutateNode(
                    string, 
                    new nodes.MultiplyNode(new nodes.ReferenceNode(string, startLine, startChar), this.expr())
                )
                return result

            case TokenType.DIVEQ:
                this.advance()
                result = new nodes.MutateNode(
                    string, 
                    new nodes.DivideNode(new nodes.ReferenceNode(string, startLine, startChar), this.expr())
                )
                return result

            case TokenType.INC:
                this.advance()
                result = new nodes.MutateNode(
                    string, 
                    new nodes.AddNode(new nodes.ReferenceNode(string, startLine, startChar), new nodes.PlusNode(1))
                )

                this.advance()

                return result
            
            case TokenType.DEC:
                this.advance()
                result = new nodes.MutateNode(
                    string, 
                    new nodes.SubtractNode(new nodes.ReferenceNode(string, startLine, startChar), new nodes.PlusNode(1))
                )
                return result

            default:
                // raiseError(
                // `"${this.currentToken.value}" is not a valid statement`, 
                // this.text, 
                // this.currentToken.line, 
                // this.currentToken.char - this.currentToken.value.length, 
                // this.currentToken.char
                // )
                this.advance()
                result = new nodes.ReferenceNode(string, startLine, startChar)
                return result
        }
    }

    handleArray() {
        this.advance()

        const array = []

        while(this.currentToken.type != TokenType.RSQRBR) {
            array.push(this.expr())
            if(this.currentToken.type == TokenType.COMMA) {
                this.advance()
            }
        }

        return new nodes.ArrayNode(array)
    }

    handleLoop() {
        this.advance()

        const cond = this.expr()
        this.advance()
        const result = new nodes.LoopNode(cond, this.statementSequence())

        this.advance()

        return result
    }

    handleCondition() {
        this.advance()
        const cond = this.expr()

        while(this.currentToken.type != TokenType.LCURBR) {
            this.advance()
        }
        this.advance()

        const statements = this.statementSequence()

        this.advance()

        let elseNode


        while(this.currentToken.type == TokenType.LINEBR) {
            this.advance()
        }

        if(this.currentToken && this.currentToken.type == TokenType.ELSEIF) {
            elseNode = this.handleCondition()
        } else if(this.currentToken && this.currentToken.type == TokenType.ELSE) {
            
            while(this.currentToken.type != TokenType.LCURBR) this.advance()
            this.advance()
            elseNode = this.statementSequence()
            this.advance()
        }

        const result = new nodes.ConditionNode(cond, statements, elseNode)

        // this.advance()

        return result
    }

}

module.exports = Parser