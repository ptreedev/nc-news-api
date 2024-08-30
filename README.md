# Northcoders News API

Welcome to my NC_News_API. This a project I've been working on to learn, create and test endpoints for an API.  You can find the live version here:https://nc-news-api-ne3e.onrender.com/api
 
 ## To get set up follow the instructions below

1. First clone the project from github onto your local machine (instructions can be found at https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
2. Open up your cloned version in your chosen code editing software
3. Create 2 .env files (.env.test and .env.development) in your root directory for connecting to each of the databases. Inside these files you'll want to use PGDATABASE=name_of_database replacing "name_of_database" with the names of the corresponding databases. '.env.test' should be for your test database and the '.env.development' should be for the development datatbase
4. Run 'npm install' in the CLI to install all of the dependencies
5. Check your scripts in package.json, they should look like this: 

``` "scripts" : { ``` \
 ```    "setup-dbs": "psql -f ./db/setup.sql", ``` \
 ```    "seed": "node ./db/seeds/run-seed.js" ``` \
``` } ``` 

and run them in this order using "npm run ... " 
* setup-dbs 
* seed 
6. To check everything is working type 'psql' into the CLI to enter psql then '\c nc_news' to check your connection to the database. Then use '\dt' to check the tables / seed script has run correctly. You should see tables with names like articles / comments / topics. If these appear you're good to go!

---

Minumum versions: \
node v22.0.0 \
psql v16.4


--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
