package org.nofre.back_office_api.i18n.domain

import jakarta.persistence.Column
import jakarta.persistence.Embeddable
import jakarta.validation.constraints.NotNull
import org.hibernate.Hibernate
import java.io.Serializable
import java.util.*

@Embeddable
class TranslationId : Serializable {
    @NotNull
    @Column(name = "language_id", nullable = false)
    var languageId: Long = 0L

    @NotNull
    @Column(name = "label_id", nullable = false)
    var labelId: Long = 0L

    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (other == null || Hibernate.getClass(this) != Hibernate.getClass(other)) return false

        other as TranslationId

        return languageId == other.languageId &&
                labelId == other.labelId
    }

    override fun hashCode(): Int = Objects.hash(languageId, labelId)

    companion object {
        private const val serialVersionUID = 0L
    }
}