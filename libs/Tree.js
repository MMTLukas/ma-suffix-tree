// JavaScript has no deep copy function
// So we use this module, to print an adapted copy of the tree
var clone = require('clone');
var Node = require('./Node');

function Tree(root) {
  //Add virtual root before root, for printing a clear non circular tree
  this.virtualRoot = new Node("virtualRoot");
  this.root = new Node("root", "SIGMA");

  this.root.suffixLink = this.virtualRoot;
  this.virtualRoot.children.push(this.root);
}

Tree.prototype.addToRoot = function (node) {
  this.root.children.push(node);
};

/**
 * Prints any node or the tree itself
 * even if the node is a circular object
 *
 * Beginning with the virtual root the tree will be printed
 * Delete property root, because it is a child of the virtual root anyway
 * Delete all suffixes, because we have to avoid circular references
 *
 * Be warned that Inifinity is printed as null in js anyway
 *
 * @param node: Node to be printed
 */
Tree.prototype.print = function (node) {
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

  console.log(json);
};

module.exports = Tree;