var MongoClient = require('mongodb').MongoClient;

//Create a database named "mydb":
// var url = "mongodb://localhost:27017/mydb";

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   console.log("Database created!");
//   db.close();
// });

var url = "mongodb://localhost:27017/";

// Create collection
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.createCollection("customers", function(err, res) {
//     if (err) throw err;
//     console.log("Collection created!");
//     db.close();
//   });
// });

// Insert record
// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = { name: "Company Inc", address: "Highway 37" };
//     dbo.collection("customers").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

// Insert multiple records
// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = [
//         { name: 'John', address: 'Highway 71' },
//         { name: 'Peter', address: 'Lowstreet 4' },
//         { name: 'Amy', address: 'Apple st 652' },
//         { name: 'Hannah', address: 'Mountain 21' },
//         { name: 'Michael', address: 'Valley 345' },
//         { name: 'Sandy', address: 'Ocean blvd 2' },
//         { name: 'Betty', address: 'Green Grass 1' },
//         { name: 'Richard', address: 'Sky st 331' },
//         { name: 'Susan', address: 'One way 98' },
//         { name: 'Vicky', address: 'Yellow Garden 2' },
//         { name: 'Ben', address: 'Park Lane 38' },
//         { name: 'William', address: 'Central st 954' },
//         { name: 'Chuck', address: 'Main Road 989' },
//         { name: 'Viola', address: 'Sideway 1633' }
//     ];
//     dbo.collection("customers").insertMany(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("Number of documents inserted: " + res.insertedCount);
//         db.close();
//     });
// });

// Get Id from resultset
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = [
//       { _id: 154, name: 'Chocolate Heaven'},
//       { _id: 155, name: 'Tasty Lemon'},
//       { _id: 156, name: 'Vanilla Dream'}
//     ];
//     dbo.collection("products").insertMany(myobj, function(err, res) {
//       if (err) throw err;
//       console.log(res);
//       db.close();
//     });
//   });

// Find one
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("customers").findOne({}, function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

// Find all
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("customers").find({}).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

// Projection
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("customers").find({}, { projection: { _id: 0 } }).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

// Filter
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var query = { address: "Park Lane 38" };
//     var projection =  { projection: { _id: 0 } };
//     dbo.collection("customers").find(query, projection).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

// Regex
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var query = { address: /^S/ };
//     var projection =  { projection: { _id: 0 } };
//     dbo.collection("customers").find(query, projection).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

// Sort: asc
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var mysort = { name: 1 };
//     var projection =  { projection: { _id: 0 } };
//     dbo.collection("customers").find({},projection).sort(mysort).toArray(function(err, result) {
//       if (err) throw err;
//       console.log(result);
//       db.close();
//     });
//   });

// Update: one record
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myquery = { address: "Valley 345" };
//     var newvalues = { $set: {name: "Mickey", address: "Canyon 123" } };
//     dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
//       if (err) throw err;
//       console.log("1 document updated");
//       db.close();
//     });
//   });

// Update: many records
// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myquery = { address: /^S/ };
//     var newvalues = {$set: {name: "Minnie"} };
//     dbo.collection("customers").updateMany(myquery, newvalues, function(err, res) {
//       if (err) throw err;
//       console.log(res.result.nModified + " document(s) updated");
//       db.close();
//     });
//   });

// Limit & Skip
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("tesis");
    var projection = { projection: { _id: 0 } };
    // dbo.collection("customers").find({}, projection).skip(0).limit(4).toArray(function (err, result) {
    //     if (err) throw err;
    //     console.log("1-4");
    //     console.log(result);
    // });
    // dbo.collection("customers").find({}, projection).skip(4).limit(4).toArray(function (err, result) {
    //     if (err) throw err;
    //     console.log("5-8");
    //     console.log(result);
    // });
    // dbo.collection("customers").find({}, projection).skip(8).limit(4).toArray(function (err, result) {
    //     if (err) throw err;
    //     console.log("9-12");
    //     console.log(result);
    // });
    // dbo.collection("customers").find({}, projection).skip(12).limit(4).toArray(function (err, result) {
    //     if (err) throw err;
    //     console.log("13-17");
    //     console.log(result);
    // });
    // dbo.collection("customers").find().count(function (err, result) {
    //     console.log("Total: " + result);
    // });
    var min = 2
    var max = 3.5
    var offset = 0
    var length = 10
    var query = { $and: [{ stars: { $gte: min } }, { stars: { $lte: max } }] }
    console.info("querying mongo");
    var t0m = process.hrtime();
    var data = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err
        console.info("connected to mongo");
        var dbo = db.db("tesis");
        dbo.collection("business").find(query, projection).skip(offset).limit(length).toArray(function(err, result){
            if(err) console.error(err)
            data = result;
            var t1m = process.hrtime(t0m);
            console.info("querying mongo => Execution time (hr): %ds %dms", t1m[0], t1m[1] / 1000000);
            console.info(data);
        })        
    });
});

console.log("=====================================================================");

// MongoClient.connect(url, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.collection("orders").drop(function(err, delOK) {
//       if (err) throw err;
//       if (delOK) console.log("Collection deleted");
//     });
//     dbo.collection("products").drop(function(err, delOK) {
//         if (err) throw err;
//         if (delOK) console.log("Collection deleted");
//         db.close();
//       });
//   });

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = { _id: 1, product_id: 154, status: 1 };
//     dbo.collection("orders").insertOne(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("1 document inserted");
//         db.close();
//     });
// });

// MongoClient.connect(url, function (err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     var myobj = [
//          { _id: 154, name: 'Chocolate Heaven' },
//   { _id: 155, name: 'Tasty Lemons' },
//   { _id: 156, name: 'Vanilla Dreams' }
//     ];
//     dbo.collection("products").insertMany(myobj, function (err, res) {
//         if (err) throw err;
//         console.log("Number of documents inserted: " + res.insertedCount);
//         db.close();
//     });
// });

// Aggregate: join

// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("mydb");
//   dbo.collection('orders').aggregate([
//     { $lookup:
//        {
//          from: 'products',
//          localField: 'product_id',
//          foreignField: '_id',
//          as: 'orderdetails'
//        }
//      }
//     ]).toArray(function(err, res) {
//     if (err) throw err;
//     console.log(JSON.stringify(res));
//     db.close();
//   });
// }); 
  