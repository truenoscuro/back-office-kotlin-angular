package org.nofre.back_office_api.i18n.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault
import org.nofre.back_office_api.shared.auditable.Auditable

@Entity
@Table(name = "languages")
class Language : Auditable() {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @Column(name = "locale", nullable = false, length = Integer.MAX_VALUE)
    var locale: String = ""

    @NotNull
    @Column(name = "label_key", nullable = false, length = Integer.MAX_VALUE)
    var labelKey: String = ""

    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_system", nullable = false)
    var isSystem: Boolean = false

    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_default", nullable = false)
    var isDefault: Boolean = false


    @NotNull
    @ColumnDefault("false")
    @Column(name = "is_active", nullable = false)
    var isActive: Boolean = false
}