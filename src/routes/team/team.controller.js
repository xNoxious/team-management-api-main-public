const logger = require('../../utils/logger');
const {
    loadMembersData,
    exportMembersData,
    addMember,
    removeMember,
    moveMemberWithoutSubordinates,
    moveMemberWithSubordinates
} = require('../../models/team.model');

async function getTeam(req, res) {
    let result = await loadMembersData();
    return res.status(200).json(result);
}

async function httpLoadMembersData(req, res) {
    return await loadMembersData(req.params.filename)
        .then(() => {
            logger.info(`Loading data from ${req.params.filename}`);
            return res.status(200).json(`Data from file: '${req.params.filename}.json' loaded successfully`);
        })
        .catch((err) => {
            logger.error(`Data failed loading with error: ${err}`);
            throw err;
        });
}

async function httpExportMembersData(req, res) {
    return await exportMembersData(req.params.filename)
        .then(() => {
            logger.info(`Exporting data to ${req.params.filename}`);
            return res.status(200).json(`Data exported successfully to file: '${req.params.filename}.json'`);
        })
        .catch((err) => {
            logger.error(`Data failed exporting with error: ${err}`);
            throw err;
        });
}

async function httpFilterMembers(req, res) {
    let teamMembers = await loadMembersData();

    let filterDomain = req.params.filterDomain; // filed of object
    let searchStr = req.params.keyword; // search string

    let filteredMembers = teamMembers.filter((e) => {
        return e[filterDomain].includes(searchStr);
    });

    return res.status(200).json(filteredMembers);
}

function httpAddMember(req, res) {
    const member = req.body;

    if (!member.name || !member.email) {
        return res.status(400).json({
            error: 'Missing required member property'
        });
    }

    let added = addMember(member);
    return res.status(200).json(added);
}

function httpRemoveMember(req, res) {
    const email = req.body.email;

    if (!email) {
        return res.status(400).json({
            error: 'Missing required member email'
        });
    }

    let removed = removeMember(email);
    return res.status(200).json(removed);
}

function httpMoveMemberWithoutSubordinates(req, res) {
    const memberEmail = req.body.memberEmail;
    const managerEmail = req.body.managerEmail;

    if (!memberEmail || !managerEmail) {
        return res.status(400).json({
            error: 'Missing required property'
        });
    }

    let moved = moveMember(memberEmail, managerEmail, false);

    return res.status(200).json(moved);
}

function httpMoveMemberWithSubordinates(req, res) {
    const memberEmail = req.body.memberEmail;
    const managerEmail = req.body.managerEmail;

    if (!memberEmail || !managerEmail) {
        return res.status(400).json({
            error: 'Missing required property'
        });
    }

    let moved = moveMember(memberEmail, managerEmail);

    return res.status(200).json(moved);
}

function moveMember(memberEmail, managerEmail, withSubordinates = true) {
    let moved;
    if (withSubordinates) {
        moved = moveMemberWithSubordinates(memberEmail, managerEmail);

    } else {
        moved = moveMemberWithoutSubordinates(memberEmail, managerEmail);
    }

    return moved;
}

module.exports = {
    getTeam,
    httpFilterMembers,
    httpLoadMembersData,
    httpExportMembersData,
    httpAddMember,
    httpRemoveMember,
    httpMoveMemberWithoutSubordinates,
    httpMoveMemberWithSubordinates
};