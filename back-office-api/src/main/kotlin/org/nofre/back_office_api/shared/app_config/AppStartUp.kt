package org.nofre.back_office_api.shared.app_config

import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component
import java.util.*


@Component

class AppStartUp(val passwordEncoder: PasswordEncoder) {

    @Order(Ordered.HIGHEST_PRECEDENCE)
    @EventListener(ApplicationReadyEvent::class)
    fun onApplicationReady(event: ApplicationReadyEvent) {
        val password = UUID.randomUUID().toString().replace("-", "").take(16)
        println("Password: ${password} - encoded: ${passwordEncoder.encode("password")}")
    }

}