const { SubtractNode, MultiplyNode, DivideNode, MinusNode } = require("./nodes")

class Interpreter {

    interpret(node) {
        return this.open(node)
    }

    open(node) {
        
        let result
        
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
            default:
                console.log(`Ciritcal node error [${node.constructor.name} cannot be interpreted]`)
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
}


module.exports = Interpreter