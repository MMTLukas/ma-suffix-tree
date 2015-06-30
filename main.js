/**
 * Suffix-Tree Implementation
 * Wanko Lukas
 **/

// JavaScript has no deep copy function
// So we use this module
var clone = require('clone');

function Node(name, start, end) {
  //console.log("Node params: ", name, start, end);
  end = end || Infinity;
  this.reference = {
    start: start,
    end: end
  };
  this.name = name;
  this.suffixLink = undefined;
  this.children = [];
}

Node.prototype.isLeaf = function () {
  return this.children.length <= 0;
};

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

var tree;
var text;

//ababbaa

var buildSuffixTree = function () {
  tree = new Tree();
  if (text.length < 1) {
    return;
  }

  tree.addToRoot(new Node(text.substring(0, 1), 1));
  var object = {
    s: tree.root,
    k: 2
  };

  for (var i = 2; i <= text.length; i++) {
    object = update(object.s, object.k, i - 1, i);
    updateLeafs(tree.root);
  }
};

var update = function (s, k, p, i) {
  console.log("update", s.name, k, p, i);

  var oldR = tree.root;
  var canonizeResult = canonize(s, k, p);
  var testResult = testAndSplit(canonizeResult.s, canonizeResult.k, p, text[i - 1]);

  while (!testResult.done) {
    var leaf = new Node(text.substring(i - 1), i);
    testResult.r.children.push(leaf);

    if (oldR !== tree.root) {
      oldR.suffixLink = testResult.r;
    }

    oldR = testResult.r;
    canonizeResult = canonize(canonizeResult.s.suffixLink, canonizeResult.k, p);
    testResult = testAndSplit(canonizeResult.s, canonizeResult.k, p, text[i - 1]);
  }

  if (oldR !== tree.root) {
    oldR.suffixLink = canonizeResult.s;
  }

  return {
    s: canonizeResult.s,
    k: canonizeResult.k
  }
};

var canonize = function (s, k, p) {
  console.log("canonize", s.name, k, p);
  var idx, node, edge;

  while (p - k + 1 > 0) {
    idx = findNodeIdxWithChar(s, text[k - 1]);
    node = s.children[idx];
    edge = getEdgeToNode(node);

    //!!! ÜBERPRÜFT !!!
    if (edge.length > (p - k + 1) || node.isLeaf()) {
      break;
    }

    k = k + edge.length;
    s = node;
  }

  return {
    s: s,
    k: k
  }
};

var testAndSplit = function (s, k, p, x) {
  console.log("testandsplit", s.name, k, p, x);

  if (k > p) {
    if (findNodeIdxWithChar(s, x) >= 0) {
      return {
        done: true,
        r: s
      }
    } else {
      return {
        done: false,
        r: s
      }
    }
  } else {
    var idx = findNodeIdxWithChar(s, text[k - 1]);
    var node = s.children[idx];
    var edge = getEdgeToNode(s.children[idx]);

    //!!! ÜBERPRÜFT !!!
    if (x === edge[p - k + 1]) {
      return {
        done: true,
        r: s
      }
    }
    else {




      //!!! ÜBERARBEITET !!!!

      //TODO: Check start 2 and end 1 - why? improve it!
      var r = new Node(
        text.substring(k - 1, p),
        s.children[idx].reference.start,
        s.children[idx].reference.start + lengthOfTwoIdx(k,p) - 1
      );

      var tmp = s.children[idx];
      var end = Infinity;
      if(tmp.children.length > 0){
        end = edge.length;
      }
      tmp.reference = {
        start: s.children[idx].reference.start + lengthOfTwoIdx(k,p),
        end: end
      };

      tmp.name = text.substring(p, edge.length - 1);

      r.children.push(tmp);
      s.children[idx] = r;

      return {
        done: false,
        r: r
      }
    }
  }
};

var findNodeIdxWithChar = function (s, x) {
  var idx = -1, startIdx, character;

  for (var i = 0; i < s.children.length; i++) {
    startIdx = s.children[i].reference.start;
    character = text[startIdx - 1];

    //Check first character of edge
    //(Root is accessible by every letter)
    if (x === character || startIdx === "SIGMA") {
      idx = i;
      break;
    }
  }

  return idx;
};

// Return the length of a substring from k to and inclusive p
var lengthOfTwoIdx = function(kInclusive, pInclusive){
  return text.substring(kInclusive-1, pInclusive).length;
}

var getEdgeToNode = function (node) {
  if (node.reference.start === "SIGMA") {
    return "S";
  }

  return text.substring(node.reference.start - 1, node.reference.end);
};

var updateLeafs = function (node) {
  for (var i = 0; i < node.children.length; i++) {
    updateLeafs(node.children[i]);
  }

  if(node.children.length > 0){
    node.name = text.substring(node.reference.start - 1, node.reference.end)
  }
  else if (node.children.length === 0) {
    //TODO: Change edge name to node and edge name
    node.name = text.substring(node.reference.start - 1)
  }
};

/**
 * PRINTCIRCULARJSON
 *
 * Beginning with the virtual root the tree will be printed
 * Delete property root, because it is a child of the virtual root anyway
 * Delete all suffixes, because we have to avoid circular references
 *
 * Be warned that Inifinity is printed as null in js anyway
 *
 * @param node: Node to be printed
 */

var printCircularJSON = function (node) {
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

var parameters = process.argv.slice(2);
text = parameters[0];

buildSuffixTree();

printCircularJSON(tree);

