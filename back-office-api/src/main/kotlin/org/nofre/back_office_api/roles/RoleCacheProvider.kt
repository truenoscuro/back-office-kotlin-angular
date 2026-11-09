package org.nofre.back_office_api.roles

interface RoleCacheProvider {
    fun permissions(role: String): List<Permissions>
    fun roles(): Set<String>
}