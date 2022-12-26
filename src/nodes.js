
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
    identifierNode

    constructor(returnNode, statementNode, argumentNode, identifierNode) {
        this.returnNode = returnNode
        this.statementNode = statementNode
        this.argumentNode = argumentNode
        this.identifierNode = identifierNode
    }

    repr = () => {
        return `Function body: ${this.statementNodes} Returns: ${this.returnNode}`
    }
}

class FuncCallNode {
    ident
    args

    constructor(identifier, argument) {
        this.ident = identifier
        this.args = argument
    }

    repr = () => `ident: ${ident} args: ${args}`
}

class StatementSequence {
    nodes = []

    add(node) {
        this.nodes.push(node)
    }

    constructor(argNodes) {
        if(argNodes) this.nodes = argNodes
    }

    repr = () => {
        return JSON.stringify(this.nodes, null, 4) 
    }
}

class LogNode {
    node   
    constructor(node) {
        this.node = node
    }
}

class MutateNode {
    ident
    value
    constructor(ident, value) {
        this.ident = ident
        this.value = value
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
    FuncCallNode,
    LogNode,
    MutateNode
}