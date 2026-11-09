package org.nofre.back_office_api.shared.auditable

import jakarta.persistence.Column
import jakarta.persistence.EntityListeners
import jakarta.persistence.MappedSuperclass
import jakarta.validation.constraints.NotNull
import org.springframework.data.annotation.CreatedBy
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedBy
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import java.time.Instant

@MappedSuperclass
@EntityListeners(AuditingEntityListener::class)
class Auditable {
    @NotNull
    @CreatedBy
    @Column(name = "created_by", nullable = false, length = Integer.MAX_VALUE)
    var createdBy: String = ""

    @NotNull
    @CreatedDate
    @Column(name = "created_at", nullable = false)
    var createdAt: Instant = Instant.now()

    @LastModifiedBy
    @Column(name = "updated_by", length = Integer.MAX_VALUE)
    var updatedBy: String? = null

    @LastModifiedDate
    @Column(name = "updated_at")
    var updatedAt: Instant? = null

}