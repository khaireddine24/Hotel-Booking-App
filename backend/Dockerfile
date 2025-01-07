
FROM openjdk:17-jdk-alpine

WORKDIR /app


COPY target/hotelapp-1-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 9090

ENTRYPOINT ["java", "-jar", "app.jar"]
