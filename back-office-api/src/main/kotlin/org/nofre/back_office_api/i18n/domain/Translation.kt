package org.nofre.back_office_api.i18n.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import java.time.Instant

@Entity
@Table(name = "translations")
class Translation {
    @EmbeddedId
    var id: TranslationId? = null

    @MapsId("languageId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "language_id", nullable = false)
    var language: Language? = null

    @MapsId("labelId")
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "label_id", nullable = false)
    var label: Label? = null

    @NotNull
    @Column(name = "value", nullable = false, length = Integer.MAX_VALUE)
    var value: String = ""

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