const { SubtractNode, MultiplyNode, DivideNode, MinusNode } = require("./nodes")
const { SymbolTable, Variable } = require("./variable")

class Interpreter {

    interpret(node) {
        return this.open(node)
    }

    open(node) {
        
        let result
        
        try {

            switch(node.constructor.name) {
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
                default:
                    console.log('\x1b[31m', `CRITICAL NODE ERROR: [${node.constructor.name} cannot be interpreted]`)
            }
    
        } catch(err) {
            console.error('\x1b[31m', 'CRITICAL NODE ERROR: [Binary tree could not be built]', '\x1b[37m')
            console.log(node, "<-- thats the node man thats not working")
            result = null
        }

        return result

    }

    openAddNode(node) {
        return this.open(node.nodeA) + this.open(node.nodeB)
    }

    openSubtractNode(node) {
        return this.open(node.nodeA) - this.open(node.nodeB)
    }

    openMultiplyNode(node) {
        return this.open(node.nodeA) * this.open(node.nodeB)
    }

    openDivideNode(node) {
        return this.open(node.nodeA) / this.open(node.nodeB)
    }

    openPlusNode(node) {
        return node.value
    }

    openMinusNode(node) {
        return -node.value
    }

    openReferenceNode(node) {
        // console.log("ident: " + node.varName)
        return this.searchSymbol(node.varName)
    }

    createVariable(node) {
        SymbolTable.add(new Variable('any', node.nodeA, this.open(node.nodeB)))
        return node.nodeB.value
    }

    searchSymbol(name) {
        let result
        SymbolTable.table.forEach(variable => {
            if(name == variable.identifier) {
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