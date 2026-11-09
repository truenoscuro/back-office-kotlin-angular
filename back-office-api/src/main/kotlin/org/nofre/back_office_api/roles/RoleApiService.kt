package org.nofre.back_office_api.roles


data class RoleApi(val id: Long, val name: String, val permissions: List<Permissions> = listOf())


interface RoleApiService {
    fun getRole(id: Long): RoleApi
    fun getRole(name: String): RoleApi

}