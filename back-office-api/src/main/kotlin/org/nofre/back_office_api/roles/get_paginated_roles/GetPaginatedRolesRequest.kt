package org.nofre.back_office_api.roles.get_paginated_roles

import org.nofre.back_office_api.shared.database.EqualFilter


internal data class GetPaginatedRolesRequest(
    val text: String = "",
    val active: EqualFilter<Boolean> = EqualFilter(),
)