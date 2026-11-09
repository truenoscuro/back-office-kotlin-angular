package org.nofre.back_office_api.auth.verify

import org.nofre.back_office_api.roles.Permissions

internal data class VerifyResponse(
    val token: String,
    val role: String,
    val email: String,
    val permissions: List<Permissions>
)