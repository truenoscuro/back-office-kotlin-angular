package org.nofre.back_office_api.roles.get_paginated_roles

import org.nofre.back_office_api.shared.database.SearchQuery
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RestController

@RestController
internal class GetPaginatedRoledEndpoint(val handler: GetPaginatedRolesHandler) {

    @PostMapping("/api/roles/search")
    fun findAll(rq: SearchQuery<GetPaginatedRolesRequest>) = handler.findAll(rq)

}