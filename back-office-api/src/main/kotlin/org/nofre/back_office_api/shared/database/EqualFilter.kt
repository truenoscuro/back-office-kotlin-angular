package org.nofre.back_office_api.shared.database

enum class EqualFilterType {
    equals,
    noEquals
}

data class EqualFilter<T>(
    val type: EqualFilterType = EqualFilterType.equals,
    val values: List<T> = emptyList()
)