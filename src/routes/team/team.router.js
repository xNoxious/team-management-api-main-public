const express = require('express');
const auth = require('../../utils/middleware/auth');
const {
    getTeam,
    httpFilterMembers,
    httpLoadMembersData,
    httpExportMembersData,
    httpAddMember,
    httpRemoveMember,
    httpMoveMemberWithoutSubordinates,
    httpMoveMemberWithSubordinates
} = require('./team.controller');

const teamRouter = express.Router();

/* Note: I haven't enabled 'auth' globally, but just added it here for demonstration. 
 I could alternatively add it globally and whitelist the 2 authentication endpoints.
 I have added tokens to the requests in Postman, but should they fail - you can use Postman's collection 
 to request new token or alternatively skip passing them as parameters below in the router.
*/

// Can serve them with '/team' prefix in app.js but I prefer to be explicit with routes. Maybe if they become too many.
teamRouter.get('/team', auth, getTeam);
teamRouter.get('/team/filterMembers/:filterDomain/:keyword', auth, httpFilterMembers);
teamRouter.get('/team/loadMembers/:filename', auth, httpLoadMembersData);
teamRouter.get('/team/exportMembersData/:filename', auth, httpExportMembersData);
teamRouter.post('/team/addMember', auth, httpAddMember);
teamRouter.delete('/team/removeMember', auth, httpRemoveMember);
teamRouter.post('/team/moveMemberWithoutSubordinates', auth, httpMoveMemberWithoutSubordinates);
teamRouter.post('/team/moveMemberWithSubordinates', auth, httpMoveMemberWithSubordinates);

module.exports = teamRouter;