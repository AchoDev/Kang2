

class SymbolTable {
    static table = []
    table = []
    parent

    constructor(parent) {
        this.parent = parent
    }

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

        let curTable = this

        while(curTable) {
            for(const value of curTable.table) {
                if(value.identifier == name) return value
            }
            curTable = curTable.parent   
        }
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
    arguments

    constructor(returns, identifier, body, args) {
        this.returns = returns
        this.body = body
        this.identifier = identifier
        this.arguments = args
    }
}

class Struct {
    identifier
    body
    staticTable

    initialized = true
    

    constructor(identifier, body) {
        this.identifier = identifier
        this.body = body
        this.staticTable = new SymbolTable()
    }
}

module.exports = {Variable, SymbolTable, _Function, Struct}