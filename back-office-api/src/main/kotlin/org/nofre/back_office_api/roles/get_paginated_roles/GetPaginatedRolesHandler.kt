package org.nofre.back_office_api.roles.get_paginated_roles

import org.nofre.back_office_api.roles.domain.Role
import org.nofre.back_office_api.shared.database.SearchQuery
import org.nofre.back_office_api.shared.database.toResponse
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.domain.Specification
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service


internal interface GetPaginatedRolesRepository : Repository<Role, Long> {
    fun findAll(query: Specification<Role>, pageable: Pageable): Page<Role>
}


@Service
internal class GetPaginatedRolesHandler(val repository: GetPaginatedRolesRepository,
                                        val specification: GetPaginatedRolesSpecification) {


    fun findAll(rq: SearchQuery<GetPaginatedRolesRequest>) =
        repository.findAll(specification.getFilter(rq.filters), rq.getPageRequest())
            .toResponse { role ->
                GetPaginatedRolesResponse(id = role.id, key = role.key, description = role.description)
            }


}