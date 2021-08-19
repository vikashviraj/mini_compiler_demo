var tokenizer     = require('./tokenizer');
var parser        = require('./parser');
var transformer   = require('./transformer');
var codeGenerator = require('./codeGenerator');

/**
* ============================================================================
*                                  (۶* ‘ヮ’)۶”
*                         !!!!!!!!THE COMPILER!!!!!!!!
* ============================================================================
*/
function compiler(input) {
    let tokens = tokenizer(input);
    let ast    = parser(tokens);
    let newAst = transformer(ast);
    let output = codeGenerator(newAst);

    // and simply return the output!
    return output;
}

module.exports = compiler;