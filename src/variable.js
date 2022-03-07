class SymbolTable {
    static table = []

    static add(variable) {
        SymbolTable.table.push(variable)
    }
}

class Variable {
    type
    identifier
    value
    constructor(ty, ident, val) {
        this.type = ty
        this.identifier = ident
        this.value = val
    }
}

module.exports = {Variable, SymbolTable}