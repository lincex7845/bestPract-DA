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
const query_heatmap = 'select state, stars, avg(review_count) as avg_review_count from business_3M group by state, stars order by state, stars';

function formatHeatmap(values) {
    var r = values.map(val => {
        return {
            state: val.state,
            stars: val.stars,
            avg_review_count: parseFloat(val.avg_review_count.toString())
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
        newArray.push(o[_REVIEW_COUNT].toString())
        newArray.push(o[_IS_OPEN].toString())
        return newArray;
    });
    return formatedData;
}

module.exports = function (ctx) {
    const session = ctx.session,
        db = ctx.db,
        server = ctx.server,
        restify = ctx.restify;
    const business = db.db("tesis").collection('business');

    server.get('/*', restify.plugins.serveStatic({
        directory: path.join(__dirname, '.'),
        default: 'index.html'
    }));

    server.get('/business/heatmap', (_, res, next) => {
        console.info('grouping by state and stars - starting');
        let t0h = process.hrtime();
        session.queryAsync(query_heatmap, {})
            .then(values => {
                let r = formatHeatmap(values)
                let t1h = process.hrtime(t0h);
                console.info("grouping by state and stars finished => Execution time (hr): %ds %dms: ", t1h[0], t1h[1] / 1000000);
                res.send(200, r);
            })
            .catch(err => res.send(500, err));
        next();
    });

    server.get('/business/:state/:stars', (req, res, next) => {
        let state = req.params.state;
        let stars = isNaN(req.params.stars) ? '*' : parseFloat(req.params.stars);
        let query = req.query;
        let draw = query.draw ? parseInt(query.draw, 10) : 0;
        let length = query.length ? parseInt(query.length, 10) : PER_PAGE;
        let offset = query.start ? parseInt(req.query.start, 10) : 0;
        const criteria = { stars: stars, state: state };
        console.info("querying on MongoDB");
        let t0m = process.hrtime();
        if (state === '*' && stars === '*') {

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