var res = db.runCommand({splitVector: "tesis.business", keyPattern: {stars: 1}, maxChunkSizeBytes: 4000000})
var keys = res.splitKeys
var mapred = db.business.mapReduce(
function() {emit (this.stars, 1)},
function (k,v){ return Array.sum(v) },
{out: "stars_map_reduce_thread"},
{ sort: {stars: 1}}
)
var numThreads = 2
var inc = Math.floor(keys.length / numThreads) + 1
threads = []; for (var i = 0; i < numThreads; ++i) {
    var min = (i == 0) ? 0 : keys[i * inc].dim0; 
    var max = (i * inc + inc >= keys.length) ? MaxKey : keys[i * inc + inc].dim0 ;
    print("min:" + min + " max:" + max);
    var t = new ScopedThread(mapred, min, max); threads.push(t); t.start() 
    }
    
 for (var i in threads) { var t = threads[i]; t.join(); printjson(t.returnData()); }