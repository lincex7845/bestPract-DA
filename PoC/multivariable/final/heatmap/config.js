'use strict'

module.exports = {
    name: 'mapd_heatmap',
    version: 1,
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || '4100',
    db: {
        uri_mongo: 'mongodb://localhost:27017/',
        protocol: 'http',
        host: 'localhost',
        mapd_user: process.env.MAPD_USER,
        mapd_passwd: process.env.MAPD_PASSWD,
        mapd_db: 'mapd',
        mapd_port: '9092'
    }
}