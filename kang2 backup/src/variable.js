class SymbolTable {
    // static table = []
    table = []

    // static localTableList = new Map()

    // static add(variable) {
    //     SymbolTable.table.push(variable)
    // }

    static newLocalTable(name, table) {
        this.localTableList.set(name, table)
    }

    add(ident) {
        this.table.push(ident)
    }

    get(ident) {
        table.forEach(element => {
            if(element.identifier == ident) {
                return element
            }
        });
    }

    static get(name) {
        for(const value of SymbolTable.table) {
            if(value.identifier == name) return value
        }
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

    constructor(returns, identifier, body) {
        this.returns = returns
        this.body = body
        this.identifier = identifier
    }
}

module.exports = {Variable, SymbolTable, _Function}