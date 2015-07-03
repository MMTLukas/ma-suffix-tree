// JavaScript has no deep copy function
// So we use this module, to print an adapted copy of the tree

var clone = require('clone');
var fs = require('fs');
var Node = require('./Node');

function Tree(text) {
  //Add virtual root before root, for printing a clear non circular tree
  this.virtualRoot = new Node("virtualRoot");
  this.root = new Node("root", "SIGMA");

  this.root.suffixLink = this.virtualRoot;
  this.virtualRoot.children.push(this.root);

  this.text = text;
}

Tree.prototype.addToRoot = function (node) {
  this.root.children.push(node);
};

/**
 * Prints any node or the tree itself
 * even if the node is a circular object
 *
 * Be warned that Inifinity is printed as null in js anyway
 *
 * @param node: Node to be printed
 */
Tree.prototype.print = function (node) {
  var json = this.convertToJSON(node);
  console.log(json);
};

/**
 * Beginning with the virtual root the tree will be printed
 * Delete property root, because it is a child of the virtual root anyway
 * Delete all suffixes, because we have to avoid circular references
 *
 * @param node: Node to be converted
 */
Tree.prototype.convertToJSON = function (node) {
  node = node || this;

  var tmp = clone(node);

  if (tmp.hasOwnProperty("root")) {
    delete tmp.root;
  }
  if (tmp.hasOwnProperty("suffixLink")) {
    delete tmp.suffixLink;
  }
  var json = JSON.stringify(tmp,
    function (key, value) {
      if (parseInt(key) >= 0) {
        delete value.suffixLink;
      }
      return value;
    }, 2);
  return json;
};

/**
 * LongestRepeatedSubstring of current tree
 * @param n: find the n-th longest repeated substrings
 */
Tree.prototype.findLongestRepeatedSubstrings = function (n, text) {
  var subStrings = [];

  var that = this;
  var traverse = function (node, subString) {
    var tmpSubString;
    if (node.name === "root") {
      tmpSubString = "";
    } else {
      tmpSubString = subString + that.text.substring(node.reference.start - 1, node.reference.end);
    }

    for (var i = 0; i < node.children.length; i++) {
      //Otherwise you get a RangeError: Maximum call stack size exceeded
      var isLeaf = traverse(node.children[i], tmpSubString);
      if (isLeaf && node.name != "root") {
        //if a child is a leaf, than this substring occurs at least twice
        //and so the string to this the current node (inner point) should be added
        subStrings.add(tmpSubString);
      }
    }
    if (node.isLeaf()) {
      return true;
    }
  };

  traverse(this.root, "");

  //Sort substrings DESC
  subStrings.sort(function (a, b) {
    return b.length - a.length;
  });

  //Return only the needed substrings
  return subStrings.slice(0, n);
};

Tree.prototype.writeToFile = function () {
  var tree = clone(this);
  delete tree.text;

  var data = this.convertToJSON(tree)
  fs.writeFile("tree.txt", data, function (err) {
    if (err) {
      return console.log(err);
    }

    console.log("Saved tree.txt");
  });
};

// Add only if there isn't the same element already
Array.prototype.add = function (element) {
  if (this.indexOf(element) >= 0) {
    return;
  }
  else {
    this.push(element);
  }
};

module.exports = Tree;