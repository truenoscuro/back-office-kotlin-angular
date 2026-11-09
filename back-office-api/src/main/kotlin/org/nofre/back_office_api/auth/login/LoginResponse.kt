package org.nofre.back_office_api.auth.login

import org.nofre.back_office_api.roles.Permissions

internal data class LoginResponse(
    val token: String,
    val role: String,
    val permissions: List<Permissions>
)