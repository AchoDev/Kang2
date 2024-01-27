
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

    

    findModules() {
        let result = []

        while(this.currentToken.type == TokenType.IMPORT || this.currentToken.type == TokenType.LINEBR) {

            if(this.currentToken.type == TokenType.LINEBR) {
                this.advance()
                continue
            }

            this.advance()
            if(this.currentToken.type != TokenType.IDENT) {
                raiseError(`"${this.currentToken.value}" is not a valid module path`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
            }

            result.push({
                ident: this.currentToken.value,
                line: this.currentToken.line,
            })
            this.advance()
            this.advance()
        }

        return result
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
                this.advance()
                result = this.handleIdent(new nodes.ReferenceNode(value, this.currentToken.line, this.currentToken.char))

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
                    question = new nodes.StringNode(this.currentToken.value)
                } else {
                    question = new nodes.ReferenceNode(this.currentToken.value)
                }
                this.advance()

                if(this.currentToken.type == TokenType.ARROW) {
                    this.advance()
                    result = new nodes.InputNode(this.factor(), question)
                    // this.advance()
                } else {
                    result = new nodes.InputNode(null, question)
                }

                this.advance()

            } else if(this.currentToken.type == TokenType.LOOPKEY) {
                result = this.handleLoop()
            } else if(this.currentToken.type == TokenType.CONDKEY) {
                result = this.handleCondition()
            } else if(this.currentToken.type == TokenType.STRUCTKEY) {
                result = this.createStruct()
                this.advance()
            } else if(this.currentToken.type == TokenType.STATIC) {
                this.advance()
                const line = this.currentToken.line
                const char = this.currentToken.char
                const value = this.currentToken.value
                result = new nodes.StaticNode(this.statement())
                if(!(result.node instanceof nodes.VarAssignNode) && !(result.node instanceof nodes.FuncCreateNode)) {
                    raiseError(`"${value}" is not a valid static statement`, this.text, line, char - value.length, char - 1)
                }
            } else if(this.currentToken.type == TokenType.IMPORT) {
                raiseError("Unexpected import", this.text, this.currentToken.line, this.currentToken.char, this.currentToken.char)
            }
            else {
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
            result = new nodes.ReferenceNode(this.currentToken.value, this.currentToken.line, this.currentToken.char)
            this.advance()
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.EQ)) {
            this.advance()
        } else if (this.currentToken != null && (this.currentToken.type == TokenType.STRING)) {
            result = new nodes.StringNode(this.currentToken.value)
            this.advance()   
        } else if (this.currentToken != null && this.currentToken.type == TokenType.IDENT) {
            const str = this.currentToken.value
            this.advance()
            result = this.handleIdent(str)
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
        } else if(this.currentToken != null && this.currentToken.type == TokenType.ACTIVEREFERENCE) {
            this.advance()
            if(this.currentToken.type != TokenType.IDENT) {
                raiseError(`"${this.currentToken.value}" is not a valid active reference`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
            }
            result = new nodes.ActiveReferenceNode(this.currentToken.value, this.currentToken.line, this.currentToken.char)
            this.advance()
        } else if(this.currentToken != null && this.currentToken.type == TokenType.UNREFERENCED) { 
            this.advance()
            if(this.currentToken.type != TokenType.IDENT) {
                raiseError(`"${this.currentToken.value}" cannot be dereferenced`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
            }
            result = new nodes.DeReferenceNode(this.currentToken.value, this.currentToken.line, this.currentToken.char)
            this.advance()
        }

        return result
    }

    createVar() {
        let result
        this.advance()
        const ident = this.currentToken.value
        const line = this.currentToken.line
        const char = this.currentToken.char
        this.advance()

        let value

        if(this.currentToken.type == TokenType.EQ) {
            this.advance()
            value = this.expr()
            this.advance()
        }

        result = new nodes.VarAssignNode(ident, value, line, char)
        

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

    handleIdent(node) {
        const startChar = this.currentToken.char
        const startLine = this.currentToken.line
        let result
        
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
                    result = new nodes.FuncCallNode(node, args, startLine, startChar)
                    this.advance()
                    return result
                } else {
                    raiseError(`Expected right parenthesis, instead got "${this.currentToken.value}"`, this.text, this.currentToken.line, this.currentToken.char, this.currentToken.char)
                }

                break
            
            case TokenType.EQ:
                this.advance()
                result = new nodes.MutateNode(node, this.expr())
                return result

            case TokenType.LSQRBR:
                this.advance()

                this.skipLineBreaks()

                result = new nodes.ArrayReferenceNode(node, this.expr())

                this.skipLineBreaks()

                if(this.currentToken.type != TokenType.RSQRBR) {
                    raiseError(`Expected right square bracket, instead got: "${this.currentToken.value}"`, this.text, this.currentToken.line, this.currentToken.char, this.currentToken.char)
                }

                this.advance()

                if(this.currentToken.type == TokenType.EQ) {
                    this.advance()
                    result = new nodes.MutateArrayNode(result, this.expr())
                }

                break

            case TokenType.DOT:
                this.advance()
                const prop = this.handleIdent(node)

                result = new nodes.PropertyNode(node, prop, startLine, startChar)

                break

            case TokenType.PLUSEQ:
                this.advance()
                result = new nodes.MutateNode(
                    node,
                    new nodes.AddNode(node, this.expr())
                )

                break
                

            case TokenType.MINUSEQ:
                this.advance()
                result = new nodes.MutateNode(
                    node, 
                    new nodes.SubtractNode(node, this.expr())
                )
                break

            case TokenType.MULEQ:
                this.advance()
                result = new nodes.MutateNode(
                    node,
                    new nodes.MultiplyNode(node, this.expr())
                )
                break

            case TokenType.DIVEQ:
                this.advance()
                result = new nodes.MutateNode(
                    node, 
                    new nodes.DivideNode(node, this.expr())
                )
                break

            case TokenType.INC:
                result = new nodes.MutateNode(
                    node, 
                    new nodes.AddNode(node, new nodes.PlusNode(1))
                )

                this.advance()
                return result
            
            case TokenType.DEC:
                this.advance()
                result = new nodes.MutateNode(
                    node, 
                    new nodes.SubtractNode(node, new nodes.PlusNode(1))
                )
                return result

            default:
                return node
        }

        this.advance()
        if(this.currentToken != null && this.currentToken.type != TokenType.LINEBR) result = this.handleIdent(result)

        return result;
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
        let startStatement
        let condition
        let endStatement

        if(this.currentToken.type == TokenType.VARKEY) {
            this.advance()
            const ident = this.currentToken.value
            this.advance()

            if(this.currentToken.type != TokenType.EQ) {
                raiseError(`"${this.currentToken.value}" is not a valid statement`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
            }

            this.advance()

            const value = this.expr()
            
            if(this.currentToken.type == TokenType.COMMA) {
                this.advance()
            } else if(this.currentToken.type != TokenType.LCURBR) {
                raiseError(`Expected curly bracket, instead got "${this.currentToken.value}"`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
            }

            startStatement = new nodes.VarAssignNode(ident, value, this.currentToken.line, this.currentToken.char)
        }

        condition = this.expr()

        if(this.currentToken.type == TokenType.COMMA) {
            this.advance()
            if(this.currentToken.type == TokenType.LCURBR) {
                raiseError(`Expected statement after comma`, this.text, this.currentToken.line, this.currentToken.char, this.currentToken.char)
            }
        }

        if(this.currentToken.type != TokenType.LCURBR) {   
            endStatement = this.statement()
            if(!(endStatement instanceof nodes.MutateNode || endStatement instanceof nodes.FuncCallNode)) {
                raiseError(`"${this.currentToken.value}" is not a valid statement`, this.text, this.currentToken.line, this.currentToken.char - this.currentToken.value.length, this.currentToken.char)
            }
        } else {
            this.advance()
        }

        const result = new nodes.LoopNode(condition, this.statementSequence(), startStatement, endStatement)

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