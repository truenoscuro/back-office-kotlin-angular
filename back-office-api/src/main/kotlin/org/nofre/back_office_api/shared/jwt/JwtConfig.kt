package org.nofre.back_office_api.shared.jwt

import com.nimbusds.jose.jwk.source.ImmutableSecret
import com.nimbusds.jose.proc.SecurityContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.oauth2.jwt.JwtDecoder
import org.springframework.security.oauth2.jwt.JwtEncoder
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder
import java.nio.charset.StandardCharsets
import javax.crypto.SecretKey
import javax.crypto.spec.SecretKeySpec

@Configuration
class JwtConfig(val properties: JwtProperties) {

    private val secretKey: SecretKey by lazy {
        SecretKeySpec(
            properties.secret.toByteArray(StandardCharsets.UTF_8), "HmacSHA256"
        )
    }

    @Bean
    fun jwtEncoder(): JwtEncoder {
        val secretSource = ImmutableSecret<SecurityContext>(secretKey.encoded)
        return NimbusJwtEncoder(secretSource)
    }

    @Bean
    fun jwtDecoder(): JwtDecoder {
        return NimbusJwtDecoder.withSecretKey(secretKey).build()
    }
}