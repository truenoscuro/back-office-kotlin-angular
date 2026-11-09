package org.nofre.back_office_api.routes.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.Instant

@Entity
@Table(name = "screens")
class Screen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "key", nullable = false, length = Integer.MAX_VALUE)
    var key: ScreenKeys = ScreenKeys.anonymous

    @NotNull
    @Column(name = "tab_bar_title", nullable = false, length = Integer.MAX_VALUE)
    var tabBarTitle: String = ""

    @NotNull
    @Column(name = "title", nullable = false, length = Integer.MAX_VALUE)
    var title: String = ""

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