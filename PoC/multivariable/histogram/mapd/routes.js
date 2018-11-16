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
//const query_heatmap = 'select state, stars, avg(review_count) as avg_review_count from business group by state, stars order by state, stars';
const query_histogram = 'select stars, count(*) as records from business_3M group by stars order by records desc'


function formatHistogram(values) {
    var r = values.map(val => {
        return {
            stars: val.stars,
            records: parseFloat(val.records.toString())
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
        server = ctx.server,
        restify = ctx.restify;

    server.get('/*', restify.plugins.serveStatic({
        directory: path.join(__dirname, '.'),
        default: 'index.html'
    }));

    server.get('/business/histogram', (_, res, next) => {
        console.info('grouping by stars - starting');
        let t0h = process.hrtime();
        session.queryAsync(query_histogram, {})
            .then(values => {
                let r = formatHistogram(values)
                let t1h = process.hrtime(t0h);
                console.info("grouping by stars finished => Execution time (hr): %ds %dms: ", t1h[0], t1h[1] / 1000000);
                res.send(200, r);
            })
            .catch(err => res.send(500, err));
        next();
    });

    server.get('/business/:min/:max', (req, res, next) => {
        let min = req.params.min;
        let max = req.params.max;
        let query = req.query;
        let draw = query.draw ? parseInt(query.draw, 10) : 0;
        let length = query.length ? parseInt(query.length, 10) : PER_PAGE;
        let offset = query.start ? parseInt(req.query.start, 10) : 0;
        //console.info("querying mapD");
        let t0m = process.hrtime();
        Promise.all([
            session.queryAsync("select count(*) AS records from business_3M where stars between " + min + " and " + max, {}),
            session.queryAsync("select * from business_3M where stars between " + min + " and " + max + " limit " + length + " offset " + offset, {})
        ])
            .then(values => {
                const count = parseFloat(values[0][0].records.toString())
                const r = formatData(values[1])
                let t1m = process.hrtime(t0m);
                //console.info("querying mapD finished => Execution time (hr): %ds %dms: ", t1m[0], t1m[1] / 1000000);
                console.info("%ds %dms", t1m[0], t1m[1] / 1000000);
                const json = {
                    draw: draw,
                    recordsTotal: total,
                    recordsFiltered: count,
                    data: r
                }
                res.send(200, json);
            })
            .catch(err => res.send(500, err));
        next();
    });
}