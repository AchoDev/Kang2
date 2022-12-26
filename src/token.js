
class TokenType {
    static types = Object.freeze({
        NUMBER : 0,
        PLUS : 1,
        MINUS : 2,
        MULTIPLY : 3,
        DIVIDE : 4,
        LPAREN : 5,
        RPAREN : 6,
        ARROW : 7,
        EQ : 8,
        IDENT: 9,
        VARKEY: 10,
        REF: 11,
        STRING: 12,
        FUNCKEY: 13,
        FUNCIDENT: 14,
        FUNCCALL: 15,
        ARG: 16,
        COMMA: 17,
        LCURBR: 18,
        RCURBR: 19,
        RETURN: 20,
        LINEBR: 21,
        LOG: 22
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

class Identifier {
 
    value

    constructor (iValue){
        this.value = iValue
    }

    repr = () => {
        return `[TYP]`
    }
}

module.exports = {TokenType, Token, Identifier}