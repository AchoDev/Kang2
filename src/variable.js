

class SymbolTable {
    static table = []
    table = []
    parent

    // static localTableList = new Map()

    // static add(variable) {
    //     SymbolTable.table.push(variable)
    // }

    static newLocalTable(name, table) {
        this.localTableList.set(name, table)
    }

    setParent(parent) {
        this.parent = parent
    }

    add(ident) {
        this.table.push(ident)
    }

    get(name) {
        for(const value of this.table) {
            if(value.identifier == name) return value
        }
        return false
    }

    clear() {
        this.table = []
    }

    static add(variable) {
        this.table.push(variable)
    }

    static get(name) {
        for(const value of SymbolTable.table) {
            if(value.identifier == name) return value
        }
        return false
    }

    mutate(name, newVal) {
        for(const value of this.table) {
            if(value.identifier == name) {
                value.value = newVal
                return true
            }
        }
    }

    static mutate(name, newVal) {
        for(const value of SymbolTable.table) {
            if(value.identifier == name) {
                value.value = newVal
                return true
            }
        }
        return false
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
        // this.parentST = parent
    }
}

module.exports = {Variable, SymbolTable, _Function}