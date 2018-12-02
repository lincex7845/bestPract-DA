Dependencies:
 * restify
 * MapD (at least v. 4.0) Follow [this tutorial](https://www.omnisci.com/docs/v4.0.0/4_installation_recipes.html) to install MapD

 This application performs:

 - Aggregate query to group documents by stars. Also, it counts the amount of documents which have a similar rating (stars)
 - Query pagination to retrieve documents which meet the criteria selected from the histogram visualization

 This goal of this application is to measure the execution time that takes to perform queries to explore large data (1GB - 100GB)

Follow [this tutorial](https://www.omnisci.com/docs/v4.0.0/4_import_data.html) to import the data from [here](https://github.com/lincex7845/bestPract-DA/raw/master/PoC/multivariable/poc_vega_pagination/business.zip)

To start the application please execute the command below

`$ node index.js` 

Go to `localhost:2200` to interact with the histogram visualization