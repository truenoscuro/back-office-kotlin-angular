package org.nofre.back_office_api.roles.domain

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.validation.constraints.NotNull
import org.hibernate.Hibernate
import org.nofre.back_office_api.roles.Permissions
import java.io.Serializable
import java.util.*

@Embeddable
class RolePermissionId : Serializable {
    @NotNull
    @Column(name = "role_id", nullable = false)
    var roleId: Long = 0L

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "permission", nullable = false, length = Integer.MAX_VALUE)
    var permission: Permissions = Permissions.ROLE_ANONYMOUS

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false

        other as RolePermissionId

        return roleId == other.roleId &&
                permission == other.permission
    }

    override fun hashCode(): Int = Objects.hash(roleId, permission)

    companion object {
        private const val serialVersionUID = 0L
    }
}