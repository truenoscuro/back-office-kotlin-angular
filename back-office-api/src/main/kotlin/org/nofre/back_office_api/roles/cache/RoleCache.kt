package org.nofre.back_office_api.roles.cache

import org.nofre.back_office_api.roles.Permissions
import org.nofre.back_office_api.roles.RoleCacheProvider
import org.nofre.back_office_api.roles.domain.RoleCacheManager
import org.nofre.back_office_api.roles.getFormattedRole
import org.springframework.stereotype.Service
import java.util.concurrent.ConcurrentHashMap

@Service
class RoleCache : RoleCacheManager, RoleCacheProvider {

    private val permissions: ConcurrentHashMap<String, List<Permissions>> = ConcurrentHashMap()


    override fun add(role: String, permissions: List<Permissions>) {
        this.permissions[getFormattedRole(role)] = permissions.map { it }
    }

    override fun permissions(role: String) = this.permissions[getFormattedRole(role)] ?: emptyList()
    override fun roles(): Set<String> = this.permissions.keys

    override fun remove(role: String, permissions: List<Permissions>) {
        val key = getFormattedRole(role)
        if (permissions.isEmpty()) this.permissions.remove(key)
        else this.permissions[key] = this.permissions[key]?.filter { !permissions.contains(it) } ?: emptyList()
    }

    override fun clear() {
        permissions.clear()
    }

}