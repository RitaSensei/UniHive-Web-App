package org.biog.unihivebackend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final AuthenticationProvider authenticationProvider;

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(requests -> requests
            .requestMatchers("/auth/authenticate", "/auth/forgotPassword")
            .permitAll()
            .requestMatchers("/auth/register/**")
            .hasRole("SUPER_ADMIN")
            .requestMatchers("/admin/**")
            .hasAnyRole("ADMIN", "SUPER_ADMIN")
            .requestMatchers("/club/**")
            .hasAnyRole("CLUB", "SUPER_ADMIN")
            .requestMatchers("/student/**")
            .hasAnyRole("STUDENT", "SUPER_ADMIN")
            .requestMatchers("/auth/changePassword")
            .hasAnyRole("STUDENT", "CLUB", "ADMIN")
            .requestMatchers("/superadmin/**")
            .hasRole("SUPER_ADMIN")
            .anyRequest()
            .authenticated())
        .sessionManagement(management -> management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authenticationProvider(authenticationProvider)
        .addFilterBefore(
            jwtAuthFilter,
            UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }
}
