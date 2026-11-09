package org.nofre.back_office_api.roles.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "roles")
class Role {
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

    @NotNull
    @Column(name = "created_by", nullable = false, length = Integer.MAX_VALUE)
    var createdBy: String = ""

    @NotNull
    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now()

    @Column(name = "updated_by", length = Integer.MAX_VALUE)
    var updatedBy: String? = null

    @Column(name = "updated_at")
    var updatedAt: Instant? = null

    @OneToMany(mappedBy = "role", cascade = [CascadeType.ALL], orphanRemoval = true)
    var rolePermissions: MutableSet<RolePermission> = mutableSetOf()


}