'use strict'

const config = require('./config'),
    restify = require('restify'),
    mysql = require('mysql');

const server = restify.createServer({
    name: config.name,
    version: config.version
})

server.use(restify.plugins.bodyParser({ mapParams: true }))
server.use(restify.plugins.acceptParser(server.acceptable))
server.use(restify.plugins.queryParser({ mapParams: true }))
server.use(restify.plugins.fullResponse())

server.listen(config.port, () => {
    var mysql_conn = mysql.createConnection({
        host: config.db.host,
        user: config.db.user,
        password: config.db.password,
        database: config.db.database
    });
    require('./routes')({ mysql_conn, server, restify });
});


