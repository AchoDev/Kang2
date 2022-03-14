const { SubtractNode, MultiplyNode, DivideNode, MinusNode } = require("./nodes")
const { SymbolTable, Variable, _Function } = require("./variable")

class Interpreter {

    currentScale = 'global'

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
                case 'StringNode':
                    result = this.openStringNode(node)
                    break
                case 'FuncCreateNode':
                    result = this.createFunction(node)
                    this.currentScale = node.identifier
                    break
                default:
                    console.log('\x1b[31m', `CRITICAL NODE ERROR: [${node.constructor.name} cannot be interpreted], '\x1b[37m'`)
            }
    
        } catch(err) {
            console.error('\x1b[31m', 'CRITICAL NODE ERROR: [Syntax tree could not be built]', '\x1b[37m')
            console.log(node, "<-- thats the node man thats not working")
            result = null
            console.log(err)
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

    createFunction(node) {
        let result
        if(node.returnNode != null) {
            result = new _Function(this.open(node.returnNode), node.IdentifierNode, null)
        } else {
            result = new _Function(null, node.IdentifierNode, null)
        }
        console.log("RETURN -> " + node.returnNode)
        if(this.currentScale == 'global') SymbolTable.add(result)
        return result
    }

    openStringNode = (node) => node.value  

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