var Node = require('./Node');
var Tree = require('./Tree');

var Ukkonen = {
  tree: undefined,
  text: undefined,
  buildSuffixTree: function (text) {
    this.tree = new Tree(text);
    this.text = text;

    if (text.length < 1) {
      return;
    }

    this.tree.addToRoot(new Node(text.substring(0, 1), 1));
    var object = {
      s: this.tree.root,
      k: 2
    };

    for (var i = 2; i <= text.length; i++) {
      object = this.update(object.s, object.k, i - 1, i);
    }

    this.updateNodeNames(this.tree.root);

    return this.tree;
  },
  update: function (s, k, p, i) {
    var oldR = this.tree.root;
    var canonizeResult = this.canonize(s, k, p);
    var testResult = this.testAndSplit(canonizeResult.s, canonizeResult.k, p, this.text[i - 1]);

    while (!testResult.done) {
      var leaf = new Node(this.text.substring(i - 1), i);
      testResult.r.children.push(leaf);

      if (oldR !== this.tree.root) {
        oldR.suffixLink = testResult.r;
      }

      oldR = testResult.r;
      canonizeResult = this.canonize(canonizeResult.s.suffixLink, canonizeResult.k, p);
      testResult = this.testAndSplit(canonizeResult.s, canonizeResult.k, p, this.text[i - 1]);
    }

    if (oldR !== this.tree.root) {
      oldR.suffixLink = canonizeResult.s;
    }

    return {
      s: canonizeResult.s,
      k: canonizeResult.k
    }
  },
  canonize: function (s, k, p) {
    var idx, node, edge;

    while (p - k + 1 > 0) {
      idx = this.findNodeIdxWithChar(s, this.text[k - 1]);
      node = s.children[idx];
      edge = this.getEdgeToNode(node);

      /**
       * STATE: Checked!
       */
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
  },
  testAndSplit: function (s, k, p, x) {
    if (k > p) {
      if (this.findNodeIdxWithChar(s, x) >= 0) {
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
      var idx = this.findNodeIdxWithChar(s, this.text[k - 1]);
      var node = s.children[idx];
      var edge = this.getEdgeToNode(s.children[idx]);

      /**
       * STATE: Checked!
       */
      if (x === edge[p - k + 1]) {
        return {
          done: true,
          r: s
        }
      } else {
        /**
         * STATE: Checked!
         */

        var r = new Node(
          this.text.substring(k - 1, p),
          s.children[idx].reference.start,
          s.children[idx].reference.start + this.lengthOfTwoIdx(k, p) - 1
        );

        var tmp = s.children[idx];
        var end = Infinity;
        if (tmp.children.length > 0) {
          end = s.children[idx].reference.start + edge.length - 1;
        }
        tmp.reference = {
          start: s.children[idx].reference.start + this.lengthOfTwoIdx(k, p),
          end: end
        };

        tmp.name = this.text.substring(p, edge.length - 1);

        r.children.push(tmp);
        s.children[idx] = r;

        return {
          done: false,
          r: r
        }
      }
    }
  },

  /**
   * Helpers
   */

  findNodeIdxWithChar: function (s, x) {
    var idx = -1, startIdx, character;

    for (var i = 0; i < s.children.length; i++) {
      startIdx = s.children[i].reference.start;
      character = this.text[startIdx - 1];

      //Check first character of edge
      //(Root is accessible by every letter)
      if (x === character || startIdx === "SIGMA") {
        idx = i;
        break;
      }
    }

    return idx;

  },
  // Return the length of a substring from k to and inclusive p
  lengthOfTwoIdx: function (kInclusive, pInclusive) {
    return this.text.substring(kInclusive - 1, pInclusive).length;
  },
  getEdgeToNode: function (node) {
    if (node.reference.start === "SIGMA") {
      return "S";
    }

    return this.text.substring(node.reference.start - 1, node.reference.end);
  },
  updateNodeNames: function (node) {
    for (var i = 0; i < node.children.length; i++) {
      this.updateNodeNames(node.children[i]);
    }

    if (node.name === "root") {
      return;
    }

    //TODO: Change edge name to node and edge name
    node.name = this.text.substring(node.reference.start - 1, node.reference.end)
  },

  /**
   * Longest repeated substring
   */
  findHeight: function () {
    if (node == null) return 0;
    return 1 + max(findHeight(node.left), findHeight(node.right));
  }
};

module.exports = Ukkonen;