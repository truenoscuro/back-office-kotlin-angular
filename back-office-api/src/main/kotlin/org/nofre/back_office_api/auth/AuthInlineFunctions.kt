package org.nofre.back_office_api.auth

import org.springframework.security.core.context.SecurityContextHolder


fun getContextEmail(): String? =
    SecurityContextHolder.getContext().authentication?.name
