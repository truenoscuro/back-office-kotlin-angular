package org.nofre.back_office_api.roles.get_paginated_roles

import org.nofre.back_office_api.roles.domain.Role
import org.nofre.back_office_api.shared.database.equalFilter
import org.nofre.back_office_api.shared.database.ilike
import org.springframework.data.jpa.domain.Specification
import org.springframework.stereotype.Service

@Service
internal class GetPaginatedRolesSpecification {

    fun getFilter(filters: GetPaginatedRolesRequest?): Specification<Role> = { root, query, builder ->
        if (filters == null) {
            builder.conjunction()
        } else {
            val text = "%${filters.text}%"
            val keyFilter = builder.ilike(root["key"], text)
            val descriptionFilter = builder.ilike(root["description"], text)
            val activeFilter = builder.equalFilter(root["isActive"], filters.active)
            builder.and(
                builder.or(keyFilter, descriptionFilter),
                activeFilter
            )
        }

    }
}