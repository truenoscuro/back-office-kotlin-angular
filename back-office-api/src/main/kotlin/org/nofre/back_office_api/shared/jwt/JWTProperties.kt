package org.nofre.back_office_api.shared.jwt

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "jwt")
data class JwtProperties(
    val secret: String,
    val expirationMs: Long = 86_400_000 // 24h per defecte si no es defineix
)