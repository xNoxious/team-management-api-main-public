class MemberNode {
  constructor(teamMember, maxChildren = 3) {
    this.teamMember = teamMember;
    this.maxChildren = maxChildren;
    this.children = [];
  }
}

module.exports = class TeamManagementTree {
  constructor() {
    this.root = null;
  }

  findNode(node, email) {
    if (node.teamMember.email === email) {
      return node;
    } else if (node.children && node.children.length) {
      let result;
      for (let i = 0; result == null && i < node.children.length; i++) {
        result = this.findNode(node.children[i], email);
      }
      return result;
    }
    return null;
  }

  findParentNode(email, node = this.root, parentNode = this.root) {
    if (node.teamMember.email === email) {
      return parentNode;
    } else if (node.children && node.children.length) {
      let result;
      for (let i = 0; result == null && i < node.children.length; i++) {
        parentNode = node;
        result = this.findParentNode(email, node.children[i], parentNode);
      }
      return result;
    }
    return null;
  }

  // Note: Currently, the tree does not prevent duplication nodes from being entered. In order to achieve that, 
  // I would have to track whether that given node's email is present, traverse tree twice or not allow it to get inside
  // the data structure at all. I would probably pick the 3rd option. 
  insertNodeBFS(value) {
    const newNode = new MemberNode(value);

    // if first team member
    if (this.root === null) {
      this.root = newNode;
    } else {
      let currentNode = this.root;
      let list = []; // representation of the tree
      let queue = []; // track children at current level so we can access them and their children

      // given specific manager
      if (newNode.teamMember.manager) {
        let managerNode = this.findNode(currentNode, newNode.teamMember.manager);

        // manager has place for subordinates
        if (managerNode && managerNode.children.length < managerNode.maxChildren) {
          managerNode.children.push(newNode);
        } else {
          // put as subordinates of one of manager's subordinates
          this.#insertChild(managerNode, newNode, queue, list, true);
        }
      } else {
        // no specific manager given - just append at end of current team or subordinate's team.
        this.#insertChild(currentNode, newNode, queue, list, false);
      }
    }
  }

  removeNode(email) {
    let manager = this.findParentNode(email); // find parent node

    if (manager === null) {
      return 'No parent found';
    }

    let nodeToRemove = manager.children.find(m => m.teamMember.email === email); // child node 

    if (nodeToRemove === null) {
      return 'No child found';
    }

    // If we remove 4 - 1's and 6's parent will now be 9
    //     9
    //  4     20
    //1  6
    if (nodeToRemove.children) { // if node has children
      for (let i = 0; i < nodeToRemove.children.length; i++) {
        nodeToRemove.children[i].teamMember.manager = manager.teamMember.email; // update children's parent
        manager.children.push(nodeToRemove.children[i]); // add children to nodeToRemove's parent
      }

      // Don't move children with node, so we reset its children array.
      nodeToRemove.children = [];
    }

    let index = manager.children.findIndex(el => el.teamMember.email === email);
    manager.children.splice(index, 1);

    return nodeToRemove;
  }

  moveNodeWithoutChildren(emailOfNodeToMove, emailOfNewManager) {
    if (this.root === null) {
      return 'Tree is empty';
    }

    // Because our Nodes are small, we can easily reuse the code of removing the node and
    // inserting it into a new desired place. If the size of our nodes grows, this may 
    // become problematic. 
    let movedNode = this.removeNode(emailOfNodeToMove);

    // simply update node object's manager with new manager and re-insert node in tree.
    movedNode.teamMember.manager = emailOfNewManager;
    this.insertNodeBFS(movedNode.teamMember);
  }

  moveNodeWithChildren(emailOfNodeToMove, emailOfNewManager) {
    let oldManager = this.findParentNode(emailOfNodeToMove);
    let newManager = this.findNode(this.root, emailOfNewManager);

    // update moved node's parent
    let index = oldManager.children.findIndex(el => el.teamMember.email === emailOfNodeToMove);
    let nodeToMove = oldManager.children[index];
    nodeToMove.teamMember.manager = emailOfNewManager; // change parent of node to move
    oldManager.children.splice(index, 1); // remove node from old manager's children

    // insert node to move in tree again with new manager (in reality it will simply update where each involved node points to);
    this.#insertChild(newManager, nodeToMove, [], []);
  }

  #insertChild(currentNode, newNode, queue, list, updateParent = false) {
    queue.push(currentNode);

    while (queue.length > 0) {
      currentNode = queue.shift(); // take 1st item of queue
      list.push(currentNode.teamMember);

      for (let i = 0; i < currentNode.maxChildren; i++) {
        if (!currentNode.children[i]) {
          currentNode.children[i] = newNode;
          if (updateParent) newNode.teamMember.manager = currentNode.teamMember.email;
          return this;
        } else {
          queue.push(currentNode.children[i]);
        }
      }
    }
  }
}