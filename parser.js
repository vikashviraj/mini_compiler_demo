/**
 * ============================================================================
*                                 ヽ/❀o ل͜ o\ﾉ
*                                THE PARSER!!!
* ============================================================================
*/

/**
* For our parser take the token array from the output of tokenizer and tranform it to AST
*
*   [{ type: 'paren', value: '(' }, { type:'name', value: 'add'} ...]   =>   { type: 'Program', body: [...] }
*/

// Let's start by defining a function called parser that accepts an array of token
function parser(tokens) {

    // Let's keep a variable called current that will be used as a cursor.
    let current = 0;

    // But this time we're going to use recursion instead of a `while` loop. So we
    // define a `walk` function.
    function walk() {

        // Inside this function let's start by taking the value of the current token
        let token = tokens[current];

        // Let's spilt the each type of token into different nodes
        // starting off with `number` tokens.
        //
        // We test to see if we have a `number` token.
        if (token.type === 'number') {
            // If we have one, we'll increment `current`.
            current++;

            // Return a new AST node called `NumberLiteral` and set value to the 
            // value of our token.
            return { type: 'NumberLiteral', value: token.value };
        }

        // Again let's do the same for a `StringLiteral` node.
        if (token.type === 'string') {
            current++;

            return { type: 'StringLiteral', value: token.value };
        }

        // Next we're going to look for CallExpressions. We start this off when we
        // encounter an open parenthesis.
        if ( token.type === 'paren' && token.value === '(' ) {

            // We'll increment `current` to skip the parenthesis since we don't care
            // about it in our AST.
            token = tokens[++current];

            // we will create a node with the type `CallExpression`, and we're going
            // to set the name as the current token's value since the next token after
            // the open parenthesis is the name of the function.
            let node = {
                type: 'CallExpression',
                name: token.value,
                params: [],
            };

            // We increment `current` *again* to skip the name token.
            token = tokens[++current];

            // Next we would like to add each token as `params` for the `CallExpression` till we
            // encounter a closing params.
            //
            // For this let's make use of Recursion instead of infinitely looping on each result.
            //
            // To explain this let's look at the LISP snippet below which includes multiple paranthesis.
            //
            //   (add 2 (subtract 4 2))
            //
            // The token array will have multiple nested paranthesis as well
            //
            //   [
            //     { type: 'paren',  value: '('        },
            //     { type: 'name',   value: 'add'      },
            //     { type: 'number', value: '2'        },
            //     { type: 'paren',  value: '('        },
            //     { type: 'name',   value: 'subtract' },
            //     { type: 'number', value: '4'        },
            //     { type: 'number', value: '2'        },
            //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
            //     { type: 'paren',  value: ')'        }, <<< Closing parenthesis
            //   ]
            //
            // We're going to rely on the nested `walk` function to increment our
            // `current` variable past any nested `CallExpression`.

            // So we create a `while` loop that will continue until it encounters a
            // token with a `type` of `'paren'` and a `value` of a closing
            // parenthesis.
            while (
                (token.type !== 'paren') ||
                (token.type === 'paren' && token.value !== ')')
            ) {
                // we'll call the `walk` function which will return a `node` and we'll
                // push it into our `node.params`.
                node.params.push(walk());
                token = tokens[current];
            }

            // Finally we will increment `current` one last time to skip the closing
            // parenthesis.
            current++;

            // And return the node.
            return node;
        }

        // Again, if we haven't recognized the token type by now we're going to
        // throw an error.
        throw new TypeError(token.type);
    }

    // Now, we're going to create our AST which will have a root which is a
    // `Program` node.
    let ast = {
        type: 'Program',
        body: [],
    };

    // And we're going to kickstart our `walk` function, pushing nodes to our
    // `ast.body` array.
    //
    // The reason we are doing this inside a loop is because our program can have
    // `CallExpression` after one another instead of being nested.
    //
    //   (add 2 2)
    //   (subtract 4 2)
    //
    while (current < tokens.length) {
        ast.body.push(walk());
    }

    // At the end of our parser we'll return the AST.
    return ast;
}

// Just exporting our parser to be used in the final compiler...
module.exports = parser;