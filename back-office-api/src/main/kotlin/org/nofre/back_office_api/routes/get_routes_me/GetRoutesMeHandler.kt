package org.nofre.back_office_api.routes.get_routes_me

import org.nofre.back_office_api.roles.RoleApiService
import org.nofre.back_office_api.routes.domain.Route
import org.springframework.cache.annotation.Cacheable
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.Repository
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

internal interface GetRoutesMeRepository : Repository<Route, Long> {

    @Query(
        """
        select r
        from Route r
        where r.menu.isPrincipal = true
        AND r.roleId = :roleId
        """
    )
    fun findPrincipalRoutes(@Param("roleId") roleId: Long): List<Route>
}


@Service
internal class GetRoutesMeHandler(
    val repository: GetRoutesMeRepository, val roleApiService: RoleApiService
) {

    @Transactional(readOnly = true)
    @Cacheable(value = ["roleMe"], key = "#role")
    fun getRoutes(role: String): List<GeRouteMeResponse> {
        val roleApi = roleApiService.getRole(role)

        return repository.findPrincipalRoutes(roleApi.id)
            .map {
                createRoute(it)
            }
    }

    fun createRoute(
        route: Route, completePathAnt: List<String> = listOf()
    ): GeRouteMeResponse {
        //Añadimos el path
        val completePath = completePathAnt.toMutableList()
        completePath.add(route.path)

        //Calculamos el breadcrumb
        val breadcrumbs = mutableListOf(GetBreadcrumbMeResponse(
            title = route.breadcrumbTitle,
            key = route.screen?.key,
        ))
        var currentRoute = route.father
        while (currentRoute != null) {
            breadcrumbs.add(
                GetBreadcrumbMeResponse(
                    title = currentRoute.breadcrumbTitle,
                    key = currentRoute.screen?.key,
                )
            )
            currentRoute = currentRoute.father
        }


        val children = if (route.screen == null)
            route.children.map { createRoute(it, completePath) }
        else emptyList()
        return GeRouteMeResponse(
            path = route.path,
            completePath = completePath,
            children = children,
            breadcrumbs = breadcrumbs.reversed(),
            isMenu = route.menu != null,
            menuTitle = route.menu?.title,
            menuIcon = route.menu?.icon,
            menuOrder = route.menu?.order,
            screenKey = route.screen?.key,
            tabBarTitle = route.screen?.tabBarTitle,
            screenTitle = route.screen?.title,
        )

    }


}