'use strict'

const config = require('./config'),
    restify = require('restify'),
    mongodb = require('mongodb');

const server = restify.createServer({
    name: config.name,
    version: config.version
})

server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

server.listen(config.port, () => {

    mongodb.connect(config.db.uri, (err, db) => {
        if (err) {
            console.log('An error occurred while attempting to connect to MongoDB', err);
            process.exit(1);
        }
        require('./routes')({ db, server, restify})
    })
});