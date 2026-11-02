# Stage 1: Build Java artifact using Maven
FROM maven:3.9.6-eclipse-temurin-17 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Minimal JRE Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
VOLUME /tmp
ARG JAR_FILE=/app/target/*.jar
COPY --from=builder /app/target/*.jar app.jar
RUN mkdir -p uploads/resumes
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
