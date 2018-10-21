'use strict'

const config = require('./config'),
    restify = require('restify');

const MapdConnector = require('./node-connector');
const connector = new MapdConnector();

const server = restify.createServer({
    name: config.name,
    version: config.version
})

server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

server.listen(config.port, () => {
    connector
        .protocol(config.db.protocol)
        .host(config.db.host)
        .port(config.db.mapd_port)
        .dbName(config.db.mapd_db)
        .user(config.db.mapd_user)
        .password(config.db.mapd_passwd)
        .connectAsync()
        .then(session => require('./routes')({ session, server, restify }))
        .catch(err => {
            console.log('An error occurred while attempting to connect to MapD', err);
            process.exit(1);
        });
})