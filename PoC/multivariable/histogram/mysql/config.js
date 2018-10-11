'use strict'

module.exports = {
    name: 'mysql-histogram',
    version: 1,
    env: process.env.NODE_ENV || 'development',
    port: process.env.POST || '3300',
    db: {
        host: "localhost",
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWD,
        database: "tesis"
    }
}