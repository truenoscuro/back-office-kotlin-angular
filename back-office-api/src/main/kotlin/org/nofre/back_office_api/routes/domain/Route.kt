package org.nofre.back_office_api.routes.domain

import jakarta.persistence.*
import jakarta.validation.constraints.NotNull
import org.hibernate.annotations.ColumnDefault

@Entity
@Table(name = "routes")
class Route {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    var id: Long = 0L

    @NotNull
    @Column(name = "description", nullable = false, length = Integer.MAX_VALUE)
    var description: String = ""

    @NotNull
    @Column(name = "role_id", nullable = false)
    var roleId: Long? = null

    @NotNull
    @ColumnDefault("''")
    @Column(name = "path", nullable = false, length = Integer.MAX_VALUE)
    var path: String = ""

    @NotNull
    @Column(name = "breadcrumb_title", nullable = false, length = Integer.MAX_VALUE)
    var breadcrumbTitle: String = ""

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "father_id", nullable = false)
    var father: Route? = null

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "screen_id", nullable = false)
    var screen: Screen? = null

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "menu_id", nullable = false)
    var menu: Menu? = null


    @OneToMany(mappedBy = "father")
    var children: MutableSet<Route> = mutableSetOf()


}