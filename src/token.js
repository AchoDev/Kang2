
class TokenType {
    static types = Object.freeze({
        NUMBER : 0,
        PLUS : 1,
        MINUS : 2,
        MULTIPLY : 3,
        DIVIDE : 4,
        LPAREN : 5,
        RPAREN : 6
    })
}

class Token {

    type
    value

    constructor(tType, tValue) {
        this.type = tType
        this.value = tValue
    }

    repr = () => {
        return `[TYPE:${Object.keys(TokenType.types)[this.type]}, VALUE:${(this.value != null) ? this.value : 'undefined'}]`
    }
    
}

module.exports = {TokenType, Token}