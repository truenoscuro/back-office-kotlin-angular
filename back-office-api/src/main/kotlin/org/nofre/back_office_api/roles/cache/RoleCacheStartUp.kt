package org.nofre.back_office_api.roles.cache

import org.nofre.back_office_api.roles.domain.Role
import org.nofre.back_office_api.roles.domain.RoleCacheManager
import org.nofre.back_office_api.shared.logger.Loggable
import org.nofre.back_office_api.shared.logger.log
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Slice
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional


internal interface RoleStartUpRepository : Repository<Role, Long> {
    fun findAllByIsActiveIsTrue(page: Pageable): Slice<Role>
}


@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
internal class RoleCacheStartUp(
    val repository: RoleStartUpRepository, val cacheManager: RoleCacheManager
) : Loggable {


    @Transactional(readOnly = true)
    @EventListener(ApplicationReadyEvent::class)
    fun initCache() {

        try {
            var index = 0
            var hasNextPage: Boolean

            cacheManager.clear()
            do {
                val roles = repository.findAllByIsActiveIsTrue(PageRequest.of(index++, 50))
                hasNextPage = roles.hasNext()
                //Cargamos todos los roles y permisos
                for (role in roles) {
                    val roleName = role.key
                    val permissionsName = role.rolePermissions.mapNotNull { it.id?.permission }
                    cacheManager.add(roleName, permissionsName)
                }
            } while (hasNextPage)

        } catch (e: Exception) {
            log.error("Error initializing role cache", e)
        }
    }
}