Dependencies:
 * mongod
 * restify
 * MongoDB (at least v. 3.4)

 This application performs:

 - Aggregate query to group documents by state and stars. Also, it counts the average amount of reviews for the documents which have a similar state and rating (stars)
 - Query pagination to retrieve documents which meet the criteria selected from the heatmap visualization

 This goal of this application is to measure the execution time that takes to perform queries to explore large data (1GB - 100GB)

Use [mongoimport](https://docs.mongodb.com/manual/reference/program/mongoimport/) to import the data from [here](https://github.com/lincex7845/bestPract-DA/raw/master/PoC/multivariable/poc_vega_pagination/business.zip)

To start the application please execute the command below

`$ node index.js` 

Go to `localhost:3232` to interact with the heatmap visualization