
const TokenType = require("./token.js").TokenType
const nodes = require("./nodes.js")
const { Token } = require("./token.js")
const settings = require("./settings/settings.js")

class Parser {

    index = 0
    tokens
    currentToken

    constructor(lxTokens) {
        this.tokens = lxTokens
        this.advance()
    }

    raiseError() {
        console.log("hey man stop that you doing wrong")
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
        let result = this.expr()

        if(this.tokens[this.index] != null) {
            this.raiseError()
        }
        if(settings.showNode()) {
            console.log(result)
        }
        return result
    }

    wrExpr(tree) {
        let result = tree
        this.advance()
        if(this.currentToken != null && (this.currentToken.type == TokenType.types.PLUS || this.currentToken.type == TokenType.types.MINUS || this.currentToken.type == TokenType.types.MULTIPLY || this.currentToken.type == TokenType.types.DIVIDE)) {
            if(this.currentToken.type == TokenType.types.MULTIPLY) {
                this.advance()
                result = new nodes.AddNode(tree, this.expr())
            } else if(this.currentToken.type == TokenType.types.DIVIDE) {
                this.advance()
                result = new nodes.SubtractNode(tree, this.expr())
            } else if(this.currentToken.type == TokenType.types.PLUS) {
                this.advance()
                result = new nodes.MultiplyNode(tree, this.expr())
            } else if(this.currentToken.type == TokenType.types.MINUS) {
                this.advance()
                result = new nodes.DivideNode(tree, this.expr())
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
            return result
        } else if(this.currentToken != null && this.currentToken.type == TokenType.types.NUMBER) {
            result = new nodes.PlusNode(this.currentToken.value)
            this.advance()
            return result
        } else if(this.currentToken != null && this.currentToken.type == TokenType.types.MINUS) {
            this.advance()
            result = new nodes.MinusNode(-this.currentToken.value)
            this.advance()
            return result
        }
        this.raiseError()
    }

}

module.exports = Parser