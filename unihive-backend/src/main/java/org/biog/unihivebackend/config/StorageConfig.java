package org.biog.unihivebackend.config;

import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class StorageConfig {

    @Value("${spring.cloud.gcp.credentials.location}")
    private String credentialsLocation;

    @Bean
    public Storage getStorage() throws FileNotFoundException, IOException {
        return StorageOptions.newBuilder()
                .setCredentials(ServiceAccountCredentials
                        .fromStream(new FileInputStream(
                                "C:\\Users\\Mcmon\\Downloads\\temp\\development-platform-biog\\unihive-backend\\src\\main\\resources\\gcp-account-file.json")))
                .build().getService();
    }
}
