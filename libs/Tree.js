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
  this.numberNodes = 0;
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
Tree.prototype.findLongestRepeatedSubstrings = function (n) {
  console.log("\t\tStart traversing tree...");
  var subStrings = this.traverseForSubstrings(this.root, "", []);

  console.log("\t\tSort substrings...");
  //Sort substrings DESC
  subStrings.sort(function (a, b) {
    return b.length - a.length;
  });

  //Return only the needed substrings
  var longestRepeatedSubstrings = [];
  for (var i = 0; i < subStrings.length; i++) {
    if (longestRepeatedSubstrings.indexOf(subStrings[i]) < 0) {

      //FEATURE for more interesting substrings
      //REMOVE IT
      if (subStrings[i].indexOf(longestRepeatedSubstrings[0]) >= 0) {
        longestRepeatedSubstrings[0] = subStrings[i];
      }
      else if (subStrings[i].indexOf(longestRepeatedSubstrings[1]) >= 0) {
        longestRepeatedSubstrings[1] = subStrings[i];
      }
      else if (subStrings[i].indexOf(longestRepeatedSubstrings[2]) >= 0) {
        longestRepeatedSubstrings[2] = subStrings[i];
      }
      else if (longestRepeatedSubstrings[0] && longestRepeatedSubstrings[0].indexOf(subStrings[i]) >= 0) {

      }
      else if (longestRepeatedSubstrings[1] && longestRepeatedSubstrings[1].indexOf(subStrings[i]) >= 0) {

      }
      else if (longestRepeatedSubstrings[2] && longestRepeatedSubstrings[2].indexOf(subStrings[i]) >= 0) {

      }
      else {
        //LET IT HERE
        longestRepeatedSubstrings.push(subStrings[i]);
      }
    }

    if (longestRepeatedSubstrings.length === n) {
      break;
    }
  }

  return longestRepeatedSubstrings;
};

Tree.prototype.traverseForSubstrings = function (node, subString, subStrings) {
  var tmpSubString
  if (node.name === "root") {
    tmpSubString = "";
  }
  else {
    tmpSubString = subString + this.text.substring(node.reference.start - 1, node.reference.end);
  }

  for (var i = 0; i < node.children.length; i++) {
    if (node.children[i].isLeaf() && node.name != "root") {
      //if a child is a leaf, than this substring occurs at least twice
      //and so the string to this the current node (inner point) should be added

      //FEATURE
      //REMOVE IT
      tmpSubString = tmpSubString.replace("\r", " ").replace("\n", " ");

      subStrings.push(tmpSubString);
    } else {
      this.traverseForSubstrings(node.children[i], tmpSubString, subStrings);
    }
  }

  return subStrings;
};


Tree.prototype.countNodes = function (node) {
  var node = node || this.root;
  this.numberNodes++;

  for (var i = 0; i < node.children.length; i++) {
    this.countNodes(node.children[i]);
  }
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

module.exports = Tree;