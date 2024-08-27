# Northcoders News API

Welcome to my NC_News_API. To get set up follow the instructions below.
1. Create 2 .env files (.env.test and .env.development) in your root directory for connecting to each of the databases.
2. Inside these files you'll want to use PGDATABASE=name_of_database replacing "name_of_database" with the names of the corresponding databases. .env.test should be for your test database and the .env.development should be for the "working" datatbase
3. Run npm install
4. Check your scripts in package.json and run them in this order using "npm run ... "
    setup-dbs
    seed
5. enter psql to check your connection to the database (connect to database and use \dt to check the tables / seed script has run correctly).




--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
