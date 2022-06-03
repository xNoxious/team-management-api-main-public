const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');
const PORT = process.env.PORT || 8000;
const { loadMembersData } = require('./models/team.model');

const server = http.createServer(app);

async function startServer() {
    // Ensure we have loaded team members JSON file before launching the server.
    await loadMembersData();

    server.listen(PORT, () => {
        logger.info(`Listening on port ${PORT}...`)
    });
}

startServer();

// This is just to test that our server is upp and running.
app.get("/heartbeat", (_, res) => {
    return res.status(200).json('beating...');
})