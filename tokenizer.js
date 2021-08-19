/**
 * ============================================================================
*                                   (/^▽^)/
*                                THE TOKENIZER!
* ============================================================================
*/

/**
* the tokenizer is going to take the code and covert it to an array of tokens
*
* (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, { type: 'name', value: 'add'} ...]
*/
function tokenizer(input) {

    // Let's keep a variable called current that will be used as a cursor.
    let current = 0;
    
    // Token array for inserting the tokens.
    let tokens = [];
    
    
    while (current < input.length) {
    
        // Take the current character
        let char = input[current];
    
        // The first thing we want to check for is an open parenthesis. This will 
        // later we will use this for `CallExpression`. As of now we will only take care
        // of the character. if we come across one we push them in the token array with type
        if (char === '(') {
            tokens.push({ type: 'paren', value: '(' });
    
            // Then we increment `current` and continue to the next cycle of the loop
            current++;
            continue;
        }
    
        // Next we're going to check for a closing parenthesis. We do the same exact
        // thing as before.
        if (char === ')') {
            tokens.push({ type: 'paren',value: ')', });
            current++;
            continue;
        }
    
        // Let's check for whitespaces. We need them because whitespace exists to 
        // separate characters, but it isn't actually important for us to store as a token.
        // We would only throw it out later.
        let WHITESPACE = /\s/;
        if (WHITESPACE.test(char)) {
            current++;
            continue;
        }
    
        // Next let us take care of number tokens. It's a bit different because a number can 
        // have a continuous sequence and we need to  capture the entire sequence of characters
        // as one token.
        //
        //   (add 123 456)
        //        ^^^ ^^^
        //        Only two separate tokens
        //
        // So we start this off when we encounter the first number in a sequence.
        let NUMBERS = /[0-9]/;
        if (NUMBERS.test(char)) {
            // We're going to create a `value` string that we are going to push
            // characters to.
            let value = '';
    
            // Loop through the characters in the sequence until we encounter a character that 
            // is not a number. Push each character that is a number to our `value` and 
            // incrementing `current` as we go.
            while (NUMBERS.test(char)) {
                value += char;
                char = input[++current];
            }
    
            tokens.push({ type: 'number', value });
            continue;
        }
    
        // So what about strings then we need to parse the strings as well right. So how do we 
        // do it 🤷‍♀️. You guessed it right we need to look for the start and end of a double quote.
        //
        //   (concat "foo" "bar")
        //            ^^^   ^^^ string tokens
        //
        // The same logic can be applied which we used for numbers numberWe'll start by 
        // checking for the opening quote:
        if (char === '"') {
            // value variable to insert the characters to form the string.
            let value = '';
            char = input[++current];
    
            while (char !== '"') {
                value += char;
                char = input[++current];
            }
    
            char = input[++current];
            tokens.push({ type: 'string', value });
            continue;
        }
    
        // Lastly let's take care of the `name token`. Names are sequence of letters,
        // that are the names of functions in our lisp syntax.
        //
        //   (add 2 4)
        //    ^^^
        //    Name token
        //
        let LETTERS = /[a-z]/i;
        if (LETTERS.test(char)) {
            let value = '';
    
            // Again we're just going to loop through all the letters pushing them to
            // a value.
            while (LETTERS.test(char)) {
                value += char;
                char = input[++current];
            }
            
            tokens.push({ type: 'name', value });
            continue;
        }
    
        // Finally if we have not matched any characters then let's throw the below error
        // and completely exit.
        throw new TypeError('I\'m not really sure what this character is : ' + char);
    }
    
    // Then at the end of our `tokenizer` we simply return the tokens array.
    return tokens;
    }
    
    // export the tokenizer module final compiler...
    module.exports = tokenizer;