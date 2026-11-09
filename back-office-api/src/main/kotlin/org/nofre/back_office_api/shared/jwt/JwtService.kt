package org.nofre.back_office_api.shared.jwt


import org.springframework.security.oauth2.jose.jws.MacAlgorithm
import org.springframework.security.oauth2.jwt.*
import org.springframework.stereotype.Service
import java.time.Instant
import java.time.temporal.ChronoUnit


@Service
class JwtService(
    val properties: JwtProperties,
    val jwtEncoder: JwtEncoder,
    val jwtDecoder: JwtDecoder,
) {


    fun generate(email: String, role: String, extraClaims: Map<String, Any> = emptyMap()): String {
        val now = Instant.now()
        val expiryDate = now.plus(properties.expirationMs, ChronoUnit.MILLIS)

        val claimsBuilder = JwtClaimsSet.builder()
            .issuer("self")
            .issuedAt(now)
            .expiresAt(expiryDate)
            .subject(email)

        extraClaims.forEach { (key, value) ->
            claimsBuilder.claim(key, value)
        }
        claimsBuilder.claim("role", role)

        val claims = claimsBuilder.build()
        val jwtHeader = JwsHeader.with(MacAlgorithm.HS256).build()
        return jwtEncoder.encode(JwtEncoderParameters.from(jwtHeader, claims)).tokenValue

    }

    fun validate(token: String) = try {
        val jwt = jwtDecoder.decode(token)
        jwt.expiresAt?.isAfter(Instant.now()) == true
    } catch (e: Exception) {
        false
    }

    fun decode(token: String): Jwt = jwtDecoder.decode(token)


}