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
const total = 141857
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
    const mysql_conn = ctx.mysql_conn,
        server = ctx.server,
        restify = ctx.restify;

    server.get('/*', restify.plugins.serveStatic({
        directory: path.join(__dirname, '.'),
        default: 'index.html'
    }));

    server.get('/business/histogram', (_, res, next) => {
        let query = 'select stars, count(*) as records from tesis.business group by stars order by records desc';
        console.info("group by stars - starting");
        let t0h = process.hrtime();
        mysql_conn.query(query, (err, records) => {
            if (err) res.send(500, err);
            else {
                let t1h = process.hrtime(t0h);
                console.info("group by stars finished => Execution time (hr): %ds %dms: ", t1h[0], t1h[1] / 1000000);
                res.send(200, records)
            }
        })
        next();
    });

    server.get('/business/:min/:max', (req, res, next) => {
        let min = req.params.min;
        let max = req.params.max
        let query = req.query;
        let draw = query.draw ? parseInt(query.draw, 10) : 0;
        let length = query.length ? parseInt(query.length, 10) : PER_PAGE;
        let offset = query.start ? parseInt(req.query.start, 10) : 0;
        console.info("querying mysql");
        let t0sql = process.hrtime();
        let countFiltered;
        mysql_conn.query("select count(*) as countFiltered from business where stars between " + min + " and " + max,
            function (err, rows) {
                if (err) console.error(err)
                else {
                    countFiltered = rows[0].countFiltered;
                }
            }
        );
        mysql_conn.query("Select * from business where stars between " + min + " and " + max + " limit " + offset + "," + (offset + length),
            (err, rows) => {
                if (err) res.send(500, err);
                else {
                    let t1sql1f = process.hrtime(t0sql);
                    console.info("querying mysql finished => Execution time (hr): %ds %dms: ", t1sql1f[0], t1sql1f[1] / 1000000);
                    const json = {
                        draw: draw,
                        recordsTotal: total,
                        recordsFiltered: countFiltered,
                        data: formatData(rows)
                    }
                    res.send(200, json);
                }
            }
        );
        next();
    });
}


