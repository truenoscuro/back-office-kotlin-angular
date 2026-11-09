package org.nofre.back_office_api.routes.get_routes_me

import org.nofre.back_office_api.roles.getContextRole
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController


@RestController
internal class GetRoutesMeEndpoint(val handler: GetRoutesMeHandler) {


    @GetMapping("/api/routes/me")
    fun getRoutesMe() = handler.getRoutes(getContextRole())

}