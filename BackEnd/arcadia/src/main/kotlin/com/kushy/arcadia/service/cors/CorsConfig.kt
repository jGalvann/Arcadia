package com.kushy.arcadia.service.cors

import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer


/*
    CORS -> cross-origin resource sharing.
    Restringe como o código JS de uma página pode interagir com recursos de um dóminio diferente.

 */
@Configuration
class CorsConfig : WebMvcConfigurer {
    override fun addCorsMappings(registry: CorsRegistry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "DELETE", "PUT")
            .allowedHeaders("*")
    }
}