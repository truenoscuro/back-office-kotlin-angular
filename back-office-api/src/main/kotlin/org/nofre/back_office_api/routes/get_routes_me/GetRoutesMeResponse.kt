package org.nofre.back_office_api.routes.get_routes_me

import org.nofre.back_office_api.routes.domain.ScreenKeys

internal data class GetBreadcrumbMeResponse(
    val title: String,
    val key: ScreenKeys?
)


internal data class GeRouteMeResponse(
    //general
    val path: String,
    val completePath: List<String> = listOf(),
    val children: List<GeRouteMeResponse> = listOf(),
    val breadcrumb: List<GetBreadcrumbMeResponse> = listOf(),

    //Partes del menú
    val isMenu: Boolean = false,
    val menuTitle: String? = null,
    val menuIcon: String? = null,
    val menuOrder: Long?,
    //Partes de la pantalla
    val screenKey: ScreenKeys? = null,
    val screenTitle: String? = null,
    val tabBarTitle: String? = null,
)