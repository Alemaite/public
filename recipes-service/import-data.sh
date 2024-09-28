# imports recipes.json in mongodb container
mongoimport --db recipes-service-test --collection recipes --file data/recipes.json --jsonArray