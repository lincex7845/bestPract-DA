'use strict'

module.exports = {
    name: 'mongo_histogram',
    version: 1,
    env: process.env.NODE_ENV || 'development',
    port: process.env.POST || '3232',
    db: {
        uri: "mongodb://localhost:27017/",
    }
}