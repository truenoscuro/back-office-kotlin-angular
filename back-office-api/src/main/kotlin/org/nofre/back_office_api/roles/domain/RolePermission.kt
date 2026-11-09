package org.nofre.back_office_api.roles.domain

import jakarta.persistence.*

@Entity
@Table(name = "role_permissions")
class RolePermission {
    @EmbeddedId
    var id: RolePermissionId? = null


    @MapsId("roleId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "role_id", nullable = false)
    var role: Role? = null


}