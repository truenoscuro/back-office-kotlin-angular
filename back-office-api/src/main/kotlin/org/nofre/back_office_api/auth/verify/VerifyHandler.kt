package org.nofre.back_office_api.auth.verify

import org.nofre.back_office_api.roles.RoleCacheProvider
import org.nofre.back_office_api.shared.jwt.JwtService
import org.nofre.back_office_api.shared.jwt.email
import org.nofre.back_office_api.shared.jwt.role
import org.springframework.stereotype.Service

@Service
internal class VerifyHandler(val jwtService: JwtService, val roleCache: RoleCacheProvider) {


    fun verify(token: String): VerifyResponse {
        val jwt = jwtService.decode(token)
        val email = checkNotNull(jwt.email) { "Email requerido" }
        val role = checkNotNull(jwt.role) { "Rol requerido" }
        val permissions = roleCache.permissions(role)
        val token = jwtService.generate(email = email, role = role)

        return VerifyResponse(token = token, role = role, email = email, permissions = permissions)
    }

}