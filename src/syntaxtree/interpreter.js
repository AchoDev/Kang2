
const { SubtractNode, MultiplyNode, DivideNode, MinusNode, StringNode, VarAssignNode, ReferenceNode, MutateNode, ArrayNode, StaticNode, ActiveReferenceNode, DeReferenceNode, BooleanNode, PlusNode } = require("../nodes")
const { SymbolTable, Variable, _Function, Struct, ActiveReference } = require("../variable")
const rls = require("readline-sync")
const { COMPARISON_TYPE } = require("./lexer")
const raiseError = require("./error_handler")

var clone = require('clone');

const structuredClone = obj => {
  return clone(obj)
};

class Interpreter {

    lines = []

    interpret(node, lines, importedModules, moduleName) {
        this.moduleName = moduleName
        this.lines = lines
        this.importedModules = importedModules
        const table = new SymbolTable()
        this.open(node, table)
        return table
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
                case 'ActiveReferenceNode':
                    result = this.openReferenceNode(node, localTable)
                    break
                case 'DeReferenceNode':
                    result = this.openReferenceNode(node, localTable, true)
                    break
                case 'StringNode':
                    result = this.openStringNode(node)
                    break
                case 'FuncCreateNode':
                    result = this.createFunction(node, localTable)
                    break
                case 'StructCreateNode':
                    result = this.createStruct(node, localTable)
                    break
                case 'FuncCallNode':
                    result = this.callFunction(node, localTable)
                    break
                case 'LogNode':
                    result = this.printValue(node, localTable)
                    break
                case 'InputNode':
                    result = this.getInput(node, localTable)
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
                case 'ReturnNode':
                    result = this.open(node.value, localTable)
                    break
                case 'ArrayNode':
                    result = this.convertArray(node, localTable)
                    break
                case 'ArrayReferenceNode':
                    result = this.getFromArray(node, localTable)
                    break
                case 'MutateArrayNode':
                    result = this.mutateArray(node, localTable)
                    break
                case 'SizeComparisonNode':
                    result = this.compareSizes(node, localTable)
                    break
                case 'PropertyNode':
                    result = this.openProperty(node, localTable)
                    break
                case 'StaticNode':
                    break
                default:
                    console.log('\x1b[31m', `CRITICAL NODE ERROR: [${node.constructor.name} cannot be interpreted], '\x1b[37m'`)
                    process.exit(1)
            }
    
        } catch(err) {
            console.error('\x1b[31m', 'CRITICAL NODE ERROR: [Syntax tree could not be built]', '\x1b[37m')
            console.log(node, "<-- thats the node man thats not working")
            result = null
            console.log(err)
            process.exit(1)
        }

        return result

    }

    

    openBooleanNode = (node) => node.bool

    openStatementSequence(node, localTable) {   
        // node.nodes.forEach(element => {
        //     this.open(element, localTable)
        // });

        for(let element of node.nodes) {

            if(element.constructor.name == 'ReturnNode') {
                return this.open(element, localTable)
            }

            this.open(element, localTable)
        }
        return false
    }

    openAddNode(node, localTable) {
        return this.open(node.nodeA, localTable) + this.open(node.nodeB, localTable)
    }

    openSubtractNode(node, localTable) {
        return this.open(node.nodeA, localTable) - this.open(node.nodeB, localTable)
    }

    openMultiplyNode(node, localTable) {
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
        
        const value1 = this.open(node.nodeA, localTable)
        const value2 = this.open(node.nodeB, localTable)
        
        switch(node.operator) {
            case COMPARISON_TYPE.AND:
                return value1 && value2
            case COMPARISON_TYPE.EQ:
                return value1 == value2
            case COMPARISON_TYPE.EQNOT:
                return value1 != value2
            case COMPARISON_TYPE.GREATER:
                return value1 > value2
            case COMPARISON_TYPE.LESS:
                return value1 < value2
            case COMPARISON_TYPE.GREATEREQ:
                return value1 >= value2
            case COMPARISON_TYPE.LESSEQ:
                return value1 <= value2
        }
    }

    compareSizes(node, localTable) {
        if(node.operator == "<") return this.open(node.nodeA, localTable) < this.open(node.nodeB, localTable)
        else return this.open(node.nodeA, localTable) > this.open(node.nodeB, localTable)
    }

    andValues(node, localTable) {
        return this.open(node.nodeA, localTable) && this.open(node.nodeB, localTable)
    }

    

    // structuredClone = val => {
    //     return JSON.parse(JSON.stringify(val))
    // }
    
    openReferenceNode(node, localTable, allowActiveReference=false) {
        // console.log("ident: " + node.varName)

        let value = this.searchSymbol(node.varName, localTable, node.line, node.char)

        if(value == null) {
            // console.log(node.varName.length)
            raiseError(`"${node.varName}" is not defined`, this.lines, node.line, node.char - node.varName.length - 1, node.char)
        }

        value = value.result

        if(node instanceof ActiveReferenceNode) {
            if(!allowActiveReference) {
                raiseError(`Cannot use active reference in this context`, this.lines, node.line, node.char - node.varName.length - 1, node.char)
            }    

            return new ActiveReference(node.varName)
        }

        if(value instanceof ActiveReference) { 
            return this.open(new ReferenceNode(value.value), localTable)
        }

        return structuredClone(value)
    }


    createVariable(node, localTable) {
        let value
        let type = 'any'

        if(localTable.get(node.nodeA) != null) { 
            raiseError(`Variable "${node.nodeA}" is already defined`, this.lines, node.line, node.char - node.nodeA.length, node.char - 1)
        }
        if(node.nodeB) {
            let table = localTable
            
            if(node.nodeB instanceof ActiveReferenceNode) {
                value = this.openReferenceNode(node.nodeB, localTable, true)
            } else {
                value = this.open(node.nodeB, localTable)
            }

            if(value instanceof Variable) {
                if(value.value.parent !== localTable) table = value.value.parent
                value = structuredClone(value)
                value.value.parent = table
            }

            else if (typeof value === "string") { 
                type = 'string'
            }
        }

        localTable.add(new Variable(type, node.nodeA, value))
    }

    convertArray(node, localTable) {
        const array = []

        for(let value of node.array) {
            array.push(this.open(value, localTable))
        }

        return array
    }

    getFromArray(node, localTable) {
        const array = this.searchSymbol(node.ident, localTable, node.line, node.char).result

        return array[this.open(node.index, localTable)]
    }

    createStruct(node, localTable) {
        const result = new Struct(node.identifier, node.statementSequence)
        result.origin = this.moduleName
        result.staticTable.setParent(localTable)
        for(let element of node.statementSequence.nodes) { 
            if(element instanceof StaticNode) {
                result.staticTable.add(this.open(element.node, result.staticTable))
            }
        }
        localTable.add(result)
        return result
    }

    openProperty(node, localTable) {
        const variable = this.searchSymbol(node.ident, localTable, node.line, node.char)

        if(variable == null) {
            raiseError(`Cannot access property of nonexistent variable "${node.ident}" `, this.lines, node.line, node.char - node.ident.length, node.char)
        }

        if(variable.result instanceof Struct) {
            return this.open(node.property, variable.result.staticTable)
        }

        if(typeof variable.result === 'string') {
            return this.open(node.property, this.importedModules)
        }

        return this.open(node.property, variable.result.value)
    }

    createFunction(node, localTable) {

        let returns = node.returnNode

        if(node.returnNode != null && node.returnNode.constructor.name == "VarAssignNode") {
            node.statementNode.nodes.unshift(node.returnNode)
            returns = new ReferenceNode(returns.nodeA)
        }

        let result
        result = new _Function(returns, node.identifierNode, node.statementNode, node.argumentNode)
        // console.log("RETURN -> " + node.returnNode)
        localTable.add(result)
        return result
    }

    callFunction(node, localTable) {
        
        const func = structuredClone(localTable.get(node.ident))
        
        if(!func) {
            raiseError(`Function or Struct "${node.ident}" is not defined`, this.lines, node.line, node.char - node.ident.length, node.char - 1)
        }

        for(let i = 0; i < node.args.length; i++) {
            func.body.nodes.unshift(new VarAssignNode(func.arguments[i], node.args[i]))
        }

        const table = new SymbolTable()

        table.setParent(localTable)
        
        let result = this.open(func.body, table)
        
        if(func instanceof Struct) {
            table.setParent(func.staticTable.parent)
            result = new Variable(func.identifier, func.identifier, table)
            // result = {}
            
            // func.body.forEach(element => {
            //     result[element.identifier] = element.value
            // })
        }
        
        if(result) {
            return result
        }

        let returns
        if(func.returns) returns = this.open(func.returns, table)


    }

    loop(node, localTable) {

        const table = new SymbolTable(localTable)
        if(node.startStatementNode != null) {
            this.open(node.startStatementNode, table)
        }
        if(node.endStatementNode != null) { 
            node.statementNode.nodes.push(node.endStatementNode)
        }


        if(node.conditionNode instanceof PlusNode) {
            for(let i = this.open(node.conditionNode, table); i > 0; i--) {
                this.open(node.statementNode, table)
            }
            return
        } 
        
        while(this.open(node.conditionNode, table)) {
            this.open(node.statementNode, table)
        }
    }

    openStringNode = (node) => node.value  

    mutateArray(node, localTable) {

        const ident = node.arrayReference.ident
        const newValue = this.open(node.value, localTable)
        const index = this.open(node.arrayReference.index, localTable)

        let updatedArray = this.searchSymbol(ident, localTable, node.line, node.char).result
        updatedArray[index] = newValue
            
        return this.mutateVariable(new MutateNode(ident, updatedArray, true), localTable, true)
    }

    mutateVariable(node, localTable, isConverted=false) {

        const value = isConverted ? node.value : this.open(node.value, localTable) 
        let mutateTarget = node.ident

        const result = this.searchSymbol(node.ident, localTable, node.line, node.char)
        if(result.result instanceof ActiveReference) {
            mutateTarget = result.result.value 
        }

        while(!localTable.mutate(mutateTarget, value)) {
            localTable = localTable.parent
            if(!localTable) {

                raiseError(`Variable "${node.ident}" is not defined`, this.lines, node.line, node.char - node.ident.length, node.char - 1)
            }
        }
        return true
    }

    printValue(node, localTable) {
        const result = this.open(node.node, localTable)
        if(result instanceof ActiveReference) {
            console.log(this.open(new ReferenceNode(result.value), localTable))
            return
        }
        console.log(result)
    }

    getInput(node, localTable) {
        const input = rls.question(this.open(node.questionNode, localTable))
        // const input = "here have me some absolutely beautiful input mate"

        if(node.outputNode == null) return input
        this.mutateVariable({"ident": node.outputNode.varName, "value": new StringNode(input)}, localTable)
        return true
    }

    checkCondition(node, localTable) {
        if(this.open(node.condition, localTable)) {
            this.open(node.statementNode, new SymbolTable(localTable))
        } else if(node.elseNode) {
            this.open(node.elseNode, new SymbolTable(localTable))
        }
    }

    searchSymbol(_name, table, line, char) {
        let result
        let foreignTable
        // SymbolTable.table.forEach(variable => {
        //     if(_name == variable.identifier) {
        //         // console.log("found  " + variable.value)
        //         result = variable.value
        //     }

        //     // console.log(variable.identifier + "HWHJAKLHJKLHDJKLASHDJKLAHDSKLA")
        // })

        let checkedGlobal = false
        do {
            table.table.forEach(variable => {
                if(_name === variable.identifier) {

                    if(variable instanceof Struct) {
                        result = variable
                        return
                    }

                    result = variable.value
                }
            })
            if(table.parent != null) table = table.parent
            else checkedGlobal = true
        } while(!checkedGlobal)

        if (result == null && table.parent == null) {
            this.importedModules.forEach(element => {

                if(element.name == _name) {

                    if(!element.loaded) {
                        raiseError(`Cannot access values of partially initialized module "${_name}"`, this.lines, line, char - _name.length, char - 1)
                    }

                    result = new Struct(_name, null)
                    result.staticTable = element.table
                    foreignTable = element.table
                }
            })
        }
        if (result != null) return {"result": result, "foreignTable": foreignTable}

        return null
    }
}


module.exports = Interpreter