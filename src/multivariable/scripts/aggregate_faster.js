db.business.aggregate([
    {"$group" : {_id:"$stars", count:{$sum:1}}},
    {"$sort": {"count": -1}}
])