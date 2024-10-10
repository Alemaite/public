FROM openjdk:22-jdk

ARG JAR_FILE=target/*.jar

COPY ./target/recipes-service-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java", "-jar", "/app.jar"]
