const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');
const helper = require('../utils/helpers/team.helper');
const TeamManagementTree = require('../manager/team.manager');

// Absolutely stunning cache implementation.
let cache = {};
let team = new TeamManagementTree();

async function loadMembersData(filename = 'members') {
    if (Object.keys(cache).length !== 0) {
        return cache;
    } else {
        let file = getFilePath(filename);
        await fs.access(file, fs.F_OK, async (err) => {
            if (err) {
                logger.error(err)
                throw err;
            } else {
                logger.info(`Reading data from ${file}`);
                let result = await fs.promises.readFile(file);

                // JSON.parse() is still sync so it will block.
                // If I have to work with large data sets, I'd use a 3rd party
                // library for async parsing or write it if necessary.
                let data = JSON.parse(result);
                cache = data;

                // puts the given JSON into the team structure tree
                team = loadTeamStructure(data);
                helper.PrintTree(team.root);
                return data;
            }
        });
    }
}

async function exportMembersData(filename = 'members_exported') {
    let file = getFilePath(filename);
    let jsonData = JSON.stringify(team);
    await fs.writeFile(file, jsonData, (err) => {
        if (err) {
            logger.error(`Error writing to a file: ${err}`);
            throw err;
        }
        logger.info(`Data written to file ${filename}`);
    });
}

function loadTeamStructure(data) {
    for (let i = 0; i < data.length; i++) {
        team.insertNodeBFS(data[i]);
    }

    return team;
}

function addMember(member) {
    team.insertNodeBFS(member);

    helper.PrintTree(team.root);

    /* Note: I wouldn't return the whole team in a real life example
     but this is for you to inspect in Postman. 
    Ideally, I'd just return a confirmation message or the added member itself. 
    This is valid for all the returns in this file.
    */
    return team;
}

function removeMember(email) {
    team.removeNode(email);

    helper.PrintTree(team.root);

    return team;
}

function moveMemberWithoutSubordinates(memberEmail, managerEmail) {

    helper.PrintTree(team.root);
    team.moveNodeWithoutChildren(memberEmail, managerEmail);
    helper.PrintTree(team.root);

    return team;
}

function moveMemberWithSubordinates(memberEmail, managerEmail) {
    team.moveNodeWithChildren(memberEmail, managerEmail);
    helper.PrintTree(team.root);

    return team;
}

function getFilePath(filename) {
    return path.resolve(__dirname, `../utils/data/${filename}.json`);
}

module.exports = {
    loadMembersData,
    exportMembersData,
    addMember,
    removeMember,
    moveMemberWithoutSubordinates,
    moveMemberWithSubordinates
}