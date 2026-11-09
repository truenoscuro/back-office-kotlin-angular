package org.nofre.back_office_api.auth.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "users")
class User {
    @Id
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @Column(name = "email", nullable = false, length = Integer.MAX_VALUE)
    var email: String = ""

    @NotNull
    @Column(name = "password", nullable = false, length = Integer.MAX_VALUE)
    var password: String = ""

    @NotNull
    @Column(name = "role_id", nullable = false)
    var roleid: Long = 0L

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

}