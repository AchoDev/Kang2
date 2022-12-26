const { SubtractNode, MultiplyNode, DivideNode, MinusNode } = require("../nodes")
const { SymbolTable, Variable, _Function } = require("../variable")

class Interpreter {

    interpret(node) {
        return this.open(node, null, new SymbolTable())
    }

    open(node, prevSymbolTableList, localTable) {
        
        let result
        
        try {

            switch(node.constructor.name) {
                case 'StatementSequence':
                    result = this.openStatementSequence(node)
                    break
                case 'AddNode':
                    result = this.openAddNode(node)
                    break
                case 'SubtractNode':
                    result = this.openSubtractNode(node)
                    break
                case 'MultiplyNode':
                    result = this.openMultiplyNode(node)
                    break
                case 'DivideNode':
                    result = this.openDivideNode(node)
                    break
                case 'PlusNode':
                    result = this.openPlusNode(node)
                    break
                case 'MinusNode':
                    result = this.openMinusNode(node)
                    break
                case 'VarAssignNode':
                    result = this.createVariable(node)
                    break
                case 'ReferenceNode':
                    result = this.openReferenceNode(node)
                    break
                case 'StringNode':
                    result = this.openStringNode(node)
                    break
                case 'FuncCreateNode':
                    result = this.createFunction(node)
                    break
                case 'FuncCallNode':
                    result = this.callFunction(node)
                    break
                case 'LogNode':
                    result = this.printValue(node)
                    break
                case 'MutateNode':
                    result = this.mutateVariable(node)
                    break
                default:
                    console.log('\x1b[31m', `CRITICAL NODE ERROR: [${node.constructor.name} cannot be interpreted], '\x1b[37m'`)
            }
    
        } catch(err) {
            console.error('\x1b[31m', 'CRITICAL NODE ERROR: [Syntax tree could not be built]', '\x1b[37m')
            console.log(node, "<-- thats the node man thats not working")
            result = null
            // console.log(err)
        }

        return result

    }

    openStatementSequence(node, prevSymbolTableList, localTable) {
        node.nodes.forEach(element => {
            this.open(element, )
        });
    }

    openAddNode(node, prevSymbolTableList, localTable) {
        return this.open(node.nodeA) + this.open(node.nodeB)
    }

    openSubtractNode(node, prevSymbolTableList, localTable) {
        return this.open(node.nodeA) - this.open(node.nodeB)
    }

    openMultiplyNode(node, prevSymbolTableList, localTable) {
        return this.open(node.nodeA) * this.open(node.nodeB)
    }

    openDivideNode(node, prevSymbolTableList, localTable) {
        return this.open(node.nodeA) / this.open(node.nodeB)
    }

    openPlusNode(node) {
        return node.value
    }

    openMinusNode(node) {
        return -node.value
    }

    openReferenceNode(node, prevSymbolTableList, localTable) {
        // console.log("ident: " + node.varName)
        return this.searchSymbol(node.varName)
    }

    createVariable(node, localTable) {
        SymbolTable.add(new Variable('any', node.nodeA, this.open(node.nodeB)))
        
        return node.nodeB.value
    }

    createFunction(node, localTable) {
        let result
        result = new _Function(node.returnNode, node.identifierNode, node.statementNode)
        // console.log("RETURN -> " + node.returnNode)
        SymbolTable.add(result)
        return result
    }

    callFunction(node, prevSymbolTableList, localTable) {
        // console.log("!!!!  " + JSON.stringify(SymbolTable.get(node.ident)))
        // console.log("!!!  " + SymbolTable.get(node.ident))
        return this.open(SymbolTable.get(node.ident).body)
    }

    openStringNode = (node) => node.value  

    mutateVariable(node) {
        if(!SymbolTable.mutate(node.ident, this.open(node.value))) console.log(`${node.ident} is undefinded`)
    }

    printValue(node) {
        console.log(this.open(node.node))
    }

    searchSymbol(_name) {
        let result
        SymbolTable.table.forEach(variable => {
            if(_name == variable.identifier) {
                // console.log("found  " + variable.value)
                result = variable.value
            }

            // console.log(variable.identifier + "HWHJAKLHJKLHDJKLASHDJKLAHDSKLA")
        })

        if (result != null) return result 

        // console.log("found nothing man  " + JSON.stringify(SymbolTable.table, null, 4))
        return null
    }
}


module.exports = Interpreter