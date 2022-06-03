/*
    This is a helper function that is used to print the tree.
    **tree** - this should initially be passed as tree.root
    **indent** - the indentation at the root
    **last** - whether it's the last one at this level. True by default because only 1 root. 
*/
function PrintTree(tree, indent = ' ', last = true) {
    console.log(indent + '+-' + (tree.teamMember.name + '(' + tree.teamMember.email + ')'));
    indent += last ? '   ' : '|  '

    for (let i = 0; i < tree.children.length; i++) {
        PrintTree(tree.children[i], indent, i === tree.children.length - 1);
    }
}

module.exports = {
    PrintTree
}