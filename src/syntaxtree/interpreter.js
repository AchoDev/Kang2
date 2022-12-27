
const { SubtractNode, MultiplyNode, DivideNode, MinusNode } = require("../nodes")
const { SymbolTable, Variable, _Function } = require("../variable")

class Interpreter {

    interpret(node) {
        return this.open(node, new SymbolTable())
    }

    open(node, localTable) {

        let result
        
        try {

            switch(node.constructor.name) {
                case 'StatementSequence':
                    result = this.openStatementSequence(node, localTable)
                    break
                case 'AddNode':
                    result = this.openAddNode(node, localTable)
                    break
                case 'SubtractNode':
                    result = this.openSubtractNode(node, localTable)
                    break
                case 'MultiplyNode':
                    result = this.openMultiplyNode(node, localTable)
                    break
                case 'DivideNode':
                    result = this.openDivideNode(node, localTable)
                    break
                case 'ModuloNode':
                    result = this.openModuloNode(node, localTable)
                    break
                case 'PlusNode':
                    result = this.openPlusNode(node, localTable)
                    break
                case 'MinusNode':
                    result = this.openMinusNode(node, localTable)
                    break
                case 'VarAssignNode':
                    result = this.createVariable(node, localTable)
                    break
                case 'ReferenceNode':
                    result = this.openReferenceNode(node, localTable)
                    break
                case 'StringNode':
                    result = this.openStringNode(node)
                    break
                case 'FuncCreateNode':
                    result = this.createFunction(node, localTable)
                    break
                case 'FuncCallNode':
                    result = this.callFunction(node, localTable)
                    break
                case 'LogNode':
                    result = this.printValue(node, localTable)
                    break
                case 'MutateNode':
                    result = this.mutateVariable(node, localTable)
                    break
                case 'LoopNode':
                    result =  this.loop(node, localTable)
                    break
                case 'BooleanNode':
                    result = this.openBooleanNode(node)
                    break
                case 'ConditionNode':
                    result = this.checkCondition(node, localTable)
                    break
                case 'CompareNode':
                    result = this.compareValues(node, localTable)
                    break
                case 'AndNode':
                    result = this.andValues(node, localTable)
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

    openBooleanNode = (node) => node.bool

    openStatementSequence(node, localTable) {
        node.nodes.forEach(element => {
            this.open(element, localTable)
        });
    }

    openAddNode(node, localTable) {
        return this.open(node.nodeA, localTable) + this.open(node.nodeB, localTable)
    }

    openSubtractNode(node, localTable) {
        return this.open(node.nodeA, localTable) - this.open(node.nodeB, localTable)
    }

    openMultiplyNode(node, prevSymbolTableList, localTable) {
        return this.open(node.nodeA, localTable) * this.open(node.nodeB, localTable)
    }

    openDivideNode(node, localTable) {
        return this.open(node.nodeA, localTable) / this.open(node.nodeB, localTable)
    }

    openModuloNode(node, localTable) {
        return this.open(node.nodeA, localTable) % this.open(node.nodeB, localTable)
    }

    openPlusNode(node) {
        return node.value
    }

    openMinusNode(node) {
        return -node.value
    }

    compareValues(node, localTable) {
        return this.open(node.nodeA, localTable) == (this.open(node.nodeB, localTable))
    }

    andValues(node, localTable) {
        return this.open(node.nodeA, localTable) && this.open(node.nodeB, localTable)
    }

    openReferenceNode(node, localTable) {
        // console.log("ident: " + node.varName)
        return this.searchSymbol(node.varName, localTable)
    }

    createVariable(node, localTable) {
        localTable.add(new Variable('any', node.nodeA, this.open(node.nodeB)))
        
        return node.nodeB.value
    }

    createFunction(node, localTable) {
        let result
        result = new _Function(node.returnNode, node.identifierNode, node.statementNode, localTable)
        // console.log("RETURN -> " + node.returnNode)
        localTable.add(result)
        return result
    }

    callFunction(node, localTable) {
        // console.log("!!!!  " + JSON.stringify(SymbolTable.get(node.ident)))
        // console.log("!!!  " + SymbolTable.get(node.ident))
        const func = localTable.get(node.ident)
        
        if(!func) {
            console.log(`${node.ident} does not exist`)
        }

        const table = new SymbolTable()
        table.setParent(localTable)

        let result = this.open(func.body, table)
        return result
    }

    loop(node, localTable) {
        for(let i = this.open(node.conditionNode, localTable); i > 0; i--) {
            this.open(node.statementNode, new SymbolTable(localTable))
        }
    }

    openStringNode = (node) => node.value  

    mutateVariable(node, localTable) {
        while(!localTable.mutate(node.ident, this.open(node.value, localTable))) {
            localTable = localTable.parent
            if(!localTable) {
                console.log(`${node.ident} is undefinded`)
                return
            }
        }
        return true
    }

    printValue(node, localTable) {
        console.log(this.open(node.node, localTable))
    }

    checkCondition(node, localTable) {
        if(this.open(node.condition, localTable)) {
            this.open(node.statementNode, new SymbolTable(localTable))
        }
    }

    searchSymbol(_name, table) {
        let result
        // SymbolTable.table.forEach(variable => {
        //     if(_name == variable.identifier) {
        //         // console.log("found  " + variable.value)
        //         result = variable.value
        //     }

        //     // console.log(variable.identifier + "HWHJAKLHJKLHDJKLASHDJKLAHDSKLA")
        // })

        while(table) {
            table.table.forEach(variable => {
                if(_name == variable.identifier) {
                    result = variable.value
                }
            })
            table = table.parent
        }

        if (result != null) return result 

        // console.log("found nothing man  " + JSON.stringify(SymbolTable.table, null, 4))
        return null
    }
}


module.exports = Interpreter