package org.nofre.back_office_api.i18n.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

@Entity
@Table(name = "labels")
class Label {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "label_group_id", nullable = false)
    var labelGroup: LabelGroup? = null

    @NotNull
    @Column(name = "key", nullable = false, length = Integer.MAX_VALUE)
    var key: String = ""

    @OneToMany(mappedBy = "label")
    var translations: MutableSet<Translation> = mutableSetOf()

}