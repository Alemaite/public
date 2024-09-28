# Read Me First
Please note that I do not provide the files with authentication details for my MongoDB on the cloud server.

# Getting Started (with Docker)
- install this project using Maven
- run `docker compose up` in the root directory of this project to spin up a MongoDB container, it will import data using
  the `import-data.sh` shell script
- a container for the backend will also be spun up
- you should now have a mongodb with data running under `mongodb://localhost:27017` (no username or password needed)
- be sure to shut down your local mongodb (if you have one installed) as it might interfere with the one running in the container (same port)
- the backend container should now be able to interact with the database container

# Getting Started (without Docker)
- install MongoDB locally or set up a cloud database (`https://www.mongodb.com/products/platform/atlas-database`)
- add a database `recipes-service-test`, a collection `recipes`, and import the `recipes.json` (project root directory)
- be sure to check that the uri in the `src/main/resources/application-test.properties` is correct
- run this project; the backend should now be able to interact with the database

### Reference Documentation
For further reference, please consider the following sections:

* [Official Apache Maven documentation](https://maven.apache.org/guides/index.html)
* [Spring Boot Maven Plugin Reference Guide](https://docs.spring.io/spring-boot/docs/3.3.0/maven-plugin/reference/html/)
* [Create an OCI image](https://docs.spring.io/spring-boot/docs/3.3.0/maven-plugin/reference/html/#build-image)
* [Spring Web](https://docs.spring.io/spring-boot/docs/3.3.0/reference/htmlsingle/index.html#web)
* [Spring Boot DevTools](https://docs.spring.io/spring-boot/docs/3.3.0/reference/htmlsingle/index.html#using.devtools)
* [Rest Repositories](https://docs.spring.io/spring-boot/docs/3.3.0/reference/htmlsingle/index.html#howto.data-access.exposing-spring-data-repositories-as-rest)
* [Spring Data MongoDB](https://docs.spring.io/spring-boot/docs/3.3.0/reference/htmlsingle/index.html#data.nosql.mongodb)

### Guides
The following guides illustrate how to use some features concretely:

* [Building a RESTful Web Service](https://spring.io/guides/gs/rest-service/)
* [Serving Web Content with Spring MVC](https://spring.io/guides/gs/serving-web-content/)
* [Building REST services with Spring](https://spring.io/guides/tutorials/rest/)
* [Accessing JPA Data with REST](https://spring.io/guides/gs/accessing-data-rest/)
* [Accessing Neo4j Data with REST](https://spring.io/guides/gs/accessing-neo4j-data-rest/)
* [Accessing MongoDB Data with REST](https://spring.io/guides/gs/accessing-mongodb-data-rest/)
* [Accessing Data with MongoDB](https://spring.io/guides/gs/accessing-data-mongodb/)

