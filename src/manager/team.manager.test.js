const TeamManagementTree = require('./team.manager');

/*
 Scaffolding for writing the tests.
 TO DO: write the tests.
*/

describe('add members to tree', () => {
    it('inserts an element to the tree', () => {
        let tree = new TeamManagementTree();

        let teamMember = {
            name: "Harry Potter"
        }
        let action = tree.insertNodeBFS(teamMember);

        result = {}; // TO DO: add some common way to represent the returned objects or check whether parts of them are matching what we create.

        expect(action).toEqual(result);
    });
})

