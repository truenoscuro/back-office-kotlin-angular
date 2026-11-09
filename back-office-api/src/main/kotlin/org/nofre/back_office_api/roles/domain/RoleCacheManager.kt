package org.nofre.back_office_api.roles.domain

import org.nofre.back_office_api.roles.Permissions

interface RoleCacheManager {
    fun add(role: String, permissions: List<Permissions>)
    fun remove(role: String, permissions: List<Permissions> = listOf())

    fun clear()
}