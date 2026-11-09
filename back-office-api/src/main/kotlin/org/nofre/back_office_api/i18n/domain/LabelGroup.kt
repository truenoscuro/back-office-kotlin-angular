package org.nofre.back_office_api.i18n.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull

@Entity
@Table(name = "label_group")
class LabelGroup {
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

    @OneToMany(mappedBy = "labelGroup")
    var labels: MutableSet<Label> = mutableSetOf()

}