
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
    StringNode
}