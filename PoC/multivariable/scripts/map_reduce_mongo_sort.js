db.runCommand({
    mapreduce: "business",
    map: function() { emit (this.stars, 1) },
    reduce: function (k,v){ return Array.sum(v) },
    out: "stars_map_reduce_sort",
    sort: {stars: 1}
})