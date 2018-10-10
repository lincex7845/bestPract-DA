db.business.mapReduce(
function() {emit (this.stars, 1)},
function (k,v){ return Array.sum(v) },
{out: "stars_map_reduce"}
)