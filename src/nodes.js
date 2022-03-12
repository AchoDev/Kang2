
class PlusNode {
    value

    constructor(num) {
        this.value = num
    }

    repr = () => {
        return value
    }
}

class MinusNode {
    value

    constructor(num) {
        this.value = num
    }

    repr = () => {
        return value
    }
}

class AddNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} + ${nodeB}`
    }
}

class SubtractNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} - ${nodeB}`
    }
}

class MultiplyNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} * ${nodeB}`
    }
}

class DivideNode {
    nodeA
    nodeB

    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `${nodeA} / ${nodeB}`
    }
}

class VarAssignNode {
    nodeA
    nodeB
    
    constructor(crA, crB) {
        this.nodeA = crA
        this.nodeB = crB
    }

    repr = () => {
        return `var ${nodeA} = ${nodeB}`
    }
}

class IdentifierNode {
    identity

    constructor(val) {
        this.identity = val
    }

    repr = () => {
        return `${identity}`
    }
}

class ReferenceNode {
    varName

    constructor(ref) {
        this.varName = ref
    }

    repr = () => {
        return `Ref: ${varName}`
    }
}

class StringNode {
    value
    constructor(val) {
        this.value = val
    }

    repr = () => this.value
}

class FuncCreateNode {
    returnNode = []
    statementNode
    argumentNode = []
    symbolTable

    constructor(rNode, sNodes, aNodes, tb) {
        this.returnNode = rNode
        this.statementNodes = sNodes
        this.argumentNode = aNodes
        this.symbolTable = tb

        console.log(`constructor return: ${rNode} statement: Null argument: ${aNodes}`)
    }

    repr = () => {
        return `Function body: ${this.statementNodes} Returns: ${this.returnNode}`
    }
}

class StatementSequence {
    nodes = []

    add(node) {
        this.nodes.push(node)
    }

    constructor(argNodes) {
        this.nodes = argNodes
    }

    repr = () => {
        return JSON.stringify(this.nodes, null, 4)
    }
}

module.exports = {
    PlusNode, 
    MinusNode, 
    AddNode, 
    SubtractNode, 
    MultiplyNode, 
    DivideNode, 
    VarAssignNode, 
    IdentifierNode, 
    ReferenceNode,
    StringNode,
    FuncCreateNode,
    StatementSequence,
}