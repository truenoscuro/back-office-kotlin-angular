package org.nofre.back_office_api.routes.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import java.time.Instant

@Entity
@Table(name = "menus")
class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @Column(name = "title", nullable = false, length = Integer.MAX_VALUE)
    var title: String = ""

    @Column(name = "icon", length = Integer.MAX_VALUE)
    var icon: String? = null

    @NotNull
    @ColumnDefault("99")
    @Column(name = "order_sort", nullable = false)
    var order: Long = 99L

    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_principal", nullable = false)
    var isPrincipal: Boolean = false

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