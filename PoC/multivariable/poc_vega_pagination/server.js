var fs = require('fs');
var path = require('path');
var express = require('express');
var serveStatic = require('serve-static');

var mysql = require('mysql');
var mysql_conn = mysql.createConnection({
    host: "localhost",
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWD,
    database: "tesis"
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var app = module.exports.app = exports.app = express();
var ROOT_DIR = path.join(__dirname, '.');
var DATA = path.join(__dirname, 'business.json');
var NODE_PORT = process.env.NODE_PORT || 3000;
var NODE_ENV = process.env.NODE_ENV || 'development';
var PER_PAGE = 30;

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

const items = JSON.parse(fs.readFileSync(DATA));
const _TOTAL = items.length

app.use(serveStatic(ROOT_DIR));

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

function filterData(items, min, max) {
    var filtered = items.filter(function (i) {
        return i[_STARS] <= max && i[_STARS] >= min;
    });
    return filtered;
}

function getPaginatedItems(items, offset, page_size) {
    var page = items.slice(offset, offset + page_size);
    return formatData(page);
}

function filterDataFromMongo(min, max, offset, length, res, draw) {

    console.info("querying mongo");
    var t0m = process.hrtime();
    var data = [];
    MongoClient.connect(url, function (err, db) {
        if (err) res.status(500).send(err)
        else {

            console.info("connected to mongo");
            var dbo = db.db("tesis");
            var query = { $and: [{ stars: { $gte: min } }, { stars: { $lte: max } }] };
            var projection = { projection: { _id: 0 } }
            dbo.collection("business").find(query, projection).skip(offset).limit(length).toArray(function (err, result) {
                if (err) res.status(500).send(err)
                data = formatData(result);
                var t1m = process.hrtime(t0m);
                console.info("querying mongo => Execution time (hr): %ds %dms", t1m[0], t1m[1] / 1000000);
                var json = json = {
                    draw: draw,
                    recordsTotal: _TOTAL,
                    recordsFiltered: result.length,
                    data: data
                }
                res.json(json);
            })
        }
    });
}

// function filterDataFromMysql(min, max, offset, length, draw) {
//     console.info("querying mysql");
//     var t0sql = process.hrtime();
//     var d;
//     mysql_conn.connect(function (err) {
//         if (err) throw err;
//         console.info("Connected!");
//     });
//     filter = function () {
//         console.info("promise")
//         return new Promise(function (resolve, reject) {
//             mysql_conn.query("Select * from business where stars between " + min + " and " + max + " limit " + offset + "," + (offset + length),
//                 function (err, rows) {
//                     if (rows === undefined) {
//                         console.infor("promise rejected")
//                         reject(new Error("Error rows is undefined"));
//                     } else {
//                         console.info("promise resolved")
//                         resolve(rows);
//                     }
//                 }
//             )
//         })
//     }
//     filter().then(function (result) {
//         console.info("then")
//         d = result;
//         var filteredDataSize = d.size
//         var t1sql = process.hrtime(t0sql);
//         console.info("querying mysql => Execution time (hr): %ds %dms: ", t1sql[0], t1sql[1] / 1000000);
//         return json = {
//             draw: draw,
//             recordsTotal: _TOTAL,
//             recordsFiltered: filteredDataSize,
//             data: d
//         };
//     }).catch(function (err) {
//         console.info("catch")
//         console.error("Promise failed", err);
//         return json = {
//             draw: draw,
//             recordsTotal: _TOTAL,
//             recordsFiltered: 0,
//             data: new Array()
//         };
//     });
// }

app.get('/business/:source/:min/:max', function (req, res) {
    var source = req.params.source;
    var min = req.params.min;
    var max = req.params.max
    var query = req.query;
    var draw = query.draw ? parseInt(query.draw, 10) : 0;
    var length = query.length ? parseInt(query.length, 10) : PER_PAGE;
    var offset = query.start ? parseInt(req.query.start, 10) : 0;
    switch (source) {
        case "mongo":
            filterDataFromMongo(min, max, offset, length, res, draw)
            break;
        // case "mysql":
        //     return filterDataFromMysql(min, max, offset, length, query.draw);
        //     break;
        default:
            console.info("querying file");
            var t0f = process.hrtime();
            d = filterData(items, min, max);
            var filteredDataSize = d.length;
            var p = getPaginatedItems(d, offset, length);
            var t1f = process.hrtime(t0f);
            console.info("querying file => Execution time (hr): %ds %dms: ", t1f[0], t1f[1] / 1000000);
            var json = json = {
                draw: draw,
                recordsTotal: _TOTAL,
                recordsFiltered: filteredDataSize,
                data: p
            }
            return res.json(json);
            break;
    }
});


app.listen(NODE_PORT, function () {
    console.log('Demo server running on %s mode on port %d', NODE_ENV, NODE_PORT);
});