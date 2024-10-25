package backend.gateway.config;

import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthConfig {

    @Value("${auth.exclude.paths}")
    private List<String> excludedPaths;

    public List<String> getExcludedPaths() {
        return excludedPaths;
    }
}
