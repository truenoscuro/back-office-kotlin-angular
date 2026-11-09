package org.nofre.back_office_api.spring_configs.spring_security

import org.nofre.back_office_api.roles.RoleCacheProvider
import org.nofre.back_office_api.roles.getFormattedRole
import org.nofre.back_office_api.shared.jwt.email
import org.nofre.back_office_api.shared.jwt.role
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken
import org.springframework.security.web.SecurityFilterChain

@Configuration
@EnableWebSecurity
internal class SprintSecurityConfig {
    @Bean
    @Order(Ordered.HIGHEST_PRECEDENCE)
    fun filterChain(
        http: HttpSecurity, roleCache: RoleCacheProvider
    ): SecurityFilterChain = http.csrf { it.disable() }.cors { it.disable() }.authorizeHttpRequests {
        it.requestMatchers(
            "/api/auth/**",
            "/api/i18n/**",
            "/internal/api/**"
        ).permitAll().anyRequest().authenticated()
    }.oauth2ResourceServer { oauth2 ->
        oauth2.jwt { jwt ->
            jwt.jwtAuthenticationConverter { jwt ->

                //Añadimos los datos que queremos
                val email = checkNotNull(jwt.email) { "No hay email en el JWT" }
                val role = checkNotNull(jwt.role) { "No hay rol en el JWT" }

                //Añadimos los roles y los permisos
                val permissions = roleCache.permissions(role)
                val authorities = mutableListOf<GrantedAuthority>(SimpleGrantedAuthority(getFormattedRole(role)))
                authorities.addAll(permissions.map { SimpleGrantedAuthority(it.name) })

                JwtAuthenticationToken(jwt, authorities, email)
            }
        }
    }.build()

}




