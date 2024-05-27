# Stage 1: Build the backend
FROM maven:3.8.3-openjdk-17 as build-backend
WORKDIR /app/unihive-backend
COPY /unihive-backend/pom.xml .
COPY /unihive-backend/src ./src
RUN mvn clean package -DskipTests

# Stage 2: Prepare the final image
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy the Spring Boot jar
COPY --from=build-backend /app/unihive-backend/target/*.jar ./app.jar
# Copy the Google Cloud credentials file
COPY --from=build-backend /app/unihive-backend/src/main/resources/gcp-account-file.json ./gcp-account-file.json
# Set environment variable for Google Cloud credentials
ENV GOOGLE_CLOUD_CREDENTIALS=./gcp-account-file.json

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
