package com.example.collabplatform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * WebConfig 클래스는 Spring MVC 설정을 위한 클래스입니다.
 * 여기서는 CORS 설정과 정적 리소스 핸들러 설정을 담당합니다.
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS 설정: React( http://localhost:3000 )에서 오는 요청을 허용합니다.
     *
     * 이 설정을 통해 프론트엔드와 백엔드가 다른 포트에서 실행될 때 발생하는
     * 동일 출처 정책 문제를 해결할 수 있습니다.
     *
     * @param registry CORS 매핑 정보를 등록할 수 있는 객체
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000")
                .allowedMethods("GET", "POST", "PUT", "DELETE");
    }

    /**
     * 정적 리소스 핸들러 설정: 파일 시스템의 "uploads" 폴더를 "/uploads/**" URL로 매핑합니다.
     *
     * 업로드된 이미지 파일을 브라우저에서 접근할 수 있도록 매핑하여,
     * 예를 들어, "http://localhost:8080/uploads/profile-images/파일명" 형태로
     * 접근할 수 있게 합니다.
     *
     * @param registry 정적 리소스 매핑 정보를 등록할 수 있는 객체
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations("file:uploads/");
    }
}