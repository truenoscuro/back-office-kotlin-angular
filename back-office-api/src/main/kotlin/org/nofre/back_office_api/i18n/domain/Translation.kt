package org.nofre.back_office_api.i18n.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.nofre.back_office_api.shared.auditable.Auditable

@Entity
@Table(name = "translations")
class Translation : Auditable() {
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


}