'use strict'

const config = require('./config'), 
    restify = require('restify'),
    mongodb = require('mongodb');

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
    mongodb.connect(config.db.uri_mongo, (err, db) => {
        if (err) {
            console.log('An error occurred while attempting to connect to MongoDB', err);
            process.exit(1);
        }
        connector
            .protocol(config.db.protocol)
            .host(config.db.host)
            .port(config.db.mapd_port)
            .dbName(config.db.mapd_db)
            .user(config.db.mapd_user)
            .password(config.db.mapd_passwd)
            .connectAsync()
            .then(session => require('./routes')({ db, session, server, restify }))
            .catch(err => {
                console.log('An error occurred while attempting to connect to MapD', err);
                process.exit(1);
            });
    })
})