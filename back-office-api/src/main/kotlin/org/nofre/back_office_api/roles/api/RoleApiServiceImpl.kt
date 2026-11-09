package org.nofre.back_office_api.roles.api

import org.nofre.back_office_api.roles.RoleApi
import org.nofre.back_office_api.roles.RoleApiService
import org.nofre.back_office_api.roles.domain.Role
import org.nofre.back_office_api.roles.getPureRole
import org.springframework.data.repository.Repository
import org.springframework.stereotype.Service

interface RoleApiRepository : Repository<Role, Long> {
    fun findById(userId: Long): Role?
    fun findByKey(name: String): Role?

}

@Service
class RoleApiServiceImpl(val repository: RoleApiRepository) : RoleApiService {


    override fun getRole(id: Long): RoleApi {
        val role = checkNotNull(repository.findById(id))
        return RoleApi(
            id = id,
            name = role.key,
            permissions = role.rolePermissions.mapNotNull { it.id?.permission },
        )
    }

    override fun getRole(name: String): RoleApi {
        val pureName = getPureRole(name)
        val role = checkNotNull(repository.findByKey(pureName))
        return RoleApi(
            id = role.id,
            name = pureName,
            permissions = role.rolePermissions.mapNotNull { it.id?.permission },
        )
    }


}