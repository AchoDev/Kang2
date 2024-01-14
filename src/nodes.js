

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
    line
    char
    
    constructor(crA, crB, line, char) {
        this.nodeA = crA
        this.nodeB = crB
        this.line = line
        this.char = char
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
    line
    char

    constructor(ref, line, char) {
        this.varName = ref
        this.line = line
        this.char = char
    }

    repr = () => {
        return `ref`
    }
}

class StringNode {
    value
    constructor(val) {
        this.value = val
    }

    repr = () => this.value
}

class ReturnNode {
    value
    constructor(value) {
        this.value = value
    }
}

class FuncCreateNode {
    returnNode = []
    statementNode
    argumentNode = []
    identifierNode

    line
    char

    constructor(returnNode, statementNode, argumentNode, identifierNode, line, char) {
        this.returnNode = returnNode
        this.statementNode = statementNode
        this.argumentNode = argumentNode
        this.identifierNode = identifierNode

        this.line = line
        this.char = char
    }

    repr = () => {
        return `Function body: ${this.statementNodes} Returns: ${this.returnNode}`
    }
}

class FuncCallNode {
    ident
    args
    line
    char

    constructor(identifier, argument, line, char) {
        this.ident = identifier
        this.args = argument
        this.line = line
        this.char = char
    }

    repr = () => `ident: ${ident} args: ${args}`
}

class StructCreateNode {
    identifier
    statementSequence

    line
    char

    constructor(identifier, statementSequence) {
        this.identifier = identifier
        this.statementSequence = statementSequence

        this.line
        this.char
    }
}

// class StructCallCreatorNode {
//     identifier
//     args

//     constructor(identifier, args) {
//         this.identifier = identifier
//         this.args = args
//     }
// }

class PropertyNode {
    ident
    property
    line
    char

    constructor(ident, property, line, char) {
        this.ident = ident
        this.property = property
        this.line = line
        this.char = char
    }
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

class InputNode {
    outputNode
    questionNode
    constructor(output, question) {
        this.outputNode = output
        this.questionNode = question
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

class ModuloNode {
    nodeA
    nodeB

    constructor(dividendNode, divisorNode) {
        this.nodeA = dividendNode
        this.nodeB = divisorNode
    }
}

class LoopNode {
    statementNode
    conditionNode

    constructor(condition, statements) {
        this.conditionNode = condition
        this.statementNode = statements

    }
}

class BooleanNode {
    bool

    constructor(bool) {
        this.bool = bool
    }
}

class ConditionNode {
    condition
    statementNode
    elseNode

    constructor(condition, statements, elseStatement) {
        this.condition = condition
        this.statementNode = statements
        this.elseNode = elseStatement
    }
}

class CompareNode {
    nodeA
    nodeB
    operator
    constructor(nodeA, nodeB, operator) {
        this.nodeA = nodeA
        this.nodeB = nodeB
        this.operator = operator
    }
}

class AndNode {
    nodeA
    nodeB
    constructor(nodeA, nodeB) {
        this.nodeA = nodeA
        this.nodeB = nodeB
    }
}

class ArrayNode {
    array
    constructor(array) {
        this.array = array
    }
}

class ArrayReferenceNode {
    ident
    index
    constructor(ident, index) {
        this.ident = ident
        this.index = index
    }
}

class MutateArrayNode {
    arrayReference
    value
    constructor(arrayReference, value) {
        this.arrayReference = arrayReference
        this.value = value
    }
}

class SizeComparisonNode {
    operator
    nodeA
    nodeB
    constructor(op, nodeA, nodeB) {
        this.operator = op
        this.nodeA = nodeA
        this.nodeB = nodeB
    }
}

class StaticNode {
    node
    constructor(node) {
        this.node = node
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
    StructCreateNode,
    PropertyNode,
    StatementSequence,
    FuncCallNode,
    LogNode,
    InputNode,
    MutateNode,
    ModuloNode,
    LoopNode,
    BooleanNode,
    ConditionNode,
    CompareNode,
    AndNode,
    ReturnNode,
    ArrayNode,
    ArrayReferenceNode,
    MutateArrayNode,
    SizeComparisonNode,
    StaticNode,
}