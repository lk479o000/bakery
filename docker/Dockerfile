FROM openjdk:21-jdk-slim

WORKDIR /app

COPY server/target/*.jar app.jar

EXPOSE 8150

ENTRYPOINT ["java", "-jar", "app.jar"]