class SymbolTable {
    static table = []
    localTable = []

    static localTableList = new Map()

    static add(variable) {
        SymbolTable.table.push(variable)
    }

    static newLocalTable(name, table) {
        this.localTableList.set(name, table)
    }

    add(variable) {
        this.localTable.push(variable)
    }
}

class Variable {
    type
    identifier
    value
    scale

    constructor(ty, ident, val, scale) {
        this.type = ty
        this.identifier = ident
        this.value = val
        this.scale = scale
    }
}

class _Function {
    returns
    body
    identifier 

    constructor(ret, ident, bod) {
        this.returns = ret
        this.body = bod
        this.identifier = ident
    }
}

module.exports = {Variable, SymbolTable, _Function}