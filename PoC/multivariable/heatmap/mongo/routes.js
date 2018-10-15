'use strict'

const path = require('path');
const PER_PAGE = 30;
const _NAME = 'name'
const _NEIGHBORHOOD = 'neighborhood'
const _ADDRESS = 'address'
const _CITY = 'city'
const _STATE = 'state'
const _POSTAL_CODE = 'postal_code'
const _LATITUDE = 'latitude'
const _LONGITUDE = 'longitude'
const _STARS = 'stars'
const _REVIEW_COUNT = 'review_count'
const _IS_OPEN = 'is_open'
const total = 144072

function formatHistogram(docs) {
    var r = docs.map(doc => {
        return {
            stars: doc._id,
            records: doc.count
        }
    });
    return r;
}

function formatData(data) {
    var formatedData = data.map(function (o) {
        var newArray = new Array();
        newArray.push(o[_NAME])
        newArray.push(o[_NEIGHBORHOOD])
        newArray.push(o[_ADDRESS])
        newArray.push(o[_CITY])
        newArray.push(o[_STATE])
        newArray.push(o[_POSTAL_CODE])
        newArray.push(o[_LATITUDE])
        newArray.push(o[_LONGITUDE])
        newArray.push(o[_STARS])
        newArray.push(o[_REVIEW_COUNT])
        newArray.push(o[_IS_OPEN])
        return newArray;
    });
    return formatedData;
}

module.exports = function (ctx) {
    const db = ctx.db,
        server = ctx.server,
        restify = ctx.restify;
    const business = db.db("tesis").collection('business');

    server.get('/*', restify.plugins.serveStatic({
        directory: path.join(__dirname, '.'),
        default: 'index.html'
    }));

    server.get('/business/heatmap', (_, res, next) => {
        console.info("group by state and stars - starting");
        let t0h = process.hrtime();
        const group = { $group: { _id: { state: "$state", stars: "$stars" }, avg_review_count: { $avg: "$review_count" } } };
        const sort = { $sort: { "_id.state": 1, "_id.stars": 1 } }
        business.aggregate([group, sort])
            .toArray()
            .then(docs => {
                let r = docs;
                let t1h = process.hrtime(t0h);
                console.info("group by state and stars finished => Execution time (hr): %ds %dms: ", t1h[0], t1h[1] / 1000000);
                res.send(200, r)
            })
            .catch(err => res.send(500, err));
        next();
    });

    server.get('/business/:state/:stars', (req, res, next) => {
        let _state = req.params.state;
        let _stars = isNaN(req.params.stars) ? '*' : parseFloat(req.params.stars);
        let query = req.query;
        let draw = query.draw ? parseInt(query.draw, 10) : 0;
        let length = query.length ? parseInt(query.length, 10) : PER_PAGE;
        let offset = query.start ? parseInt(req.query.start, 10) : 0;
        const criteria = {stars: _stars ,  state: _state} ;
        console.info("querying mongodb");
        let t0m = process.hrtime();
        if (_state === '*' && _stars === '*') {

            business.find({}).count()
                .then(c => {
                    business.find({})
                        .skip(offset)
                        .limit(length)
                        .toArray()
                        .then(docs => {
                            let t1m = process.hrtime(t0m);
                            console.info("querying mongo finished => Execution time (hr): %ds %dms: ", t1m[0], t1m[1] / 1000000);
                            const json = {
                                draw: draw,
                                recordsTotal: total,
                                recordsFiltered: c,
                                data: formatData(docs)
                            }
                            res.send(200, json);
                        })
                })
                .catch(err => res.send(500, err));
        }
        else {

            business.find(criteria).count()
                .then(c => {
                    business.find(criteria)
                        .skip(offset)
                        .limit(length)
                        .toArray()
                        .then(docs => {
                            let t1m = process.hrtime(t0m);
                            console.info("querying mongo finished => Execution time (hr): %ds %dms: ", t1m[0], t1m[1] / 1000000);
                            const json = {
                                draw: draw,
                                recordsTotal: total,
                                recordsFiltered: c,
                                data: formatData(docs)
                            }
                            res.send(200, json);
                        })
                })
                .catch(err => res.send(500, err));
        }
        next();
    });
}