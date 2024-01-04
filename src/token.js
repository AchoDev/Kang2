
const TokenType = Object.freeze({
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
    LOG: 22,
    LOOPKEY: 23,
    CONDKEY: 24,
    COLON: 25,
    TYPE: 26,
    MOD: 27,
    TRUE: 28,
    FALSE: 29,
    COMP: 30,
    AND: 31,
    SIZECOMP: 32,
    ELSEIF: 33,
    ELSE: 34,
    INPUT: 35,
    LSQRBR: 36,
    RSQRBR: 37,
    NOT: 38,
    EQNOT: 39,
    DOT: 40,
    STRUCTKEY: 41,
    TOKEN: 42,
})


class Token {

    static currentLine = 0
    static currentChar = 0

    type
    value
    line
    char
    
    constructor(tType, tValue) {
        this.type = tType
        this.value = tValue

        this.line = Token.currentLine
        this.char = Token.currentChar
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