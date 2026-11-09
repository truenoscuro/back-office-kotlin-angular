package org.nofre.back_office_api.roles

import org.springframework.security.core.context.SecurityContextHolder

fun getFormattedRole(roleName: String) = if (roleName.uppercase().trim().startsWith("ROLE_")) {
    roleName.uppercase().trim()
} else {
    "ROLE_${roleName}".uppercase().trim()
}


fun getPureRole(roleName: String) = if (roleName.uppercase().trim().startsWith("ROLE_")) {
    roleName.uppercase().trim().removePrefix("ROLE_")
} else {
    roleName.uppercase().trim()
}


fun getContextRole() =
    getPureRole(
        (SecurityContextHolder.getContext().authentication?.authorities ?: listOf())
            .mapNotNull { it.authority }
            .find { it.startsWith("ROLE_") } ?: "ROLE_ANONYMOUS"
    )