    /**
    * ============================================================================
    *                               ヾ（〃＾∇＾）ﾉ♪
    *                            THE CODE GENERATOR!!!!
    * ============================================================================
    */

    /**
    * Our CodeGenerator is going to call itself recursively to to print a string 
    * The code generator is quite straight forward to understand
    */

   function codeGenerator(node) {

    // We'll break things down by the `type` of the `node`.
    switch (node.type) {

        case 'Program':
            return node.body.map(codeGenerator)
                .join('\n');

        // For `ExpressionStatement` call the codegenerator function and add a semicolon
        case 'ExpressionStatement':
            return (
                codeGenerator(node.expression) +
                ';'
            );

        // For `CallExpression` we will print the `callee`, and call the codeGenerator
        // recursively so that the end result of recursion is going to be a string 
        // the arguments are concatenated as shown below
        case 'CallExpression':
            return (
                codeGenerator(node.callee) +
                '(' +
                node.arguments.map(codeGenerator)
                .join(', ') +
                ')'
            );

        // For identifier we will return the name
        case 'Identifier':
            return node.name;

        // For `NumberLiteral` let's return the value
        case 'NumberLiteral':
            return node.value;

        // For `StringLiteral` we just add quotes arround the value
        case 'StringLiteral':
            return '"' + node.value + '"';

        // And if we haven't recognized the node, we'll throw an error.
        default:
            throw new TypeError(node.type);
    }
}

// export code generator
module.exports = codeGenerator;