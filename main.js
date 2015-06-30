/**
 * Suffix-Tree Implementation for Node.JS
 * Wanko Lukas
 **/

var Ukkonen = require('./libs/Ukkonen');

var parameters = process.argv.slice(2);
text = parameters[0];

var tree = Ukkonen.buildSuffixTree(text);
tree.print();

