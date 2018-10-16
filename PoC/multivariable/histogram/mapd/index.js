const Connector = require("./node-connector.js")
let query_heatmap = 'select state, stars, avg(review_count) as avg_review_count from business group by state, stars order by state, stars';
let query_histogram = 'select stars, count(*) as records from business group by stars order by records desc'
const defaultQueryOptions = {};
const connector = new Connector();

const mapd_user = process.env.MAPD_USER;
const mapd_passwd = process.env.MAPD_PASSWD;
const mapd_db = "mapd";
const mapd_port = 9092

connector
    .protocol("http")
    .host("localhost")
    .port(mapd_port)
    .dbName(mapd_db)
    .user(mapd_user)
    .password(mapd_passwd)
    .connectAsync()
    .then(session =>
        // now that we have a session open we can make some db calls:
        Promise.all([
            session.queryAsync(query_heatmap, defaultQueryOptions),
            session.queryAsync(query_histogram, defaultQueryOptions)
        ])
    ).then(values => {
        console.log("\nQuery histogram results:\n\n",values[1]);
        console.log("\nQuery he atmap results:\n\n",values[1]);
    })
    .catch(error => {
        console.error("Something bad happened: ", error)
    });
