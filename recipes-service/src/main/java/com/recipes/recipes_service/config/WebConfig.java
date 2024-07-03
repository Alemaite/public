package com.recipes.recipes_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("https://iu-recipes-frontend-997a604138d2.herokuapp.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }

}
