package org.nofre.back_office_api.roles.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import org.nofre.back_office_api.shared.auditable.Auditable

@Entity
@Table(name = "roles")
class Role : Auditable() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @Column(name = "key", nullable = false, length = Integer.MAX_VALUE)
    var key: String = ""

    @NotNull
    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    var description: String = ""

    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = false

    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_system", nullable = false)
    var isSystem: Boolean = false


    @OneToMany(mappedBy = "role", cascade = [CascadeType.ALL], orphanRemoval = true)
    var rolePermissions: MutableSet<RolePermission> = mutableSetOf()


}