package org.nofre.back_office_api.spring_configs

import org.nofre.back_office_api.auth.getContextEmail
import org.springframework.context.annotation.Bean
import org.springframework.data.domain.AuditorAware
import org.springframework.data.jpa.repository.config.EnableJpaAuditing
import java.util.*


class AuditorAwareImpl : AuditorAware<String> {

    override fun getCurrentAuditor(): Optional<String> {
        val email = getContextEmail()
        if (email.isNullOrBlank()) {
            return Optional.of("admin")
        }
        return Optional.of(email)
    }


}


@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
class SpringAuditorConfig {

    @Bean("auditorProvider")
    fun auditorProvider() = AuditorAwareImpl()
    
}