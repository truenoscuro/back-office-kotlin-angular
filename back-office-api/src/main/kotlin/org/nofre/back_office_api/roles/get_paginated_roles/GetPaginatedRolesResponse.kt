package org.nofre.back_office_api.roles.get_paginated_roles

internal data class GetPaginatedRolesResponse(
    val id: Long,
    val key: String,
    val description: String,
)