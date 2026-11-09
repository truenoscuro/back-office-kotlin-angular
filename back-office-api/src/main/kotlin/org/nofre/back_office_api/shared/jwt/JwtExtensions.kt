package org.nofre.back_office_api.shared.jwt

import org.springframework.security.oauth2.jwt.Jwt


val Jwt.role: String?
    get() = this.getClaimAsString("role")

val Jwt.email: String?
    get() = this.subject