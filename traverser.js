/**
* ============================================================================
*                                 ⌒(❀>◞౪◟<❀)⌒
*                               THE TRAVERSER!!!
* ============================================================================
*/

/**
* So our traverser function will accept an AST and also a visior node this visitor
* node method will be used for performing a mapping with the AST nodes.
*
*   traverse(ast, {
*     Program: (node, parent) => {
*       //do something here
*     },
*
*     CallExpression: (node, parent) => {
*       //do something here
*     },
*
*     NumberLiteral: (node, parent) => {
*      //do something here
*     },
*   });
*/
function traverser(ast, visitor) {

    // Iterates over the array and call the next function traverseNode with reference 
    // to the parent.
    function traverseArray(array, parent) {
        array.forEach(child => {
            traverseNode(child, parent);
        });
    }

    // accepts a node and parent so that it can pass both to our visitor methods
    function traverseNode(node, parent) {

        // We start by testing for the existence of a method on the visitor with a
        // matching `type`.
        let methods = visitor[node.type];

        // If there is an `enter` method for this node type we'll call it with the
        // `node` and its `parent`.
        if (methods && methods.enter) {
            methods.enter(node, parent);
        }

        // Next we are going to split things up by the current node type.
        switch (node.type) {

            // Let's start with the 'Program' array and then call the traverseArray 
            // method for the body node
            case 'Program':
                traverseArray(node.body, node);
                break;

            // Next we take care of 'CallExpression' since 'CallExpressions' have params
            // we will pass that as the array params.
            case 'CallExpression':
                traverseArray(node.params, node);
                break;

            // `NumberLiteral` and `StringLiteral` We don't have anything to do so we just break
            case 'NumberLiteral':
            case 'StringLiteral':
                break;

            // If node type is not recognized we simply throw an error
            default:
                throw new TypeError(node.type);
        }

        // if `exit` method is encountered for this node type we'll call it with the
        // `node` and its `parent`.
        if (methods && methods.exit) {
            methods.exit(node, parent);
        }
    }

    // Let's call the traverserNode function with the parent parameter as null 
    // because the top level does not have a parent
    traverseNode(ast, null);
}

// exporting the traverser method
module.exports = traverser;