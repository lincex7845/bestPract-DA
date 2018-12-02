db.business.aggregate([
    { 
        $project : { state : 1 , stars : 1, review_count:1, _id:0 }
    },
    {
        $group : {
            _id:{ state: "$state", stars: "$stars"},
           avg_review_count:{$avg:"$review_count"}
        }
    },
    {
        $sort: {"_id.state": 1, "_id.stars":1}
    }    
])