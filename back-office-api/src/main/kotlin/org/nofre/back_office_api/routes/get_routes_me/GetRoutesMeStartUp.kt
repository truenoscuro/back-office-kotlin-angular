package org.nofre.back_office_api.routes.get_routes_me

import org.nofre.back_office_api.roles.RoleCacheProvider
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Component

@Component
internal class GetRoutesMeStartUp(
    val roleCache: RoleCacheProvider,
    val handler: GetRoutesMeHandler
) {


    @EventListener(ApplicationReadyEvent::class)
    fun initRoleCache() {
        //Recojemos todos los roles
        val roles = roleCache.roles()
        //Inicializamos la caché
        roles.forEach {
            handler.getRoutes(role = it)
        }

    }

}