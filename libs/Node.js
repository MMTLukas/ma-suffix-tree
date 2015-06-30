function Node(name, start, end) {
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

module.exports = Node;