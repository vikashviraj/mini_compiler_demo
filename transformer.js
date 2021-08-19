var traverser = require('./traverser');

    /**
    * ============================================================================
    *                                   ⁽(◍˃̵͈̑ᴗ˂̵͈̑)⁽
    *                              THE TRANSFORMER!!!
    * ============================================================================
    */

    /**
    * Our transformer is going to take the ast and pass it to the traverser and for
    * the new AST.
    *
    * ----------------------------------------------------------------------------
    *   Original AST                     |   Transformed AST
    * ----------------------------------------------------------------------------
    *   {                                |   {
    *     type: 'Program',               |     type: 'Program',
    *     body: [{                       |     body: [{
    *       type: 'CallExpression',      |       type: 'ExpressionStatement',
    *       name: 'add',                 |       expression: {
    *       params: [{                   |         type: 'CallExpression',
    *         type: 'NumberLiteral',     |         callee: {
    *         value: '2'                 |           type: 'Identifier',
    *       }, {                         |           name: 'add'
    *         type: 'CallExpression',    |         },
    *         name: 'subtract',          |         arguments: [{
    *         params: [{                 |           type: 'NumberLiteral',
    *           type: 'NumberLiteral',   |           value: '2'
    *           value: '4'               |         }, {
    *         }, {                       |           type: 'CallExpression',
    *           type: 'NumberLiteral',   |           callee: {
    *           value: '2'               |             type: 'Identifier',
    *         }]                         |             name: 'subtract'
    *       }]                           |           },
    *     }]                             |           arguments: [{
    *   }                                |             type: 'NumberLiteral',
    *                                    |             value: '4'
    * ---------------------------------- |           }, {
    *                                    |             type: 'NumberLiteral',
    *                                    |             value: '2'
    *                                    |           }]
    * (sorry the other one is longer 😜) |         }
    *                                    |       }
    *                                    |     }]
    *                                    |   }
    * ----------------------------------------------------------------------------
    */

    // Transformer function with the ast as params
    function transformer(ast) {

        // A new AST with initalization
        let newAst = {
            type: 'Program',
            body: [],
        };

        // We are going to pass a property called context to the node which keeps the reference
        // to the parent
        ast._context = newAst.body;

        // Let's call the traverser function with ast and our visitor
        traverser(ast, {
            // Take care of NumberLiteral
            NumberLiteral: {
                // We'll visit them on enter.
                enter(node, parent) {
                        // create a node call 'NumberLiteral' that will push the parent context.
                        parent._context.push({
                            type: 'NumberLiteral',
                            value: node.value,
                        });
                    },
            },

            // Let's do the same for `StringLiteral`
            StringLiteral: {
                enter(node, parent) {
                    parent._context.push({
                        type: 'StringLiteral',
                        value: node.value,
                    });
                },
            },

            // So `CallExpression` should be taken care like this.
            CallExpression: {
                enter(node, parent) {

                    //  create a `CallExpression` node with a nested `Identifier`.
                    let expression = {
                        type: 'CallExpression',
                        callee: {
                            type: 'Identifier',
                            name: node.name,
                        },
                        arguments: [],
                    };

                    // Let's create a new context for the original 'CallExpression' so that we can push
                    // arguments 
                    node._context = expression.arguments;

                    // Ceck the parent node is a `CallExpression` if it is not then
                    if (parent.type !== 'CallExpression') {

                        // wrap our `CallExpression` node with an `ExpressionStatement`. 
                        // This is done because the top level `CallExpression` in JavaScript are actually 
                        // statements.
                        expression = {
                            type: 'ExpressionStatement',
                            expression: expression,
                        };
                    }

                    // Lat but not the least wrap the expression with the parent context
                    parent._context.push(expression);
                },
            }
        });

        // return the new AST
        return newAst;
    }

    // export transformer 
    module.exports = transformer;